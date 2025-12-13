import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Collapse,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const CanceledTrips = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [canceledBookings, setCanceledBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH CANCELED (REJECTED) BOOKINGS FROM BACKEND
  useEffect(() => {
    const fetchCanceled = async () => {
      try {
        const res = await axios.get("https://api.bookmyevent.ae/api/bookings");

        const allBookings = res.data.bookings || [];

        // Show Rejected bookings
        const canceled = allBookings.filter(
          (b) =>
            b.status?.toLowerCase() === "rejected" ||
            b.status?.toLowerCase() === "cancelled" // if you add this in future
        );

        setCanceledBookings(canceled);
      } catch (err) {
        console.error("Failed to fetch canceled bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanceled();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Canceled / Rejected Bookings
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : canceledBookings.length === 0 ? (
        <Typography>No canceled bookings found</Typography>
      ) : (
        canceledBookings.map((b) => (
          <Paper
            key={b._id}
            elevation={3}
            sx={{
              p: 2,
              mt: 2,
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={() => toggleExpand(b._id)}
          >
            {/* ----- Top Section ------- */}
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>
                  Booking ID: #{b._id?.slice(-6)}
                </Typography>

                <Typography color="gray" fontSize={14}>
                  {new Date(b.bookingDate).toDateString()}
                </Typography>

                <Typography color="gray" fontSize={13}>
                  {b.timeSlot || "N/A"}
                </Typography>
              </Box>

              <Typography fontWeight={700} color="red">
                ₹{b.finalPrice}
              </Typography>
            </Stack>

            <Collapse in={expandedId === b._id}>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  background: "#f8f8f8",
                  p: 2,
                  borderRadius: "10px",
                }}
              >
                <Typography fontSize={14}>
                  <strong>Customer:</strong> {b.fullName}
                </Typography>

                <Typography fontSize={14}>
                  <strong>Email:</strong> {b.emailAddress}
                </Typography>

                <Typography fontSize={14}>
                  <strong>Contact:</strong> {b.contactNumber}
                </Typography>

                <Typography fontSize={14}>
                  <strong>Guests:</strong> {b.numberOfGuests}
                </Typography>

                <Typography fontSize={14} mt={1}>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "red" }}>{b.status}</span>
                </Typography>

                <Typography fontSize={14}>
                  <strong>Payment:</strong> {b.paymentStatus}
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={2}
                mt={2}
                justifyContent="center"
              >
                <Button
                  variant="outlined"
                  sx={{
                    width: "120px",
                    borderRadius: "30px",
                    color: "#E15B65",
                  }}
                >
                  Download
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    width: "120px",
                    borderRadius: "30px",
                    bgcolor: "#E15B65",
                    color: "white",
                  }}
                >
                  View
                </Button>
              </Stack>
            </Collapse>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default CanceledTrips;
