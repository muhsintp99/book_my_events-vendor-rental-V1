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
    Grid
} from '@mui/material';
import { CloudUpload, Close, AddPhotoAlternate, AutoAwesome, RotateLeft, BookmarkBorder } from '@mui/icons-material';

// project imports
import { gridSpacing } from 'store/constant';

// ── Theme ─────────────────────────────────────────────────
const theme = createTheme({
    palette: {
        primary: { main: '#E15B65', dark: '#C2444E', light: '#F09898', contrastText: '#fff' },
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
                    '& fieldset': { borderColor: 'rgba(225, 91, 101,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(225, 91, 101,0.5) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#E15B65 !important', borderWidth: '2px' }
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
                    '&.Mui-focused': { color: '#E15B65' }
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
    <Typography sx={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#E15B65', mb: 1.25 }}>
        {children}
    </Typography>
);

// Shared card style
const card = {
    bgcolor: '#fff',
    border: '1px solid rgba(225, 91, 101, 0.11)',
    borderRadius: '16px',
    p: { xs: 2.5, sm: 3 },
    boxShadow: '0 2px 14px rgba(225, 91, 101, 0.05)'
};

export default function AddInvitationPackage() {
    const [form, setForm] = useState({ name: '', description: '', price: '', advance: '', category: '' });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    const [busy, setBusy] = useState(false);
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

    useEffect(() => {
        if (!id) return;

        const fetchPackage = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/invitation-printing/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    const pkg = data.data;
                    setForm({
                        name: pkg.packageName || '',
                        description: pkg.description || '',
                        price: pkg.packagePrice != null ? String(pkg.packagePrice) : '',
                        advance: pkg.advanceBookingAmount != null ? String(pkg.advanceBookingAmount) : '',
                        category: pkg.category?._id || pkg.category || ''
                    });
                    if (pkg.thumbnail) {
                        setThumbnailPreview(`${API_BASE_URL}${pkg.thumbnail.startsWith('/') ? '' : '/'}${pkg.thumbnail}`);
                    }
                    if (pkg.images && Array.isArray(pkg.images)) {
                        setImagePreviews(pkg.images.map(img => `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`));
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPackage();
    }, [id, API_BASE_URL]);

    const set = (k, v) => {
        setForm((f) => ({ ...f, [k]: v }));
        if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setFetchingCategories(true);
                const moduleId = localStorage.getItem('moduleId');
                if (!moduleId) return;

                const res = await fetch(`${API_BASE_URL}/api/categories/modules/${moduleId}`);
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data || []);
                }
            } catch (err) {
                console.error('Fetch categories error:', err);
            } finally {
                setFetchingCategories(false);
            }
        };
        fetchCategories();
    }, [API_BASE_URL]);

    const handleThumbnailUpload = (file) => {
        if (!file?.type.startsWith('image/')) return;
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setThumbnailPreview(ev.target.result);
            setErrors((e) => ({ ...e, thumbnail: '' }));
        };
        reader.readAsDataURL(file);
    };

    const handleImagesUpload = (files) => {
        const fileList = Array.from(files);
        const validFiles = fileList.filter(f => f.type.startsWith('image/'));
        setImages(prev => [...prev, ...validFiles]);

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreviews(prev => [...prev, ev.target.result]);
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Required';
        if (!form.description.trim()) e.description = 'Required';
        if (!form.price || +form.price <= 0) e.price = 'Enter a valid price';
        if (form.advance === '' || +form.advance < 0) e.advance = 'Enter a valid amount';
        if (!form.category) e.category = 'Please select a category';
        if (!isEditMode && !thumbnailFile) e.thumbnail = 'Please upload a thumbnail';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            setSnack({ open: true, msg: 'Please fix the highlighted fields.', severity: 'error' });
            return;
        }

        try {
            setBusy(true);
            const moduleId = localStorage.getItem('moduleId');
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const providerId = userData._id;
            const token = localStorage.getItem('token');

            if (!moduleId || !providerId) throw new Error('Module or Vendor session missing');

            const formData = new FormData();
            formData.append('secondaryModule', moduleId);
            formData.append('providerId', providerId);
            formData.append('packageName', form.name);
            formData.append('description', form.description);
            formData.append('packagePrice', form.price);
            formData.append('advanceBookingAmount', form.advance);
            formData.append('category', form.category);

            if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
            images.forEach(img => formData.append('images', img));

            const url = isEditMode ? `${API_BASE_URL}/api/invitation-printing/${id}` : `${API_BASE_URL}/api/invitation-printing/create`;
            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');

            setSnack({ open: true, msg: 'Invitation package published! 🎉', severity: 'success' });
            if (!isEditMode) {
                setForm({ name: '', description: '', price: '', advance: '', category: '' });
                setThumbnailFile(null);
                setThumbnailPreview(null);
                setImages([]);
                setImagePreviews([]);
            }
        } catch (error) {
            setSnack({ open: true, msg: error.message, severity: 'error' });
        } finally {
            setBusy(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ width: '100%', bgcolor: '#FDF6EE', minHeight: '100%', py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ mb: 3.5 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.65rem', sm: '2rem' }, lineHeight: 1.2 }}>
                        Add{' '}
                        <Box component="em" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                            Invitation
                        </Box>{' '}
                        Package
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.75} fontSize="13.5px">
                        Design and showcase your printing & invitation masterpieces.
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: '#1A0A00', px: 3.5, py: 2.25, borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(225, 91, 101, 0.3)', borderRadius: '10px', width: 38, height: 38, fontSize: '15px' }}>✦</Avatar>
                    <Box>
                        <Typography sx={{ color: '#F7EDE0', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem' }}>Package Details</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '11.5px' }}>All * fields are required</Typography>
                    </Box>
                </Box>

                {busy && <LinearProgress color="primary" />}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ border: '1px solid rgba(225, 91, 101, 0.11)', borderTop: 'none', borderRadius: '0 0 16px 16px', bgcolor: '#FDF6EE', p: 3, boxShadow: '0 4px 24px rgba(225, 91, 101, 0.06)' }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <SL>Package Name</SL>
                            <TextField label="Package Name *" placeholder="e.g. Premium Laser-Cut Wedding Invite" fullWidth value={form.name} onChange={(e) => set('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <SL>Description</SL>
                            <TextField label="Description *" placeholder="Paper quality, print type, card dimensions, inclusions..." fullWidth multiline rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} error={!!errors.description} helperText={errors.description} />
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <SL>Pricing</SL>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                                <TextField label="Base Price *" placeholder="0" fullWidth type="number" value={form.price} onChange={(e) => set('price', e.target.value)} error={!!errors.price} helperText={errors.price} InputProps={{ startAdornment: <InputAdornment position="start"><Typography color="primary.main" fontWeight={700}>₹</Typography></InputAdornment> }} />
                                <TextField label="Advance Amount *" placeholder="0" fullWidth type="number" value={form.advance} onChange={(e) => set('advance', e.target.value)} error={!!errors.advance} helperText={errors.advance} InputProps={{ startAdornment: <InputAdornment position="start"><Typography color="secondary.main" fontWeight={700}>₹</Typography></InputAdornment> }} />
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ ...card, bgcolor: '#fff' }}>
                            <SL>Select Category</SL>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                Choose the type of invitation service you provide.
                            </Typography>

                            {fetchingCategories ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : categories.length > 0 ? (
                                <Grid container spacing={2}>
                                    {categories.map((cat) => (
                                        <Grid item xs={12} sm={6} md={4} key={cat._id}>
                                            <Box
                                                onClick={() => set('category', cat._id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: form.category === cat._id ? '#E15B65' : 'rgba(0,0,0,0.06)',
                                                    bgcolor: form.category === cat._id ? 'rgba(225, 91, 101, 0.04)' : '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: '#E15B65',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                    }
                                                }}
                                            >
                                                <Avatar
                                                    src={cat.image ? (cat.image.startsWith('http') ? cat.image : `${API_BASE_URL}${cat.image}`) : ''}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '8px',
                                                        bgcolor: 'rgba(225, 91, 101, 0.1)',
                                                        color: '#E15B65'
                                                    }}
                                                >
                                                    {!cat.image && <BookmarkBorder fontSize="small" />}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: form.category === cat._id ? '#E15B65' : 'inherit' }}>
                                                        {cat.title}
                                                    </Typography>
                                                    {cat.description && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {cat.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                {form.category === cat._id && (
                                                    <Avatar sx={{ width: 20, height: 20, bgcolor: '#E15B65', color: '#fff' }}>
                                                        <Box component="span" sx={{ fontSize: '12px' }}>✓</Box>
                                                    </Avatar>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                                    No categories found for this module. Please contact administrator.
                                </Alert>
                            )}
                            {errors.category && <FormHelperText error sx={{ mt: 1, ml: 1 }}>{errors.category}</FormHelperText>}
                        </Paper>

                        <Grid container spacing={3}>
                            {/* Thumbnail Section */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ ...card, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <SL>Package Thumbnail</SL>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Main image displayed in catalogs and lists.
                                    </Typography>
                                    <Box
                                        component="label"
                                        htmlFor="thumb-img"
                                        sx={{
                                            flexGrow: 1,
                                            border: '2px dashed',
                                            borderColor: errors.thumbnail ? '#dc2626' : 'rgba(225, 91, 101, 0.2)',
                                            borderRadius: '16px',
                                            p: 2,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            bgcolor: '#FFFBF7',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: 220,
                                            '&:hover': {
                                                borderColor: '#E15B65',
                                                bgcolor: 'rgba(225, 91, 101, 0.04)',
                                                transform: 'scale(1.01)'
                                            }
                                        }}
                                    >
                                        <input id="thumb-img" type="file" accept="image/*" hidden onChange={(e) => handleThumbnailUpload(e.target.files[0])} />

                                        {thumbnailPreview ? (
                                            <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: 180 }}>
                                                <Box
                                                    component="img"
                                                    src={thumbnailPreview}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        maxHeight: 220,
                                                        objectFit: 'cover',
                                                        borderRadius: '10px'
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(255,255,255,0.9)',
                                                        '&:hover': { bgcolor: '#fff' }
                                                    }}
                                                    onClick={(e) => { e.preventDefault(); setThumbnailPreview(null); setThumbnailFile(null); }}
                                                >
                                                    <Close fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <Stack alignItems="center" spacing={1.5}>
                                                <Avatar sx={{ bgcolor: 'rgba(225, 91, 101, 0.1)', color: '#E15B65', width: 56, height: 56 }}>
                                                    <CloudUpload />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={700}>Click to upload thumbnail</Typography>
                                                    <Typography variant="caption" color="text.secondary">PNG, JPG or JPEG (Max 5MB)</Typography>
                                                </Box>
                                            </Stack>
                                        )}
                                    </Box>
                                    {errors.thumbnail && <FormHelperText error sx={{ mt: 1, ml: 1 }}>{errors.thumbnail}</FormHelperText>}
                                </Paper>
                            </Grid>

                            {/* Gallery Section */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ ...card, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <SL>Gallery</SL>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Additional photos showcasing details and variations.
                                    </Typography>
                                    <Box
                                        component="label"
                                        htmlFor="gallery-imgs"
                                        sx={{
                                            flexGrow: 1,
                                            border: '2px dashed rgba(225, 91, 101, 0.2)',
                                            borderRadius: '16px',
                                            p: 2,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            bgcolor: '#FFFBF7',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minHeight: 220,
                                            '&:hover': {
                                                borderColor: '#E15B65',
                                                bgcolor: 'rgba(225, 91, 101, 0.04)'
                                            }
                                        }}
                                    >
                                        <input id="gallery-imgs" type="file" accept="image/*" multiple hidden onChange={(e) => handleImagesUpload(e.target.files)} />

                                        {imagePreviews.length > 0 ? (
                                            <Grid container spacing={1.5}>
                                                {imagePreviews.map((p, i) => (
                                                    <Grid item xs={4} key={i}>
                                                        <Box sx={{ position: 'relative', pt: '100%' }}>
                                                            <Box
                                                                component="img"
                                                                src={p}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(0,0,0,0.05)'
                                                                }}
                                                            />
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 4,
                                                                    right: 4,
                                                                    bgcolor: 'rgba(255,255,255,0.8)',
                                                                    p: 0.3,
                                                                    '&:hover': { bgcolor: '#fff' }
                                                                }}
                                                                onClick={(e) => { e.preventDefault(); removeImage(i); }}
                                                            >
                                                                <Close sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={4}>
                                                    <Box sx={{
                                                        pt: '100%',
                                                        position: 'relative',
                                                        border: '2px dashed rgba(225, 91, 101, 0.15)',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        '&:hover': { bgcolor: 'rgba(225, 91, 101, 0.05)' }
                                                    }}>
                                                        <AddPhotoAlternate color="primary" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.6 }} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Stack alignItems="center" spacing={1.5} sx={{ my: 'auto' }}>
                                                <Avatar sx={{ bgcolor: 'rgba(212, 160, 23, 0.1)', color: '#D4A017', width: 56, height: 56 }}>
                                                    <AddPhotoAlternate />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={700}>Add Gallery Images</Typography>
                                                    <Typography variant="caption" color="text.secondary">Upload up to 10 gallery photos</Typography>
                                                </Box>
                                            </Stack>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Stack direction="row" spacing={2} pt={2}>
                            <Button type="submit" variant="contained" size="large" fullWidth startIcon={<AutoAwesome />} disabled={busy} sx={{ py: 1.5, background: 'linear-gradient(135deg, #E15B65 0%, #C2444E 100%)' }}>
                                {busy ? 'Processing...' : isEditMode ? 'Update Package' : 'Publish Invitation'}
                            </Button>
                            {!isEditMode && <Button variant="outlined" size="large" fullWidth startIcon={<RotateLeft />} onClick={() => { setForm({ name: '', description: '', price: '', advance: '', category: '' }); setThumbnailPreview(null); setImagePreviews([]); }}>Reset</Button>}
                        </Stack>
                    </Stack>
                </Box>
            </Box>

            <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px' }}>{snack.msg}</Alert>
            </Snackbar>
        </ThemeProvider>
    );
}
