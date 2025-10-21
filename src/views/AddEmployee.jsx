import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
// Styled component for the upload area
const UploadDropArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '150px',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  '& input[type="file"]': {
    display: 'none',
  },
}));
const Addemployee = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  // State for General Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  useEffect(() => {
    const fetchRoles = () => {
      const savedRoles = localStorage.getItem('roles');
      if (savedRoles) {
        const roles = JSON.parse(savedRoles).map(role => role.roleName);
        setAvailableRoles(roles);
      }
    };
    fetchRoles();
    window.addEventListener('rolesUpdated', fetchRoles);
    return () => window.removeEventListener('rolesUpdated', fetchRoles);
  }, []);
  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
      if (file.size > maxSize) {
        setErrorMessage('Image size must be less than 2 MB.');
        setOpenToast(true);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (img.width / img.height !== 1 || img.height / img.width !== 1) {
          setErrorMessage('Image must have a 1:1 ratio.');
          setOpenToast(true);
          setImageFile(null);
        } else {
          setImageFile(file);
        }
      };
      img.onerror = () => {
        setErrorMessage('Invalid image file.');
        setOpenToast(true);
        setImageFile(null);
      };
      const url = URL.createObjectURL(file);
      img.src = url;
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDropImage = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
      if (file.size > maxSize) {
        setErrorMessage('Image size must be less than 2 MB.');
        setOpenToast(true);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (img.width / img.height !== 1 || img.height / img.width !== 1) {
          setErrorMessage('Image must have a 1:1 ratio.');
          setOpenToast(true);
          setImageFile(null);
        } else {
          setImageFile(file);
        }
      };
      img.onerror = () => {
        setErrorMessage('Invalid image file.');
        setOpenToast(true);
        setImageFile(null);
      };
      const url = URL.createObjectURL(file);
      img.src = url;
    }
  };
  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setRole('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setImageFile(null);
    setOpenToast(false);
    setErrorMessage('');
  };
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
    setErrorMessage('');
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Validation
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/;
    if (!nameRegex.test(firstName)) {
      setErrorMessage('First name must be 2-30 letters only.');
      setOpenToast(true);
      return;
    }
    if (!nameRegex.test(lastName)) {
      setErrorMessage('Last name must be 2-30 letters only.');
      setOpenToast(true);
      return;
    }
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Phone must be a valid number (10-15 digits, starting with country code).');
      setOpenToast(true);
      return;
    }
    if (!role) {
      setErrorMessage('Please select a role.');
      setOpenToast(true);
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setOpenToast(true);
      return;
    }
    if (!passwordRegex.test(password)) {
      setErrorMessage('Password must be at least 8 characters long.');
      setOpenToast(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setOpenToast(true);
      return;
    }
    if (!imageFile) {
      setErrorMessage('Please upload an image.');
      setOpenToast(true);
      return;
    }
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    if (imageFile.size > maxSize) {
      setErrorMessage('Image size must be less than 2 MB.');
      setOpenToast(true);
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.width / img.height !== 1 || img.height / img.width !== 1) {
        setErrorMessage('Image must have a 1:1 ratio.');
        setOpenToast(true);
        return;
      }
      const newEmployee = {
        firstName,
        lastName,
        phone,
        role,
        email,
        password,
        imageFile,
      };
      const savedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      savedEmployees.push(newEmployee);
      localStorage.setItem('employees', JSON.stringify(savedEmployees));
      window.dispatchEvent(new Event('employeeAdded'));
      console.log({
        firstName,
        lastName,
        phone,
        role,
        email,
        password,
        imageFile,
      });
      setOpenToast(true);
      handleReset();
    };
    img.onerror = () => {
      setErrorMessage('Invalid image file.');
      setOpenToast(true);
    };
    const url = URL.createObjectURL(imageFile);
    img.src = url;
  };
  return (
    <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box sx={{
        maxWidth: 'lg',
        margin: 'auto',
        backgroundColor: 'white',
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        p: isSmallScreen ? 2 : 3,
      }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://via.placeholder.com/24" alt="User Icon" style={{ marginRight: 8 }} />
            <Typography variant="h5" component="h1">
              Add New Employee
            </Typography>
          </Box>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Insert the basic information of the employee
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {/* General Information & Image */}
          <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
            {/* General Information Section */}
            <Card sx={{ flex: isSmallScreen ? 'auto' : 2, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  General Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert the basic information of the employee
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Sakeef Ameer"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Prodhan"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputLabel sx={{ mr: 1 }}>🇺🇸 +1</InputLabel>
                      ),
                    }}
                  />
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role-select"
                      value={role}
                      label="Role"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      {availableRoles.map((roleName, index) => (
                        <MenuItem key={index} value={roleName}>{roleName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
            {/* Image Section */}
            <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Image
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Image Ratio (1:1) Max Size (2 MB)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropImage}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  {imageFile ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Image preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {imageFile.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                      <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                        Choose File
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        file selected.
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="image-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageFileChange}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          {/* Account Information Section */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: ex@gmail.com"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8+ characters required"
                    required
                    inputProps={{ minLength: 8 }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="8+ characters required"
                    required
                    inputProps={{ minLength: 8 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined" 
              color="#E15B65"
              size="large"
              onClick={handleReset} sx={{color:"#E15B65"}}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{ ml: 2, color: 'white', bgcolor: '#E15B65' }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Snackbar open={openToast} autoHideDuration={3000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseToast} severity={errorMessage ? "error" : "success"} sx={{ backgroundColor: errorMessage ? '#d32f2f' : '#1976d2', color: 'white' }}>
            {errorMessage || 'Employee added successfully!'}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};
export default Addemployee;