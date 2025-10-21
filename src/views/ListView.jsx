import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
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
  ArrowBack as ArrowBackIcon,
  LocalOffer as TagIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  AcUnit as AcIcon,
  LocalGasStation as FuelIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { px } from 'framer-motion';

const ThumbnailImage = styled('img')(({ theme, active }) => ({
  width: 80,
  height: 60,
  objectFit: 'cover',
  borderRadius: 8,
  cursor: 'pointer',
  border: active ? '3px solid #d9505d' : '2px solid #e0e0e0',
  opacity: active ? 1 : 0.6,
  transition: 'all 0.3s ease',
  '&:hover': {
    opacity: 1,
    transform: 'scale(1.05)',
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: 16,
  padding: '24px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  height: '100%',
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

const CarListingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae/api';
  
  const [activeImage, setActiveImage] = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
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
      setOpenDeleteDialog(false);
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)'
      }}>
        <CircularProgress sx={{ color: '#d9505d' }} />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        p: 3, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        minHeight: '100vh' 
      }}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ 
              mb: 2,
              color: '#666',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
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
      p: { xs: 2, md: 3 }, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      minHeight: '100vh' 
    }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ 
            color: '#666',
            fontSize: '14px',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          Back to Vehicles
        </Button>
      </Box>

      {/* Header Section */}
      <Box sx={{ 
        background: '#ffffff',
        borderRadius: 3,
        p: 3,
        mb: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #d9505d 0%, #ed081f 100%)',
            width: 56, 
            height: 56,
            boxShadow: '0 4px 12px rgba(217, 80, 93, 0.3)'
          }}>
            <CarIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="700" sx={{ 
              color: '#2c3e50',
              fontSize: { xs: '22px', md: '28px' }
            }}>
              {vehicle.name || 'Vehicle Details'}
            </Typography>
            {vehicle.discount && (
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                px: 2,
                py: 0.5,
                bgcolor: '#d4edda',
                borderRadius: 2,
                border: '1px solid #c3e6cb'
              }}>
                <TagIcon sx={{ fontSize: 14, color: '#155724' }} />
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#155724' }}>
                  {vehicle.discount}% OFF
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={confirmDelete}  
            sx={{
              color: '#dc3545',
              borderColor: '#dc3545',
              bgcolor: '#fff5f5',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              py: 1,
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#fee',
                borderColor: '#ff0019ff'
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
              background: 'linear-gradient(135deg, #E15B65 0%, #e98e8eff 100%)',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              py: 1,
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(217, 80, 93, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f68b96ff 0%, #c52131ff 100%)',
                boxShadow: '0 6px 16px rgba(217, 80, 93, 0.4)'
              }
            }}
          >
            Edit Vehicle
          </Button>
        </Box>
      </Box>

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        bgcolor: '#ffffff',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Image Gallery Section */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box>
                <Box
                  component="img"
                  src={images[activeImage]}
                  alt={vehicle.name || 'Vehicle'}
                  sx={{
                    width: '100%',
                    height: { xs: 240, md: 300 },
                    objectFit: 'cover',
                    borderRadius: 3,
                    mb: 2,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
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
              <Typography variant="h4" fontWeight="700" mb={2} sx={{ 
                color: '#2c3e50',
                fontSize: { xs: '24px', md: '32px' }
              }}>
                {vehicle.name || 'Vehicle Name'}
              </Typography>
              
              <Box sx={{ 
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                p: 2.5,
                mb: 3,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="subtitle1" color="#495057" mb={1} fontWeight="600" sx={{ 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <EventIcon sx={{ fontSize: 18 }} />
                  Description
                </Typography>
                
                <Typography variant="body1" color="#6c757d" lineHeight={1.7} sx={{ fontSize: '14px' }}>
                  {vehicle.description || 'No description available.'}
                </Typography>
              </Box>

              {vehicle.searchTags && vehicle.searchTags.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" color="#495057" mb={1.5} fontWeight="600" sx={{ 
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <TagIcon sx={{ fontSize: 18 }} />
                    Search Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {vehicle.searchTags.map((tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 2.5,
                          py: 0.8,
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          color: '#1565c0',
                          borderRadius: 2,
                          fontSize: '13px',
                          fontWeight: 600,
                          border: '1px solid #90caf9'
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

          <Box sx={{ my: 5, height: '1px', bgcolor: '#e9ecef' }} />

          {/* Three Column Info Section */}
          <Grid container spacing={3}>
            {/* General Info */}
            <Grid item xs={12} md={4} width={335}>
              <InfoCard>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #fee 0%, #fcc 100%)',
                    mb: 2
                  }}>
                    <CarIcon sx={{ fontSize: 32, color: '#dc3545' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ 
                    fontSize: '18px',
                    color: '#2c3e50'
                  }}>
                    General Info
                  </Typography>
                </Box>
                
                <Box>
                  {[
                    { label: 'Brand', value: vehicle.brand?.title || 'N/A' },
                    { label: 'Model', value: vehicle.model || 'N/A' },
                    { label: 'Category', value: vehicle.category?.title || 'N/A' },
                    { label: 'Type', value: vehicle.type || 'N/A' },
                    { label: 'License Plate', value: vehicle.licensePlateNumber || 'N/A' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 2,
                      pb: 2,
                      borderBottom: index !== 4 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <Typography color="#6c757d" fontWeight="500" sx={{ fontSize: '14px' }}>
                        {item.label}
                      </Typography>
                      <Typography fontWeight="600" sx={{ fontSize: '14px', color: '#2c3e50' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ 
                  mt: 3, 
                  pt: 3, 
                  borderTop: '2px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 20, color: '#6c757d' }} />
                    <Typography variant="subtitle2" fontWeight="600" color="#495057" sx={{ fontSize: '15px' }}>
                      Zone
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="600" sx={{ 
                    fontSize: '14px',
                    color: '#d9505d'
                  }}>
                    {vehicle.zone?.name || 'N/A'}
                  </Typography>
                </Box>
              </InfoCard>
            </Grid>

            {/* Fare & Discounts */}
            <Grid item xs={12} md={4} width={335}>
              <InfoCard>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                    mb: 2
                  }}>
                    <TagIcon sx={{ fontSize: 32, color: '#28a745' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ 
                    fontSize: '18px',
                    color: '#2c3e50'
                  }}>
                    Fare & Discounts
                  </Typography>
                </Box>
                
                <Box>
                  {[
                    { label: 'Hourly', value: vehicle.pricing?.hourly ? `₹ ${vehicle.pricing.hourly}` : 'N/A' },
                    { label: 'Per Day', value: vehicle.pricing?.perDay ? `₹ ${vehicle.pricing.perDay}` : 'N/A' },
                    { label: 'Distance', value: vehicle.pricing?.distanceWise ? `₹ ${vehicle.pricing.distanceWise}/km` : 'N/A' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Typography color="#6c757d" fontWeight="500" sx={{ fontSize: '14px' }}>
                        {item.label}
                      </Typography>
                      <Typography fontWeight="600" sx={{ fontSize: '14px', color: '#2c3e50' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                  border: '2px solid #28a745',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography fontWeight="700" sx={{ fontSize: '16px', color: '#155724' }}>
                    Discount
                  </Typography>
                  <Typography fontWeight="900" sx={{ fontSize: '28px', color: '#28a745' }}>
                    {vehicle.discount ? `${vehicle.discount}%` : 'N/A'}
                  </Typography>
                </Box>

                {vehicle.pricing?.type && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: '2px solid #f0f0f0' }}>
                    <Typography variant="body2" color="#6c757d" sx={{ fontSize: '13px', mb: 0.5 }}>
                      Pricing Type
                    </Typography>
                    <Typography fontWeight="600" sx={{ 
                      fontSize: '14px',
                      color: '#d9505d',
                      textTransform: 'capitalize'
                    }}>
                      {vehicle.pricing.type}
                    </Typography>
                  </Box>
                )}
              </InfoCard>
            </Grid>

            {/* Other Features */}
            <Grid item xs={12} md={4} width={340}>
              <InfoCard>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #cfe2ff 0%, #9ec5fe 100%)',
                    mb: 2
                  }}>
                    <SpeedIcon sx={{ fontSize: 32, color: '#0d6efd' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ 
                    fontSize: '18px',
                    color: '#2c3e50'
                  }}>
                    Features
                  </Typography>
                </Box>
                
                <Box>
                  {[
                    { 
                      icon: <AcIcon sx={{ fontSize: 18 }} />,
                      label: 'Air Condition', 
                      value: vehicle.airCondition ? 'Yes' : 'No',
                      color: vehicle.airCondition ? '#28a745' : '#6c757d'
                    },
                    { 
                      icon: <SpeedIcon sx={{ fontSize: 18 }} />,
                      label: 'Engine Capacity', 
                      value: vehicle.engineCapacity ? `${vehicle.engineCapacity} cc` : 'N/A',
                      color: '#0d6efd'
                    },
                    { 
                      icon: <SpeedIcon sx={{ fontSize: 18 }} />,
                      label: 'Transmission', 
                      value: vehicle.transmissionType ? vehicle.transmissionType.charAt(0).toUpperCase() + vehicle.transmissionType.slice(1) : 'N/A',
                      color: '#6f42c1'
                    },
                    { 
                      icon: <PersonIcon sx={{ fontSize: 18 }} />,
                      label: 'Seating Capacity', 
                      value: vehicle.seatingCapacity || 'N/A',
                      color: '#fd7e14'
                    },
                    { 
                      icon: <FuelIcon sx={{ fontSize: 18 }} />,
                      label: 'Fuel Type', 
                      value: vehicle.fuelType ? vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1) : 'N/A',
                      color: '#ffc107'
                    },
                    { 
                      icon: <SpeedIcon sx={{ fontSize: 18 }} />,
                      label: 'Engine Power', 
                      value: vehicle.enginePower ? `${vehicle.enginePower} hp` : 'N/A',
                      color: '#dc3545'
                    }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between', 
                      mb: 2,
                      pb: 2,
                      borderBottom: index !== 5 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: item.color }}>
                          {item.icon}
                        </Box>
                        <Typography color="#6c757d" fontWeight="500" sx={{ fontSize: '13px' }}>
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography fontWeight="600" sx={{ fontSize: '13px', color: item.color }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </InfoCard>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          color: '#dc3545', 
          fontWeight: 700,
          fontSize: '20px'
        }}>
          Delete Vehicle
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontSize: '15px' }}>
            Are you sure you want to delete <strong>"{vehicle.name}"</strong>?
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '14px' }}>
            This action cannot be undone. All vehicle data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              bgcolor: '#dc3545',
              '&:hover': { bgcolor: '#b02a37' }
            }}
          >
            Delete Vehicle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
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
            backgroundColor: toastSeverity === 'success' ? '#28a745' : '#dc3545',
            color: 'white',
            fontWeight: 500,
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CarListingView;