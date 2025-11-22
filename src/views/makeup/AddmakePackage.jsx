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

const ServiceSection = ({ section, onChange, onDelete }) => {
  return (
    <Box sx={{ position: 'relative', border: '1px solid #e5e5e5', borderRadius: 2, p: 3, mb: 3, bgcolor: 'white' }}>
      <IconButton
        onClick={onDelete}
        sx={{ position: 'absolute', top: 12, right: 12, color: PINK }}
      >
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
      />
    </Box>
  );
};

const AddmakePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Form Fields
  const [packageTitle, setPackageTitle] = useState('');
  const [categories, setCategories] = useState([]);
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

  // Basic Services (Predefined)
  const [basicServices, setBasicServices] = useState({
    hairStyling: false,
    sareeDraping: false,
    eyelashExtension: false,
    nailPolish: false,
  });

  const [galleryImages, setGalleryImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  const categoryOptions = [
    { id: '6915f179edaddc3837ff31e7', title: 'Engagement' },
    { id: '6915f167edaddc3837ff31df', title: 'Bridal Makeup' },
  ];

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
        setCategories(pkg.categories?.map(c => c._id || c) || []);
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
          setExistingGallery(pkg.gallery.map(img => `${API_BASE}/${img}`));
        }
      } catch (err) {
        setError('Failed to load package.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id, isEditMode]);

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

  const resetForm = () => {
    setPackageTitle('');
    setCategories([]);
    setMakeupType('');
    setBasePrice('');
    setOfferPrice('');
    setDescription('');
    setCancellationPolicy('');
    setAdvanceBookingAmount('');
    setTrialIncluded(false);
    setTravelToVenue(false);
    setIsActive(true);
    setServiceSections([{ id: Date.now(), title: '', items: [] }]);
    setBasicServices({
      hairStyling: false,
      sareeDraping: false,
      eyelashExtension: false,
      nailPolish: false,
    });
    setGalleryImages([]);
    setExistingGallery([]);
  };

  const handleSubmit = async () => {
    if (!packageTitle.trim() || categories.length === 0 || !makeupType || !basePrice || !description.trim()) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    setSuccessMessage('');
    setError('');

    const formData = new FormData();
    formData.append('packageTitle', packageTitle.trim());
    categories.forEach(cat => formData.append('categories', cat));
    formData.append('makeupType', makeupType);
    formData.append('description', description.trim());
    formData.append('basePrice', basePrice);
    formData.append('offerPrice', offerPrice || '0');
    formData.append('cancellationPolicy', cancellationPolicy);
    formData.append('advanceBookingAmount', advanceBookingAmount);
    formData.append('trialMakeupIncluded', trialIncluded);
    formData.append('travelToVenue', travelToVenue);
    formData.append('isActive', isActive);
    formData.append('providerId', '68e77be26a1614cf448a34d7'); // Replace later

    // Custom Sections
    const validSections = serviceSections
      .filter(s => s.title.trim() && s.items.length > 0)
      .map(s => ({ title: s.title.trim(), items: s.items }));
    formData.append('includedServices', JSON.stringify(validSections));

    // Basic Services as extra section
    const selectedBasic = Object.keys(basicServices)
      .filter(key => basicServices[key])
      .map(key => {
        const labels = {
          hairStyling: 'Hair Styling',
          sareeDraping: 'Saree Draping',
          eyelashExtension: 'Eyelash Extension',
          nailPolish: 'Nail Polish',
        };
        return labels[key];
      });
    if (selectedBasic.length > 0) {
      const existingServices = JSON.parse(formData.get('includedServices') || '[]');
      existingServices.push({ title: 'Basic Add-ons', items: selectedBasic });
      formData.set('includedServices', JSON.stringify(existingServices));
    }

    galleryImages.forEach(file => formData.append('gallery', file));

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE}/api/makeup-packages/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage('Package updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/makeup-packages`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage('Package created successfully!');
        resetForm(); // Reset form after successful creation
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      console.error(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select multiple value={categories} onChange={e => setCategories(e.target.value)}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(value => (
                      <Chip key={value} label={categoryOptions.find(c => c.id === value)?.title || value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {categoryOptions.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Makeup Type *</InputLabel>
              <Select value={makeupType} onChange={e => setMakeupType(e.target.value)}>
                <MenuItem value="HD">HD Makeup</MenuItem>
                <MenuItem value="Airbrush">Airbrush Makeup</MenuItem>
                <MenuItem value="Traditional">Traditional</MenuItem>
                <MenuItem value="Matte">Matte</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <TextField fullWidth label="Base Price *" type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} />
            <TextField fullWidth label="Offer Price (%)" type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} />
            <TextField fullWidth label="Advance Booking Amount" value={advanceBookingAmount} onChange={e => setAdvanceBookingAmount(e.target.value)} />
          </Stack>

          <TextField fullWidth label="Description / Details *" multiline rows={4} value={description} onChange={e => setDescription(e.target.value)} sx={{ mb: 4 }} />

          {/* Basic Services Section */}
          <Typography variant="h6" sx={{ color: PINK, fontWeight: 'bold', mb: 2 }}>Basic Services</Typography>
          <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#fafafa' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select from predefined services
            </Typography>
            <FormGroup>
              <MuiFormControlLabel
                control={<Checkbox checked={basicServices.hairStyling} onChange={e => setBasicServices(prev => ({ ...prev, hairStyling: e.target.checked }))} />}
                label="Hair Styling"
              />
              <MuiFormControlLabel
                control={<Checkbox checked={basicServices.sareeDraping} onChange={e => setBasicServices(prev => ({ ...prev, sareeDraping: e.target.checked }))} />}
                label="Saree Draping"
              />
              <MuiFormControlLabel
                control={<Checkbox checked={basicServices.eyelashExtension} onChange={e => setBasicServices(prev => ({ ...prev, eyelashExtension: e.target.checked }))} />}
                label="Eyelash Extension"
              />
              <MuiFormControlLabel
                control={<Checkbox checked={basicServices.nailPolish} onChange={e => setBasicServices(prev => ({ ...prev, nailPolish: e.target.checked }))} />}
                label="Nail Polish"
              />
            </FormGroup>
          </Paper>

          {/* Custom Service Sections */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: PINK, fontWeight: 'bold' }}>Custom Service Sections</Typography>
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

          <Typography variant="h6" sx={{ color: PINK, fontWeight: 'bold', mb: 2 }}>Gallery Images (Max 5)</Typography>
          <Paper
            onClick={() => document.getElementById('gallery-upload')?.click()}
            sx={{ border: '2px dashed #e0e0e0', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', mb: 4, '&:hover': { borderColor: PINK } }}
          >
            <input id="gallery-upload" type="file" hidden multiple accept="image/*" onChange={handleGalleryUpload} />
            {(galleryImages.length > 0 || existingGallery.length > 0) ? (
              <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 2 }}>
                  {existingGallery.map((img, i) => (
                    <Box key={`existing-${i}`} sx={{ position: 'relative', width: 120, height: 120 }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); removeExistingImage(i); }}
                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  {galleryImages.map((file, i) => (
                    <Box key={`new-${i}`} sx={{ position: 'relative', width: 120, height: 120 }}>
                      <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); removeNewImage(i); }}
                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                <Typography variant="body2" sx={{ color: PINK, fontWeight: 'bold' }}>
                  {galleryImages.length + existingGallery.length} / 5 images
                </Typography>
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: '#ccc' }} />
                <Typography sx={{ mt: 2, color: PINK, fontWeight: 'bold' }}>Click to Upload</Typography>
              </>
            )}
          </Paper>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ py: 2, fontSize: '1.2rem', bgcolor: PINK, '&:hover': { bgcolor: '#c2185b' } }}
          >
            {submitting ? <CircularProgress size={28} sx={{ color: 'white' }} /> : isEditMode ? 'Update Package' : 'Create Package'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddmakePackage;