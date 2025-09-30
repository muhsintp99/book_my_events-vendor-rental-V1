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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { Visibility, Edit, Delete, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
export default function VenuesList() {
  const API_BASE_URL = "https://api.bookmyevent.ae/api";
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    seatingArrangement: "",
    search: "",
  });
  const [pendingFilters, setPendingFilters] = useState({
    seatingArrangement: "",
    search: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const navigate = useNavigate();
  // Fetch venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/venues/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setVenues(result.data || []);
      } else {
        console.error("Failed to fetch venues:", result.message);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };
  // Handle view venue details
  const handleViewVenue = (venue) => {
    setSelectedVenue(venue);
    setOpenModal(true);
  };
  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVenue(null);
  };
  // Apply filters when "Filter" button clicked
  const handleApplyFilters = () => {
    setFilters(pendingFilters);
  };
  // Reset filters
  const handleReset = () => {
    setFilters({ seatingArrangement: "", search: "" });
    setPendingFilters({ seatingArrangement: "", search: "" });
  };
  // Export CSV
  const handleExport = () => {
    const headers = [
      "Sl,Name,Address,Seating Arrangement,Max Guests Seated,Status",
    ];
    const rows = filteredVenues.map(
      (v, i) =>
        `${i + 1},${v.venueName},${v.venueAddress},${v.seatingArrangement || "-"},${
          v.maxGuestsSeated || "-"
        },${v.status}`
    );
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "venues.csv";
    link.click();
  };
  // Toggle venue status
  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/venues/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setVenues(prev => prev.map(v => 
          v._id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v
        ));
      } else {
        console.error("Failed to toggle venue status:", result.message);
      }
    } catch (error) {
      console.error("Error toggling venue status:", error);
    }
  };
  // Delete venue
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        fetchVenues(); // Refresh the list
      } else {
        console.error("Failed to delete venue:", result.message);
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
    } finally {
      setLoading(false);
    }
  };
  // Filtering logic (applied filters only)
  const filteredVenues = venues.filter((v) => {
    return (
      (filters.seatingArrangement
        ? v.seatingArrangement === filters.seatingArrangement
        : true) &&
      (filters.search
        ? v.venueName.toLowerCase().includes(filters.search.toLowerCase())
        : true)
    );
  });
  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
      {/* Navbar */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
            🏛️ Venue Management
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Filters */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.seatingArrangement}
              onChange={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  seatingArrangement: e.target.value,
                })
              }
            >
              <MenuItem value="">Select seating arrangement</MenuItem>
              {[...new Set(venues.map((v) => v.seatingArrangement))]
                .filter(Boolean)
                .map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            sx={{ bgcolor: "#f3f4f6", borderRadius: "8px" }}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2b68bdff", borderRadius: "8px" }}
            onClick={handleApplyFilters}
          >
            Filter
          </Button>
        </Stack>
      </Paper>
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
            Total Venues{" "}
            <Chip
              label={filteredVenues.length}
              color="success"
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search by venue name"
              value={pendingFilters.search}
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, search: e.target.value })
              }
              InputProps={{
                endAdornment: <Search fontSize="small" />,
              }}
            />
            <Button variant="outlined" onClick={handleExport}>
              Export
            </Button>
            <Button variant="outlined" onClick={fetchVenues} disabled={loading}>
              Refresh
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#2563eb" }}
              onClick={() => navigate("/venue-setup/new")}
            >
              New Venue
            </Button>
          </Stack>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell>Sl</TableCell>
                <TableCell>Venue Info</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Seating Arrangement</TableCell>
                <TableCell>Max Guests Seated</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredVenues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No venues found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVenues.map((v, i) => (
                  <TableRow key={v._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#2563eb" }}
                      >
                        {v.venueName}
                      </Typography>
                    </TableCell>
                    <TableCell>{v.venueAddress}</TableCell>
                    <TableCell>{v.seatingArrangement || "-"}</TableCell>
                    <TableCell>{v.maxGuestsSeated || "-"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={v.status === "active"}
                        onChange={() => handleToggleStatus(v._id)}
                        disabled={loading}
                      />
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
                          onClick={() => handleViewVenue(v)}
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
                          onClick={() => navigate(`/venue-setup/new/${v._id}`)}
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Venue Details Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Venue Details</DialogTitle>
        <DialogContent>
          {selectedVenue && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Venue Name</Typography>
                <Typography>{selectedVenue.venueName || "-"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
                <Typography>{selectedVenue.shortDescription || "-"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
                <Typography>{selectedVenue.venueAddress || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Latitude</Typography>
                <Typography>{selectedVenue.latitude || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Longitude</Typography>
                <Typography>{selectedVenue.longitude || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Opening Hours</Typography>
                <Typography>{selectedVenue.openingHours || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Closing Hours</Typography>
                <Typography>{selectedVenue.closingHours || "-"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Holiday Scheduling</Typography>
                <Typography>{selectedVenue.holidaySchedule || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Parking Availability</Typography>
                <Typography>{selectedVenue.parkingAvailability ? "Yes" : "No"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Parking Capacity</Typography>
                <Typography>{selectedVenue.parkingCapacity || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Food & Catering</Typography>
                <Typography>{selectedVenue.foodCateringAvailability ? "Yes" : "No"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Stage/Lighting/Audio</Typography>
                <Typography>{selectedVenue.stageLightingAudio ? "Yes" : "No"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Wheelchair Accessibility</Typography>
                <Typography>{selectedVenue.wheelchairAccessibility ? "Yes" : "No"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Security Arrangements</Typography>
                <Typography>{selectedVenue.securityArrangements ? "Yes" : "No"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Wi-Fi Availability</Typography>
                <Typography>{selectedVenue.wifiAvailability ? "Yes" : "No"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Washrooms Info</Typography>
                <Typography>{selectedVenue.washroomsInfo || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Dressing Rooms</Typography>
                <Typography>{selectedVenue.dressingRooms || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Rental Type</Typography>
                <Typography>{selectedVenue.rentalType || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Pricing</Typography>
                <Typography>
                  {selectedVenue.rentalType === "hourly" && selectedVenue.hourlyPrice
                    ? `Hourly: $${selectedVenue.hourlyPrice}`
                    : selectedVenue.rentalType === "perDay" && selectedVenue.perDayPrice
                    ? `Per Day: $${selectedVenue.perDayPrice}`
                    : selectedVenue.rentalType === "distanceWise" && selectedVenue.distanceWisePrice
                    ? `Distance Wise: $${selectedVenue.distanceWisePrice}`
                    : "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Discount</Typography>
                <Typography>{selectedVenue.discount ? `${selectedVenue.discount}%` : "-"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Custom Packages</Typography>
                <Typography>{selectedVenue.customPackages || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Dynamic Pricing</Typography>
                <Typography>{selectedVenue.dynamicPricing ? "Enabled" : "Disabled"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Advance Deposit</Typography>
                <Typography>{selectedVenue.advanceDeposit ? `${selectedVenue.advanceDeposit}%` : "-"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Cancellation Policy</Typography>
                <Typography>{selectedVenue.cancellationPolicy || "-"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Extra Charges</Typography>
                <Typography>{selectedVenue.extraCharges || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Seating Arrangement</Typography>
                <Typography>{selectedVenue.seatingArrangement || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Max Guests Seated</Typography>
                <Typography>{selectedVenue.maxGuestsSeated || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Max Guests Standing</Typography>
                <Typography>{selectedVenue.maxGuestsStanding || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Multiple Halls</Typography>
                <Typography>{selectedVenue.multipleHalls ? "Yes" : "No"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Nearby Transport</Typography>
                <Typography>{selectedVenue.nearbyTransport || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Elderly Accessibility</Typography>
                <Typography>{selectedVenue.accessibilityInfo ? "Yes" : "No"}</Typography>
              </Grid>
            <Grid item xs={12}>
  <Typography variant="subtitle1" fontWeight="bold">Search Tags</Typography>
  <Typography>
    {Array.isArray(selectedVenue?.searchTags)
      ? selectedVenue.searchTags.join(", ")
      : selectedVenue?.searchTags || "-"}
  </Typography>
</Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}