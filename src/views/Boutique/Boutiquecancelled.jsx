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

/* ----------------------------------------------------
   Helper: Safely extract providerId (Vendor _id)
---------------------------------------------------- */
const getProviderId = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?._id || null;
  } catch (err) {
    console.error("Error parsing user:", err);
    return null;
  }
};

const BoutiqueCancelled = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [canceledBookings, setCanceledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const providerId = getProviderId();

  // ✅ SAFE RENDER HELPERS
  const renderTimeSlot = (timeSlot) => {
    if (!timeSlot) return "N/A";
    if (typeof timeSlot === "string") return timeSlot;
    if (Array.isArray(timeSlot)) return timeSlot.map(ts => (typeof ts === 'object' ? ts.label || ts.time : ts)).join(', ');
    if (typeof timeSlot === "object") return timeSlot.label || timeSlot.time || 'N/A';
    return "N/A";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "N/A" : d.toDateString();
  };

  const formatPrice = (price) => Number(price) || 0;

  // 🔥 FETCH CANCELED / REJECTED BOOKINGS
  useEffect(() => {
    if (!providerId) return;

    const fetchCanceled = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
        );

        const allBookings = res.data?.data || [];

        const canceled = allBookings.filter((b) => {
          const status = String(b.status || '').toLowerCase();
          const moduleType = String(b.moduleType || '').toLowerCase();
          const isCancelled = status === 'rejected' || status === 'cancelled';
          const isBoutique = moduleType === 'boutique' || moduleType === 'boutique artist';
          return isCancelled && isBoutique;
        });

        setCanceledBookings(canceled);
      } catch (err) {
        console.error("Failed to fetch canceled bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanceled();
  }, [providerId]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Canceled / Rejected Boutique Bookings
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
            {/* TOP SECTION */}
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>
                  Booking ID: #{b._id?.slice(-6)}
                </Typography>

                <Typography color="gray" fontSize={14}>
                  {formatDate(b.bookingDate)}
                </Typography>

                <Typography color="gray" fontSize={13}>
                  {renderTimeSlot(b.timeSlot)}
                </Typography>
              </Box>

              <Typography fontWeight={700} color="red">
                ₹{formatPrice(b.finalPrice)}
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
                  <strong>Customer:</strong> {b.fullName || "N/A"}
                </Typography>

                <Typography fontSize={14}>
                  <strong>Email:</strong> {b.emailAddress || "N/A"}
                </Typography>

                <Typography fontSize={14}>
                  <strong>Contact:</strong> {b.contactNumber || "N/A"}
                </Typography>

                <Typography fontSize={14}>
                  <strong>Guests:</strong> {b.numberOfGuests || "N/A"}
                </Typography>

                <Typography fontSize={14} mt={1}>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "red" }}>
                    {b.status || "N/A"}
                  </span>
                </Typography>

                <Typography fontSize={14}>
                  <strong>Payment:</strong>{" "}
                  {b.paymentStatus || "N/A"}
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

export default BoutiqueCancelled;

