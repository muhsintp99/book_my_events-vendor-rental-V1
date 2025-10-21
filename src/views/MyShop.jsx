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
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EditProvider from './EditProvider'; // Adjust the import path as needed

const MyShop = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [providerData, setProviderData] = useState({
    name: '',
    phone: '',
    address: '',
    logo: 'https://via.placeholder.com/100?text=Logo',
    coverPhoto: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2326&q=80',
  });
  const [editData, setEditData] = useState(providerData);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
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
      fetchProviderData(parsedUser._id || parsedUser.id);
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

  const fetchProviderData = async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching provider data for ID:', userId);
      const response = await fetch(`${API_BASE_URL}/providerprofiles/${userId}`);
      const data = await response.json();
      
      console.log('Provider API Response:', data);
      
      if (data.success && data.data) {
        setProviderData(data.data);
        console.log('Provider data set:', data.data);
      } else {
        console.error('Failed to fetch provider data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = () => {
    setEditData({
      ...providerData,
      email: userData?.email || '',
    });
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
    navigate('/myshop'); // Navigate back to MyShop
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

  const getEmailInitial = () => {
    const email = userData?.email || user?.email;
    return email ? email.charAt(0).toUpperCase() : 'P';
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
          <Avatar sx={{ backgroundColor: '#E15B65' }}>
            <CarIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="600" color="#E15B65">
            My Info
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProvider}
          sx={{
            backgroundColor: '#E15B65',
            '&:hover': {
              backgroundColor: '#e32c38ff',
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
                background: 'linear-gradient(transparent, rgba(171, 33, 33, 0.8))',
                p: 3,
                color: 'white',
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {providerData.name}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Provider Details Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, width: 500, borderRadius: 2 }}>
            {/* Avatar Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#E15B65', 
                color: 'white', 
                fontSize: 32, 
                fontWeight: 600 
              }}>
                {getEmailInitial()}
              </Avatar>
            </Box>
            {/* Provider Information */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ space: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="black" gutterBottom>
                    Email : {userData?.email || user?.email || 'Not provided'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="black" gutterBottom>
                    Phone : {providerData.phone || 'Not provided'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="black" gutterBottom>
                    Address : {providerData.address ? formatAddress(providerData.address) : 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Provider Information</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              value={editData.email || ''}
              onChange={handleInputChange('email')}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Name"
              value={editData.name}
              onChange={handleInputChange('name')}
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
              backgroundColor: '#E15B65',
              '&:hover': {
                backgroundColor: '#e42f3bff',
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Announcement Section */}
      <Box sx={{ mt:5, mb: 3, p: 2, borderLeft: '6px solid #E15B65', backgroundColor: '#fff', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" color="#E15B65" fontWeight="600">
            Announcement <span style={{ fontSize: '0.75rem', color: '#E15B65' }}>i</span>
          </Typography>
          <Box>
            <Switch defaultChecked   sx={{
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#E15B65'},
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#E15B65'
    },}} />
          </Box>
        </Box>
        <TextField
          placeholder="Ex: ABC Company"
          fullWidth
          variant="outlined" 
          sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <Button variant="contained" sx={{ backgroundColor: '#E15B65', '&:hover': { backgroundColor: '#d1333dff' }, textTransform: 'none',mt:3,paddingLeft:20, px: 2, py: 0.5, borderRadius: 2 }}>
          Publish
        </Button>
      </Box>
    </Box>
  );
};

export default MyShop;