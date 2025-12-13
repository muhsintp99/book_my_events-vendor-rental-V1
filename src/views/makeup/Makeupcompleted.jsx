import React, { useState, useEffect } from 'react';
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
  Stack
} from '@mui/material';

const Completed = () => {
  const [search, setSearch] = useState('');
  const [completedTrips, setCompletedTrips] = useState([]);

  const providerId = localStorage.getItem('providerId'); // 👉 where you store provider ID
  const API_URL = `hhttps://api.bookmyevent.ae/api/bookings/provider/${providerId}/payment-status/Paid`;

  // ===============
  // 🔥 FETCH COMPLETED BOOKINGS
  // ===========================
  const fetchCompletedBookings = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json.success) {
        const formatted = json.data.map((b, index) => ({
          id: b._id,
          tripId: b._id.slice(-6),
          bookingDate: new Date(b.bookingDate).toLocaleDateString(),
          scheduleAt: Array.isArray(b.timeSlot) ? b.timeSlot[0] : b.timeSlot,
          customerInfo: b.fullName + ' ' + b.emailAddress,
          driverInfo: b.driverInfo || 'Unassigned',
          vehicleInfo: b.vehicleInfo || 'Unassigned',
          tripType: b.moduleType,
          tripAmount: b.finalPrice?.toFixed(2),
          tripStatus: b.paymentStatus
        }));

        setCompletedTrips(formatted);
      }
    } catch (err) {
      console.log('Error fetching completed bookings:', err);
    }
  };

  useEffect(() => {
    fetchCompletedBookings();
  }, []);

  // SEARCH FILTER
  const filteredTrips = completedTrips.filter(
    (trip) => trip.tripId.toString().includes(search) || trip.customerInfo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Completed Bookings
      </Typography>

      <Paper sx={{ mt: 2, width: '100%' }}>
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
            sx={{ maxWidth: { sm: 300 } }}
          />

          <Button variant="contained" sx={{ bgcolor: '#E15B65', color: 'white' }} onClick={fetchCompletedBookings}>
            Refresh
          </Button>
        </Stack>

        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>S#</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Schedule At</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTrips.map((trip, index) => (
                <TableRow key={trip.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{trip.tripId}</TableCell>
                  <TableCell>{trip.bookingDate}</TableCell>
                  <TableCell>{trip.scheduleAt}</TableCell>
                  <TableCell>{trip.customerInfo}</TableCell>
                  <TableCell>{trip.driverInfo}</TableCell>
                  <TableCell>{trip.vehicleInfo}</TableCell>
                  <TableCell>{trip.tripType}</TableCell>
                  <TableCell>{trip.tripAmount}</TableCell>
                  <TableCell>{trip.tripStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Completed;
