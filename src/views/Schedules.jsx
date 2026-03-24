import { useState, useEffect } from 'react';
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
  Fade,
  Stack,
  Paper,
  Snackbar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const API_BASE_URL = 'https://api.bookmyevent.ae';

const renderSafe = (val) => {
  if (!val) return '';
  if (typeof val === 'string' || typeof val === 'number') return val;
  if (typeof val === 'object') {
    return val.en || val.name || val.title || val.packageName || val.label || (typeof val.title === 'object' ? renderSafe(val.title) : val._id ? '[Object]' : JSON.stringify(val));
  }
  return String(val);
};

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [openDialog, setOpenDialog] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [packages, setPackages] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [successOpen, setSuccessOpen] = useState(false);
  const steps = ['Customer Info', 'Service Details', 'Schedule & Notes'];

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    emailAddress: '',
    address: '',
    numberOfGuests: '',
    additionalNotes: '',
    venueId: '',
    moduleId: '',
    packageId: '',
    bookingDate: new Date().toISOString().split('T')[0],
    timeSlot: [],
    paymentType: 'Cash',
    bookingType: 'Direct'
  });

  // Get providerId from localStorage
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
      fetchVenues();
      fetchModules();
    } else {
      setError('Provider ID not found. Please log in again.');
    }
  }, [currentDate, providerId]);

  // Auto-select module if only one is available
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
        setBookings(data.data || []);
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

  const fetchVenues = async () => {
    if (!providerId) {
      console.log('No providerId available');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/venues/provider/${providerId}`);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setVenues(data.data);
      } else {
        console.error('Failed to fetch venues:', data);
        setError(data.message || 'Failed to fetch venues');
        setVenues([]);
      }
    } catch (err) {
      console.error('Fetch venues error:', err);
      setError('Error connecting to server');
      setVenues([]);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/modules`);
      const data = await response.json();

      let modulesList = [];

      if (data.success && data.data && Array.isArray(data.data)) {
        modulesList = data.data;
      } else if (data.success && data.modules && Array.isArray(data.modules)) {
        modulesList = data.modules;
      } else if (Array.isArray(data)) {
        modulesList = data;
      }

      console.log('All modules fetched:', modulesList);

      // Filter modules: Only show "Venues" module by default
      // Or filter by modules that this provider has venues for
      const filteredModules = modulesList.filter(module => {
        const moduleTitle = (module.title || module.name || '').toLowerCase();
        // Only show Venues module (you can adjust this logic)
        return moduleTitle === 'venues';
      });

      console.log('Filtered modules for provider:', filteredModules);
      setModules(filteredModules);

      if (filteredModules.length === 0) {
        console.warn('No modules available for this provider');
      }
    } catch (err) {
      console.error('Fetch modules error:', err);
      setError('Failed to fetch modules: ' + err.message);
      setModules([]);
    }
  };

  const fetchPackages = async (venueId) => {
    try {
      const venue = venues.find(v => v._id === venueId);

      if (venue && venue.packages && Array.isArray(venue.packages)) {
        setPackages(venue.packages);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error('Fetch packages error:', err);
      setPackages([]);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setDeleteLoading(bookingId);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state immediately
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        alert('Booking deleted successfully!');
      } else {
        setError(data.message || 'Failed to delete booking');
      }
    } catch (err) {
      setError('Error deleting booking: ' + err.message);
      console.error('Delete error:', err);
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
      // Only count Direct bookings
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate.getDate() === day &&
          bookingDate.getMonth() === month &&
          bookingDate.getFullYear() === year &&
          booking.bookingType === 'Direct';
      });

      if (dayBookings.length === 0) {
        status[day] = 'free';
      } else if (dayBookings.length >= 2) {
        status[day] = 'booked';
      } else {
        status[day] = 'available';
      }
    }

    return status;
  };

  const bookingStatus = getCurrentMonthBookings();

  const getBookingsForSelectedDate = () => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      const isSelectedDate = bookingDate.getDate() === selectedDate &&
        bookingDate.getMonth() === currentDate.getMonth() &&
        bookingDate.getFullYear() === currentDate.getFullYear();

      // Only show Direct bookings
      return isSelectedDate && booking.bookingType === 'Direct';
    });
  };

  const selectedBookings = getBookingsForSelectedDate();

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return '#ef5350';
      case 'available':
        return '#ffd54f';
      case 'free':
        return '#66bb6a';
      default:
        return '#66bb6a';
    }
  };

  const getBookingCardColor = (status) => {
    switch (status) {
      case 'Accepted':
        return '#7e57c2';
      case 'Pending':
        return '#ffd54f';
      case 'Rejected':
        return '#e57373';
      default:
        return '#ef5350';
    }
  };

  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    weekDays.forEach((day) =>
      days.push(
        <Box
          key={day}
          sx={{
            textAlign: 'center',
            padding: { xs: '8px 4px', md: '16px' },
            color: '#777',
            fontSize: { xs: '11px', md: '14px' },
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {day}
        </Box>
      )
    );

    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ display: { xs: 'none', md: 'block' }, backgroundColor: '#f9f9f9', borderRadius: '12px' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = bookingStatus[day] || 'free';
      const isToday = day === todayDate && currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear;
      const isSelected = day === selectedDate;

      days.push(
        <Box
          key={day}
          onClick={() => {
            const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isPast = dateToCheck < new Date(todayYear, todayMonth, todayDate);
            if (!isPast) setSelectedDate(day);
          }}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '50px', md: '100px' },
            cursor: (() => {
              const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isPast = dateToCheck < new Date(todayYear, todayMonth, todayDate);
              return isPast ? 'not-allowed' : 'pointer';
            })(),
            borderRadius: { xs: '8px', md: '16px' },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: (() => {
              const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isPast = dateToCheck < new Date(todayYear, todayMonth, todayDate);
              if (isPast) return '#f5f5f5';
              return isSelected ? 'rgba(239, 83, 80, 0.05)' : '#fff';
            })(),
            opacity: (() => {
              const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isPast = dateToCheck < new Date(todayYear, todayMonth, todayDate);
              return isPast ? 0.5 : 1;
            })(),
            border: isSelected ? '1px solid #ef5350' : '1px solid #f0f0f0',
            boxShadow: isSelected ? '0 4px 12px rgba(239, 83, 80, 0.15)' : 'none',
            '&:hover': {
              transform: { md: (new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(todayYear, todayMonth, todayDate)) ? 'none' : 'translateY(-4px)' },
              boxShadow: (new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(todayYear, todayMonth, todayDate)) ? 'none' : '0 6px 16px rgba(0,0,0,0.08)',
              borderColor: (new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(todayYear, todayMonth, todayDate)) ? '#f0f0f0' : '#ef5350',
              zIndex: 1
            }
          }}
        >
          <Box
            sx={{
              fontSize: { xs: '14px', md: '22px' },
              fontWeight: isToday || isSelected ? '600' : '400',
              color: isToday ? '#fff' : (isSelected ? '#ef5350' : '#333'),
              width: { xs: '28px', md: '48px' },
              height: { xs: '28px', md: '48px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: isToday ? '#ef5350' : 'transparent',
              marginBottom: { xs: '2px', md: '8px' },
              transition: 'all 0.2s'
            }}
          >
            {day}
          </Box>
          <Box
            sx={{
              width: { xs: '6px', md: '10px' },
              height: { xs: '6px', md: '10px' },
              borderRadius: '50%',
              backgroundColor: getStatusColor(status),
              boxShadow: `0 0 8px ${getStatusColor(status)}80`
            }}
          />
          {status !== 'free' && (
            <Typography sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: '10px',
              mt: 1,
              color: '#999',
              fontWeight: 500
            }}>
              {status === 'booked' ? 'FULL' : 'SLOTS'}
            </Typography>
          )}
        </Box>
      );
    }

    return days;
  };

  const selectedStatus = bookingStatus[selectedDate] || 'free';

  const getStatusText = () => {
    if (selectedBookings.length === 0) return 'No bookings - All slots available';
    if (selectedStatus === 'booked') return `${selectedBookings.length} bookings - Fully booked`;
    if (selectedStatus === 'available') return `${selectedBookings.length} booking - Some slots available`;
    return 'All slots available';
  };

  const getDayName = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'venueId' && value) {
      fetchPackages(value);
    }
  };

  const handleTimeSlotChange = (slot) => {
    setFormData(prev => {
      const timeSlots = prev.timeSlot.includes(slot)
        ? prev.timeSlot.filter(s => s !== slot)
        : [...prev.timeSlot, slot];
      return { ...prev, timeSlot: timeSlots };
    });
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setError(null);

    try {
      if (!formData.bookingDate) {
        setError('Please select booking date');
        setSubmitLoading(false);
        return;
      }

      if (!formData.numberOfGuests || Number(formData.numberOfGuests) <= 0) {
        setError('Please enter a valid number of guests');
        setSubmitLoading(false);
        return;
      }

      const bookingData = {
        moduleId: formData.moduleId,
        venueId: formData.venueId,
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        address: formData.address,
        numberOfGuests: Number(formData.numberOfGuests),
        bookingDate: formData.bookingDate,
        timeSlot: formData.timeSlot.join(', '),
        paymentType: formData.paymentType,
        bookingType: 'Direct'
      };

      if (formData.packageId) {
        bookingData.packageId = formData.packageId;
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessOpen(true);
        handleCloseDialog();
        fetchBookings();
        resetForm();
      } else {
        setError(data.message || 'Failed to create booking');
      }
    } catch (err) {
      setError('Error creating booking: ' + err.message);
      console.error('Submit error:', err);
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
      venueId: '',
      moduleId: '',
      packageId: '',
      bookingDate: new Date().toISOString().split('T')[0],
      timeSlot: [],
      paymentType: 'Cash',
      bookingType: 'Direct'
    });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.fullName || !formData.contactNumber) {
        setError('Please fill in required fields');
        return;
      }
    }
    if (activeStep === 1) {
      if (!formData.moduleId || !formData.venueId) {
        setError('Please select module and venue');
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null);
  };

  const handleOpenDialog = () => {
    const selectedDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate);
    // Adjust for timezone to get correct YYYY-MM-DD
    const offset = selectedDateObj.getTimezoneOffset();
    const localDate = new Date(selectedDateObj.getTime() - (offset * 60 * 1000));
    const formattedDate = localDate.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      bookingDate: formattedDate
    }));
    setActiveStep(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
    setActiveStep(0);
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
    color: '#ef5350',
    fontWeight: 600
  };

  const iconStyle = {
    color: '#ef5350',
    fontSize: 24
  };

  return (
    <Box sx={{
      width: '100%',
      margin: '0 auto',
      padding: { xs: '8px', md: '40px' },
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {!providerId && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Provider ID not found. Please make sure you're logged in. You may need to log out and log in again.
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mb={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: { xs: '16px', md: '32px' },
        padding: { xs: '0 4px', md: '0 20px' }
      }}>
        <IconButton
          onClick={() => changeMonth(-1)}
          sx={{
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0',
            '&:hover': { backgroundColor: '#f5f5f5', transform: 'scale(1.1)' },
            transition: 'all 0.2s'
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{
          fontSize: { xs: '20px', md: '32px' },
          fontWeight: '600',
          color: '#333',
          letterSpacing: '-0.5px'
        }}>
          {monthName}
        </Typography>
        <IconButton
          onClick={() => changeMonth(1)}
          sx={{
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0',
            '&:hover': { backgroundColor: '#f5f5f5', transform: 'scale(1.1)' },
            transition: 'all 0.2s'
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{
        backgroundColor: '#fff',
        borderRadius: { xs: '16px', md: '24px' },
        marginBottom: { xs: '24px', md: '40px' },
        padding: { xs: '12px 8px', md: '40px' },
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        border: '1px solid #f0f0f0'
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: { xs: '4px', md: '16px' }
        }}>
          {renderCalendarDays()}
        </Box>
      </Box>

      <Box sx={{
        backgroundColor: '#fff',
        borderRadius: { xs: '8px', md: '12px' },
        padding: { xs: '12px 8px', md: '24px' },
        marginBottom: { xs: '16px', md: '32px' },
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: '12px', md: '24px' },
          flexWrap: 'wrap',
          flexDirection: 'row'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef5350' }} />
            <Typography sx={{ fontSize: '15px', color: '#666' }}>Fully Booked</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffd54f' }} />
            <Typography sx={{ fontSize: '15px', color: '#666' }}>Slots Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#66bb6a' }} />
            <Typography sx={{ fontSize: '15px', color: '#666' }}>Fully Free</Typography>
          </Box>
        </Box>
      </Box>

      {/* 🗓️ Selected Date Header - Premium Look */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, md: 4 },
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: { xs: '20px', md: '32px' },
        marginBottom: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid #f0f0f0'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: { xs: '70px', md: '100px' },
          height: { xs: '70px', md: '100px' },
          backgroundColor: '#ef5350',
          borderRadius: '20px',
          color: '#fff',
          boxShadow: '0 8px 16px rgba(239, 83, 80, 0.2)'
        }}>
          <Typography sx={{ fontSize: { xs: '12px', md: '14px' }, fontWeight: '600', textTransform: 'uppercase', opacity: 0.9 }}>
            {getDayName()}
          </Typography>
          <Typography sx={{ fontSize: { xs: '28px', md: '40px' }, fontWeight: '700', lineHeight: 1 }}>
            {selectedDate}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{
            fontSize: { xs: '18px', md: '28px' },
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '4px'
          }}>
            Schedule Details
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(selectedStatus)
            }} />
            <Typography sx={{
              fontSize: { xs: '14px', md: '16px' },
              color: '#666',
              fontWeight: '500'
            }}>
              {getStatusText()}
            </Typography>
          </Box>
        </Box>
        {!(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate) < new Date(todayYear, todayMonth, todayDate)) && (
          <Button 
            variant="contained" 
            onClick={handleOpenDialog} 
            sx={{ 
              bgcolor: '#ef5350', 
              borderRadius: '12px', 
              px: 4, 
              height: 48, 
              fontWeight: 700, 
              '&:hover': { bgcolor: '#d32f2f' } 
            }}
          >
            Add Booking
          </Button>
        )}
      </Box>

      {/* 📑 Today's Bookings Section */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{
          fontSize: { xs: '20px', md: '24px' },
          fontWeight: '700',
          color: '#1a1a1a',
          mb: 3,
          pl: 1
        }}>
          Today's Appointments
        </Typography>

        {selectedBookings.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {selectedBookings.map((booking) => (
              <Box
                key={booking._id}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  border: '1px solid #f0f0f0',
                  padding: { xs: '20px', md: '32px' },
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                    borderColor: '#ef5350'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '6px',
                    backgroundColor: getBookingCardColor(booking.status)
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography sx={{
                      fontSize: { xs: '12px', md: '13px' },
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      color: getBookingCardColor(booking.status),
                      letterSpacing: '1px',
                      mb: 0.5
                    }}>
                      {booking.timeSlot?.label
                        ? `${booking.timeSlot.label} (${booking.timeSlot.time})`
                        : 'All Day'}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '18px', md: '22px' }, fontWeight: '700', color: '#1a1a1a' }}>
                      {renderSafe(booking.fullName)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip
                      label={booking.status}
                      sx={{
                        fontWeight: '600',
                        fontSize: '12px',
                        backgroundColor: `${getBookingCardColor(booking.status)}15`,
                        color: getBookingCardColor(booking.status),
                        border: `1px solid ${getBookingCardColor(booking.status)}30`
                      }}
                    />
                    <IconButton
                      onClick={() => handleDeleteBooking(booking._id)}
                      disabled={deleteLoading === booking._id}
                      sx={{
                        backgroundColor: '#fff1f1',
                        color: '#ef5350',
                        '&:hover': { backgroundColor: '#ef5350', color: '#fff' }
                      }}
                    >
                      {deleteLoading === booking._id ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 3,
                  pt: 3,
                  borderTop: '1px solid #f8f8f8'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: '#f5f5f5', color: '#666' }}>
                      <PhoneIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Contact</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>{booking.contactNumber}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: '#f5f5f5', color: '#666' }}>
                      <EmailIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Email</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>{booking.emailAddress || 'N/A'}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: '#f5f5f5', color: '#666' }}>
                      <HomeIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Venue</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>{booking.venueId?.venueName || booking.location || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: '#fff',
            borderRadius: '24px',
            border: '2px dashed #eee'
          }}>
            <Typography sx={{ color: '#999', fontSize: '16px' }}>
              No appointments scheduled for this date.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Floating button removed - added to banner instead */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '28px',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ position: 'relative', pb: 0 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 20,
              top: 20,
              color: (theme) => theme.palette.grey[500],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
                color: '#ef5350',
                backgroundColor: 'rgba(239, 83, 80, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mt: 3, mb: 1, color: '#1a1a1a' }}>
            Create Manual Booking
          </Typography>

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
            {activeStep === 0 && (
              <Fade in={activeStep === 0}>
                <Stack spacing={3}>
                  <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                  <TextField fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                  <TextField fullWidth label="Email Address" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                  <TextField fullWidth label="Home Address" name="address" value={formData.address} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                </Stack>
              </Fade>
            )}

            {activeStep === 1 && (
              <Fade in={activeStep === 1}>
                <Stack spacing={3}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                    <InputLabel>Module</InputLabel>
                    <Select name="moduleId" value={formData.moduleId} label="Module" onChange={handleInputChange}>
                      {modules.map(module => <MenuItem key={module._id} value={module._id}>{module.title || module.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                    <InputLabel>Select Venue</InputLabel>
                    <Select name="venueId" value={formData.venueId} label="Select Venue" onChange={handleInputChange}>
                      {venues.map(venue => <MenuItem key={venue._id} value={venue._id}>{venue.venueName}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                    <InputLabel>Select Package</InputLabel>
                    <Select name="packageId" value={formData.packageId} label="Select Package" onChange={handleInputChange} disabled={!formData.venueId}>
                      {packages.length === 0 ? <MenuItem disabled>Select a venue first</MenuItem> : packages.map(pkg => <MenuItem key={pkg._id} value={pkg._id}>{pkg.packageName || pkg.packageTitle || pkg.name || pkg.title}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField fullWidth label="Number of Guests" name="numberOfGuests" type="number" value={formData.numberOfGuests} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PeopleIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                </Stack>
              </Fade>
            )}

            {activeStep === 2 && (
              <Fade in={activeStep === 2}>
                <Stack spacing={3}>
                  <TextField disabled fullWidth label="Booking Date" type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#f8fafc' } }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ color: '#ef5350', fontSize: 20 }} /> Time Slots
                    </Typography>
                    <FormGroup row>
                      <FormControlLabel control={<Checkbox checked={formData.timeSlot.includes('Morning')} onChange={() => handleTimeSlotChange('Morning')} style={{ color: '#ef5350' }} />} label="Morning Session" />
                      <FormControlLabel control={<Checkbox checked={formData.timeSlot.includes('Evening')} onChange={() => handleTimeSlotChange('Evening')} style={{ color: '#ef5350' }} />} label="Evening Session" />
                    </FormGroup>
                  </Box>
                  <TextField fullWidth multiline rows={3} label="Special Instructions" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="Any specific requests or requirements..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                </Stack>
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
              <Button fullWidth variant="contained" onClick={handleNext} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', '&:hover': { bgcolor: '#d32f2f' } }}>Next Step</Button>
            ) : (
              <Button fullWidth variant="contained" onClick={handleSubmit} disabled={submitLoading} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.3)', '&:hover': { bgcolor: '#d32f2f' } }}>
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
    </Box >
  );
}

export default BookingCalendar;