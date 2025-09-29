import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const ChangePlan = () => {
  const [selectedPlan, setSelectedPlan] = React.useState('Commission Base');
  const navigate = useNavigate();

  const handlePlanShift = (plan) => {
    setSelectedPlan(plan);
    if (plan !== 'Commission Base') {
      navigate('/business/shiftplan');
    }
  };

  return (
    <Box sx={{ maxWidth: 1500, margin: 'auto', mt: 4, p: 2 }}>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Change Subscription Plan</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 4 }}>
          Renew or shift your plan to get better experience!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Card
            key="commission-base-card"
            sx={{
              minWidth: 250,
              p: 3,
              backgroundColor: selectedPlan === 'Commission Base' ? '#fefefeff' : '#a5d6a7',
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Commission Base
              </Typography>
              <Typography variant="h4" gutterBottom>
                10%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Provider will pay 10% Commission to 6amMart From each trip. You will get access of all the features and options in Provider panel, app and interaction with user.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={selectedPlan === 'Commission Base'}
                onClick={() => handlePlanShift('Commission Base')}
              >
                {selectedPlan === 'Commission Base' ? 'Current Plan' : 'Shift In This Plan'}
              </Button>
            </CardContent>
          </Card>
          <Card
            key="regular-card"
            sx={{
              minWidth: 250,
              p: 3,
              backgroundColor: selectedPlan === 'Regular' ? '#a5d6a7' : '#e0f7fa',
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Regular
              </Typography>
              <Typography variant="h4" gutterBottom>
                $500.00
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                365 Days
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Mobile app</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Chatting options</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Review section</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">10000 Trips</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">1000 Uploads</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="success"
                onClick={() => handlePlanShift('Regular')}
              >
                {selectedPlan === 'Regular' ? 'Current Plan' : 'Shift In This Plan'}
              </Button>
            </CardContent>
          </Card>
          <Card
            key="pro-card"
            sx={{
              minWidth: 250,
              p: 3,
              backgroundColor: selectedPlan === 'Pro' ? '#a5d6a7' : '#e0f7fa',
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h4" gutterBottom>
                $1,136
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                36 Months
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Mobile app</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Chatting</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Review</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Unlimited</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Unlimited</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="success"
                onClick={() => handlePlanShift('Pro')}
              >
                {selectedPlan === 'Pro' ? 'Current Plan' : 'Shift In This Plan'}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ChangePlan;