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
    Category,
    Security
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.bookmyevent.ae/api/mehandi'; // Backend uses mehandi endpoint for many service modules

export default function BouncersList() {
    const navigate = useNavigate();
    const [bouncersList, setBouncersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [searchQuery, setPendingSearch] = useState('');
    const [openView, setOpenView] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedBouncer, setSelectedBouncer] = useState(null);
    const [bouncerToDelete, setBouncerToDelete] = useState(null);

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

    const fetchBouncers = useCallback(async () => {
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
            if (result.success) setBouncersList(result.data || []);
        } catch (err) {
            setToast({ open: true, message: err.message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [providerId, token]);

    useEffect(() => {
        fetchBouncers();
    }, [fetchBouncers]);

    const handleView = (bouncer) => {
        setSelectedBouncer(bouncer);
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
                setBouncersList((prev) => prev.map((m) => (m._id === id ? { ...m, isActive: !current } : m)));
                setToast({ open: true, message: 'Status updated', severity: 'success' });
            }
        } catch {
            setToast({ open: true, message: 'Failed to update status', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/${bouncerToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBouncersList((prev) => prev.filter((m) => m._id !== bouncerToDelete));
                setToast({ open: true, message: 'Package deleted', severity: 'success' });
            }
        } catch {
            setToast({ open: true, message: 'Delete failed', severity: 'error' });
        } finally {
            setOpenConfirm(false);
            setBouncerToDelete(null);
        }
    };

    const filteredBouncers = useMemo(() => {
        return bouncersList.filter((m) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                m.packageName?.toLowerCase().includes(query) ||
                m.description?.toLowerCase().includes(query)
            );
        });
    }, [bouncersList, searchQuery]);

    const THEME_COLOR = '#0f172a'; // Slate-ish color for bouncers/security

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 4 }}>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #1e293b 100%)`,
                    color: 'white',
                    py: 4,
                    px: 3,
                    borderRadius: '0 0 24px 24px',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.3)'
                }}
            >
                <Container maxWidth="xl">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Bouncers & Security Packages
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {bouncersList.length} total packages • {bouncersList.filter((m) => m.isActive).length} active
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            onClick={() => navigate('/bouncers/addpackage')}
                            sx={{
                                bgcolor: 'white',
                                color: THEME_COLOR,
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
                                        <Search sx={{ color: THEME_COLOR, fontSize: 28 }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </CardContent>
                </Card>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} sx={{ color: THEME_COLOR }} />
                    </Box>
                ) : filteredBouncers.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 8 }}>
                        <Security sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary">No packages found</Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 3, bgcolor: THEME_COLOR }}
                            onClick={() => navigate('/bouncers/addpackage')}
                        >
                            Create Your First Package
                        </Button>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {filteredBouncers.map((bouncer) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={bouncer._id}>
                                <Card sx={{ height: '100%', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                                    <Box sx={{ position: 'relative', pt: '75%', bgcolor: '#f5f5f5' }}>
                                        {bouncer.image ? (
                                            <CardMedia
                                                component="img"
                                                image={getImageUrl(bouncer.image)}
                                                alt={bouncer.packageName}
                                                sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Security sx={{ fontSize: 60, color: '#ccc' }} />
                                            </Box>
                                        )}
                                    </Box>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} noWrap>{bouncer.packageName}</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: THEME_COLOR, mb: 2 }}>{formatINR(bouncer.packagePrice)}</Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button fullWidth variant="outlined" startIcon={<Visibility />} onClick={() => handleView(bouncer)}>View</Button>
                                            <IconButton color="primary" onClick={() => navigate(`/bouncers/edit/${bouncer._id}`)}><Edit /></IconButton>
                                            <IconButton color="error" onClick={() => { setBouncerToDelete(bouncer._id); setOpenConfirm(true); }}><Delete /></IconButton>
                                        </Stack>
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" fontWeight={500}>Status</Typography>
                                            <Switch checked={bouncer.isActive} onChange={() => handleToggleStatus(bouncer._id, bouncer.isActive)} />
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
                <DialogTitle sx={{ bgcolor: THEME_COLOR, color: 'white' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{selectedBouncer?.packageName}</Typography>
                        <IconButton onClick={() => setOpenView(false)} sx={{ color: 'white' }}><Close /></IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedBouncer && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                {selectedBouncer.image && <img src={getImageUrl(selectedBouncer.image)} alt={selectedBouncer.packageName} style={{ width: '100%', borderRadius: '12px' }} />}
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" gutterBottom>Description</Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>{selectedBouncer.description}</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Stack spacing={1}>
                                    <Typography variant="h6">Pricing</Typography>
                                    <Typography variant="body1">Full Price: <b>{formatINR(selectedBouncer.packagePrice)}</b></Typography>
                                    <Typography variant="body1">Advance: <b>{formatINR(selectedBouncer.advanceBookingAmount)}</b></Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenView(false)}>Close</Button>
                    <Button variant="contained" sx={{ bgcolor: THEME_COLOR }} onClick={() => navigate(`/bouncers/edit/${selectedBouncer?._id}`)}>Edit Package</Button>
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
