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
    Fade
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE_URL = 'https://api.bookmyevent.ae';

function InvitationSchedules() {
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

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        emailAddress: '',
        address: '',
        additionalNotes: '',
        moduleId: '',
        packageId: '',
        bookingDate: new Date().toISOString().split('T')[0],
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
            fetchPackages();
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
                    String(b.moduleType || '').toLowerCase().includes('invitation') ||
                    String(b.moduleType || '').toLowerCase().includes('printing')
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
            const storedModuleId = localStorage.getItem('moduleId');
            const response = await fetch(`${API_BASE_URL}/api/modules`);
            const data = await response.json();
            const modulesList = data.success ? (data.data || data.modules || []) : (Array.isArray(data) ? data : []);
            
            const filtered = modulesList.filter(m => {
                const title = (m.title || m.name || '').toLowerCase();
                return title.includes('invitation') || title.includes('printing');
            });

            let targetModule = filtered.find(m => m._id === storedModuleId) || filtered[0];
            if (!targetModule && modulesList.length > 0) targetModule = modulesList.find(m => m._id === storedModuleId) || modulesList[0];

            setModules(filtered.length > 0 ? filtered : (targetModule ? [targetModule] : []));
            
            if (targetModule && !formData.moduleId) {
                setFormData(prev => ({ ...prev, moduleId: targetModule._id }));
            }
            
            if (targetModule) {
                fetchPackagesWithId(targetModule._id);
            }
        } catch (err) { }
    };

    const fetchPackagesWithId = async (moduleId) => {
    try {
        // ✅ Correct endpoint matching your backend route
        const response = await fetch(`${API_BASE_URL}/api/invitation-printing/vendor/${providerId}`);
        const data = await response.json();
        console.log('Invitation packages:', data);
        setPackages(data.success ? (data.data || []) : []);
    } catch (err) {
        console.error('Fetch invitation packages error:', err);
        setPackages([]);
    }
};

    const fetchPackages = async () => {
        const moduleId = formData.moduleId || localStorage.getItem('moduleId');
        if (moduleId) {
            fetchPackagesWithId(moduleId);
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
            status[day] = dayBookings.length === 0 ? 'free' : 'booked';

            // For past dates, don't show status (so no dot is rendered)
            const isPastMonth = year < todayYear || (year === todayYear && month < todayMonth);
            const isPastDay = isPastMonth || (month === todayMonth && year === todayYear && day < todayDate);
            if (isPastDay) status[day] = 'none';
        }
        return status;
    };

    const bookingStatus = getCurrentMonthBookings();
    const getBookingsForSelectedDate = () =>
        bookings.filter(b => {
            if (!b.bookingDate) return false;
            const bookingDateStr = String(b.bookingDate).split('T')[0];
            const targetDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
            return bookingDateStr === targetDateStr;
        });

    const selectedBookings = getBookingsForSelectedDate();
    const { firstDay, daysInMonth } = (() => {
        const year = currentDate.getFullYear(); const month = currentDate.getMonth();
        return { firstDay: new Date(year, month, 1).getDay(), daysInMonth: new Date(year, month + 1, 0).getDate() };
    })();

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const getStatusColor = (status) => {
        if (status === 'booked') return '#ef5350';
        if (status === 'free') return '#66bb6a';
        return 'transparent'; // for 'none' or past dates
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
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day =>
            days.push(<Box key={day} sx={{ textAlign: 'center', p: { xs: '8px 4px', md: '16px' }, color: '#777', fontSize: { xs: '11px', md: '14px' }, fontWeight: '600' }}>{day}</Box>)
        );
        for (let i = 0; i < firstDay; i++) days.push(<Box key={`empty-${i}`} sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#f9f9f9', borderRadius: '12px' }} />);
        for (let day = 1; day <= daysInMonth; day++) {
            const status = bookingStatus[day] || 'free';
            const isToday = day === todayDate && currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear;
            const isPastMonth = currentDate.getFullYear() < todayYear || (currentDate.getFullYear() === todayYear && currentDate.getMonth() < todayMonth);
            const isPastDay = isPastMonth || (currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear && day < todayDate);
            const isSelected = day === selectedDate;
            days.push(
                <Box key={day} onClick={() => !isPastDay && setSelectedDate(day)} 
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
const handleSubmit = async () => {
    if (!formData.fullName.trim()) {
        setError('Please fill all required fields: Full Name is missing');
        return;
    }
    if (!formData.contactNumber.trim()) {
        setError('Please fill all required fields: Contact Number is missing');
        return;
    }
    if (!formData.packageId) {
        setError('Please fill all required fields: Package is missing');
        return;
    }

    setSubmitLoading(true);
    setError(null);

    try {
        // ✅ Get moduleId from the selected package itself
        const selectedPkg = packages.find(p => p._id === formData.packageId);
        const resolvedModuleId = selectedPkg?.secondaryModule
            || selectedPkg?.module
            || selectedPkg?.moduleId
            || formData.moduleId
            || null;

        console.log('Selected package:', selectedPkg);
        console.log('Resolved moduleId:', resolvedModuleId);

        const bookingData = {
            providerId: providerId,
            bookingType: 'Direct',
            invitationId: formData.packageId,
            packageId: formData.packageId,
            fullName: formData.fullName,
            contactNumber: formData.contactNumber,
            emailAddress: formData.emailAddress || `direct${Date.now()}@booking.com`,
            address: formData.address || 'N/A',
            bookingDate: formData.bookingDate,
            timeSlot: ['Morning'],
            paymentType: formData.paymentType,
            additionalNotes: formData.additionalNotes,
        };

        // ✅ Only send moduleId if resolved from the package itself
        if (resolvedModuleId) {
            bookingData.moduleId = resolvedModuleId;
        }

        console.log('FINAL SUBMIT DATA:', bookingData);

        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (data.success) {
            alert('Booking created successfully!');
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
        setFormData({ fullName: '', contactNumber: '', emailAddress: '', address: '', additionalNotes: '', moduleId: modules[0]?._id || '', packageId: '', bookingDate: todayStr, paymentType: 'Cash', bookingType: 'Direct' });
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
    const steps = ['Customer Info', 'Service Details', 'Schedule & Notes'];

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
                <Button 
                    variant="contained" 
                    onClick={handleOpenDialog} 
                    disabled={(() => {
                        const isPastMonth = currentDate.getFullYear() < todayYear || (currentDate.getFullYear() === todayYear && currentDate.getMonth() < todayMonth);
                        const isPastDay = isPastMonth || (currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear && selectedDate < todayDate);
                        return isPastDay;
                    })()}
                    sx={{ bgcolor: '#ef5350', borderRadius: '12px', px: 4, height: 48, fontWeight: 700, '&:hover': { bgcolor: '#d32f2f' } }}
                >
                    Add Booking
                </Button>
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
                                        label={
                                            Array.isArray(b.timeSlot) 
                                                ? b.timeSlot.map(s => typeof s === 'object' ? (s.label || s.name || s.time) : s).join(', ') 
                                                : (typeof b.timeSlot === 'object' ? (b.timeSlot.label || b.timeSlot.name || b.timeSlot.time) : (b.timeSlot || 'Full Day'))
                                        } 
                                        size="small" 
                                        icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} 
                                        sx={{ bgcolor: 'rgba(239, 83, 80, 0.1)', color: '#ef5350', fontWeight: 700 }} 
                                    />
                                    <IconButton size="small" onClick={() => handleDeleteBooking(b._id)} sx={{ color: '#ccc', '&:hover': { color: '#ef5350' } }} disabled={deleteLoading === b._id}>
                                        {deleteLoading === b._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                                    </IconButton>
                                </Stack>
                                <Typography variant="h6" fontWeight={800} mb={2}>{b.fullName}</Typography>
                                <Typography color="#666" fontSize="14px">📞 {b.contactNumber}</Typography>
                                <Typography color="#666" fontSize="14px">✉️ {b.emailAddress || 'No Email'}</Typography>
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
                <DialogContent sx={{ px: 4, pb: 4, pt: 2, minHeight: 400 }}>
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
                            <Fade in={activeStep === 1}><Stack spacing={3}>
                                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                                    <InputLabel>Select Invitation Package</InputLabel>
                                    <Select label="Select Invitation Package" name="packageId" value={formData.packageId} onChange={handleInputChange}>
                                        {packages.map(pkg => <MenuItem key={pkg._id} value={pkg._id}>{pkg.packageName || pkg.packageTitle || pkg.name || pkg.title}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Box><Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>Selected Date</Typography>
                                    <TextField fullWidth disabled value={new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#f8fafc' } }} />
                                </Box>
                            </Stack></Fade>
                        )}
                        {activeStep === 2 && (
                            <Fade in={activeStep === 2}><Box><TextField fullWidth multiline rows={4} label="Special Instructions / Notes" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="Type any specific requests here..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} /></Box></Fade>
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
        </Box>
    );
}

export default InvitationSchedules;
