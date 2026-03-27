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
    CircularProgress,
    Grid
} from '@mui/material';
import { CloudUpload, Close, AddPhotoAlternate, AutoAwesome, RotateLeft, BookmarkBorder } from '@mui/icons-material';

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

const SL = ({ children }) => (
    <Typography sx={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#E15B65', mb: 1.25 }}>
        {children}
    </Typography>
);

const card = {
    bgcolor: '#fff',
    border: '1px solid rgba(225, 91, 101, 0.11)',
    borderRadius: '16px',
    p: { xs: 2.5, sm: 3 },
    boxShadow: '0 2px 14px rgba(225, 91, 101, 0.05)'
};

export default function AddInvitationPackage() {
    const [form, setForm] = useState({ name: '', description: '', price: '', advance: '', services: [] });
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
                        services: Array.isArray(pkg.services) ? pkg.services.map(s => s._id || s) : []
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

    const toggleService = (sid) => {
        setForm(f => {
            const services = f.services.includes(sid)
                ? f.services.filter(x => x !== sid)
                : [...f.services, sid];
            return { ...f, services };
        });
        if (errors.category) setErrors(e => ({ ...e, category: '' }));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setFetchingCategories(true);
                const moduleId = localStorage.getItem('moduleId');
                if (!moduleId) return;
                const res = await fetch(`${API_BASE_URL}/api/categories/modules/${moduleId}`);
                const data = await res.json();
                if (data.success) setCategories(data.data || []);
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
        if (validFiles.length === 0) return;

        setImages(prev => [...prev, ...validFiles]);

        const readPromises = validFiles.map(file => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(file);
        }));

        Promise.all(readPromises).then(newPreviews => {
            setImagePreviews(prev => [...prev, ...newPreviews]);
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
        if (form.advance && +form.advance > +form.price) {
            e.advance = 'Advance booking amount cannot be greater than the package price';
        }
        // if (!form.services || form.services.length === 0) e.category = 'Please select at least one category';
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
            formData.append('services', JSON.stringify(form.services));
            if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
            images.forEach(img => formData.append('images', img));

            const url = isEditMode
                ? `${API_BASE_URL}/api/invitation-printing/${id}`
                : `${API_BASE_URL}/api/invitation-printing/create`;
            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');

            setSnack({ open: true, msg: 'Invitation package published! 🎉', severity: 'success' });
            if (!isEditMode) {
                setForm({ name: '', description: '', price: '', advance: '', services: [] });
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

    const uploadZoneBase = {
        width: '100%',
        border: '2px dashed',
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
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ width: '100%', bgcolor: '#FDF6EE', minHeight: '100%', py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>

                {/* Header */}
                <Box sx={{ mb: 3.5 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.65rem', sm: '2rem' }, lineHeight: 1.2 }}>
                        {isEditMode ? 'Edit' : 'Add'}{' '}
                        <Box component="em" sx={{ color: 'primary.main', fontStyle: 'italic' }}>Invitation</Box>{' '}
                        Package
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.75} fontSize="13.5px">
                        Design and showcase your printing & invitation masterpieces.
                    </Typography>
                </Box>

                {/* Dark header bar */}
                <Box sx={{ bgcolor: '#1A0A00', px: 3.5, py: 2.25, borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(225, 91, 101, 0.3)', borderRadius: '10px', width: 38, height: 38, fontSize: '15px' }}>✦</Avatar>
                    <Box>
                        <Typography sx={{ color: '#F7EDE0', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem' }}>Package Details</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '11.5px' }}>All * fields are required</Typography>
                    </Box>
                </Box>

                {busy && <LinearProgress color="primary" />}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        border: '1px solid rgba(225, 91, 101, 0.11)',
                        borderTop: 'none',
                        borderRadius: '0 0 16px 16px',
                        bgcolor: '#FDF6EE',
                        p: 3,
                        boxShadow: '0 4px 24px rgba(225, 91, 101, 0.06)'
                    }}
                >
                    <Stack spacing={2.5}>

                        {/* Package Name */}
                        <Paper elevation={0} sx={card}>
                            <SL>Package Name</SL>
                            <TextField
                                label="Package Name *"
                                placeholder="e.g. Premium Laser-Cut Wedding Invite"
                                fullWidth
                                value={form.name}
                                onChange={(e) => set('name', e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Paper>

                        {/* Description */}
                        <Paper elevation={0} sx={card}>
                            <SL>Description</SL>
                            <TextField
                                label="Description *"
                                placeholder="Paper quality, print type, card dimensions, inclusions..."
                                fullWidth multiline rows={4}
                                value={form.description}
                                onChange={(e) => set('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Paper>

                        {/* Pricing */}
                        <Paper elevation={0} sx={card}>
                            <SL>Pricing</SL>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                                <TextField
                                    label="Base Price *" placeholder="0" fullWidth type="number"
                                    value={form.price} onChange={(e) => set('price', e.target.value)}
                                    error={!!errors.price} helperText={errors.price}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Typography color="primary.main" fontWeight={700}>₹</Typography></InputAdornment> }}
                                />
                                <TextField
                                    label="Advance Amount *" placeholder="0" fullWidth type="number"
                                    value={form.advance} onChange={(e) => set('advance', e.target.value)}
                                    error={!!errors.advance} helperText={errors.advance}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Typography color="secondary.main" fontWeight={700}>₹</Typography></InputAdornment> }}
                                />
                            </Stack>
                        </Paper>

                        {/* Categories */}
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
                                                onClick={() => toggleService(cat._id)}
                                                sx={{
                                                    cursor: 'pointer', p: 2, borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: form.services.includes(cat._id) ? '#E15B65' : 'rgba(0,0,0,0.06)',
                                                    bgcolor: form.services.includes(cat._id) ? 'rgba(225, 91, 101, 0.04)' : '#fff',
                                                    display: 'flex', alignItems: 'center', gap: 2,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': { borderColor: '#E15B65', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                                }}
                                            >
                                                <Avatar
                                                    src={cat.image ? (cat.image.startsWith('http') ? cat.image : `${API_BASE_URL}${cat.image}`) : ''}
                                                    sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: 'rgba(225, 91, 101, 0.1)', color: '#E15B65' }}
                                                >
                                                    {!cat.image && <BookmarkBorder fontSize="small" />}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: form.services.includes(cat._id) ? '#E15B65' : 'inherit' }}>
                                                        {cat.title}
                                                    </Typography>
                                                    {cat.description && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {cat.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                {form.services.includes(cat._id) && (
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

                        {/* ── THUMBNAIL ─────────────────────────────────── */}
                        <Paper elevation={0} sx={card}>
                            <SL>Package Thumbnail</SL>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                Main image displayed in catalogs and lists.
                            </Typography>
                            <Box
                                component="label"
                                htmlFor="thumb-img"
                                sx={{
                                    ...uploadZoneBase,
                                    borderColor: errors.thumbnail ? '#dc2626' : 'rgba(225, 91, 101, 0.2)',
                                }}
                            >
                                <input id="thumb-img" type="file" accept="image/*" hidden onChange={(e) => handleThumbnailUpload(e.target.files[0])} />
                                {thumbnailPreview ? (
                                    <Box sx={{ position: 'relative', width: '100%' }}>
                                        <Box
                                            component="img"
                                            src={thumbnailPreview}
                                            sx={{ width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: '10px', display: 'block' }}
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' } }}
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

                        {/* ── GALLERY ───────────────────────────────────── */}
                        <Paper elevation={0} sx={card}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Box>
                                    <SL>Gallery</SL>
                                    <Typography variant="caption" color="text.secondary">
                                        Additional photos showcasing details and variations.
                                    </Typography>
                                </Box>
                                {imagePreviews.length > 0 && imagePreviews.length < 10 && (
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddPhotoAlternate />}
                                        sx={{ borderRadius: '10px', fontWeight: 700 }}
                                    >
                                        Add Photos
                                        <input type="file" accept="image/*" multiple hidden onChange={(e) => handleImagesUpload(e.target.files)} />
                                    </Button>
                                )}
                            </Stack>

                            {/* Empty state — same dashed upload zone as thumbnail */}
                            {imagePreviews.length === 0 ? (
                                <Box
                                    component="label"
                                    htmlFor="gallery-input-main"
                                    sx={{ ...uploadZoneBase, borderColor: 'rgba(225, 91, 101, 0.2)' }}
                                >
                                    <input id="gallery-input-main" type="file" accept="image/*" multiple hidden onChange={(e) => handleImagesUpload(e.target.files)} />
                                    <Stack alignItems="center" spacing={1.5}>
                                        <Avatar sx={{ bgcolor: 'rgba(225, 91, 101, 0.1)', color: '#E15B65', width: 56, height: 56 }}>
                                            <CloudUpload />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700}>Click to upload gallery images</Typography>
                                            <Typography variant="caption" color="text.secondary">PNG, JPG or JPEG (Max 10 photos)</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            ) : (
                                /* Filled state — grid of previews */
                                <Box sx={{ bgcolor: '#FFFBF7', border: '1px solid rgba(225, 91, 101, 0.15)', borderRadius: '16px', p: 2 }}>
                                    <Grid container spacing={2}>
                                        {imagePreviews.map((p, i) => (
                                            <Grid item xs={6} sm={4} md={3} key={`gp-${i}`}>
                                                {/* Each card is just a relative box with a fixed height — same approach as thumbnail */}
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: 160,
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        border: '1px solid rgba(0,0,0,0.08)',
                                                        bgcolor: '#fff',
                                                        '&:hover .del-btn': { opacity: 1 }
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={p}
                                                        alt={`Gallery ${i + 1}`}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            display: 'block'
                                                        }}
                                                    />
                                                    {/* Delete overlay */}
                                                    <Box
                                                        className="del-btn"
                                                        sx={{
                                                            position: 'absolute', inset: 0,
                                                            bgcolor: 'rgba(0,0,0,0.38)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            opacity: 0, transition: 'opacity 0.2s',
                                                            backdropFilter: 'blur(2px)'
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            sx={{ bgcolor: '#fff', color: '#dc2626', '&:hover': { bgcolor: '#fff' } }}
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(i); }}
                                                        >
                                                            <Close fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}

                                        {/* Add More tile */}
                                        {imagePreviews.length < 10 && (
                                            <Grid item xs={6} sm={4} md={3}>
                                                <Box
                                                    component="label"
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 1,
                                                        width: '100%',
                                                        height: 160,
                                                        cursor: 'pointer',
                                                        borderRadius: '12px',
                                                        border: '2px dashed rgba(225, 91, 101, 0.25)',
                                                        bgcolor: '#fff',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': { borderColor: '#E15B65', bgcolor: 'rgba(225, 91, 101, 0.04)' }
                                                    }}
                                                >
                                                    <input type="file" accept="image/*" multiple hidden onChange={(e) => handleImagesUpload(e.target.files)} />
                                                    <Avatar sx={{ bgcolor: 'rgba(225, 91, 101, 0.08)', color: '#E15B65', width: 44, height: 44 }}>
                                                        <AddPhotoAlternate />
                                                    </Avatar>
                                                    <Typography sx={{ fontWeight: 700, color: '#E15B65', fontSize: '11px', letterSpacing: '0.5px' }}>
                                                        ADD MORE
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Typography variant="caption" sx={{ mt: 1.5, display: 'block', fontWeight: 600, color: 'text.secondary' }}>
                                        {imagePreviews.length} / 10 photo{imagePreviews.length !== 1 ? 's' : ''} added
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Submit / Reset */}
                        <Stack direction="row" spacing={2} pt={2}>
                            <Button
                                type="submit" variant="contained" size="large" fullWidth
                                startIcon={<AutoAwesome />} disabled={busy}
                                sx={{ py: 1.5, background: 'linear-gradient(135deg, #E15B65 0%, #C2444E 100%)' }}
                            >
                                {busy ? 'Processing...' : isEditMode ? 'Update Package' : 'Publish Invitation'}
                            </Button>
                            {!isEditMode && (
                                <Button
                                    variant="outlined" size="large" fullWidth startIcon={<RotateLeft />}
                                    onClick={() => {
                                        setForm({ name: '', description: '', price: '', advance: '', services: [] });
                                        setThumbnailPreview(null); setThumbnailFile(null);
                                        setImagePreviews([]); setImages([]);
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </Stack>

                    </Stack>
                </Box>
            </Box>

            <Snackbar
                open={snack.open} autoHideDuration={3500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={snack.severity} variant="filled"
                    onClose={() => setSnack(s => ({ ...s, open: false }))}
                    sx={{ borderRadius: '12px' }}
                >
                    {snack.msg}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}