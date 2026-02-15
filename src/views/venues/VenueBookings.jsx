import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    CircularProgress,
    Collapse,
    Button,
    Avatar,
    Chip,
    Grid,
    Divider,
    IconButton,
    Tooltip,
    Drawer,
    useTheme,
    useMediaQuery,
    alpha,
    Menu,
    FormControl,
    InputLabel,
    Badge
} from '@mui/material';
import {
    Search,
    FilterList,
    Sort,
    CheckCircle,
    Cancel,
    AccessTime,
    EventAvailable,
    ExpandMore,
    WhatsApp,
    Phone,
    Email,
    CalendarMonth,
    Person,
    Business,
    Category,
    TrendingUp,
    Clear,
    ArrowUpward,
    ArrowDownward,
    Group,
    LocationOn
} from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- Assets / Constants ---
const API_BASE_URL = 'https://api.bookmyevent.ae';
const VENUE_COLOR = '#3b82f6'; // Premium Blue for Venues
const GOLD_COLOR = '#D4AF37';
const PREMIUM_DARK = '#0f172a';

const getImageUrl = (path, type = 'venues') => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const filename = cleanPath.split('/').pop();
    return `https://api.bookmyevent.ae/uploads/${type}/${filename}`;
};

// Helper to get Provider ID
const getProviderId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        const user = JSON.parse(userStr);
        return user?._id || null;
    } catch {
        return null;
    }
};

const getStatusColor = (status) => {
    const s = String(status || '').toLowerCase();
    if (['accepted', 'confirmed', 'approve', 'approved'].includes(s)) return '#22c55e'; // Green
    if (s === 'pending') return '#f59e0b'; // Amber
    if (['cancelled', 'rejected'].includes(s)) return '#ef4444'; // Red
    if (s === 'completed') return '#3b82f6'; // Blue
    return '#64748b';
};

const getVenueData = (booking) => {
    const pkg = booking.packageId || booking.venueId || booking.moduleId || {};
    return {
        name: pkg.venueName || pkg.name || pkg.title || booking.packageName || 'Venue',
        thumbnail: pkg.thumbnail || booking.thumbnail || '',
        category: pkg.category?.title || pkg.venueType || 'Venue',
        address: pkg.venueAddress || booking.venueAddress || 'N/A',
        id: pkg._id || 'N/A'
    };
};

// --- Main Component ---
const VenueBookings = ({ initialTab = 'All', hideTabs = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State
    const [providerId, setProviderId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tab Mapping
    const tabs = useMemo(() => [
        { label: 'All', value: 0, filterFn: () => true, key: 'All' },
        { label: 'Pending', value: 1, filterFn: (s) => s === 'pending', key: 'Pending' },
        { label: 'Confirmed', value: 2, filterFn: (s, p, b) => ['accepted', 'confirmed', 'approve', 'approved'].includes(s) && new Date(b.bookingDate) >= new Date().setHours(0, 0, 0, 0), key: 'Confirmed' },
        { label: 'Completed', value: 3, filterFn: (s, p, b) => s === 'completed' || s === 'completed bookings' || s === 'done' || (['accepted', 'confirmed'].includes(s) && new Date(b.bookingDate) < new Date().setHours(0, 0, 0, 0)), key: 'Completed' },
        { label: 'Cancelled', value: 4, filterFn: (s) => ['cancelled', 'rejected'].includes(s), key: 'Cancelled' },
        { label: 'Payment Failed', value: 5, filterFn: (s, p) => p === 'failed' || p === 'Payment Failed' || p === 'payment failed', key: 'Payment Failed' },
    ], []);

    const initialIndex = useMemo(() => {
        const found = tabs.findIndex(t => t.key.toLowerCase() === initialTab.toLowerCase());
        return found !== -1 ? found : 0;
    }, [initialTab, tabs]);

    const [tabValue, setTabValue] = useState(initialIndex);

    // Filter & Sort State
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // Advanced Filters
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        paymentStatus: 'all',
        minAmount: '',
        maxAmount: ''
    });

    useEffect(() => {
        const pid = getProviderId();
        if (pid) {
            setProviderId(pid);
            fetchAllBookings(pid);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchAllBookings = async (pid) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/bookings/provider/${pid}`);
            const all = res.data?.data || [];
            const venueBookings = all.filter(b => {
                const mType = String(b.moduleType || '').toLowerCase();
                return mType === 'venue' || mType === 'venues';
            });
            setBookings(venueBookings);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const processedBookings = useMemo(() => {
        let result = [...bookings];

        // 1. Tab Level Filtering
        const currentTab = tabs[tabValue];
        if (currentTab && (currentTab.label !== 'All' || hideTabs)) {
            result = result.filter(b => {
                const status = String(b.status || '').toLowerCase();
                const payStatus = String(b.paymentStatus || '').toLowerCase();
                return currentTab.filterFn(status, payStatus, b);
            });
        }

        // 2. Search Text
        if (searchText.trim()) {
            const lower = searchText.toLowerCase();
            result = result.filter(b =>
                (b._id && b._id.toLowerCase().includes(lower)) ||
                (b.fullName && b.fullName.toLowerCase().includes(lower)) ||
                (b.contactNumber && String(b.contactNumber).includes(lower)) ||
                (b.emailAddress && b.emailAddress.toLowerCase().includes(lower)) ||
                (b.venueName && b.venueName.toLowerCase().includes(lower))
            );
        }

        // 3. Advanced Filters
        if (filters.dateFrom) {
            result = result.filter(b => new Date(b.bookingDate) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            result = result.filter(b => new Date(b.bookingDate) <= new Date(filters.dateTo));
        }
        if (filters.paymentStatus !== 'all') {
            result = result.filter(b => String(b.paymentStatus || '').toLowerCase() === filters.paymentStatus.toLowerCase());
        }
        if (filters.minAmount) {
            result = result.filter(b => parseFloat(b.finalPrice || 0) >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
            result = result.filter(b => parseFloat(b.finalPrice || 0) <= parseFloat(filters.maxAmount));
        }

        // 4. Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.bookingDate || 0);
            const dateB = new Date(b.bookingDate || 0);
            const priceA = parseFloat(a.finalPrice || 0);
            const priceB = parseFloat(b.finalPrice || 0);
            const nameA = (a.fullName || '').toLowerCase();
            const nameB = (b.fullName || '').toLowerCase();

            switch (sortBy) {
                case 'newest': return b._id.localeCompare(a._id);
                case 'date_asc': return dateA - dateB || b._id.localeCompare(a._id);
                case 'date_desc': return dateB - dateA || b._id.localeCompare(a._id);
                case 'price_high': return priceB - priceA || b._id.localeCompare(a._id);
                case 'price_low': return priceA - priceB || b._id.localeCompare(a._id);
                case 'name_asc': return nameA.localeCompare(nameB) || b._id.localeCompare(a._id);
                case 'name_desc': return nameB.localeCompare(nameA) || b._id.localeCompare(a._id);
                default: return b._id.localeCompare(a._id);
            }
        });

        return result;
    }, [bookings, tabValue, searchText, sortBy, tabs, hideTabs, filters]);

    // Stats Calculation
    const stats = useMemo(() => {
        const total = bookings.length;
        const pending = bookings.filter(b => String(b.status).toLowerCase() === 'pending').length;
        const confirmed = bookings.filter(b => ['accepted', 'confirmed', 'approved'].includes(String(b.status).toLowerCase())).length;
        const revenue = bookings.reduce((acc, curr) => acc + parseFloat(curr.finalPrice || 0), 0);
        return { total, pending, confirmed, revenue };
    }, [bookings]);

    const handleOpenDetail = (booking, e) => {
        if (e) e.stopPropagation();
        setSelectedBooking(booking);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedBooking(null);
    };

    const handleUpdateStatus = async (id, newStatus, e) => {
        if (e) e.stopPropagation();
        try {
            let endpoint = '';
            if (newStatus === 'accepted') endpoint = `${API_BASE_URL}/api/bookings/${id}/accept`;
            else if (newStatus === 'rejected') endpoint = `${API_BASE_URL}/api/bookings/${id}/reject`;

            if (!endpoint) return;
            await axios.patch(endpoint);
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
            alert(`Booking ${newStatus === 'accepted' ? 'Confirmed' : 'Rejected'}`);
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update status");
        }
    };

    const handleClearFilters = () => {
        setFilters({
            dateFrom: '',
            dateTo: '',
            paymentStatus: 'all',
            minAmount: '',
            maxAmount: ''
        });
        setSearchText('');
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.dateFrom) count++;
        if (filters.dateTo) count++;
        if (filters.paymentStatus !== 'all') count++;
        if (filters.minAmount) count++;
        if (filters.maxAmount) count++;
        return count;
    }, [filters]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 6 }}>
            {/* Top Navigation Bar / Breadcrumbs */}
            <Box sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                    {tabs[tabValue].label} Venues
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">Bookings</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>{'>'}</Typography>
                    <Typography variant="caption" fontWeight={600} color="#6366f1">{tabs[tabValue].label}</Typography>
                </Stack>
            </Box>

            <Box sx={{ p: { xs: 2, md: 4 } }}>
                {/* Dashboard Stats */}
                {!hideTabs && (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <StatCard label="Total Bookings" value={stats.total} color={GOLD_COLOR} icon={<EventAvailable />} />
                        <StatCard label="Pending Orders" value={stats.pending} color="#f59e0b" icon={<AccessTime />} />
                        <StatCard label="Confirmed" value={stats.confirmed} color="#22c55e" icon={<CheckCircle />} />
                        <StatCard label="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} color={PREMIUM_DARK} icon={<TrendingUp />} />
                    </Grid>
                )}

                {/* Main Content Card */}
                <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
                    {/* Toolbar */}
                    <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>Venue Bookings</Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1} maxWidth={{ md: 700 }}>
                                <TextField
                                    placeholder="Search by ID, Name, Venue..."
                                    size="small"
                                    fullWidth
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: '12px', bgcolor: '#f8fafc' }
                                    }}
                                />
                                <Tooltip title="Sort Options">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                                        startIcon={<Sort />}
                                        sx={{ borderRadius: '12px', minWidth: 100, borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: GOLD_COLOR, color: GOLD_COLOR } }}
                                    >
                                        Sort
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Filter Options">
                                    <Badge badgeContent={activeFilterCount} color="error">
                                        <Button
                                            variant={filterOpen ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => setFilterOpen(!filterOpen)}
                                            startIcon={<FilterList />}
                                            sx={{
                                                borderRadius: '12px',
                                                minWidth: 100,
                                                borderColor: '#e2e8f0',
                                                color: filterOpen ? '#fff' : '#64748b',
                                                bgcolor: filterOpen ? GOLD_COLOR : 'transparent',
                                                '&:hover': { borderColor: GOLD_COLOR, bgcolor: filterOpen ? GOLD_COLOR : alpha(GOLD_COLOR, 0.1) }
                                            }}
                                        >
                                            Filters
                                        </Button>
                                    </Badge>
                                </Tooltip>
                            </Stack>
                        </Stack>

                        {/* Filter Panel */}
                        <Collapse in={filterOpen}>
                            <Box sx={{ mt: 3, p: 3, borderRadius: '16px', bgcolor: alpha(GOLD_COLOR, 0.03), border: `1px solid ${alpha(GOLD_COLOR, 0.1)}` }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" fontWeight={700} color={GOLD_COLOR}>Advanced Filters</Typography>
                                    {activeFilterCount > 0 && (
                                        <Button size="small" startIcon={<Clear />} onClick={handleClearFilters} sx={{ color: '#64748b', textTransform: 'none' }}>
                                            Clear All
                                        </Button>
                                    )}
                                </Stack>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="From Date"
                                            type="date"
                                            value={filters.dateFrom}
                                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ bgcolor: '#fff', borderRadius: '8px' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="To Date"
                                            type="date"
                                            value={filters.dateTo}
                                            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ bgcolor: '#fff', borderRadius: '8px' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <FormControl fullWidth size="small" sx={{ bgcolor: '#fff', borderRadius: '8px' }}>
                                            <InputLabel>Payment Status</InputLabel>
                                            <Select
                                                value={filters.paymentStatus}
                                                label="Payment Status"
                                                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                                            >
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="initiated">Initiated</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                                <MenuItem value="failed">Failed</MenuItem>
                                                <MenuItem value="pending">Pending</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Min Amount"
                                            type="number"
                                            value={filters.minAmount}
                                            onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                            sx={{ bgcolor: '#fff', borderRadius: '8px' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Max Amount"
                                            type="number"
                                            value={filters.maxAmount}
                                            onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                            sx={{ bgcolor: '#fff', borderRadius: '8px' }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>
                    </Box>

                    {/* Tabs */}
                    {!hideTabs && (
                        <Box sx={{ px: 3, borderBottom: '1px solid #f1f5f9' }}>
                            <Tabs
                                value={tabValue}
                                onChange={(e, v) => setTabValue(v)}
                                sx={{
                                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, minWidth: 100, fontSize: '0.9rem', color: '#64748b' },
                                    '& .Mui-selected': { color: '#3b82f6 !important' },
                                    '& .MuiTabs-indicator': { bgcolor: '#3b82f6', height: 3 }
                                }}
                            >
                                {tabs.map(t => <Tab key={t.key} label={t.label} />)}
                            </Tabs>
                        </Box>
                    )}

                    {/* Table Header */}
                    {!isMobile && (
                        <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TableLabel flex={0.5} label="SI#" />
                            <TableLabel flex={1.5} label="Booking ID" />
                            <TableLabel flex={2.5} label="Venue" />
                            <TableLabel flex={1.5} label="Customer" />
                            <TableLabel flex={2.2} label="Email" />
                            <TableLabel flex={1.5} label="Booking Date" />
                            <TableLabel flex={0.8} label="Guests" />
                            <TableLabel flex={1.2} label="Paid" />
                            <TableLabel flex={1.3} label="Total" />
                            <TableLabel flex={1.5} label="Status" />
                            <TableLabel flex={1.2} label="Payment" />
                            <TableLabel flex={1.8} label="Action" textAlign="center" />
                        </Box>
                    )}

                    {/* List Content */}
                    <Box sx={{ minHeight: 400 }}>
                        {loading ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
                                <CircularProgress size={32} thickness={5} />
                            </Stack>
                        ) : processedBookings.length === 0 ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ py: 10, opacity: 0.5 }}>
                                <Typography fontWeight={600}>No bookings found</Typography>
                            </Stack>
                        ) : (
                            processedBookings.map((b, i) => (
                                <BookingRow
                                    key={b._id}
                                    index={i + 1}
                                    booking={b}
                                    isMobile={isMobile}
                                    onUpdateStatus={handleUpdateStatus}
                                    onView={(b) => handleOpenDetail(b)}
                                    statusColor={getStatusColor(b.status)}
                                />
                            ))
                        )}
                    </Box>
                </Paper>
            </Box>

            <DetailDrawer
                open={detailOpen}
                onClose={handleCloseDetail}
                booking={selectedBooking}
                onUpdateStatus={handleUpdateStatus}
                getStatusColor={getStatusColor}
            />

            {/* Sort Menu */}
            <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={() => setSortMenuAnchor(null)}
                PaperProps={{
                    sx: { borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 220, mt: 1 }
                }}
            >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">SORT BY</Typography>
                </Box>
                {[
                    { value: 'newest', label: 'Latest First', icon: <ArrowDownward fontSize="small" /> },
                    { value: 'date_desc', label: 'Event Date (Newest)', icon: <ArrowDownward fontSize="small" /> },
                    { value: 'date_asc', label: 'Event Date (Oldest)', icon: <ArrowUpward fontSize="small" /> },
                    { value: 'price_high', label: 'Amount (High to Low)', icon: <ArrowDownward fontSize="small" /> },
                    { value: 'price_low', label: 'Amount (Low to High)', icon: <ArrowUpward fontSize="small" /> },
                ].map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={sortBy === option.value}
                        onClick={() => { setSortBy(option.value); setSortMenuAnchor(null); }}
                        sx={{ py: 1.5, px: 2, gap: 1.5 }}
                    >
                        {option.icon}
                        <Typography variant="body2">{option.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

/* --- Sub-Components --- */

const StatCard = ({ label, value, color, icon }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Paper
            elevation={0}
            sx={{
                p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: '#fff',
                display: 'flex', alignItems: 'center', gap: 2.5,
                transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }
            }}
        >
            <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 48, height: 48, borderRadius: '14px' }}>
                {icon}
            </Avatar>
            <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{label}</Typography>
                <Typography variant="h5" fontWeight={900} sx={{ color }}>{value}</Typography>
            </Box>
        </Paper>
    </Grid>
);

const TableLabel = ({ label, flex, textAlign = 'left' }) => (
    <Typography variant="caption" fontWeight={800} color="#64748b" sx={{ flex, textAlign, fontSize: '0.7rem', textTransform: 'uppercase' }}>
        {label}
    </Typography>
);

const BookingRow = ({ index, booking, isMobile, onUpdateStatus, onView, statusColor }) => {
    const isPending = String(booking.status).toLowerCase() === 'pending';
    const venue = getVenueData(booking);

    if (isMobile) {
        return (
            <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }} onClick={() => onView(booking)}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                        src={getImageUrl(venue.thumbnail, 'venues')}
                        variant="rounded"
                        sx={{ width: 50, height: 50, border: `1px solid ${alpha(GOLD_COLOR, 0.2)}` }}
                    />
                    <Box flex={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" fontWeight={800} color={GOLD_COLOR}>#{booking._id?.slice(-6)}</Typography>
                            <Chip label={booking.status} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: alpha(statusColor, 0.1), color: statusColor }} />
                        </Stack>
                        <Typography variant="subtitle2" fontWeight={800} noWrap>{venue.name}</Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">{booking.fullName}</Typography>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#10b981' }}>Paid: ₹{(booking.advanceAmount || 0).toLocaleString()}</Typography>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 800 }}>Total: ₹{(booking.finalPrice || 0).toLocaleString()}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mt={1.5} alignItems="center">
                    <Box></Box>
                    <Stack direction="row" spacing={1}>
                        <IconButton size="small" sx={{ border: '1px solid #e2e8f0', color: GOLD_COLOR }} onClick={(e) => { e.stopPropagation(); window.open(`tel:${booking.contactNumber}`); }}><Phone fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ border: '1px solid #e2e8f0', color: '#25d366' }} onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${booking.contactNumber}`); }}><WhatsApp fontSize="small" /></IconButton>
                    </Stack>
                </Stack>
            </Box>
        );
    }

    return (
        <Box
            onClick={() => onView(booking)}
            sx={{
                px: 3, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2,
                cursor: 'pointer',
                transition: 'all 0.2s', '&:hover': { bgcolor: alpha(GOLD_COLOR, 0.05), zIndex: 1 }
            }}
        >
            <Typography variant="body2" sx={{ flex: 0.5, fontWeight: 600, color: 'text.secondary' }}>{index}</Typography>
            <Typography variant="body2" sx={{ flex: 1.5, fontWeight: 700, color: GOLD_COLOR }}>#{booking._id?.slice(-6)}</Typography>

            <Box sx={{ flex: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    src={getImageUrl(venue.thumbnail, 'venues')}
                    variant="rounded"
                    sx={{ width: 44, height: 44, border: `1px solid ${alpha(GOLD_COLOR, 0.2)}`, bgcolor: '#f1f5f9' }}
                >
                    <Business sx={{ fontSize: 20, color: GOLD_COLOR }} />
                </Avatar>
                <Box>
                    <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 150 }}>{venue.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{venue.category}</Typography>
                </Box>
            </Box>

            <Typography variant="body2" sx={{ flex: 1.5, fontWeight: 700 }}>{booking.fullName}</Typography>
            <Typography variant="body2" sx={{ flex: 2.2, color: 'text.secondary', fontSize: '0.8rem' }} noWrap>{booking.emailAddress}</Typography>
            <Typography variant="body2" sx={{ flex: 1.5 }}>{new Date(booking.bookingDate).toLocaleDateString()}</Typography>
            <Typography variant="body2" sx={{ flex: 0.8, fontWeight: 700 }}>{booking.numberOfGuests || '-'}</Typography>

            <Typography variant="body2" sx={{ flex: 1.2, fontWeight: 700, color: '#10b981' }}>
                ₹{(booking.advanceAmount || 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1.3, fontWeight: 800 }}>
                ₹{(booking.finalPrice || 0).toLocaleString()}
            </Typography>
            <Box sx={{ flex: 1.5 }}>
                <Chip label={booking.status} size="small" sx={{ fontWeight: 800, bgcolor: alpha(statusColor, 0.1), color: statusColor }} />
            </Box>
            <Box sx={{ flex: 1.2 }}>
                <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                    {booking.paymentStatus || 'Pending'}
                </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flex: 1.8 }} justifyContent="center">
                {isPending ? (
                    <>
                        <Tooltip title="Confirm">
                            <IconButton size="small" color="success" onClick={(e) => onUpdateStatus(booking._id, 'accepted', e)}>
                                <CheckCircle fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                            <IconButton size="small" color="error" onClick={(e) => onUpdateStatus(booking._id, 'rejected', e)}>
                                <Cancel fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Button onClick={(e) => onView(booking, e)} size="small" variant="outlined" sx={{ minWidth: 60, textTransform: 'none' }}>View</Button>
                        <Button size="small" variant="outlined" sx={{ minWidth: 80, textTransform: 'none' }}>Download</Button>
                    </>
                )}
            </Stack>
        </Box>
    );
};

const DetailDrawer = ({ open, onClose, booking, onUpdateStatus, getStatusColor }) => {
    if (!booking) return null;
    const statusColor = getStatusColor(booking.status);
    const venue = getVenueData(booking);

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, borderRadius: '24px 0 0 24px', p: 4 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight={800}>Booking Details</Typography>
                <IconButton onClick={onClose}><Cancel /></IconButton>
            </Stack>

            <Stack spacing={4}>
                {/* Status Box */}
                <Box sx={{ p: 3, borderRadius: '20px', bgcolor: alpha(statusColor, 0.05), border: '1px solid', borderColor: alpha(statusColor, 0.1) }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">STATUS</Typography>
                            <Typography variant="h6" fontWeight={800} color={statusColor} sx={{ textTransform: 'capitalize' }}>{booking.status}</Typography>
                        </Box>
                        <Chip label={booking.moduleType || 'Venue'} sx={{ fontWeight: 700, bgcolor: '#fff' }} />
                    </Stack>
                </Box>

                {/* Venue Info */}
                <Box sx={{ p: 3, borderRadius: '24px', bgcolor: alpha(GOLD_COLOR, 0.03), border: '1px solid', borderColor: alpha(GOLD_COLOR, 0.1) }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">VENUE INFO</Typography>
                    <Stack direction="row" spacing={3} mt={2} alignItems="center">
                        <Avatar src={getImageUrl(venue.thumbnail, 'venues')} variant="rounded" sx={{ width: 80, height: 80, borderRadius: '16px' }} />
                        <Box flex={1}>
                            <Typography variant="h6" fontWeight={800}>{venue.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{venue.category}</Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                                <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>{venue.address}</Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                {/* Customer Info */}
                <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">CUSTOMER PROFILE</Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <DetailRow icon={<Person />} label="Full Name" value={booking.fullName} />
                        <DetailRow icon={<Email />} label="Email" value={booking.emailAddress} />
                        <DetailRow icon={<Phone />} label="Phone" value={booking.contactNumber} />
                        <DetailRow icon={<Group />} label="Guest Count" value={booking.numberOfGuests || 'Not specified'} />
                    </Stack>
                </Box>

                <Divider />

                {/* Booking Details */}
                <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">EVENT DETAILS</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <DetailRow icon={<CalendarMonth />} label="Event Date" value={new Date(booking.bookingDate).toLocaleDateString()} />
                        </Grid>
                        <Grid item xs={6}>
                            <DetailRow icon={<AccessTime />} label="Booking ID" value={`#${booking._id?.slice(-8).toUpperCase()}`} />
                        </Grid>
                    </Grid>
                </Box>

                {/* Pricing */}
                <Box sx={{ p: 3, borderRadius: '24px', background: PREMIUM_DARK, color: '#fff' }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Payment Breakdown</Typography>
                    <Stack spacing={2} mt={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">Paid Amount</Typography>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#10b981' }}>₹{(booking.advanceAmount || 0).toLocaleString()}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">Remaining Amount</Typography>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#f59e0b' }}>₹{(Math.max(0, (booking.finalPrice || 0) - (booking.advanceAmount || 0))).toLocaleString()}</Typography>
                        </Stack>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>GRAND TOTAL</Typography>
                                <Typography variant="h5" fontWeight={900} color={GOLD_COLOR}>₹{(booking.finalPrice || 0).toLocaleString()}</Typography>
                            </Box>
                            <Chip label={booking.paymentStatus || 'Pending'} color="primary" sx={{ fontWeight: 800, textTransform: 'capitalize' }} />
                        </Stack>
                    </Stack>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={2}>
                    {String(booking.status).toLowerCase() === 'pending' && (
                        <>
                            <Button fullWidth variant="outlined" color="error" onClick={(e) => { onUpdateStatus(booking._id, 'rejected', e); onClose(); }}>Reject</Button>
                            <Button fullWidth variant="contained" color="success" onClick={(e) => { onUpdateStatus(booking._id, 'accepted', e); onClose(); }}>Confirm</Button>
                        </>
                    )}
                    <Button fullWidth variant="soft" startIcon={<WhatsApp />} sx={{ bgcolor: alpha('#25d366', 0.1), color: '#25d366' }} onClick={() => window.open(`https://wa.me/${booking.contactNumber}`, '_blank')}>Chat</Button>
                </Stack>
            </Stack>
        </Drawer>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box sx={{ color: 'text.secondary', mt: 0.3 }}>{icon}</Box>
        <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
            <Typography variant="body2" fontWeight={600}>{value}</Typography>
        </Box>
    </Stack>
);

export default VenueBookings;
