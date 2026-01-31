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

const renderTimeSlot = (timeSlot) => {
  if (!timeSlot) return 'N/A';
  if (typeof timeSlot === 'string') return timeSlot;
  if (Array.isArray(timeSlot)) return timeSlot.map(ts => (typeof ts === 'object' ? ts.label || ts.time : ts)).join(', ');
  if (typeof timeSlot === 'object') return timeSlot.label || timeSlot.time || 'N/A';
  return 'N/A';
};

const Pendingbookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [providerId, setProviderId] = useState(null);

  /* ------------------------------------------
     Load Vendor ID
  --------------------------------------------*/
  useEffect(() => {
    setProviderId(getProviderId());
  }, []);

  /* ------------------------------------------
     Fetch Pending Bookings
  --------------------------------------------*/
  useEffect(() => {
    if (!providerId) return;

    const fetchPending = async () => {
      try {
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
        );

        const all = res.data?.data || [];

        // 🚀 FIX: Only filter by booking.status AND moduleType
        const pending = all.filter((b) => {
          const status = String(b.status || '').toLowerCase();
          const moduleType = String(b.moduleType || '').toLowerCase();
          return status === 'pending' && (moduleType === 'ornament' || moduleType === 'ornaments');
        });

        setPendingBookings(pending);
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [providerId]);

  /* ------------------------------------------
     Expand / Collapse Booking
  --------------------------------------------*/
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  /* ------------------------------------------
     Confirm Booking
  --------------------------------------------*/
  const handleConfirm = async (id, e) => {
    e.stopPropagation();

    try {
      await axios.patch(
        `https://api.bookmyevent.ae/api/bookings/${id}/accept`
      );

      // Remove from list immediately
      setPendingBookings((prev) => prev.filter((b) => b._id !== id));

      alert("Booking Confirmed ✔️");
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Failed to confirm booking");
    }
  };

  /* ------------------------------------------
     Reject Booking
  --------------------------------------------*/
  const handleReject = async (id, e) => {
    e.stopPropagation();

    try {
      await axios.patch(
        `https://api.bookmyevent.ae/api/bookings/${id}/reject`
      );

      setPendingBookings((prev) => prev.filter((b) => b._id !== id));

      alert("Booking Rejected ❌");
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject booking");
    }
  };

  return (
    <Box p={2} sx={{ background: "#f4f7fb", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "850px", margin: "0 auto" }}>
        <Typography variant="h4" fontWeight={600} mb={3}>
          Pending Bookings
        </Typography>

        {/* Loading */}
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
              {/* Summary Row */}
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
                    {b.moduleType || "Event Booking"}
                  </Typography>

                  <Typography color="gray" fontSize={13}>
                    {renderTimeSlot(b.timeSlot)}
                  </Typography>
                </Box>

                <Typography fontWeight={700} sx={{ color: "#16a34a" }}>
                  ₹{b.finalPrice}
                </Typography>
              </Stack>

              {/* Expanded Details */}
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
                  <Detail label="Phone" value={b.contactNumber} />
                  <Detail label="Booking Type" value={b.bookingType} />
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={2} mt={2} justifyContent="center">
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

/* ------------------------------------------
   Reusable Detail Component
--------------------------------------------*/
const Detail = ({ label, value }) => (
  <Typography fontSize={14} sx={{ mb: 0.5 }}>
    <strong>{label}:</strong> {value}
  </Typography>
);

export default Pendingbookings;
