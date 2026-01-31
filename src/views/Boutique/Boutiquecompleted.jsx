import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Stack,
  CircularProgress
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
  } catch (err) {
    console.error('Error parsing user:', err);
    return null;
  }
};

const renderTimeSlot = (timeSlot) => {
  if (!timeSlot) return 'N/A';
  if (typeof timeSlot === 'string') return timeSlot;
  if (Array.isArray(timeSlot)) return timeSlot.map(ts => (typeof ts === 'object' ? ts.label || ts.time : ts)).join(', ');
  if (typeof timeSlot === 'object') return timeSlot.label || timeSlot.time || 'N/A';
  return 'N/A';
};

const BoutiqueCompleted = () => {
  const [search, setSearch] = useState('');
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const providerId = getProviderId();

  const fetchCompletedBookings = useCallback(async () => {
    if (!providerId) return;
    try {
      setLoading(true);
      const res = await axios.get(`https://api.bookmyevent.ae/api/bookings/provider/${providerId}`);
      const all = res.data?.data || [];

      // Filter by: Status=Paid/Completed AND Module=Boutique
      const filtered = all.filter((b) => {
        const status = String(b.paymentStatus || '').toLowerCase();
        const moduleType = String(b.moduleType || '').toLowerCase();
        const isCompleted = status === 'paid' || status === 'completed';
        const isBoutique = moduleType === 'boutique' || moduleType === 'boutique artist';
        return isCompleted && isBoutique;
      });

      setCompletedBookings(filtered);
    } catch (err) {
      console.error('Error fetching completed bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchCompletedBookings();
  }, [fetchCompletedBookings]);

  const filteredBookings = completedBookings.filter(
    (b) =>
      b._id.toLowerCase().includes(search.toLowerCase()) ||
      (b.fullName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Completed Boutique Bookings
      </Typography>

      <Paper sx={{ mt: 2, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          p={2}
        >
          <TextField
            label="Search by ID, customer name"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: { sm: 350 } }}
          />

          <Button
            variant="contained"
            sx={{ bgcolor: '#E15B65', color: 'white', borderRadius: '30px', px: 3 }}
            onClick={fetchCompletedBookings}
          >
            Refresh
          </Button>
        </Stack>

        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>S#</strong></TableCell>
                <TableCell><strong>Booking ID</strong></TableCell>
                <TableCell><strong>Booking Date</strong></TableCell>
                <TableCell><strong>Schedule At</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b, index) => (
                  <TableRow key={b._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>#{b._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>{new Date(b.bookingDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {renderTimeSlot(b.timeSlot)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{b.fullName}</Typography>
                      <Typography variant="caption" display="block">{b.emailAddress}</Typography>
                    </TableCell>
                    <TableCell>₹{b.finalPrice || 0}</TableCell>
                    <TableCell>{b.paymentStatus}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No completed bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BoutiqueCompleted;

