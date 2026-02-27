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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Badge,
  Paper
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
  ExpandMore,
  LocalOffer,
  DirectionsCar,
  EventAvailable,
  Policy,
  Payment,
  Spa,
  List as ListIcon,
  Category
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.bookmyevent.ae/api/mehandi';
export default function FloristList() {
  const navigate = useNavigate();
  const [floristList, setFloristList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setPendingSearch] = useState('');
  const [openView, setOpenView] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedMakeup, setSelectedMakeup] = useState(null);
  const [makeupToDelete, setMakeupToDelete] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const providerId = userData?._id;

  const getImageUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `https://api.bookmyevent.ae/${cleanPath}`;
  };

  const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);

  const fetchMakeup = useCallback(async () => {
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
      if (result.success) setFloristList(result.data || []);
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => {
    fetchMakeup();
  }, [fetchMakeup]);

  const handleView = (makeup) => {
    setSelectedMakeup(makeup);
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
        setFloristList((prev) => prev.map((m) => (m._id === id ? { ...m, isActive: !current } : m)));
        setToast({ open: true, message: 'Status updated', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${makeupToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFloristList((prev) => prev.filter((m) => m._id !== floristToDelete));
        setToast({ open: true, message: 'Package deleted', severity: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Delete failed', severity: 'error' });
    } finally {
      setOpenConfirm(false);
      setMakeupToDelete(null);
    }
  };

  const filteredMakeups = useMemo(() => {
    return floristList.filter((m) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      return (
        m.packageName?.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
      );
    });
  }, [floristList, searchQuery]);

  const DetailItem = ({ icon, label, value, chip, success, error }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Box sx={{ color: '#E15B65', mt: 0.5 }}>{icon}</Box>
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
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 4 }}>
      {/* Modern Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E15B65 0%, #c14a54 100%)',
          color: 'white',
          py: 4,
          px: 3,
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 20px rgba(225, 91, 101, 0.3)'
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                Florist Packages
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {floristList.length} total packages • {floristList.filter((m) => m.isActive).length} active
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => navigate('/makeupartist/addpackage')}
              sx={{
                bgcolor: 'white',
                color: '#E15B65',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' },
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              Add New Package
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ width: '100%', px: 2, mt: 4 }}>
        {/* Search Bar */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            overflow: 'visible'
          }}
        >
          <CardContent>
            <TextField
              fullWidth
              size="medium"
              placeholder="Search by package name, type, or description..."
              value={searchQuery}
              onChange={(e) => setPendingSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#E15B65', fontSize: 28 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#E15B65' },
                  '&.Mui-focused fieldset': { borderColor: '#E15B65' }
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#E15B65' }} />
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredMakeups.length === 0 && (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              textAlign: 'center',
              py: 8
            }}
          >
            <ImageIcon sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {floristList.length === 0 ? 'No packages yet' : 'No packages match your search'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {floristList.length === 0 ? 'Create your first florist package to get started' : 'Try adjusting your search terms'}
            </Typography>
            {floristList.length === 0 && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                sx={{
                  bgcolor: '#E15B65',
                  '&:hover': { bgcolor: '#c14a54' }
                }}
                onClick={() => navigate('/florist/addpackage')}
              >
                Create Your First Package
              </Button>
            )}
          </Card>
        )}

        {/* Package Cards Grid */}
        <Grid container spacing={3}>
          {filteredMakeups.map((makeup) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={makeup._id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(225, 91, 101, 0.2)'
                  },
                  minWidth: 280
                }}
              >
                {/* Image Section */}
                <Box sx={{ position: 'relative', paddingTop: '75%', bgcolor: '#f5f5f5' }}>
                  {makeup.image ? (
                    <CardMedia
                      component="img"
                      image={getImageUrl(makeup.image)}
                      alt={makeup.packageName}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f0f0f0'
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 60, color: '#ccc' }} />
                    </Box>
                  )}

                  {/* Status Badge */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                    <Chip
                      label={makeup.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        bgcolor: makeup.isActive ? '#4caf50' : '#757575',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    />
                  </Box>

                  {/* Top Pick Badge */}
                  {makeup.isTopPick && (
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      <Chip
                        icon={<EventAvailable sx={{ color: 'white !important' }} />}
                        label="Top Pick"
                        size="small"
                        sx={{
                          bgcolor: '#ff9800',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#2c3e50'
                    }}
                  >
                    {makeup.packageName}
                  </Typography>

                  {/* Categories */}
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 2, minHeight: 28 }}>
                    {makeup.categories?.slice(0, 2).map((cat, idx) => (
                      <Chip
                        key={cat._id || idx}
                        label={typeof cat === 'string' ? 'Category' : cat.title}
                        size="small"
                        sx={{
                          bgcolor: '#E15B6510',
                          color: '#E15B65',
                          fontWeight: 500,
                          height: 24,
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                    {makeup.categories?.length > 2 && (
                      <Chip
                        label={`+${makeup.categories.length - 2}`}
                        size="small"
                        sx={{
                          bgcolor: '#E15B6510',
                          color: '#E15B65',
                          fontWeight: 500,
                          height: 24,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Price Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#E15B65', mb: 0.5 }}>
                      {formatINR(makeup.packagePrice)}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleView(makeup)}
                      sx={{
                        borderColor: '#E15B65',
                        color: '#E15B65',
                        '&:hover': {
                          borderColor: '#c14a54',
                          bgcolor: '#E15B6505'
                        }
                      }}
                    >
                      View
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/florist/edit/${makeup._id}`)}
                      sx={{
                        border: '1px solid #e0e0e0',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setMakeupToDelete(makeup._id);
                        setOpenConfirm(true);
                      }}
                      sx={{
                        border: '1px solid #e0e0e0',
                        '&:hover': { bgcolor: '#ffebee' }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>

                  {/* Toggle Switch */}
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      Package Status
                    </Typography>
                    <Switch
                      checked={makeup.isActive}
                      onChange={() => handleToggleStatus(makeup._id, makeup.isActive)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50'
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* View Details Modal - Redesigned for Premium Look */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
            bgcolor: '#ffffff'
          }
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
            position: 'relative',
            background: 'linear-gradient(135deg, #E15B65 0%, #c14a54 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
                {selectedMakeup?.packageName}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label="Premium Package"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    backdropFilter: 'blur(4px)'
                  }}
                />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  ID: {selectedMakeup?.packageId}
                </Typography>
              </Stack>
            </Box>
            <IconButton
              onClick={() => setOpenView(false)}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
          {selectedMakeup && (
            <Grid container>
              {/* Left Column: Media & Quick Stats */}
              <Grid item xs={12} md={5} sx={{ borderRight: { md: '1px solid #f0f0f0' } }}>
                <Box sx={{ position: 'sticky', top: 0 }}>
                  <Box sx={{ position: 'relative', p: 1.5 }}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        aspectRatio: '16/9',
                        maxHeight: '280px'
                      }}
                    >
                      {selectedMakeup.image ? (
                        <CardMedia
                          component="img"
                          image={getImageUrl(selectedMakeup.image)}
                          alt={selectedMakeup.packageName}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f8f9fa'
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 80, color: '#dee2e6' }} />
                        </Box>
                      )}

                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(8px)',
                          px: 2,
                          py: 1,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, color: '#E15B65', fontSize: '1.2rem' }}>
                          ₹{selectedMakeup.packagePrice?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Card>
                  </Box>

                  <Box sx={{ px: 3, pb: 2 }}>
                    <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em' }}>
                      Quick Setup
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#FDF6EE', borderRadius: '16px' }}>
                        <Avatar sx={{ bgcolor: '#C4572A', width: 40, height: 40 }}>
                          <Payment fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Advance Payment</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{selectedMakeup.advanceBookingAmount?.toLocaleString()}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: selectedMakeup.isActive ? '#E8F5E9' : '#F5F5F5', borderRadius: '16px' }}>
                        <Avatar sx={{ bgcolor: selectedMakeup.isActive ? '#4CAF50' : '#757575', width: 40, height: 40 }}>
                          {selectedMakeup.isActive ? <CheckCircle fontSize="small" /> : <Close fontSize="small" />}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Current Status</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {selectedMakeup.isActive ? 'Live on Platform' : 'Currently Hidden'}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Grid>

              {/* Right Column: Detailed Info */}
              <Grid item xs={12} md={7}>
                <Box sx={{ p: 4 }}>
                  <section style={{ marginBottom: '32px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Info sx={{ color: '#E15B65' }} /> Package Overview
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {selectedMakeup.description || 'No detailed description provided for this package.'}
                    </Typography>
                  </section>

                  <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

                  <section style={{ marginBottom: '32px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocalOffer sx={{ color: '#E15B65' }} /> Pricing Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: '16px', border: '1px solid #eee' }}>
                          <Typography variant="caption" color="text.secondary">Full Price</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50' }}>
                            ₹{selectedMakeup.packagePrice?.toLocaleString()}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: '16px', border: '1px solid #eee' }}>
                          <Typography variant="caption" color="text.secondary">Booking Fee</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#C4572A' }}>
                            ₹{selectedMakeup.advanceBookingAmount?.toLocaleString()}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </section>

                  <section>
                    <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Category sx={{ color: '#E15B65' }} /> Service Info
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedMakeup.module && (
                        <Chip
                          icon={<Spa fontSize="small" />}
                          label={`Module: ${selectedMakeup.module.title}`}
                          sx={{ borderRadius: '8px', fontWeight: 600, py: 2.5 }}
                        />
                      )}
                      <Chip
                        icon={<Schedule fontSize="small" />}
                        label={`Updated: ${new Date(selectedMakeup.updatedAt).toLocaleDateString()}`}
                        sx={{ borderRadius: '8px', fontWeight: 600, py: 2.5 }}
                      />
                    </Box>
                  </section>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #eee' }}>
          <Button
            onClick={() => setOpenView(false)}
            sx={{
              px: 4,
              borderRadius: '12px',
              color: 'text.secondary',
              fontWeight: 700
            }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Edit />}
            onClick={() => {
              if (!selectedMakeup?._id) return;
              setOpenView(false);
              navigate(`/florist/edit/${selectedMakeup._id}`);
            }}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              bgcolor: '#E15B65',
              fontWeight: 700,
              '&:hover': { bgcolor: '#c14a54' }
            }}
          >
            Edit Package
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Package?</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Delete sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              This action cannot be undone. This package will be permanently deleted from your account.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            variant="outlined"
            fullWidth
            sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} fullWidth sx={{ fontWeight: 600 }}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{
            minWidth: 300,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': { fontSize: 24 }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
