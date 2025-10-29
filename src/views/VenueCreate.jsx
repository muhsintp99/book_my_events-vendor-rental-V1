// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Box, Typography, TextField, Button, Card, CardContent, CardMedia, IconButton, Stack, Radio, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Switch, Snackbar, Alert, CircularProgress, Checkbox, Dialog, DialogContent, DialogActions, RadioGroup, Chip } from '@mui/material';
// import { Visibility, Edit } from '@mui/icons-material';
// import {
//   CloudUpload as CloudUploadIcon,
//   ArrowBack as ArrowBackIcon,
// } from '@mui/icons-material';
// import { styled } from '@mui/system';
// import { useTheme, useMediaQuery } from '@mui/material';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
// const defaultTimeSlots = {
//   monday: {
//     morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '08:00', startPeriod: 'Pm', endTime: '12:00', endPeriod: 'Am', price: '' }
//   },
//   tuesday: {
//     morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   wednesday: {
//     morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   thursday: {
//     morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   friday: {
//     morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '00:00', startPeriod: 'Am', endTime: '00:00', endPeriod: 'Pm', price: '' }
//   },
//   saturday: {
//     morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   sunday: {
//     morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   }
// };
// const resetTimeSlots = {
//   monday: {
//     morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: true, startTime: '08:00', startPeriod: 'Pm', endTime: '12:00', endPeriod: 'Am', price: '' }
//   },
//   tuesday: {
//     morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   wednesday: {
//     morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   thursday: {
//     morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   friday: {
//     morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: false, startTime: '00:00', startPeriod: 'Am', endTime: '00:00', endPeriod: 'Pm', price: '' }
//   },
//   saturday: {
//     morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   },
//   sunday: {
//     morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
//     evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
//   }
// };
// const transformToArray = (timeSlots, venueType) => {
//   const schedule = {};
//   ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(dayLower => {
//     schedule[dayLower] = {
//       morning: null,
//       evening: null
//     };
//     const morning = timeSlots[dayLower]?.morning;
//     if (morning?.enabled && morning.price.trim()) {
//       const priceValue = parseFloat(morning.price) || 0;
//       schedule[dayLower].morning = {
//         startTime: morning.startTime,
//         startAmpm: morning.startPeriod.toUpperCase(),
//         endTime: morning.endTime,
//         endAmpm: morning.endPeriod.toUpperCase(),
//         perDay: venueType === 'per_function' ? priceValue : 0,
//         perHour: venueType === 'per_hour' ? priceValue : 0,
//         perPerson: venueType === 'per_person' ? priceValue : 0
//       };
//     }
//     const evening = timeSlots[dayLower]?.evening;
//     if (evening?.enabled && evening.price.trim()) {
//       const priceValue = parseFloat(evening.price) || 0;
//       schedule[dayLower].evening = {
//         startTime: evening.startTime,
//         startAmpm: evening.startPeriod.toUpperCase(),
//         endTime: evening.endTime,
//         endAmpm: evening.endPeriod.toUpperCase(),
//         perDay: venueType === 'per_function' ? priceValue : 0,
//         perHour: venueType === 'per_hour' ? priceValue : 0,
//         perPerson: venueType === 'per_person' ? priceValue : 0
//       };
//     }
//   });
//   return schedule;
// };
// const transformToTimeSlots = (pricingSchedule) => {
//   const timeSlots = { ...defaultTimeSlots };
//   if (typeof pricingSchedule === 'object' && !Array.isArray(pricingSchedule)) {
//     Object.entries(pricingSchedule).forEach(([day, slots]) => {
//       const dayLower = day.toLowerCase();
//       if (timeSlots[dayLower]) {
//         // Morning slot
//         if (slots.morning) {
//           const price = slots.morning.perDay || slots.morning.perHour || slots.morning.perPerson || 0;
//           timeSlots[dayLower].morning = {
//             enabled: true,
//             startTime: slots.morning.startTime || '08:00',
//             startPeriod: (slots.morning.startAmpm || 'AM').toLowerCase(),
//             endTime: slots.morning.endTime || '03:00',
//             endPeriod: (slots.morning.endAmpm || 'PM').toLowerCase(),
//             price: price.toString()
//           };
//         }
//         // Evening slot
//         if (slots.evening) {
//           const price = slots.evening.perDay || slots.evening.perHour || slots.evening.perPerson || 0;
//           timeSlots[dayLower].evening = {
//             enabled: true,
//             startTime: slots.evening.startTime || '08:00',
//             startPeriod: (slots.evening.startAmpm || 'PM').toLowerCase(),
//             endTime: slots.evening.endTime || '12:00',
//             endPeriod: (slots.evening.endAmpm || 'AM').toLowerCase(),
//             price: price.toString()
//           };
//         }
//       }
//     });
//   } else if (Array.isArray(pricingSchedule)) {
//     // Handle old format (array)
//     pricingSchedule.forEach(slot => {
//       const dayLower = slot.day.toLowerCase();
//       const slotType = slot.slotType;
//       if (timeSlots[dayLower] && timeSlots[dayLower][slotType]) {
//         const price = slot.perDay || slot.perHour || slot.perPerson || slot.price || 0;
//         timeSlots[dayLower][slotType] = {
//           ...timeSlots[dayLower][slotType],
//           enabled: true,
//           startTime: slot.startTime,
//           startPeriod: slot.startAmpm.toLowerCase(),
//           endTime: slot.endTime,
//           endPeriod: slot.endAmpm.toLowerCase(),
//           price: price.toString()
//         };
//       }
//     });
//   }
//   return timeSlots;
// };
// const CreateAuditorium = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   useEffect(() => {
//     const refreshedKey = id ? `venue-refreshed-${id}` : 'venue-create-refreshed';
//     const alreadyRefreshed = sessionStorage.getItem(refreshedKey);
//     if (!alreadyRefreshed) {
//       sessionStorage.setItem(refreshedKey, 'true');
//       setTimeout(() => {
//         window.location.reload();
//       }, 150);
//     } else {
//       Object.keys(sessionStorage)
//         .filter((key) => key.startsWith('venue-refreshed-') || key === 'venue-create-refreshed')
//         .forEach((key) => {
//           if (key !== refreshedKey) sessionStorage.removeItem(key);
//         });
//     }
//   }, [id]);
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
//   const API_BASE_URL = 'https://api.bookmyevent.ae/api';
//   const BASE_URL = 'https://bookmyevent.ae';
//   const GOOGLE_MAPS_API_KEY = 'AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78';
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const [viewMode, setViewMode] = useState(id ? 'edit' : 'create');
//   const [formData, setFormData] = useState({
//     venueName: '',
//     description: '',
//     venueAddress: '',
//     categories: '',
//     latitude: '',
//     longitude: '',
//     openingHours: '',
//     closingHours: '',
//     holidayScheduling: '',
//     parkingAvailability: false,
//     parkingCapacity: '',
//     foodCateringAvailability: false,
//     stageLightingAudio: false,
//     wheelchairAccessibility: false,
//     securityArrangements: false,
//     wifiAvailability: false,
//     acAvailable: false,
//     nonAcAvailable: false,
//     acType: 'Not Specified',
//     washroomsInfo: '',
//     dressingRooms: '',
//     venueType: '',
//     discount: '',
//     advanceDeposit: '',
//     cancellationPolicy: '',
//     extraCharges: '',
//     seatingArrangement: '',
//     maxGuestsSeated: '',
//     maxGuestsStanding: '',
//     multipleHalls: false,
//     nearbyTransport: '',
//     accessibilityInfo: '',
//     elderlyAccessibility: false,
//     searchTags: '',
//     selectedPackageIds: [],
//   });
//   const [categories, setCategories] = useState([]);
//   const [fetchedPackages, setFetchedPackages] = useState([]);
//   const [selectedPackages, setSelectedPackages] = useState([]);
//   const [files, setFiles] = useState({ thumbnail: null, auditoriumImage: null, floorPlan: null, documents: null });
//   const [existingImages, setExistingImages] = useState({
//     thumbnail: '',
//     auditoriumImage: '',
//     floorPlan: '',
//     documents: '',
//   });
//   //timeslotes
//   const [timeSlots, setTimeSlots] = useState(defaultTimeSlots);
//   const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
//   const [loading, setLoading] = useState(false);
//   // Map states
//   const [mapsLoaded, setMapsLoaded] = useState(false);
//   const [map, setMap] = useState(null);
//   // Fetch venue data if in edit mode
//   const [openPreview, setOpenPreview] = useState(false);
//   const [previewSrc, setPreviewSrc] = useState('');
//   const inputSx = {
//     '& .MuiOutlinedInput-root': {
//       '&.Mui-focused': {
//         '& .MuiOutlinedInput-notchedOutline': {
//           borderColor: '#E15B65',
//         },
//       },
//       '&:hover': {
//         '& .MuiOutlinedInput-notchedOutline': {
//           borderColor: '#E15B65',
//         },
//       },
//     },
//   };
//   useEffect(() => {
//     fetchCategories();
//     fetchPackages();
//   }, []);
//   useEffect(() => {
//     if (id) {
//       fetchVenue(id);
//     }
//   }, [id]);
//   useEffect(() => {
//     const state = location.state;
//     if (state?.selectedPackages) {
//       setSelectedPackages(state.selectedPackages);
//       setFormData(prev => ({ ...prev, selectedPackageIds: state.selectedPackages.map(p => p._id) }));
//     }
//   }, [location]);
//   useEffect(() => {
//     if (id && fetchedPackages.length > 0 && formData.selectedPackageIds.length > 0) {
//       setSelectedPackages(fetchedPackages.filter(p => formData.selectedPackageIds.includes(p._id)));
//     }
//   }, [fetchedPackages, formData.selectedPackageIds, id]);
//  // Fetch packages
//   const fetchPackages = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const providerId = localStorage.getItem('providerId') || localStorage.getItem('moduleId');

//       console.log('Fetching packages with providerId:', providerId);

//       if (!providerId) {
//         console.warn('Provider ID not available');
//         setFetchedPackages([]);
//         return;
//       }
//       if (!token) {
//         console.warn('Token not available');
//         setFetchedPackages([]);
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/packages/provider/${providerId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
//       if (!response.ok) {
//         console.error(`HTTP error! Status: ${response.status}`);
//         setFetchedPackages([]);
//         return;
//       }
//       const result = await response.json();
//       console.log('Packages API Response:', result);

//       // Handle the response format from your API
//       let packages = [];
//       if (result.packages && Array.isArray(result.packages)) {
//         packages = result.packages;
//       } else if (result.success && Array.isArray(result.data)) {
//         packages = result.data;
//       }
//       console.log('Parsed packages:', packages);
//       setFetchedPackages(packages);
//       if (packages.length === 0) {
//         console.log('No packages found for this provider');
//       }
//     } catch (error) {
//       console.error('Error fetching packages:', error);
//       setFetchedPackages([]);
//     }
//   };
//   // Load Google Maps script
//   useEffect(() => {
//     if (!GOOGLE_MAPS_API_KEY) {
//       console.warn('Google Maps API key not provided');
//       setToast({ open: true, message: 'Google Maps API key is required for map features.', severity: 'warning' });
//       return;
//     }
//     if (window.google && window.google.maps) {
//       setMapsLoaded(true);
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = () => {
//       setMapsLoaded(true);
//     };
//     document.head.appendChild(script);
//     return () => {
//       if (document.head.contains(script)) {
//         document.head.removeChild(script);
//       }
//     };
//   }, [GOOGLE_MAPS_API_KEY]);
//   // Initialize map when mapsLoaded becomes true
//   useEffect(() => {
//     if (mapsLoaded && window.google && window.google.maps) {
//       initMap();
//     }
//   }, [mapsLoaded]);
//   const initMap = useCallback(() => {
//     if (!window.google || !mapRef.current || !mapsLoaded) return;
//     const centerLat = formData.latitude && formData.longitude ? parseFloat(formData.latitude) : 20.5937;
//     const centerLng = formData.latitude && formData.longitude ? parseFloat(formData.longitude) : 78.9629;
//     const center = { lat: centerLat, lng: centerLng };
//     const newMap = new window.google.maps.Map(mapRef.current, {
//       zoom: 12,
//       center,
//     });
//     // Add click listener
//     newMap.addListener('click', (event) => {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();
//       setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
//     // Remove existing marker
//       if (markerRef.current) {
//         markerRef.current.setMap(null);
//       }
//       // Add new marker
//       markerRef.current = new window.google.maps.Marker({
//         position: { lat, lng },
//         map: newMap,
//       });
//       // Reverse geocode to get address
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//         if (status === 'OK' && results[0]) {
//           setFormData(prev => ({ ...prev, venueAddress: results[0].formatted_address }));
//           setToast({ open: true, message: 'Location set and address auto-filled!', severity: 'success' });
//         } else {
//           setToast({ open: true, message: 'Location set, but could not determine address.', severity: 'info' });
//         }
//       });
//     });
//     setMap(newMap);
//   }, [mapsLoaded, formData.latitude, formData.longitude]);
//   useEffect(() => {
//     if (!mapsLoaded || !map || !searchInputRef.current || !window.google) return;
//     const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
//       fields: ["place_id", "geometry", "name", "formatted_address"],
//     });
//     const listener = autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();
//       if (!place.geometry || !place.geometry.location) return;
//       const loc = place.geometry.location;
//       if (place.geometry.viewport) {
//         map.fitBounds(place.geometry.viewport);
//       } else {
//         map.setCenter(loc);
//         map.setZoom(17);
//       }
//       // Remove existing marker
//       if (markerRef.current) {
//         markerRef.current.setMap(null);
//       }
//       markerRef.current = new window.google.maps.Marker({
//         position: loc,
//         map,
//       });
//       setFormData(prev => ({
//         ...prev,
//         latitude: loc.lat().toString(),
//         longitude: loc.lng().toString(),
//         venueAddress: place.formatted_address || place.name
//       }));
//       setToast({ open: true, message: 'Location selected!', severity: 'success' });
//     });
//     return () => {
//       if (window.google && window.google.maps.event) {
//         window.google.maps.event.removeListener(listener);
//       }
//     };
//   }, [mapsLoaded, map]);
//   useEffect(() => {
//     if (!map || !formData.latitude || !formData.longitude) return;
//     const pos = { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) };
//     map.setCenter(pos);
//     map.setZoom(12);
//     if (!markerRef.current) {
//       markerRef.current = new window.google.maps.Marker({
//         position: pos,
//         map,
//       });
//     } else {
//       markerRef.current.setPosition(pos);
//     }
//   }, [formData.latitude, formData.longitude, map]);
//   // Handlers
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };
//   const handleFileChange = (key) => (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFiles((prev) => ({ ...prev, [key]: file }));
//     }
//   };
//   const handleDrop = (key) => (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file) {
//       setFiles((prev) => ({ ...prev, [key]: file }));
//     }
//   };
//   //timeslot
//   const handleTimeSlotChange = (day, slot, field, value) => {
//     setTimeSlots(prev => ({
//       ...prev,
//       [day]: {
//         ...prev[day],
//         [slot]: {
//           ...prev[day][slot],
//           [field]: value
//         }
//       }
//     }));
//   };
//   const handleDragOver = (event) => event.preventDefault();
//   const handleReset = () => {
//     setFormData({
//       venueName: '',
//       description: '',
//       venueAddress: '',
//       categories: '',
//       latitude: '',
//       longitude: '',
//       openingHours: '',
//       closingHours: '',
//       holidayScheduling: '',
//       parkingAvailability: false,
//       parkingCapacity: '',
//       foodCateringAvailability: false,
//       stageLightingAudio: false,
//       wheelchairAccessibility: false,
//       securityArrangements: false,
//       wifiAvailability: false,
//       acAvailable: false,
//       nonAcAvailable: false,
//       acType: 'Not Specified',
//       washroomsInfo: '',
//       dressingRooms: '',
//       venueType: '',
//       discount: '',
//       advanceDeposit: '',
//       cancellationPolicy: '',
//       extraCharges: '',
//       seatingArrangement: '',
//       maxGuestsSeated: '',
//       maxGuestsStanding: '',
//       multipleHalls: false,
//       nearbyTransport: '',
//       accessibilityInfo: '',
//       elderlyAccessibility: false,
//       searchTags: '',
//       selectedPackageIds: [],
//     });
//     setSelectedPackages([]);
//     setTimeSlots(resetTimeSlots);
//     setFiles({ thumbnail: null, auditoriumImage: null, floorPlan: null, documents: null });
//     setExistingImages({ thumbnail: '', auditoriumImage: '', floorPlan: '', documents: '' });
//     // setToast({ open: false, message: '', severity: 'success' });
//     setViewMode('create');
//     if (markerRef.current) {
//       markerRef.current.setMap(null);
//       markerRef.current = null;
//     }
//     if (map) {
//       setMap(null);
//     }
//   };
//   const validateForm = () => {
//     const errors = [];
//     if (!formData.venueName.trim()) errors.push('Venue name is required');
//     if (!formData.venueAddress.trim()) errors.push('Venue address is required');
//     if (!formData.categories) errors.push('Category is required');
//     if (!formData.seatingArrangement) errors.push('Seating arrangement is required');
//     if (!formData.maxGuestsSeated) errors.push('Max guests seated is required');
//     if (!formData.venueType) errors.push('Venue type is required');
//     if (viewMode === 'create') {
//       if (!files.thumbnail) errors.push('Thumbnail image is required');
//       if (!files.auditoriumImage) errors.push('Auditorium image is required');
//     } else {
//       if (!files.thumbnail && !existingImages.thumbnail) errors.push('Thumbnail image is required');
//       if (!files.auditoriumImage && !existingImages.auditoriumImage) errors.push('Auditorium image is required');
//     }
//     const hasPricing = Object.values(timeSlots).some(day =>
//       (day.morning.enabled && day.morning.price.trim()) || (day.evening.enabled && day.evening.price.trim())
//     );
//     if (!hasPricing) {
//       errors.push('At least one time slot with price is required');
//     }
//     if (formData.foodCateringAvailability && (!formData.selectedPackageIds || formData.selectedPackageIds.length === 0)) {
//       errors.push('At least one food package is required');
//     }
//     return errors;
//   };
//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const moduleId = localStorage.getItem('moduleId'); // ✅ use same logic as working page
//       const API_BASE_URL_LOCAL = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';
//       if (!token) {
//         console.warn('No authentication token found.');
//         return;
//       }
//       if (!moduleId) {
//         console.warn('No moduleId found in localStorage.');
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL_LOCAL}/api/categories/modules/${moduleId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const result = await response.json();
//       if (result.success && Array.isArray(result.data)) {
//         const formattedCategories = result.data.map((category) => ({
//           id: category.categories || category._id || '',
//           name: category?.title || category.name || 'Unnamed Category',
//         }));
//         setCategories(formattedCategories);
//       } else {
//         setToast({
//           open: true,
//           message: 'No categories found.',
//           severity: 'warning',
//         });
//         setCategories([]);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       setToast({
//         open: true,
//         message: 'Failed to fetch categories. Please try again.',
//         severity: 'error',
//       });
//       setCategories([]);
//     }
//   };
//   const fetchVenue = async (id) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found. Please log in.');
//       }
//       const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await response.json();
//       if (!result.success) {
//         throw new Error(result.message || 'Failed to fetch venue');
//       }
//       setFormData({
//         venueName: result.data.venueName || '',
//         description: result.data.shortDescription || '',
//         venueAddress: result.data.venueAddress || '',
//         categories: result?.data?.categories?.[0]?._id || '',
//         latitude: result.data.latitude?.toString() || '',
//         longitude: result.data.longitude?.toString() || '',
//         openingHours: result.data.openingHours || '',
//         closingHours: result.data.closingHours || '',
//         holidayScheduling: result.data.holidaySchedule || '',
//         parkingAvailability: !!result.data.parkingAvailability,
//         parkingCapacity: result.data.parkingCapacity || '',
//         foodCateringAvailability: !!result.data.foodCateringAvailability,
//         stageLightingAudio: !!result.data.stageLightingAudio,
//         wheelchairAccessibility: !!result.data.wheelchairAccessibility,
//         securityArrangements: !!result.data.securityArrangements,
//         wifiAvailability: !!result.data.wifiAvailability,
//         acAvailable: !!result.data.acAvailable,
//         nonAcAvailable: !!result.data.nonAcAvailable,
//         acType: result.data.acType || 'Not Specified',
//         washroomsInfo: result.data.washroomsInfo || '',
//         dressingRooms: result.data.dressingRooms || '',
//         venueType: result.data.venueType || '',
//         discount: result.data.discount || '',
//         advanceDeposit: result.data.advanceDeposit || '',
//         cancellationPolicy: result.data.cancellationPolicy || '',
//         extraCharges: result.data.extraCharges || '',
//         seatingArrangement: result.data.seatingArrangement || '',
//         maxGuestsSeated: result.data.maxGuestsSeated || '',
//         maxGuestsStanding: result.data.maxGuestsStanding || '',
//         multipleHalls: !!result.data.multipleHalls,
//         nearbyTransport: result.data.nearbyTransport || '',
//         accessibilityInfo: result.data.accessibilityInfo || '',
//         elderlyAccessibility: !!result.data.accessibilityInfo,
//         searchTags: Array.isArray(result.data.searchTags)
//           ? result.data.searchTags.join(', ')
//           : result.data.searchTags || '',
//         selectedPackageIds: result.data.packages || [],
//       });
//       console.log("hello", formData?.categories);
//       setTimeSlots(transformToTimeSlots(result.data.pricingSchedule) || defaultTimeSlots);
//       setExistingImages({
//         thumbnail: result.data.thumbnail || '',
//         auditoriumImage: result.data.images?.[0] || '',
//         floorPlan: result.data.images?.[1] || '',
//         documents: result.data.documents || '',
//       });
//       setViewMode('edit');
//     } catch (error) {
//       console.error('Error fetching venue:', error);
//       setToast({
//         open: true,
//         message: error.message.includes('expired')
//           ? 'Session expired. Please log in again.'
//           : `Error fetching venue: ${error.message}`,
//         severity: 'error',
//       });
//       if (error.message.includes('expired')) {
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   const submitPricing = async (venueId, token, venueType, pricingSchedule) => {
//     const pricingData = new FormData();
//     pricingData.append('venueId', venueId);
//     pricingData.append('venueType', venueType);
//     const formattedPricing = {};
//     Object.entries(pricingSchedule).forEach(([day, slots]) => {
//       formattedPricing[day] = {};
//       Object.entries(slots).forEach(([slotType, slot]) => {
//         if (slot) {
//           formattedPricing[day][slotType] = {
//             startTime: slot.startTime || "",
//             startAmpm: slot.startAmpm || "AM",
//             endTime: slot.endTime || "",
//             endAmpm: slot.endAmpm || "PM",
//             perDay:
//               formData.venueType === "per_function" ? Number(slot.price || 0) : 0,
//             perHour:
//               formData.venueType === "per_hour" ? Number(slot.price || 0) : 0,
//             perPerson:
//               formData.venueType === "per_person" ? Number(slot.price || 0) : 0,
//           };
//         } else {
//           formattedPricing[day][slotType] = null;
//         }
//       });
//     });
//     pricingData.append("pricingSchedule", JSON.stringify(formattedPricing));
//     const response = await fetch(`${API_BASE_URL}/venues/${venueId}/pricing`, {
//       method: 'PUT',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: pricingData,
//     });
//     const result = await response.json();
//     if (!result.success) {
//       throw new Error(result.message || 'Failed to update pricing');
//     }
//     return result;
//   };
// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setLoading(true);
//   setToast({ open: false, message: '', severity: 'success' });
//   const token = localStorage.getItem('token');
//   if (!token) {
//     setToast({
//       open: true,
//       message: 'No authentication token found. Please log in.',
//       severity: 'error',
//     });
//     setLoading(false);
//     return;
//   }
//   const validationErrors = validateForm();
//   if (validationErrors.length > 0) {
//     setToast({
//       open: true,
//       message: validationErrors.join(', '),
//       severity: 'error',
//     });
//     setLoading(false);
//     return;
//   }
//   try {
//     let venueId = id;
//     // ---------- STEP 2: CREATE OR UPDATE VENUE ----------
//     const data = new FormData();
//     const booleanFields = [
//       'parkingAvailability',
//       'foodCateringAvailability',
//       'stageLightingAudio',
//       'wheelchairAccessibility',
//       'securityArrangements',
//       'wifiAvailability',
//       'acAvailable',
//       'nonAcAvailable',
//       'multipleHalls',
//       'elderlyAccessibility',
//     ];
//     const payload = {
//       ...formData,
//       shortDescription: formData.description || '',
//       holidaySchedule: formData.holidayScheduling || '',
//       categories: formData.categories || '',
//       accessibilityInfo: formData.accessibilityInfo || '',
//     };
//     delete payload.description;
//     delete payload.holidayScheduling;
//     delete payload.venueType;
//     delete payload.selectedPackageIds;
//     Object.entries(payload).forEach(([key, value]) => {
//       if (key === 'searchTags' && value) {
//         const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
//         tagsArray.forEach(tag => data.append(key, tag));
//       } else if (booleanFields.includes(key)) {
//         data.append(key, value.toString());
//       } else {
//         data.append(key, value || '');
//       }
//     });
//     data.append('venueType', formData.venueType || '');
//     const pricingSchedule = transformToArray(timeSlots, formData.venueType);
//     data.append('pricingSchedule', JSON.stringify(pricingSchedule));
//     // ✅ Attach packageId if exists
//     if (formData.selectedPackageIds && formData.selectedPackageIds.length > 0) {
//       // Your backend may accept either `packageId` or `packages` array
//       // adjust accordingly (most likely `packages`)
//       data.append('packages', JSON.stringify(formData.selectedPackageIds));
//     }
//     if (files.thumbnail) data.append('thumbnail', files.thumbnail);
//     if (files.auditoriumImage) data.append('images', files.auditoriumImage);
//     if (files.floorPlan) data.append('images', files.floorPlan);
//     let venueRes;
//     if (viewMode === 'create') {
//       venueRes = await fetch(`${API_BASE_URL}/venues/`, {
//         method: 'POST',
//         body: data,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } else {
//       venueRes = await fetch(`${API_BASE_URL}/venues/${id}`, {
//         method: 'PUT',
//         body: data,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     }
//     const venueResult = await venueRes.json();
//     if (!venueRes.ok || !venueResult.success) {
//       throw new Error(venueResult.message || 'Failed to create/update venue');
//     }
//     venueId = venueResult.data?._id || venueResult._id;
//     console.log('✅ Venue created/updated:', venueId);
//     // ---------- STEP 3: LINK PACKAGE TO VENUE (if created after) ----------
//     if (formData.selectedPackageIds && formData.selectedPackageIds.length > 0 && viewMode === 'edit') {
//       const linkRes = await fetch(`${API_BASE_URL}/venues/${venueId}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ packages: formData.selectedPackageIds }),
//       });
//       const linkResult = await linkRes.json();
//       if (!linkRes.ok) {
//         console.error('Failed to link package to venue:', linkResult.message);
//       }
//     }
//     // ---------- SUCCESS ----------
//     setToast({
//       open: true,
//       message:
//         viewMode === 'edit'
//           ? 'Venue updated successfully with package details'
//           : 'Venue created successfully with package details',
//       severity: 'success',
//     });
//     if (viewMode === 'edit') {
//       setTimeout(() => navigate('/venue-setup/lists'), 2000);
//     } else {
//       handleReset();
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     setToast({
//       open: true,
//       message: error.message.includes('expired')
//         ? 'Session expired. Please log in again.'
//         : `Error ${viewMode === 'edit' ? 'updating' : 'creating'} venue: ${error.message}`,
//       severity: 'error',
//     });
//     if (error.message.includes('expired')) navigate('/login');
//   } finally {
//     setLoading(false);
//   }
// };
// const handleCloseToast = (event, reason) => {
//     if (reason === 'clickaway') return;
//     setToast({ open: false, message: '', severity: 'success' });
//   };
//   const getImageSrc = (path) => path ? `${BASE_URL}/${path}` : '';
//   return (
//     <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
//       <Box sx={{maxWidth: 'lg',margin: 'auto',backgroundColor: 'white',borderRadius: theme.shape.borderRadius,boxShadow: theme.shadows[1],p: isSmallScreen ? 2 : 3,overflowX: 'hidden',}}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             {viewMode === 'edit' && (
//               <IconButton onClick={() => navigate('/venue-setup/lists')} color="primary">
//                 <ArrowBackIcon />
//               </IconButton>
//             )}
//             <Typography variant="h4" component="h1">{viewMode === 'edit' ? 'Edit Venue' : 'Add New Venue'}</Typography>
//           </Box>
// </Box>
//         <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//           Insert the venue details
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit}>
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h4" gutterBottom>Venue Details</Typography>
//                 <TextField
//                   fullWidth
//                   label="Venue Name*" name="venueName"
//                   value={formData.venueName}
//                   onChange={handleInputChange}
//                   placeholder="Type venue name"
//                   sx={{ mb: 2, ...inputSx }}
//                   required/>
//                 <TextField
//                   fullWidth
//                   label="Description" name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   placeholder="Describe your auditorium"
//                   multiline
//                   rows={4}
//                   sx={{ mb: 2, ...inputSx }}/>
//                 <FormControl fullWidth variant="outlined" required sx={{ mb: 2, ...inputSx }}>
//                   <InputLabel id="category-label">Category*</InputLabel>
//                   <Select
//                     labelId="category-label" name="categories"
//                     value={formData.categories} label="Category"
//                     onChange={handleInputChange}>
//                     <MenuItem value="">Select category</MenuItem>
//                     {categories.map((category) => (
//                       <MenuItem key={category.id} value={category.id}>
//                         {category.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 <TextField
//                   fullWidth label="Search Location"
//                   inputRef={searchInputRef}
//                   variant="outlined"
//                   placeholder="Enter a location"
//                   sx={{ mb: 2, ...inputSx }} />
//                 {mapsLoaded && GOOGLE_MAPS_API_KEY ? (
//                   <>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                       Click on the map below to select a location
//                     </Typography>
//                     <Box
//                       ref={mapRef}
//                       sx={{
//                         height: 300,
//                         width: '100%',
//                         borderRadius: theme.shape.borderRadius,
//                         border: `1px solid ${theme.palette.grey[300]}`,
//                         mb: 2,
//                       }}/>
//                   </>
//                 ) : (
//                   <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: theme.shape.borderRadius, mb: 2 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       Map loading...
//                     </Typography>
//                   </Box>
//                 )}
//                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                   <TextField
//                     sx={{ flex: 1, ...inputSx }}
//                     label="Latitude*" name="latitude"
//                     value={formData.latitude}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 25.2048"
//                     type="number" inputProps={{ step: '0.0001' }} required/>
//                   <TextField
//                     sx={{ flex: 1, ...inputSx }}
//                     label="Longitude*" name="longitude"
//                     value={formData.longitude}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 55.2708"
//                     type="number" inputProps={{ step: '0.0001' }} required/>
//                 </Box>
//                 <TextField
//                   fullWidth
//                   label="Venue Address*" name="venueAddress"
//                   value={formData.venueAddress}
//                   onChange={handleInputChange}
//                   placeholder="Enter complete address"
//                   multiline rows={2}
//                   sx={{ mb: 2, ...inputSx }} required/>
//                 <Box sx={{ mb: 4 }}>
//                   <Typography variant="h6" gutterBottom>Operating Hours</Typography>
//                   <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                     <TextField
//                       fullWidth
//                       label="Opening Hours" name="openingHours"
//                       value={formData.openingHours}
//                       onChange={handleInputChange} placeholder="e.g., 09:00 AM" sx={inputSx}/>
//                     <TextField
//                       fullWidth label="Closing Hours"
//                       name="closingHours" value={formData.closingHours}
//                       onChange={handleInputChange} placeholder="e.g., 11:00 PM"
//                       sx={inputSx}/>
//                   </Box>
//                   <TextField
//                     fullWidth label="Holiday Scheduling"
//                     name="holidayScheduling" value={formData.holidayScheduling}
//                     onChange={handleInputChange}
//                     placeholder="Describe holiday hours or closures"
//                     multiline rows={2} sx={inputSx}/>
//                 </Box>
// </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
//             <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>Venue Thumbnail*</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Choose the main image that represents your venue.
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop('thumbnail')}
//                   onClick={() => document.getElementById('thumbnail-upload').click()}>
//                   {files.thumbnail ? (
//                     <Box>
//                       <img
//                         src={URL.createObjectURL(files.thumbnail)}
//                         alt="Thumbnail preview"
//                         style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
//                       />
//                       <Typography variant="body2" color="text.secondary">{files.thumbnail.name}</Typography>
//                     </Box>
//                   ) : existingImages.thumbnail ? (
//                     <Box>
//                       <img
//                         src={getImageSrc(existingImages.thumbnail)}
//                         alt="Existing thumbnail"
//                         style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
//                       />
//                       <Typography variant="body2" color="text.secondary">Existing thumbnail. Upload to replace.</Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
//                       <Typography variant="body2" color="#f59299ff">Or drag and drop</Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="thumbnail-upload"
//                     hidden
//                     accept="image/jpeg,image/png,image/jpg"
//                     onChange={handleFileChange('thumbnail')} />
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//             <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>Auditorium Image*</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   JPG, JPEG, PNG Less Than 2MB
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop('auditoriumImage')}
//                   onClick={() => document.getElementById('auditorium-image-upload').click()} >
//                   {files.auditoriumImage ? (
//                     <Box>
//                       <img
//                         src={URL.createObjectURL(files.auditoriumImage)}
//                         alt="Auditorium image preview"
//                         style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
//                       />
//                       <Typography variant="body2" color="text.secondary">{files.auditoriumImage.name}</Typography>
//                     </Box>
//                   ) : existingImages.auditoriumImage ? (
//                     <Box>
//                       <img
//                         src={getImageSrc(existingImages.auditoriumImage)}
//                         alt="Existing auditorium image"
//                         style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }} />
//                       <Typography variant="body2" color="text.secondary">Existing auditorium image. Upload to replace.</Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
//                       <Typography variant="body2" color="#f59299ff">Or drag and drop</Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="auditorium-image-upload"
//                     hidden
//                     accept="image/jpeg,image/png,image/jpg"
//                     onChange={handleFileChange('auditoriumImage')}/>
//                 </UploadDropArea>
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>Venue Facilities</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Specify available facilities</Typography>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(2, 1fr)', gap: theme.spacing(3) }}>
//                   <Stack spacing={2}>
//                     <FormControlLabel
//                       control={<Switch name="parkingAvailability" checked={formData.parkingAvailability} onChange={handleInputChange} />}
//                       label="Parking Availability"/>
//                     <FormControlLabel
//                       control={<Switch name="foodCateringAvailability" checked={formData.foodCateringAvailability} onChange={handleInputChange} />}
//                       label="Food & Catering Availability" />
//                     {formData.foodCateringAvailability && (
//                       <>
//                         <Box 
//                           sx={{ 
//                             backgroundColor: '#fce4ec', 
//                             border: '1px solid #f8bbd9', 
//                             borderRadius: 1, 
//                             p: 2, 
//                             mt: 1, 
//                             cursor: 'pointer',
//                             '&:hover': { backgroundColor: '#f8bbd9' }
//                           }} 
//                           onClick={() => navigate('/venue-setup/foodmenu', { state: { selectingForVenue: true, preSelected: selectedPackages } })}
//                         >
//                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Typography variant="h5" color="#E15B65">🍴</Typography>
//                               <Typography variant="subtitle1" color="#E15B65">Menu Selection</Typography>
//                             </Box>
//                             {selectedPackages.length > 0 && <Chip label={selectedPackages.length} color="primary" size="small" />}
//                           </Box>
//                         </Box>
//                         {selectedPackages.length > 0 && (
//                           <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                             {selectedPackages.map((pkg) => (
//                               <Card key={pkg._id} sx={{ width: 150, height: 160 }}>
//                                 <CardMedia
//                                   component="img"
//                                   height="120"
//                                   image={pkg.thumbnail ? `${BASE_URL}/${pkg.thumbnail}` : '/placeholder.jpg'}
//                                   alt={pkg.title}
//                                   sx={{ objectFit: 'cover' }}
//                                 />
//                                 <CardContent sx={{ p: 1 }}>
//                                   <Typography variant="body2" noWrap sx={{ fontSize: '0.75rem' }}>
//                                     {pkg.title}
//                                   </Typography>
//                                 </CardContent>
//                               </Card>
//                             ))}
//                           </Box>
//                         )}
//                       </>
//                     )}
//                     <FormControlLabel
//                       control={<Switch name="stageLightingAudio" checked={formData.stageLightingAudio} onChange={handleInputChange} />}
//                       label="Stage / Lighting / Audio System"/>
//                     <FormControlLabel
//                       control={<Switch name="acAvailable" checked={formData.acAvailable} onChange={handleInputChange} />}
//                       label="AC Available"/>
//                     {formData.acAvailable && (
//                       <FormControl fullWidth variant="outlined" sx={{ mt: 1, ...inputSx }}>
//                         <InputLabel id="ac-type-label">AC Type</InputLabel>
//                         <Select
//                           labelId="ac-type-label"
//                           name="acType"
//                           value={formData.acType}
//                           label="AC Type"
//                           onChange={handleInputChange}>
//                           <MenuItem value="Not Specified">Not Specified</MenuItem>
//                           <MenuItem value="Central AC">Central AC</MenuItem>
//                           <MenuItem value="Split AC">Split AC</MenuItem>
//                           <MenuItem value="Window AC">Window AC</MenuItem>
//                           <MenuItem value="Coolers">Coolers</MenuItem>
//                         </Select>
//                       </FormControl> )}
//                     <TextField
//                       fullWidth label="Parking Capacity"
//                       name="parkingCapacity" value={formData.parkingCapacity}
//                       onChange={handleInputChange} placeholder="Number of spots"
//                       type="number" sx={inputSx}/>
//                     <TextField
//                     fullWidth label="Dressing Rooms/Green Rooms"
//                       name="dressingRooms" value={formData.dressingRooms}
//                       onChange={handleInputChange} placeholder="Details about dressing rooms" sx={inputSx}/>
//                   </Stack>
//                   <Stack spacing={2}>
//                     <FormControlLabel
//                       control={<Switch name="wheelchairAccessibility" checked={formData.wheelchairAccessibility} onChange={handleInputChange} />}
//                       label="Wheelchair Accessibility"/>
//                     <FormControlLabel
//                       control={<Switch name="securityArrangements" checked={formData.securityArrangements} onChange={handleInputChange} />}
//                       label="Security Arrangements"/>
//                     <FormControlLabel
//                       control={<Switch name="wifiAvailability" checked={formData.wifiAvailability} onChange={handleInputChange} />}
//                       label="Wi-Fi Availability"/>
//                     <FormControlLabel
//                       control={<Switch name="nonAcAvailable" checked={formData.nonAcAvailable} onChange={handleInputChange} />}
//                       label="Non AC Available"/>
//                     <TextField
//                       fullWidth
//                       label="Washrooms/Restrooms Info"
//                       name="washroomsInfo"
//                       value={formData.washroomsInfo}
//                       onChange={handleInputChange}
//                       placeholder="Details about washrooms"
//                       sx={inputSx}/>
//                   </Stack>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>Pricing & Booking Options</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Insert The Pricing & Discount Information
//                 </Typography>
//              {/* Venue Types Selection */}
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="subtitle1" gutterBottom fontWeight={600}>
//                     Pricing Details
//                   </Typography>
//                   <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//                     <Button
//                       variant={formData.venueType === 'per_person' ? 'contained' : 'outlined'}
//                       onClick={() => setFormData((prev) => ({ ...prev, venueType: 'per_person' }))}
//                       startIcon={
//                         <Radio
//                           checked={formData.venueType === 'per_person'}
//                           sx={{
//                             color: formData.venueType === 'per_person' ? '#fff' : '#E15B65',
//                             '&.Mui-checked': { color: formData.venueType === 'per_person' ? '#fff' : '#E15B65' }
//                           }}/> }
//                       sx={{
//                         borderRadius: 2,
//                         textTransform: 'none',
//                         px: 3,
//                         color: formData.venueType === 'per_person' ? '#fff' : '#E15B65',
//                         backgroundColor: formData.venueType === 'per_person' ? '#E15B65' : 'transparent',
//                         borderColor: '#E15B65',
//                         '&:hover': {
//                           backgroundColor: formData.venueType === 'per_person' ? '#c94a57' : 'rgba(225,91,101,0.08)',
//                           borderColor: '#E15B65' }}} >
//                       Per Person
//                     </Button>
//                     <Button
//                       variant={formData.venueType === 'per_hour' ? 'contained' : 'outlined'}
//                       onClick={() => setFormData((prev) => ({ ...prev, venueType: 'per_hour' }))}
//                       startIcon={
//                         <Radio
//                           checked={formData.venueType === 'per_hour'}
//                           sx={{
//                             color: formData.venueType === 'per_hour' ? '#fff' : '#E15B65',
//                             '&.Mui-checked': { color: formData.venueType === 'per_hour' ? '#fff' : '#E15B65' }
//                           }} />}
//                       sx={{borderRadius: 2,
//                         textTransform: 'none',
//                         px: 3,
//                         color: formData.venueType === 'per_hour' ? '#fff' : '#E15B65',
//                         backgroundColor: formData.venueType === 'per_hour' ? '#E15B65' : 'transparent',
//                         borderColor: '#E15B65',
//                         '&:hover': {
//                           backgroundColor: formData.venueType === 'per_hour' ? '#c94a57' : 'rgba(225,91,101,0.08)',
//                           borderColor: '#E15B65'}}}>
//                       Per Hour
//                     </Button>
//                     <Button
//                       variant={formData.venueType === 'per_function' ? 'contained' : 'outlined'}
//                       onClick={() => setFormData((prev) => ({ ...prev, venueType: 'per_function' }))}
//                       startIcon={
//                         <Radio
//                           checked={formData.venueType === 'per_function'}
//                           sx={{
//                             color: formData.venueType === 'per_function' ? '#fff' : '#E15B65',
//                             '&.Mui-checked': { color: formData.venueType === 'per_function' ? '#fff' : '#E15B65' }
//                           }}/>}
//                       sx={{
//                         borderRadius: 2, textTransform: 'none', px: 3, color: formData.venueType === 'per_function' ? '#fff' : '#E15B65', backgroundColor: formData.venueType === 'per_function' ? '#E15B65' : 'transparent', borderColor: '#E15B65',
//                         '&:hover': { backgroundColor: formData.venueType === 'per_function' ? '#c94a57' : 'rgba(225,91,101,0.08)', borderColor: '#E15B65' }
//                       }}> Per Function</Button>
//                   </Box>
//                   {/* Table */}
//                   {formData.venueType && (
//                     <Box sx={{
//                       border: `1px solid ${theme.palette.grey[300]}`,
//                       borderRadius: 1,
//                       overflow: 'hidden'}}>
//                       {/* Table Header */}
//                       <Box sx={{
//                         display: 'grid',
//                         gridTemplateColumns: '150px 1fr 1fr',
//                         backgroundColor: theme.palette.grey[100],
//                         borderBottom: `1px solid ${theme.palette.grey[300]}` }}>
//                         <Box sx={{p: 2,borderRight: `1px solid ${theme.palette.grey[300]}`,fontWeight: 600 }}> Day</Box>
//                         <Box sx={{p: 2,borderRight: `1px solid ${theme.palette.grey[300]}`,fontWeight: 600}}>Time Slots</Box>
//                         <Box sx={{p: 2,fontWeight: 600}}>Pricing </Box>
//                       </Box>
//                       {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
//                         <Box key={day}>
//                           {/* Morning Slot Row */}
//                           <Box sx={{
//                             display: 'grid',
//                             gridTemplateColumns: '150px 1fr 1fr',
//                             borderBottom: `1px solid ${theme.palette.grey[300]}`}}>
//                             {/* Day Column */}
//                             <Box sx={{
//                               p: 2,
//                               borderRight: `1px solid ${theme.palette.grey[300]}`,
//                               display: 'flex',
//                               alignItems: 'flex-start',
//                               textTransform: 'capitalize',
//                               fontWeight: 500, }}>
//                               {day.charAt(0).toUpperCase() + day.slice(1)}
//                             </Box>
//                             {/* Morning Slot */}
//                             <Box sx={{
//                               p: 2,
//                               borderRight: `1px solid ${theme.palette.grey[300]}`,
//                               borderBottom: `1px solid ${theme.palette.grey[300]}` }}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                                 <Checkbox
//                                   size="small"
//                                   checked={timeSlots[day].morning.enabled}
//                                   onChange={(e) => handleTimeSlotChange(day, 'morning', 'enabled', e.target.checked)}
//                                   sx={{ p: 0 }}/>
//                                 <Typography variant="body2">Morning Slot</Typography>
//                               </Box>
//                               <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                                 <TextField
//                                   size="small"
//                                   value={timeSlots[day].morning.startTime}
//                                   onChange={(e) => handleTimeSlotChange(day, 'morning', 'startTime', e.target.value)}
//                                   disabled={!timeSlots[day].morning.enabled}
//                                   sx={{ width: '80px', ...inputSx }}
//                                   inputProps={{ style: { textAlign: 'center' } }}/>
//                                 <Select
//                                   size="small"
//                                   value={timeSlots[day].morning.startPeriod}
//                                   onChange={(e) => handleTimeSlotChange(day, 'morning', 'startPeriod', e.target.value)}
//                                   disabled={!timeSlots[day].morning.enabled}
//                                   sx={{ width: '70px' }}>
//                                   <MenuItem value="Am">Am</MenuItem>
//                                   <MenuItem value="Pm">Pm</MenuItem>
//                                 </Select>
//                                 <TextField
//                                   size="small"
//                                   value={timeSlots[day].morning.endTime}
//                                   onChange={(e) => handleTimeSlotChange(day, 'morning', 'endTime', e.target.value)}
//                                   disabled={!timeSlots[day].morning.enabled}
//                                   sx={{ width: '80px', ...inputSx }}
//                                   inputProps={{ style: { textAlign: 'center' } }} />
//                                 <Select
//                                   size="small"
//                                   value={timeSlots[day].morning.endPeriod}
//                                   onChange={(e) => handleTimeSlotChange(day, 'morning', 'endPeriod', e.target.value)}
//                                   disabled={!timeSlots[day].morning.enabled}
//                                   sx={{ width: '70px' }}>
//                                   <MenuItem value="Am">Am</MenuItem>
//                                   <MenuItem value="Pm">Pm</MenuItem>
//                                 </Select>
//                               </Box>
//                             </Box>
//                             {/* Morning Pricing */}
//                             <Box sx={{
//                               p: 2,
//                               borderBottom: `1px solid ${theme.palette.grey[300]}`}}>
//                               <TextField
//                                 fullWidth
//                                 size="small"
//                                 value={timeSlots[day].morning.price}
//                                 onChange={(e) => handleTimeSlotChange(day, 'morning', 'price', e.target.value)}
//                                 disabled={!timeSlots[day].morning.enabled}
//                                 placeholder="Enter price"
//                                 type="number"
//                                 inputProps={{ step: '0.01', min: '0' }}
//                                 sx={inputSx} />
//                             </Box>
//                           </Box>
//                           {/* Evening Slot Row */}
//                           <Box sx={{
//                             display: 'grid',
//                             gridTemplateColumns: '150px 1fr 1fr',
//                             borderBottom: `1px solid ${theme.palette.grey[300]}`}}>
//                             {/* Day Column */}
//                             <Box sx={{
//                               p: 2,
//                               borderRight: `1px solid ${theme.palette.grey[300]}`,
//                               display: 'flex',
//                               alignItems: 'flex-start',
//                               textTransform: 'capitalize',
//                               fontWeight: 500,}}>
//                               {day.charAt(0).toUpperCase() + day.slice(1)}
//                             </Box>
//                             {/* Evening Slot */}
//                             <Box sx={{
//                               p: 2,
//                               borderRight: `1px solid ${theme.palette.grey[300]}`, }}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                                 <Checkbox
//                                   size="small"
//                                   checked={timeSlots[day].evening.enabled}
//                                   onChange={(e) => handleTimeSlotChange(day, 'evening', 'enabled', e.target.checked)}
//                                   sx={{ p: 0 }}
//                                 />
//                                 <Typography variant="body2">Evening Slot</Typography>
//                               </Box>
//                               <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                                 <TextField
//                                   size="small"
//                                   value={timeSlots[day].evening.startTime}
//                                   onChange={(e) => handleTimeSlotChange(day, 'evening', 'startTime', e.target.value)}
//                                   disabled={!timeSlots[day].evening.enabled}
//                                   sx={{ width: '80px', ...inputSx }}
//                                   inputProps={{ style: { textAlign: 'center' } }} />
//                                 <Select
//                                   size="small"
//                                   value={timeSlots[day].evening.startPeriod}
//                                   onChange={(e) => handleTimeSlotChange(day, 'evening', 'startPeriod', e.target.value)}
//                                   disabled={!timeSlots[day].evening.enabled}
//                                   sx={{ width: '70px' }}>
//                                   <MenuItem value="Am">Am</MenuItem>
//                                   <MenuItem value="Pm">Pm</MenuItem>
//                                 </Select>
//                                 <TextField
//                                   size="small"
//                                   value={timeSlots[day].evening.endTime}
//                                   onChange={(e) => handleTimeSlotChange(day, 'evening', 'endTime', e.target.value)}
//                                   disabled={!timeSlots[day].evening.enabled}
//                                   sx={{ width: '80px', ...inputSx }}
//                                   inputProps={{ style: { textAlign: 'center' } }} />
//                                 <Select
//                                   size="small"
//                                   value={timeSlots[day].evening.endPeriod}
//                                   onChange={(e) => handleTimeSlotChange(day, 'evening', 'endPeriod', e.target.value)}
//                                   disabled={!timeSlots[day].evening.enabled}
//                                   sx={{ width: '70px' }}>
//                                   <MenuItem value="Am">Am</MenuItem>
//                                   <MenuItem value="Pm">Pm</MenuItem>
//                                 </Select>
//                               </Box>
//                             </Box>
//                             {/* Evening Pricing */}
//                             <Box sx={{ p: 2 }}>
//                               <TextField
//                                 fullWidth
//                                 size="small"
//                                 value={timeSlots[day].evening.price}
//                                 onChange={(e) => handleTimeSlotChange(day, 'evening', 'price', e.target.value)}
//                                 disabled={!timeSlots[day].evening.enabled}
//                                 placeholder="Enter price"
//                                 type="number"
//                                 inputProps={{ step: '0.01', min: '0' }}
//                                 sx={inputSx}
//                               />
//                             </Box>
//                           </Box>
//                         </Box>
//                       ))}
//                     </Box>
//                   )}
//                 </Box><Box sx={{ mb: 3 }}>
//                   <Typography variant="subtitle1" gutterBottom>Give Discount</Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Set a discount that applies to all pricing types—hourly, daily, and distance-based
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     label="Discount (%)"
//                     name="discount"
//                     value={formData.discount}
//                     onChange={handleInputChange}
//                     placeholder="Ex: 10"
//                     type="number"
//                     inputProps={{ min: 0, max: 100 }}
//                     sx={inputSx} />
//                 </Box>
//                 <TextField
//                   fullWidth
//                   label="Advance Payment / Deposit (%)"
//                   name="advanceDeposit"
//                   value={formData.advanceDeposit}
//                   onChange={handleInputChange}
//                   placeholder="Ex: 20"
//                   type="number"
//                   inputProps={{ min: 0, max: 100 }}
//                   sx={{ mb: 2, ...inputSx }} />
//                 <TextField
//                   fullWidth
//                   label="Cancellation Policy"
//                   name="cancellationPolicy"
//                   value={formData.cancellationPolicy}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Free cancellation 48 hours before"
//                   multiline
//                   rows={2}
//                   sx={{ mb: 2, ...inputSx }} />
//                 <TextField
//                   fullWidth
//                   label="Extra Charges (e.g., Cleaning fee)"
//                   name="extraCharges"
//                   value={formData.extraCharges}
//                   onChange={handleInputChange}
//                   placeholder="Describe extra charges"
//                   multiline
//                   rows={2}
//                   sx={inputSx} />
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>Capacity & Layout</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Specify capacity and layout details</Typography>
//                 <FormControl fullWidth variant="outlined" required sx={{ mb: 2, ...inputSx }}>
//                   <InputLabel id="seating-arrangement-label">Seating Arrangement*</InputLabel>
//                   <Select
//                     labelId="seating-arrangement-label"
//                     name="seatingArrangement"
//                     value={formData.seatingArrangement}
//                     label="Seating Arrangement"
//                     onChange={handleInputChange} >
//                     <MenuItem value="">Select seating arrangement</MenuItem>
//                     <MenuItem value="Amphitheater">Amphitheater</MenuItem>
//                     <MenuItem value="Balcony auditorium">Balcony auditorium</MenuItem>
//                     <MenuItem value="Flat floor auditorium">Flat floor auditorium</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                   <TextField
//                     fullWidth
//                     label="Max Guest Count (Seated)*"
//                     name="maxGuestsSeated"
//                     value={formData.maxGuestsSeated}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 200"
//                     type="number"
//                     required
//                     sx={inputSx} />
//                   <TextField
//                     fullWidth
//                     label="Max Guest Count (Standing)"
//                     name="maxGuestsStanding"
//                     value={formData.maxGuestsStanding}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 300"
//                     type="number"
//                     sx={inputSx} />
//                 </Box>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop('floorPlan')}
//                   onClick={() => document.getElementById('floor-plan-upload').click()}
//                   sx={{ mb: 2 }}>
//                   {files.floorPlan ? (
//                     <Box>
//                       <Typography variant="body2" color="text.secondary">{files.floorPlan.name}</Typography>
//                     </Box>
//                   ) : existingImages.floorPlan ? (
//                     <Box>
//                       {existingImages.floorPlan.endsWith('.pdf') ? (
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Existing floor plan (PDF): {existingImages.floorPlan.split('/').pop()}</Typography>
//                           <a href={getImageSrc(existingImages.floorPlan)} target="_blank" rel="noopener noreferrer">View PDF</a>
//                         </Box>
//                       ) : (
//                         <img
//                           src={getImageSrc(existingImages.floorPlan)}
//                           alt="Existing floor plan"
//                           style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}/>
//                       )}
//                       <Typography variant="body2" color="text.secondary">Upload new to replace.</Typography>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload Floor Plan (Image/jpg)</Typography>
//                       <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="floor-plan-upload"
//                     hidden
//                     accept="image/*,application/pdf"
//                     onChange={handleFileChange('floorPlan')} />
//                 </UploadDropArea>
//                 <FormControlLabel
//                   control={<Switch name="multipleHalls" checked={formData.multipleHalls} onChange={handleInputChange} />}
//                   label="Multiple Halls/Sections Under One Venue" />
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>Location & Accessibility</Typography>
//                 <TextField
//                   fullWidth
//                   label="Nearby Transport Details"
//                   name="nearbyTransport"
//                   value={formData.nearbyTransport}
//                   onChange={handleInputChange}
//                   placeholder="Describe nearby metro, bus stops, etc."
//                   sx={{ mb: 2, ...inputSx }} />
//                 <TextField
//                   fullWidth
//                   label="Accessibility Information"
//                   name="accessibilityInfo"
//                   value={formData.accessibilityInfo}
//                   onChange={handleInputChange}
//                   placeholder="Describe accessibility features"
//                   sx={{ mb: 2, ...inputSx }} />
//                 <FormControlLabel
//                   control={<Switch name="elderlyAccessibility" checked={formData.elderlyAccessibility} onChange={handleInputChange} />}
//                   label="Accessibility for Elderly & Differently Abled"
//                   sx={{ mb: 3 }} />
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="h6" gutterBottom>Venue Documents</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Upload relevant documents (licenses, permits, etc.)
//                 </Typography>
//                 <UploadDropArea
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop('documents')}
//                   onClick={() => document.getElementById('documents-upload').click()}>
//                   {files.documents ? (
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       {files.documents.name}
//                       <IconButton
//                         size="small"
//                         onClick={() => {
//                           setPreviewSrc(URL.createObjectURL(files.documents));
//                           setOpenPreview(true); }}
//                         sx={{ color: theme.palette.primary.main }}>
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   ) : existingImages.documents ? (
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       {existingImages.documents.split('/').pop()} {/* Show only the file name from the URL */}
//                       <IconButton
//                         size="small"
//                         onClick={() => {
//                           setPreviewSrc(getImageSrc(existingImages.documents));
//                           setOpenPreview(true);
//                         }}
//                         sx={{ color: theme.palette.primary.main }}>
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   ) : (
//                     <Box>
//                       <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
//                       <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
//                       <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
//                     </Box>
//                   )}
//                   <input
//                     type="file"
//                     id="documents-upload"
//                     hidden
//                     accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//                     onChange={handleFileChange('documents')} />
//                 </UploadDropArea>
//                 <Dialog
//                   open={openPreview}
//                   onClose={() => setOpenPreview(false)}
//                   maxWidth="md"
//                   fullWidth
//                   PaperProps={{
//                     sx: { height: '80vh', p: 2 }, }}>
//                   <DialogContent sx={{ p: 0, height: '100%' }}>
//                     <Box sx={{ height: '100%' }}>
//                       <iframe
//                         src={previewSrc}
//                         title="Document Preview"
//                         style={{ width: '100%', height: '100%', border: 'none' }} />
//                     </Box>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={() => setOpenPreview(false)} color="primary">
//                       Close
//                     </Button>
//                   </DialogActions>
//                 </Dialog>
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ mb: 4 }}>
//             <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
//               <CardContent sx={{ '&:last-child': { pb: 2 } }}>
//                 <Typography variant="subtitle1" gutterBottom>Search Tags</Typography>
//                 <TextField
//                   fullWidth
//                   label="Search Tags"
//                   name="searchTags"
//                   value={formData.searchTags}
//                   onChange={handleInputChange}
//                   placeholder="Enter tags separated by commas (e.g., Auditorium, Wedding, Conference)"
//                   sx={{ mb: 1, ...inputSx }} />
//                 <Typography variant="body2" color="text.secondary">
//                   Add relevant keywords to help users find this venue easily
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             <Button
//               variant="outlined"
//               color="inherit"
//               size="large"
//               onClick={handleReset}
//               disabled={loading} >
//               {viewMode === 'edit' ? 'Cancel' : 'Reset'}
//             </Button>
//             <Button
//               variant="contained"
//               type="submit"
//               size="large"
//               disabled={loading}
//               startIcon={loading ? <CircularProgress size={20} /> : null}
//               sx={{ backgroundColor: '#E15B65' }}>
//               {loading ? 'Submitting...' : viewMode === 'edit' ? 'Update' : 'Submit'}
//             </Button>
//           </Box>
//         </Box>
//         <Snackbar
//           open={toast.open}
//           autoHideDuration={6000}
//           onClose={handleCloseToast}
//           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//           sx={{ '& .MuiSnackbarContent-root': { minWidth: '600px', maxWidth: '600px', width: 'auto', }, }}>
//           <Alert
//             onClose={handleCloseToast}
//             severity={toast.severity}
//             sx={{ width: '100%', '& .MuiAlert-message': { whiteSpace: 'pre-line', wordBreak: 'break-word', fontSize: '1rem', lineHeight: 1.5, }, }}>
//             {toast.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Box>
//   );
// };
// export default CreateAuditorium;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CardMedia, IconButton, Stack, Radio, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Switch, Snackbar, Alert, CircularProgress, Checkbox, Dialog, DialogContent, DialogActions, RadioGroup, Chip } from '@mui/material';
import { Visibility, Edit } from '@mui/icons-material';
import {
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useTheme, useMediaQuery } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    borderColor: '#E15B65',
  },
  '& input[type="file"]': {
    display: 'none',
  },
}));
const defaultTimeSlots = {
  monday: {
    morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '08:00', startPeriod: 'Pm', endTime: '12:00', endPeriod: 'Am', price: '' }
  },
  tuesday: {
    morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  wednesday: {
    morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  thursday: {
    morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  friday: {
    morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '00:00', startPeriod: 'Am', endTime: '00:00', endPeriod: 'Pm', price: '' }
  },
  saturday: {
    morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  sunday: {
    morning: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  }
};
const resetTimeSlots = {
  monday: {
    morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: true, startTime: '08:00', startPeriod: 'Pm', endTime: '12:00', endPeriod: 'Am', price: '' }
  },
  tuesday: {
    morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  wednesday: {
    morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  thursday: {
    morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  friday: {
    morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: false, startTime: '00:00', startPeriod: 'Am', endTime: '00:00', endPeriod: 'Pm', price: '' }
  },
  saturday: {
    morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  },
  sunday: {
    morning: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' },
    evening: { enabled: true, startTime: '08:00', startPeriod: 'Am', endTime: '03:00', endPeriod: 'Pm', price: '' }
  }
};
const transformToArray = (timeSlots, venueType) => {
  const schedule = {};
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(dayLower => {
    schedule[dayLower] = {
      morning: null,
      evening: null
    };
    const morning = timeSlots[dayLower]?.morning;
    if (morning?.enabled && morning.price.trim()) {
      const priceValue = parseFloat(morning.price) || 0;
      schedule[dayLower].morning = {
        startTime: morning.startTime,
        startAmpm: morning.startPeriod.toUpperCase(),
        endTime: morning.endTime,
        endAmpm: morning.endPeriod.toUpperCase(),
        perDay: venueType === 'per_function' ? priceValue : 0,
        perHour: venueType === 'per_hour' ? priceValue : 0,
        perPerson: venueType === 'per_person' ? priceValue : 0
      };
    }
    const evening = timeSlots[dayLower]?.evening;
    if (evening?.enabled && evening.price.trim()) {
      const priceValue = parseFloat(evening.price) || 0;
      schedule[dayLower].evening = {
        startTime: evening.startTime,
        startAmpm: evening.startPeriod.toUpperCase(),
        endTime: evening.endTime,
        endAmpm: evening.endPeriod.toUpperCase(),
        perDay: venueType === 'per_function' ? priceValue : 0,
        perHour: venueType === 'per_hour' ? priceValue : 0,
        perPerson: venueType === 'per_person' ? priceValue : 0
      };
    }
  });
  return schedule;
};
const transformToTimeSlots = (pricingSchedule) => {
  const timeSlots = { ...defaultTimeSlots };
  if (typeof pricingSchedule === 'object' && !Array.isArray(pricingSchedule)) {
    Object.entries(pricingSchedule).forEach(([day, slots]) => {
      const dayLower = day.toLowerCase();
      if (timeSlots[dayLower]) {
        // Morning slot
        if (slots.morning) {
          const price = slots.morning.perDay || slots.morning.perHour || slots.morning.perPerson || 0;
          timeSlots[dayLower].morning = {
            enabled: true,
            startTime: slots.morning.startTime || '08:00',
            startPeriod: (slots.morning.startAmpm || 'AM').toLowerCase(),
            endTime: slots.morning.endTime || '03:00',
            endPeriod: (slots.morning.endAmpm || 'PM').toLowerCase(),
            price: price.toString()
          };
        }
        // Evening slot
        if (slots.evening) {
          const price = slots.evening.perDay || slots.evening.perHour || slots.evening.perPerson || 0;
          timeSlots[dayLower].evening = {
            enabled: true,
            startTime: slots.evening.startTime || '08:00',
            startPeriod: (slots.evening.startAmpm || 'PM').toLowerCase(),
            endTime: slots.evening.endTime || '12:00',
            endPeriod: (slots.evening.endAmpm || 'AM').toLowerCase(),
            price: price.toString()
          };
        }
      }
    });
  } else if (Array.isArray(pricingSchedule)) {
    // Handle old format (array)
    pricingSchedule.forEach(slot => {
      const dayLower = slot.day.toLowerCase();
      const slotType = slot.slotType;
      if (timeSlots[dayLower] && timeSlots[dayLower][slotType]) {
        const price = slot.perDay || slot.perHour || slot.perPerson || slot.price || 0;
        timeSlots[dayLower][slotType] = {
          ...timeSlots[dayLower][slotType],
          enabled: true,
          startTime: slot.startTime,
          startPeriod: slot.startAmpm.toLowerCase(),
          endTime: slot.endTime,
          endPeriod: slot.endAmpm.toLowerCase(),
          price: price.toString()
        };
      }
    });
  }
  return timeSlots;
};
const CreateAuditorium = () => {
  const { id } = useParams();
  const location = useLocation();
  useEffect(() => {
    // Only handle edit mode refresh logic when id exists
    if (!id) return;

    const refreshedKey = `venue-refreshed-${id}`;
    const alreadyRefreshed = sessionStorage.getItem(refreshedKey);
    const fromPackageSelection = sessionStorage.getItem('from-package-selection');

    if (!alreadyRefreshed && !fromPackageSelection) {
      // First time loading in edit mode and NOT coming from package selection
      sessionStorage.setItem(refreshedKey, 'true');
      setTimeout(() => {
        window.location.reload();
      }, 150);
    } else if (fromPackageSelection) {
      // Coming from package selection - don't refresh, just clean up
      sessionStorage.removeItem('from-package-selection');
      sessionStorage.removeItem(refreshedKey); // Remove refresh key to prevent future refreshes
    }
  }, [id]);
  useEffect(() => {
  if (id) {
    const fromPackageSelection = sessionStorage.getItem('from-package-selection');
    // Only fetch venue data if NOT coming from package selection
    if (!fromPackageSelection) {
      fetchVenue(id);
    }
  }
}, [id]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const API_BASE_URL = 'https://api.bookmyevent.ae/api';
  const BASE_URL = 'https://bookmyevent.ae';
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78';
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [viewMode, setViewMode] = useState(id ? 'edit' : 'create');
  const [formData, setFormData] = useState({
    venueName: '',
    description: '',
    venueAddress: '',
    categories: '',
    latitude: '',
    longitude: '',
    openingHours: '',
    closingHours: '',
    holidayScheduling: '',
    parkingAvailability: false,
    parkingCapacity: '',
    foodCateringAvailability: false,
    stageLightingAudio: false,
    wheelchairAccessibility: false,
    securityArrangements: false,
    wifiAvailability: false,
    acAvailable: false,
    nonAcAvailable: false,
    acType: 'Not Specified',
    washroomsInfo: '',
    dressingRooms: '',
    venueType: '',
    discount: '',
    advanceDeposit: '',
    cancellationPolicy: '',
    extraCharges: '',
    seatingArrangement: '',
    maxGuestsSeated: '',
    maxGuestsStanding: '',
    multipleHalls: false,
    nearbyTransport: '',
    accessibilityInfo: '',
    elderlyAccessibility: false,
    searchTags: '',
    selectedPackageIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [fetchedPackages, setFetchedPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [files, setFiles] = useState({ thumbnail: null, auditoriumImage: null, floorPlan: null, documents: null });
  const [existingImages, setExistingImages] = useState({
    thumbnail: '',
    auditoriumImage: '',
    floorPlan: '',
    documents: '',
  });
  //timeslotes
  const [timeSlots, setTimeSlots] = useState(defaultTimeSlots);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  // Map states
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);
  // Fetch venue data if in edit mode
  const [openPreview, setOpenPreview] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E15B65',
        },
      },
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E15B65',
        },
      },
    },
  };
  useEffect(() => {
    fetchCategories();
    fetchPackages();
  }, []);
  useEffect(() => {
    if (id) {
      fetchVenue(id);
    }
  }, [id]);
  useEffect(() => {
  const savedFormData = sessionStorage.getItem('tempFormData');
  if (savedFormData) {
    setFormData((prev) => ({
      ...JSON.parse(savedFormData),
      selectedPackageIds: location.state?.selectedPackages?.map(p => p._id) || prev.selectedPackageIds,
      foodCateringAvailability: location.state?.selectedPackages?.length > 0 || prev.foodCateringAvailability,
    }));
    sessionStorage.removeItem('tempFormData'); // Clean up after restoring
  }

  const state = location.state;
  if (state?.selectedPackages && state.selectedPackages.length > 0) {
    setSelectedPackages(state.selectedPackages);
    setFormData((prev) => ({
      ...prev,
      selectedPackageIds: state.selectedPackages.map(p => p._id),
      foodCateringAvailability: true,
    }));
    window.history.replaceState({}, document.title); // Clear state after processing
  }
}, [location.state]);
  useEffect(() => {
    if (id && fetchedPackages.length > 0 && formData.selectedPackageIds.length > 0) {
      setSelectedPackages(fetchedPackages.filter(p => formData.selectedPackageIds.includes(p._id)));
    }
  }, [fetchedPackages, formData.selectedPackageIds, id]);
  // Fetch packages
  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const providerId = localStorage.getItem('providerId') || localStorage.getItem('moduleId');

      console.log('Fetching packages with providerId:', providerId);

      if (!providerId) {
        console.warn('Provider ID not available');
        setFetchedPackages([]);
        return;
      }
      if (!token) {
        console.warn('Token not available');
        setFetchedPackages([]);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/packages/provider/${providerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        setFetchedPackages([]);
        return;
      }
      const result = await response.json();
      console.log('Packages API Response:', result);

      // Handle the response format from your API
      let packages = [];
      if (result.packages && Array.isArray(result.packages)) {
        packages = result.packages;
      } else if (result.success && Array.isArray(result.data)) {
        packages = result.data;
      }
      console.log('Parsed packages:', packages);
      setFetchedPackages(packages);
      if (packages.length === 0) {
        console.log('No packages found for this provider');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setFetchedPackages([]);
    }
  };
  // Load Google Maps script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not provided');
      setToast({ open: true, message: 'Google Maps API key is required for map features.', severity: 'warning' });
      return;
    }
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapsLoaded(true);
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [GOOGLE_MAPS_API_KEY]);
  // Initialize map when mapsLoaded becomes true
  useEffect(() => {
    if (mapsLoaded && window.google && window.google.maps) {
      initMap();
    }
  }, [mapsLoaded]);
  const initMap = useCallback(() => {
    if (!window.google || !mapRef.current || !mapsLoaded) return;
    const centerLat = formData.latitude && formData.longitude ? parseFloat(formData.latitude) : 20.5937;
    const centerLng = formData.latitude && formData.longitude ? parseFloat(formData.longitude) : 78.9629;
    const center = { lat: centerLat, lng: centerLng };
    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center,
    });
    // Add click listener
    newMap.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      // Add new marker
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: newMap,
      });
      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setFormData(prev => ({ ...prev, venueAddress: results[0].formatted_address }));
          setToast({ open: true, message: 'Location set and address auto-filled!', severity: 'success' });
        } else {
          setToast({ open: true, message: 'Location set, but could not determine address.', severity: 'info' });
        }
      });
    });
    setMap(newMap);
  }, [mapsLoaded, formData.latitude, formData.longitude]);
  useEffect(() => {
    if (!mapsLoaded || !map || !searchInputRef.current || !window.google) return;
    const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ["place_id", "geometry", "name", "formatted_address"],
    });
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      const loc = place.geometry.location;
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(loc);
        map.setZoom(17);
      }
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      markerRef.current = new window.google.maps.Marker({
        position: loc,
        map,
      });
      setFormData(prev => ({
        ...prev,
        latitude: loc.lat().toString(),
        longitude: loc.lng().toString(),
        venueAddress: place.formatted_address || place.name
      }));
      setToast({ open: true, message: 'Location selected!', severity: 'success' });
    });
    return () => {
      if (window.google && window.google.maps.event) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [mapsLoaded, map]);
  useEffect(() => {
    if (!map || !formData.latitude || !formData.longitude) return;
    const pos = { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) };
    map.setCenter(pos);
    map.setZoom(12);
    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        position: pos,
        map,
      });
    } else {
      markerRef.current.setPosition(pos);
    }
  }, [formData.latitude, formData.longitude, map]);
  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleFileChange = (key) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };
  const handleDrop = (key) => (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };
  //timeslot
  const handleTimeSlotChange = (day, slot, field, value) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: {
          ...prev[day][slot],
          [field]: value
        }
      }
    }));
  };
  const handleDragOver = (event) => event.preventDefault();
  const handleReset = () => {
    setFormData({
      venueName: '',
      description: '',
      venueAddress: '',
      categories: '',
      latitude: '',
      longitude: '',
      openingHours: '',
      closingHours: '',
      holidayScheduling: '',
      parkingAvailability: false,
      parkingCapacity: '',
      foodCateringAvailability: false,
      stageLightingAudio: false,
      wheelchairAccessibility: false,
      securityArrangements: false,
      wifiAvailability: false,
      acAvailable: false,
      nonAcAvailable: false,
      acType: 'Not Specified',
      washroomsInfo: '',
      dressingRooms: '',
      venueType: '',
      discount: '',
      advanceDeposit: '',
      cancellationPolicy: '',
      extraCharges: '',
      seatingArrangement: '',
      maxGuestsSeated: '',
      maxGuestsStanding: '',
      multipleHalls: false,
      nearbyTransport: '',
      accessibilityInfo: '',
      elderlyAccessibility: false,
      searchTags: '',
      selectedPackageIds: [],
    });
    setSelectedPackages([]);
    setTimeSlots(resetTimeSlots);
    setFiles({ thumbnail: null, auditoriumImage: null, floorPlan: null, documents: null });
    setExistingImages({ thumbnail: '', auditoriumImage: '', floorPlan: '', documents: '' });
    // setToast({ open: false, message: '', severity: 'success' });
    setViewMode('create');
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (map) {
      setMap(null);
    }
  };
  const validateForm = () => {
    const errors = [];
    if (!formData.venueName.trim()) errors.push('Venue name is required');
    if (!formData.venueAddress.trim()) errors.push('Venue address is required');
    if (!formData.categories) errors.push('Category is required');
    if (!formData.seatingArrangement) errors.push('Seating arrangement is required');
    if (!formData.maxGuestsSeated) errors.push('Max guests seated is required');
    if (!formData.venueType) errors.push('Venue type is required');
    if (viewMode === 'create') {
      if (!files.thumbnail) errors.push('Thumbnail image is required');
      if (!files.auditoriumImage) errors.push('Auditorium image is required');
    } else {
      if (!files.thumbnail && !existingImages.thumbnail) errors.push('Thumbnail image is required');
      if (!files.auditoriumImage && !existingImages.auditoriumImage) errors.push('Auditorium image is required');
    }
    const hasPricing = Object.values(timeSlots).some(day =>
      (day.morning.enabled && day.morning.price.trim()) || (day.evening.enabled && day.evening.price.trim())
    );
    if (!hasPricing) {
      errors.push('At least one time slot with price is required');
    }
    if (formData.foodCateringAvailability && (!formData.selectedPackageIds || formData.selectedPackageIds.length === 0)) {
      errors.push('At least one food package is required');
    }
    return errors;
  };
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const moduleId = localStorage.getItem('moduleId'); // ✅ use same logic as working page
      const API_BASE_URL_LOCAL = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';
      if (!token) {
        console.warn('No authentication token found.');
        return;
      }
      if (!moduleId) {
        console.warn('No moduleId found in localStorage.');
        return;
      }
      const response = await fetch(`${API_BASE_URL_LOCAL}/api/categories/modules/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const formattedCategories = result.data.map((category) => ({
          id: category.categories || category._id || '',
          name: category?.title || category.name || 'Unnamed Category',
        }));
        setCategories(formattedCategories);
      } else {
        setToast({
          open: true,
          message: 'No categories found.',
          severity: 'warning',
        });
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setToast({
        open: true,
        message: 'Failed to fetch categories. Please try again.',
        severity: 'error',
      });
      setCategories([]);
    }
  };
  const fetchVenue = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch venue');
      }
      setFormData({
        venueName: result.data.venueName || '',
        description: result.data.shortDescription || '',
        venueAddress: result.data.venueAddress || '',
        categories: result?.data?.categories?.[0]?._id || '',
        latitude: result.data.latitude?.toString() || '',
        longitude: result.data.longitude?.toString() || '',
        openingHours: result.data.openingHours || '',
        closingHours: result.data.closingHours || '',
        holidayScheduling: result.data.holidaySchedule || '',
        parkingAvailability: !!result.data.parkingAvailability,
        parkingCapacity: result.data.parkingCapacity || '',
        foodCateringAvailability: !!result.data.foodCateringAvailability,
        stageLightingAudio: !!result.data.stageLightingAudio,
        wheelchairAccessibility: !!result.data.wheelchairAccessibility,
        securityArrangements: !!result.data.securityArrangements,
        wifiAvailability: !!result.data.wifiAvailability,
        acAvailable: !!result.data.acAvailable,
        nonAcAvailable: !!result.data.nonAcAvailable,
        acType: result.data.acType || 'Not Specified',
        washroomsInfo: result.data.washroomsInfo || '',
        dressingRooms: result.data.dressingRooms || '',
        venueType: result.data.venueType || '',
        discount: result.data.discount || '',
        advanceDeposit: result.data.advanceDeposit || '',
        cancellationPolicy: result.data.cancellationPolicy || '',
        extraCharges: result.data.extraCharges || '',
        seatingArrangement: result.data.seatingArrangement || '',
        maxGuestsSeated: result.data.maxGuestsSeated || '',
        maxGuestsStanding: result.data.maxGuestsStanding || '',
        multipleHalls: !!result.data.multipleHalls,
        nearbyTransport: result.data.nearbyTransport || '',
        accessibilityInfo: result.data.accessibilityInfo || '',
        elderlyAccessibility: !!result.data.accessibilityInfo,
        searchTags: Array.isArray(result.data.searchTags)
          ? result.data.searchTags.join(', ')
          : result.data.searchTags || '',
        selectedPackageIds: result.data.packages || [],
      });
      console.log("hello", formData?.categories);
      setTimeSlots(transformToTimeSlots(result.data.pricingSchedule) || defaultTimeSlots);
      setExistingImages({
        thumbnail: result.data.thumbnail || '',
        auditoriumImage: result.data.images?.[0] || '',
        floorPlan: result.data.images?.[1] || '',
        documents: result.data.documents || '',
      });
      setViewMode('edit');
    } catch (error) {
      console.error('Error fetching venue:', error);
      setToast({
        open: true,
        message: error.message.includes('expired')
          ? 'Session expired. Please log in again.'
          : `Error fetching venue: ${error.message}`,
        severity: 'error',
      });
      if (error.message.includes('expired')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  const submitPricing = async (venueId, token, venueType, pricingSchedule) => {
    const pricingData = new FormData();
    pricingData.append('venueId', venueId);
    pricingData.append('venueType', venueType);
    const formattedPricing = {};
    Object.entries(pricingSchedule).forEach(([day, slots]) => {
      formattedPricing[day] = {};
      Object.entries(slots).forEach(([slotType, slot]) => {
        if (slot) {
          formattedPricing[day][slotType] = {
            startTime: slot.startTime || "",
            startAmpm: slot.startAmpm || "AM",
            endTime: slot.endTime || "",
            endAmpm: slot.endAmpm || "PM",
            perDay:
              formData.venueType === "per_function" ? Number(slot.price || 0) : 0,
            perHour:
              formData.venueType === "per_hour" ? Number(slot.price || 0) : 0,
            perPerson:
              formData.venueType === "per_person" ? Number(slot.price || 0) : 0,
          };
        } else {
          formattedPricing[day][slotType] = null;
        }
      });
    });
    pricingData.append("pricingSchedule", JSON.stringify(formattedPricing));
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/pricing`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: pricingData,
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to update pricing');
    }
    return result;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setToast({ open: false, message: '', severity: 'success' });
    const token = localStorage.getItem('token');
    if (!token) {
      setToast({
        open: true,
        message: 'No authentication token found. Please log in.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setToast({
        open: true,
        message: validationErrors.join(', '),
        severity: 'error',
      });
      setLoading(false);
      return;
    }
    try {
      let venueId = id;
      // ---------- STEP 2: CREATE OR UPDATE VENUE ----------
      const data = new FormData();
      const booleanFields = [
        'parkingAvailability',
        'foodCateringAvailability',
        'stageLightingAudio',
        'wheelchairAccessibility',
        'securityArrangements',
        'wifiAvailability',
        'acAvailable',
        'nonAcAvailable',
        'multipleHalls',
        'elderlyAccessibility',
      ];
      const payload = {
        ...formData,
        shortDescription: formData.description || '',
        holidaySchedule: formData.holidayScheduling || '',
        categories: formData.categories || '',
        accessibilityInfo: formData.accessibilityInfo || '',
      };
      delete payload.description;
      delete payload.holidayScheduling;
      delete payload.venueType;
      delete payload.selectedPackageIds;
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'searchTags' && value) {
          const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
          tagsArray.forEach(tag => data.append(key, tag));
        } else if (booleanFields.includes(key)) {
          data.append(key, value.toString());
        } else {
          data.append(key, value || '');
        }
      });
      data.append('venueType', formData.venueType || '');
      const pricingSchedule = transformToArray(timeSlots, formData.venueType);
      data.append('pricingSchedule', JSON.stringify(pricingSchedule));
      // ✅ Attach packageId if exists
      if (formData.selectedPackageIds && formData.selectedPackageIds.length > 0) {
        // Your backend may accept either `packageId` or `packages` array
        // adjust accordingly (most likely `packages`)
        data.append('packages', JSON.stringify(formData.selectedPackageIds));
      }
      if (files.thumbnail) data.append('thumbnail', files.thumbnail);
      if (files.auditoriumImage) data.append('images', files.auditoriumImage);
      if (files.floorPlan) data.append('images', files.floorPlan);
      let venueRes;
      if (viewMode === 'create') {
        venueRes = await fetch(`${API_BASE_URL}/venues/`, {
          method: 'POST',
          body: data,
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        venueRes = await fetch(`${API_BASE_URL}/venues/${id}`, {
          method: 'PUT',
          body: data,
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const venueResult = await venueRes.json();
      if (!venueRes.ok || !venueResult.success) {
        throw new Error(venueResult.message || 'Failed to create/update venue');
      }
      venueId = venueResult.data?._id || venueResult._id;
      console.log('✅ Venue created/updated:', venueId);
      // ---------- STEP 3: LINK PACKAGE TO VENUE (if created after) ----------
      if (formData.selectedPackageIds && formData.selectedPackageIds.length > 0 && viewMode === 'edit') {
        const linkRes = await fetch(`${API_BASE_URL}/venues/${venueId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ packages: formData.selectedPackageIds }),
        });
        const linkResult = await linkRes.json();
        if (!linkRes.ok) {
          console.error('Failed to link package to venue:', linkResult.message);
        }
      }
      // ---------- SUCCESS ----------
      setToast({
        open: true,
        message:
          viewMode === 'edit'
            ? 'Venue updated successfully '
            : 'Venue created successfully ',
        severity: 'success',
      });
      if (viewMode === 'edit') {
        setTimeout(() => navigate('/venue-setup/lists'), 2000);
      } else {
        handleReset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setToast({
        open: true,
        message: error.message.includes('expired')
          ? 'Session expired. Please log in again.'
          : `Error ${viewMode === 'edit' ? 'updating' : 'creating'} venue: ${error.message}`,
        severity: 'error',
      });
      if (error.message.includes('expired')) navigate('/login');
    } finally {
      setLoading(false);
    }
  };
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ open: false, message: '', severity: 'success' });
  };
  const getImageSrc = (path) => path ? `${BASE_URL}/${path}` : '';
  return (
    <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box sx={{ maxWidth: 'lg', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: isSmallScreen ? 2 : 3, overflowX: 'hidden', }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {viewMode === 'edit' && (
              <IconButton onClick={() => navigate('/venue-setup/lists')} color="primary">
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h4" component="h1">{viewMode === 'edit' ? 'Edit Venue' : 'Add New Venue'}</Typography>
          </Box>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Insert the venue details
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h4" gutterBottom>Venue Details</Typography>
                <TextField
                  fullWidth
                  label="Venue Name*" name="venueName"
                  value={formData.venueName}
                  onChange={handleInputChange}
                  placeholder="Type venue name"
                  sx={{ mb: 2, ...inputSx }}
                  required />
                <TextField
                  fullWidth
                  label="Description" name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your auditorium"
                  multiline
                  rows={4}
                  sx={{ mb: 2, ...inputSx }} />
                <FormControl fullWidth variant="outlined" required sx={{ mb: 2, ...inputSx }}>
                  <InputLabel id="category-label">Category*</InputLabel>
                  <Select
                    labelId="category-label" name="categories"
                    value={formData.categories} label="Category"
                    onChange={handleInputChange}>
                    <MenuItem value="">Select category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth label="Search Location"
                  inputRef={searchInputRef}
                  variant="outlined"
                  placeholder="Enter a location"
                  sx={{ mb: 2, ...inputSx }} />
                {mapsLoaded && GOOGLE_MAPS_API_KEY ? (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Click on the map below to select a location
                    </Typography>
                    <Box
                      ref={mapRef}
                      sx={{
                        height: 300,
                        width: '100%',
                        borderRadius: theme.shape.borderRadius,
                        border: `1px solid ${theme.palette.grey[300]}`,
                        mb: 2,
                      }} />
                  </>
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: theme.shape.borderRadius, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Map loading...
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{ flex: 1, ...inputSx }}
                    label="Latitude*" name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 25.2048"
                    type="number" inputProps={{ step: '0.0001' }} required />
                  <TextField
                    sx={{ flex: 1, ...inputSx }}
                    label="Longitude*" name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 55.2708"
                    type="number" inputProps={{ step: '0.0001' }} required />
                </Box>
                <TextField
                  fullWidth
                  label="Venue Address*" name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                  multiline rows={2}
                  sx={{ mb: 2, ...inputSx }} required />
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>Operating Hours</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Opening Hours" name="openingHours"
                      value={formData.openingHours}
                      onChange={handleInputChange} placeholder="e.g., 09:00 AM" sx={inputSx} />
                    <TextField
                      fullWidth label="Closing Hours"
                      name="closingHours" value={formData.closingHours}
                      onChange={handleInputChange} placeholder="e.g., 11:00 PM"
                      sx={inputSx} />
                  </Box>
                  <TextField
                    fullWidth label="Holiday Scheduling"
                    name="holidayScheduling" value={formData.holidayScheduling}
                    onChange={handleInputChange}
                    placeholder="Describe holiday hours or closures"
                    multiline rows={2} sx={inputSx} />
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Venue Facilities</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Specify available facilities</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(2, 1fr)', gap: theme.spacing(3) }}>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Switch name="parkingAvailability" checked={formData.parkingAvailability} onChange={handleInputChange} />}
                      label="Parking Availability" />
                    <FormControlLabel
                      control={<Switch name="foodCateringAvailability" checked={formData.foodCateringAvailability} onChange={handleInputChange} />}
                      label="Food & Catering Availability" />
                    {formData.foodCateringAvailability && (
                      <>
                  <Box
  sx={{
    backgroundColor: '#fce4ec',
    border: '1px solid #f8bbd9',
    borderRadius: 1,
    p: 2,
    mt: 1,
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#f8bbd9' }
  }}
  onClick={() => {
    sessionStorage.setItem('tempFormData', JSON.stringify(formData)); // Save current form data
    navigate('/venue-setup/foodmenu', {
      state: { selectingForVenue: true, preSelected: selectedPackages }
    });
  }}
>


                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h5" color="#E15B65">🍴</Typography>
                              <Typography variant="subtitle1" color="#E15B65">Menu Selection</Typography>
                            </Box>
                            {selectedPackages.length > 0 && <Chip label={selectedPackages.length} color="primary" size="small" />}
                          </Box>
                        </Box>
                       {selectedPackages.length > 0 && (
                          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {selectedPackages.map((pkg) => {
                              console.log('Package data:', pkg);
                              console.log('Thumbnail path:', pkg.thumbnail);
                              
                              // Construct proper image URL - match FoodMenu exactly
                              const imageUrl = pkg.thumbnail 
                                ? `https://api.bookmyevent.ae/${pkg.thumbnail}` 
                                : '/placeholder.jpg';
                              
                              console.log('Final image URL:', imageUrl);
                              
                              return (
                                <Card key={pkg._id} sx={{ width: 150, height: 160 }}>
                                  <CardMedia
                                    component="img"
                                    height="120"
                                    image={imageUrl}
                                    alt={pkg.title}
                                    sx={{ objectFit: 'cover' }}
                                    onError={(e) => { 
                                      console.error('Image failed to load:', imageUrl);
                                      e.target.src = '/placeholder.jpg'; 
                                    }}
                                  />
                                  <CardContent sx={{ p: 1 }}>
                                    <Typography variant="body2" noWrap sx={{ fontSize: '0.75rem' }}>
                                      {pkg.title}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </Box>
                        )}
                      </>
                    )}
                    <FormControlLabel
                      control={<Switch name="stageLightingAudio" checked={formData.stageLightingAudio} onChange={handleInputChange} />}
                      label="Stage / Lighting / Audio System" />
                    <FormControlLabel
                      control={<Switch name="acAvailable" checked={formData.acAvailable} onChange={handleInputChange} />}
                      label="AC Available" />
                    {formData.acAvailable && (
                      <FormControl fullWidth variant="outlined" sx={{ mt: 1, ...inputSx }}>
                        <InputLabel id="ac-type-label">AC Type</InputLabel>
                        <Select
                          labelId="ac-type-label"
                          name="acType"
                          value={formData.acType}
                          label="AC Type"
                          onChange={handleInputChange}>
                          <MenuItem value="Not Specified">Not Specified</MenuItem>
                          <MenuItem value="Central AC">Central AC</MenuItem>
                          <MenuItem value="Split AC">Split AC</MenuItem>
                          <MenuItem value="Window AC">Window AC</MenuItem>
                          <MenuItem value="Coolers">Coolers</MenuItem>
                        </Select>
                      </FormControl>)}
                    <TextField
                      fullWidth label="Parking Capacity"
                      name="parkingCapacity" value={formData.parkingCapacity}
                      onChange={handleInputChange} placeholder="Number of spots"
                      type="number" sx={inputSx} />
                    <TextField
                      fullWidth label="Dressing Rooms/Green Rooms"
                      name="dressingRooms" value={formData.dressingRooms}
                      onChange={handleInputChange} placeholder="Details about dressing rooms" sx={inputSx} />
                  </Stack>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Switch name="wheelchairAccessibility" checked={formData.wheelchairAccessibility} onChange={handleInputChange} />}
                      label="Wheelchair Accessibility" />
                    <FormControlLabel
                      control={<Switch name="securityArrangements" checked={formData.securityArrangements} onChange={handleInputChange} />}
                      label="Security Arrangements" />
                    <FormControlLabel
                      control={<Switch name="wifiAvailability" checked={formData.wifiAvailability} onChange={handleInputChange} />}
                      label="Wi-Fi Availability" />
                    <FormControlLabel
                      control={<Switch name="nonAcAvailable" checked={formData.nonAcAvailable} onChange={handleInputChange} />}
                      label="Non AC Available" />
                    <TextField
                      fullWidth
                      label="Washrooms/Restrooms Info"
                      name="washroomsInfo"
                      value={formData.washroomsInfo}
                      onChange={handleInputChange}
                      placeholder="Details about washrooms"
                      sx={inputSx} />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Venue Thumbnail*</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose the main image that represents your venue.
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDrop('thumbnail')}
                  onClick={() => document.getElementById('thumbnail-upload').click()}>
                  {files.thumbnail ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(files.thumbnail)}
                        alt="Thumbnail preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">{files.thumbnail.name}</Typography>
                    </Box>
                  ) : existingImages.thumbnail ? (
                    <Box>
                      <img
                        src={getImageSrc(existingImages.thumbnail)}
                        alt="Existing thumbnail"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">Existing thumbnail. Upload to replace.</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
                      <Typography variant="body2" color="#f59299ff">Or drag and drop</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="thumbnail-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange('thumbnail')} />
                </UploadDropArea>
              </CardContent>
            </Card>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Auditorium Image*</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  JPG, JPEG, PNG Less Than 2MB
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDrop('auditoriumImage')}
                  onClick={() => document.getElementById('auditorium-image-upload').click()} >
                  {files.auditoriumImage ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(files.auditoriumImage)}
                        alt="Auditorium image preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">{files.auditoriumImage.name}</Typography>
                    </Box>
                  ) : existingImages.auditoriumImage ? (
                    <Box>
                      <img
                        src={getImageSrc(existingImages.auditoriumImage)}
                        alt="Existing auditorium image"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }} />
                      <Typography variant="body2" color="text.secondary">Existing auditorium image. Upload to replace.</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
                      <Typography variant="body2" color="#f59299ff">Or drag and drop</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="auditorium-image-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange('auditoriumImage')} />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Pricing & Booking Options</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert The Pricing & Discount Information
                </Typography>
                {/* Venue Types Selection */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    Pricing Details
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                      variant={formData.venueType === 'per_person' ? 'contained' : 'outlined'}
                      onClick={() => setFormData((prev) => ({ ...prev, venueType: 'per_person' }))}
                      startIcon={
                        <Radio
                          checked={formData.venueType === 'per_person'}
                          sx={{
                            color: formData.venueType === 'per_person' ? '#fff' : '#E15B65',
                            '&.Mui-checked': { color: formData.venueType === 'per_person' ? '#fff' : '#E15B65' }
                          }} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        color: formData.venueType === 'per_person' ? '#fff' : '#E15B65',
                        backgroundColor: formData.venueType === 'per_person' ? '#E15B65' : 'transparent',
                        borderColor: '#E15B65',
                        '&:hover': {
                          backgroundColor: formData.venueType === 'per_person' ? '#c94a57' : 'rgba(225,91,101,0.08)',
                          borderColor: '#E15B65'
                        }
                      }} >
                      Per Person
                    </Button>
                    <Button
                      variant={formData.venueType === 'per_hour' ? 'contained' : 'outlined'}
                      onClick={() => setFormData((prev) => ({ ...prev, venueType: 'per_hour' }))}
                      startIcon={
                        <Radio
                          checked={formData.venueType === 'per_hour'}
                          sx={{
                            color: formData.venueType === 'per_hour' ? '#fff' : '#E15B65',
                            '&.Mui-checked': { color: formData.venueType === 'per_hour' ? '#fff' : '#E15B65' }
                          }} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        color: formData.venueType === 'per_hour' ? '#fff' : '#E15B65',
                        backgroundColor: formData.venueType === 'per_hour' ? '#E15B65' : 'transparent',
                        borderColor: '#E15B65',
                        '&:hover': {
                          backgroundColor: formData.venueType === 'per_hour' ? '#c94a57' : 'rgba(225,91,101,0.08)',
                          borderColor: '#E15B65'
                        }
                      }}>
                      Per Hour
                    </Button>
                    <Button
                      variant={formData.venueType === 'per_function' ? 'contained' : 'outlined'}
                      onClick={() => setFormData((prev) => ({ ...prev, venueType: 'per_function' }))}
                      startIcon={
                        <Radio
                          checked={formData.venueType === 'per_function'}
                          sx={{
                            color: formData.venueType === 'per_function' ? '#fff' : '#E15B65',
                            '&.Mui-checked': { color: formData.venueType === 'per_function' ? '#fff' : '#E15B65' }
                          }} />}
                      sx={{
                        borderRadius: 2, textTransform: 'none', px: 3, color: formData.venueType === 'per_function' ? '#fff' : '#E15B65', backgroundColor: formData.venueType === 'per_function' ? '#E15B65' : 'transparent', borderColor: '#E15B65',
                        '&:hover': { backgroundColor: formData.venueType === 'per_function' ? '#c94a57' : 'rgba(225,91,101,0.08)', borderColor: '#E15B65' }
                      }}> Per Function</Button>
                  </Box>
                  {/* Table */}
                  {formData.venueType && (
                    <Box sx={{
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}>
                      {/* Table Header */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr 1fr',
                        backgroundColor: theme.palette.grey[100],
                        borderBottom: `1px solid ${theme.palette.grey[300]}`
                      }}>
                        <Box sx={{ p: 2, borderRight: `1px solid ${theme.palette.grey[300]}`, fontWeight: 600 }}> Day</Box>
                        <Box sx={{ p: 2, borderRight: `1px solid ${theme.palette.grey[300]}`, fontWeight: 600 }}>Time Slots</Box>
                        <Box sx={{ p: 2, fontWeight: 600 }}>Pricing </Box>
                      </Box>
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <Box key={day}>
                          {/* Morning Slot Row */}
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '150px 1fr 1fr',
                            borderBottom: `1px solid ${theme.palette.grey[300]}`
                          }}>
                            {/* Day Column */}
                            <Box sx={{
                              p: 2,
                              borderRight: `1px solid ${theme.palette.grey[300]}`,
                              display: 'flex',
                              alignItems: 'flex-start',
                              textTransform: 'capitalize',
                              fontWeight: 500,
                            }}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Box>
                            {/* Morning Slot */}
                            <Box sx={{
                              p: 2,
                              borderRight: `1px solid ${theme.palette.grey[300]}`,
                              borderBottom: `1px solid ${theme.palette.grey[300]}`
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Checkbox
                                  size="small"
                                  checked={timeSlots[day].morning.enabled}
                                  onChange={(e) => handleTimeSlotChange(day, 'morning', 'enabled', e.target.checked)}
                                  sx={{ p: 0 }} />
                                <Typography variant="body2">Morning Slot</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                  size="small"
                                  value={timeSlots[day].morning.startTime}
                                  onChange={(e) => handleTimeSlotChange(day, 'morning', 'startTime', e.target.value)}
                                  disabled={!timeSlots[day].morning.enabled}
                                  sx={{ width: '80px', ...inputSx }}
                                  inputProps={{ style: { textAlign: 'center' } }} />
                                <Select
                                  size="small"
                                  value={timeSlots[day].morning.startPeriod}
                                  onChange={(e) => handleTimeSlotChange(day, 'morning', 'startPeriod', e.target.value)}
                                  disabled={!timeSlots[day].morning.enabled}
                                  sx={{ width: '70px' }}>
                                  <MenuItem value="Am">Am</MenuItem>
                                  <MenuItem value="Pm">Pm</MenuItem>
                                </Select>
                                <TextField
                                  size="small"
                                  value={timeSlots[day].morning.endTime}
                                  onChange={(e) => handleTimeSlotChange(day, 'morning', 'endTime', e.target.value)}
                                  disabled={!timeSlots[day].morning.enabled}
                                  sx={{ width: '80px', ...inputSx }}
                                  inputProps={{ style: { textAlign: 'center' } }} />
                                <Select
                                  size="small"
                                  value={timeSlots[day].morning.endPeriod}
                                  onChange={(e) => handleTimeSlotChange(day, 'morning', 'endPeriod', e.target.value)}
                                  disabled={!timeSlots[day].morning.enabled}
                                  sx={{ width: '70px' }}>
                                  <MenuItem value="Am">Am</MenuItem>
                                  <MenuItem value="Pm">Pm</MenuItem>
                                </Select>
                              </Box>
                            </Box>
                            {/* Morning Pricing */}
                            <Box sx={{
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.grey[300]}`
                            }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={timeSlots[day].morning.price}
                                onChange={(e) => handleTimeSlotChange(day, 'morning', 'price', e.target.value)}
                                disabled={!timeSlots[day].morning.enabled}
                                placeholder="Enter price"
                                type="number"
                                inputProps={{ step: '0.01', min: '0' }}
                                sx={inputSx} />
                            </Box>
                          </Box>
                          {/* Evening Slot Row */}
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '150px 1fr 1fr',
                            borderBottom: `1px solid ${theme.palette.grey[300]}`
                          }}>
                            {/* Day Column */}
                            <Box sx={{
                              p: 2,
                              borderRight: `1px solid ${theme.palette.grey[300]}`,
                              display: 'flex',
                              alignItems: 'flex-start',
                              textTransform: 'capitalize',
                              fontWeight: 500,
                            }}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Box>
                            {/* Evening Slot */}
                            <Box sx={{
                              p: 2,
                              borderRight: `1px solid ${theme.palette.grey[300]}`,
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Checkbox
                                  size="small"
                                  checked={timeSlots[day].evening.enabled}
                                  onChange={(e) => handleTimeSlotChange(day, 'evening', 'enabled', e.target.checked)}
                                  sx={{ p: 0 }}
                                />
                                <Typography variant="body2">Evening Slot</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                  size="small"
                                  value={timeSlots[day].evening.startTime}
                                  onChange={(e) => handleTimeSlotChange(day, 'evening', 'startTime', e.target.value)}
                                  disabled={!timeSlots[day].evening.enabled}
                                  sx={{ width: '80px', ...inputSx }}
                                  inputProps={{ style: { textAlign: 'center' } }} />
                                <Select
                                  size="small"
                                  value={timeSlots[day].evening.startPeriod}
                                  onChange={(e) => handleTimeSlotChange(day, 'evening', 'startPeriod', e.target.value)}
                                  disabled={!timeSlots[day].evening.enabled}
                                  sx={{ width: '70px' }}>
                                  <MenuItem value="Am">Am</MenuItem>
                                  <MenuItem value="Pm">Pm</MenuItem>
                                </Select>
                                <TextField
                                  size="small"
                                  value={timeSlots[day].evening.endTime}
                                  onChange={(e) => handleTimeSlotChange(day, 'evening', 'endTime', e.target.value)}
                                  disabled={!timeSlots[day].evening.enabled}
                                  sx={{ width: '80px', ...inputSx }}
                                  inputProps={{ style: { textAlign: 'center' } }} />
                                <Select
                                  size="small"
                                  value={timeSlots[day].evening.endPeriod}
                                  onChange={(e) => handleTimeSlotChange(day, 'evening', 'endPeriod', e.target.value)}
                                  disabled={!timeSlots[day].evening.enabled}
                                  sx={{ width: '70px' }}>
                                  <MenuItem value="Am">Am</MenuItem>
                                  <MenuItem value="Pm">Pm</MenuItem>
                                </Select>
                              </Box>
                            </Box>
                            {/* Evening Pricing */}
                            <Box sx={{ p: 2 }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={timeSlots[day].evening.price}
                                onChange={(e) => handleTimeSlotChange(day, 'evening', 'price', e.target.value)}
                                disabled={!timeSlots[day].evening.enabled}
                                placeholder="Enter price"
                                type="number"
                                inputProps={{ step: '0.01', min: '0' }}
                                sx={inputSx}
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box><Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Give Discount</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set a discount that applies to all pricing types—hourly, daily, and distance-based
                  </Typography>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    sx={inputSx} />
                </Box>
                <TextField
                  fullWidth
                  label="Advance Payment / Deposit (%)"
                  name="advanceDeposit"
                  value={formData.advanceDeposit}
                  onChange={handleInputChange}
                  placeholder="Ex: 20"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ mb: 2, ...inputSx }} />
                <TextField
                  fullWidth
                  label="Cancellation Policy"
                  name="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={handleInputChange}
                  placeholder="e.g., Free cancellation 48 hours before"
                  multiline
                  rows={2}
                  sx={{ mb: 2, ...inputSx }} />
                <TextField
                  fullWidth
                  label="Extra Charges (e.g., Cleaning fee)"
                  name="extraCharges"
                  value={formData.extraCharges}
                  onChange={handleInputChange}
                  placeholder="Describe extra charges"
                  multiline
                  rows={2}
                  sx={inputSx} />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Capacity & Layout</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Specify capacity and layout details</Typography>
                <FormControl fullWidth variant="outlined" required sx={{ mb: 2, ...inputSx }}>
                  <InputLabel id="seating-arrangement-label">Seating Arrangement*</InputLabel>
                  <Select
                    labelId="seating-arrangement-label"
                    name="seatingArrangement"
                    value={formData.seatingArrangement}
                    label="Seating Arrangement"
                    onChange={handleInputChange} >
                    <MenuItem value="">Select seating arrangement</MenuItem>
                    <MenuItem value="Amphitheater">Amphitheater</MenuItem>
                    <MenuItem value="Balcony auditorium">Balcony auditorium</MenuItem>
                    <MenuItem value="Flat floor auditorium">Flat floor auditorium</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Max Guest Count (Seated)*"
                    name="maxGuestsSeated"
                    value={formData.maxGuestsSeated}
                    onChange={handleInputChange}
                    placeholder="e.g., 200"
                    type="number"
                    required
                    sx={inputSx} />
                  <TextField
                    fullWidth
                    label="Max Guest Count (Standing)"
                    name="maxGuestsStanding"
                    value={formData.maxGuestsStanding}
                    onChange={handleInputChange}
                    placeholder="e.g., 300"
                    type="number"
                    sx={inputSx} />
                </Box>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDrop('floorPlan')}
                  onClick={() => document.getElementById('floor-plan-upload').click()}
                  sx={{ mb: 2 }}>
                  {files.floorPlan ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary">{files.floorPlan.name}</Typography>
                    </Box>
                  ) : existingImages.floorPlan ? (
                    <Box>
                      {existingImages.floorPlan.endsWith('.pdf') ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Existing floor plan (PDF): {existingImages.floorPlan.split('/').pop()}</Typography>
                          <a href={getImageSrc(existingImages.floorPlan)} target="_blank" rel="noopener noreferrer">View PDF</a>
                        </Box>
                      ) : (
                        <img
                          src={getImageSrc(existingImages.floorPlan)}
                          alt="Existing floor plan"
                          style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }} />
                      )}
                      <Typography variant="body2" color="text.secondary">Upload new to replace.</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload Floor Plan (Image/jpg)</Typography>
                      <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="floor-plan-upload"
                    hidden
                    accept="image/*,application/pdf"
                    onChange={handleFileChange('floorPlan')} />
                </UploadDropArea>
                <FormControlLabel
                  control={<Switch name="multipleHalls" checked={formData.multipleHalls} onChange={handleInputChange} />}
                  label="Multiple Halls/Sections Under One Venue" />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Location & Accessibility</Typography>
                <TextField
                  fullWidth
                  label="Nearby Transport Details"
                  name="nearbyTransport"
                  value={formData.nearbyTransport}
                  onChange={handleInputChange}
                  placeholder="Describe nearby metro, bus stops, etc."
                  sx={{ mb: 2, ...inputSx }} />
                <TextField
                  fullWidth
                  label="Accessibility Information"
                  name="accessibilityInfo"
                  value={formData.accessibilityInfo}
                  onChange={handleInputChange}
                  placeholder="Describe accessibility features"
                  sx={{ mb: 2, ...inputSx }} />
                <FormControlLabel
                  control={<Switch name="elderlyAccessibility" checked={formData.elderlyAccessibility} onChange={handleInputChange} />}
                  label="Accessibility for Elderly & Differently Abled"
                  sx={{ mb: 3 }} />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Venue Documents</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload relevant documents (licenses, permits, etc.)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDrop('documents')}
                  onClick={() => document.getElementById('documents-upload').click()}>
                  {files.documents ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {files.documents.name}
                      <IconButton
                        size="small"
                        onClick={() => {
                          setPreviewSrc(URL.createObjectURL(files.documents));
                          setOpenPreview(true);
                        }}
                        sx={{ color: theme.palette.primary.main }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : existingImages.documents ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {existingImages.documents.split('/').pop()} {/* Show only the file name from the URL */}
                      <IconButton
                        size="small"
                        onClick={() => {
                          setPreviewSrc(getImageSrc(existingImages.documents));
                          setOpenPreview(true);
                        }}
                        sx={{ color: theme.palette.primary.main }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
                      <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="documents-upload"
                    hidden
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange('documents')} />
                </UploadDropArea>
                <Dialog
                  open={openPreview}
                  onClose={() => setOpenPreview(false)}
                  maxWidth="md"
                  fullWidth
                  PaperProps={{
                    sx: { height: '80vh', p: 2 },
                  }}>
                  <DialogContent sx={{ p: 0, height: '100%' }}>
                    <Box sx={{ height: '100%' }}>
                      <iframe
                        src={previewSrc}
                        title="Document Preview"
                        style={{ width: '100%', height: '100%', border: 'none' }} />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenPreview(false)} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle1" gutterBottom>Search Tags</Typography>
                <TextField
                  fullWidth
                  label="Search Tags"
                  name="searchTags"
                  value={formData.searchTags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas (e.g., Auditorium, Wedding, Conference)"
                  sx={{ mb: 1, ...inputSx }} />
                <Typography variant="body2" color="text.secondary">
                  Add relevant keywords to help users find this venue easily
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={handleReset}
              disabled={loading} >
              {viewMode === 'edit' ? 'Cancel' : 'Reset'}
            </Button>
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ backgroundColor: '#E15B65' }}>
              {loading ? 'Submitting...' : viewMode === 'edit' ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ '& .MuiSnackbarContent-root': { minWidth: '600px', maxWidth: '600px', width: 'auto', }, }}>
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: '100%', '& .MuiAlert-message': { whiteSpace: 'pre-line', wordBreak: 'break-word', fontSize: '1rem', lineHeight: 1.5, }, }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};
export default CreateAuditorium;