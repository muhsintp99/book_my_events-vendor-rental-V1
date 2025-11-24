import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  FormControlLabel,
  Switch,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';

const PINK = '#E91E63';
const API_BASE = 'https://api.bookmyevent.ae';

// Photography Module ID
const PHOTOGRAPHY_MODULE_ID = '68e5fb0fa4b2718b6cbf64e9';

// ------------------------------
// Service Section Component
// ------------------------------
const ServiceSection = ({ section, onChange, onDelete }) => {
  return (
    <Box sx={{ position: 'relative', border: '1px solid #e5e5e5', borderRadius: 2, p: 3, mb: 3, bgcolor: 'white' }}>
      <IconButton onClick={onDelete} sx={{ position: 'absolute', top: 12, right: 12, color: PINK }}>
        <DeleteIcon fontSize="small" />
      </IconButton>

      <TextField
        fullWidth
        label={<span>Section Title <span style={{ color: 'red' }}>*</span></span>}
        value={section.title || ''}
        onChange={(e) => onChange('title', e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label={<span>Items (comma separated) <span style={{ color: 'red' }}>*</span></span>}
        placeholder="e.g. Candid Photography, Drone Video"
        value={Array.isArray(section.items) ? section.items.join(', ') : ''}
        onChange={(e) => onChange('items', e.target.value)}
        multiline
        rows={2}
        helperText="Separate items with commas"
      />
    </Box>
  );
};

// ------------------------------
// Main Component
// ------------------------------
const AddPhotographyPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Categories
  const [photographyCategories, setPhotographyCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Vendor
  const [currentVendor, setCurrentVendor] = useState(null);

  // Form Fields
  const [packageTitle, setPackageTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [advanceBookingAmount, setAdvanceBookingAmount] = useState('');
  const [travelToVenue, setTravelToVenue] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [serviceSections, setServiceSections] = useState([
    { id: Date.now(), title: '', items: [] },
  ]);

  const [galleryImages, setGalleryImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // ------------------------------
  // Load Vendor Info
  // ------------------------------
  useEffect(() => {
    try {
      const vendorData =
        localStorage.getItem('vendor') ||
        localStorage.getItem('user') ||
        localStorage.getItem('vendorData');

      if (vendorData) {
        const parsed = JSON.parse(vendorData);
        setCurrentVendor(parsed);
      } else {
        const vendorId =
          localStorage.getItem('vendorId') ||
          localStorage.getItem('userId');
        if (vendorId) {
          setCurrentVendor({ _id: vendorId, id: vendorId });
        }
      }
    } catch (err) {
      console.error('Error loading vendor info:', err);
    }
  }, []);

  // ------------------------------
  // Fetch Photography Categories
  // ------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await axios.get(`${API_BASE}/api/categories/modules/${PHOTOGRAPHY_MODULE_ID}`);
        setPhotographyCategories(res.data.data || []);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ------------------------------
  // Fetch Existing Package (Edit Mode)
  // ------------------------------
  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/photography-packages/${id}`);
        const pkg = res.data.data;

        setPackageTitle(pkg.packageTitle);
        setSelectedCategories(pkg.categories.map(c => c._id));
        setPrice(pkg.price);
        setDescription(pkg.description);
        setCancellationPolicy(pkg.cancellationPolicy);
        setAdvanceBookingAmount(pkg.advanceBookingAmount);
        setTravelToVenue(pkg.travelToVenue);
        setIsActive(pkg.isActive);

        if (pkg.includedServices?.length > 0) {
          setServiceSections(pkg.includedServices.map(s => ({
            id: s._id,
            title: s.title,
            items: s.items,
          })));
        }

        if (pkg.gallery?.length > 0) {
          setExistingGallery(pkg.gallery.map(img => `${API_BASE}${img}`));
        }
      } catch (err) {
        setError('Failed to load package');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id, isEditMode]);

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleAddSection = () => {
    setServiceSections(prev => [...prev, { id: Date.now(), title: '', items: [] }]);
  };

  const handleSectionChange = (id, field, value) => {
    setServiceSections(prev =>
      prev.map(sec =>
        sec.id === id
          ? {
              ...sec,
              [field]:
                field === 'items'
                  ? value.split(',').map(i => i.trim()).filter(Boolean)
                  : value,
            }
          : sec
      )
    );
  };

  const handleDeleteSection = id => {
    if (serviceSections.length > 1) {
      setServiceSections(prev => prev.filter(sec => sec.id !== id));
    }
  };

  const handleGalleryUpload = e => {
    const files = Array.from(e.target.files);
    const total = galleryImages.length + existingGallery.length + files.length;

    if (total > 10) return alert('Maximum 10 images allowed');

    setGalleryImages(prev => [...prev, ...files]);
  };

  const removeNewImage = i =>
    setGalleryImages(prev => prev.filter((_, idx) => idx !== i));

  const removeExistingImage = i =>
    setExistingGallery(prev => prev.filter((_, idx) => idx !== i));

  // ------------------------------
  // Submit
  // ------------------------------
  const handleSubmit = async () => {
    const vendorId = currentVendor?._id || currentVendor?.id;

    if (!vendorId) return setError('Vendor not authenticated');

    if (!packageTitle.trim()) return setError('Package title required');
    if (selectedCategories.length === 0) return setError('Select at least one category');
    if (!price) return setError('Price required');
    if (!description.trim()) return setError('Description required');

    const formData = new FormData();

    formData.append('module', PHOTOGRAPHY_MODULE_ID);
    formData.append('packageTitle', packageTitle.trim());
    formData.append('description', description.trim());

    selectedCategories.forEach(cat => formData.append('categories', cat));

    formData.append('price', price);
    formData.append('cancellationPolicy', cancellationPolicy);
    formData.append('advanceBookingAmount', advanceBookingAmount);
    formData.append('travelToVenue', travelToVenue);
    formData.append('isActive', isActive);
    formData.append('providerId', vendorId);

    const validSections = serviceSections
      .filter(s => s.title.trim() && s.items.length > 0)
      .map(s => ({ title: s.title.trim(), items: s.items }));

    formData.append('includedServices', JSON.stringify(validSections));

    galleryImages.forEach(file => formData.append('gallery', file));

    try {
      setSubmitting(true);
      setError('');
      setSuccessMessage('');

      if (isEditMode) {
        await axios.put(`${API_BASE}/api/photography-packages/${id}`, formData);
        setSuccessMessage('Package updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/photography-packages`, formData);
        setSuccessMessage('Package created successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving package');
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ------------------------------
  // Loading State
  // ------------------------------
  if (loading || categoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // ------------------------------
  // Component UI
  // ------------------------------
  return (
    <Box sx={{ bgcolor: '#f9f9fc', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #eee', p: 2, px: 4, position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {isEditMode ? 'Edit' : 'Add'} Photography Package
          </Typography>
        </Box>

        {currentVendor && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
            Creating as: {currentVendor?.firstName || currentVendor?.email || currentVendor?._id}
          </Typography>
        )}
      </Box>

      {/* BODY */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 3, md: 6 } }}>

          {/* Package Title */}
          <TextField 
            fullWidth 
            label={<span>Package Title <span style={{ color: 'red' }}>*</span></span>}
            value={packageTitle} 
            onChange={e => setPackageTitle(e.target.value)} 
            sx={{ mb: 3 }} 
          />

          {/* Categories */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Categories *</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={e => setSelectedCategories(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(value => {
                      const cat = photographyCategories.find(c => c._id === value);
                      return <Chip key={value} label={cat?.title || 'Unknown'} size="small" />;
                    })}
                  </Box>
                )}
              >
                {photographyCategories.length === 0
                  ? <MenuItem disabled>No categories available</MenuItem>
                  : photographyCategories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Price + Advance Booking */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <TextField 
              fullWidth 
              label={<span>Price <span style={{ color: 'red' }}>*</span></span>}
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
            />
            <TextField 
              fullWidth 
              label="Advance Booking Amount (%)" 
              value={advanceBookingAmount} 
              onChange={e => setAdvanceBookingAmount(e.target.value)} 
              placeholder="e.g. 50%"
            />
          </Stack>

          {/* Description */}
          <TextField 
            fullWidth 
            label={<span>Description <span style={{ color: 'red' }}>*</span></span>}
            multiline 
            rows={4} 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            sx={{ mb: 4 }} 
          />

          {/* Service Sections */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: PINK }}>Included Services</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                sx={{ bgcolor: PINK, '&:hover': { bgcolor: '#c2185b' } }} 
                onClick={handleAddSection}
              >
                Add Section
              </Button>
            </Box>

            {serviceSections.map(section => (
              <ServiceSection
                key={section.id}
                section={section}
                onChange={(field, value) => handleSectionChange(section.id, field, value)}
                onDelete={() => handleDeleteSection(section.id)}
              />
            ))}
          </Box>

          {/* Cancellation Policy */}
          <TextField 
            fullWidth 
            label="Cancellation Policy" 
            multiline 
            rows={3} 
            value={cancellationPolicy} 
            onChange={e => setCancellationPolicy(e.target.value)} 
            sx={{ mb: 4 }} 
            placeholder="e.g. No refund within 48 hours"
          />

          {/* Toggles */}
          <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
            <FormControlLabel 
              control={<Switch checked={travelToVenue} onChange={() => setTravelToVenue(!travelToVenue)} />} 
              label="Travel to Venue" 
            />
            <FormControlLabel 
              control={<Switch checked={isActive} onChange={() => setIsActive(!isActive)} />} 
              label="Package Active" 
            />
          </Stack>

          {/* Gallery */}
          <Typography variant="h6" sx={{ color: PINK, mb: 2 }}>Gallery (Max 10)</Typography>
          <Paper
            onClick={() => document.getElementById('gallery-input').click()}
            sx={{ 
              border: '2px dashed #ddd', 
              borderRadius: 2, 
              p: 4, 
              textAlign: 'center', 
              cursor: 'pointer', 
              mb: 4,
              '&:hover': { borderColor: PINK }
            }}
          >
            <input 
              id="gallery-input" 
              type="file" 
              hidden 
              multiple 
              accept="image/*" 
              onChange={handleGalleryUpload} 
            />

            {(galleryImages.length > 0 || existingGallery.length > 0) ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {existingGallery.map((img, i) => (
                  <Box key={`ex-${i}`} sx={{ position: 'relative' }}>
                    <img 
                      src={img} 
                      alt="" 
                      style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} 
                    />
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); removeExistingImage(i); }} 
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', boxShadow: 2 }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {galleryImages.map((file, i) => (
                  <Box key={`new-${i}`} sx={{ position: 'relative' }}>
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="" 
                      style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} 
                    />
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); removeNewImage(i); }} 
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', boxShadow: 2 }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: '#ccc' }} />
                <Typography sx={{ mt: 2, color: PINK, fontWeight: 'bold' }}>
                  Click to Upload Images
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports: JPG, PNG, WEBP (Max 10MB each)
                </Typography>
              </>
            )}
          </Paper>

          {/* Submit */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={submitting || !currentVendor}
            sx={{ 
              py: 2, 
              bgcolor: PINK, 
              '&:hover': { bgcolor: '#c2185b' },
              '&:disabled': { bgcolor: '#ccc' }
            }}
          >
            {submitting ? (
              <CircularProgress size={28} color="inherit" />
            ) : (
              isEditMode ? 'Update Package' : 'Create Package'
            )}
          </Button>

        </Paper>
      </Box>
    </Box>
  );
};

export default AddPhotographyPackage;
