import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Grid,
  Container,
  Divider,
  Fade,
  Zoom,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  useTheme,
  alpha
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Search,
  Clear,
  Add,
  Refresh,
  Commute,
  CheckCircle,
  Cancel,
  Storefront,
  ChevronRight,
  LocationOn,
  DirectionsCar,
  EventSeat,
  LocalGasStation,
  Settings,
  GetApp
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const THEME_COLOR = "#E15B65";
const SECONDARY_COLOR = "#c14a54";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
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
  const theme = useTheme();

  const API_BASE_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || "https://api.bookmyevent.ae/api";
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
  const moduleId = localStorage.getItem("moduleId");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const providerId = userData?._id;

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

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !providerId) {
        setToast({ open: true, message: "Authentication required", severity: "error" });
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/vehicles/provider/${providerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        setVehicles(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to fetch vehicles");
      }
    } catch (error) {
      setError("Error loading vehicles");
    } finally {
      setLoading(false);
    }
  }, [providerId, API_BASE_URL]);

  useEffect(() => {
    fetchOptions();
  }, [moduleId]);

  useEffect(() => {
    if (categories.length > 0 && brands.length > 0) {
      fetchVehicles();
    }
  }, [categories, brands, fetchVehicles]);

  // UI Helpers
  const getCategoryTitle = (categoryData) => {
    if (!categoryData) return "N/A";
    if (typeof categoryData === 'object' && categoryData.title) return categoryData.title;
    if (typeof categoryData === 'string') {
      const cat = categories.find(c => c._id === categoryData);
      return cat ? cat.title : "N/A";
    }
    if (Array.isArray(categoryData) && categoryData.length > 0) {
      const first = categoryData[0];
      if (typeof first === 'object' && first.title) return first.title;
      const found = categories.find(c => c._id === (first._id || first));
      return found ? found.title : "N/A";
    }
    return "N/A";
  };

  const getBrandTitle = (brandData) => {
    if (!brandData) return "N/A";
    if (typeof brandData === 'object' && brandData.title) return brandData.title;
    if (typeof brandData === 'string') {
      const b = brands.find(brand => brand._id === brandData);
      return b ? b.title : "N/A";
    }
    return "N/A";
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const handleImageError = (e) => {
    const currentSrc = e.target.src;
    const urlObj = new URL(currentSrc);
    const path = urlObj.pathname;

    if (path.includes("/uploads/") && !e.target.dataset.triedCapital) {
      e.target.src = currentSrc.replace("/uploads/", "/Uploads/");
      e.target.dataset.triedCapital = "true";
    }
    else if ((path.includes("/Uploads/") || path.includes("/uploads/")) && !e.target.dataset.triedNoUploads) {
      e.target.src = currentSrc.replace(/\/uploads\//i, "/");
      e.target.dataset.triedNoUploads = "true";
    }
    else if (!path.startsWith("/api") && !e.target.dataset.triedApi) {
      const newPath = path.startsWith('/') ? `/api${path}` : `/api/${path}`;
      e.target.src = `${urlObj.origin}${newPath}`;
      e.target.dataset.triedApi = "true";
    }
    else {
      e.target.src = "https://placehold.co/600x400?text=No+Vehicle+Image";
    }
  };

  const handleApplyFilters = () => {
    setFilters({ ...pendingFilters, search: localSearch });
  };

  const handleReset = () => {
    setLocalSearch("");
    setPendingFilters({ category: "", brand: "", type: "" });
    setFilters({ search: "", category: "", brand: "", type: "" });
  };

  const handleStatusToggle = async (vehicleId, field, currentValue) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/vehicles/${vehicleId}`,
        { [field]: !currentValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setVehicles(prev => prev.map(v => v._id === vehicleId ? { ...v, [field]: !currentValue } : v));
        setToast({ open: true, message: "Vehicle status updated", severity: "success" });
      }
    } catch (error) {
      setToast({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  const handleDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/vehicles/${vehicleToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(prev => prev.filter(v => v._id !== vehicleToDelete));
      setToast({ open: true, message: "Vehicle deleted successfully", severity: "success" });
    } catch (error) {
      setToast({ open: true, message: "Failed to delete vehicle", severity: "error" });
    } finally {
      setOpenDeleteDialog(false);
      setVehicleToDelete(null);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      let catId = v.category?._id || v.category;
      if (Array.isArray(v.category) && v.category.length > 0) catId = v.category[0]._id || v.category[0];
      const brandId = v.brand?._id || v.brand;

      const matchesSearch = !filters.search ||
        (v.name || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (v.licensePlateNumber || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (v.model || "").toLowerCase().includes(filters.search.toLowerCase());

      const matchesBrand = !filters.brand || brandId === filters.brand;
      const matchesCategory = !filters.category || catId === filters.category;
      const matchesType = !filters.type || (v.type === filters.type || v.vehicleType === filters.type.toLowerCase() || v.bikeType === filters.type.toLowerCase());

      return matchesSearch && matchesBrand && matchesCategory && matchesType;
    });
  }, [vehicles, filters]);

  const stats = useMemo(() => ({
    total: vehicles.length,
    active: vehicles.filter(v => v.isActive !== false).length,
    inactive: vehicles.filter(v => v.isActive === false).length
  }), [vehicles]);

  const handleExport = () => {
    const headers = ["Sl,Name,Plate,Category,Brand,Seating,Basic Price,Discount,Grand Total,Status"];
    const rows = filteredVehicles.map((v, i) => {
      const basicPrice = v.pricing?.basicPackage?.price || v.pricing?.hourly || v.pricing?.perDay || 0;
      const grandTotal = v.pricing?.grandTotal || basicPrice;
      const seating = v.capacityAndComfort?.seatingCapacity || v.seatingCapacity || "-";
      return `${i + 1},${v.name || ""},${v.licensePlateNumber || ""},${getCategoryTitle(v.category)},${getBrandTitle(v.brand)},${seating},${basicPrice},${v.pricing?.discount?.value || 0}${v.pricing?.discount?.type === 'percentage' ? '%' : ''},${grandTotal},${v.isActive !== false ? "Active" : "Inactive"}`;
    });
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vehicles.csv";
    link.click();
  };

  return (
    <Box sx={{ bgcolor: "#F7FAFC", minHeight: "100vh", pb: 8 }}>
      {/* Premium Hero Header - Fully Responsive */}
      <Box sx={{
        background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #a44c7a 100%)`,
        color: "white",
        pt: { xs: 4, md: 6 },
        pb: { xs: 10, md: 12 },
        px: { xs: 2, md: 4 },
        position: "relative",
        boxShadow: `0 10px 30px ${alpha(THEME_COLOR, 0.3)}`,
      }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 900,
                mb: 1,
                letterSpacing: '-1px',
                color: "white",
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontSize: { xs: '1.75rem', md: '2.125rem' }
              }}>
                <Commute sx={{ fontSize: { xs: 30, md: 36 } }} /> Vehicle Management
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 2 }}>
                {[
                  { label: "Total Vehicles", value: stats.total, icon: <Storefront sx={{ fontSize: 20 }} /> },
                  { label: "Active", value: stats.active, icon: <CheckCircle sx={{ fontSize: 20 }} /> },
                  { label: "Inactive", value: stats.inactive, icon: <Cancel sx={{ fontSize: 20 }} /> }
                ].map((stat, i) => (
                  <Paper key={i} elevation={0} sx={{
                    bgcolor: "rgba(255,255,255,0.12)",
                    px: { xs: 2, md: 3 }, py: 1.5, borderRadius: 3,
                    backdropFilter: "blur(8px)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: 'all 0.3s ease',
                    minWidth: { xs: '120px', md: '150px' }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ color: "white", display: 'flex' }}>{stat.icon}</Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1, color: "white" }}>{stat.value}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.95, color: "white", textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => navigate("/vehicle-setup/leads")}
              sx={{
                bgcolor: "white",
                color: THEME_COLOR,
                fontWeight: 800,
                px: { xs: 3, md: 5 }, py: 2,
                borderRadius: "20px",
                textTransform: "none",
                fontSize: { xs: '0.9rem', md: '1rem' },
                boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                "&:hover": {
                  bgcolor: "#f8f9ff",
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.2)"
                },
                transition: "all 0.3s",
                width: { xs: '100%', md: 'auto' }
              }}
            >
              Add New Vehicle
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -6, position: "relative", zIndex: 1 }}>
        {/* Floating Filter Bar - Responsive Grid */}
        <Paper elevation={10} sx={{ borderRadius: 4, p: { xs: 2, md: 3 }, mb: 4, bgcolor: "white" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                placeholder="Search by name, plate, model..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: THEME_COLOR }} />
                    </InputAdornment>
                  ),
                  endAdornment: localSearch && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => { setLocalSearch(""); setFilters(prev => ({ ...prev, search: "" })); }}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, bgcolor: "#f8fafc" }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={pendingFilters.category}
                  onChange={(e) => setPendingFilters(prev => ({ ...prev, category: e.target.value }))}
                  displayEmpty
                  sx={{ borderRadius: 3, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={pendingFilters.brand}
                  onChange={(e) => setPendingFilters(prev => ({ ...prev, brand: e.target.value }))}
                  displayEmpty
                  sx={{ borderRadius: 3, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>{brand.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={pendingFilters.type}
                  onChange={(e) => setPendingFilters(prev => ({ ...prev, type: e.target.value }))}
                  displayEmpty
                  sx={{ borderRadius: 3, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {["Car", "Bus", "Van", "Bike"].map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                sx={{ borderRadius: 3, py: 1.5, bgcolor: THEME_COLOR, "&:hover": { bgcolor: SECONDARY_COLOR } }}
              >
                Apply
              </Button>
            </Grid>
            <Grid item xs={12} md={6} lg={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleReset}
                sx={{ borderRadius: 3, py: 1.5, color: "#666", borderColor: "#ccc" }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, display: { xs: 'none', lg: 'block' } }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: { xs: 2, lg: 0 } }}>
            <Button startIcon={<GetApp />} size="small" onClick={handleExport} sx={{ color: THEME_COLOR }}>Export CSV</Button>
            <Button startIcon={<Refresh />} size="small" onClick={fetchVehicles} sx={{ color: THEME_COLOR }}>Refresh List</Button>
          </Stack>
        </Paper>

        {/* Vehicle Grid - Fully Responsive */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: THEME_COLOR }} />
          </Box>
        ) : filteredVehicles.length === 0 ? (
          <Fade in={true}>
            <Paper sx={{ textAlign: "center", py: 10, borderRadius: 6, border: "2px dashed #e2e8f0" }}>
              <Commute sx={{ fontSize: 80, color: "#cbd5e0", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#4a5568" }}>No Vehicles Found</Typography>
              <Typography variant="body1" color="text.secondary">Try adjusting your filters or add a new vehicle.</Typography>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {filteredVehicles.map((vehicle, index) => {
              const basePrice = vehicle.pricing?.basicPackage?.price || vehicle.pricing?.hourly || vehicle.pricing?.perDay || 0;
              const grandTotal = vehicle.pricing?.grandTotal || basePrice;
              const seating = vehicle.capacityAndComfort?.seatingCapacity || vehicle.seatingCapacity;
              const fuel = vehicle.engineCharacteristics?.fuelType || vehicle.fuelType;
              const transmission = vehicle.engineCharacteristics?.transmissionType?.value || vehicle.engineCharacteristics?.transmissionType || vehicle.transmissionType;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle._id}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                    <Card sx={{
                      height: "100%",
                      borderRadius: 6,
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: `0 20px 40px ${alpha(THEME_COLOR, 0.1)}`,
                        "& .media-overlay": { opacity: 1 }
                      }
                    }}>
                      <Box sx={{ position: "relative", pt: "66%", bgcolor: "#f7fafc" }}>
                        <CardMedia
                          component="img"
                          image={getImageUrl(vehicle.featuredImage)}
                          alt={vehicle.name}
                          onError={handleImageError}
                          sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />

                        {/* Action Overlay */}
                        <Box className="media-overlay" sx={{
                          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                          bgcolor: alpha(THEME_COLOR, 0.4),
                          display: "flex", alignItems: "center", justifyContent: "center",
                          gap: 2, opacity: 0, transition: "0.3s", backdropFilter: "blur(4px)"
                        }}>
                          <Tooltip title="View Details">
                            <Avatar sx={{ bgcolor: "white", color: THEME_COLOR, cursor: "pointer" }} onClick={() => navigate(`/vehicle-setup/listview/${vehicle._id}`)}>
                              <Visibility />
                            </Avatar>
                          </Tooltip>
                          <Tooltip title="Edit Vehicle">
                            <Avatar sx={{ bgcolor: "white", color: "#2b6cb0", cursor: "pointer" }} onClick={() => navigate(`/vehicle-setup/leads/${vehicle._id}`, { state: { vehicle } })}>
                              <Edit />
                            </Avatar>
                          </Tooltip>
                          <Tooltip title="Delete Permanently">
                            <Avatar sx={{ bgcolor: "white", color: "#c53030", cursor: "pointer" }} onClick={() => { setVehicleToDelete(vehicle._id); setOpenDeleteDialog(true); }}>
                              <Delete />
                            </Avatar>
                          </Tooltip>
                        </Box>

                        <Box sx={{ position: "absolute", top: 15, left: 15 }}>
                          <Chip
                            label={vehicle.isActive !== false ? "ACTIVE" : "INACTIVE"}
                            size="small"
                            sx={{
                              bgcolor: vehicle.isActive !== false ? "#48bb78" : "#a0aec0",
                              color: "white",
                              fontWeight: 900,
                              borderRadius: 2
                            }}
                          />
                        </Box>

                        {vehicle.isNew && (
                          <Box sx={{ position: "absolute", top: 15, right: 15 }}>
                            <Chip label="NEW" size="small" sx={{ bgcolor: "#2b6cb0", color: "white", fontWeight: 900, borderRadius: 2 }} />
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ p: 2.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {vehicle.name || "Unnamed Vehicle"}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: 1.5, fontWeight: 700 }}>
                            {getBrandTitle(vehicle.brand)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: 1.5, fontWeight: 700 }}>
                            {getCategoryTitle(vehicle.category)}
                          </Typography>
                        </Stack>

                        <Grid container spacing={1.5} sx={{ mb: 2 }}>
                          {[
                            { icon: <DirectionsCar />, label: vehicle.model || "N/A" },
                            { icon: <EventSeat />, label: `${seating || "-"} Seats` },
                            { icon: <LocalGasStation />, label: fuel || "N/A" },
                            { icon: <Settings />, label: transmission || "N/A" }
                          ].map((item, i) => (
                            <Grid item xs={6} key={i}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ color: THEME_COLOR, display: 'flex' }}>{React.cloneElement(item.icon, { sx: { fontSize: 16 } })}</Box>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>{item.label}</Typography>
                              </Stack>
                            </Grid>
                          ))}
                        </Grid>

                        <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: "block", lineHeight: 1 }}>STARTING AT</Typography>
                            <Typography variant="h6" sx={{ color: THEME_COLOR, fontWeight: 900 }}>
                              ₹{grandTotal}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            endIcon={<ChevronRight />}
                            onClick={() => navigate(`/vehicle-setup/listview/${vehicle._id}`)}
                            sx={{ textTransform: "none", fontWeight: 800, color: THEME_COLOR, borderRadius: 2 }}
                          >
                            Details
                          </Button>
                        </Box>

                        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#f8fafc", p: 1, borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>AVAILABILITY</Typography>
                          <Switch
                            checked={vehicle.isActive !== false}
                            onChange={() => handleStatusToggle(vehicle._id, "isActive", vehicle.isActive !== false)}
                            size="small"
                            color="success"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, textAlign: "center" }}>Delete Vehicle?</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography color="text.secondary">Are you sure you want to delete this vehicle? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ borderRadius: 3, fontWeight: 700 }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: "#c53030", borderRadius: 3, fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: 4, fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}