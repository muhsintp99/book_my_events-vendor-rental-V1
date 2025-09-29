import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Paper,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Container
} from "@mui/material";
import { 
  Delete,
  Edit,
  Settings,
  DirectionsCar,
  ArrowBack
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

export default function VehicleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Mock vehicle data - in real app, this would come from API or props
  const [vehicle, setVehicle] = useState({
    id: 1,
    name: "Audi A6",
    code: "AUDI-23243",
    category: "Luxury Sedan",
    brand: "Audi",
    type: "family",
    totalTrip: 1,
    newTag: true,
    active: true,
    description: "The Audi A6 Series is a luxury sports sedan known for its dynamic performance, premium craftsmanship, and cutting-edge technology. Key Features: 1. Engine & Performance 2. Transmission 3. Interior 4. Technology 5. Safety & Assistance 6. Driving Experience",
    images: {
      main: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&q=80",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=150&q=80"
      ]
    },
    generalInfo: {
      brand: "Audi",
      category: "Luxury Sedan",
      type: "family",
    },
    fareDiscounts: {
      hourly: 5.00,
      discount: 5
    },
    otherFeatures: {
      airCondition: "Yes",
      transmission: "Automatic",
      fuelType: "octan",
      engineCapacity: 6576,
      seatingCapacity: 4,
      enginePower: 500
    },
    rating: 0.0,
    reviews: 0,
    location: "Andhra Pradesh"
  });

  const [mainImage, setMainImage] = useState(vehicle.images.main);

  // Tab panel component
  function TabPanel({ children, value, index }) {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  }

  const handleToggleNewTag = () => {
    setVehicle(prev => ({ ...prev, newTag: !prev.newTag }));
  };

  const handleToggleStatus = () => {
    setVehicle(prev => ({ ...prev, active: !prev.active }));
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log("Delete vehicle", vehicle.id);
  };

  const handleEdit = () => {
    // Navigate to edit page
    navigate(`/edit-vehicle/${vehicle.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              <Avatar sx={{ bgcolor: "#2563eb", width: 40, height: 40 }}>
                <DirectionsCar />
              </Avatar>
              <Typography variant="h4" fontWeight={600}>
                {vehicle.name}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                sx={{ 
                  borderRadius: 2, 
                  px: 3, 
                  py: 1,
                  bgcolor: "#fee2e2",
                  borderColor: "#fecaca",
                  color: "#dc2626",
                  '&:hover': {
                    bgcolor: "#fecaca",
                    borderColor: "#f87171"
                  }
                }}
                onClick={handleDelete}
              >
                Delete
              </Button>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1" fontWeight={500}>New Tag</Typography>
                <Switch 
                  checked={vehicle.newTag}
                  onChange={handleToggleNewTag}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#10b981',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#10b981',
                    },
                  }}
                />
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1" fontWeight={500}>Status</Typography>
                <Switch 
                  checked={vehicle.active}
                  onChange={handleToggleStatus}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#10b981',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#10b981',
                    },
                  }}
                />
              </Stack>
              
              <Button
                variant="contained"
                startIcon={<Edit />}
                sx={{ 
                  bgcolor: "#059669", 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    bgcolor: "#047857"
                  }
                }}
                onClick={handleEdit}
              >
                Edit Vehicle
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Side - Image Section */}
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              {/* Main Image */}
              <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={mainImage}
                  alt={vehicle.name}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
              
              {/* Thumbnail Images */}
              <Stack direction="row" spacing={2}>
                {vehicle.images.thumbnails.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    alt={`${vehicle.name} ${index + 2}`}
                    onClick={() => setMainImage(img)}
                    sx={{
                      width: 100,
                      height: 80,
                      borderRadius: 2,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: mainImage === img ? '3px solid #2563eb' : '2px solid #e5e7eb',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        border: '3px solid #2563eb',
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Paper>

            {/* Company Info */}
            <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "#dc2626", width: 60, height: 60 }}>
                  <DirectionsCar sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600} mb={1}>
                    CityRide Rentals
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {vehicle.location}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Right Side - Details Section */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              {/* Tabs and Rating Section */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Tabs
                  value={tabValue}
                  onChange={(e, newValue) => setTabValue(newValue)}
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500
                    },
                    '& .Mui-selected': {
                      color: '#059669 !important'
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#059669'
                    }
                  }}
                >
                  <Tab label="Default" />
                  <Tab label="English(EN)" />
                  <Tab label="Arabic - العربية(AR)" />
                </Tabs>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5" sx={{ color: "#f59e0b", fontWeight: 600 }}>
                    {vehicle.rating.toFixed(1)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    /5
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ ml: 2 }}>
                    {vehicle.reviews} Reviews
                  </Typography>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <Settings />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Tab Content */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h4" fontWeight={600} mb={3}>
                  {vehicle.name}
                </Typography>
                
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Description:
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.6}>
                  {vehicle.description}{" "}
                  <Typography component="span" sx={{ color: "#2563eb", cursor: "pointer" }}>
                    See more
                  </Typography>
                </Typography>

                {/* Information Cards */}
                <Grid container spacing={3}>
                  {/* General Info Card */}
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      height: '100%'
                    }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} mb={3}>
                          General Info
                        </Typography>
                        <Stack spacing={2} alignItems="flex-start">
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500}>Brand</Typography>
                            <Typography variant="body2">: {vehicle.generalInfo.brand}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500}>Category</Typography>
                            <Typography variant="body2">: {vehicle.generalInfo.category}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500}>Type</Typography>
                            <Typography variant="body2">: {vehicle.generalInfo.type}</Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Fare & Discounts Card */}
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      height: '100%'
                    }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} mb={3}>
                          Fare & Discounts
                        </Typography>
                        <Stack spacing={2} alignItems="flex-start">
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500}>Hourly</Typography>
                            <Typography variant="body2">: $ {vehicle.fareDiscounts.hourly.toFixed(2)}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500}>Discount</Typography>
                            <Typography variant="body2">: {vehicle.fareDiscounts.discount} %</Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Other Features Card */}
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      height: '100%'
                    }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} mb={3}>
                          Other Features
                        </Typography>
                        <Stack spacing={1} alignItems="flex-start">
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500} fontSize="0.8rem">Air Condition</Typography>
                            <Typography variant="body2" fontSize="0.8rem">: {vehicle.otherFeatures.airCondition}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500} fontSize="0.8rem">Transmission</Typography>
                            <Typography variant="body2" fontSize="0.8rem">: {vehicle.otherFeatures.transmission}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500} fontSize="0.8rem">Fuel Type</Typography>
                            <Typography variant="body2" fontSize="0.8rem">: {vehicle.otherFeatures.fuelType}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500} fontSize="0.8rem">Engine Capacity</Typography>
                            <Typography variant="body2" fontSize="0.8rem">: {vehicle.otherFeatures.engineCapacity}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500} fontSize="0.8rem">Seating Capacity</Typography>
                            <Typography variant="body2" fontSize="0.8rem">: {vehicle.otherFeatures.seatingCapacity}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" fontWeight={500} fontSize="0.8rem">Engine Power</Typography>
                            <Typography variant="body2" fontSize="0.8rem">: {vehicle.otherFeatures.enginePower}</Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h4" fontWeight={600} mb={3}>
                  Audi A6
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  English version content would be displayed here. This would include all the vehicle information translated to English.
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h4" fontWeight={600} mb={3}>
                  أودي A6
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Arabic version content would be displayed here. This would include all the vehicle information translated to Arabic.
                </Typography>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}