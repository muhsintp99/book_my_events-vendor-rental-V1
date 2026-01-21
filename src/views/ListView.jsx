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
  Snackbar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Stack,
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
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  EventSeat as SeatIcon,
  Settings as SettingsIcon,
  MusicNote as MusicIcon,
  Security as SecurityIcon,
  Wifi as WifiIcon,
  Bolt as BoltIcon,
  EmojiEvents as PremiumIcon,
  Description as DocumentIcon,
  AttachMoney as MoneyIcon,
  Directions as DirectionsIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

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
    transform: 'scale(1.05)'
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  border: '1px solid #dee2e6',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
  }
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  backgroundColor: status === 'active' ? '#d4edda' : status === 'available' ? '#d1ecf1' : '#f8d7da',
  color: status === 'active' ? '#155724' : status === 'available' ? '#0c5460' : '#721c24',
  border: `1px solid ${status === 'active' ? '#c3e6cb' : status === 'available' ? '#bee5eb' : '#f5c6cb'}`
}));

const NoImageBox = ({ loading }) => (
  <Box
    sx={{
      width: '100%',
      height: { xs: 240, md: 400 },
      background: loading ? 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' : '#f5f5f5',
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px',
      border: '2px dashed #ccc'
    }}
  >
    {loading ? (
      <CircularProgress size={40} sx={{ color: '#d9505d' }} />
    ) : (
      <>
        <CarIcon sx={{ fontSize: 48, opacity: 0.5 }} />
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
          No Image Available
        </Typography>
      </>
    )}
  </Box>
);

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
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [expanded, setExpanded] = useState('panel1');

  // FIXED: Proper URL construction for images
  const getImageUrl = (path) => {
    if (!path || path === 'undefined') return null;

    // If already a full URL
    if (path.startsWith('http')) return path;

    // Remove leading slash if present to avoid double slash
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // Use the correct base URL - ensure no trailing slash
    let baseUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae';

    // Remove /api suffix if present
    baseUrl = baseUrl.replace(/\/api\/?$/, '');

    // Construct final URL
    const finalUrl = `${baseUrl}/${cleanPath}`;
    console.log('Image URL constructed:', { original: path, final: finalUrl });
    return finalUrl;
  };
  const InfoRow = ({ icon, label, value }) => (
    <Grid container alignItems="center" spacing={2} sx={{ py: 1 }}>
      <Grid item xs={1}>
        {icon}
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body1" fontWeight={600}>
          {value || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  );

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

  // Prepare image list - FIXED URL construction
  const images = React.useMemo(() => {
    if (!vehicle) return [];

    const imageList = [];

    // Add featured image
    if (vehicle.featuredImage) {
      const url = getImageUrl(vehicle.featuredImage);
      if (url) imageList.push(url);
    }

    // Add gallery images
    if (vehicle.galleryImages && Array.isArray(vehicle.galleryImages)) {
      vehicle.galleryImages.forEach((img) => {
        const url = getImageUrl(img);
        if (url) imageList.push(url);
      });
    }

    console.log('Image list prepared:', imageList);
    return imageList;
  }, [vehicle]);

  useEffect(() => {
    setImageErrors(new Set());
    if (images.length > 0) {
      setActiveImage(0);
    }
  }, [images]);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching vehicle with ID:', id);
      const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const vehicleData = response.data.data || response.data;
      console.log('Vehicle data received:', vehicleData);
      setVehicle(vehicleData);
      setError('');
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load vehicle data';
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastSeverity('error');
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e, index) => {
    console.error(`Image load error for index ${index}:`, e.target.src);
    setImageErrors((prev) => new Set([...prev, index]));
    setMainImageLoading(false);
  };

  const handleImageLoad = () => {
    requestAnimationFrame(() => {
      setMainImageLoading(false);
    });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
        headers: { Authorization: `Bearer ${token}` }
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

  const renderBooleanIcon = (value) => {
    return value ? <CheckIcon sx={{ color: '#28a745', fontSize: 20 }} /> : <CloseIcon sx={{ color: '#dc3545', fontSize: 20 }} />;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)'
        }}
      >
        <CircularProgress sx={{ color: '#d9505d' }} />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          p: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
          minHeight: '100vh'
        }}
      >
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

  const hasValidMainImage = images.length > 0 && !imageErrors.has(activeImage);
  const showNoImage = images.length === 0 || imageErrors.has(activeImage);

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        p: { xs: 2, md: 3 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        minHeight: '100vh'
      }}
    >
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
      <Card sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #d9505d 0%, #ed081f 100%)',
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 12px rgba(217, 80, 93, 0.3)'
                  }}
                >
                  <CarIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    sx={{
                      color: '#2c3e50',
                      fontSize: { xs: '24px', md: '32px' }
                    }}
                  >
                    {vehicle.name || 'Vehicle Details'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    <StatusBadge
                      label={vehicle.isActive ? 'Active' : 'Inactive'}
                      status={vehicle.isActive ? 'active' : 'inactive'}
                      size="small"
                    />
                    <StatusBadge
                      label={vehicle.isAvailable ? 'Available' : 'Unavailable'}
                      status={vehicle.isAvailable ? 'available' : 'unavailable'}
                      size="small"
                    />
                    <Chip
                      label={vehicle.vehicleType || 'Standard'}
                      size="small"
                      sx={{
                        bgcolor: vehicle.vehicleType === 'luxury' ? '#fff3cd' : '#d1ecf1',
                        color: vehicle.vehicleType === 'luxury' ? '#856404' : '#0c5460',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}
                    />
                  </Stack>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="h3" fontWeight="900" color="#d9505d">
                    ₹ {vehicle.pricing?.grandTotal?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Grand Total
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
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
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Images & Basic Info */}
        <Grid item xs={12} md={8}>
          {/* Image Gallery */}
          <Card sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 240, md: 400 },
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  {showNoImage ? (
                    <NoImageBox loading={mainImageLoading} />
                  ) : (
                    <>
                      {mainImageLoading && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.9)',
                            zIndex: 1
                          }}
                        >
                          <CircularProgress size={40} sx={{ color: '#d9505d' }} />
                        </Box>
                      )}
                      <img
                        src={images[activeImage]}
                        alt={vehicle.name || 'Vehicle'}
                        onLoad={handleImageLoad}
                        onError={(e) => handleImageError(e, activeImage)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: mainImageLoading ? 0 : 1,
                          transition: 'opacity 0.3s ease'
                        }}
                        loading="eager"
                      />
                    </>
                  )}
                </Box>
              </Box>

              {/* Thumbnails */}
              {images.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 2 }}>
                  {images.map((img, index) => (
                    <ThumbnailImage
                      key={index}
                      src={img}
                      alt={`${vehicle.name} view ${index + 1}`}
                      active={activeImage === index}
                      onClick={() => {
                        setMainImageLoading(true);
                        setActiveImage(index);
                      }}
                      loading="lazy"
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Description & Details */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="700" mb={2} sx={{ color: '#2c3e50' }}>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
                {vehicle.description || 'No description available.'}
              </Typography>

              {/* Vehicle Specifications */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight="700" mb={3} sx={{ color: '#2c3e50' }}>
                  Specifications
                </Typography>
                <Grid container spacing={3}>
                  {/* Engine Specifications */}
                  <Grid item xs={12} md={6}>
                    <FeatureCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <SettingsIcon sx={{ color: '#d9505d', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="600">
                          Engine & Performance
                        </Typography>
                      </Box>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Engine Capacity</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                {vehicle.engineCharacteristics?.engineCapacityCC
                                  ? `${vehicle.engineCharacteristics.engineCapacityCC.toLocaleString()} cc`
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Power</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                {vehicle.engineCharacteristics?.powerBHP ? `${vehicle.engineCharacteristics.powerBHP} BHP` : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Torque</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>{vehicle.engineCharacteristics?.torque || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Mileage</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>{vehicle.engineCharacteristics?.mileage || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Fuel Type</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                {vehicle.engineCharacteristics?.fuelType?.toUpperCase() || 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Transmission</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                {vehicle.engineCharacteristics?.transmissionType?.value?.toUpperCase() || 'N/A'}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </FeatureCard>
                  </Grid>

                  {/* Capacity & Comfort - UPDATED */}
                  <Grid item xs={12} md={6}>
                    <FeatureCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <SeatIcon sx={{ color: '#28a745', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="600">
                          Capacity & Comfort
                        </Typography>
                      </Box>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Seating Capacity</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>{vehicle.capacityAndComfort?.seatingCapacity || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Legroom Type</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1 }}>{vehicle.capacityAndComfort?.legroomType || 'Standard'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Pushback Seats</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1, textAlign: 'center' }}>
                                {vehicle.capacityAndComfort?.pushbackSeats ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Recliner Seats</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1, textAlign: 'center' }}>
                                {vehicle.capacityAndComfort?.reclinerSeats ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Air Conditioning</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1, textAlign: 'center' }}>
                                {vehicle.engineCharacteristics?.airConditioning ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 'none', py: 1 }}>
                                <strong>Driver Included</strong>
                              </TableCell>
                              <TableCell sx={{ border: 'none', py: 1, textAlign: 'center' }}>
                                {vehicle.availability?.driverIncluded ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </FeatureCard>
                  </Grid>
                </Grid>
              </Box>

              {/* Features Accordion */}
              <Box sx={{ mt: 4 }}>
                <Accordion
                  expanded={expanded === 'panel1'}
                  onChange={handleAccordionChange('panel1')}
                  sx={{ borderRadius: '12px !important', mb: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PremiumIcon sx={{ color: '#ffc107' }} />
                      <Typography variant="h6" fontWeight="600">
                        Features & Amenities
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      {/* Interior Comfort */}
                      <Grid item xs={12} md={6}>
                        <FeatureCard>
                          <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ color: '#495057' }}>
                            Interior Comfort
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.interiorComfort?.leatherSeats ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Leather Seats" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.interiorComfort?.adjustableSeats ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Adjustable Seats" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.interiorComfort?.armrest ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Armrest" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.availability?.sunroof ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Sunroof" />
                            </ListItem>
                          </List>
                        </FeatureCard>
                      </Grid>

                      {/* Entertainment */}
                      <Grid item xs={12} md={6}>
                        <FeatureCard>
                          <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ color: '#495057' }}>
                            Entertainment
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.entertainment?.musicSystem ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Music System" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.entertainment?.bluetooth ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Bluetooth" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.entertainment?.usbAux ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="USB/AUX" />
                            </ListItem>
                          </List>
                        </FeatureCard>
                      </Grid>

                      {/* Safety Features */}
                      <Grid item xs={12} md={6}>
                        <FeatureCard>
                          <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ color: '#495057' }}>
                            Safety Features
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.safety?.airbags ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Airbags" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.safety?.abs ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="ABS" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.safety?.rearCamera ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Rear Camera" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.features?.safety?.parkingSensors ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Parking Sensors" />
                            </ListItem>
                          </List>
                        </FeatureCard>
                      </Grid>

                      {/* Extra Addons */}
                      <Grid item xs={12} md={6}>
                        <FeatureCard>
                          <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ color: '#495057' }}>
                            Extra Addons
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.extraAddons?.wifi ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="WiFi" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.extraAddons?.chargingPorts ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Charging Ports" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.extraAddons?.interiorLighting ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Interior Lighting" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                {vehicle.extraAddons?.powerLuggage ? (
                                  <CheckCircleIcon sx={{ color: '#28a745' }} />
                                ) : (
                                  <CancelIcon sx={{ color: '#dc3545' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText primary="Power Luggage" />
                            </ListItem>
                          </List>
                        </FeatureCard>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ROW TYPE INFO SECTIONS */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Vehicle Information */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Vehicle Information
                  </Typography>

                  <InfoRow icon={<CarIcon />} label="Brand" value={vehicle.brand?.title} />
                  <Divider />
                  <InfoRow icon={<SettingsIcon />} label="Model" value={vehicle.model} />
                  <Divider />
                  <InfoRow icon={<BadgeIcon />} label="License Plate" value={vehicle.licensePlateNumber} />
                  <Divider />
                  <InfoRow icon={<EventIcon />} label="Category" value={vehicle.category?.title} />
                  <Divider />
                  <InfoRow icon={<LocationIcon />} label="Zone" value={vehicle.zone?.name} />

                  <Box sx={{ mt: 2, bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
                    <Grid container>
                      <Grid item xs={6} textAlign="center">
                        <Typography fontWeight={700}>{vehicle.totalTrips || 0}</Typography>
                        <Typography variant="caption">Trips</Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="center">
                        <Typography fontWeight={700}>{vehicle.rating || 0}</Typography>
                        <Typography variant="caption">Rating</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Location Details */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Location Details →
                  </Typography>

                  <InfoRow icon={<LocationIcon color="error" />} label="Address" value={vehicle.location?.address} />
                  <Divider />
                  <InfoRow
                    icon={<DirectionsIcon color="primary" />}
                    label="Coordinates"
                    value={`Lat: ${vehicle.location?.latitude}, Lng: ${vehicle.location?.longitude}`}
                  />
                  <Divider />
                  <InfoRow
                    icon={<DirectionsIcon color="primary" />}
                    label="Zone Coverage"
                    value={`${vehicle.zone?.city}, ${vehicle.zone?.country}`}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Provider Information */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Provider Information
                  </Typography>

                  <InfoRow icon={<PersonIcon />} label="Vendor ID" value={vehicle.provider?.userId} />
                  <Divider />
                  <InfoRow icon={<PhoneIcon />} label="Phone" value={vehicle.provider?.phone} />
                  <Divider />
                  <InfoRow
                    icon={<EmailIcon />}
                    label="Status"
                    value={
                      <Chip
                        label={vehicle.provider?.isVerified ? 'Verified' : 'Unverified'}
                        size="small"
                        color={vehicle.provider?.isVerified ? 'success' : 'warning'}
                      />
                    }
                  />
                  <Divider />
                  <InfoRow
                    icon={<BadgeIcon />}
                    label="Last Login"
                    value={vehicle.provider?.lastLogin ? new Date(vehicle.provider.lastLogin).toLocaleDateString() : 'N/A'}
                  />
                </CardContent>
              </Card>
            </Grid>
            {/* Advance Pricing */}
<Grid item xs={12} md={3}>
  <Card
    sx={{
      borderRadius: 3,
      height: '100%',
      bgcolor: '#fff7e6',
      border: '1px solid #ffc107'
    }}
  >
    <CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Advance Pricing
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: '#fff3cd'
        }}
      >
        <CurrencyRupeeIcon sx={{ fontSize: 40, color: '#856404' }} />

        <Box>
          <Typography variant="body2" color="text.secondary">
            Advance Booking Amount
          </Typography>
          <Typography variant="h4" fontWeight={800} color="#856404">
            ₹ {Number(vehicle.advanceBookingAmount || 0).toLocaleString('en-IN')}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
</Grid>

          </Grid>
        </Grid>
      </Grid>

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
        <DialogTitle
          sx={{
            color: '#dc3545',
            fontWeight: 700,
            fontSize: '20px'
          }}
        >
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
