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
  Badge
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
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'https://api.bookmyevent.ae/api/makeup-packages';

export default function MakeupList() {
  const navigate = useNavigate();
  const [makeupList, setMakeupList] = useState([]);
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
      const res = await fetch(`${API_BASE_URL}/provider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load packages');
      const result = await res.json();
      if (result.success) setMakeupList(result.data || []);
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
        setMakeupList((prev) => prev.map((m) => (m._id === id ? { ...m, isActive: !current } : m)));
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
        setMakeupList((prev) => prev.filter((m) => m._id !== makeupToDelete));
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
    return makeupList.filter((m) => {
      const matchesSearch = !searchQuery || 
        m.packageTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.makeupType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [makeupList, searchQuery]);

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
      <Box sx={{ 
        background: 'linear-gradient(135deg, #E15B65 0%, #c14a54 100%)',
        color: 'white',
        py: 4,
        px: 3,
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 4px 20px rgba(225, 91, 101, 0.3)'
      }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                My Makeup Packages
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {makeupList.length} total packages • {makeupList.filter(m => m.isActive).length} active
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => navigate("/makeupartist/addpackage")}
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
        <Card sx={{ 
          mb: 3, 
          borderRadius: 3, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          overflow: 'visible'
        }}>
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
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            textAlign: 'center',
            py: 8
          }}>
            <ImageIcon sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {makeupList.length === 0 ? 'No packages yet' : 'No packages match your search'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {makeupList.length === 0 ? 'Create your first makeup package to get started' : 'Try adjusting your search terms'}
            </Typography>
            {makeupList.length === 0 && (
              <Button 
                variant="contained" 
                size="large"
                startIcon={<Add />}
                sx={{ 
                  bgcolor: '#E15B65',
                  '&:hover': { bgcolor: '#c14a54' }
                }} 
                onClick={() => navigate("/makeupartist/addpackage")}
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
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(225, 91, 101, 0.2)'
                },
                minWidth: 280
              }}>
                {/* Image Section */}
                <Box sx={{ position: 'relative', paddingTop: '75%', bgcolor: '#f5f5f5' }}>
                  {makeup.gallery?.[0] ? (
                    <CardMedia
                      component="img"
                      image={getImageUrl(makeup.gallery[0])}
                      alt={makeup.packageTitle}
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
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f0f0f0'
                    }}>
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
                    {makeup.packageTitle}
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
                      {formatINR(makeup.finalPrice)}
                    </Typography>
                    {makeup.basePrice > makeup.finalPrice && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {formatINR(makeup.basePrice)}
                        </Typography>
                        <Chip 
                          label={`${Math.round(((makeup.basePrice - makeup.finalPrice) / makeup.basePrice) * 100)}% OFF`}
                          size="small"
                          sx={{ 
                            bgcolor: '#4caf50',
                            color: 'white',
                            fontWeight: 600,
                            height: 20,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Stack>
                    )}
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
                      onClick={() => navigate(`/makeupartist/edit/${makeup._id}`)}
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
                  <Box sx={{ 
                    mt: 2, 
                    pt: 2, 
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="body2" fontWeight={500}>
                      Package Status
                    </Typography>
                    <Switch 
                      checked={makeup.isActive} 
                      onChange={() => handleToggleStatus(makeup._id, makeup.isActive)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* View Details Modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ bgcolor: '#E15B65', color: 'white', pr: 6 }}>
          <Typography variant="h6">{selectedMakeup?.packageTitle}</Typography>
          <IconButton sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }} onClick={() => setOpenView(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedMakeup && (
            <Box>
              {/* Gallery Section */}
              <Box sx={{ bgcolor: '#1a1a1a', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {selectedMakeup.gallery?.[selectedImageIndex] ? (
                    <Card elevation={3} sx={{ maxWidth: 500 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={getImageUrl(selectedMakeup.gallery[selectedImageIndex])}
                        alt={selectedMakeup.packageTitle}
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
                {selectedMakeup.gallery?.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {selectedMakeup.gallery.map((img, i) => (
                      <Avatar
                        key={i}
                        variant="rounded"
                        src={getImageUrl(img)}
                        onClick={() => setSelectedImageIndex(i)}
                        sx={{
                          width: 60,
                          height: 60,
                          cursor: 'pointer',
                          border: selectedImageIndex === i ? '3px solid #E15B65' : '3px solid transparent',
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E15B65' }}>
                      Basic Information
                    </Typography>
                    <DetailItem
                      icon={<Category />}
                      label="Categories"
                      value={selectedMakeup.categories?.map((c) => c.title).join(', ') || 'None'}
                    />
                    <DetailItem icon={<Palette />} label="Makeup Type" value={selectedMakeup.makeupType} />
                    <DetailItem icon={<Schedule />} label="Duration" value={selectedMakeup.duration} />
                    <DetailItem
                      icon={<CheckCircle />}
                      label="Status"
                      value={selectedMakeup.isActive ? 'Active' : 'Inactive'}
                      chip
                      success={selectedMakeup.isActive}
                      error={!selectedMakeup.isActive}
                    />
                    <DetailItem icon={<Info />} label="Description" value={selectedMakeup.description} />
                  </Grid>

                  {/* Right Column - Pricing & Policies */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E15B65' }}>
                      Pricing & Policies
                    </Typography>
                    <DetailItem icon={<AttachMoney />} label="Base Price" value={formatINR(selectedMakeup.basePrice)} />
                    <DetailItem
                      icon={<LocalOffer />}
                      label="Offer Discount"
                      value={selectedMakeup.offerPrice ? formatINR(selectedMakeup.offerPrice) : 'No offer'}
                    />
                    <DetailItem
                      icon={<AttachMoney />}
                      label="Final Price"
                      value={
                        <Typography sx={{ color: '#E15B65', fontWeight: 'bold' }}>
                          {formatINR(selectedMakeup.finalPrice)}
                        </Typography>
                      }
                    />
                    <DetailItem
                      icon={<Payment />}
                      label="Advance Booking Amount"
                      value={selectedMakeup.advanceBookingAmount ? `AED ${selectedMakeup.advanceBookingAmount}` : 'Not specified'}
                    />
                    <DetailItem icon={<Policy />} label="Cancellation Policy" value={selectedMakeup.cancellationPolicy} />
                  </Grid>

                  {/* Full Width - Additional Features */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E15B65' }}>
                      Additional Features
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={<Spa />}
                        label={selectedMakeup.trialMakeupIncluded ? 'Trial Makeup Included' : 'No Trial Makeup'}
                        color={selectedMakeup.trialMakeupIncluded ? 'success' : 'default'}
                        variant={selectedMakeup.trialMakeupIncluded ? 'filled' : 'outlined'}
                      />
                      <Chip
                        icon={<DirectionsCar />}
                        label={selectedMakeup.travelToVenue ? 'Travel to Venue Included' : 'No Travel to Venue'}
                        color={selectedMakeup.travelToVenue ? 'success' : 'default'}
                        variant={selectedMakeup.travelToVenue ? 'filled' : 'outlined'}
                      />
                      <Chip
                        icon={<EventAvailable />}
                        label={selectedMakeup.isTopPick ? 'Top Pick' : 'Not a Top Pick'}
                        color={selectedMakeup.isTopPick ? 'warning' : 'default'}
                        variant={selectedMakeup.isTopPick ? 'filled' : 'outlined'}
                      />
                    </Stack>
                  </Grid>

                  {/* Included Services */}
                  {selectedMakeup.includedServices?.length > 0 && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#E15B65' }}>
                        Included Services
                      </Typography>
                      {selectedMakeup.includedServices.map((service, idx) => (
                        <Accordion
                          key={idx}
                          defaultExpanded={idx === 0}
                          sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#f8f9fa' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ListIcon sx={{ color: '#E15B65' }} />
                              <Typography fontWeight={500}>{service.title}</Typography>
                              <Chip label={`${service.items?.length || 0} items`} size="small" sx={{ ml: 1 }} />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List dense>
                              {service.items?.map((item, i) => (
                                <ListItem key={i}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />
                                  </ListItemIcon>
                                  <ListItemText primary={item} />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Grid>
                  )}

                  {/* Metadata */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={4} sx={{ color: 'text.secondary' }}>
                      <Typography variant="caption">Created: {new Date(selectedMakeup.createdAt).toLocaleString()}</Typography>
                      <Typography variant="caption">Updated: {new Date(selectedMakeup.updatedAt).toLocaleString()}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenView(false);
              navigate(`/makeupartist/edit/${selectedMakeup._id}`);
            }}
            variant="outlined"
            sx={{ borderColor: '#E15B65', color: '#E15B65' }}
          >
            Edit Package
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#E15B65', '&:hover': { bgcolor: '#c14a54' } }} onClick={() => setOpenView(false)}>
            Close
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
          <Button 
            color="error" 
            variant="contained" 
            onClick={handleDelete}
            fullWidth
            sx={{ fontWeight: 600 }}
          >
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