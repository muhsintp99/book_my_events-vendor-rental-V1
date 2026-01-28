import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Skeleton,
  Grid,
  Divider,
  Tooltip,
  CardMedia,
  alpha
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  Add,
  Download,
  Close,
  Category,
  Palette,
  Inventory as InventoryIcon,
  LocalOffer,
  Label,
  CheckCircle,
  Cancel,
  ExpandMore,
  Verified,
  Timer,
  LocalShipping,
  Storefront
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.bookmyevent.ae/api/boutiques';
const THEME_COLOR = '#9C27B0';
const SECONDARY_COLOR = '#E91E63';

export default function BoutiqueList() {
  const navigate = useNavigate();

  const [boutiqueList, setBoutiqueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [pendingSearch, setPendingSearch] = useState('');
  const [openView, setOpenView] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  const [boutiqueToDelete, setBoutiqueToDelete] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('vendor') || localStorage.getItem('user') || '{}');
  const providerId = userData?._id;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `https://api.bookmyevent.ae/${cleanPath}`;
  };

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

  const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);

  const ImageAvatar = ({ src, alt, title }) => {
    const [error, setError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    if (!src || error) {
      return (
        <Avatar
          variant="rounded"
          sx={{ width: 70, height: 70, bgcolor: THEME_COLOR, fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}
        >
          {title?.[0]?.toUpperCase() || 'B'}
        </Avatar>
      );
    }

    return (
      <Box sx={{ position: 'relative' }}>
        {imgLoading && <Skeleton variant="rectangular" width={70} height={70} sx={{ borderRadius: 2 }} />}
        <Avatar
          variant="rounded"
          src={src}
          alt={alt}
          sx={{ width: 70, height: 70, borderRadius: 2, display: imgLoading ? 'none' : 'block' }}
          imgProps={{
            onLoad: () => setImgLoading(false),
            onError: () => {
              setError(true);
              setImgLoading(false);
            }
          }}
        />
      </Box>
    );
  };

  const fetchBoutiques = useCallback(async () => {
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
      if (!res.ok) throw new Error('Failed to load boutiques');
      const result = await res.json();
      if (result.success) setBoutiqueList(result.data || []);
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => {
    fetchBoutiques();
  }, [fetchBoutiques]);

  useEffect(() => {
    const timer = setTimeout(() => setFilters((prev) => ({ ...prev, search: pendingSearch })), 400);
    return () => clearTimeout(timer);
  }, [pendingSearch]);

  const handleView = (boutique) => {
    setSelectedBoutique(boutique);
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
        setBoutiqueList((prev) => prev.map((b) => (b._id === id ? { ...b, isActive: !current } : b)));
        setToast({ open: true, message: 'Status updated', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${boutiqueToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBoutiqueList((prev) => prev.filter((b) => b._id !== boutiqueToDelete));
        setToast({ open: true, message: 'Boutique item deleted', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Delete failed', severity: 'error' });
    } finally {
      setOpenConfirm(false);
      setBoutiqueToDelete(null);
    }
  };

  const filteredBoutiques = useMemo(() => {
    return boutiqueList.filter((b) => {
      const matchesSearch = !filters.search || b.name?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || b.category?._id === filters.category;
      return matchesSearch && matchesCategory;
    });
  }, [boutiqueList, filters]);

  const categories = useMemo(() => {
    const map = new Map();
    boutiqueList.forEach((b) => {
      if (b.category) map.set(b.category._id, b.category);
    });
    return Array.from(map.values());
  }, [boutiqueList]);

  const handleExport = () => {
    const headers = ['No', 'Name', 'Category', 'Mode', 'Material', 'Purchase Price', 'Rental Price', 'Stock', 'Status'];
    const rows = filteredBoutiques.map((b, i) => [
      i + 1,
      b.name || '',
      b.category?.title || '',
      b.availabilityMode || '',
      b.material || '',
      b.buyPricing?.totalPrice || 0,
      b.rentalPricing?.pricePerDay || 0,
      b.stock?.quantity || 0,
      b.isActive ? 'Active' : 'Inactive'
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boutique_items_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const DetailItem = ({ icon, label, value, chip, success, error, bold, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Box sx={{ color: THEME_COLOR, mt: 0.5 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </Typography>
        {chip ? (
          <Box sx={{ mt: 0.5 }}>
            <Chip label={value} size="small" color={success ? 'success' : error ? 'error' : 'default'} sx={{ fontWeight: 700 }} />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: bold ? 800 : 500, mt: 0.3, color: color || 'inherit' }}>
            {value || 'Not specified'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const SpecBox = ({ icon, label, value }) => (
    <Box sx={{
      p: 2,
      borderRadius: '20px',
      bgcolor: '#fff',
      border: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      height: '100%',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
        borderColor: THEME_COLOR
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', p: 3 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ px: '0 !important' }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>
            Boutique Collection <Box component="span" sx={{ color: THEME_COLOR, fontSize: '18px' }}>({boutiqueList.length})</Box>
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: THEME_COLOR,
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 800,
              boxShadow: `0 8px 20px ${alpha(THEME_COLOR, 0.2)}`,
              '&:hover': { bgcolor: SECONDARY_COLOR, boxShadow: `0 10px 25px ${alpha(SECONDARY_COLOR, 0.3)}` }
            }}
            onClick={() => navigate('/boutique/addpackage')}
          >
            Add New Item
          </Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, mt: 3, borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search boutique items..."
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '10px', bgcolor: '#f8fafc' }
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              displayEmpty
              sx={{ borderRadius: '10px', bgcolor: '#f8fafc' }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ ml: 'auto', gap: 1, display: 'flex' }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchBoutiques} sx={{ borderRadius: '10px', fontWeight: 700 }}>
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={handleExport} sx={{ borderRadius: '10px', fontWeight: 700 }}>
              Export CSV
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ mt: 3, borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Material</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#64748b' }}>Pricing</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: THEME_COLOR }} />
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredBoutiques.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Category sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {boutiqueList.length === 0 ? 'No boutique items created yet' : 'No items match your search'}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2, bgcolor: THEME_COLOR, borderRadius: '10px' }}
                        onClick={() => navigate('/boutique/addpackage')}
                      >
                        Create Your First Item
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {filteredBoutiques.map((b, i) => (
                <TableRow key={b._id} hover>
                  <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>{i + 1}</TableCell>
                  <TableCell>
                    <ImageAvatar src={getImageUrl(b.thumbnail)} alt={b.name} title={b.name} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>{b.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>ID: {b.boutiqueId || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={b.category?.title || 'N/A'}
                      size="small"
                      sx={{ borderRadius: '8px', fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>{b.material || 'Standard'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      {b.availabilityMode !== 'rental' && (
                        <Box sx={{ mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mr: 1 }}>BUY:</Typography>
                          <Typography component="span" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                            {formatINR(b.buyPricing?.totalPrice)}
                          </Typography>
                        </Box>
                      )}
                      {b.availabilityMode !== 'purchase' && (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mr: 1 }}>RENT:</Typography>
                          <Typography component="span" sx={{ fontWeight: 900, color: '#10b981' }}>
                            {formatINR(b.rentalPricing?.pricePerDay)}/day
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Switch checked={b.isActive} onChange={() => handleToggleStatus(b._id, b.isActive)} color="success" />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(b)}
                          sx={{ bgcolor: alpha(THEME_COLOR, 0.05), color: THEME_COLOR, '&:hover': { bgcolor: alpha(THEME_COLOR, 0.1) } }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Item">
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#f8fafc', color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
                          onClick={() => navigate(`/boutique/addpackage?id=${b._id}`)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#fef2f2', color: '#dc2626', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => {
                            setBoutiqueToDelete(b._id);
                            setOpenConfirm(true);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Details Modal - REDESIGNED LUXURY VIEW */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogContent sx={{ p: 0, bgcolor: '#fff' }}>
          {selectedBoutique && (
            <Box>
              {/* Close Button Floating */}
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 24,
                  top: 24,
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#fff', transform: 'rotate(90deg)' },
                  transition: 'all 0.3s'
                }}
                onClick={() => setOpenView(false)}
              >
                <Close />
              </IconButton>

              <Grid container>
                {/* LEFT SIDE: HERO GALLERY */}
                <Grid item xs={12} md={5} lg={5} sx={{ position: 'relative', bgcolor: '#fbfbfb', borderRight: '1px solid #f1f5f9' }}>
                  <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        width: '100%',
                        maxHeight: '450px',
                        aspectRatio: '0.85/1',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        mb: 3,
                        position: 'relative',
                        bgcolor: '#fff'
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getImageUrl(selectedImageIndex === 0 ? selectedBoutique.thumbnail : selectedBoutique.galleryImages?.[selectedImageIndex - 1])}
                        alt={selectedBoutique.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.5s ease',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                      <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 1 }}>
                        <Chip
                          label={selectedBoutique.availabilityMode?.toUpperCase() || 'PURCHASE'}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 800,
                            color: THEME_COLOR,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            border: 'none'
                          }}
                        />
                        <Chip
                          label={selectedBoutique.isActive ? 'LIVE' : 'HIDDEN'}
                          sx={{
                            bgcolor: selectedBoutique.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 800,
                            color: selectedBoutique.isActive ? '#10b981' : '#ef4444',
                            border: `1px solid ${selectedBoutique.isActive ? '#10b981' : '#ef4444'}`,
                            fontSize: '10px'
                          }}
                        />
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', py: 1, px: 0.5 }}>
                      <Box
                        onClick={() => setSelectedImageIndex(0)}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          flexShrink: 0,
                          border: selectedImageIndex === 0 ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
                          boxShadow: selectedImageIndex === 0 ? `0 8px 16px ${alpha(THEME_COLOR, 0.2)}` : 'none',
                          transition: 'all 0.2s',
                          transform: selectedImageIndex === 0 ? 'translateY(-4px)' : 'none'
                        }}
                      >
                        <img src={getImageUrl(selectedBoutique.thumbnail)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      {selectedBoutique.galleryImages?.map((img, i) => (
                        <Box
                          key={i}
                          onClick={() => setSelectedImageIndex(i + 1)}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            flexShrink: 0,
                            border: selectedImageIndex === i + 1 ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
                            boxShadow: selectedImageIndex === i + 1 ? `0 8px 16px ${alpha(THEME_COLOR, 0.2)}` : 'none',
                            transition: 'all 0.2s',
                            transform: selectedImageIndex === i + 1 ? 'translateY(-4px)' : 'none'
                          }}
                        >
                          <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 'auto', pt: 3 }}>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '1px' }}>
                        STYLE TAGS
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, mb: 2 }}>
                        {selectedBoutique.tags?.map((tag, idx) => (
                          <Chip key={idx} label={`#${tag}`} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600, color: '#475569' }} />
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '10px' }}>
                        LAST UPDATED: {new Date(selectedBoutique.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* RIGHT SIDE: CONTENT OVERVIEW */}
                <Grid item xs={12} md={7} lg={7}>
                  <Box sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="overline" sx={{ color: THEME_COLOR, fontWeight: 900, fontSize: '12px', letterSpacing: '2px' }}>
                        {selectedBoutique.category?.title} / {selectedBoutique.subCategory?.title || 'General'}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#111827', mt: 1, fontSize: { xs: '28px', md: '36px' }, letterSpacing: '-1px' }}>
                        {selectedBoutique.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#64748b', mt: 2, lineHeight: 1.6, fontSize: '15px' }}>
                        {selectedBoutique.description}
                      </Typography>
                    </Box>

                    {/* KEY SPECS GRID */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      <Grid item xs={6} sm={4}>
                        <SpecBox icon={<Palette sx={{ color: '#3b82f6' }} />} label="Material" value={selectedBoutique.material || 'Premium'} />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <SpecBox icon={<InventoryIcon sx={{ color: '#10b981' }} />} label="Stock" value={selectedBoutique.stock?.quantity || '0'} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <SpecBox icon={<Label sx={{ color: '#f59e0b' }} />} label="SKU ID" value={selectedBoutique.boutiqueId?.split('-').pop() || 'BM-B'} />
                      </Grid>
                    </Grid>

                    {/* PRICE CARDS */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                      {selectedBoutique.availabilityMode !== 'rental' && (
                        <Box sx={{ flex: 1, p: 3, borderRadius: '24px', bgcolor: '#111827', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                          <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>PURCHASE PRICE</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', mt: 0.5 }}>{formatINR(selectedBoutique.buyPricing?.totalPrice)}</Typography>
                          {selectedBoutique.buyPricing?.discountValue > 0 && (
                            <Chip
                              label={`${selectedBoutique.buyPricing.discountType === 'percentage' ? selectedBoutique.buyPricing.discountValue + '%' : formatINR(selectedBoutique.buyPricing.discountValue)} OFF`}
                              size="small"
                              sx={{ mt: 1, bgcolor: SECONDARY_COLOR, color: '#fff', fontWeight: 900, fontSize: '10px' }}
                            />
                          )}
                        </Box>
                      )}
                      {selectedBoutique.availabilityMode !== 'purchase' && (
                        <Box sx={{ flex: 1, p: 3, borderRadius: '24px', bgcolor: alpha(THEME_COLOR, 0.05), border: `2px solid ${THEME_COLOR}` }}>
                          <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 700, letterSpacing: '1px' }}>RENTAL / DAY</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', mt: 0.5 }}>{formatINR(selectedBoutique.rentalPricing?.pricePerDay)}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b', fontWeight: 600 }}>Min Booking: {selectedBoutique.rentalPricing?.minimumDays} Days</Typography>
                        </Box>
                      )}
                    </Stack>

                    {/* SUB-SECTIONS */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* SIZES */}
                      {selectedBoutique.availableSizes?.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Storefront fontSize="small" sx={{ color: THEME_COLOR }} /> Available Sizes
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {selectedBoutique.availableSizes.map((s, idx) => (
                              <Chip key={idx} label={s} sx={{ fontWeight: 700, borderRadius: '10px', bgcolor: alpha(THEME_COLOR, 0.08), color: THEME_COLOR, border: `1px solid ${alpha(THEME_COLOR, 0.1)}` }} />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* COLORS */}
                      {selectedBoutique.availableColors?.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Palette fontSize="small" sx={{ color: THEME_COLOR }} /> Available Colors
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {selectedBoutique.availableColors.map((c, idx) => (
                              <Chip key={idx} label={c} sx={{ fontWeight: 700, borderRadius: '10px', bgcolor: alpha(THEME_COLOR, 0.08), color: THEME_COLOR, border: `1px solid ${alpha(THEME_COLOR, 0.1)}` }} />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* VARIATIONS */}
                      {selectedBoutique.variations?.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InventoryIcon fontSize="small" sx={{ color: THEME_COLOR }} /> Product Variations
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                            {selectedBoutique.variations.map((v, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  p: 2,
                                  borderRadius: '20px',
                                  bgcolor: '#fff',
                                  border: '1px solid #e2e8f0',
                                  minWidth: '180px',
                                  transition: 'all 0.3s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  '&:hover': { borderColor: THEME_COLOR, transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                }}
                              >
                                {v.image && (
                                  <Avatar
                                    src={getImageUrl(v.image)}
                                    variant="rounded"
                                    sx={{ width: 45, height: 45, borderRadius: '12px', bgcolor: '#f1f5f9' }}
                                  />
                                )}
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {v.name}
                                  </Typography>
                                  <Typography sx={{ fontWeight: 900, fontSize: '16px', color: '#111827' }}>
                                    {formatINR(v.price)}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* SHIPPING */}
                      <Box sx={{ p: 2, borderRadius: '16px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <Stack direction="row" spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalShipping sx={{ color: selectedBoutique.shipping?.free ? '#10b981' : '#64748b' }} />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {selectedBoutique.shipping?.free ? 'Free Shipping' : `Shipping: ${formatINR(selectedBoutique.shipping?.price)}`}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* POLICIES */}
                      <Grid container spacing={2}>
                        {selectedBoutique.returnPolicy && (
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, borderRadius: '16px', bgcolor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0369A1', mb: 1 }}>Return Policy</Typography>
                              <Typography variant="caption" sx={{ color: '#0C4A6E', display: 'block' }}>{selectedBoutique.returnPolicy}</Typography>
                            </Box>
                          </Grid>
                        )}
                        {selectedBoutique.cancellationPolicy && (
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, borderRadius: '16px', bgcolor: '#FFF1F2', border: '1px solid #FECDD3' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#BE123C', mb: 1 }}>Cancellation Policy</Typography>
                              <Typography variant="caption" sx={{ color: '#881337', display: 'block' }}>{selectedBoutique.cancellationPolicy}</Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>

                      {/* CARE INSTRUCTIONS */}
                      {selectedBoutique.careInstructions && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>Care Instructions</Typography>
                          <Typography variant="body2" sx={{ p: 2, bgcolor: '#fff9c4', borderRadius: '12px', color: '#5d4037', fontWeight: 500, fontStyle: 'italic' }}>
                            {selectedBoutique.careInstructions}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mt: 'auto', pt: 4, display: 'flex', gap: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/boutique/addpackage?id=${selectedBoutique._id}`)}
                        sx={{ bgcolor: THEME_COLOR, borderRadius: '14px', py: 1.5, fontWeight: 800, '&:hover': { bgcolor: SECONDARY_COLOR } }}
                      >
                        Edit Item
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setOpenView(false)}
                        sx={{ borderRadius: '14px', py: 1.5, fontWeight: 800, borderColor: '#e2e8f0', color: '#64748b' }}
                      >
                        Close
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, textAlign: 'center' }}>Remove Item?</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#64748b' }}>
            Are you sure you want to delete this boutique item? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#dc2626', borderRadius: '10px', fontWeight: 700, '&:hover': { bgcolor: '#b91c1c' } }}>
            Delete Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: '12px', fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}