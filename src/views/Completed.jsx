import React, { useState, useEffect } from "react";
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
  Chip
} from "@mui/material";

const Completed = () => {
  const [search, setSearch] = useState("");
  const [completedTrips, setCompletedTrips] = useState([]);

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

  const providerId = getProviderId();
  // API to fetch ALL bookings (filtering done on client side to include Accepted & Completed)
  const API_URL = `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`;

  // ===========================
  // 🔥 FETCH COMPLETED BOOKINGS
  // ===========================
  const fetchCompletedBookings = async () => {
    if (!providerId) return;

    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const allData = json.data || []; // endpoint returns { success: true, count: N, data: [...] }

      // Filter for 'Accepted' OR 'Completed'
      const relevant = allData.filter(b => {
        const s = b.status?.toLowerCase();
        return s === 'accepted' || s === 'completed';
      });

      // Sort by Latest First
      relevant.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const formatted = relevant.map((b) => {
        let displayTime = "N/A";
        if (b.timeSlot) {
          if (Array.isArray(b.timeSlot)) {
            const first = b.timeSlot[0];
            displayTime = typeof first === 'object' ? (first?.label || first?.time || "N/A") : first;
          } else if (typeof b.timeSlot === 'object') {
            displayTime = b.timeSlot?.label || b.timeSlot?.time || "N/A";
          } else {
            displayTime = b.timeSlot;
          }
        }

        return {
          id: b._id,
          tripId: b._id.slice(-6).toUpperCase(),
          bookingDate: new Date(b.bookingDate).toLocaleDateString(),
          scheduleAt: displayTime,
          customerInfo: b.fullName || "N/A",
          vehicleInfo: b.vehicleInfo || b.venueId?.venueName || b.packageId?.title || "N/A",
          tripType: b.moduleType || "Service",
          tripAmount: b.finalPrice?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
          tripStatus: b.status,
        };
      });

      setCompletedTrips(formatted);

    } catch (err) {
      console.log("Error fetching completed bookings:", err);
    }
  };

  useEffect(() => {
    fetchCompletedBookings();
  }, [providerId]);

  // SEARCH FILTER
  const filteredTrips = completedTrips.filter(
    (trip) =>
      trip.tripId.toString().toLowerCase().includes(search.toLowerCase()) ||
      trip.customerInfo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3} sx={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h4" fontWeight={600} gutterBottom mb={3}>
          Completed / Confirmed Bookings
        </Typography>

        <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            p={3}
            bgcolor="#fff"
          >
            <TextField
              label="Search by ID, customer name"
              size="small"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ maxWidth: { sm: 350 }, minWidth: 250 }}
            />

            <Button
              variant="contained"
              sx={{ bgcolor: "#E15B65", color: "white", borderRadius: 2, textTransform: "none", px: 3 }}
              onClick={fetchCompletedBookings}
            >
              Refresh List
            </Button>
          </Stack>

          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>S#</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Booking Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Schedule At</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Customer</TableCell>
                  {/* <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Driver</TableCell> */}
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Service/Item</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">No bookings found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip, index) => (
                    <TableRow key={trip.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>#{trip.tripId}</TableCell>
                      <TableCell>{trip.bookingDate}</TableCell>
                      <TableCell>{trip.scheduleAt}</TableCell>
                      <TableCell>{trip.customerInfo}</TableCell>
                      {/* <TableCell>{trip.driverInfo}</TableCell> */}
                      <TableCell>{trip.vehicleInfo}</TableCell>
                      <TableCell>
                        <Chip label={trip.tripType} size="small" sx={{ bgcolor: "#f1f5f9" }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#16a34a" }}>{trip.tripAmount}</TableCell>
                      <TableCell>
                        <Chip
                          label={trip.tripStatus}
                          size="small"
                          color={trip.tripStatus === 'Completed' ? "success" : "primary"}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default Completed;
