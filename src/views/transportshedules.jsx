import React, { useState, useEffect } from 'react';
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
    Divider,
    Checkbox,
    FormControlLabel,
    Snackbar
} from '@mui/material';
import {
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    AccessTime as AccessTimeIcon,
    Delete as DeleteIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Close as CloseIcon,
    DirectionsCar as CarIcon,
    Groups as PeopleIcon,
    Assignment as NoteIcon,
    LocalShipping as ShippingIcon,
    Payments as PaymentsIcon,
    Timer as TimerIcon,
    Route as RouteIcon
} from '@mui/icons-material';

const API_BASE_URL = 'https://api.bookmyevent.ae';

const renderSafe = (val) => {
    if (!val) return '';
    if (typeof val === 'string' || typeof val === 'number') return val;
    if (typeof val === 'object') {
        return val.en || val.name || val.title || val.packageName || val.label || (typeof val.title === 'object' ? renderSafe(val.title) : val._id ? '[Object]' : JSON.stringify(val));
    }
    return String(val);
};

function VehicleSchedules() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [openDialog, setOpenDialog] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [successOpen, setSuccessOpen] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        emailAddress: '',
        address: '',
        numberOfGuests: '',
        additionalNotes: '',
        moduleId: '',
        vehicleId: '',
        tripType: 'perDay',
        days: 1,
        hours: '',
        distanceKm: '',
        bookingDate: '',
        timeSlot: [],
        paymentType: 'Cash',
        bookingType: 'Direct'
    });

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

    useEffect(() => {
        if (providerId) {
            fetchBookings();
            fetchModules();
            fetchVehicles();
        }
    }, [currentDate, providerId]);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/provider/${providerId}`);
            const data = await response.json();
            if (data.success) {
                // Filter for transport/vehicle bookings
                const filtered = (data.data || []).filter(b => 
                    String(b.moduleType || '').toLowerCase().includes('transport') || 
                    String(b.moduleId?.title || '').toLowerCase().includes('transport')
                );
                setBookings(filtered);
            } else {
                setError(data.message || 'Failed to fetch bookings');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/modules`);
            const data = await response.json();
            const modulesList = data.success ? (data.data || data.modules || []) : (Array.isArray(data) ? data : []);
            const transportModule = modulesList.find(m => (m.title || m.name || '').toLowerCase().includes('transport'));
            if (transportModule) {
                setModules([transportModule]);
                if (!formData.moduleId) {
                    setFormData(prev => ({ ...prev, moduleId: transportModule._id }));
                }
            }
        } catch (err) { }
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/vehicles/provider/${providerId}`);
            const data = await response.json();
            setVehicles(data.success ? (data.data || []) : []);
        } catch (err) {
            setVehicles([]);
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
        } catch (err) { } finally {
            setDeleteLoading(null);
        }
    };

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const getCurrentMonthBookings = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const status = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const dayBookings = bookings.filter(b => {
                if (!b.bookingDate) return false;
                const bookingDateStr = String(b.bookingDate).split('T')[0];
                const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                return bookingDateStr === targetDateStr;
            });

            if (dayBookings.length === 0) status[day] = 'free';
            else status[day] = 'booked';

            const isPastMonth = year < todayYear || (year === todayYear && month < todayMonth);
            const isPastDay = isPastMonth || (month === todayMonth && year === todayYear && day < todayDate);
            if (isPastDay) status[day] = 'none';
        }
        return status;
    };

    const bookingStatus = getCurrentMonthBookings();

    const getBookingsForSelectedDate = () => {
        return bookings.filter(b => {
            if (!b.bookingDate) return false;
            const bookingDateStr = String(b.bookingDate).split('T')[0];
            const targetDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
            return bookingDateStr === targetDateStr;
        });
    };

    const selectedBookings = getBookingsForSelectedDate();

    const { firstDay, daysInMonth } = (() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    })();

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const getStatusColor = (status) => {
        if (status === 'booked') return '#ef5350';
        if (status === 'free') return '#66bb6a';
        return 'transparent';
    };

    const changeMonth = (dir) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1);
        setCurrentDate(newDate);
        if (newDate.getMonth() === todayMonth && newDate.getFullYear() === todayYear) {
            setSelectedDate(todayDate);
        } else {
            setSelectedDate(1);
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => (
            <Box key={day} sx={{ textAlign: 'center', p: { xs: '8px 4px', md: '16px' }, color: '#777', fontSize: { xs: '11px', md: '14px' }, fontWeight: '600' }}>
                {day}
            </Box>
        ));

        for (let i = 0; i < firstDay; i++) {
            days.push(<Box key={`empty-${i}`} sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#f9f9f9', borderRadius: '12px' }} />);
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
                        position: 'relative', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        minHeight: { xs: '50px', md: '100px' }, 
                        cursor: isPastDay ? 'default' : 'pointer', 
                        borderRadius: { xs: '8px', md: '16px' }, 
                        transition: 'all 0.3s', 
                        bgcolor: isSelected ? 'rgba(239, 83, 80, 0.05)' : (isPastDay ? '#fdfdfd' : '#fff'), 
                        border: isSelected ? '1px solid #ef5350' : (isPastDay ? '1px solid #f9f9f9' : '1px solid #f0f0f0'), 
                        opacity: isPastDay ? 0.4 : 1,
                        '&:hover': { 
                            transform: !isPastDay && { md: 'translateY(-4px)' }, 
                            boxShadow: !isPastDay && '0 6px 16px rgba(0,0,0,0.08)', 
                            borderColor: isPastDay ? '#f9f9f9' : '#ef5350', 
                            zIndex: 1 
                        } 
                    }}
                >
                    <Box sx={{ fontSize: { xs: '14px', md: '22px' }, fontWeight: isToday || isSelected ? '600' : '400', color: isPastDay ? '#ccc' : (isToday ? '#fff' : (isSelected ? '#ef5350' : '#333')), width: { xs: '28px', md: '48px' }, height: { xs: '28px', md: '48px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: isToday ? '#ef5350' : 'transparent', mb: { xs: '2px', md: '8px' } }}>{day}</Box>
                    <Box sx={{ width: { xs: '6px', md: '10px' }, height: { xs: '6px', md: '10px' }, borderRadius: '50%', bgcolor: getStatusColor(status) }} />
                </Box>
            );
        }
        return days;
    };

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleTimeSlotChange = (slot) => {
        setFormData(prev => {
            const timeSlot = prev.timeSlot.includes(slot) ? prev.timeSlot.filter(s => s !== slot) : [...prev.timeSlot, slot];
            return { ...prev, timeSlot };
        });
    };

    const handleSubmit = async () => {
        if (!formData.fullName.trim() || !formData.contactNumber.trim() || !formData.moduleId || !formData.vehicleId) {
            setError('Please fill all required fields');
            return;
        }
        setSubmitLoading(true);
        setError(null);
        try {
            const selectedVehicle = vehicles.find(v => v._id === formData.vehicleId);
            
            // Web app matching structure
            const bookingData = {
                providerId: providerId,
                moduleId: formData.moduleId,
                vehicleId: formData.vehicleId,
                fullName: formData.fullName,
                contactNumber: formData.contactNumber,
                emailAddress: formData.emailAddress,
                address: formData.address,
                bookingDate: formData.bookingDate,
                timeSlot: formData.timeSlot.length > 0 ? formData.timeSlot : ['Full Day'],
                numberOfGuests: Number(formData.numberOfGuests) || 1,
                tripType: formData.tripType,
                days: formData.tripType === 'perDay' ? (Number(formData.days) || 1) : null,
                hours: formData.tripType === 'hourly' ? (Number(formData.hours) || null) : null,
                distanceKm: formData.tripType === 'distanceWise' ? (Number(formData.distanceKm) || null) : null,
                paymentType: formData.paymentType,
                additionalNotes: formData.additionalNotes,
                bookingType: 'Direct',
                status: 'Accepted',
                paymentStatus: 'Paid'
            };

            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            const data = await response.json();
            if (data.success) {
                setSuccessOpen(true);
                setOpenDialog(false);
                fetchBookings();
                resetForm();
            } else {
                setError(data.message || 'Failed to create booking');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setFormData({ 
            fullName: '', 
            contactNumber: '', 
            emailAddress: '', 
            address: '', 
            numberOfGuests: '',
            additionalNotes: '', 
            moduleId: modules[0]?._id || '', 
            vehicleId: '', 
            tripType: 'perDay',
            days: 1,
            hours: '',
            distanceKm: '',
            bookingDate: todayStr, 
            timeSlot: [],
            paymentType: 'Cash', 
            bookingType: 'Direct' 
        });
        setActiveStep(0);
    };

    const handleNext = () => setActiveStep(prev => prev + 1);
    const handleBack = () => setActiveStep(prev => prev - 1);
    const handleOpenDialog = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = selectedDate;
        const selectedBookingDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setFormData(prev => ({
            ...prev,
            bookingDate: selectedBookingDate,
            moduleId: modules[0]?._id || prev.moduleId
        }));
        setOpenDialog(true);
        setActiveStep(0);
    };
    const handleCloseDialog = () => { setOpenDialog(false); setError(null); setActiveStep(0); };
    const steps = ['Client Info', 'Trip Selection', 'Finalize'];

    return (
        <Box sx={{ width: '100%', p: { xs: '8px', md: '40px' }, bgcolor: '#fafafa', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: '16px', md: '32px' }, px: { xs: '4px', md: '20px' } }}>
                <IconButton onClick={() => changeMonth(-1)} sx={{ bgcolor: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><ChevronLeftIcon /></IconButton>
                <Typography sx={{ fontSize: { xs: '20px', md: '32px' }, fontWeight: '600' }}>{monthName}</Typography>
                <IconButton onClick={() => changeMonth(1)} sx={{ bgcolor: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><ChevronRightIcon /></IconButton>
            </Box>

            <Box sx={{ bgcolor: '#fff', borderRadius: { xs: '16px', md: '24px' }, p: { xs: '12px 8px', md: '40px' }, mb: { xs: '24px', md: '40px' }, border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: { xs: '4px', md: '16px' } }}>{renderCalendarDays()}</Box>
            </Box>

            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: '24px', mb: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Stack direction="row" justifyContent="center" spacing={3} flexWrap="wrap">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef5350' }} /><Typography color="#666">Unavailable</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#66bb6a' }} /><Typography color="#666">Available</Typography></Box>
                </Stack>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, bgcolor: '#fff', borderRadius: '24px', p: { xs: '20px', md: '32px' }, mb: '32px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: { xs: 70, md: 100 }, height: { xs: 70, md: 100 }, bgcolor: '#ef5350', borderRadius: '20px', color: '#fff', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.2)' }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: '600' }}>{new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}</Typography>
                    <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700 }}>{selectedDate}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="#333">{selectedBookings.length === 0 ? 'Clear Schedule' : `${selectedBookings.length} Active Trips`}</Typography>
                    <Typography color="#999" fontSize="14px">{selectedBookings.length === 0 ? 'No trips assigned for this date' : 'Scheduled vehicle movements'}</Typography>
                </Box>
                <Button variant="contained" onClick={handleOpenDialog} sx={{ bgcolor: '#ef5350', borderRadius: '12px', px: 4, height: 48, fontWeight: 700, '&:hover': { bgcolor: '#d32f2f' } }}>Add Trip</Button>
            </Box>

            <Grid container spacing={3}>
                {selectedBookings.length === 0 ? (
                    <Grid item xs={12}><Paper sx={{ p: 4, textAlign: 'center', borderRadius: '24px', border: '2px dashed #eee' }}><Typography color="#999">No vehicle bookings for this date.</Typography></Paper></Grid>
                ) : (
                    selectedBookings.map(b => (
                        <Grid item xs={12} md={6} lg={4} key={b._id}>
                            <Paper sx={{ p: 3, borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#ef5350' }} />
                                <Stack direction="row" justifyContent="space-between" mb={2}>
                                    <Chip 
                                        label={b.tripType === 'perDay' ? `${b.days} Day(s)` : (b.tripType === 'hourly' ? `${b.hours} Hour(s)` : `${b.distanceKm} Km`)} 
                                        size="small" 
                                        icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} 
                                        sx={{ bgcolor: 'rgba(239, 83, 80, 0.1)', color: '#ef5350', fontWeight: 700 }} 
                                    />
                                    <IconButton size="small" onClick={() => handleDeleteBooking(b._id)} sx={{ color: '#ccc', '&:hover': { color: '#ef5350' } }} disabled={deleteLoading === b._id}>
                                        {deleteLoading === b._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                                    </IconButton>
                                </Stack>
                                <Typography variant="h6" fontWeight={800} mb={1}>{renderSafe(b.fullName)}</Typography>
                                <Typography variant="body2" color="#666" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CarIcon sx={{ fontSize: 16, color: '#ef5350' }} />
                                    {b.vehicleId ? renderSafe(b.vehicleId.name || b.vehicleId.brand || 'Vehicle') : 'Vehicle'}
                                </Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><PhoneIcon sx={{ fontSize: 16 }} /><Typography variant="body2">{renderSafe(b.contactNumber)}</Typography></Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><PeopleIcon sx={{ fontSize: 16 }} /><Typography variant="body2">{b.numberOfGuests || 1} Passengers</Typography></Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
                <DialogTitle sx={{ position: 'relative' }}>
                    <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ position: 'absolute', right: 20, top: 20, color: (theme) => theme.palette.grey[500], transition: 'all 0.3s ease', '&:hover': { transform: 'rotate(90deg)', color: '#ef5350', bgcolor: 'rgba(239, 83, 80, 0.1)' } }}><CloseIcon /></IconButton>
                    <Typography variant="h4" fontWeight={800} sx={{ mt: 2, textAlign: 'center' }}>Vehicle Booking Form</Typography>
                    <Box sx={{ width: '80%', mx: 'auto', mt: 3, mb: 1 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map(label => <Step key={label} sx={{ '& .MuiStepIcon-root.Mui-active': { color: '#ef5350' }, '& .MuiStepIcon-root.Mui-completed': { color: '#ef5350' } }}><StepLabel>{label}</StepLabel></Step>)}
                        </Stepper>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 4, pb: 4, pt: 2, minHeight: 450 }}>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}
                    <Box sx={{ mt: 2 }}>
                        {activeStep === 0 && (
                            <Fade in={activeStep === 0}><Stack spacing={3}>
                                <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Email Address" type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    </Grid>
                                </Grid>
                                <TextField fullWidth label="Pickup/Drop-off Address" name="address" value={formData.address} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                            </Stack></Fade>
                        )}
                        {activeStep === 1 && (
                            <Fade in={activeStep === 1}><Stack spacing={3}>
                                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                                    <InputLabel>Select Vehicle</InputLabel>
                                    <Select label="Select Vehicle" name="vehicleId" value={formData.vehicleId} onChange={handleInputChange}>
                                        {vehicles.map(v => <MenuItem key={v._id} value={v._id}>{renderSafe(v.name)} ({renderSafe(v.brand)})</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                                            <InputLabel>Trip Type</InputLabel>
                                            <Select label="Trip Type" name="tripType" value={formData.tripType} onChange={handleInputChange}>
                                                <MenuItem value="perDay">Full Day</MenuItem>
                                                <MenuItem value="hourly">Hourly Basis</MenuItem>
                                                <MenuItem value="distanceWise">Distance Wise</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {formData.tripType === 'perDay' && <TextField fullWidth label="Number of Days" type="number" name="days" value={formData.days} onChange={handleInputChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />}
                                        {formData.tripType === 'hourly' && <TextField fullWidth label="Number of Hours" type="number" name="hours" value={formData.hours} onChange={handleInputChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />}
                                        {formData.tripType === 'distanceWise' && <TextField fullWidth label="Kilometers" type="number" name="distanceKm" value={formData.distanceKm} onChange={handleInputChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />}
                                    </Grid>
                                </Grid>
                                <TextField fullWidth label="Number of Passengers" type="number" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PeopleIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                            </Stack></Fade>
                        )}
                        {activeStep === 2 && (
                            <Fade in={activeStep === 2}><Stack spacing={3}>
                                <Box sx={{ p: 3, borderRadius: '20px', border: '1px solid #eee', bgcolor: '#fafafa' }}>
                                    <Typography variant="subtitle2" fontWeight={800} color="#555" gutterBottom>Booking Date</Typography>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" fontWeight={800} color="#555" gutterBottom>Select Service Window</Typography>
                                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                        <FormControlLabel control={<Checkbox checked={formData.timeSlot.includes('Morning')} onChange={() => handleTimeSlotChange('Morning')} sx={{ color: '#ef5350', '&.Mui-checked': { color: '#ef5350' } }} />} label="Morning (9-1)" />
                                        <FormControlLabel control={<Checkbox checked={formData.timeSlot.includes('Evening')} onChange={() => handleTimeSlotChange('Evening')} sx={{ color: '#ef5350', '&.Mui-checked': { color: '#ef5350' } }} />} label="Evening (6-10)" />
                                    </Stack>
                                </Box>
                                <TextField fullWidth multiline rows={4} label="Trip Details / Route Notes" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="E.g. Full day duty, specific routes..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                            </Stack></Fade>
                        )}
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
                        {activeStep > 0 ? (
                            <Button fullWidth onClick={handleBack} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, border: '2px solid #eee', color: '#666', '&:hover': { border: '2px solid #ccc' } }}>Back</Button>
                        ) : (
                            <Button fullWidth onClick={handleCloseDialog} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, border: '2px solid #eee', color: '#666', '&:hover': { border: '2px solid #ccc' } }}>Cancel</Button>
                        )}
                        {activeStep < steps.length - 1 ? (
                            <Button fullWidth variant="contained" onClick={handleNext} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', '&:hover': { bgcolor: '#d32f2f' } }}>Next Step</Button>
                        ) : (
                            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={submitLoading} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.3)', '&:hover': { bgcolor: '#d32f2f' } }}>{submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Trip'}</Button>
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

export default VehicleSchedules;