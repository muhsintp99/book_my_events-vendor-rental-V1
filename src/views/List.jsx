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
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import { Visibility, Edit, Delete, Search } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Vehicles() {
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openToast, setOpenToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState("success");
//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     type: "",
//     search: "",
//   });
//   const [pendingFilters, setPendingFilters] = useState({
//     brand: "",
//     category: "",
//     type: "",
//     search: "",
//   });
//   const navigate = useNavigate();
//   const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.bookmyevent.ae/api";

//   // Fetch vehicles data
//   const fetchVehicles = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/vehicles`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setVehicles(Array.isArray(response.data.data) ? response.data.data : []);
//       setError("");
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to fetch vehicles");
//       console.error("Error fetching vehicles:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial data load
//   useEffect(() => {
//     fetchVehicles();
//   }, []);

//   // Apply filters
//   const handleApplyFilters = () => {
//     setFilters(pendingFilters);
//   };

//   // Reset filters
//   const handleReset = () => {
//     setFilters({ brand: "", category: "", type: "", search: "" });
//     setPendingFilters({ brand: "", category: "", type: "", search: "" });
//   };

//   // Export CSV
//   const handleExport = () => {
//     const headers = [
//       "Sl,Name,Code,Category,Brand,Type,Total Trip,Hourly,Distance,Daily,New,Active",
//     ];
//     const rows = filteredVehicles.map(
//       (v, i) =>
//         `${i + 1},${v.name || ""},${v.vinNumber || ""},${v.category?.title || ""},${
//           v.brand?.title || ""
//         },${v.type || ""},${v.totalTrips || 0},${v.pricing?.hourly || "-"},${
//           v.pricing?.distance || "-"
//         },${v.pricing?.perDay || "-"},${v.isNew ? "Yes" : "No"},${
//           v.isActive ? "Active" : "Inactive"
//         }`
//     );
//     const csv = headers.concat(rows).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "vehicles.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   // Handle status toggle
//   const handleStatusToggle = async (vehicleId, field, currentValue) => {
//     try {
//       const endpoint =
//         field === "isActive"
//           ? currentValue
//             ? "block"
//             : "reactivate"
//           : "toggle-new-tag";
//       await axios.patch(
//         `${API_BASE_URL}/vehicles/${vehicleId}/${endpoint}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       setVehicles((prev) =>
//         prev.map((v) =>
//           v._id === vehicleId ? { ...v, [field]: !currentValue } : v
//         )
//       );
//       setToastMessage(
//         `Vehicle ${field === "isActive" ? "status" : "new tag"} updated successfully`
//       );
//       setToastSeverity("success");
//       setOpenToast(true);
//     } catch (error) {
//       setToastMessage(
//         error.response?.data?.message || "Failed to update vehicle"
//       );
//       setToastSeverity("error");
//       setOpenToast(true);
//     }
//   };

//   // Handle vehicle deletion
//   const handleDelete = async (vehicleId) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/vehicles/${vehicleId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
//       setToastMessage("Vehicle deleted successfully");
//       setToastSeverity("success");
//       setOpenToast(true);
//     } catch (error) {
//       setToastMessage(
//         error.response?.data?.message || "Failed to delete vehicle"
//       );
//       setToastSeverity("error");
//       setOpenToast(true);
//     }
//   };

//   // Handle edit vehicle
//   const handleEdit = async (vehicleId) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       const vehicleData = response.data.data || response.data;
//       navigate(`/vehicle-setup/leads/${vehicleId}`, { state: { vehicle: vehicleData } });
//     } catch (error) {
//       setToastMessage(
//         error.response?.data?.message || "Failed to fetch vehicle data"
//       );
//       setToastSeverity("error");
//       setOpenToast(true);
//     }
//   };

//   // Filtering logic
//   const filteredVehicles = vehicles.filter((v) => {
//     return (
//       (filters.brand ? v.brand?._id === filters.brand : true) &&
//       (filters.category ? v.category?._id === filters.category : true) &&
//       (filters.type ? v.type === filters.type : true) &&
//       (filters.search
//         ? v.name?.toLowerCase().includes(filters.search.toLowerCase())
//         : true)
//     );
//   });

//   // Get unique brands, categories, and types from vehicles
//   const uniqueBrands = [
//     ...new Set(vehicles.map((v) => JSON.stringify({ _id: v.brand?._id, title: v.brand?.title }))),
//   ].map((str) => JSON.parse(str)).filter((b) => b._id && b.title);
//   const uniqueCategories = [
//     ...new Set(vehicles.map((v) => JSON.stringify({ _id: v.category?._id, title: v.category?.title }))),
//   ].map((str) => JSON.parse(str)).filter((c) => c._id && c.title);
//   const uniqueTypes = [
//     ...new Set(vehicles.map((v) => v.type).filter(Boolean)),
//   ];

//   const handleCloseToast = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpenToast(false);
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           bgcolor: "#fafafa",
//           minHeight: "100vh",
//           p: 2,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
//       {/* Navbar */}
//       <AppBar position="static" color="default" elevation={0}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
//             🚗 CityRide Rentals
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       {error && (
//         <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}
//       {/* Filters */}
//       <Paper sx={{ p: 2, mt: 2 }}>
//         <Stack direction="row" spacing={2} flexWrap="wrap">
//           <FormControl sx={{ minWidth: 200 }} size="small">
//             <Select
//               displayEmpty
//               value={pendingFilters.brand}
//               onChange={(e) =>
//                 setPendingFilters({ ...pendingFilters, brand: e.target.value })
//               }
//             >
//               <MenuItem value="">Select vehicle brand</MenuItem>
//               {uniqueBrands.map((brand) => (
//                 <MenuItem key={brand._id} value={brand._id}>
//                   {brand.title}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl sx={{ minWidth: 200 }} size="small">
//             <Select
//               displayEmpty
//               value={pendingFilters.category}
//               onChange={(e) =>
//                 setPendingFilters({
//                   ...pendingFilters,
//                   category: e.target.value,
//                 })
//               }
//             >
//               <MenuItem value="">Select vehicle category</MenuItem>
//               {uniqueCategories.map((category) => (
//                 <MenuItem key={category._id} value={category._id}>
//                   {category.title}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl sx={{ minWidth: 200 }} size="small">
//             <Select
//               displayEmpty
//               value={pendingFilters.type}
//               onChange={(e) =>
//                 setPendingFilters({ ...pendingFilters, type: e.target.value })
//               }
//             >
//               <MenuItem value="">Select vehicle type</MenuItem>
//               {uniqueTypes.map((type) => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
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
//             Total Vehicles{" "}
//             <Chip
//               label={filteredVehicles.length}
//               color="success"
//               size="small"
//               sx={{ ml: 1 }}
//             />
//           </Typography>
//           <Stack direction="row" spacing={1} flexWrap="wrap">
//             <TextField
//               size="small"
//               placeholder="Search by vehicle name"
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
//             <Button
//               variant="contained"
//               sx={{ bgcolor: "#2563eb" }}
//               onClick={() => navigate("/vehicle-setup/leads")}
//             >
//               New Vehicle
//             </Button>
//           </Stack>
//         </Stack>
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ bgcolor: "#f9fafb" }}>
//               <TableRow>
//                 <TableCell>Sl</TableCell>
//                 <TableCell>Vehicle Info</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Brand</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Total Trips</TableCell>
//                 <TableCell>Trip Fare</TableCell>
//                 <TableCell>Details</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredVehicles.map((v, i) => (
//                 <TableRow key={v._id}>
//                   <TableCell>{i + 1}</TableCell>
//                   <TableCell>
//                     <Typography
//                       variant="body2"
//                       sx={{ fontWeight: 600, color: "#2563eb" }}
//                     >
//                       {v.name || "N/A"}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       VIN: {v.vinNumber || "N/A"}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary" display="block">
//                       License: {v.licensePlateNumber || "N/A"}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>{v.category?.title || "N/A"}</TableCell>
//                   <TableCell>{v.brand?.title || "N/A"}</TableCell>
//                   <TableCell>{v.type || "N/A"}</TableCell>
//                   <TableCell>{v.totalTrips || 0}</TableCell>
//                   <TableCell>
//                     {v.pricing?.hourly && (
//                       <Typography variant="body2">
//                         Hourly: ${v.pricing.hourly}
//                       </Typography>
//                     )}
//                     {v.pricing?.distance && (
//                       <Typography variant="body2">
//                         Distance: ${v.pricing.distance}/km
//                       </Typography>
//                     )}
//                     {v.pricing?.perDay && (
//                       <Typography variant="body2">
//                         Daily: ${v.pricing.perDay}
//                       </Typography>
//                     )}
//                     {!v.pricing?.hourly &&
//                       !v.pricing?.distance &&
//                       !v.pricing?.perDay && (
//                         <Typography variant="body2" color="text.secondary">
//                           No pricing set
//                         </Typography>
//                       )}
//                     {v.discount && (
//                       <Typography variant="body2" color="success.main">
//                         Discount: {v.discount}%
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       Engine: {v.engineCapacity || "N/A"}cc, {v.enginePower || "N/A"}hp
//                     </Typography>
//                     <Typography variant="body2">
//                       Seats: {v.seatingCapacity || "N/A"}
//                     </Typography>
//                     <Typography variant="body2">
//                       Fuel: {v.fuelType || "N/A"}
//                     </Typography>
//                     <Typography variant="body2">
//                       Transmission: {v.transmissionType || "N/A"}
//                     </Typography>
//                     <Typography variant="body2">
//                       A/C: {v.airCondition ? "Yes" : "No"}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={v.isActive !== false}
//                       onChange={() =>
//                         handleStatusToggle(
//                           v._id,
//                           "isActive",
//                           v.isActive !== false
//                         )
//                       }
//                     />
//                     {v.isNew && <Chip label="New" color="primary" size="small" />}
//                   </TableCell>
//                   <TableCell>
//                     <Stack direction="row" spacing={1}>
//                       <IconButton
//                         size="small"
//                         sx={{
//                           border: "1px solid #d1d5db",
//                           color: "#2563eb",
//                           borderRadius: "8px",
//                         }}
//                         onClick={() => navigate(`/vehicle-setup/listview/${v._id}`)}
//                       >
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         sx={{
//                           border: "1px solid #d1d5db",
//                           color: "#065f46",
//                           borderRadius: "8px",
//                         }}
//                         onClick={() => handleEdit(v._id)}
//                       >
//                         <Edit fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         sx={{
//                           border: "1px solid #d1d5db",
//                           color: "#dc2626",
//                           borderRadius: "8px",
//                         }}
//                         onClick={() => handleDelete(v._id)}
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {filteredVehicles.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={10} align="center">
//                     {vehicles.length === 0
//                       ? "No vehicles found. Add your first vehicle!"
//                       : "No vehicles match the current filters"}
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//       {/* Toast Message */}
//       <Snackbar
//         open={openToast}
//         autoHideDuration={3000}
//         onClose={handleCloseToast}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseToast}
//           severity={toastSeverity}
//           sx={{
//             backgroundColor: toastSeverity === "success" ? "#1976d2" : "#d32f2f",
//             color: "white",
//           }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }



















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
  DialogTitle,DialogContent,DialogActions
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
  const [filters, setFilters] = useState({ brand: "", category: "", type: "", search: "" });
  const [pendingFilters, setPendingFilters] = useState({ brand: "", category: "", type: "", search: "" });
  const [localSearch, setLocalSearch] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.bookmyevent.ae/api";

  // Fetch vehicles data
  // Fetch vehicles data
const fetchVehicles = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // Corrected fix: Access the nested 'vehicles' array
const data = Array.isArray(response.data.data)
  ? response.data.data
  : response.data.data?.vehicles || response.data.vehicles || response.data.data || response.data || [];
    setVehicles(Array.isArray(data) ? data : []);
    setError("");
    console.log("Fetched vehicles array:", data); // This should now log the actual array of 2 vehicles
    console.log("Vehicles length after set:", Array.isArray(data) ? data.length : 0);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to fetch vehicles");
    console.error("Error fetching vehicles:", error);
  } finally {
    setLoading(false);
  }
};

  // Initial data load
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
  setFilters({ 
    ...filters, 
    brand: pendingFilters.brand, 
    category: pendingFilters.category, 
    type: pendingFilters.type 
  });
};

  // Reset filters
  const handleReset = () => {
    setFilters({ brand: "", category: "", type: "", search: "" });
    setPendingFilters({ brand: "", category: "", type: "", search: "" });
    setLocalSearch('');
  };

  // Handle search click
const handleSearch = () => {
  setFilters(prev => ({ ...prev, search: localSearch }));
};

// Handle clear search
const handleClear = () => {
  setLocalSearch('');
  setFilters(prev => ({ ...prev, search: '' }));
};
const confirmDelete = (vehicleId) => {
  setVehicleToDelete(vehicleId);
  setOpenDeleteDialog(true);
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
        },${v.pricing?.perDay || "-"},${v.isNew ? "Yes" : "No"},${v.isActive ? "Active" : "Inactive"}`
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
      const endpoint = field === "isActive" ? (currentValue ? "block" : "reactivate") : "toggle-new-tag";
      await axios.patch(
        `${API_BASE_URL}/vehicles/${vehicleId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? { ...v, [field]: !currentValue } : v))
      );
      setToastMessage(
        `Vehicle ${field === "isActive" ? "status" : "new tag"} updated successfully`
      );
      setToastSeverity("success");
      setOpenToast(true);
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to update vehicle");
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  // Handle vehicle deletion
  const handleDelete = async () => {
  if (!vehicleToDelete) return;
  try {
    await axios.delete(`${API_BASE_URL}/vehicles/${vehicleToDelete}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setVehicles((prev) => prev.filter((v) => v._id !== vehicleToDelete));
    setToastMessage("Vehicle deleted successfully");
    setToastSeverity("success");
    setOpenToast(true);
  } catch (error) {
    setToastMessage(error.response?.data?.message || "Failed to delete vehicle");
    setToastSeverity("error");
    setOpenToast(true);
  } finally {
    setOpenDeleteDialog(false);
    setVehicleToDelete(null);
  }
};


  // Handle edit vehicle
  const handleEdit = async (vehicleId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const vehicleData = response.data.data || response.data;
      console.log("Navigating with vehicle data:", vehicleData); // Debug log
      navigate(`/vehicle-setup/leads/${vehicleId}`, { state: { vehicle: vehicleData } });
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to fetch vehicle data");
      setToastSeverity("error");
      setOpenToast(true);
      console.error("Error fetching vehicle for edit:", error);
    }
  };

  // Filtering logic
 const filteredVehicles = vehicles.filter((v) => {
  return (
    (filters.brand ? v.brand?._id === filters.brand : true) &&
    (filters.category ? v.category?._id === filters.category : true) &&
    (filters.type ? v.type === filters.type : true) &&
(filters.search ? (v.name || '').toLowerCase().includes(filters.search.toLowerCase()) : true)  );
});

  // Get unique brands, categories, and types from vehicles
  const uniqueBrands = [
    ...new Set(vehicles.map((v) => JSON.stringify({ _id: v.brand?._id, title: v.brand?.title }))),
  ]
    .map((str) => JSON.parse(str))
    .filter((b) => b._id && b.title);
  const uniqueCategories = [
    ...new Set(vehicles.map((v) => JSON.stringify({ _id: v.category?._id, title: v.category?.title }))),
  ]
    .map((str) => JSON.parse(str))
    .filter((c) => c._id && c.title);
  const uniqueTypes = [...new Set(vehicles.map((v) => v.type).filter(Boolean))];

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
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
      {/* Navbar */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
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
            <Select
              displayEmpty
              value={pendingFilters.brand}
              onChange={(e) => setPendingFilters({ ...pendingFilters, brand: e.target.value })}
            >
              <MenuItem value="">Select vehicle brand</MenuItem>
              {uniqueBrands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.category}
              onChange={(e) =>
                setPendingFilters({ ...pendingFilters, category: e.target.value })
              }
            >
              <MenuItem value="">Select vehicle category</MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={pendingFilters.type}
              onChange={(e) => setPendingFilters({ ...pendingFilters, type: e.target.value })}
            >
              <MenuItem value="">Select vehicle type</MenuItem>
              {uniqueTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
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
            Total Vehicles <Chip label={filteredVehicles.length} color="success" size="small" sx={{ ml: 1 }} />
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
            sx={{ color: localSearch ? 'inherit' : 'action' }}
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
  <Button variant="outlined" onClick={handleExport}>
    Export
  </Button>
  <Button
    variant="contained"
    sx={{ bgcolor: "#2563eb" }}
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
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehicles.map((v, i) => (
                <TableRow key={v._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#2563eb" }}>
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
                      <Typography variant="body2">Hourly: ${v.pricing.hourly}</Typography>
                    )}
                    {v.pricing?.distance && (
                      <Typography variant="body2">Distance: ${v.pricing.distance}/km</Typography>
                    )}
                    {v.pricing?.perDay && (
                      <Typography variant="body2">Daily: ${v.pricing.perDay}</Typography>
                    )}
                    {!v.pricing?.hourly && !v.pricing?.distance && !v.pricing?.perDay && (
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
                    <Typography variant="body2">Seats: {v.seatingCapacity || "N/A"}</Typography>
                    <Typography variant="body2">Fuel: {v.fuelType || "N/A"}</Typography>
                    <Typography variant="body2">
                      Transmission: {v.transmissionType || "N/A"}
                    </Typography>
                    <Typography variant="body2">A/C: {v.airCondition ? "Yes" : "No"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={v.isActive !== false}
                      onChange={() => handleStatusToggle(v._id, "isActive", v.isActive !== false)}
                    />
                    {v.isNew && <Chip label="New" color="primary" size="small" />}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        sx={{ border: "1px solid #d1d5db", color: "#2563eb", borderRadius: "8px" }}
                        onClick={() => navigate(`/vehicle-setup/listview/${v._id}`)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ border: "1px solid #d1d5db", color: "#065f46", borderRadius: "8px" }}
                        onClick={() => handleEdit(v._id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ border: "1px solid #d1d5db", color: "#dc2626", borderRadius: "8px" }}
onClick={() => confirmDelete(v._id)}                      >
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
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Toast Message */}
      {/* Confirm Delete Dialog */}
<Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to delete this vehicle? This action cannot be undone.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
    <Button
      onClick={handleDelete}
      variant="contained"
      color="error"
    >
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