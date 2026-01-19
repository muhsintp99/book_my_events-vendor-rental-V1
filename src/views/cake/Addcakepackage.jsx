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
  ListItemText,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  PhotoCamera as PhotoCameraIcon,
  Payments as PaymentsIcon,
  LocalShipping as ShippingIcon,
  Label as LabelIcon,
  AutoAwesome as AutoAwesomeIcon,
  Search as SearchIcon,
  LocalFlorist as FlowersIcon,
  Brightness7 as GoldIcon,
  FilterVintage as SugarIcon,
  Cake as CakeIcon,
  WaterDrop as DripIcon,
  Inventory as BoxIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';

const PINK = '#E91E63';
const API_BASE = 'https://api.bookmyevent.ae';
const CAKE_MODULE_ID = '68e5fc09651cc12c1fc0f9c9';

// ------------------------------ STYLED COMPONENTS ------------------------------

const PremiumCard = styled(Paper)(({ theme }) => ({
  borderRadius: '24px',
  padding: '40px',
  marginBottom: '40px',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  boxShadow: '0px 15px 50px rgba(0, 0, 0, 0.02)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: '#ffffff',
  '&:hover': {
    boxShadow: '0px 25px 70px rgba(0, 0, 0, 0.05)'
  }
}));
const labelStyle = {
  mb: 1.5,
  fontWeight: 800,
  color: '#374151',
  textTransform: 'uppercase',
  fontSize: '11px',
  letterSpacing: '1px'
};

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '26px',
  fontWeight: 900,
  color: '#111827',
  marginBottom: '10px',
  letterSpacing: '-1px'
}));

const StyledSectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '15px',
  color: '#6B7280',
  marginBottom: '40px',
  fontWeight: 500,
  lineHeight: 1.6
}));

const PremiumTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: 'transparent'
    },
    '&:hover': {
      backgroundColor: '#f3f4f6',
      borderColor: '#D1D5DB'
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      borderColor: PINK,
      boxShadow: `0px 0px 0px 4px ${alpha(PINK, 0.1)}`,
      '& fieldset': {
        borderColor: PINK,
        borderWidth: '2px'
      }
    }
  },
  '& .MuiInputBase-input': {
    padding: '18px 20px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#1F2937'
  }
}));

const PremiumSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  backgroundColor: '#F9FAFB',
  border: '1px solid #E5E7EB',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent'
  },
  '&:hover': {
    backgroundColor: '#f3f4f6',
    borderColor: '#D1D5DB'
  },
  '&.Mui-focused': {
    backgroundColor: '#ffffff',
    borderColor: PINK,
    boxShadow: `0px 0px 0px 4px ${alpha(PINK, 0.1)}`,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: PINK,
      borderWidth: '2px'
    }
  },
  '& .MuiSelect-select': {
    padding: '18px 20px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#1F2937'
  }
}));

const MediaPreviewBox = styled(Box)(({ theme, hasImage }) => ({
  width: '100%',
  aspectRatio: '4/3',
  borderRadius: '20px',
  border: hasImage ? 'none' : `2px dashed ${alpha(PINK, 0.2)}`,
  backgroundColor: hasImage ? 'transparent' : alpha(PINK, 0.02),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    borderColor: PINK,
    backgroundColor: alpha(PINK, 0.05),
    transform: 'translateY(-4px)'
  }
}));

const GallerySlotMedium = styled(Box)(({ theme, hasImage }) => ({
  width: '100%',
  aspectRatio: '1 / 1', // ✅ always square
  borderRadius: '18px',
  border: hasImage ? 'none' : '2px dashed #E5E7EB',
  backgroundColor: hasImage ? '#F9FAFB' : '#F9FAFB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden', // ✅ prevents overflow growth
  transition: 'all 0.25s ease',
  '&:hover': {
    borderColor: PINK,
    backgroundColor: alpha(PINK, 0.03),
    transform: 'scale(1.02)'
  }
}));

const FeatureGroupBox = styled(Box)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  position: 'relative',
  transition: 'all 0.3s ease',
  minHeight: '100%',
  '&:hover': {
    borderColor: PINK,
    boxShadow: '0px 10px 30px rgba(233, 30, 99, 0.05)'
  }
}));

const GroupBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '25px',
  fontSize: '48px',
  fontWeight: 900,
  opacity: 0.06,
  color: PINK,
  pointerEvents: 'none'
}));

const InteractionChipRefined = styled(Chip)(({ theme, selected }) => ({
  borderRadius: '14px',
  fontWeight: 800,
  fontSize: '14px',
  height: '46px',
  padding: '0 10px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: selected ? PINK : '#F3F4F6',
  color: selected ? '#ffffff' : '#4B5563',
  border: `2px solid ${selected ? PINK : 'transparent'}`,
  '&:hover': {
    backgroundColor: selected ? '#D81B60' : '#E5E7EB',
    transform: 'translateY(-2px)'
  }
}));

const GlassTableContainerRefined = styled(TableContainer)(({ theme }) => ({
  borderRadius: '24px',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  backgroundColor: '#ffffff',
  marginTop: '32px',
  overflow: 'hidden',
  boxShadow: '0px 10px 40px rgba(0,0,0,0.03)'
}));

// ------------------------------ SUB-COMPONENTS ------------------------------

const VariationRow = ({ variation, onChange, onImageUpload }) => {
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell sx={{ py: 3, pl: 4 }}>
        <Typography sx={{ fontWeight: 800, color: '#1F2937', fontSize: '15px' }}>{variation.name}</Typography>
      </TableCell>
      <TableCell sx={{ py: 3 }}>
        <PremiumTextField
          size="small"
          placeholder="0.00"
          value={variation.price}
          onChange={(e) => onChange('price', e.target.value)}
          sx={{ maxWidth: '180px' }}
          InputProps={{
            startAdornment: <Typography sx={{ mr: 1, fontWeight: 700, color: '#9CA3AF' }}>₹</Typography>
          }}
        />
      </TableCell>
      <TableCell sx={{ py: 3, pr: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={() => document.getElementById(`var-img-${variation.id}`).click()}
            sx={{
              bgcolor: alpha(PINK, 0.05),
              color: PINK,
              '&:hover': { bgcolor: PINK, color: 'white' }
            }}
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
          <input id={`var-img-${variation.id}`} type="file" hidden onChange={(e) => onImageUpload(e.target.files[0])} />
          {variation.image && (
            <Box
              sx={{
                position: 'relative',
                width: '45px',
                height: '45px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: `2px solid ${PINK}`
              }}
            >
              <img
                src={typeof variation.image === 'string' ? variation.image : URL.createObjectURL(variation.image)}
                alt="variant"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                onClick={() => onImageUpload(null)}
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  bgcolor: 'white',
                  p: 0.2,
                  '&:hover': { bgcolor: PINK, color: 'white' }
                }}
              >
                <CloseIcon sx={{ fontSize: 10 }} />
              </IconButton>
            </Box>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
};

// ------------------------------ MAIN COMPONENT ------------------------------

const AddCakePackage = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const isEditMode = Boolean(id);

  // Constants & Categorization
  const OCCASIONS = ['Marriage', 'Engagement', 'Birthday', 'Anniversary', 'Promotion', 'Other'];
  const ATTRIBUTES = ['Weight', 'Ingredient'];
  const ATTRIBUTE_VALUES = {
    Weight: ['0.5Kg', '1 Kg', '2 Kg', '3 Kg', '5 Kg+'],
    Ingredient: ['Egg', 'Eggless', 'Vegan', 'Sugar Free']
  };

  const ADDON_CATEGORIES = [
    {
      title: 'Toppings & Decor',
      id: '01',
      items: [
        { name: 'Fresh Flowers', icon: <FlowersIcon /> },
        { name: 'Edible Gold Leaf', icon: <GoldIcon /> },
        { name: 'Sugar Flowers', icon: <SugarIcon /> }
      ]
    },
    {
      title: 'Chef Special Enhancers',
      id: '02',
      items: [
        { name: 'Premium Filling Upgrade', icon: <CakeIcon /> },
        { name: 'Drip Icing', icon: <DripIcon /> }
      ]
    },
    {
      title: 'Packaging & Presentation',
      id: '03',
      items: [{ name: 'Premium Cake Box', icon: <BoxIcon /> }]
    },
    {
      title: 'Celebration Finale',
      id: '04',
      items: [{ name: 'Sparklers / Cake Fountains', icon: <StarIcon /> }]
    }
  ];

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [currentVendor, setCurrentVendor] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [itemType, setItemType] = useState('Eggless');
  const [searchTags, setSearchTags] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [unit, setUnit] = useState('Kg');
  const [weight, setWeight] = useState('');

  // Variants & Pricing
  const [unitPrice, setUnitPrice] = useState('');
  const [discountType, setDiscountType] = useState('no_discount');
  const [discountValue, setDiscountValue] = useState('');
  const [attrValues, setAttrValues] = useState({ Weight: [], Ingredient: [] });
  const [variations, setVariations] = useState([]);

  // Addons & Shipping
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [shipping, setShipping] = useState({ free: false, flatRate: true, price: '' });

  // Media
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // ------------------------------ EFFECTS & HANDLERS ------------------------------

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const vendorData = localStorage.getItem('vendor') || localStorage.getItem('user');
        if (vendorData) setCurrentVendor(JSON.parse(vendorData));
        const token = localStorage.getItem('token');
        const catRes = await axios.get(`${API_BASE}/api/categories/parents/${CAKE_MODULE_ID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(catRes.data?.data || []);
        if (isEditMode && id) {
          const cakeRes = await axios.get(`${API_BASE}/api/cakes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          const cake = cakeRes.data?.data;
          if (cake) {
            setName(cake.name || '');
            setShortDescription(cake.shortDescription || '');
            setCategory(cake.category?._id || cake.category || '');
            setSelectedSubCategories((cake.subCategories || []).map((s) => s._id || s));
            setSelectedOccasions(cake.occasions || []);
            setItemType(cake.itemType || 'Eggless');
            setSearchTags((cake.searchTags || []).join(', '));
            setExistingThumbnail(cake.thumbnail || '');
            setExistingGallery(cake.images || []);
            setShipping({
              free: cake.shipping?.free || false,
              flatRate: cake.shipping?.flatRate || false,
              price: cake.shipping?.price || ''
            });
            if (cake.variations?.length)
              setVariations(cake.variations.map((v, idx) => ({ id: v._id || `old-${idx}`, name: v.name, price: v.price, image: v.image })));
            setSelectedAddons(cake.addons || []);
            setPrepTime(cake.prepTime || '');
            setUnit(cake.unit || 'Kg');
            setWeight(cake.weight || '');
          }
        }
      } catch (err) {
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [id, isEditMode]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!category) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/categories/parents/${category}/subcategories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubCategories(response.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubCategories();
  }, [category]);

  const handleAttrValueToggle = (attr, value) => {
    setAttrValues((prev) => {
      const current = prev[attr] || [];
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      const newAttrValues = { ...prev, [attr]: updated };
      const activeAttrs = ATTRIBUTES.filter((a) => newAttrValues[a]?.length > 0);
      if (activeAttrs.length === 0) {
        setVariations([]);
      } else {
        const combinations = activeAttrs.reduce(
          (acc, curr) =>
            acc.length === 0 ? newAttrValues[curr].map((v) => [v]) : acc.flatMap((d) => newAttrValues[curr].map((e) => [...d, e])),
          []
        );
        setVariations(
          combinations.map((combo, idx) => ({
            id: `new-${idx}`,
            name: typeof combo === 'string' ? combo : combo.join(' - '),
            price: unitPrice || '',
            image: null
          }))
        );
      }
      return newAttrValues;
    });
  };

  const handleAddonToggle = (addonName) =>
    setSelectedAddons((prev) => (prev.includes(addonName) ? prev.filter((a) => a !== addonName) : [...prev, addonName]));

  const handleReset = () => {
    setName('');
    setShortDescription('');
    setCategory('');
    setSelectedSubCategories([]);
    setSelectedOccasions([]);
    setUnit('Kg');
    setWeight('');
    setItemType('Eggless');
    setSearchTags('');
    setThumbnail(null);
    setGalleryImages([]);
    setVariations([]);
    setAttrValues({ Weight: [], Ingredient: [] });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const vendorId = currentVendor?._id || currentVendor?.id;
    if (!vendorId || !name || !category || (!thumbnail && !existingThumbnail)) {
      setError('Missing required fields');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('shortDescription', shortDescription);
    formData.append('category', category);
    formData.append('module', CAKE_MODULE_ID);
    formData.append('uom', unit);
    formData.append('weight', weight);
    formData.append('itemType', itemType);
    formData.append('provider', vendorId);
    formData.append('subCategories', JSON.stringify(selectedSubCategories));
    formData.append('occasions', JSON.stringify(selectedOccasions));
    formData.append(
      'searchTags',
      JSON.stringify(
        searchTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );
    formData.append('addons', JSON.stringify(selectedAddons));
    formData.append('shipping', JSON.stringify(shipping));
    formData.append('prepTime', prepTime);
    const validVariants = variations.filter((v) => v.price).map((v) => ({ name: v.name, price: Number(v.price) }));
    if (validVariants.length) formData.append('variations', JSON.stringify(validVariants));
    if (thumbnail) formData.append('thumbnail', thumbnail);
    galleryImages.forEach((img) => formData.append('images', img));
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = isEditMode
        ? await axios.put(`${API_BASE}/api/cakes/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(`${API_BASE}/api/cakes`, formData, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setSuccessMessage('Saved successfully!');
        setTimeout(() => navigate('/cakes'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving cake');
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="inherit" sx={{ color: PINK }} />
      </Box>
    );

  return (
    <Box sx={{ bgcolor: '#FDFDFF', minHeight: '100vh', pb: 10 }}>
      {/* 🚀 STICKY HEADER AREA */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #F0F0F0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          px: { xs: 2, md: 5 },
          py: 2.5,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <Box sx={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', '&:hover': { bgcolor: PINK, color: 'white', borderColor: PINK } }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#111827', letterSpacing: '-1.2px', fontSize: '28px' }}>
                {isEditMode ? 'Edit' : 'Create'} Cake Package
              </Typography>
              <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Catering Management / Add New Item
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2.5}>
            <Button
              variant="text"
              onClick={handleReset}
              sx={{ px: 4, textTransform: 'none', fontWeight: 800, color: '#4B5563', '&:hover': { color: PINK } }}
            >
              Reset Form
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                bgcolor: PINK,
                borderRadius: '18px',
                px: 6,
                py: 1.8,
                textTransform: 'none',
                fontWeight: 900,
                fontSize: '16px',
                boxShadow: `0px 15px 35px ${alpha(PINK, 0.35)}`,
                '&:hover': { bgcolor: '#D81B60', boxShadow: `0px 20px 45px ${alpha(PINK, 0.45)}` }
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : `Publish Package`}
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '1200px', margin: '48px auto', px: 3 }}>
        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 4, borderRadius: '20px', fontWeight: 800, border: 'none', boxShadow: '0px 10px 30px rgba(76, 175, 80, 0.1)' }}
          >
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 4, borderRadius: '20px', fontWeight: 800, border: 'none', boxShadow: '0px 10px 30px rgba(244, 67, 54, 0.1)' }}
          >
            {error}
          </Alert>
        )}

        <PremiumCard>
          <StyledSectionTitle>General Information</StyledSectionTitle>
          <StyledSectionSubtitle>Define the fundamental details that describe your cake creation.</StyledSectionSubtitle>

          <Stack spacing={4}>
            {/* PRODUCT NAME */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  color: '#374151',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '1px'
                }}
              >
                Product Name
              </Typography>

              <PremiumTextField
                fullWidth
                placeholder="e.g. Midnight Chocolate Ganache Cake"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>

            {/* FULL DESCRIPTION */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  color: '#374151',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '1px'
                }}
              >
                Full Description
              </Typography>

              <PremiumTextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe the rich textures, premium ingredients, and the flavor experience..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </Box>

            {/* ONE ROW: CATEGORY + SUBCATEGORY + UNIT + WEIGHT */}
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={4} columnSpacing={6}>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>Parent Category</Typography>
                  <FormControl fullWidth>
                    <PremiumSelect fullWidth value={category} onChange={(e) => setCategory(e.target.value)} displayEmpty>
                      <MenuItem disabled value="">
                        Select the primary category
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.title}
                        </MenuItem>
                      ))}
                    </PremiumSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>Subcategories</Typography>
                  <FormControl fullWidth disabled={!category}>
                    <PremiumSelect
                      fullWidth
                      multiple
                      value={selectedSubCategories}
                      onChange={(e) => setSelectedSubCategories(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem disabled value="">
                        Choose related tags
                      </MenuItem>
                      {subCategories.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>
                          <Checkbox checked={selectedSubCategories.includes(sub._id)} />
                          <ListItemText primary={sub.title} />
                        </MenuItem>
                      ))}
                    </PremiumSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography sx={labelStyle}>Select Unit</Typography>
                  <FormControl fullWidth>
                    <PremiumSelect fullWidth value={unit} onChange={(e) => setUnit(e.target.value)}>
                      <MenuItem value="Kg">Kg</MenuItem>
                      <MenuItem value="Gm">Gm</MenuItem>
                      <MenuItem value="Piece">Piece</MenuItem>
                      <MenuItem value="Litre">Litre</MenuItem>
                    </PremiumSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography sx={labelStyle}>Weight in Kg</Typography>
                  <PremiumTextField fullWidth placeholder="e.g. 1.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </Grid>
              </Grid>
            </Box>

            {/* PERFECT FOR OCCASIONS (FIXED TO ROW / COLUMNS) */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  color: '#374151',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '1px'
                }}
              >
                Perfect for Occasions
              </Typography>

              <FormControl fullWidth>
                <PremiumSelect
                  multiple
                  value={selectedOccasions}
                  onChange={(e) => setSelectedOccasions(e.target.value)}
                  displayEmpty
                  renderValue={(selected) =>
                    selected.length === 0 ? (
                      <Typography sx={{ color: '#9CA3AF', fontWeight: 600 }}>Select one or many occasions</Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selected.map((val) => (
                          <Chip
                            key={val}
                            label={val}
                            size="small"
                            sx={{
                              borderRadius: '10px',
                              fontWeight: 800,
                              bgcolor: alpha(PINK, 0.08),
                              color: PINK
                            }}
                          />
                        ))}
                      </Box>
                    )
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        mt: 1,
                        p: 1
                      }
                    },
                    MenuListProps: {
                      sx: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 1
                      }
                    }
                  }}
                >
                  {OCCASIONS.map((occ) => (
                    <MenuItem key={occ} value={occ} sx={{ borderRadius: '10px', fontWeight: 700 }}>
                      <Checkbox
                        checked={selectedOccasions.includes(occ)}
                        size="small"
                        sx={{ color: PINK, '&.Mui-checked': { color: PINK } }}
                      />
                      <ListItemText primary={occ} />
                    </MenuItem>
                  ))}
                </PremiumSelect>
              </FormControl>
            </Box>
          </Stack>
        </PremiumCard>

        {/* 🖼️ SECTION 2: HIGH-FIDELITY MEDIA GALLERY */}
        <PremiumCard>
          <StyledSectionTitle>Media & Show Reels</StyledSectionTitle>
          <StyledSectionSubtitle>High-resolution captures significantly increase conversion rates.</StyledSectionSubtitle>

          <Grid container spacing={6}>
            {/* THUMBNAIL AREA (LEFT 4/12) */}
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 2.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '13px' }}>
                Primary Display Photo
              </Typography>
              <MediaPreviewBox hasImage={thumbnail || existingThumbnail} onClick={() => document.getElementById('thumb-in').click()}>
                <input id="thumb-in" type="file" hidden onChange={(e) => setThumbnail(e.target.files[0])} />
                {thumbnail || existingThumbnail ? (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={thumbnail ? URL.createObjectURL(thumbnail) : existingThumbnail}
                      alt="thumb"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnail(null);
                        setExistingThumbnail('');
                      }}
                      sx={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        bgcolor: 'white',
                        color: PINK,
                        '&:hover': { bgcolor: PINK, color: 'white' }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Stack alignItems="center" spacing={2.5}>
                    <Box sx={{ bgcolor: alpha(PINK, 0.1), p: 3, borderRadius: '50%' }}>
                      <CloudUploadIcon sx={{ color: PINK, fontSize: 40 }} />
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '18px', color: '#111827' }}>
                        Upload Main View
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700 }}>
                        Recommended: 1000 x 800 pixels
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </MediaPreviewBox>
            </Grid>

            {/* GALLERY AREA (RIGHT 8/12) */}
<Grid item xs={12} md={8}>
  <Typography
    variant="body2"
    sx={{
      mb: 2.5,
      fontWeight: 800,
      color: '#374151',
      textTransform: 'uppercase',
      fontSize: '13px'
    }}
  >
    Gallery Showcase (Up to 10)
  </Typography>

  <Box sx={{ maxHeight: 260, overflowY: 'auto', pr: 1 }}>
    <Grid container spacing={2}>
      {[...Array(10)].map((_, i) => (
        <Grid item xs={6} sm={4} md={3} key={i}>
          <GallerySlotMedium
            hasImage={galleryImages[i] || existingGallery[i]}
            onClick={() => document.getElementById('gall-in').click()}
          >
            <input
              id="gall-in"
              type="file"
              hidden
              multiple
              onChange={(e) =>
                setGalleryImages((prev) => [...prev, ...Array.from(e.target.files)])
              }
            />

            {galleryImages[i] || existingGallery[i] ? (
              <>
                <img
                  src={
                    galleryImages[i]
                      ? URL.createObjectURL(galleryImages[i])
                      : existingGallery[i]
                  }
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    i < existingGallery.length
                      ? setExistingGallery((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      : setGalleryImages((prev) =>
                          prev.filter(
                            (_, idx) => idx !== i - existingGallery.length
                          )
                        );
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    p: 0.5,
                    color: PINK,
                    '&:hover': { bgcolor: PINK, color: 'white' }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </>
            ) : (
              <AddIcon sx={{ color: '#D1D5DB', fontSize: 32 }} />
            )}
          </GallerySlotMedium>
        </Grid>
      ))}
    </Grid>
  </Box>

  {/* PRO TIP */}
  <Box
    sx={{
      mt: 4,
      p: 3,
      borderRadius: '16px',
      bgcolor: alpha(PINK, 0.03),
      border: `1px solid ${alpha(PINK, 0.08)}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }}
  >
    <AutoAwesomeIcon sx={{ color: PINK, fontSize: 24 }} />
    <Typography
      variant="caption"
      sx={{ color: '#4B5563', fontWeight: 700, lineHeight: 1.6 }}
    >
      Pro Tip: Include images of the slice texture and the interior filling to WOW
      your customers.
    </Typography>
  </Box>
</Grid>

          </Grid>
        </PremiumCard>

        {/* 💰 SECTION 3: ATTRACTIVE PRICING & DYNAMIC VARIANTS */}
        <PremiumCard>
          <StyledSectionTitle>Pricing & Intelligent Variations</StyledSectionTitle>
          <StyledSectionSubtitle>Configure smart pricing tiers based on user-selected preferences.</StyledSectionSubtitle>

          <Box
            sx={{
              mb: 5,
              p: 5,
              borderRadius: '32px',
              bgcolor: alpha(PINK, 0.01),
              border: `2.5px solid ${alpha(PINK, 0.05)}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '100%',
                background: `linear-gradient(to left, ${alpha(PINK, 0.03)}, transparent)`,
                pointerEvents: 'none'
              }}
            />
            <Typography
              variant="h6"
              sx={{ mb: 4, fontWeight: 900, color: '#111827', display: 'flex', alignItems: 'center', gap: 2, fontSize: '20px' }}
            >
              <SettingsIcon sx={{ color: PINK }} /> Variant Configuration
            </Typography>
            <Stack spacing={5}>
              {ATTRIBUTES.map((attr) => (
                <Box key={attr}>
                  <Typography
                    variant="caption"
                    sx={{
                      mb: 2,
                      display: 'block',
                      fontWeight: 800,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontSize: '11px'
                    }}
                  >
                    Available {attr}s
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {ATTRIBUTE_VALUES[attr].map((val) => (
                      <InteractionChipRefined
                        key={val}
                        label={val}
                        selected={attrValues[attr]?.includes(val)}
                        onClick={() => handleAttrValueToggle(attr, val)}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1.8, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '13px' }}>
                Base Price (Starting From)
              </Typography>
              <PremiumTextField
                fullWidth
                placeholder="0.00"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, fontWeight: 900, color: '#9CA3AF', fontSize: '18px' }}>₹</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1.8, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '13px' }}>
                Discount Policy
              </Typography>
              <PremiumSelect fullWidth value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                <MenuItem value="no_discount">Standard Pricing (No Discount)</MenuItem>
                <MenuItem value="percentage">Promotional Percentage (%)</MenuItem>
                <MenuItem value="flat">Direct Flat Reduction (₹)</MenuItem>
              </PremiumSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1.8, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '13px' }}>
                Reduction Value
              </Typography>
              <PremiumTextField fullWidth placeholder="e.g. 50" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
            </Grid>
          </Grid>

          {variations.length > 0 && (
            <GlassTableContainerRefined>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(PINK, 0.02) }}>
                    <TableCell sx={{ fontWeight: 900, color: '#111827', fontSize: '14px', py: 3, pl: 4 }}>Variation Details</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#111827', fontSize: '14px', py: 3 }}>Market Listing Price</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#111827', fontSize: '14px', py: 3, pr: 4 }}>Display Media</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variations.map((v) => (
                    <VariationRow
                      key={v.id}
                      variation={v}
                      onChange={(f, val) => setVariations((prev) => prev.map((p) => (p.id === v.id ? { ...p, [f]: val } : p)))}
                      onImageUpload={(img) => setVariations((prev) => prev.map((p) => (p.id === v.id ? { ...p, image: img } : p)))}
                    />
                  ))}
                </TableBody>
              </Table>
            </GlassTableContainerRefined>
          )}
        </PremiumCard>

        {/* 🎂 SECTION 4: THEMED GROUPED ADD-ONS */}
        <PremiumCard>
          <StyledSectionTitle>Curated Boosters & Add-ons</StyledSectionTitle>
          <StyledSectionSubtitle>Group related extras to enhance the customer's celebration experience.</StyledSectionSubtitle>
          <Grid container spacing={4}>
            {ADDON_CATEGORIES.map((group) => (
              <Grid item xs={12} md={6} key={group.id}>
                <FeatureGroupBox>
                  <GroupBadge>{group.id}</GroupBadge>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 3.5, color: '#111827', letterSpacing: '-0.5px' }}>
                    {group.title}
                  </Typography>
                  <Stack spacing={2.5}>
                    {group.items.map((addon) => (
                      <Box
                        key={addon.name}
                        sx={{
                          p: 2.5,
                          borderRadius: '16px',
                          border: '1px solid #F3F4F6',
                          bgcolor: selectedAddons.includes(addon.name) ? alpha(PINK, 0.02) : 'transparent',
                          borderColor: selectedAddons.includes(addon.name) ? PINK : '#F3F4F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: alpha(PINK, 0.01), borderColor: PINK }
                        }}
                        onClick={() => handleAddonToggle(addon.name)}
                      >
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Box sx={{ color: selectedAddons.includes(addon.name) ? PINK : '#9CA3AF' }}>{addon.icon}</Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 800, color: selectedAddons.includes(addon.name) ? '#111827' : '#4B5563' }}
                          >
                            {addon.name}
                          </Typography>
                        </Stack>
                        <Checkbox
                          checked={selectedAddons.includes(addon.name)}
                          sx={{ color: '#D1D5DB', '&.Mui-checked': { color: PINK } }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </FeatureGroupBox>
              </Grid>
            ))}
          </Grid>
        </PremiumCard>

        {/* 🚚 SECTION 5: SHIPPING LOGISTICS */}
        <PremiumCard>
          <StyledSectionTitle>Delivery & Logistics</StyledSectionTitle>
          <StyledSectionSubtitle>Ensure your cake arrives safely with precise delivery controls.</StyledSectionSubtitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  border: '2px solid #F3F4F6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: PINK, bgcolor: alpha(PINK, 0.01) }
                }}
              >
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ bgcolor: alpha(PINK, 0.1), p: 2, borderRadius: '16px' }}>
                    <ShippingIcon sx={{ color: PINK }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900 }}>Complimentary Delivery</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Free for the customer
                    </Typography>
                  </Box>
                </Stack>
                <Switch checked={shipping.free} onChange={(e) => setShipping({ ...shipping, free: e.target.checked })} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  border: '2px solid #F3F4F6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: PINK, bgcolor: alpha(PINK, 0.01) }
                }}
              >
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ bgcolor: alpha(PINK, 0.1), p: 2, borderRadius: '16px' }}>
                    <PaymentsIcon sx={{ color: PINK }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900 }}>Standard Flat Rate</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Fixed cost per delivery
                    </Typography>
                  </Box>
                </Stack>
                <Switch checked={shipping.flatRate} onChange={(e) => setShipping({ ...shipping, flatRate: e.target.checked })} />
              </Box>
            </Grid>
            {shipping.flatRate && (
              <Grid item xs={12}>
                <Box sx={{ p: 4, bgcolor: '#F9FAFB', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 800 }}>
                    Defined Flat Rate Fee ( ₹ )
                  </Typography>
                  <PremiumTextField
                    sx={{ width: '300px' }}
                    value={shipping.price}
                    onChange={(e) => setShipping({ ...shipping, price: e.target.value })}
                    placeholder="0.00"
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </PremiumCard>

        {/* 🏷️ SECTION 6: SEARCH ENGINE OPTIMIZATION */}
        <PremiumCard>
          <StyledSectionTitle>Optimization & Search Visibility</StyledSectionTitle>
          <StyledSectionSubtitle>Boost discoverability with targeted keywords and meta-tags.</StyledSectionSubtitle>
          <Box>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LabelIcon sx={{ color: PINK }} /> Dynamic Search Tags (Use comma as separator)
            </Typography>
            <PremiumTextField
              fullWidth
              placeholder="e.g. Birthday, Luxury Cake, Eggless, Anniversary Surprise"
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
            />
          </Box>
        </PremiumCard>

        {/* 🤝 SECTION 7: CROSS-SELLING ECOSYSTEM */}
        <PremiumCard sx={{ mb: 8 }}>
          <StyledSectionTitle>Cross-Selling Ecosystem</StyledSectionTitle>
          <StyledSectionSubtitle>Increase item value by connecting toppers, candles, or cards.</StyledSectionSubtitle>
          <Stack spacing={5}>
            <RadioGroup row>
              <FormControlLabel
                value="product"
                control={<Radio sx={{ color: PINK, '&.Mui-checked': { color: PINK } }} />}
                label={<Typography sx={{ fontWeight: 800 }}>Specific Products</Typography>}
              />
              <FormControlLabel
                value="category"
                control={<Radio sx={{ color: PINK, '&.Mui-checked': { color: PINK } }} />}
                label={<Typography sx={{ fontWeight: 800 }}>Thematic Categories</Typography>}
              />
            </RadioGroup>
            <Box
              sx={{
                p: 8,
                borderRadius: '32px',
                bgcolor: alpha(PINK, 0.01),
                border: `2.5px dashed ${alpha(PINK, 0.1)}`,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: alpha(PINK, 0.02), borderColor: PINK }
              }}
            >
              <Button
                startIcon={<SearchIcon />}
                sx={{
                  px: 8,
                  py: 2.5,
                  borderRadius: '20px',
                  bgcolor: 'white',
                  color: '#111827',
                  fontWeight: 900,
                  textTransform: 'none',
                  boxShadow: '0px 10px 30px rgba(0,0,0,0.05)',
                  '&:hover': { bgcolor: PINK, color: 'white' }
                }}
              >
                Discover Items to Link
              </Button>
            </Box>
          </Stack>
        </PremiumCard>
      </Box>
    </Box>
  );
};

export default AddCakePackage;
