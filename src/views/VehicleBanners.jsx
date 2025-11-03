// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Snackbar,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// const API_URL = "https://api.bookmyevent.ae/api/vehicle-banners";
// const ZONE_API_URL = "https://api.bookmyevent.ae/api/zones";
// // Public base URL for vehicle banner images
// const PUBLIC_IMAGE_BASE = "https://api.bookmyevent.ae/uploads/vehicle-banners";
// // Styled drop area
// const UploadDropArea = styled(Box)(({ theme }) => ({
//   border: "2px dashed #e0e0e0",
//   borderRadius: 8,
//   height: 180,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   flexDirection: "column",
//   cursor: "pointer",
//   backgroundColor: "#fafafa",
//   "&:hover": { backgroundColor: "#f0f0f0" },
// }));
// const VehicleBanners = () => {
//   const [title, setTitle] = useState("");
//   const [zone, setZone] = useState("");
//   const [zones, setZones] = useState([]);
//   const [link, setLink] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [bannerType, setBannerType] = useState("");
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState("success");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [bannerToDelete, setBannerToDelete] = useState(null);
//   const [showForm, setShowForm] = useState(true);
//   const navigate = useNavigate();
//   useEffect(() => {
//     fetchBanners();
//     fetchZones();
//   }, []);
//   const showToast = (message, severity = "success") => {
//     setToastMessage(message);
//     setToastSeverity(severity);
//     setToastOpen(true);
//   };
//   // Transform local image path to public URL - more robust version
//   const transformImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     console.log(`Transforming image path: ${imagePath}`); // Debug log
//     if (imagePath.startsWith('http')) {
//       console.log(`Already HTTP: ${imagePath}`);
//       return imagePath;
//     }
//     // If it's a relative path starting with /uploads
//     if (imagePath.startsWith('/uploads/')) {
//       const publicUrl = `https://api.bookmyevent.ae${imagePath}`;
//       console.log(`Transformed relative /uploads to: ${publicUrl}`);
//       return publicUrl;
//     }
//     // If it's a full server path, replace the prefix
//     if (imagePath.includes('/var/www/backend/Uploads/')) {
//       const publicUrl = `https://api.bookmyevent.ae${imagePath.replace('/var/www/backend/Uploads/', '/uploads/')}`;
//       console.log(`Transformed server path to: ${publicUrl}`);
//       return publicUrl;
//     }
//     // If it's just a filename, append to base
//     const publicUrl = `${PUBLIC_IMAGE_BASE}/${imagePath}`;
//     console.log(`Assumed filename, appended to base: ${publicUrl}`);
//     return publicUrl;
//   };
//   // Fetch Zones
//   const fetchZones = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(ZONE_API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const fetched = response.data?.data || [];
//       setZones(fetched);
//     } catch (error) {
//       console.error("Error fetching zones:", error);
//       showToast("Failed to load zones", "error");
//     }
//   };
//   // Fetch Banners
//   const fetchBanners = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const fetched = response.data?.data?.banners || [];
//       // Log original image paths
//       console.log('Original banner images from API:', fetched.map(b => ({ title: b.title, image: b.image })));
//       // Transform local paths to public URLs
//       const transformedBanners = fetched.map((banner) => ({
//         ...banner,
//         image: transformImageUrl(banner.image),
//       }));
//       // Log transformed
//       console.log('Transformed banner image URLs:', transformedBanners.map(b => ({ title: b.title, image: b.image })));
//       setBanners(transformedBanners);
//     } catch (error) {
//       console.error("Error fetching banners:", error);
//       showToast("Failed to load banners", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Image Upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
//       return showToast("Only JPG, JPEG, PNG files allowed", "error");
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       return showToast("File size must be less than 2MB", "error");
//     }
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };
//   // Reset form fields without affecting showForm
//   const resetFormFields = () => {
//     setTitle("");
//     setLink("");
//     setZone("");
//     setImage(null);
//     setPreview(null);
//     setEditId(null);
//     setBannerType("");
//   };
//   // CREATE or UPDATE
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return showToast("Title is required", "error");
//     if (!zone) return showToast("Please select a zone", "error");
//     if (!bannerType) return showToast("Please select a banner type", "error");
//     if (!image && !editId) return showToast("Banner image is required", "error");
//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("link", link);
//       formData.append("zone", zone);
//       formData.append("bannerType", bannerType);
//       if (image) formData.append("image", image);
//       if (editId) {
//         await axios.put(`${API_URL}/${editId}`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         showToast("Banner updated successfully!");
//       } else {
//         await axios.post(API_URL, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         showToast("Banner added successfully!");
//       }
//       // Reset fields and switch to list view
//       resetFormFields();
//       setShowForm(false);
//       fetchBanners();
//     } catch (error) {
//       console.error("Banner submit error:", error);
//       console.error("Response:", error.response?.data);
//       showToast(error.response?.data?.message || "Operation failed", "error");
//     }
//   };
//   // DELETE
//   const handleDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_URL}/${bannerToDelete}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       showToast("Banner deleted successfully!");
//       fetchBanners();
//     } catch (error) {
//       console.error("Delete failed:", error);
//       showToast("Failed to delete banner", "error");
//     } finally {
//       setDeleteDialogOpen(false);
//       setBannerToDelete(null);
//     }
//   };
//   const openDeleteDialog = (id) => {
//     setBannerToDelete(id);
//     setDeleteDialogOpen(true);
//   };
//   // EDIT
//   const handleEdit = (banner) => {
//     // Since banners have transformed images, use that
//     setEditId(banner._id);
//     setTitle(banner.title);
//     setLink(banner.link || "");
//     setPreview(banner.image); // Already transformed
//     setZone(banner.zone?._id || banner.zone || "");
//     setBannerType(banner.bannerType || "");
//     setShowForm(true);
//   };
//   const handleReset = () => {
//     resetFormFields();
//     setShowForm(true);
//   };
//   const handleAddNew = () => {
//     resetFormFields();
//     setShowForm(true);
//   };
//   return (
//     <Box sx={{ p: 3, backgroundColor: "#fff", minHeight: "100vh" }}>
//       {showForm ? (
//         <>
//           <Typography variant="h5" sx={{ mb: 3 }}>
//             {editId ? "Edit Banner" : "Add New Banner"}
//           </Typography>
//           {/* Banner Form */}
//           <Card sx={{ p: 2, mb: 4, border: "1px solid #e0e0e0" }}>
//             <CardContent>
//               <TextField
//                 fullWidth
//                 label="Vehicle Banner Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 sx={{ mb: 2 }}
//               />
//               {/* Zone Dropdown */}
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel>Select Zone</InputLabel>
//                 <Select
//                   value={zone}
//                   label="Select Zone"
//                   onChange={(e) => setZone(e.target.value)}
//                 >
//                   {zones.length > 0 ? (
//                     zones.map((z) => (
//                       <MenuItem key={z._id || z.id} value={z._id || z.id}>
//                         {z.zoneName || z.name}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem disabled>No zones available</MenuItem>
//                   )}
//                 </Select>
//               </FormControl>
//               {/* Banner Type Dropdown */}
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel>Banner Type</InputLabel>
//                 <Select
//                   value={bannerType}
//                   label="Banner Type"
//                   onChange={(e) => setBannerType(e.target.value)}
//                 >
//                   <MenuItem value="top_deal">Top Deal</MenuItem>
//                   <MenuItem value="cash_back">Cash Back</MenuItem>
//                   <MenuItem value="zone_wise">Zone Wise</MenuItem>
//                 </Select>
//               </FormControl>
//               <TextField
//                 fullWidth
//                 label="Banner Link (Optional)"
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//                 sx={{ mb: 3 }}
//               />
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                 Banner Image
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 JPG, JPEG, PNG Less Than 2MB (Ratio 3:1)
//               </Typography>
//               <UploadDropArea onClick={() => document.getElementById("banner-upload").click()} sx={{borderColor:'#E15B65'}}>
//                 {preview ? (
//                   <img src={preview} alt="Preview" style={{ maxHeight: 160, borderRadius: 8 }} 
//                        onError={(e) => {
//                          console.error(`Preview image failed to load: ${preview}`);
//                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjREREOEREOiIvPgo8dGV4dCB4PSI4MCIgeT0iODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0JCMkIyQiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJldmlldyBQbGFjZWhvbGRlcjwvdGV4dD4KPC9zdmc+Cg==';
//                        }}
//                   />
//                 ) : (
//                   <>
//                     <Typography variant="body2" color="#E15B65">
//                       Click to upload
//                     </Typography>
//                     <Typography variant="caption" color="#E15B65">
//                       Or drag and drop
//                     </Typography>
//                   </>
//                 )}
//                 <input
//                   id="banner-upload"
//                   type="file"
//                   accept="image/jpeg,image/png"
//                   style={{ display: "none" }}
//                   onChange={handleImageUpload}
//                 />
//               </UploadDropArea>
//             </CardContent>
//           </Card>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//             <Button
//               variant="outlined"
//               onClick={() => setShowForm(false)}
//               sx={{ color: '#E15B65', borderColor: '#E15B65' }}
//             >
//               View Banners List
//             </Button>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Button variant="outlined" onClick={handleReset} sx={{color:'#E15B65', borderColor: '#E15B65' }}>
//                 Cancel
//               </Button>
//               <Button variant="contained" onClick={handleSubmit} sx={{color:'white', bgcolor:'#E15B65'}}>
//                 {editId ? "Update" : "Submit"}
//               </Button>
//             </Box>
//           </Box>
//         </>
//       ) : (
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//           <Button
//             variant="outlined"
//             onClick={() => navigate(-1)}
//             sx={{ color: '#E15B65', borderColor: '#E15B65' }}
//           >
//             Back
//           </Button>
//           <Typography variant="h5">Banner Management</Typography>
//           <Button variant="contained" onClick={handleAddNew} sx={{color:'white', bgcolor:'#E15B65'}}>
//             Add New Banner
//           </Button>
//         </Box>
//       )}
//       {!showForm && (
//         <>
//           {/* Banner List */}
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Banner List{" "}
//             <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: 12 }}>
//               {banners.length}
//             </span>
//           </Typography>
//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <Card sx={{ border: "1px solid #e0e0e0" }}>
//               <CardContent>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: "bold" }}>SL</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Banner Info</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Zone</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Link</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {banners.length > 0 ? (
//                       banners.map((b, index) => (
//                         <TableRow key={b._id}>
//                           <TableCell>{index + 1}</TableCell>
//                           <TableCell>
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                               <img
//                                 src={b.image || ''}
//                                 alt={b.title}
//                                 style={{
//                                   width: 80,
//                                   height: 40,
//                                   borderRadius: 6,
//                                   objectFit: "cover",
//                                   border: "1px solid #ddd",
//                                 }}
//                                 onLoad={() => console.log(`Successfully loaded list image: ${b.image}`)}
//                                 onError={(e) => {
//                                   console.error(`List image failed to load: ${b.image}`);
//                                   e.target.onerror = null; // Prevent further errors
//                                   e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA4MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjREREOEREOiIvPgo8dGV4dCB4PSI0MCIgeT0iMjIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0JCMkIyQiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGxhY2Vob2xkZXI8L3RleHQ+Cjwvc3ZnPgo=';
//                                 }}
//                               />
//                               <Typography>{b.title}</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>{b.zone?.name || "-"}</TableCell>
//                           <TableCell>{b.bannerType || "-"}</TableCell>
//                           <TableCell>
//                             <a href={b.link} target="_blank" rel="noreferrer">
//                               {b.link || "-"}
//                             </a>
//                           </TableCell>
//                           <TableCell>
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               color="success"
//                               onClick={() => handleEdit(b)}
//                               sx={{ mr: 1 }}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               size="small"
//                               color="error"
//                               variant="outlined"
//                               onClick={() => openDeleteDialog(b._id)}
//                             >
//                               Delete
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center">
//                           <Typography color="text.secondary">No Data Found</Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           )}
//         </>
//       )}
//       {/* Snackbar */}
//       <Snackbar
//         open={toastOpen}
//         autoHideDuration={4000}
//         onClose={() => setToastOpen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: "100%" }}>
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this banner? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };
// export default VehicleBanners;