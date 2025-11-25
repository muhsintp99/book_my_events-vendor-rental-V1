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
const API_BASE = 'https://api.bookmyevent.ae';
const MAKEUP_MODULE_ID = '68e5fc09651cc12c1fc0f9c9';

// ------------------------------
// Section Component
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
        placeholder="e.g. Bridal Bun, Curls, Waves"
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
const AddmakePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const [makeupCategories, setMakeupCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [makeupTypes, setMakeupTypes] = useState([]);
  const [makeupTypesLoading, setMakeupTypesLoading] = useState(true);

  const [currentVendor, setCurrentVendor] = useState(null);

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

  // ⭐ Basic Add-ons
  const [basicServices, setBasicServices] = useState({
    hairStyling: false,
    sareeDraping: false,
    eyelashExtension: false,
    nailPolish: false,
  });

  const [galleryImages, setGalleryImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // ------------------------------ Load Vendor ------------------------------
  useEffect(() => {
    try {
      const vendorData =
        localStorage.getItem('vendor') ||
        localStorage.getItem('user') ||
        localStorage.getItem('vendorData');

      if (vendorData) {
        setCurrentVendor(JSON.parse(vendorData));
      } else {
        const vendorId = localStorage.getItem('vendorId') || localStorage.getItem('userId');
        if (vendorId) setCurrentVendor({ _id: vendorId });
      }
    } catch (err) {
      console.error("Vendor load error:", err);
    }
  }, []);

  // ------------------------------ Fetch Categories ------------------------------
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/categories/modules/${MAKEUP_MODULE_ID}`)
      .then((res) => setMakeupCategories(res.data.data || []))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // ------------------------------ Fetch Makeup Types ------------------------------
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/makeup-types`)
      .then((res) => setMakeupTypes(res.data.data || []))
      .catch(() => setMakeupTypes([]))
      .finally(() => setMakeupTypesLoading(false));
  }, []);

  // ------------------------------ Load Existing Package (EDIT MODE) ------------------------------
  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const loadPackage = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/makeup-packages/${id}`);
        const pkg = data.data;

        setPackageTitle(pkg.packageTitle);
        setSelectedCategories(pkg.categories.map((c) => c._id));
        setMakeupType(pkg.makeupType);
        setBasePrice(pkg.basePrice);
        setOfferPrice(pkg.offerPrice);
        setDescription(pkg.description);
        setCancellationPolicy(pkg.cancellationPolicy);
        setAdvanceBookingAmount(pkg.advanceBookingAmount);
        setTrialIncluded(pkg.trialMakeupIncluded);
        setTravelToVenue(pkg.travelToVenue);
        setIsActive(pkg.isActive);

        if (pkg.includedServices?.length > 0) {
          setServiceSections(
            pkg.includedServices.map((s) => ({
              id: s._id,
              title: s.title,
              items: s.items,
            }))
          );
        }

        if (pkg.gallery?.length > 0) {
          setExistingGallery(pkg.gallery.map((img) => `${API_BASE}${img}`));
        }

        // ⭐ Load Basic Add-ons
        if (pkg.basicAddOns) {
          setBasicServices({
            hairStyling: pkg.basicAddOns.hairStyling || false,
            sareeDraping: pkg.basicAddOns.sareeDraping || false,
            eyelashExtension: pkg.basicAddOns.eyelashExtension || false,
            nailPolish: pkg.basicAddOns.nailPolish || false,
          });
        }

      } catch (err) {
        setError("Failed to load package");
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [isEditMode, id]);

  // ------------------------------ Handlers ------------------------------
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
    setServiceSections(prev => prev.filter(sec => sec.id !== id));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = galleryImages.length + existingGallery.length + files.length;

    if (total > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setGalleryImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (i) =>
    setGalleryImages(prev => prev.filter((_, idx) => idx !== i));

  const removeExistingImage = (i) =>
    setExistingGallery(prev => prev.filter((_, idx) => idx !== i));

  // ------------------------------ Submit Handler ------------------------------
  const handleSubmit = async () => {
    const vendorId = currentVendor?._id || currentVendor?.id;

    if (!vendorId) return setError("Vendor not authenticated");
    if (!packageTitle.trim()) return setError("Package title required");
    if (!selectedCategories.length) return setError("Select categories");
    if (!makeupType) return setError("Select makeup type");
    if (!basePrice) return setError("Base price required");
    if (!description.trim()) return setError("Description required");

    const formData = new FormData();

    formData.append("module", MAKEUP_MODULE_ID);
    formData.append("packageTitle", packageTitle);
    formData.append("description", description);
    formData.append("makeupType", makeupType);
    formData.append("basePrice", basePrice);
    formData.append("offerPrice", offerPrice || "0");
    formData.append("advanceBookingAmount", advanceBookingAmount);
    formData.append("cancellationPolicy", cancellationPolicy);
    formData.append("isActive", isActive);
    formData.append("providerId", vendorId);
    formData.append("trialMakeupIncluded", trialIncluded);
    formData.append("travelToVenue", travelToVenue);

    selectedCategories.forEach((c) => formData.append("categories", c));

    // ⭐ Add Basic Add-ons
    formData.append("basicAddOns", JSON.stringify(basicServices));

    const validSections = serviceSections
      .filter((s) => s.title.trim() && s.items.length > 0)
      .map((s) => ({ title: s.title, items: s.items }));

    formData.append("includedServices", JSON.stringify(validSections));

    galleryImages.forEach((file) => formData.append("gallery", file));

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      if (isEditMode) {
        await axios.put(`${API_BASE}/api/makeup-packages/${id}`, formData);
        setSuccessMessage("Package updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/makeup-packages`, formData);
        setSuccessMessage("Package created successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error saving package");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------ Loading Screen ------------------------------
  if (loading || categoriesLoading || makeupTypesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // ------------------------------ UI Rendering ------------------------------
  return (
    <Box sx={{ bgcolor: '#f9f9fc', minHeight: '100vh' }}>

      {/* HEADER */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #eee', p: 2, px: 4, position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {isEditMode ? "Edit" : "Add"} Makeup Package
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

          {/* Title */}
          <TextField
            fullWidth
            label="Package Title *"
            value={packageTitle}
            onChange={(e) => setPackageTitle(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Categories + Makeup Types */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>

            {/* Categories */}
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={(e) => setSelectedCategories(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const cat = makeupCategories.find((c) => c._id === value);
                      return <Chip key={value} label={cat?.title} size="small" />;
                    })}
                  </Box>
                )}
              >
                {makeupCategories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Makeup Type */}
            <FormControl fullWidth>
              <InputLabel>Makeup Type *</InputLabel>
              <Select
                value={makeupType}
                onChange={(e) => setMakeupType(e.target.value)}
              >
                <MenuItem value="" disabled>Select Type</MenuItem>
                {makeupTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

          </Stack>

          {/* Price Fields */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>
            <TextField fullWidth label="Base Price *" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
            <TextField fullWidth label="Offer Price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} helperText="Leave empty if no discount" />
            <TextField fullWidth label="Advance Booking Amount" value={advanceBookingAmount} onChange={(e) => setAdvanceBookingAmount(e.target.value)} />
          </Stack>

          {/* Description */}
          <TextField fullWidth label="Description *" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 4 }} />

          {/* Basic Add-ons */}
          <Typography variant="h6" sx={{ mb: 2, color: PINK }}>Basic Add-ons</Typography>
          <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: "#fafafa" }}>
            <FormGroup row>
              {Object.keys(basicServices).map((key) => (
                <MuiFormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={basicServices[key]}
                      onChange={(e) =>
                        setBasicServices((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={{
                    hairStyling: "Hair Styling",
                    sareeDraping: "Saree Draping",
                    eyelashExtension: "Eyelash Extension",
                    nailPolish: "Nail Polish",
                  }[key]}
                />
              ))}
            </FormGroup>
          </Paper>

          {/* Custom Sections */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ color: PINK }}>Custom Service Sections</Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: PINK }} onClick={handleAddSection}>
                Add Section
              </Button>
            </Box>

            {serviceSections.map((section) => (
              <ServiceSection
                key={section.id}
                section={section}
                onChange={(field, value) => handleSectionChange(section.id, field, value)}
                onDelete={() => handleDeleteSection(section.id)}
              />
            ))}
          </Box>

          {/* Cancellation Policy */}
          <TextField fullWidth label="Cancellation Policy" multiline rows={3} value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} sx={{ mb: 4 }} />

          {/* Toggles */}
          <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
            <FormControlLabel control={<Switch checked={trialIncluded} onChange={() => setTrialIncluded(!trialIncluded)} />} label="Trial Makeup Included" />
            <FormControlLabel control={<Switch checked={travelToVenue} onChange={() => setTravelToVenue(!travelToVenue)} />} label="Travel to Venue" />
            <FormControlLabel control={<Switch checked={isActive} onChange={() => setIsActive(!isActive)} />} label="Package Active" />
          </Stack>

          {/* Gallery */}
          <Typography variant="h6" sx={{ color: PINK, mb: 2 }}>Gallery (Max 5)</Typography>
          <Paper
            onClick={() => document.getElementById("gallery-input").click()}
            sx={{
              border: "2px dashed #ddd",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              mb: 4,
            }}
          >
            <input id="gallery-input" type="file" hidden multiple accept="image/*" onChange={handleGalleryUpload} />

            {(galleryImages.length > 0 || existingGallery.length > 0) ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {existingGallery.map((img, i) => (
                  <Box key={`ex-${i}`} sx={{ position: "relative" }}>
                    <img src={img} alt="" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }} />
                    <IconButton onClick={(e) => { e.stopPropagation(); removeExistingImage(i); }} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "white" }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {galleryImages.map((file, i) => (
                  <Box key={`new-${i}`} sx={{ position: "relative" }}>
                    <img src={URL.createObjectURL(file)} alt="" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }} />
                    <IconButton onClick={(e) => { e.stopPropagation(); removeNewImage(i); }} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "white" }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: "#ccc" }} />
                <Typography sx={{ mt: 2, color: PINK, fontWeight: "bold" }}>
                  Click to Upload Images
                </Typography>
              </>
            )}
          </Paper>

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={submitting || !currentVendor}
            sx={{ py: 2, bgcolor: PINK, "&:hover": { bgcolor: "#c2185b" } }}
          >
            {submitting ? <CircularProgress size={28} color="inherit" /> : isEditMode ? "Update Package" : "Create Package"}
          </Button>

        </Paper>
      </Box>
    </Box>
  );
};

export default AddmakePackage;
