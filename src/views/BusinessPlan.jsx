import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const BusinessPlan = () => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 2000, margin: 'auto', mt: 2, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HomeIcon sx={{ mr: 1 }} />
        <Typography variant="h6">CityRide Rentals Business Plan</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ mr: 1 }}>Overview</Typography>
      </Box>
      <Card sx={{ backgroundColor: '#f5f7fa', p: 2 }}>
        <CardContent>
          <Typography variant="h3" color="primary" gutterBottom>
            Commission Base Plan
          </Typography>
          <Typography variant="h4" gutterBottom>
            10 % Commission per trip
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provider will pay 10% Commission to GamMart From each trip. You will get access of all the features and options in Provider panel, app and interaction with user.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/business/changeplan')} variant="contained" color="success">
              Change Business Plan
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Card>
  );
};
export default BusinessPlan;