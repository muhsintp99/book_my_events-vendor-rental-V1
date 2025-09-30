import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Stack,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useTheme, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';

// Helper component for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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

const Createauditorium = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const API_BASE_URL = 'https://api.bookmyevent.ae/api';
  const [viewMode, setViewMode] = useState(id ? 'edit' : 'create');
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(id || null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    venueName: '',
    description: '',
    venueAddress: '',
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
    washroomsInfo: '',
    dressingRooms: '',
    rentalType: 'hourly',
    hourlyPrice: '',
    perDayPrice: '',
    distanceWisePrice: '',
    discount: '',
    customPackages: '',
    dynamicPricing: false,
    advanceDeposit: '',
    cancellationPolicy: '',
    extraCharges: '',
    seatingArrangement: '',
    maxGuestsSeated: '',
    maxGuestsStanding: '',
    multipleHalls: false,
    nearbyTransport: '',
    elderlyAccessibility: false,
    searchTags: '',
    status: 'active', // Default to 'active' for new venues
  });
  const [files, setFiles] = useState({ thumbnail: null, auditoriumImage: null, floorPlan: null });
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [existingAuditoriumImage, setExistingAuditoriumImage] = useState('');
  const [existingFloorPlan, setExistingFloorPlan] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch venue data if in edit mode
  useEffect(() => {
    if (id) {
      fetchVenue(id);
    }
  }, [id]);

  // Handlers
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (key) => (event) => {
    const file = event.target.files[0];
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleDrop = (key) => (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleReset = () => {
    setFormData({
      venueName: '',
      description: '',
      venueAddress: '',
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
      washroomsInfo: '',
      dressingRooms: '',
      rentalType: 'hourly',
      hourlyPrice: '',
      perDayPrice: '',
      distanceWisePrice: '',
      discount: '',
      customPackages: '',
      dynamicPricing: false,
      advanceDeposit: '',
      cancellationPolicy: '',
      extraCharges: '',
      seatingArrangement: '',
      maxGuestsSeated: '',
      maxGuestsStanding: '',
      multipleHalls: false,
      nearbyTransport: '',
      elderlyAccessibility: false,
      searchTags: '',
      status: 'active', // Reset to 'active'
    });
    setFiles({ thumbnail: null, auditoriumImage: null, floorPlan: null });
    setExistingThumbnail('');
    setExistingAuditoriumImage('');
    setExistingFloorPlan('');
    setTabValue(0);
    setErrorMessage('');
    setViewMode('create');
    setSelectedVenueId(null);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.venueName.trim()) errors.push('Venue name is required');
    if (!formData.venueAddress.trim()) errors.push('Venue address is required');
    if (!formData.seatingArrangement) errors.push('Seating arrangement is required');
    if (!formData.maxGuestsSeated) errors.push('Max guests seated is required');
    if (formData.rentalType === 'hourly' && !formData.hourlyPrice) errors.push('Hourly price is required');
    if (formData.rentalType === 'perDay' && !formData.perDayPrice) errors.push('Per day price is required');
    if (formData.rentalType === 'distanceWise' && !formData.distanceWisePrice) errors.push('Distance wise price is required');
    return errors;
  };

  const fetchVenue = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No authentication token found. Please log in.');
        setAlertSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log('fetchVenue response:', result);
      if (result.success) {
        setFormData({
          venueName: result.data.venueName || '',
          description: result.data.shortDescription || '',
          venueAddress: result.data.venueAddress || '',
          latitude: result.data.latitude || '',
          longitude: result.data.longitude || '',
          openingHours: result.data.openingHours || '',
          closingHours: result.data.closingHours || '',
          holidayScheduling: result.data.holidaySchedule || '',
          parkingAvailability: result.data.parkingAvailability || false,
          parkingCapacity: result.data.parkingCapacity || '',
          foodCateringAvailability: result.data.foodCateringAvailability || false,
          stageLightingAudio: result.data.stageLightingAudio || false,
          wheelchairAccessibility: result.data.wheelchairAccessibility || false,
          securityArrangements: result.data.securityArrangements || false,
          wifiAvailability: result.data.wifiAvailability || false,
          washroomsInfo: result.data.washroomsInfo || '',
          dressingRooms: result.data.dressingRooms || '',
          rentalType: result.data.rentalType || 'hourly',
          hourlyPrice: result.data.hourlyPrice || '',
          perDayPrice: result.data.perDayPrice || '',
          distanceWisePrice: result.data.distanceWisePrice || '',
          discount: result.data.discount || '',
          customPackages: result.data.customPackages || '',
          dynamicPricing: result.data.dynamicPricing || false,
          advanceDeposit: result.data.advanceDeposit || '',
          cancellationPolicy: result.data.cancellationPolicy || '',
          extraCharges: result.data.extraCharges || '',
          seatingArrangement: result.data.seatingArrangement || '',
          maxGuestsSeated: result.data.maxGuestsSeated || '',
          maxGuestsStanding: result.data.maxGuestsStanding || '',
          multipleHalls: result.data.multipleHalls || false,
          nearbyTransport: result.data.nearbyTransport || '',
          elderlyAccessibility: result.data.accessibilityInfo || false,
          searchTags: Array.isArray(result.data.searchTags)
            ? result.data.searchTags.join(', ')
            : result.data.searchTags || '',
          status: result.data.status || 'active', // Include status
        });
        setExistingThumbnail(result.data.thumbnail || '');
        if (result.data.images && result.data.images.length > 0) {
          setExistingAuditoriumImage(result.data.images[0]);
          if (result.data.images.length > 1) {
            setExistingFloorPlan(result.data.images[1]);
          }
        }
        setFiles({ thumbnail: null, auditoriumImage: null, floorPlan: null });
        setViewMode('edit');
        setSelectedVenueId(id);
      } else {
        throw new Error(result.message || 'Failed to fetch venue');
      }
    } catch (error) {
      console.error('Error fetching venue:', error);
      if (error.message.includes('expired')) {
        setErrorMessage('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        setErrorMessage('Error fetching venue: ' + error.message);
      }
      setAlertSeverity('error');
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('No authentication token found. Please log in.');
      setAlertSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(', '));
      setAlertSeverity('error');
      setOpenToast(true);
      setLoading(false);
      return;
    }
    const data = new FormData();
    const booleanFields = [
  'parkingAvailability',
  'foodCateringAvailability',
  'stageLightingAudio',
  'wheelchairAccessibility',
  'securityArrangements',
  'wifiAvailability',
  'dynamicPricing',
  'multipleHalls',
  'accessibilityInfo',
];

    const payload = {
      ...formData,
      shortDescription: formData.description || '',
      holidaySchedule: formData.holidayScheduling || '',
      accessibilityInfo: formData.elderlyAccessibility,
    };
    delete payload.description;
    delete payload.holidayScheduling;
    delete payload.elderlyAccessibility;
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'searchTags' && value) {
        data.append(key, value.split(',').map((tag) => tag.trim()));
      } else if (booleanFields.includes(key)) {
        data.append(key, value.toString());
      } else {
        data.append(key, value || '');
      }
    });
    if (files.thumbnail) data.append('thumbnail', files.thumbnail);
    if (files.auditoriumImage) data.append('images', files.auditoriumImage);
    if (files.floorPlan) data.append('images', files.floorPlan);
    for (let [key, value] of data.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }
    try {
      const url = viewMode === 'edit' ? `${API_BASE_URL}/venues/${selectedVenueId}` : `${API_BASE_URL}/venues/`;
      const method = viewMode === 'edit' ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log('handleSubmit response:', result);
      if (result.success) {
        setErrorMessage(viewMode === 'edit' ? 'Venue updated successfully' : 'Venue created successfully');
        setAlertSeverity('success');
        setOpenToast(true);
        handleReset();
      } else {
        throw new Error(result.message || `Failed to ${viewMode === 'edit' ? 'update' : 'create'} venue`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.message.includes('expired')) {
        setErrorMessage('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        setErrorMessage(`Error ${viewMode === 'edit' ? 'updating' : 'creating'} venue: ` + error.message);
      }
      setAlertSeverity('error');
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
    setErrorMessage('');
  };

  return (
    <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box sx={{
        maxWidth: 'lg',
        margin: 'auto',
        backgroundColor: 'white',
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        p: isSmallScreen ? 2 : 3,
        overflowX: 'hidden',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" component="h1">{viewMode === 'edit' ? 'Edit Venue' : 'Add New Venue'}</Typography>
          </Box>
          <Tooltip title="Settings">
            <IconButton color="primary" sx={{ backgroundColor: 'white', border: `1px solid ${theme.palette.grey[300]}` }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Insert the venue details
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Venue Name</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enter venue name in different languages
                </Typography>
                <TabPanel value={tabValue} index={0}>
                  <TextField
                    fullWidth
                    label="Venue name (Default)*"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    placeholder="Type venue name"
                    sx={{ mb: 2 }}
                    required
                  />
                </TabPanel>
                
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your auditorium"
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Venue Address*"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                  required
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 12.9716"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 77.5946"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
                    <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                      <Typography variant="h6" gutterBottom>Operating Hours</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Opening Hours"
                          name="openingHours"
                          value={formData.openingHours}
                          onChange={handleInputChange}
                          placeholder="e.g., 09:00"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Closing Hours"
                          name="closingHours"
                          value={formData.closingHours}
                          onChange={handleInputChange}
                          placeholder="e.g., 11:00 P.M."
                          sx={{ mb: 2 }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Holiday Scheduling"
                        name="holidayScheduling"
                        value={formData.holidayScheduling}
                        onChange={handleInputChange}
                        placeholder="Describe holiday hours or closures"
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
  control={
    <Switch
      name="status"
      checked={formData.status === 'active'}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          status: e.target.checked ? 'active' : 'inactive',
        }))
      }
    />
  }
  label="Venue Status (Active/Inactive)"
/>

                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Venue Thumbnail*</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDrop('thumbnail')}
                  onClick={() => document.getElementById('thumbnail-upload').click()}
                >
                  {files.thumbnail ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(files.thumbnail)}
                        alt="Thumbnail preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">{files.thumbnail.name}</Typography>
                    </Box>
                  ) : existingThumbnail ? (
                    <Box>
                      <img
                        src={existingThumbnail}
                        alt="Existing thumbnail"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">Existing thumbnail. Upload to replace.</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
                      <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="thumbnail-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange('thumbnail')}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Auditorium Image*</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  JPG, JPEG, PNG Less Than 2MB (Ratio 3:2)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDrop('auditoriumImage')}
                  onClick={() => document.getElementById('auditorium-image-upload').click()}
                >
                  {files.auditoriumImage ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(files.auditoriumImage)}
                        alt="Auditorium image preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">{files.auditoriumImage.name}</Typography>
                    </Box>
                  ) : existingAuditoriumImage ? (
                    <Box>
                      <img
                        src={existingAuditoriumImage}
                        alt="Existing auditorium image"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">Existing auditorium image. Upload to replace.</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
                      <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="auditorium-image-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange('auditoriumImage')}
                  />
                </UploadDropArea>
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
                      label="Parking Availability"
                    />
                    <TextField
                      fullWidth
                      label="Parking Capacity"
                      name="parkingCapacity"
                      value={formData.parkingCapacity}
                      onChange={handleInputChange}
                      placeholder="Number of spots"
                      type="number"
                    />
                    <FormControlLabel
                      control={<Switch name="foodCateringAvailability" checked={formData.foodCateringAvailability} onChange={handleInputChange} />}
                      label="Food & Catering Availability"
                    />
                    <FormControlLabel
                      control={<Switch name="stageLightingAudio" checked={formData.stageLightingAudio} onChange={handleInputChange} />}
                      label="Stage / Lighting / Audio System"
                    />
                  </Stack>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Switch name="wheelchairAccessibility" checked={formData.wheelchairAccessibility} onChange={handleInputChange} />}
                      label="Wheelchair Accessibility"
                    />
                    <FormControlLabel
                      control={<Switch name="securityArrangements" checked={formData.securityArrangements} onChange={handleInputChange} />}
                      label="Security Arrangements"
                    />
                    <FormControlLabel
                      control={<Switch name="wifiAvailability" checked={formData.wifiAvailability} onChange={handleInputChange} />}
                      label="Wi-Fi Availability"
                    />
                    <TextField
                      fullWidth
                      label="Washrooms/Restrooms Info"
                      name="washroomsInfo"
                      value={formData.washroomsInfo}
                      onChange={handleInputChange}
                      placeholder="Details about washrooms"
                    />
                    <TextField
                      fullWidth
                      label="Dressing Rooms/Green Rooms"
                      name="dressingRooms"
                      value={formData.dressingRooms}
                      onChange={handleInputChange}
                      placeholder="Details about dressing rooms"
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Pricing & Booking Options</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Insert The Pricing & Discount Informations</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Rental Type</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Choose the rental type you prefer.</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(2) }}>
                    <Card
                      variant="outlined"
                      sx={{ p: 2, cursor: 'pointer', borderColor: formData.rentalType === 'hourly' ? theme.palette.primary.main : undefined, borderWidth: formData.rentalType === 'hourly' ? 2 : 1 }}
                      onClick={() => setFormData((prev) => ({ ...prev, rentalType: 'hourly' }))}
                    >
                      <FormControlLabel
                        control={<Radio name="rentalType" checked={formData.rentalType === 'hourly'} onChange={() => setFormData((prev) => ({ ...prev, rentalType: 'hourly' }))} />}
                        label="Hourly"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">Set your hourly rental price.</Typography>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{ p: 2, cursor: 'pointer', borderColor: formData.rentalType === 'perDay' ? theme.palette.primary.main : undefined, borderWidth: formData.rentalType === 'perDay' ? 2 : 1 }}
                      onClick={() => setFormData((prev) => ({ ...prev, rentalType: 'perDay' }))}
                    >
                      <FormControlLabel
                        control={<Radio name="rentalType" checked={formData.rentalType === 'perDay'} onChange={() => setFormData((prev) => ({ ...prev, rentalType: 'perDay' }))} />}
                        label="Per Day"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">Set your per day rental price.</Typography>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{ p: 2, cursor: 'pointer', borderColor: formData.rentalType === 'distanceWise' ? theme.palette.primary.main : undefined, borderWidth: formData.rentalType === 'distanceWise' ? 2 : 1 }}
                      onClick={() => setFormData((prev) => ({ ...prev, rentalType: 'distanceWise' }))}
                    >
                      <FormControlLabel
                        control={<Radio name="rentalType" checked={formData.rentalType === 'distanceWise'} onChange={() => setFormData((prev) => ({ ...prev, rentalType: 'distanceWise' }))} />}
                        label="Distance Wise"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">Set your distance wise rental price.</Typography>
                    </Card>
                  </Box>
                </Box>
                {formData.rentalType === 'hourly' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Hourly Price ($/per hour)*"
                      name="hourlyPrice"
                      value={formData.hourlyPrice}
                      onChange={handleInputChange}
                      placeholder="Ex: 35.25"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      required
                    />
                  </Box>
                )}
                {formData.rentalType === 'perDay' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Per Day Price ($/per day)*"
                      name="perDayPrice"
                      value={formData.perDayPrice}
                      onChange={handleInputChange}
                      placeholder="Ex: 250.00"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      required
                    />
                  </Box>
                )}
                {formData.rentalType === 'distanceWise' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Distance Wise Price ($/per km)*"
                      name="distanceWisePrice"
                      value={formData.distanceWisePrice}
                      onChange={handleInputChange}
                      placeholder="Ex: 1.50"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      required
                    />
                  </Box>
                )}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Give Discount</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set a discount that applies to all pricing types—hourly, daily, and distance-based
                  </Typography>
                  <TextField
                    fullWidth
                    label="Discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Custom Packages (e.g., Wedding, Corporate)"
                  name="customPackages"
                  value={formData.customPackages}
                  onChange={handleInputChange}
                  placeholder="Describe custom packages"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={<Switch name="dynamicPricing" checked={formData.dynamicPricing} onChange={handleInputChange} />}
                  label="Enable Dynamic Pricing (Weekend/Holiday higher rates)"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Advance Payment / Deposit %"
                  name="advanceDeposit"
                  value={formData.advanceDeposit}
                  onChange={handleInputChange}
                  placeholder="Ex: 20"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Cancellation Policy"
                  name="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={handleInputChange}
                  placeholder="e.g., Free cancellation 48 hours before"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Extra Charges (e.g., Cleaning fee)"
                  name="extraCharges"
                  value={formData.extraCharges}
                  onChange={handleInputChange}
                  placeholder="Describe extra charges"
                  multiline
                  rows={2}
                />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>Capacity & Layout</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Specify capacity and layout details</Typography>
                <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
                  <InputLabel id="seating-arrangement-label">Seating Arrangement*</InputLabel>
                  <Select
                    labelId="seating-arrangement-label"
                    id="seating-arrangement-select"
                    name="seatingArrangement"
                    value={formData.seatingArrangement}
                    label="Seating Arrangement"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Select seating arrangement</MenuItem>
                    <MenuItem value="Theater">Theater</MenuItem>
                    <MenuItem value="Banquet">Banquet</MenuItem>
                    <MenuItem value="Classroom">Classroom</MenuItem>
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
                  />
                  <TextField
                    fullWidth
                    label="Max Guest Count (Standing)"
                    name="maxGuestsStanding"
                    value={formData.maxGuestsStanding}
                    onChange={handleInputChange}
                    placeholder="e.g., 300"
                    type="number"
                  />
                </Box>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDrop('floorPlan')}
                  onClick={() => document.getElementById('floor-plan-upload').click()}
                  sx={{ mb: 2 }}
                >
                  {files.floorPlan ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary">{files.floorPlan.name}</Typography>
                    </Box>
                  ) : existingFloorPlan ? (
                    <Box>
                      {existingFloorPlan.endsWith('.pdf') ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Existing floor plan (PDF): {existingFloorPlan.split('/').pop()}</Typography>
                          <a href={existingFloorPlan} target="_blank" rel="noopener noreferrer">View PDF</a>
                        </Box>
                      ) : (
                        <img
                          src={existingFloorPlan}
                          alt="Existing floor plan"
                          style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                        />
                      )}
                      <Typography variant="body2" color="text.secondary">Upload new to replace.</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload Floor Plan (PDF/Image)</Typography>
                      <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="floor-plan-upload"
                    hidden
                    accept="image/*,application/pdf"
                    onChange={handleFileChange('floorPlan')}
                  />
                </UploadDropArea>
                <FormControlLabel
                  control={<Switch name="multipleHalls" checked={formData.multipleHalls} onChange={handleInputChange} />}
                  label="Multiple Halls/Sections Under One Venue"
                />
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
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={<Switch name="elderlyAccessibility" checked={formData.elderlyAccessibility} onChange={handleInputChange} />}
                  label="Accessibility for Elderly & Differently Abled"
                  sx={{ mb: 3 }}
                />
                <Typography variant="subtitle1" gutterBottom># Search Tags</Typography>
                <TextField
                  fullWidth
                  label="Search Tags"
                  name="searchTags"
                  value={formData.searchTags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas (e.g., Auditorium, Wedding, Conference)"
                  sx={{ mb: 1 }}
                />
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
              disabled={loading}
            >
              {viewMode === 'edit' ? 'Cancel' : 'Reset'}
            </Button>
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : viewMode === 'edit' ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={openToast}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={alertSeverity}
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Createauditorium;