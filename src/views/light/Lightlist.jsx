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
    Typography,
    Container,
    Paper,
    Fade,
    Zoom,
    Tooltip,
    useTheme,
    alpha
} from '@mui/material';
import {
    Visibility,
    Edit,
    Delete,
    Search,
    Add,
    Close,
    Schedule,
    Info,
    Image as ImageIcon,
    CheckCircle,
    Category,
    LocalOffer,
    Star,
    Campaign,
    SurroundSound,
    LightMode,
    Inventory as InventoryIcon
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.bookmyevent.ae/api/light-and-sound';

const THEME_COLOR = '#7C3AED';
const SECONDARY_COLOR = '#5B21B6';
const ACCENT_COLOR = '#F59E0B';
const GLASS_BG = 'rgba(255, 255, 255, 0.9)';
const DARK_BG = '#1A202C';

export default function LightList() {
    const navigate = useNavigate();
    const theme = useTheme();

    const [lightList, setLightList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [searchQuery, setPendingSearch] = useState('');
    const [openView, setOpenView] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedLight, setSelectedLight] = useState(null);
    const [lightToDelete, setLightToDelete] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const providerId = userData?._id;

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
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
        setSelectedImageIndex(0);
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
                setToast({ open: true, message: 'Status updated successfully', severity: 'success' });
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
                setToast({ open: true, message: 'Package deleted successfully', severity: 'success' });
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

    const DetailItem = ({ icon, label, value, chip, success, error }) => (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            py: 1.5,
            borderBottom: '1px solid #f0f0f0',
            '&:hover': { bgcolor: alpha(THEME_COLOR, 0.02) },
            transition: '0.2s'
        }}>
            <Box sx={{ color: THEME_COLOR, mt: 0.5, display: 'flex' }}>{icon}</Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                </Typography>
                {chip ? (
                    <Box sx={{ mt: 0.5 }}>
                        <Chip
                            label={value}
                            size="small"
                            color={success ? 'success' : error ? 'error' : 'default'}
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.3, color: '#2D3748' }}>
                        {value || 'Not specified'}
                    </Typography>
                )}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh', pb: 8 }}>
            {/* Premium Header with Glassmorphism */}
            <Box sx={{
                position: 'relative',
                height: '350px',
                background: `linear-gradient(135deg, ${SECONDARY_COLOR} 0%, #1A202C 100%)`,
                color: 'white',
                pt: 8,
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
                    background: `radial-gradient(circle, ${alpha(THEME_COLOR, 0.2)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: `radial-gradient(circle, ${alpha(ACCENT_COLOR, 0.12)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
                        <Box>
                            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: 'white', letterSpacing: '-1px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                Light & Sound
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, fontWeight: 400, mb: 4, maxWidth: 600 }}>
                                Manage your premium lighting & sound packages. Create unforgettable experiences with professional setups.
                            </Typography>
                            <Stack direction="row" spacing={3}>
                                {[
                                    { label: 'Total Packages', value: lightList.length, icon: <SurroundSound /> },
                                    { label: 'Active', value: lightList.filter(o => o.isActive).length, icon: <CheckCircle /> },
                                ].map((stat, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', width: 56, height: 56 }}>
                                            {stat.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1, color: '#FFFFFF' }}>{stat.value}</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            onClick={() => navigate('/light/addpackage')}
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
                            Add New Package
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 10 }}>
                {/* Glassmorphism Search Bar */}
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
                        placeholder="Search packages by name or description..."
                        value={searchQuery}
                        onChange={(e) => setPendingSearch(e.target.value)}
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
                        <Typography variant="h6" sx={{ mt: 3, fontWeight: 600, color: 'text.secondary' }}>Loading your packages...</Typography>
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
                                <LightMode sx={{ fontSize: 60, color: '#CBD5E0' }} />
                            </Avatar>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2D3748', mb: 2 }}>
                                {lightList.length === 0 ? "No Packages Yet" : "No Results Found"}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', fontWeight: 400 }}>
                                {lightList.length === 0
                                    ? "Start building your light & sound portfolio by adding your first package."
                                    : "We couldn't find any packages matching your search. Please try different keywords."}
                            </Typography>
                            {lightList.length === 0 && (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/light/addpackage')}
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
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={light._id}>
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
                                                    { icon: <Visibility fontSize="small" />, color: DARK_BG, onClick: () => handleView(light), tip: 'Quick View' },
                                                    { icon: <Edit fontSize="small" />, color: '#2B6CB0', onClick: () => navigate(`/light/edit/${light._id}`), tip: 'Edit' },
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

                                        {/* Card Content */}
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

                                            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                                                <Chip
                                                    icon={<Category sx={{ fontSize: '14px !important' }} />}
                                                    label={light.category?.title || 'Light & Sound'}
                                                    size="small"
                                                    sx={{
                                                        borderRadius: '6px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 600,
                                                        height: 20,
                                                        bgcolor: alpha(THEME_COLOR, 0.1),
                                                        color: THEME_COLOR
                                                    }}
                                                />
                                            </Stack>

                                            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Package Price</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                                                        {formatINR(light.packagePrice)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                                    <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Advance</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#48BB78' }}>
                                                        {formatINR(light.advanceBookingAmount)}
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

            {/* Premium Detail View Dialog */}
            <Dialog
                open={openView}
                onClose={() => setOpenView(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: '32px', overflow: 'hidden' } }}
            >
                <DialogContent sx={{ p: 0 }}>
                    {selectedLight && (
                        <Grid container>
                            {/* Left Side: Image Gallery */}
                            <Grid item xs={12} md={6} sx={{ bgcolor: '#F7FAFC', p: 4, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', flex: 1, mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                                    <img
                                        src={getImageUrl(selectedLight.thumbnail)}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'white' }}
                                        alt="Package View"
                                    />
                                    <IconButton
                                        onClick={() => setOpenView(false)}
                                        sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Box>
                                {/* Thumbnail strip for gallery images if available */}
                                {selectedLight.images && selectedLight.images.length > 0 && (
                                    <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                        {[selectedLight.thumbnail, ...selectedLight.images].filter(Boolean).map((img, i) => (
                                            <Avatar
                                                key={i}
                                                variant="rounded"
                                                src={getImageUrl(img)}
                                                onClick={() => setSelectedImageIndex(i)}
                                                sx={{
                                                    width: 70, height: 70, cursor: 'pointer',
                                                    border: selectedImageIndex === i ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
                                                    transition: '0.2s', '&:hover': { opacity: 0.8 }
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Grid>

                            {/* Right Side: Package Details */}
                            <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 6 }, bgcolor: 'white' }}>
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                                        Package Details
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#2D3748', mt: 1, mb: 2 }}>
                                        {selectedLight.packageName}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#718096', lineHeight: 1.8 }}>
                                        {selectedLight.description || 'No description provided.'}
                                    </Typography>
                                </Box>

                                <Grid container spacing={3} sx={{ mb: 5 }}>
                                    <Grid item xs={6}>
                                        <DetailItem icon={<Category />} label="Category" value={selectedLight.category?.title || 'Light & Sound'} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <DetailItem
                                            icon={<CheckCircle />}
                                            label="Status"
                                            value={selectedLight.isActive ? 'Active' : 'Inactive'}
                                            chip
                                            success={selectedLight.isActive}
                                            error={!selectedLight.isActive}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <DetailItem icon={<SurroundSound />} label="Module" value="Light & Sound" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <DetailItem icon={<Info />} label="Provider" value={userData?.hotelName || 'Premium Partner'} />
                                    </Grid>
                                </Grid>

                                {/* Price Card */}
                                <Box sx={{ p: 4, bgcolor: '#F7FAFC', borderRadius: '24px', mb: 5 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#A0AEC0' }}>PACKAGE PRICE</Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 900, color: THEME_COLOR }}>{formatINR(selectedLight.packagePrice)}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#A0AEC0' }}>ADVANCE</Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2F855A' }}>{formatINR(selectedLight.advanceBookingAmount)}</Typography>
                                        </Box>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#718096', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalOffer fontSize="inherit" /> Pricing includes setup and professional handling.
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        startIcon={<Edit />}
                                        onClick={() => navigate(`/light/edit/${selectedLight._id}`)}
                                        sx={{ bgcolor: '#2D3748', color: 'white', borderRadius: '16px', py: 2, fontWeight: 700, '&:hover': { bgcolor: '#1A202C' } }}
                                    >
                                        Edit Package
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="large"
                                        onClick={() => setOpenView(false)}
                                        sx={{ borderRadius: '16px', py: 2, fontWeight: 700, borderColor: '#E2E8F0', color: '#4A5568' }}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
            </Dialog>

            {/* Premium Delete Confirmation */}
            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                PaperProps={{ sx: { borderRadius: '28px', p: 3, maxWidth: 400 } }}
            >
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: alpha('#C53030', 0.1), color: '#C53030', mx: 'auto', mb: 3 }}>
                        <Delete sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Delete Package?</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Are you sure you want to permanently remove <b>{lightList.find(m => m._id === lightToDelete)?.packageName}</b>? This action is irreversible.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button fullWidth onClick={() => setOpenConfirm(false)} sx={{ color: '#718096', fontWeight: 700 }}>Cancel</Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleDelete}
                            sx={{ bgcolor: '#C53030', color: 'white', borderRadius: '12px', fontWeight: 700, '&:hover': { bgcolor: '#9B2C2C' } }}
                        >
                            Confirm Delete
                        </Button>
                    </Stack>
                </Box>
            </Dialog>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: '12px', fontWeight: 600 }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
