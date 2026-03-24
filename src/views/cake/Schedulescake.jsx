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
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
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
    Cake as CakeIcon,
    Assignment as NoteIcon,
    Add as AddIcon,
    ShoppingCart as CartIcon
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

function CakeSchedules() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [openDialog, setOpenDialog] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [packages, setPackages] = useState([]);
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
        additionalNotes: '',
        moduleId: '',
        bookingDate: '',
        paymentType: 'Cash',
        bookingType: 'Direct'
    });

    const [cart, setCart] = useState([]);
    const [currentSelection, setCurrentSelection] = useState({
        packageId: '',
        variationId: '',
        cakeMessage: ''
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
            fetchCakePackages();
        }
    }, [currentDate, providerId]);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/provider/${providerId}`);
            const data = await response.json();
            if (data.success) {
                const filtered = (data.data || []).filter(b => 
                    String(b.moduleType || '').toLowerCase().includes('cake')
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
            const filtered = modulesList.filter(m => (m.title || m.name || '').toLowerCase().includes('cake'));
            setModules(filtered);
            if (filtered.length > 0 && !formData.moduleId) {
                setFormData(prev => ({ ...prev, moduleId: filtered[0]._id }));
            }
        } catch (err) { }
    };

    const fetchCakePackages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cakes/provider/${providerId}`);
            const data = await response.json();
            setPackages(data.success ? (data.data || []) : []);
        } catch (err) {
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
            const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isPast = dateToCheck < new Date(todayYear, todayMonth, todayDate);

            days.push(
                <Box 
                    key={day} 
                    onClick={() => !isPast && setSelectedDate(day)} 
                    sx={{ 
                        position: 'relative', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        minHeight: { xs: '50px', md: '100px' }, 
                        cursor: isPast ? 'not-allowed' : 'pointer', 
                        borderRadius: { xs: '8px', md: '16px' }, 
                        transition: 'all 0.3s', 
                        bgcolor: isPast ? '#f5f5f5' : (isSelected ? 'rgba(239, 83, 80, 0.05)' : '#fff'), 
                        opacity: isPast ? 0.5 : 1,
                        border: isSelected ? '1px solid #ef5350' : '1px solid #f0f0f0', 
                        '&:hover': { 
                            transform: isPast ? 'none' : { md: 'translateY(-4px)' }, 
                            boxShadow: isPast ? 'none' : '0 6px 16px rgba(0,0,0,0.08)', 
                            borderColor: isPast ? '#f9f9f9' : '#ef5350', 
                            zIndex: 1 
                        } 
                    }}
                >
                    <Box sx={{ fontSize: { xs: '14px', md: '22px' }, fontWeight: isToday || isSelected ? '600' : '400', color: isToday ? '#fff' : (isSelected ? '#ef5350' : '#333'), width: { xs: '28px', md: '48px' }, height: { xs: '28px', md: '48px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: isToday ? '#ef5350' : 'transparent', mb: { xs: '2px', md: '8px' } }}>{day}</Box>
                    <Box sx={{ width: { xs: '6px', md: '10px' }, height: { xs: '6px', md: '10px' }, borderRadius: '50%', bgcolor: isPast ? '#ccc' : getStatusColor(status) }} />
                </Box>
            );
        }
        return days;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectionChange = (e) => {
        const { name, value } = e.target;
        setCurrentSelection(prev => ({ ...prev, [name]: value }));
        if (name === 'packageId') {
            setCurrentSelection(prev => ({ ...prev, variationId: '' }));
        }
    };

    const addToCart = () => {
        if (!currentSelection.packageId || !currentSelection.variationId) {
            setError('Please select a cake and its variation first');
            return;
        }

        const pkg = packages.find(p => p._id === currentSelection.packageId);
        const variation = (pkg?.variations || []).find(v => v._id === currentSelection.variationId || v.id === currentSelection.variationId);

        if (!variation) return;

        const cartItem = {
            id: Date.now(), // Local UI ID
            cakeId: pkg._id,
            variationId: variation._id || variation.id,
            name: pkg.name || pkg.title || 'Cake',
            price: variation.price || pkg.finalPrice || pkg.basePrice,
            quantity: 1,
            totalPrice: variation.price || pkg.finalPrice || pkg.basePrice,
            image: variation.image || pkg.thumbnail || pkg.images?.[0],
            message: currentSelection.cakeMessage,
            weight: variation.name?.split('-')[0]?.trim() || pkg.weight,
            itemType: variation.name?.split('-')[1]?.trim() || pkg.itemType
        };

        setCart(prev => [...prev, cartItem]);
        setCurrentSelection({ packageId: '', variationId: '', cakeMessage: '' });
        setError(null);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleSubmit = async () => {
        if (!formData.fullName.trim() || !formData.contactNumber.trim() || !formData.moduleId) {
            setError('Please fill customer info first');
            return;
        }
        if (cart.length === 0) {
            setError('Your cart is empty. Please add at least one cake.');
            return;
        }

        setSubmitLoading(true);
        setError(null);
        try {
            const bookingData = {
                providerId: providerId,
                moduleId: formData.moduleId,
                fullName: formData.fullName,
                contactNumber: formData.contactNumber,
                emailAddress: formData.emailAddress,
                address: formData.address,
                bookingDate: formData.bookingDate,
                timeSlot: ['Full Day'],
                cakeCart: cart.map(({ id, ...rest }) => rest),
                deliveryType: 'Takeaway', // Default to Takeaway since it's a direct shop order
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
            additionalNotes: '', 
            moduleId: modules[0]?._id || '', 
            bookingDate: todayStr, 
            paymentType: 'Cash', 
            bookingType: 'Direct' 
        });
        setCart([]);
        setCurrentSelection({ packageId: '', variationId: '', cakeMessage: '' });
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
    const steps = ['Customer Info', 'Add Cakes', 'Review & Note'];

    const selectedPkg = packages.find(p => p._id === currentSelection.packageId);
    const variations = selectedPkg?.variations || [];

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef5350' }} /><Typography color="#666">Not Available</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#66bb6a' }} /><Typography color="#666">Available</Typography></Box>
                </Stack>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, bgcolor: '#fff', borderRadius: '24px', p: { xs: '20px', md: '32px' }, mb: '32px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: { xs: 70, md: 100 }, height: { xs: 70, md: 100 }, bgcolor: '#ef5350', borderRadius: '20px', color: '#fff', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.2)' }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: '600' }}>{new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}</Typography>
                    <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700 }}>{selectedDate}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="#333">{selectedBookings.length === 0 ? 'No Bookings' : `${selectedBookings.length} Direct Bookings`}</Typography>
                    <Typography color="#999" fontSize="14px">{selectedBookings.length === 0 ? 'Slots available for manual entry' : 'Reserved slots for this date'}</Typography>
                </Box>
                {!(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate) < new Date(todayYear, todayMonth, todayDate)) && (
                    <Button 
                        variant="contained" 
                        onClick={handleOpenDialog} 
                        sx={{ bgcolor: '#ef5350', borderRadius: '12px', px: 4, height: 48, fontWeight: 700, '&:hover': { bgcolor: '#d32f2f' } }}
                    >
                        Add Booking
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {selectedBookings.length === 0 ? (
                    <Grid item xs={12}><Paper sx={{ p: 4, textAlign: 'center', borderRadius: '24px', border: '2px dashed #eee' }}><Typography color="#999">No bookings scheduled for this date.</Typography></Paper></Grid>
                ) : (
                    selectedBookings.map(b => (
                        <Grid item xs={12} md={6} lg={4} key={b._id}>
                            <Paper sx={{ p: 3, borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#ef5350' }} />
                                <Stack direction="row" justifyContent="space-between" mb={2}>
                                    <Chip 
                                        label={`${b.cakeCart?.length || 1} Cake(s)`}
                                        size="small" 
                                        icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} 
                                        sx={{ bgcolor: 'rgba(239, 83, 80, 0.1)', color: '#ef5350', fontWeight: 700 }} 
                                    />
                                    <IconButton size="small" onClick={() => handleDeleteBooking(b._id)} sx={{ color: '#ccc', '&:hover': { color: '#ef5350' } }} disabled={deleteLoading === b._id}>
                                        {deleteLoading === b._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                                    </IconButton>
                                </Stack>
                                <Typography variant="h6" fontWeight={800} mb={1}>{renderSafe(b.fullName)}</Typography>
                                <List dense sx={{ p: 0, mb: 2 }}>
                                    {(b.cakeCart || []).map((item, idx) => (
                                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                                            <ListItemText 
                                                primary={renderSafe(item.name)} 
                                                secondary={`${renderSafe(item.weight)} - ${renderSafe(item.itemType)} ${item.message ? `("${renderSafe(item.message)}")` : ''}`}
                                                primaryTypographyProps={{ fontSize: '13px', fontWeight: 700 }}
                                                secondaryTypographyProps={{ fontSize: '11px' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><PhoneIcon sx={{ fontSize: 16 }} /><Typography variant="body2">{renderSafe(b.contactNumber)}</Typography></Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
                <DialogTitle sx={{ position: 'relative' }}>
                    <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ position: 'absolute', right: 20, top: 20, color: (theme) => theme.palette.grey[500], transition: 'all 0.3s ease', '&:hover': { transform: 'rotate(90deg)', color: '#ef5350', bgcolor: 'rgba(239, 83, 80, 0.1)' } }}><CloseIcon /></IconButton>
                    <Typography variant="h4" fontWeight={800} sx={{ mt: 2, textAlign: 'center' }}>Create Manual Booking</Typography>
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
                                <TextField fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                <TextField fullWidth label="Email Address" type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                <TextField fullWidth label="Home Address" name="address" value={formData.address} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                            </Stack></Fade>
                        )}
                        {activeStep === 1 && (
                            <Fade in={activeStep === 1}><Box>
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: '20px', mb: 3, bgcolor: '#fcfcfc' }}>
                                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><AddIcon sx={{ color: '#ef5350' }} /> Add Cake to Booking</Typography>
                                    <Stack spacing={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select Cake Package</InputLabel>
                                            <Select label="Select Cake Package" name="packageId" value={currentSelection.packageId} onChange={handleSelectionChange} sx={{ borderRadius: '12px' }}>
                                                {packages.map(pkg => <MenuItem key={pkg._id} value={pkg._id}>{renderSafe(pkg.packageName || pkg.name)}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        {currentSelection.packageId && (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Select Weight / Type</InputLabel>
                                                <Select label="Select Weight / Type" name="variationId" value={currentSelection.variationId} onChange={handleSelectionChange} sx={{ borderRadius: '12px' }}>
                                                    {variations.map(v => <MenuItem key={v._id || v.id} value={v._id || v.id}>{renderSafe(v.name)} - ₹{v.price}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        )}
                                        <TextField fullWidth size="small" label="Message on Cake" name="cakeMessage" value={currentSelection.cakeMessage} onChange={handleSelectionChange} placeholder="E.g. Happy Birthday!" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                        <Button variant="outlined" startIcon={<AddIcon />} onClick={addToCart} sx={{ borderRadius: '12px', py: 1, borderColor: '#ef5350', color: '#ef5350', '&:hover': { borderColor: '#d32f2f', bgcolor: 'rgba(239, 83, 80, 0.05)' } }}>Add to Cart</Button>
                                    </Stack>
                                </Paper>

                                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, px: 1, display: 'flex', alignItems: 'center', gap: 1 }}><CartIcon sx={{ fontSize: 18 }} /> Booking Cart ({cart.length})</Typography>
                                {cart.length === 0 ? (
                                    <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '16px' }}><Typography variant="body2" color="text.secondary">No cakes added yet</Typography></Box>
                                ) : (
                                    <List sx={{ bgcolor: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                                        {cart.map((item) => (
                                            <ListItem key={item.id} divider>
                                                <ListItemText 
                                                    primary={item.name} 
                                                    secondary={`${item.weight} - ${item.itemType} | ₹${item.price} ${item.message ? `| "${item.message}"` : ''}`}
                                                    primaryTypographyProps={{ fontWeight: 700 }}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" onClick={() => removeFromCart(item.id)} sx={{ color: '#ccc', '&:hover': { color: '#ef5350' } }}><DeleteIcon /></IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                        <ListItem sx={{ bgcolor: '#fafafa' }}>
                                            <ListItemText primary="Total Cart Value" primaryTypographyProps={{ fontWeight: 900 }} />
                                            <Typography variant="h6" fontWeight={900} color="#ef5350">₹{cart.reduce((sum, item) => sum + item.totalPrice, 0)}</Typography>
                                        </ListItem> 
                                    </List>
                                )}
                            </Box></Fade>
                        )}
                        {activeStep === 2 && (
                            <Fade in={activeStep === 2}><Stack spacing={3}>
                                <Paper sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(239, 83, 80, 0.03)', border: '1px solid rgba(239, 83, 80, 0.1)' }}>
                                    <Typography variant="subtitle2" fontWeight={800}>Cart Summary</Typography>
                                    <Typography variant="caption" color="text.secondary">{cart.length} item(s) to be booked for {formData.fullName}</Typography>
                                </Paper>
                                <TextField fullWidth multiline rows={4} label="Special Instructions / Notes" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="Type any specific requests here..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} />
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
                            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={submitLoading} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.3)', '&:hover': { bgcolor: '#d32f2f' } }}>{submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}</Button>
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

export default CakeSchedules;