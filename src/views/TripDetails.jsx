import React from 'react';
import { Box, Typography, Button, Grid, Paper, Divider } from '@mui/material';
import { styled } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4), // Increased padding
  marginBottom: theme.spacing(4), // Increased margin
}));

const VehicleCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2), // Increased padding
  display: 'flex',
  alignItems: 'center',
}));

const MapContainer = styled(Box)(({ theme }) => ({
  height: '400px', // Increased height
  backgroundColor: '#e0e0e0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const TripDetail = () => {
  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: 4 }}> {/* Increased padding */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}> {/* Increased margin */}
        <Typography variant="h5">Trip ID #100036</Typography>
        <Box>
          <Button variant="outlined" startIcon={<EditIcon />} sx={{ mr: 2 }}> {/* Increased margin */}
            Edit Trip
          </Button>
          <Button variant="contained" startIcon={<PrintIcon />} color="primary">
            Print Invoice
          </Button>
        </Box>
      </Box>
      <Typography variant="body2" color="textSecondary">
        Placed on 08 Feb 2025 12:40 pm
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}> {/* Increased spacing and margin */}
        <Grid item xs={8}>
          <StyledPaper>
            <Typography variant="subtitle1">Provider: CityRide Rentals <LocationOnIcon sx={{ verticalAlign: 'middle', ml: 2 }} /></Typography> {/* Increased margin */}
            <Typography variant="body2">Trip Type: Hourly (Instant)</Typography>
            <Typography variant="body2">Total Hour: 5 Hrs</Typography>
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6">Vehicle Details</Typography>
            <Divider sx={{ my: 2 }} /> {/* Increased margin */}
            <VehicleCard>
              <img src="https://via.placeholder.com/150x75" alt="BMW 3 Series" style={{ marginRight: '24px' }} /> {/* Increased image size and margin */}
              <Box>
                <Typography variant="body1">BMW 3 Series</Typography>
                <Typography variant="body2">Category: Luxury Sedan</Typography>
                <Typography variant="body2">Brand: BMW</Typography>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Typography variant="body2">Unit Fair: 50.00 /Hr</Typography>
                <Typography variant="body2">Quantity: 1</Typography>
                <Typography variant="body2">Total Hour/Km/Day: 5 Hrs</Typography>
                <Typography variant="body2">Fare: 250.00</Typography>
              </Box>
            </VehicleCard>
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6">Trip Fare</Typography>
            <Divider sx={{ my: 2 }} /> {/* Increased margin */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Trip Fare</Typography>
              <Typography variant="body1">250.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Subtotal (TAX Included)</Typography>
              <Typography variant="body1">250.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Discount</Typography>
              <Typography variant="body1">-12.50</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Coupon Discount</Typography>
              <Typography variant="body1">-0.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Additional Charge</Typography>
              <Typography variant="body1">10.00</Typography>
            </Box>
            <Divider sx={{ my: 2 }} /> {/* Increased margin */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">247.50</Typography>
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={4}>
          <StyledPaper>
            <Typography variant="subtitle1">Trip Status: Pending</Typography>
            <Typography variant="subtitle1">Payment Status: Unpaid</Typography>
          </StyledPaper>
          <MapContainer>
            <Typography>Map Placeholder</Typography>
          </MapContainer>
          <StyledPaper sx={{ mt: 4 }}> {/* Increased margin */}
            <Typography variant="subtitle1">Customer Info</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}> {/* Increased margin */}
              <Box sx={{ mr: 3 }}> {/* Increased margin */}
                <Typography variant="body2">Jhon</Typography>
                <Typography variant="body2">Guest user, +************</Typography>
                <Typography variant="body2">j********@gmail.com</Typography>
              </Box>
              <Button variant="contained" color="primary">
                Guest user
              </Button>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default TripDetail;