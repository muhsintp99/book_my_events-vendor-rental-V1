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

import React, { useState, useEffect } from "react";
import {AppBar,Toolbar,Typography,Box,Button,Select,MenuItem,FormControl,TextField,
  Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Switch,
  IconButton,Stack, Chip,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Snackbar,
  TableContainer as MuiTableContainer,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip as MuiChip,
} from "@mui/material";
import { Visibility, Edit, Delete, Search, Business, LocationOn, Schedule, LocalParking, Restaurant, Lightbulb, Accessibility, Security, Wifi, AcUnit, Group, AttachMoney, EventSeat, LocalOffer, Cancel, DirectionsTransit, Elderly, Tag } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function VenuesList() {
  const API_BASE_URL = "https://api.bookmyevent.ae/api";
  const [venues, setVenues] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({}); // Map of category ID to name
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
  const [openConfirm, setOpenConfirm] = useState(false); // Confirm delete dialog
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const navigate = useNavigate();
  // Fetch venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);
  // Fetch categories on component mount to map IDs to names
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const providerId = userData._id;
      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/venues/provider/${providerId}`, {
        headers: {
         Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Fetched venues:", result);
      if (result.success) {
        const fetchedVenues = result.data || [];
        console.log("Full fetched venues data:", fetchedVenues);
        setVenues(fetchedVenues);
      } else {
        console.error("Failed to fetch venues:", result.message);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
         Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Fetched categories:", result);
      if (result.success) {
        const map = {};
        (result.data || []).forEach(cat => {
          map[cat._id] = cat.name || cat.title;
        });
        setCategoriesMap(map);
      } else {
        console.error("Failed to fetch categories:", result.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  // Handle view venue details
  const handleViewVenue = (venue) => {
    console.log("Selected venue for modal:", venue);
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
        `${i + 1},${v.venueName},${v.venueAddress},${v.seatingArrangement || "-"},${v.maxGuestsSeated || "-"
        },${v.isActive ? 'Active' : 'Inactive'}`
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
      const response = await fetch(`${API_BASE_URL}/venues/${id}/toggle-active`, {
        method: "PATCH",
        headers: {
         Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setVenues(prev => prev.map(v =>
          v._id === id ? { ...v, isActive: !v.isActive } : v
        ));
      } else {
        console.error("Failed to toggle venue status:", result.message);
      }
    } catch (error) {
      console.error("Error toggling venue status:", error);
    }
  };
  //confim delete
  const confirmDelete = (id) => {
    setVenueToDelete(id);
    setOpenConfirm(true);
  };
  // Delete venue
  const handleDelete = async () => {
    if (!venueToDelete) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/venues/${venueToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        fetchVenues();
        setToastMessage("Venue deleted successfully ✅");
        setToastSeverity("success");
      } else {
        setToastMessage(result.message || "Failed to delete venue ❌");
        setToastSeverity("error");
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Error deleting venue ❌");
      setToastSeverity("error");
    } finally {
      setLoading(false);
      setOpenConfirm(false);
      setVenueToDelete(null);
      setOpenToast(true);
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
          <Typography variant="h4" sx={{ flexGrow: 1, color: "#080303ff" }}>
             Venue Management
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Filters */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" >
          <FormControl sx={{ minWidth: 200}} size="small" >
          <Select
            displayEmpty
            value={pendingFilters.seatingArrangement}
            onChange={(e) =>
              setPendingFilters({
                ...pendingFilters,
                seatingArrangement: e.target.value,
              })
            }
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E15B65',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E15B65',
              },
            }}
          >
            <MenuItem value="" >Select seating arrangement</MenuItem>
            <MenuItem value="Amphitheater">Amphitheater</MenuItem>
            <MenuItem value="Balcony auditorium">Balcony auditorium</MenuItem>
            <MenuItem value="Flat floor auditorium">Flat floor auditorium</MenuItem>
          </Select>
        </FormControl>
          <Button
            variant="outlined" color="#E15B65"
            sx={{ color:'#E15B65',borderRadius: "8px" }}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#E15B65", borderRadius: "8px" }}
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
          <Stack direction="row" spacing={1} flexWrap="wrap" >
            <TextField
              size="small"
              placeholder="Search by venue name" variant="outlined" color="#E15B65"  bgcolor="#E15B65"
              value={pendingFilters.search}  
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, search: e.target.value })
              }
              InputProps={{
                endAdornment: <Search fontSize="small" />,
              }}
               sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E15B65',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E15B65',
        },
      }}/>
            <Button variant="outlined" color="#E15B65" sx={{color:'#E15B65',borderRadius: "8px" }} onClick={handleExport}>
              Export
            </Button>
            <Button variant="outlined" color="#E15B65" sx={{color:'#E15B65',borderRadius: "8px" }}  onClick={fetchVenues} disabled={loading}>
              Refresh
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#E15B65" }}
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
                        sx={{ fontWeight: 600, color: "#396becff" }}
                      >
                        {v.venueName}
                      </Typography>
                    </TableCell>
                    <TableCell>{v.venueAddress}</TableCell>
                    <TableCell >{v.seatingArrangement || "-"}</TableCell>
                    <TableCell>{v.maxGuestsSeated || "-"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={v.isActive}
                        onChange={() => handleToggleStatus(v._id)}
                        disabled={loading}
                         sx={{
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#E15B65',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#E15B65',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#ccc',
    }
  }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          sx={{
                              border: "1px solid #d1d5db",
                              color: "#2e79bbff",
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
                        onClick={() => confirmDelete(v._id)}   // ✅ FIXED
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
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } }}>
        <DialogTitle sx={{ bgcolor: '#E15B65', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'white', color: '#E15B65' }}>
              <Business />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Venue Details
            </Typography>
          </Stack>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <Visibility fontSize="medium" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#fafafa' }}>
          {selectedVenue && (
            <Grid container spacing={3}>
              {/* Basic Information Card */}
              <Grid item xs={12}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><Business /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Basic Information</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Venue Name
                        </Typography>
                        <Typography variant="body1" fontWeight="500">{selectedVenue.venueName || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Category
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {Array.isArray(selectedVenue.categories) && selectedVenue.categories.length > 0
                            ? selectedVenue.categories.map(cat => {
                                const catId = typeof cat === 'object' ? cat._id : cat;
                                return categoriesMap[catId] || catId || 'Unknown Category';
                              }).join(", ")
                            : selectedVenue.category || "-"
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Description
                        </Typography>
                        <Typography variant="body1" fontWeight="500">{selectedVenue.shortDescription || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Address
                        </Typography>
                        <Typography variant="body1" fontWeight="500">{selectedVenue.venueAddress || "-"}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Location Card */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><LocationOn /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Location</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Latitude
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.latitude || "-"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Longitude
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.longitude || "-"}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Operating Hours Card */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><Schedule /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Operating Hours</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Opening Hours
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.openingHours || "-"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Closing Hours
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.closingHours || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Holiday Schedule
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.holidaySchedule || "-"}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Facilities Card */}
              <Grid item xs={12}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><LocalParking /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Facilities & Amenities</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Parking Availability
                        </Typography>
                        <MuiChip label={selectedVenue.parkingAvailability ? "Yes" : "No"} color={selectedVenue.parkingAvailability ? "success" : "default"} size="small" />
                        {selectedVenue.parkingCapacity && (
                          <Typography variant="body2" sx={{ ml: 1 }}>({selectedVenue.parkingCapacity} spots)</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Food & Catering
                        </Typography>
                        <MuiChip label={selectedVenue.foodCateringAvailability ? "Yes" : "No"} color={selectedVenue.foodCateringAvailability ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Stage/Lighting/Audio
                        </Typography>
                        <MuiChip label={selectedVenue.stageLightingAudio ? "Yes" : "No"} color={selectedVenue.stageLightingAudio ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Wheelchair Accessibility
                        </Typography>
                        <MuiChip label={selectedVenue.wheelchairAccessibility ? "Yes" : "No"} color={selectedVenue.wheelchairAccessibility ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Security Arrangements
                        </Typography>
                        <MuiChip label={selectedVenue.securityArrangements ? "Yes" : "No"} color={selectedVenue.securityArrangements ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Wi-Fi Availability
                        </Typography>
                        <MuiChip label={selectedVenue.wifiAvailability ? "Yes" : "No"} color={selectedVenue.wifiAvailability ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          AC Available
                        </Typography>
                        <MuiChip label={selectedVenue.acAvailable ? "Yes" : "No"} color={selectedVenue.acAvailable ? "success" : "default"} size="small" />
                        {selectedVenue.acType && (
                          <Typography variant="body2" sx={{ ml: 1 }}>({selectedVenue.acType})</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Non-AC Available
                        </Typography>
                        <MuiChip label={selectedVenue.nonAcAvailable ? "Yes" : "No"} color={selectedVenue.nonAcAvailable ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Washrooms Info
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.washroomsInfo || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Dressing Rooms
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.dressingRooms || "-"}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pricing Card */}
              <Grid item xs={12}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><AttachMoney /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Pricing & Policies</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Discount
                        </Typography>
                        <Typography variant="body1" fontWeight="500">{selectedVenue.discount ? `${selectedVenue.discount}%` : "-"}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Advance Deposit
                        </Typography>
                        <Typography variant="body1" fontWeight="500">{selectedVenue.advanceDeposit ? `${selectedVenue.advanceDeposit}%` : "-"}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Dynamic Pricing
                        </Typography>
                        <MuiChip label={selectedVenue.dynamicPricing ? "Enabled" : "Disabled"} color={selectedVenue.dynamicPricing ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Multiple Halls
                        </Typography>
                        <MuiChip label={selectedVenue.multipleHalls ? "Yes" : "No"} color={selectedVenue.multipleHalls ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Custom Packages
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.customPackages || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Cancellation Policy
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.cancellationPolicy || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Extra Charges
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.extraCharges || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                          Pricing Schedule
                        </Typography>
                        {selectedVenue.pricingSchedule && Object.keys(selectedVenue.pricingSchedule).length > 0 ? (
                          <MuiTableContainer component={Paper} sx={{ borderRadius: 1 }}>
                            <Table size="small">
                              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Day</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Slot</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Per Day</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Per Hour</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Per Person</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(selectedVenue.pricingSchedule).map(([day, slots]) => (
                                  <React.Fragment key={day}>
                                    {Object.entries(slots).map(([slotType, slot]) => (
                                      slot ? (
                                        <TableRow key={`${day}-${slotType}`} hover>
                                          <TableCell>{day.charAt(0).toUpperCase() + day.slice(1)}</TableCell>
                                          <TableCell>{slotType.charAt(0).toUpperCase() + slotType.slice(1)}</TableCell>
                                          <TableCell>{`${slot.startTime || ''} ${slot.startAmpm || ''} - ${slot.endTime || ''} ${slot.endAmpm || ''}`}</TableCell>
                                          <TableCell>{slot.perDay || "-"}</TableCell>
                                          <TableCell>{slot.perHour || "-"}</TableCell>
                                          <TableCell>{slot.perPerson || "-"}</TableCell>
                                        </TableRow>
                                      ) : null
                                    ))}
                                  </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </MuiTableContainer>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Capacity & Accessibility Card */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><EventSeat /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Capacity & Seating</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Seating Arrangement
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.seatingArrangement || "-"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Max Guests Seated
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.maxGuestsSeated || "-"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Max Guests Standing
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.maxGuestsStanding || "-"}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><Accessibility /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Accessibility</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Elderly Accessibility
                        </Typography>
                        <MuiChip label={selectedVenue.accessibilityInfo ? "Yes" : "No"} color={selectedVenue.accessibilityInfo ? "success" : "default"} size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Accessibility Info
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.accessibilityInfo || "-"}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Additional Info Card */}
              <Grid item xs={12}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: '#E15B65' }}><DirectionsTransit /></Avatar>}
                    title={<Typography variant="h6" fontWeight="bold">Additional Information</Typography>}
                    sx={{ bgcolor: '#f8f9fa', '& .MuiCardHeader-title': { color: '#E15B65' } }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Nearby Transport
                        </Typography>
                        <Typography variant="body2" fontWeight="500">{selectedVenue.nearbyTransport || "-"}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                          Search Tags
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Array.isArray(selectedVenue?.searchTags) && selectedVenue.searchTags.length > 0 ? (
                            selectedVenue.searchTags.map((tag, index) => (
                              <MuiChip key={index} label={tag} size="small" variant="outlined" color="primary" />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleCloseModal} variant="contained" sx={{ bgcolor: '#E15B65', color: 'white', borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this venue?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
             Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
             Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openToast} autoHideDuration={4000} onClose={() => setOpenToast(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setOpenToast(false)} severity={toastSeverity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}