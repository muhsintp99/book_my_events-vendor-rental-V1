import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Stack,
  Alert,
  InputAdornment,
  Fade,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  Edit,
  Save,
  CurrencyRupee,
  LocalOffer,
  Title as TitleIcon,
  Description,
  Image,
  AddCircle,
  RemoveCircle
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Styled Components
const GradientPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
  borderRadius: 32,
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.08),
  boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: 'linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 100%)'
  }
}));

const PremiumCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: 24,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  padding: theme.spacing(3),
  height: '100%',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'default',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(255, 154, 158, 0.15)',
    borderColor: alpha('#FF9A9E', 0.2)
  }
}));

const GlassIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: 20,
  background: 'linear-gradient(135deg, #fff 0%, #f0f4f8 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease',
  '& img': {
    width: '70%',
    height: '70%',
    objectFit: 'contain'
  }
}));

const ActionButton = styled(IconButton)(({ theme, variant }) => ({
  backgroundColor: variant === 'delete' ? alpha(theme.palette.error.main, 0.05) : alpha(theme.palette.primary.main, 0.05),
  color: variant === 'delete' ? theme.palette.error.main : theme.palette.primary.main,
  margin: theme.spacing(0, 0.5),
  '&:hover': {
    backgroundColor: variant === 'delete' ? theme.palette.error.main : theme.palette.primary.main,
    color: '#fff',
    transform: 'scale(1.1)'
  },
  transition: 'all 0.2s ease'
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #e0e0e0',
  borderRadius: 16,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: '#fafafa',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#FF9A9E',
    backgroundColor: '#fff9f9'
  }
}));

const PriceCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  border: '1px solid #f0f0f0',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#FF9A9E',
    boxShadow: '0 4px 12px rgba(255, 154, 158, 0.1)'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  textTransform: 'none',
  fontWeight: 700,
  padding: theme.spacing(1.8, 4),
  fontSize: '1rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  letterSpacing: '0.5px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
}));

const SaveButton = styled(StyledButton, {
  shouldForwardProp: (prop) => prop !== '$isEditing'
})(({ theme, $isEditing }) => ({
  background: $isEditing
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  color: '#fff',
  border: 'none',
  minWidth: 260,
  fontSize: '1.05rem',
  padding: theme.spacing(2, 6),
  boxShadow: '0 10px 20px rgba(30, 60, 114, 0.2)',
  '&:hover': {
    background: $isEditing
      ? 'linear-gradient(135deg, #5a6fd6 0%, #6a4491 100%)'
      : 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
    boxShadow: '0 15px 30px rgba(30, 60, 114, 0.3)',
    transform: 'translateY(-3px)'
  },
  '&:disabled': {
    background: '#e0e0e0',
    color: '#9e9e9e'
  }
}));

const CakeAddonsAdmin = () => {
  const [addons, setAddons] = useState([{ id: 1, name: '', price: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [existingAddons, setExistingAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('User Data from LocalStorage:', userData);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const pid = user._id || user.id || user.providerId || user.vendorId;
        console.log('Determined Provider ID:', pid);
        if (pid && pid !== 'null' && pid !== 'undefined') {
          setProviderId(pid);
        } else {
          console.warn('No valid ID found in user object');
          setError('Could not identify vendor session. Login again.');
        }
      } catch (e) {
        console.error('Error parsing session data:', e);
        setError('Session corrupted. Please login again.');
      }
    } else {
      console.warn('No user data found in localStorage');
      setError('You must be logged in to manage add-ons.');
    }
  }, []);

  useEffect(() => {
    if (providerId) {
      fetchAddons();
    }
  }, [providerId]);

  const fetchAddons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api.bookmyevent.ae/api/cake-addons/provider/${providerId}`);
      console.log('API Response for Addons:', res.data);
      if (res.data.success) {
        setExistingAddons(res.data.data || []);
      } else {
        setExistingAddons([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch existing addons');
      setExistingAddons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setAddons([...addons, { id: Date.now(), name: '', price: '' }]);
  };

  const handleRemoveRow = (id) => {
    if (addons.length > 1) {
      setAddons(addons.filter((addon) => addon.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setAddons(addons.map((addon) => (addon.id === id ? { ...addon, [field]: value } : addon)));
  };

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIcon(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title) {
      setError('Title is required');
      return;
    }
    if (!providerId) {
      setError('Provider ID not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('provider', providerId);

      const priceList = addons.map(a => ({ name: a.name, price: parseFloat(a.price) || 0 }));
      formData.append('priceList', JSON.stringify(priceList));

      if (iconFile) {
        formData.append('icon', iconFile);
      }

      let res;
      if (editingId) {
        res = await axios.put(`https://api.bookmyevent.ae/api/cake-addons/${editingId}`, formData);
      } else {
        res = await axios.post('https://api.bookmyevent.ae/api/cake-addons', formData);
      }

      if (res.data.success) {
        setSaved(true);
        handleReset();
        fetchAddons();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save addon');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addon) => {
    setEditingId(addon._id);
    setTitle(addon.title);
    setDescription(addon.description || '');
    setIcon(addon.icon);
    setIconFile(null);
    setAddons(addon.priceList.map((p, idx) => ({ id: idx, name: p.name, price: p.price.toString() })));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this addon group?')) return;
    try {
      setLoading(true);
      const res = await axios.delete(`https://api.bookmyevent.ae/api/cake-addons/${id}`);
      if (res.data.success) {
        fetchAddons();
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete addon');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setIcon(null);
    setIconFile(null);
    setAddons([{ id: 1, name: '', price: '' }]);
  };

  const calculateTotal = () => {
    return addons
      .reduce((sum, addon) => {
        const price = parseFloat(addon.price) || 0;
        return sum + price;
      }, 0)
      .toFixed(2);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 3 }}>
      <GradientPaper sx={{ p: { xs: 3, md: 5 } }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <LocalOffer fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Cake Add-ons Manager
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create beautiful add-ons with pricing, descriptions, and images
              </Typography>
            </Box>
          </Box>
          <Chip label={`${addons.length} add-on${addons.length !== 1 ? 's' : ''}`} color="primary" variant="outlined" sx={{ mt: 1 }} />
        </Box>

        {/* Alerts */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Fade in={saved}>
            <Alert severity="success" sx={{ borderRadius: 2 }} onClose={() => setSaved(false)}>
              Add-ons saved successfully!
            </Alert>
          </Fade>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Stack>

        <Grid container spacing={2.5}>
          {/* Left Column - Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Title & Description */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TitleIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Basic Information
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Add-ons Title"
                    placeholder="Premium Frosting & Decoration Options"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Edit fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    placeholder="Describe what makes these add-ons special..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Add-ons Pricing */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CurrencyRupee color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Add-ons Pricing
                    </Typography>
                  </Box>
                  <Chip label={`Total: ₹${calculateTotal()}`} color="primary" icon={<CurrencyRupee />} variant="filled" />
                </Box>

                <Stack spacing={2}>
                  {addons.map((addon, index) => (
                    <PriceCard key={addon.id}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                              fullWidth
                              label="Add-on Name"
                              placeholder="Chocolate Ganache Drizzle"
                              value={addon.name}
                              onChange={(e) => handleChange(addon.id, 'name', e.target.value)}
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 1 }
                              }}
                            />
                          </Grid>

                          <Grid size={{ xs: 8, sm: 5 }}>
                            <TextField
                              fullWidth
                              label="Price"
                              placeholder="9.99"
                              value={addon.price}
                              onChange={(e) => handleChange(addon.id, 'price', e.target.value)}
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CurrencyRupee fontSize="small" />
                                  </InputAdornment>
                                )
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 1 }
                              }}
                            />
                          </Grid>

                          <Grid size={{ xs: 4, sm: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveRow(addon.id)}
                                disabled={addons.length === 1}
                                size="small"
                              >
                                <RemoveCircle />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </PriceCard>
                  ))}
                </Stack>

                <StyledButton
                  startIcon={<AddCircle />}
                  onClick={handleAddRow}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  Add New Add-on Row
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Image & Preview */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Image Upload */}
            {/* Icon Upload */}
            <Card xs={12} sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Image color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Add-on Icon
                  </Typography>
                </Box>

                <UploadBox onClick={() => document.getElementById('icon-upload')?.click()}>
                  <input id="icon-upload" hidden type="file" accept="image/svg+xml,image/png" onChange={handleIconUpload} />

                  {icon ? (
                    <Stack spacing={2} alignItems="center">
                      <Avatar src={icon} sx={{ width: 80, height: 80, bgcolor: 'grey.100' }} />
                      <Button variant="outlined" startIcon={<CloudUpload />} size="small">
                        Change Icon
                      </Button>
                    </Stack>
                  ) : (
                    <Stack spacing={1.5} alignItems="center">
                      <AddCircle sx={{ fontSize: 56, color: 'text.secondary' }} />
                      <Typography variant="body1">Upload an add-on icon</Typography>
                      <Typography variant="body2" color="text.secondary">
                        SVG or PNG (icon style)
                      </Typography>
                    </Stack>
                  )}
                </UploadBox>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: 'primary.light' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Preview
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Title
                  </Typography>
                  <Typography variant="body1">{title || 'Your add-ons title will appear here'}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Add-ons List
                  </Typography>
                  <Stack spacing={1}>
                    {addons.map((addon, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'grey.50'
                        }}
                      >
                        <Typography variant="body2">{addon.name || 'Add-on name'}</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {addon.price ? `₹${addon.price}` : '₹0.00'}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" fontWeight={600}>
                      Total
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="primary">
                      ₹{calculateTotal()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            All changes are auto-saved locally
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton
              variant="outlined"
              color={editingId ? "error" : "inherit"}
              onClick={handleReset}
              disabled={loading}
              startIcon={editingId ? <RemoveCircle /> : <AddCircle />}
            >
              {editingId ? 'Cancel Update' : 'Reset Form'}
            </StyledButton>
            <SaveButton
              variant="contained"
              $isEditing={!!editingId}
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <Save />}
              onClick={handleSave}
              disabled={loading}
              fullWidth={false}
              sx={{ minWidth: 200 }}
            >
              {loading ? 'Processing...' : (editingId ? 'Update Add-ons' : 'Save Add-ons')}
            </SaveButton>
          </Box>
        </Box>

        {/* Existing Add-ons List */}
        <Box sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 4,
                bgcolor: 'primary.main',
                borderRadius: 2,
                mr: 2
              }}
            />
            <Typography variant="h4" fontWeight={800}>
              Existing Add-on Library
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {loading ? (
              <Grid size={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
                  <CircularProgress size={56} thickness={4} color="primary" />
                  <Typography variant="h6" color="text.secondary" fontWeight={600}>
                    Loading your premium library...
                  </Typography>
                </Box>
              </Grid>
            ) : existingAddons && Array.isArray(existingAddons) && existingAddons.length > 0 ? (
              existingAddons.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id || `addon-${index}`}>
                  <PremiumCard>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <GlassIcon>
                        {item.icon ? (
                          <Box component="img" src={item.icon} alt={item.title} sx={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                        ) : (
                          <LocalOffer sx={{ color: 'primary.light', fontSize: 32 }} />
                        )}
                      </GlassIcon>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <ActionButton size="small" onClick={() => handleEdit(item)}>
                          <Edit fontSize="small" />
                        </ActionButton>
                        <ActionButton size="small" variant="delete" onClick={() => handleDelete(item._id)}>
                          <Delete fontSize="small" />
                        </ActionButton>
                      </Box>
                    </Box>

                    <Typography variant="h5" fontWeight={800} sx={{ mb: 1, color: '#1a2027', letterSpacing: '-0.025em' }}>
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        lineHeight: 1.7,
                        minHeight: '5.1em',
                        maxHeight: '5.1em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '0.9rem'
                      }}
                    >
                      {item.description || 'Professional addon collection for bespoke event cakes.'}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      <Divider sx={{ mb: 2, borderColor: alpha('#000', 0.04) }} />
                      <Stack spacing={1.2}>
                        {item.priceList && item.priceList.map((p, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: alpha('#FF9A9E', 0.04),
                              border: '1px solid',
                              borderColor: alpha('#FF9A9E', 0.1),
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateX(5px)',
                                bgcolor: alpha('#FF9A9E', 0.08)
                              }
                            }}
                          >
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#2d3748' }}>
                              {p.name}
                            </Typography>
                            <Typography variant="body2" fontWeight={800} color="primary.main">
                              ₹{p.price}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </PremiumCard>
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Box
                  sx={{
                    py: 12,
                    textAlign: 'center',
                    bgcolor: alpha('#f8fafc', 0.8),
                    borderRadius: 12,
                    border: '2px dashed',
                    borderColor: alpha('#cbd5e0', 1),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha('#FF9A9E', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <LocalOffer sx={{ fontSize: 40, color: '#FF9A9E' }} />
                  </Box>
                  <Typography variant="h5" color="text.primary" fontWeight={800} gutterBottom>
                    No Add-ons found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 460 }}>
                    Your premium cake library is empty. Please add some premium add-ons using the form above.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </GradientPaper>
    </Container>
  );
};

export default CakeAddonsAdmin;
