import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EditProvider from './EditProvider';

const venueMyShop = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [providerData, setProviderData] = useState({
    
    coverPhoto: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2326&q=80',
  });
  const [editData, setEditData] = useState(providerData);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : 'https://api.bookmyevent.ae/api';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user from localStorage:', storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user:', parsedUser);
      setUser(parsedUser);
      fetchUserData(parsedUser._id || parsedUser.id);
      fetchVendorData(parsedUser._id || parsedUser.id);
    } else {
      console.log('No user found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      console.log('Fetching user data for ID:', userId);
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      const data = await response.json();
      
      console.log('User API Response:', data);
      
      if (data.user) {
        setUserData(data.user);
        console.log('User data set:', data.user);
      } else {
        console.error('Failed to fetch user data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchVendorData = async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching vendor data for ID:', userId);
      const response = await fetch(`${API_BASE_URL}/vendorprofiles/${userId}`);
      const data = await response.json();
      
      console.log('Vendor API Response:', data);
      
      if (data.success && data.data) {
        setVendorData(data.data);
        console.log('Vendor data set:', data.data);
      } else {
        console.error('Failed to fetch vendor data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = () => {
    setEditData(providerData);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleSave = () => {
    setProviderData(editData);
    setOpenEdit(false);
  };

  const handleInputChange = (field) => (event) => {
    setEditData({
      ...editData,
      [field]: event.target.value,
    });
  };

  const handleEditProvider = () => {
    navigate('/business/editpro');
  };

  const handleUpdateFromEdit = (updatedData) => {
    setProviderData(prevData => ({
      ...prevData,
      ...updatedData,
    }));
    navigate('/myshop');
  };

  const formatAddress = (address) => {
    if (!address) return 'Not provided';
    
    // If address is a string, return it directly
    if (typeof address === 'string') {
      return address;
    }
    
    // If address is an object with properties
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : address.fullAddress || 'Not provided';
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ backgroundColor: '#db5762ff' }}>
            
          </Avatar>
          <Typography variant="h5" fontWeight="600" color="#333">
            My Info
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProvider}
          sx={{
            backgroundColor: '#db6e77ff',
            '&:hover': {
              backgroundColor: '#db5762ff',
            },
            textTransform: 'none',
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          Edit Provider Information
        </Button>
      </Box>
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Provider Image Section */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              position: 'relative',
              height: 400,
              backgroundImage: `url(${providerData.coverPhoto})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Settings Icon */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
            {/* Provider Info Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                p: 3,
                color: 'white',
              }}
            >
             
            </Box>
          </Paper>
        </Grid>
        {/* Provider Details Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, width: 500, borderRadius: 2 }}>
            {/* Avatar Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#db5762ff', color: 'white',fontSize: 32, fontWeight: 600 }}>
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </Box>
            </Box>
            {/* Provider Information */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ gap: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="black" gutterBottom>
                    Email: {userData?.email || user?.email || 'example@email.com'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="black" gutterBottom>
                    Phone: {userData?.phone || 'Not provided'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="black" gutterBottom>
                    Address: {vendorData?.storeAddress ? formatAddress(vendorData.storeAddress) : 'Not provided'}
                  </Typography>
                </Box>
                {/* <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="black" gutterBottom>
                    Business Plan: {providerData.businessPlan}
                  </Typography>
                </Box> */}
                {/* <Box>
                  <Typography variant="body2" color="black" gutterBottom>
                    Admin commission: {providerData.adminCommission}
                  </Typography>
                </Box> */}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle >Edit Provider Information </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="email"
              value={editData.email}
              onChange={handleInputChange('email')}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Phone"
              value={editData.phone}
              onChange={handleInputChange('phone')}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Address"
              value={editData.address}
              onChange={handleInputChange('address')}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Business Plan"
              value={editData.businessPlan}
              onChange={handleInputChange('businessPlan')}
              select
              fullWidth
              variant="outlined"
            >
              <MenuItem value="Commission">Commission</MenuItem>
              <MenuItem value="Subscription">Subscription</MenuItem>
              <MenuItem value="Flat Rate">Flat Rate</MenuItem>
            </TextField>
            <TextField
              label="Admin Commission"
              value={editData.adminCommission}
              onChange={handleInputChange('adminCommission')}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleEditClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#00897b',
              '&:hover': {
                backgroundColor: '#00695c',
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Announcement Section */}
      <Box sx={{ mt:5, mb: 3, p: 2, borderLeft: '4px solid #b2434cff', backgroundColor: '#fff', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" color="#b2434cff" fontWeight="600">
            Announcement <span style={{ fontSize: '0.75rem', color: '#757575' }}>i</span>
          </Typography>
          <Box>
            <Switch defaultChecked color="primary" />
          </Box>
        </Box>
        <TextField
          placeholder="Ex: ABC Company"
          fullWidth
          variant="outlined"
          sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <Button variant="contained" sx={{ backgroundColor: '#db5762ff', '&:hover': { backgroundColor: '#f17681ff' }, textTransform: 'none',mt:3,paddingLeft:20, px: 2, py: 0.5, borderRadius: 2 }}>
          Publish
        </Button>
      </Box>
    </Box>
  );
};

export default venueMyShop;