import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Snackbar,
  Alert,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

/* ---------------------------------- STYLES ---------------------------------- */

const StyledCard = styled(Card)(({ theme }) => ({
  width: 280,
  cursor: "pointer",
  transition: "0.2s ease-in-out",
  position: "relative",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const ActionOverlay = styled(Box)({
  position: "absolute",
  top: 8,
  right: 8,
  display: "flex",
  gap: 1,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "50%",
  padding: "4px",
  opacity: 0,
  transition: "opacity 0.2s",
});

const AddCard = styled(Box)(({ theme }) => ({
  width: 280,
  height: 300,
  border: "2px dashed #E15B65",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

/* ---------------------------------- HELPERS ---------------------------------- */

const API_BASE_URL = "https://api.bookmyevent.ae";

const getProviderId = () => {
  try {
    const str = localStorage.getItem("user");
    if (!str) return null;
    const user = JSON.parse(str);
    return user?._id || null;
  } catch (e) {
    console.error("Provider parse error", e);
    return null;
  }
};

const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg";

  let p = String(path).replace(/^uploads/i, "/uploads");
  if (!p.startsWith("/")) p = "/" + p;

  return `${API_BASE_URL}${p}`;
};

/* ------------------------------- MAIN COMPONENT ------------------------------ */

const CateringPackagesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("list");
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  /* --------------------------- FETCH PACKAGES --------------------------- */

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);

    const providerId = getProviderId();
    if (!providerId) {
      setLoading(false);
      setToastMessage("Provider ID missing");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setToastMessage("Token missing. Please login.");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/catering/provider/${providerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setPackages(json.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setToastMessage("Failed to load packages");
      setToastSeverity("error");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------- ACTIONS ------------------------------- */

  const handlePackageClick = (pkg) => {
    setCurrentPackage(pkg);
    setViewMode("preview");
  };

  const handleEdit = (pkg) => {
    navigate("/catering/addpackage", { state: { editPackage: pkg } });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedPackageId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToastMessage("Missing token");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/catering/${selectedPackageId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setToastMessage("Package deleted successfully");
      setToastSeverity("success");
      setOpenToast(true);

      fetchPackages();
      setViewMode("list");
      setCurrentPackage(null);
    } catch (err) {
      console.error("Delete error:", err);
      setToastMessage("Failed to delete package");
      setToastSeverity("error");
      setOpenToast(true);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleCloseToast = () => setOpenToast(false);

  /* ------------------------------- LOADING ------------------------------- */

  if (loading && viewMode === "list") {
    return (
      <Box
        sx={{
          p: 3,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Loading packages...</Typography>
      </Box>
    );
  }

  /* ------------------------------- PREVIEW ------------------------------- */

  if (viewMode === "preview" && currentPackage) {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: "100vh" }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            boxShadow: theme.shadows[1],
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={() => setViewMode("list")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ ml: 2 }}>
              Package Preview
            </Typography>
          </Box>

          <img
            src={getImageUrl(currentPackage.thumbnail)}
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            {currentPackage.title}
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {currentPackage.subtitle}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {currentPackage.description}
          </Typography>

          <Typography variant="h6">Includes</Typography>

          {(currentPackage.includes || []).map((inc, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{inc.title}</Typography>
              <ul>
                {inc.items.map((item, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ))}

          <Box sx={{ textAlign: "center", my: 3 }}>
            <Typography variant="h6">Starting Price</Typography>
            <Typography variant="h4" color="primary">
              ₹{currentPackage.price} Per Head
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Gallery
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {(currentPackage.images || []).map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ))}
          </Stack>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleEdit(currentPackage)}
            >
              Edit Package
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenDeleteDialog(currentPackage._id)}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Snackbar open={openToast} onClose={handleCloseToast} autoHideDuration={3000}>
          <Alert severity={toastSeverity}>{toastMessage}</Alert>
        </Snackbar>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete Package?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. Continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  /* ------------------------------- LIST VIEW ------------------------------- */

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: "100vh" }}>
      <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 2, boxShadow: theme.shadows[1] }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Catering Packages
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
          {packages.map((pkg) => (
            <StyledCard
              key={pkg._id}
              onClick={() => handlePackageClick(pkg)}
              onMouseEnter={(e) =>
                e.currentTarget.querySelector(".action-overlay").style.setProperty("opacity", "1")
              }
              onMouseLeave={(e) =>
                e.currentTarget.querySelector(".action-overlay").style.setProperty("opacity", "0")
              }
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(pkg.thumbnail)}
                />

                <ActionOverlay className="action-overlay">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(pkg);
                    }}
                  >
                    <EditIcon fontSize="small" color="primary" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDeleteDialog(pkg._id);
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </ActionOverlay>
              </Box>

              <CardContent>
                <Typography variant="h6">{pkg.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {pkg.subtitle}
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{pkg.price} Per Head
                </Typography>
              </CardContent>
            </StyledCard>
          ))}

          <AddCard onClick={() => navigate("/catering/addpackage")}>
            <AddIcon sx={{ fontSize: 48, color: "#E15B65" }} />
            <Typography variant="h6" color="#E15B65">
              Add New Package
            </Typography>
          </AddCard>
        </Box>

        <Snackbar open={openToast} autoHideDuration={3000} onClose={handleCloseToast}>
          <Alert severity={toastSeverity}>{toastMessage}</Alert>
        </Snackbar>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete Package?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. Continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CateringPackagesList;
