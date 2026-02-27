import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Button,
    TextField,
    Card,
    CardContent,
    CardMedia,
    Switch,
    IconButton,
    Stack,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Avatar,
    InputAdornment,
    Grid,
    Divider,
    Container,
    Typography,
    Paper
} from '@mui/material';
import {
    Visibility,
    Edit,
    Delete,
    Search,
    Add,
    Close,
    AttachMoney,
    Schedule,
    Info,
    Image as ImageIcon,
    CheckCircle,
    LocalOffer,
    EventAvailable,
    Payment,
    Category
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.bookmyevent.ae/api/mehandi'; // Backend uses mehandi endpoint for many service modules

export default function LightList() {
    const navigate = useNavigate();
    const [lightList, setLightList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [searchQuery, setPendingSearch] = useState('');
    const [openView, setOpenView] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedLight, setSelectedLight] = useState(null);
    const [lightToDelete, setLightToDelete] = useState(null);

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const providerId = userData?._id;

    const getImageUrl = (path) => {
        if (!path) return null;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `https://api.bookmyevent.ae/${cleanPath}`;
    };

    const formatINR = (value) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value || 0);

    const fetchLight = useCallback(async () => {
        if (!providerId || !token) {
            setToast({ open: true, message: 'Please login again', severity: 'error' });
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/vendor/${providerId}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Failed to load packages');
            const result = await res.json();
            if (result.success) setLightList(result.data || []);
        } catch (err) {
            setToast({ open: true, message: err.message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [providerId, token]);

    useEffect(() => {
        fetchLight();
    }, [fetchLight]);

    const handleView = (light) => {
        setSelectedLight(light);
        setOpenView(true);
    };

    const handleToggleStatus = async (id, current) => {
        try {
            const res = await fetch(`${API_BASE_URL}/${id}/toggle-active`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setLightList((prev) => prev.map((m) => (m._id === id ? { ...m, isActive: !current } : m)));
                setToast({ open: true, message: 'Status updated', severity: 'success' });
            }
        } catch {
            setToast({ open: true, message: 'Failed to update status', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/${lightToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setLightList((prev) => prev.filter((m) => m._id !== lightToDelete));
                setToast({ open: true, message: 'Package deleted', severity: 'success' });
            }
        } catch {
            setToast({ open: true, message: 'Delete failed', severity: 'error' });
        } finally {
            setOpenConfirm(false);
            setLightToDelete(null);
        }
    };

    const filteredLights = useMemo(() => {
        return lightList.filter((m) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                m.packageName?.toLowerCase().includes(query) ||
                m.description?.toLowerCase().includes(query)
            );
        });
    }, [lightList, searchQuery]);

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 4 }}>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #673ab7 0%, #4527a0 100%)',
                    color: 'white',
                    py: 4,
                    px: 3,
                    borderRadius: '0 0 24px 24px',
                    boxShadow: '0 4px 20px rgba(103, 58, 183, 0.3)'
                }}
            >
                <Container maxWidth="xl">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Light & Sound Packages
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {lightList.length} total packages • {lightList.filter((m) => m.isActive).length} active
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            onClick={() => navigate('/light/addpackage')}
                            sx={{
                                bgcolor: 'white',
                                color: '#673ab7',
                                fontWeight: 600,
                                px: 3,
                                '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                        >
                            Add New Package
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Box sx={{ width: '100%', px: 2, mt: 4 }}>
                <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <CardContent>
                        <TextField
                            fullWidth
                            placeholder="Search by package name or description..."
                            value={searchQuery}
                            onChange={(e) => setPendingSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#673ab7', fontSize: 28 }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </CardContent>
                </Card>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} sx={{ color: '#673ab7' }} />
                    </Box>
                ) : filteredLights.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 8 }}>
                        <ImageIcon sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary">No packages found</Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 3, bgcolor: '#673ab7' }}
                            onClick={() => navigate('/light/addpackage')}
                        >
                            Create Your First Package
                        </Button>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {filteredLights.map((light) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={light._id}>
                                <Card sx={{ height: '100%', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                                    <Box sx={{ position: 'relative', pt: '75%', bgcolor: '#f5f5f5' }}>
                                        {light.image ? (
                                            <CardMedia
                                                component="img"
                                                image={getImageUrl(light.image)}
                                                alt={light.packageName}
                                                sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ImageIcon sx={{ fontSize: 60, color: '#ccc' }} />
                                            </Box>
                                        )}
                                    </Box>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} noWrap>{light.packageName}</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#673ab7', mb: 2 }}>{formatINR(light.packagePrice)}</Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button fullWidth variant="outlined" startIcon={<Visibility />} onClick={() => handleView(light)}>View</Button>
                                            <IconButton color="primary" onClick={() => navigate(`/light/edit/${light._id}`)}><Edit /></IconButton>
                                            <IconButton color="error" onClick={() => { setLightToDelete(light._id); setOpenConfirm(true); }}><Delete /></IconButton>
                                        </Stack>
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" fontWeight={500}>Status</Typography>
                                            <Switch checked={light.isActive} onChange={() => handleToggleStatus(light._id, light.isActive)} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* View Modal */}
            <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#673ab7', color: 'white' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{selectedLight?.packageName}</Typography>
                        <IconButton onClick={() => setOpenView(false)} sx={{ color: 'white' }}><Close /></IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedLight && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                {selectedLight.image && <img src={getImageUrl(selectedLight.image)} alt={selectedLight.packageName} style={{ width: '100%', borderRadius: '12px' }} />}
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" gutterBottom>Description</Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>{selectedLight.description}</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Stack spacing={1}>
                                    <Typography variant="h6">Pricing</Typography>
                                    <Typography variant="body1">Full Price: <b>{formatINR(selectedLight.packagePrice)}</b></Typography>
                                    <Typography variant="body1">Advance: <b>{formatINR(selectedLight.advanceBookingAmount)}</b></Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenView(false)}>Close</Button>
                    <Button variant="contained" sx={{ bgcolor: '#673ab7' }} onClick={() => navigate(`/light/edit/${selectedLight?._id}`)}>Edit Package</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Delete Package?</DialogTitle>
                <DialogContent>This action cannot be undone.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })}>
                <Typography sx={{ bgcolor: toast.severity === 'success' ? 'success.main' : 'error.main', color: 'white', p: 2, borderRadius: 1 }}>{toast.message}</Typography>
            </Snackbar>
        </Box>
    );
}
