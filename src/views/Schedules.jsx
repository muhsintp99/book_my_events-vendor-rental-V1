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
  IconButton
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

const API_BASE_URL = 'https://api.bookmyevent.ae';

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
            padding: { xs: '4px 2px', md: '12px' },
            color: '#999',
            fontSize: { xs: '11px', md: '16px' },
            fontWeight: '500'
          }}
        >
          {day}
        </Box>
      )
    );

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = bookingStatus[day] || 'free';
      const isToday = day === todayDate && currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear;

      days.push(
        <Box
          key={day}
          onClick={() => setSelectedDate(day)}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: '8px 0', md: '20px 0' },
            cursor: 'pointer',
            borderRadius: { xs: '8px', md: '16px' },
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)'
            }
          }}
        >
          <Box
            sx={{
              fontSize: { xs: '13px', md: '20px' },
              fontWeight: '400',
              color: '#333',
              marginBottom: { xs: '3px', md: '6px' },
              ...(isToday ? {
                backgroundColor: '#ef5350',
                color: '#fff',
                borderRadius: '50%',
                width: { xs: '28px', md: '52px' },
                height: { xs: '28px', md: '52px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              } : {})
            }}
          >
            {day}
          </Box>
          <Box
            sx={{
              width: { xs: '6px', md: '10px' },
              height: { xs: '6px', md: '10px' },
              borderRadius: '50%',
              backgroundColor: getStatusColor(status)
            }}
          />
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

      const bookingData = {
        moduleId: formData.moduleId,
        venueId: formData.venueId,
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        address: formData.address,
        numberOfGuests: parseInt(formData.numberOfGuests),
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
        alert('Booking created successfully!');
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
  };

  const styles = {
    container: {
      width: '100%',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '@media (max-width: 768px)': {
        padding: '16px'
      }
    },
    navigation: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      padding: '0 20px',
      '@media (max-width: 768px)': {
        marginBottom: '16px',
        padding: '0 4px'
      }
    },
    navButton: {
      padding: '12px',
      border: 'none',
      background: '#fff',
      cursor: 'pointer',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '@media (max-width: 768px)': {
        padding: '8px'
      }
    },
    monthTitle: {
      fontSize: '28px',
      fontStyle: 'italic',
      fontWeight: '400',
      color: '#333',
      '@media (max-width: 768px)': {
        fontSize: '20px'
      }
    },
    calendarGrid: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      marginBottom: '32px',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      '@media (max-width: 768px)': {
        borderRadius: '12px',
        marginBottom: '16px',
        padding: '12px'
      }
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '16px',
      '@media (max-width: 768px)': {
        gap: '4px'
      }
    },
    weekDay: {
      textAlign: 'center',
      padding: '12px',
      color: '#999',
      fontSize: '16px',
      fontWeight: '500',
      '@media (max-width: 768px)': {
        padding: '4px 2px',
        fontSize: '11px'
      }
    },
    dayCell: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
      cursor: 'pointer',
      borderRadius: '16px',
      transition: 'background-color 0.2s',
      '@media (max-width: 768px)': {
        padding: '8px 0',
        borderRadius: '8px'
      }
    },
    dayNumber: {
      fontSize: '20px',
      fontWeight: '400',
      color: '#333',
      marginBottom: '6px',
      '@media (max-width: 768px)': {
        fontSize: '13px',
        marginBottom: '3px'
      }
    },
    todayNumber: {
      backgroundColor: '#ef5350',
      color: '#fff',
      borderRadius: '50%',
      width: '52px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      '@media (max-width: 768px)': {
        width: '28px',
        height: '28px',
        fontSize: '13px'
      }
    },
    statusDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      '@media (max-width: 768px)': {
        width: '6px',
        height: '6px'
      }
    },
    legend: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      '@media (max-width: 768px)': {
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px'
      }
    },
    legendContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      '@media (max-width: 768px)': {
        gap: '12px',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    legendDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      '@media (max-width: 768px)': {
        width: '10px',
        height: '10px'
      }
    },
    legendText: {
      fontSize: '15px',
      color: '#666',
      '@media (max-width: 768px)': {
        fontSize: '13px'
      }
    },
    selectedInfo: {
      marginBottom: '24px',
      '@media (max-width: 768px)': {
        marginBottom: '16px'
      }
    },
    selectedHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      '@media (max-width: 768px)': {
        gap: '12px'
      }
    },
    selectedNumber: {
      fontSize: '64px',
      fontWeight: '300',
      color: '#333',
      '@media (max-width: 768px)': {
        fontSize: '40px'
      }
    },
    selectedDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    selectedTitle: {
      fontSize: '22px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '6px',
      '@media (max-width: 768px)': {
        fontSize: '16px',
        marginBottom: '4px'
      }
    },
    selectedStatus: {
      fontSize: '16px',
      color: '#666',
      '@media (max-width: 768px)': {
        fontSize: '13px'
      }
    },
    selectedDay: {
      fontSize: '14px',
      color: '#999',
      marginLeft: '100px',
      marginTop: '6px',
      '@media (max-width: 768px)': {
        fontSize: '12px',
        marginLeft: '52px',
        marginTop: '4px'
      }
    },
    bookingsTitle: {
      fontSize: '22px',
      fontWeight: '500',
      marginBottom: '20px',
      color: '#333',
      '@media (max-width: 768px)': {
        fontSize: '18px',
        marginBottom: '12px'
      }
    },
    bookingsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      '@media (max-width: 768px)': {
        gap: '12px'
      }
    },
    bookingCard: {
      borderRadius: '20px',
      padding: '28px',
      color: '#fff',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      '@media (max-width: 768px)': {
        borderRadius: '12px',
        padding: '16px'
      }
    },
    bookingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '12px'
      }
    },
    bookingTime: {
      fontSize: '15px',
      fontWeight: '500',
      '@media (max-width: 768px)': {
        fontSize: '13px'
      }
    },
    bookingStatus: {
      fontSize: '11px',
      padding: '4px 12px',
      borderRadius: '12px',
      fontWeight: '500',
      backgroundColor: 'rgba(255,255,255,0.3)',
      '@media (max-width: 768px)': {
        fontSize: '10px',
        padding: '3px 8px'
      }
    },
    bookingName: {
      fontSize: '24px',
      fontWeight: '500',
      marginBottom: '10px',
      '@media (max-width: 768px)': {
        fontSize: '18px',
        marginBottom: '8px'
      }
    },
    bookingLocation: {
      fontSize: '15px',
      marginBottom: '14px',
      '@media (max-width: 768px)': {
        fontSize: '13px',
        marginBottom: '10px'
      }
    },
    noBookings: {
      backgroundColor: '#f5f5f5',
      borderRadius: '20px',
      padding: '48px',
      textAlign: 'center',
      '@media (max-width: 768px)': {
        borderRadius: '12px',
        padding: '24px'
      }
    },
    noBookingsTitle: {
      fontSize: '24px',
      fontWeight: '500',
      marginBottom: '10px',
      color: '#333',
      '@media (max-width: 768px)': {
        fontSize: '18px',
        marginBottom: '8px'
      }
    },
    noBookingsText: {
      fontSize: '16px',
      color: '#666',
      '@media (max-width: 768px)': {
        fontSize: '14px'
      }
    },
    floatingButton: {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      backgroundColor: '#ef5350',
      color: '#fff',
      borderRadius: '50%',
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.2s',
      '@media (max-width: 768px)': {
        bottom: '16px',
        right: '16px',
        width: '56px',
        height: '56px'
      }
    }
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
      padding: { xs: '16px', md: '40px' },
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {!providerId && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Provider ID not found. Please make sure you're logged in. You may need to log out and log in again.
        </Alert>
      )}

      {/* {providerId && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="caption" color="primary">
            Logged in as Provider: {providerId}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            📋 Showing only Direct Bookings (Indirect bookings are hidden)
          </Typography>
        </Box>
      )} */}

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
        <button
          onClick={() => changeMonth(-1)}
          style={{
            ...styles.navButton,
            padding: window.innerWidth <= 768 ? '8px' : '12px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Typography sx={{
          fontSize: { xs: '20px', md: '28px' },
          fontStyle: 'italic',
          fontWeight: '400',
          color: '#333'
        }}>
          {monthName}
        </Typography>
        <button
          onClick={() => changeMonth(1)}
          style={{
            ...styles.navButton,
            padding: window.innerWidth <= 768 ? '8px' : '12px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </Box>

      <Box sx={{
        backgroundColor: '#fff',
        borderRadius: { xs: '12px', md: '16px' },
        marginBottom: { xs: '16px', md: '32px' },
        padding: { xs: '12px', md: '32px' },
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
        padding: { xs: '12px', md: '24px' },
        marginBottom: { xs: '16px', md: '32px' },
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: '12px', md: '24px' },
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' }
        }}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: '#ef5350' }} />
            <span style={styles.legendText}>Fully Booked</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: '#ffd54f' }} />
            <span style={styles.legendText}>Slots Available</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: '#66bb6a' }} />
            <span style={styles.legendText}>Fully Free</span>
          </div>
        </Box>
      </Box>

      <Box sx={{ marginBottom: { xs: '16px', md: '24px' } }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: '12px', md: '24px' }
        }}>
          <Typography sx={{
            fontSize: { xs: '40px', md: '64px' },
            fontWeight: '300',
            color: '#333'
          }}>
            {selectedDate}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{
              fontSize: { xs: '16px', md: '22px' },
              fontWeight: '500',
              color: '#333',
              marginBottom: { xs: '4px', md: '6px' }
            }}>
              Selected Date
            </Typography>
            <Typography sx={{
              fontSize: { xs: '13px', md: '16px' },
              color: '#666'
            }}>
              {getStatusText()}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{
          fontSize: { xs: '12px', md: '14px' },
          color: '#999',
          marginLeft: { xs: '52px', md: '100px' },
          marginTop: { xs: '4px', md: '6px' }
        }}>
          {getDayName()}
        </Typography>
      </Box>

      {selectedBookings.length > 0 && (
        <div>
          <Typography sx={{
            fontSize: { xs: '18px', md: '22px' },
            fontWeight: '500',
            marginBottom: { xs: '12px', md: '20px' },
            color: '#333'
          }}>
            Today's Bookings
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '12px', md: '20px' }
          }}>
            {selectedBookings.map((booking) => (
              <Box
                key={booking._id}
                sx={{
                  borderRadius: { xs: '12px', md: '20px' },
                  padding: { xs: '16px', md: '28px' },
                  color: '#fff',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backgroundColor: getBookingCardColor(booking.status)
                }}
              >
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'flex-start' },
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: '8px', md: 0 },
                  marginBottom: { xs: '12px', md: '8px' }
                }}>
                  <Typography sx={{
                    fontSize: { xs: '13px', md: '15px' },
                    fontWeight: '500'
                  }}>
                    {booking.timeSlot?.label
                      ? `${booking.timeSlot.label} (${booking.timeSlot.time})`
                      : 'All Day'}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={booking.status}
                      size="small"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        color: booking.status === 'Pending' ? '#000' : '#fff'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteBooking(booking._id)}
                      disabled={deleteLoading === booking._id}
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      {deleteLoading === booking._id ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </Box>
                <Typography sx={{
                  fontSize: { xs: '18px', md: '24px' },
                  fontWeight: '500',
                  marginBottom: { xs: '8px', md: '10px' }
                }}>
                  Booked by {booking.fullName}
                </Typography>
                <Typography sx={{
                  fontSize: { xs: '13px', md: '15px' },
                  marginBottom: { xs: '10px', md: '14px' }
                }}>
                  {booking.venueId?.venueName || booking.location || 'Venue not specified'}
                </Typography>
                <Box sx={{ fontSize: { xs: '12px', md: '14px' }, marginTop: '8px' }}>
                  <div>Guests: {booking.numberOfGuests || 'N/A'}</div>
                  <div>Contact: {booking.contactNumber}</div>
                  <div>Email: {booking.emailAddress}</div>
                </Box>
              </Box>
            ))}
          </Box>
        </div>
      )}

      {selectedBookings.length === 0 && (
        <Box sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: { xs: '12px', md: '20px' },
          padding: { xs: '24px', md: '48px' },
          textAlign: 'center'
        }}>
          <div style={{ margin: '0 auto 20px', width: '100px', height: '100px' }}>
            <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="15" width="60" height="50" rx="4" stroke="#ccc" strokeWidth="2" fill="none" />
              <path d="M25 15 L25 10 M55 15 L55 10" stroke="#ccc" strokeWidth="2" />
              <path d="M20 25 L60 25" stroke="#ccc" strokeWidth="2" />
              <path d="M35 45 L45 45 M35 45 L40 40 M35 45 L40 50" stroke="#66bb6a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <Typography sx={{
            fontSize: { xs: '18px', md: '24px' },
            fontWeight: '500',
            marginBottom: { xs: '8px', md: '10px' },
            color: '#333'
          }}>
            No Bookings Today
          </Typography>
          <Typography sx={{
            fontSize: { xs: '14px', md: '16px' },
            color: '#666'
          }}>
            All slots are available for booking
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        sx={{
          position: 'fixed',
          bottom: { xs: '16px', md: '32px' },
          right: { xs: '16px', md: '32px' },
          backgroundColor: '#ef5350',
          color: '#fff',
          borderRadius: '50%',
          width: { xs: '56px', md: '64px' },
          height: { xs: '56px', md: '64px' },
          minWidth: 'unset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: '#e53935'
          }
        }}
        onClick={handleOpenDialog}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Button>

      <Dialog fullScreen open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Button onClick={handleCloseDialog} variant="text" size="small">
              ←
            </Button>
            Add Booking
          </Box>
        </DialogTitle>
        <div style={{ alignSelf: 'center' }}>
          <DialogContent sx={{ p: 3, backgroundColor: 'white', width: '500px' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box mb={4}>
              <Typography variant="h6" sx={sectionHeaderStyle}>
                <EditIcon sx={iconStyle} />
                Booking Details
              </Typography>
              <TextField
                fullWidth
                name="fullName"
                label="Full Name"
                variant="outlined"
                value={formData.fullName}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={iconStyle} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="contactNumber"
                label="Contact Number"
                variant="outlined"
                value={formData.contactNumber}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={iconStyle} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="emailAddress"
                label="Email Address"
                variant="outlined"
                value={formData.emailAddress}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={iconStyle} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="address"
                label="Address"
                variant="outlined"
                value={formData.address}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon sx={iconStyle} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="numberOfGuests"
                label="Number of Guests"
                type="number"
                variant="outlined"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon sx={iconStyle} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="additionalNotes"
                label="Additional Notes (Optional)"
                multiline
                rows={3}
                variant="outlined"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={iconStyle} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box mb={4}>
              <Typography variant="h6" sx={sectionHeaderStyle}>
                <DoorFrontIcon sx={iconStyle} />
                Select Module & Venue
              </Typography>

              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Select Module</InputLabel>
                <Select
                  name="moduleId"
                  value={formData.moduleId}
                  onChange={handleInputChange}
                  label="Select Module"
                >
                  <MenuItem value="">
                    <em>Select Module ({modules.length} available)</em>
                  </MenuItem>
                  {modules.map(module => (
                    <MenuItem key={module._id} value={module._id}>
                      {module.title || module.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Select Venue</InputLabel>
                <Select
                  name="venueId"
                  value={formData.venueId}
                  onChange={handleInputChange}
                  label="Select Venue"
                >
                  <MenuItem value="">
                    <em>Select Venue ({venues.length} available)</em>
                  </MenuItem>
                  {venues.map(venue => (
                    <MenuItem key={venue._id} value={venue._id}>
                      {venue.venueName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Select Package</InputLabel>
                <Select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleInputChange}
                  label="Select Package"
                  disabled={!formData.venueId || packages.length === 0}
                >
                  <MenuItem value="">
                    <em>
                      {!formData.venueId
                        ? 'Select a venue first'
                        : packages.length === 0
                          ? 'No packages available for this venue'
                          : `Select Package (${packages.length} available)`
                      }
                    </em>
                  </MenuItem>
                  {packages.map(pkg => (
                    <MenuItem key={pkg._id} value={pkg._id}>
                      {pkg.title} - AED {pkg.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {formData.venueId && packages.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This venue doesn't have any packages configured. You can still create a booking without selecting a package.
                </Alert>
              )}

              <Typography variant="h6" sx={sectionHeaderStyle}>
                <CalendarMonthIcon sx={iconStyle} />
                Select Booking Date
              </Typography>
              <TextField
                fullWidth
                name="bookingDate"
                type="date"
                variant="outlined"
                value={formData.bookingDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon sx={iconStyle} />
                    </InputAdornment>
                  )
                }}
                helperText="Select any date - past, present, or future"
              />

              <Typography variant="h6" sx={sectionHeaderStyle}>
                <AccessTimeIcon sx={iconStyle} />
                Select Time Slots
              </Typography>
              <FormGroup sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.timeSlot.includes('Morning')}
                      onChange={() => handleTimeSlotChange('Morning')}
                    />
                  }
                  label="Morning Slot 9:00 AM - 1:00 PM"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.timeSlot.includes('Evening')}
                      onChange={() => handleTimeSlotChange('Evening')}
                    />
                  }
                  label="Evening Slot 6:00 PM - 10:00 PM"
                />
              </FormGroup>

              <Typography variant="h6" sx={sectionHeaderStyle}>
                <PaymentIcon sx={iconStyle} />
                Payment Method
              </Typography>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  label="Payment Type"
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="GPay">GPay</MenuItem>
                  <MenuItem value="PhonePe">PhonePe</MenuItem>
                  <MenuItem value="Paytm">Paytm</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={submitLoading}
                sx={{
                  backgroundColor: '#ef5350',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#e53935'
                  }
                }}
              >
                {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Booking'}
              </Button>
            </Box>
          </DialogContent>
        </div>
      </Dialog>
    </Box>
  );
}

export default BookingCalendar;