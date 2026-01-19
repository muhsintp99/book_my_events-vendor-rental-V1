import React, { useState, useEffect } from "react";
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
  Alert,
  Snackbar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, Edit, Delete, Search, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    type: ""
  });

  const [pendingFilters, setPendingFilters] = useState({
    category: "",
    brand: "",
    type: ""
  });

  const [localSearch, setLocalSearch] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || "https://api.bookmyevent.ae/api";
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
  console.log("Debug - API_BASE_URL:", API_BASE_URL);
  console.log("Debug - BASE_URL:", BASE_URL);
  const moduleId = localStorage.getItem("moduleId");
  const providerId = localStorage.getItem("providerId");

  // Fetch options for filters
  const fetchOptions = async () => {
    try {
      if (!moduleId) return;
      const token = localStorage.getItem("token");
      const [brandsRes, catsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/brands/module/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/vehicle-categories`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }),
      ]);

      setBrands(Array.isArray(brandsRes.data) ? brandsRes.data : []);

      let cats = [];
      if (catsRes.data.success && Array.isArray(catsRes.data.data)) {
        cats = catsRes.data.data
          .filter((cat) => cat.module?._id === moduleId)
          .map((cat) => ({ _id: cat._id, title: cat.title }));
      }
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  };

  // Helper function to get category title - handles single object or ID
  const getCategoryTitle = (categoryData) => {
    if (!categoryData) return "N/A";

    // If it's an object with title
    if (typeof categoryData === 'object' && categoryData.title) {
      return categoryData.title;
    }

    // If it's a string ID
    if (typeof categoryData === 'string') {
      const category = categories.find(cat => cat._id === categoryData);
      return category ? category.title : "N/A";
    }

    // Handle array for backward compatibility
    if (Array.isArray(categoryData) && categoryData.length > 0) {
      const first = categoryData[0];
      if (typeof first === 'object' && first.title) return first.title;
      const found = categories.find(cat => cat._id === (first._id || first));
      return found ? found.title : "N/A";
    }

    return "N/A";
  };

  // Helper function to get brand title by ID
  const getBrandTitle = (brandData) => {
    if (!brandData) return "N/A";

    // If it's an object with title
    if (typeof brandData === 'object' && brandData.title) {
      return brandData.title;
    }

    // If it's a string ID
    if (typeof brandData === 'string') {
      const brand = brands.find(b => b._id === brandData);
      return brand ? brand.title : "N/A";
    }

    return "N/A";
  };

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/100x100?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const handleImageError = (e) => {
    const currentSrc = e.target.src;
    const urlObj = new URL(currentSrc);
    const path = urlObj.pathname;

    // Advanced Fallback Logic
    if (path.includes("/uploads/") && !e.target.dataset.triedCapital) {
      console.log("Retrying with capital 'Uploads':", currentSrc);
      e.target.src = currentSrc.replace("/uploads/", "/Uploads/");
      e.target.dataset.triedCapital = "true";
    }
    else if (path.includes("/Uploads/") && !e.target.dataset.triedNoUploads) {
      console.log("Retrying without 'Uploads/' prefix:", currentSrc);
      e.target.src = currentSrc.replace("/Uploads/", "/");
      e.target.dataset.triedNoUploads = "true";
    }
    else if (path.includes("/uploads/") && !e.target.dataset.triedNoUploads) {
      console.log("Retrying without 'uploads/' prefix:", currentSrc);
      e.target.src = currentSrc.replace("/uploads/", "/");
      e.target.dataset.triedNoUploads = "true";
    }
    else if (!path.startsWith("/api") && !e.target.dataset.triedApi) {
      console.log("Retrying with '/api' prefix:", currentSrc);
      // Construct /api/pathname
      const newPath = path.startsWith('/') ? `/api${path}` : `/api/${path}`;
      e.target.src = `${urlObj.origin}${newPath}`;
      e.target.dataset.triedApi = "true";
    }
    else {
      console.error("All image fallbacks failed for:", currentSrc);
      // Use a more generic placeholder but keep it nice
      e.target.src = "https://placehold.co/600x400?text=No+Image+Found";
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const providerId = userData?._id;

      if (!token || !providerId) {
        console.error("Provider ID or token missing");
        setToastMessage("Provider authentication missing. Please log in again.");
        setToastSeverity("error");
        setOpenToast(true);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/vehicles/provider/${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        console.log("Fetched vehicles:", res.data.data);
        console.log("Available categories:", categories);
        console.log("Available brands:", brands);

        // Log the first vehicle to see its structure
        console.log("All vehicles data:", res.data.data);
        if (res.data.data && res.data.data.length > 0) {
          console.log("First vehicle structure:", res.data.data[0]);
          console.log("First vehicle category:", res.data.data[0].category);
          console.log("First vehicle brand:", res.data.data[0].brand);
          console.log("First vehicle featuredImage URL:", getImageUrl(res.data.data[0].featuredImage));
        }

        setVehicles(res.data.data || []);
      } else {
        console.error("Error fetching vehicles:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setToastMessage("Failed to load vehicles ");
      setToastSeverity("error");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && brands.length > 0) {
      fetchVehicles();
    }
  }, [categories, brands]);





  const handleApplyFilters = () => {
    setFilters({
      ...pendingFilters,
      search: localSearch,
    });
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: localSearch }));
  };

  const handleClear = () => {
    setLocalSearch("");
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  const handleReset = () => {
    setLocalSearch("");
    setPendingFilters({
      category: "",
      brand: "",
      type: ""
    });
    setFilters({
      search: "",
      category: "",
      brand: "",
      type: ""
    });
  };

  const confirmDelete = (vehicleId) => {
    setVehicleToDelete(vehicleId);
    setOpenDeleteDialog(true);
  };

  const handleExport = () => {
    const headers = [
      "Sl,Name,Plate,Category,Brand,Seating,Basic Price,Discount,Grand Total,Active",
    ];
    const rows = filteredVehicles.map((v, i) => {
      const basicPrice = v.pricing?.basicPackage?.price || v.pricing?.hourly || v.pricing?.perDay || 0;
      const grandTotal = v.pricing?.grandTotal || basicPrice;
      const seating = v.capacityAndComfort?.seatingCapacity || v.seatingCapacity || "-";

      return `${i + 1},${v.name || ""},${v.licensePlateNumber || ""},${getCategoryTitle(v.category)},${getBrandTitle(v.brand)},${seating},${basicPrice},${v.pricing?.discount?.value || 0}${v.pricing?.discount?.type === 'percentage' ? '%' : ''},${grandTotal},${v.isActive ? "Active" : "Inactive"}`;
    });
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vehicles.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStatusToggle = async (vehicleId, field, currentValue) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE_URL}/vehicles/${vehicleId}`,
        { [field]: !currentValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setVehicles((prev) =>
          prev.map((v) =>
            v._id === vehicleId ? { ...v, [field]: !currentValue } : v
          )
        );
        setToastMessage("Vehicle status updated successfully ");
        setToastSeverity("success");
      } else {
        setToastMessage("Failed to update vehicle status ");
        setToastSeverity("error");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      setToastMessage(error.response?.data?.message || "Error updating vehicle");
      setToastSeverity("error");
    } finally {
      setOpenToast(true);
    }
  };

  const handleDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE_URL}/vehicles/${vehicleToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleToDelete));

      setToastMessage("Vehicle deleted successfully");
      setToastSeverity("success");
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to delete vehicle");
      setToastSeverity("error");
    } finally {
      setOpenToast(true);
      setOpenDeleteDialog(false);
      setVehicleToDelete(null);
    }
  };

  const handleEdit = (vehicle) => {
    navigate(`/vehicle-setup/leads/${vehicle._id}`, { state: { vehicle } });
  };

  const filteredVehicles = vehicles.filter((v) => {
    // Extract category ID - handle array format
    let vehicleCategoryId = v.category?._id || v.category;
    if (Array.isArray(v.category) && v.category.length > 0) {
      vehicleCategoryId = v.category[0]._id || v.category[0];
    }

    const vehicleBrandId = v.brand?._id || v.brand;

    return (
      (filters.brand ? vehicleBrandId === filters.brand : true) &&
      (filters.category ? vehicleCategoryId === filters.category : true) &&
      (filters.type ? (v.type === filters.type || v.vehicleType === filters.type.toLowerCase() || v.bikeType === filters.type.toLowerCase()) : true) &&
      (filters.search
        ? (v.name || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (v.licensePlateNumber || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (v.model || "").toLowerCase().includes(filters.search.toLowerCase())
        : true)
    );
  });

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenToast(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "#fafafa",
          minHeight: "100vh",
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
            VEHICLES
          </Typography>
        </Toolbar>
      </AppBar>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Filters Section */}
      <Paper sx={{ p: 2, mt: 2, borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.category}
              onChange={(e) => setPendingFilters({ ...pendingFilters, category: e.target.value })}
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.brand}
              onChange={(e) => setPendingFilters({ ...pendingFilters, brand: e.target.value })}
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="">All Brands</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.type}
              onChange={(e) => setPendingFilters({ ...pendingFilters, type: e.target.value })}
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Car">Car</MenuItem>
              <MenuItem value="Bus">Bus</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Bike">Bike</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleApplyFilters}
            sx={{
              bgcolor: "#E15B65",
              "&:hover": { bgcolor: "#d14b55" },
              borderRadius: "8px",
              px: 3
            }}
          >
            Filter
          </Button>

          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              color: "#666",
              borderColor: "#ccc",
              "&:hover": { borderColor: "#999", bgcolor: "#f5f5f5" },
              borderRadius: "8px"
            }}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2} mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Total Vehicles{" "}
            <Chip label={filteredVehicles.length} color="success" size="small" sx={{ ml: 1 }} />
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search by vehicle name"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSearch}
                      size="small"
                      disabled={!localSearch}
                      sx={{ color: localSearch ? "inherit" : "action" }}
                    >
                      <Search fontSize="small" />
                    </IconButton>
                    {localSearch && (
                      <IconButton onClick={handleClear} size="small">
                        <Clear fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" color="#E15B65" sx={{ color: '#E15B65', borderRadius: "8px" }} onClick={handleExport}>
              Export
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#E15B65" }}
              onClick={() => navigate("/vehicle-setup/leads")}
            >
              New Vehicle
            </Button>
          </Stack>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell>Sl</TableCell>
                <TableCell>Vehicle Info</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Trip Fare</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredVehicles.map((v, i) => {
                const basePrice = v.pricing?.basicPackage?.price || v.pricing?.hourly || v.pricing?.perDay || v.pricing?.distanceWise;
                const grandTotal = v.pricing?.grandTotal;
                const seating = v.capacityAndComfort?.seatingCapacity || v.seatingCapacity;
                const fuel = v.engineCharacteristics?.fuelType || v.fuelType;
                const transmission = v.engineCharacteristics?.transmissionType?.value || v.engineCharacteristics?.transmissionType || v.transmissionType;

                return (
                  <TableRow key={v._id} sx={{ '&:hover': { bgcolor: '#fbfbfb' } }}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          component="img"
                          src={getImageUrl(v.featuredImage)}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            objectFit: "cover",
                            border: "1px solid #eee"
                          }}
                          onLoad={(e) => console.log("Successfully loaded image:", e.target.src)}
                          onError={handleImageError}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#2563eb" }}>
                            {v.name || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Plate: {v.licensePlateNumber || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Model: {v.model || "N/A"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={getCategoryTitle(v.category)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{getBrandTitle(v.brand)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {v.type || v.vehicleType || v.bikeType || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {grandTotal ? (
                        <>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#E15B65" }}>
                            ₹{grandTotal}
                          </Typography>
                          {basePrice && basePrice !== grandTotal && (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                              ₹{basePrice}
                            </Typography>
                          )}
                        </>
                      ) : basePrice ? (
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          ₹{basePrice}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No pricing
                        </Typography>
                      )}

                      {v.pricing?.basicPackage?.includedHours && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {v.pricing.basicPackage.includedHours} Hrs / {v.pricing.basicPackage.includedKilometers} KM
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          🪑 <strong>Seats:</strong> {seating || "N/A"}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          ⛽ <strong>Fuel:</strong> {fuel || "N/A"}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          ⚙️ <strong>Trans:</strong> {transmission || "N/A"}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {(v.engineCharacteristics?.airConditioning !== undefined || v.availability?.acAvailable !== undefined || v.airCondition !== undefined) && (
                            <Chip
                              label={(v.engineCharacteristics?.airConditioning || v.availability?.acAvailable || v.airCondition) ? "AC" : "Non-AC"}
                              size="small"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={1} alignItems="center">
                        <Switch
                          checked={v.isActive !== false}
                          onChange={() => handleStatusToggle(v._id, "isActive", v.isActive !== false)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#E15B65',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#E15B65',
                            },
                          }}
                        />
                        {v.isNew && <Chip label="New" color="success" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          sx={{ border: "1px solid #eee", color: "#2563eb", borderRadius: "8px", bgcolor: '#fff' }}
                          onClick={() => navigate(`/vehicle-setup/listview/${v._id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ border: "1px solid #eee", color: "#065f46", borderRadius: "8px", bgcolor: '#fff' }}
                          onClick={() => handleEdit(v)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ border: "1px solid #eee", color: "#dc2626", borderRadius: "8px", bgcolor: '#fff' }}
                          onClick={() => confirmDelete(v._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredVehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {vehicles.length === 0
                      ? "No vehicles found. Add your first vehicle!"
                      : "No vehicles match the current filters"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this vehicle? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{
            backgroundColor: toastSeverity === "success" ? "#1976d2" : "#d32f2f",
            color: "white",
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}