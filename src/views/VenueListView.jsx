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
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  EventSeat as EventSeatIcon,
  Group as GroupIcon,
  Restaurant as RestaurantIcon,
  LocalParking as ParkingIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  Lightbulb as LightIcon,
  Accessibility as AccessibilityIcon,
  Security as SecurityIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as OfferIcon,
  Tag as TagIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ThumbnailImage = styled('img')(({ theme, active }) => ({
  width: 80,
  height: 60,
  objectFit: 'cover',
  borderRadius: 8,
  cursor: 'pointer',
  border: active ? '3px solid #E15B65' : '2px solid #e0e0e0',
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

const NoImageBox = ({ loading }) => (
  <Box
    sx={{
      width: '100%',
      height: { xs: 240, md: 300 },
      background: loading ? 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' : '#f5f5f5',
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: '#999',
      fontSize: '14px',
      border: '2px dashed #ccc'
    }}
  >
    {loading ? (
      <CircularProgress size={40} sx={{ color: '#E15B65' }} />
    ) : (
      <>
        <BusinessIcon sx={{ fontSize: 48, opacity: 0.5 }} />
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
          No Image Available
        </Typography>
      </>
    )}
  </Box>
);

const VenueListingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = 'https://api.bookmyevent.ae/api';
  const USE_HTTPS = true;  

  const BASE_URL = 'https://api.bookmyevent.ae' ;
  const PACKAGE_BASE_URL = BASE_URL;

  const [activeImage, setActiveImage] = useState(0);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  const getImageUrl = (path) => {
    if (!path) return '';
    const filename = path.split('/').pop();
    return `${BASE_URL}/uploads/venues/${filename}`;
  };
  const getPackageImageUrl = (path) => {
    if (!path) return '/placeholder.jpg';
    const filename = path.split('/').pop();
    return `${PACKAGE_BASE_URL}/uploads/packages/${filename}`;
  };

  useEffect(() => {
    if (location.state?.venue) {
      const venueData = location.state.venue;
      setVenue(venueData);
      setLoading(false);
    } else if (id && id !== 'undefined') {
      fetchVenue();
    } else {
      setError('No venue ID provided');
      setLoading(false);
    }
  }, [id, location.state]);

  let imageList = [];
  if (venue) {
    if (venue.thumbnail) {
      imageList.push(getImageUrl(venue.thumbnail));
    }
    const imagesArray = Array.isArray(venue.images) ? venue.images : [];
    if (imagesArray.length > 0) {
      imageList = [...imageList, ...imagesArray.map(getImageUrl)];
    }
  }
  const images = imageList.filter(url => url);

  useEffect(() => {
    setMainImageLoading(true);
    setImageErrors(new Set());
    if (images.length > 0) {
      setActiveImage(0);}
  }, [venue, images.length]);

  const fetchVenue = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get(`${API_BASE_URL}/venues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const venueData = response.data.data || response.data;
      setVenue(venueData);
      console.log('Full venue data:', venueData);
      console.log('Packages:', venueData.packages);
      if (venueData.packages) {
        venueData.packages.forEach((pkg, i) => console.log(`Package ${i}:`, pkg.title, 'Thumbnail:', pkg.thumbnail));
      }
      console.log('Images:', venueData.images, venueData.thumbnail);
      console.log('Generated image URLs:', images);  // Log generated URLs
      setError('');
    } catch (error) {
      console.error('Error fetching venue:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load venue data';
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastSeverity('error');
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (index, url) => {
    console.error(`Image failed at index ${index}: ${url}`);
    setImageErrors(prev => new Set([...prev, index]));
    setMainImageLoading(false);
  };

  const confirmDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!venue?._id) {
      setToastMessage('Venue ID not found');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/venues/${venue._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToastMessage('Venue deleted successfully');
      setToastSeverity('success');
      setOpenToast(true);
      setTimeout(() => navigate('/venue-setup/lists'), 1500);
    } catch (error) {
      console.error('Error deleting venue:', error);
      setToastMessage(error.response?.data?.message || 'Failed to delete venue');
      setToastSeverity('error');
      setOpenToast(true);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleEdit = () => {
    if (!venue?._id) {
      setToastMessage('Venue ID not found');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    navigate(`/venue-setup/new/${venue._id}`, { state: { venue } });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
  };

  const handleBack = () => {
    navigate('/venue-setup/lists');
  };

  const getDiscount = () => {
    if (!venue?.discount) return { package: 'N/A', nonAc: 'N/A' };
    try {
      const discountObj = typeof venue.discount === 'string'
        ? JSON.parse(venue.discount)
        : venue.discount;
      return {
        package: discountObj.packageDiscount ? `${discountObj.packageDiscount}%` : 'N/A',
        nonAc: discountObj.nonAc ? `₹${discountObj.nonAc}` : 'N/A'
      };
    } catch (e) {
      return { package: venue.discount.toString(), nonAc: 'N/A' };
    }
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
        <CircularProgress sx={{ color: '#E15B65' }} />
      </Box> );
  }

  if (error || !venue) {
    return (
      <Box sx={{
        maxWidth: 1400,
        mx: 'auto',
        p: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        minHeight: '100vh' }}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              mb: 2,
              color: '#666',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
            Back to Venues
          </Button>
        </Box>
        <Alert severity="error">
          {error || 'Venue not found'}
          <br />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Venue ID: {id || 'Not provided'}
          </Typography>
        </Alert>
      </Box>); }
  const hasValidMainImage = images.length > 0 && !imageErrors.has(activeImage);
  const showNoImage = images.length === 0 || imageErrors.has(activeImage);
  const discount = getDiscount();

  return (
    <Box sx={{
      width: '100%',
      mx: 'auto',
      p: { xs: 2, md: 3 },
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: '#666',
            fontSize: '14px',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}>
          Back to Venues
        </Button>
      </Box>
      <Box sx={{
        background: '#ffffff', borderRadius: 3,
        p: 3, mb: 3,display: 'flex',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 2  }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            background: 'linear-gradient(135deg, #E15B65 0%, #ed081f 100%)',
            width: 56,height: 56,
            boxShadow: '0 4px 12px rgba(225, 91, 101, 0.3)' }}>
            <BusinessIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="700" sx={{
              color: '#2c3e50',
              fontSize: { xs: '22px', md: '28px' }}}>
              {venue.venueName || 'Venue Details'}
            </Typography>
            {discount.package !== 'N/A' && (
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center', gap: 0.5, mt: 0.5,
                px: 2,py: 0.5,bgcolor: '#d4edda',
                borderRadius: 2,border: '1px solid #c3e6cb' }}>
                <OfferIcon sx={{ fontSize: 14, color: '#155724' }} />
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#155724' }}>
                  {discount.package} OFF
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
              color: '#dc3545', borderColor: '#dc3545',
              bgcolor: '#fff5f5', textTransform: 'none',
              fontSize: '14px', px: 3, py: 1, fontWeight: 500, borderRadius: 2,
              '&:hover': {
                bgcolor: '#fee', borderColor: '#ff0019ff'
              }  }}>
            Delete
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              background: 'linear-gradient(135deg, #E15B65 0%, #e98e8eff 100%)',
              textTransform: 'none', fontSize: '14px', px: 3, py: 1, fontWeight: 500,
              borderRadius: 2, boxShadow: '0 4px 12px rgba(225, 91, 101, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f68b96ff 0%, #c52131ff 100%)',
                boxShadow: '0 6px 16px rgba(225, 91, 101, 0.4)'
              } }}>
            Edit Venue
          </Button>
        </Box>
      </Box>
      <Card sx={{
        borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        bgcolor: '#ffffff', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{
                  width: '100%', height: { xs: 240, md: 300 },
                  borderRadius: 3,  mb: 2,boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                  {showNoImage ? (
                    <NoImageBox loading={mainImageLoading} />
                  ) : (
                    <>
                      {mainImageLoading && (
                        <Box sx={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.8)',  zIndex: 1  }}>
                          <CircularProgress size={40} sx={{ color: '#E15B65' }} />
                        </Box>
                      )}
                      <img
                        src={images[activeImage]}
                        alt={venue.venueName || 'Venue'}
                        onLoad={() => setMainImageLoading(false)}
                        onError={(e) => {
                          handleImageError(activeImage, e.target.src);
                          setMainImageLoading(false); }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: mainImageLoading ? 'none' : 'block'  }}
                        loading="lazy"/>
                    </>
                  )}
                </Box>
                {images.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {images.map((img, index) => (
                      <ThumbnailImage
                        key={index}
                        src={img}
                        alt={`${venue.venueName} view ${index + 1}`}
                        active={activeImage === index}
                        onClick={() => setActiveImage(index)}
                        onError={(e) => handleImageError(index, e.target.src)}
                        loading="lazy"/>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight="700" mb={2} sx={{color: '#2c3e50',fontSize: { xs: '24px', md: '32px' } }}>
                {venue.venueName || 'Venue Name'}
              </Typography>
              <Box sx={{ bgcolor: '#f8f9fa',  borderRadius: 2, p: 2.5,  mb: 3,  border: '1px solid #e9ecef'  }}>
                <Typography variant="subtitle1" color="#495057" mb={1} fontWeight="600" sx={{fontSize: '15px', display: 'flex', alignItems: 'center', gap: 1}}>
                  <BusinessIcon sx={{ fontSize: 18 }} /> Description
                </Typography>
                <Typography variant="body1" color="#6c757d" lineHeight={1.7} sx={{ fontSize: '14px' }}>
                  {venue.shortDescription || venue.description || 'No description available.'}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 2, p: 2.5,  mb: 3, border: '1px solid #e9ecef' }}>
                <Typography variant="subtitle1" color="#495057" mb={1} fontWeight="600" sx={{fontSize: '15px', display: 'flex',alignItems: 'center',  gap: 1}}>
                  <LocationIcon sx={{ fontSize: 18 }} />
                  Address
                </Typography>
                <Typography variant="body1" color="#6c757d" lineHeight={1.7} sx={{ fontSize: '14px' }}>
                  {venue.venueAddress || 'No address available.'}
                </Typography>
              </Box>
              {venue.searchTags && venue.searchTags.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" color="#495057" mb={1.5} fontWeight="600" sx={{ fontSize: '15px',  display: 'flex', alignItems: 'center',   gap: 1 }}>
                    <TagIcon sx={{ fontSize: 18 }} />
                    Search Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {venue.searchTags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', color: '#1565c0', fontWeight: 600, border: '1px solid #90caf9' }} />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
          <Box sx={{ my: 5, height: '1px', bgcolor: '#e9ecef' }} />
          {/* Three Column Info Section */}
          <Grid container spacing={3}>
            {/* Venue Info */}
            <Grid item xs={12} md={4}>
              <InfoCard>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Box sx={{p: 2,  borderRadius: 3,background: 'linear-gradient(135deg, #fee 0%, #fcc 100%)',  mb: 2}}>
                    <BusinessIcon sx={{ fontSize: 32, color: '#E15B65' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{  fontSize: '18px',  color: '#2c3e50' }}>
                    Venue Info
                  </Typography>
                </Box>
                <Box>
                  {[
                    { label: 'Category', value: venue.categories?.[0]?.title || venue.categories?.title || 'N/A' },
                    { label: 'Seating Type', value: venue.seatingArrangement || 'N/A' },
                    { label: 'Max Seated', value: venue.maxGuestsSeated || 'N/A' },
                    { label: 'Max Standing', value: venue.maxGuestsStanding || 'N/A' },
                    { label: 'Opening Hours', value: venue.openingHours || 'N/A' },
                    { label: 'Closing Hours', value: venue.closingHours || 'N/A' }
                  ].map((item, index) => (
                    <Box key={index} sx={{display: 'flex',  justifyContent: 'space-between',mb: 2, pb: 2,  borderBottom: index !== 5 ? '1px solid #f0f0f0' : 'none'}}>
                      <Typography color="#6c757d" fontWeight="500" sx={{ fontSize: '14px' }}>
                        {item.label}
                      </Typography>
                      <Typography fontWeight="600" sx={{ fontSize: '14px', color: '#2c3e50' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </InfoCard>
            </Grid>
            {/* Pricing & Discounts */}
            <Grid item xs={12} md={4}>
              <InfoCard>
                <Box sx={{display: 'flex', flexDirection: 'column',alignItems: 'center',mb: 3 }}>
                  <Box sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)', mb: 2}}>
                    <MoneyIcon sx={{ fontSize: 32, color: '#28a745' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{fontSize: '18px',color: '#2c3e50'}}>
                    Pricing & Discounts
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2,pb: 2, borderBottom: '1px solid #f0f0f0' }} />
                  <Box sx={{  display: 'flex',justifyContent: 'space-between',  mb: 2,pb: 2,borderBottom: '1px solid #f0f0f0' }}>
                    <Typography color="#6c757d" fontWeight="500" sx={{ fontSize: '14px' }}>
                      Advance Deposit
                    </Typography>
                    <Typography fontWeight="600" sx={{ fontSize: '14px', color: '#2c3e50' }}>
                      {venue.advanceDeposit ? `${venue.advanceDeposit}%` : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{mt: 3, p: 2.5, borderRadius: 2, background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',border: '2px solid #28a745', mb: 2 }}>
                  <Typography fontWeight="600" sx={{ fontSize: '14px', color: '#155724', mb: 1 }}>
                    Package Discount
                  </Typography>
                  <Typography fontWeight="900" sx={{ fontSize: '24px', color: '#28a745' }}>
                    {discount.package}
                  </Typography>
                </Box>
                {discount.nonAc !== 'N/A' && (
                  <Box sx={{p: 2.5,borderRadius: 2,background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',border: '2px solid #ffc107' }}>
                    <Typography fontWeight="600" sx={{ fontSize: '14px', color: '#856404', mb: 1 }}>
                      Non-AC Discount
                    </Typography>
                    <Typography fontWeight="900" sx={{ fontSize: '24px', color: '#ffc107' }}>
                      {discount.nonAc}
                    </Typography>
                  </Box>
                )}
              </InfoCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoCard>
                <Box sx={{display: 'flex',flexDirection: 'column',alignItems: 'center',mb: 3}}>
                  <Box sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #cfe2ff 0%, #9ec5fe 100%)',  mb: 2 }}>
                    <LightIcon sx={{ fontSize: 32, color: '#0d6efd' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ fontSize: '18px', color: '#2c3e50' }}>
                    Facilities
                  </Typography>
                </Box>
                <Box>
                  {[
                    {
                      icon: <ParkingIcon sx={{ fontSize: 18 }} />,
                      label: 'Parking',
                      value: venue.parkingAvailability ? 'Available' : 'Not Available',
                      color: venue.parkingAvailability ? '#28a745' : '#6c757d'
                    },
                    {
                      icon: <RestaurantIcon sx={{ fontSize: 18 }} />,
                      label: 'Food & Catering',
                      value: venue.foodCateringAvailability ? 'Available' : 'Not Available',
                      color: venue.foodCateringAvailability ? '#28a745' : '#6c757d'
                    },
                    {
                      icon: <LightIcon sx={{ fontSize: 18 }} />,
                      label: 'Stage/Light/Audio',
                      value: venue.stageLightingAudio ? 'Available' : 'Not Available',
                      color: venue.stageLightingAudio ? '#28a745' : '#6c757d'
                    },
                    {
                      icon: <AcIcon sx={{ fontSize: 18 }} />,
                      label: 'AC Available',
                      value: venue.acAvailable ? venue.acType || 'Yes' : 'No',
                      color: venue.acAvailable ? '#0d6efd' : '#6c757d'
                    },
                    {
                      icon: <WifiIcon sx={{ fontSize: 18 }} />,
                      label: 'WiFi',
                      value: venue.wifiAvailability ? 'Available' : 'Not Available',
                      color: venue.wifiAvailability ? '#28a745' : '#6c757d'
                    },
                    {
                      icon: <SecurityIcon sx={{ fontSize: 18 }} />,
                      label: 'Security',
                      value: venue.securityArrangements ? 'Available' : 'Not Available',
                      color: venue.securityArrangements ? '#28a745' : '#6c757d'
                    },
                    {
                      icon: <AccessibilityIcon sx={{ fontSize: 18 }} />,
                      label: 'Wheelchair Access',
                      value: venue.wheelchairAccessibility ? 'Available' : 'Not Available',
                      color: venue.wheelchairAccessibility ? '#28a745' : '#6c757d'
                    }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: index !== 6 ? '1px solid #f0f0f0' : 'none' }}>
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
          {(venue.cancellationPolicy || venue.extraCharges || venue.nearbyTransport) && (
            <>
              <Box sx={{ my: 5, height: '1px', bgcolor: '#e9ecef' }} />
              <Grid container spacing={3}>
                {venue.cancellationPolicy && (
                  <Grid item xs={12} md={4}>
                    <InfoCard>
                      <Typography variant="h6" fontWeight="700" mb={2} sx={{ fontSize: '16px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 20, color: '#E15B65' }} />
                        Cancellation Policy
                      </Typography>
                      <Typography variant="body2" color="#6c757d" lineHeight={1.7} sx={{ fontSize: '14px' }}>
                        {venue.cancellationPolicy}
                      </Typography>
                    </InfoCard>
                  </Grid>
                )}
                {venue.extraCharges && (
                  <Grid item xs={12} md={4}>
                    <InfoCard>
                      <Typography variant="h6" fontWeight="700" mb={2} sx={{ fontSize: '16px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon sx={{ fontSize: 20, color: '#E15B65' }} />
                        Extra Charges
                      </Typography>
                      <Typography variant="body2" color="#6c757d" lineHeight={1.7} sx={{ fontSize: '14px' }}>
                        {venue.extraCharges}
                      </Typography>
                    </InfoCard>
                  </Grid>
                )}
                {venue.nearbyTransport && (
                  <Grid item xs={12} md={4}>
                    <InfoCard>
                      <Typography variant="h6" fontWeight="700" mb={2} sx={{ fontSize: '16px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1}}>
                        <LocationIcon sx={{ fontSize: 20, color: '#E15B65' }} />
                        Nearby Transport
                      </Typography>
                      <Typography variant="body2" color="#6c757d" lineHeight={1.7} sx={{ fontSize: '14px' }}>
                        {venue.nearbyTransport}
                      </Typography>
                    </InfoCard>
                  </Grid>
                )}
              </Grid>
            </>
          )}
          {venue.pricingSchedule && Object.keys(venue.pricingSchedule).length > 0 && (
            <>
              <Box sx={{ my: 5, height: '1px', bgcolor: '#e9ecef' }} />
              <Box>
                <Typography variant="h5" fontWeight="700" mb={3} sx={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon sx={{ fontSize: 24, color: '#E15B65' }} />
                  Pricing Schedule
                </Typography>
                <Box sx={{ border: '1px solid #e9ecef', borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr 1fr',
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #e9ecef'
                  }}>
                    <Box sx={{ p: 2, borderRight: '1px solid #e9ecef', fontWeight: 600 }}>Day</Box>
                    <Box sx={{ p: 2, borderRight: '1px solid #e9ecef', fontWeight: 600 }}>Time Slot</Box>
                    <Box sx={{ p: 2, fontWeight: 600 }}>Price</Box>
                  </Box>
                  {Object.entries(venue.pricingSchedule).map(([day, slots]) => {
                    const hasMorning = slots.morning && (slots.morning.perDay || slots.morning.perHour || slots.morning.perPerson);
                    const hasEvening = slots.evening && (slots.evening.perDay || slots.evening.perHour || slots.evening.perPerson);
                    if (!hasMorning && !hasEvening) return null;
                    return (
                      <React.Fragment key={day}>
                        {hasMorning && (
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '150px 1fr 1fr',
                            borderBottom: '1px solid #e9ecef'
                          }}>
                            <Box sx={{ p: 2, borderRight: '1px solid #e9ecef', textTransform: 'capitalize', fontWeight: 500 }}>
                              {day}
                            </Box>
                            <Box sx={{ p: 2, borderRight: '1px solid #e9ecef' }}>
                              <Typography variant="body2" fontWeight="600" mb={0.5}>Morning</Typography>
                              <Typography variant="body2" color="#6c757d" sx={{ fontSize: '13px' }}>
                                {slots.morning.startTime} {slots.morning.startAmpm} - {slots.morning.endTime} {slots.morning.endAmpm}
                              </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                              <Typography variant="body1" fontWeight="600" color="#E15B65">
                                ₹{slots.morning.perDay || slots.morning.perHour || slots.morning.perPerson}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        {hasEvening && (
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '150px 1fr 1fr',
                            borderBottom: '1px solid #e9ecef'
                          }}>
                            <Box sx={{ p: 2, borderRight: '1px solid #e9ecef', textTransform: 'capitalize', fontWeight: 500 }}>
                              {!hasMorning ? day : ''}
                            </Box>
                            <Box sx={{ p: 2, borderRight: '1px solid #e9ecef' }}>
                              <Typography variant="body2" fontWeight="600" mb={0.5}>Evening</Typography>
                              <Typography variant="body2" color="#6c757d" sx={{ fontSize: '13px' }}>
                                {slots.evening.startTime} {slots.evening.startAmpm} - {slots.evening.endTime} {slots.evening.endAmpm}
                              </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                              <Typography variant="body1" fontWeight="600" color="#E15B65">
                                ₹{slots.evening.perDay || slots.evening.perHour || slots.evening.perPerson}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </React.Fragment>
                    );
                  })}
                </Box>
              </Box>
            </>
          )}
          {venue.packages && venue.packages.length > 0 && (
            <>
              <Box sx={{ my: 5, height: '1px', bgcolor: '#e9ecef' }} />
              <Box>
                <Typography variant="h5" fontWeight="700" mb={3} sx={{
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <RestaurantIcon sx={{ fontSize: 24, color: '#E15B65' }} />
                  Food Packages
                </Typography>
                <Grid container spacing={2}>
                  {venue.packages.map((pkg, index) => {
                    const imageUrl = getPackageImageUrl(pkg.thumbnail);
                    return (
                      <Grid item xs={12} sm={6} md={3} key={pkg._id || index}>
                        <Card sx={{
                          height: '100%',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            transform: 'translateY(-4px)'
                          }
                        }}>
                          <Box
                            component="img"
                            src={imageUrl}
                            alt={pkg.title}
                            onError={(e) => {
                              console.error('Package image failed to load:', imageUrl);
                              e.target.src = '/placeholder.jpg';
                            }}
                            sx={{
                              width: '100%',
                              height: 160,
                              objectFit: 'cover'
                            }}
                          />
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600" sx={{
                              fontSize: '14px',
                              color: '#2c3e50',
                              mb: 0.5
                            }}>
                              {pkg.title}
                            </Typography>
                            {pkg.price && (
                              <Typography variant="body2" color="#E15B65" fontWeight="600">
                                ₹{pkg.price}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </>
          )}
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
        }} >
        <DialogTitle sx={{
          color: '#dc3545',
          fontWeight: 700,
          fontSize: '20px'
        }}>
          Delete Venue
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontSize: '15px' }}>
            Are you sure you want to delete <strong>"{venue.venueName}"</strong>?
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '14px' }}>
            This action cannot be undone. All venue data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{textTransform: 'none',fontWeight: 500,px: 3}}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ textTransform: 'none',fontWeight: 500,px: 3,bgcolor: '#dc3545','&:hover': { bgcolor: '#b02a37' } }}>
            Delete Venue
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{
            backgroundColor: toastSeverity === 'success' ? '#28a745' : '#dc3545', color: 'white', fontWeight: 500, '& .MuiAlert-icon': {   color: 'white' } }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VenueListingView; 