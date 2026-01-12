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

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
  const [vendorType, setVendorType] = useState('');
  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const anchorRef = useRef(null);
  const PROFILE_API = 'https://api.bookmyevent.ae/api/profile/';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedVendorType = localStorage.getItem('logRes');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role) setRole(parsedUser.role);

      // Pre-populate formData from localStorage user if available
      const social = parsedUser.socialMedia || {};
      setFormData((prev) => ({
        ...prev,
        vendorName: parsedUser.firstName && parsedUser.lastName ? `${parsedUser.firstName} ${parsedUser.lastName}` : parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || parsedUser.mobile || '',
        website: social.website || '',
        facebook: social.facebook || '',
        instagram: social.instagram || '',
        twitter: social.twitter || '',
        linkedin: social.linkedin || '',
        youtube: social.youtube || '',
        pinterest: social.pinterest || '',
        whatsapp: social.whatsapp || '',
        other: social.other || ''
      }));
    }
    if (storedVendorType) {
      setVendorType(storedVendorType);
    }
    fetchProfile();
    const savedNotifications = localStorage.getItem('notificationsEnabled');
    if (savedNotifications !== null) setNotificationsEnabled(savedNotifications === 'true');
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Get user string

    if (!token || !storedUser) return;

    // Parse user to get the ID
    const currentUser = JSON.parse(storedUser);
    const userId = currentUser._id || currentUser.id; // Support both _id and id

    try {
      // Use the new provider-specific endpoint for profile data
      const { data } = await axios.get(`${PROFILE_API}provider/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Backend returns { success: true, data: { ...profile } } -> Single Object
      if (data.success && data.data) {
        const prof = data.data; // Directly use data.data

        setProfile(prof);
        setProfilePreview(prof.profilePhoto ? `https://api.bookmyevent.ae${prof.profilePhoto}` : null);

        const socialLinks = prof.socialLinks
          ? typeof prof.socialLinks === 'string'
            ? JSON.parse(prof.socialLinks)
            : prof.socialLinks
          : {};

        setFormData({
          profilePhoto: null,
          vendorName: prof.vendorName || prof.name || currentUser.name || '',
          email: prof.email || currentUser.email || '',
          phone: prof.mobileNumber || currentUser.phone || currentUser.mobile || '',
          website: socialLinks.website || (currentUser.socialMedia && currentUser.socialMedia.website) || '',
          businessAddress: prof.businessAddress || prof.address || '',
          facebook: socialLinks.facebook || (currentUser.socialMedia && currentUser.socialMedia.facebook) || '',
          instagram: socialLinks.instagram || (currentUser.socialMedia && currentUser.socialMedia.instagram) || '',
          twitter: socialLinks.twitter || (currentUser.socialMedia && currentUser.socialMedia.twitter) || '',
          youtube: socialLinks.youtube || (currentUser.socialMedia && currentUser.socialMedia.youtube) || '',
          linkedin: socialLinks.linkedin || (currentUser.socialMedia && currentUser.socialMedia.linkedin) || '',
          pinterest: socialLinks.pinterest || (currentUser.socialMedia && currentUser.socialMedia.pinterest) || '',
          snapchat: socialLinks.snapchat || (currentUser.socialMedia && currentUser.socialMedia.snapchat) || '',
          whatsapp: socialLinks.whatsapp || (currentUser.socialMedia && currentUser.socialMedia.whatsapp) || '',
          telegram: socialLinks.telegram || (currentUser.socialMedia && currentUser.socialMedia.telegram) || '',
          other: socialLinks.other || (currentUser.socialMedia && currentUser.socialMedia.other) || ''
        });
      }

      // Fetch vendor profile separately to get the logo
      try {
        const vendorResponse = await axios.get(`https://api.bookmyevent.ae/api/profile/vendor/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (vendorResponse.data.success && vendorResponse.data.data && vendorResponse.data.data.logo) {
          // Update profile preview with logo from vendor API
          const logoUrl = `https://api.bookmyevent.ae${vendorResponse.data.data.logo}`;
          setProfilePreview(logoUrl);
        }
      } catch (vendorError) {
        console.error('Failed to fetch vendor logo:', vendorError);
        // Continue with existing profile photo if vendor API fails
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
                        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1, textTransform: 'capitalize' }}>
                          {vendorType || role || 'vendor'}
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
                      maxWidth: '850px',
                      maxHeight: '92vh',
                      overflowY: 'auto',
                      borderRadius: 4,
                      '&::-webkit-scrollbar': { width: 6 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                    }}
                  >
                    <Box sx={{ flexGrow: 1, bgcolor: '#ffffff' }}>
                      {/* Header */}
                      <AppBar
                        position="sticky"
                        elevation={0}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(12px)',
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          color: 'text.primary',
                          zIndex: 10
                        }}
                      >
                        <Toolbar sx={{ px: { xs: 2, sm: 4 }, minHeight: 70 }}>
                          <IconButton edge="start" onClick={() => SetIsedit(false)} sx={{ mr: 2, bgcolor: 'action.hover' }}>
                            <ArrowBack sx={{ fontSize: 20 }} />
                          </IconButton>
                          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
                            Edit Profile
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={handleSave}
                            disableElevation
                            sx={{
                              bgcolor: '#E15B65',
                              borderRadius: 2.5,
                              px: 4,
                              py: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              boxShadow: '0 4px 12px rgba(225, 91, 101, 0.25)',
                              '&:hover': {
                                bgcolor: '#c94a53',
                                boxShadow: '0 6px 16px rgba(225, 91, 101, 0.35)'
                              }
                            }}
                          >
                            Save Changes
                          </Button>
                        </Toolbar>
                      </AppBar>

                      <Box sx={{ p: { xs: 3, sm: 5 } }}>
                        {/* Profile Header Card */}
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            mb: 5,
                            overflow: 'visible',
                            background: '#fff'
                          }}
                        >
                          <Box
                            sx={{
                              height: 140,
                              background: 'linear-gradient(135deg, #E15B65 0%, #ff8e53 100%)',
                              borderTopLeftRadius: 16,
                              borderTopRightRadius: 16,
                              opacity: 0.9
                            }}
                          />
                          <CardContent sx={{ pt: 0, pb: 4, '&:last-child': { pb: 4 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -7, mb: 1 }}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar
                                  src={profilePreview || User1}
                                  sx={{
                                    width: 130,
                                    height: 130,
                                    border: '6px solid white',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    bgcolor: '#fff',
                                    color: '#E15B65',
                                    fontSize: 52,
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
                                      bottom: 5,
                                      right: 5,
                                      bgcolor: '#E15B65',
                                      color: 'white',
                                      border: '4px solid white',
                                      boxShadow: '0 4px 12px rgba(225, 91, 101, 0.3)',
                                      '&:hover': { bgcolor: '#c94a53', transform: 'scale(1.05)' },
                                      width: 44,
                                      height: 44,
                                      transition: 'all 0.2s ease-in-out'
                                    }}
                                  >
                                    <PhotoCamera sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </label>
                              </Box>
                              <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary', letterSpacing: '-0.02em' }}>
                                  {formData.vendorName || user?.name || 'Vendor Name'}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: '0.01em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                  {vendorType ? vendorType : role ? role : 'Vendor'}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>

                        <Box sx={{ mb: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box sx={{
                              width: 42,
                              height: 42,
                              borderRadius: 2.5,
                              bgcolor: 'rgba(225, 91, 101, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(225, 91, 101, 0.15)'
                            }}>
                              <Store sx={{ color: '#E15B65', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                              Basic Information
                            </Typography>
                          </Box>
                          <Grid container spacing={3.5}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Vendor Name"
                                value={formData.vendorName || ''}
                                onChange={handleInputChange('vendorName')}
                                placeholder="Enter your vendor name"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start"><Store sx={{ color: '#334155', fontSize: 20, opacity: 0.7 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#E15B65' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><Email sx={{ color: '#334155', fontSize: 20, opacity: 0.7 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    bgcolor: 'rgba(0,0,0,0.02)',
                                    '& fieldset': { borderColor: 'divider' },
                                    '& input': { color: 'text.secondary' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#334155', fontSize: 20, opacity: 0.7 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#E15B65' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><Web sx={{ color: '#334155', fontSize: 20, opacity: 0.7 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#E15B65' }
                                  }
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
                                rows={3}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                      <Business sx={{ color: '#334155', fontSize: 20, opacity: 0.7 }} />
                                    </InputAdornment>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#E15B65' }
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                        {/* Social Media Section */}
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box sx={{
                              width: 42,
                              height: 42,
                              borderRadius: 2.5,
                              bgcolor: 'rgba(225, 91, 101, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(225, 91, 101, 0.15)'
                            }}>
                              <Language sx={{ color: '#E15B65', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                              Social Media & Links
                            </Typography>
                          </Box>
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Instagram"
                                placeholder="https://instagram.com/..."
                                value={formData.instagram || ''}
                                onChange={handleSocialLinkChange('instagram')}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start"><InstagramIcon sx={{ color: '#E1306C', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#E1306C' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><FacebookIcon sx={{ color: '#1877F2', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#1877F2' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><TwitterIcon sx={{ color: '#1DA1F2', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#1DA1F2' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><LinkedInIcon sx={{ color: '#0A66C2', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#0A66C2' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#25D366' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><TelegramIcon sx={{ color: '#0088cc', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#0088cc' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><YouTubeIcon sx={{ color: '#FF0000', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#FF0000' }
                                  }
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
                                  startAdornment: <InputAdornment position="start"><PinterestIcon sx={{ color: '#BD081C', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#BD081C' }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Other"
                                placeholder="Other links..."
                                value={formData.other || ''}
                                onChange={handleSocialLinkChange('other')}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start"><Language sx={{ color: '#64748b', fontSize: 20 }} /></InputAdornment>,
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    '&:hover fieldset': { borderColor: '#64748b' }
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Footer Info */}
                        <Box sx={{ textAlign: 'center', py: 2, opacity: 0.6 }}>
                          <Typography variant="caption" color="text.secondary">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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