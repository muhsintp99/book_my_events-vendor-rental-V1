import { useState, useEffect, useCallback, useMemo } from 'react';
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
    Zoom,
    Paper,
    Divider,
    Switch,
    Container,
    alpha,
    useTheme
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
    CollectionsOutlined,
    Diamond,
    CheckCircle,
    Inventory as InventoryIcon,
    Palette,
    Description,
    AttachMoney,
    LocalOffer,
    Visibility
} from '@mui/icons-material';

// ── Theme & Styles ──────────────────────────────────────────
const THEME_COLOR = '#E15B65';
const SECONDARY_COLOR = '#c14a54';
const ACCENT_COLOR = '#FFD700';
const DARK_BG = '#1A202C';
const GLASS_BG = 'rgba(255, 255, 255, 0.9)';

const theme = createTheme({
    palette: {
        primary: { main: THEME_COLOR, dark: SECONDARY_COLOR, light: '#F09898', contrastText: '#fff' },
        secondary: { main: '#D4A017' },
        background: { default: '#F0F2F5', paper: '#fff' },
        text: { primary: '#2D3748', secondary: '#718096' }
    },
    typography: {
        fontFamily: "'DM Sans', sans-serif",
        h4: { fontFamily: "'Playfair Display', serif" },
        h2: { fontFamily: "'Playfair Display', serif" }
    },
    shape: { borderRadius: 16 }
});

const SectionTitle = ({ title, sx }) => (
    <Typography
        variant="overline"
        sx={{
            display: 'block',
            color: THEME_COLOR,
            fontWeight: 900,
            fontSize: '12px',
            letterSpacing: '1.5px',
            mb: 2,
            pb: 0.5,
            borderBottom: `2px solid ${alpha(THEME_COLOR, 0.1)}`,
            width: 'fit-content',
            ...sx
        }}
    >
        {title}
    </Typography>
);

const DetailItem = ({ icon, label, value, chip, success, error, bold, color }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        py: 1.2,
        borderBottom: '1px solid #f0f0f0',
        '&:hover': { bgcolor: alpha(THEME_COLOR, 0.02) },
        transition: '0.2s'
    }}>
        <Box sx={{ color: THEME_COLOR, mt: 0.5, display: 'flex' }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '10px' }}>
                {label}
            </Typography>
            {chip ? (
                <Box sx={{ mt: 0.5 }}>
                    <Chip
                        label={value}
                        size="small"
                        color={success ? 'success' : error ? 'error' : 'default'}
                        sx={{ fontWeight: 800, fontSize: '10px', height: 20 }}
                    />
                </Box>
            ) : (
                <Typography variant="body2" sx={{ fontWeight: bold ? 800 : 600, mt: 0.2, color: color || '#2D3748', fontSize: '0.9rem' }}>
                    {value || 'Not specified'}
                </Typography>
            )}
        </Box>
    </Box>
);

const SpecBox = ({ icon, label, value, color }) => (
    <Box sx={{
        p: 2,
        borderRadius: '16px',
        bgcolor: '#fff',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        height: '100%',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            borderColor: THEME_COLOR
        }
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '10px' }}>
                {label}
            </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 800, color: color || '#1e293b', fontSize: '0.9rem' }}>
            {value}
        </Typography>
    </Box>
);

const ImageCarousel = ({ images, baseUrl, active, setActive }) => {
    if (!images || images.length === 0) return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F7FAFC' }}>
            <CollectionsOutlined sx={{ fontSize: 60, color: '#CBD5E0' }} />
        </Box>
    );

    const currentImg = images[active || 0];
    const fullPath = currentImg ? (currentImg.startsWith('http') ? currentImg : `${baseUrl}${currentImg.startsWith('/') ? '' : '/'}${currentImg}`) : 'https://placehold.co/600x400?text=No+Image';

    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%', bgcolor: '#FAF8F6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fade in={true} key={active || 0} timeout={500}>
                <CardMedia
                    component="img"
                    image={fullPath}
                    sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
            </Fade>
        </Box>
    );
};

export default function InvitationList() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [viewPackage, setViewPackage] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    const navigate = useNavigate();
    const muiTheme = useTheme();

    useEffect(() => {
        if (viewPackage) setActiveImageIndex(0);
    }, [viewPackage]);

    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

    const fetchPackages = useCallback(async () => {
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
    }, [API_BASE_URL]);

    const handleToggleStatus = async (id, current) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/invitation-printing/${id}/toggle-active`, {
                method: 'PATCH',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const data = await response.json();
            if (data.success) {
                setPackages(prev => prev.map(p => p._id === id ? { ...p, isActive: !current } : p));
                setSnack({ open: true, msg: 'Status updated successfully', severity: 'success' });
            }
        } catch (err) {
            setSnack({ open: true, msg: 'Failed to update status', severity: 'error' });
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

    const filtered = useMemo(() => {
        return packages.filter(p =>
            p.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [packages, searchTerm]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh', pb: 8 }}>
                {/* ── Premium Header with Glassmorphism ── */}
                <Box sx={{
                    position: 'relative',
                    minHeight: { xs: '450px', md: '480px' },
                    background: `linear-gradient(135deg, #1A202C 0%, #2D3748 100%)`,
                    color: 'white',
                    pt: { xs: 6, md: 10 },
                    pb: { xs: 12, md: 15 },
                    px: { xs: 2, md: 4 },
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-5%',
                        width: '400px',
                        height: '400px',
                        background: `radial-gradient(circle, ${alpha(THEME_COLOR, 0.15)} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        zIndex: 0
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: '-20%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, ${alpha(ACCENT_COLOR, 0.1)} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        zIndex: 0
                    }} />

                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
                            <Box>
                                <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                    Invitation Gallery
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, mb: 4, maxWidth: 600 }}>
                                    Manage your exquisite invitation collections. Showcase your designs with elegance and precision.
                                </Typography>
                                <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                                    {[
                                        { label: 'Total Designs', value: packages.length, icon: <CollectionsOutlined /> },
                                        { label: 'Active Collection', value: packages.filter(o => o.isActive).length, icon: <CheckCircle /> },
                                    ].map((stat, i) => (
                                        <Paper
                                            key={i}
                                            elevation={0}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                px: 3,
                                                py: 1.5,
                                                borderRadius: '20px',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                }
                                            }}
                                        >
                                            <Avatar sx={{
                                                bgcolor: alpha(THEME_COLOR, 0.2),
                                                color: THEME_COLOR,
                                                width: 48,
                                                height: 48,
                                                boxShadow: `0 0 20px ${alpha(THEME_COLOR, 0.3)}`
                                            }}>
                                                {stat.icon}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1, color: 'white' }}>{stat.value}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'white', display: 'block', mt: 0.5 }}>{stat.label}</Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Add />}
                                onClick={() => navigate('/invitation/add-package')}
                                sx={{
                                    bgcolor: THEME_COLOR,
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    px: 4,
                                    py: 1.8,
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    boxShadow: `0 12px 24px ${alpha(THEME_COLOR, 0.3)}`,
                                    '&:hover': {
                                        bgcolor: SECONDARY_COLOR,
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 16px 32px ${alpha(THEME_COLOR, 0.4)}`,
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                Add New Design
                            </Button>
                        </Stack>
                    </Container>
                </Box>

                <Container maxWidth="xl" sx={{ mt: { xs: -6, md: -8 }, position: 'relative', zIndex: 10 }}>
                    {/* ── Standalone Search Bar ── */}
                    <Paper elevation={4} sx={{
                        borderRadius: '24px',
                        p: 1,
                        mb: 6,
                        background: GLASS_BG,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Search by package name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ pl: 3 }}>
                                        <Search sx={{ color: '#718096', fontSize: 28 }} />
                                    </InputAdornment>
                                ),
                                sx: { height: 70, fontSize: '1.1rem', fontWeight: 500, color: '#2D3748' }
                            }}
                        />
                        <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1 }} />
                        <Box sx={{ pr: 2 }}>
                            <Tooltip title="Collections">
                                <IconButton sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <CollectionsOutlined sx={{ color: THEME_COLOR }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>

                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 15 }}>
                            <CircularProgress size={64} thickness={4} sx={{ color: THEME_COLOR }} />
                            <Typography variant="h6" sx={{ mt: 3, fontWeight: 600, color: 'text.secondary' }}>Loading your gallery...</Typography>
                        </Box>
                    ) : filtered.length === 0 ? (
                        <Fade in={true}>
                            <Paper sx={{
                                borderRadius: '32px',
                                textAlign: 'center',
                                py: 12,
                                px: 4,
                                bgcolor: 'white',
                                border: '2px dashed #E2E8F0'
                            }}>
                                <Avatar sx={{ bgcolor: '#F7FAFC', width: 120, height: 120, mx: 'auto', mb: 4 }}>
                                    <InventoryIcon sx={{ fontSize: 60, color: '#CBD5E0' }} />
                                </Avatar>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#2D3748', mb: 2 }}>
                                    {packages.length === 0 ? "Inventory is Empty" : "No Designs Found"}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', fontWeight: 400 }}>
                                    {packages.length === 0
                                        ? "Start building your digital showroom by adding your first invitation design."
                                        : "We couldn't find any designs matching your search. Please try different keywords."}
                                </Typography>
                                {packages.length === 0 && (
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/invitation/add-package')}
                                        sx={{
                                            bgcolor: THEME_COLOR,
                                            px: 6,
                                            py: 2,
                                            borderRadius: '16px',
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            '&:hover': { bgcolor: SECONDARY_COLOR }
                                        }}
                                    >
                                        Create Your First Piece
                                    </Button>
                                )}
                            </Paper>
                        </Fade>
                    ) : (
                        <Grid container spacing={4}>
                            {filtered.map((pkg, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={pkg._id}>
                                    <Zoom in={true} style={{ transitionDelay: `${index * 40}ms` }}>
                                        <Card sx={{
                                            height: '100%',
                                            borderRadius: '28px',
                                            bgcolor: 'white',
                                            overflow: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                            position: 'relative',
                                            border: '1px solid #E2E8F0',
                                            '&:hover': {
                                                transform: 'translateY(-12px)',
                                                boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                                                borderColor: THEME_COLOR,
                                                '& .action-btns': { opacity: 1, transform: 'translateY(0)' }
                                            }
                                        }}>
                                            {/* Badge Overlay */}
                                            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 5 }}>
                                                <Chip
                                                    label={pkg.isActive ? 'Active' : 'Hidden'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: pkg.isActive ? alpha('#48BB78', 0.9) : alpha('#A0AEC0', 0.9),
                                                        color: 'white',
                                                        fontWeight: 800,
                                                        fontSize: '0.65rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.5,
                                                        backdropFilter: 'blur(4px)'
                                                    }}
                                                />
                                            </Box>

                                            {/* Image Showcase */}
                                            <Box sx={{ position: 'relative', paddingTop: '100%', bgcolor: '#FAF8F6' }}>
                                                <CardMedia
                                                    component="img"
                                                    image={pkg.thumbnail ? (pkg.thumbnail.startsWith('http') ? pkg.thumbnail : `${API_BASE_URL}${pkg.thumbnail.startsWith('/') ? '' : '/'}${pkg.thumbnail}`) : 'https://placehold.co/600x400?text=No+Image'}
                                                    alt={pkg.packageName}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                {/* Floating Actions */}
                                                <Stack
                                                    direction="row"
                                                    className="action-btns"
                                                    spacing={1}
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 16,
                                                        left: '50%',
                                                        transform: 'translateX(-50%) translateY(20px)',
                                                        opacity: 0,
                                                        transition: '0.3s all',
                                                        zIndex: 5
                                                    }}
                                                >
                                                    {[
                                                        { icon: <VisibilityOutlined fontSize="small" />, color: DARK_BG, onClick: () => setViewPackage(pkg), tip: 'Quick View' },
                                                        { icon: <EditOutlined fontSize="small" />, color: '#2B6CB0', onClick: () => navigate(`/invitation/edit-package/${pkg._id}`), tip: 'Edit' },
                                                        { icon: <DeleteOutline fontSize="small" />, color: '#C53030', onClick: () => setDeleteId(pkg._id), tip: 'Delete' }
                                                    ].map((btn, i) => (
                                                        <Tooltip key={i} title={btn.tip}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => { e.stopPropagation(); btn.onClick(); }}
                                                                sx={{
                                                                    bgcolor: 'white',
                                                                    color: btn.color,
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                                    '&:hover': { bgcolor: btn.color, color: 'white' }
                                                                }}
                                                            >
                                                                {btn.icon}
                                                            </IconButton>
                                                        </Tooltip>
                                                    ))}
                                                </Stack>
                                            </Box>

                                            {/* Information Content */}
                                            <CardContent sx={{ p: 3 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D3748', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Playfair Display', serif" }}>
                                                        {pkg.packageName}
                                                    </Typography>
                                                    <Switch
                                                        size="small"
                                                        checked={pkg.isActive}
                                                        onChange={(e) => { e.stopPropagation(); handleToggleStatus(pkg._id, pkg.isActive); }}
                                                        color="success"
                                                    />
                                                </Stack>

                                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                                    <Chip label={pkg.category?.title || 'Invitation'} size="small" variant="outlined" sx={{ borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, height: 20 }} />
                                                </Stack>

                                                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Package Price</Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                                                            ₹{pkg.packagePrice}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                                        <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Advance</Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#48BB78' }}>
                                                            ₹{pkg.advanceBookingAmount || 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>

                {/* ── LUXURY Split-View Detail Dialog ── */}
                <Dialog
                    open={Boolean(viewPackage)}
                    onClose={() => setViewPackage(null)}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '32px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                            maxHeight: '95vh'
                        }
                    }}
                >
                    <DialogContent sx={{ p: 0, bgcolor: 'white' }}>
                        {viewPackage && (
                            <Box sx={{ position: 'relative' }}>
                                {/* Close Button */}
                                <IconButton
                                    onClick={() => setViewPackage(null)}
                                    sx={{
                                        position: 'absolute',
                                        top: 24,
                                        right: 24,
                                        zIndex: 10,
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        '&:hover': { bgcolor: 'white', transform: 'rotate(90deg)' },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Close />
                                </IconButton>

                                <Grid container>
                                    {/* Left Side: Media Gallery */}
                                    <Grid item xs={12} md={5} sx={{ bgcolor: '#fbfbfb', p: { xs: 2.5, md: 4 }, display: 'flex', flexDirection: 'column', borderRight: '1px solid #edf2f7' }}>
                                        <Box sx={{
                                            position: 'relative',
                                            borderRadius: '24px',
                                            overflow: 'hidden',
                                            aspectRatio: '0.85/1',
                                            width: '100%',
                                            maxHeight: '450px',
                                            mb: 3,
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                                            bgcolor: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <ImageCarousel
                                                images={[viewPackage?.thumbnail, ...(viewPackage?.images || [])].filter(Boolean)}
                                                baseUrl={API_BASE_URL}
                                                active={activeImageIndex}
                                                setActive={setActiveImageIndex}
                                            />
                                            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 5 }}>
                                                <Chip
                                                    icon={<CollectionsOutlined sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                                                    label="Luxury Gallery"
                                                    size="small"
                                                    sx={{ bgcolor: alpha(THEME_COLOR, 0.9), color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 800, fontSize: '10px' }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Polished Thumbnails Row */}
                                        {(viewPackage?.images?.length > 0) && (
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                sx={{
                                                    overflowX: 'auto',
                                                    pb: 1.5,
                                                    px: 0.5,
                                                    '&::-webkit-scrollbar': { height: '4px' },
                                                    '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '10px' }
                                                }}
                                            >
                                                {[viewPackage.thumbnail, ...(viewPackage.images || [])].filter(Boolean).map((img, i) => (
                                                    <Box
                                                        key={i}
                                                        onClick={() => setActiveImageIndex(i)}
                                                        sx={{
                                                            width: 72, height: 72, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                                                            border: activeImageIndex === i ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
                                                            boxShadow: activeImageIndex === i ? `0 8px 16px ${alpha(THEME_COLOR, 0.2)}` : 'none',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            transform: activeImageIndex === i ? 'translateY(-4px)' : 'none'
                                                        }}
                                                    >
                                                        <img
                                                            src={img?.startsWith('http') ? img : `${API_BASE_URL}${img?.startsWith('/') ? '' : '/'}${img}`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </Box>
                                                ))}
                                            </Stack>
                                        )}

                                        {/* Style Tags */}
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', mb: 1.5, display: 'block', fontSize: '10px' }}>Design Aesthetics</Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {['Premium', 'Handcrafted', 'Bespoke', 'Luxury'].map((tag) => (
                                                    <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: '6px', fontWeight: 700, fontSize: '10px', height: 22, color: '#4A5568', borderColor: '#E2E8F0' }} />
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Grid>

                                    {/* Right Side: Specification & Details */}
                                    <Grid item xs={12} md={7} sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', bgcolor: 'white', overflowY: 'auto' }}>
                                        <Box sx={{ mb: 3 }}>
                                            <SectionTitle title={viewPackage?.category?.title || 'Invitation & Printing'} />
                                            <Typography variant="h2" sx={{ fontWeight: 900, color: '#1A202C', mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: { xs: '1.75rem', md: '2.25rem' }, letterSpacing: '-0.5px' }}>
                                                {viewPackage?.packageName}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#718096', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: 500 }}>
                                                {viewPackage?.description || 'A timeless invitation collection crafted for life\'s most precious moments.'}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ mb: 3, opacity: 0.6 }} />

                                        {/* Specs Grid */}
                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                            <Grid item xs={6} sm={4}>
                                                <SpecBox icon={<InfoOutlined sx={{ fontSize: 18, color: THEME_COLOR }} />} label="Design ID" value={viewPackage?.packageId || (viewPackage?._id?.slice(-8).toUpperCase())} />
                                            </Grid>
                                            <Grid item xs={6} sm={4}>
                                                <SpecBox icon={<CategoryOutlined sx={{ fontSize: 18, color: '#3b82f6' }} />} label="Category" value={viewPackage?.category?.title || 'Boutique'} />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <SpecBox icon={<CheckCircle sx={{ fontSize: 18, color: '#10b981' }} />} label="Digital Proof" value="Available" color="#10b981" />
                                            </Grid>
                                        </Grid>

                                        {/* Pricing Section */}
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                                            <Box sx={{ flex: 1, p: 2.5, borderRadius: '24px', bgcolor: '#1A202C', color: 'white', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}>
                                                <Box sx={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: alpha('#ffffff', 0.05) }} />
                                                <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '10px' }}>TOTAL PACKAGE PRICE</Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mt: 0.5, fontSize: '1.5rem' }}>₹{viewPackage?.packagePrice}</Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, p: 2.5, borderRadius: '24px', bgcolor: alpha(THEME_COLOR, 0.03), border: `2px solid ${alpha(THEME_COLOR, 0.1)}`, position: 'relative' }}>
                                                <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '10px' }}>ADVANCE BOOKING</Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1A202C', mt: 0.5, fontSize: '1.5rem' }}>₹{viewPackage?.advanceBookingAmount || 0}</Typography>
                                            </Box>
                                        </Stack>

                                        <Box sx={{ mt: 'auto', pt: 2 }}>
                                            <Stack direction="row" spacing={2}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<EditOutlined />}
                                                    onClick={() => {
                                                        const id = viewPackage?._id;
                                                        setViewPackage(null);
                                                        navigate(`/invitation/edit-package/${id}`);
                                                    }}
                                                    sx={{
                                                        bgcolor: '#1A202C',
                                                        color: 'white',
                                                        borderRadius: '16px',
                                                        py: 1.8,
                                                        fontWeight: 800,
                                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                                        '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(0,0,0,0.15)' },
                                                        textTransform: 'none',
                                                        transition: 'all 0.3s'
                                                    }}
                                                >
                                                    Modify Collection
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    size="large"
                                                    startIcon={<DeleteOutline />}
                                                    color="error"
                                                    onClick={() => {
                                                        setDeleteId(viewPackage?._id);
                                                        setViewPackage(null);
                                                    }}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        py: 1.8,
                                                        fontWeight: 800,
                                                        borderColor: '#E2E8F0',
                                                        textTransform: 'none',
                                                        '&:hover': { bgcolor: alpha('#C53030', 0.05), borderColor: '#C53030', transform: 'translateY(-2px)' },
                                                        transition: 'all 0.3s'
                                                    }}
                                                >
                                                    Remove Design
                                                </Button>
                                            </Stack>
                                            <Typography variant="caption" sx={{ mt: 3, display: 'block', textAlign: 'center', color: '#A0AEC0', fontWeight: 600, letterSpacing: 0.5 }}>
                                                <Diamond sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.8, color: THEME_COLOR }} />
                                                Managed via BookMyEvents Premium Vendor Suite
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>

                {/* ── Styled Delete Confirmation ── */}
                <Dialog
                    open={Boolean(deleteId)}
                    onClose={() => setDeleteId(null)}
                    PaperProps={{ sx: { borderRadius: '28px', p: 3, maxWidth: 400 } }}
                >
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: alpha('#C53030', 0.1), color: '#C53030', mx: 'auto', mb: 3 }}>
                            <DeleteOutline sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Delete Design?</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Are you sure you want to permanently remove <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>"{packages.find(p => p._id === deleteId)?.packageName}"</Box>? This action is irreversible.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button fullWidth onClick={() => setDeleteId(null)} sx={{ color: '#718096', fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleDelete}
                                sx={{ bgcolor: '#C53030', color: 'white', borderRadius: '12px', fontWeight: 700, '&:hover': { bgcolor: '#9B2C2C' }, textTransform: 'none' }}
                            >
                                Confirm Delete
                            </Button>
                        </Stack>
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
