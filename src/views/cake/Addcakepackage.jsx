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
  OutlinedInput,
  ListItemText
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';

const PINK = '#E91E63';
const API_BASE = 'https://api.bookmyevent.ae';
const CAKE_MODULE_ID = '68e5fc09651cc12c1fc0f9c9';

// ------------------------------
// Variation Row Component
// ------------------------------
const VariationRow = ({ variation, onChange, onDelete }) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <TextField
        label="Variation Name (e.g. Half Kg)"
        value={variation.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Price (₹)"
        type="number"
        value={variation.price || ''}
        onChange={(e) => onChange('price', e.target.value)}
        sx={{ width: 150 }}
      />
      <IconButton onClick={onDelete} color="error">
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

// Main Component
// ------------------------------
const AddCakePackage = () => {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const isEditMode = Boolean(id);


  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [currentVendor, setCurrentVendor] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [itemType, setItemType] = useState('Veg');
  const [nutrition, setNutrition] = useState('');
  const [allergenIngredients, setAllergenIngredients] = useState('');
  const [isHalal, setIsHalal] = useState(true);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('22:00');
  const [unitPrice, setUnitPrice] = useState('');
  const [advanceBookingAmount, setAdvanceBookingAmount] = useState('');
  const [discountType, setDiscountType] = useState('Amount');
  const [discount, setDiscount] = useState('');
  const [maxPurchaseQty, setMaxPurchaseQty] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isTopPick, setIsTopPick] = useState(false);

  const [variations, setVariations] = useState([{ id: Date.now(), name: '', price: '' }]);

  // Images
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // ------------------------------ Load Vendor ------------------------------
  useEffect(() => {
    try {
      const vendorData = localStorage.getItem('vendor') || localStorage.getItem('user') || localStorage.getItem('vendorData');
      if (vendorData) {
        setCurrentVendor(JSON.parse(vendorData));
      }
    } catch (err) {
      console.error('Vendor load error:', err);
    }
  }, []);

  // ------------------------------ Fetch Parent Categories ------------------------------
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/categories/parents/${CAKE_MODULE_ID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const parentCats = response.data?.data || [];
        setCategories(parentCats);
        
        console.log('✅ Parent Categories Loaded:', parentCats);
      } catch (err) {
        console.error('❌ Failed to load parent categories:', err);
        setError('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchParentCategories();
  }, []);

  // ------------------------------ Fetch Subcategories when Parent Category Changes ------------------------------
  const handleCategoryChange = async (e) => {
    const parentId = e.target.value;
    setCategory(parentId);
    setSelectedSubCategories([]);
    setSubCategories([]);

    if (!parentId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/categories/parents/${parentId}/subcategories`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const subCats = response.data?.data || [];
      setSubCategories(subCats);
      
      console.log('✅ Subcategories Loaded:', subCats);
    } catch (err) {
      console.error('❌ Failed to load subcategories:', err);
      setSubCategories([]);
    }
  };

  // ------------------------------ Load Existing Cake (EDIT MODE) ------------------------------
  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const loadCake = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/cakes/${id}`);
        const cake = data.data;

        setName(cake.name);
        setShortDescription(cake.shortDescription);
        
        // ✅ Handle parent category
        if (cake.category?.parentCategory?._id) {
          const parentId = cake.category.parentCategory._id;
          setCategory(parentId);
          
          // ✅ Fetch subcategories for this parent
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_BASE}/api/categories/parents/${parentId}/subcategories`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSubCategories(response.data?.data || []);
          
          // ✅ Set the selected subcategory
          setSelectedSubCategories([cake.category._id]);
        } else if (cake.category?._id) {
          // Fallback if category structure is different
          setCategory(cake.category._id);
        }
        
        setItemType(cake.itemType);
        setNutrition(cake.nutrition?.join(', ') || '');
        setAllergenIngredients(cake.allergenIngredients?.join(', ') || '');
        setIsHalal(cake.isHalal);
        setStartTime(cake.timeSchedule?.startTime || '10:00');
        setEndTime(cake.timeSchedule?.endTime || '22:00');
        setUnitPrice(cake.priceInfo?.unitPrice || '');
        setAdvanceBookingAmount(cake.priceInfo?.advanceBookingAmount || '');
        setDiscountType(cake.priceInfo?.discountType || 'Amount');
        setDiscount(cake.priceInfo?.discount || '');
        setMaxPurchaseQty(cake.priceInfo?.maxPurchaseQty || '');
        setSearchTags(cake.searchTags?.join(', ') || '');
        setIsActive(cake.isActive);
        setIsTopPick(cake.isTopPick);

        // Variations
        if (cake.variations?.length > 0) {
          setVariations(cake.variations.map((v) => ({ 
            id: v._id || Date.now(), 
            name: v.name, 
            price: v.price 
          })));
        }

        // Images
        if (cake.thumbnail) setExistingThumbnail(cake.thumbnail);
        if (cake.images?.length > 0) setExistingGallery(cake.images);
      } catch (err) {
        console.error('Failed to load cake:', err);
        setError('Failed to load cake details');
      } finally {
        setLoading(false);
      }
    };

    loadCake();
  }, [isEditMode, id]);

  // ------------------------------ Handlers ------------------------------
  const handleAddVariation = () => {
    setVariations((prev) => [...prev, { id: Date.now(), name: '', price: '' }]);
  };

  const handleVariationChange = (id, field, value) => {
    setVariations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleDeleteVariation = (id) => {
    setVariations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) setThumbnail(file);
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = galleryImages.length + existingGallery.length + files.length;
    if (total > 10) {
      alert('Maximum 10 gallery images allowed');
      return;
    }
    setGalleryImages((prev) => [...prev, ...files]);
  };

  const removeNewGalleryImage = (i) => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i));
  const removeExistingGalleryImage = (i) => setExistingGallery((prev) => prev.filter((_, idx) => idx !== i));

  // ------------------------------ Submit Handler ------------------------------
  const handleSubmit = async () => {
    const vendorId = currentVendor?._id || currentVendor?.id;
    if (!vendorId) {
      setError('Vendor not authenticated');
      return;
    }
    if (!name.trim()) {
      setError('Cake name is required');
      return;
    }
    if (!category) {
      setError('Select a category');
      return;
    }
    if (!unitPrice) {
      setError('Unit price is required');
      return;
    }
    if (!thumbnail && !existingThumbnail) {
      setError('Thumbnail image is required');
      return;
    }

    const formData = new FormData();

    // Basic fields
    formData.append('name', name);
    formData.append('shortDescription', shortDescription);
    formData.append('module', CAKE_MODULE_ID);
    formData.append('category', category); // ✅ This is now the parent category ID
    formData.append('itemType', itemType);
    formData.append('isHalal', isHalal);
    formData.append('isActive', isActive);
    formData.append('isTopPick', isTopPick);
    formData.append('provider', vendorId);

    // ✅ Subcategories - send as JSON array
    if (selectedSubCategories.length > 0) {
      formData.append('subCategories', JSON.stringify(selectedSubCategories));
    }

    // Time schedule
    formData.append('timeSchedule', JSON.stringify({
      startTime,
      endTime
    }));

    // Price info
    const priceInfoObj = {
      unitPrice: Number(unitPrice),
      discountType,
      discount: discount ? Number(discount) : 0,
      maxPurchaseQty: maxPurchaseQty ? Number(maxPurchaseQty) : undefined
    };

    // ✅ Add advance booking amount if provided
    if (advanceBookingAmount) {
      priceInfoObj.advanceBookingAmount = Number(advanceBookingAmount);
    }

    formData.append('priceInfo', JSON.stringify(priceInfoObj));

    // Arrays
    if (nutrition.trim()) {
      const nutritionArr = nutrition.split(',').map((i) => i.trim()).filter(Boolean);
      formData.append('nutrition', JSON.stringify(nutritionArr));
    }
    
    if (allergenIngredients.trim()) {
      const allergenArr = allergenIngredients.split(',').map((i) => i.trim()).filter(Boolean);
      formData.append('allergenIngredients', JSON.stringify(allergenArr));
    }
    
    if (searchTags.trim()) {
      const tagsArr = searchTags.split(',').map((t) => t.trim()).filter(Boolean);
      formData.append('searchTags', JSON.stringify(tagsArr));
    }

    // Variations
    const validVariations = variations
      .filter((v) => v.name && v.price)
      .map(({ name, price }) => ({ name, price: Number(price) }));
    
    if (validVariations.length > 0) {
      formData.append('variations', JSON.stringify(validVariations));
    }

    // Images
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    
    galleryImages.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setSubmitting(true);
      setError('');
      setSuccessMessage('');

      let response;
      
      if (isEditMode) {
        response = await axios.put(`${API_BASE}/api/cakes/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMessage('Cake updated successfully!');
      } else {
        response = await axios.post(`${API_BASE}/api/cakes`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMessage('Cake created successfully!');
      }

      // ✅ Fetch and populate the created/updated cake data
      if (response.data.success && response.data.data) {
        const cakeData = response.data.data;
        
        console.log('✅ Cake Package Created/Updated:', {
          id: cakeData._id,
          name: cakeData.name,
          cakeId: cakeData.cakeId,
          category: cakeData.category?.title,
          provider: cakeData.provider?.storeName,
          thumbnail: cakeData.thumbnail,
          priceInfo: cakeData.priceInfo,
          variations: cakeData.variations,
          module: cakeData.module?.title
        });

        // Optionally navigate to cake list or detail page after 2 seconds
        // setTimeout(() => {
        //   navigate('/cakes'); 
        // }, 2000);
      }

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Error saving cake');
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ------------------------------ Loading Screen ------------------------------
  if (loading || categoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} sx={{ color: PINK }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f9f9fc', minHeight: '100vh' }}>
      {/* HEADER */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #eee', p: 2, px: 4, position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {isEditMode ? 'Edit' : 'Add'} Cake Package
          </Typography>
        </Box>
        {currentVendor && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
            Creating as: {currentVendor.firstName} {currentVendor.lastName}
          </Typography>
        )}
      </Box>

      {/* BODY */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 3, md: 6 } }}>
          {/* Name & Short Description */}
          <TextField 
            fullWidth 
            label="Cake Name *" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            sx={{ mb: 3 }} 
          />
          <TextField
            fullWidth
            label="Short Description *"
            multiline
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Category & Subcategories */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Parent Category *</InputLabel>
              <Select value={category} onChange={handleCategoryChange}>
                <MenuItem value="">Select Parent Category</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!category}>
              <InputLabel>Sub Categories</InputLabel>
              <Select
                multiple
                value={selectedSubCategories}
                onChange={(e) => setSelectedSubCategories(e.target.value)}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const sub = subCategories.find((s) => s._id === value);
                      return <Chip key={value} label={sub?.title || value} size="small" />;
                    })}
                  </Box>
                )}
              >
                {subCategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    <Checkbox checked={selectedSubCategories.includes(sub._id)} />
                    <ListItemText primary={sub.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Type & Dietary */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3, alignItems: 'center' }}>
            <FormControl fullWidth>
              <InputLabel>Item Type</InputLabel>
              <Select value={itemType} onChange={(e) => setItemType(e.target.value)}>
                <MenuItem value="Veg">Veg</MenuItem>
                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch checked={isHalal} onChange={() => setIsHalal(!isHalal)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: PINK } }} />}
              label="Halal Certified"
            />
          </Stack>

          {/* Nutrition & Allergens */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Nutrition (comma separated)"
              placeholder="e.g. Sugar, Milk, Flour"
              value={nutrition}
              onChange={(e) => setNutrition(e.target.value)}
            />
            <TextField
              fullWidth
              label="Allergen Ingredients (comma separated)"
              placeholder="e.g. Nuts, Gluten"
              value={allergenIngredients}
              onChange={(e) => setAllergenIngredients(e.target.value)}
            />
          </Stack>

          {/* Time Schedule */}
          <Typography variant="h6" sx={{ mb: 2, color: PINK }}>Availability Time</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <TextField 
              label="Start Time" 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              fullWidth
            />
            <TextField 
              label="End Time" 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              fullWidth
            />
          </Stack>

          {/* Pricing */}
          <Typography variant="h6" sx={{ mb: 2, color: PINK }}>Pricing</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 2 }}>
            <TextField 
              fullWidth 
              label="Base Unit Price (₹) *" 
              type="number" 
              value={unitPrice} 
              onChange={(e) => setUnitPrice(e.target.value)} 
            />
            <TextField 
              fullWidth 
              label="Advance Booking Amount (₹)" 
              type="number" 
              value={advanceBookingAmount} 
              onChange={(e) => setAdvanceBookingAmount(e.target.value)}
              helperText="Amount to be paid upfront"
            />
          </Stack>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Discount Type</InputLabel>
              <Select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                <MenuItem value="Amount">Amount</MenuItem>
                <MenuItem value="Percentage">Percentage</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              label="Discount Value" 
              type="number" 
              value={discount} 
              onChange={(e) => setDiscount(e.target.value)} 
              fullWidth
            />
            <TextField 
              label="Max Purchase Qty" 
              type="number" 
              value={maxPurchaseQty} 
              onChange={(e) => setMaxPurchaseQty(e.target.value)} 
              fullWidth
            />
          </Stack>

          {/* Variations */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: PINK }}>Variations (Size/Weight)</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                sx={{ bgcolor: PINK, '&:hover': { bgcolor: '#c2185b' } }} 
                onClick={handleAddVariation}
              >
                Add Variation
              </Button>
            </Box>
            {variations.map((variation) => (
              <VariationRow
                key={variation.id}
                variation={variation}
                onChange={(field, value) => handleVariationChange(variation.id, field, value)}
                onDelete={() => handleDeleteVariation(variation.id)}
              />
            ))}
          </Box>

          {/* Search Tags */}
          <TextField
            fullWidth
            label="Search Tags (comma separated)"
            placeholder="e.g. chocolate, birthday, wedding"
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
            sx={{ mb: 4 }}
          />

          {/* Toggles */}
          <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
            <FormControlLabel 
              control={<Switch checked={isActive} onChange={() => setIsActive(!isActive)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: PINK } }} />} 
              label="Active" 
            />
            <FormControlLabel 
              control={<Switch checked={isTopPick} onChange={() => setIsTopPick(!isTopPick)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: PINK } }} />} 
              label="Top Pick" 
            />
          </Stack>

          {/* Thumbnail */}
          <Typography variant="h6" sx={{ color: PINK, mb: 2 }}>Thumbnail Image *</Typography>
          <Paper
            onClick={() => document.getElementById('thumbnail-input').click()}
            sx={{ border: '2px dashed #ddd', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', mb: 4 }}
          >
            <input id="thumbnail-input" type="file" hidden accept="image/*" onChange={handleThumbnailUpload} />
            {thumbnail || existingThumbnail ? (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={thumbnail ? URL.createObjectURL(thumbnail) : existingThumbnail}
                  alt="Thumbnail"
                  style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8 }}
                />
                {thumbnail && (
                  <IconButton 
                    onClick={(e) => { e.stopPropagation(); setThumbnail(null); }} 
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: '#ccc' }} />
                <Typography sx={{ mt: 2, color: PINK, fontWeight: 'bold' }}>Click to Upload Thumbnail</Typography>
              </>
            )}
          </Paper>

          {/* Gallery */}
          <Typography variant="h6" sx={{ color: PINK, mb: 2 }}>Gallery Images (Max 10)</Typography>
          <Paper
            onClick={() => document.getElementById('gallery-input').click()}
            sx={{ border: '2px dashed #ddd', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', mb: 4 }}
          >
            <input id="gallery-input" type="file" hidden multiple accept="image/*" onChange={handleGalleryUpload} />
            {(galleryImages.length > 0 || existingGallery.length > 0) ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {existingGallery.map((img, i) => (
                  <Box key={`ex-${i}`} sx={{ position: 'relative' }}>
                    <img src={img} alt="" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); removeExistingGalleryImage(i); }} 
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {galleryImages.map((file, i) => (
                  <Box key={`new-${i}`} sx={{ position: 'relative' }}>
                    <img src={URL.createObjectURL(file)} alt="" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); removeNewGalleryImage(i); }} 
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: '#ccc' }} />
                <Typography sx={{ mt: 2, color: PINK, fontWeight: 'bold' }}>Click to Upload Gallery Images</Typography>
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
            sx={{ py: 2, bgcolor: PINK, '&:hover': { bgcolor: '#c2185b' } }}
          >
            {submitting ? <CircularProgress size={28} color="inherit" /> : isEditMode ? 'Update Cake Package' : 'Create Cake Package'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddCakePackage;