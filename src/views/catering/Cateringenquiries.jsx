import React, { useEffect, useState } from "react";
import {
    Box, TextField, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, TableContainer, Stack, CircularProgress, Alert,
    IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Grid, Card, CardContent,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import axios from "axios";
import { useNavigate } from "react-router-dom";

var ACCENT = "#2E7D32"; // Green for Catering

const EnquiriesUI = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [providerId, setProviderId] = useState(null);

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    /* ===============================
       GET PROVIDER ID
    =============================== */
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setProviderId(user.providerId || user._id);
        }
    }, []);

    /* ===============================
       FETCH ENQUIRIES
    =============================== */
    useEffect(() => {
        const fetchEnquiries = async () => {
            if (!providerId) {
                setError("Provider ID not found");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(
                    `https://api.bookmyevent.ae/api/enquiries/provider/${providerId}`
                );
                const all = res.data.data || [];
                // Filter for Catering
                const filtered = all.filter((e) => {
                    const mt = (e.moduleId?.moduleType || "").toLowerCase();
                    const title = (e.moduleId?.title || "").toLowerCase();
                    return mt === "catering" || mt === "food" || title.includes("catering") || title.includes("food");
                });
                setEnquiries(filtered);
                setError(null);
            } catch (err) {
                setError("Failed to fetch enquiries");
                setEnquiries([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiries();
    }, [providerId]);

    /* ===============================
       SEARCH FILTER
    =============================== */
    const filteredEnquiries = enquiries.filter((e) => {
        return (
            (e.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
            (e.email || "").toLowerCase().includes(search.toLowerCase()) ||
            (e.contact || "").includes(search) ||
            (e.moduleId?.title || "").toLowerCase().includes(search.toLowerCase())
        );
    });

    /* ===============================
       VIEW MODAL
    =============================== */
    const handleViewEnquiry = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEnquiry(null);
    };

    /* ===============================
       DETAIL ROW
    =============================== */
    const DetailRow = ({ icon, label, value }) => (
        <Box
            display="flex"
            alignItems="center"
            gap={2}
            py={1.5}
            sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: "none" },
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#E8F5E9",
                    color: ACCENT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography fontWeight={500}>{value || "N/A"}</Typography>
            </Box>
        </Box>
    );

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom sx={{ color: ACCENT, fontWeight: 700 }}>
                Catering Enquiries
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ mt: 2, borderRadius: '12px', overflow: 'hidden' }}>
                {/* SEARCH */}
                <Box p={2} bgcolor="#F1F8E9">
                    <TextField
                        label="Search catering enquiries"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: '8px' }}
                    />
                </Box>

                {/* TABLE */}
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#F1F8E9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={28} sx={{ color: ACCENT }} />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading &&
                                filteredEnquiries.map((e, i) => (
                                    <TableRow key={e._id} hover>
                                        <TableCell>{i + 1}</TableCell>

                                        <TableCell>
                                            <Typography fontWeight={600}>{e.fullName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {e.email}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>{e.moduleId?.title}</TableCell>
                                        <TableCell>{e.contact}</TableCell>
                                        <TableCell>
                                            {new Date(e.bookingDate).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Chat">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            navigate("/catering/enquirychat", {
                                                                state: e,
                                                            })
                                                        }
                                                        sx={{ color: ACCENT, bgcolor: '#E8F5E9', '&:hover': { bgcolor: '#C8E6C9' } }}
                                                    >
                                                        <ChatIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="View">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() => handleViewEnquiry(e)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton size="small" color="error">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            {!loading && filteredEnquiries.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No catering enquiries found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* VIEW MODAL */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: ACCENT, color: "white" }}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight={600}>Enquiry Details</Typography>
                        <IconButton onClick={handleCloseModal} sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {selectedEnquiry && (
                        <Grid container spacing={3} mt={1}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography fontWeight={600} mb={2} color={ACCENT}>
                                            Customer Information
                                        </Typography>

                                        <DetailRow
                                            icon={<PersonIcon fontSize="small" />}
                                            label="Full Name"
                                            value={selectedEnquiry.fullName}
                                        />
                                        <DetailRow
                                            icon={<EmailIcon fontSize="small" />}
                                            label="Email"
                                            value={selectedEnquiry.email}
                                        />
                                        <DetailRow
                                            icon={<PhoneIcon fontSize="small" />}
                                            label="Contact"
                                            value={selectedEnquiry.contact}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography fontWeight={600} mb={2} color={ACCENT}>
                                            Booking Information
                                        </Typography>

                                        <DetailRow
                                            icon={<CategoryIcon fontSize="small" />}
                                            label="Module"
                                            value={selectedEnquiry.moduleId?.title}
                                        />
                                        <DetailRow
                                            icon={<EventIcon fontSize="small" />}
                                            label="Booking Date"
                                            value={new Date(
                                                selectedEnquiry.bookingDate
                                            ).toLocaleDateString()}
                                        />
                                        <DetailRow
                                            icon={<AccessTimeIcon fontSize="small" />}
                                            label="Created At"
                                            value={new Date(
                                                selectedEnquiry.createdAt
                                            ).toLocaleString()}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseModal} variant="outlined" sx={{ color: ACCENT, borderColor: ACCENT }}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<ChatIcon />}
                        sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#1B5E20' } }}
                        onClick={() => {
                            handleCloseModal();
                            navigate("/catering/enquirychat", {
                                state: selectedEnquiry,
                            });
                        }}
                    >
                        Open Chat
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EnquiriesUI;
