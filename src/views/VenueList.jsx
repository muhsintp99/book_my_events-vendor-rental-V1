// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Switch,
//   IconButton,
//   Stack,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   Snackbar,

// } from "@mui/material";
// import { Visibility, Edit, Delete, Search } from "@mui/icons-material";
// import { Alert } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// export default function VenuesList() {
//   const API_BASE_URL = "https://api.bookmyevent.ae/api";
//   const [venues, setVenues] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     seatingArrangement: "",
//     search: "",
//   });
//   const [pendingFilters, setPendingFilters] = useState({
//     seatingArrangement: "",
//     search: "",
//   });
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedVenue, setSelectedVenue] = useState(null);

//   const [openConfirm, setOpenConfirm] = useState(false); // Confirm delete dialog
//   const [venueToDelete, setVenueToDelete] = useState(null); 
//   const [openToast, setOpenToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState("success");


//   const navigate = useNavigate();
//   // Fetch venues on component mount
//   useEffect(() => {
//     fetchVenues();
//   }, []);
//   const fetchVenues = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       const providerId = userData._id;

//       if (!token) {
//         console.error("No authentication token found");
//         setLoading(false);
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/venues/provider/${providerId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await response.json();
//       if (result.success) {
//         setVenues(result.data || []);
//       } else {
//         console.error("Failed to fetch venues:", result.message);
//       }
//     } catch (error) {
//       console.error("Error fetching venues:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Handle view venue details
//   const handleViewVenue = (venue) => {
//     setSelectedVenue(venue);
//     setOpenModal(true);
//   };
//   // Close modal
//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedVenue(null);
//   };
//   // Apply filters when "Filter" button clicked
//   const handleApplyFilters = () => {
//     setFilters(pendingFilters);
//   };
//   // Reset filters
//   const handleReset = () => {
//     setFilters({ seatingArrangement: "", search: "" });
//     setPendingFilters({ seatingArrangement: "", search: "" });
//   };
//   // Export CSV
//   const handleExport = () => {
//     const headers = [
//       "Sl,Name,Address,Seating Arrangement,Max Guests Seated,Status",
//     ];
//     const rows = filteredVenues.map(
//       (v, i) =>
//         `${i + 1},${v.venueName},${v.venueAddress},${v.seatingArrangement || "-"},${v.maxGuestsSeated || "-"
//         },${v.status}`
//     );
//     const csv = headers.concat(rows).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "venues.csv";
//     link.click();
//   };
//   // Toggle venue status
//   const handleToggleStatus = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/venues/${id}/toggle`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await response.json();
//       if (result.success) {
//         setVenues(prev => prev.map(v =>
//           v._id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v
//         ));
//       } else {
//         console.error("Failed to toggle venue status:", result.message);
//       }
//     } catch (error) {
//       console.error("Error toggling venue status:", error);
//     }
//   };

//   //confim delete
//   const confirmDelete = (id) => {
//     setVenueToDelete(id);
//     setOpenConfirm(true);
//   };
//   // Delete venue
//   const handleDelete = async () => {
//     if (!venueToDelete) return;
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${API_BASE_URL}/venues/${venueToDelete}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await response.json();
//       if (result.success) {
//         fetchVenues();
//         setToastMessage("Venue deleted successfully ✅");
//         setToastSeverity("success");
//       } else {
//         setToastMessage(result.message || "Failed to delete venue ❌");
//         setToastSeverity("error");
//       }
//     } catch (error) {
//       console.error(error);
//       setToastMessage("Error deleting venue ❌");
//       setToastSeverity("error");
//     } finally {
//       setLoading(false);
//       setOpenConfirm(false);
//       setVenueToDelete(null);
//       setOpenToast(true);
//     }
//   };
//   // Filtering logic (applied filters only)
//   const filteredVenues = venues.filter((v) => {
//     return (
//       (filters.seatingArrangement
//         ? v.seatingArrangement === filters.seatingArrangement
//         : true) &&
//       (filters.search
//         ? v.venueName.toLowerCase().includes(filters.search.toLowerCase())
//         : true)
//     );
//   });
//   return (
//     <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
//       {/* Navbar */}
//       <AppBar position="static" color="default" elevation={0}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
//             🏛️ Venue Management
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       {/* Filters */}
//       <Paper sx={{ p: 2, mt: 2 }}>
//         <Stack direction="row" spacing={2} flexWrap="wrap">
//           <FormControl sx={{ minWidth: 200 }} size="small">
//             <Select
//               displayEmpty
//               value={pendingFilters.seatingArrangement}
//               onChange={(e) =>
//                 setPendingFilters({
//                   ...pendingFilters,
//                   seatingArrangement: e.target.value,
//                 })
//               }
//             >
//               <MenuItem value="">Select seating arrangement</MenuItem>
//               {[...new Set(venues.map((v) => v.seatingArrangement))]
//                 .filter(Boolean)
//                 .map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//             </Select>
//           </FormControl>
//           <Button
//             variant="outlined"
//             sx={{ bgcolor: "#f3f4f6", borderRadius: "8px" }}
//             onClick={handleReset}
//           >
//             Reset
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ bgcolor: "#2b68bdff", borderRadius: "8px" }}
//             onClick={handleApplyFilters}
//           >
//             Filter
//           </Button>
//         </Stack>
//       </Paper>
//       {/* Table */}
//       <Paper sx={{ p: 2, mt: 2 }}>
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           flexWrap="wrap"
//           spacing={2}
//           mb={2}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Total Venues{" "}
//             <Chip
//               label={filteredVenues.length}
//               color="success"
//               size="small"
//               sx={{ ml: 1 }}
//             />
//           </Typography>
//           <Stack direction="row" spacing={1} flexWrap="wrap">
//             <TextField
//               size="small"
//               placeholder="Search by venue name"
//               value={pendingFilters.search}
//               onChange={(e) =>
//                 setPendingFilters({ ...pendingFilters, search: e.target.value })
//               }
//               InputProps={{
//                 endAdornment: <Search fontSize="small" />,
//               }}
//             />
//             <Button variant="outlined" onClick={handleExport}>
//               Export
//             </Button>
//             <Button variant="outlined" onClick={fetchVenues} disabled={loading}>
//               Refresh
//             </Button>
//             <Button
//               variant="contained"
//               sx={{ bgcolor: "#2563eb" }}
//               onClick={() => navigate("/venue-setup/new")}
//             >
//               New Venue
//             </Button>
//           </Stack>
//         </Stack>
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ bgcolor: "#f9fafb" }}>
//               <TableRow>
//                 <TableCell>Sl</TableCell>
//                 <TableCell>Venue Info</TableCell>
//                 <TableCell>Address</TableCell>
//                 <TableCell>Seating Arrangement</TableCell>
//                 <TableCell>Max Guests Seated</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : filteredVenues.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     No venues found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredVenues.map((v, i) => (
//                   <TableRow key={v._id}>
//                     <TableCell>{i + 1}</TableCell>
//                     <TableCell>
//                       <Typography
//                         variant="body2"
//                         sx={{ fontWeight: 600, color: "#2563eb" }}
//                       >
//                         {v.venueName}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>{v.venueAddress}</TableCell>
//                     <TableCell>{v.seatingArrangement || "-"}</TableCell>
//                     <TableCell>{v.maxGuestsSeated || "-"}</TableCell>
//                     <TableCell>
//                       <Switch
//                         checked={v.status === "active"}
//                         onChange={() => handleToggleStatus(v._id)}
//                         disabled={loading}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={1}>
//                         <IconButton
//                           size="small"
//                           sx={{
//                             border: "1px solid #d1d5db",
//                             color: "#2563eb",
//                             borderRadius: "8px",
//                           }}
//                           onClick={() => handleViewVenue(v)}
//                         >
//                           <Visibility fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           sx={{
//                             border: "1px solid #d1d5db",
//                             color: "#065f46",
//                             borderRadius: "8px",
//                           }}
//                           onClick={() => navigate(`/venue-setup/new/${v._id}`)}
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                        <IconButton
//   size="small"
//   sx={{
//     border: "1px solid #d1d5db",
//     color: "#dc2626",
//     borderRadius: "8px",
//   }}
//   onClick={() => confirmDelete(v._id)}   // ✅ FIXED
// >
//   <Delete fontSize="small" />
// </IconButton>

//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//       {/* Venue Details Modal */}
//       <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
//         <DialogTitle>Venue Details</DialogTitle>
//         <DialogContent>
//           {selectedVenue && (
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Venue Name</Typography>
//                 <Typography>{selectedVenue.venueName || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
//                 <Typography>{selectedVenue.shortDescription || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
//                 <Typography>{selectedVenue.venueAddress || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Latitude</Typography>
//                 <Typography>{selectedVenue.latitude || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Longitude</Typography>
//                 <Typography>{selectedVenue.longitude || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Opening Hours</Typography>
//                 <Typography>{selectedVenue.openingHours || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Closing Hours</Typography>
//                 <Typography>{selectedVenue.closingHours || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Holiday Scheduling</Typography>
//                 <Typography>{selectedVenue.holidaySchedule || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Parking Availability</Typography>
//                 <Typography>{selectedVenue.parkingAvailability ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Parking Capacity</Typography>
//                 <Typography>{selectedVenue.parkingCapacity || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Food & Catering</Typography>
//                 <Typography>{selectedVenue.foodCateringAvailability ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Stage/Lighting/Audio</Typography>
//                 <Typography>{selectedVenue.stageLightingAudio ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Wheelchair Accessibility</Typography>
//                 <Typography>{selectedVenue.wheelchairAccessibility ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Security Arrangements</Typography>
//                 <Typography>{selectedVenue.securityArrangements ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Wi-Fi Availability</Typography>
//                 <Typography>{selectedVenue.wifiAvailability ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Washrooms Info</Typography>
//                 <Typography>{selectedVenue.washroomsInfo || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Dressing Rooms</Typography>
//                 <Typography>{selectedVenue.dressingRooms || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Venue Type</Typography>
//                 <Typography>{selectedVenue.venueType || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Pricing</Typography>
//                 <Typography>
//                   {selectedVenue.venueType === "hourly" && selectedVenue.hourlyPrice
//                     ? `Hourly: $${selectedVenue.hourlyPrice}`
//                     : selectedVenue.venueType === "perDay" && selectedVenue.perDayPrice
//                       ? `Per Day: $${selectedVenue.perDayPrice}`
//                       : selectedVenue.venueType === "distanceWise" && selectedVenue.distanceWisePrice
//                         ? `Distance Wise: $${selectedVenue.distanceWisePrice}`
//                         : "-"}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Discount</Typography>
//                 <Typography>{selectedVenue.discount ? `${selectedVenue.discount}%` : "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Custom Packages</Typography>
//                 <Typography>{selectedVenue.customPackages || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Dynamic Pricing</Typography>
//                 <Typography>{selectedVenue.dynamicPricing ? "Enabled" : "Disabled"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Advance Deposit</Typography>
//                 <Typography>{selectedVenue.advanceDeposit ? `${selectedVenue.advanceDeposit}%` : "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Cancellation Policy</Typography>
//                 <Typography>{selectedVenue.cancellationPolicy || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Extra Charges</Typography>
//                 <Typography>{selectedVenue.extraCharges || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Seating Arrangement</Typography>
//                 <Typography>{selectedVenue.seatingArrangement || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Max Guests Seated</Typography>
//                 <Typography>{selectedVenue.maxGuestsSeated || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Max Guests Standing</Typography>
//                 <Typography>{selectedVenue.maxGuestsStanding || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Multiple Halls</Typography>
//                 <Typography>{selectedVenue.multipleHalls ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Nearby Transport</Typography>
//                 <Typography>{selectedVenue.nearbyTransport || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Elderly Accessibility</Typography>
//                 <Typography>{selectedVenue.accessibilityInfo ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Search Tags</Typography>
//                 <Typography>
//                   {Array.isArray(selectedVenue?.searchTags)
//                     ? selectedVenue.searchTags.join(", ")
//                     : selectedVenue?.searchTags || "-"}
//                 </Typography>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal}>Close</Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
//   <DialogTitle>Confirm Delete</DialogTitle>
//   <DialogContent>
//     <Typography>Are you sure you want to delete this venue?</Typography>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenConfirm(false)} color="primary">
//       Cancel
//     </Button>
//     <Button onClick={handleDelete} color="error" variant="contained">
//       Delete
//     </Button>
//   </DialogActions>
// </Dialog>
//  <Snackbar open={openToast} autoHideDuration={4000} onClose={() => setOpenToast(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
//         <Alert onClose={() => setOpenToast(false)} severity={toastSeverity} sx={{ width: "100%" }}>
//           {toastMessage}
//         </Alert>
//       </Snackbar>

//     </Box>
//   );
// }




// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Switch,
//   IconButton,
//   Stack,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   Snackbar,
//   TableContainer as MuiTableContainer,
// } from "@mui/material";
// import { Visibility, Edit, Delete, Search } from "@mui/icons-material";
// import { Alert } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// export default function VenuesList() {
//   const API_BASE_URL = "https://api.bookmyevent.ae/api";
//   const [venues, setVenues] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     seatingArrangement: "",
//     search: "",
//   });
//   const [pendingFilters, setPendingFilters] = useState({
//     seatingArrangement: "",
//     search: "",
//   });
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedVenue, setSelectedVenue] = useState(null);
//   const [openConfirm, setOpenConfirm] = useState(false); // Confirm delete dialog
//   const [venueToDelete, setVenueToDelete] = useState(null);
//   const [openToast, setOpenToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState("success");
//   const navigate = useNavigate();
//   // Fetch venues on component mount
//   useEffect(() => {
//     fetchVenues();
//   }, []);
//   const fetchVenues = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       const providerId = userData._id;
//       if (!token) {
//         console.error("No authentication token found");
//         setLoading(false);
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/venues/provider/${providerId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await response.json();
//       console.log("Fetched venues:", result);
//       if (result.success) {
//         setVenues(result.data || []);
//         if (result.success) {
//   const fetchedVenues = result.data || [];
//   console.log("Full fetched venues data:", fetchedVenues); // Add this line
//   setVenues(fetchedVenues);
// }
//       } else {
//         console.error("Failed to fetch venues:", result.message);
//       }
//     } catch (error) {
//       console.error("Error fetching venues:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Handle view venue details
//   const handleViewVenue = (venue) => {
//     console.log("Selected venue for modal:", venue); // Add this line
//     setSelectedVenue(venue);
//     setOpenModal(true);
//   };
//   // Close modal
//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedVenue(null);
//   };
//   // Apply filters when "Filter" button clicked
//   const handleApplyFilters = () => {
//     setFilters(pendingFilters);
//   };
//   // Reset filters
//   const handleReset = () => {
//     setFilters({ seatingArrangement: "", search: "" });
//     setPendingFilters({ seatingArrangement: "", search: "" });
//   };
//   // Export CSV
//   const handleExport = () => {
//     const headers = [
//       "Sl,Name,Address,Seating Arrangement,Max Guests Seated,Status",
//     ];
//     const rows = filteredVenues.map(
//       (v, i) =>
//         `${i + 1},${v.venueName},${v.venueAddress},${v.seatingArrangement || "-"},${v.maxGuestsSeated || "-"
//         },${v.isActive ? 'Active' : 'Inactive'}`
//     );
//     const csv = headers.concat(rows).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "venues.csv";
//     link.click();
//   };
//   // Toggle venue status
//   const handleToggleStatus = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/venues/${id}/toggle`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await response.json();
//       if (result.success) {
//         setVenues(prev => prev.map(v =>
//           v._id === id ? { ...v, isActive: !v.isActive } : v
//         ));
//       } else {
//         console.error("Failed to toggle venue status:", result.message);
//       }
//     } catch (error) {
//       console.error("Error toggling venue status:", error);
//     }
//   };
//   //confim delete
//   const confirmDelete = (id) => {
//     setVenueToDelete(id);
//     setOpenConfirm(true);
//   };
//   // Delete venue
//   const handleDelete = async () => {
//     if (!venueToDelete) return;
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");
//       const response = await fetch(`${API_BASE_URL}/venues/${venueToDelete}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await response.json();
//       if (result.success) {
//         fetchVenues();
//         setToastMessage("Venue deleted successfully ✅");
//         setToastSeverity("success");
//       } else {
//         setToastMessage(result.message || "Failed to delete venue ❌");
//         setToastSeverity("error");
//       }
//     } catch (error) {
//       console.error(error);
//       setToastMessage("Error deleting venue ❌");
//       setToastSeverity("error");
//     } finally {
//       setLoading(false);
//       setOpenConfirm(false);
//       setVenueToDelete(null);
//       setOpenToast(true);
//     }
//   };
//   // Filtering logic (applied filters only)
//   const filteredVenues = venues.filter((v) => {
//     return (
//       (filters.seatingArrangement
//         ? v.seatingArrangement === filters.seatingArrangement
//         : true) &&
//       (filters.search
//         ? v.venueName.toLowerCase().includes(filters.search.toLowerCase())
//         : true)
//     );
//   });
//   return (
//     <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
//       {/* Navbar */}
//       <AppBar position="static" color="default" elevation={0}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
//             🏛️ Venue Management
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       {/* Filters */}
//       <Paper sx={{ p: 2, mt: 2 }}>
//         <Stack direction="row" spacing={2} flexWrap="wrap">
//           <FormControl sx={{ minWidth: 200 }} size="small">
//             <Select
//               displayEmpty
//               value={pendingFilters.seatingArrangement}
//               onChange={(e) =>
//                 setPendingFilters({
//                   ...pendingFilters,
//                   seatingArrangement: e.target.value,
//                 })
//               }
//             >
//               <MenuItem value="">Select seating arrangement</MenuItem>
//               {[...new Set(venues.map((v) => v.seatingArrangement))]
//                 .filter(Boolean)
//                 .map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//             </Select>
//           </FormControl>
//           <Button
//             variant="outlined"
//             sx={{ bgcolor: "#f3f4f6", borderRadius: "8px" }}
//             onClick={handleReset}
//           >
//             Reset
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ bgcolor: "#2b68bdff", borderRadius: "8px" }}
//             onClick={handleApplyFilters}
//           >
//             Filter
//           </Button>
//         </Stack>
//       </Paper>
//       {/* Table */}
//       <Paper sx={{ p: 2, mt: 2 }}>
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           flexWrap="wrap"
//           spacing={2}
//           mb={2}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Total Venues{" "}
//             <Chip
//               label={filteredVenues.length}
//               color="success"
//               size="small"
//               sx={{ ml: 1 }}
//             />
//           </Typography>
//           <Stack direction="row" spacing={1} flexWrap="wrap">
//             <TextField
//               size="small"
//               placeholder="Search by venue name"
//               value={pendingFilters.search}
//               onChange={(e) =>
//                 setPendingFilters({ ...pendingFilters, search: e.target.value })
//               }
//               InputProps={{
//                 endAdornment: <Search fontSize="small" />,
//               }}
//             />
//             <Button variant="outlined" onClick={handleExport}>
//               Export
//             </Button>
//             <Button variant="outlined" onClick={fetchVenues} disabled={loading}>
//               Refresh
//             </Button>
//             <Button
//               variant="contained"
//               sx={{ bgcolor: "#2563eb" }}
//               onClick={() => navigate("/venue-setup/new")}
//             >
//               New Venue
//             </Button>
//           </Stack>
//         </Stack>
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ bgcolor: "#f9fafb" }}>
//               <TableRow>
//                 <TableCell>Sl</TableCell>
//                 <TableCell>Venue Info</TableCell>
//                 <TableCell>Address</TableCell>
//                 <TableCell>Seating Arrangement</TableCell>
//                 <TableCell>Max Guests Seated</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : filteredVenues.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     No venues found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredVenues.map((v, i) => (
//                   <TableRow key={v._id}>
//                     <TableCell>{i + 1}</TableCell>
//                     <TableCell>
//                       <Typography
//                         variant="body2"
//                         sx={{ fontWeight: 600, color: "#2563eb" }}
//                       >
//                         {v.venueName}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>{v.venueAddress}</TableCell>
//                     <TableCell>{v.seatingArrangement || "-"}</TableCell>
//                     <TableCell>{v.maxGuestsSeated || "-"}</TableCell>
//                     <TableCell>
//                       <Switch
//                         checked={v.isActive}
//                         onChange={() => handleToggleStatus(v._id)}
//                         disabled={loading}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={1}>
//                         <IconButton
//                           size="small"
//                           sx={{
//                             border: "1px solid #d1d5db",
//                             color: "#2563eb",
//                             borderRadius: "8px",
//                           }}
//                           onClick={() => handleViewVenue(v)}
//                         >
//                           <Visibility fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           sx={{
//                             border: "1px solid #d1d5db",
//                             color: "#065f46",
//                             borderRadius: "8px",
//                           }}
//                           onClick={() => navigate(`/venue-setup/new/${v._id}`)}
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                        <IconButton
//  size="small"
//  sx={{
//    border: "1px solid #d1d5db",
//    color: "#dc2626",
//    borderRadius: "8px",
//  }}
//  onClick={() => confirmDelete(v._id)}   // ✅ FIXED
// >
//   <Delete fontSize="small" />
// </IconButton>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//       {/* Venue Details Modal */}
//       <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
//         <DialogTitle>Venue Details</DialogTitle>
//         <DialogContent>
//           {selectedVenue && (
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Venue Name</Typography>
//                 <Typography>{selectedVenue.venueName || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
//                 <Typography>{selectedVenue.shortDescription || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
//                 <Typography>{selectedVenue.venueAddress || "-"}</Typography>
//               </Grid>
//              <Grid item xs={12} sm={6}>
//   <Typography variant="subtitle1" fontWeight="bold">Category</Typography>
//   <Typography>
//     {Array.isArray(selectedVenue.categories) && selectedVenue.categories.length > 0 
//       ? selectedVenue.categories.map(cat => {
//           if (typeof cat === 'object') {
//             return cat.name || cat._id || 'Unknown Category';
//           }
//           return cat || 'Unknown Category';
//         }).join(", ") 
//       : selectedVenue.category || "-"
//     }
//   </Typography>
// </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Latitude</Typography>
//                 <Typography>{selectedVenue.latitude || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Longitude</Typography>
//                 <Typography>{selectedVenue.longitude || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Opening Hours</Typography>
//                 <Typography>{selectedVenue.openingHours || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Closing Hours</Typography>
//                 <Typography>{selectedVenue.closingHours || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Holiday Scheduling</Typography>
//                 <Typography>{selectedVenue.holidaySchedule || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Parking Availability</Typography>
//                 <Typography>{selectedVenue.parkingAvailability ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Parking Capacity</Typography>
//                 <Typography>{selectedVenue.parkingCapacity || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Food & Catering</Typography>
//                 <Typography>{selectedVenue.foodCateringAvailability ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Stage/Lighting/Audio</Typography>
//                 <Typography>{selectedVenue.stageLightingAudio ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Wheelchair Accessibility</Typography>
//                 <Typography>{selectedVenue.wheelchairAccessibility ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Security Arrangements</Typography>
//                 <Typography>{selectedVenue.securityArrangements ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Wi-Fi Availability</Typography>
//                 <Typography>{selectedVenue.wifiAvailability ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//         <Typography variant="subtitle1" fontWeight="bold">AC Available</Typography>
//         <Typography>{selectedVenue.acAvailable ? "Yes" : "No"}</Typography>
//       </Grid>
//       <Grid item xs={12} sm={6}>
//         <Typography variant="subtitle1" fontWeight="bold">Non-AC Available</Typography>
//         <Typography>{selectedVenue.nonAcAvailable ? "Yes" : "No"}</Typography>
//       </Grid>
//       <Grid item xs={12} sm={6}>
//   <Typography variant="subtitle1" fontWeight="bold">Venue Type</Typography>
//   <Typography>{selectedVenue.venueType || "-"}</Typography>
// </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Washrooms Info</Typography>
//                 <Typography>{selectedVenue.washroomsInfo || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Dressing Rooms</Typography>
//                 <Typography>{selectedVenue.dressingRooms || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Venue Type</Typography>
//                 <Typography>{selectedVenue.venueType || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//   <Typography variant="subtitle1" fontWeight="bold">Pricing Schedule</Typography>
//   {selectedVenue.pricingSchedule && Object.keys(selectedVenue.pricingSchedule).length > 0 ? (
//     <MuiTableContainer component={Paper} sx={{ mt: 1 }}>
//       <Table size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell>Day</TableCell>
//             <TableCell>Slot</TableCell>
//             <TableCell>Time</TableCell>
//             <TableCell>Per Day</TableCell>
//             <TableCell>Per Hour</TableCell>
//             <TableCell>Per Person</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {Object.entries(selectedVenue.pricingSchedule).map(([day, slots]) => (
//             <React.Fragment key={day}>
//               {Object.entries(slots).map(([slotType, slot]) => (
//                 <TableRow key={`${day}-${slotType}`}>
//                   <TableCell>{day.charAt(0).toUpperCase() + day.slice(1)}</TableCell>
//                   <TableCell>{slotType.charAt(0).toUpperCase() + slotType.slice(1)}</TableCell>
//                   <TableCell>{`${slot.startTime} ${slot.startAmpm} - ${slot.endTime} ${slot.endAmpm}`}</TableCell>
//                   <TableCell>{slot.perDay || "-"}</TableCell>
//                   <TableCell>{slot.perHour || "-"}</TableCell>
//                   <TableCell>{slot.perPerson || "-"}</TableCell>
//                 </TableRow>
//               ))}
//             </React.Fragment>
//           ))}
//         </TableBody>
//       </Table>
//     </MuiTableContainer>
//   ) : (
//     <Typography>-</Typography>
//   )}
// </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Discount</Typography>
//                 <Typography>{selectedVenue.discount ? `${selectedVenue.discount}%` : "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Custom Packages</Typography>
//                 <Typography>{selectedVenue.customPackages || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Dynamic Pricing</Typography>
//                 <Typography>{selectedVenue.dynamicPricing ? "Enabled" : "Disabled"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Advance Deposit</Typography>
//                 <Typography>{selectedVenue.advanceDeposit ? `${selectedVenue.advanceDeposit}%` : "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Cancellation Policy</Typography>
//                 <Typography>{selectedVenue.cancellationPolicy || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Extra Charges</Typography>
//                 <Typography>{selectedVenue.extraCharges || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Seating Arrangement</Typography>
//                 <Typography>{selectedVenue.seatingArrangement || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Max Guests Seated</Typography>
//                 <Typography>{selectedVenue.maxGuestsSeated || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Max Guests Standing</Typography>
//                 <Typography>{selectedVenue.maxGuestsStanding || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Multiple Halls</Typography>
//                 <Typography>{selectedVenue.multipleHalls ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Nearby Transport</Typography>
//                 <Typography>{selectedVenue.nearbyTransport || "-"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Elderly Accessibility</Typography>
//                 <Typography>{selectedVenue.accessibilityInfo ? "Yes" : "No"}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Search Tags</Typography>
//                 <Typography>
//                   {Array.isArray(selectedVenue?.searchTags)
//                     ? selectedVenue.searchTags.join(", ")
//                     : selectedVenue?.searchTags || "-"}
//                 </Typography>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal}>Close</Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
//  <DialogTitle>Confirm Delete</DialogTitle>
//  <DialogContent>
//    <Typography>Are you sure you want to delete this venue?</Typography>
//  </DialogContent>
//  <DialogActions>
//    <Button onClick={() => setOpenConfirm(false)} color="primary">
//      Cancel
//    </Button>
//    <Button onClick={handleDelete} color="error" variant="contained">
//      Delete
//    </Button>
//  </DialogActions>
// </Dialog>
// <Snackbar open={openToast} autoHideDuration={4000} onClose={() => setOpenToast(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
//         <Alert onClose={() => setOpenToast(false)} severity={toastSeverity} sx={{ width: "100%" }}>
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

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
  Snackbar,
  Container,
  InputAdornment,
  Divider,
  Fade,
  Zoom,
  Tooltip,
  useTheme,
  alpha,
  Card,
  CardContent,
  CardMedia,
  Avatar
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Search,
  Add,
  Close,
  Business,
  LocationOn,
  EventSeat,
  Group,
  LocalOffer,
  Refresh,
  Info,
  ChevronRight,
  Storefront,
  Stars,
  TrendingUp,
  Schedule,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const THEME_COLOR = "#E15B65";
const SECONDARY_COLOR = "#c14a54";

export default function VenuesList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const API_BASE_URL = "https://api.bookmyevent.ae/api";
  const BASE_URL = "https://api.bookmyevent.ae";

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    seatingArrangement: "",
    status: "all",
    search: "",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const providerId = userData._id;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const filename = path.split("/").pop();
    return `${BASE_URL}/uploads/venues/${filename}`;
  };

  const fetchVenues = useCallback(async () => {
    if (!providerId || !token) {
      setToast({ open: true, message: "Authentication required", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/venues/provider/${providerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setVenues(result.data || []);
      } else {
        setToast({ open: true, message: result.message || "Failed to fetch venues", severity: "error" });
      }
    } catch (error) {
      setToast({ open: true, message: "Error loading venues", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleToggleStatus = async (id, current) => {
    try {
      const response = await fetch(`${API_BASE_URL}/venues/${id}/toggle-active`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setVenues(prev => prev.map(v =>
          v._id === id ? { ...v, isActive: !current } : v
        ));
        setToast({ open: true, message: "Status updated successfully", severity: "success" });
      } else {
        setToast({ open: true, message: "Failed to update status", severity: "error" });
      }
    } catch (error) {
      setToast({ open: true, message: "Error updating status", severity: "error" });
    }
  };

  const handleDelete = async () => {
    if (!venueToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/venues/${venueToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setVenues(prev => prev.filter(v => v._id !== venueToDelete));
        setToast({ open: true, message: "Venue deleted successfully", severity: "success" });
      } else {
        setToast({ open: true, message: result.message || "Failed to delete venue", severity: "error" });
      }
    } catch (error) {
      setToast({ open: true, message: "Error deleting venue", severity: "error" });
    } finally {
      setOpenConfirm(false);
      setVenueToDelete(null);
    }
  };

  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      const matchesSearch = !filters.search ||
        v.venueName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.venueAddress?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesSeating = !filters.seatingArrangement || v.seatingArrangement === filters.seatingArrangement;

      const matchesStatus = filters.status === "all" ||
        (filters.status === "active" && v.isActive) ||
        (filters.status === "inactive" && !v.isActive);

      return matchesSearch && matchesSeating && matchesStatus;
    });
  }, [venues, filters]);

  const stats = useMemo(() => ({
    total: venues.length,
    active: venues.filter(v => v.isActive).length,
    inactive: venues.filter(v => !v.isActive).length
  }), [venues]);

  return (
    <Box sx={{ bgcolor: "#F7FAFC", minHeight: "100vh", pb: 8 }}>
      {/* Premium Hero Header */}
      <Box sx={{
        background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #a44c7a 100%)`,
        color: "white",
        pt: 6,
        pb: 12,
        px: 4,
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
                gap: 1.5
              }}>
                <Business sx={{ fontSize: 36 }} /> Venue Management
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2.5 }}>
                {[
                  { label: "Total Venues", value: stats.total, icon: <Storefront sx={{ fontSize: 20 }} /> },
                  { label: "Active", value: stats.active, icon: <CheckCircle sx={{ fontSize: 20 }} /> },
                  { label: "Inactive", value: stats.inactive, icon: <Cancel sx={{ fontSize: 20 }} /> }
                ].map((stat, i) => (
                  <Paper key={i} elevation={0} sx={{
                    bgcolor: "rgba(255,255,255,0.12)",
                    px: 3, py: 1.5, borderRadius: 3,
                    backdropFilter: "blur(8px)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: "rgba(255,255,255,0.2)",
                    }
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
              onClick={() => navigate("/venue-setup/new")}
              sx={{
                bgcolor: "white",
                color: THEME_COLOR,
                fontWeight: 800,
                px: 5, py: 2,
                borderRadius: "20px",
                textTransform: "none",
                boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                "&:hover": {
                  bgcolor: "#f8f9ff",
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.2)"
                },
                transition: "all 0.3s"
              }}
            >
              Add New Venue
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -6, position: "relative", zIndex: 1 }}>
        {/* Floating Filter Bar */}
        <Paper elevation={10} sx={{ borderRadius: 4, p: 2, mb: 4, bgcolor: "white" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search venues..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: THEME_COLOR }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, bgcolor: "#f8fafc" }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={filters.seatingArrangement}
                  onChange={(e) => setFilters(prev => ({ ...prev, seatingArrangement: e.target.value }))}
                  displayEmpty
                  sx={{ borderRadius: 3, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="">Any Seating Arrangement</MenuItem>
                  <MenuItem value="Amphitheater">Amphitheater</MenuItem>
                  <MenuItem value="Balcony auditorium">Balcony auditorium</MenuItem>
                  <MenuItem value="Flat floor auditorium">Flat floor auditorium</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  sx={{ borderRadius: 3, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active Only</MenuItem>
                  <MenuItem value="inactive">Inactive Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchVenues}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  color: THEME_COLOR,
                  borderColor: THEME_COLOR,
                  "&:hover": { borderColor: SECONDARY_COLOR, bgcolor: alpha(THEME_COLOR, 0.05) }
                }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Venue Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: THEME_COLOR }} />
          </Box>
        ) : filteredVenues.length === 0 ? (
          <Fade in={true}>
            <Paper sx={{ textAlign: "center", py: 10, borderRadius: 6, border: "2px dashed #e2e8f0" }}>
              <Business sx={{ fontSize: 80, color: "#cbd5e0", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#4a5568" }}>
                No Venues Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or add a new venue to your collection.
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {filteredVenues.map((venue, index) => (
              <Grid item xs={12} sm={6} md={4} key={venue._id}>
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
                    <Box sx={{ position: "relative", pt: "60%", bgcolor: "#f7fafc" }}>
                      {venue.thumbnail ? (
                        <CardMedia
                          component="img"
                          image={getImageUrl(venue.thumbnail)}
                          alt={venue.venueName}
                          sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Box sx={{
                          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <Business sx={{ fontSize: 60, color: "#e2e8f0" }} />
                        </Box>
                      )}

                      {/* Action Overlay */}
                      <Box className="media-overlay" sx={{
                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                        bgcolor: alpha(THEME_COLOR, 0.4),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 2, opacity: 0, transition: "0.3s", backdropFilter: "blur(4px)"
                      }}>
                        <Tooltip title="View Details">
                          <Avatar sx={{ bgcolor: "white", color: THEME_COLOR, cursor: "pointer" }} onClick={() => navigate(`/venue-setup/listview/${venue._id}`)}>
                            <Visibility />
                          </Avatar>
                        </Tooltip>
                        <Tooltip title="Edit Venue">
                          <Avatar sx={{ bgcolor: "white", color: "#2b6cb0", cursor: "pointer" }} onClick={() => navigate(`/venue-setup/new/${venue._id}`)}>
                            <Edit />
                          </Avatar>
                        </Tooltip>
                        <Tooltip title="Delete Permanently">
                          <Avatar sx={{ bgcolor: "white", color: "#c53030", cursor: "pointer" }} onClick={() => { setVenueToDelete(venue._id); setOpenConfirm(true); }}>
                            <Delete />
                          </Avatar>
                        </Tooltip>
                      </Box>

                      <Box sx={{ position: "absolute", top: 15, left: 15 }}>
                        <Chip
                          label={venue.isActive ? "ACTIVE" : "INACTIVE"}
                          size="small"
                          sx={{
                            bgcolor: venue.isActive ? "#48bb78" : "#a0aec0",
                            color: "white",
                            fontWeight: 900,
                            borderRadius: 2
                          }}
                        />
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {venue.venueName}
                      </Typography>

                      <Stack spacing={1.5}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: THEME_COLOR, mt: 0.3 }} />
                          <Typography variant="body2" color="text.secondary" sx={{
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                          }}>
                            {venue.venueAddress || "No address provided"}
                          </Typography>
                        </Box>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block" }}>CAPACITY</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Group sx={{ fontSize: 16, color: "#718096" }} />
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{venue.maxGuestsSeated || "-"}</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block" }}>SEATING</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <EventSeat sx={{ fontSize: 16, color: "#718096" }} />
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{venue.seatingArrangement || "N/A"}</Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Stack>

                      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>STATUS</Typography>
                          <Switch
                            checked={venue.isActive}
                            onChange={() => handleToggleStatus(venue._id, venue.isActive)}
                            size="small"
                            color="success"
                          />
                        </Box>
                        <Button
                          size="small"
                          endIcon={<ChevronRight />}
                          onClick={() => navigate(`/venue-setup/listview/${venue._id}`)}
                          sx={{ textTransform: "none", fontWeight: 700, color: THEME_COLOR }}
                        >
                          Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete Confirmation */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, textAlign: "center" }}>Permanently Delete?</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography color="text.secondary">
            Are you sure you want to delete this venue? This action cannot be undone and will remove all related data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ borderRadius: 3, fontWeight: 700 }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: "#c53030", borderRadius: 3, fontWeight: 700, "&:hover": { bgcolor: "#9b2c2c" } }}>Yes, Delete</Button>
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