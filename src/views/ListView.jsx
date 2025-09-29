import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Tab,
  Tabs,
  Paper
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  DirectionsCar as CarIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#26a69a',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#26a69a',
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
  const [activeTab, setActiveTab] = useState(0);
  const [newTagEnabled, setNewTagEnabled] = useState(true);
  const [statusEnabled, setStatusEnabled] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const images = [
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];

  return (
    <Box sx={{ 
      maxWidth: 1400, 
      mx: 'auto', 
      p: 3, 
      bgcolor: '#f8f9fa', 
      minHeight: '100vh' 
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2 
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
            Audi A6
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="#666" sx={{ fontSize: '14px' }}>
              New Tag
            </Typography>
            <StyledSwitch
              checked={newTagEnabled}
              onChange={(e) => setNewTagEnabled(e.target.checked)}
              size="small"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="#666" sx={{ fontSize: '14px' }}>
              Status
            </Typography>
            <StyledSwitch
              checked={statusEnabled}
              onChange={(e) => setStatusEnabled(e.target.checked)}
              size="small"
            />
          </Box>
          
          <Button
            variant="contained"
            startIcon={<EditIcon />}
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

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        bgcolor: '#ffffff'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Language Tabs and Rating Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3 
          }}>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
            >
              <Tab label="Default" />
              <Tab label="English(EN)" />
              <Tab label="Arabic - العربية(AR)" />
            </StyledTabs>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="h6" color="#ff9800" fontWeight="600" sx={{ fontSize: '18px' }}>
                  0.0
                </Typography>
                <Typography variant="body2" color="#666" sx={{ fontSize: '14px' }}>/5</Typography>
                <Typography variant="body2" color="#666" sx={{ fontSize: '14px', ml: 1 }}>
                  0 Reviews
                </Typography>
              </Box>
              <IconButton sx={{ color: '#666', p: 1 }}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* Left Side - Images */}
            <Grid item xs={12} md={5}>
              <Box>
                <Box
                  component="img"
                  src={images[activeImage]}
                  alt="Audi A6"
                  sx={{
                    width: '100%',
                    height: 280,
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {images.map((img, index) => (
                    <ThumbnailImage
                      key={index}
                      src={img}
                      alt={`Audi A6 view ${index + 1}`}
                      active={activeImage === index}
                      onClick={() => setActiveImage(index)}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Details */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight="600" mb={2} color="#2c3e50" sx={{ fontSize: '32px' }}>
                Audi A6
              </Typography>
              
              <Typography variant="h6" color="#666" mb={1} fontWeight="600" sx={{ fontSize: '16px' }}>
                Description:
              </Typography>
              
              <Typography variant="body1" color="#666" mb={1} lineHeight={1.6} sx={{ fontSize: '14px' }}>
                The Audi A6 Series is a luxury sports sedan known for its dynamic performance, premium craftsmanship, and cutting-edge technology.
              </Typography>
              
              <Typography variant="body1" color="#666" mb={3} lineHeight={1.6} sx={{ fontSize: '14px' }}>
                Key Features: 1. Engine & Performance 2. Transmission 3. Interior 4. Technology 5. Safety & Assistance 6. Driving Experience{' '}
                <Typography 
                  component="span" 
                  sx={{ 
                    color: '#26a69a', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  See more
                </Typography>
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, bgcolor: '#eee' }} />

          {/* Bottom Information Grid */}
          <Grid container spacing={4}>
            {/* General Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CarIcon sx={{ 
                  fontSize: 40, 
                  color: '#f44336', 
                  mb: 1 
                }} />
                <Typography variant="h6" fontWeight="600" mb={3} sx={{ fontSize: '16px', textAlign: 'center' }}>
                  General Info
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                {[
                  { label: 'Brand', value: 'Audi' },
                  { label: 'Category', value: 'Luxury Sedan' },
                  { label: 'Type', value: 'family' }
                ].map((item, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1.5,
                    alignItems: 'center'
                  }}>
                    <Typography color="#666" sx={{ fontSize: '14px' }}>{item.label}</Typography>
                    <Typography fontWeight="500" sx={{ fontSize: '14px' }}>: {item.value}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ 
                mt: 3, 
                pt: 2, 
                borderTop: '1px solid #eee'
              }}>
                <Typography variant="h6" fontWeight="600" color="#2c3e50" sx={{ fontSize: '16px', mb: 0.5 }}>
                  CityRide Rentals
                </Typography>
                <Typography variant="body2" color="#26a69a" sx={{ fontSize: '14px' }}>
                  Andhra Pradesh
                </Typography>
              </Box>
            </Grid>

            {/* Fare & Discounts */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="600" mb={3} sx={{ 
                fontSize: '16px', 
                textAlign: 'center' 
              }}>
                Fare & Discounts
              </Typography>
              
              <Box>
                {[
                  { label: 'Hourly', value: '$ 5.00' },
                  { label: 'Discount', value: '5 %' }
                ].map((item, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1.5,
                    alignItems: 'center'
                  }}>
                    <Typography color="#666" sx={{ fontSize: '14px' }}>{item.label}</Typography>
                    <Typography fontWeight="500" sx={{ fontSize: '14px' }}>: {item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Other Features */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="600" mb={3} sx={{ 
                fontSize: '16px', 
                textAlign: 'center' 
              }}>
                Other Features
              </Typography>
              
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  {[
                    { label: 'Air Condition', value: 'Yes' },
                    { label: 'Transmission', value: 'Automatic' },
                    { label: 'Fuel Type', value: 'octan' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1.5,
                      pr: 1,
                      alignItems: 'center'
                    }}>
                      <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight="500" sx={{ fontSize: '12px' }}>
                        : {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={6}>
                  {[
                    { label: 'Engine Capacity', value: '6576' },
                    { label: 'Seating Capacity', value: '4' },
                    { label: 'Engine Power', value: '500' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1.5,
                      pl: 1,
                      alignItems: 'center'
                    }}>
                      <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight="500" sx={{ fontSize: '12px' }}>
                        : {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CarListingView;