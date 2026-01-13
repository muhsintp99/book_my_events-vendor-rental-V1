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
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Grid,
  Divider
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

const API_BASE_URL = 'https://api.bookmyevent.ae';

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [openDialog, setOpenDialog] = useState(false);
  const [bookings, setBookings] = useState([]);

  // 🎂 CAKE STATES
  const [cakes, setCakes] = useState([]);
  const [cakeVariations, setCakeVariations] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);

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

    cakeId: '',
    deliveryType: 'Home Delivery',
    customerMessage: '',

    bookingDate: new Date().toISOString().split('T')[0],
    timeSlot: [],
    paymentType: 'COD',
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
      fetchModules();
      fetchCakes(); // ✅ ADD
    }
  }, [currentDate, providerId]);

  // Auto-select module if only one is available
  useEffect(() => {
    if (modules.length === 1 && !formData.moduleId) {
      setFormData((prev) => ({
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
      const filteredModules = modulesList.filter((module) => {
        const moduleTitle = (module.title || module.name || '').toLowerCase();
        // Only show Venues module (you can adjust this logic)
        return moduleTitle === 'cake';
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

  // 🎂 FETCH CAKES (DIRECT BOOKING)
  const fetchCakes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cakes/provider/${providerId}?moduleId=68e5fc09651cc12c1fc0f9c9`);
      const data = await response.json();
      if (data.success) {
        setCakes(data.data || []);
      }
    } catch (err) {
      console.error('Fetch cakes error:', err);
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
        setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
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
      const dayBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (
          bookingDate.getDate() === day &&
          bookingDate.getMonth() === month &&
          bookingDate.getFullYear() === year &&
          booking.bookingType === 'Direct'
        );
      });

      // 🔴 count slots instead of bookings
      const totalSlots = dayBookings.reduce((acc, b) => {
        return acc + (Array.isArray(b.timeSlot) ? b.timeSlot.length : 1);
      }, 0);

      if (totalSlots === 0) {
        status[day] = 'free';
      } else if (totalSlots >= 2) {
        status[day] = 'booked'; // 🔴 RED
      } else {
        status[day] = 'available'; // 🟡 YELLOW
      }
    }

    return status;
  };

  const bookingStatus = getCurrentMonthBookings();

  const getBookingsForSelectedDate = () => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      const isSelectedDate =
        bookingDate.getDate() === selectedDate &&
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
          onClick={() => setSelectedDate(day)}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '50px', md: '100px' },
            cursor: 'pointer',
            borderRadius: { xs: '8px', md: '16px' },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: isSelected ? 'rgba(239, 83, 80, 0.05)' : '#fff',
            border: isSelected ? '1px solid #ef5350' : '1px solid #f0f0f0',
            boxShadow: isSelected ? '0 4px 12px rgba(239, 83, 80, 0.15)' : 'none',
            '&:hover': {
              transform: { md: 'translateY(-4px)' },
              boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
              borderColor: '#ef5350',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeSlotChange = (slot) => {
    setFormData((prev) => {
      const timeSlots = prev.timeSlot.includes(slot) ? prev.timeSlot.filter((s) => s !== slot) : [...prev.timeSlot, slot];
      return { ...prev, timeSlot: timeSlots };
    });
  };
  // 🎂 HANDLE CAKE SELECT
  const handleCakeChange = (e) => {
    const cakeId = e.target.value;
    setFormData((prev) => ({ ...prev, cakeId }));

    const cake = cakes.find((c) => c._id === cakeId);
    setCakeVariations(cake?.variations || []);
    setSelectedVariations([]);
  };

  // 🎂 VARIATION HANDLERS
  const toggleVariation = (variation) => {
    setSelectedVariations((prev) => {
      const exists = prev.find((v) => v._id === variation._id);
      if (exists) return prev.filter((v) => v._id !== variation._id);
      return [...prev, { ...variation, quantity: 1 }];
    });
  };

  const updateVariationQty = (id, qty) => {
    setSelectedVariations((prev) => prev.map((v) => (v._id === id ? { ...v, quantity: Math.max(1, qty) } : v)));
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setError(null);

    try {
      if (!formData.fullName.trim()) {
        setError('Full Name is required');
        return;
      }

      if (!formData.contactNumber.trim()) {
        setError('Contact Number is required');
        return;
      }

      if (!formData.cakeId) {
        setError('Please select a cake');
        return;
      }

      if (!selectedVariations.length) {
        setError('Please select at least one cake variation');
        return;
      }

      if (!formData.bookingDate) {
        setError('Please select booking date');
        return;
      }

      if (!formData.timeSlot.length) {
        setError('Please select time slot');
        return;
      }

      const bookingData = {
        moduleId: modules[0]._id,
        moduleType: 'Cake',

        cakeId: formData.cakeId,
        cakeVariations: selectedVariations,
        deliveryType: formData.deliveryType,
        customerMessage: formData.customerMessage,

        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        address: formData.address,
        numberOfGuests: formData.numberOfGuests ? Number(formData.numberOfGuests) : 1, // Defaulting to 1 if not provided, but field added below

        bookingDate: formData.bookingDate,
        timeSlot: formData.timeSlot,

        paymentType: formData.paymentType,
        bookingType: 'Direct'
      };

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();

      if (data.success) {
        alert('Cake booking created successfully!');
        setOpenDialog(false);
        fetchBookings();
      } else {
        setError(data.message || 'Booking failed');
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
      cakeId: '',
      deliveryType: 'Home Delivery',
      customerMessage: '',
      bookingDate: new Date().toISOString().split('T')[0],
      timeSlot: [],
      paymentType: 'COD',
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    navigation: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      padding: '0 20px'
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
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    monthTitle: {
      fontSize: '28px',
      fontStyle: 'italic',
      fontWeight: '400',
      color: '#333'
    },
    calendarGrid: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      marginBottom: '32px',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '16px'
    },
    weekDay: {
      textAlign: 'center',
      padding: '12px',
      color: '#999',
      fontSize: '16px',
      fontWeight: '500'
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
      transition: 'background-color 0.2s'
    },
    dayNumber: {
      fontSize: '20px',
      fontWeight: '400',
      color: '#333',
      marginBottom: '6px'
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
      fontWeight: '600'
    },
    statusDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%'
    },
    legend: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    legendContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    legendDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    },
    legendText: {
      fontSize: '15px',
      color: '#666'
    },
    selectedInfo: {
      marginBottom: '24px'
    },
    selectedHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    selectedNumber: {
      fontSize: '64px',
      fontWeight: '300',
      color: '#333'
    },
    selectedDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    selectedTitle: {
      fontSize: '22px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '6px'
    },
    selectedStatus: {
      fontSize: '16px',
      color: '#666'
    },
    selectedDay: {
      fontSize: '14px',
      color: '#999',
      marginLeft: '100px',
      marginTop: '6px'
    },
    bookingsTitle: {
      fontSize: '22px',
      fontWeight: '500',
      marginBottom: '20px',
      color: '#333'
    },
    bookingsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    bookingCard: {
      borderRadius: '20px',
      padding: '28px',
      color: '#fff',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    bookingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    },
    bookingTime: {
      fontSize: '15px',
      fontWeight: '500'
    },
    bookingStatus: {
      fontSize: '11px',
      padding: '4px 12px',
      borderRadius: '12px',
      fontWeight: '500',
      backgroundColor: 'rgba(255,255,255,0.3)'
    },
    bookingName: {
      fontSize: '24px',
      fontWeight: '500',
      marginBottom: '10px'
    },
    bookingLocation: {
      fontSize: '15px',
      marginBottom: '14px'
    },
    noBookings: {
      backgroundColor: '#f5f5f5',
      borderRadius: '20px',
      padding: '48px',
      textAlign: 'center'
    },
    noBookingsTitle: {
      fontSize: '24px',
      fontWeight: '500',
      marginBottom: '10px',
      color: '#333'
    },
    noBookingsText: {
      fontSize: '16px',
      color: '#666'
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
      transition: 'background-color 0.2s, transform 0.2s'
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
          flexDirection: { xs: 'row', md: 'row' }
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
                      {Array.isArray(booking.timeSlot)
                        ? booking.timeSlot.map((t, i) => (
                          <span key={i}>
                            {t.label} ({t.time}){i < booking.timeSlot.length - 1 ? ', ' : ''}
                          </span>
                        ))
                        : booking.timeSlot?.label
                          ? `${booking.timeSlot.label} (${booking.timeSlot.time})`
                          : 'All Day'}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '18px', md: '22px' }, fontWeight: '700', color: '#1a1a1a' }}>
                      {booking.fullName}
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
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Cake</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>{booking.cakeId?.name || 'Cake Booking'}</Typography>
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

      <Dialog
        fullScreen
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#fafafa'
          }
        }}
      >
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <Box sx={{
            px: { xs: 2, md: 4 },
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleCloseDialog} sx={{ color: '#333' }}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                Create New Booking
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{ flex: 1, p: 0, backgroundColor: '#f8f9fa' }}>
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: { xs: 2, md: 4 } }}>
              {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: '16px', border: '1px solid #ffcdd2', boxShadow: '0 4px 12px rgba(239, 83, 80, 0.1)' }}>
                  {error}
                </Alert>
              )}

              {/* Top Row: Client Info & Selection */}
              <Grid item xs={12}>
                <Box sx={{
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  p: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #f0f0f0',
                  height: '100%'
                }}>
                  <Typography variant="h6" sx={{ ...sectionHeaderStyle, mb: 3 }}>
                    <PersonIcon sx={iconStyle} />
                    Client Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
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
                              <PersonIcon sx={{ color: '#999', fontSize: 20 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                              <PhoneIcon sx={{ color: '#999', fontSize: 20 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="emailAddress"
                        label="Email Address (Optional)"
                        variant="outlined"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: '#999', fontSize: 20 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="address"
                        label="Delivery Address (Optional)"
                        variant="outlined"
                        value={formData.address}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeIcon sx={{ color: '#999', fontSize: 20 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  p: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #f0f0f0',
                  height: '100%'
                }}>
                  <Typography variant="h6" sx={{ ...sectionHeaderStyle, mb: 3 }}>
                    <DescriptionIcon sx={iconStyle} />
                    Cake Selection
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel shrink>Select Cake</InputLabel>
                        <Select
                          name="cakeId"
                          value={formData.cakeId}
                          onChange={handleCakeChange}
                          label="Select Cake"
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            <span style={{ color: '#999' }}>Select Cake</span>
                          </MenuItem>
                          {cakes.map(cake => (
                            <MenuItem key={cake._id} value={cake._id}>
                              {cake.cakeTitle || cake.packageName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {cakeVariations.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#555' }}>Select Variations</Typography>
                        <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                          <Grid container spacing={2}>
                            {cakeVariations.map(variation => {
                              const selected = selectedVariations.find(v => v._id === variation._id);
                              return (
                                <Grid item xs={12} key={variation._id}>
                                  <Box sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: selected ? '#ef5350' : '#f0f0f0',
                                    backgroundColor: selected ? '#fff5f5' : '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.2s'
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Checkbox
                                        checked={!!selected}
                                        onChange={() => toggleVariation(variation)}
                                        sx={{ color: '#ef5350', '&.Mui-checked': { color: '#ef5350' } }}
                                      />
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{variation.name}</Typography>
                                        <Typography variant="caption" sx={{ color: '#ef5350', fontWeight: 700 }}>AED {variation.price}</Typography>
                                      </Box>
                                    </Box>
                                    {selected && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton
                                          size="small"
                                          onClick={() => updateVariationQty(variation._id, selected.quantity - 1)}
                                          sx={{ border: '1px solid #ef5350', color: '#ef5350' }}
                                        >
                                          <Typography variant="body2" sx={{ fontWeight: 900 }}>-</Typography>
                                        </IconButton>
                                        <Typography sx={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{selected.quantity}</Typography>
                                        <IconButton
                                          size="small"
                                          onClick={() => updateVariationQty(variation._id, selected.quantity + 1)}
                                          sx={{ backgroundColor: '#ef5350', color: '#fff', '&:hover': { backgroundColor: '#e53935' } }}
                                        >
                                          <Typography variant="body2" sx={{ fontWeight: 900 }}>+</Typography>
                                        </IconButton>
                                      </Box>
                                    )}
                                  </Box>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>

              {/* Bottom Row: Scheduling & Notes side-by-side */}
              <Grid item xs={12}>
                <Box sx={{
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  p: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #f0f0f0',
                  height: '100%'
                }}>
                  <Typography variant="h6" sx={{ ...sectionHeaderStyle, mb: 3 }}>
                    <CalendarMonthIcon sx={iconStyle} />
                    Scheduling
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="bookingDate"
                        label="Booking Date"
                        type="date"
                        variant="outlined"
                        value={formData.bookingDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 4 }}
                      />
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#555' }}>Select Delivery Type</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        {['Home Delivery', 'Store Pickup'].map((type) => (
                          <Box
                            key={type}
                            onClick={() => setFormData(prev => ({ ...prev, deliveryType: type }))}
                            sx={{
                              flex: 1,
                              p: 1.5,
                              textAlign: 'center',
                              borderRadius: '12px',
                              border: '2px solid',
                              borderColor: formData.deliveryType === type ? '#ef5350' : '#f0f0f0',
                              backgroundColor: formData.deliveryType === type ? '#fff5f5' : '#fff',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '13px',
                              transition: 'all 0.2s',
                              color: formData.deliveryType === type ? '#ef5350' : '#666'
                            }}
                          >
                            {type}
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#555' }}>Select Time Slots</Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        p: 2,
                        backgroundColor: '#fcfcfc',
                        borderRadius: '16px',
                        border: '1px solid #f5f5f5'
                      }}>
                        <FormControlLabel
                          control={<Checkbox checked={formData.timeSlot.includes('Morning')} onChange={() => handleTimeSlotChange('Morning')} sx={{ color: '#ef5350', '&.Mui-checked': { color: '#ef5350' } }} />}
                          label={<Box sx={{ ml: 1 }}><Typography variant="body2" sx={{ fontWeight: 600 }}>Morning Delivery</Typography><Typography variant="caption" sx={{ color: '#999' }}>9:00 AM - 1:00 PM</Typography></Box>}
                        />
                        <Divider sx={{ my: 1, opacity: 0.5 }} />
                        <FormControlLabel
                          control={<Checkbox checked={formData.timeSlot.includes('Evening')} onChange={() => handleTimeSlotChange('Evening')} sx={{ color: '#ef5350', '&.Mui-checked': { color: '#ef5350' } }} />}
                          label={<Box sx={{ ml: 1 }}><Typography variant="body2" sx={{ fontWeight: 600 }}>Evening Delivery</Typography><Typography variant="caption" sx={{ color: '#999' }}>6:00 PM - 10:00 PM</Typography></Box>}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#555' }}>Payment Method</Typography>
                      <Grid container spacing={2}>
                        {[
                          { id: 'COD', label: 'COD', icon: <MoneyIcon /> },
                          { id: 'Card', label: 'Card', icon: <CreditCardIcon /> },
                          { id: 'UPI', label: 'UPI', icon: <AccountBalanceWalletIcon /> },
                          { id: 'Bank Transfer', label: 'Bank', icon: <AccountBalanceIcon /> },
                          { id: 'Other', label: 'Other', icon: <MoreHorizIcon /> }
                        ].map((type) => (
                          <Grid item xs={6} key={type.id}>
                            <Box
                              onClick={() => setFormData(prev => ({ ...prev, paymentType: type.id }))}
                              sx={{
                                p: 1.5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.5,
                                borderRadius: '12px',
                                border: '2px solid',
                                borderColor: formData.paymentType === type.id ? '#ef5350' : '#f0f0f0',
                                backgroundColor: formData.paymentType === type.id ? '#fff5f5' : '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': { borderColor: '#ef5350', transform: 'translateY(-2px)' }
                              }}
                            >
                              <Box sx={{ color: formData.paymentType === type.id ? '#ef5350' : '#666', transform: 'scale(0.8)' }}>
                                {type.icon}
                              </Box>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: formData.paymentType === type.id ? '#ef5350' : '#666', fontSize: '10px' }}>
                                {type.label}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="address"
                            label="Delivery Address (Optional)"
                            variant="outlined"
                            value={formData.address}
                            onChange={handleInputChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HomeIcon sx={{ color: '#999', fontSize: 20 }} />
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="numberOfGuests"
                            label="Number of Guests (Optional)"
                            type="number"
                            variant="outlined"
                            value={formData.numberOfGuests || ''}
                            onChange={handleInputChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PeopleIcon sx={{ color: '#999', fontSize: 20 }} />
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  p: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #f0f0f0',
                  height: '100%'
                }}>
                  <Typography variant="h6" sx={{ ...sectionHeaderStyle, mb: 3 }}>
                    <DescriptionIcon sx={iconStyle} />
                    Additional Customization
                  </Typography>
                  <TextField
                    fullWidth
                    name="customerMessage"
                    label="Message on Cake"
                    multiline
                    rows={10}
                    variant="outlined"
                    value={formData.customerMessage}
                    onChange={handleInputChange}
                    placeholder="E.g. Happy Birthday John! Any special instructions..."
                  />
                </Box>
              </Grid>
            </Box>

        </Box>
      </DialogContent>

      {/* Sticky Professional Footer */}
      <Box sx={{
        p: 2.5,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <Button
          onClick={handleSubmit}
          disabled={submitLoading}
          variant="contained"
          sx={{
            backgroundColor: '#ef5350',
            px: 8,
            py: 1.8,
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'none',
            boxShadow: '0 8px 24px rgba(239, 83, 80, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#e53935',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 30px rgba(239, 83, 80, 0.4)'
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
        >
          {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm & Save Booking'}
        </Button>
      </Box>
    </Box>
      </Dialog >
    </Box >
  );
}

export default BookingCalendar;
