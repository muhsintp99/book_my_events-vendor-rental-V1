import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import axios from 'axios';

/* ---------------------------------------
   Helper: Get logged-in vendor ID
---------------------------------------- */
const getProviderId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?._id || null;
  } catch {
    return null;
  }
};

const MakeupConfirmed = () => {
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const providerId = getProviderId();

  /* ---------------------------------------
     Fetch CONFIRMED MAKEUP BOOKINGS ONLY
  ---------------------------------------- */
  useEffect(() => {
    if (!providerId) {
      setError('No provider ID found. Please log in.');
      setLoading(false);
      return;
    }

    const fetchConfirmed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://api.bookmyevent.ae/api/bookings/provider/${providerId}`);

        const all = res.data?.data || [];

        console.log('=== MAKEUP CONFIRMED BOOKINGS DEBUG ===');
        console.log('Total bookings fetched:', all.length);
        console.log('Provider ID:', providerId);

        // Log sample booking structure
        if (all.length > 0) {
          console.log('Sample booking:', all[0]);
        }

        // Count by status and module
        const statusCounts = {};
        const moduleCounts = {};
        all.forEach((b) => {
          const status = String(b.status || 'undefined').toLowerCase();
          const module = String(b.moduleType || 'undefined').toLowerCase();
          statusCounts[status] = (statusCounts[status] || 0) + 1;
          moduleCounts[module] = (moduleCounts[module] || 0) + 1;
        });

        console.log('Bookings by status:', statusCounts);
        console.log('Bookings by module:', moduleCounts);

        // ✅ STRICT FILTER: Only Accepted + Makeup bookings
        const confirmed = all.filter((b) => {
          const status = String(b.status || '')
            .trim()
            .toLowerCase();
          const moduleType = String(b.moduleType || '')
            .trim()
            .toLowerCase();

          // Check for various status variations
          const isAccepted = status === 'accepted' || status === 'confirmed' || status === 'approve' || status === 'approved';

          // Check for makeup module variations
          const isMakeup = moduleType === 'makeup' || moduleType === 'makeup artist' || moduleType === 'makeupartist';

          console.log(`Booking ${b._id}: status=${status}, module=${moduleType}, isAccepted=${isAccepted}, isMakeup=${isMakeup}`);

          return isAccepted && isMakeup;
        });

        console.log('✅ Filtered confirmed makeup bookings:', confirmed.length);
        console.log('Confirmed bookings:', confirmed);

        // Set debug info
        setDebugInfo({
          total: all.length,
          accepted: all.filter((b) => {
            const s = String(b.status || '').toLowerCase();
            return s === 'accepted' || s === 'confirmed' || s === 'approved';
          }).length,
          makeup: all.filter((b) => {
            const mt = String(b.moduleType || '').toLowerCase();
            return mt === 'makeup' || mt === 'makeup artist' || mt === 'makeupartist';
          }).length,
          confirmedMakeup: confirmed.length,
          statusCounts,
          moduleCounts
        });

        setConfirmedBookings(confirmed);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading confirmed bookings:', err);
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmed();
  }, [providerId]);

  /* ---------------------------------------
     Search Filter
  ---------------------------------------- */
  const filteredBookings = useMemo(() => {
    if (!search.trim()) return confirmedBookings;

    const searchLower = search.toLowerCase();
    return confirmedBookings.filter(
      (b) =>
        b._id?.toLowerCase().includes(searchLower) ||
        b.fullName?.toLowerCase().includes(searchLower) ||
        b.emailAddress?.toLowerCase().includes(searchLower) ||
        b.contactNumber?.includes(search)
    );
  }, [search, confirmedBookings]);

  /* ---------------------------------------
     Delete Booking
  ---------------------------------------- */
  const handleDelete = async (id, e) => {
    e.stopPropagation();

    const confirmed = window.confirm('Are you sure you want to delete this booking? This action cannot be undone.');

    if (!confirmed) return;

    try {
      await axios.delete(`https://api.bookmyevent.ae/api/bookings/${id}`);

      // Remove from list immediately
      setConfirmedBookings((prev) => prev.filter((b) => b._id !== id));

      alert('✅ Booking Deleted Successfully!');
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  /* ---------------------------------------
     View Details
  ---------------------------------------- */
  const handleView = (booking, e) => {
    e.stopPropagation();
    console.log('View booking:', booking);
    // Add your view logic here - maybe navigate to detail page or open modal
  };

  /* ---------------------------------------
     Download Invoice
  ---------------------------------------- */
  const handleDownload = (booking, e) => {
    e.stopPropagation();
    console.log('Download invoice for:', booking._id);
    // Add your download logic here
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Confirmed Makeup Bookings
      </Typography>

      {/* Debug Info Alert */}
      {debugInfo && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Debug Info:</strong> Total Bookings: {debugInfo.total} | Accepted/Confirmed: {debugInfo.accepted} | Makeup Module:{' '}
            {debugInfo.makeup} |<strong> Confirmed Makeup: {debugInfo.confirmedMakeup}</strong>
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Status breakdown: {JSON.stringify(debugInfo.statusCounts)}
          </Typography>
          <Typography variant="caption" display="block">
            Module breakdown: {JSON.stringify(debugInfo.moduleCounts)}
          </Typography>
        </Alert>
      )}

      <Paper sx={{ mt: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" p={2}>
          <TextField
            label="Search by Booking ID, Name, Email, or Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 350 }}
            placeholder="Type to search..."
          />

          <Button variant="contained" color="primary">
            Export Data
          </Button>
        </Stack>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>S#</strong>
                </TableCell>
                <TableCell>
                  <strong>Booking ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Module</strong>
                </TableCell>
                <TableCell>
                  <strong>Customer</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Guests</strong>
                </TableCell>
                <TableCell>
                  <strong>Booking Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Payment Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <TableRow key={booking._id} hover sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        #{booking._id?.slice(-8).toUpperCase() || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={booking.moduleType || 'Makeup'}
                        size="small"
                        sx={{
                          bgcolor: '#fef3c7',
                          color: '#92400e',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{booking.fullName || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.contactNumber || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {booking.emailAddress || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{booking.numberOfGuests || booking.guests || '-'}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.timeSlot || ''}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="success.main">
                        ₹{booking.finalPrice?.toLocaleString() || booking.totalAmount?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={booking.status || 'Accepted'}
                        size="small"
                        sx={{
                          bgcolor: '#dcfce7',
                          color: '#16a34a',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" size="small" color="primary" onClick={(e) => handleView(booking, e)}>
                          View
                        </Button>
                        <Button variant="outlined" size="small" color="info" onClick={(e) => handleDownload(booking, e)}>
                          Download
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={(e) => handleDelete(booking._id, e)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Box py={4}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        {search ? 'No matching bookings found' : 'No Confirmed Makeup Bookings'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {search ? 'Try adjusting your search criteria' : 'Confirmed makeup bookings will appear here'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Footer */}
        {filteredBookings.length > 0 && (
          <Box p={2} bgcolor="#f9fafb" borderTop="1px solid #e5e7eb" display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={4}>
              <Typography variant="body2" fontWeight={600}>
                Total Bookings: <strong>{filteredBookings.length}</strong>
              </Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">
                Total Revenue:{' '}
                <strong>₹{filteredBookings.reduce((sum, b) => sum + (b.finalPrice || b.totalAmount || 0), 0).toLocaleString()}</strong>
              </Typography>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Showing {filteredBookings.length} of {confirmedBookings.length} bookings
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MakeupConfirmed;
