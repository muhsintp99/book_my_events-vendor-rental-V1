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

const CateringConfirmed = () => {
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const providerId = getProviderId();

  /* ---------------------------------------
     Fetch CONFIRMED CATERING BOOKINGS ONLY
     (MODULE NAME HARD-CODED)
  ---------------------------------------- */
  useEffect(() => {
    if (!providerId) {
      setError('No provider ID found. Please login again.');
      setLoading(false);
      return;
    }

    const fetchConfirmed = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
        );

        const allBookings = res.data?.data || [];

        // ✅ STRICT FILTER: CONFIRMED + CATERING ONLY
        const confirmed = allBookings.filter((b) => {
          const status = String(b.status || '').toLowerCase().trim();

          const isConfirmed =
            status === 'confirmed' ||
            status === 'accepted' ||
            status === 'approved';

          // 🔒 HARD-CODED MODULE CHECK
          const isCatering = String(b.moduleType || '')
            .toLowerCase()
            .trim() === 'catering';

          return isConfirmed && isCatering;
        });

        setConfirmedBookings(confirmed);
        setError(null);
      } catch (err) {
        console.error('Error loading catering confirmed bookings:', err);
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmed();
  }, [providerId]);

  /* ---------------------------------------
     Search Filter (UNCHANGED STYLE)
  ---------------------------------------- */
  const filteredBookings = useMemo(() => {
    if (!search.trim()) return confirmedBookings;

    const s = search.toLowerCase();
    return confirmedBookings.filter(
      (b) =>
        b._id?.toLowerCase().includes(s) ||
        b.fullName?.toLowerCase().includes(s) ||
        b.emailAddress?.toLowerCase().includes(s) ||
        b.contactNumber?.includes(search)
    );
  }, [search, confirmedBookings]);

  /* ---------------------------------------
     Delete Booking (UNCHANGED)
  ---------------------------------------- */
  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`https://api.bookmyevent.ae/api/bookings/${id}`);
      setConfirmedBookings((prev) => prev.filter((b) => b._id !== id));
      alert('Booking deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
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
        Confirmed Catering Bookings
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
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
                <TableCell><strong>S#</strong></TableCell>
                <TableCell><strong>Booking ID</strong></TableCell>
                <TableCell><strong>Module</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Guests</strong></TableCell>
                <TableCell><strong>Booking Date</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Payment Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <TableRow key={booking._id} hover sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        #{booking._id.slice(-8).toUpperCase()}
                      </Typography>
                    </TableCell>

                    {/* 🔒 HARD-CODED MODULE NAME */}
                    <TableCell>
                      <Chip
                        label="Catering"
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
                      <Typography variant="body2">
                        {booking.numberOfGuests || booking.guests || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString('en-GB')
                          : '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.timeSlot || ''}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="success.main">
                        ₹{(booking.finalPrice || booking.totalAmount || 0).toLocaleString()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="Confirmed"
                        size="small"
                        sx={{
                          bgcolor: '#dcfce7',
                          color: '#16a34a',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={(e) => handleDelete(booking._id, e)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="h6" color="text.secondary">
                      No Confirmed Catering Bookings
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredBookings.length > 0 && (
          <Box
            p={2}
            bgcolor="#f9fafb"
            borderTop="1px solid #e5e7eb"
            display="flex"
            justifyContent="space-between"
          >
            <Typography fontWeight={600}>
              Total Bookings: {filteredBookings.length}
            </Typography>

            <Typography fontWeight={600} color="success.main">
              Total Revenue: ₹
              {filteredBookings
                .reduce((sum, b) => sum + (b.finalPrice || b.totalAmount || 0), 0)
                .toLocaleString()}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CateringConfirmed;
