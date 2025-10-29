// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   Stack,
//   InputAdornment,
//   Snackbar,
//   Alert,
// } from '@mui/material';
// import {
//   ArrowBack as ArrowBackIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   CloudUpload as CloudUploadIcon,
//   Edit as EditIcon,
//   Close as CloseIcon,
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import { useTheme } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// // Styled component for the upload area
// const UploadDropArea = styled(Box)(({ theme }) => ({
//   border: '2px dashed #e0e0e0',
//   borderRadius: theme.shape.borderRadius,
//   padding: theme.spacing(3),
//   textAlign: 'center',
//   backgroundColor: theme.palette.grey[50],
//   cursor: 'pointer',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   minHeight: '150px',
//   '&:hover': {
//     borderColor: '#E15B65',
//   },
//   '& input[type="file"]': {
//     display: 'none',
//   },
// }));

// const ImagePreviewContainer = styled(Box)({
//   position: 'relative',
//   display: 'inline-block',
// });

// const FoodMenu = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'preview'
//   const [currentPackage, setCurrentPackage] = useState(null);
//   const [packages, setPackages] = useState([]);
//   const [formData, setFormData] = useState({
//     packageTitle: '',
//     description: '',
//     startingPrice: '',
//   });
//   const [menuSections, setMenuSections] = useState([
//     { id: Date.now(), heading: '', includes: '' },
//   ]);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [galleryFiles, setGalleryFiles] = useState([]);
//   const [openToast, setOpenToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastSeverity, setToastSeverity] = useState('success');
//   const API_BASE_URL = 'https://api.bookmyevent.ae';

//   useEffect(() => {
//     fetchPackages();
//   }, []);

//   const fetchPackages = async () => {
//     const providerId = localStorage.getItem('providerId') || localStorage.getItem('moduleId');
//     if (!providerId) return;
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/packages/provider/${providerId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const result = await response.json();
//         setPackages(result.packages || []);
//       } else {
//         throw new Error('Failed to fetch packages');
//       }
//     } catch (error) {
//       console.error('Error fetching packages:', error);
//       setToastMessage('Failed to fetch packages');
//       setToastSeverity('error');
//       setOpenToast(true);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleMenuChange = (id, field, value) => {
//     setMenuSections((prev) =>
//       prev.map((section) =>
//         section.id === id ? { ...section, [field]: value } : section
//       )
//     );
//   };

//   const addMenuSection = () => {
//     setMenuSections((prev) => [
//       ...prev,
//       { id: Date.now(), heading: '', includes: '' },
//     ]);
//   };

//   const deleteMenuSection = (id) => {
//     setMenuSections((prev) => prev.filter((section) => section.id !== id));
//   };

//   const handleThumbnailChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setThumbnailFile(file);
//     }
//   };

//   const handleGalleryChange = (event) => {
//     const newFiles = Array.from(event.target.files);
//     setGalleryFiles((prev) => [...prev, ...newFiles]);
//   };

//   const deleteGalleryFile = (index) => {
//     setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const clearThumbnail = () => {
//     setThumbnailFile(null);
//   };

//   const handleCloseToast = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenToast(false);
//   };

//   const populateForm = (pkg) => {
//     setFormData({
//       packageTitle: pkg.title || '',
//       description: pkg.description || '',
//       startingPrice: pkg.price?.toString() || '',
//     });
//     setMenuSections(
//       (pkg.includes || []).map((inc) => ({
//         id: Date.now() + Math.random(),
//         heading: inc.title || '',
//         includes: inc.items?.join(', ') || '',
//       }))
//     );
//     setThumbnailFile(null);
//     setGalleryFiles([]);
//   };

//   const handleEdit = () => {
//     if (currentPackage) {
//       populateForm(currentPackage);
//     }
//     setViewMode('form');
//   };

//   const handleDelete = async () => {
//     if (!currentPackage?._id) return;
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setToastMessage('No authentication token found. Please log in.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/packages/${currentPackage._id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setToastMessage('Package deleted successfully!');
//         setToastSeverity('success');
//         setOpenToast(true);
//         fetchPackages();
//         setViewMode('list');
//         setCurrentPackage(null);
//         // Clear form data
//         setFormData({
//           packageTitle: '',
//           description: '',
//           startingPrice: '',
//         });
//         setMenuSections([
//           { id: Date.now(), heading: '', includes: '' },
//         ]);
//         setThumbnailFile(null);
//         setGalleryFiles([]);
//       } else {
//         throw new Error(result.message || 'Failed to delete package');
//       }
//     } catch (error) {
//       console.error('Error deleting package:', error);
//       setToastMessage(`Error deleting package: ${error.message}`);
//       setToastSeverity('error');
//       setOpenToast(true);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setToastMessage('No authentication token found. Please log in.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     const providerId = localStorage.getItem('providerId') || localStorage.getItem('moduleId');
//     if (!providerId) {
//       setToastMessage('Provider ID is missing. Please log in again.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     const transformedIncludes = menuSections
//       .filter((s) => s.includes.trim())
//       .map((s) => ({
//         title: s.heading.trim() || 'Menu Item',
//         items: s.includes.split(',').map(item => item.trim()).filter(item => item)
//       }));
//     const price = parseFloat(formData.startingPrice) || 0;
//     const packageFormData = new FormData();
//     packageFormData.append('providerId', providerId);
//     packageFormData.append('title', formData.packageTitle || 'Custom Package');
//     packageFormData.append('subtitle', '');
//     packageFormData.append('description', formData.description || '');
//     packageFormData.append('packageType', 'custom');
//     packageFormData.append('includes', JSON.stringify(transformedIncludes));
//     packageFormData.append('price', price.toString());
//     packageFormData.append('categories', JSON.stringify(['68e795f06a1614cf448a36f5', '68e797ac6a1614cf448a372d']));
//     if (thumbnailFile) {
//       packageFormData.append('thumbnail', thumbnailFile);
//     }
//     galleryFiles.forEach((file) => {
//       packageFormData.append('images', file);
//     });
//     const isEdit = !!currentPackage?._id;
//     const url = isEdit ? `${API_BASE_URL}/api/packages/${currentPackage._id}` : `${API_BASE_URL}/api/packages`;
//     const method = isEdit ? 'PUT' : 'POST';
//     try {
//       const response = await fetch(url, {
//         method,
//         body: packageFormData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       let result;
//       try {
//         result = await response.json();
//       } catch (parseError) {
//         throw new Error('Invalid response from server');
//       }
//       if (response.ok) {
//         fetchPackages();
//         setCurrentPackage(result.package || result);
//         setViewMode('preview');
//         setToastMessage(result.message || `Package ${isEdit ? 'updated' : 'created'} successfully!`);
//         setToastSeverity('success');
//         setOpenToast(true);
//       } else {
//         throw new Error(result.error || result.message || 'Failed to save package');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setToastMessage(`Error saving package: ${error.message}`);
//       setToastSeverity('error');
//       setOpenToast(true);
//     }
//   };

//   if (viewMode === 'preview' && currentPackage) {
//     return (
//       <Box
//         sx={{
//           p: 3,
//           backgroundColor: theme.palette.grey[100],
//           minHeight: '100vh',
//           width: '100%',
//         }}
//       >
//         <Box
//           sx={{
//             width: '100%',
//             margin: 'auto',
//             backgroundColor: 'white',
//             borderRadius: theme.shape.borderRadius,
//             boxShadow: theme.shadows[1],
//             p: 3,
//             overflowX: 'hidden',
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//             <IconButton onClick={() => setViewMode('list')} color="primary">
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography variant="h5" component="h1">
//               Package Preview
//             </Typography>
//           </Box>
//           {/* Thumbnail with overlay */}
//           <Box sx={{ position: 'relative', mb: 3 }}>
//             <img
//               src={`${API_BASE_URL}/${currentPackage.thumbnail || ''}`}
//               alt={currentPackage.title}
//               style={{
//                 width: '100%',
//                 height: 200,
//                 objectFit: 'cover',
//                 borderRadius: 8,
//               }}
//               onError={(e) => {
//                 e.target.src = '/placeholder.jpg';
//               }}
//             />
//             <Box
//               sx={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
//                 color: 'white',
//                 p: 2,
//               }}
//             >
//               <Typography variant="h6" sx={{ mb: 0.5 }}>
//                 {currentPackage.title}
//               </Typography>
//               <Typography variant="body2">
//                 {currentPackage.subtitle || 'Traditional Style'}
//               </Typography>
//             </Box>
//           </Box>
//           {/* Description */}
//           <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
//             {currentPackage.description}
//           </Typography>
//           {/* Includes */}
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Includes
//           </Typography>
//           {(currentPackage.includes || []).map((inc, index) => (
//             <Box key={index} sx={{ mb: 2 }}>
//               <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
//                 {inc.title}
//               </Typography>
//               <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 0 }}>
//                 {inc.items.map((item, itemIndex) => (
//                   <Typography key={itemIndex} variant="body2" component="li">
//                     {item}
//                   </Typography>
//                 ))}
//               </Stack>
//             </Box>
//           ))}
//           {/* Price */}
//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <Typography variant="h6" sx={{ mb: 0.5 }}>
//               Starting Price
//             </Typography>
//             <Typography variant="h4" color="primary">
//               ₹{currentPackage.price} Per Head
//             </Typography>
//           </Box>
//           {/* Gallery Images at bottom */}
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>
//               Gallery
//             </Typography>
//             <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
//               {(currentPackage.images || []).slice(0, 3).map((img, index) => (
//                 <Box key={index} sx={{ position: 'relative' }}>
//                   <img
//                     src={`${API_BASE_URL}/${img}`}
//                     alt={`Gallery image ${index + 1}`}
//                     style={{
//                       width: 120,
//                       height: 120,
//                       objectFit: 'cover',
//                       borderRadius: 8,
//                     }}
//                     onError={(e) => {
//                       e.target.src = '/placeholder.jpg';
//                     }}
//                   />
//                 </Box>
//               ))}
//             </Stack>
//           </Box>
//           {/* Action Buttons */}
//           <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
//             <Button
//               variant="outlined"
//               startIcon={<EditIcon />}
//               onClick={handleEdit}
//               sx={{ color: '#E15B65', borderColor: '#E15B65' }}
//             >
//               Edit Menu
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<DeleteIcon />}
//               onClick={handleDelete}
//               sx={{ backgroundColor: '#E15B65', color: 'white' }}
//             >
//               Delete Menu
//             </Button>
//           </Box>
//           <Snackbar
//             open={openToast}
//             autoHideDuration={6000}
//             onClose={handleCloseToast}
//             anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//           >
//             <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
//               {toastMessage}
//             </Alert>
//           </Snackbar>
//         </Box>
//       </Box>
//     );
//   }

//   if (viewMode === 'list') {
//     return (
//       <Box
//         sx={{
//           p: 3,
//           backgroundColor: theme.palette.grey[100],
//           minHeight: '100vh',
//           width: '100%',
//         }}
//       >
//         <Box
//           sx={{
//             width: '100%',
//             margin: 'auto',
//             backgroundColor: 'white',
//             borderRadius: theme.shape.borderRadius,
//             boxShadow: theme.shadows[1],
//             p: 3,
//             overflowX: 'hidden',
//           }}
//         >
//           <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
//             Food Menu
//           </Typography>
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start' }}>
//             {packages.map((pkg) => (
//               <Box
//                 key={pkg._id}
//                 sx={{
//                   width: 250,
//                   cursor: 'pointer',
//                   transition: 'transform 0.2s',
//                   '&:hover': {
//                     transform: 'scale(1.02)',
//                   },
//                 }}
//                 onClick={() => {
//                   setCurrentPackage(pkg);
//                   setViewMode('preview');
//                 }}
//               >
//                 <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 1 }}>
//                   <img
//                     src={pkg.thumbnail ? `${API_BASE_URL}/${pkg.thumbnail}` : '/placeholder.jpg'}
//                     alt={pkg.title}
//                     style={{ width: '100%', height: 200, objectFit: 'cover' }}
//                   />
//                 </Box>
//                 <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'medium' }}>
//                   {pkg.title}
//                 </Typography>
//               </Box>
//             ))}
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: '#E15B65',
//                 color: 'white',
//                 minWidth: 200,
//                 height: 200,
//                 borderRadius: 2,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 boxShadow: theme.shadows[2],
//                 '&:hover': { backgroundColor: theme.palette.primary.dark },
//                 flex: '0 0 auto',
//               }}
//               onClick={() => {
//                 setViewMode('form');
//                 setFormData({
//                   packageTitle: '',
//                   description: '',
//                   startingPrice: '',
//                 });
//                 setMenuSections([{ id: Date.now(), heading: '', includes: '' }]);
//                 setThumbnailFile(null);
//                 setGalleryFiles([]);
//                 setCurrentPackage(null);
//               }}
//             >
//               <AddIcon sx={{ fontSize: 32, mb: 0.5 }} />
//               <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
//                 Add Menu
//               </Typography>
//             </Button>
//           </Box>
//           <Snackbar
//             open={openToast}
//             autoHideDuration={6000}
//             onClose={handleCloseToast}
//             anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//           >
//             <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
//               {toastMessage}
//             </Alert>
//           </Snackbar>
//         </Box>
//       </Box>
//     );
//   }

//   // Form mode (add or edit)
//   return (
//     <Box
//       sx={{
//         p: 3,
//         backgroundColor: theme.palette.grey[100],
//         minHeight: '100vh',
//         width: '100%',
//       }}
//     >
//       <Box
//         sx={{
//           width: '100%',
//           margin: 'auto',
//           backgroundColor: 'white',
//           borderRadius: theme.shape.borderRadius,
//           boxShadow: theme.shadows[1],
//           p: 3,
//           overflowX: 'hidden',
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//           <IconButton onClick={() => setViewMode('list')} color="primary">
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h5" component="h1">
//             {currentPackage ? 'Edit Menu' : 'Add New Menu'}
//           </Typography>
//         </Box>
//         <Box component="form" onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Package Title"
//             name="packageTitle"
//             value={formData.packageTitle}
//             onChange={handleInputChange}
//             placeholder="Type package title"
//             sx={{ mb: 2 }}
//             variant="outlined"
//           />
//           <TextField
//             fullWidth
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Type description"
//             multiline
//             rows={3}
//             sx={{ mb: 3 }}
//             variant="outlined"
//           />
//           <Box sx={{ mb: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="subtitle1">Menu List</Typography>
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={addMenuSection}
//                 startIcon={<AddIcon />}
//                 sx={{ backgroundColor: '#E15B65', color: 'white' }}
//               >
//                 Add
//               </Button>
//             </Box>
//             {menuSections.map((section) => (
//               <Box
//                 key={section.id}
//                 sx={{
//                   border: `1px solid ${theme.palette.grey[300]}`,
//                   borderRadius: 1,
//                   p: 2,
//                   mb: 2,
//                 }}
//               >
//                 <TextField
//                   fullWidth
//                   label="Add heading here"
//                   value={section.heading}
//                   onChange={(e) => handleMenuChange(section.id, 'heading', e.target.value)}
//                   sx={{ mb: 2 }}
//                   variant="outlined"
//                 />
//                 <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
//                   <TextField
//                     fullWidth
//                     label="Includes"
//                     value={section.includes}
//                     onChange={(e) => handleMenuChange(section.id, 'includes', e.target.value)}
//                     multiline
//                     rows={3}
//                     sx={{ flex: 1 }}
//                     variant="outlined"
//                     placeholder="Enter items separated by commas"
//                   />
//                   <IconButton
//                     onClick={() => deleteMenuSection(section.id)}
//                     color="error"
//                     sx={{ alignSelf: 'flex-end' }}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//           <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
//             <Box sx={{ flex: 1 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Thumbnail Image
//               </Typography>
//               <UploadDropArea
//                 onClick={() => document.getElementById('thumbnail-upload').click()}
//               >
//                 {thumbnailFile ? (
//                   <Box sx={{ textAlign: 'center' }}>
//                     <ImagePreviewContainer>
//                       <img
//                         src={URL.createObjectURL(thumbnailFile)}
//                         alt="Thumbnail preview"
//                         style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
//                       />
//                       <IconButton
//                         onClick={clearThumbnail}
//                         size="small"
//                         sx={{
//                           position: 'absolute',
//                           top: -8,
//                           right: -8,
//                           backgroundColor: 'white',
//                           color: 'error',
//                           boxShadow: theme.shadows[2],
//                         }}
//                       >
//                         <CloseIcon fontSize="small" />
//                       </IconButton>
//                     </ImagePreviewContainer>
//                     <Typography variant="body2" color="text.secondary">
//                       {thumbnailFile.name}
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <Box>
//                     <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                     <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                       Click to upload
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
//                   </Box>
//                 )}
//                 <input
//                   type="file"
//                   id="thumbnail-upload"
//                   hidden
//                   accept="image/jpeg,image/png,image/jpg"
//                   onChange={handleThumbnailChange}
//                 />
//               </UploadDropArea>
//             </Box>
//             <Box sx={{ flex: 1 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Gallery Images
//               </Typography>
//               <UploadDropArea
//                 onClick={() => document.getElementById('gallery-upload').click()}
//               >
//                 {galleryFiles.length > 0 ? (
//                   <Box sx={{ textAlign: 'center' }}>
//                     <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ justifyContent: 'center', mb: 1 }}>
//                       {galleryFiles.map((file, index) => (
//                         <ImagePreviewContainer key={index}>
//                           <img
//                             src={URL.createObjectURL(file)}
//                             alt={`Gallery preview ${index + 1}`}
//                             style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
//                           />
//                           <IconButton
//                             onClick={() => deleteGalleryFile(index)}
//                             size="small"
//                             sx={{
//                               position: 'absolute',
//                               top: -8,
//                               right: -8,
//                               backgroundColor: 'white',
//                               color: 'error',
//                               boxShadow: theme.shadows[2],
//                             }}
//                           >
//                             <CloseIcon fontSize="small" />
//                           </IconButton>
//                         </ImagePreviewContainer>
//                       ))}
//                     </Stack>
//                     <Typography variant="body2" color="text.secondary">
//                       {galleryFiles.length} image(s) selected
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <Box>
//                     <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                     <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                       Click to upload
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
//                   </Box>
//                 )}
//                 <input
//                   type="file"
//                   id="gallery-upload"
//                   hidden
//                   accept="image/jpeg,image/png,image/jpg"
//                   multiple
//                   onChange={handleGalleryChange}
//                 />
//               </UploadDropArea>
//             </Box>
//           </Box>
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               label="₹ Price (Starting From)"
//               name="startingPrice"
//               value={formData.startingPrice}
//               onChange={handleInputChange}
//               type="number"
//               inputProps={{ min: 0 }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <Typography variant="body2" color="text.secondary">
//                       Per Head
//                     </Typography>
//                   </InputAdornment>
//                 ),
//               }}
//               variant="outlined"
//             />
//           </Box>
//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{ backgroundColor: '#E15B65', color: 'white', py: 1.5 }}
//           >
//             {currentPackage ? 'Update Menu' : 'Create Menu'}
//           </Button>
//         </Box>
//         <Snackbar
//           open={openToast}
//           autoHideDuration={6000}
//           onClose={handleCloseToast}
//           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         >
//           <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
//             {toastMessage}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Box>
//   );
// };

// export default FoodMenu;


import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const UploadDropArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '150px',
  '&:hover': {
    borderColor: '#E15B65',
  },
  '& input[type="file"]': {
    display: 'none',
  },
}));

const ImagePreviewContainer = styled(Box)({
  position: 'relative',
  display: 'inline-block',
});

const FoodMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isSelecting = location.state?.selectingForVenue;
  const preSelected = location.state?.preSelected || [];

  const [viewMode, setViewMode] = useState('list');
  const [currentPackage, setCurrentPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [formData, setFormData] = useState({
    packageTitle: '',
    description: '',
    startingPrice: '',
  });
  const [menuSections, setMenuSections] = useState([
    { id: Date.now(), heading: '', includes: '' },
  ]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const API_BASE_URL = 'https://api.bookmyevent.ae';

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (preSelected && preSelected.length > 0) {
      console.log('Pre-selected packages:', preSelected);
      setSelectedPackages(preSelected);
    }
  }, []);

  const fetchPackages = async () => {
    const providerId = localStorage.getItem('providerId') || localStorage.getItem('moduleId');
    if (!providerId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/provider/${providerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setPackages(result.packages || []);
      } else {
        throw new Error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setToastMessage('Failed to fetch packages');
      setToastSeverity('error');
      setOpenToast(true);
    }
  };

  const toggleSelection = (pkg) => {
    console.log('Toggling package:', pkg);
    setSelectedPackages(prev =>
      prev.some(p => p._id === pkg._id)
        ? prev.filter(p => p._id !== pkg._id)
        : [...prev, pkg]
    );
  };

  const handleSaveSelection = () => {
    console.log('Saving selection:', selectedPackages);
    // Navigate back with selected packages
    navigate('/venue-setup/new', {
      state: { selectedPackages },
      replace: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuChange = (id, field, value) => {
    setMenuSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const addMenuSection = () => {
    setMenuSections((prev) => [
      ...prev,
      { id: Date.now(), heading: '', includes: '' },
    ]);
  };

  const deleteMenuSection = (id) => {
    setMenuSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleGalleryChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setGalleryFiles((prev) => [...prev, ...newFiles]);
  };

  const deleteGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const populateForm = (pkg) => {
    setFormData({
      packageTitle: pkg.title || '',
      description: pkg.description || '',
      startingPrice: pkg.price?.toString() || '',
    });
    setMenuSections(
      (pkg.includes || []).map((inc, index) => ({
        id: Date.now() + index,
        heading: inc.title || '',
        includes: inc.items?.join(', ') || '',
      }))
    );
    setThumbnailFile(null);
    setGalleryFiles([]);
  };

  const handleEdit = () => {
    if (currentPackage) {
      populateForm(currentPackage);
    }
    setViewMode('form');
  };

  const handleDelete = async () => {
    if (!currentPackage?._id) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setToastMessage('No authentication token found. Please log in.');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/${currentPackage._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setToastMessage('Package deleted successfully!');
        setToastSeverity('success');
        setOpenToast(true);
        fetchPackages();
        setViewMode('list');
        setCurrentPackage(null);
        setFormData({
          packageTitle: '',
          description: '',
          startingPrice: '',
        });
        setMenuSections([
          { id: Date.now(), heading: '', includes: '' },
        ]);
        setThumbnailFile(null);
        setGalleryFiles([]);
      } else {
        throw new Error(result.message || 'Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      setToastMessage(`Error deleting package: ${error.message}`);
      setToastSeverity('error');
      setOpenToast(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setToastMessage('No authentication token found. Please log in.');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    const providerId = localStorage.getItem('providerId') || localStorage.getItem('moduleId');
    if (!providerId) {
      setToastMessage('Provider ID is missing. Please log in again.');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    const transformedIncludes = menuSections
      .filter((s) => s.includes.trim())
      .map((s) => ({
        title: s.heading.trim() || 'Menu Item',
        items: s.includes.split(',').map(item => item.trim()).filter(item => item)
      }));
    const price = parseFloat(formData.startingPrice) || 0;
    const packageFormData = new FormData();
    packageFormData.append('providerId', providerId);
    packageFormData.append('title', formData.packageTitle || 'Custom Package');
    packageFormData.append('subtitle', '');
    packageFormData.append('description', formData.description || '');
    packageFormData.append('packageType', 'custom');
    packageFormData.append('includes', JSON.stringify(transformedIncludes));
    packageFormData.append('price', price.toString());
    packageFormData.append('categories', JSON.stringify(['68e795f06a1614cf448a36f5', '68e797ac6a1614cf448a372d']));
    if (thumbnailFile) {
      packageFormData.append('thumbnail', thumbnailFile);
    }
    galleryFiles.forEach((file) => {
      packageFormData.append('images', file);
    });
    const isEdit = !!currentPackage?._id;
    const url = isEdit ? `${API_BASE_URL}/api/packages/${currentPackage._id}` : `${API_BASE_URL}/api/packages`;
    const method = isEdit ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        body: packageFormData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }
      if (response.ok) {
        await fetchPackages();
        setCurrentPackage(result.package || result);
        setViewMode('preview');
        setToastMessage(result.message || `Package ${isEdit ? 'updated' : 'created'} successfully!`);
        setToastSeverity('success');
        setOpenToast(true);
      } else {
        throw new Error(result.error || result.message || 'Failed to save package');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setToastMessage(`Error saving package: ${error.message}`);
      setToastSeverity('error');
      setOpenToast(true);
    }
  };

  if (viewMode === 'preview' && currentPackage) {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
        <Box sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton onClick={() => setViewMode('list')} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">Package Preview</Typography>
          </Box>
          <Box sx={{ position: 'relative', mb: 3 }}>
            <img
              src={`${API_BASE_URL}/${currentPackage.thumbnail || ''}`}
              alt={currentPackage.title}
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
            />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white', p: 2 }}>
              <Typography variant="h6">{currentPackage.title}</Typography>
              <Typography variant="body2">{currentPackage.subtitle || 'Traditional Style'}</Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mb: 3 }}>{currentPackage.description}</Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>Includes</Typography>
          {(currentPackage.includes || []).map((inc, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{inc.title}</Typography>
              <Stack component="ul" spacing={0.5} sx={{ pl: 2 }}>
                {inc.items.map((item, itemIndex) => (
                  <Typography key={itemIndex} variant="body2" component="li">{item}</Typography>
                ))}
              </Stack>
            </Box>
          ))}
          <Typography variant="h6" sx={{ mb: 2 }}>Gallery</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {(currentPackage.images || []).map((img, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}/${img}`}
                alt={`Gallery ${index + 1}`}
                style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 4 }}
                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
              />
            ))}
          </Box>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6">Starting Price</Typography>
            <Typography variant="h4" color="primary">₹{currentPackage.price} Per Head</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit} sx={{ color: '#E15B65', borderColor: '#E15B65' }}>
              Edit Menu
            </Button>
            <Button variant="contained" startIcon={<DeleteIcon />} onClick={handleDelete} sx={{ backgroundColor: '#E15B65' }}>
              Delete Menu
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  if (viewMode === 'list') {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
        <Box sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {isSelecting ? 'Select Menu Items' : 'Food Menu'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {packages.map((pkg) => {
              const isSelected = selectedPackages.some(p => p._id === pkg._id);
              return (
                <Box
                  key={pkg._id}
                  sx={{
                    width: 250,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isSelecting && isSelected ? '3px solid #E15B65' : '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 1,
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                  onClick={() => {
                    if (isSelecting) {
                      toggleSelection(pkg);
                    } else {
                      setCurrentPackage(pkg);
                      setViewMode('preview');
                    }
                  }}
                >
                  <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 1 }}>
                    <img
                      src={pkg.thumbnail ? `${API_BASE_URL}/${pkg.thumbnail}` : '/placeholder.jpg'}
                      alt={pkg.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>{pkg.title}</Typography>
                </Box>
              );
            })}
            {!isSelecting && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#E15B65',
                  minWidth: 200,
                  height: 200,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => {
                  setViewMode('form');
                  setFormData({ packageTitle: '', description: '', startingPrice: '' });
                  setMenuSections([{ id: Date.now(), heading: '', includes: '' }]);
                  setThumbnailFile(null);
                  setGalleryFiles([]);
                  setCurrentPackage(null);
                }}
              >
                <AddIcon sx={{ fontSize: 32, mb: 0.5 }} />
                <Typography>Add Menu</Typography>
              </Button>
            )}
          </Box>
          {isSelecting && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ borderColor: '#E15B65', color: '#E15B65' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveSelection}
                disabled={selectedPackages.length === 0}
                sx={{ backgroundColor: '#E15B65' }}
              >
                Done ({selectedPackages.length} selected)
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={() => setViewMode('list')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">{currentPackage ? 'Edit Menu' : 'Add New Menu'}</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Package Title" name="packageTitle" value={formData.packageTitle} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1">Menu List</Typography>
              <Button size="small" onClick={addMenuSection} startIcon={<AddIcon />} sx={{ backgroundColor: '#E15B65', color: 'white' }}>
                Add
              </Button>
            </Box>
            {menuSections.map((section) => (
              <Box key={section.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
                <TextField fullWidth label="Heading" value={section.heading} onChange={(e) => handleMenuChange(section.id, 'heading', e.target.value)} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField fullWidth label="Includes (comma separated)" value={section.includes} onChange={(e) => handleMenuChange(section.id, 'includes', e.target.value)} multiline rows={3} />
                  <IconButton onClick={() => deleteMenuSection(section.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Thumbnail</Typography>
              <UploadDropArea onClick={() => document.getElementById('thumbnail-upload').click()}>
                {thumbnailFile ? (
                  <Box>
                    <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail" style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} />
                    <IconButton onClick={clearThumbnail} size="small" sx={{ position: 'absolute', top: -8, right: -8 }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
                    <Typography variant="body2" color="#E15B65">Click to upload</Typography>
                  </Box>
                )}
                <input type="file" id="thumbnail-upload" hidden accept="image/*" onChange={handleThumbnailChange} />
              </UploadDropArea>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Gallery</Typography>
              <UploadDropArea onClick={() => document.getElementById('gallery-upload').click()}>
                {galleryFiles.length === 0 ? (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
                    <Typography variant="body2" color="#E15B65">Click to upload</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="#E15B65">Click to add more images</Typography>
                )}
                <input type="file" id="gallery-upload" hidden accept="image/*" multiple onChange={handleGalleryChange} />
              </UploadDropArea>
              {galleryFiles.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {galleryFiles.map((file, index) => (
                    <ImagePreviewContainer key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => deleteGalleryFile(index)}
                        sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ImagePreviewContainer>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          <TextField fullWidth label="Starting Price (₹)" name="startingPrice" value={formData.startingPrice} onChange={handleInputChange} type="number" sx={{ mb: 3 }} InputProps={{ endAdornment: <InputAdornment position="end">Per Head</InputAdornment> }} />
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#E15B65', py: 1.5 }}>
            {currentPackage ? 'Update Menu' : 'Create Menu'}
          </Button>
        </Box>
        <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseToast} severity={toastSeverity}>{toastMessage}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default FoodMenu;