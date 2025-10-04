import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
  Select
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthRegister() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'vendor' // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill all required fields');
      return;
    }
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!checked) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://api.bookmyevent.ae/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Registration failed');

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/login', { state: { message: data.message } });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container direction="column" spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with your details</Typography>
          </Box>
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>First Name</InputLabel>
          <OutlinedInput name="firstName" value={formData.firstName} onChange={handleChange} />
        </FormControl>

        {/* Last Name */}
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Last Name</InputLabel>
          <OutlinedInput name="lastName" value={formData.lastName} onChange={handleChange} />
        </FormControl>

        {/* Email */}
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Email Address</InputLabel>
          <OutlinedInput type="email" name="email" value={formData.email} onChange={handleChange} />
        </FormControl>

        {/* Phone */}
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Phone</InputLabel>
          <OutlinedInput type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </FormControl>

        {/* Password */}
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {/* Role dropdown */}
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Role</InputLabel>
          <Select name="role" value={formData.role} onChange={handleChange}>
            <MenuItem value="vendor">Vendor</MenuItem>
          </Select>
        </FormControl>

        {/* Terms */}
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  name="checked"
                  color="primary"
                />
              }
              label={
                <Typography variant="subtitle1">
                  Agree with &nbsp;
                  <Typography variant="subtitle1" component={Link} to="#">
                    Terms & Condition
                  </Typography>
                </Typography>
              }
            />
          </Grid>
        </Grid>

        {/* Submit button */}
        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="secondary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Signing up...' : 'Sign up'} 
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
}
