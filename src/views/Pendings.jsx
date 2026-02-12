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
  Chip,
  Grid,
} from "@mui/material";
import axios from "axios";

/* ----------------------------------------------------
   Helper: Safely extract providerId
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

const Pendingbookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    setProviderId(getProviderId());
  }, []);

  useEffect(() => {
    if (!providerId) return;

    const fetchPending = async () => {
      try {
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
        );

        const all = res.data?.data || [];
        const pending = all.filter(
          (b) => b.status?.toLowerCase() === "pending"
        );

        setPendingBookings(pending);
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [providerId]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleConfirm = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.patch(
        `https://api.bookmyevent.ae/api/bookings/${id}/accept`
      );
      setPendingBookings((prev) => prev.filter((b) => b._id !== id));
      alert("Booking Confirmed ✔️");
    } catch (err) {
      alert("Failed to confirm booking");
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.patch(
        `https://api.bookmyevent.ae/api/bookings/${id}/reject`
      );
      setPendingBookings((prev) => prev.filter((b) => b._id !== id));
      alert("Booking Rejected ❌");
    } catch (err) {
      alert("Failed to reject booking");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #f1f5f9 100%)",
        py: 5,
      }}
    >
      <Box sx={{ maxWidth: "950px", margin: "0 auto", px: 2 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>
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
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: "20px",
                background: "#ffffffcc",
                backdropFilter: "blur(12px)",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                },
              }}
              onClick={() => toggleExpand(b._id)}
            >
              {/* SUMMARY */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography fontWeight={700} fontSize={17}>
                    #{b._id.slice(-6)}
                  </Typography>

                  <Typography fontSize={14} color="text.secondary">
                    {b.venueId?.venueName ||
                      b.packageId?.title ||
                      b.makeupId?.name ||
                      b.photographyId?.name ||
                      "Event Booking"}
                  </Typography>

                  <Typography fontSize={13} color="text.secondary">
                    {new Date(b.bookingDate).toDateString()}
                  </Typography>
                </Box>

                <Stack alignItems="flex-end">
                  <Typography
                    fontWeight={700}
                    fontSize={18}
                    sx={{ color: "#16a34a" }}
                  >
                    ₹{b.finalPrice}
                  </Typography>

                  <Chip
                    label="Pending"
                    sx={{
                      mt: 1,
                      background: "#fef3c7",
                      color: "#92400e",
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Stack>

              {/* EXPANDED DETAILS */}
              <Collapse in={expandedId === b._id}>
                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    background: "#f8fafc",
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {/* GRID DETAILS */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Detail label="Full Booking ID" value={b._id} />
                      <Detail
                        label="Created At"
                        value={new Date(b.createdAt).toLocaleString()}
                      />
                      <Detail
                        label="Booking Date"
                        value={new Date(b.bookingDate).toDateString()}
                      />
                      <Detail label="Status" value={b.status} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Detail label="Customer Name" value={b.fullName} />
                      <Detail label="Email" value={b.emailAddress} />
                      <Detail label="Phone" value={b.contactNumber} />
                      <Detail
                        label="Guests"
                        value={b.numberOfGuests}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography fontWeight={700} mb={1}>
                    Payment Details
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Detail
                        label="Base Price"
                        value={`₹${b.basePrice || 0}`}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Detail
                        label="Advance Paid"
                        value={`₹${b.advanceAmount || 0}`}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Detail
                        label="Final Price"
                        value={`₹${b.finalPrice}`}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Detail
                        label="Payment Status"
                        value={b.paymentStatus || "Pending"}
                      />
                    </Grid>
                  </Grid>

                  {/* ACTIONS */}
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    mt={3}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        width: 140,
                        borderRadius: "30px",
                        fontWeight: 600,
                        borderColor: "#ef4444",
                        color: "#ef4444",
                        "&:hover": {
                          background: "#fee2e2",
                        },
                      }}
                      onClick={(e) => handleReject(b._id, e)}
                    >
                      Reject
                    </Button>

                    <Button
                      variant="contained"
                      sx={{
                        width: 140,
                        borderRadius: "30px",
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg,#22c55e,#16a34a)",
                        boxShadow:
                          "0 8px 20px rgba(22,163,74,0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg,#16a34a,#15803d)",
                        },
                      }}
                      onClick={(e) => handleConfirm(b._id, e)}
                    >
                      Confirm
                    </Button>
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

/* DETAIL COMPONENT */
const Detail = ({ label, value }) => (
  <Typography fontSize={14} sx={{ mb: 1 }}>
    <strong>{label}:</strong> {value || "N/A"}
  </Typography>
);

export default Pendingbookings;
