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
const GLASS_BG = 'rgba(255, 255, 255, 0.9)';
const DARK_BG = '#1A202C';

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
    <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh', pb: 8 }}>
      {/* Premium Header with Glassmorphism */}
      <Box sx={{
        position: 'relative',
        height: '350px',
        background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
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
                Ornaments Collection
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, mb: 4, maxWidth: 600 }}>
                Manage your luxury inventory with precision. Track styles, stock, and value in one professional dashboard.
              </Typography>
              <Stack direction="row" spacing={3}>
                {[
                  { label: 'Total Pieces', value: ornamentsList.length, icon: <Diamond /> },
                  { label: 'Active Items', value: ornamentsList.filter(o => o.isActive).length, icon: <CheckCircle /> },
                ].map((stat, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(THEME_COLOR, 0.2), color: THEME_COLOR, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>{stat.value}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => navigate("/ornaments/addpackage")}
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
              Add New Piece
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 10 }}>
        {/* Professional Search & Filter Bar */}
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
            placeholder="Search by name, SKU, or material..."
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
            <Tooltip title="Filter Collections">
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
        ) : filteredOrnaments.length === 0 ? (
          <Fade in={true}>
            <Paper sx={{
              borderRadius: '32px',
              textAlign: 'center',
              py: 12,
              px: orientation === 'vertical' ? 4 : 8,
              bgcolor: 'white',
              border: '2px dashed #E2E8F0'
            }}>
              <Avatar sx={{ bgcolor: '#F7FAFC', width: 120, height: 120, mx: 'auto', mb: 4 }}>
                <InventoryIcon sx={{ fontSize: 60, color: '#CBD5E0' }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#2D3748', mb: 2 }}>
                {ornamentsList.length === 0 ? "Inventory is Empty" : "No Results Found"}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', fontWeight: 400 }}>
                {ornamentsList.length === 0
                  ? "Start building your digital showroom by adding your first ornament piece."
                  : "We couldn't find any ornaments matching your search. Please try different keywords."}
              </Typography>
              {ornamentsList.length === 0 && (
                <Button
                  variant="contained"
                  onClick={() => navigate("/ornaments/addpackage")}
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
            {filteredOrnaments.map((ornament, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={ornament._id}>
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
                        label={ornament.isActive ? 'Active' : 'Hidden'}
                        size="small"
                        sx={{
                          bgcolor: ornament.isActive ? alpha('#48BB78', 0.9) : alpha('#A0AEC0', 0.9),
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
                        image={getImageUrl(ornament.thumbnail)}
                        alt={ornament.name}
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
                          { icon: <Visibility fontSize="small" />, color: DARK_BG, onClick: () => handleView(ornament), tip: 'Quick View' },
                          { icon: <Edit fontSize="small" />, color: '#2B6CB0', onClick: () => navigate(`/ornaments/edit/${ornament._id}`), tip: 'Edit' },
                          { icon: <Delete fontSize="small" />, color: '#C53030', onClick: () => { setOrnamentToDelete(ornament._id); setOpenConfirm(true); }, tip: 'Delete' }
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
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D3748', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ornament.name}
                        </Typography>
                        <Switch
                          size="small"
                          checked={ornament.isActive}
                          onChange={(e) => { e.stopPropagation(); handleToggleStatus(ornament._id, ornament.isActive); }}
                          color="success"
                        />
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        <Chip label={ornament.material || 'Gold'} size="small" variant="outlined" sx={{ borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, height: 20 }} />
                        <Chip label={ornament.category?.title || 'Jewelry'} size="small" sx={{ borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, height: 20, bgcolor: alpha(THEME_COLOR, 0.1), color: THEME_COLOR }} />
                      </Stack>

                      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Purchase</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                            {formatINR(ornament.buyPricing?.totalPrice)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Rental / Day</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: '#48BB78' }}>
                            {formatINR(ornament.rentalPricing?.pricePerDay)}
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

      {/* Modern Detail View Dialog */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: '32px', overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedOrnament && (
            <Grid container>
              {/* Left Side: Visuals */}
              <Grid item xs={12} md={6} sx={{ bgcolor: '#F7FAFC', p: 4, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', flex: 1, mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                  <img
                    src={getImageUrl(selectedImageIndex === 0 ? selectedOrnament.thumbnail : selectedOrnament.galleryImages[selectedImageIndex - 1])}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'white' }}
                    alt="Ornament View"
                  />
                  <IconButton
                    onClick={() => setOpenView(false)}
                    sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                  >
                    <Close />
                  </IconButton>
                </Box>
                <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                  {[selectedOrnament.thumbnail, ...(selectedOrnament.galleryImages || [])].map((img, i) => (
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
              </Grid>

              {/* Right Side: Specs & Data */}
              <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 6 }, bgcolor: 'white' }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                    Product Specification
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#2D3748', mt: 1, mb: 2 }}>{selectedOrnament.name}</Typography>
                  <Typography variant="body1" sx={{ color: '#718096', lineHeight: 1.8 }}>{selectedOrnament.description || 'No description provided.'}</Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={6}><DetailItem icon={<Info />} label="SKU ID" value={selectedOrnament.ornamentId || 'N/A'} /></Grid>
                  <Grid item xs={6}><DetailItem icon={<Category />} label="Category" value={selectedOrnament.category?.title} /></Grid>
                  <Grid item xs={6}><DetailItem icon={<Palette />} label="Material" value={selectedOrnament.material} /></Grid>
                  <Grid item xs={6}><DetailItem icon={<InventoryIcon />} label="Stock Status" value={selectedOrnament.stock?.quantity > 0 ? `${selectedOrnament.stock.quantity} Units` : 'Out of Stock'} success={selectedOrnament.stock?.quantity > 0} error={selectedOrnament.stock?.quantity <= 0} chip /></Grid>
                </Grid>

                <Box sx={{ p: 4, bgcolor: '#F7FAFC', borderRadius: '24px', mb: 5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#A0AEC0' }}>BUYING VALUE</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: THEME_COLOR }}>{formatINR(selectedOrnament.buyPricing?.totalPrice)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#A0AEC0' }}>RENTAL / DAY</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#2F855A' }}>{formatINR(selectedOrnament.rentalPricing?.pricePerDay)}</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#718096', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalOffer fontSize="inherit" /> Pricing includes applicable taxes and service charges.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/ornaments/edit/${selectedOrnament._id}`)}
                    sx={{ bgcolor: '#2D3748', color: 'white', borderRadius: '16px', py: 2, fontWeight: 700, '&:hover': { bgcolor: '#1A202C' } }}
                  >
                    Edit Piece
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

      {/* Styled Delete Confirmation */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { borderRadius: '28px', p: 3, maxWidth: 400 } }}
      >
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: alpha('#C53030', 0.1), color: '#C53030', mx: 'auto', mb: 3 }}>
            <Delete sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Delete Ornament?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Are you sure you want to permanently remove this piece from your collection? This action is irreversible.
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