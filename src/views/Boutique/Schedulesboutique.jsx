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
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Checkroom as CheckroomIcon,
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Assignment as NoteIcon,
  ShoppingCart as PurchaseIcon,
  History as RentalIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon
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

function BoutiqueSchedules() {
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
    bookingMode: 'purchase', // rental or purchase
    days: 1,
    bookingDate: '',
    paymentType: 'Cash',
    bookingType: 'Direct'
  });

  const [currentSelection, setCurrentSelection] = useState({ variationId: '' });
  const [cart, setCart] = useState([]);

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
          String(b.moduleType || '').toLowerCase().includes('boutique')
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
      let modulesList = data.success ? (data.data || data.modules || []) : (Array.isArray(data) ? data : []);
      const filtered = modulesList.filter(m => (m.title || m.name || '').toLowerCase().includes('boutique'));
      setModules(filtered);
      if (filtered.length > 0 && !formData.moduleId) {
        setFormData(prev => ({ ...prev, moduleId: filtered[0]._id }));
      }
    } catch (err) { }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/boutiques/provider/${providerId}`);
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
        const bDate = new Date(b.bookingDate);
        return bDate.getDate() === day && bDate.getMonth() === month && bDate.getFullYear() === year;
      });
      status[day] = dayBookings.length === 0 ? 'free' : 'booked';
    }
    return status;
  };

  const bookingStatus = getCurrentMonthBookings();
  const getBookingsForSelectedDate = () =>
    bookings.filter(b => {
      if (!b.bookingDate) return false;
      const bDate = new Date(b.bookingDate);
      return bDate.getDate() === selectedDate && bDate.getMonth() === currentDate.getMonth() && bDate.getFullYear() === currentDate.getFullYear();
    });

  const selectedBookings = getBookingsForSelectedDate();
  const { firstDay, daysInMonth } = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return { firstDay: new Date(year, month, 1).getDay(), daysInMonth: new Date(year, month + 1, 0).getDate() };
  })();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const getStatusColor = (status) => status === 'booked' ? '#ef5350' : '#66bb6a';
  const changeMonth = (dir) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1));

  const renderCalendarDays = () => {
    const days = [];
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day =>
      days.push(<Box key={day} sx={{ textAlign: 'center', p: '16px', color: '#777', fontSize: '14px', fontWeight: '600' }}>{day}</Box>)
    );
    for (let i = 0; i < firstDay; i++) days.push(<Box key={`empty-${i}`} sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#f9f9f9', borderRadius: '12px' }} />);
    for (let day = 1; day <= daysInMonth; day++) {
      const status = bookingStatus[day] || 'free';
      const isToday = day === todayDate && currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear;
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
            minHeight: '100px', 
            cursor: isPast ? 'not-allowed' : 'pointer', 
            borderRadius: '16px', 
            transition: 'all 0.3s', 
            bgcolor: isPast ? '#f5f5f5' : (isSelected ? 'rgba(239, 83, 80, 0.05)' : '#fff'), 
            opacity: isPast ? 0.5 : 1,
            border: isSelected ? '1px solid #ef5350' : '1px solid #f0f0f0', 
            '&:hover': { 
              transform: isPast ? 'none' : 'translateY(-4px)', 
              boxShadow: isPast ? 'none' : '0 6px 16px rgba(0,0,0,0.08)', 
              borderColor: isPast ? '#f0f0f0' : '#ef5350', 
              zIndex: 1 
            } 
          }}
        >
          <Box sx={{ fontSize: '22px', fontWeight: isToday || isSelected ? '600' : '400', color: isToday ? '#fff' : (isSelected ? '#ef5350' : '#333'), width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: isToday ? '#ef5350' : 'transparent', mb: '8px' }}>{day}</Box>
          <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', bgcolor: isPast ? '#ccc' : getStatusColor(status) }} />
        </Box>
      );
    }
    return days;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'packageId') {
        setCurrentSelection({ variationId: '' });
        setCart([]);
    }
  };

  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    setCurrentSelection(prev => ({ ...prev, [name]: value }));
  };

  const addToCart = () => {
    if (!formData.packageId) {
        setError('Please select a product first');
        return;
    }
    const pkg = packages.find(p => p._id === formData.packageId);
    const variation = (pkg?.variations || []).find(v => (v._id || v.id) === currentSelection.variationId);
    
    const cartItem = {
        id: Date.now(),
        _id: variation?._id || variation?.id || null,
        name: variation ? variation.name : 'Standard Item',
        quantity: 1,
        price: variation ? variation.price : (formData.bookingMode === 'rental' ? pkg.rentalPricing?.pricePerDay : pkg.buyPricing?.unitPrice)
    };
    setCart(prev => [...prev, cartItem]);
    setCurrentSelection({ variationId: '' });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const handleSubmit = async () => {
    if (!formData.fullName.trim() || !formData.contactNumber.trim() || !formData.packageId) {
      setError('Please fill all customer information and product');
      return;
    }
    setSubmitLoading(true);
    setError(null);
    try {
      const bookingData = {
        providerId: providerId,
        moduleId: formData.moduleId || (modules[0] && modules[0]._id),
        boutiqueId: formData.packageId,
        bookingMode: formData.bookingMode,
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        address: formData.address,
        bookingDate: formData.bookingDate,
        deliveryType: 'Takeaway',
        days: formData.bookingMode === 'rental' ? Number(formData.days) : 1,
        variations: cart.length > 0 ? cart.map(({ id, ...rest }) => rest) : [],
        additionalNotes: formData.additionalNotes,
        bookingType: 'Direct',
        status: 'Accepted',
        paymentStatus: 'Paid',
        paymentType: 'Cash'
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
        fullName: '', contactNumber: '', emailAddress: '', address: '', additionalNotes: '', 
        moduleId: modules[0]?._id || '', packageId: '', bookingMode: 'purchase', days: 1,
        bookingDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toISOString().split('T')[0], 
        paymentType: 'Cash', bookingType: 'Direct' 
    });
    setCart([]);
    setActiveStep(0);
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleOpenDialog = () => {
    const selectedDateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate + 1).toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, bookingDate: selectedDateStr }));
    setOpenDialog(true);
    setActiveStep(0);
  };
  const handleCloseDialog = () => { setOpenDialog(false); setError(null); setActiveStep(0); };
  
  const steps = ['Customer Info', 'Order Selection', 'Review & Note'];
  const selectedPkg = packages.find(p => p._id === formData.packageId);
  const variations = selectedPkg?.variations || [];

  return (
    <Box sx={{ width: '100%', p: '40px', bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '32px', px: '20px' }}>
        <IconButton onClick={() => changeMonth(-1)} sx={{ bgcolor: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><ChevronLeftIcon /></IconButton>
        <Typography sx={{ fontSize: '32px', fontWeight: '600' }}>{monthName}</Typography>
        <IconButton onClick={() => changeMonth(1)} sx={{ bgcolor: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><ChevronRightIcon /></IconButton>
      </Box>

      <Box sx={{ bgcolor: '#fff', borderRadius: '24px', p: '40px', mb: '40px', border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>{renderCalendarDays()}</Box>
      </Box>

      <Box sx={{ bgcolor: '#fff', borderRadius: '24px', p: '32px', mb: '32px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 100, height: 100, bgcolor: '#ef5350', borderRadius: '20px', color: '#fff', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.2)' }}>
          <Typography sx={{ fontSize: '12px', fontWeight: '600' }}>{new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}</Typography>
          <Typography sx={{ fontSize: 40, fontWeight: 700 }}>{selectedDate}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} color="#333">{selectedBookings.length === 0 ? 'No Orders' : `${selectedBookings.length} Active Orders`}</Typography>
          <Typography color="#999" fontSize="14px">{selectedBookings.length === 0 ? 'Accept orders directly here' : 'Boutique movements for today'}</Typography>
        </Box>
        {!(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate) < new Date(todayYear, todayMonth, todayDate)) && (
          <Button variant="contained" onClick={handleOpenDialog} sx={{ bgcolor: '#ef5350', borderRadius: '12px', px: 4, height: 48, fontWeight: 700, '&:hover': { bgcolor: '#d32f2f' } }}>Add Booking</Button>
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
                  <Chip label={b.bookingMode === 'rental' ? 'Rental' : 'Purchase'} size="small" icon={b.bookingMode === 'rental' ? <RentalIcon sx={{ fontSize: 14 }} /> : <PurchaseIcon sx={{ fontSize: 14 }} />} sx={{ bgcolor: 'rgba(239, 83, 80, 0.1)', color: '#ef5350', fontWeight: 700 }} />
                  <IconButton size="small" onClick={() => handleDeleteBooking(b._id)} sx={{ color: '#ccc', '&:hover': { color: '#ef5350' } }}>{deleteLoading === b._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}</IconButton>
                </Stack>
                <Typography variant="h6" fontWeight={800} mb={1}>{renderSafe(b.fullName)}</Typography>
                <Typography variant="body2" color="#666" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckroomIcon sx={{ fontSize: 16, color: '#ef5350' }} />
                  {renderSafe(b.boutiqueId?.name || 'Product')}
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><PhoneIcon sx={{ fontSize: 16 }} /><Typography variant="body2">{renderSafe(b.contactNumber)}</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}><AccessTimeIcon sx={{ fontSize: 16 }} /><Typography variant="body2">{b.bookingMode === 'rental' ? `${b.days || 1} Day(s)` : 'Single Order'}</Typography></Box>
                </Stack>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
        <DialogTitle sx={{ position: 'relative' }}>
          <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', right: 20, top: 20, transition: 'all 0.3s ease', '&:hover': { transform: 'rotate(90deg)', color: '#ef5350', bgcolor: 'rgba(239, 83, 80, 0.1)' } }}><CloseIcon /></IconButton>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 2, textAlign: 'center' }}>Direct Boutique Order</Typography>
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
                <TextField fullWidth label="Delivery/Home Address" name="address" value={formData.address} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
              </Stack></Fade>
            )}
            {activeStep === 1 && (
              <Fade in={activeStep === 1}><Stack spacing={3}>
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                  <InputLabel>Select Product</InputLabel>
                  <Select label="Select Product" name="packageId" value={formData.packageId} onChange={handleInputChange}>
                    {packages.map(p => (
                      <MenuItem key={p._id} value={p._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">{renderSafe(p.name)}</Typography>
                        <Chip 
                          label={p.availabilityMode === 'rental' ? 'Rental' : 'Purchase'} 
                          size="small" 
                          sx={{ 
                            ml: 2, 
                            height: 20, 
                            fontSize: '10px', 
                            fontWeight: 700,
                            bgcolor: p.availabilityMode === 'rental' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                            color: p.availabilityMode === 'rental' ? '#2196f3' : '#4caf50'
                          }} 
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#666' }}>Order Category</Typography>
                  <ToggleButtonGroup value={formData.bookingMode} exclusive onChange={(e, val) => val && setFormData(prev => ({ ...prev, bookingMode: val }))} fullWidth>
                    <ToggleButton value="purchase" sx={{ borderRadius: '12px 0 0 12px', py: 1.5 }}><PurchaseIcon sx={{ mr: 1 }} /> Purchase</ToggleButton>
                    <ToggleButton value="rental" sx={{ borderRadius: '0 12px 12px 0', py: 1.5 }}><RentalIcon sx={{ mr: 1 }} /> Rental</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {variations.length > 0 && (
                    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: '16px' }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#666' }}>Select Variations</Typography>
                        <Stack direction="row" spacing={2} mb={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Size / Variant</InputLabel>
                                <Select label="Size / Variant" name="variationId" value={currentSelection.variationId} onChange={handleSelectionChange}>
                                    {variations.map(v => <MenuItem key={v._id || v.id} value={v._id || v.id}>{renderSafe(v.name)} - ₹{v.price || 'Base'}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button variant="outlined" onClick={addToCart} startIcon={<AddIcon />} sx={{ borderRadius: '12px', borderColor: '#ef5350', color: '#ef5350' }}>Add</Button>
                        </Stack>
                        <List dense>
                            {cart.map(item => (
                                <ListItem key={item.id} secondaryAction={<IconButton edge="end" size="small" onClick={() => removeFromCart(item.id)}><DeleteIcon fontSize="inherit" /></IconButton>}>
                                    <ListItemText primary={item.name} secondary={`Price: ₹${item.price}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {formData.bookingMode === 'rental' && (
                  <TextField fullWidth label="Rental Period (Days)" type="number" name="days" value={formData.days} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon sx={{ color: '#ef5350' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                )}
              </Stack></Fade>
            )}
            {activeStep === 2 && (
              <Fade in={activeStep === 2}><Stack spacing={3}>
                <Box sx={{ p: 3, borderRadius: '20px', border: '1px solid #eee', bgcolor: '#fafafa' }}>
                   <Typography variant="subtitle2" fontWeight={800} color="#555" gutterBottom>Booking Date</Typography>
                   <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <CalendarIcon sx={{ color: '#ef5350' }} />
                     {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}
                   </Typography>
                </Box>
                <TextField fullWidth multiline rows={4} label="Measurements / Custom Notes" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="E.g. Chest 38, Waist 32..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} />
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
              <Button fullWidth variant="contained" onClick={handleSubmit} disabled={submitLoading} sx={{ borderRadius: '16px', fontWeight: 700, height: 55, bgcolor: '#ef5350', boxShadow: '0 8px 16px rgba(239, 83, 80, 0.3)', '&:hover': { bgcolor: '#d32f2f' } }}>
                {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Order'}
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default BoutiqueSchedules;