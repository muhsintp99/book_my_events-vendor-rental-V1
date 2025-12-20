// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   TableContainer,
//   Stack,
//   CircularProgress,
//   Alert,
//   Select,
//   MenuItem,
//   IconButton,
//   Chip,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Grid,
//   Divider,
//   Card,
//   CardContent,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ChatIcon from "@mui/icons-material/Chat";
// import CloseIcon from "@mui/icons-material/Close";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import EventIcon from "@mui/icons-material/Event";
// import CategoryIcon from "@mui/icons-material/Category";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const EnquiriesUI = () => {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("all");
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [providerId, setProviderId] = useState(null);
  
//   // Modal state
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);

//   /* ===============================
//      GET PROVIDER ID
//   =============================== */
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       setProviderId(user.providerId || user._id);
//     }
//   }, []);

//   /* ===============================
//      FETCH ENQUIRIES
//   =============================== */
//   useEffect(() => {
//     const fetchEnquiries = async () => {
//       if (!providerId) {
//         setError("Provider ID not found");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await axios.get(
//           `https://api.bookmyevent.ae/api/enquiries/provider/${providerId}`
//         );
//         setEnquiries(res.data.data || []);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch enquiries");
//         setEnquiries([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEnquiries();
//   }, [providerId]);

//   /* ===============================
//      FILTER
//   =============================== */
//   const filteredEnquiries = enquiries.filter((e) => {
//     const matchSearch =
//       (e.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
//       (e.email || "").toLowerCase().includes(search.toLowerCase()) ||
//       (e.contact || "").includes(search) ||
//       (e.moduleId?.title || "").toLowerCase().includes(search.toLowerCase());

//     const matchStatus = status === "all" || e.status === status;
//     return matchSearch && matchStatus;
//   });

//   /* ===============================
//      HANDLE VIEW
//   =============================== */
//   const handleViewEnquiry = (enquiry) => {
//     setSelectedEnquiry(enquiry);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedEnquiry(null);
//   };

//   /* ===============================
//      DETAIL ROW COMPONENT
//   =============================== */
//   const DetailRow = ({ icon, label, value }) => (
//     <Box 
//       display="flex" 
//       alignItems="center" 
//       gap={2} 
//       py={1.5}
//       sx={{
//         borderBottom: "1px solid",
//         borderColor: "divider",
//         "&:last-child": {
//           borderBottom: "none"
//         }
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           width: 40,
//           height: 40,
//           borderRadius: "50%",
//           bgcolor: "primary.light",
//           color: "primary.main",
//           flexShrink: 0
//         }}
//       >
//         {icon}
//       </Box>
//       <Box flex={1}>
//         <Typography variant="caption" color="text.secondary" display="block">
//           {label}
//         </Typography>
//         <Typography variant="body1" fontWeight={500}>
//           {value || "N/A"}
//         </Typography>
//       </Box>
//     </Box>
//   );

//   return (
//     <Box p={2}>
//       <Typography variant="h4" gutterBottom>
//         Enquiries
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <Paper sx={{ mt: 2 }}>
//         {/* SEARCH + FILTER */}
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2} p={2}>
//           <TextField
//             label="Search enquiries"
//             size="small"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             fullWidth
//           />

//           <Select
//             size="small"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             sx={{ minWidth: 160 }}
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="pending">Pending</MenuItem>
//             <MenuItem value="responded">Responded</MenuItem>
//             <MenuItem value="confirmed">Confirmed</MenuItem>
//             <MenuItem value="cancelled">Cancelled</MenuItem>
//           </Select>
//         </Stack>

//         {/* TABLE */}
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Customer</TableCell>
//                 <TableCell>Module</TableCell>
//                 <TableCell>Contact</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <CircularProgress size={28} />
//                   </TableCell>
//                 </TableRow>
//               )}

//               {!loading &&
//                 filteredEnquiries.map((e, i) => (
//                   <TableRow key={e._id} hover>
//                     <TableCell>{i + 1}</TableCell>

//                     <TableCell>
//                       <Typography fontWeight={600}>
//                         {e.fullName}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {e.email}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>{e.moduleId?.title}</TableCell>
//                     <TableCell>{e.contact}</TableCell>

//                     <TableCell>
//                       {new Date(e.bookingDate).toLocaleDateString()}
//                     </TableCell>

//                     <TableCell>
//                       <Chip
//                         size="small"
//                         label={e.status}
//                         color={
//                           e.status === "pending"
//                             ? "warning"
//                             : e.status === "confirmed"
//                             ? "success"
//                             : "default"
//                         }
//                       />
//                     </TableCell>

//                     {/* ACTIONS */}
//                     <TableCell align="center">
//                       <Stack direction="row" spacing={1} justifyContent="center">
//                         {/* CHAT */}
//                         <Tooltip title="Open Chat">
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() =>
//                               navigate("/makeupartist/Enqurychat", {
//                                 state: e,
//                               })
//                             }
//                           >
//                             <ChatIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>

//                         {/* VIEW */}
//                         <Tooltip title="View Enquiry">
//                           <IconButton 
//                             size="small"
//                             color="info"
//                             onClick={() => handleViewEnquiry(e)}
//                           >
//                             <VisibilityIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>

//                         {/* DELETE */}
//                         <Tooltip title="Delete Enquiry">
//                           <IconButton size="small" color="error">
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))}

//               {!loading && filteredEnquiries.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     No enquiries found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* VIEW MODAL */}
//       <Dialog 
//         open={openModal} 
//         onClose={handleCloseModal}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//           }
//         }}
//       >
//         <DialogTitle
//           sx={{
//             bgcolor: "primary.main",
//             color: "white",
//             py: 2.5
//           }}
//         >
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6" fontWeight={600}>
//               Enquiry Details
//             </Typography>
//             <IconButton 
//               onClick={handleCloseModal} 
//               size="small"
//               sx={{ 
//                 color: "white",
//                 "&:hover": {
//                   bgcolor: "rgba(255, 255, 255, 0.1)"
//                 }
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>
        
//         <DialogContent sx={{ p: 0 }}>
//           {selectedEnquiry && (
//             <Box>
//               {/* HEADER CARD - Status */}
//               <Box 
//                 sx={{ 
//                   bgcolor: "grey.50", 
//                   p: 3,
//                   borderBottom: "1px solid",
//                   borderColor: "divider"
//                 }}
//               >
//                 <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Enquiry ID
//                     </Typography>
//                     <Typography variant="body2" fontWeight={500} sx={{ fontFamily: "monospace" }}>
//                       {selectedEnquiry._id}
//                     </Typography>
//                   </Box>
//                   <Chip
//                     label={selectedEnquiry.status?.toUpperCase()}
//                     color={
//                       selectedEnquiry.status === "pending"
//                         ? "warning"
//                         : selectedEnquiry.status === "confirmed"
//                         ? "success"
//                         : selectedEnquiry.status === "cancelled"
//                         ? "error"
//                         : "default"
//                     }
//                     sx={{ fontWeight: 600 }}
//                   />
//                 </Stack>
//               </Box>

//               {/* MAIN CONTENT */}
//               <Box p={3}>
//                 <Grid container spacing={3}>
//                   {/* LEFT COLUMN - Customer Info */}
//                   <Grid item xs={12} md={6}>
//                     <Card variant="outlined" sx={{ height: "100%" }}>
//                       <CardContent>
//                         <Typography 
//                           variant="subtitle1" 
//                           fontWeight={600} 
//                           gutterBottom
//                           sx={{ mb: 2 }}
//                         >
//                           Customer Information
//                         </Typography>
                        
//                         <DetailRow 
//                           icon={<PersonIcon fontSize="small" />}
//                           label="Full Name"
//                           value={selectedEnquiry.fullName}
//                         />
                        
//                         <DetailRow 
//                           icon={<EmailIcon fontSize="small" />}
//                           label="Email Address"
//                           value={selectedEnquiry.email}
//                         />
                        
//                         <DetailRow 
//                           icon={<PhoneIcon fontSize="small" />}
//                           label="Contact Number"
//                           value={selectedEnquiry.contact}
//                         />
//                       </CardContent>
//                     </Card>
//                   </Grid>

//                   {/* RIGHT COLUMN - Booking Info */}
//                   <Grid item xs={12} md={6}>
//                     <Card variant="outlined" sx={{ height: "100%" }}>
//                       <CardContent>
//                         <Typography 
//                           variant="subtitle1" 
//                           fontWeight={600} 
//                           gutterBottom
//                           sx={{ mb: 2 }}
//                         >
//                           Booking Information
//                         </Typography>
                        
//                         <DetailRow 
//                           icon={<CategoryIcon fontSize="small" />}
//                           label="Module/Service"
//                           value={selectedEnquiry.moduleId?.title}
//                         />
                        
//                         <DetailRow 
//                           icon={<EventIcon fontSize="small" />}
//                           label="Booking Date"
//                           value={selectedEnquiry.bookingDate 
//                             ? new Date(selectedEnquiry.bookingDate).toLocaleDateString('en-US', {
//                                 weekday: 'long',
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               })
//                             : null}
//                         />
                        
//                         <DetailRow 
//                           icon={<AccessTimeIcon fontSize="small" />}
//                           label="Created At"
//                           value={selectedEnquiry.createdAt 
//                             ? new Date(selectedEnquiry.createdAt).toLocaleString('en-US', {
//                                 dateStyle: 'medium',
//                                 timeStyle: 'short'
//                               })
//                             : null}
//                         />
//                       </CardContent>
//                     </Card>
//                   </Grid>

//                   {/* MESSAGE SECTION */}
//                   {selectedEnquiry.message && (
//                     <Grid item xs={12}>
//                       <Card variant="outlined">
//                         <CardContent>
//                           <Typography 
//                             variant="subtitle1" 
//                             fontWeight={600} 
//                             gutterBottom
//                           >
//                             Message
//                           </Typography>
//                           <Paper 
//                             variant="outlined" 
//                             sx={{ 
//                               p: 2.5, 
//                               bgcolor: "grey.50",
//                               mt: 1.5,
//                               border: "none"
//                             }}
//                           >
//                             <Typography 
//                               variant="body2" 
//                               sx={{ 
//                                 lineHeight: 1.7,
//                                 whiteSpace: "pre-wrap"
//                               }}
//                             >
//                               {selectedEnquiry.message}
//                             </Typography>
//                           </Paper>
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   )}
//                 </Grid>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ px: 3, py: 2, bgcolor: "grey.50" }}>
//           <Button onClick={handleCloseModal} variant="outlined">
//             Close
//           </Button>
//           <Button 
//             variant="contained"
//             startIcon={<ChatIcon />}
//             onClick={() => {
//               handleCloseModal();
//               navigate("/makeupartist/Enqurychat", {
//                 state: selectedEnquiry,
//               });
//             }}
//           >
//             Open Chat
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default EnquiriesUI;



























import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnquiriesUI = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  /* ===============================
     GET PROVIDER ID
  =============================== */
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setProviderId(user.providerId || user._id);
    }
  }, []);

  /* ===============================
     FETCH ENQUIRIES
  =============================== */
  useEffect(() => {
    const fetchEnquiries = async () => {
      if (!providerId) {
        setError("Provider ID not found");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/enquiries/provider/${providerId}`
        );
        setEnquiries(res.data.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch enquiries");
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [providerId]);

  /* ===============================
     SEARCH FILTER
  =============================== */
  const filteredEnquiries = enquiries.filter((e) => {
    return (
      (e.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.contact || "").includes(search) ||
      (e.moduleId?.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  /* ===============================
     VIEW MODAL
  =============================== */
  const handleViewEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEnquiry(null);
  };

  /* ===============================
     DETAIL ROW
  =============================== */
  const DetailRow = ({ icon, label, value }) => (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      py={1.5}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: "primary.light",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography fontWeight={500}>{value || "N/A"}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Enquiries
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mt: 2 }}>
        {/* SEARCH */}
        <Box p={2}>
          <TextField
            label="Search enquiries"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>

        {/* TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredEnquiries.map((e, i) => (
                  <TableRow key={e._id} hover>
                    <TableCell>{i + 1}</TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>{e.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {e.email}
                      </Typography>
                    </TableCell>

                    <TableCell>{e.moduleId?.title}</TableCell>
                    <TableCell>{e.contact}</TableCell>
                    <TableCell>
                      {new Date(e.bookingDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Chat">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate("/makeupartist/Enqurychat", {
                                state: e,
                              })
                            }
                          >
                            <ChatIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewEnquiry(e)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredEnquiries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No enquiries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* VIEW MODAL */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Enquiry Details</Typography>
            <IconButton onClick={handleCloseModal} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedEnquiry && (
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={600} mb={2}>
                      Customer Information
                    </Typography>

                    <DetailRow
                      icon={<PersonIcon fontSize="small" />}
                      label="Full Name"
                      value={selectedEnquiry.fullName}
                    />
                    <DetailRow
                      icon={<EmailIcon fontSize="small" />}
                      label="Email"
                      value={selectedEnquiry.email}
                    />
                    <DetailRow
                      icon={<PhoneIcon fontSize="small" />}
                      label="Contact"
                      value={selectedEnquiry.contact}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={600} mb={2}>
                      Booking Information
                    </Typography>

                    <DetailRow
                      icon={<CategoryIcon fontSize="small" />}
                      label="Module"
                      value={selectedEnquiry.moduleId?.title}
                    />
                    <DetailRow
                      icon={<EventIcon fontSize="small" />}
                      label="Booking Date"
                      value={new Date(
                        selectedEnquiry.bookingDate
                      ).toLocaleDateString()}
                    />
                    <DetailRow
                      icon={<AccessTimeIcon fontSize="small" />}
                      label="Created At"
                      value={new Date(
                        selectedEnquiry.createdAt
                      ).toLocaleString()}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={() => {
              handleCloseModal();
              navigate("/makeupartist/Enqurychat", {
                state: selectedEnquiry,
              });
            }}
          >
            Open Chat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnquiriesUI;
