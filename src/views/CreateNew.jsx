




// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
//   Tooltip,
//   Stack,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   useTheme,
//   useMediaQuery,
//   Snackbar,
//   Alert,
// } from '@mui/material';
// import { CloudUpload as CloudUploadIcon, Settings as SettingsIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import { styled } from '@mui/system';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
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
//     borderColor: theme.palette.primary.main,
//   },
//   '& input[type="file"]': {
//     display: 'none',
//   },
// }));
// const Createnew = ({ vehicleId }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
//   const location = useLocation(); // Access navigation state
//   const navigate = useNavigate(); // For navigation after update
//   // State for form fields
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [vehicleImages, setVehicleImages] = useState([]);
//   const [vehicleDoc, setVehicleDoc] = useState([]);
//   const [brand, setBrand] = useState('');
//   const [model, setModel] = useState('');
//   const [category, setCategory] = useState('');
//   const [type, setType] = useState('');
//   const [engineCapacity, setEngineCapacity] = useState('');
//   const [enginePower, setEnginePower] = useState('');
//   const [seatingCapacity, setSeatingCapacity] = useState('');
//   const [airCondition, setAirCondition] = useState('yes');
//   const [fuelType, setFuelType] = useState('');
//   const [transmissionType, setTransmissionType] = useState('');
//   const [vinNumber, setVinNumber] = useState('');
//   const [licensePlateNumber, setLicensePlateNumber] = useState('');
//   const [licensePlateError, setLicensePlateError] = useState('');
//   const [tripType, setTripType] = useState('hourly');
//   const [hourlyWisePrice, setHourlyWisePrice] = useState('');
//   const [perDayPrice, setPerDayPrice] = useState('');
//   const [distanceWisePrice, setDistanceWisePrice] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [searchTags, setSearchTags] = useState([]);
//   const [currentTag, setCurrentTag] = useState('');
//   const [openToast, setOpenToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastSeverity, setToastSeverity] = useState('success');
//   const [brands, setBrands] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   // Memo for vehicle key from state
//   const vehicleKeyFromState = useMemo(() => location.state?.vehicle?._id, [location.state]);
//   // API base URL
//   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae/api';
//   // Module ID for rental
//   const moduleId = localStorage.getItem('moduleId');
//   // Function to set vehicle data, enhancing brands/categories if necessary
//   const setVehicleData = useCallback((vehicle) => {
//     // Enhance brands only if needed (avoid unnecessary setState)
//     if (vehicle.brand && vehicle.brand._id && !brands.some((b) => b._id === vehicle.brand._id)) {
//       setBrands((prev) => [...prev, {
//         _id: vehicle.brand._id,
//         title: vehicle.brand.title || vehicle.brand.name || 'Unknown Brand',
//       }]);
//     }
//     // Enhance categories only if needed (avoid unnecessary setState)
//     if (vehicle.category && vehicle.category._id && !categories.some((c) => c._id === vehicle.category._id)) {
//       setCategories((prev) => [...prev, {
//         _id: vehicle.category._id,
//         title: vehicle.category.title || vehicle.category.name || 'Unknown Category',
//       }]);
//     }
//     // Set other states
//     setName(vehicle.name || '');
//     setDescription(vehicle.description || '');
//     setBrand(vehicle.brand?._id || '');
//     setCategory(vehicle.category?._id || '');
//     setModel(vehicle.model || '');
//     setType(vehicle.type || '');
//     setEngineCapacity(vehicle.engineCapacity?.toString() || '');
//     setEnginePower(vehicle.enginePower?.toString() || '');
//     setSeatingCapacity(vehicle.seatingCapacity?.toString() || '');
//     setAirCondition(vehicle.airCondition ? 'yes' : 'no');
//     setFuelType(vehicle.fuelType || '');
//     setTransmissionType(vehicle.transmissionType || '');
//     setVinNumber(vehicle.vinNumber || '');
//     setLicensePlateNumber(vehicle.licensePlateNumber || '');
//     setSearchTags(vehicle.searchTags || []);
//     if (vehicle.pricing) {
//       setTripType(vehicle.pricing.type || 'hourly');
//       setHourlyWisePrice(vehicle.pricing.hourly?.toString() || '');
//       setPerDayPrice(vehicle.pricing.perDay?.toString() || '');
//       setDistanceWisePrice(vehicle.pricing.distance?.toString() || '');
//     }
//     setDiscount(vehicle.discount?.toString() || '');
//   }, [brands, categories]);
//   // Fetch brands and categories
//   useEffect(() => {
//     const fetchBrandsAndCategories = async () => {
//       try {
//         const [brandsResponse, categoriesResponse] = await Promise.all([
//           axios.get(`${API_BASE_URL}/brands/module/${moduleId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           }),
//           axios.get(`${API_BASE_URL}/categories/modules/${moduleId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           }),
//         ]);
//         // Fix: Use .data directly (array), not .data.data
//         setBrands(brandsResponse.data || []);
//         setCategories(categoriesResponse.data || []);
//         console.log('Brands fetched:', brandsResponse.data);
//         console.log('Categories fetched:', categoriesResponse.data);
//         setIsDataLoaded(true);
//       } catch (error) {
//         setBrands([]);
//         setCategories([]);
//         setIsDataLoaded(true);
//         setToastMessage(error.response?.data?.message || 'Failed to fetch brands or categories');
//         setToastSeverity('error');
//         setOpenToast(true);
//         console.error('Error fetching brands/categories:', error.response?.data || error);
//       }
//     };
//     fetchBrandsAndCategories();
//   }, []);
//   // Handle vehicle data from navigation state or fetch if vehicleId is provided
//   useEffect(() => {
//     if (!isDataLoaded) return;
//     const vehicleData = location.state?.vehicle; // Access vehicle data from navigation state
//     if (vehicleData) {
//       // console.log('Vehicle data from navigation state:', vehicleData); // Removed to stop spam; add back with useRef if needed for one-time debug
//       setVehicleData(vehicleData);
//     } else if (vehicleId) {
//       // Fallback to fetch vehicle data if navigation state is missing
//       const fetchVehicle = async () => {
//         try {
//           const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           });
//           const vehicle = response.data.data || response.data;
//           console.log('Vehicle data fetched for edit:', vehicle); // Debug log
//           setVehicleData(vehicle);
//         } catch (error) {
//           setToastMessage(error.response?.data?.message || 'Failed to fetch vehicle data');
//           setToastSeverity('error');
//           setOpenToast(true);
//           console.error('Error fetching vehicle:', error.response?.data || error);
//         }
//       };
//       fetchVehicle();
//     }
//   // Removed setVehicleData from deps to avoid function-reference sensitivity (it's stable via useCallback)
//   }, [isDataLoaded, vehicleId, vehicleKeyFromState]);
//   // Handlers for file uploads
//   const handleThumbnailFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setThumbnailFile(file);
//     }
//   };
//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };
//   const handleDropThumbnail = (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file) {
//       setThumbnailFile(file);
//     }
//   };
//   const handleVehicleImagesChange = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 0) {
//       setVehicleImages(files);
//     }
//   };
//   const handleDropImages = (event) => {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     if (files.length > 0) {
//       setVehicleImages(files);
//     }
//   };
//   const handleVehicleDocChange = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 0) {
//       setVehicleDoc(files);
//     }
//   };
//   const handleDropDoc = (event) => {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     if (files.length > 0) {
//       setVehicleDoc(files);
//     }
//   };
//   // Handle search tags
//   const handleTagInputChange = (event) => {
//     setCurrentTag(event.target.value);
//   };
//   const handleTagKeyPress = (event) => {
//     if (event.key === 'Enter' && currentTag.trim()) {
//       setSearchTags([...searchTags, currentTag.trim()]);
//       setCurrentTag('');
//       event.preventDefault();
//     }
//   };
//   const handleRemoveTag = (tagToRemove) => {
//     setSearchTags(searchTags.filter((tag) => tag !== tagToRemove));
//   };
//   // Validate license plate number
//   const validateLicensePlate = (value) => {
//     const regex = /^[A-Z0-9]{6,8}$/;
//     if (!regex.test(value)) {
//       setLicensePlateError('License plate must be 6-8 alphanumeric characters');
//       return false;
//     }
//     setLicensePlateError('');
//     return true;
//   };
//   // Reset form
//   const handleReset = () => {
//     setName('');
//     setDescription('');
//     setThumbnailFile(null);
//     setVehicleImages([]);
//     setVehicleDoc([]);
//     setBrand('');
//     setModel('');
//     setCategory('');
//     setType('');
//     setEngineCapacity('');
//     setEnginePower('');
//     setSeatingCapacity('');
//     setAirCondition('yes');
//     setFuelType('');
//     setTransmissionType('');
//     setVinNumber('');
//     setLicensePlateNumber('');
//     setLicensePlateError('');
//     setTripType('hourly');
//     setHourlyWisePrice('');
//     setPerDayPrice('');
//     setDistanceWisePrice('');
//     setDiscount('');
//     setSearchTags([]);
//     setCurrentTag('');
//   };
//   // Submit handler
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     // Validation
//     if (
//       !name ||
//       !brand ||
//       !model ||
//       !category ||
//       !type ||
//       !engineCapacity ||
//       !enginePower ||
//       !seatingCapacity ||
//       !fuelType ||
//       !transmissionType ||
//       !vinNumber ||
//       !licensePlateNumber ||
//       !tripType
//     ) {
//       setToastMessage('Please fill all required fields.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (
//       (tripType === 'hourly' && !hourlyWisePrice) ||
//       (tripType === 'perDay' && !perDayPrice) ||
//       (tripType === 'distanceWise' && !distanceWisePrice)
//     ) {
//       setToastMessage(`Please provide a price for ${tripType} trip type.`);
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (!thumbnailFile && !vehicleId) {
//       setToastMessage('Please upload a thumbnail image.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (vehicleImages.length === 0 && !vehicleId) {
//       setToastMessage('Please upload at least one vehicle image.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (vehicleDoc.length === 0 && !vehicleId) {
//       setToastMessage('Please upload at least one vehicle document.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (!validateLicensePlate(licensePlateNumber)) {
//       setToastMessage('Invalid license plate number.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     // Prepare FormData
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('description', description);
//     formData.append('brand', brand);
//     formData.append('category', category);
//     formData.append('model', model);
//     formData.append('type', type.toLowerCase());
//     formData.append('engineCapacity', parseInt(engineCapacity));
//     formData.append('enginePower', parseInt(enginePower));
//     formData.append('seatingCapacity', parseInt(seatingCapacity));
//     formData.append('airCondition', airCondition === 'yes');
//     formData.append('fuelType', fuelType.toLowerCase());
//     formData.append('transmissionType', transmissionType.toLowerCase());
//     formData.append('vinNumber', vinNumber);
//     formData.append('licensePlateNumber', licensePlateNumber);
//     formData.append('totalTrips', 0); // Initialize totalTrips
//     const pricing = {
//       type: tripType,
//       hourly: tripType === 'hourly' ? parseFloat(hourlyWisePrice) || 0 : 0,
//       perDay: tripType === 'perDay' ? parseFloat(perDayPrice) || 0 : 0,
//       distance: tripType === 'distanceWise' ? parseFloat(distanceWisePrice) || 0 : 0,
//     };
//     formData.append('pricing', JSON.stringify(pricing));
//     if (discount) {
//       formData.append('discount', parseFloat(discount));
//     }
//     searchTags.forEach((tag) => formData.append('searchTags[]', tag));
//     // Append files
//     if (thumbnailFile) {
//       formData.append('thumbnail', thumbnailFile);
//     }
//     vehicleImages.forEach((file) => {
//       formData.append('images', file);
//     });
//     vehicleDoc.forEach((file) => {
//       formData.append('documents', file);
//     });
//     // Debug FormData
//     const formDataEntries = {};
//     for (let [key, value] of formData.entries()) {
//       formDataEntries[key] = value instanceof File ? value.name : value;
//     }
//     console.log('FormData being sent:', formDataEntries);
//     try {
//       let response;
//       if (vehicleId) {
//         // Update vehicle
//         response = await axios.put(`${API_BASE_URL}/vehicles/${vehicleId}`, formData, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       } else {
//         // Create vehicle
//         response = await axios.post(`${API_BASE_URL}/vehicles`, formData, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       }
//       console.log('API Response:', response.data); // Debug response
//       setToastMessage(vehicleId ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       handleReset();
//       navigate('/vehicle-setup/lists');
//     } catch (error) {
//       let errorMsg = error.response?.data?.message || 'Failed to save vehicle';
//       if (error.response?.data?.errors) {
//         errorMsg = error.response.data.errors.map((err) => err.msg).join(', ');
//       }
//       setToastMessage(errorMsg);
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error saving vehicle:', error.response?.data || error);
//     }
//   };
//   // Delete handler
//   const handleDelete = async () => {
//     if (!vehicleId) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/vehicles/${vehicleId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setToastMessage('Vehicle deleted successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       handleReset();
//       navigate('/vehicle-setup/lists');
//     } catch (error) {
//       setToastMessage(error.response?.data?.message || 'Failed to delete vehicle');
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error deleting vehicle:', error.response?.data || error);
//     }
//   };
//   // Block handler
//   const handleBlock = async () => {
//     if (!vehicleId) return;
//     try {
//       await axios.patch(
//         `${API_BASE_URL}/vehicles/${vehicleId}/block`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setToastMessage('Vehicle blocked successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       navigate('/vehicle-setup/lists');
//     } catch (error) {
//       setToastMessage(error.response?.data?.message || 'Failed to block vehicle');
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error blocking vehicle:', error.response?.data || error);
//     }
//   };
//   // Reactivate handler
//   const handleReactivate = async () => {
//     if (!vehicleId) return;
//     try {
//       await axios.patch(
//         `${API_BASE_URL}/vehicles/${vehicleId}/reactivate`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setToastMessage('Vehicle reactivated successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       navigate('/vehicle-setup/lists');
//     } catch (error) {
//       setToastMessage(error.response?.data?.message || 'Failed to reactivate vehicle');
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error reactivating vehicle:', error.response?.data || error);
//     }
//   };
//   const handleCloseToast = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenToast(false);
//   };
//   return (
//     <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
//       <Box
//         sx={{
//           maxWidth: 'lg',
//           margin: 'auto',
//           backgroundColor: 'white',
//           borderRadius: theme.shape.borderRadius,
//           boxShadow: theme.shadows[1],
//           p: isSmallScreen ? 2 : 3,
//           overflowX: 'hidden',
//         }}
//       >
//         {/* Header Section */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <IconButton onClick={() => navigate('/vehicle-setup/lists')}>
//               <ArrowBackIcon />
//             </IconButton>
//             <img src="https://via.placeholder.com/24" alt="Vehicle Icon" style={{ marginRight: 8 }} />
//             <Typography variant="h5" component="h1">
//               {vehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}
//             </Typography>
//           </Box>
//           <Tooltip title="Settings">
//             <IconButton color="primary" sx={{ backgroundColor: 'white', border: `1px solid ${theme.palette.grey[300]}` }}>
//               <SettingsIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//         <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//           Insert the basic information of the vehicle
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit}>
//           {/* General Information & Vehicle Thumbnail */}
//           <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
//             <Card sx={{ flex: isSmallScreen ? 'auto' : 2, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   General Information
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert the basic information of the vehicle
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   label="Vehicle Name*"
//                   variant="outlined"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Type vehicle name"
//                   sx={{ mb: 2 }}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   label="Short Description"
//                   variant="outlined"
//                   multiline
//                   rows={4}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Type short description"
//                 />
//               </CardContent>
//             </Card>
//             <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Thumbnail*
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDropThumbnail}
//                   onClick={() => document.getElementById('thumbnail-upload').click()}
//                 >
//                   {thumbnailFile ? (
//                     <Box>
//                       <img
//                         src={URL.createObjectURL(thumbnailFile)}
//                         alt="Thumbnail preview"
//                         style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         {thumbnailFile.name}
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                         Click to upload
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Or drag and drop
//                       </Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="thumbnail-upload"
//                     hidden
//                     accept="image/jpeg,image/png,image/jpg"
//                     onChange={handleThumbnailFileChange}
//                   />
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Images Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Images*
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDropImages}
//                   onClick={() => document.getElementById('images-upload').click()}
//                 >
//                   {vehicleImages.length > 0 ? (
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
//                       {vehicleImages.map((file, index) => (
//                         <img
//                           key={index}
//                           src={URL.createObjectURL(file)}
//                           alt={`Vehicle image ${index + 1}`}
//                           style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: theme.shape.borderRadius }}
//                         />
//                       ))}
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 1, width: '100%' }}>
//                         {vehicleImages.length} image(s) selected
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                         Click to upload
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Or drag and drop
//                       </Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="images-upload"
//                     hidden
//                     accept="image/jpeg,image/png,image/jpg"
//                     multiple
//                     onChange={handleVehicleImagesChange}
//                   />
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Vehicle Information Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Information
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert The Vehicle's General Informations
//                 </Typography>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(3) }}>
//                   <Stack spacing={2}>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="brand-label">Brand*</InputLabel>
//                       <Select
//                         labelId="brand-label"
//                         id="brand-select"
//                         value={brand}
//                         label="Brand"
//                         onChange={(e) => setBrand(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle brand</MenuItem>
//                         {brands.map((b) => (
//                           <MenuItem key={b._id} value={b._id}>
//                             {b.title}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="type-label">Type*</InputLabel>
//                       <Select
//                         labelId="type-label"
//                         id="type-select"
//                         value={type}
//                         label="Type"
//                         onChange={(e) => setType(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle type</MenuItem>
//                         <MenuItem value="sedan">Sedan</MenuItem>
//                         <MenuItem value="suv">SUV</MenuItem>
//                         <MenuItem value="hatchback">Hatchback</MenuItem>
//                         <MenuItem value="coupe">Coupe</MenuItem>
//                         <MenuItem value="convertible">Convertible</MenuItem>
//                         <MenuItem value="truck">Truck</MenuItem>
//                         <MenuItem value="van">Van</MenuItem>
//                         <MenuItem value="motorcycle">Motorcycle</MenuItem>
//                       </Select>
//                     </FormControl>
//                     <FormControl fullWidth variant="outlined" required>
//                       <TextField
//                         id="seating-capacity-input"
//                         label="Seating Capacity*"
//                         variant="outlined"
//                         value={seatingCapacity}
//                         onChange={(e) => setSeatingCapacity(e.target.value)}
//                         placeholder="Input how many person can seat"
//                         type="number"
//                       />
//                     </FormControl>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="transmission-type-label">Transmission type*</InputLabel>
//                       <Select
//                         labelId="transmission-type-label"
//                         id="transmission-type-select"
//                         value={transmissionType}
//                         label="Transmission type"
//                         onChange={(e) => setTransmissionType(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle transmission</MenuItem>
//                         <MenuItem value="automatic">Automatic</MenuItem>
//                         <MenuItem value="manual">Manual</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Stack>
//                   <Stack spacing={2}>
//                     <TextField
//                       fullWidth
//                       label="Model*"
//                       variant="outlined"
//                       value={model}
//                       onChange={(e) => setModel(e.target.value)}
//                       placeholder="Model Name"
//                       required
//                     />
//                     <TextField
//                       fullWidth
//                       label="Engine Capacity (cc)*"
//                       variant="outlined"
//                       value={engineCapacity}
//                       onChange={(e) => setEngineCapacity(e.target.value)}
//                       placeholder="Ex: 2000"
//                       type="number"
//                       required
//                     />
//                     <FormControl component="fieldset" fullWidth>
//                       <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
//                         Air Condition
//                       </Typography>
//                       <RadioGroup row value={airCondition} onChange={(e) => setAirCondition(e.target.value)}>
//                         <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//                         <FormControlLabel value="no" control={<Radio />} label="No" />
//                       </RadioGroup>
//                     </FormControl>
//                   </Stack>
//                   <Stack spacing={2}>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="category-label">Category*</InputLabel>
//                       <Select
//                         labelId="category-label"
//                         id="category-select"
//                         value={category}
//                         label="Category"
//                         onChange={(e) => setCategory(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle category</MenuItem>
//                         {categories.map((c) => (
//                           <MenuItem key={c._id} value={c._id}>
//                             {c.title}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <TextField
//                       fullWidth
//                       label="Engine Power (hp)*"
//                       variant="outlined"
//                       value={enginePower}
//                       onChange={(e) => setEnginePower(e.target.value)}
//                       placeholder="Ex: 150"
//                       type="number"
//                       required
//                     />
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="fuel-type-label">Fuel type*</InputLabel>
//                       <Select
//                         labelId="fuel-type-label"
//                         id="fuel-type-select"
//                         value={fuelType}
//                         label="Fuel type"
//                         onChange={(e) => setFuelType(e.target.value)}
//                       >
//                         <MenuItem value="">Select fuel type</MenuItem>
//                         <MenuItem value="petrol">Petrol</MenuItem>
//                         <MenuItem value="diesel">Diesel</MenuItem>
//                         <MenuItem value="electric">Electric</MenuItem>
//                         <MenuItem value="hybrid">Hybrid</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Stack>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Vehicle Identity Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Identity
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert the vehicle's unique 17-character alphanumeric code,Use Capital Letters.
//                 </Typography>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(2, 1fr)', gap: theme.spacing(3) }}>
//                   <TextField
//                     fullWidth
//                     label="VIN Number*"
//                     variant="outlined"
//                     value={vinNumber}
//                     onChange={(e) => setVinNumber(e.target.value)}
//                     placeholder="Type VIN number"
//                     required
//                   />
//                   <TextField
//                     fullWidth
//                     label="License Plate Number*"
//                     variant="outlined"
//                     value={licensePlateNumber}
//                     onChange={(e) => {
//                       setLicensePlateNumber(e.target.value);
//                       validateLicensePlate(e.target.value);
//                     }}
//                     placeholder="Type license plate number (6-8 alphanumeric)"
//                     required
//                     error={!!licensePlateError}
//                     helperText={licensePlateError}
//                   />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Pricing & Discounts Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Pricing & Discounts
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert The Pricing & Discount Informations
//                 </Typography>
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="subtitle1" gutterBottom>
//                     Trip Type
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Choose the trip type you prefer.
//                   </Typography>
//                   <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(2) }}>
//                     <Card
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         cursor: 'pointer',
//                         borderColor: tripType === 'hourly' ? theme.palette.primary.main : undefined,
//                         borderWidth: tripType === 'hourly' ? 2 : 1,
//                       }}
//                       onClick={() => setTripType('hourly')}
//                     >
//                       <FormControlLabel
//                         control={<Radio checked={tripType === 'hourly'} onChange={() => setTripType('hourly')} />}
//                         label="Hourly"
//                         labelPlacement="start"
//                         sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         Set your hourly rental price.
//                       </Typography>
//                     </Card>
//                     <Card
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         cursor: 'pointer',
//                         borderColor: tripType === 'perDay' ? theme.palette.primary.main : undefined,
//                         borderWidth: tripType === 'perDay' ? 2 : 1,
//                       }}
//                       onClick={() => setTripType('perDay')}
//                     >
//                       <FormControlLabel
//                         control={<Radio checked={tripType === 'perDay'} onChange={() => setTripType('perDay')} />}
//                         label="Per Day"
//                         labelPlacement="start"
//                         sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         Set your Per Day rental price.
//                       </Typography>
//                     </Card>
//                     <Card
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         cursor: 'pointer',
//                         borderColor: tripType === 'distanceWise' ? theme.palette.primary.main : undefined,
//                         borderWidth: tripType === 'distanceWise' ? 2 : 1,
//                       }}
//                       onClick={() => setTripType('distanceWise')}
//                     >
//                       <FormControlLabel
//                         control={<Radio checked={tripType === 'distanceWise'} onChange={() => setTripType('distanceWise')} />}
//                         label="Distance Wise"
//                         labelPlacement="start"
//                         sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         Set your distance wise rental price.
//                       </Typography>
//                     </Card>
//                   </Box>
//                 </Box>
//                 {tripType === 'hourly' && (
//                   <Box sx={{ mb: 3 }}>
//                     <TextField
//                       fullWidth
//                       label="Hourly Wise Price ($/per hour)*"
//                       variant="outlined"
//                       value={hourlyWisePrice}
//                       onChange={(e) => setHourlyWisePrice(e.target.value)}
//                       placeholder="Ex: 35.25"
//                       type="number"
//                       inputProps={{ step: '0.01' }}
//                       required
//                     />
//                   </Box>
//                 )}
//                 {tripType === 'perDay' && (
//                   <Box sx={{ mb: 3 }}>
//                     <TextField
//                       fullWidth
//                       label="Per Day Price ($/per day)*"
//                       variant="outlined"
//                       value={perDayPrice}
//                       onChange={(e) => setPerDayPrice(e.target.value)}
//                       placeholder="Ex: 250.00"
//                       type="number"
//                       inputProps={{ step: '0.01' }}
//                       required
//                     />
//                   </Box>
//                 )}
//                 {tripType === 'distanceWise' && (
//                   <Box sx={{ mb: 3 }}>
//                     <TextField
//                       fullWidth
//                       label="Distance Wise Price ($/per km)*"
//                       variant="outlined"
//                       value={distanceWisePrice}
//                       onChange={(e) => setDistanceWisePrice(e.target.value)}
//                       placeholder="Ex: 1.50"
//                       type="number"
//                       inputProps={{ step: '0.01' }}
//                       required
//                     />
//                   </Box>
//                 )}
//                 <Box>
//                   <Typography variant="subtitle1" gutterBottom>
//                     Discount
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Set a discount amount (e.g., 10 for 10%)
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     label="Discount"
//                     variant="outlined"
//                     value={discount}
//                     onChange={(e) => setDiscount(e.target.value)}
//                     placeholder="Ex: 10"
//                     type="number"
//                     inputProps={{ step: 'any' }}
//                   />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Search Tags Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Search Tags
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert The Tags For Appear In User s Search List
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   label="Type and press Enter"
//                   variant="outlined"
//                   value={currentTag}
//                   onChange={handleTagInputChange}
//                   onKeyPress={handleTagKeyPress}
//                   placeholder="Type and press Enter"
//                   sx={{ mb: 2 }}
//                 />
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   {searchTags.map((tag, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         backgroundColor: theme.palette.grey[200],
//                         borderRadius: theme.shape.borderRadius,
//                         px: 1,
//                         py: 0.5,
//                       }}
//                     >
//                       <Typography variant="body2">{tag}</Typography>
//                       <IconButton size="small" onClick={() => handleRemoveTag(tag)}>
//                         <Typography sx={{ fontSize: 14 }}>×</Typography>
//                       </IconButton>
//                     </Box>
//                   ))}
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Vehicle Document Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Document*
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Upload related documents (PDF, DOC, DOCX). Max size 2MB
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDropDoc}
//                   onClick={() => document.getElementById('docs-upload').click()}
//                 >
//                   {vehicleDoc.length > 0 ? (
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
//                       {vehicleDoc.map((file, index) => (
//                         <Typography key={index} variant="body2" color="text.primary">
//                           📄 {file.name}
//                         </Typography>
//                       ))}
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                         {vehicleDoc.length} document(s) selected
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                         Click to upload
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Or drag and drop
//                       </Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="docs-upload"
//                     hidden
//                     accept=".pdf,.doc,.docx"
//                     multiple
//                     onChange={handleVehicleDocChange}
//                   />
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Action Buttons */}
//           <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             {vehicleId && (
//               <>
//                 <Button variant="outlined" color="error" size="large" onClick={handleDelete}>
//                   Delete
//                 </Button>
//                 <Button variant="outlined" color="warning" size="large" onClick={handleBlock}>
//                   Block
//                 </Button>
//                 <Button variant="outlined" color="success" size="large" onClick={handleReactivate}>
//                   Reactivate
//                 </Button>
//               </>
//             )}
//             <Button variant="outlined" color="inherit" size="large" onClick={handleReset}>
//               Reset
//             </Button>
//             <Button variant="contained" type="submit" size="large">
//               {vehicleId ? 'Update' : 'Submit'}
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//       <Snackbar
//         open={openToast}
//         autoHideDuration={3000}
//         onClose={handleCloseToast}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={handleCloseToast}
//           severity={toastSeverity}
//           sx={{
//             backgroundColor: toastSeverity === 'success' ? '#1976d2' : '#d32f2f',
//             color: 'white',
//           }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };
// export default Createnew;

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
//   Tooltip,
//   Stack,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   useTheme,
//   useMediaQuery,
//   Snackbar,
//   Alert,
// } from '@mui/material';
// import { CloudUpload as CloudUploadIcon, Settings as SettingsIcon, ArrowBack as ArrowBackIcon, DirectionsCar as DirectionsCarIcon } from '@mui/icons-material';
// import { styled } from '@mui/system';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
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
//     borderColor: theme.palette.primary.main,
//   },
//   '& input[type="file"]': {
//     display: 'none',
//   },
// }));
// const Createnew = ({ vehicleId }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
//   const location = useLocation(); // Access navigation state
//   const navigate = useNavigate(); // For navigation after update
//   // State for form fields
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [vehicleImages, setVehicleImages] = useState([]);
//   const [vehicleDoc, setVehicleDoc] = useState([]);
//   const [brand, setBrand] = useState('');
//   const [model, setModel] = useState('');
//   const [category, setCategory] = useState('');
//   const [type, setType] = useState('');
//   const [engineCapacity, setEngineCapacity] = useState('');
//   const [enginePower, setEnginePower] = useState('');
//   const [seatingCapacity, setSeatingCapacity] = useState('');
//   const [airCondition, setAirCondition] = useState('yes');
//   const [fuelType, setFuelType] = useState('');
//   const [transmissionType, setTransmissionType] = useState('');
//   const [vinNumber, setVinNumber] = useState('');
//   const [licensePlateNumber, setLicensePlateNumber] = useState('');
//   const [licensePlateError, setLicensePlateError] = useState('');
//   const [tripType, setTripType] = useState('hourly');
//   const [hourlyWisePrice, setHourlyWisePrice] = useState('');
//   const [perDayPrice, setPerDayPrice] = useState('');
//   const [distanceWisePrice, setDistanceWisePrice] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [searchTags, setSearchTags] = useState([]);
//   const [currentTag, setCurrentTag] = useState('');
//   const [openToast, setOpenToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastSeverity, setToastSeverity] = useState('success');
//   const [brands, setBrands] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   // Memo for vehicle key from state
//   const vehicleKeyFromState = useMemo(() => location.state?.vehicle?._id, [location.state]);
//   // API base URL
//   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae/api';
//   // Module ID for rental
//   const moduleId = localStorage.getItem('moduleId');
//   // Function to set vehicle data, enhancing brands/categories if necessary
//   const setVehicleData = useCallback((vehicle) => {
//     // Enhance brands only if needed (avoid unnecessary setState)
//     if (vehicle.brand && vehicle.brand._id && !brands.some((b) => b._id === vehicle.brand._id)) {
//       setBrands((prev) => [...prev, {
//         _id: vehicle.brand._id,
//         title: vehicle.brand.title || vehicle.brand.name || 'Unknown Brand',
//       }]);
//     }
//     // Enhance categories only if needed (avoid unnecessary setState)
//     if (vehicle.category && vehicle.category._id && !categories.some((c) => c._id === vehicle.category._id)) {
//       setCategories((prev) => [...prev, {
//         _id: vehicle.category._id,
//         title: vehicle.category.title || vehicle.category.name || 'Unknown Category',
//       }]);
//     }
//     // Set other states
//     setName(vehicle.name || '');
//     setDescription(vehicle.description || '');
//     setBrand(vehicle.brand?._id || '');
//     setCategory(vehicle.category?._id || '');
//     setModel(vehicle.model || '');
//     setType(vehicle.type || '');
//     setEngineCapacity(vehicle.engineCapacity?.toString() || '');
//     setEnginePower(vehicle.enginePower?.toString() || '');
//     setSeatingCapacity(vehicle.seatingCapacity?.toString() || '');
//     setAirCondition(vehicle.airCondition ? 'yes' : 'no');
//     setFuelType(vehicle.fuelType || '');
//     setTransmissionType(vehicle.transmissionType || '');
//     setVinNumber(vehicle.vinNumber || '');
//     setLicensePlateNumber(vehicle.licensePlateNumber || '');
//     setSearchTags(vehicle.searchTags || []);
//     if (vehicle.pricing) {
//       setTripType(vehicle.pricing.type || 'hourly');
//       setHourlyWisePrice(vehicle.pricing.hourly?.toString() || '');
//       setPerDayPrice(vehicle.pricing.perDay?.toString() || '');
//       setDistanceWisePrice(vehicle.pricing.distance?.toString() || '');
//     }
//     setDiscount(vehicle.discount?.toString() || '');
//   }, [brands, categories]);
//   // Fetch brands and categories
//   useEffect(() => {
//     const fetchBrandsAndCategories = async () => {
//       try {
//         const [brandsResponse, categoriesResponse] = await Promise.all([
//          axios.get(`${API_BASE_URL}/brands/module/${moduleId}`, {
//            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//          }),
//          axios.get(`${API_BASE_URL}/categories/modules/${moduleId}`, {
//            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//          }),
//         ]);
//         // Fix: Use .data directly (array), not .data.data
//         setBrands(brandsResponse.data || []);
//         setCategories(categoriesResponse.data || []);
//         console.log('Brands fetched:', brandsResponse.data);
//         console.log('Categories fetched:', categoriesResponse.data);
//         setIsDataLoaded(true);
//       } catch (error) {
//         setBrands([]);
//         setCategories([]);
//         setIsDataLoaded(true);
//         setToastMessage(error.response?.data?.message || 'Failed to fetch brands or categories');
//         setToastSeverity('error');
//         setOpenToast(true);
//         console.error('Error fetching brands/categories:', error.response?.data || error);
//       }
//     };
//     fetchBrandsAndCategories();
//   }, []);
//   // Handle vehicle data from navigation state or fetch if vehicleId is provided
//   useEffect(() => {
//     if (!isDataLoaded) return;
//     const vehicleData = location.state?.vehicle; // Access vehicle data from navigation state
//     if (vehicleData) {
//       // console.log('Vehicle data from navigation state:', vehicleData); // Removed to stop spam; add back with useRef if needed for one-time debug
//       setVehicleData(vehicleData);
//     } else if (vehicleId) {
//       // Fallback to fetch vehicle data if navigation state is missing
//       const fetchVehicle = async () => {
//         try {
//          const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}`, {
//            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//          });
//          const vehicle = response.data.data || response.data;
//          console.log('Vehicle data fetched for edit:', vehicle); // Debug log
//          setVehicleData(vehicle);
//         } catch (error) {
//          setToastMessage(error.response?.data?.message || 'Failed to fetch vehicle data');
//          setToastSeverity('error');
//          setOpenToast(true);
//          console.error('Error fetching vehicle:', error.response?.data || error);
//         }
//       };
//       fetchVehicle();
//     }
//   // Removed setVehicleData from deps to avoid function-reference sensitivity (it's stable via useCallback)
//   }, [isDataLoaded, vehicleId, vehicleKeyFromState]);
//   // Handlers for file uploads
//   const handleThumbnailFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setThumbnailFile(file);
//     }
//   };
//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };
//   const handleDropThumbnail = (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file) {
//       setThumbnailFile(file);
//     }
//   };
//   const handleVehicleImagesChange = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 0) {
//       setVehicleImages(files);
//     }
//   };
//   const handleDropImages = (event) => {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     if (files.length > 0) {
//       setVehicleImages(files);
//     }
//   };
//   const handleVehicleDocChange = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 0) {
//       setVehicleDoc(files);
//     }
//   };
//   const handleDropDoc = (event) => {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     if (files.length > 0) {
//       setVehicleDoc(files);
//     }
//   };
//   // Handle search tags
//   const handleTagInputChange = (event) => {
//     setCurrentTag(event.target.value);
//   };
//   const handleTagKeyPress = (event) => {
//     if (event.key === 'Enter' && currentTag.trim()) {
//       setSearchTags([...searchTags, currentTag.trim()]);
//       setCurrentTag('');
//       event.preventDefault();
//     }
//   };
//   const handleRemoveTag = (tagToRemove) => {
//     setSearchTags(searchTags.filter((tag) => tag !== tagToRemove));
//   };
//   // Validate license plate number
//   const validateLicensePlate = (value) => {
//     const regex = /^[A-Z0-9]{6,8}$/;
//     if (!regex.test(value)) {
//       setLicensePlateError('License plate must be 6-8 alphanumeric characters');
//       return false;
//     }
//     setLicensePlateError('');
//     return true;
//   };
//   // Reset form
//   const handleReset = () => {
//     setName('');
//     setDescription('');
//     setThumbnailFile(null);
//     setVehicleImages([]);
//     setVehicleDoc([]);
//     setBrand('');
//     setModel('');
//     setCategory('');
//     setType('');
//     setEngineCapacity('');
//     setEnginePower('');
//     setSeatingCapacity('');
//     setAirCondition('yes');
//     setFuelType('');
//     setTransmissionType('');
//     setVinNumber('');
//     setLicensePlateNumber('');
//     setLicensePlateError('');
//     setTripType('hourly');
//     setHourlyWisePrice('');
//     setPerDayPrice('');
//     setDistanceWisePrice('');
//     setDiscount('');
//     setSearchTags([]);
//     setCurrentTag('');
//   };
//   // Submit handler
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     // Validation
//     if (
//       !name ||
//       !brand ||
//       !model ||
//       !category ||
//       !type ||
//       !engineCapacity ||
//       !enginePower ||
//       !seatingCapacity ||
//       !fuelType ||
//       !transmissionType ||
//       !vinNumber ||
//       !licensePlateNumber ||
//       !tripType
//     ) {
//       setToastMessage('Please fill all required fields.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (
//       (tripType === 'hourly' && !hourlyWisePrice) ||
//       (tripType === 'perDay' && !perDayPrice) ||
//       (tripType === 'distanceWise' && !distanceWisePrice)
//     ) {
//       setToastMessage(`Please provide a price for ${tripType} trip type.`);
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (!thumbnailFile && !vehicleId) {
//       setToastMessage('Please upload a thumbnail image.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (vehicleImages.length === 0 && !vehicleId) {
//       setToastMessage('Please upload at least one vehicle image.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (vehicleDoc.length === 0 && !vehicleId) {
//       setToastMessage('Please upload at least one vehicle document.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     if (!validateLicensePlate(licensePlateNumber)) {
//       setToastMessage('Invalid license plate number.');
//       setToastSeverity('error');
//       setOpenToast(true);
//       return;
//     }
//     // Prepare FormData
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('description', description);
//     formData.append('brand', brand);
//     formData.append('category', category);
//     formData.append('model', model);
//     formData.append('type', type.toLowerCase());
//     formData.append('engineCapacity', parseInt(engineCapacity));
//     formData.append('enginePower', parseInt(enginePower));
//     formData.append('seatingCapacity', parseInt(seatingCapacity));
//     formData.append('airCondition', airCondition === 'yes');
//     formData.append('fuelType', fuelType.toLowerCase());
//     formData.append('transmissionType', transmissionType.toLowerCase());
//     formData.append('vinNumber', vinNumber);
//     formData.append('licensePlateNumber', licensePlateNumber);
//     formData.append('totalTrips', 0); // Initialize totalTrips
//     const pricing = {
//       type: tripType,
//       hourly: tripType === 'hourly' ? parseFloat(hourlyWisePrice) || 0 : 0,
//       perDay: tripType === 'perDay' ? parseFloat(perDayPrice) || 0 : 0,
//       distance: tripType === 'distanceWise' ? parseFloat(distanceWisePrice) || 0 : 0,
//     };
//     formData.append('pricing', JSON.stringify(pricing));
//     if (discount) {
//       formData.append('discount', parseFloat(discount));
//     }
//     searchTags.forEach((tag) => formData.append('searchTags[]', tag));
//     // Append files
//     if (thumbnailFile) {
//       formData.append('thumbnail', thumbnailFile);
//     }
//     vehicleImages.forEach((file) => {
//       formData.append('images', file);
//     });
//     vehicleDoc.forEach((file) => {
//       formData.append('documents', file);
//     });
//     // Debug FormData
//     const formDataEntries = {};
//     for (let [key, value] of formData.entries()) {
//       formDataEntries[key] = value instanceof File ? value.name : value;
//     }
//     console.log('FormData being sent:', formDataEntries);
//     try {
//       let response;
//       let newOrUpdatedVehicle;
//       if (vehicleId) {
//         // Update vehicle
//         response = await axios.put(`${API_BASE_URL}/vehicles/${vehicleId}`, formData, {
//          headers: {
//            Authorization: `Bearer ${localStorage.getItem('token')}`,
//            'Content-Type': 'multipart/form-data',
//          },
//         });
//         newOrUpdatedVehicle = response.data.data || response.data;
//       } else {
//         // Create vehicle
//         response = await axios.post(`${API_BASE_URL}/vehicles`, formData, {
//          headers: {
//            Authorization: `Bearer ${localStorage.getItem('token')}`,
//            'Content-Type': 'multipart/form-data',
//          },
//         });
//         newOrUpdatedVehicle = response.data.data || response.data;
//       }
//       console.log('API Response:', response.data); // Debug response
//       setToastMessage(vehicleId ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       handleReset();
//       // Pass the new/updated vehicle via navigation state for immediate list update
//       navigate('/vehicle-setup/lists', { state: { vehicle: newOrUpdatedVehicle } });
//     } catch (error) {
//       let errorMsg = error.response?.data?.message || 'Failed to save vehicle';
//       if (error.response?.data?.errors) {
//         errorMsg = error.response.data.errors.map((err) => err.msg).join(', ');
//       }
//       setToastMessage(errorMsg);
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error saving vehicle:', error.response?.data || error);
//     }
//   };
//   // Delete handler
//   const handleDelete = async () => {
//     if (!vehicleId) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/vehicles/${vehicleId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setToastMessage('Vehicle deleted successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       handleReset();
//       navigate('/vehicle-setup/lists');
//     } catch (error) {
//       setToastMessage(error.response?.data?.message || 'Failed to delete vehicle');
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error deleting vehicle:', error.response?.data || error);
//     }
//   };
//   // Block handler
//   const handleBlock = async () => {
//     if (!vehicleId) return;
//     try {
//       await axios.patch(
//         `${API_BASE_URL}/vehicles/${vehicleId}/block`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setToastMessage('Vehicle blocked successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       navigate('/vehicle-setup/lists');
//     } catch (error) {
//       setToastMessage(error.response?.data?.message || 'Failed to block vehicle');
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error blocking vehicle:', error.response?.data || error);
//     }
//   };
//   // Reactivate handler
//   const handleReactivate = async () => {
//     if (!vehicleId) return;
//     try {
//       await axios.patch(
//         `${API_BASE_URL}/vehicles/${vehicleId}/reactivate`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setToastMessage('Vehicle reactivated successfully!');
//       setToastSeverity('success');
//       setOpenToast(true);
//       navigate('/vehicle-setup/lists');
//     } catch (error) {
//       setToastMessage(error.response?.data?.message || 'Failed to reactivate vehicle');
//       setToastSeverity('error');
//       setOpenToast(true);
//       console.error('Error reactivating vehicle:', error.response?.data || error);
//     }
//   };
//   const handleCloseToast = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenToast(false);
//   };
//   return (
//     <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
//       <Box
//         sx={{
//          maxWidth: 'lg',
//          margin: 'auto',
//          backgroundColor: 'white',
//          borderRadius: theme.shape.borderRadius,
//          boxShadow: theme.shadows[1],
//          p: isSmallScreen ? 2 : 3,
//          overflowX: 'hidden',
//        }}
//       >
//         {/* Header Section */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <IconButton onClick={() => navigate('/vehicle-setup/lists')}>
//               <ArrowBackIcon />
//             </IconButton>
//             <DirectionsCarIcon sx={{ fontSize: 24, mr: 1 }} />
//             <Typography variant="h5" component="h1">
//               {vehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}
//             </Typography>
//           </Box>
//           <Tooltip title="Settings">
//             <IconButton color="primary" sx={{ backgroundColor: 'white', border: `1px solid ${theme.palette.grey[300]}` }}>
//               <SettingsIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//         <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//           Insert the basic information of the vehicle
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit}>
//           {/* General Information & Vehicle Thumbnail */}
//           <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
//             <Card sx={{ flex: isSmallScreen ? 'auto' : 2, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   General Information
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert the basic information of the vehicle
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   label="Vehicle Name*"
//                   variant="outlined"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Type vehicle name"
//                   sx={{ mb: 2 }}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   label="Short Description"
//                   variant="outlined"
//                   multiline
//                   rows={4}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Type short description"
//                 />
//               </CardContent>
//             </Card>
//             <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Thumbnail*
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDropThumbnail}
//                   onClick={() => document.getElementById('thumbnail-upload').click()}
//                 >
//                   {thumbnailFile ? (
//                     <Box>
//                       <img
//                         src={URL.createObjectURL(thumbnailFile)}
//                         alt="Thumbnail preview"
//                         style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         {thumbnailFile.name}
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                         Click to upload
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Or drag and drop
//                       </Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="thumbnail-upload"
//                     hidden
//                     accept="image/jpeg,image/png,image/jpg"
//                     onChange={handleThumbnailFileChange}
//                   />
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Images Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Images*
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDropImages}
//                   onClick={() => document.getElementById('images-upload').click()}
//                 >
//                   {vehicleImages.length > 0 ? (
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
//                       {vehicleImages.map((file, index) => (
//                         <img
//                           key={index}
//                           src={URL.createObjectURL(file)}
//                           alt={`Vehicle image ${index + 1}`}
//                           style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: theme.shape.borderRadius }}
//                         />
//                       ))}
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 1, width: '100%' }}>
//                         {vehicleImages.length} image(s) selected
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                         Click to upload
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Or drag and drop
//                       </Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="images-upload"
//                     hidden
//                     accept="image/jpeg,image/png,image/jpg"
//                     multiple
//                     onChange={handleVehicleImagesChange}
//                   />
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Vehicle Information Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Information
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert The Vehicle's General Informations
//                 </Typography>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(3) }}>
//                   <Stack spacing={2}>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="brand-label">Brand*</InputLabel>
//                       <Select
//                         labelId="brand-label"
//                         id="brand-select"
//                         value={brand}
//                         label="Brand"
//                         onChange={(e) => setBrand(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle brand</MenuItem>
//                         {brands.map((b) => (
//                           <MenuItem key={b._id} value={b._id}>
//                             {b.title}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="type-label">Type*</InputLabel>
//                       <Select
//                         labelId="type-label"
//                         id="type-select"
//                         value={type}
//                         label="Type"
//                         onChange={(e) => setType(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle type</MenuItem>
//                         <MenuItem value="sedan">Sedan</MenuItem>
//                         <MenuItem value="suv">SUV</MenuItem>
//                         <MenuItem value="hatchback">Hatchback</MenuItem>
//                         <MenuItem value="coupe">Coupe</MenuItem>
//                         <MenuItem value="convertible">Convertible</MenuItem>
//                         <MenuItem value="truck">Truck</MenuItem>
//                         <MenuItem value="van">Van</MenuItem>
//                         <MenuItem value="motorcycle">Motorcycle</MenuItem>
//                       </Select>
//                     </FormControl>
//                     <FormControl fullWidth variant="outlined" required>
//                       <TextField
//                         id="seating-capacity-input"
//                         label="Seating Capacity*"
//                         variant="outlined"
//                         value={seatingCapacity}
//                         onChange={(e) => setSeatingCapacity(e.target.value)}
//                         placeholder="Input how many person can seat"
//                         type="number"
//                       />
//                     </FormControl>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="transmission-type-label">Transmission type*</InputLabel>
//                       <Select
//                         labelId="transmission-type-label"
//                         id="transmission-type-select"
//                         value={transmissionType}
//                         label="Transmission type"
//                         onChange={(e) => setTransmissionType(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle transmission</MenuItem>
//                         <MenuItem value="automatic">Automatic</MenuItem>
//                         <MenuItem value="manual">Manual</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Stack>
//                   <Stack spacing={2}>
//                     <TextField
//                       fullWidth
//                       label="Model*"
//                       variant="outlined"
//                       value={model}
//                       onChange={(e) => setModel(e.target.value)}
//                       placeholder="Model Name"
//                       required
//                     />
//                     <TextField
//                       fullWidth
//                       label="Engine Capacity (cc)*"
//                       variant="outlined"
//                       value={engineCapacity}
//                       onChange={(e) => setEngineCapacity(e.target.value)}
//                       placeholder="Ex: 2000"
//                       type="number"
//                       required
//                     />
//                     <FormControl component="fieldset" fullWidth>
//                       <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
//                         Air Condition
//                       </Typography>
//                       <RadioGroup row value={airCondition} onChange={(e) => setAirCondition(e.target.value)}>
//                         <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//                         <FormControlLabel value="no" control={<Radio />} label="No" />
//                       </RadioGroup>
//                     </FormControl>
//                   </Stack>
//                   <Stack spacing={2}>
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="category-label">Category*</InputLabel>
//                       <Select
//                         labelId="category-label"
//                         id="category-select"
//                         value={category}
//                         label="Category"
//                         onChange={(e) => setCategory(e.target.value)}
//                       >
//                         <MenuItem value="">Select vehicle category</MenuItem>
//                         {categories.map((c) => (
//                           <MenuItem key={c._id} value={c._id}>
//                             {c.title}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <TextField
//                       fullWidth
//                       label="Engine Power (hp)*"
//                       variant="outlined"
//                       value={enginePower}
//                       onChange={(e) => setEnginePower(e.target.value)}
//                       placeholder="Ex: 150"
//                       type="number"
//                       required
//                     />
//                     <FormControl fullWidth variant="outlined" required>
//                       <InputLabel id="fuel-type-label">Fuel type*</InputLabel>
//                       <Select
//                         labelId="fuel-type-label"
//                         id="fuel-type-select"
//                         value={fuelType}
//                         label="Fuel type"
//                         onChange={(e) => setFuelType(e.target.value)}
//                       >
//                         <MenuItem value="">Select fuel type</MenuItem>
//                         <MenuItem value="petrol">Petrol</MenuItem>
//                         <MenuItem value="diesel">Diesel</MenuItem>
//                         <MenuItem value="electric">Electric</MenuItem>
//                         <MenuItem value="hybrid">Hybrid</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Stack>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Vehicle Identity Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Identity
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert the vehicle's unique 17-character alphanumeric code,Use Capital Letters.
//                 </Typography>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(2, 1fr)', gap: theme.spacing(3) }}>
//                   <TextField
//                     fullWidth
//                     label="VIN Number*"
//                     variant="outlined"
//                     value={vinNumber}
//                     onChange={(e) => setVinNumber(e.target.value)}
//                     placeholder="Type VIN number"
//                     required
//                   />
//                   <TextField
//                     fullWidth
//                     label="License Plate Number*"
//                     variant="outlined"
//                     value={licensePlateNumber}
//                     onChange={(e) => {
//                       setLicensePlateNumber(e.target.value);
//                       validateLicensePlate(e.target.value);
//                     }}
//                     placeholder="Type license plate number (6-8 alphanumeric)"
//                     required
//                     error={!!licensePlateError}
//                     helperText={licensePlateError}
//                   />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Pricing & Discounts Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Pricing & Discounts
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert The Pricing & Discount Informations
//                 </Typography>
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="subtitle1" gutterBottom>
//                     Trip Type
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Choose the trip type you prefer.
//                   </Typography>
//                   <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(2) }}>
//                     <Card
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         cursor: 'pointer',
//                         borderColor: tripType === 'hourly' ? theme.palette.primary.main : undefined,
//                         borderWidth: tripType === 'hourly' ? 2 : 1,
//                       }}
//                       onClick={() => setTripType('hourly')}
//                     >
//                       <FormControlLabel
//                         control={<Radio checked={tripType === 'hourly'} onChange={() => setTripType('hourly')} />}
//                         label="Hourly"
//                         labelPlacement="start"
//                         sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         Set your hourly rental price.
//                       </Typography>
//                     </Card>
//                     <Card
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         cursor: 'pointer',
//                         borderColor: tripType === 'perDay' ? theme.palette.primary.main : undefined,
//                         borderWidth: tripType === 'perDay' ? 2 : 1,
//                       }}
//                       onClick={() => setTripType('perDay')}
//                     >
//                       <FormControlLabel
//                         control={<Radio checked={tripType === 'perDay'} onChange={() => setTripType('perDay')} />}
//                         label="Per Day"
//                         labelPlacement="start"
//                         sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         Set your Per Day rental price.
//                       </Typography>
//                     </Card>
//                     <Card
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         cursor: 'pointer',
//                         borderColor: tripType === 'distanceWise' ? theme.palette.primary.main : undefined,
//                         borderWidth: tripType === 'distanceWise' ? 2 : 1,
//                       }}
//                       onClick={() => setTripType('distanceWise')}
//                     >
//                       <FormControlLabel
//                         control={<Radio checked={tripType === 'distanceWise'} onChange={() => setTripType('distanceWise')} />}
//                         label="Distance Wise"
//                         labelPlacement="start"
//                         sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         Set your distance wise rental price.
//                       </Typography>
//                     </Card>
//                   </Box>
//                 </Box>
//                 {tripType === 'hourly' && (
//                   <Box sx={{ mb: 3 }}>
//                     <TextField
//                       fullWidth
//                       label="Hourly Wise Price ($/per hour)*"
//                       variant="outlined"
//                       value={hourlyWisePrice}
//                       onChange={(e) => setHourlyWisePrice(e.target.value)}
//                       placeholder="Ex: 35.25"
//                       type="number"
//                       inputProps={{ step: '0.01' }}
//                       required
//                     />
//                   </Box>
//                 )}
//                 {tripType === 'perDay' && (
//                   <Box sx={{ mb: 3 }}>
//                     <TextField
//                       fullWidth
//                       label="Per Day Price ($/per day)*"
//                       variant="outlined"
//                       value={perDayPrice}
//                       onChange={(e) => setPerDayPrice(e.target.value)}
//                       placeholder="Ex: 250.00"
//                       type="number"
//                       inputProps={{ step: '0.01' }}
//                       required
//                     />
//                   </Box>
//                 )}
//                 {tripType === 'distanceWise' && (
//                   <Box sx={{ mb: 3 }}>
//                     <TextField
//                       fullWidth
//                       label="Distance Wise Price ($/per km)*"
//                       variant="outlined"
//                       value={distanceWisePrice}
//                       onChange={(e) => setDistanceWisePrice(e.target.value)}
//                       placeholder="Ex: 1.50"
//                       type="number"
//                       inputProps={{ step: '0.01' }}
//                       required
//                     />
//                   </Box>
//                 )}
//                 <Box>
//                   <Typography variant="subtitle1" gutterBottom>
//                     Discount
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Set a discount amount (e.g., 10 for 10%)
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     label="Discount"
//                     variant="outlined"
//                     value={discount}
//                     onChange={(e) => setDiscount(e.target.value)}
//                     placeholder="Ex: 10"
//                     type="number"
//                     inputProps={{ step: 'any' }}
//                   />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Search Tags Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Search Tags
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert The Tags For Appear In User s Search List
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   label="Type and press Enter"
//                   variant="outlined"
//                   value={currentTag}
//                   onChange={handleTagInputChange}
//                   onKeyPress={handleTagKeyPress}
//                   placeholder="Type and press Enter"
//                   sx={{ mb: 2 }}
//                 />
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   {searchTags.map((tag, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         backgroundColor: theme.palette.grey[200],
//                         borderRadius: theme.shape.borderRadius,
//                         px: 1,
//                         py: 0.5,
//                       }}
//                     >
//                       <Typography variant="body2">{tag}</Typography>
//                       <IconButton size="small" onClick={() => handleRemoveTag(tag)}>
//                         <Typography sx={{ fontSize: 14 }}>×</Typography>
//                       </IconButton>
//                     </Box>
//                   ))}
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Vehicle Document Section */}
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>
//                   Vehicle Document*
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Upload related documents (PDF, DOC, DOCX). Max size 2MB
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDropDoc}
//                   onClick={() => document.getElementById('docs-upload').click()}
//                 >
//                   {vehicleDoc.length > 0 ? (
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
//                       {vehicleDoc.map((file, index) => (
//                         <Typography key={index} variant="body2" color="text.primary">
//                           📄 {file.name}
//                         </Typography>
//                       ))}
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                         {vehicleDoc.length} document(s) selected
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
//                         Click to upload
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Or drag and drop
//                       </Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="docs-upload"
//                     hidden
//                     accept=".pdf,.doc,.docx"
//                     multiple
//                     onChange={handleVehicleDocChange}
//                   />
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//           </Box>
//           {/* Action Buttons */}
//           <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             {vehicleId && (
//               <>
//                 <Button variant="outlined" color="error" size="large" onClick={handleDelete}>
//                   Delete
//                 </Button>
//                 <Button variant="outlined" color="warning" size="large" onClick={handleBlock}>
//                   Block
//                 </Button>
//                 <Button variant="outlined" color="success" size="large" onClick={handleReactivate}>
//                   Reactivate
//                 </Button>
//               </>
//             )}
//             <Button variant="outlined" color="inherit" size="large" onClick={handleReset}>
//               Reset
//             </Button>
//             <Button variant="contained" type="submit" size="large">
//               {vehicleId ? 'Update' : 'Submit'}
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//       <Snackbar
//         open={openToast}
//         autoHideDuration={3000}
//         onClose={handleCloseToast}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={handleCloseToast}
//           severity={toastSeverity}
//           sx={{
//             backgroundColor: toastSeverity === 'success' ? '#1976d2' : '#d32f2f',
//             color: 'white',
//           }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };
// export default Createnew;




import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Settings as SettingsIcon, ArrowBack as ArrowBackIcon, DirectionsCar as DirectionsCarIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// Styled component for the upload area
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
    borderColor: theme.palette.primary.main,
  },
  '& input[type="file"]': {
    display: 'none',
  },
}));

const Createnew = ({ vehicleId }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation(); // Access navigation state
  const navigate = useNavigate(); // For navigation after update

  // Memo for vehicle key from state
  const vehicleKeyFromState = useMemo(() => location.state?.vehicle?._id, [location.state]);

  // Effective vehicle ID from prop or state
  const effectiveVehicleId = useMemo(() => {
    return vehicleId || location.state?.vehicle?._id || '';
  }, [vehicleId, vehicleKeyFromState]);

  // Initial view mode based on effective ID
  const initialViewMode = useMemo(() => {
    return effectiveVehicleId ? 'edit' : 'create';
  }, [effectiveVehicleId]);

  const [viewMode, setViewMode] = useState(initialViewMode);

  // State for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [vehicleDoc, setVehicleDoc] = useState([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [enginePower, setEnginePower] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [airCondition, setAirCondition] = useState('yes');
  const [fuelType, setFuelType] = useState('');
  const [transmissionType, setTransmissionType] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [licensePlateNumber, setLicensePlateNumber] = useState('');
  const [licensePlateError, setLicensePlateError] = useState('');
  const [tripType, setTripType] = useState('hourly');
  const [hourlyWisePrice, setHourlyWisePrice] = useState('');
  const [perDayPrice, setPerDayPrice] = useState('');
  const [distanceWisePrice, setDistanceWisePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae/api';
  // Module ID for rental
  const moduleId = localStorage.getItem('moduleId');

  // Function to set vehicle data, enhancing brands/categories if necessary
  const setVehicleData = useCallback((vehicle) => {
    // Enhance brands only if needed (avoid unnecessary setState)
    if (vehicle.brand && vehicle.brand._id && !brands.some((b) => b._id === vehicle.brand._id)) {
      setBrands((prev) => [...prev, {
        _id: vehicle.brand._id,
        title: vehicle.brand.title || vehicle.brand.name || 'Unknown Brand',
      }]);
    }
    // Enhance categories only if needed (avoid unnecessary setState)
    if (vehicle.category && vehicle.category._id && !categories.some((c) => c._id === vehicle.category._id)) {
      setCategories((prev) => [...prev, {
        _id: vehicle.category._id,
        title: vehicle.category.title || vehicle.category.name || 'Unknown Category',
      }]);
    }
    // Set other states
    setName(vehicle.name || '');
    setDescription(vehicle.description || '');
    setBrand(vehicle.brand?._id || '');
    setCategory(vehicle.category?._id || '');
    setModel(vehicle.model || '');
    setType(vehicle.type || '');
    setEngineCapacity(vehicle.engineCapacity?.toString() || '');
    setEnginePower(vehicle.enginePower?.toString() || '');
    setSeatingCapacity(vehicle.seatingCapacity?.toString() || '');
    setAirCondition(vehicle.airCondition ? 'yes' : 'no');
    setFuelType(vehicle.fuelType || '');
    setTransmissionType(vehicle.transmissionType || '');
    setVinNumber(vehicle.vinNumber || '');
    setLicensePlateNumber(vehicle.licensePlateNumber || '');
    setSearchTags(vehicle.searchTags || []);
    if (vehicle.pricing) {
      setTripType(vehicle.pricing.type || 'hourly');
      setHourlyWisePrice(vehicle.pricing.hourly?.toString() || '');
      setPerDayPrice(vehicle.pricing.perDay?.toString() || '');
      setDistanceWisePrice(vehicle.pricing.distance?.toString() || '');
    }
    setDiscount(vehicle.discount?.toString() || '');
  }, [brands, categories]);

  // Fetch brands and categories
  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/brands/module/${moduleId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${API_BASE_URL}/categories/modules/${moduleId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        // Fix: Use .data directly (array), not .data.data
        setBrands(brandsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        console.log('Brands fetched:', brandsResponse.data);
        console.log('Categories fetched:', categoriesResponse.data);
        setIsDataLoaded(true);
      } catch (error) {
        setBrands([]);
        setCategories([]);
        setIsDataLoaded(true);
        setToastMessage(error.response?.data?.message || 'Failed to fetch brands or categories');
        setToastSeverity('error');
        setOpenToast(true);
        console.error('Error fetching brands/categories:', error.response?.data || error);
      }
    };
    fetchBrandsAndCategories();
  }, []);

  // Handle vehicle data from navigation state or fetch if effectiveVehicleId is provided
  useEffect(() => {
    if (!isDataLoaded) return;
    const vehicleData = location.state?.vehicle;
    if (vehicleData) {
      // console.log('Vehicle data from navigation state:', vehicleData); // Removed to stop spam; add back with useRef if needed for one-time debug
      setVehicleData(vehicleData);
      setExistingThumbnail(vehicleData.thumbnail || '');
      setExistingImages(vehicleData.images || []);
      setExistingDocs(vehicleData.documents || []);
      setViewMode('edit');
    } else if (effectiveVehicleId) {
      const fetchVehicle = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/vehicles/${effectiveVehicleId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const vehicle = response.data.data || response.data;
          console.log('Vehicle data fetched for edit:', vehicle); // Debug log
          setVehicleData(vehicle);
          setExistingThumbnail(vehicle.thumbnail || '');
          setExistingImages(vehicle.images || []);
          setExistingDocs(vehicle.documents || []);
          setViewMode('edit');
        } catch (error) {
          setToastMessage(error.response?.data?.message || 'Failed to fetch vehicle data');
          setToastSeverity('error');
          setOpenToast(true);
          console.error('Error fetching vehicle:', error.response?.data || error);
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
    // Removed setVehicleData from deps to avoid function-reference sensitivity (it's stable via useCallback)
  }, [isDataLoaded, effectiveVehicleId, vehicleKeyFromState]);

  // Handlers for file uploads
  const handleThumbnailFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDropThumbnail = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };
  const handleVehicleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setVehicleImages(files);
    }
  };
  const handleDropImages = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setVehicleImages(files);
    }
  };
  const handleVehicleDocChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setVehicleDoc(files);
    }
  };
  const handleDropDoc = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setVehicleDoc(files);
    }
  };
  // Handle search tags
  const handleTagInputChange = (event) => {
    setCurrentTag(event.target.value);
  };
  const handleTagKeyPress = (event) => {
    if (event.key === 'Enter' && currentTag.trim()) {
      setSearchTags([...searchTags, currentTag.trim()]);
      setCurrentTag('');
      event.preventDefault();
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToRemove));
  };
  // Validate license plate number
  const validateLicensePlate = (value) => {
    const regex = /^[A-Z0-9]{6,8}$/;
    if (!regex.test(value)) {
      setLicensePlateError('License plate must be 6-8 alphanumeric characters');
      return false;
    }
    setLicensePlateError('');
    return true;
  };
  // Reset form
  const handleReset = () => {
    setName('');
    setDescription('');
    setThumbnailFile(null);
    setVehicleImages([]);
    setVehicleDoc([]);
    setBrand('');
    setModel('');
    setCategory('');
    setType('');
    setEngineCapacity('');
    setEnginePower('');
    setSeatingCapacity('');
    setAirCondition('yes');
    setFuelType('');
    setTransmissionType('');
    setVinNumber('');
    setLicensePlateNumber('');
    setLicensePlateError('');
    setTripType('hourly');
    setHourlyWisePrice('');
    setPerDayPrice('');
    setDistanceWisePrice('');
    setDiscount('');
    setSearchTags([]);
    setCurrentTag('');
    setExistingThumbnail('');
    setExistingImages([]);
    setExistingDocs([]);
    setViewMode('create');
  };
  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEdit = viewMode === 'edit';
    console.log('Debug - effectiveVehicleId:', effectiveVehicleId, 'viewMode:', viewMode, 'URL:', window.location.pathname);
    setLoading(true);
    // Validation
    if (
      !name ||
      !brand ||
      !model ||
      !category ||
      !type ||
      !engineCapacity ||
      !enginePower ||
      !seatingCapacity ||
      !fuelType ||
      !transmissionType ||
      !vinNumber ||
      !licensePlateNumber ||
      !tripType
    ) {
      setToastMessage('Please fill all required fields.');
      setToastSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    if (
      (tripType === 'hourly' && !hourlyWisePrice) ||
      (tripType === 'perDay' && !perDayPrice) ||
      (tripType === 'distanceWise' && !distanceWisePrice)
    ) {
      setToastMessage(`Please provide a price for ${tripType} trip type.`);
      setToastSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    if (!thumbnailFile && !existingThumbnail && !isEdit) {
      setToastMessage('Please upload a thumbnail image.');
      setToastSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    if (vehicleImages.length === 0 && existingImages.length === 0 && !isEdit) {
      setToastMessage('Please upload at least one vehicle image.');
      setToastSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    if (vehicleDoc.length === 0 && existingDocs.length === 0 && !isEdit) {
      setToastMessage('Please upload at least one vehicle document.');
      setToastSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    if (!validateLicensePlate(licensePlateNumber)) {
      setToastMessage('Invalid license plate number.');
      setToastSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    // Prepare FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('brand', brand);
    formData.append('category', category);
    formData.append('model', model);
    formData.append('type', type.toLowerCase());
    formData.append('engineCapacity', parseInt(engineCapacity));
    formData.append('enginePower', parseInt(enginePower));
    formData.append('seatingCapacity', parseInt(seatingCapacity));
    formData.append('airCondition', airCondition === 'yes');
    formData.append('fuelType', fuelType.toLowerCase());
    formData.append('transmissionType', transmissionType.toLowerCase());
    formData.append('vinNumber', vinNumber);
    formData.append('licensePlateNumber', licensePlateNumber);
    formData.append('totalTrips', 0); // Initialize totalTrips
    const pricing = {
      type: tripType,
      hourly: tripType === 'hourly' ? parseFloat(hourlyWisePrice) || 0 : 0,
      perDay: tripType === 'perDay' ? parseFloat(perDayPrice) || 0 : 0,
      distance: tripType === 'distanceWise' ? parseFloat(distanceWisePrice) || 0 : 0,
    };
    // Append pricing as nested fields instead of JSON string
    formData.append('pricing[type]', pricing.type);
    formData.append('pricing[hourly]', pricing.hourly);
    formData.append('pricing[perDay]', pricing.perDay);
    formData.append('pricing[distance]', pricing.distance);
    if (discount) {
      formData.append('discount', parseFloat(discount));
    }
    searchTags.forEach((tag) => formData.append('searchTags[]', tag));
    // Append files
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    vehicleImages.forEach((file) => {
      formData.append('images', file);
    });
    vehicleDoc.forEach((file) => {
      formData.append('documents', file);
    });
    // Debug FormData
    const formDataEntries = {};
    for (let [key, value] of formData.entries()) {
      formDataEntries[key] = value instanceof File ? value.name : value;
    }
    console.log('FormData being sent:', formDataEntries);
    try {
      let response;
      let newOrUpdatedVehicle;
      if (isEdit) {
        // Update vehicle
        if (!effectiveVehicleId) {
          throw new Error('Invalid vehicle ID for update');
        }
        response = await axios.put(`${API_BASE_URL}/vehicles/${effectiveVehicleId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        newOrUpdatedVehicle = response.data.data || response.data;
      } else {
        // Create vehicle
        response = await axios.post(`${API_BASE_URL}/vehicles`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        newOrUpdatedVehicle = response.data.data || response.data;
      }
      console.log('API Response:', response.data); // Debug response
      setToastMessage(isEdit ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
      setToastSeverity('success');
      setOpenToast(true);
      handleReset();
      if (isEdit) {
        // Pass the new/updated vehicle via navigation state for immediate list update
        navigate('/vehicle-setup/lists', { state: { vehicle: newOrUpdatedVehicle } });
      }
    } catch (error) {
      let errorMsg = error.response?.data?.message || 'Failed to save vehicle';
      if (error.response?.data?.errors) {
        errorMsg = error.response.data.errors.map((err) => err.msg).join(', ');
      }
      setToastMessage(errorMsg);
      setToastSeverity('error');
      setOpenToast(true);
      console.error('Error saving vehicle:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const isEdit = viewMode === 'edit';

  return (
    <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box
        sx={{
          maxWidth: 'lg',
          margin: 'auto',
          backgroundColor: 'white',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          p: isSmallScreen ? 2 : 3,
          overflowX: 'hidden',
        }}
      >
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isEdit && (
              <IconButton onClick={() => navigate('/vehicle-setup/lists')} color="primary">
                <ArrowBackIcon />
              </IconButton>
            )}
            <DirectionsCarIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography variant="h5" component="h1">
              {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
            </Typography>
          </Box>
          <Tooltip title="Settings">
            <IconButton color="primary" sx={{ backgroundColor: 'white', border: `1px solid ${theme.palette.grey[300]}` }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Insert the basic information of the vehicle
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {/* General Information & Vehicle Thumbnail */}
          <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 2, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  General Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert the basic information of the vehicle
                </Typography>
                <TextField
                  fullWidth
                  label="Vehicle Name*"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type vehicle name"
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Short Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type short description"
                />
              </CardContent>
            </Card>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Thumbnail*
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropThumbnail}
                  onClick={() => document.getElementById('thumbnail-upload').click()}
                >
                  {thumbnailFile ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {thumbnailFile.name}
                      </Typography>
                    </Box>
                  ) : existingThumbnail ? (
                    <Box>
                      <img
                        src={existingThumbnail}
                        alt="Existing thumbnail"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Existing thumbnail. Upload to replace.
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                        Click to upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Or drag and drop
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="thumbnail-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleThumbnailFileChange}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          {/* Images Section */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Images*
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropImages}
                  onClick={() => document.getElementById('images-upload').click()}
                >
                  {vehicleImages.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {vehicleImages.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Vehicle image ${index + 1}`}
                          style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: theme.shape.borderRadius }}
                        />
                      ))}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, width: '100%' }}>
                        {vehicleImages.length} image(s) selected
                      </Typography>
                    </Box>
                  ) : existingImages.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {existingImages.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Existing vehicle image ${index + 1}`}
                          style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: theme.shape.borderRadius }}
                        />
                      ))}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, width: '100%' }}>
                        {existingImages.length} existing image(s). Upload to replace.
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                        Click to upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Or drag and drop
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="images-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                    onChange={handleVehicleImagesChange}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          {/* Vehicle Information Section */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert The Vehicle's General Informations
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(3) }}>
                  <Stack spacing={2}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="brand-label">Brand*</InputLabel>
                      <Select
                        labelId="brand-label"
                        id="brand-select"
                        value={brand}
                        label="Brand"
                        onChange={(e) => setBrand(e.target.value)}
                      >
                        <MenuItem value="">Select vehicle brand</MenuItem>
                        {brands.map((b) => (
                          <MenuItem key={b._id} value={b._id}>
                            {b.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="type-label">Type*</InputLabel>
                      <Select
                        labelId="type-label"
                        id="type-select"
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <MenuItem value="">Select vehicle type</MenuItem>
                        <MenuItem value="sedan">Sedan</MenuItem>
                        <MenuItem value="suv">SUV</MenuItem>
                        <MenuItem value="hatchback">Hatchback</MenuItem>
                        <MenuItem value="coupe">Coupe</MenuItem>
                        <MenuItem value="convertible">Convertible</MenuItem>
                        <MenuItem value="truck">Truck</MenuItem>
                        <MenuItem value="van">Van</MenuItem>
                        <MenuItem value="motorcycle">Motorcycle</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined" required>
                      <TextField
                        id="seating-capacity-input"
                        label="Seating Capacity*"
                        variant="outlined"
                        value={seatingCapacity}
                        onChange={(e) => setSeatingCapacity(e.target.value)}
                        placeholder="Input how many person can seat"
                        type="number"
                      />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="transmission-type-label">Transmission type*</InputLabel>
                      <Select
                        labelId="transmission-type-label"
                        id="transmission-type-select"
                        value={transmissionType}
                        label="Transmission type"
                        onChange={(e) => setTransmissionType(e.target.value)}
                      >
                        <MenuItem value="">Select vehicle transmission</MenuItem>
                        <MenuItem value="automatic">Automatic</MenuItem>
                        <MenuItem value="manual">Manual</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Model*"
                      variant="outlined"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Model Name"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Engine Capacity (cc)*"
                      variant="outlined"
                      value={engineCapacity}
                      onChange={(e) => setEngineCapacity(e.target.value)}
                      placeholder="Ex: 2000"
                      type="number"
                      required
                    />
                    <FormControl component="fieldset" fullWidth>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        Air Condition
                      </Typography>
                      <RadioGroup row value={airCondition} onChange={(e) => setAirCondition(e.target.value)}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                  <Stack spacing={2}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="category-label">Category*</InputLabel>
                      <Select
                        labelId="category-label"
                        id="category-select"
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <MenuItem value="">Select vehicle category</MenuItem>
                        {categories.map((c) => (
                          <MenuItem key={c._id} value={c._id}>
                            {c.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Engine Power (hp)*"
                      variant="outlined"
                      value={enginePower}
                      onChange={(e) => setEnginePower(e.target.value)}
                      placeholder="Ex: 150"
                      type="number"
                      required
                    />
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="fuel-type-label">Fuel type*</InputLabel>
                      <Select
                        labelId="fuel-type-label"
                        id="fuel-type-select"
                        value={fuelType}
                        label="Fuel type"
                        onChange={(e) => setFuelType(e.target.value)}
                      >
                        <MenuItem value="">Select fuel type</MenuItem>
                        <MenuItem value="petrol">Petrol</MenuItem>
                        <MenuItem value="diesel">Diesel</MenuItem>
                        <MenuItem value="electric">Electric</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* Vehicle Identity Section */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Identity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert the vehicle's unique 17-character alphanumeric code,Use Capital Letters.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(2, 1fr)', gap: theme.spacing(3) }}>
                  <TextField
                    fullWidth
                    label="VIN Number*"
                    variant="outlined"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value)}
                    placeholder="Type VIN number"
                    required
                  />
                  <TextField
                    fullWidth
                    label="License Plate Number*"
                    variant="outlined"
                    value={licensePlateNumber}
                    onChange={(e) => {
                      setLicensePlateNumber(e.target.value);
                      validateLicensePlate(e.target.value);
                    }}
                    placeholder="Type license plate number (6-8 alphanumeric)"
                    required
                    error={!!licensePlateError}
                    helperText={licensePlateError}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* Pricing & Discounts Section */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Pricing & Discounts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert The Pricing & Discount Informations
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trip Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose the trip type you prefer.
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(2) }}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: tripType === 'hourly' ? theme.palette.primary.main : undefined,
                        borderWidth: tripType === 'hourly' ? 2 : 1,
                      }}
                      onClick={() => setTripType('hourly')}
                    >
                      <FormControlLabel
                        control={<Radio checked={tripType === 'hourly'} onChange={() => setTripType('hourly')} />}
                        label="Hourly"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Set your hourly rental price.
                      </Typography>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: tripType === 'perDay' ? theme.palette.primary.main : undefined,
                        borderWidth: tripType === 'perDay' ? 2 : 1,
                      }}
                      onClick={() => setTripType('perDay')}
                    >
                      <FormControlLabel
                        control={<Radio checked={tripType === 'perDay'} onChange={() => setTripType('perDay')} />}
                        label="Per Day"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Set your Per Day rental price.
                      </Typography>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: tripType === 'distanceWise' ? theme.palette.primary.main : undefined,
                        borderWidth: tripType === 'distanceWise' ? 2 : 1,
                      }}
                      onClick={() => setTripType('distanceWise')}
                    >
                      <FormControlLabel
                        control={<Radio checked={tripType === 'distanceWise'} onChange={() => setTripType('distanceWise')} />}
                        label="Distance Wise"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Set your distance wise rental price.
                      </Typography>
                    </Card>
                  </Box>
                </Box>
                {tripType === 'hourly' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Hourly Wise Price ($/per hour)*"
                      variant="outlined"
                      value={hourlyWisePrice}
                      onChange={(e) => setHourlyWisePrice(e.target.value)}
                      placeholder="Ex: 35.25"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      required
                    />
                  </Box>
                )}
                {tripType === 'perDay' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Per Day Price ($/per day)*"
                      variant="outlined"
                      value={perDayPrice}
                      onChange={(e) => setPerDayPrice(e.target.value)}
                      placeholder="Ex: 250.00"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      required
                    />
                  </Box>
                )}
                {tripType === 'distanceWise' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Distance Wise Price ($/per km)*"
                      variant="outlined"
                      value={distanceWisePrice}
                      onChange={(e) => setDistanceWisePrice(e.target.value)}
                      placeholder="Ex: 1.50"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      required
                    />
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Discount
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set a discount amount (e.g., 10 for 10%)
                  </Typography>
                  <TextField
                    fullWidth
                    label="Discount"
                    variant="outlined"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Ex: 10"
                    type="number"
                    inputProps={{ step: 'any' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* Search Tags Section */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Search Tags
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert The Tags For Appear In User s Search List
                </Typography>
                <TextField
                  fullWidth
                  label="Type and press Enter"
                  variant="outlined"
                  value={currentTag}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Type and press Enter"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {searchTags.map((tag, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.grey[200],
                        borderRadius: theme.shape.borderRadius,
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      <Typography variant="body2">{tag}</Typography>
                      <IconButton size="small" onClick={() => handleRemoveTag(tag)}>
                        <Typography sx={{ fontSize: 14 }}>×</Typography>
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* Vehicle Document Section */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Document*
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload related documents (PDF, DOC, DOCX). Max size 2MB
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropDoc}
                  onClick={() => document.getElementById('docs-upload').click()}
                >
                  {vehicleDoc.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      {vehicleDoc.map((file, index) => (
                        <Typography key={index} variant="body2" color="text.primary">
                          📄 {file.name}
                        </Typography>
                      ))}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {vehicleDoc.length} document(s) selected
                      </Typography>
                    </Box>
                  ) : existingDocs.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      {existingDocs.map((doc, index) => (
                        <Box key={index}>
                          <Typography variant="body2" color="text.primary">
                            📄 {doc.split('/').pop() || doc}
                          </Typography>
                          {doc && <a href={doc} target="_blank" rel="noopener noreferrer">View</a>}
                        </Box>
                      ))}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {existingDocs.length} existing document(s). Upload to replace.
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                        Click to upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Or drag and drop
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="docs-upload"
                    hidden
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleVehicleDocChange}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="inherit" size="large" onClick={handleReset}>
              {isEdit ? 'Cancel' : 'Reset'}
            </Button>
            <Button variant="contained" type="submit" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
              {loading ? 'Submitting...' : isEdit ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            minWidth: '600px',
            maxWidth: '600px',
            width: 'auto',
          },
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{
            width: '100%',
            backgroundColor: toastSeverity === 'success' ? '#1976d2' : '#d32f2f',
            color: 'white',
            '& .MuiAlert-message': {
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              fontSize: '1rem',
              lineHeight: 1.5,
            },
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Createnew;