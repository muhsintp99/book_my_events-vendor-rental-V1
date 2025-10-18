import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  DirectionsCar as CarIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Styled components for custom styling
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#26a69a',
  },
  '& .MuiTab-root': {
    color: '#666',
    fontSize: '14px',
    textTransform: 'none',
    minHeight: '40px',
    '&.Mui-selected': {
      color: '#26a69a',
      fontWeight: 500,
    },
  },
}));

const ThumbnailImage = styled('img')(({ theme, active }) => ({
  width: 80,
  height: 60,
  objectFit: 'cover',
  borderRadius: 6,
  cursor: 'pointer',
  border: active ? '2px solid #26a69a' : '2px solid transparent',
  opacity: active ? 1 : 0.7,
  transition: 'all 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
}));

const CarListingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae/api';
  
  const [activeTab, setActiveTab] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  // ✅ NEW: Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    // Check if vehicle data is passed via location state
    if (location.state?.vehicle) {
      const vehicleData = location.state.vehicle;
      setVehicle(vehicleData);
      setLoading(false);
    } else if (id && id !== 'undefined') {
      fetchVehicle();
    } else {
      setError('No vehicle ID provided');
      setLoading(false);
    }
  }, [id, location.state]);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching vehicle with ID:', id);
      
      const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const vehicleData = response.data.data || response.data;
      console.log('Vehicle data received:', vehicleData);
      
      setVehicle(vehicleData);
      setError('');
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load vehicle data';
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastSeverity('error');
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Confirm Delete Function
  const confirmDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!vehicle?._id) {
      setToastMessage('Vehicle ID not found');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/vehicles/${vehicle._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToastMessage('Vehicle deleted successfully');
      setToastSeverity('success');
      setOpenToast(true);
      setTimeout(() => navigate('/vehicle-setup/lists'), 1500);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setToastMessage(error.response?.data?.message || 'Failed to delete vehicle');
      setToastSeverity('error');
      setOpenToast(true);
    } finally {
      setOpenDeleteDialog(false); // ✅ Close dialog
    }
  };

  const handleEdit = () => {
    if (!vehicle?._id) {
      setToastMessage('Vehicle ID not found');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    navigate(`/vehicle-setup/leads/${vehicle._id}`, { state: { vehicle } });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
  };

  const handleBack = () => {
    navigate('/vehicle-setup/lists');
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#f8f9fa'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        p: 3, 
        bgcolor: '#f8f9fa', 
        minHeight: '100vh' 
      }}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Vehicles
          </Button>
        </Box>
        <Alert severity="error">
          {error || 'Vehicle not found'}
          <br />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Vehicle ID: {id || 'Not provided'}
          </Typography>
        </Alert>
      </Box>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : vehicle.thumbnail 
    ? [vehicle.thumbnail] 
    : ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'];

  return (
    <Box sx={{ 
      width: '100%', 
      mx: 'auto', 
      p: 3, 
      bgcolor: '#f8f9fa', 
      minHeight: '100vh' 
    }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ color: '#666' }}
        >
          Back to Vehicles
        </Button>
      </Box>

      {/* Header Section - ✅ TOGGLES REMOVED */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: '#4fc3f7', 
            width: 48, 
            height: 48 
          }}>
            <CarIcon />
          </Avatar>
          <Typography variant="h4" fontWeight="600" color="#2c3e50" sx={{ fontSize: '28px' }}>
            {vehicle.name || 'Vehicle Details'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={confirmDelete}  
            sx={{
              color: '#f48fb1',
              borderColor: '#f48fb1',
              bgcolor: '#fce4ec',
              textTransform: 'none',
              fontSize: '14px',
              px: 2,
              py: 1,
              '&:hover': {
                bgcolor: '#f8bbd9',
                borderColor: '#f48fb1'
              }
            }}
          >
            Delete
          </Button>
          
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              bgcolor: '#00695c',
              textTransform: 'none',
              fontSize: '14px',
              px: 2,
              py: 1,
              '&:hover': {
                bgcolor: '#004d40'
              }
            }}
          >
            Edit Vehicle
          </Button>
        </Box>
      </Box>

      <Card sx={{ 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        bgcolor: '#ffffff'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box>
                <Box
                  component="img"
                  src={images[activeImage]}
                  alt={vehicle.name || 'Vehicle'}
                  sx={{
                    width: '100%',
                    height: 280,
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {images.map((img, index) => (
                    <ThumbnailImage
                      key={index}
                      src={img}
                      alt={`${vehicle.name} view ${index + 1}`}
                      active={activeImage === index}
                      onClick={() => setActiveImage(index)}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight="600" mb={2} color="#2c3e50" sx={{ fontSize: '32px' }}>
                {vehicle.name || 'Vehicle Name'}
              </Typography>
              
              <Typography variant="h6" color="#666" mb={1} fontWeight="600" sx={{ fontSize: '16px' }}>
                Description:
              </Typography>
              
              <Typography variant="body1" color="#666" mb={3} lineHeight={1.6} sx={{ fontSize: '14px' }}>
                {vehicle.description || 'No description available.'}
              </Typography>

              {vehicle.searchTags && vehicle.searchTags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" color="#666" mb={1} fontWeight="600" sx={{ fontSize: '16px' }}>
                    Search Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {vehicle.searchTags.map((tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: '#e0f2f1',
                          color: '#00695c',
                          borderRadius: 1,
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, bgcolor: '#eee' }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CarIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                <Typography variant="h6" fontWeight="600" mb={3} sx={{ fontSize: '16px', textAlign: 'center' }}>
                  General Info
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                {[
                  { label: 'Brand', value: vehicle.brand?.title || 'N/A' },
                  { label: 'Model', value: vehicle.model || 'N/A' },
                  { label: 'Category', value: vehicle.category?.title || 'N/A' },
                  { label: 'Type', value: vehicle.type || 'N/A' },
                  { label: 'License Plate', value: vehicle.licensePlateNumber || 'N/A' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                    <Typography color="#666" sx={{ fontSize: '14px' }}>{item.label}</Typography>
                    <Typography fontWeight="500" sx={{ fontSize: '14px' }}>: {item.value}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                <Typography variant="h6" fontWeight="600" color="#2c3e50" sx={{ fontSize: '16px', mb: 0.5 }}>
                  Zone
                </Typography>
                <Typography variant="body2" color="#26a69a" sx={{ fontSize: '14px' }}>
                  {vehicle.zone?.name || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="600" mb={3} sx={{ fontSize: '16px', textAlign: 'center' }}>
                Fare & Discounts
              </Typography>
              
              <Box>
                {[
                  { label: 'Hourly', value: vehicle.pricing?.hourly ? `₹ ${vehicle.pricing.hourly}` : 'N/A' },
                  { label: 'Per Day', value: vehicle.pricing?.perDay ? `₹ ${vehicle.pricing.perDay}` : 'N/A' },
                  { label: 'Distance', value: vehicle.pricing?.distance ? `₹ ${vehicle.pricing.distance}/km` : 'N/A' },
                  { label: 'Discount', value: vehicle.discount ? `${vehicle.discount} %` : 'N/A' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                    <Typography color="#666" sx={{ fontSize: '14px' }}>{item.label}</Typography>
                    <Typography fontWeight="500" sx={{ fontSize: '14px' }}>: {item.value}</Typography>
                  </Box>
                ))}
              </Box>

              {vehicle.pricing?.type && (
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                  <Typography variant="body2" color="#666" sx={{ fontSize: '14px' }}>
                    Pricing Type:
                  </Typography>
                  <Typography fontWeight="500" color="#26a69a" sx={{ fontSize: '14px', textTransform: 'capitalize' }}>
                    {vehicle.pricing.type}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="600" mb={3} sx={{ fontSize: '16px', textAlign: 'center' }}>
                Other Features
              </Typography>
              
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  {[
                    { label: 'Air Condition', value: vehicle.airCondition ? 'Yes' : 'No' },
                    { label: 'Transmission', value: vehicle.transmissionType ? vehicle.transmissionType.charAt(0).toUpperCase() + vehicle.transmissionType.slice(1) : 'N/A' },
                    { label: 'Fuel Type', value: vehicle.fuelType ? vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1) : 'N/A' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pr: 1, alignItems: 'center' }}>
                      <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight="500" sx={{ fontSize: '12px' }}>: {item.value}</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={6}>
                  {[
                    { label: 'Engine Capacity', value: vehicle.engineCapacity ? `${vehicle.engineCapacity} cc` : 'N/A' },
                    { label: 'Seating Capacity', value: vehicle.seatingCapacity || 'N/A' },
                    { label: 'Engine Power', value: vehicle.enginePower ? `${vehicle.enginePower} hp` : 'N/A' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pl: 1, alignItems: 'center' }}>
                      <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight="500" sx={{ fontSize: '12px' }}>: {item.value}</Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                <Typography variant="body2" color="#666" sx={{ fontSize: '14px', mb: 0.5 }}>
                  Total Trips:
                </Typography>
                <Typography fontWeight="600" color="#26a69a" sx={{ fontSize: '18px' }}>
                  {vehicle.totalTrips || 0}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ✅ NEW: Confirm Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#dc2626', fontWeight: 600 }}>
          Delete Vehicle
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>"{vehicle.name}"</strong>?
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '14px' }}>
            This action cannot be undone. All vehicle data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ 
              textTransform: 'none',
              bgcolor: '#dc2626',
              '&:hover': { bgcolor: '#b91c1c' }
            }}
          >
            Delete Vehicle
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{
            backgroundColor: toastSeverity === 'success' ? '#1976d2' : '#d32f2f',
            color: 'white',
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CarListingView;