import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Chip,
  Container,
  Card,
  CardContent,
  Avatar,
  Fade,
  Grow
} from '@mui/material';
import {
  Map as MapIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Public as GlobalIcon,
  Close as CloseIcon,
  Stars as StarsIcon,
  KeyboardArrowRight as ArrowIcon
} from '@mui/icons-material';
import axios from 'axios';

const PINK = '#E91E63';
const GRADIENT = 'linear-gradient(135deg, #E91E63 0%, #FF4081 100%)';
const API_BASE = 'https://api.bookmyevent.ae';
const MAKEUP_MODULE_ID = '68e5fbc33a5a05dde7500c89';

const Multizones = () => {
  const [zones, setZones] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Load Vendor Info
  const getVendorId = () => {
    try {
      const vendorData =
        localStorage.getItem('vendor') ||
        localStorage.getItem('user') ||
        localStorage.getItem('vendorData');

      if (vendorData) {
        const parsed = JSON.parse(vendorData);
        return parsed._id || parsed.id;
      }
    } catch (err) {
      console.error('Error loading vendor ID:', err);
    }
    return null;
  };

  const vendorId = getVendorId();

  const fetchData = async () => {
    if (!vendorId) {
      setError('Vendor not authenticated. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 1. Fetch all available zones
      const zonesRes = await axios.get(`${API_BASE}/api/zones`);
      const allZones = (zonesRes.data.data || []).filter(z => z.isActive !== false);
      setZones(allZones);

      // 2. Fetch current vendor profile for this module
      const profileRes = await axios.get(`${API_BASE}/api/vendorprofiles/find/${vendorId}?moduleId=${MAKEUP_MODULE_ID}`);

      if (profileRes.data.success && profileRes.data.data) {
        const profile = profileRes.data.data;
        setVendorProfile(profile);

        // Extract selected zone IDs
        if (profile.zones && Array.isArray(profile.zones)) {
          setSelectedZones(profile.zones.map(z => typeof z === 'object' ? z._id : z));
        }
      } else {
        setVendorProfile({ providerId: vendorId, module: MAKEUP_MODULE_ID });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load zone data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  const handleToggleZone = (zoneId) => {
    setSelectedZones(prev =>
      prev.includes(zoneId)
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleSave = async () => {
    if (!vendorProfile || (!vendorProfile._id && !vendorId)) {
      setError('Profile not found. Cannot save.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let res;
      if (vendorProfile._id) {
        res = await axios.put(`${API_BASE}/api/vendorprofiles/${vendorProfile._id}`, {
          zones: selectedZones
        });
      } else {
        res = await axios.post(`${API_BASE}/api/vendorprofiles`, {
          providerId: vendorId,
          module: MAKEUP_MODULE_ID,
          zones: selectedZones
        });
      }

      if (res.data.success) {
        setSuccess(true);
        setVendorProfile(res.data.data);
        setIsEdit(false);
      } else {
        setError(res.data.message || 'Failed to update zones');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('An error occurred while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedZones(zones.map(z => z._id));
  };

  const handleClearAll = () => {
    setSelectedZones([]);
  };

  const selectedZoneObjects = selectedZones
    .map(id => {
      let zone = zones.find(z => (z._id === id || z._id?.toString() === id?.toString()));
      if (!zone && vendorProfile?.zones) {
        zone = vendorProfile.zones.find(z =>
          typeof z === 'object' && (z._id === id || z._id?.toString() === id?.toString())
        );
      }
      return zone;
    })
    .filter(Boolean);

  const activeZone = selectedZoneObjects.length > 0 ? selectedZoneObjects[0] : null;
  const multiZones = selectedZoneObjects.length > 1 ? selectedZoneObjects.slice(1) : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} sx={{ color: PINK, thickness: 5 }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: `${PINK}15`, color: PINK, width: 56, height: 56 }}>
              <MapIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h3" fontWeight="900" sx={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              Service Coverage
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, opacity: 0.8, ml: 9 }}>
            {isEdit 
              ? 'Refine your business reach by selecting your operative zones.'
              : 'Maximize your visibility across premium makeup service areas.'
            }
          </Typography>
        </Box>
        
        <Box>
          {/* View-only mode as requested */}
        </Box>
      </Box>

      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3, border: '1px solid #ffcdd2' }} onClose={() => setError('')}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Premium Banner */}
      <Box sx={{ 
        mb: 6, p: 3, borderRadius: 4, 
        background: 'rgba(233, 30, 99, 0.03)',
        border: `1px dashed ${PINK}30`,
        display: 'flex', alignItems: 'center', gap: 2
      }}>
        <StarsIcon sx={{ color: PINK }} />
        <Typography variant="body1" fontWeight="600" color={PINK}>
          PRO FEATURE:
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 1 }}>
            Multi-zone visibility is an exclusive benefit for our <strong>Premium Plan</strong> partners.
          </Box>
        </Typography>
      </Box>

      {isEdit ? (
        <Grow in={isEdit}>
          <Box>
            <Paper sx={{ 
              p: 4, borderRadius: 5, 
              boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="800">Available Zones</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" onClick={handleSelectAll} sx={{ color: PINK, fontWeight: 'bold' }}>All</Button>
                  <Button size="small" onClick={handleClearAll} sx={{ color: 'text.secondary' }}>None</Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 4, opacity: 0.5 }} />
              <Grid container spacing={2}>
                {zones.map((zone) => (
                  <Grid item xs={12} sm={6} md={3} key={zone._id}>
                    <Box sx={{ 
                      p: 1.5, borderRadius: 3, 
                      transition: 'all 0.2s',
                      border: selectedZones.includes(zone._id) ? `2.5px solid ${PINK}` : '2.5px solid transparent',
                      bgcolor: selectedZones.includes(zone._id) ? `${PINK}05` : '#fcfcfc',
                      '&:hover': { bgcolor: selectedZones.includes(zone._id) ? `${PINK}08` : '#f5f5f5' }
                    }}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={selectedZones.includes(zone._id)} 
                            onChange={() => handleToggleZone(zone._id)} 
                            sx={{ color: '#ddd', '&.Mui-checked': { color: PINK } }} 
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight="800"> {zone.name} </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}> {zone.city || 'Kerala'} </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </Grow>
      ) : (
        <Fade in={!isEdit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* Primary Zone Section */}
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 900, color: 'text.secondary', mb: 2, display: 'block' }}>
                Primary Reach
              </Typography>
              <Card sx={{ 
                borderRadius: 5, 
                background: GRADIENT,
                color: 'white',
                boxShadow: `0 20px 50px ${PINK}30`,
                overflow: 'visible',
                position: 'relative'
              }}>
                <CardContent sx={{ p: 5, position: 'relative', z_index: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ 
                      p: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <LocationIcon sx={{ fontSize: 48 }} />
                    </Box>
                    <Box>
                      <Typography variant="h3" fontWeight="900" sx={{ mb: 0.5 }}>
                        {activeZone ? activeZone.name : 'Not Set'}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 300 }}>
                        {activeZone ? (activeZone.city || 'State of Kerala') : 'Configure your primary location'}
                      </Typography>
                    </Box>
                    <ArrowIcon sx={{ ml: 'auto', fontSize: 40, opacity: 0.5 }} />
                  </Box>
                </CardContent>
                <Box sx={{ 
                  position: 'absolute', top: -20, right: 100, width: 100, height: 100, 
                  borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' 
                }} />
              </Card>
            </Box>

            {/* Extended Zones Section */}
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 900, color: 'text.secondary', mb: 2, display: 'block' }}>
                Extended Visibility
              </Typography>
              <Paper sx={{ 
                p: 5, borderRadius: 5, 
                border: '1px solid #f0f0f0', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                background: '#fff'
              }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {multiZones.length > 0 ? (
                    multiZones.map((zone) => (
                      <Chip 
                        key={zone._id} 
                        label={zone.name} 
                        icon={<GlobalIcon sx={{ fontSize: '1rem !important' }} />}
                        sx={{ 
                          py: 3, px: 2, borderRadius: 3, 
                          bgcolor: '#f5f5f7', 
                          border: '1px solid #eee',
                          fontWeight: '800', fontSize: '0.9rem',
                          color: '#333',
                          '& .MuiChip-icon': { color: PINK }
                        }} 
                      />
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', opacity: 0.6 }}>
                        No additional multi-zones configured for extended reach.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Success Notification */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%', borderRadius: 4, px: 4,
            bgcolor: '#1a1a1a', color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
          icon={<CheckCircleIcon fontSize="inherit" sx={{ color: PINK }} />}
        >
          Your coverage zones have been successfully updated.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Multizones;
