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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const API_BASE_URL = 'https://api.bookmyevent.ae';

function BookingCalendar() {
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

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    emailAddress: '',
    address: '',
    numberOfGuests: '',
    additionalNotes: '',

    moduleId: '',

    vehicleId: '',

    // 🔥 REQUIRED FOR TRANSPORT
    tripType: 'perDay',
    days: 1,
    hours: null,
    distanceKm: null,

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
      fetchVehicles(); // ✅ ADD THIS
      fetchModules();
    } else {
      setError('Provider ID not found. Please log in again.');
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

  const fetchModules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/modules`);
      const data = await response.json();

      const modulesList =
        data?.data || data?.modules || (Array.isArray(data) ? data : []);

      const transportModule = modulesList.find(m =>
        (m.title || '').toLowerCase() === 'transport'
      );

      if (!transportModule) {
        setError("Transport module not found in system");
        return;
      }

      setModules([transportModule]);

      // 🔥 FORCE moduleId
      setFormData(prev => ({
        ...prev,
        moduleId: transportModule._id
      }));

      console.log("✅ Transport module fixed:", transportModule._id);
    } catch (err) {
      console.error("Fetch modules error:", err);
      setError("Failed to fetch modules");
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/provider/${providerId}`);
      const data = await response.json();

      if (data.success) {
        setVehicles(data.data || []);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error('Fetch vehicles error:', err);
      setVehicles([]);
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
      // Only count Direct bookings
      const dayBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (
          bookingDate.getDate() === day &&
          bookingDate.getMonth() === month &&
          bookingDate.getFullYear() === year &&
          booking.bookingType === 'Direct'
        );
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
        bookingType: formData.bookingType, // ✅ REQUIRED
        bookingDate: formData.bookingDate,

        vehicleId: formData.vehicleId,
        tripType: formData.tripType,        // ✅ REQUIRED
        days: formData.tripType === 'perDay' ? Number(formData.days) : null,
        hours: formData.tripType === 'hourly' ? Number(formData.hours) : null,
        distanceKm:
          formData.tripType === 'distanceWise'
            ? Number(formData.distanceKm)
            : null,

        timeSlot: formData.timeSlot, // backend normalizes it

        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        address: formData.address,

        paymentType: formData.paymentType,
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
      moduleId: '',
      vehicleId: '',

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
        borderRadius: { xs: '12px', md: '16px' },
        marginBottom: { xs: '16px', md: '32px' },
        padding: { xs: '8px 4px', md: '32px' },
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: { xs: '2px', md: '16px' }
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
                      {booking.timeSlot?.length
                        ? booking.timeSlot.map((slot) => `${slot.label} (${slot.time})`).join(', ')
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
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Vehicle</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>{booking.vehicleId?.name || 'Vehicle not specified'}</Typography>
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: '32px 16px', md: '48px' },
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ margin: '0 auto 20px', width: '100px', height: '100px' }}>
            <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="15" width="60" height="50" rx="4" stroke="#ccc" strokeWidth="2" fill="none" />
              <path d="M25 15 L25 10 M55 15 L55 10" stroke="#ccc" strokeWidth="2" />
              <path d="M20 25 L60 25" stroke="#ccc" strokeWidth="2" />
              <path d="M35 45 L45 45 M35 45 L40 40 M35 45 L40 50" stroke="#66bb6a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Box>
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 500, mb: 1 }}>
            No Bookings Today
          </Typography>
          <Typography sx={{ color: '#666' }}>
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
        <Box sx={{ alignSelf: 'center', width: '100%' }}>
          <DialogContent sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'white', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
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
                Select Vehicle
              </Typography>

              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Select Vehicle</InputLabel>
                <Select name="vehicleId" value={formData.vehicleId} onChange={handleInputChange} label="Select Vehicle">
                  <MenuItem value="">
                    <em>{vehicles.length === 0 ? 'No vehicles available' : `Select Vehicle (${vehicles.length} available)`}</em>
                  </MenuItem>

                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle._id} value={vehicle._id}>
                      {vehicle.name || vehicle.packageTitle || vehicle.packageName || vehicle.title} • {vehicle.seatingCapacity} Seater • AED {vehicle.pricing?.perDay}/day
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
                  control={<Checkbox checked={formData.timeSlot.includes('Morning')} onChange={() => handleTimeSlotChange('Morning')} />}
                  label="Morning Slot 9:00 AM - 1:00 PM"
                />
                <FormControlLabel
                  control={<Checkbox checked={formData.timeSlot.includes('Evening')} onChange={() => handleTimeSlotChange('Evening')} />}
                  label="Evening Slot 6:00 PM - 10:00 PM"
                />
              </FormGroup>

              <Typography variant="h6" sx={sectionHeaderStyle}>
                <PaymentIcon sx={iconStyle} />
                Payment Method
              </Typography>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Payment Type</InputLabel>
                <Select name="paymentType" value={formData.paymentType} onChange={handleInputChange} label="Payment Type">
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
        </Box>
      </Dialog>
    </Box>
  );
}

export default BookingCalendar;
