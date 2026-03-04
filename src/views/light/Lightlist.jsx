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
    Paper,
    useTheme,
    alpha,
    Zoom,
    Fade,
    Tooltip
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
    Inventory as InventoryIcon,
    Stars,
    TrendingUp,
    Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.bookmyevent.ae/api/light-and-sound';

const THEME_COLOR = '#673ab7'; // Deep Purple
const SECONDARY_COLOR = '#4527a0';
const ACCENT_COLOR = '#FFB300'; // Amber/Gold for premium feel
const GLASS_BG = 'rgba(255, 255, 255, 0.9)';

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
    const [activeImage, setActiveImage] = useState(0);

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const providerId = userData?._id;

    const getImageUrl = (path) => {
        if (!path) return null;
        return `https://api.bookmyevent.ae${path}`;
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
        setActiveImage(0);
        setOpenView(true);
    };

    const handleToggleStatus = async (id, current) => {
        try {
            const res = await fetch(`${API_BASE_URL}/toggle-active/${id}`, {
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
        <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh', pb: 8 }}>
            {/* Premium Header with Glassmorphism */}
            <Box sx={{
                position: 'relative',
                height: { xs: 'auto', md: '350px' },
                background: `linear-gradient(135deg, ${SECONDARY_COLOR} 0%, #1a103d 100%)`,
                color: 'white',
                pt: { xs: 4, md: 8 },
                pb: { xs: 12, md: 0 },
                px: 4,
                overflow: 'hidden'
            }}>
                {/* Animated Background Circles */}
                <Box sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: `radial-gradient(circle, ${alpha(ACCENT_COLOR, 0.15)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: `radial-gradient(circle, ${alpha(THEME_COLOR, 0.2)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
                        <Box>
                            <Typography variant="h1" sx={{ fontWeight: 900, mb: 1, color: 'white', position: 'relative', zIndex: 1, letterSpacing: '-2.5px', textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                                Light & <Box component="span" sx={{ color: ACCENT_COLOR }}>Sound</Box>
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'white', opacity: 0.95, maxWidth: '600px', mb: 5, position: 'relative', zIndex: 1, fontWeight: 500, lineHeight: 1.6 }}>
                                Manage your specialized equipment and sound packages. Track your inventory and performance in real time.
                            </Typography>
                            <Stack direction="row" spacing={4}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: ACCENT_COLOR, width: 60, height: 60, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                                        <InventoryIcon sx={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, lineHeight: 1 }}>{lightList.length}</Typography>
                                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1.5 }}>Total Packages</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#48BB78', width: 60, height: 60, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                                        <CheckCircle sx={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, lineHeight: 1 }}>{lightList.filter(l => l.isActive).length}</Typography>
                                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1.5 }}>Active Items</Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            onClick={() => navigate("/light/addpackage")}
                            sx={{
                                bgcolor: ACCENT_COLOR,
                                color: '#1a103d',
                                fontWeight: 800,
                                fontSize: '1rem',
                                px: 4,
                                py: 1.8,
                                borderRadius: '16px',
                                textTransform: 'none',
                                boxShadow: `0 12px 24px ${alpha(ACCENT_COLOR, 0.3)}`,
                                '&:hover': {
                                    bgcolor: '#FFA000',
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 16px 32px ${alpha(ACCENT_COLOR, 0.4)}`,
                                },
                                transition: 'all 0.3s'
                            }}
                        >
                            Add New Package
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 10 }}>
                {/* Professional Search & Filter Bar */}
                <Paper elevation={4} sx={{
                    borderRadius: '24px',
                    p: 1,
                    mb: 4,
                    background: GLASS_BG,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search by package name or description..."
                        value={searchQuery}
                        onChange={(e) => setPendingSearch(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start" sx={{ pl: 3 }}>
                                    <Search sx={{ color: THEME_COLOR, fontSize: 28 }} />
                                </InputAdornment>
                            ),
                            sx: { height: 70, fontSize: '1.1rem', fontWeight: 500, color: '#2D3748' }
                        }}
                    />
                    <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1 }} />
                    <Box sx={{ pr: 2 }}>
                        <Tooltip title="Filter Packages">
                            <IconButton sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <Category sx={{ color: THEME_COLOR }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 15 }}>
                        <CircularProgress size={64} thickness={4} sx={{ color: THEME_COLOR }} />
                        <Typography variant="h6" sx={{ mt: 3, fontWeight: 600, color: 'text.secondary' }}>Loading your collection...</Typography>
                    </Box>
                ) : filteredLights.length === 0 ? (
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
                                {lightList.length === 0 ? "No Packages Yet" : "No Results Found"}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', fontWeight: 400 }}>
                                {lightList.length === 0
                                    ? "Start building your digital showroom by adding your first light & sound package."
                                    : "We couldn't find any packages matching your search. Please try different keywords."}
                            </Typography>
                            {lightList.length === 0 && (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/light/addpackage")}
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
                                    Create Your First Package
                                </Button>
                            )}
                        </Paper>
                    </Fade>
                ) : (
                    <Grid container spacing={4}>
                        {filteredLights.map((light, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={light._id}>
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
                                            borderColor: ACCENT_COLOR,
                                            '& .action-btns': { opacity: 1, transform: 'translateY(0)' }
                                        }
                                    }}>
                                        {/* Status Badge */}
                                        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 5 }}>
                                            <Chip
                                                label={light.isActive ? 'Active' : 'Hidden'}
                                                size="small"
                                                sx={{
                                                    bgcolor: light.isActive ? alpha('#48BB78', 0.9) : alpha('#A0AEC0', 0.9),
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
                                        <Box sx={{ position: 'relative', paddingTop: '100%', bgcolor: '#F7FAFC' }}>
                                            <CardMedia
                                                component="img"
                                                image={getImageUrl(light.thumbnail)}
                                                alt={light.packageName}
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
                                                    { icon: <Visibility fontSize="small" />, color: '#1a103d', onClick: () => handleView(light), tip: 'Quick View' },
                                                    { icon: <Edit fontSize="small" />, color: THEME_COLOR, onClick: () => navigate(`/light/edit/${light._id}`), tip: 'Edit' },
                                                    { icon: <Delete fontSize="small" />, color: '#C53030', onClick: () => { setLightToDelete(light._id); setOpenConfirm(true); }, tip: 'Delete' }
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

                                        {/* Content */}
                                        <CardContent sx={{ p: 3 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D3748', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {light.packageName}
                                                </Typography>
                                                <Switch
                                                    size="small"
                                                    checked={light.isActive}
                                                    onChange={(e) => { e.stopPropagation(); handleToggleStatus(light._id, light.isActive); }}
                                                    color="success"
                                                />
                                            </Stack>

                                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                                <Chip
                                                    icon={<Category sx={{ fontSize: '14px !important' }} />}
                                                    label={light.category?.title || 'Light & Sound'}
                                                    size="small"
                                                    sx={{
                                                        borderRadius: '8px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        bgcolor: alpha(THEME_COLOR, 0.08),
                                                        color: THEME_COLOR,
                                                        px: 0.5
                                                    }}
                                                />
                                            </Stack>

                                            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Package Price</Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                                                        {formatINR(light.packagePrice)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Advance</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#48BB78' }}>
                                                        {formatINR(light.advanceBookingAmount)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Luxury Detail View Dialog */}
            <Dialog
                open={openView}
                onClose={() => setOpenView(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '32px', overflow: 'hidden', bgcolor: '#F7FAFC' }
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={() => setOpenView(false)}
                        sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                    >
                        <Close />
                    </IconButton>

                    <Grid container>
                        {/* Visuals - Left Side */}
                        <Grid item xs={12} md={7} sx={{ bgcolor: 'white', p: 4 }}>
                            <Box sx={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', mb: 3 }}>
                                <Fade in={true} key={activeImage}>
                                    <Box
                                        component="img"
                                        src={getImageUrl(activeImage === 0 ? selectedLight?.thumbnail : selectedLight?.images[activeImage - 1])}
                                        sx={{ width: '100%', height: { md: '500px' }, objectFit: 'cover' }}
                                    />
                                </Fade>
                            </Box>

                            {/* Thumbnail Strip */}
                            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                {[selectedLight?.thumbnail, ...(selectedLight?.images || [])].filter(Boolean).map((img, i) => (
                                    <Box
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            border: `3px solid ${activeImage === i ? ACCENT_COLOR : 'transparent'}`,
                                            overflow: 'hidden',
                                            transition: '0.2s',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img src={getImageUrl(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Content - Right Side */}
                        <Grid item xs={12} md={5} sx={{ p: { xs: 4, md: 6 } }}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                    {selectedLight?.category?.title || 'Premium Package'}
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a103d', mt: 1, mb: 2 }}>
                                    {selectedLight?.packageName}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4A5568', lineHeight: 1.8, fontSize: '1.05rem' }}>
                                    {selectedLight?.description}
                                </Typography>
                            </Box>

                            {/* Specification Grid */}
                            <Grid container spacing={2} sx={{ mb: 4 }}>
                                {[
                                    { icon: <Category />, label: 'Category', value: selectedLight?.category?.title || 'Default' },
                                    { icon: <Schedule />, label: 'Status', value: selectedLight?.isActive ? 'Active' : 'Inactive' },
                                    { icon: <Stars />, label: 'Module', value: 'Light & Sound' },
                                    { icon: <Info />, label: 'Provider', value: userData?.hotelName || 'Premium Partner' }
                                ].map((spec, i) => (
                                    <Grid item xs={6} key={i}>
                                        <Paper sx={{ p: 2, borderRadius: '16px', bgcolor: 'white', border: '1px solid #E2E8F0', height: '100%' }}>
                                            <Box sx={{ color: THEME_COLOR, mb: 1 }}>{spec.icon}</Box>
                                            <Typography variant="caption" sx={{ color: '#A0AEC0', display: 'block', fontWeight: 700 }}>{spec.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D3748' }}>{spec.value}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Rich Price Card */}
                            <Paper sx={{
                                p: 3,
                                borderRadius: '24px',
                                background: `linear-gradient(135deg, ${THEME_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
                                color: 'white',
                                boxShadow: `0 20px 40px ${alpha(THEME_COLOR, 0.3)}`
                            }} elevation={0}>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.9 }}>Booking Amount</Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 900 }}>{formatINR(selectedLight?.packagePrice)}</Typography>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.9 }}>Minimum Advance</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: ACCENT_COLOR }}>{formatINR(selectedLight?.advanceBookingAmount)}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate(`/light/edit/${selectedLight?._id}`)}
                                    sx={{
                                        borderRadius: '16px',
                                        py: 1.5,
                                        borderWidth: 2,
                                        fontWeight: 700,
                                        '&:hover': { borderWidth: 2 }
                                    }}
                                >
                                    Edit Details
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setOpenView(false)}
                                    sx={{ borderRadius: '16px', py: 1.5, bgcolor: '#1a103d', fontWeight: 700 }}
                                >
                                    Close
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>

            {/* Premium Delete Dialog */}
            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>Remove Package?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#4A5568' }}>
                        Are you sure you want to delete <b>{lightList.find(m => m._id === lightToDelete)?.packageName}</b>? This action is permanent and cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenConfirm(false)} sx={{ fontWeight: 700, color: '#718096' }}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        sx={{ borderRadius: '12px', px: 4, fontWeight: 700, bgcolor: '#C53030' }}
                    >
                        Delete Package
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })}>
                <Typography sx={{ bgcolor: toast.severity === 'success' ? 'success.main' : 'error.main', color: 'white', p: 2, borderRadius: 1 }}>{toast.message}</Typography>
            </Snackbar>
        </Box >
    );
}
