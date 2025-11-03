// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   Snackbar,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { styled } from "@mui/system";

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
//   "&:hover": {
//     backgroundColor: "#f0f0f0",
//   },
// }));

// const Banner = () => {
//   const [tab, setTab] = useState(0);
//   const [title, setTitle] = useState("");
//   const [link, setLink] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState("success");

//   // Handle Tab Change
//   const handleTabChange = (event, newValue) => {
//     setTab(newValue);
//   };

//   // Handle Image Upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
//       setToastMessage("Only JPG, JPEG, PNG files allowed");
//       setToastSeverity("error");
//       setToastOpen(true);
//       return;
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       setToastMessage("File size must be less than 2MB");
//       setToastSeverity("error");
//       setToastOpen(true);
//       return;
//     }
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       setToastMessage("Title is required");
//       setToastSeverity("error");
//       setToastOpen(true);
//       return;
//     }
//     if (!image) {
//       setToastMessage("Banner image is required");
//       setToastSeverity("error");
//       setToastOpen(true);
//       return;
//     }
//     console.log({
//       language: tab === 0 ? "Default" : tab === 1 ? "English" : "Arabic",
//       title,
//       link,
//       image,
//     });
//     setToastMessage("Banner submitted successfully!");
//     setToastSeverity("success");
//     setToastOpen(true);
//     handleReset();
//   };

//   const handleReset = () => {
//     setTitle("");
//     setLink("");
//     setImage(null);
//     setPreview(null);
//   };

//   return (
//     <Box sx={{ p: 3, backgroundColor: "#fff", minHeight: "100vh", width: "100%" }}>
//       <Box sx={{ maxWidth: "lg", margin: "auto" }}>
//         {/* Header */}
//         <Typography variant="h5" sx={{ mb: 3 }}>
//           Add New Banner
//         </Typography>
//         <Card sx={{ p: 2, boxShadow: "none", border: "1px solid #e0e0e0" }}>
//           <CardContent>
//             {/* Tabs */}
//             <Tabs
//               value={tab}
//               onChange={handleTabChange}
//               sx={{ mb: 2 }}
//               textColor="primary"
//               indicatorColor="primary"
//             >
//               <Tab label="Default" />
            
//             </Tabs>
//             {/* Title */}
//             <TextField
//               fullWidth
//               label={`Title (${tab === 0 ? "Default" : tab === 1 ? "EN" : "AR"})`}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="New banner"
//               sx={{ mb: 2 }}
//             />
//             {/* Link */}
//             <TextField
//               fullWidth
//               label="Default Link (Optional)"
//               value={link}
//               onChange={(e) => setLink(e.target.value)}
//               placeholder="Default link"
//               sx={{ mb: 3 }}
//             />
//             {/* Banner Image */}
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>
//               Banner Image
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               JPG, JPEG, PNG Less Than 2MB
//             </Typography>
//             <UploadDropArea
//               onClick={() => document.getElementById("banner-upload").click()}
//             >
//               {preview ? (
//                 <img
//                   src={preview}
//                   alt="Preview"
//                   style={{ maxHeight: 160, borderRadius: 8 }}
//                 />
//               ) : (
//                 <>
//                   <Typography variant="body2" color="text.secondary">
//                     Click to upload
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     Or drag and drop
//                   </Typography>
//                 </>
//               )}
//               <input
//                 id="banner-upload"
//                 type="file"
//                 accept="image/jpeg,image/png"
//                 style={{ display: "none" }}
//                 onChange={handleImageUpload}
//               />
//             </UploadDropArea>
//           </CardContent>
//         </Card>
//         {/* Buttons */}
//         <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
//           <Button variant="outlined" onClick={handleReset} size="large">
//             Reset
//           </Button>
//           <Button variant="contained" type="submit" size="large" onClick={handleSubmit}>
//             Submit
//           </Button>
//         </Box>

//         {/* Banner List Section */}
//         <Box sx={{ mt: 4 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography variant="h6">Banner List <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: 12 }}>0</span></Typography>
//             <Box>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search by banner title..."
//                 size="small"
//                 sx={{ mr: 2 }}
//               />
//               <Button variant="contained" size="small" sx={{ backgroundColor: "#3287d7ff", color: "#fff" }}>
//                 Export
//               </Button>
//             </Box>
//           </Box>
//           <Card sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
//             <CardContent>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: "bold" }}>SL</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Banner Info</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Banner Type</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Featured</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell colSpan={6} align="center">
//                       <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                         <Box
//                           component="img"
//                           src="https://via.placeholder.com/150?text=No+Data+Found"
//                           alt="No Data Found"
//                           sx={{ width: 150, height: 150 }}
//                         />
//                         <Typography variant="body1" color="text.secondary">
//                           No Data Found
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </Box>
//       </Box>

//       {/* Snackbar */}
//       <Snackbar
//         open={toastOpen}
//         autoHideDuration={4000}
//         onClose={() => setToastOpen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setToastOpen(false)}
//           severity={toastSeverity}
//           sx={{ width: "100%" }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Banner;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://api.bookmyevent.ae/api/banners";
const ZONE_API_URL = "https://api.bookmyevent.ae/api/zones";

// Public base URL for banner images (adjust if your serving path differs)
const PUBLIC_IMAGE_BASE = "https://api.bookmyevent.ae/uploads/banners";

// Styled drop area
const UploadDropArea = styled(Box)(({ theme }) => ({
  border: "2px dashed #e0e0e0",
  borderRadius: 8,
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  cursor: "pointer",
  backgroundColor: "#fafafa",
  "&:hover": { backgroundColor: "#f0f0f0" },
}));

const Banner = () => {
  const [title, setTitle] = useState("");
  const [zone, setZone] = useState("");
  const [zones, setZones] = useState([]);
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [bannerType, setBannerType] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();

  // Retrieve vendorId from localStorage user object
  const getVendorId = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id || null;
      }
      return null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  const vendorId = getVendorId();

  useEffect(() => {
    fetchBanners();
    fetchZones();
  }, []);

  const showToast = (message, severity = "success") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  // Transform local image path to public URL
  const transformImageUrl = (imagePath) => {
    if (!imagePath || imagePath.startsWith('http')) {
      return imagePath;
    }
    // Replace local path prefix with public base
    return `${PUBLIC_IMAGE_BASE}${imagePath.replace('/var/www/backend/Uploads/banners', '')}`;
  };

  // Fetch Zones
  const fetchZones = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(ZONE_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetched = response.data?.data || [];
      setZones(fetched);
    } catch (error) {
      console.error("Error fetching zones:", error);
      showToast("Failed to load zones", "error");
    }
  };

  // Fetch Banners (filtered by vendor client-side)
 // Fetch Banners (filtered by vendor using dedicated endpoint)
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!vendorId) {
        console.error("Vendor ID not available for fetching banners");
        showToast("Vendor ID not found. Please log in again.", "error");
        setLoading(false);
        return;
      }
      
      console.log("Fetching banners for vendorId:", vendorId); // Debug log
      
      // Use the vendor-specific endpoint: banners/vendor/:vendorId
      const response = await axios.get(`${API_URL}/vendor/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let fetched = response.data?.data?.banners || [];
      console.log("Fetched banners:", fetched); // Debug log
      
      // Transform local paths to public URLs
      const transformedBanners = fetched.map((banner) => ({
        ...banner,
        image: transformImageUrl(banner.image),
      }));
      
      setBanners(transformedBanners);
      console.log("Transformed banners:", transformedBanners); // Debug log
    } catch (error) {
      console.error("Error fetching banners:", error);
      if (error.response?.status === 404) {
        showToast("No banners found for this vendor", "info");
        setBanners([]);
      } else {
        showToast("Failed to load banners", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return showToast("Only JPG, JPEG, PNG files allowed", "error");
    }
    if (file.size > 2 * 1024 * 1024) {
      return showToast("File size must be less than 2MB", "error");
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showToast("Title is required", "error");
    if (!zone) return showToast("Please select a zone", "error");
    if (!bannerType) return showToast("Please select a banner type", "error");
    if (!image && !editId) return showToast("Banner image is required", "error");
    if (!vendorId) return showToast("Vendor ID not found. Please log in again.", "error");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);
      formData.append("zone", zone);
      formData.append("bannerType", bannerType);
      formData.append("vendor", vendorId);
      if (image) formData.append("image", image);
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        showToast("Banner updated successfully!");
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        showToast("Banner added successfully!");
      }
      handleReset();
      setShowForm(false);
      // Add a short delay to ensure the new banner is saved and available in the next fetch
      setTimeout(() => {
        fetchBanners();
      }, 1000);
    } catch (error) {
      console.error("Banner submit error:", error);
      console.error("Response:", error.response?.data);
      showToast(error.response?.data?.message || "Operation failed", "error");
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${bannerToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Banner deleted successfully!");
      fetchBanners();
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete banner", "error");
    } finally {
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const openDeleteDialog = (id) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  // EDIT
  const handleEdit = (banner) => {
    const publicImage = transformImageUrl(banner.image);
    setEditId(banner._id);
    setTitle(banner.title);
    setLink(banner.link || "");
    setPreview(publicImage);
    setZone(banner.zone?._id || banner.zone || "");
    setBannerType(banner.bannerType || "");
    setShowForm(true);
  };

  const handleReset = () => {
    setTitle("");
    setLink("");
    setZone("");
    setImage(null);
    setPreview(null);
    setEditId(null);
    setBannerType("");
    setShowForm(true);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#fff", minHeight: "100vh" }}>
      {showForm ? (
        <>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {editId ? "Edit Banner" : "Add New Banner"}
          </Typography>
          {/* Banner Form */}
          <Card sx={{ p: 2, mb: 4, border: "1px solid #e0e0e0" }}>
            <CardContent>
              <TextField
                fullWidth
                label="venue Banner Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              {/* Zone Dropdown */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Zone</InputLabel>
                <Select
                  value={zone}
                  label="Select Zone"
                  onChange={(e) => setZone(e.target.value)}
                >
                  {zones.length > 0 ? (
                    zones.map((z) => (
                      <MenuItem key={z._id || z.id} value={z._id || z.id}>
                        {z.zoneName || z.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No zones available</MenuItem>
                  )}
                </Select>
              </FormControl>
              {/* Banner Type Dropdown */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Banner Type</InputLabel>
                <Select
                  value={bannerType}
                  label="Banner Type"
                  onChange={(e) => setBannerType(e.target.value)}
                >
                  <MenuItem value="top_deal">Top Deal</MenuItem>
                  <MenuItem value="cash_back">Cash Back</MenuItem>
                  <MenuItem value="zone_wise">Zone Wise</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Banner Link (Optional)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Banner Image
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                JPG, JPEG, PNG Less Than 2MB (Ratio 3:1)
              </Typography>
              <UploadDropArea onClick={() => document.getElementById("banner-upload").click()} sx={{borderColor:'#E15B65'}}>
                {preview ? (
                  <img src={preview} alt="Preview" style={{ maxHeight: 160, borderRadius: 8 }} />
                ) : (
                  <>
                    <Typography variant="body2" color="#E15B65">
                      Click to upload
                    </Typography>
                    <Typography variant="caption" color="#E15B65">
                      Or drag and drop
                    </Typography>
                  </>
                )}
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </UploadDropArea>
            </CardContent>
          </Card>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setShowForm(false)}
              sx={{ color: '#E15B65', borderColor: '#E15B65' }}
            >
              View Banners List
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" color="#E15B65" onClick={handleReset} sx={{color:'#E15B65'}}>
                Cancel
              </Button>
              <Button variant="contained" color="#E15B65" onClick={handleSubmit} sx={{color:'white', bgcolor:'#E15B65'}}>
                {editId ? "Update" : "Submit"}
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ color: '#E15B65', borderColor: '#E15B65' }}
          >
            Back
          </Button>
          <Typography variant="h5">Banner Management</Typography>
          <Button variant="contained" onClick={() => setShowForm(true)} sx={{color:'white', bgcolor:'#E15B65'}}>
            Add New Banner
          </Button>
        </Box>
      )}
      {!showForm && (
        <>
          {/* Banner List */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Banner List{" "}
            <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: 12 }}>
              {banners.length}
            </span>
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Card sx={{ border: "1px solid #e0e0e0" }}>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>SL</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Banner Info</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Zone</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Link</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {banners.length > 0 ? (
                      banners.map((b, index) => (
                        <TableRow key={b._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <img
                                src={b.image}
                                alt={b.title}
                                style={{
                                  width: 80,
                                  height: 40,
                                  borderRadius: 6,
                                  objectFit: "cover",
                                  border: "1px solid #ddd",
                                }}
                                onError={(e) => {
                                  console.error(`Failed to load image: ${b.image}`);
                                  e.target.src = '/placeholder-image.jpg'; // Optional: fallback image
                                }}
                              />
                              <Typography>{b.title}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{b.zone?.name || "-"}</TableCell>
                          <TableCell>{b.bannerType || "-"}</TableCell>
                          <TableCell>
                            <a href={b.link} target="_blank" rel="noreferrer">
                              {b.link || "-"}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined" color="green"
                              onClick={() => handleEdit(b)}
                              sx={{ mr: 1 ,color:'green', borderColor:'green'}}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => openDeleteDialog(b._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">No Data Found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {/* Snackbar */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this banner? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Banner;