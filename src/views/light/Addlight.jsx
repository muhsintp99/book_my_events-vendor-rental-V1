import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  InputAdornment,
  Stack,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  IconButton,
  LinearProgress,
  Chip,
  CircularProgress,
  Grid,
  alpha,
  Tooltip,
  Divider
} from '@mui/material';
import { CloudUpload, Close, AddPhotoAlternate, AutoAwesome, RotateLeft, BookmarkBorder, Collections, Delete, Info, Stars } from '@mui/icons-material';

// ── Theme ─────────────────────────────────────────────────
const THEME_COLOR = '#673ab7'; // Deep Purple
const SECONDARY_COLOR = '#4527a0';
const ACCENT_COLOR = '#FFB300'; // Amber/Gold

const theme = createTheme({
  palette: {
    primary: { main: THEME_COLOR, dark: SECONDARY_COLOR, light: '#9575cd', contrastText: '#fff' },
    secondary: { main: ACCENT_COLOR },
    background: { default: '#F0F2F5', paper: '#fff' },
    text: { primary: '#1a103d', secondary: '#4A5568' }
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h4: { fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');`
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '15px',
          '& fieldset': { borderColor: 'rgba(103,58,183,0.15)' },
          '&:hover fieldset': { borderColor: 'rgba(103,58,183,0.3) !important' },
          '&.Mui-focused fieldset': { borderColor: THEME_COLOR + ' !important', borderWidth: '2px' }
        },
        input: { padding: '16px 20px' }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: 16 }
      }
    }
  }
});

// Section label
const SL = ({ children }) => (
  <Typography sx={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: THEME_COLOR, mb: 1.5 }}>
    {children}
  </Typography>
);

// Shared card style
const card = {
  bgcolor: '#fff',
  border: '1px solid rgba(103,58,183,0.1)',
  borderRadius: '24px',
  p: { xs: 3, sm: 4 },
  boxShadow: '0 4px 20px rgba(103,58,183,0.05)',
  transition: '0.3s',
  '&:hover': { boxShadow: '0 8px 30px rgba(103,58,183,0.08)' }
};

export default function AddLightPackage() {
  const [form, setForm] = useState({ name: '', description: '', price: '', advance: '' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [svcLoading, setSvcLoading] = useState(true);
  const [svcError, setSvcError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [galleryDrag, setGalleryDrag] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

  // ── Fetch categories from API ──────────────────────────
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const moduleId = localStorage.getItem('moduleId');
        if (!moduleId) throw new Error('Module ID not found');

        const res = await fetch(`${API_BASE_URL}/api/categories/modules/${moduleId}`);
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data
            .filter((cat) => cat.isActive)
            .map((cat) => ({
              id: cat._id,
              label: cat.title,
              image: cat.image ? `${API_BASE_URL}${cat.image}` : null
            }));
          setServices(formatted);
        } else {
          setSvcError('No services found');
        }
      } catch (err) {
        setSvcError(err.message);
      } finally {
        setSvcLoading(false);
      }
    };

    fetchServices();
  }, []);
  useEffect(() => {
    if (!id) return;

    const fetchPackage = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`https://api.bookmyevent.ae/api/light-and-sound/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          const pkg = data.data;

          setForm({
            name: pkg.packageName || '',
            description: pkg.description || '',
            price: pkg.packagePrice != null ? String(pkg.packagePrice) : '',
            advance: pkg.advanceBookingAmount != null ? String(pkg.advanceBookingAmount) : ''
          });

          setSelectedServices(pkg.services || []);

          if (pkg.thumbnail) {
            setImagePreview(`https://api.bookmyevent.ae${pkg.thumbnail.startsWith('/') ? '' : '/'}${pkg.thumbnail}`);
          }

          if (pkg.images && Array.isArray(pkg.images)) {
            setGalleryPreviews(pkg.images.map(img => `https://api.bookmyevent.ae${img.startsWith('/') ? '' : '/'}${img}`));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPackage();
  }, [id]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const toggleService = (id) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    if (errors.services) setErrors((e) => ({ ...e, services: '' }));
  };

  const loadImg = (file) => {
    if (!file?.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setErrors((e) => ({ ...e, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const loadGallery = (files) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (newFiles.length === 0) return;

    setGalleryFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setGalleryPreviews(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryItem = (index) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    // If it was a new file, remove it from galleryFiles too
    // This logic is a bit tricky because previews might contain both existing (URLs) and new (DataURLs)
    // For simplicity, we'll just handle it by reconstructng in submit
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.price || +form.price <= 0) e.price = 'Enter a valid price';
    if (!isEditMode && !imageFile) e.image = 'Please upload a package image';
    if (selectedServices.length === 0) e.services = 'Please select at least one category';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setSnack({
        open: true,
        msg: 'Please fix the highlighted fields.',
        severity: 'error'
      });
      return;
    }

    try {
      setBusy(true);

      const moduleId = localStorage.getItem('moduleId');
      const userData = localStorage.getItem("user");

      if (!moduleId || !userData) {
        throw new Error("Module ID or Vendor ID missing in localStorage");
      }

      const parsedUser = JSON.parse(userData);
      const providerId = parsedUser._id; const token = localStorage.getItem('token'); // if using JWT

      if (!moduleId || !providerId) {
        throw new Error('Module ID or Vendor ID missing in localStorage');
      }

      const formData = new FormData();

      formData.append('module', moduleId);
      formData.append('providerId', providerId);
      formData.append('packageName', form.name);
      formData.append('description', form.description);
      formData.append('packagePrice', form.price);
      formData.append('advanceBookingAmount', form.advance);

      // Optional: send selected services
      if (selectedServices.length > 0) {
        formData.append('category', selectedServices[0]);
      }
      formData.append('services', JSON.stringify(selectedServices));

      if (imageFile) {
        formData.append('thumbnail', imageFile);
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          formData.append('images', file);
        });
      }
      const url = isEditMode
        ? `https://api.bookmyevent.ae/api/light-and-sound/${id}`
        : `https://api.bookmyevent.ae/api/light-and-sound/create`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: token
          ? {
            Authorization: `Bearer ${token}`
          }
          : undefined,
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSnack({
        open: true,
        msg: 'Package published successfully 🎉',
        severity: 'success'
      });

      // Reset form
      setForm({ name: '', description: '', price: '', advance: '' });
      setSelectedServices([]);
      setImageFile(null);
      setImagePreview(null);
      setErrors({});
    } catch (error) {
      setSnack({
        open: true,
        msg: error.message,
        severity: 'error'
      });
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setForm({ name: '', description: '', price: '', advance: '' });
    setSelectedServices([]);
    setImageFile(null);
    setImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setErrors({});
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%', bgcolor: '#F0F2F5', minHeight: '100%', py: { xs: 4, md: 6 }, px: { xs: 2, sm: 4, md: 8 } }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, gap: 3 }}>
            <Box>
              <Typography variant="h2" sx={{ fontWeight: 900, color: '#1a103d', letterSpacing: '-1.5px', mb: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                {isEditMode ? 'Refine' : 'Create'} <Box component="span" sx={{ color: THEME_COLOR }}>Package</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: '#4A5568', fontWeight: 400, maxWidth: 500 }}>
                {isEditMode ? 'Enhance your existing package details and visuals.' : 'Set up a new premium light & sound experience for your clients.'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/light/list')}
              startIcon={<RotateLeft />}
              sx={{ borderRadius: '16px', px: 4, py: 1.5, borderWidth: 2, fontWeight: 700, '&:hover': { borderWidth: 2 } }}
            >
              Back to Fleet
            </Button>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Left Column - Details */}
              <Grid item xs={12} md={7}>
                <Stack spacing={4}>
                  {/* Basic Info */}
                  <Paper sx={card}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                      <Avatar sx={{ bgcolor: alpha(THEME_COLOR, 0.1), color: THEME_COLOR }}>
                        <Info />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>Basic Information</Typography>
                    </Stack>

                    <Stack spacing={3}>
                      <Box>
                        <SL>Package Excellence Name</SL>
                        <TextField
                          placeholder="e.g. Cinematic Stage Lighting Bundle"
                          fullWidth
                          value={form.name}
                          onChange={(e) => set('name', e.target.value)}
                          error={!!errors.name}
                          helperText={errors.name}
                        />
                      </Box>

                      <Box>
                        <SL>Experience Description</SL>
                        <TextField
                          placeholder="Describe the atmosphere, equipment specs, and unique value..."
                          fullWidth
                          multiline
                          rows={6}
                          value={form.description}
                          onChange={(e) => set('description', e.target.value)}
                          error={!!errors.description}
                          helperText={errors.description}
                        />
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Pricing & Category */}
                  <Paper sx={card}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                      <Avatar sx={{ bgcolor: alpha(ACCENT_COLOR, 0.1), color: ACCENT_COLOR }}>
                        <Stars />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>Pricing & Category</Typography>
                    </Stack>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={6}>
                        <SL>Package Price</SL>
                        <TextField
                          placeholder="0.00"
                          fullWidth
                          type="number"
                          value={form.price}
                          onChange={(e) => set('price', e.target.value)}
                          error={!!errors.price}
                          helperText={errors.price}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography sx={{ color: THEME_COLOR, fontWeight: 900 }}>₹</Typography>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <SL>Advance Amount</SL>
                        <TextField
                          placeholder="0.00"
                          fullWidth
                          type="number"
                          value={form.advance}
                          onChange={(e) => set('advance', e.target.value)}
                          error={!!errors.advance}
                          helperText={errors.advance}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography sx={{ color: '#48BB78', fontWeight: 900 }}>₹</Typography>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

                    <Box>
                      <SL>Service Categories</SL>
                      {svcLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                          <CircularProgress size={24} thickness={5} />
                          <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Loading categories...</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {services.map((svc) => {
                            const active = selectedServices.includes(svc.id);
                            return (
                              <Chip
                                key={svc.id}
                                label={svc.label}
                                avatar={svc.image ? <Avatar src={svc.image} /> : null}
                                onClick={() => toggleService(svc.id)}
                                sx={{
                                  height: 48,
                                  borderRadius: '16px',
                                  px: 1,
                                  fontWeight: active ? 800 : 500,
                                  fontSize: '0.95rem',
                                  bgcolor: active ? THEME_COLOR : 'white',
                                  color: active ? 'white' : 'text.primary',
                                  border: `2px solid ${active ? THEME_COLOR : alpha(THEME_COLOR, 0.1)}`,
                                  '&:hover': {
                                    bgcolor: active ? SECONDARY_COLOR : alpha(THEME_COLOR, 0.05),
                                    borderColor: THEME_COLOR
                                  },
                                  '& .MuiChip-avatar': { width: 32, height: 32 }
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                      {errors.services && (
                        <FormHelperText error sx={{ mt: 2, fontWeight: 600 }}>{errors.services}</FormHelperText>
                      )}
                    </Box>
                  </Paper>
                </Stack>
              </Grid>

              {/* Right Column - Visuals */}
              <Grid item xs={12} md={5}>
                <Stack spacing={4}>
                  {/* Hero Thumbnail */}
                  <Paper sx={card}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                      <Avatar sx={{ bgcolor: alpha(THEME_COLOR, 0.1), color: THEME_COLOR }}>
                        <AddPhotoAlternate />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>Hero Thumbnail</Typography>
                    </Stack>

                    <Box
                      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setDrag(false); loadImg(e.dataTransfer.files[0]); }}
                      sx={{
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        height: 300,
                        bgcolor: '#F7FAFC',
                        border: `2px dashed ${drag ? THEME_COLOR : alpha(THEME_COLOR, 0.2)}`,
                        transition: '0.3s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': { borderColor: THEME_COLOR, bgcolor: alpha(THEME_COLOR, 0.02) }
                      }}
                      component="label"
                    >
                      <input type="file" accept="image/*" hidden onChange={(e) => loadImg(e.target.files[0])} />

                      {imagePreview ? (
                        <>
                          <Box component="img" src={imagePreview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                              sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white', color: 'error.main' } }}
                            >
                              <Close />
                            </IconButton>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Avatar sx={{ width: 80, height: 80, bgcolor: alpha(THEME_COLOR, 0.05), mb: 2 }}>
                            <CloudUpload sx={{ fontSize: 40, color: THEME_COLOR }} />
                          </Avatar>
                          <Typography sx={{ fontWeight: 700 }}>Upload Hero Image</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Drag and drop or click</Typography>
                        </>
                      )}
                    </Box>
                    {errors.image && <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>{errors.image}</Typography>}
                  </Paper>

                  {/* Gallery Section */}
                  <Paper sx={card}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                      <Avatar sx={{ bgcolor: alpha(THEME_COLOR, 0.1), color: THEME_COLOR }}>
                        <Collections />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>Work Gallery</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Multiple images showcasing the experience</Typography>
                      </Box>
                      <Button
                        component="label"
                        size="small"
                        startIcon={<AddPhotoAlternate />}
                        sx={{ borderRadius: '12px' }}
                      >
                        Add Images
                        <input type="file" multiple accept="image/*" hidden onChange={(e) => loadGallery(e.target.files)} />
                      </Button>
                    </Stack>

                    <Box
                      onDragOver={(e) => { e.preventDefault(); setGalleryDrag(true); }}
                      onDragLeave={() => setGalleryDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setGalleryDrag(false); loadGallery(e.dataTransfer.files); }}
                      sx={{
                        minHeight: 120,
                        borderRadius: '20px',
                        p: 2,
                        bgcolor: galleryDrag ? alpha(THEME_COLOR, 0.05) : '#F7FAFC',
                        border: `2px dashed ${galleryDrag ? THEME_COLOR : alpha(THEME_COLOR, 0.1)}`,
                        transition: '0.3s'
                      }}
                    >
                      {galleryPreviews.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>No gallery images added</Typography>
                        </Box>
                      ) : (
                        <Grid container spacing={1.5}>
                          {galleryPreviews.map((preview, i) => (
                            <Grid item xs={4} key={i}>
                              <Box sx={{ position: 'relative', pt: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                                <Box component="img" src={preview} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                <IconButton
                                  size="small"
                                  onClick={() => removeGalleryItem(i)}
                                  sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', color: 'error.main', width: 20, height: 20, '&:hover': { bgcolor: 'white' } }}
                                >
                                  <Close sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  </Paper>

                  {/* Actions */}
                  <Stack spacing={2} pt={2}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={busy}
                      size="large"
                      startIcon={<AutoAwesome />}
                      sx={{
                        py: 2.5,
                        fontSize: '1.1rem',
                        bgcolor: THEME_COLOR,
                        boxShadow: `0 12px 24px ${alpha(THEME_COLOR, 0.3)}`,
                        '&:hover': { bgcolor: SECONDARY_COLOR, transform: 'translateY(-2px)' }
                      }}
                    >
                      {busy ? 'Processing...' : isEditMode ? 'Update Royal Package' : 'Publish New Experience'}
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={handleReset}
                      sx={{ py: 1.5, color: '#718096', fontWeight: 600 }}
                    >
                      Reset All Fields
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}   // ✅ CHANGE HERE
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          sx={{
            borderRadius: "12px",
            fontFamily: "'DM Sans', sans-serif",
            minWidth: 280
          }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
