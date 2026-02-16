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
    WhatsApp,
    Phone,
    Email,
    CalendarMonth,
    Person,
    TrendingUp,
    Clear,
    ArrowUpward,
    ArrowDownward,
    LocationOn,
    Diamond,
    Category
} from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const API_BASE_URL = 'https://api.bookmyevent.ae';
const GOLD_COLOR = '#D4AF37';
const PREMIUM_DARK = '#0f172a';

// --- Generic Component ---
const PremiumBookings = ({
    moduleType,
    moduleUrlName,
    moduleLabel,
    primaryColor = '#3b82f6',
    moduleIcon: ModuleIcon,
    initialTab = 'All',
    hideTabs = false,
    getDataFn = (b) => ({
        name: b.packageName || b.moduleName || moduleLabel,
        thumbnail: b.thumbnail || '',
        category: b.categoryName || b.moduleType || moduleLabel,
        id: b.packageId || b._id || 'N/A'
    })
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State
    const [providerId, setProviderId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tab Mapping
    const tabs = useMemo(() => {
        const baseTabs = [
            { label: 'All', value: 0, filterFn: () => true, key: 'All' },
            { label: 'Scheduled', value: 1, filterFn: (s) => s === 'scheduled', key: 'Scheduled', hidden: moduleUrlName !== 'transport' },
            { label: 'Pending', value: 2, filterFn: (s) => s === 'pending', key: 'Pending' },
            { label: 'Confirmed', value: 3, filterFn: (s, p, b) => ['accepted', 'confirmed', 'approve', 'approved'].includes(s) && new Date(b.bookingDate) >= new Date().setHours(0, 0, 0, 0), key: 'Confirmed' },
            { label: 'Ongoing', value: 4, filterFn: (s) => s === 'ongoing', key: 'Ongoing', hidden: moduleUrlName !== 'transport' },
            { label: 'Completed', value: 5, filterFn: (s, p, b) => s === 'completed' || s === 'completed bookings' || s === 'done' || (['accepted', 'confirmed'].includes(s) && new Date(b.bookingDate) < new Date().setHours(0, 0, 0, 0)), key: 'Completed' },
            { label: 'Cancelled', value: 6, filterFn: (s) => ['cancelled', 'rejected'].includes(s), key: 'Cancelled' },
            { label: 'Payment Failed', value: 7, filterFn: (s, p) => p === 'failed' || p === 'Payment Failed' || p === 'payment failed', key: 'Payment Failed' },
        ];
        return baseTabs.filter(t => !t.hidden).map((t, idx) => ({ ...t, value: idx }));
    }, [moduleUrlName]);

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
        const getPid = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) return null;
                const user = JSON.parse(userStr);
                return user?._id || null;
            } catch { return null; }
        };

        const pid = getPid();
        if (pid) {
            setProviderId(pid);
            fetchAllBookings(pid);
        } else {
            setLoading(false);
        }
    }, [moduleType]);

    const fetchAllBookings = async (pid) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/bookings/provider/${pid}`);
            const all = res.data?.data || [];
            const filtered = all.filter(b => {
                const mType = String(b.moduleType || '').toLowerCase();
                const mTypes = Array.isArray(moduleType) ? moduleType.map(m => m.toLowerCase()) : [moduleType.toLowerCase()];
                return mTypes.includes(mType);
            });
            setBookings(filtered);
        } catch (err) {
            console.error(`Error fetching ${moduleLabel} bookings:`, err);
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
                (b.emailAddress && b.emailAddress.toLowerCase().includes(lower))
            );
        }

        // 3. Advanced Filters
        if (filters.dateFrom) result = result.filter(b => new Date(b.bookingDate) >= new Date(filters.dateFrom));
        if (filters.dateTo) result = result.filter(b => new Date(b.bookingDate) <= new Date(filters.dateTo));
        if (filters.paymentStatus !== 'all') result = result.filter(b => String(b.paymentStatus || '').toLowerCase() === filters.paymentStatus.toLowerCase());
        if (filters.minAmount) result = result.filter(b => parseFloat(b.finalPrice || 0) >= parseFloat(filters.minAmount));
        if (filters.maxAmount) result = result.filter(b => parseFloat(b.finalPrice || 0) <= parseFloat(filters.maxAmount));

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

    const stats = useMemo(() => {
        const total = bookings.length;
        const pending = bookings.filter(b => String(b.status).toLowerCase() === 'pending').length;
        const confirmed = bookings.filter(b => ['accepted', 'confirmed', 'approved'].includes(String(b.status).toLowerCase())).length;
        const revenue = bookings.reduce((acc, curr) => acc + parseFloat(curr.finalPrice || 0), 0);
        return { total, pending, confirmed, revenue };
    }, [bookings]);

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

    const getStatusColor = (status) => {
        const s = String(status || '').toLowerCase();
        if (['accepted', 'confirmed', 'approve', 'approved'].includes(s)) return '#22c55e';
        if (s === 'pending') return '#f59e0b';
        if (['cancelled', 'rejected'].includes(s)) return '#ef4444';
        if (s === 'completed') return '#3b82f6';
        return '#64748b';
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;

        const lowerPath = path.toLowerCase();
        // If it's already a full relative path like /uploads/photography/xyz.jpg
        if (lowerPath.startsWith('/uploads/')) return `${API_BASE_URL}${path}`;
        if (lowerPath.startsWith('uploads/')) return `${API_BASE_URL}/${path}`;

        // Module specific mapping for upload folders
        const folderMap = {
            'transport': 'vehicles',
            'vehicle': 'vehicles',
            'cake': 'cakes',
            'photography': 'photography',
            'catering': 'catering',
            'makeup': 'makeup',
            'venue': 'venues',
            'venues': 'venues',
            'package': 'packages'
        };

        const folder = folderMap[String(moduleUrlName).toLowerCase()] || moduleUrlName;
        const filename = path.split('/').pop();
        return `${API_BASE_URL}/uploads/${folder}/${filename}`;
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 6 }}>
            <Box sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                    {tabs[tabValue].label} {moduleLabel}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">Bookings</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>{'>'}</Typography>
                    <Typography variant="caption" fontWeight={600} color="#6366f1">{tabs[tabValue].label}</Typography>
                </Stack>
            </Box>

            <Box sx={{ p: { xs: 2, md: 4 } }}>
                {!hideTabs && (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <StatCard label="Total Bookings" value={stats.total} color={GOLD_COLOR} icon={<EventAvailable />} />
                        <StatCard label="Pending Orders" value={stats.pending} color="#f59e0b" icon={<AccessTime />} />
                        <StatCard label="Confirmed" value={stats.confirmed} color="#22c55e" icon={<CheckCircle />} />
                        <StatCard label="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} color={PREMIUM_DARK} icon={<TrendingUp />} />
                    </Grid>
                )}

                <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>{moduleLabel} Bookings</Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1} maxWidth={{ md: 700 }}>
                                <TextField
                                    placeholder="Search by ID, Name..."
                                    size="small"
                                    fullWidth
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: '12px', bgcolor: '#f8fafc' }
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                                    startIcon={<Sort />}
                                    sx={{ borderRadius: '12px', minWidth: 100, borderColor: '#e2e8f0', color: '#64748b' }}
                                >
                                    Sort
                                </Button>
                                <Badge badgeContent={Object.values(filters).filter(v => v && v !== 'all').length} color="error">
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
                                            bgcolor: filterOpen ? GOLD_COLOR : 'transparent'
                                        }}
                                    >
                                        Filters
                                    </Button>
                                </Badge>
                            </Stack>
                        </Stack>

                        <Collapse in={filterOpen}>
                            <Box sx={{ mt: 3, p: 3, borderRadius: '16px', bgcolor: alpha(GOLD_COLOR, 0.03), border: `1px solid ${alpha(GOLD_COLOR, 0.1)}` }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" fontWeight={700} color={GOLD_COLOR}>Advanced Filters</Typography>
                                    <Button size="small" startIcon={<Clear />} onClick={() => { setFilters({ dateFrom: '', dateTo: '', paymentStatus: 'all', minAmount: '', maxAmount: '' }); setSearchText(''); }} sx={{ color: '#64748b' }}>
                                        Clear All
                                    </Button>
                                </Stack>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="From Date" type="date" value={filters.dateFrom} onChange={(e) => setFilters(p => ({ ...p, dateFrom: e.target.value }))} InputLabelProps={{ shrink: true }} /></Grid>
                                    <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="To Date" type="date" value={filters.dateTo} onChange={(e) => setFilters(p => ({ ...p, dateTo: e.target.value }))} InputLabelProps={{ shrink: true }} /></Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Payment</InputLabel>
                                            <Select value={filters.paymentStatus} label="Payment" onChange={(e) => setFilters(p => ({ ...p, paymentStatus: e.target.value }))}>
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="initiated">Initiated</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                                <MenuItem value="failed">Failed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}><TextField fullWidth size="small" label="Min ₹" type="number" value={filters.minAmount} onChange={(e) => setFilters(p => ({ ...p, minAmount: e.target.value }))} /></Grid>
                                    <Grid item xs={12} sm={6} md={2}><TextField fullWidth size="small" label="Max ₹" type="number" value={filters.maxAmount} onChange={(e) => setFilters(p => ({ ...p, maxAmount: e.target.value }))} /></Grid>
                                </Grid>
                            </Box>
                        </Collapse>
                    </Box>

                    {!hideTabs && (
                        <Box sx={{ px: 3, borderBottom: '1px solid #f1f5f9' }}>
                            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, minWidth: 100 }, '& .Mui-selected': { color: primaryColor + ' !important' }, '& .MuiTabs-indicator': { bgcolor: primaryColor } }}>
                                {tabs.map(t => <Tab key={t.key} label={t.label} />)}
                            </Tabs>
                        </Box>
                    )}

                    {!isMobile && (
                        <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TableLabel flex={0.5} label="SI#" />
                            <TableLabel flex={1.5} label="Booking ID" />
                            <TableLabel flex={2.5} label={moduleLabel} />
                            <TableLabel flex={2} label="Customer" />
                            <TableLabel flex={2.5} label="Email" />
                            <TableLabel flex={1.5} label="Booking Date" />
                            <TableLabel flex={1.2} label="Paid" />
                            <TableLabel flex={1.3} label="Total" />
                            <TableLabel flex={1.5} label="Status" />
                            <TableLabel flex={1.2} label="Payment" />
                            <TableLabel flex={1.8} label="Action" textAlign="center" />
                        </Box>
                    )}

                    <Box sx={{ minHeight: 400 }}>
                        {loading ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}><CircularProgress size={32} /></Stack>
                        ) : processedBookings.length === 0 ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ py: 10, opacity: 0.5 }}><Typography fontWeight={600}>No bookings found</Typography></Stack>
                        ) : (
                            processedBookings.map((b, i) => (
                                <BookingRow
                                    key={b._id}
                                    index={i + 1}
                                    booking={b}
                                    isMobile={isMobile}
                                    onUpdateStatus={handleUpdateStatus}
                                    onView={(b) => { setSelectedBooking(b); setDetailOpen(true); }}
                                    statusColor={getStatusColor(b.status)}
                                    getDataFn={getDataFn}
                                    getImageUrl={getImageUrl}
                                    ModuleIcon={ModuleIcon}
                                    moduleLabel={moduleLabel}
                                />
                            ))
                        )}
                    </Box>
                </Paper>
            </Box>

            <DetailDrawer
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                booking={selectedBooking}
                onUpdateStatus={handleUpdateStatus}
                getStatusColor={getStatusColor}
                getDataFn={getDataFn}
                getImageUrl={getImageUrl}
                moduleLabel={moduleLabel}
                primaryColor={primaryColor}
            />

            <Menu anchorEl={sortMenuAnchor} open={Boolean(sortMenuAnchor)} onClose={() => setSortMenuAnchor(null)}>
                <Box sx={{ px: 2, py: 1 }}><Typography variant="caption" fontWeight={700}>SORT BY</Typography></Box>
                {[{ v: 'newest', l: 'Latest First', i: <ArrowDownward fontSize="small" /> }, { v: 'date_desc', l: 'Event Date (New)', i: <ArrowDownward fontSize="small" /> }, { v: 'date_asc', l: 'Event Date (Old)', i: <ArrowUpward fontSize="small" /> }, { v: 'price_high', l: 'Price (High)', i: <ArrowDownward fontSize="small" /> }, { v: 'price_low', l: 'Price (Low)', i: <ArrowUpward fontSize="small" /> }].map((o) => (
                    <MenuItem key={o.v} onClick={() => { setSortBy(o.v); setSortMenuAnchor(null); }} selected={sortBy === o.v} sx={{ gap: 1.5 }}>
                        {o.i} <Typography variant="body2">{o.l}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

// --- Helpers ---
const getPaidAmount = (booking, moduleLabel) => {
    const fullPaymentModules = ['Cake', 'Boutique', 'Boutiques', 'Ornament', 'Ornaments', 'boutique', 'ornament'];
    const isCompleted = ['completed', 'paid', 'success'].includes(String(booking.paymentStatus || '').toLowerCase());

    if (fullPaymentModules.includes(moduleLabel) && isCompleted) {
        return booking.finalPrice || 0;
    }
    return booking.advanceAmount || 0;
};

// --- Sub-Components ---
const StatCard = ({ label, value, color, icon }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2.5, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' } }}>
            <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 48, height: 48, borderRadius: '14px' }}>{icon}</Avatar>
            <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{label}</Typography>
                <Typography variant="h5" fontWeight={900} sx={{ color }}>{value}</Typography>
            </Box>
        </Paper>
    </Grid>
);

const TableLabel = ({ label, flex, textAlign = 'left' }) => (
    <Typography variant="caption" fontWeight={800} color="#64748b" sx={{ flex, textAlign, fontSize: '0.7rem', textTransform: 'uppercase' }}>{label}</Typography>
);

const BookingRow = ({ index, booking, isMobile, onUpdateStatus, onView, statusColor, getDataFn, getImageUrl, ModuleIcon, moduleLabel }) => {
    const isPending = String(booking.status).toLowerCase() === 'pending';
    const data = getDataFn(booking);

    if (isMobile) {
        return (
            <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }} onClick={() => onView(booking)}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={getImageUrl(data.thumbnail)} variant="rounded" sx={{ width: 50, height: 50, border: `1px solid ${alpha(GOLD_COLOR, 0.2)}` }} />
                    <Box flex={1}>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="caption" fontWeight={800} color={GOLD_COLOR}>#{booking._id?.slice(-6)}</Typography><Chip label={booking.status} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: alpha(statusColor, 0.1), color: statusColor }} /></Stack>
                        <Typography variant="subtitle2" fontWeight={800} noWrap>{data.name}</Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">{booking.fullName}</Typography>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#10b981' }}>
                                    Paid: ₹{getPaidAmount(booking, moduleLabel).toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 800 }}>
                                    Total: ₹{(booking.finalPrice || 0).toLocaleString()}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        );
    }

    return (
        <Box onClick={() => onView(booking)} sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', '&:hover': { bgcolor: alpha(GOLD_COLOR, 0.05) } }}>
            <Typography variant="body2" sx={{ flex: 0.5, fontWeight: 600 }}>{index}</Typography>
            <Typography variant="body2" sx={{ flex: 1.5, fontWeight: 700, color: GOLD_COLOR }}>#{booking._id?.slice(-6)}</Typography>
            <Box sx={{ flex: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={getImageUrl(data.thumbnail)} variant="rounded" sx={{ width: 44, height: 44, border: `1px solid ${alpha(GOLD_COLOR, 0.2)}` }}>{ModuleIcon && <ModuleIcon sx={{ fontSize: 20 }} />}</Avatar>
                <Box><Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 150 }}>{data.name}</Typography><Typography variant="caption" color="text.secondary">{data.category}</Typography></Box>
            </Box>
            <Typography variant="body2" sx={{ flex: 2, fontWeight: 700 }}>{booking.fullName}</Typography>
            <Typography variant="body2" sx={{ flex: 2.5, color: 'text.secondary', fontSize: '0.8rem' }} noWrap>{booking.emailAddress}</Typography>
            <Typography variant="body2" sx={{ flex: 1.5 }}>{new Date(booking.bookingDate).toLocaleDateString()}</Typography>
            <Typography variant="body2" sx={{ flex: 1.2, fontWeight: 700, color: '#10b981' }}>
                ₹{getPaidAmount(booking, moduleLabel).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1.3, fontWeight: 800 }}>
                ₹{(booking.finalPrice || 0).toLocaleString()}
            </Typography>
            <Box sx={{ flex: 1.5 }}><Chip label={booking.status} size="small" sx={{ fontWeight: 800, bgcolor: alpha(statusColor, 0.1), color: statusColor }} /></Box>
            <Box sx={{ flex: 1.2 }}><Typography variant="caption" fontWeight={700} sx={{ textTransform: 'capitalize' }}>{booking.paymentStatus || 'Pending'}</Typography></Box>
            <Stack direction="row" spacing={1} sx={{ flex: 1.8 }} justifyContent="center">
                {isPending ? (
                    <><IconButton size="small" color="success" onClick={(e) => onUpdateStatus(booking._id, 'accepted', e)}><CheckCircle fontSize="small" /></IconButton><IconButton size="small" color="error" onClick={(e) => onUpdateStatus(booking._id, 'rejected', e)}><Cancel fontSize="small" /></IconButton></>
                ) : (
                    <Button onClick={(e) => onView(booking, e)} size="small" variant="outlined">View</Button>
                )}
            </Stack>
        </Box>
    );
};

const renderTimeSlot = (timeSlot) => {
    if (!timeSlot) return null;
    if (typeof timeSlot === 'string') return timeSlot;
    if (Array.isArray(timeSlot)) return timeSlot.map(ts => (typeof ts === 'object' ? ts.label || ts.time : ts)).join(', ');
    if (typeof timeSlot === 'object') return timeSlot.label || timeSlot.time || 'N/A';
    return null;
};

const DetailDrawer = ({ open, onClose, booking, getStatusColor, getDataFn, getImageUrl, moduleLabel, primaryColor }) => {
    if (!booking) return null;
    const statusColor = getStatusColor(booking.status);
    const data = getDataFn(booking);

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, borderRadius: '24px 0 0 24px', p: 4 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}><Typography variant="h5" fontWeight={800}>Booking Details</Typography><IconButton onClick={onClose}><Cancel /></IconButton></Stack>
            <Stack spacing={4}>
                <Box sx={{ p: 3, borderRadius: '20px', bgcolor: alpha(statusColor, 0.05), border: '1px solid', borderColor: alpha(statusColor, 0.1) }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>Current Status</Typography>
                            <Typography variant="h6" fontWeight={800} color={statusColor} sx={{ textTransform: 'capitalize' }}>{booking.status}</Typography>
                        </Box>
                        <Chip label={booking.bookingType || booking.packageType || booking.moduleType || moduleLabel} sx={{ fontWeight: 700, bgcolor: '#fff', textTransform: 'capitalize' }} />
                    </Stack>
                </Box>
                <Box sx={{ p: 3, borderRadius: '24px', bgcolor: alpha(GOLD_COLOR, 0.03), border: '1px solid', borderColor: alpha(GOLD_COLOR, 0.1) }}>
                    <Typography variant="caption" fontWeight={800}>PACKAGE INFO</Typography>
                    <Stack direction="row" spacing={3} mt={2} alignItems="center">
                        <Avatar src={getImageUrl(data.thumbnail)} variant="rounded" sx={{ width: 80, height: 80, borderRadius: '16px' }} />
                        <Box flex={1}><Typography variant="h6" fontWeight={800}>{data.name}</Typography><Typography variant="body2" color="text.secondary">{data.category}</Typography></Box>
                    </Stack>
                    {(data.sizes && data.sizes.length > 0) && (
                        <Box mt={2}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>AVAILABLE SIZES</Typography>
                            <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
                                {data.sizes.map((s, idx) => <Chip key={idx} label={s} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />)}
                            </Stack>
                        </Box>
                    )}
                    {(data.colors && data.colors.length > 0) && (
                        <Box mt={2}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>AVAILABLE COLORS</Typography>
                            <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
                                {data.colors.map((c, idx) => <Chip key={idx} label={c} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />)}
                            </Stack>
                        </Box>
                    )}
                </Box>
                {booking.transportDetails && (
                    <Box sx={{ p: 3, borderRadius: '24px', bgcolor: alpha(primaryColor, 0.03), border: '1px solid', borderColor: alpha(primaryColor, 0.1) }}>
                        <Typography variant="caption" fontWeight={800}>TRIP DETAILS</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {booking.transportDetails.tripType && <DetailRow label="Trip Type" value={booking.transportDetails.tripType} />}
                            {(booking.transportDetails.hours > 0) && <DetailRow label="Duration (Hours)" value={booking.transportDetails.hours} />}
                            {(booking.transportDetails.days > 0) && <DetailRow label="Duration (Days)" value={booking.transportDetails.days} />}
                            {(booking.transportDetails.distanceKm > 0) && <DetailRow label="Distance (KM)" value={booking.transportDetails.distanceKm} />}
                            {booking.transportDetails.decorationIncluded && <DetailRow label="Decoration" value={`Included (+₹${booking.transportDetails.decorationPrice})`} />}
                        </Stack>
                    </Box>
                )}
                <Box>
                    <Typography variant="caption" fontWeight={800}>CUSTOMER INFO</Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <DetailRow icon={<Person />} label="Full Name" value={booking.fullName} />
                        <DetailRow icon={<Email />} label="Email" value={booking.emailAddress} />
                        <DetailRow icon={<Phone />} label="Phone" value={booking.contactNumber} />
                        <DetailRow icon={<CalendarMonth />} label="Event Date" value={new Date(booking.bookingDate).toLocaleDateString()} />
                        {booking.timeSlot && <DetailRow icon={<AccessTime />} label="Time Slot" value={renderTimeSlot(booking.timeSlot)} />}
                    </Stack>
                </Box>
                <Box sx={{ p: 3, borderRadius: '24px', background: PREMIUM_DARK, color: '#fff' }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Payment Breakdown</Typography>
                    <Stack spacing={2} mt={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">Paid Amount</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#10b981' }}>
                                ₹{getPaidAmount(booking, moduleLabel).toLocaleString()}
                            </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">Remaining Amount</Typography>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#f59e0b' }}>
                                ₹{(['Cake', 'Boutique', 'Boutiques', 'Ornament', 'Ornaments'].includes(moduleLabel) && ['completed', 'paid', 'success'].includes(String(booking.paymentStatus || '').toLowerCase())
                                    ? 0
                                    : Math.max(0, (booking.finalPrice || 0) - (booking.advanceAmount || 0))).toLocaleString()}
                            </Typography>
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
                <Stack direction="row" spacing={2}><Button fullWidth variant="soft" startIcon={<WhatsApp />} sx={{ bgcolor: alpha('#25d366', 0.1), color: '#25d366' }} onClick={() => window.open(`https://wa.me/${booking.contactNumber}`, '_blank')}>Chat</Button></Stack>
            </Stack>
        </Drawer>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start"><Box sx={{ color: 'text.secondary', mt: 0.3 }}>{icon}</Box><Box><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="body2" fontWeight={600}>{value || 'N/A'}</Typography></Box></Stack>
);

export default PremiumBookings;
