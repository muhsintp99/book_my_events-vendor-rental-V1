import React, { useState } from 'react';
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
    name: 'CityRide Rentals',
    phone: '+1 959-252-4064',
    address: 'Andhra Pradesh',
    businessPlan: 'Commission',
    adminCommission: '10%',
    logo: 'https://via.placeholder.com/100?text=Logo',
    coverPhoto: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2326&q=80',
  });
  const [editData, setEditData] = useState(providerData);
  const navigate = useNavigate();
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
    navigate('/myshop'); // Navigate back to MyShop
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
          <Avatar sx={{ backgroundColor: '#1976d2' }}>
            <CarIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="600" color="#333">
            My Provider Info
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProvider}
          sx={{
            backgroundColor: '#00897b',
            '&:hover': {
              backgroundColor: '#00695c',
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
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {providerData.name}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Provider Details Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, width: 500, borderRadius: 2 }}>
            {/* Car Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#f5f5f5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={providerData.logo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              </Box>
            </Box>
            {/* Provider Information */}
            <Box sx={{ space: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Name :
                  {providerData.name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phone :
                  {providerData.phone}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Address :
                  {providerData.address}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Business Plan :
                  {providerData.businessPlan}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Admin commission :
                  {providerData.adminCommission}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Provider Information</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
      <Box sx={{ mt:5, mb: 3, p: 2, borderLeft: '4px solid #1976d2', backgroundColor: '#fff', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" color="#1976d2" fontWeight="600">
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
        <Button variant="contained" sx={{ backgroundColor: '#00897b', '&:hover': { backgroundColor: '#00695c' }, textTransform: 'none',mt:3,paddingLeft:20, px: 2, py: 0.5, borderRadius: 2 }}>
          Publish
        </Button>
      </Box>
    </Box>
  );
};
export default MyShop;