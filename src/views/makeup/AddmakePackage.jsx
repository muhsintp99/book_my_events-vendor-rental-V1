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
  Checkbox,
  FormGroup,
  FormControlLabel as MuiFormControlLabel,
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
const API_BASE = 'http://localhost:5000';

// Makeup Module ID (from your Postman → module._id)
const MAKEUP_MODULE_ID = '68e5fc09651cc12c1fc0f9c9';

const MAKEUP_TYPES = [
  'HD Makeup',
  'Airbrush Makeup',
  'Matte Makeup',
  'Dewy/Glass Makeup',
  'Mineral Makeup',
  'Traditional',
];

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
        placeholder="e.g. Bridal Bun, Curls, Waves"
        value={Array.isArray(section.items) ? section.items.join(', ') : ''}
        onChange={(e) => onChange('items', e.target.value)}
        multiline
        rows={2}
        helperText=" Separate items with commas"
      />
    </Box>
  );
};

const AddmakePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Only Makeup Categories
  const [makeupCategories, setMakeupCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Form Fields
  const [packageTitle, setPackageTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [makeupType, setMakeupType] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [description, setDescription] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [advanceBookingAmount, setAdvanceBookingAmount] = useState('');
  const [trialIncluded, setTrialIncluded] = useState(false);
  const [travelToVenue, setTravelToVenue] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [serviceSections, setServiceSections] = useState([
    { id: Date.now(), title: '', items: [] },
  ]);

  const [basicServices, setBasicServices] = useState({
    hairStyling: false,
    sareeDraping: false,
    eyelashExtension: false,
    nailPolish: false,
  });

  const [galleryImages, setGalleryImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // Fetch ONLY Makeup Categories using correct endpoint
  useEffect(() => {
    const fetchMakeupCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await axios.get(
          `${API_BASE}/api/categories/modules/${MAKEUP_MODULE_ID}`
        );

        if (res.data.success && Array.isArray(res.data.data)) {
          setMakeupCategories(res.data.data);
        } else {
          setError('No makeup categories found');
        }
      } catch (err) {
        console.error('Error fetching makeup categories:', err);
        setError('Failed to load categories. Please refresh.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchMakeupCategories();
  }, []);

  // Edit Mode: Load existing package
  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/makeup-packages/${id}`);
        const pkg = res.data.data;

        setPackageTitle(pkg.packageTitle || '');
        setSelectedCategories(pkg.categories?.map(c => c._id || c) || []);
        setMakeupType(pkg.makeupType || '');
        setBasePrice(pkg.basePrice?.toString() || '');
        setOfferPrice(pkg.offerPrice?.toString() || '0');
        setDescription(pkg.description || '');
        setCancellationPolicy(pkg.cancellationPolicy || '');
        setAdvanceBookingAmount(pkg.advanceBookingAmount || '');
        setTrialIncluded(pkg.trialMakeupIncluded || false);
        setTravelToVenue(pkg.travelToVenue || false);
        setIsActive(pkg.isActive ?? true);

        if (pkg.includedServices?.length > 0) {
          setServiceSections(pkg.includedServices.map(s => ({
            id: s._id || Date.now(),
            title: s.title || '',
            items: Array.isArray(s.items) ? s.items : [],
          })));
        }

        if (pkg.gallery?.length > 0) {
          setExistingGallery(pkg.gallery.map(img => `${API_BASE}${img}`));
        }
      } catch (err) {
        setError('Failed to load package.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id, isEditMode]);

  // Handlers
  const handleAddSection = () => {
    setServiceSections(prev => [...prev, { id: Date.now(), title: '', items: [] }]);
  };

  const handleSectionChange = (id, field, value) => {
    setServiceSections(prev =>
      prev.map(sec => {
        if (sec.id === id) {
          if (field === 'items') {
            const items = value.split(',').map(i => i.trim()).filter(Boolean);
            return { ...sec, items };
          }
          return { ...sec, [field]: value };
        }
        return sec;
      })
    );
  };

  const handleDeleteSection = (id) => {
    if (serviceSections.length > 1) {
      setServiceSections(prev => prev.filter(sec => sec.id !== id));
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = galleryImages.length + existingGallery.length + files.length;
    if (total > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setGalleryImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (i) => setGalleryImages(prev => prev.filter((_, idx) => idx !== i));
  const removeExistingImage = (i) => setExistingGallery(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!packageTitle.trim()) return setError('Package title is required');
    if (selectedCategories.length === 0) return setError('Select at least one category');
    if (!makeupType) return setError('Select makeup type');
    if (!basePrice) return setError('Base price is required');
    if (!description.trim()) return setError('Description is required');

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('packageTitle', packageTitle.trim());
    selectedCategories.forEach(cat => formData.append('categories', cat));
    formData.append('makeupType', makeupType);
    formData.append('description', description.trim());
    formData.append('basePrice', basePrice);
    formData.append('offerPrice', offerPrice || '0');
    formData.append('cancellationPolicy', cancellationPolicy);
    formData.append('advanceBookingAmount', advanceBookingAmount);
    formData.append('trialMakeupIncluded', trialIncluded);
    formData.append('travelToVenue', travelToVenue);
    formData.append('isActive', isActive);
    formData.append('providerId', '68e77be26a1614cf448a34d7'); // Update if needed

    const validSections = serviceSections
      .filter(s => s.title.trim() && s.items.length > 0)
      .map(s => ({ title: s.title.trim(), items: s.items }));
    formData.append('includedServices', JSON.stringify(validSections));

    // Basic Add-ons
    const selectedBasic = Object.keys(basicServices)
      .filter(key => basicServices[key])
      .map(key => ({
        hairStyling: 'Hair Styling',
        sareeDraping: 'Saree Draping',
        eyelashExtension: 'Eyelash Extension',
        nailPolish: 'Nail Polish',
      }[key]));
    if (selectedBasic.length > 0) {
      let services = JSON.parse(formData.get('includedServices') || '[]');
      services.push({ title: 'Basic Add-ons', items: selectedBasic });
      formData.set('includedServices', JSON.stringify(services));
    }

    galleryImages.forEach(file => formData.append('gallery', file));

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE}/api/makeup-packages/${id}`, formData);
        setSuccessMessage('Package updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/makeup-packages`, formData);
        setSuccessMessage('Package created successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading || categoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f9f9fc', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #eee', p: 2, px: 4, position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {isEditMode ? 'Edit' : 'Add'} Makeup Package
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 3, md: 6 } }}>
          <TextField fullWidth label="Package Title *" value={packageTitle} onChange={e => setPackageTitle(e.target.value)} sx={{ mb: 3 }} />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            {/* ONLY MAKEUP CATEGORIES */}
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={e => setSelectedCategories(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(value => {
                      const cat = makeupCategories.find(c => c._id === value);
                      return <Chip key={value} label={cat?.title || 'Unknown'} size="small" />;
                    })}
                  </Box>
                )}
              >
                {makeupCategories.length === 0 ? (
                  <MenuItem disabled>No categories available</MenuItem>
                ) : (
                  makeupCategories.map(cat => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.title}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Makeup Type *</InputLabel>
              <Select value={makeupType} onChange={e => setMakeupType(e.target.value)}>
                <MenuItem value="" disabled>Select Type</MenuItem>
                {MAKEUP_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Rest of your form (keep same) */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <TextField fullWidth label="Base Price *" type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} />
            <TextField fullWidth label="Offer Price" type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} helperText="Leave empty if no discount" />
            <TextField fullWidth label="Advance Booking Amount" value={advanceBookingAmount} onChange={e => setAdvanceBookingAmount(e.target.value)} />
          </Stack>

          <TextField fullWidth label="Description *" multiline rows={4} value={description} onChange={e => setDescription(e.target.value)} sx={{ mb: 4 }} />

          {/* Basic Add-ons */}
          <Typography variant="h6" sx={{ mb: 2, color: PINK }}>Basic Add-ons</Typography>
          <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#fafafa' }}>
            <FormGroup row>
              {Object.keys(basicServices).map(key => (
                <MuiFormControlLabel
                  key={key}
                  control={<Checkbox checked={basicServices[key]} onChange={e => setBasicServices(prev => ({ ...prev, [key]: e.target.checked }))} />}
                  label={key === 'hairStyling' ? 'Hair Styling' : key === 'sareeDraping' ? 'Saree Draping' : key === 'eyelashExtension' ? 'Eyelash Extension' : 'Nail Polish'}
                />
              ))}
            </FormGroup>
          </Paper>

          {/* Custom Sections */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: PINK }}>Custom Service Sections</Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: PINK }} onClick={handleAddSection}>
                Add Section
              </Button>
            </Box>
            {serviceSections.map(section => (
              <ServiceSection
                key={section.id}
                section={section}
                onChange={(f, v) => handleSectionChange(section.id, f, v)}
                onDelete={() => handleDeleteSection(section.id)}
              />
            ))}
          </Box>

          <TextField fullWidth label="Cancellation Policy" multiline rows={3} value={cancellationPolicy} onChange={e => setCancellationPolicy(e.target.value)} sx={{ mb: 4 }} />

          <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
            <FormControlLabel control={<Switch checked={trialIncluded} onChange={() => setTrialIncluded(!trialIncluded)} />} label="Trial Makeup Included" />
            <FormControlLabel control={<Switch checked={travelToVenue} onChange={() => setTravelToVenue(!travelToVenue)} />} label="Travel to Venue" />
            <FormControlLabel control={<Switch checked={isActive} onChange={() => setIsActive(!isActive)} />} label="Package Active" />
          </Stack>

          {/* Gallery Upload */}
          <Typography variant="h6" sx={{ color: PINK, mb: 2 }}>Gallery (Max 5)</Typography>
          <Paper
            onClick={() => document.getElementById('gallery-input').click()}
            sx={{ border: '2px dashed #ddd', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', mb: 4 }}
          >
            <input id="gallery-input" type="file" hidden multiple accept="image/*" onChange={handleGalleryUpload} />
            {(galleryImages.length > 0 || existingGallery.length > 0) ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {existingGallery.map((img, i) => (
                  <Box key={`ex-${i}`} sx={{ position: 'relative' }}>
                    <img src={img} alt="" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton onClick={(e) => { e.stopPropagation(); removeExistingImage(i); }} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {galleryImages.map((file, i) => (
                  <Box key={`new-${i}`} sx={{ position: 'relative' }}>
                    <img src={URL.createObjectURL(file)} alt="" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton onClick={(e) => { e.stopPropagation(); removeNewImage(i); }} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: '#ccc' }} />
                <Typography sx={{ mt: 2, color: PINK, fontWeight: 'bold' }}>Click to Upload Images</Typography>
              </>
            )}
          </Paper>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ py: 2, bgcolor: PINK, '&:hover': { bgcolor: '#c2185b' } }}
          >
            {submitting ? <CircularProgress size={28} color="inherit" /> : isEditMode ? 'Update Package' : 'Create Package'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddmakePackage;