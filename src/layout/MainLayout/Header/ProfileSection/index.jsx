import { useEffect, useRef, useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import { useNavigate } from 'react-router-dom'; // Add this import
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import {

  
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Phone,
  Language,
  Email,
  LocationOn
} from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PushPinIcon from '@mui/icons-material/PushPin';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import User1 from 'assets/images/users/user-round.svg';
import {
  IconLogout,
  IconSettings,
  IconUser,
  IconBuilding,
  IconBell,
  IconMoon,
  IconCreditCard,
  IconHelp,
  IconMapPin,
  IconCheck
} from '@tabler/icons-react';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const theme = useTheme();
  const navigate = useNavigate(); // Add this hook
  const { borderRadius } = useConfig();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
const [isedit, SetIsedit] = useState(false)
console.log(isedit);
//edit


  // State for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // Navigation handlers
  const handleBusinessDetails = () => {
    navigate('/business/details');
    setOpen(false);
  };

  const handlePaymentSettings = () => {
    navigate('/payment/settings');
    setOpen(false);
  };

  const handleHelpSupport = () => {
    navigate('/help/support');
    setOpen(false);
  };

  // Toggle handlers
  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
    // Add dark mode logic here
  };

  // ✅ Old working Logout function
  const handleLogout = () => {
    localStorage.clear(); // clears all localStorage items
    navigate('/pages/login'); // keep your existing login route
    setOpen(false);
  };

  // Add logout handler
  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token'); // Remove auth token
    localStorage.removeItem('user'); // Remove user data
    sessionStorage.clear(); // Clear session storage
    
    // Close the menu
    setOpen(false);
    
    // Navigate to sign in page
    navigate('/signin'); // Adjust the path as needed for your app
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      {/* Avatar acts as dropdown trigger */}
      <Avatar
        src={User1}
        alt="user-images"
        sx={{
          ...theme.typography.mediumAvatar,
          margin: '8px 0 8px 8px !important',
          cursor: 'pointer'
        }}
        ref={anchorRef}
        onClick={handleToggle}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
      />

      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: { offset: [0, 14] }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && isedit===false &&(
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{
                      maxHeight: '90vh', // limit popper height
                      overflowY: 'auto', // enable scroll
                      '&::-webkit-scrollbar': { width: 6 }
                    }}
                  >
                    {/* Profile Header Section */}
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: 3,
                        borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
                        color: 'white',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        padding: 0,
                        paddingTop: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                                border: '3px solid white'
                              }}
                            />
                          }
                        >
                          <Avatar
                            src={User1}
                            alt="user-profile"
                            sx={{
                              width: 100,
                              height: 100,
                              border: '4px solid rgba(255,255,255,0.2)',
                              mb: 1
                            }}
                          />
                        </Badge>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                          Jon Dowe
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                          venue vendor
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                          <IconMapPin size={16} style={{ marginRight: 4 }} />
                          <Typography variant="body2">Location</Typography>
                        </Box>
                      </Box>

                      {/* Statistics */}
                      <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
                              248
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Orders
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Completed
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
                              4.8
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Average
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Rating
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
                              ₹2.4L
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Total
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Earnings
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Verification Badge */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          p: 1.5
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconCheck size={20} style={{ color: '#4caf50', marginRight: 8 }} />
                          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                            Verified Vendor
                          </Typography>
                        </Box>
                        <Chip
                          label="Active"
                          sx={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                          size="small"
                        />
                      </Box>
                    </Box>

                    {/* Scrollable Settings Section */}
                    <Box sx={{ p: 2 }}>
                      <Divider />

                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        {/* Edit Profile */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}
                          onClick={() => SetIsedit(true)} >

                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Edit Profile</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">Update your profile information</Typography>}
                          />
                        </ListItemButton>
<<<<<<< HEAD

                        {/* Business Details */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleBusinessDetails}>
                          <ListItemIcon>
                            <IconBuilding stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Business Details</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">Manage your business information</Typography>}
                          />
                        </ListItemButton>

                        {/* Notifications */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                          <ListItemIcon>
                            <IconBell stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Notifications</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">{notificationsEnabled ? 'Enabled' : 'Disabled'}</Typography>}
                          />
                          <Switch checked={notificationsEnabled} onChange={handleNotificationToggle} color="primary" size="small" />
                        </ListItemButton>

                        {/* Dark Mode */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                          <ListItemIcon>
                            <IconMoon stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Dark Mode</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">{darkModeEnabled ? 'Enabled' : 'Disabled'}</Typography>}
                          />
                          <Switch checked={darkModeEnabled} onChange={handleDarkModeToggle} color="primary" size="small" />
                        </ListItemButton>

                        {/* Payment Settings */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handlePaymentSettings}>
                          <ListItemIcon>
                            <IconCreditCard stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Payment Settings</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">Manage payment methods</Typography>}
                          />
                        </ListItemButton>

                        {/* Help & Support */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleHelpSupport}>
                          <ListItemIcon>
                            <IconHelp stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Help & Support</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">Get help and contact support</Typography>}
                          />
                        </ListItemButton>

                        <Divider sx={{ my: 1 }} />

                        {/* ✅ Logout */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleLogout}>
=======
                        <ListItemButton 
                          sx={{ borderRadius: `${borderRadius}px` }} 
                          selected={selectedIndex === 4}
                          onClick={handleLogout} // Add onClick handler
                        >
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
                {/* ----edit profile---- */}
                {open && isedit===true && (
                  
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{
                      maxWidth: '800px',
                      maxHeight: '90vh', // limit popper height
                      overflowY: 'auto', // enable scroll
                      '&::-webkit-scrollbar': { width: 8 }
                    }}
                  >
                    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
                          onClick={() => SetIsedit(false)}

            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Title Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 300, 
              color: '#333',
              fontStyle: 'italic',
              mb: 1
            }}
          >
            Edit Vendor Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your business information.
          </Typography>
        </Box>

        {/* Form Card */}
        <Card elevation={1} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            {/* Section Header */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  borderLeft: '4px solid #2196f3',
                  pl: 2,
                  color: '#333',
                  fontWeight: 500
                }}
              >
                Basic Information
              </Typography>
            </Box>

            <Stack spacing={3}>
              {/* Vendor Name */}
              <TextField
                fullWidth
                label="Vendor Name"
                value={"Tech Solutions"}
                // onChange={handleInputChange('vendorName')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              {/* Phone Number */}
              <TextField
                fullWidth
                label="Phone Number"
                value={"998989898"}
                // onChange={handleInputChange('phoneNumber')}
                variant="outlined"
                type="tel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              {/* Website */}
              <TextField
                fullWidth
                label="Website"
                value={"IconWorldWww.www"}
                // onChange={handleInputChange('website')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              {/* Email Address */}
              <TextField
                fullWidth
                label="Email Address"
                value={"agmail.com"}
                // onChange={handleInputChange('emailAddress')}
                variant="outlined"
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              {/* Business Address */}
              <TextField
                fullWidth
                label="Business Address"
                value={"business ave,city"}
                // onChange={handleInputChange('businessAddress')}
                variant="outlined"
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <LocationOn sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />
            </Stack>

            <Box sx={{ mb: 3, mt: 4 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  borderLeft: '4px solid #2196f3',
                  pl: 2,
                  color: '#333',
                  fontWeight: 500
                }}
              >
                Social Media Links
              </Typography>
            </Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Instagram"
                value="https://instagram.com/techsu"
                // onChange={handleInputChange('instagram')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InstagramIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              <TextField
                fullWidth
                label="Facebook"
                value="https://facebook.com/techsu"
                // onChange={handleInputChange('facebook')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FacebookIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              <TextField
                fullWidth
                label="Twitter / X"
                value="https://twitter.com/techsol"
                // onChange={handleInputChange('twitter')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TwitterIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              <TextField
                fullWidth
                label="LinkedIn"
                value="https://linkedin.com/compa"
                // onChange={handleInputChange('linkedin')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />
            </Stack>

            <Box sx={{ mb: 3, mt: 4 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  borderLeft: '4px solid #2196f3',
                  pl: 2,
                  color: '#333',
                  fontWeight: 500
                }}
              >
                Video & Content Platforms
              </Typography>
            </Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="YouTube"
                value="https://youtube.com/@techs"
                // onChange={handleInputChange('youtube')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <YouTubeIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              <TextField
                fullWidth
                label="TikTok"
                value="https://tiktok.com/@techsol"
                // onChange={handleInputChange('tiktok')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MusicNoteIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />
            </Stack>

            <Box sx={{ mb: 3, mt: 4 }}>
            
            </Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Pinterest"
                value="https://pinterest.com/techs"
                // onChange={handleInputChange('pinterest')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PushPinIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              <TextField
                fullWidth
                label="Snapchat"
                value="https://snapchat.com/add/t."
                // onChange={handleInputChange('snapchat')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CameraAltIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />
            </Stack>

            <Box sx={{ mb: 3, mt: 4 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  borderLeft: '4px solid #2196f3',
                  pl: 2,
                  color: '#333',
                  fontWeight: 500
                }}
              >
                Messaging & Communication
              </Typography>
            </Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="WhatsApp Business"
                value="+1 (555) 123-4567"
                // onChange={handleInputChange('whatsapp')}
                variant="outlined"
                type="tel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WhatsAppIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />

              <TextField
                fullWidth
                label="Telegram"
                value="https://t.me/techsolutions"
                // onChange={handleInputChange('telegram')}
                variant="outlined"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TelegramIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }
                }}
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
              onClick={() => SetIsedit(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: '#ddd',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#bbb',
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
              onClick={() => SetIsedit(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  bgcolor: '#2196f3',
                  '&:hover': {
                    bgcolor: '#1976d2'
                  }
                }}
              >
                Save Changes
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Keep your profile updated to help customers find and connect with you
          </Typography>
        </Box>
      </Container>
    </Box>
                    </MainCard>
                  
                )}

              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}