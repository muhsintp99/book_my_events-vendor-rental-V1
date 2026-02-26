import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    TextField,
    InputAdornment,
    Avatar,
    Stack,
    Snackbar,
    Alert,
    Tooltip,
    Fade,
    Paper,
    Divider
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Search,
    AutoAwesome,
    BookmarkBorder,
    Share,
    Visibility,
    MoreVert,
    FavoriteBorder
} from '@mui/icons-material';

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
    shape: { borderRadius: 14 }
});

export default function InvitationList() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const moduleId = localStorage.getItem('moduleId');
            const token = localStorage.getItem('token');
            if (!moduleId) return;

            const response = await fetch(`${API_BASE_URL}/api/invitation/list?moduleId=${moduleId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const data = await response.json();
            if (data.success) {
                setPackages(data.data || []);
            }
        } catch (err) {
            console.error(err);
            setSnack({ open: true, msg: 'Failed to fetch packages', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, [API_BASE_URL]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/invitation/${deleteId}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const data = await response.json();
            if (data.success) {
                setSnack({ open: true, msg: 'Package removed successfully', severity: 'success' });
                setPackages(prev => prev.filter(p => p._id !== deleteId));
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setSnack({ open: true, msg: err.message, severity: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    const filtered = packages.filter(p =>
        p.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ width: '100%', bgcolor: '#FDF6EE', minHeight: '100vh', p: { xs: 2.5, sm: 4 } }}>

                {/* Header Section */}
                <Grid container alignItems="center" justifyContent="space-between" spacing={3} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', sm: '2.2rem' } }}>
                            My{' '}
                            <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                                Invitation
                            </Box>{' '}
                            Gallery
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5} fontSize="14px">
                            Manage and showcase your exquisite invitation collections.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} textAlign={{ xs: 'left', sm: 'right' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            onClick={() => navigate('/invitation/add-package')}
                            sx={{
                                px: 3.5,
                                py: 1.5,
                                boxShadow: '0 8px 16px rgba(225, 91, 101, 0.25)',
                                background: 'linear-gradient(135deg, #E15B65 0%, #C2444E 100%)',
                                '&:hover': { boxShadow: '0 12px 20px rgba(225, 91, 101, 0.35)' }
                            }}
                        >
                            Add New Design
                        </Button>
                    </Grid>
                </Grid>

                {/* Search & Stats Section */}
                <Paper elevation={0} sx={{ mb: 4, p: 2, borderRadius: 4, bgcolor: '#fff', border: '1px solid rgba(225, 91, 101, 0.08)', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search designs..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flex: 1, minWidth: '200px' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search color="primary" /></InputAdornment>
                        }}
                    />
                    <Chip
                        icon={<AutoAwesome sx={{ fontSize: '16px !important' }} />}
                        label={`${filtered.length} Packages Total`}
                        sx={{ bgcolor: '#FFFBF7', color: '#E15B65', fontWeight: 700, border: '1px solid rgba(225, 91, 101, 0.1)' }}
                    />
                </Paper>

                {/* Content Area */}
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                        <CircularProgress color="primary" />
                    </Box>
                ) : filtered.length === 0 ? (
                    <Box textAlign="center" py={10} sx={{ borderRadius: 6, bgcolor: '#fff', border: '2px dashed rgba(225, 91, 101, 0.15)' }}>
                        <BookmarkBorder sx={{ fontSize: 60, color: 'primary.light', mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" color="text.primary" fontWeight={600}>No Designs Found</Typography>
                        <Typography variant="body2" color="text.secondary">Start by adding your first invitation package.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3.5}>
                        {filtered.map((pkg, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                                <Fade in timeout={400 + idx * 100}>
                                    <Card sx={{
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 30px rgba(225, 91, 101, 0.12)'
                                        }
                                    }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={pkg.thumbnail ? `${API_BASE_URL}${pkg.thumbnail.startsWith('/') ? '' : '/'}${pkg.thumbnail}` : 'https://placehold.co/600x400?text=No+Image'}
                                                alt={pkg.packageName}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}><Visibility fontSize="small" /></IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Chip
                                                label={`₹${pkg.packagePrice}`}
                                                sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: '#1A0A00', color: '#fff', fontWeight: 700, px: 1 }}
                                            />
                                        </Box>

                                        <CardContent sx={{ p: 2.5 }}>
                                            <Typography variant="h6" fontWeight={700} noWrap sx={{ mb: 1, fontFamily: "'Playfair Display', serif" }}>
                                                {pkg.packageName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                height: '40px',
                                                lineHeight: 1.4,
                                                mb: 2.5
                                            }}>
                                                {pkg.description}
                                            </Typography>

                                            <Divider sx={{ mb: 2, opacity: 0.5 }} />

                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="Edit Design">
                                                        <IconButton size="small" onClick={() => navigate(`/invitation/edit-package/${pkg._id}`)} sx={{ color: 'primary.main', bgcolor: 'rgba(225, 91, 101, 0.08)' }}><Edit fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Design">
                                                        <IconButton size="small" onClick={() => setDeleteId(pkg._id)} sx={{ color: '#666', bgcolor: '#f5f5f5' }}><Delete fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                </Stack>
                                                <Button
                                                    variant="text"
                                                    endIcon={<Share fontSize="small" />}
                                                    sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
                                                >
                                                    Share
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Delete Confirmation */}
                <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 4, px: 1, py: 1.5 } }}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Confirm Removal?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary">
                            This will permanently delete this invitation design from your gallery. This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setDeleteId(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                        <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>Remove Design</Button>
                    </DialogActions>
                </Dialog>

                {/* Notification */}
                <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 3 }}>{snack.msg}</Alert>
                </Snackbar>

            </Box>
        </ThemeProvider>
    );
}
