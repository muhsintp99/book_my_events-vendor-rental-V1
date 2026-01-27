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
  AttachMoney,
  Palette,
  Schedule,
  Info,
  Image as ImageIcon,
  CheckCircle,
  Category,
  Inventory as InventoryIcon,
  LocalOffer,
  TrendingUp,
  ShoppingCart,
  EventAvailable,
  Star,
  Diamond
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'https://api.bookmyevent.ae/api/ornaments';

const THEME_COLOR = '#E15B65';
const SECONDARY_COLOR = '#c14a54';
const ACCENT_COLOR = '#FFD700'; // Gold for jewelry vibe

export default function OrnamentsList() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [ornamentsList, setOrnamentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setPendingSearch] = useState('');
  const [openView, setOpenView] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedOrnament, setSelectedOrnament] = useState(null);
  const [ornamentToDelete, setOrnamentToDelete] = useState(null);
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

  const fetchOrnaments = useCallback(async () => {
    if (!providerId || !token) {
      setToast({ open: true, message: 'Please login again', severity: 'error' });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}?provider=${providerId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load ornaments');
      const result = await res.json();
      if (result.success) setOrnamentsList(result.data || []);
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => {
    fetchOrnaments();
  }, [fetchOrnaments]);

  const handleView = (ornament) => {
    setSelectedOrnament(ornament);
    setSelectedImageIndex(0);
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
        setOrnamentsList((prev) => prev.map((m) => (m._id === id ? { ...m, isActive: !current } : m)));
        setToast({ open: true, message: 'Status updated successfully', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${ornamentToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrnamentsList((prev) => prev.filter((o) => o._id !== ornamentToDelete));
        setToast({ open: true, message: 'Ornament deleted successfully', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Delete failed', severity: 'error' });
    } finally {
      setOpenConfirm(false);
      setOrnamentToDelete(null);
    }
  };

  const filteredOrnaments = useMemo(() => {
    return ornamentsList.filter((o) => {
      const matchesSearch = !searchQuery ||
        o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [ornamentsList, searchQuery]);

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
    <Box sx={{ bgcolor: '#F7FAFC', minHeight: '100vh', pb: 8 }}>
      {/* Premium Gradient Header */}
      <Box sx={{
background: 'linear-gradient(135deg, #ece6f5 0%, #a44c7a 100%)',
        color: 'white',
        pt: 6,
        pb: 12,
        px: 4,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 10px 30px ${alpha(THEME_COLOR, 0.3)}`,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }
      }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                💎 Royal Ornament Gallery
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {[
                  { label: 'Total Items', value: ornamentsList.length, color: 'rgba(255,255,255,0.2)' },
                  { label: 'Active', value: ornamentsList.filter(o => o.isActive).length, color: 'rgba(76, 175, 80, 0.3)' },
                  { label: 'Inactive', value: ornamentsList.filter(o => !o.isActive).length, color: 'rgba(255,255,255,0.1)' }
                ].map((stat, i) => (
                  <Paper key={i} elevation={0} sx={{
                    bgcolor: stat.color,
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{stat.value}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>{stat.label}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add sx={{ fontSize: 24 }} />}
              onClick={() => navigate("/ornaments/addpackage")}
              sx={{
                bgcolor: 'white',
                color: THEME_COLOR,
                fontWeight: 800,
                fontSize: '1.1rem',
                px: 5,
                py: 2,
                borderRadius: '20px',
                textTransform: 'none',
                boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: '#F8F9FF',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Add New Collection Item
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
        {/* Floating Search Bar */}
        <Paper elevation={10} sx={{
          borderRadius: 4,
          overflow: 'hidden',
          p: 1,
          bgcolor: 'white',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          mb: 6
        }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search by name, material, or luxury details..."
            value={searchQuery}
            onChange={(e) => setPendingSearch(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 3 }}>
                  <Search sx={{ color: THEME_COLOR, fontSize: 32 }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end" sx={{ pr: 1 }}>
                  <IconButton onClick={() => setPendingSearch('')} size="small">
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                height: 80,
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#2d3748'
              }
            }}
          />
        </Paper>

        {/* Content Section */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 15 }}>
            <CircularProgress size={80} thickness={4} sx={{ color: THEME_COLOR }} />
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 700, color: 'text.secondary' }}>Curating your collection...</Typography>
          </Box>
        ) : filteredOrnaments.length === 0 ? (
          <Fade in={true}>
            <Paper sx={{
              borderRadius: 6,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              textAlign: 'center',
              py: 15,
              px: 4,
              border: '2px dashed #E2E8F0'
            }}>
              <Box sx={{ mb: 4 }}>
                <Diamond sx={{ fontSize: 100, color: '#CBD5E0' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D3748', mb: 2 }}>
                {ornamentsList.length === 0 ? "Begin Your Legacy" : "No Matches Found"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 500, mx: 'auto', fontSize: '1.1rem' }}>
                {ornamentsList.length === 0
                  ? "Craft your first masterpiece to display it in your professional showroom."
                  : "We couldn't find any ornaments matching your search criteria. Try a different term."}
              </Typography>
              {ornamentsList.length === 0 && (
                <Button
                  variant="contained"
                  onClick={() => navigate("/ornaments/addpackage")}
                  sx={{
                    bgcolor: THEME_COLOR,
                    px: 6,
                    py: 2,
                    borderRadius: 4,
                    fontWeight: 800,
                    '&:hover': { bgcolor: SECONDARY_COLOR }
                  }}
                >
                  Create First Ornament
                </Button>
              )}
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {filteredOrnaments.map((ornament, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={ornament._id}>
                <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: '1px solid #edf2f7',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-15px)',
                      boxShadow: `0 30px 60px ${alpha(THEME_COLOR, 0.15)}`,
                      borderColor: THEME_COLOR,
                      '& .card-image': { transform: 'scale(1.1)' },
                      '& .actions-overlay': { opacity: 1 }
                    }
                  }}>
                    {/* Image Area */}
                    <Box sx={{ position: 'relative', paddingTop: '80%', background: '#F7FAFC', overflow: 'hidden' }}>
                      {ornament.thumbnail ? (
                        <CardMedia
                          className="card-image"
                          component="img"
                          image={getImageUrl(ornament.thumbnail)}
                          alt={ornament.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.8s ease'
                          }}
                        />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon sx={{ fontSize: 80, color: '#E2E8F0' }} />
                        </Box>
                      )}

                      {/* Premium Badges */}
                      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 5 }}>
                        <Chip
                          label={ornament.isActive ? 'IN STOCK' : 'OUT OF STOCK'}
                          size="small"
                          sx={{
                            bgcolor: ornament.isActive ? '#48BB78' : '#A0AEC0',
                            color: 'white',
                            fontWeight: 900,
                            fontSize: '0.7rem',
                            letterSpacing: 1,
                            px: 1,
                            borderRadius: 2
                          }}
                        />
                      </Box>

                      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 5 }}>
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'white' },
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                          onClick={() => handleToggleStatus(ornament._id, ornament.isActive)}
                        >
                          <Switch
                            checked={ornament.isActive}
                            size="small"
                            color="success"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </IconButton>
                      </Box>

                      {/* Hover Actions Overlay */}
                      <Box className="actions-overlay" sx={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        bgcolor: alpha(THEME_COLOR, 0.4),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        opacity: 0,
                        transition: '0.3s',
                        backdropFilter: 'blur(3px)'
                      }}>
                        <Tooltip title="View Details">
                          <Avatar sx={{ bgcolor: 'white', color: THEME_COLOR, cursor: 'pointer', '&:hover': { transform: 'scale(1.1)' } }} onClick={() => handleView(ornament)}>
                            <Visibility />
                          </Avatar>
                        </Tooltip>
                        <Tooltip title="Edit Ornament">
                          <Avatar sx={{ bgcolor: 'white', color: '#2B6CB0', cursor: 'pointer', '&:hover': { transform: 'scale(1.1)' } }} onClick={() => navigate(`/ornaments/edit/${ornament._id}`)}>
                            <Edit />
                          </Avatar>
                        </Tooltip>
                        <Tooltip title="Delete Permanently">
                          <Avatar sx={{ bgcolor: 'white', color: '#C53030', cursor: 'pointer', '&:hover': { transform: 'scale(1.1)' } }} onClick={() => { setOrnamentToDelete(ornament._id); setOpenConfirm(true); }}>
                            <Delete />
                          </Avatar>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Content Area */}
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#2D3748', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ornament.name}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
                        <Chip
                          icon={<Palette sx={{ fontSize: '14px !important' }} />}
                          label={ornament.material || 'Premium Gold'}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2, fontWeight: 700, borderColor: '#E2E8F0', color: '#4A5568' }}
                        />
                        <Chip
                          icon={<Category sx={{ fontSize: '14px !important' }} />}
                          label={ornament.category?.title || 'Jewelry'}
                          size="small"
                          sx={{ borderRadius: 2, fontWeight: 700, bgcolor: alpha(THEME_COLOR, 0.1), color: THEME_COLOR }}
                        />
                      </Stack>

                      <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Purchase Value</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                            {formatINR(ornament.buyPricing?.totalPrice)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Rental / Day</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#48BB78' }}>
                            {formatINR(ornament.rentalPricing?.pricePerDay)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <Box sx={{ px: 3, pb: 2 }}>
                      <Button
                        fullWidth
                        variant="soft"
                        onClick={() => handleView(ornament)}
                        sx={{
                          bgcolor: alpha(THEME_COLOR, 0.05),
                          color: THEME_COLOR,
                          fontWeight: 800,
                          borderRadius: 3,
                          py: 1,
                          '&:hover': { bgcolor: alpha(THEME_COLOR, 0.1) }
                        }}
                      >
                        Manage Details
                      </Button>
                    </Box>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Styled View Details Modal */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="lg"
        fullWidth
        scroll="body"
        PaperProps={{
          sx: { borderRadius: 6, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{
          background: `linear-gradient(135deg, ${THEME_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
          color: 'white',
          p: 4,
          position: 'relative'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>{selectedOrnament?.name}</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 600 }}>{selectedOrnament?.ornamentId || 'SKU-PRIVATE-COLLECTION'}</Typography>
            </Box>
            <IconButton onClick={() => setOpenView(false)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {selectedOrnament && (
            <Grid container>
              {/* Left Column: Media Showcase */}
              <Grid item xs={12} lg={6} sx={{ bgcolor: '#1A202C', p: 4 }}>
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <Paper elevation={24} sx={{ borderRadius: 6, overflow: 'hidden', height: 450 }}>
                    <img
                      src={getImageUrl(selectedImageIndex === 0 ? selectedOrnament.thumbnail : selectedOrnament.galleryImages[selectedImageIndex - 1])}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                      alt="Product Showcase"
                    />
                  </Paper>
                </Box>

                <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 10 } }}>
                  {/* Thumbnail Avatar */}
                  <Avatar
                    variant="rounded"
                    src={getImageUrl(selectedOrnament.thumbnail)}
                    onClick={() => setSelectedImageIndex(0)}
                    sx={{
                      width: 80, height: 80, cursor: 'pointer',
                      border: selectedImageIndex === 0 ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
                      transition: '0.2s', '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                  {selectedOrnament.galleryImages?.map((img, i) => (
                    <Avatar
                      key={i}
                      variant="rounded"
                      src={getImageUrl(img)}
                      onClick={() => setSelectedImageIndex(i + 1)}
                      sx={{
                        width: 80, height: 80, cursor: 'pointer',
                        border: selectedImageIndex === i + 1 ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
                        transition: '0.2s', '&:hover': { transform: 'scale(1.05)' }
                      }}
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Right Column: Specifications */}
              <Grid item xs={12} lg={6} sx={{ p: 4, bgcolor: 'white' }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#2D3748' }}>Collection Details</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}><DetailItem icon={<Category />} label="Department" value={selectedOrnament.category?.title} /></Grid>
                    <Grid item xs={6}><DetailItem icon={<Palette />} label="Primary Material" value={selectedOrnament.material} /></Grid>
                    <Grid item xs={6}><DetailItem icon={<Info />} label="Weight Specs" value={`${selectedOrnament.weight || 0} ${selectedOrnament.unit || 'gms'}`} /></Grid>
                    <Grid item xs={6}><DetailItem icon={<InventoryIcon />} label="Stock Available" value={selectedOrnament.stock?.quantity} /></Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#2D3748' }}>Investment Value</Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, mb: 2, bgcolor: alpha(THEME_COLOR, 0.02) }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>BUYOUT PRICE</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: THEME_COLOR }}>{formatINR(selectedOrnament.buyPricing?.totalPrice)}</Typography>
                      </Box>
                      {selectedOrnament.buyPricing?.discountValue > 0 && (
                        <Chip label={`- ${selectedOrnament.buyPricing.discountValue}${selectedOrnament.buyPricing.discountType === 'percentage' ? '%' : ' OFF'}`} color="error" sx={{ fontWeight: 900 }} />
                      )}
                    </Stack>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, bgcolor: '#F0FFF4' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>DAILY RENTAL RATE</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#2F855A' }}>{formatINR(selectedOrnament.rentalPricing?.pricePerDay)}</Typography>
                      </Box>
                      <Chip label={`Min ${selectedOrnament.rentalPricing?.minimumDays || 1} Days`} variant="outlined" sx={{ fontWeight: 700, borderColor: '#2F855A', color: '#2F855A' }} />
                    </Stack>
                  </Paper>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#2D3748' }}>Story & Craftsmanship</Typography>
                  <Typography variant="body1" sx={{ color: '#4A5568', lineHeight: 1.8 }}>
                    {selectedOrnament.description || "A masterfully crafted piece from our exclusive collection, designed to be passed down through generations. Every detail reflects superior quality and timeless elegance."}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Occasions & Tags</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedOrnament.occasions?.map((occ, i) => (
                      <Chip key={i} label={occ} size="small" sx={{ fontWeight: 700, px: 1 }} />
                    ))}
                    {selectedOrnament.features?.basicFeatures?.map((f, i) => (
                      <Chip key={i} label={f} size="small" color="primary" sx={{ fontWeight: 700, px: 1 }} />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 4, bgcolor: '#F7FAFC' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Edit />}
            onClick={() => navigate(`/ornaments/edit/${selectedOrnament._id}`)}
            sx={{ bgcolor: '#2B6CB0', px: 4, borderRadius: 3, fontWeight: 800 }}
          >
            Edit This Piece
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setOpenView(false)}
            sx={{ px: 4, borderRadius: 3, fontWeight: 800 }}
          >
            Close Viewer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { borderRadius: 6, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', textAlign: 'center' }}>Permanently Remove?</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: alpha('#C53030', 0.1), color: '#C53030', mx: 'auto', mb: 3 }}>
            <Delete sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="body1" sx={{ color: '#4A5568', fontSize: '1.1rem' }}>
            This will permanently remove <b>this ornament</b> from your digital catalog. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} variant="outlined" sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}>Keep It</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#C53030', borderRadius: 3, px: 3, fontWeight: 700, '&:hover': { bgcolor: '#9B2C2C' } }}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: 4, fontWeight: 700, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}