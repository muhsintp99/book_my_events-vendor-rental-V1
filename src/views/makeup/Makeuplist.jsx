import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Avatar,
  InputAdornment,
  Skeleton,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  FormControlLabel,
  Checkbox,
  Menu,
  Fade,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  Add,
  Download,
  Close,
  Category,
  AttachMoney,
  Palette,
  Schedule,
  Info,
  Image as ImageIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { Alert, AlertTitle } from "@mui/material";

const API_BASE_URL = "https://api.bookmyevent.ae/api/makeup-packages";

export default function MakeupList() {
  const [makeupList, setMakeupList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const [filters, setFilters] = useState({ search: "", category: "" });
  const [pendingSearch, setPendingSearch] = useState("");

  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedMakeup, setSelectedMakeup] = useState(null);
  const [makeupToDelete, setMakeupToDelete] = useState(null);

  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const providerId = userData?._id;

  const getImageUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://api.bookmyevent.ae/${cleanPath}`;
  };

  const ImageAvatar = ({ src, alt, title }) => {
    const [error, setError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    if (!src || error) {
      return (
        <Avatar
          variant="rounded"
          sx={{
            width: 70,
            height: 70,
            bgcolor: "#E15B65",
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {title?.[0]?.toUpperCase() || "M"}
        </Avatar>
      );
    }

    return (
      <Box sx={{ position: "relative" }}>
        {imgLoading && <Skeleton variant="rectangular" width={70} height={70} sx={{ borderRadius: 2 }} />}
        <Avatar
          variant="rounded"
          src={src}
          alt={alt}
          sx={{ width: 70, height: 70, borderRadius: 2, display: imgLoading ? "none" : "block" }}
          imgProps={{
            onLoad: () => setImgLoading(false),
            onError: () => {
              setError(true);
              setImgLoading(false);
            },
          }}
        />
      </Box>
    );
  };

  const fetchMakeup = useCallback(async () => {
    if (!providerId || !token) {
      setToast({ open: true, message: "Please login again", severity: "error" });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/provider/${providerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to load packages");

      const result = await res.json();
      if (result.success) {
        setMakeupList(result.data || []);
      }
    } catch (err) {
      setToast({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => {
    fetchMakeup();
  }, [fetchMakeup]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: pendingSearch }));
    }, 400);
    return () => clearTimeout(timer);
  }, [pendingSearch]);

  const handleView = (makeup) => {
    setSelectedMakeup(makeup);
    setOpenView(true);
  };

  const handleEditOpen = (makeup) => {
    setSelectedMakeup(makeup);
    setEditForm({ ...makeup });
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${selectedMakeup._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (data.success) {
        setMakeupList((prev) =>
          prev.map((m) => (m._id === selectedMakeup._id ? data.data : m))
        );
        setToast({ open: true, message: "Package updated successfully", severity: "success" });
        setOpenEdit(false);
      } else {
        setToast({ open: true, message: data.message || "Update failed", severity: "error" });
      }
    } catch (err) {
      setToast({ open: true, message: "Something went wrong", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/toggle-active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMakeupList((prev) =>
          prev.map((m) => (m._id === id ? { ...m, isActive: !current } : m))
        );
        setToast({ open: true, message: "Status updated", severity: "success" });
      }
    } catch {
      setToast({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${makeupToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMakeupList((prev) => prev.filter((m) => m._id !== makeupToDelete));
        setToast({ open: true, message: "Package deleted", severity: "success" });
      }
    } catch {
      setToast({ open: true, message: "Delete failed", severity: "error" });
    } finally {
      setOpenConfirm(false);
      setMakeupToDelete(null);
    }
  };

  const filteredMakeups = useMemo(() => {
    return makeupList.filter((m) => {
      const matchesSearch =
        !filters.search ||
        m.packageTitle?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory =
        !filters.category || m.categories?.some((c) => c._id === filters.category);
      return matchesSearch && matchesCategory;
    });
  }, [makeupList, filters]);

  const categories = useMemo(() => {
    const map = new Map();
    makeupList.forEach((m) => m.categories?.forEach((c) => map.set(c._id, c)));
    return Array.from(map.values());
  }, [makeupList]);

  const handleExport = () => {
    const headers = ["No", "Title", "Categories", "Type", "Base Price", "Final Price", "Status"];
    const rows = filteredMakeups.map((m, i) => [
      i + 1,
      m.packageTitle || "",
      m.categories?.map((c) => c.title).join(" | ") || "",
      m.makeupType || "",
      m.basePrice || 0,
      m.finalPrice || 0,
      m.isActive ? "Active" : "Inactive",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `makeup_packages_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 3 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            My Makeup Packages ({makeupList.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ bgcolor: "#E15B65", "&:hover": { bgcolor: "#c14a54" } }}
            onClick={() => window.location.href = "/makeup/new"}
          >
            Add New Package
          </Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search packages..."
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            }}
            sx={{ width: { xs: "100%", sm: 300 } }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              displayEmpty
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ ml: "auto", gap: 1, display: "flex" }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchMakeup}>
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>
              Export CSV
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ mt: 3 }}>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell>#</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredMakeups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      {makeupList.length === 0
                        ? "No packages created yet"
                        : "No packages match your search"}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, bgcolor: "#E15B65" }}
                      onClick={() => window.location.href = "/makeup/new"}
                    >
                      Create Your First Package
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {filteredMakeups.map((m, i) => (
                <TableRow key={m._id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <ImageAvatar
                      src={getImageUrl(m.gallery?.[0])}
                      alt={m.packageTitle}
                      title={m.packageTitle}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{m.packageTitle}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {m.categories?.map((c) => (
                        <Chip
                          key={c._id}
                          label={c.title}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{m.makeupType || "-"}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold" color="primary">
                      AED {m.finalPrice?.toLocaleString()}
                    </Typography>
                    {m.basePrice > m.finalPrice && (
                      <Typography variant="caption" color="text.secondary">
                        <del>AED {m.basePrice}</del>
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={m.isActive}
                      onChange={() => handleToggleStatus(m._id, m.isActive)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleView(m)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Package">
                        <IconButton size="small" color="primary" onClick={() => handleEditOpen(m)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setMakeupToDelete(m._id);
                            setOpenConfirm(true);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Details Modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "#E15B65", color: "white" }}>
          <Typography variant="h6">{selectedMakeup?.packageTitle}</Typography>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
            onClick={() => setOpenView(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedMakeup && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                {selectedMakeup.gallery?.[0] ? (
                  <Card elevation={3}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(selectedMakeup.gallery[0])}
                      alt={selectedMakeup.packageTitle}
                      sx={{ objectFit: "cover" }}
                    />
                  </Card>
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      bgcolor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 80, color: "#aaa" }} />
                  </Box>
                )}
                {selectedMakeup.gallery?.length > 1 && (
                  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {selectedMakeup.gallery.slice(1, 5).map((img, i) => (
                      <Avatar
                        key={i}
                        variant="rounded"
                        src={getImageUrl(img)}
                        sx={{ width: 60, height: 60 }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={7}>
                <List>
                  <ListItem>
                    <ListItemIcon><Category /></ListItemIcon>
                    <ListItemText primary="Categories" secondary={selectedMakeup.categories?.map(c => c.title).join(", ") || "None"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Palette /></ListItemIcon>
                    <ListItemText primary="Makeup Type" secondary={selectedMakeup.makeupType || "Not specified"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AttachMoney /></ListItemIcon>
                    <ListItemText
                      primary="Pricing"
                      secondary={
                        <>
                          <strong>AED {selectedMakeup.finalPrice?.toLocaleString()}</strong>
                          {selectedMakeup.basePrice > selectedMakeup.finalPrice && (
                            <span style={{ marginLeft: 8 }}>
                              <del>AED {selectedMakeup.basePrice}</del> (Offer)
                            </span>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Schedule /></ListItemIcon>
                    <ListItemText primary="Duration" secondary={selectedMakeup.duration || "Not specified"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color={selectedMakeup.isActive ? "success" : "disabled"} /></ListItemIcon>
                    <ListItemText primary="Status" secondary={selectedMakeup.isActive ? "Active" : "Inactive"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info /></ListItemIcon>
                    <ListItemText primary="Description" secondary={selectedMakeup.description || "No description provided"} />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(selectedMakeup.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenView(false); handleEditOpen(selectedMakeup); }}>
            Edit Package
          </Button>
          <Button variant="contained" color="primary" onClick={() => setOpenView(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Package</DialogTitle>
        <IconButton
          sx={{ position: "absolute", right: 8, top: 8 }}
          onClick={() => setOpenEdit(false)}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Package Title"
                value={editForm.packageTitle || ""}
                onChange={(e) => setEditForm({ ...editForm, packageTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Base Price (AED)"
                type="number"
                value={editForm.basePrice || ""}
                onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Final Price (AED)"
                type="number"
                value={editForm.finalPrice || ""}
                onChange={(e) => setEditForm({ ...editForm, finalPrice: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration"
                value={editForm.duration || ""}
                onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editForm.isActive || false}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  />
                }
                label="Active (Visible to customers)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Package?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This package will be permanently deleted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}