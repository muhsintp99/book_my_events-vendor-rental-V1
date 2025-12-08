import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";

const Confirmed = () => {
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch confirmed bookings
  const fetchConfirmed = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      const all = res.data.bookings || [];

      // FILTER ONLY ACCEPTED BOOKINGS
      const confirmed = all.filter(
        (b) => b.status?.toLowerCase() === "accepted"
      );

      setConfirmedBookings(confirmed);
    } catch (err) {
      console.error("Error loading confirmed bookings:", err);
    }
  };

  useEffect(() => {
    fetchConfirmed();
  }, []);

  const filtered = confirmedBookings.filter(
    (b) =>
      b._id.includes(search) ||
      b.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      b.emailAddress?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Confirmed Bookings
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          p={2}
        >
          <TextField
            label="Search Booking ID, Name, Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ maxWidth: 300 }}
          />

          <Button variant="contained" color="primary">
            Export
          </Button>
        </Stack>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>S#</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((b, index) => (
                <TableRow key={b._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{b._id}</TableCell>
                  <TableCell>{b.fullName}</TableCell>
                  <TableCell>{b.emailAddress}</TableCell>
                  <TableCell>{b.numberOfGuests}</TableCell>
                  <TableCell>{new Date(b.bookingDate).toLocaleDateString()}</TableCell>
                  <TableCell>₹{b.finalPrice}</TableCell>
                  <TableCell>{b.status}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" size="small">
                        View
                      </Button>
                      <Button variant="outlined" size="small">
                        Download
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No Confirmed Bookings Found
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

export default Confirmed;
