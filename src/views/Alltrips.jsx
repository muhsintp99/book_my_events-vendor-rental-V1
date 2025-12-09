import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const Allbookings = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);

  // 🔥 Get logged-in vendor's providerId from localStorage or context
  useEffect(() => {
    // Method 1: Get from localStorage (assuming you store user data there)
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setProviderId(user._id || user.id || user.providerId);
    }

    // Method 2: If you have a context or different storage
    // const user = getCurrentUser(); // Your auth function
    // setProviderId(user?.providerId);
  }, []);

  // 🔥 Fetch bookings for THIS PROVIDER ONLY
  useEffect(() => {
    const fetchBookings = async () => {
      if (!providerId) {
        setError("Provider ID not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Use provider-specific endpoint
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
        );
        
        // The backend returns data in { success: true, data: [...] } format
        setBookings(res.data.data || res.data.bookings || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.response?.data?.message || "Failed to fetch bookings");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [providerId]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  // 🔍 Search: ID, name, email
  const filteredBookings = bookings.filter((b) =>
    (b.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.emailAddress || "").toLowerCase().includes(search.toLowerCase()) ||
    (b._id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mt: 2, width: "100%", borderRadius: "10px" }}>
        {/* 🔍 Search + Export */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          p={2}
        >
          <TextField
            label="Search by Booking ID, Name, Email"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ maxWidth: { sm: 300 } }}
          />

          <Button variant="contained" color="primary">
            Export
          </Button>
        </Stack>

        {/* TABLE */}
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>S#</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* LOADING STATE */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {/* DATA LIST */}
              {!loading &&
                filteredBookings.map((b, index) => (
                  <TableRow key={b._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>#{b._id.slice(-6)}</TableCell>
                    <TableCell>{b.moduleType || "N/A"}</TableCell>
                    <TableCell>{b.fullName || "N/A"}</TableCell>
                    <TableCell>{b.emailAddress || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{b.numberOfGuests || "-"}</TableCell>

                    <TableCell>
                      ₹{b.finalPrice?.toLocaleString() || 0}
                    </TableCell>

                    <TableCell
                      style={{
                        color:
                          b.status === "Accepted"
                            ? "green"
                            : b.status === "Rejected"
                            ? "red"
                            : "orange",
                        fontWeight: 600,
                      }}
                    >
                      {b.status}
                    </TableCell>

                    <TableCell
                      style={{
                        textTransform: "capitalize",
                        color:
                          b.paymentStatus === "completed"
                            ? "green"
                            : b.paymentStatus === "failed"
                            ? "red"
                            : "orange",
                        fontWeight: 600,
                      }}
                    >
                      {b.paymentStatus}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" size="small" color="primary">
                          View
                        </Button>

                        <Button variant="outlined" size="small" color="secondary">
                          Download
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {/* EMPTY STATE */}
              {!loading && filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    {search ? "No matching bookings found" : "No bookings yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary */}
      {!loading && bookings.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Allbookings;