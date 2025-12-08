import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Collapse,
  Stack,
  Divider,
} from "@mui/material";
import axios from "axios";

const Pendingbookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // FETCH PENDING BOOKINGS
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings");
        const allBookings = res.data.bookings || [];

        // Only show pending
        const filtered = allBookings.filter(
          (b) =>
            b.status?.toLowerCase() === "pending" ||
            b.paymentStatus?.toLowerCase() === "pending"
        );

        setPendingBookings(filtered);
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ⭐ ACCEPT BOOKING
  const handleConfirm = async (id, e) => {
    e.stopPropagation();

    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}/accept`);

      setPendingBookings((prev) => prev.filter((b) => b._id !== id));

      alert("Booking Confirmed");
    } catch (err) {
      console.error(err);
      alert("Failed to confirm booking");
    }
  };

  // ❌ REJECT BOOKING
  const handleReject = async (id, e) => {
    e.stopPropagation();
    id = id.trim(); // fix accidental space

    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}/reject`);
      setPendingBookings((prev) => prev.filter((b) => b._id !== id));
      alert("Booking Rejected");
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("Failed to reject");
    }
  };

  return (
    <Box p={2} sx={{ background: "#f4f7fb", minHeight: "100vh" }}>
      {/* Center Container */}
      <Box sx={{ maxWidth: "850px", margin: "0 auto" }}>
        <Typography variant="h4" fontWeight={600} mb={3}>
          Pending Bookings
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : pendingBookings.length === 0 ? (
          <Typography>No Pending Bookings Found</Typography>
        ) : (
          pendingBookings.map((b) => (
            <Paper
              key={b._id}
              elevation={2}
              sx={{
                p: 2.5,
                mt: 2,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "0.2s",
                background: "#fff",
                "&:hover": {
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => toggleExpand(b._id)}
            >
              {/* TOP SECTION */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography fontWeight={700} fontSize={16}>
                    Booking ID:{" "}
                    <span style={{ color: "#1976d2" }}>#{b._id.slice(-6)}</span>
                  </Typography>

                  <Typography color="gray" fontSize={14}>
                    {b.eventType || "Corporate Conference"}
                  </Typography>

                  <Typography color="gray" fontSize={13} mt={0.5}>
                    {new Date(b.bookingDate).toDateString()}
                  </Typography>
                </Box>

                <Typography
                  fontWeight={700}
                  sx={{ color: "#16a34a", fontSize: "18px" }}
                >
                  ₹{b.finalPrice}
                </Typography>
              </Stack>

              {/* EXPANDED DETAILS */}
              <Collapse in={expandedId === b._id}>
                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    background: "#f9fafb",
                    p: 2,
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <Detail label="Customer" value={b.fullName} />
                  <Detail label="Guests" value={b.numberOfGuests} />
                  <Detail label="Email" value={b.emailAddress} />
                  <Detail label="Setup" value={b.setupTime || "9:00 AM - 10:00 AM"} />
                  <Detail label="Event" value={b.eventTime || "10:00 AM - 6:00 PM"} />
                  <Detail label="Capacity" value={b.capacity || "500 guests"} />
                  <Detail label="Catering" value={b.catering || "External"} />
                </Box>

                {/* ACTION BUTTONS */}
                <Stack
                  direction="row"
                  spacing={2}
                  mt={2}
                  justifyContent="center"
                >
                  <Button
                    variant="outlined"
                    sx={{
                      width: "130px",
                      borderRadius: "30px",
                      color: "#e11d48",
                      borderColor: "#e11d48",
                      "&:hover": { background: "#ffe4e6" },
                    }}
                    onClick={(e) => handleReject(b._id, e)}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      width: "130px",
                      borderRadius: "30px",
                      bgcolor: "#16a34a",
                      "&:hover": { bgcolor: "#15803d" },
                    }}
                    onClick={(e) => handleConfirm(b._id, e)}
                  >
                    Confirm
                  </Button>
                </Stack>
              </Collapse>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

// Helper component for cleaner detail rendering
const Detail = ({ label, value }) => (
  <Typography fontSize={14} sx={{ mb: 0.5 }}>
    <strong>{label}:</strong> {value}
  </Typography>
);

export default Pendingbookings;
