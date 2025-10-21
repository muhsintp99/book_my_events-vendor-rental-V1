import React, { useState, useEffect } from 'react';
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
  const [email, setEmail] = useState('');
  const [addressDefault, setAddressDefault] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [currentCoverPhotoUrl, setCurrentCoverPhotoUrl] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [formError, setFormError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [coverPhotoError, setCoverPhotoError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const API_BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : 'https://api.bookmyevent.ae/api';

  useEffect(() => {
    console.log('EditProvider useEffect triggered - mounting component');
    const storedUser = localStorage.getItem('user');
    console.log('Stored user from localStorage:', storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user:', parsedUser);
      console.log('User ID for fetch:', parsedUser._id || parsedUser.id);
      setUser(parsedUser);
      fetchUserData(parsedUser._id || parsedUser.id);
      fetchProviderData(parsedUser._id || parsedUser.id);
    } else {
      console.log('No user found in localStorage - cannot fetch data');
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      console.log('Fetching user data for ID:', userId);
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      console.log('User fetch response status:', response.status);
      const data = await response.json();
      console.log('User API Response:', data);
      
      if (data.user) {
        setUserData(data.user);
        setEmail(data.user.email || '');
        console.log('User data set - Email:', data.user.email || 'empty');
      } else {
        console.error('Failed to fetch user data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProviderData = async (userId) => {
    try {
      console.log('fetchProviderData called with userId:', userId);
      console.log('API URL for fetch:', `${API_BASE_URL}/providerprofiles/${userId}`);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/providerprofiles/${userId}`);
      console.log('Fetch response status:', response.status);
      const data = await response.json();
      console.log('Provider API Response:', data);
      
      if (data.success && data.data) {
        const provider = data.data;
        console.log('Provider data received:', provider);
        console.log('Setting states with provider data');
        setAddressDefault(provider.address || '');
        setContactNumber(provider.phone || '');
        setCurrentLogoUrl(provider.logo || null);
        setCurrentCoverPhotoUrl(provider.coverPhoto || null);
        console.log('States set - Address:', provider.address || 'empty', 'Phone:', provider.phone || 'empty');
      } else {
        console.log('API did not return success/data - response:', data);
        console.error('Failed to fetch provider data:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
      console.log('fetchProviderData completed - loading set to false');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');
    setPhoneError('');
    
    if (!email || !addressDefault || !contactNumber) {
      setFormError('All fields are required.');
      return;
    }
    if (!/^\+\d{1,4}\s\d{10}$/.test(contactNumber)) {
      setPhoneError('Please enter a valid 10-digit contact number (e.g., +91 1234567890).');
      return;
    }
    console.log({ email, addressDefault, contactNumber });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    console.log('Logo file selected:', file?.name);
    if (file) {
      setLogoFile(file);
    }
  };

  const handleCoverPhotoUpload = (event) => {
    const file = event.target.files[0];
    console.log('Cover photo file selected:', file?.name);
    if (file) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        console.log('Cover photo dimensions - width:', img.width, 'height:', img.height, 'ratio:', ratio);
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

  const handleUpdate = async () => {
    console.log('handleUpdate called');
    console.log('Current states - Email:', email, 'Address:', addressDefault, 'Phone:', contactNumber);
    console.log('Logo file:', logoFile?.name || 'none', 'Current logo URL:', currentLogoUrl);
    console.log('Cover file:', coverPhotoFile?.name || 'none', 'Current cover URL:', currentCoverPhotoUrl);
    
    setCoverPhotoError('');
    setFormError('');
    setPhoneError('');
    
    if (!email || !addressDefault || !contactNumber || (!logoFile && !currentLogoUrl) || (!coverPhotoFile && !currentCoverPhotoUrl)) {
      setFormError('All required fields (email, address, contact number, logo, cover photo) must be filled.');
      console.log('Validation failed - missing fields');
      return;
    }
    
    if (!/^\+\d{1,4}\s\d{10}$/.test(contactNumber)) {
      setPhoneError('Please enter a valid 10-digit contact number (e.g., +91 1234567890).');
      console.log('Phone validation failed');
      return;
    }

    if (coverPhotoFile) {
      const img = new Image();
      img.onload = async () => {
        const ratio = img.width / img.height;
        console.log('New cover photo ratio check:', ratio);
        if (ratio !== 2) {
          setCoverPhotoError('Cover photo must have a 2:1 ratio (e.g., 200x100 pixels).');
          console.log('Cover ratio invalid');
          return;
        }
        console.log('Cover ratio valid - proceeding to update');
        // Proceed with update
        await performUpdate();
      };
      img.src = URL.createObjectURL(coverPhotoFile);
    } else {
      console.log('No new cover photo - proceeding to update');
      await performUpdate();
    }
  };

  const performUpdate = async () => {
    try {
      console.log('performUpdate called');
      const userId = user._id || user.id;
      console.log('Updating for userId:', userId);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('address', addressDefault);
      formData.append('phone', contactNumber);
      
      if (logoFile) {
        formData.append('logo', logoFile);
        console.log('Appending new logo file');
      }
      if (coverPhotoFile) {
        formData.append('coverPhoto', coverPhotoFile);
        console.log('Appending new cover photo file');
      }

      console.log('FormData prepared - sending PUT request to:', `${API_BASE_URL}/providerprofiles/${userId}`);
      const response = await fetch(`${API_BASE_URL}/providerprofiles/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      console.log('Update response status:', response.status);
      if (response.ok) {
        console.log('Update successful');
        window.history.back(); // Navigate back to MyShop
        setOpenToast(true);
      } else {
        const errorData = await response.json();
        console.error('Update failed - response:', errorData);
      }
    } catch (error) {
      console.error('Error updating provider data:', error);
    }
  };

  const handleCancel = () => {
    console.log('handleCancel called');
    setLogoFile(null);
    setCoverPhotoFile(null);
    setFormError('');
    setPhoneError('');
    setCoverPhotoError('');
    window.history.back();
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  console.log('Render cycle - Loading:', loading, 'Email state:', email, 'User:', user ? 'set' : 'null');

  if (loading) {
    console.log('Rendering loading state');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 2500, margin: 'auto', p: 3, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            Edit Provider Info
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="provider info tabs">
              <Tab label="Basic Info" {...a11yProps(0)} />
              <Tab label="Contact" {...a11yProps(1)} />
              <Tab label="Media" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <TextField
              fullWidth
              label="Email *"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!email && formError}
              helperText={!email && formError ? 'Required field' : ''}
            />
            <TextField
              fullWidth
              label="Address *"
              variant="outlined"
              value={addressDefault}
              onChange={(e) => setAddressDefault(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!addressDefault && formError}
              helperText={!addressDefault && formError ? 'Required field' : ''}
              multiline
              rows={3}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TextField
              fullWidth
              label="Contact number *"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!!phoneError || (!contactNumber && formError)}
              helperText={phoneError || (!contactNumber && formError ? 'Required field' : '')}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 4, textAlign: 'center', width: '45%' }}>
                <Typography variant="h6" gutterBottom>Upload Logo *</Typography>
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={logoFile ? URL.createObjectURL(logoFile) : (currentLogoUrl || 'https://via.placeholder.com/100?text=Logo')} 
                    alt="Logo" 
                    style={{ width: '100px', height: '100px' }} 
                  />
                </Box>
                <Button variant="outlined" component="label">
                  Choose File
                  <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                </Button>
                <Typography variant="caption" display="block" gutterBottom color={formError && !logoFile && !currentLogoUrl ? 'error' : 'textSecondary'}>
                  {logoFile ? 'New file selected.' : (currentLogoUrl ? 'Current logo displayed.' : (formError ? formError : 'Required field'))}
                </Typography>
              </Box>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 4, textAlign: 'center', width: '45%' }}>
                <Typography variant="h6" gutterBottom>Upload Cover Photo (Ratio 2:1) *</Typography>
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={coverPhotoFile ? URL.createObjectURL(coverPhotoFile) : (currentCoverPhotoUrl || 'https://via.placeholder.com/200x100?text=Cover+Photo')} 
                    alt="Cover Photo" 
                    style={{ width: '200px', height: '100px', borderRadius: '8px' }} 
                  />
                </Box>
                <Button variant="outlined" component="label">
                  Choose File
                  <input type="file" hidden accept="image/*" onChange={handleCoverPhotoUpload} />
                </Button>
                <Typography variant="caption" display="block" gutterBottom color={((!coverPhotoFile && !currentCoverPhotoUrl) && formError) || coverPhotoError ? 'error' : 'textSecondary'}>
                  {coverPhotoFile ? 'New file selected.' : (currentCoverPhotoUrl ? 'Current cover photo displayed.' : (formError ? formError : coverPhotoError || 'Required field'))}
                </Typography>
              </Box>
            </Box>
          </TabPanel>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="contained" color="black" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="info" onClick={handleUpdate} sx={{color:'white', bgcolor:'#E15B65'}}>
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={openToast} autoHideDuration={3000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity="success" sx={{ backgroundColor: '#1976d2', color: 'white' }}>
          Update successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProvider;