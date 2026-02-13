import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Grid,
  Container,
  Avatar,
  TextField,
  InputAdornment,
  alpha,
  Divider,
  Fade,
  Zoom,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronRight,
  AccessTime,
  Phone,
  Email,
  CalendarMonth,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  CheckCircle,
  Cancel,
  Pending,
  ErrorOutline,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';

const THEME_COLOR = '#E15B65';
const SECONDARY_COLOR = '#c14a54';

const PaymentFailedbookings = () => {
  const [search, setSearch] = useState('');
  const [failedPayments, setFailedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFailed = async () => {
    setLoading(true);
    try {
      // Assuming this endpoint returns all bookings for the admin/provider or context is handled by backend auth
      const res = await axios.get('https://api.bookmyevent.ae/api/bookings');
      const all = res.data.bookings || [];

      // Filter payment failed
      const failed = all.filter(
        (b) => (b.paymentStatus || '').toLowerCase() === 'failed'
      );

      setFailedPayments(failed);
      setError(null);
    } catch (err) {
      console.error('Error fetching failed payments', err);
      setError('Failed to load payment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFailed();
  }, []);

  const filteredPayments = useMemo(() => {
    if (!search.trim()) return failedPayments;
    const s = search.toLowerCase();
    return failedPayments.filter(b =>
      (b._id || '').toLowerCase().includes(s) ||
      (b.fullName || '').toLowerCase().includes(s) ||
      (b.emailAddress || '').toLowerCase().includes(s)
    );
  }, [search, failedPayments]);

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pt: 4, pb: 10 }}>
      {/* Dynamic Header Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: `linear-gradient(135deg, ${alpha('#F56565', 0.15)} 0%, ${alpha('#F56565', 0.05)} 100%)`,
        zIndex: 0,
        borderBottomLeftRadius: '40px',
        borderBottomRightRadius: '40px'
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Modern Search Bar */}
        <Paper elevation={0} sx={{ p: 1, borderRadius: '24px', border: '1px solid #E2E8F0', mb: 6, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <TextField
            fullWidth
            placeholder="Search by ID, Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#F56565', ml: 1 }} /></InputAdornment>,
              sx: { borderRadius: '20px', '& fieldset': { border: 'none' }, fontWeight: 600 }
            }}
          />
        </Paper>

        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#2D3748', letterSpacing: '-1.5px' }}>
                Payment Issues
              </Typography>
              <Chip
                label={`${filteredPayments.length} Failed`}
                color="error"
                size="small"
                sx={{ fontWeight: 800, borderRadius: '8px' }}
              />
            </Stack>
            <Typography variant="body1" sx={{ color: '#718096', fontWeight: 500 }}>
              Action required for these transactions.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchFailed}
            sx={{
              borderRadius: '16px',
              borderColor: '#F56565',
              color: '#F56565',
              fontWeight: 800,
              borderWidth: 2,
              px: 3,
              '&:hover': { borderWidth: 2, bgcolor: alpha('#F56565', 0.05) }
            }}
          >
            Refresh List
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '16px', fontWeight: 700 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 15 }}>
            <CircularProgress size={64} thickness={4} sx={{ color: '#F56565' }} />
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 700, color: '#718096' }}>Scanning Payments...</Typography>
          </Box>
        ) : filteredPayments.length === 0 ? (
          <Paper sx={{ textAlign: 'center', py: 12, borderRadius: '48px', border: '3px dashed #E2E8F0', bgcolor: 'transparent' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#CBD5E0' }}>No Payment Issues Found</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredPayments.map((b, idx) => (
              <Grid item xs={12} key={b._id}>
                <Zoom in={true} style={{ transitionDelay: `${idx * 50}ms` }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '24px',
                      border: '1px solid #E2E8F0',
                      bgcolor: 'white',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                        borderColor: alpha('#F56565', 0.3)
                      }
                    }}
                  >
                    <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, bgcolor: '#F56565' }} />
                    <Grid container spacing={3} alignItems="center">
                      {/* Left: User Info */}
                      <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha('#F56565', 0.1),
                            color: '#F56565',
                            fontWeight: 900,
                            fontSize: '1.2rem',
                            border: `2px solid ${alpha('#F56565', 0.2)}`
                          }}>
                            <WarningIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D3748', lineHeight: 1.2 }}>
                              {b.fullName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#A0AEC0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <Email style={{ fontSize: 14 }} /> {b.emailAddress}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Middle: Details */}
                      <Grid item xs={12} md={5}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#FFF5F5' }}>
                              <Typography variant="caption" sx={{ color: '#F56565', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>Booking Date</Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#C53030', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarMonth style={{ fontSize: 16 }} />
                                {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#FFF5F5' }}>
                              <Typography variant="caption" sx={{ color: '#F56565', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>Failed Amount</Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#C53030' }}>
                                ₹{b.finalPrice?.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Right: Status & Actions */}
                      <Grid item xs={12} md={3}>
                        <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="center" spacing={2}>
                          <Chip
                            label="PAYMENT FAILED"
                            size="small"
                            sx={{
                              bgcolor: '#FFF5F5',
                              color: '#C53030',
                              fontWeight: 900,
                              borderRadius: '8px',
                              letterSpacing: 0.5
                            }}
                          />

                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View Details">
                              <IconButton size="small" sx={{ bgcolor: '#EDF2F7', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                <VisibilityIcon fontSize="small" sx={{ color: '#4A5568' }} />
                              </IconButton>
                            </Tooltip>
                            {/* Additional actions can be added here */}
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PaymentFailedbookings;
