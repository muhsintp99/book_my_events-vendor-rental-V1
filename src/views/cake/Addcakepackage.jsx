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
const SmallGalleryThumb = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid #E5E7EB',
  backgroundColor: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  transition: '0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
  }
}));

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

const HeroUploadBox = styled(Box)(({ theme, hasImage }) => ({
  width: '100%',
  height: '380px',
  borderRadius: '28px',
  border: hasImage ? 'none' : `3px dashed ${alpha(PINK, 0.15)}`,
  backgroundColor: hasImage ? 'transparent' : '#FAFAFA',
  backgroundImage: hasImage ? 'none' : `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${alpha(PINK, 0.02)} 100%)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: hasImage ? '0 20px 40px rgba(0,0,0,0.1)' : 'none',
  '&:hover': {
    borderColor: PINK,
    backgroundColor: alpha(PINK, 0.03),
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(233, 30, 99, 0.15)'
  }
}));

const GalleryDropzone = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '200px',
  borderRadius: '24px',
  border: `2px dashed ${alpha(PINK, 0.3)}`,
  backgroundColor: '#FAFAFA',
  backgroundImage: `linear-gradient(135deg, ${alpha(PINK, 0.01)} 0%, rgba(255,255,255,1) 100%)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: PINK,
    backgroundColor: alpha(PINK, 0.04),
    boxShadow: `0 10px 40px ${alpha(PINK, 0.1)}`
  }
}));

const PreviewImageSlot = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  group: 'slot',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.12)'
  }
}));

const FeatureGroupBox = styled(Box)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  position: 'relative',
  transition: 'all 0.3s ease',
  height: '100%', // 🔥 makes all cards equal height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
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
  Ingredient: ['Egg', 'Eggless']
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
  const base = Number(unitPrice || 0);
  const reduction = Number(discountValue || 0);

  let totalPrice = base;

  if (discountType === 'percentage') {
    totalPrice = base - (base * reduction) / 100;
  }

  if (discountType === 'flat') {
    totalPrice = base - reduction;
  }

  totalPrice = Math.max(totalPrice, 0);

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
      <Box>
        <Box sx={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}></Box>
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

        {/* 📋 SECTION 1: CORE CHARACTERISTICS */}
        <PremiumCard>
          <StyledSectionTitle>General Information</StyledSectionTitle>
          <StyledSectionSubtitle>Define the fundamental details that describe your cake creation.</StyledSectionSubtitle>

          <Stack spacing={4}>
            {/* PRODUCT NAME */}
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}
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
                sx={{ mb: 1.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}
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

            {/* CATEGORY & WEIGHT GROUP (COMBINED ROW) */}
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={3}>
                {/* PARENT CATEGORY */}
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}
                  >
                    Parent Category
                  </Typography>
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

                {/* SUBCATEGORIES */}
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}
                  >
                    Subcategories
                  </Typography>
                  <FormControl fullWidth disabled={!category}>
                    <PremiumSelect
                      fullWidth
                      multiple
                      value={selectedSubCategories}
                      onChange={(e) => setSelectedSubCategories(e.target.value)}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Typography sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '15px' }}>Choose related tags</Typography>;
                        }
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selected.map((val) => (
                              <Chip
                                key={val}
                                label={subCategories.find((s) => s._id === val)?.title || val}
                                size="small"
                                sx={{ borderRadius: '10px', fontWeight: 800, bgcolor: 'white', border: '1px solid #E5E7EB', color: PINK }}
                              />
                            ))}
                          </Box>
                        );
                      }}
                      displayEmpty
                    >
                      <MenuItem disabled value="">
                        Choose related tags
                      </MenuItem>
                      {subCategories.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>
                          <Checkbox
                            checked={selectedSubCategories.includes(sub._id)}
                            size="small"
                            sx={{ color: PINK, '&.Mui-checked': { color: PINK } }}
                          />
                          <ListItemText primary={sub.title} primaryTypographyProps={{ fontSize: '14px', fontWeight: 700 }} />
                        </MenuItem>
                      ))}
                    </PremiumSelect>
                  </FormControl>
                </Grid>

                {/* SELECT UNIT */}
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      fontWeight: 800,
                      color: '#374151',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '1px'
                    }}
                  >
                    Select Unit
                  </Typography>
                  <FormControl fullWidth>
                    <PremiumSelect
                      fullWidth
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      displayEmpty
                      renderValue={(selected) =>
                        selected ? selected : <Typography sx={{ color: '#9CA3AF', fontWeight: 600 }}>Select unit</Typography>
                      }
                    >
                      <MenuItem disabled value="">
                        Select unit
                      </MenuItem>
                      <MenuItem value="Kg">Kg</MenuItem>
                      <MenuItem value="Gm">Gm</MenuItem>
                      <MenuItem value="Piece">Piece</MenuItem>
                      <MenuItem value="Litre">Litre</MenuItem>
                    </PremiumSelect>
                  </FormControl>
                </Grid>

                {/* WEIGHT */}
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      fontWeight: 800,
                      color: '#374151',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '1px'
                    }}
                  >
                    Weight
                  </Typography>
                  <PremiumTextField fullWidth placeholder="e.g. 1.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </Grid>
              </Grid>
            </Box>

            {/* OCCASIONS */}
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}
              >
                Perfect for Occasions
              </Typography>
              <FormControl fullWidth>
                <PremiumSelect
                  multiple
                  value={selectedOccasions}
                  onChange={(e) => setSelectedOccasions(e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <Typography
                          sx={{
                            color: '#9CA3AF',
                            fontWeight: 600,
                            fontSize: '15px'
                          }}
                        >
                          Select one or many occasions
                        </Typography>
                      );
                    }

                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selected.map((val) => (
                          <Chip
                            key={val}
                            label={val}
                            size="small"
                            sx={{
                              borderRadius: '10px',
                              fontWeight: 800,
                              bgcolor: alpha(PINK, 0.05),
                              color: PINK,
                              border: `1px solid ${alpha(PINK, 0.1)}`
                            }}
                          />
                        ))}
                      </Box>
                    );
                  }}
                >
                  <MenuItem disabled value="">
                    Select one or many occasions
                  </MenuItem>

                  {OCCASIONS.map((occ) => (
                    <MenuItem key={occ} value={occ}>
                      <Checkbox
                        checked={selectedOccasions.includes(occ)}
                        size="small"
                        sx={{ color: PINK, '&.Mui-checked': { color: PINK } }}
                      />
                      <ListItemText primary={occ} primaryTypographyProps={{ fontSize: '14px', fontWeight: 700 }} />
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

          <Stack spacing={5}>
            {/* HERO MAIN IMAGE (FULL WIDTH for Impact) */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  color: '#374151',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} /> Primary Display Photo (Cover)
              </Typography>

              <HeroUploadBox hasImage={thumbnail || existingThumbnail} onClick={() => document.getElementById('thumb-in').click()}>
                <input id="thumb-in" type="file" hidden onChange={(e) => setThumbnail(e.target.files[0])} />

                {thumbnail || existingThumbnail ? (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={thumbnail ? URL.createObjectURL(thumbnail) : existingThumbnail}
                      alt="Main Cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0,0,0,0.3)',
                        opacity: 0,
                        transition: '0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        '.MuiBox-root:hover &': { opacity: 1 }
                      }}
                    >
                      <Button variant="contained" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' } }}>
                        Change Cover
                      </Button>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setThumbnail(null);
                          setExistingThumbnail('');
                        }}
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: '#ef4444' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Stack alignItems="center" spacing={3}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
                      }}
                    >
                      <CloudUploadIcon sx={{ color: PINK, fontSize: 36 }} />
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                        Drop your main image here
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', maxWidth: '300px' }}>
                        Supports JPG, PNG, WEBP. High resolution (1600x1200) recommended for best results.
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: '#E5E7EB',
                        color: '#374151',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        '&:hover': { borderColor: PINK, color: PINK, bgcolor: 'transparent' }
                      }}
                    >
                      Browse Files
                    </Button>
                  </Stack>
                )}
              </HeroUploadBox>
            </Box>

            {/* GALLERY GRID */}
            <Box>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 2.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}
                >
                  Gallery Collection (Max 10)
                </Typography>

                <GalleryDropzone
                  onClick={(e) => {
                    document.getElementById('gall-in').click();
                  }}
                  sx={{
                    p: 3,
                    alignItems: existingGallery.length + galleryImages.length > 0 ? 'flex-start' : 'center',
                    justifyContent: existingGallery.length + galleryImages.length > 0 ? 'flex-start' : 'center'
                  }}
                >
                  <input
                    id="gall-in"
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const combinedLength = existingGallery.length + galleryImages.length + files.length;
                      if (combinedLength > 10) {
                        alert('You can only upload a maximum of 10 images.');
                        return;
                      }
                      setGalleryImages((prev) => [...prev, ...files]);
                      e.target.value = null;
                    }}
                  />

                  {existingGallery.length === 0 && galleryImages.length === 0 ? (
                    <>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: '50%',
                          bgcolor: '#E3F2FD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        <CloudUploadIcon sx={{ color: '#2196F3', fontSize: 36 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: PINK, fontWeight: 800 }}>
                        Click to Upload Images
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, mt: 1 }}>
                        Supported: JPG, PNG, WEBP
                      </Typography>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* EXISTING IMAGES */}
                      {existingGallery.map((img, i) => (
                        <Box
                          key={`exist-${i}`}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid #E5E7EB'
                          }}
                        >
                          <img src={img} alt={`gallery-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <IconButton
                            size="small"
                            onClick={() => setExistingGallery((prev) => prev.filter((_, idx) => idx !== i))}
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              bgcolor: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              p: 0.5,
                              '&:hover': { bgcolor: '#ef4444' }
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}

                      {/* NEW UPLOADED IMAGES */}
                      {galleryImages.map((file, i) => (
                        <Box
                          key={`new-${i}`}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid #E5E7EB'
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${i}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))}
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              bgcolor: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              p: 0.5,
                              '&:hover': { bgcolor: '#ef4444' }
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}

                      {/* ADD MORE BOX */}
                      {existingGallery.length + galleryImages.length < 10 && (
                        <Box
                          onClick={() => document.getElementById('gall-in').click()}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '12px',
                            border: `2px dashed ${alpha(PINK, 0.3)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <CloudUploadIcon sx={{ color: PINK }} />
                        </Box>
                      )}
                    </Box>
                  )}
                </GalleryDropzone>
              </Box>
            </Box>
          </Stack>
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
              sx={{
                mb: 4,
                fontWeight: 900,
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                fontSize: '20px',
                textAlign: 'center'
              }}
            >
              <SettingsIcon sx={{ color: PINK }} />
              Variant Configuration
            </Typography>

            <Stack spacing={5} alignItems="center" textAlign="center">
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

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      justifyContent: 'center'
                    }}
                  >
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

          {/* 💳 BILLING & PRICING */}
          <Box
            sx={{
              mb: 6,
              p: 5,
              borderRadius: '32px',
              background: `linear-gradient(180deg, #ffffff, ${alpha(PINK, 0.04)})`,
              border: `1.5px solid ${alpha(PINK, 0.15)}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.04)'
            }}
          >
            {/* Input Row */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography sx={{ mb: 1.5, fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', color: '#374151' }}>
                  Base Price
                </Typography>
                <PremiumTextField
                  fullWidth
                  placeholder="0.00"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, fontWeight: 900, color: '#9CA3AF' }}>₹</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={{ mb: 1.5, fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', color: '#374151' }}>
                  Discount Type
                </Typography>
                <PremiumSelect fullWidth value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                  <MenuItem value="no_discount">No Discount</MenuItem>
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="flat">Flat Amount (₹)</MenuItem>
                </PremiumSelect>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={{ mb: 1.5, fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', color: '#374151' }}>
                  Discount Value
                </Typography>
                <PremiumTextField
                  fullWidth
                  placeholder={discountType === 'percentage' ? 'e.g. 10%' : 'e.g. 50'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Divider */}
            <Divider sx={{ my: 5 }} />

            {/* Billing Summary */}
            <Box
              sx={{
                p: 4,
                borderRadius: '24px',
                bgcolor: '#ffffff',
                border: `2px dashed ${alpha(PINK, 0.3)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '18px', color: '#111827' }}>Billing Summary</Typography>
                <Typography sx={{ mt: 0.5, fontSize: '14px', color: '#6B7280' }}>Final amount after discount</Typography>
              </Box>

              <Box textAlign="right">
                {discountType !== 'no_discount' && (
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#6B7280',
                      textDecoration: 'line-through'
                    }}
                  >
                    ₹ {base.toFixed(2)}
                  </Typography>
                )}

                <Typography
                  sx={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: PINK,
                    lineHeight: 1.1
                  }}
                >
                  ₹ {totalPrice.toFixed(2)}
                </Typography>

                {discountType !== 'no_discount' && (
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#16A34A' }}>
                    You save ₹ {(base - totalPrice).toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

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

        <PremiumCard>
  {/* Header */}
  <Box sx={{ mb: 6, textAlign: 'center' }}>
    <StyledSectionTitle sx={{ fontSize: 28 }}>
      Curated Boosters & Add-ons
    </StyledSectionTitle>
    <StyledSectionSubtitle sx={{ maxWidth: 720, mx: 'auto', mt: 1 }}>
      Group related extras to enhance the customer's celebration experience
    </StyledSectionSubtitle>
  </Box>

  <Grid
    container
    spacing={4}
    sx={{
      flexWrap: {
        xs: 'wrap',
        sm: 'wrap',
        md: 'nowrap'
      }
    }}
  >
    {ADDON_CATEGORIES.map((group) => (
      <Grid item xs={12} sm={6} md={3} key={group.id}>
        <FeatureGroupBox
          sx={{
            height: '100%',
            borderRadius: '24px',
            p: 3,
            background:
              'linear-gradient(180deg, #FFFFFF 0%, #FAFAFB 100%)',
            boxShadow: '0 12px 32px rgba(17,24,39,0.06)',
            position: 'relative'
          }}
        >
          {/* Floating badge */}
          <GroupBadge
            sx={{
              position: 'absolute',
              top: -14,
              left: 24,
              px: 2.5,
              py: 0.75,
              borderRadius: '999px',
              fontSize: 12,
              fontWeight: 800,
              background: alpha(PINK, 0.1),
              color: PINK
            }}
          >
            {group.id}
          </GroupBadge>

          {/* Group title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 4,
              mt: 2,
              color: '#111827',
              letterSpacing: '-0.6px'
            }}
          >
            {group.title}
          </Typography>

          {/* Add-on items */}
          <Stack spacing={2}>
            {group.items.map((addon) => {
              const active = selectedAddons.includes(addon.name);

              return (
                <Box
                  key={addon.name}
                  onClick={() => handleAddonToggle(addon.name)}
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: active
                      ? `linear-gradient(135deg, ${alpha(PINK, 0.12)}, ${alpha(PINK, 0.04)})`
                      : '#FFFFFF',
                    boxShadow: active
                      ? `0 8px 24px ${alpha(PINK, 0.25)}`
                      : '0 4px 14px rgba(0,0,0,0.04)',
                    border: active
                      ? `1.5px solid ${PINK}`
                      : '1px solid #F1F5F9',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 10px 26px ${alpha(PINK, 0.18)}`
                    }
                  }}
                >
                  {/* Left */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: active
                          ? alpha(PINK, 0.15)
                          : '#F9FAFB',
                        color: active ? PINK : '#9CA3AF'
                      }}
                    >
                      {addon.icon}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: active ? '#111827' : '#4B5563'
                      }}
                    >
                      {addon.name}
                    </Typography>
                  </Stack>

                  {/* Right */}
                  <Checkbox
                    checked={active}
                    disableRipple
                    sx={{
                      p: 0,
                      color: '#CBD5E1',
                      '&.Mui-checked': {
                        color: PINK
                      }
                    }}
                  />
                </Box>
              );
            })}
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
            {/* Complimentary Delivery */}
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
                  '&:hover': {
                    borderColor: PINK,
                    bgcolor: alpha(PINK, 0.01)
                  }
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

            {/* Standard Flat Rate + Redesigned Amount */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3} alignItems="center">
                {/* Flat rate card */}
                <Grid item xs={12} md={shipping.flatRate ? 7 : 12}>
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: '24px',
                      border: `2px solid ${shipping.flatRate ? PINK : '#F3F4F6'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: PINK,
                        bgcolor: alpha(PINK, 0.01)
                      }
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

                {/* Redesigned Amount Field – OUTSIDE */}
                {shipping.flatRate && (
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '22px',
                        background: `linear-gradient(135deg, ${alpha(PINK, 0.06)}, #ffffff)`,
                        border: `1.5px solid ${alpha(PINK, 0.25)}`,
                        boxShadow: `0 10px 30px ${alpha(PINK, 0.12)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 14px 40px ${alpha(PINK, 0.18)}`
                        }
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 900,
                          color: '#6B7280',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          mb: 1,
                          display: 'block'
                        }}
                      >
                        Flat Rate Amount
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5
                        }}
                      >
                        {/* Currency badge */}
                        <Box
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: '12px',
                            bgcolor: alpha(PINK, 0.15),
                            color: PINK,
                            fontWeight: 900,
                            fontSize: '16px'
                          }}
                        >
                          ₹
                        </Box>

                        {/* Input */}
                        <PremiumTextField
                          value={shipping.price}
                          onChange={(e) => setShipping({ ...shipping, price: e.target.value })}
                          placeholder="0.00"
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
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

        {/* 🤝 SECTION 7: FREQUENTLY BOUGHT TOGETHER */}
        <PremiumCard sx={{ mb: 8 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#111827'
              }}
            >
              Frequently Bought Together
              <Typography component="span" sx={{ ml: 1, fontWeight: 600, color: '#6B7280', fontSize: '14px' }}>
                (Related Products)
              </Typography>
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: '14px',
                color: '#6B7280'
              }}
            >
              Suggest complementary items to increase order value.
            </Typography>
          </Box>

          {/* Selection Type */}
          <Box
            sx={{
              p: 3,
              mb: 4,
              borderRadius: '16px',
              bgcolor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Typography sx={{ fontWeight: 800, color: '#374151' }}>Link by:</Typography>

            <RadioGroup row>
              <FormControlLabel
                value="product"
                control={
                  <Radio
                    sx={{
                      color: '#9CA3AF',
                      '&.Mui-checked': { color: PINK }
                    }}
                  />
                }
                label={<Typography sx={{ fontWeight: 700 }}>Product</Typography>}
              />

              <FormControlLabel
                value="category"
                control={
                  <Radio
                    sx={{
                      color: '#9CA3AF',
                      '&.Mui-checked': { color: PINK }
                    }}
                  />
                }
                label={<Typography sx={{ fontWeight: 700 }}>Category</Typography>}
              />
            </RadioGroup>
          </Box>

          {/* Add More Area */}
          <Box
            sx={{
              p: 6,
              borderRadius: '20px',
              border: `2px dashed ${alpha(PINK, 0.35)}`,
              bgcolor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: alpha(PINK, 0.03),
                borderColor: PINK,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: alpha(PINK, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Typography sx={{ fontSize: '28px', fontWeight: 900, color: PINK }}>+</Typography>
            </Box>

            <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Add Related Item</Typography>

            <Typography sx={{ mt: 0.5, fontSize: '13px', color: '#6B7280' }}>
              Choose products or categories frequently bought together
            </Typography>
          </Box>
          {/* ✅ FINAL ACTION BAR */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2.5
            }}
          >
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{
                px: 6,
                py: 1.8,
                borderRadius: '18px',
                textTransform: 'none',
                fontWeight: 900,
                fontSize: '15px',
                color: '#374151',
                borderColor: '#D1D5DB',
                '&:hover': {
                  borderColor: PINK,
                  color: PINK,
                  bgcolor: alpha(PINK, 0.04)
                }
              }}
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
                px: 7,
                py: 1.9,
                textTransform: 'none',
                fontWeight: 900,
                fontSize: '16px',
                boxShadow: `0px 18px 40px ${alpha(PINK, 0.4)}`,
                '&:hover': {
                  bgcolor: '#D81B60',
                  boxShadow: `0px 22px 50px ${alpha(PINK, 0.5)}`
                }
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Publish Package'}
            </Button>
          </Box>
        </PremiumCard>
      </Box>
    </Box>
  );
};

export default AddCakePackage;
