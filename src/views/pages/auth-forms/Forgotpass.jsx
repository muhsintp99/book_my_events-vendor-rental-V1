import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  Box
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { DASHBOARD_PATH } from 'config';
import bookLogo from 'assets/images/book.png';

export default function AuthForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('https://api.bookmyevent.ae/api/auth/forgot-password', { email });
      setSuccess(response.data.message || 'Password reset instructions have been sent to your email.');
      // Optionally clear email after success
      setEmail('');
    } catch (err) {
      let errorMessage = 'Failed to send reset instructions';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      }
      setError(errorMessage);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Link to={DASHBOARD_PATH} aria-label="theme-logo">
          <img
            src={bookLogo}
            alt="Book Logo"
            style={{ width: 160, height: 50 }}
          />
        </Link>
      </Box>
      {/* Title */}
      <Typography variant="h2" sx={{ mb: 1, textAlign: 'center', color: '#E15B65' }}>
        Hi, Welcome Back
      </Typography>
      {/* Subtitle */}
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        Enter your email address to reset your password
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
          <InputLabel>Email Address</InputLabel>
          <OutlinedInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        {error && <FormHelperText error sx={{ mb: 2 }}>{error}</FormHelperText>}
        {success && <FormHelperText sx={{ mb: 2, color: 'success.main' }}>{success}</FormHelperText>}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <div></div> {/* Placeholder for alignment like checkbox */}
          <Typography component={Link} to="/login" color="#E15B65" sx={{ textDecoration: 'none' }}>
            Back to Sign In
          </Typography>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button color="secondary" fullWidth size="large" type="submit" variant="contained" sx={{ bgcolor: "#E15B65" }}>
              Send Reset Link
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </Box>
  );
}