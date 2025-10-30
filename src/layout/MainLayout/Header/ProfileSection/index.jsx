import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  TextField, Button, Card, CardContent, InputAdornment, IconButton, AppBar, Toolbar,
  Container, Stack, Snackbar, Alert } from '@mui/material';
import {
  ArrowBack,
  Phone,
  Language
} from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
// assets
import User1 from 'assets/images/users/user-round.svg';
import {
  IconLogout,
  IconUser,
  IconBell,
  IconMapPin,
  IconCheck
} from '@tabler/icons-react';
// ==============================|| PROFILE MENU ||============================== //
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
  const anchorRef = useRef(null);
  const PROFILE_API = "https://api.bookmyevent.ae/api/profile";
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('logRes');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRole) setRole(storedRole);
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
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
         ? (typeof prof.socialLinks === 'string' ? JSON.parse(prof.socialLinks) : prof.socialLinks)
         : {};
        setFormData({
         profilePhoto: null,
         phone: prof.mobileNumber || "",
         website: socialLinks.website || "",
         facebook: socialLinks.facebook || "",
         instagram: socialLinks.instagram || "",
         twitter: socialLinks.twitter || "",
         youtube: socialLinks.youtube || "",
         whatsapp: socialLinks.whatsapp || "",
         other: socialLinks.other || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setToastMessage("Please login again");
        setToastSeverity('error');
        setShowToast(true);
        return;
      }
      const socialLinksObj = {
        website: formData.website || "",
        facebook: formData.facebook || "",
        instagram: formData.instagram || "",
        twitter: formData.twitter || "",
        youtube: formData.youtube || "",
        whatsapp: formData.whatsapp || "",
        other: formData.other || ""
      };
      const updatePayload = new FormData();
      updatePayload.append("mobileNumber", formData.phone);
      updatePayload.append("socialLinks", JSON.stringify(socialLinksObj));
      if (formData.profilePhoto instanceof File) {
        updatePayload.append("profilePhoto", formData.profilePhoto);
      }
      if (!profile?._id) throw new Error("Profile ID not found");
      await axios.put(`${PROFILE_API}/${profile._id}`, updatePayload, {
        headers: {
         Authorization: `Bearer ${token}`,
        }
      });
      setToastMessage("Profile updated successfully!");
      setToastSeverity('success');
      setShowToast(true);
      SetIsedit(false);
      fetchProfile();
    } catch (error) {
      console.error("Update failed:", error);
      setToastMessage(error.response?.data?.message || "Failed to update profile.");
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
                          {(!profilePreview) && (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                        </Avatar>
                      </Badge>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                        {user?.email || 'user@example.com'}
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
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>248</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Orders</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Completed</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>4.8</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Average</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Rating</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>₹2.4L</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Earnings</Typography>
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
                      <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={() => SetIsedit(true)}>
                        <ListItemIcon><IconUser stroke={1.5} size="20px" /></ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2">Edit Profile</Typography>}
                          secondary={<Typography variant="caption" color="textSecondary">Update your profile information</Typography>}
                        />
                      </ListItemButton>
                      <Divider sx={{ my: 1 }} />
                      <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleLogout}>
                        <ListItemIcon><IconLogout stroke={1.5} size="20px" /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                      </ListItemButton>
                    </List>
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
                      maxWidth: '800px',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: 8 }
                    }}
                  >
                  <Box sx={{ flexGrow: 1, bgcolor: '#e67373ff', minHeight: '100vh' }}>
                    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
                      <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="back" onClick={() => SetIsedit(false)} sx={{ mr: 1 }}>
                          <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
                          Profile
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <Container maxWidth="xl" sx={{ py: 3 }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 300, color: '#333', fontStyle: 'italic', mb: 1 }}>
                          Edit Vendor Profile
                        </Typography>
                      </Box>
                      <Card elevation={1} sx={{ borderRadius: 3, bgcolor: '#ffffffff' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" component="h2" sx={{ borderLeft: '4px solid #2196f3', pl: 2, color: '#333', fontWeight: 500 }}>
                              Basic Information
                            </Typography>
                          </Box>
                          <Stack spacing={3}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Profile Photo</Typography>
                              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                  src={profilePreview || User1}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: '#ffc108ff',
                                    fontSize: 56,
                                    fontWeight: 600,
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    mb: 1
                                  }}>
                                  {(!profilePreview) && (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
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
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                      '&:hover': { bgcolor: 'primary.dark' },
                                      width: 40,
                                      height: 40
                                    }}
                                  >
                                    <PhotoCamera fontSize="small" />
                                  </IconButton>
                                </label>
                              </Box>
                              <label htmlFor="profile-photo-upload">
                                <Button variant="outlined" component="span" startIcon={<PhotoCamera />} sx={{ mt: 1 }}>
                                  Upload Photo
                                </Button>
                              </label>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                Recommended size: 200x200px, JPG/PNG
                              </Typography>
                            </Box>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={formData.phone || ""}
                              onChange={handleInputChange('phone')}
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
                            <TextField
                              fullWidth
                              label="Website"
                              value={formData.website || ""}
                              onChange={handleInputChange('website')}
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
                              }}/>
                          </Stack>
                          {/* Social Media */}
                          <Box sx={{ mb: 3, mt: 4 }}>
                            <Typography variant="h6" component="h2" sx={{ borderLeft: '4px solid #2196f3', pl: 2, color: '#333', fontWeight: 500 }}>
                              Social Media Links
                            </Typography>
                          </Box>
                          <Stack spacing={3}>
                            <TextField
                              fullWidth
                              label="Instagram"
                              value={formData.instagram || ""}
                              onChange={handleInputChange('instagram')}
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
                              value={formData.facebook || ""}
                              onChange={handleInputChange('facebook')}
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
                              value={formData.twitter || ""}
                              onChange={handleInputChange('twitter')}
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
                              label="Other"
                              value={formData.other || ""}
                              onChange={handleInputChange('other')}
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
                          </Stack>
                          <Box sx={{ mb: 3, mt: 4 }}>
                            <Typography variant="h6" component="h2" sx={{ borderLeft: '4px solid #2196f3', pl: 2, color: '#333', fontWeight: 500 }}>
                              Video & Content Platforms
                            </Typography>
                          </Box>
                          <Stack spacing={3}>
                            <TextField
                              fullWidth
                              label="YouTube"
                              value={formData.youtube || ""}
                              onChange={handleInputChange('youtube')}
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
                          </Stack>
                          {/* Messaging */}
                          <Box sx={{ mb: 3, mt: 4 }}>
                            <Typography variant="h6" component="h2" sx={{ borderLeft: '4px solid #2196f3', pl: 2, color: '#333', fontWeight: 500 }}>
                              Messaging & Communication
                            </Typography>
                          </Box>
                          <Stack spacing={3}>
                            <TextField
                              fullWidth
                              label="WhatsApp Business"
                              value={formData.whatsapp || ""}
                              onChange={handleInputChange('whatsapp')}
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
                          </Stack>
                          <Divider sx={{ my: 3 }} />
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
                              onClick={handleSave}
                              sx={{
                                borderRadius: 2,
                                py: 1.5,
                                bgcolor: '#E15B65',
                                '&:hover': { bgcolor: '#E15B65' }
                              }}
                            >
                              Save Changes
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="white">
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