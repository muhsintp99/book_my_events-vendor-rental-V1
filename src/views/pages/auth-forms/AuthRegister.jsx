import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthRegister() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roleName: 'Vendor', // Default to 'Vendor' as per backend
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please provide an email and password');
      return;
    }
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/vehicles', { state: { message: data.message } });
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
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }} size={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-register"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-register"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
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

        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-role-register">Role</InputLabel>
          <OutlinedInput
            id="outlined-adornment-role-register"
            type="text"
            name="roleName"
            value={formData.roleName}
            onChange={handleChange}
          />
        </FormControl>

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