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
  CircularProgress
} from '@mui/material';
import { CloudUpload, Close, AddPhotoAlternate, AutoAwesome, RotateLeft, BookmarkBorder } from '@mui/icons-material';

// ── Theme ─────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    primary: { main: '#C4572A', dark: '#8B3A0F', light: '#E07A52', contrastText: '#fff' },
    secondary: { main: '#D4A017' },
    background: { default: '#FDF6EE', paper: '#fff' },
    text: { primary: '#1A0A00', secondary: '#7A5C4A' }
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h4: { fontFamily: "'Playfair Display', serif" }
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');`
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFBF7',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14.5px',
          '& fieldset': { borderColor: 'rgba(196,87,42,0.2)' },
          '&:hover fieldset': { borderColor: 'rgba(196,87,42,0.5) !important' },
          '&.Mui-focused fieldset': { borderColor: '#C4572A !important', borderWidth: '2px' }
        },
        input: { padding: '15px 16px' }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          color: '#8B3A0F',
          '&.Mui-focused': { color: '#C4572A' }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 12 }
      }
    }
  }
});

// Section label
const SL = ({ children }) => (
  <Typography sx={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#C4572A', mb: 1.25 }}>
    {children}
  </Typography>
);

// Shared card style
const card = {
  bgcolor: '#fff',
  border: '1px solid rgba(196,87,42,0.11)',
  borderRadius: '16px',
  p: { xs: 2.5, sm: 3 },
  boxShadow: '0 2px 14px rgba(196,87,42,0.05)'
};

export default function AddMehandiPackage() {
  const [form, setForm] = useState({ name: '', description: '', price: '', advance: '' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [svcLoading, setSvcLoading] = useState(true);
  const [svcError, setSvcError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
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
              id: cat.categoryId || cat._id,
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

        const res = await fetch(`https://api.bookmyevent.ae/api/mehandi/${id}`, {
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

          if (pkg.image) {
            setImagePreview(`https://api.bookmyevent.ae${pkg.image.startsWith('/') ? '' : '/'}${pkg.image}`);
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

    setImageFile(file); // ✅ store real file

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result); // preview only
      setErrors((e) => ({ ...e, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.price || +form.price <= 0) e.price = 'Enter a valid price';
    if (form.advance === '' || +form.advance < 0) e.advance = 'Enter a valid amount';

    // ✅ Only require image in ADD mode
    if (!isEditMode && !imageFile) {
      e.image = 'Please upload a package image';
    }

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
      formData.append('services', JSON.stringify(selectedServices));

      if (imageFile) {
        formData.append('image', imageFile);
      }
      const url = isEditMode
        ? `https://api.bookmyevent.ae/api/mehandi/${id}`
        : `https://api.bookmyevent.ae/api/mehandi/create`;

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
    setImage(null);
    setErrors({});
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%', bgcolor: '#FDF6EE', minHeight: '100%', py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Page Heading */}
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.65rem', sm: '2rem' }, lineHeight: 1.2 }}>
            Add{' '}
            <Box component="em" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
              Mehandi
            </Box>{' '}
            Package
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.75} fontSize="13.5px">
            Fill in the details below to create and publish a new package.
          </Typography>
        </Box>

        {/* Dark Header */}
        <Box
          sx={{
            bgcolor: '#1A0A00',
            px: { xs: 2.5, sm: 3.5 },
            py: 2.25,
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar sx={{ bgcolor: 'rgba(196,87,42,0.3)', borderRadius: '10px', width: 38, height: 38, fontSize: '15px' }}>✦</Avatar>
          <Box>
            <Typography sx={{ color: '#F7EDE0', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem' }}>Package Details</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '11.5px' }}>All * fields are required</Typography>
          </Box>
        </Box>

        {busy && <LinearProgress color="primary" />}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            border: '1px solid rgba(196,87,42,0.11)',
            borderTop: 'none',
            borderRadius: '0 0 16px 16px',
            bgcolor: '#FDF6EE',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 4px 24px rgba(196,87,42,0.06)'
          }}
        >
          <Stack spacing={2.5}>
            {/* ── 1. Package Name ── */}
            <Paper elevation={0} sx={card}>
              <SL>Package Name</SL>
              <TextField
                label="Package Name *"
                placeholder="e.g. Royal Bridal Full Hands Mehandi"
                fullWidth
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Paper>

            {/* ── 2. Description ── */}
            <Paper elevation={0} sx={card}>
              <SL>Description</SL>
              <TextField
                label="Description *"
                placeholder="Describe design style, coverage area, occasion suitability, cone quality…"
                fullWidth
                multiline
                rows={4}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                sx={{ '& .MuiOutlinedInput-root .MuiOutlinedInput-input': { padding: '4px 2px' } }}
              />
            </Paper>

            {/* ── 3. Pricing — 50/50 ── */}
            <Paper elevation={0} sx={card}>
              <SL>Pricing</SL>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Package Price *"
                    placeholder="0"
                    fullWidth
                    type="number"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '17px' }}>₹</Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Advance Booking Amount *"
                    placeholder="0"
                    fullWidth
                    type="number"
                    value={form.advance}
                    onChange={(e) => set('advance', e.target.value)}
                    error={!!errors.advance}
                    helperText={errors.advance}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '17px' }}>₹</Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
            </Paper>



            {/* ── 5. Package Image ── */}
            <Paper elevation={0} sx={card}>
              <SL>Package Image</SL>

              {imagePreview ? (
                <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="preview"
                    sx={{
                      width: '100%',
                      height: { xs: 200, sm: 260, md: 300 },
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(196,87,42,0.15)'
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      '&:hover': { bgcolor: 'primary.main' }
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      bgcolor: 'rgba(0,0,0,0.55)',
                      borderRadius: '8px',
                      px: 1.5,
                      py: 0.5,
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <AddPhotoAlternate sx={{ color: '#fff', fontSize: 13 }} />
                    <Typography sx={{ color: '#fff', fontSize: '11.5px' }}>Package Image</Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  component="label"
                  htmlFor="pkg-img"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    loadImg(e.dataTransfer.files[0]);
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${errors.image ? '#d32f2f' : drag ? '#C4572A' : 'rgba(196,87,42,0.28)'}`,
                    borderRadius: '12px',
                    py: { xs: 4.5, sm: 5.5 },
                    px: 3,
                    cursor: 'pointer',
                    bgcolor: drag ? 'rgba(196,87,42,0.04)' : '#FFFBF7',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#C4572A', bgcolor: 'rgba(196,87,42,0.03)' }
                  }}
                >
                  <input id="pkg-img" type="file" accept="image/*" hidden onChange={(e) => loadImg(e.target.files[0])} />
                  <Avatar sx={{ bgcolor: 'rgba(196,87,42,0.1)', width: 52, height: 52, mb: 1.75, borderRadius: '13px' }}>
                    <CloudUpload sx={{ color: '#C4572A', fontSize: 24 }} />
                  </Avatar>
                  <Typography fontWeight={600} fontSize="15px" color="text.primary" mb={0.5}>
                    Click to upload image
                  </Typography>
                  <Typography fontSize="13px" color="text.secondary" mb={2}>
                    Drag & drop also supported
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" justifyContent="center">
                    {['JPG', 'PNG', 'WEBP', 'Max 5MB'].map((f) => (
                      <Chip
                        key={f}
                        label={f}
                        size="small"
                        sx={{ bgcolor: 'rgba(196,87,42,0.08)', color: '#8B3A0F', fontSize: '11px', height: 24 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              {errors.image && <Typography sx={{ color: 'error.main', fontSize: '12px', mt: 0.75 }}>{errors.image}</Typography>}
            </Paper>

            {/* ── Buttons ── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} pt={0.5}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={busy}
                startIcon={<AutoAwesome />}
                sx={{
                  flex: { sm: 1 },
                  py: 1.65,
                  fontSize: '15px',
                  background: 'linear-gradient(135deg, #C4572A 0%, #8B3A0F 100%)',
                  boxShadow: '0 4px 18px rgba(196,87,42,0.32)',
                  '&:hover': { boxShadow: '0 6px 24px rgba(196,87,42,0.44)', transform: 'translateY(-1px)' },
                  transition: 'all 0.2s'
                }}
              >
                {busy
                  ? isEditMode
                    ? 'Updating…'
                    : 'Publishing…'
                  : isEditMode
                    ? 'Update Package'
                    : 'Add Package'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                startIcon={<RotateLeft />}
                sx={{
                  flex: { sm: 1 },
                  py: 1.65,
                  fontSize: '15px',
                  borderColor: 'rgba(196,87,42,0.28)',
                  color: 'primary.dark',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(196,87,42,0.04)' }
                }}
              >
                Reset
              </Button>


            </Stack>
          </Stack>
        </Box>
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
