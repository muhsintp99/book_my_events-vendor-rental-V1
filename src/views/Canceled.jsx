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
  Grid,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment
} from "@mui/material";
import axios from "axios";

// Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

/* ----------------------------------------------------
   Helper: Time Ago
---------------------------------------------------- */
const timeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const Canceled = () => {
  const [canceledBookings, setCanceledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [search, setSearch] = useState("");

  /* ------------------------------------------
     Load Vendor ID
  --------------------------------------------*/
  useEffect(() => {
    setProviderId(getProviderId());
  }, []);

  /* ------------------------------------------
     Fetch Canceled Bookings
  --------------------------------------------*/
  useEffect(() => {
    if (!providerId) return;

    const fetchCanceled = async () => {
      try {
        // Fetch from Provider Endpoint
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
        );

        const all = res.data?.data || [];

        // Filter Rejected or Cancelled
        const canceled = all.filter(
          (b) =>
            b.status?.toLowerCase() === "rejected" ||
            b.status?.toLowerCase() === "cancelled"
        );

        // Sort by createdAt desc (Latest First)
        canceled.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setCanceledBookings(canceled);
      } catch (error) {
        console.error("Error fetching canceled bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanceled();
  }, [providerId]);

  /* ------------------------------------------
     Expand / Collapse Booking
  --------------------------------------------*/
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  /* ------------------------------------------
     Search Layout
  --------------------------------------------*/
  const filteredBookings = canceledBookings.filter(b => {
    const term = search.toLowerCase();
    return (
      b._id.toLowerCase().includes(term) ||
      b.fullName?.toLowerCase().includes(term) ||
      b.venueId?.venueName?.toLowerCase().includes(term) ||
      b.packageId?.title?.toLowerCase().includes(term)
    );
  });

  return (
    <Box p={3} sx={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1000px", margin: "0 auto" }}>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
          <Box>
            <Typography variant="h3" fontWeight={700} color="#1e293b">
              Canceled Bookings
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              {canceledBookings.length} bookings canceled or rejected
            </Typography>
          </Box>

          <TextField
            placeholder="Search ID, Name, Venue..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              width: { xs: "100%", sm: "300px" },
              "& .MuiOutlinedInput-root": { borderRadius: "10px" }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress size={50} thickness={4} />
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "#fff" }} elevation={0}>
            <CancelIcon sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No canceled bookings found.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {filteredBookings.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                expanded={expandedId === b._id}
                onToggle={() => toggleExpand(b._id)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

/* ------------------------------------------
   Booking Card Component
--------------------------------------------*/
const BookingCard = ({ booking, expanded, onToggle }) => {
  const {
    _id,
    venueId,
    packageId,
    makeupId,
    photographyId,
    moduleType,
    bookingDate,
    timeSlot,
    fullName,
    contactNumber,
    emailAddress,
    numberOfGuests,
    finalPrice,
    paymentStatus,
    bookingType,
    createdAt,
    status
  } = booking;

  const title = venueId?.venueName || packageId?.title || makeupId?.name || photographyId?.name || moduleType || "Event Booking";
  const displayTimeSlot = typeof timeSlot === 'object' ? timeSlot?.label : timeSlot;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
          borderColor: "#cbd5e1",
          transform: "translateY(-2px)"
        }
      }}
    >
      {/* Main Header / Summary */}
      <Box
        onClick={onToggle}
        sx={{
          p: 3,
          cursor: "pointer",
          background: "#fff",
          position: "relative"
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Left: Avatar & Title */}
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "#fee2e2",
                  color: "#ef4444",
                  width: 56,
                  height: 56
                }}
              >
                <CancelIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} color="#0f172a" lineHeight={1.2}>
                  {title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <Chip
                    label={moduleType || "Service"}
                    size="small"
                    sx={{ height: 20, fontSize: "0.7rem", bgcolor: "#f1f5f9", color: "#475569" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    ID: #{_id.slice(-6).toUpperCase()}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Middle: Date & Time */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon sx={{ fontSize: 18, color: "#64748b" }} />
                <Typography variant="body2" fontWeight={600} color="#334155">
                  {new Date(bookingDate).toDateString()}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTimeIcon sx={{ fontSize: 18, color: "#64748b" }} />
                <Typography variant="body2" color="#64748b">
                  {displayTimeSlot || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Right: Price & Status */}
          <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Typography variant="h5" fontWeight={700} color="#ef4444">
              ₹{finalPrice?.toLocaleString()}
            </Typography>
            <Stack direction="row" justifyContent={{ xs: "flex-start", md: "flex-end" }} alignItems="center" gap={1} mt={0.5}>
              <Typography variant="caption" color="text.secondary">
                Updated {timeAgo(createdAt)}
              </Typography>
              <Chip
                label={status || "Cancelled"}
                size="small"
                sx={{
                  bgcolor: '#fee2e2',
                  color: '#ef4444',
                  fontWeight: 600,
                  height: 24,
                  textTransform: 'capitalize'
                }}
              />
            </Stack>
          </Grid>

          {/* Expand Icon */}
          <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton size="small" sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}>
              <ExpandMoreIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      {/* Expanded Content */}
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ p: 3, bgcolor: "#f8fafc" }}>
          <Grid container spacing={3}>
            {/* Customer Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mb={2} textTransform="uppercase">
                Customer Details
              </Typography>
              <Stack spacing={2}>
                <DetailRow icon={<PersonIcon />} label="Name" value={fullName} />
                <DetailRow icon={<CallIcon />} label="Phone" value={contactNumber} />
                <DetailRow icon={<EmailIcon />} label="Email" value={emailAddress} />
              </Stack>
            </Grid>

            {/* Booking Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mb={2} textTransform="uppercase">
                Booking Info
              </Typography>
              <Stack spacing={2}>
                <DetailRow icon={<PeopleIcon />} label="Guests" value={numberOfGuests || "N/A"} />
                <DetailRow icon={<EventAvailableIcon />} label="Type" value={bookingType} />
                <DetailRow icon={<AccessTimeIcon />} label="Time Slot" value={displayTimeSlot || "N/A"} />
              </Stack>
            </Grid>

            {/* Payment Info & Actions */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mb={2} textTransform="uppercase">
                Payment Summary
              </Typography>
              <Stack spacing={2}>
                <DetailRow icon={<MonetizationOnIcon />} label="Total" value={`₹${finalPrice?.toLocaleString()}`} highlight />
                <DetailRow icon={<MonetizationOnIcon />} label="Status" value={paymentStatus} />
              </Stack>

             
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

const DetailRow = ({ icon, label, value, highlight = false }) => (
  <Box display="flex" alignItems="center" gap={1.5}>
    <Box sx={{ color: highlight ? "#ef4444" : "#94a3b8" }}>
      {React.cloneElement(icon, { fontSize: "small" })}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={highlight ? 700 : 500} color={highlight ? "#ef4444" : "#334155"}>
        {value || "N/A"}
      </Typography>
    </Box>
  </Box>
);

export default Canceled;
