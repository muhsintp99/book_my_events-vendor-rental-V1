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
<<<<<<< HEAD
} from "@mui/material";
import { Visibility, Edit, Delete, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    type: "",
    search: "",
=======
  useTheme,
} from "@mui/material";
import { 
  Visibility, 
  Edit, 
  Delete, 
  Search, 
  ToggleOn as ToggleOnIcon, 
  ToggleOff as ToggleOffIcon 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Venues() {
  const theme = useTheme();
  const navigate = useNavigate();

  // API Configuration
  const API_BASE_URL = "http://localhost:5000/api"; // Replace with your production URL

  // State Management
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  // Filters
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    rentalType: "",
    search: "",
    isActive: "",
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
  });
  const [pendingFilters, setPendingFilters] = useState({
    brand: "",
    category: "",
<<<<<<< HEAD
    type: "",
    search: "",
  });
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.bookmyevent.ae/api";

  // Fetch vehicles data
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles(response.data.data || []);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch vehicles");
      console.error("Error fetching vehicles:", error);
=======
    rentalType: "",
    search: "",
    isActive: "",
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Extract unique values for filters
  const getUniqueBrands = () => {
    return [...new Set(venues.map((v) => v.provider?.storeName || "Unknown"))];
  };

  const getUniqueCategories = () => {
    return [...new Set(venues.map((v) => v.seatingArrangement || "Unknown"))];
  };

  const getUniqueRentalTypes = () => {
    return [...new Set(venues.map((v) => v.rentalType || "Unknown"))];
  };

  // Fetch venues from API
  const fetchVenues = async (page = 1, appliedFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.itemsPerPage.toString(),
      });

      // Add filters
      if (appliedFilters.search) {
        params.append("search", appliedFilters.search);
      }
      if (appliedFilters.isActive !== "") {
        params.append("isActive", appliedFilters.isActive);
      }
      if (appliedFilters.rentalType) {
        params.append("rentalType", appliedFilters.rentalType);
      }

      const response = await fetch(`${API_BASE_URL}/createvenue?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setVenues(data.data.venues || []);
        setPagination({
          currentPage: data.pagination.currentPage || 1,
          totalPages: data.pagination.totalPages || 1,
          totalItems: data.pagination.totalItems || 0,
          itemsPerPage: data.pagination.itemsPerPage || 10,
        });
      } else {
        throw new Error(data.message || "Failed to fetch venues");
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError(err.message);
      setToastMessage("Error fetching venues: " + err.message);
      setToastSeverity("error");
      setOpenToast(true);
      
      // Fallback to mock data if API fails
      setVenues([
        {
          _id: "1",
          venueName: "Sample Venue 1",
          venueAddress: "123 Main St, City",
          provider: { storeName: "City Events Co" },
          seatingArrangement: "Theater",
          rentalType: "hourly",
          hourlyPrice: 50,
          maxGuestsSeated: 200,
          isActive: true,
          facilities: {
            parkingAvailability: true,
            foodCateringAvailability: false,
            stageLightingAudio: true,
            wheelchairAccessibility: true,
            securityArrangements: false,
            wifiAvailability: true,
          },
          searchTags: ["event", "conference"],
          images: [],
          totalBookings: 5,
        },
        {
          _id: "2",
          venueName: "Sample Venue 2",
          venueAddress: "456 Oak St, City",
          provider: { storeName: "Elite Venues" },
          seatingArrangement: "Banquet",
          rentalType: "perDay",
          perDayPrice: 500,
          maxGuestsSeated: 300,
          isActive: false,
          facilities: {
            parkingAvailability: true,
            foodCateringAvailability: true,
            stageLightingAudio: false,
            wheelchairAccessibility: true,
            securityArrangements: true,
            wifiAvailability: false,
          },
          searchTags: ["wedding", "party"],
          images: [],
          totalBookings: 12,
        },
      ]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 10,
      });
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Initial data load
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(pendingFilters);
  };

  // Reset filters
  const handleReset = () => {
    setFilters({ brand: "", category: "", type: "", search: "" });
    setPendingFilters({ brand: "", category: "", type: "", search: "" });
  };

  // Export CSV
  const handleExport = () => {
    const headers = [
      "Sl,Name,Code,Category,Brand,Type,Total Trip,Hourly,Distance,Daily,New,Active",
    ];
    const rows = filteredVehicles.map(
      (v, i) =>
        `${i + 1},${v.name || ""},${v.vinNumber || ""},${v.category?.title || ""},${
          v.brand?.title || ""
        },${v.type || ""},${v.totalTrips || 0},${v.pricing?.hourly || "-"},${
          v.pricing?.distance || "-"
        },${v.pricing?.perDay || "-"},${v.isNew ? "Yes" : "No"},${
          v.isActive ? "Active" : "Inactive"
        }`
    );
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

  // Handle status toggle
  const handleStatusToggle = async (vehicleId, field, currentValue) => {
    try {
      const endpoint =
        field === "isActive"
          ? currentValue
            ? "block"
            : "reactivate"
          : "toggle-new-tag";
      await axios.patch(
        `${API_BASE_URL}/vehicles/${vehicleId}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === vehicleId ? { ...v, [field]: !currentValue } : v
        )
      );
      setToastMessage(
        `Vehicle ${field === "isActive" ? "status" : "new tag"} updated successfully`
      );
      setToastSeverity("success");
      setOpenToast(true);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to update vehicle"
      );
=======
  // Initial load
  useEffect(() => {
    fetchVenues(1, filters);
  }, []);

  // Filter handlers
  const handleApplyFilters = () => {
    setFilters(pendingFilters);
    fetchVenues(1, pendingFilters);
  };

  const handleReset = () => {
    const resetFilters = { brand: "", category: "", rentalType: "", search: "", isActive: "" };
    setFilters(resetFilters);
    setPendingFilters(resetFilters);
    fetchVenues(1, resetFilters);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchVenues(newPage, filters);
  };

  // Export functionality
  const handleExport = () => {
    const headers = [
      "Sl,Venue Name,Address,Provider,Seating Arrangement,Rental Type,Price,Capacity,Status,Total Bookings,Tags",
    ];
    const rows = venues.map((v, i) => {
      const price = v.rentalType === "hourly" ? `${v.hourlyPrice}/hr` :
                   v.rentalType === "perDay" ? `${v.perDayPrice}/day` :
                   v.rentalType === "distanceWise" ? `${v.distanceWisePrice}/km` : "N/A";
      return `${i + 1},"${v.venueName}","${v.venueAddress}","${v.provider?.storeName || 'N/A'}","${v.seatingArrangement || 'N/A'}","${v.rentalType || 'N/A'}","${price}","${v.maxGuestsSeated || 'N/A'}","${v.isActive ? 'Active' : 'Inactive'}","${v.totalBookings || 0}","${(v.searchTags || []).join(', ')}"`;
    });
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `venues-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Action handlers
  const handleToggleStatus = async (venueId) => {
    try {
      const venue = venues.find(v => v._id === venueId);
      if (!venue) return;

      const response = await fetch(`${API_BASE_URL}/createvenue/${venueId}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !venue.isActive }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setVenues(prevVenues =>
          prevVenues.map(v =>
            v._id === venueId ? { ...v, isActive: !v.isActive } : v
          )
        );
        
        setToastMessage(`Venue ${data.data.venue.isActive ? "activated" : "deactivated"} successfully`);
        setToastSeverity("success");
        setOpenToast(true);
      } else {
        throw new Error(data.message || "Failed to toggle status");
      }
    } catch (err) {
      console.error("Error toggling venue status:", err);
      setToastMessage("Error toggling venue status: " + err.message);
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

<<<<<<< HEAD
  // Handle vehicle deletion
  const handleDelete = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await axios.delete(`${API_BASE_URL}/vehicles/${vehicleId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
        setToastMessage("Vehicle deleted successfully");
        setToastSeverity("success");
        setOpenToast(true);
      } catch (error) {
        setToastMessage(
          error.response?.data?.message || "Failed to delete vehicle"
        );
        setToastSeverity("error");
        setOpenToast(true);
      }
    }
  };

  // Filtering logic
  const filteredVehicles = vehicles.filter((v) => {
    return (
      (filters.brand ? v.brand?._id === filters.brand : true) &&
      (filters.category ? v.category?._id === filters.category : true) &&
      (filters.type ? v.type === filters.type : true) &&
      (filters.search
        ? v.name?.toLowerCase().includes(filters.search.toLowerCase())
        : true)
    );
  });

  // Get unique brands, categories, and types from vehicles
  const uniqueBrands = [
    ...new Set(vehicles.map((v) => JSON.stringify({ _id: v.brand?._id, title: v.brand?.title }))),
  ].map((str) => JSON.parse(str)).filter((b) => b._id && b.title);
  const uniqueCategories = [
    ...new Set(vehicles.map((v) => JSON.stringify({ _id: v.category?._id, title: v.category?.title }))),
  ].map((str) => JSON.parse(str)).filter((c) => c._id && c.title);
  const uniqueTypes = [
    ...new Set(vehicles.map((v) => v.type).filter(Boolean)),
  ];

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
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
=======
  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/createvenue/${venueId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setVenues(prevVenues => prevVenues.filter(v => v._id !== venueId));
        setToastMessage("Venue deleted successfully");
        setToastSeverity("success");
        setOpenToast(true);
        // Update pagination if needed
        if (venues.length === 1 && pagination.currentPage > 1) {
          handlePageChange(pagination.currentPage - 1);
        }
      } else {
        throw new Error(data.message || "Failed to delete venue");
      }
    } catch (err) {
      console.error("Error deleting venue:", err);
      setToastMessage("Error deleting venue: " + err.message);
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  const handleViewVenue = (venueId) => {
    navigate(`/venue-setup/view/${venueId}`);
  };

  const handleEditVenue = (venueId) => {
    navigate(`/venue-setup/edit/${venueId}`);
  };

  // Toast handlers
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenToast(false);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: "#fafafa", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading venues...</Typography>
      </Box>
    );
  }

  // Error state
  if (error && venues.length === 0) {
    return (
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 600, mx: "auto" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => fetchVenues(1, filters)}
            sx={{ bgcolor: "#2563eb" }}
          >
            Retry
          </Button>
        </Paper>
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
      {/* Navbar */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
<<<<<<< HEAD
            🚗 CityRide Rentals
          </Typography>
        </Toolbar>
      </AppBar>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {/* Filters */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }} size="small">
=======
            🏢 CityRide Venues
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Filters */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 180 }} size="small">
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
            <Select
              displayEmpty
              value={pendingFilters.brand}
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, brand: e.target.value })
              }
            >
<<<<<<< HEAD
              <MenuItem value="">Select vehicle brand</MenuItem>
              {uniqueBrands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.title}
=======
              <MenuItem value="">All Providers</MenuItem>
              {getUniqueBrands().map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
                </MenuItem>
              ))}
            </Select>
          </FormControl>
<<<<<<< HEAD
          <FormControl sx={{ minWidth: 200 }} size="small">
=======

          <FormControl sx={{ minWidth: 180 }} size="small">
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
            <Select
              displayEmpty
              value={pendingFilters.category}
              onChange={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  category: e.target.value,
                })
              }
            >
<<<<<<< HEAD
              <MenuItem value="">Select vehicle category</MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.title}
=======
              <MenuItem value="">All Arrangements</MenuItem>
              {getUniqueCategories().map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
                </MenuItem>
              ))}
            </Select>
          </FormControl>
<<<<<<< HEAD
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.type}
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, type: e.target.value })
              }
            >
              <MenuItem value="">Select vehicle type</MenuItem>
              {uniqueTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
=======

          <FormControl sx={{ minWidth: 180 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.rentalType}
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, rentalType: e.target.value })
              }
            >
              <MenuItem value="">All Rental Types</MenuItem>
              {getUniqueRentalTypes().map((t) => (
                <MenuItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
                </MenuItem>
              ))}
            </Select>
          </FormControl>
<<<<<<< HEAD
          <Button
            variant="outlined"
            sx={{ bgcolor: "#f3f4f6", borderRadius: "8px" }}
            onClick={handleReset}
          >
=======

          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.isActive}
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, isActive: e.target.value })
              }
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={handleReset}>
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
            Reset
          </Button>
          <Button
            variant="contained"
<<<<<<< HEAD
            sx={{ bgcolor: "#2b68bdff", borderRadius: "8px" }}
=======
            sx={{ bgcolor: "#2b68bdff" }}
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
            onClick={handleApplyFilters}
          >
            Filter
          </Button>
        </Stack>
      </Paper>
<<<<<<< HEAD
=======

>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
      {/* Table */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          spacing={2}
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
<<<<<<< HEAD
            Total Vehicles{" "}
            <Chip
              label={filteredVehicles.length}
=======
            Total Venues{" "}
            <Chip
              label={pagination.totalItems}
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
              color="success"
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <TextField
              size="small"
<<<<<<< HEAD
              placeholder="Search by vehicle name"
=======
              placeholder="Search by venue name or address"
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
              value={pendingFilters.search}
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, search: e.target.value })
              }
              InputProps={{
                endAdornment: <Search fontSize="small" />,
              }}
<<<<<<< HEAD
            />
            <Button variant="outlined" onClick={handleExport}>
              Export
=======
              sx={{ minWidth: 200 }}
            />
            <Button variant="outlined" onClick={handleExport}>
              Export CSV
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#2563eb" }}
<<<<<<< HEAD
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
                <TableCell>Total Trips</TableCell>
                <TableCell>Trip Fare</TableCell>
                <TableCell>Details</TableCell>
=======
              onClick={() => navigate("/venue-setup/create")}
            >
              New Venue
            </Button>
          </Stack>
        </Stack>

        {/* Pagination Info */}
        {venues.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
            {pagination.totalItems} venues
          </Typography>
        )}

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell>Sl</TableCell>
                <TableCell>Venue Info</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Arrangement</TableCell>
                <TableCell>Rental Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Bookings</TableCell>
                <TableCell>Facilities</TableCell>
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
<<<<<<< HEAD
              {filteredVehicles.map((v, i) => (
                <TableRow key={v._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#2563eb" }}
                    >
                      {v.name || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      VIN: {v.vinNumber || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      License: {v.licensePlateNumber || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>{v.category?.title || "N/A"}</TableCell>
                  <TableCell>{v.brand?.title || "N/A"}</TableCell>
                  <TableCell>{v.type || "N/A"}</TableCell>
                  <TableCell>{v.totalTrips || 0}</TableCell>
                  <TableCell>
                    {v.pricing?.hourly && (
                      <Typography variant="body2">
                        Hourly: ${v.pricing.hourly}
                      </Typography>
                    )}
                    {v.pricing?.distance && (
                      <Typography variant="body2">
                        Distance: ${v.pricing.distance}/km
                      </Typography>
                    )}
                    {v.pricing?.perDay && (
                      <Typography variant="body2">
                        Daily: ${v.pricing.perDay}
                      </Typography>
                    )}
                    {!v.pricing?.hourly &&
                      !v.pricing?.distance &&
                      !v.pricing?.perDay && (
                        <Typography variant="body2" color="text.secondary">
                          No pricing set
                        </Typography>
                      )}
                    {v.discount && (
                      <Typography variant="body2" color="success.main">
                        Discount: {v.discount}%
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Engine: {v.engineCapacity || "N/A"}cc, {v.enginePower || "N/A"}hp
                    </Typography>
                    <Typography variant="body2">
                      Seats: {v.seatingCapacity || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Fuel: {v.fuelType || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Transmission: {v.transmissionType || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      A/C: {v.airCondition ? "Yes" : "No"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={v.isActive !== false}
                      onChange={() =>
                        handleStatusToggle(
                          v._id,
                          "isActive",
                          v.isActive !== false
                        )
                      }
                    />
                    {v.isNew && <Chip label="New" color="primary" size="small" />}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        sx={{
                          border: "1px solid #d1d5db",
                          color: "#2563eb",
                          borderRadius: "8px",
                        }}
                        onClick={() => navigate(`/vehicle-setup/listview/${v._id}`)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          border: "1px solid #d1d5db",
                          color: "#065f46",
                          borderRadius: "8px",
                        }}
                        onClick={() => navigate(`/vehicle-setup/leads/${v._id}`)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          border: "1px solid #d1d5db",
                          color: "#dc2626",
                          borderRadius: "8px",
                        }}
                        onClick={() => handleDelete(v._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {vehicles.length === 0
                      ? "No vehicles found. Add your first vehicle!"
                      : "No vehicles match the current filters"}
=======
              {venues.map((v, i) => {
                const price = v.rentalType === "hourly" ? `$${v.hourlyPrice}/hr` :
                             v.rentalType === "perDay" ? `$${v.perDayPrice}/day` :
                             v.rentalType === "distanceWise" ? `$${v.distanceWisePrice}/km` : "N/A";
                
                const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
                const slNumber = startIndex + i + 1;

                return (
                  <TableRow key={v._id} hover>
                    <TableCell>{slNumber}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#2563eb" }}
                        >
                          {v.venueName}
                        </Typography>
                        {v.searchTags && v.searchTags.length > 0 && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {v.searchTags.slice(0, 3).map((tag, idx) => (
                              <Chip
                                key={idx}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.65rem" }}
                              />
                            ))}
                            {v.searchTags.length > 3 && (
                              <Chip
                                label={`+${v.searchTags.length - 3}`}
                                size="small"
                                sx={{ fontSize: "0.65rem" }}
                              />
                            )}
                          </Stack>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150 }}>
                      <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                        {v.venueAddress.length > 50 
                          ? `${v.venueAddress.substring(0, 50)}...` 
                          : v.venueAddress
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {v.provider?.storeName || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={v.seatingArrangement || "N/A"}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={v.rentalType ? v.rentalType.charAt(0).toUpperCase() + v.rentalType.slice(1) : "N/A"}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#059669" }}>
                        {price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {v.maxGuestsSeated || "N/A"} seats
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="primary">
                        {v.totalBookings || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {v.facilities?.parkingAvailability && (
                          <Chip label="P" size="small" color="success" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                        )}
                        {v.facilities?.foodCateringAvailability && (
                          <Chip label="F" size="small" color="warning" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                        )}
                        {v.facilities?.wifiAvailability && (
                          <Chip label="W" size="small" color="info" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                        )}
                        {v.facilities?.wheelchairAccessibility && (
                          <Chip label="A" size="small" color="primary" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={v.isActive || false}
                        onChange={() => handleToggleStatus(v._id)}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          sx={{ color: "#2563eb" }}
                          onClick={() => handleViewVenue(v._id)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: "#065f46" }}
                          onClick={() => handleEditVenue(v._id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#dc2626" }}
                          onClick={() => handleDeleteVenue(v._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {venues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                    <Stack spacing={2} alignItems="center">
                      <Typography variant="h6" color="text.secondary">
                        No venues found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {filters.search && `No venues match "${filters.search}"`}
                        {!filters.search && "Create your first venue to get started"}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: "#2563eb" }}
                        onClick={() => navigate("/venue-setup/create")}
                      >
                        Create New Venue
                      </Button>
                    </Stack>
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
<<<<<<< HEAD
      </Paper>
      {/* Toast Message */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
=======

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 3, pt: 2, borderTop: "1px solid #e5e7eb" }}
          >
            <Typography variant="body2" color="text.secondary">
              Page {pagination.currentPage} of {pagination.totalPages}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>

      {/* Toast Notification */}
      <Snackbar
        open={openToast}
        autoHideDuration={4000}
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
<<<<<<< HEAD
          sx={{
            backgroundColor: toastSeverity === "success" ? "#1976d2" : "#d32f2f",
            color: "white",
          }}
=======
          sx={{ width: "100%" }}
          variant="filled"
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}