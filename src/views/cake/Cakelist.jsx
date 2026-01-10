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
  List as ListIcon
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
    const headers = ['No', 'Name', 'Category', 'Type', 'Unit Price', 'Final Price', 'Status'];
    const rows = filteredCakes.map((c, i) => [
      i + 1,
      c.name || '',
      c.category?.title || '',
      c.itemType || '',
      c.priceInfo?.unitPrice || 0,
      c.priceInfo?.unitPrice - (c.priceInfo?.discount || 0) || 0,
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

  const DetailItem = ({ icon, label, value, chip, success, error }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Box sx={{ color: '#E91E63', mt: 0.5 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        {chip ? (
          <Chip label={value} size="small" color={success ? 'success' : error ? 'error' : 'default'} sx={{ mt: 0.5 }} />
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>
            {value || 'Not specified'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', p: 3 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            My Cake Packages ({cakeList.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ bgcolor: '#E91E63', '&:hover': { bgcolor: '#c2185b' } }}
            onClick={() => (window.location.href = '/cake/addpackage')}
          >
            Add New Package
          </Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search cake packages..."
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))} displayEmpty>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ ml: 'auto', gap: 1, display: 'flex' }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchCakes}>
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>
              Export CSV
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ mt: 3 }}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell>#</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Cake Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredCakes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      {cakeList.length === 0 ? 'No cake packages created yet' : 'No packages match your search'}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, bgcolor: '#E91E63' }}
                      onClick={() => (window.location.href = '/cake/addpackage')}
                    >
                      Create Your First Cake Package
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {filteredCakes.map((c, i) => (
                <TableRow key={c._id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <ImageAvatar src={getImageUrl(c.thumbnail)} alt={c.name} title={c.name} />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{c.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={c.category?.title || 'N/A'} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={c.itemType || 'N/A'} size="small" color={c.itemType === 'Veg' ? 'success' : 'error'} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold" color="primary">
                      ₹{c.priceInfo?.unitPrice?.toLocaleString()}
                    </Typography>
                    {c.priceInfo?.discount > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Discount: ₹{c.priceInfo.discount}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch checked={c.isActive} onChange={() => handleToggleStatus(c._id, c.isActive)} color="success" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleView(c)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Package">
                        <IconButton
                          size="small"
                          color="primary"
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
                          color="error"
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

      {/* View Details Modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ bgcolor: '#E91E63', color: 'white', pr: 6 }}>
          <Typography variant="h6">{selectedCake?.name}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            ID: {selectedCake?.cakeId}
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }} onClick={() => setOpenView(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedCake && (
            <Box>
              {/* Gallery Section */}
              <Box sx={{ bgcolor: '#1a1a1a', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {selectedCake.images?.[selectedImageIndex] || selectedCake.thumbnail ? (
                    <Card elevation={3} sx={{ maxWidth: 500 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={getImageUrl(selectedCake.images?.[selectedImageIndex] || selectedCake.thumbnail)}
                        alt={selectedCake.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  ) : (
                    <Box
                      sx={{
                        height: 300,
                        width: '100%',
                        maxWidth: 500,
                        bgcolor: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 80, color: '#666' }} />
                    </Box>
                  )}
                </Box>
                {selectedCake.images?.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {selectedCake.images.map((img, i) => (
                      <Avatar
                        key={i}
                        variant="rounded"
                        src={getImageUrl(img)}
                        onClick={() => setSelectedImageIndex(i)}
                        sx={{
                          width: 60,
                          height: 60,
                          cursor: 'pointer',
                          border: selectedImageIndex === i ? '3px solid #E91E63' : '3px solid transparent',
                          opacity: selectedImageIndex === i ? 1 : 0.7,
                          '&:hover': { opacity: 1 }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Details Section */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Left Column - Basic Info */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E91E63' }}>
                      Basic Information
                    </Typography>
                    <DetailItem icon={<Category />} label="Category" value={selectedCake.category?.title || 'None'} />
                    <DetailItem
                      icon={<Label />}
                      label="Sub Categories"
                      value={selectedCake.subCategories?.map((sc) => sc.title).join(', ') || 'None'}
                    />
                    <DetailItem
                      icon={<Restaurant />}
                      label="Item Type"
                      value={selectedCake.itemType}
                      chip
                      success={selectedCake.itemType === 'Veg'}
                      error={selectedCake.itemType === 'Non-Veg'}
                    />
                    <DetailItem
                      icon={<Verified />}
                      label="Halal Certified"
                      value={selectedCake.isHalal ? 'Yes' : 'No'}
                      chip
                      success={selectedCake.isHalal}
                    />
                    <DetailItem
                      icon={<Schedule />}
                      label="Available Time"
                      value={`${selectedCake.timeSchedule?.startTime || 'N/A'} - ${selectedCake.timeSchedule?.endTime || 'N/A'}`}
                    />
                    <DetailItem
                      icon={<CheckCircle />}
                      label="Status"
                      value={selectedCake.isActive ? 'Active' : 'Inactive'}
                      chip
                      success={selectedCake.isActive}
                      error={!selectedCake.isActive}
                    />
                    <DetailItem icon={<Info />} label="Description" value={selectedCake.shortDescription} />
                  </Grid>

                  {/* Right Column - Pricing */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E91E63' }}>
                      Pricing Information
                    </Typography>
                    <DetailItem
                      icon={<AttachMoney />}
                      label="Unit Price"
                      value={`₹${selectedCake.priceInfo?.unitPrice?.toLocaleString()}`}
                    />
                    <DetailItem
                      icon={<LocalOffer />}
                      label="Discount"
                      value={
                        selectedCake.priceInfo?.discount
                          ? `₹${selectedCake.priceInfo?.discount?.toLocaleString()} (${selectedCake.priceInfo?.discountType})`
                          : 'No discount'
                      }
                    />
                    <DetailItem
                      icon={<AttachMoney />}
                      label="Final Price"
                      value={
                        <Typography sx={{ color: '#E91E63', fontWeight: 'bold' }}>
                          ₹{(selectedCake.priceInfo?.unitPrice - (selectedCake.priceInfo?.discount || 0))?.toLocaleString()}
                        </Typography>
                      }
                    />
                    <DetailItem
                      icon={<Payment />}
                      label="Advance Booking Amount"
                      value={
                        selectedCake.priceInfo?.advanceBookingAmount ? `₹${selectedCake.priceInfo?.advanceBookingAmount}` : 'Not specified'
                      }
                    />
                    <DetailItem icon={<Label />} label="Max Purchase Qty" value={selectedCake.priceInfo?.maxPurchaseQty || 'No limit'} />
                  </Grid>

                  {/* Full Width - Variations */}
                  {selectedCake.variations?.length > 0 && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E91E63' }}>
                        Available Variations
                      </Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        {selectedCake.variations.map((variation, idx) => (
                          <Card key={idx} variant="outlined" sx={{ p: 2, minWidth: 150 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {variation.name}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ₹{variation.price?.toLocaleString()}
                            </Typography>
                          </Card>
                        ))}
                      </Stack>
                    </Grid>
                  )}

                  {/* Nutrition & Allergens */}
                  {(selectedCake.nutrition?.length > 0 || selectedCake.allergenIngredients?.length > 0) && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E91E63' }}>
                        Nutritional Information
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedCake.nutrition?.length > 0 && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              Nutrition:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {selectedCake.nutrition.map((item, idx) => (
                                <Chip key={idx} label={item} size="small" color="success" variant="outlined" />
                              ))}
                            </Stack>
                          </Grid>
                        )}
                        {selectedCake.allergenIngredients?.length > 0 && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              Allergens:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {selectedCake.allergenIngredients.map((item, idx) => (
                                <Chip key={idx} label={item} size="small" color="error" variant="outlined" />
                              ))}
                            </Stack>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* Search Tags */}
                  {selectedCake.searchTags?.length > 0 && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E91E63' }}>
                        Search Tags
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {selectedCake.searchTags.map((tag, idx) => (
                          <Chip key={idx} label={tag} size="small" />
                        ))}
                      </Stack>
                    </Grid>
                  )}

                  {/* Metadata */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={4} sx={{ color: 'text.secondary' }}>
                      <Typography variant="caption">Created: {new Date(selectedCake.createdAt).toLocaleString()}</Typography>
                      <Typography variant="caption">Updated: {new Date(selectedCake.updatedAt).toLocaleString()}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
         
          <Button variant="contained" sx={{ bgcolor: '#E91E63' }} onClick={() => setOpenView(false)}>
            Close
          </Button>
        </DialogActions>
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
