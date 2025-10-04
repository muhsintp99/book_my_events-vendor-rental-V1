import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Button, Checkbox, FormControl, FormControlLabel, FormHelperText,
  Grid, IconButton, InputAdornment, InputLabel, OutlinedInput,
  Typography, Box
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://api.bookmyevent.ae/api/auth/login', { email, password });
      const { token, user } = response.data;
      console.log(response.data.profile.module.title);

      // Store token consistently
      if (checked) {
        localStorage.setItem('token', token);
        localStorage.setItem('logRes', response.data.profile.module.title);
        localStorage.setItem('moduleId', response.data.profile.module._id);
      } else {
        sessionStorage.setItem('token', token);
      }

      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/dashboard/default';
      // navigate('/dashboard/default', { replace: true });

    } catch (err) {
      let errorMessage = 'Invalid email or password';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      }
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
        <InputLabel>Email Address / Username</InputLabel>
        <OutlinedInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          required
        />
      </FormControl>

      {error && <FormHelperText error sx={{ mb: 2 }}>{error}</FormHelperText>}

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" />}
          label="Keep me logged in"
        />
        <Typography component={Link} to="/forgot-password" color="secondary" sx={{ textDecoration: 'none' }}>
          Forgot Password?
        </Typography>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="secondary" fullWidth size="large" type="submit" variant="contained">
            Sign In
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
