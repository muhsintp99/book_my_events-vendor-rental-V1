import React, { useEffect, useState } from "react";
import {
  Box,
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
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnquiriesUI = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);

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
        setEnquiries(res.data.data || []);
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
     FILTER
  =============================== */
  const filteredEnquiries = enquiries.filter((e) => {
    const matchSearch =
      (e.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.contact || "").includes(search) ||
      (e.moduleId?.title || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" || e.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Enquiries
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mt: 2 }}>
        {/* SEARCH + FILTER */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} p={2}>
          <TextField
            label="Search enquiries"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="responded">Responded</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </Stack>

        {/* TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredEnquiries.map((e, i) => (
                  <TableRow key={e._id} hover>
                    <TableCell>{i + 1}</TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>
                        {e.fullName}
                      </Typography>
                      <Typography variant="caption">
                        {e.email}
                      </Typography>
                    </TableCell>

                    <TableCell>{e.moduleId?.title}</TableCell>
                    <TableCell>{e.contact}</TableCell>

                    <TableCell>
                      {new Date(e.bookingDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={e.status}
                        color={
                          e.status === "pending"
                            ? "warning"
                            : e.status === "confirmed"
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    {/* 🔥 ACTIONS */}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {/* CHAT */}
                        <Tooltip title="Open Chat">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate("/makeupartist/Enqurychat", {
                                state: e,
                              })
                            }
                          >
                            <ChatIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* VIEW */}
                        <Tooltip title="View Enquiry">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* DELETE */}
                        <Tooltip title="Delete Enquiry">
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
                  <TableCell colSpan={7} align="center">
                    No enquiries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EnquiriesUI;
