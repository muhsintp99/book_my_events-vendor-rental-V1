import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import {
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from '@mui/material';
import { ArrowBack, Phone, Language, Business, Store, Email, Web } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TelegramIcon from '@mui/icons-material/Telegram';
import ForumIcon from '@mui/icons-material/Forum';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PaymentIcon from '@mui/icons-material/Payment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BusinessIcon from '@mui/icons-material/Business';
import LockResetIcon from '@mui/icons-material/LockReset';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconUser, IconMapPin, IconCheck } from '@tabler/icons-react';

export default function ProfileSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { borderRadius } = useConfig();
  const [open, setOpen] = useState(false);
  const [isedit, SetIsedit] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const anchorRef = useRef(null);
  const PROFILE_API = 'https://api.bookmyevent.ae/api/profile/';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // const storedRole = localStorage.getItem('logRes');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role) setRole(parsedUser.role);
    }
    fetchProfile();
    const savedNotifications = localStorage.getItem('notificationsEnabled');
    const savedDarkMode = localStorage.getItem('darkModeEnabled');
    if (savedNotifications !== null) setNotificationsEnabled(savedNotifications === 'true');
    if (savedDarkMode !== null) setDarkModeEnabled(savedDarkMode === 'true');
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { data } = await axios.get(PROFILE_API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success && data.data.length > 0) {
        const prof = data.data[0];
        setProfile(prof);
        setProfilePreview(prof.profilePhoto ? `https://api.bookmyevent.ae${prof.profilePhoto}` : null);
        const socialLinks = prof.socialLinks
          ? typeof prof.socialLinks === 'string'
            ? JSON.parse(prof.socialLinks)
            : prof.socialLinks
          : {};
        setFormData({
          profilePhoto: null,
          vendorName: prof.vendorName || prof.name || '',
          email: prof.email || '',
          phone: prof.mobileNumber || '',
          website: socialLinks.website || '',
          businessAddress: prof.businessAddress || prof.address || '',
          facebook: socialLinks.facebook || '',
          instagram: socialLinks.instagram || '',
          twitter: socialLinks.twitter || '',
          youtube: socialLinks.youtube || '',
          linkedin: socialLinks.linkedin || '',
          pinterest: socialLinks.pinterest || '',
          snapchat: socialLinks.snapchat || '',
          whatsapp: socialLinks.whatsapp || '',
          telegram: socialLinks.telegram || '',
          other: socialLinks.other || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSocialLinkChange = handleInputChange;

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToastMessage('Please login again');
        setToastSeverity('error');
        setShowToast(true);
        return;
      }
      const socialLinksObj = {
        website: formData.website || '',
        facebook: formData.facebook || '',
        instagram: formData.instagram || '',
        twitter: formData.twitter || '',
        youtube: formData.youtube || '',
        linkedin: formData.linkedin || '',
        pinterest: formData.pinterest || '',
        snapchat: formData.snapchat || '',
        whatsapp: formData.whatsapp || '',
        telegram: formData.telegram || '',
        other: formData.other || ''
      };
      const updatePayload = new FormData();
      updatePayload.append('vendorName', formData.vendorName);
      updatePayload.append('mobileNumber', formData.phone);
      updatePayload.append('businessAddress', formData.businessAddress);
      updatePayload.append('socialLinks', JSON.stringify(socialLinksObj));
      if (formData.profilePhoto instanceof File) {
        updatePayload.append('profilePhoto', formData.profilePhoto);
      }
      updatePayload.append('role', role || 'vendor'); // Fallback to 'vendor' if role is missing
      if (!profile?._id) throw new Error('Profile ID not found');
      await axios.put(`${PROFILE_API}/${profile._id}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToastMessage('Profile updated successfully!');
      setToastSeverity('success');
      setShowToast(true);
      SetIsedit(false);
      fetchProfile();
    } catch (error) {
      console.error('Update failed:', error);
      setToastMessage(error.response?.data?.message || 'Failed to update profile.');
      setToastSeverity('error');
      setShowToast(true);
    }
  };

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('logRes');
    sessionStorage.clear();
    setOpen(false);
    navigate('/login');
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', newValue.toString());
    setToastMessage(newValue ? 'Notifications enabled' : 'Notifications disabled');
    setToastSeverity('success');
    setShowToast(true);
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkModeEnabled;
    setDarkModeEnabled(newValue);
    localStorage.setItem('darkModeEnabled', newValue.toString());
    setToastMessage(newValue ? 'Dark mode enabled' : 'Dark mode disabled');
    setToastSeverity('success');
    setShowToast(true);
  };

  const handleResetPassword = () => {
    setToastMessage('Reset Password feature is coming soon!');
    setToastSeverity('info');
    setShowToast(true);
  };

  const handleBusinessDetails = () => {
    setToastMessage('Business Details feature is coming soon!');
    setToastSeverity('info');
    setShowToast(true);
  };

  const handlePaymentSettings = () => {
    setToastMessage('Payment Settings feature is coming soon!');
    setToastSeverity('info');
    setShowToast(true);
  };

  const handleHelpSupport = () => {
    setToastMessage('Help & Support feature is coming soon!');
    setToastSeverity('info');
    setShowToast(true);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false);
  };

  const SettingsItem = ({ icon, title, subtitle, onClick, endAction, showArrow = true }) => (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderColor: 'transparent',
            transform: 'translateY(-1px)'
          }
          : {}
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            bgcolor: 'rgba(225, 91, 101, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            flexShrink: 0
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {endAction || (showArrow && <ChevronRightIcon sx={{ color: 'text.secondary', ml: 1 }} />)}
      </Box>
    </Card>
  );

  const StyledSwitch = ({ checked, onChange }) => (
    <Switch
      checked={checked}
      onChange={onChange}
      sx={{
        width: 52,
        height: 28,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: '2px',
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(24px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#E15B65',
              opacity: 1,
              border: 0
            }
          }
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 24,
          height: 24
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: '#E9E9EA',
          opacity: 1
        }
      }}
    />
  );

  return (
    <>
      <Avatar
        src={profilePreview || undefined}
        alt="user-avatar"
        sx={{
          ...theme.typography.mediumAvatar,
          margin: '8px 0 8px 8px !important',
          cursor: 'pointer',
          bgcolor: '#cbb406ff',
          color: '#fff',
          fontWeight: 600
        }}
        ref={anchorRef}
        onClick={handleToggle}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
      >
        {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
      </Avatar>
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 14] } }]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && isedit === false && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{
                      maxHeight: '90vh',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: 6 }
                    }}
                  >
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #e8888fff 0%, #b2434cff 100%)',
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
                            src={profilePreview || User1}
                            sx={{
                              width: 100,
                              height: 100,
                              border: '4px solid rgba(190, 136, 136, 0.27)',
                              mb: 1,
                              bgcolor: '#ffc108ff',
                              fontSize: 48,
                              fontWeight: 600,
                              color: '#fff',
                              textTransform: 'uppercase'
                            }}
                          >
                            {!profilePreview && (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                          </Avatar>
                        </Badge>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                          {profile?.vendorName || user?.vendorName || user?.name || user?.email || 'User'}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                          {role || 'venue vendor'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                          <IconMapPin size={16} style={{ marginRight: 4 }} />
                          <Typography variant="body2">Location</Typography>
                        </Box>
                      </Box>
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
                          <IconCheck size={20} style={{ color: '#56d85aff', marginRight: 8 }} />
                          <Typography variant="body2" sx={{ color: '#53d757ff', fontWeight: 500 }}>
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
                    <Box sx={{ p: 2.5, bgcolor: '#f8f9fa' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2, pl: 0.5 }}>
                        Settings
                      </Typography>

                      <SettingsItem
                        icon={<IconUser size={24} style={{ color: '#E15B65' }} />}
                        title="Edit Profile"
                        subtitle="Update your profile information"
                        onClick={() => SetIsedit(true)}
                      />

                      <SettingsItem
                        icon={<LockResetIcon sx={{ fontSize: 24, color: '#E15B65' }} />}
                        title="Reset Password"
                        subtitle="Update your password"
                        onClick={handleResetPassword}
                      />

                      <SettingsItem
                        icon={<BusinessIcon sx={{ fontSize: 24, color: '#E15B65' }} />}
                        title="Business Details"
                        subtitle="Manage your business information"
                        onClick={handleBusinessDetails}
                      />

                      <SettingsItem
                        icon={<NotificationsIcon sx={{ fontSize: 24, color: '#E15B65' }} />}
                        title="Notifications"
                        subtitle={notificationsEnabled ? 'Enabled' : 'Disabled'}
                        showArrow={false}
                        endAction={
                          <StyledSwitch
                            checked={notificationsEnabled}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleNotificationsToggle();
                            }}
                          />
                        }
                      />

                      <SettingsItem
                        icon={<DarkModeIcon sx={{ fontSize: 24, color: '#E15B65' }} />}
                        title="Dark Mode"
                        subtitle={darkModeEnabled ? 'Enabled' : 'Disabled'}
                        showArrow={false}
                        endAction={
                          <StyledSwitch
                            checked={darkModeEnabled}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleDarkModeToggle();
                            }}
                          />
                        }
                      />

                      <SettingsItem
                        icon={<PaymentIcon sx={{ fontSize: 24, color: '#E15B65' }} />}
                        title="Payment Settings"
                        subtitle="Manage payment methods"
                        onClick={handlePaymentSettings}
                      />

                      <SettingsItem
                        icon={<HelpOutlineIcon sx={{ fontSize: 24, color: '#E15B65' }} />}
                        title="Help & Support"
                        subtitle="Get help and contact support"
                        onClick={handleHelpSupport}
                      />

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleLogout}
                        startIcon={<IconLogout size={20} />}
                        sx={{
                          mt: 2,
                          py: 1.75,
                          borderRadius: 3,
                          bgcolor: '#E15B65',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 14px rgba(225, 91, 101, 0.4)',
                          '&:hover': {
                            bgcolor: '#c94a53',
                            boxShadow: '0 6px 20px rgba(225, 91, 101, 0.5)'
                          }
                        }}
                      >
                        Logout
                      </Button>
                    </Box>
                  </MainCard>
                )}
                {open && isedit === true && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{
                      maxWidth: '700px',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: 8 }
                    }}
                  >
                    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa' }}>
                      {/* Header */}
                      <AppBar
                        position="sticky"
                        elevation={0}
                        sx={{
                          bgcolor: 'white',
                          color: 'text.primary',
                          borderBottom: '1px solid #e0e0e0',
                          backdropFilter: 'blur(8px)',
                          background: 'rgba(255, 255, 255, 0.95)'
                        }}
                      >
                        <Toolbar sx={{ px: 3 }}>
                          <IconButton edge="start" color="inherit" onClick={() => SetIsedit(false)} sx={{ mr: 2 }}>
                            <ArrowBack />
                          </IconButton>
                          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#1a1a1a' }}>
                            Edit Profile
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={handleSave}
                            disableElevation
                            sx={{
                              bgcolor: '#E15B65',
                              borderRadius: '8px',
                              px: 3,
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              '&:hover': { bgcolor: '#c94a53' }
                            }}
                          >
                            Save
                          </Button>
                        </Toolbar>
                      </AppBar>

                      <Box sx={{ p: 4 }}>
                        {/* Profile Header Card */}
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            border: '1px solid #e0e0e0',
                            mb: 4,
                            overflow: 'visible',
                            background: 'linear-gradient(135deg, #fff9f5 0%, #ffffff 100%)'
                          }}
                        >
                          <Box sx={{ h: 120, background: 'linear-gradient(135deg, #E15B65 0%, #ff8e53 100%)', height: '100px' }} />
                          <CardContent sx={{ pt: 0, pb: 3, '&:last-child': { pb: 3 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -5.5, mb: 1 }}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar
                                  src={profilePreview || User1}
                                  sx={{
                                    width: 110,
                                    height: 110,
                                    border: '5px solid white',
                                    boxShadow: '0 4px 16px rgba(225, 91, 101, 0.2)',
                                    bgcolor: '#fff',
                                    color: '#E15B65',
                                    fontSize: 44,
                                    fontWeight: 700
                                  }}
                                >
                                  {!profilePreview && (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                                </Avatar>
                                <input
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  id="profile-photo-upload"
                                  type="file"
                                  onChange={handleProfileImageUpload}
                                />
                                <label htmlFor="profile-photo-upload">
                                  <IconButton
                                    component="span"
                                    sx={{
                                      position: 'absolute',
                                      bottom: 0,
                                      right: 0,
                                      bgcolor: '#E15B65',
                                      color: 'white',
                                      border: '3px solid white',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                      '&:hover': { bgcolor: '#c94a53' },
                                      width: 40,
                                      height: 40,
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    <PhotoCamera sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </label>
                              </Box>
                              <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: '#1a1a1a' }}>
                                  {formData.vendorName || user?.name || 'Vendor Name'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Vendor'}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>

                        {/* Basic Information Section */}
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                            <Box sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '8px',
                              bgcolor: 'rgba(225, 91, 101, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Store sx={{ color: '#E15B65', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                              Basic Information
                            </Typography>
                          </Box>
                          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3 }}>
                              <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Vendor Name"
                                    value={formData.vendorName || ''}
                                    onChange={handleInputChange('vendorName')}
                                    placeholder="Enter your vendor name"
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><Store sx={{ color: '#999', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#E15B65' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={formData.email || ''}
                                    placeholder="Your email address"
                                    slotProps={{
                                      input: { readOnly: true }
                                    }}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><Email sx={{ color: '#999', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: '#f5f5f5',
                                        cursor: 'not-allowed'
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange('phone')}
                                    placeholder="Enter phone number"
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#999', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#E15B65' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Website"
                                    value={formData.website || ''}
                                    onChange={handleSocialLinkChange('website')}
                                    placeholder="https://yourwebsite.com"
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><Web sx={{ color: '#999', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#E15B65' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Business Address"
                                    value={formData.businessAddress || ''}
                                    onChange={handleInputChange('businessAddress')}
                                    placeholder="Enter your complete business address"
                                    multiline
                                    rows={2}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                          <Business sx={{ color: '#999', fontSize: 22 }} />
                                        </InputAdornment>
                                      )
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#E15B65' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Box>

                        {/* Social Media Section */}
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                            <Box sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '8px',
                              bgcolor: 'rgba(225, 91, 101, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Language sx={{ color: '#E15B65', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                              Social Media & Links
                            </Typography>
                          </Box>
                          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3 }}>
                              <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Instagram"
                                    placeholder="https://instagram.com/..."
                                    value={formData.instagram || ''}
                                    onChange={handleSocialLinkChange('instagram')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><InstagramIcon sx={{ color: '#E1306C', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#E1306C' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Facebook"
                                    placeholder="https://facebook.com/..."
                                    value={formData.facebook || ''}
                                    onChange={handleSocialLinkChange('facebook')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><FacebookIcon sx={{ color: '#1877F2', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#1877F2' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Twitter / X"
                                    placeholder="https://twitter.com/..."
                                    value={formData.twitter || ''}
                                    onChange={handleSocialLinkChange('twitter')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><TwitterIcon sx={{ color: '#1DA1F2', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#1DA1F2' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="LinkedIn"
                                    placeholder="https://linkedin.com/..."
                                    value={formData.linkedin || ''}
                                    onChange={handleSocialLinkChange('linkedin')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><LinkedInIcon sx={{ color: '#0A66C2', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#0A66C2' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="YouTube"
                                    placeholder="https://youtube.com/..."
                                    value={formData.youtube || ''}
                                    onChange={handleSocialLinkChange('youtube')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><YouTubeIcon sx={{ color: '#FF0000', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#FF0000' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Pinterest"
                                    placeholder="https://pinterest.com/..."
                                    value={formData.pinterest || ''}
                                    onChange={handleSocialLinkChange('pinterest')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><PinterestIcon sx={{ color: '#BD081C', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#BD081C' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Snapchat"
                                    placeholder="Snapchat username"
                                    value={formData.snapchat || ''}
                                    onChange={handleInputChange('snapchat')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><ForumIcon sx={{ color: '#FFFC00', filter: 'drop-shadow(0 0 1px #000)', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#E15B65' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Telegram"
                                    placeholder="Telegram username"
                                    value={formData.telegram || ''}
                                    onChange={handleInputChange('telegram')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><TelegramIcon sx={{ color: '#0088cc', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#0088cc' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="WhatsApp Business"
                                    placeholder="+91 XXXXXXXXXX"
                                    value={formData.whatsapp || ''}
                                    onChange={handleInputChange('whatsapp')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><WhatsAppIcon sx={{ color: '#25D366', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#25D366' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Other"
                                    placeholder="Other link"
                                    value={formData.other || ''}
                                    onChange={handleInputChange('other')}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><Language sx={{ color: '#999', fontSize: 22 }} /></InputAdornment>,
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white',
                                        '&:hover fieldset': { borderColor: '#E15B65' }
                                      },
                                      '& .MuiOutlinedInput-input': { fontSize: '0.95rem' }
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Box>

                        {/* Footer Info */}
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
      <Snackbar
        open={showToast}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleToastClose} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}