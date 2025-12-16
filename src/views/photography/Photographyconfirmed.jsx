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
   CONSTANTS — PHOTOGRAPHY MODULE
---------------------------------------- */
const PHOTOGRAPHY_MODULE_DB_ID = '68e5fb0fa4b2718b6cbf64e9';
const PHOTOGRAPHY_MODULE_ID = 'MOD-2ddeafcd-7660-4177-915d-23b1cfe72981';

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

const PhotographyConfirmed = () => {
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const providerId = getProviderId();

  /* ---------------------------------------
     Fetch CONFIRMED PHOTOGRAPHY BOOKINGS
     (USING MODULE OBJECT)
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

        const res = await axios.get(
          `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
        );

        const all = res.data?.data || [];

        // DEBUG COUNTS
        const statusCounts = {};
        const moduleCounts = {};

        all.forEach((b) => {
          const status = String(b.status || 'undefined').toLowerCase();
          const moduleTitle = String(b.module?.title || 'undefined').toLowerCase();
          statusCounts[status] = (statusCounts[status] || 0) + 1;
          moduleCounts[moduleTitle] = (moduleCounts[moduleTitle] || 0) + 1;
        });

        // ✅ STRICT FILTER: CONFIRMED + PHOTOGRAPHY MODULE
        const confirmed = all.filter((b) => {
          const status = String(b.status || '').toLowerCase().trim();

          const isConfirmed =
            status === 'accepted' ||
            status === 'confirmed' ||
            status === 'approved';

          const moduleDbId = b.module?._id;
          const moduleCode = b.module?.moduleId;

          const isPhotography =
            moduleDbId === PHOTOGRAPHY_MODULE_DB_ID ||
            moduleCode === PHOTOGRAPHY_MODULE_ID;

          return isConfirmed && isPhotography;
        });

        setDebugInfo({
          total: all.length,
          confirmedPhotography: confirmed.length,
          statusCounts,
          moduleCounts
        });

        setConfirmedBookings(confirmed);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading photography confirmed bookings:', err);
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
     Delete Booking
  ---------------------------------------- */
  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`https://api.bookmyevent.ae/api/bookings/${id}`);
      setConfirmedBookings((prev) => prev.filter((b) => b._id !== id));
      alert('✅ Booking Deleted Successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking');
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
        Confirmed Photography Bookings
      </Typography>

      {debugInfo && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Total: {debugInfo.total} | Photography Confirmed:{' '}
            <strong>{debugInfo.confirmedPhotography}</strong>
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
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b, i) => (
                  <TableRow key={b._id} hover>
                    <TableCell>{i + 1}</TableCell>

                    <TableCell>
                      <Typography fontWeight={600} color="primary">
                        #{b._id.slice(-8).toUpperCase()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="Photography"
                        size="small"
                        sx={{
                          bgcolor: '#e0f2fe',
                          color: '#0369a1',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>

                    <TableCell>{b.fullName || '-'}</TableCell>
                    <TableCell>{b.emailAddress || '-'}</TableCell>
                    <TableCell>{b.numberOfGuests || '-'}</TableCell>

                    <TableCell>
                      {b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString('en-GB')
                        : '-'}
                    </TableCell>

                    <TableCell>
                      ₹{(b.finalPrice || b.totalAmount || 0).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Chip label="Confirmed" size="small" color="success" />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={(e) => handleDelete(b._id, e)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No Confirmed Photography Bookings
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

export default PhotographyConfirmed;
