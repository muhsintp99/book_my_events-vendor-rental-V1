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
    EditOutlined,
    DeleteOutline,
    Search,
    AutoAwesome,
    VisibilityOutlined,
    InfoOutlined,
    CurrencyRupee,
    CategoryOutlined,
    DescriptionOutlined,
    Close,
    CollectionsOutlined
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

// ── Components ──────────────────────────────────────────
const SectionLabel = ({ label, icon }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, opacity: 0.8 }}>
        {icon}
        <Typography variant="overline" sx={{ fontWeight: 900, fontSize: '0.65rem', letterSpacing: '1px', color: 'text.secondary' }}>
            {label}
        </Typography>
    </Stack>
);

const ImageCarousel = ({ images, baseUrl }) => {
    const [active, setActive] = useState(0);
    if (!images || images.length === 0) return null;

    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%', bgcolor: '#000' }}>
            <CardMedia
                component="img"
                image={images[active] ? `${baseUrl}${images[active].startsWith('/') ? '' : '/'}${images[active]}` : 'https://placehold.co/600x400?text=No+Image'}
                sx={{ height: '100%', width: '100%', objectFit: 'contain' }}
            />
            {images.length > 1 && (
                <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 5 }}>
                    {images.map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => setActive(i)}
                            sx={{
                                width: i === active ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: i === active ? 'primary.main' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default function InvitationList() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [viewPackage, setViewPackage] = useState(null);
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const moduleId = localStorage.getItem('moduleId');
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('vendor') || localStorage.getItem('user') || '{}');
            const providerId = userData?._id;

            if (!moduleId || !providerId) return;

            const response = await fetch(`${API_BASE_URL}/api/invitation-printing/vendor/${providerId}?moduleId=${moduleId}`, {
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
            const response = await fetch(`${API_BASE_URL}/api/invitation-printing/${deleteId}`, {
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
                                        borderRadius: 5,
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(225, 91, 101, 0.05)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        bgcolor: '#fff',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 20px 40px rgba(225, 91, 101, 0.12)',
                                            '& .card-actions': { opacity: 1, transform: 'translateY(0)' }
                                        }
                                    }}>
                                        <Box sx={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                image={pkg.thumbnail ? `${API_BASE_URL}${pkg.thumbnail.startsWith('/') ? '' : '/'}${pkg.thumbnail}` : 'https://placehold.co/600x400?text=No+Image'}
                                                alt={pkg.packageName}
                                                sx={{
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.6s ease'
                                                }}
                                            />
                                            <Box
                                                className="card-actions"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    bgcolor: 'rgba(26, 10, 0, 0.4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1.5,
                                                    opacity: 0,
                                                    transform: 'translateY(20px)',
                                                    transition: 'all 0.3s ease',
                                                    backdropFilter: 'blur(3px)'
                                                }}
                                            >
                                                <Tooltip title="Quick View">
                                                    <IconButton
                                                        onClick={() => setViewPackage(pkg)}
                                                        sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                                                    >
                                                        <VisibilityOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Package">
                                                    <IconButton
                                                        onClick={() => navigate(`/invitation/edit-package/${pkg._id}`)}
                                                        sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                                                    >
                                                        <EditOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => setDeleteId(pkg._id)}
                                                        sx={{ bgcolor: '#fff', color: '#dc2626', '&:hover': { bgcolor: '#dc2626', color: '#fff' } }}
                                                    >
                                                        <DeleteOutline />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Chip
                                                label={`₹${pkg.packagePrice}`}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    left: 16,
                                                    bgcolor: 'rgba(255,255,255,0.95)',
                                                    color: 'primary.main',
                                                    fontWeight: 800,
                                                    fontSize: '0.9rem',
                                                    backdropFilter: 'blur(4px)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        </Box>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', lineHeight: 1.2 }}>
                                                    {pkg.packageName}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                height: '40px',
                                                lineHeight: 1.5,
                                                mb: 2
                                            }}>
                                                {pkg.description}
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                                                <Chip
                                                    size="small"
                                                    label={pkg.category?.title || 'Invitation'}
                                                    variant="outlined"
                                                    sx={{ borderRadius: '6px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderColor: 'rgba(225, 91, 101, 0.2)', color: 'text.secondary' }}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Delete Confirmation */}
                <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 5, width: '100%', maxWidth: 400, p: 1 } }}>
                    <DialogTitle sx={{ fontWeight: 800, pb: 1, fontSize: '1.4rem' }}>Confirm Removal?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            This will permanently delete <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>"{packages.find(p => p._id === deleteId)?.packageName}"</Box> from your gallery.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                        <Button onClick={() => setDeleteId(null)} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}>Cancel</Button>
                        <Button onClick={handleDelete} variant="contained" sx={{ px: 3, borderRadius: 3, bgcolor: '#dc2626', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#b91c1c' } }}>Delete Permanently</Button>
                    </DialogActions>
                </Dialog>

                {/* Detail View Modal */}
                <Dialog
                    open={Boolean(viewPackage)}
                    onClose={() => setViewPackage(null)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 6, overflow: 'hidden' } }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <IconButton
                            onClick={() => setViewPackage(null)}
                            sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10, bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', '&:hover': { bgcolor: '#fff' } }}
                        >
                            <Close />
                        </IconButton>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ height: { xs: 300, md: '100%' }, position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 5 }}>
                                        <Chip
                                            icon={<CollectionsOutlined sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                                            label="Gallery"
                                            size="small"
                                            sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                                        />
                                    </Box>
                                    <ImageCarousel
                                        images={viewPackage?.images?.length > 0 ? viewPackage.images : [viewPackage?.thumbnail]}
                                        baseUrl={API_BASE_URL}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: { xs: 3, md: 5 } }}>
                                    <Stack spacing={3}>
                                        <Box>
                                            <Chip
                                                label={viewPackage?.category?.title || 'Invitation Design'}
                                                size="small"
                                                sx={{ mb: 1.5, bgcolor: 'rgba(225, 91, 101, 0.1)', color: 'primary.main', fontWeight: 700, borderRadius: '8px' }}
                                            />
                                            <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', serif", mb: 1 }}>
                                                {viewPackage?.packageName}
                                            </Typography>
                                            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 900 }}>
                                                ₹{viewPackage?.packagePrice}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <SectionLabel label="Description" icon={<DescriptionOutlined sx={{ fontSize: 18 }} />} />
                                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                                {viewPackage?.description}
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 4 }}>
                                                    <SectionLabel label="Advance" icon={<CurrencyRupee sx={{ fontSize: 16 }} />} />
                                                    <Typography variant="h6" fontWeight={800}>₹{viewPackage?.advanceBookingAmount || 0}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 4 }}>
                                                    <SectionLabel label="Category" icon={<CategoryOutlined sx={{ fontSize: 16 }} />} />
                                                    <Typography variant="h6" fontWeight={800} noWrap>{viewPackage?.category?.title || 'Standard'}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<EditOutlined />}
                                                onClick={() => {
                                                    const id = viewPackage?._id;
                                                    setViewPackage(null);
                                                    navigate(`/invitation/edit-package/${id}`);
                                                }}
                                                sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none' }}
                                            >
                                                Edit Design
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<DeleteOutline />}
                                                color="error"
                                                onClick={() => {
                                                    setDeleteId(viewPackage?._id);
                                                    setViewPackage(null);
                                                }}
                                                sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none' }}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>

                {/* Notification */}
                <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 3 }}>{snack.msg}</Alert>
                </Snackbar>

            </Box>
        </ThemeProvider>
    );
}
