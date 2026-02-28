import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardMedia, CardContent, Typography, IconButton, TextField,
    InputAdornment, Grid, Button, Chip, Switch, Dialog, DialogTitle,
    DialogActions, Snackbar, Alert, CircularProgress, Stack
} from '@mui/material';
import { Celebration, Search, Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';
const THEME = '#C62828';
const THEME_DARK = '#8E0000';
const THEME_LIGHT = '#FFCDD2';

export default function Panthallist() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const providerId = user?._id;
    const token = localStorage.getItem('token');

    const [packages, setPackages] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [packageToDelete, setPackageToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/panthal/vendor/${providerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPackages(res.data?.data || []);
        } catch (err) {
            console.error('Error fetching panthal packages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (providerId) fetchPackages(); }, [providerId]);

    const filteredPackages = packages.filter(p =>
        (p.packageName || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = async (id, current) => {
        try {
            await axios.put(`${API}/api/panthal/${id}`, { isActive: !current }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPackages();
            setSnackbar({ open: true, message: `Package ${!current ? 'activated' : 'deactivated'}`, severity: 'success' });
        } catch { setSnackbar({ open: true, message: 'Toggle failed', severity: 'error' }); }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API}/api/panthal/${packageToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPackageToDelete(null);
            fetchPackages();
            setSnackbar({ open: true, message: 'Package deleted', severity: 'success' });
        } catch { setSnackbar({ open: true, message: 'Delete failed', severity: 'error' }); }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Celebration sx={{ color: THEME, fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: THEME }}>
                        Panthal & Decoration Packages
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />}
                    sx={{ bgcolor: THEME, '&:hover': { bgcolor: THEME_DARK }, borderRadius: 2, fontWeight: 700, px: 3 }}
                    onClick={() => navigate('/panthal/addpackage')}>
                    Add Package
                </Button>
            </Box>

            <TextField fullWidth placeholder="Search panthal & decoration packages..."
                value={search} onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: THEME }} />
                </Box>
            ) : filteredPackages.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Celebration sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No packages found</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredPackages.map(pkg => (
                        <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                            <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } }}>
                                <CardMedia component="img" height="180"
                                    image={pkg.image ? `${API}/${pkg.image}` : 'https://via.placeholder.com/300x180?text=Panthal'}
                                    sx={{ objectFit: 'cover' }} />
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                        <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: '70%' }}>
                                            {pkg.packageName}
                                        </Typography>
                                        <Chip label={pkg.isActive ? 'Active' : 'Inactive'} size="small"
                                            sx={{ bgcolor: pkg.isActive ? '#e8f5e9' : '#ffebee', color: pkg.isActive ? '#2e7d32' : '#c62828', fontWeight: 700 }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight={800} color={THEME} sx={{ mb: 1 }}>
                                        ₹{pkg.packagePrice || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {pkg.description || 'No description'}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <IconButton size="small" onClick={() => navigate(`/panthal/edit/${pkg._id}`)} sx={{ color: THEME }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => setPackageToDelete(pkg._id)} sx={{ color: '#ef5350' }}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Switch checked={pkg.isActive} onChange={() => handleToggle(pkg._id, pkg.isActive)}
                                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: THEME }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: THEME } }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={!!packageToDelete} onClose={() => setPackageToDelete(null)}>
                <DialogTitle>Delete this package?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setPackageToDelete(null)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
