import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
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
    Divider,
    Stepper,
    Step,
    StepLabel,
    Zoom,
    Fade,
    alpha
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CelebrationIcon from '@mui/icons-material/Celebration';

const API_BASE_URL = 'https://api.bookmyevent.ae';
const THEME_COLOR = '#C62828'; // Coral theme for panthal

function PanthalSchedules() {
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

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        emailAddress: '',
        address: '',
        numberOfGuests: '',
        additionalNotes: '',
        moduleId: '',
        packageId: '',
        bookingDate: new Date().toISOString().split('T')[0],
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
                } catch (e) {
                    console.error('Error parsing user from localStorage:', e);
                }
            }
        }
        return id;
    };

    const providerId = getProviderId();

    useEffect(() => {
        if (providerId) {
            fetchBookings();
            fetchModules();
            fetchpanthalPackages();
        }
    }, [currentDate, providerId]);

    useEffect(() => {
        if (modules.length === 1 && !formData.moduleId) {
            setFormData(prev => ({
                ...prev,
                moduleId: modules[0]._id
            }));
        }
    }, [modules]);

    const fetchBookings = async () => {
        if (!providerId) {
            setError('Provider ID is required');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/provider/${providerId}`);
            const data = await response.json();
            if (data.success) {
                // Filter specifically for panthal related bookings
                const filtered = (data.data || []).filter(b => {
                    const type = String(b.moduleType || '').toLowerCase();
                    return type.includes('panthal') || type.includes('decorations');
                });
                setBookings(filtered);
            } else {
                setError(data.message || 'Failed to fetch bookings');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/modules`);
            const data = await response.json();
            let modulesList = data.success ? (data.data || data.modules || []) : (Array.isArray(data) ? data : []);

            const filteredModules = modulesList.filter(module => {
                const moduleTitle = (module.title || module.name || '').toLowerCase();
                return moduleTitle.includes('panthal') || moduleTitle.includes('decorations');
            });
            setModules(filteredModules);
        } catch (err) {
            console.error('Fetch modules error:', err);
            setError('Failed to fetch modules: ' + err.message);
        }
    };

    const fetchpanthalPackages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/panthal/vendor/${providerId}`);
            const data = await response.json();
            if (data.success) {
                setPackages(data.data || []);
            } else {
                setPackages([]);
            }
        } catch (err) {
            console.error('Fetch panthal packages error:', err);
            setPackages([]);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        setDeleteLoading(bookingId);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                setBookings(prev => prev.filter(b => b._id !== bookingId));
                alert('Booking deleted successfully!');
            } else {
                setError(data.message || 'Failed to delete booking');
            }
        } catch (err) {
            setError('Error deleting booking: ' + err.message);
        } finally {
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
                const bDate = new Date(b.bookingDate);
                return bDate.getDate() === day &&
                    bDate.getMonth() === month &&
                    bDate.getFullYear() === year &&
                    b.bookingType === 'Direct';
            });

            const totalSlots = dayBookings.reduce((acc, b) => acc + (Array.isArray(b.timeSlot) ? b.timeSlot.length : 1), 0);
            if (totalSlots === 0) status[day] = 'free';
            else if (totalSlots >= 3) status[day] = 'booked';
            else status[day] = 'available';
        }
        return status;
    };

    const bookingStatus = getCurrentMonthBookings();

    const getBookingsForSelectedDate = () => {
        return bookings.filter(b => {
            const bDate = new Date(b.bookingDate);
            return bDate.getDate() === selectedDate &&
                bDate.getMonth() === currentDate.getMonth() &&
                bDate.getFullYear() === currentDate.getFullYear() &&
                b.bookingType === 'Direct';
        });
    };

    const selectedBookings = getBookingsForSelectedDate();
    const { firstDay, daysInMonth } = (() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return {
            firstDay: new Date(year, month, 1).getDay(),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    })();

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const getStatusColor = (status) => {
        if (status === 'booked') return '#ef5350';
        if (status === 'available') return '#ffd54f';
        return '#66bb6a';
    };

    const changeMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
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
            const isSelected = day === selectedDate;
            days.push(
                <Box key={day} onClick={() => setSelectedDate(day)} sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: { xs: '50px', md: '100px' }, cursor: 'pointer', borderRadius: { xs: '8px', md: '16px' }, transition: 'all 0.3s', bgcolor: isSelected ? alpha(THEME_COLOR, 0.05) : '#fff', border: isSelected ? `1px solid ${THEME_COLOR}` : '1px solid #f0f0f0', '&:hover': { transform: { md: 'translateY(-4px)' }, boxShadow: '0 6px 16px rgba(0,0,0,0.08)', borderColor: THEME_COLOR, zIndex: 1 } }}>
                    <Box sx={{ fontSize: { xs: '14px', md: '22px' }, fontWeight: isToday || isSelected ? '600' : '400', color: isToday ? '#fff' : (isSelected ? THEME_COLOR : '#333'), width: { xs: '28px', md: '48px' }, height: { xs: '28px', md: '48px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: isToday ? THEME_COLOR : 'transparent', mb: { xs: '2px', md: '8px' } }}>{day}</Box>
                    <Box sx={{ width: { xs: '6px', md: '10px' }, height: { xs: '6px', md: '10px' }, borderRadius: '50%', bgcolor: getStatusColor(status) }} />
                </Box>
            );
        }
        return days;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTimeSlotChange = (slot) => {
        setFormData(prev => {
            const timeSlots = prev.timeSlot.includes(slot) ? prev.timeSlot.filter(s => s !== slot) : [...prev.timeSlot, slot];
            return { ...prev, timeSlot: timeSlots };
        });
    };

    const handleSubmit = async () => {
        if (!formData.fullName.trim() || !formData.contactNumber.trim() || !formData.moduleId || !formData.packageId || !formData.timeSlot.length) {
            setError('Please fill all required fields and select at least one time slot');
            return;
        }
        setSubmitLoading(true);
        setError(null);
        try {
            const bookingData = {
                moduleId: formData.moduleId,
                panthalId: formData.packageId,
                fullName: formData.fullName,
                contactNumber: formData.contactNumber,
                emailAddress: formData.emailAddress,
                address: formData.address,
                bookingDate: formData.bookingDate,
                timeSlot: formData.timeSlot,
                paymentType: formData.paymentType,
                numberOfGuests: Number(formData.numberOfGuests) || 1,
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
                alert('Booking created successfully!');
                setOpenDialog(false);
                fetchBookings();
                resetForm();
            } else {
                setError(data.message || 'Failed to create booking');
            }
        } catch (err) {
            setError('Error creating booking');
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
            numberOfGuests: '',
            additionalNotes: '',
            moduleId: modules[0]?._id || '',
            packageId: '',
            bookingDate: new Date().toISOString().split('T')[0],
            timeSlot: [],
            paymentType: 'Cash',
            bookingType: 'Direct'
        });
    };

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleOpenDialog = () => {
        setOpenDialog(true);
        setActiveStep(0);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setError(null);
        setActiveStep(0);
    };

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef5350' }} /><Typography color="#666">Fully Booked</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffd54f' }} /><Typography color="#666">Slots Available</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#66bb6a' }} /><Typography color="#666">Fully Free</Typography></Box>
                </Stack>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, bgcolor: '#fff', borderRadius: '24px', p: { xs: '20px', md: '32px' }, mb: '32px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: { xs: 70, md: 100 }, height: { xs: 70, md: 100 }, bgcolor: THEME_COLOR, borderRadius: '20px', color: '#fff', boxShadow: `0 8px 16px ${alpha(THEME_COLOR, 0.2)}` }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: '600' }}>{new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}</Typography>
                    <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700 }}>{selectedDate}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="#333">{selectedBookings.length === 0 ? 'No Bookings' : `${selectedBookings.length} Direct Bookings`}</Typography>
                    <Typography color="#999" fontSize="14px">{selectedBookings.length === 0 ? 'All slots available for manual entry' : 'Reserved slots for this date'}</Typography>
                </Box>
                <Button variant="contained" onClick={handleOpenDialog} sx={{ bgcolor: THEME_COLOR, borderRadius: '12px', px: 4, height: 48, fontWeight: 700, '&:hover': { bgcolor: '#388e3c' } }}>Add Booking</Button>
            </Box>

            <Grid container spacing={3}>
                {selectedBookings.length === 0 ? (
                    <Grid item xs={12}><Paper sx={{ p: 4, textAlign: 'center', borderRadius: '24px', border: '2px dashed #eee' }}><Typography color="#999">No bookings scheduled for this date.</Typography></Paper></Grid>
                ) : (
                    selectedBookings.map(b => (
                        <Grid item xs={12} md={6} lg={4} key={b._id}>
                            <Paper sx={{ p: 3, borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: THEME_COLOR }} />
                                <Stack direction="row" justifyContent="space-between" mb={2}>
                                    <Chip label={Array.isArray(b.timeSlot) ? b.timeSlot.join(', ') : (typeof b.timeSlot === 'object' ? b.timeSlot.label : b.timeSlot)} size="small" icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} sx={{ bgcolor: alpha(THEME_COLOR, 0.1), color: THEME_COLOR, fontWeight: 700 }} />
                                    <IconButton size="small" onClick={() => handleDeleteBooking(b._id)} sx={{ color: '#ccc', '&:hover': { color: '#ef5350' } }}><DeleteIcon fontSize="small" /></IconButton>
                                </Stack>
                                <Typography variant="h6" fontWeight={800} mb={2}>{b.fullName}</Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><PhoneIcon sx={{ fontSize: 16 }} /><Typography variant="body2">{b.contactNumber}</Typography></Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><CelebrationIcon sx={{ fontSize: 16 }} /><Typography variant="body2">Panthal Service</Typography></Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
                <DialogTitle>
                    <Typography variant="h4" fontWeight={800} sx={{ mt: 2, textAlign: 'center' }}>Create Manual Booking</Typography>
                    <Box sx={{ width: '80%', mx: 'auto', mt: 3, mb: 1 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => <Step key={label} sx={{ '& .MuiStepIcon-root.Mui-active': { color: THEME_COLOR }, '& .MuiStepIcon-root.Mui-completed': { color: THEME_COLOR } }}><StepLabel>{label}</StepLabel></Step>)}
                        </Stepper>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 4, pb: 4, pt: 2, minHeight: 400 }}>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

                    <Box sx={{ mt: 2 }}>
                        {activeStep === 0 && (
                            <Fade in={activeStep === 0}>
                                <Stack spacing={3}>
                                    <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: THEME_COLOR }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    <TextField fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: THEME_COLOR }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    <TextField fullWidth label="Email Address" type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: THEME_COLOR }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    <TextField fullWidth label="Service Address" name="address" value={formData.address} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: THEME_COLOR }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                </Stack>
                            </Fade>
                        )}

                        {activeStep === 1 && (
                            <Fade in={activeStep === 1}>
                                <Stack spacing={3}>
                                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                                        <InputLabel>Select Panthal Package</InputLabel>
                                        <Select label="Select Panthal Package" name="packageId" value={formData.packageId} onChange={handleInputChange}>
                                            {packages.map(pkg => <MenuItem key={pkg._id} value={pkg._id}>{pkg.packageName}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <TextField fullWidth label="Number of Guests" type="number" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PeopleIcon sx={{ color: THEME_COLOR }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>Selected Date</Typography>
                                        <TextField fullWidth disabled value={new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#f8fafc' } }} />
                                    </Box>
                                </Stack>
                            </Fade>
                        )}

                        {activeStep === 2 && (
                            <Fade in={activeStep === 2}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: THEME_COLOR }}>Preferred Time Slots</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
                                        {['Morning (9AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)', 'Night (8PM-12AM)'].map(slot => (
                                            <Chip key={slot} label={slot} onClick={() => handleTimeSlotChange(slot)} sx={{ borderRadius: '12px', height: 45, px: 1.5, fontSize: '0.9rem', fontWeight: 600, border: '1px solid', borderColor: formData.timeSlot.includes(slot) ? THEME_COLOR : 'rgba(0,0,0,0.1)', bgcolor: formData.timeSlot.includes(slot) ? THEME_COLOR : '#fff', color: formData.timeSlot.includes(slot) ? '#fff' : '#666', transition: '0.3s', '&:hover': { bgcolor: formData.timeSlot.includes(slot) ? '#388e3c' : alpha(THEME_COLOR, 0.05) } }} />
                                        ))}
                                    </Box>
                                    <TextField fullWidth multiline rows={4} label="Special Instructions / Notes" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="Type any specific requests here..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} />
                                </Box>
                            </Fade>
                        )}
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
                        {activeStep > 0 ? (
                            <Button fullWidth onClick={handleBack} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, border: '2px solid #eee', color: '#666', '&:hover': { border: '2px solid #ccc' } }}>Back</Button>
                        ) : (
                            <Button fullWidth onClick={handleCloseDialog} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, border: '2px solid #eee', color: '#666', '&:hover': { border: '2px solid #ccc' } }}>Cancel</Button>
                        )}

                        {activeStep < steps.length - 1 ? (
                            <Button fullWidth variant="contained" onClick={handleNext} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: THEME_COLOR, '&:hover': { bgcolor: '#388e3c' } }}>Next Step</Button>
                        ) : (
                            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={submitLoading} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: THEME_COLOR, boxShadow: `0 8px 16px ${alpha(THEME_COLOR, 0.3)}`, '&:hover': { bgcolor: '#388e3c' } }}>{submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}</Button>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default PanthalSchedules;
