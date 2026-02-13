import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Grid,
  Avatar,
  Divider,
  Drawer,
  Chip,
  useTheme,
  useMediaQuery,
  alpha
} from "@mui/material";
import {
  Search,
  WhatsApp,
  Phone,
  Email,
  CalendarMonth,
  Person,
  Visibility,
  Delete,
  Diamond,
  Category,
  Close,
  TrendingUp,
  MessageCircle
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- Constants ---
const API_BASE_URL = "https://api.bookmyevent.ae";
const GOLD_COLOR = '#D4AF37';
const PREMIUM_DARK = '#0f172a';
const PREMIUM_GRADIENT = 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://api.bookmyevent.ae/${cleanPath}`;
};

const EnquiriesUI = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [search, setSearch] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const pid = user.providerId || user._id;
      setProviderId(pid);
      fetchEnquiries(pid);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEnquiries = async (pid) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/enquiries/provider/${pid}`);
      const all = res.data.data || [];
      // Filter for ornaments if possible or just show all
      setEnquiries(all);
      setError(null);
    } catch (err) {
      setError("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  const filteredEnquiries = useMemo(() => {
    const lower = search.toLowerCase();
    return enquiries.filter((e) =>
      (e.fullName || "").toLowerCase().includes(lower) ||
      (e.email || "").toLowerCase().includes(lower) ||
      (e.contact || "").includes(search) ||
      (e.moduleId?.title || "").toLowerCase().includes(lower)
    );
  }, [enquiries, search]);

  const stats = useMemo(() => {
    const total = enquiries.length;
    const today = enquiries.filter(e => {
      const d = new Date(e.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;
    return { total, today };
  }, [enquiries]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/enquiries/${id}`);
      setEnquiries(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert("Failed to delete enquiry");
    }
  };

  const handleOpenDetail = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 6 }}>
      {/* Top Navigation */}
      <Box sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary">Enquiries</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">Ornaments</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>{'>'}</Typography>
          <Typography variant="caption" fontWeight={600} color={GOLD_COLOR}>Enquiries</Typography>
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard label="Total Enquiries" value={stats.total} color={GOLD_COLOR} icon={<MessageCircle />} />
          <StatCard label="New Today" value={stats.today} color="#f59e0b" icon={<CalendarMonth />} />
          <StatCard label="Conversion" value="12%" color="#22c55e" icon={<TrendingUp />} />
          <StatCard label="Urgent Leads" value="5" color="#ef4444" icon={<Visibility />} />
        </Grid>

        {/* Main Card */}
        <Paper elevation={0} sx={{ borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          {/* Toolbar */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: PREMIUM_DARK }}>Recent Leads</Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1} maxWidth={{ md: 600 }} justifyContent="flex-end">
              <TextField
                placeholder="Search leads..."
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: '12px', bgcolor: '#f8fafc' }
                }}
              />
            </Stack>
          </Box>

          {/* Table Headers */}
          {!isMobile && (
            <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 2, alignItems: 'center' }}>
              <TableLabel flex={0.5} label="SI#" />
              <TableLabel flex={3} label="Customer Info" />
              <TableLabel flex={2.5} label="Ornament/Interest" />
              <TableLabel flex={2} label="Received" />
              <TableLabel flex={2.5} label="Actions" textAlign="center" />
            </Box>
          )}

          {/* Leads Content */}
          <Box sx={{ minHeight: 400 }}>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
                <CircularProgress size={32} thickness={5} sx={{ color: GOLD_COLOR }} />
              </Stack>
            ) : filteredEnquiries.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 10, opacity: 0.5 }}>
                <Typography fontWeight={600}>No leads found</Typography>
              </Stack>
            ) : (
              <AnimatePresence>
                {filteredEnquiries.map((e, i) => (
                  <EnquiryRow
                    key={e._id}
                    index={i + 1}
                    enquiry={e}
                    isMobile={isMobile}
                    onView={() => handleOpenDetail(e)}
                    onDelete={(evt) => handleDelete(e._id, evt)}
                    onChat={() => navigate("/ornaments/Enqurychat", { state: e })}
                  />
                ))}
              </AnimatePresence>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Premium Detail Drawer */}
      <EnquiryDetailDrawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        enquiry={selectedEnquiry}
      />
    </Box>
  );
};

/* --- Sub-Components --- */

const StatCard = ({ label, value, color, icon }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2.5, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' } }}>
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 48, height: 48, borderRadius: '14px' }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>{label}</Typography>
        <Typography variant="h5" fontWeight={900}>{value}</Typography>
      </Box>
    </Paper>
  </Grid>
);

const TableLabel = ({ label, flex, textAlign = 'left' }) => (
  <Typography variant="caption" fontWeight={800} color="#64748b" sx={{ flex, textAlign, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
);

const EnquiryRow = ({ index, enquiry, isMobile, onView, onDelete, onChat }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <Box
      onClick={onView}
      sx={{
        px: 3, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', transition: '0.2s',
        '&:hover': { bgcolor: alpha(GOLD_COLOR, 0.05), transform: 'scale(1.002)' }
      }}
    >
      <Typography variant="body2" sx={{ flex: 0.5, fontWeight: 600, color: 'text.secondary' }}>{index}</Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 3 }}>
        <Avatar
          sx={{ width: 40, height: 40, bgcolor: alpha(GOLD_COLOR, 0.1), color: GOLD_COLOR, fontWeight: 700, borderRadius: '12px' }}
        >
          {enquiry.fullName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={800}>{enquiry.fullName}</Typography>
          <Typography variant="caption" color="text.secondary">{enquiry.email}</Typography>
        </Box>
      </Stack>

      <Box sx={{ flex: 2.5 }}>
        <Typography variant="body2" fontWeight={700} color={GOLD_COLOR}>{enquiry.moduleId?.title || 'General Interest'}</Typography>
        <Typography variant="caption" color="text.secondary">{enquiry.contact}</Typography>
      </Box>

      <Typography variant="body2" sx={{ flex: 2, color: 'text.secondary' }}>{new Date(enquiry.createdAt).toLocaleDateString()}</Typography>

      <Stack direction="row" spacing={1} sx={{ flex: 2.5 }} justifyContent="center" onClick={(e) => e.stopPropagation()}>
        <Tooltip title="Start WhatsApp Chat">
          <IconButton size="small" onClick={() => window.open(`https://wa.me/${enquiry.contact}`, '_blank')} sx={{ border: '1px solid #e2e8f0', color: '#25d366', bgcolor: alpha('#25d366', 0.05) }}><WhatsApp fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="View Lead Details">
          <IconButton size="small" onClick={onView} sx={{ border: '1px solid #e2e8f0', color: '#3b82f6', bgcolor: alpha('#3b82f6', 0.05) }}><Visibility fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="Delete Lead">
          <IconButton size="small" onClick={onDelete} sx={{ border: '1px solid #e2e8f0', color: '#ef4444', bgcolor: alpha('#ef4444', 0.05) }}><Delete fontSize="inherit" /></IconButton>
        </Tooltip>
      </Stack>
    </Box>
  </motion.div>
);

const EnquiryDetailDrawer = ({ open, onClose, enquiry }) => {
  if (!enquiry) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, borderRadius: '24px 0 0 24px', p: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={800}>Lead Details</Typography>
        <IconButton onClick={onClose}><Close /></IconButton>
      </Stack>

      <Stack spacing={4}>
        <Box sx={{ p: 3, borderRadius: '24px', background: PREMIUM_DARK, color: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 60, height: 60, bgcolor: alpha(GOLD_COLOR, 0.2), color: GOLD_COLOR, fontSize: '1.5rem', fontWeight: 900, borderRadius: '16px' }}>{enquiry.fullName?.charAt(0)}</Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} color={GOLD_COLOR}>{enquiry.fullName}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Potential Customer</Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <SectionLabel label="Contact Information" />
          <Stack spacing={2.5} mt={2}>
            <DetailItem icon={<Email sx={{ color: GOLD_COLOR }} />} label="Email Address" value={enquiry.email} />
            <DetailItem icon={<Phone sx={{ color: GOLD_COLOR }} />} label="Phone Number" value={enquiry.contact} />
            <DetailItem icon={<CalendarMonth sx={{ color: GOLD_COLOR }} />} label="Received Date" value={new Date(enquiry.createdAt).toLocaleString()} />
          </Stack>
        </Box>

        <Divider sx={{ borderStyle: 'dotted' }} />

        <Box>
          <SectionLabel label="Inquiry Context" />
          <Stack spacing={2.5} mt={2}>
            <DetailItem icon={<Category sx={{ color: GOLD_COLOR }} />} label="Module/Category" value={enquiry.moduleId?.title || 'Ornaments Specialist'} />
            <DetailItem icon={<Diamond sx={{ color: GOLD_COLOR }} />} label="Preferred Style" value="Antique/Traditional Jewelry" />
            <Box sx={{ p: 2, borderRadius: '16px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>Message/Query</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#1e293b' }}>"Interested in bridal collection and custom sets for wedding."</Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} mt="auto">
          <Button fullWidth variant="contained" sx={{ borderRadius: '12px', height: 48, bgcolor: PREMIUM_DARK, color: '#fff', '&:hover': { bgcolor: '#000' } }}>Email Customer</Button>
          <Button fullWidth variant="contained" startIcon={<WhatsApp />} sx={{ borderRadius: '12px', height: 48, bgcolor: '#25d366', color: '#fff', '&:hover': { bgcolor: '#128c7e' } }} onClick={() => window.open(`https://wa.me/${enquiry.contact}`, '_blank')}>WhatsApp</Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
      <Typography variant="body2" fontWeight={800}>{value || 'N/A'}</Typography>
    </Box>
  </Stack>
);

const SectionLabel = ({ label }) => (
  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.65rem' }}>{label}</Typography>
);

export default EnquiriesUI;
