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
  DialogContentText,
  Snackbar,
  Avatar,
  InputAdornment,
  Skeleton,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Card,
  CardMedia,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails
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
  AttachMoney,
  Cake as CakeIcon,
  Schedule,
  Info,
  Image as ImageIcon,
  CheckCircle,
  Cancel,
  ExpandMore,
  LocalOffer,
  Label,
  Restaurant,
  Payment,
  Verified,
  List as ListIcon,
  Timer
} from '@mui/icons-material';
import { Alert } from '@mui/material';

const API_BASE_URL = 'https://api.bookmyevent.ae/api/cakes';

export default function CakeList() {
  const [cakeList, setCakeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [pendingSearch, setPendingSearch] = useState('');
  const [openView, setOpenView] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCake, setSelectedCake] = useState(null);
  const [cakeToDelete, setCakeToDelete] = useState(null);
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
        color: '#E91E63',
        fontWeight: 900,
        fontSize: '12px',
        letterSpacing: '1.5px',
        mb: 2,
        pb: 0.5,
        borderBottom: '2px solid rgba(233, 30, 99, 0.1)',
        width: 'fit-content',
        ...sx
      }}
    >
      {title}
    </Typography>
  );

  const PriceRow = ({ label, value, isDiscount, isFinal }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" sx={{ color: isFinal ? '#111827' : '#64748b', fontWeight: isFinal ? 800 : 600 }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: isFinal ? 900 : 700,
          color: isDiscount ? '#dc2626' : isFinal ? '#E91E63' : '#1e293b',
          fontSize: isFinal ? '1.2rem' : '0.95rem'
        }}
      >
        {isDiscount ? '-' : ''}₹{value?.toLocaleString() || '0'}
      </Typography>
    </Stack>
  );

  const ImageAvatar = ({ src, alt, title }) => {
    const [error, setError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    if (!src || error) {
      return (
        <Avatar
          variant="rounded"
          sx={{ width: 70, height: 70, bgcolor: '#E91E63', fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}
        >
          {title?.[0]?.toUpperCase() || 'C'}
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

  const fetchCakes = useCallback(async () => {
    if (!providerId || !token) {
      setToast({ open: true, message: 'Please login again', severity: 'error' });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/provider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load cake packages');
      const result = await res.json();
      if (result.success) setCakeList(result.data || []);
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => {
    fetchCakes();
  }, [fetchCakes]);

  useEffect(() => {
    const timer = setTimeout(() => setFilters((prev) => ({ ...prev, search: pendingSearch })), 400);
    return () => clearTimeout(timer);
  }, [pendingSearch]);

  const handleView = (cake) => {
    setSelectedCake(cake);
    setSelectedImageIndex(0);
    setOpenView(true);
  };





  const handleToggleStatus = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/toggle-active`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setCakeList((prev) => prev.map((c) => (c._id === id ? { ...c, isActive: !current } : c)));
        setToast({ open: true, message: 'Status updated', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${cakeToDelete}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setCakeList((prev) => prev.filter((c) => c._id !== cakeToDelete));
        setToast({ open: true, message: 'Cake package deleted', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Delete failed', severity: 'error' });
    } finally {
      setOpenConfirm(false);
      setCakeToDelete(null);
    }
  };

  const filteredCakes = useMemo(() => {
    return cakeList.filter((c) => {
      const matchesSearch = !filters.search || c.name?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || c.category?._id === filters.category;
      return matchesSearch && matchesCategory;
    });
  }, [cakeList, filters]);

  const categories = useMemo(() => {
    const map = new Map();
    cakeList.forEach((c) => {
      if (c.category) map.set(c.category._id, c.category);
    });
    return Array.from(map.values());
  }, [cakeList]);

  const handleExport = () => {
    const headers = ['No', 'Name', 'Category', 'Type', 'Unit', 'Weight', 'Base Price', 'Final Price', 'Status'];
    const rows = filteredCakes.map((c, i) => [
      i + 1,
      c.name || '',
      c.category?.title || '',
      c.itemType || '',
      c.uom || '',
      c.weight || '',
      c.basePrice || 0,
      c.finalPrice || 0,
      c.isActive ? 'Active' : 'Inactive'
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cake_packages_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const DetailItem = ({ icon, label, value, chip, success, error, bold, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Box sx={{ color: '#E91E63', mt: 0.5 }}>{icon}</Box>
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

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', p: 3 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ px: '0 !important' }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>
            My Cake Packages <Box component="span" sx={{ color: '#E91E63', fontSize: '18px' }}>({cakeList.length})</Box>
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#E91E63',
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(233, 30, 99, 0.2)',
              '&:hover': { bgcolor: '#c2185b', boxShadow: '0 10px 25px rgba(233, 30, 99, 0.3)' }
            }}
            onClick={() => (window.location.href = '/cake/addpackage')}
          >
            Add New Package
          </Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, mt: 3, borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search cake packages..."
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
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchCakes} sx={{ borderRadius: '10px', fontWeight: 700 }}>
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
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Cake Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#64748b' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: '#E91E63' }} />
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredCakes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CakeIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {cakeList.length === 0 ? 'No cake packages created yet' : 'No packages match your search'}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2, bgcolor: '#E91E63', borderRadius: '10px' }}
                        onClick={() => (window.location.href = '/cake/addpackage')}
                      >
                        Create Your First Cake Package
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {filteredCakes.map((c, i) => (
                <TableRow key={c._id} hover>
                  <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>{i + 1}</TableCell>
                  <TableCell>
                    <ImageAvatar src={getImageUrl(c.thumbnail)} alt={c.name} title={c.name} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>{c.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>ID: {c.cakeId}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.category?.title || 'N/A'}
                      size="small"
                      sx={{ borderRadius: '8px', fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.itemType || 'N/A'}
                      size="small"
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 700,
                        bgcolor: c.itemType === 'Eggless' ? '#f0fdf4' : '#fef2f2',
                        color: c.itemType === 'Eggless' ? '#16a34a' : '#dc2626'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      {c.discountValue > 0 && (
                        <Typography sx={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
                          ₹{c.basePrice?.toLocaleString()}
                        </Typography>
                      )}
                      <Typography sx={{ fontWeight: 900, color: '#E91E63', fontSize: '16px' }}>
                        ₹{c.finalPrice?.toLocaleString() || c.basePrice?.toLocaleString() || '0'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Switch checked={c.isActive} onChange={() => handleToggleStatus(c._id, c.isActive)} color="success" />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(c)}
                          sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' } }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Package">
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#f8fafc', color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
                          onClick={() => {
                            window.location.href = `/cake/addpackage?id=${c._id}`;
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#fef2f2', color: '#dc2626', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => {
                            setCakeToDelete(c._id);
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
          {selectedCake && (
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
                        image={getImageUrl(selectedCake.images?.[selectedImageIndex] || selectedCake.thumbnail)}
                        alt={selectedCake.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain', // Switch to contain to avoid cropping if image is weird size
                          transition: 'transform 0.5s ease',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                      <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 1 }}>
                        <Chip
                          label={selectedCake.itemType}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 800,
                            color: selectedCake.itemType === 'Eggless' ? '#10b981' : '#ef4444',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            border: 'none'
                          }}
                        />
                        {selectedCake.isHalal && (
                          <Chip
                            icon={<Verified sx={{ fontSize: '16px !important', color: '#10b981 !important' }} />}
                            label="HALAL"
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.9)',
                              backdropFilter: 'blur(10px)',
                              fontWeight: 800,
                              color: '#10b981',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              border: 'none'
                            }}
                          />
                        )}
                        <Chip
                          label={selectedCake.isActive ? 'LIVE' : 'HIDDEN'}
                          sx={{
                            bgcolor: selectedCake.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 800,
                            color: selectedCake.isActive ? '#10b981' : '#ef4444',
                            border: `1px solid ${selectedCake.isActive ? '#10b981' : '#ef4444'}`,
                            fontSize: '10px'
                          }}
                        />
                      </Box>
                    </Box>

                    {selectedCake.images?.length > 1 && (
                      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', py: 1, px: 0.5 }}>
                        {selectedCake.images.map((img, i) => (
                          <Box
                            key={i}
                            onClick={() => setSelectedImageIndex(i)}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: '16px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              flexShrink: 0,
                              border: selectedImageIndex === i ? '3px solid #E91E63' : '3px solid transparent',
                              boxShadow: selectedImageIndex === i ? '0 8px 16px rgba(233, 30, 99, 0.2)' : 'none',
                              transition: 'all 0.2s',
                              transform: selectedImageIndex === i ? 'translateY(-4px)' : 'none',
                              '&:hover': { opacity: 1, transform: 'translateY(-2px)' }
                            }}
                          >
                            <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ))}
                      </Stack>
                    )}

                    <Box sx={{ mt: 'auto', pt: 3 }}>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '1px' }}>
                        PRODUCT TAGS
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, mb: 2 }}>
                        {selectedCake.searchTags?.map((tag, idx) => (
                          <Chip key={idx} label={`#${tag}`} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600, color: '#475569' }} />
                        ))}
                      </Box>

                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', fontSize: '10px' }}>
                        LAST UPDATED: {new Date(selectedCake.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* RIGHT SIDE: CONTENT OVERVIEW */}
                <Grid item xs={12} md={7} lg={7}>
                  <Box sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="overline" sx={{ color: '#E91E63', fontWeight: 900, fontSize: '12px', letterSpacing: '2px' }}>
                        {selectedCake.category?.title}
                        {selectedCake.subCategories?.length > 0 && (
                          <span style={{ color: '#94a3b8', fontWeight: 500 }}>
                            {" / "}{selectedCake.subCategories.map(s => s.title).join(", ")}
                          </span>
                        )}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#111827', mt: 1, fontSize: { xs: '28px', md: '36px' }, letterSpacing: '-1px' }}>
                        {selectedCake.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#64748b', mt: 2, lineHeight: 1.6, fontSize: '15px' }}>
                        {selectedCake.shortDescription}
                      </Typography>
                    </Box>

                    {/* KEY SPECS GRID */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      <Grid item xs={6} sm={3}>
                        <SpecBox icon={<Schedule sx={{ color: '#3b82f6' }} />} label="Prep Time" value={selectedCake.prepTime || 'None'} />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <SpecBox icon={<Info sx={{ color: '#8b5cf6' }} />} label="Weight" value={`${selectedCake.weight} ${selectedCake.uom}`} />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <SpecBox icon={<Timer sx={{ color: '#10b981' }} />} label="Available" value={selectedCake.availableTime || 'All Day'} />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <SpecBox icon={<CakeIcon sx={{ color: '#f59e0b' }} />} label="Cake ID" value={selectedCake.cakeId?.split('-').pop()} />
                      </Grid>
                    </Grid>

                    {/* PRICE CARD */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '24px',
                        bgcolor: '#111827',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 4,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>
                          TOTAL PRICE
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
                            ₹{selectedCake.finalPrice?.toLocaleString()}
                          </Typography>
                          {selectedCake.discountValue > 0 && (
                            <Chip
                              label={`${selectedCake.discountType === 'percentage' ? selectedCake.discountValue + '%' : '₹' + selectedCake.discountValue} OFF`}
                              size="small"
                              sx={{ bgcolor: '#E91E63', color: '#fff', fontWeight: 900, fontSize: '10px' }}
                            />
                          )}
                        </Stack>
                      </Box>
                      <Stack spacing={1} sx={{ textAlign: 'right' }}>
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Delivery
                          </Typography>
                          <Typography sx={{ fontWeight: 800, color: selectedCake.shipping?.free ? '#10b981' : '#fff' }}>
                            {selectedCake.shipping?.free ? 'FREE' : (selectedCake.shipping?.flatRate ? `+ ₹${selectedCake.shipping?.price}` : 'NOT AVAILABLE')}
                          </Typography>
                        </Box>
                        {selectedCake.shipping?.takeaway && (
                          <Box>
                            <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                              Takeaway
                            </Typography>
                            <Typography sx={{ fontWeight: 800, color: '#10b981' }}>
                              AVAILABLE
                            </Typography>
                            {selectedCake.shipping?.takeawayLocation && (
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', maxWidth: '200px', fontSize: '11px', mt: 0.5 }}>
                                {selectedCake.shipping.takeawayLocation}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Stack>
                    </Box>

                    {/* SUB-SECTIONS ACCORDION-LIKE LIST */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                      {/* VARIATIONS */}
                      {selectedCake.variations?.length > 0 && (
                        <Box>
                          <SectionHeader title="Available Variations" count={selectedCake.variations.length} />
                          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                            {selectedCake.variations.map((v, idx) => (
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
                                  '&:hover': { borderColor: '#E91E63', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
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
                                    ₹{v.price}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* ADDONS */}
                      {selectedCake.addons?.length > 0 && (
                        <Box>
                          <SectionHeader title="Boosters & Add-ons" count={selectedCake.addons.length} />
                          <Grid container spacing={2}>
                            {selectedCake.addons.map((addon, aIdx) => (
                              <Grid item xs={12} sm={6} key={aIdx}>
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: '#f8fafc',
                                    border: '1px solid #f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                  }}
                                >
                                  <Avatar src={getImageUrl(addon.icon)} sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff', border: '1px solid #e2e8f0' }} />
                                  <Box>
                                    <Typography sx={{ fontWeight: 800, fontSize: '13px' }}>{addon.title}</Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{addon.priceList?.length} options available</Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* NUTRITION & ALLERGENS */}
                      {(selectedCake.nutrition?.length > 0 || selectedCake.allergenIngredients?.length > 0) && (
                        <Grid container spacing={3}>
                          {selectedCake.nutrition?.length > 0 && (
                            <Grid item xs={12} sm={6}>
                              <SectionHeader title="Nutrition Facts" />
                              <Stack spacing={1}>
                                {selectedCake.nutrition.map((n, i) => (
                                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 0.5 }}>
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>{n.split(':')[0]}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{n.split(':')[1] || '-'}</Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Grid>
                          )}
                          {selectedCake.allergenIngredients?.length > 0 && (
                            <Grid item xs={12} sm={6}>
                              <SectionHeader title="Allergens" />
                              <Box sx={{ p: 2, borderRadius: '16px', bgcolor: '#fff5f5', border: '1px solid #feb2b2' }}>
                                <Typography variant="caption" sx={{ color: '#c53030', fontWeight: 800, textTransform: 'uppercase' }}>Warning: Contains</Typography>
                                <Typography variant="body2" sx={{ color: '#742a2a', mt: 0.5, fontWeight: 600 }}>
                                  {selectedCake.allergenIngredients.join(", ")}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      )}

                      {/* ATTRIBUTES */}
                      {selectedCake.attributes?.length > 0 && (
                        <Box>
                          <SectionHeader title="Specifications" />
                          <Grid container spacing={2}>
                            {selectedCake.attributes.map((attr, idx) => (
                              <Grid item xs={12} sm={6} key={idx}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#E91E63' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#475569' }}>{attr.name}:</Typography>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>{attr.values.join(", ")}</Typography>
                                </Stack>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* RELATED ITEMS */}
                      {(selectedCake.relatedItems?.items?.length > 0 || (Array.isArray(selectedCake.relatedItems) && selectedCake.relatedItems.length > 0)) && (
                        <Box>
                          <SectionHeader title="Frequently Bought Together" count={selectedCake.relatedItems?.items?.length || selectedCake.relatedItems?.length} />
                          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                            {(selectedCake.relatedItems?.items || selectedCake.relatedItems).map((item, idx) => {
                              if (!item || typeof item !== 'object') return null;
                              return (
                                <Box
                                  key={idx}
                                  sx={{
                                    p: 1.5,
                                    borderRadius: '20px',
                                    bgcolor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    minWidth: '220px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    cursor: 'pointer',
                                    '&:hover': { borderColor: '#E91E63', transform: 'translateY(-2px)' },
                                    transition: 'all 0.3s'
                                  }}
                                  onClick={() => {
                                    setSelectedCake(item);
                                    setSelectedImageIndex(0);
                                  }}
                                >
                                  <Avatar
                                    src={getImageUrl(item.thumbnail || item.image)}
                                    variant="rounded"
                                    sx={{ width: 50, height: 50, borderRadius: '12px' }}
                                  />
                                  <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px' }}>
                                      {item.name || item.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#E91E63', fontWeight: 900 }}>
                                      ₹{(item.finalPrice || item.basePrice || item.price || 0).toLocaleString()}
                                    </Typography>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Box>
                      )}

                    </Box>

                    {/* ACTIONS */}
                    <Box sx={{ mt: 'auto', pt: 5, display: 'flex', gap: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          bgcolor: '#E91E63',
                          color: '#fff',
                          height: '56px',
                          borderRadius: '16px',
                          fontWeight: 900,
                          fontSize: '16px',
                          textTransform: 'none',
                          boxShadow: '0 10px 20px rgba(233, 30, 99, 0.2)',
                          '&:hover': { bgcolor: '#c2185b' }
                        }}
                        onClick={() => window.location.href = `/cake/addpackage?id=${selectedCake._id}`}
                      >
                        Edit This Package
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          minWidth: '56px',
                          height: '56px',
                          borderRadius: '16px',
                          borderColor: '#e2e8f0',
                          color: '#64748b',
                          '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' }
                        }}
                        onClick={() => setOpenView(false)}
                      >
                        <Close />
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
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Cake Package?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone. This cake package will be permanently deleted.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Sub-components for modern UI
const SpecBox = ({ icon, label, value }) => (
  <Box sx={{ p: 2, borderRadius: '20px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center' }}>
    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px' }}>
      {label}
    </Typography>
    <Typography sx={{ color: '#111827', fontWeight: 900, fontSize: '14px', mt: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {value}
    </Typography>
  </Box>
);

const SectionHeader = ({ title, count }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', fontSize: '18px', letterSpacing: '-0.5px' }}>
      {title}
    </Typography>
    {count > 0 && (
      <Chip
        label={count}
        size="small"
        sx={{ bgcolor: '#f1f5f9', fontWeight: 900, color: '#475569', height: '20px', fontSize: '11px' }}
      />
    )}
  </Stack>
);
