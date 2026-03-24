import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    InputAdornment,
    Paper,
    Stack,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Fade,
    Snackbar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import SpaIcon from '@mui/icons-material/Spa';

const API_BASE_URL = 'https://api.bookmyevent.ae';

function MehandiSchedules() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [openDialog, setOpenDialog] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [successOpen, setSuccessOpen] = useState(false);

    // Store resolved moduleId in a ref so it persists reliably across renders
    const resolvedModuleIdRef = useRef('');

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const getProviderId = () => {
        let id = localStorage.getItem('providerId') || localStorage.getItem('userId');
        if (!id) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    id = user._id || user.id || user.userId;
                } catch (e) { }
            }
        }
        return id;
    };

    const providerId = getProviderId();

    const buildDateString = (year, month, day) =>
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        emailAddress: '',
        address: '',
        additionalNotes: '',
        packageId: '',
        bookingDate: buildDateString(today.getFullYear(), today.getMonth(), today.getDate()),
        paymentType: 'Cash',
    });

    // ─── Fetch moduleId once on mount ────────────────────────────────────────────
    useEffect(() => {
        fetchModuleId();
    }, []);

    useEffect(() => {
        if (providerId) {
            fetchBookings();
            fetchMehandiPackages();
        }
    }, [currentDate, providerId]);

    /**
     * Resolve Mehandi moduleId using multiple strategies:
     * 1. Cached in localStorage as 'mehandiModuleId'
     * 2. Search /api/modules for a mehandi/mehndi/henna module
     * 3. Fall back to generic 'moduleId' in localStorage
     */
    const fetchModuleId = async () => {
        // Strategy 1: already cached from a previous session
        const cached = localStorage.getItem('mehandiModuleId');
        if (cached) {
            resolvedModuleIdRef.current = cached;
            return cached;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/modules`);
            const data = await response.json();
            const modulesList = data.success
                ? (data.data || data.modules || [])
                : (Array.isArray(data) ? data : []);

            // Exact title match
            let found = modulesList.find(m => {
                const t = (m.title || m.name || '').toLowerCase().trim();
                return ['mehandi', 'mehndi', 'mehandi artist', 'mehndi artist'].includes(t);
            });

            // Partial match fallback
            if (!found) {
                found = modulesList.find(m => {
                    const t = (m.title || m.name || '').toLowerCase();
                    return t.includes('mehandi') || t.includes('mehndi') || t.includes('henna');
                });
            }

            if (found?._id) {
                resolvedModuleIdRef.current = found._id;
                localStorage.setItem('mehandiModuleId', found._id); // cache for next time
                return found._id;
            }
        } catch (_) { }

        // Strategy 3: generic stored moduleId
        const generic = localStorage.getItem('moduleId');
        if (generic) {
            resolvedModuleIdRef.current = generic;
            return generic;
        }

        return null;
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/provider/${providerId}`);
            const data = await response.json();
            if (data.success) {
                const filtered = (data.data || []).filter(b =>
                    String(b.moduleType || '').toLowerCase().includes('mehandi') ||
                    String(b.moduleType || '').toLowerCase().includes('mehndi') ||
                    !!b.mehandiId
                );
                setBookings(filtered);
            }
        } catch (_) {
        } finally {
            setLoading(false);
        }
    };

    const fetchMehandiPackages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/mehandi/vendor/${providerId}`);
            const data = await response.json();
            setPackages(data.success ? (data.data || []) : []);
        } catch (_) {
            setPackages([]);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        setDeleteLoading(bookingId);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                setBookings(prev => prev.filter(b => b._id !== bookingId));
                alert('Booking deleted successfully!');
            }
        } catch (_) {
        } finally {
            setDeleteLoading(null);
        }
    };

    // ─── Calendar helpers ─────────────────────────────────────────────────────────
    const getCurrentMonthBookings = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const status = {};
        for (let day = 1; day <= daysInMonth; day++) {
            const targetStr = buildDateString(year, month, day);
            const dayBookings = bookings.filter(b =>
                b.bookingDate && String(b.bookingDate).split('T')[0] === targetStr
            );
            const totalSlots = dayBookings.length;
            if (totalSlots === 0) status[day] = 'free';
            else status[day] = 'booked';

            const isPastMonth = year < todayYear || (year === todayYear && month < todayMonth);
            const isPastDay = isPastMonth || (month === todayMonth && year === todayYear && day < todayDate);
            if (isPastDay) status[day] = 'none';
        }
        return status;
    };

    const bookingStatus = getCurrentMonthBookings();

    const getBookingsForSelectedDate = () => {
        const targetStr = buildDateString(currentDate.getFullYear(), currentDate.getMonth(), selectedDate);
        return bookings.filter(b => b.bookingDate && String(b.bookingDate).split('T')[0] === targetStr);
    };
    const selectedBookings = getBookingsForSelectedDate();

    const { firstDay, daysInMonth } = (() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return {
            firstDay: new Date(year, month, 1).getDay(),
            daysInMonth: new Date(year, month + 1, 0).getDate(),
        };
    })();

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const getStatusColor = (status) => {
        if (status === 'booked') return '#ef5350';
        if (status === 'available') return '#ffd54f';
        if (status === 'free') return '#66bb6a';
        return 'transparent';
    };

    const changeMonth = (dir) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1);
        setCurrentDate(newDate);
        setSelectedDate(
            newDate.getMonth() === todayMonth && newDate.getFullYear() === todayYear ? todayDate : 1
        );
    };

    const renderCalendarDays = () => {
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <Box key={`empty-${i}`} sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#f9f9f9', borderRadius: '12px' }} />
            );
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const status = bookingStatus[day] || 'free';
            const isToday = day === todayDate && currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear;
            const isPastMonth = currentDate.getFullYear() < todayYear || (currentDate.getFullYear() === todayYear && currentDate.getMonth() < todayMonth);
            const isPastDay = isPastMonth || (currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear && day < todayDate);
            const isSelected = day === selectedDate;
            days.push(
                <Box
                    key={day}
                    onClick={() => !isPastDay && setSelectedDate(day)}
                    sx={{
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        minHeight: { xs: '50px', md: '100px' },
                        cursor: isPastDay ? 'default' : 'pointer',
                        borderRadius: { xs: '8px', md: '16px' }, transition: 'all 0.3s',
                        bgcolor: isSelected ? 'rgba(239, 83, 80, 0.05)' : (isPastDay ? '#fdfdfd' : '#fff'),
                        border: isSelected ? '1px solid #ef5350' : (isPastDay ? '1px solid #f9f9f9' : '1px solid #f0f0f0'),
                        opacity: isPastDay ? 0.4 : 1,
                        '&:hover': {
                            transform: !isPastDay && { md: 'translateY(-4px)' },
                            boxShadow: !isPastDay && '0 6px 16px rgba(0,0,0,0.08)',
                            borderColor: isPastDay ? '#f9f9f9' : '#ef5350', zIndex: 1
                        }
                    }}
                >
                    <Box sx={{
                        fontSize: { xs: '14px', md: '22px' },
                        fontWeight: isToday || isSelected ? '600' : '400',
                        color: isPastDay ? '#ccc' : (isToday ? '#fff' : (isSelected ? '#ef5350' : '#333')),
                        width: { xs: '28px', md: '48px' }, height: { xs: '28px', md: '48px' },
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%', bgcolor: isToday ? '#ef5350' : 'transparent',
                        mb: { xs: '2px', md: '8px' }
                    }}>{day}</Box>
                    <Box sx={{ width: { xs: '6px', md: '10px' }, height: { xs: '6px', md: '10px' }, borderRadius: '50%', bgcolor: getStatusColor(status) }} />
                </Box>
            );
        }
        return days;
    };

    // ─── Form helpers ─────────────────────────────────────────────────────────────
    const handleInputChange = (e) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));



    // ─── Submit ───────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!formData.fullName.trim()) { setError('Please fill in Full Name'); return; }
        if (!formData.contactNumber.trim()) { setError('Please fill in Contact Number'); return; }
        if (!formData.packageId) { setError('Please select a Mehandi Package'); return; }


        // If moduleId still not resolved, attempt one final fetch
        if (!resolvedModuleIdRef.current) {
            const id = await fetchModuleId();
            if (!id) {
                setError('Unable to resolve Mehandi Module. Please refresh the page and try again.');
                return;
            }
        }

        setSubmitLoading(true);
        setError(null);

        try {
            const bookingData = {
                providerId,
                moduleId: resolvedModuleIdRef.current,   // ✅ required by backend
                mehandiId: formData.packageId,
                venueId: null,
                numberOfGuests: 0,
                fullName: formData.fullName,
                contactNumber: formData.contactNumber,
                emailAddress: formData.emailAddress || '',
                address: formData.address || '',
                bookingDate: formData.bookingDate,        // ✅ required by backend
                timeSlot: [],
                paymentType: formData.paymentType,
                additionalNotes: formData.additionalNotes || '',
                bookingType: 'Direct',                    // ✅ required by backend
                status: 'Accepted',
                paymentStatus: 'Paid',
            };

            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            const data = await response.json();

            if (data.success) {
                setSuccessOpen(true);
                setOpenDialog(false);
                fetchBookings();
                resetForm();
            } else {
                setError(data.message || 'Failed to create booking. Please try again.');
            }
        } catch (_) {
            setError('Error connecting to server. Please check your connection.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            contactNumber: '',
            emailAddress: '',
            address: '',
            additionalNotes: '',
            packageId: '',
            bookingDate: buildDateString(today.getFullYear(), today.getMonth(), today.getDate()),
            paymentType: 'Cash',
        });
        setActiveStep(0);
        setError(null);
    };

    const handleNext = () => {
        setError(null);
        if (activeStep === 0) {
            if (!formData.fullName.trim()) { setError('Please fill in Full Name'); return; }
            if (!formData.contactNumber.trim()) { setError('Please fill in Contact Number'); return; }
        }
        if (activeStep === 1) {
            if (!formData.packageId) { setError('Please select a Mehandi Package'); return; }
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => { setError(null); setActiveStep(prev => prev - 1); };

    const handleOpenDialog = () => {
        const dateStr = buildDateString(currentDate.getFullYear(), currentDate.getMonth(), selectedDate);
        setFormData(prev => ({ ...prev, bookingDate: dateStr }));
        setOpenDialog(true);
        setActiveStep(0);
        setError(null);
    };

    const handleCloseDialog = () => { setOpenDialog(false); setError(null); setActiveStep(0); };

    const isPastDaySelected = (() => {
        const isPastMonth = currentDate.getFullYear() < todayYear ||
            (currentDate.getFullYear() === todayYear && currentDate.getMonth() < todayMonth);
        return isPastMonth ||
            (currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear && selectedDate < todayDate);
    })();

    const steps = ['Customer Info', 'Service Details', 'Notes'];

    return (
        <Box sx={{ width: '100%', p: { xs: '8px', md: '40px' }, bgcolor: '#fafafa', minHeight: '100vh' }}>

            {/* Month navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: '16px', md: '32px' }, px: { xs: '4px', md: '20px' } }}>
                <IconButton onClick={() => changeMonth(-1)} sx={{ bgcolor: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><ChevronLeftIcon /></IconButton>
                <Typography sx={{ fontSize: { xs: '20px', md: '32px' }, fontWeight: '600' }}>{monthName}</Typography>
                <IconButton onClick={() => changeMonth(1)} sx={{ bgcolor: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><ChevronRightIcon /></IconButton>
            </Box>

            {/* Calendar grid */}
            <Box sx={{ bgcolor: '#fff', borderRadius: { xs: '16px', md: '24px' }, p: { xs: '12px 8px', md: '40px' }, mb: { xs: '24px', md: '40px' }, border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: { xs: '4px', md: '16px' } }}>{renderCalendarDays()}</Box>
            </Box>

            {/* Legend */}
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: '24px', mb: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Stack direction="row" justifyContent="center" spacing={3} flexWrap="wrap">
                    {[['#ef5350', 'Booked'], ['#66bb6a', 'Fully Free']].map(([color, label]) => (
                        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
                            <Typography color="#666">{label}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* Selected date bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, bgcolor: '#fff', borderRadius: '24px', p: { xs: '20px', md: '32px' }, mb: '32px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: { xs: 70, md: 100 }, height: { xs: 70, md: 100 }, bgcolor: '#ef5350', borderRadius: '20px', color: '#fff', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.2)' }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: '600' }}>
                        {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700 }}>{selectedDate}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="#333">
                        {selectedBookings.length === 0 ? 'No Bookings' : `${selectedBookings.length} Direct Bookings`}
                    </Typography>
                    <Typography color="#999" fontSize="14px">
                        {selectedBookings.length === 0 ? 'All slots available for manual entry' : 'Reserved slots for this date'}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={handleOpenDialog}
                    disabled={isPastDaySelected}
                    sx={{ bgcolor: '#ef5350', borderRadius: '12px', px: 4, height: 48, fontWeight: 700, '&:hover': { bgcolor: '#d32f2f' } }}
                >
                    Add Booking
                </Button>
            </Box>

            {/* Booking cards */}
            <Grid container spacing={3}>
                {selectedBookings.length === 0 ? (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '24px', border: '2px dashed #eee' }}>
                            <Typography color="#999">No bookings scheduled for this date.</Typography>
                        </Paper>
                    </Grid>
                ) : (
                    selectedBookings.map(b => (
                        <Grid item xs={12} md={6} lg={4} key={b._id}>
                            <Paper sx={{ p: 3, borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#ef5350' }} />
                                <Stack direction="row" justifyContent="space-between" mb={2}>

                                    <IconButton size="small" onClick={() => handleDeleteBooking(b._id)} sx={{ color: '#ccc', '&:hover': { color: '#ef5350' } }} disabled={deleteLoading === b._id}>
                                        {deleteLoading === b._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                                    </IconButton>
                                </Stack>
                                <Typography variant="h6" fontWeight={800} mb={2}>{b.fullName}</Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><PersonIcon sx={{ fontSize: 16 }} /><Typography variant="body2">{b.contactNumber}</Typography></Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><SpaIcon sx={{ fontSize: 16 }} /><Typography variant="body2">Mehandi Service</Typography></Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* ── Manual Booking Dialog ─────────────────────────────────────────── */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
                <DialogTitle sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{ position: 'absolute', right: 20, top: 20, color: 'grey.500', transition: 'all 0.3s', '&:hover': { transform: 'rotate(90deg)', color: '#ef5350', bgcolor: 'rgba(239,83,80,0.1)' } }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h4" fontWeight={800} sx={{ mt: 2, textAlign: 'center' }}>Create Manual Booking</Typography>
                    <Box sx={{ width: '80%', mx: 'auto', mt: 3, mb: 1 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map(label => (
                                <Step key={label} sx={{ '& .MuiStepIcon-root.Mui-active': { color: '#ef5350' }, '& .MuiStepIcon-root.Mui-completed': { color: '#ef5350' } }}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ px: 4, pb: 4, pt: 2, minHeight: 400 }}>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

                    <Box sx={{ mt: 2 }}>
                        {/* Step 0 – Customer Info */}
                        {activeStep === 0 && (
                            <Fade in>
                                <Stack spacing={3}>
                                    <TextField fullWidth label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#ef5350' }} /></InputAdornment> }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    <TextField fullWidth label="Contact Number *" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#ef5350' }} /></InputAdornment> }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    <TextField fullWidth label="Email Address" type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#ef5350' }} /></InputAdornment> }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    <TextField fullWidth label="Home Address" name="address" value={formData.address} onChange={handleInputChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: '#ef5350' }} /></InputAdornment> }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                </Stack>
                            </Fade>
                        )}

                        {/* Step 1 – Service Details */}
                        {activeStep === 1 && (
                            <Fade in>
                                <Stack spacing={3}>
                                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                                        <InputLabel>Select Mehandi Package *</InputLabel>
                                        <Select label="Select Mehandi Package *" name="packageId" value={formData.packageId} onChange={handleInputChange}>
                                            {packages.length === 0
                                                ? <MenuItem disabled value="">No packages available</MenuItem>
                                                : packages.map(pkg => (
                                                    <MenuItem key={pkg._id} value={pkg._id}>
                                                        {pkg.packageName || pkg.packageTitle || pkg.name || pkg.title}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>Selected Date</Typography>
                                        <TextField
                                            fullWidth disabled
                                            value={new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
                                                .toLocaleDateString('en-US', { dateStyle: 'full' })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#f8fafc' } }}
                                        />
                                    </Box>
                                </Stack>
                            </Fade>
                        )}

                        {/* Step 2 – Schedule & Notes */}
                        {activeStep === 2 && (
                            <Fade in>
                                <Box>

                                    <TextField
                                        fullWidth multiline rows={4}
                                        label="Special Instructions / Notes"
                                        name="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={handleInputChange}
                                        placeholder="Type any specific requests here..."
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                                    />
                                </Box>
                            </Fade>
                        )}
                    </Box>

                    {/* Navigation buttons */}
                    <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
                        {activeStep > 0 ? (
                            <Button fullWidth onClick={handleBack}
                                sx={{ borderRadius: '16px', fontWeight: 700, height: 55, border: '2px solid #eee', color: '#666', '&:hover': { border: '2px solid #ccc' } }}>
                                Back
                            </Button>
                        ) : (
                            <Button fullWidth onClick={handleCloseDialog}
                                sx={{ borderRadius: '16px', fontWeight: 700, height: 55, border: '2px solid #eee', color: '#666', '&:hover': { border: '2px solid #ccc' } }}>
                                Cancel
                            </Button>
                        )}
                        {activeStep < steps.length - 1 ? (
                            <Button fullWidth variant="contained" onClick={handleNext}
                                sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', '&:hover': { bgcolor: '#d32f2f' } }}>
                                Next Step
                            </Button>
                        ) : (
                            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={submitLoading}
                                sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', boxShadow: '0 8px 16px rgba(239,83,80,0.3)', '&:hover': { bgcolor: '#d32f2f' } }}>
                                {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                            </Button>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSuccessOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        borderRadius: '14px',
                        fontWeight: 600,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        minWidth: '280px'
                    }}
                >
                    🎉 Booking created successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default MehandiSchedules;