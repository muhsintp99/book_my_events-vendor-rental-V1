import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Tabs, Tab, Card, CardContent, Snackbar, Alert } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const EditProvider = () => {
  const [tabValue, setTabValue] = useState(0);
  const [nameDefault, setNameDefault] = useState('CityRide Rentals');
  const [addressDefault, setAddressDefault] = useState('Andhra Pradesh');
  const [contactNumber, setContactNumber] = useState('+1 959-252-4064');
  const [logoFile, setLogoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [formError, setFormError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [coverPhotoError, setCoverPhotoError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');
    setPhoneError('');
    
    if (!nameDefault || !addressDefault || !contactNumber) {
      setFormError('All fields are required.');
      return;
    }
    if (!/^\+\d{1,4}\s\d{10}$/.test(contactNumber)) {
      setPhoneError('Please enter a valid 10-digit contact number (e.g., +91 1234567890).');
      return;
    }
    console.log({ nameDefault, addressDefault, contactNumber });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleCoverPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        if (ratio !== 2) {
          setCoverPhotoError('Cover photo must have a 2:1 ratio (e.g., 200x100 pixels).');
          setCoverPhotoFile(null);
        } else {
          setCoverPhotoError('');
          setCoverPhotoFile(file);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleUpdate = () => {
    setCoverPhotoError('');
    setFormError('');
    setPhoneError('');
    
    if (!nameDefault || !addressDefault || !contactNumber || !logoFile || !coverPhotoFile) {
      setFormError('All required fields (name, address, contact number, logo, cover photo) must be filled.');
      return;
    }
    
    if (!/^\+\d{1,4}\s\d{10}$/.test(contactNumber)) {
      setPhoneError('Please enter a valid 10-digit contact number (e.g., +91 1234567890).');
      return;
    }

    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio !== 2) {
        setCoverPhotoError('Cover photo must have a 2:1 ratio (e.g., 200x100 pixels).');
        return;
      }
      // Simulate saving to MyShop state (in a real app, use a state management solution like Redux or Context)
      const logoUrl = URL.createObjectURL(logoFile);
      const coverPhotoUrl = URL.createObjectURL(coverPhotoFile);
      window.history.back(); // Navigate back to MyShop
      setOpenToast(true);
      setCoverPhotoError('');
      setFormError('');
      setPhoneError('');
    };
    img.src = URL.createObjectURL(coverPhotoFile);
  };

  const handleCancel = () => {
    setLogoFile(null);
    setCoverPhotoFile(null);
    setFormError('');
    setPhoneError('');
    setCoverPhotoError('');
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 2500, margin: 'auto', p: 3, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            Edit Provider Info
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="language tabs">
              <Tab label="Default" {...a11yProps(0)} />
              <Tab label="English(EN)" {...a11yProps(1)} />
              <Tab label="العربية - Arabic (AR)" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <TextField
              fullWidth
              label="Name (Default) *"
              variant="outlined"
              value={nameDefault}
              onChange={(e) => setNameDefault(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!nameDefault && formError}
              helperText={!nameDefault && formError}
            />
            <TextField
              fullWidth
              label="Address (Default) *"
              variant="outlined"
              value={addressDefault}
              onChange={(e) => setAddressDefault(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!addressDefault && formError}
              helperText={!addressDefault && formError}
            />
            <TextField
              fullWidth
              label="Contact number *"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!!phoneError || (!contactNumber && formError)}
              helperText={phoneError || (!contactNumber && formError) || ''}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TextField
              fullWidth
              label="Name (English) *"
              variant="outlined"
              value={nameDefault}
              onChange={(e) => setNameDefault(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!nameDefault && formError}
              helperText={!nameDefault && formError}
            />
            <TextField
              fullWidth
              label="Address (English) *"
              variant="outlined"
              value={addressDefault}
              onChange={(e) => setAddressDefault(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!addressDefault && formError}
              helperText={!addressDefault && formError}
            />
            <TextField
              fullWidth
              label="Contact number *"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!!phoneError || (!contactNumber && formError)}
              helperText={phoneError || (!contactNumber && formError) || ''}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TextField
              fullWidth
              label="Name (Arabic) *"
              variant="outlined"
              value={nameDefault}
              onChange={(e) => setNameDefault(e.target.value)}
              sx={{ mb: 2 }}
              dir="rtl"
              inputProps={{ style: { textAlign: 'right' } }}
              required
              error={!nameDefault && formError}
              helperText={!nameDefault && formError}
            />
            <TextField
              fullWidth
              label="Address (Arabic) *"
              variant="outlined"
              value={addressDefault}
              onChange={(e) => setAddressDefault(e.target.value)}
              sx={{ mb: 2 }}
              dir="rtl"
              inputProps={{ style: { textAlign: 'right' } }}
              required
              error={!addressDefault && formError}
              helperText={!addressDefault && formError}
            />
            <TextField
              fullWidth
              label="Contact number *"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!!phoneError || (!contactNumber && formError)}
              helperText={phoneError || (!contactNumber && formError) || ''}
            />
          </TabPanel>
        </CardContent>
      </Card>
      <Card sx={{ maxWidth: 2500, margin: 'auto', p: 3, mt: 3, boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 4, textAlign: 'center', width: '45%' }}>
              <Typography variant="h6" gutterBottom>Upload Logo *</Typography>
              <Box sx={{ mb: 2 }}>
                <img src={logoFile ? URL.createObjectURL(logoFile) : 'https://via.placeholder.com/100?text=Logo'} alt="Logo" style={{ width: '100px', height: '100px' }} />
              </Box>
              <Button variant="outlined" component="label">
                Choose File
                <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
              </Button>
              <Typography variant="caption" display="block" gutterBottom color={formError && !logoFile ? 'error' : 'textSecondary'}>
                {logoFile ? 'File selected.' : (formError && !logoFile ? formError : 'Required field')}
              </Typography>
            </Box>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 4, textAlign: 'center', width: '45%' }}>
              <Typography variant="h6" gutterBottom>Upload Cover Photo (Ratio 2:1) *</Typography>
              <Box sx={{ mb: 2 }}>
                <img src={coverPhotoFile ? URL.createObjectURL(coverPhotoFile) : 'https://via.placeholder.com/200x100?text=Cover+Photo'} alt="Cover Photo" style={{ width: '200px', height: '100px', borderRadius: '8px' }} />
              </Box>
              <Button variant="outlined" component="label">
                Choose File
                <input type="file" hidden accept="image/*" onChange={handleCoverPhotoUpload} />
              </Button>
              <Typography variant="caption" display="block" gutterBottom color={(!coverPhotoFile && formError) || coverPhotoError ? 'error' : 'textSecondary'}>
                {coverPhotoFile ? 'File selected.' : (formError && !coverPhotoFile ? formError : coverPhotoError || 'Required field')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="info" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={openToast} autoHideDuration={3000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity="info" sx={{ backgroundColor: '#1976d2', color: 'white' }}>
          Update successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProvider;