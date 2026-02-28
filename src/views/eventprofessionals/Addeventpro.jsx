import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    createTheme, ThemeProvider, CssBaseline, Box, Typography, TextField, Button,
    InputAdornment, Stack, Paper, Snackbar, Alert, Avatar, IconButton,
    LinearProgress, CircularProgress
} from '@mui/material';
import { CloudUpload, Close, AutoAwesome, RotateLeft } from '@mui/icons-material';

const theme = createTheme({
    palette: {
        primary: { main: '#4527A0', dark: '#311B92', light: '#D1C4E9', contrastText: '#fff' },
        secondary: { main: '#6A1B9A' },
        background: { default: '#f8fafc', paper: '#fff' },
        text: { primary: '#0f172a', secondary: '#475569' }
    },
    typography: { fontFamily: "'DM Sans', sans-serif", h4: { fontFamily: "'Playfair Display', serif" } },
    shape: { borderRadius: 14 },
    components: {
        MuiCssBaseline: {
            styleOverrides: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');`
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12, backgroundColor: '#F8F5FF', fontFamily: "'DM Sans', sans-serif", fontSize: '14.5px',
                    '& fieldset': { borderColor: 'rgba(69,39,160,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(69,39,160,0.5) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#4527A0 !important', borderWidth: 2 },
                    transition: 'box-shadow .3s',
                    '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(69,39,160,0.10)' }
                }
            }
        }
    }
});

const API = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

export default function AddEventproPackage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const providerId = user?._id;
    const moduleId = localStorage.getItem('moduleId');
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({ packageName: '', description: '', packagePrice: '', advanceBookingAmount: '', additionalHourPrice: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (isEdit) {
            setFetchLoading(true);
            fetch(`${API}/api/eventprofessionals/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.json()).then(d => {
                    const p = d.data || d;
                    setForm({ packageName: p.packageName || '', description: p.description || '', packagePrice: p.packagePrice || '', advanceBookingAmount: p.advanceBookingAmount || '', additionalHourPrice: p.additionalHourPrice || '' });
                    if (p.image) setPreview(`${API}/${p.image}`);
                }).catch(console.error).finally(() => setFetchLoading(false));
        }
    }, [id]);

    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); };
    const handleImage = (e) => { const file = e.target.files?.[0]; if (file) { setImage(file); setPreview(URL.createObjectURL(file)); } };
    const validate = () => { const e = {}; if (!form.packageName.trim()) e.packageName = 'Required'; if (!form.packagePrice) e.packagePrice = 'Required'; setErrors(e); return !Object.keys(e).length; };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('packageName', form.packageName); fd.append('description', form.description);
            fd.append('packagePrice', form.packagePrice); fd.append('advanceBookingAmount', form.advanceBookingAmount);
            fd.append('additionalHourPrice', form.additionalHourPrice); fd.append('providerId', providerId);
            fd.append('module', moduleId); if (image) fd.append('image', image);
            const url = isEdit ? `${API}/api/eventprofessionals/${id}` : `${API}/api/eventprofessionals`;
            await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
            setSnackbar({ open: true, message: isEdit ? 'Package updated!' : 'Package created!', severity: 'success' });
            setTimeout(() => navigate('/eventprofessionals/packagelist'), 1200);
        } catch { setSnackbar({ open: true, message: 'Failed to save package', severity: 'error' }); }
        finally { setLoading(false); }
    };

    const handleReset = () => { setForm({ packageName: '', description: '', packagePrice: '', advanceBookingAmount: '', additionalHourPrice: '' }); setImage(null); setPreview(null); setErrors({}); };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                    {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                        <Avatar sx={{ bgcolor: '#4527A0', width: 56, height: 56 }}><AutoAwesome /></Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700} color="primary">
                                {isEdit ? 'Edit Professional Package' : 'Create Professional Package'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {isEdit ? 'Update your event professional package details' : 'Add a new event professional service package'}
                            </Typography>
                        </Box>
                    </Stack>
                    {fetchLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: '#4527A0' }} /></Box>
                    ) : (
                        <Stack spacing={3}>
                            <TextField fullWidth label="Package Name" name="packageName" placeholder="Enter event professional package name"
                                value={form.packageName} onChange={handleChange} error={!!errors.packageName} helperText={errors.packageName} />
                            <TextField fullWidth multiline rows={4} label="Description" name="description"
                                placeholder="Describe your event professional services..." value={form.description} onChange={handleChange} />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField fullWidth label="Package Price" name="packagePrice" type="number" value={form.packagePrice} onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} error={!!errors.packagePrice} helperText={errors.packagePrice} />
                                <TextField fullWidth label="Advance Amount" name="advanceBookingAmount" type="number" value={form.advanceBookingAmount} onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
                            </Stack>
                            <TextField fullWidth label="Additional Hour Price" name="additionalHourPrice" type="number" value={form.additionalHourPrice} onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
                            <Box>
                                <Button component="label" variant="outlined" startIcon={<CloudUpload />}
                                    sx={{ borderColor: '#4527A0', color: '#4527A0', '&:hover': { borderColor: '#311B92', bgcolor: 'rgba(69,39,160,0.04)' } }}>
                                    Upload Package Image
                                    <input hidden type="file" accept="image/*" onChange={handleImage} />
                                </Button>
                                {preview && (
                                    <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                                        <img src={preview} alt="preview" style={{ width: 200, height: 140, borderRadius: 12, objectFit: 'cover' }} />
                                        <IconButton size="small" onClick={() => { setImage(null); setPreview(null); }}
                                            sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#ef5350', color: '#fff', '&:hover': { bgcolor: '#c62828' } }}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                            <Stack direction="row" spacing={2}>
                                <Button fullWidth variant="contained" onClick={handleSubmit} disabled={loading} sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem' }}>
                                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (isEdit ? 'Update Package' : 'Create Package')}
                                </Button>
                                <Button fullWidth variant="outlined" onClick={handleReset} startIcon={<RotateLeft />} sx={{ py: 1.5, fontWeight: 700 }}>Reset</Button>
                            </Stack>
                        </Stack>
                    )}
                </Paper>
                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}
