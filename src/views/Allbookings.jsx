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

    // 🔥 Get logged-in vendor's providerId from localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setProviderId(user._id || user.id || user.providerId);
        }
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
                const res = await axios.get(
                    `https://api.bookmyevent.ae/api/bookings/provider/${providerId}`
                );

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
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Bookings
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ mt: 2, width: "100%", borderRadius: "10px", overflow: "hidden" }}>
                {/* 🔍 Search + Export */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    p={2}
                    sx={{ borderBottom: "1px solid #eee" }}
                >
                    <TextField
                        label="Search by ID, Name, Email"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        sx={{ maxWidth: { sm: 300 } }}
                    />

                    <Button variant="contained" color="primary" sx={{ borderRadius: "20px" }}>
                        Export CSV
                    </Button>
                </Stack>

                {/* TABLE */}
                <TableContainer sx={{ width: "100%", maxHeight: "calc(100vh - 300px)" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>S#</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Booking ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Booking Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Paid</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={28} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredBookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                        {search ? "No matching bookings found" : "No bookings yet"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBookings.map((b, index) => (
                                    <TableRow key={b._id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: "#1976d2" }}>
                                            #{b._id.slice(-6)}
                                        </TableCell>
                                        <TableCell>{b.moduleType || "N/A"}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{b.fullName || "N/A"}</Typography>
                                            <Typography variant="caption" color="textSecondary">{b.emailAddress}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            {new Date(b.bookingDate).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </TableCell>

                                        <TableCell sx={{ fontWeight: 700, color: "#10b981" }}>
                                            ₹{(b.moduleType === 'Cake' && ['completed', 'paid', 'success'].includes(String(b.paymentStatus || '').toLowerCase())
                                                ? (b.finalPrice || 0)
                                                : (b.advanceAmount || 0)).toLocaleString()}
                                        </TableCell>

                                        <TableCell sx={{ fontWeight: 700, color: "#2e7d32" }}>
                                            ₹{(b.finalPrice || 0).toLocaleString()}
                                        </TableCell>

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "inline-block",
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: "20px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    bgcolor:
                                                        b.status === "Accepted" ? "#e8f5e9" :
                                                            b.status === "Rejected" ? "#ffebee" : "#fff3e0",
                                                    color:
                                                        b.status === "Accepted" ? "#2e7d32" :
                                                            b.status === "Rejected" ? "#d32f2f" : "#ed6c02",
                                                }}
                                            >
                                                {b.status}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    textTransform: "capitalize",
                                                    fontWeight: 600,
                                                    color: b.paymentStatus === "completed" ? "#2e7d32" : "#ed6c02"
                                                }}
                                            >
                                                {b.paymentStatus || "Pending"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button variant="outlined" size="small" color="primary" sx={{ borderRadius: "15px" }}>
                                                    Details
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Summary */}
            {!loading && bookings.length > 0 && (
                <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">
                        Showing {filteredBookings.length} of {bookings.length} total bookings
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Allbookings;
