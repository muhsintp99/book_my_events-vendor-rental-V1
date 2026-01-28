import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Switch,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Autocomplete,
  InputAdornment,
  alpha,
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

// MUI Icons
import CelebrationIcon from '@mui/icons-material/Celebration';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import StyleIcon from '@mui/icons-material/Style';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EventIcon from '@mui/icons-material/Event';
import PaletteIcon from '@mui/icons-material/Palette';
import DiamondIcon from '@mui/icons-material/Diamond';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import axios from 'axios';
import { PhotoCamera, Delete } from '@mui/icons-material';

// ------------------------------
// Theme & Colors
// ------------------------------
const THEME = {
  primary: '#9C27B0',
  secondary: '#E91E63',
  accent: '#FF4081',
  dark: '#1A1A2E',
  light: '#F8F9FF',
  gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
  gradientLight: 'linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(233, 30, 99, 0.08) 100%)',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3'
};

// ------------------------------
// API Config
// ------------------------------
const API_BASE = 'https://api.bookmyevent.ae';
const BOUTIQUE_MODULE_ID = '68e5fd7b8164d482d281c37f';

// ------------------------------
// Styled Components
// ------------------------------
const GradientButton = ({ children, ...props }) => (
  <Button
    {...props}
    sx={{
      background: THEME.gradient,
      color: 'white',
      borderRadius: '12px',
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.5px',
      px: 4,
      py: 1.5,
      boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: THEME.gradient,
        boxShadow: '0 6px 25px rgba(156, 39, 176, 0.5)',
        transform: 'translateY(-2px)'
      },
      '&:disabled': {
        opacity: 0.7
      },
      ...props.sx
    }}
  >
    {children}
  </Button>
);

const SubcategoryBadge = ({ label, color }) => (
  <Box
    sx={{
      display: 'inline-flex',
      px: 1.5,
      py: 0.5,
      borderRadius: '8px',
      fontSize: '10px',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      bgcolor: alpha(color, 0.1),
      color: color,
      border: `1px solid ${alpha(color, 0.2)}`
    }}
  >
    {label}
  </Box>
);

const OPTION_ICONS = {
  // Features
  Wedding: CelebrationIcon,
  Valentine: FavoriteIcon,
  Festive: CelebrationIcon,
  'Daily Wear': EventAvailableIcon,
  'Casual Outings': LocalMallIcon,
  Anniversary: FavoriteIcon,
  Engagement: CelebrationIcon,
  'Party Wear': CelebrationIcon,
  'Office Wear': EventAvailableIcon,
  'Ethnic Wear': StyleIcon,

  // Suitable For
  Men: ManIcon,
  Women: WomanIcon,
  Kids: ChildCareIcon,
  Bride: WomanIcon,
  Groom: ManIcon,
  Unisex: PaletteIcon,

  // Style
  Traditional: StyleIcon,
  Western: StyleIcon,
  'Indo-Western': StyleIcon,
  Modern: StyleIcon,
  Classic: StyleIcon,
  Bridal: CelebrationIcon,
  Designer: DiamondIcon
};

const FeatureCard = ({ number, title, options, values = [], value = '', onChange, single = false, icon: Icon }) => (
  <Card
    sx={{
      p: 4,
      height: '100%',
      borderRadius: '24px',
      border: '1px solid #E5E7EB',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFF 100%)',
      boxShadow: '0 12px 35px rgba(0,0,0,0.06)',
      transition: '0.3s',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 45px rgba(0,0,0,0.1)'
      }
    }}
  >
    {/* HEADER */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '16px',
          bgcolor: alpha(THEME.primary, 0.12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {Icon && <Icon sx={{ fontSize: 30, color: THEME.primary }} />}
      </Box>

      <Typography fontWeight={900} sx={{ fontSize: '1.8rem', color: alpha(THEME.secondary, 0.35) }}>
        {number}
      </Typography>
    </Box>

    {/* TITLE */}
    <Typography fontWeight={800} sx={{ mb: 2, fontSize: '1.05rem' }}>
      {title}
    </Typography>

    {/* OPTIONS GRID */}
    <Grid container spacing={1.5}>
      {options.map((opt) => {
        const OptIcon = OPTION_ICONS[opt];
        const isSelected = single ? value === opt : values.includes(opt);

        return (
          <Grid item xs={12} key={opt}>
            <Box
              onClick={() => {
                if (single) {
                  onChange(isSelected ? '' : opt);
                } else {
                  onChange(isSelected ? values.filter((v) => v !== opt) : [...values, opt]);
                }
              }}
              sx={{
                cursor: 'pointer',
                p: 1.5,
                borderRadius: '14px',
                border: '1px solid',
                borderColor: isSelected ? THEME.primary : '#E5E7EB',
                background: isSelected ? THEME.gradientLight : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                '&:hover': {
                  background: THEME.gradientLight,
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    bgcolor: isSelected ? alpha(THEME.primary, 0.18) : '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {OptIcon && (
                    <OptIcon
                      sx={{
                        fontSize: 20,
                        color: isSelected ? THEME.primary : '#6B7280'
                      }}
                    />
                  )}
                </Box>

                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{opt}</Typography>
              </Stack>

              {isSelected && <CheckCircleIcon sx={{ fontSize: 18, color: THEME.primary }} />}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Card>
);

const SectionHeader = ({ icon: Icon, title, subtitle, color = THEME.primary }) => (
  <Box sx={{ mb: 3 }}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: '12px',
          background: alpha(color, 0.1),
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: THEME.dark,
            letterSpacing: '-0.5px'
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

// ------------------------------
// Main Component
// ------------------------------
const AddBoutique = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE}/${cleanPath}`;
  };

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [currentVendor, setCurrentVendor] = useState(null);

  // ========== VARIATIONS STATE ==========
  const [variations, setVariations] = useState([]);

  // ========== FORM STATE ==========
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    subcategory: '',
    availableSizes: [],
    material: '',
    thumbnailImage: null,
    galleryImages: [],
    existingGallery: [],
    availabilityMode: 'All',
    availableForPurchase: true,
    availableForRental: false,
    unitPrice: '',
    discountType: 'None',
    tax: '',
    totalPrice: '',
    pricePerDay: '',
    minimumDays: '',
    lateCharges: '',
    rentalTotalPrice: '',
    advanceForBooking: '',
    damagePolicy: '',
    stockQuantity: '',
    lowStockAlert: '',
    freeShipping: false,
    flatRateShipping: false,
    shippingPrice: '',
    selectedOccasions: [],
    tags: [],
    careInstructions: '',
    sizeGuideImage: null,
    existingSizeGuideImage: '',
    availableColors: [],
    returnPolicy: '',
    cancellationPolicy: '',
    isTopPick: false,
    isActive: true
  });

  const [termsSections, setTermsSections] = useState([{ heading: '', points: [''] }]);
  const [categories, setCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  // Related Items State
  const [relatedLinkBy, setRelatedLinkBy] = useState('product');
  const [relatedItems, setRelatedItems] = useState([]);
  const [selectedRelatedObjects, setSelectedRelatedObjects] = useState([]);
  const [openRelatedModal, setOpenRelatedModal] = useState(false);
  const [drilldownCategory, setDrilldownCategory] = useState(null);
  const [relatedOptions, setRelatedOptions] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // ========== OPTIONS ==========
  const availabilityOptions = ['All', 'Available For Purchase', 'Available For Rental'];
  const discountOptions = ['Percentage', 'Fixed Amount', 'None'];
  const occasionOptions = [
    'Wedding',
    'Valentine',
    'Festive',
    'Daily Wear',
    'Casual Outings',
    'Anniversary',
    'Engagement',
    'Birthday',
    'Party Wear',
    'Office Wear'
  ];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  const colorOptions = ['Red', 'Blue', 'Green', 'Black', 'White', 'Pink', 'Purple', 'Gold', 'Silver', 'Beige', 'Navy', 'Maroon', 'Teal', 'Lavender', 'Peach', 'Rose Gold'];

  // ========== HANDLERS ==========
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'unitPrice' || field === 'tax' || field === 'discountType' || field === 'discountValue') {
      const unitPrice = field === 'unitPrice' ? Number(value) : Number(formData.unitPrice);

      const tax = field === 'tax' ? Number(value) : Number(formData.tax);

      const discountType = field === 'discountType' ? value : formData.discountType;

      const discountValue = field === 'discountValue' ? Number(value) : Number(formData.discountValue);

      if (!unitPrice || unitPrice <= 0) {
        setFormData((prev) => ({ ...prev, totalPrice: '' }));
        return;
      }

      // 🔻 Calculate discount
      let discountAmount = 0;
      if (discountType === 'Percentage') {
        discountAmount = (unitPrice * discountValue) / 100;
      } else if (discountType === 'Fixed Amount') {
        discountAmount = discountValue;
      }

      // Prevent negative price
      const priceAfterDiscount = Math.max(unitPrice - discountAmount, 0);

      // 🧾 GST
      const taxAmount = tax ? (priceAfterDiscount * tax) / 100 : 0;

      const total = priceAfterDiscount + taxAmount;

      setFormData((prev) => ({
        ...prev,
        totalPrice: total.toFixed(2)
      }));
    }

    // Update subcategories list when category changes (Vehicle Method)
    if (field === 'category') {
      const categoryId = value; // Value will be the category _id
      setFormData((prev) => ({ ...prev, category: categoryId, subcategory: '' }));

      if (categoryId) {
        axios
          .get(`${API_BASE}/api/categories/parents/${categoryId}/subcategories`)
          .then((res) => {
            if (res.data && res.data.success) {
              setAvailableSubCategories(res.data.data);
            } else {
              setAvailableSubCategories([]);
            }
          })
          .catch((err) => {
            console.error('Error fetching subcategories:', err);
            setAvailableSubCategories([]);
          });
      } else {
        setAvailableSubCategories([]);
      }
      return;
    }

    // Auto-calculate rental total price
    if (field === 'pricePerDay' || field === 'minimumDays') {
      const pricePerDay = field === 'pricePerDay' ? value : formData.pricePerDay;
      const minimumDays = field === 'minimumDays' ? value : formData.minimumDays;

      if (pricePerDay && minimumDays) {
        const rentalTotal = parseFloat(pricePerDay) * parseFloat(minimumDays);
        setFormData((prev) => ({ ...prev, rentalTotalPrice: rentalTotal.toFixed(2) }));
      }
    }
  };

  // ========== VARIATION HANDLERS ==========

  // const handleAddAttribute = () => {
  //   setAttributes([...attributes, { name: '', values: [] }]);
  // };

  // const handleRemoveAttribute = (index) => {
  //   const newAttrs = [...attributes];
  //   newAttrs.splice(index, 1);
  //   setAttributes(newAttrs);
  //   generateVariations(newAttrs);
  // };

  // const handleAttributeNameChange = (index, value) => {
  //   const newAttrs = [...attributes];
  //   newAttrs[index].name = value;
  //   setAttributes(newAttrs);
  // };

  // const handleAddAttributeValue = (index, value) => {
  //   if (!value.trim()) return;
  //   const newAttrs = [...attributes];
  //   if (!newAttrs[index].values.includes(value.trim())) {
  //     newAttrs[index].values.push(value.trim());
  //     setAttributes(newAttrs);
  //     generateVariations(newAttrs);
  //   }
  // };

  // const handleRemoveAttributeValue = (index, valueIndex) => {
  //   const newAttrs = [...attributes];
  //   newAttrs[index].values.splice(valueIndex, 1);
  //   setAttributes(newAttrs);
  //   generateVariations(newAttrs);
  // };

  // const generateVariations = (attrs) => {
  //   // Only generate if we have valid attributes with values
  //   const validAttrs = attrs.filter(a => a.name && a.values.length > 0);
  //   if (validAttrs.length === 0) {
  //     setVariations([]);
  //     return;
  //   }

  //   // Generate combinations
  //   const combinations = validAttrs.reduce((acc, curr) => {
  //     if (acc.length === 0) return curr.values.map(v => [v]);
  //     return acc.flatMap(a => curr.values.map(v => [...a, v]));
  //   }, []);

  //   // Create variation objects, preserving existing data if possible
  //   const newVariations = combinations.map(combo => {
  //     const name = combo.join(' - ');

  //     // Try to find existing variation to preserve price/stock/image
  //     const existing = variations.find(v => {
  //       // simple check by name or attribute strings
  //       return v.name === name || JSON.stringify(v.attributeValues) === JSON.stringify(combo);
  //     });

  //     if (existing) {
  //       return {
  //         ...existing,
  //         name,
  //         attributeValues: combo
  //       };
  //     }

  //     return {
  //       name,
  //       price: formData.buyPricing?.unitPrice || 0,
  //       stockQuantity: 1,
  //       image: null,
  //       attributeValues: combo
  //     };
  //   });

  //   setVariations(newVariations);
  // };

  const handleVariationChange = (index, field, value) => {
    const newVars = [...variations];
    newVars[index][field] = value;
    setVariations(newVars);
  };

  const handleVariationImageUpload = (index, file) => {
    const newVars = [...variations];
    newVars[index].image = file;
    setVariations(newVars);
  };

  const fetchRelatedOptions = async () => {
    try {
      setLoadingRelated(true);
      setDrilldownCategory(null);

      const token = localStorage.getItem('token');
      const providerId = currentVendor?._id || currentVendor?.id;

      let url = '';

      if (relatedLinkBy === 'product') {
        if (!providerId) {
          console.error('Provider ID missing');
          return;
        }
        url = `${API_BASE}/api/boutiques?provider=${providerId}`;
      } else {
        // Fetch categories to allow drilldown/selection
        url = `${API_BASE}/api/categories/parents/${BOUTIQUE_MODULE_ID}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const options = res.data?.data || [];
      setRelatedOptions(options);

      // Cache info for already selected items
      setSelectedRelatedObjects((prev) => {
        const updated = [...prev];
        options.forEach((opt) => {
          const idx = updated.findIndex((x) => x._id === opt._id);
          if (idx !== -1) updated[idx] = opt;
        });
        return updated;
      });
    } catch (err) {
      console.error('Failed to load related items', err);
      setRelatedOptions([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleCategoryClick = async (cat) => {
    try {
      setLoadingRelated(true);
      setDrilldownCategory(cat);
      const token = localStorage.getItem('token');
      // Fetch boutiques for this specific category
      const res = await axios.get(`${API_BASE}/api/boutiques?category=${cat._id}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = res.data?.data || [];
      setRelatedOptions(items);

      // Cache info
      setSelectedRelatedObjects((prev) => {
        const updated = [...prev];
        items.forEach((c) => {
          const idx = updated.findIndex((x) => x._id === c._id);
          if (idx !== -1) updated[idx] = c;
        });
        return updated;
      });
    } catch (err) {
      console.error('Failed to load ornaments for category', err);
      setRelatedOptions([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleBackToCategories = () => {
    setDrilldownCategory(null);
    fetchRelatedOptions();
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      handleChange('thumbnailImage', file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = formData.galleryImages.length + formData.existingGallery.length + files.length;

    if (total > 10) {
      setError('Maximum 10 images allowed in gallery');
      return;
    }

    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      setError('Some images exceeded 5MB size limit');
    }

    handleChange('galleryImages', [...formData.galleryImages, ...validFiles]);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    // Load vendor data
    const loadVendor = () => {
      try {
        const vendorData = localStorage.getItem('vendor') || localStorage.getItem('user') || localStorage.getItem('vendorData');
        if (vendorData) {
          setCurrentVendor(JSON.parse(vendorData));
        } else {
          const vendorId = localStorage.getItem('vendorId') || localStorage.getItem('userId');
          if (vendorId) {
            setCurrentVendor({ _id: vendorId, id: vendorId });
          }
        }
      } catch (err) {
        console.error('Vendor load error:', err);
        setError('Failed to load vendor information');
      }
    };

    loadVendor();
  }, []);

  // Fetch Ornaments Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/categories/parents/${BOUTIQUE_MODULE_ID}`);
        if (response.data && response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching boutique categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Generate variations based on combinations of sizes and colors
    let newVariations = [];

    const sizes = formData.availableSizes || [];
    const colors = formData.availableColors || [];

    if (sizes.length > 0 && colors.length > 0) {
      // Both selected: cross product
      sizes.forEach((size) => {
        colors.forEach((color) => {
          const name = `${color} - ${size}`;
          const existing = variations.find((v) => v.name === name || (v.attributeValues?.includes(size) && v.attributeValues?.includes(color)));
          newVariations.push(
            existing || {
              name,
              attributeValues: [color, size],
              price: formData.unitPrice || '',
              stockQuantity: '',
              image: null
            }
          );
        });
      });
    } else if (sizes.length > 0) {
      // Only sizes
      newVariations = sizes.map((size) => {
        const existing = variations.find((v) => v.name === size || (v.attributeValues?.length === 1 && v.attributeValues[0] === size));
        return (
          existing || {
            name: size,
            attributeValues: [size],
            price: formData.unitPrice || '',
            stockQuantity: '',
            image: null
          }
        );
      });
    } else if (colors.length > 0) {
      // Only colors
      newVariations = colors.map((color) => {
        const existing = variations.find((v) => v.name === color || (v.attributeValues?.length === 1 && v.attributeValues[0] === color));
        return (
          existing || {
            name: color,
            attributeValues: [color],
            price: formData.unitPrice || '',
            stockQuantity: '',
            image: null
          }
        );
      });
    }

    setVariations(newVariations);
  }, [formData.availableSizes, formData.availableColors, formData.unitPrice]);

  // Removed redundant useEffect that synchronized subcategories from categories list

  useEffect(() => {
    // Load product data for edit mode
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/boutiques/${id}`);
        const product = data.data || data;

        // Map backend response to state
        setFormData({
          productName: product.name || '',
          description: product.description || '',
          category: product.category?._id || product.category || '',
          subcategory: product.subCategory?._id || product.subCategory || '',
          availableSizes: product.availableSizes || [],
          material: product.material || '',
          thumbnailImage: product.thumbnail || null,
          galleryImages: [],
          existingGallery: product.galleryImages || [],
          availabilityMode:
            product.availabilityMode === 'all'
              ? 'All'
              : product.availabilityMode === 'rental'
                ? 'Available For Rental'
                : 'Available For Purchase',
          availableForPurchase: product.availabilityMode !== 'rental',
          availableForRental: product.availabilityMode !== 'purchase',
          unitPrice: product.buyPricing?.unitPrice || '',
          discountType:
            product.buyPricing?.discountType === 'none'
              ? 'None'
              : product.buyPricing?.discountType === 'percentage'
                ? 'Percentage'
                : 'Fixed Amount',
          discountValue: product.buyPricing?.discountValue || '',
          tax: product.buyPricing?.tax || '',
          totalPrice: product.buyPricing?.totalPrice || '',
          pricePerDay: product.rentalPricing?.pricePerDay || '',
          minimumDays: product.rentalPricing?.minimumDays || '',
          lateCharges: product.rentalPricing?.lateCharges || '',
          rentalTotalPrice: product.rentalPricing?.totalPrice || '',
          advanceForBooking: product.rentalPricing?.advanceForBooking || '',
          damagePolicy: product.rentalPricing?.damagePolicy || '',
          stockQuantity: product.stock?.quantity || '',
          lowStockAlert: product.stock?.lowStockAlert || '',
          freeShipping: product.shipping?.free || false,
          flatRateShipping: product.shipping?.flatRate || false,
          shippingPrice: product.shipping?.price || '',
          selectedOccasions: product.occasions || [],
          selectedFeatures: product.features?.basicFeatures || [],
          suitableFor: product.features?.suitableFor || [],
          styleFeatures: product.features?.style?.[0] || '',
          tags: product.tags || [],
          careInstructions: product.careInstructions || '',
          existingSizeGuideImage: product.sizeGuideImage || '',
          availableColors: product.availableColors || [],
          returnPolicy: product.returnPolicy || '',
          cancellationPolicy: product.cancellationPolicy || '',
          isTopPick: product.isTopPick || false,
          isActive: product.isActive !== undefined ? product.isActive : true
        });

        if (product.variations?.length) {
          setVariations(
            product.variations.map((v) => ({
              name: v.name,
              attributeValues: v.attributeValues || [],
              price: v.price,
              stockQuantity: v.stockQuantity,
              image: v.image
            }))
          );
        }

        if (product.relatedItems) {
          setRelatedLinkBy(product.relatedItems.linkBy || 'product');
          setRelatedItems(product.relatedItems.items?.map((i) => i._id || i) || []);
          setSelectedRelatedObjects(product.relatedItems.items || []);
        }

        if (product.termsAndConditions) {
          try {
            setTermsSections(
              typeof product.termsAndConditions === 'string'
                ? JSON.parse(product.termsAndConditions)
                : product.termsAndConditions
            );
          } catch (e) {
            console.error('Error parsing terms:', e);
            setTermsSections([{ heading: '', points: [''] }]);
          }
        }

        // Fetch subcategories
        const catId = product.category?._id || product.category;
        if (catId) {
          const subRes = await axios.get(`${API_BASE}/api/categories/parents/${catId}/subcategories`);
          if (subRes.data?.success) setAvailableSubCategories(subRes.data.data);
        }
      } catch (err) {
        console.error('Load Error:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [isEditMode, id]);

  useEffect(() => {
    if (openRelatedModal) {
      fetchRelatedOptions();
    }
  }, [openRelatedModal, relatedLinkBy]);

  // ========== VALIDATION ==========
  const validateForm = () => {
    if (!currentVendor?._id && !currentVendor?.id) {
      return 'Vendor not authenticated. Please login again.';
    }
    if (!formData.productName.trim()) {
      return 'Product name is required';
    }
    if (!formData.category) {
      return 'Please select a category';
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      return 'Valid unit price is required';
    }
    if (!formData.description.trim()) {
      return 'Product description is required';
    }
    if (formData.availableForRental && (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0)) {
      return 'Valid price per day is required for rental';
    }
    if (formData.availableForRental && (!formData.minimumDays || parseInt(formData.minimumDays) <= 0)) {
      return 'Minimum rental days is required';
    }
    return null;
  };

  // ========== SUBMIT HANDLER ==========
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const vendorId = currentVendor?._id || currentVendor?.id;
    if (!vendorId) {
      setError('Vendor not authenticated');
      return;
    }

    const formDataToSend = new FormData();

    // Availability Mode Mapping
    let mode = 'purchase';
    if (formData.availabilityMode === 'All') mode = 'all';
    else if (formData.availabilityMode === 'Available For Rental') mode = 'rental';
    else if (formData.availabilityMode === 'Available For Purchase') mode = 'purchase';

    // 1. Basic Info
    formDataToSend.append('name', formData.productName);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('subCategory', formData.subcategory);
    formDataToSend.append('availableSizes', JSON.stringify(formData.availableSizes));
    formDataToSend.append('availableColors', JSON.stringify(formData.availableColors));
    formDataToSend.append('material', formData.material);
    formDataToSend.append('availabilityMode', mode);
    formDataToSend.append('isActive', formData.isActive);
    formDataToSend.append('isTopPick', formData.isTopPick);
    formDataToSend.append('returnPolicy', formData.returnPolicy);
    formDataToSend.append('cancellationPolicy', formData.cancellationPolicy);
    formDataToSend.append('provider', vendorId);
    formDataToSend.append('module', BOUTIQUE_MODULE_ID);

    // Attributes for variations (needed by some backends to track schema)
    const attributes = [];
    if (formData.availableSizes.length > 0) attributes.push({ name: 'Size', values: formData.availableSizes });
    if (formData.availableColors.length > 0) attributes.push({ name: 'Color', values: formData.availableColors });
    formDataToSend.append('attributes', JSON.stringify(attributes));

    // 2. Images
    if (formData.thumbnailImage instanceof File) {
      formDataToSend.append('thumbnail', formData.thumbnailImage);
    } else if (typeof formData.thumbnailImage === 'string') {
      formDataToSend.append('thumbnail', formData.thumbnailImage);

      if (variations.length > 0) {
        // Separate images from data
        const variationsData = variations.map((v, index) => ({
          name: v.name,
          attributeValues: v.attributeValues,
          price: Number(v.price),
          stockQuantity: Number(v.stockQuantity),
          image: v.image instanceof File ? `VAR_FILE_${index}` : v.image
        }));

        formDataToSend.append('variations', JSON.stringify(variationsData));

        // Append files
        variations.forEach((v, index) => {
          if (v.image instanceof File) {
            // We must ensure the backend can map this file to the variation.
            // If the backend expects 'variationImages' array, we just append.
            // If the order matches the VAR_FILE_{index}, it works.
            formDataToSend.append(`variationImages`, v.image);
          }
        });
      }

      // 4. Other Arrays

      formDataToSend.append('thumbnail', formData.thumbnailImage);
    }

    formData.galleryImages.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append('galleryImages', file);
      }
    });

    // Send existing gallery images so backend knows what to keep
    if (isEditMode) {
      formDataToSend.append('existingGalleryImages', JSON.stringify(formData.existingGallery));
    }

    // 3. Grouped Objects (JSON stringified for Multi-part)
    formDataToSend.append(
      'buyPricing',
      JSON.stringify({
        unitPrice: formData.unitPrice,
        discountType:
          formData.discountType.toLowerCase() === 'none'
            ? 'none'
            : formData.discountType.toLowerCase() === 'percentage'
              ? 'percentage'
              : 'flat',
        discountValue: formData.discountValue || 0,
        tax: formData.tax,
        totalPrice: formData.totalPrice
      })
    );

    formDataToSend.append(
      'rentalPricing',
      JSON.stringify({
        pricePerDay: formData.pricePerDay,
        minimumDays: formData.minimumDays,
        lateCharges: formData.lateCharges,
        totalPrice: formData.rentalTotalPrice,
        advanceForBooking: formData.advanceForBooking,
        damagePolicy: formData.damagePolicy
      })
    );

    formDataToSend.append(
      'stock',
      JSON.stringify({
        quantity: formData.stockQuantity,
        lowStockAlert: formData.lowStockAlert
      })
    );

    formDataToSend.append(
      'shipping',
      JSON.stringify({
        free: formData.freeShipping,
        flatRate: formData.flatRateShipping,
        price: formData.shippingPrice
      })
    );

    formDataToSend.append('tags', JSON.stringify(formData.tags));
    formDataToSend.append('occasions', JSON.stringify(formData.selectedOccasions));
    formDataToSend.append('termsAndConditions', JSON.stringify(termsSections));
    formDataToSend.append(
      'relatedItems',
      JSON.stringify({
        linkBy: relatedLinkBy,
        items: relatedItems
      })
    );

    try {
      setSubmitting(true);
      setError('');
      setSuccessMessage('');

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      if (isEditMode) {
        await axios.put(`${API_BASE}/api/boutiques/${id}`, formDataToSend, config);
        setSuccessMessage('Product updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/boutiques`, formDataToSend, config);
        setSuccessMessage('Product created successfully!');

        // Reset form after successful creation
        setTimeout(() => {
          navigate('/boutique/packagelist');
        }, 1500);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.message || 'Error saving product');
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ========== RENDER LOADING ==========
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} sx={{ color: THEME.primary }} />
          <Typography color="text.secondary">Loading product data...</Typography>
        </Stack>
      </Box>
    );
  }

  // ========== RENDER CONTENT ==========
  return (
    <Box
      sx={{
        background: '#F4F7FE',
        minHeight: '100vh',
        pb: 8
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid #E0E4EC',
          p: 2,
          px: { xs: 2, md: 4 },
          mb: 3,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: THEME.dark,
                '&:hover': {
                  background: THEME.gradient,
                  color: 'white'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  color: '#1B254B',
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                {isEditMode ? 'Edit' : 'Add'} Boutique Product
              </Typography>
              {currentVendor && (
                <Typography variant="caption" sx={{ color: '#A3AED0', fontWeight: 600 }}>
                  VENDOR PANEL • {currentVendor?.firstName?.toUpperCase() || currentVendor?.email?.split('@')[0].toUpperCase() || 'VENDOR'}
                </Typography>
              )}
            </Box>
          </Stack>

          <GradientButton
            onClick={handleSubmit}
            disabled={submitting || !currentVendor}
            startIcon={submitting ? null : <CheckCircleIcon />}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'Update' : 'Publish'}
          </GradientButton>
        </Box>
      </Box>

      {/* ALERTS */}
      <Box sx={{ px: { xs: 2, md: 6 }, pt: 3 }}>
        {successMessage && (
          <Alert
            severity="success"
            variant="filled"
            icon={<CheckCircleIcon fontSize="inherit" />}
            onClose={() => setSuccessMessage('')}
            sx={{
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)'
            }}
          >
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setError('')}
            sx={{
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)'
            }}
          >
            {error}
          </Alert>
        )}
      </Box>

      {/* FORM CONTENT - VERTICAL LAYOUT */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          width: '100%',
          maxWidth: '100%',
          margin: 0
        }}
      >
        <Stack spacing={4}>
          {/* 1. General Information Section - Redesigned */}
          <Paper
            sx={{
              borderRadius: '20px',
              p: 4,
              background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9ff 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}
          >
            <SectionHeader icon={CategoryIcon} title="General Information" subtitle="Provide essential details about your boutique item" />

            <Stack spacing={3.5}>
              {/* Product Name */}
              <TextField
                fullWidth
                label="Product Name *"
                placeholder="e.g. Designer Lehenga, Bridal Gown"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea'
                  }
                }}
              />

              {/* Category, Subcategory, Unit in a responsive grid */}
              <Grid container spacing={2.5}>
                {/* Category */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel
                      shrink={formData.category !== '' || undefined}
                      sx={{
                        '&.Mui-focused': { color: '#667eea' },
                        backgroundColor: 'white',
                        px: 1
                      }}
                    ></InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            '& .MuiMenuItem-root': {
                              borderRadius: '8px',
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.08)'
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.2)'
                                }
                              }
                            }
                          }
                        }
                      }}
                      sx={{
                        borderRadius: '14px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 14px'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.12)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px'
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Category</em>
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Subcategory */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel
                      shrink={formData.subcategory !== '' || undefined}
                      sx={{
                        '&.Mui-focused': { color: '#667eea' },
                        backgroundColor: 'white',
                        px: 1
                      }}
                    ></InputLabel>
                    <Select
                      value={formData.subcategory}
                      onChange={(e) => handleChange('subcategory', e.target.value)}
                      disabled={!formData.category}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            '& .MuiMenuItem-root': {
                              borderRadius: '8px',
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.08)'
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.2)'
                                }
                              }
                            }
                          }
                        }
                      }}
                      sx={{
                        borderRadius: '14px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover:not(.Mui-disabled)': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 14px'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.12)'
                        },
                        '&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px'
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Subcategory</em>
                      </MenuItem>
                      {availableSubCategories.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>
                          {sub.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Unit */}
                {/* Unit and Weight fields removed as requested */}

                {/* Material */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Fabric / Material"
                    placeholder="e.g. Silk, Cotton, Velvet, Chiffon"
                    value={formData.material}
                    onChange={(e) => handleChange('material', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)' },
                        '&.Mui-focused': { boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)' }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' }
                    }}
                  />
                </Grid>

                {/* Sizes Selection */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      fullWidth
                      value={formData.availableSizes}
                      onChange={(e) => handleChange('availableSizes', e.target.value)}
                      displayEmpty
                      renderValue={(selected) => (selected.length ? selected.join(', ') : 'Select Size')}
                      sx={{
                        width: '100%',
                        borderRadius: '14px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        '& .MuiSelect-select': {
                          padding: '16px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          color: (selected) => (selected.length ? '#111' : '#9CA3AF')
                        },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea', borderWidth: '2px' }
                      }}
                    >
                      {sizeOptions.map((size) => (
                        <MenuItem key={size} value={size}>
                          <Checkbox checked={formData.availableSizes?.includes(size)} />
                          <Typography fontWeight={600}>{size}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Colors Selection */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      fullWidth
                      value={formData.availableColors}
                      onChange={(e) => handleChange('availableColors', e.target.value)}
                      displayEmpty
                      renderValue={(selected) => (selected.length ? selected.join(', ') : 'Select Color')}
                      sx={{
                        width: '100%',
                        borderRadius: '14px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        '& .MuiSelect-select': {
                          padding: '16px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          color: (selected) => (selected.length ? '#111' : '#9CA3AF')
                        },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea', borderWidth: '2px' }
                      }}
                    >
                      {colorOptions.map((color) => (
                        <MenuItem key={color} value={color}>
                          <Checkbox checked={formData.availableColors?.includes(color)} />
                          <Typography fontWeight={600}>{color}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Description */}
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={4}
                placeholder="Describe the boutique item's quality, craftsmanship, design details, fabric, and unique features..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea'
                  }
                }}
              />

              {/* Care Instructions */}
              <TextField
                fullWidth
                label="Care Instructions"
                multiline
                rows={2}
                placeholder="e.g. Dry clean only, Hand wash separately..."
                value={formData.careInstructions}
                onChange={(e) => handleChange('careInstructions', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea'
                  }
                }}
              />
            </Stack>
          </Paper>


          {/* ================= VARIATIONS SECTION ================= */}
          <Paper
            sx={{
              borderRadius: '24px',
              p: 4,
              background: 'white',
              boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB',
              mb: 4
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#1B254B' }}>
                Product Variations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add attributes like Size, Color to generate price and stock variations
              </Typography>
            </Box>

            {/* Variations Table */}
            {variations.length > 0 && (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#F8F9FA' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Variation</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variations.map((v, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ fontWeight: 700 }}>{v.name}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={v.price}
                            onChange={(e) => handleVariationChange(i, 'price', e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={v.stockQuantity}
                            onChange={(e) => handleVariationChange(i, 'stockQuantity', e.target.value)}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton
                              component="label"
                              sx={{
                                bgcolor: alpha(THEME.primary, 0.1),
                                color: THEME.primary,
                                '&:hover': { bgcolor: THEME.primary, color: 'white' }
                              }}
                            >
                              <PhotoCamera fontSize="small" />
                              <input type="file" hidden onChange={(e) => handleVariationImageUpload(i, e.target.files[0])} />
                            </IconButton>
                            {v.image && (
                              <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: 'hidden', border: '1px solid #eee' }}>
                                <img
                                  src={v.image instanceof File ? URL.createObjectURL(v.image) : getImageUrl(v.image)}
                                  alt=""
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </Box>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
          {/* 2. Media Collection Section */}
          <Paper
            sx={{
              borderRadius: '16px',
              p: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <SectionHeader icon={CloudUploadIcon} title="Media Collection" subtitle="Upload images to showcase your product" />

            <Stack spacing={4}>
              {/* Cover Photo */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#4D5E80', fontWeight: 600 }}>
                  Cover Photo
                </Typography>
                <Box
                  onClick={() => document.getElementById('thumbnail-input').click()}
                  sx={{
                    border: '2px dashed #CBD5E0',
                    borderRadius: '16px',
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    bgcolor: '#F8FAFC',
                    transition: '0.2s',
                    '&:hover': { borderColor: THEME.primary, bgcolor: '#F5F0F7' }
                  }}
                >
                  <input id="thumbnail-input" type="file" hidden accept="image/*" onChange={handleThumbnailUpload} />
                  {formData.thumbnailImage ? (
                    <Box sx={{ width: '100%', height: '100%', maxWidth: 300 }}>
                      <img
                        src={
                          typeof formData.thumbnailImage === 'string'
                            ? getImageUrl(formData.thumbnailImage)
                            : URL.createObjectURL(formData.thumbnailImage)
                        }
                        alt="Thumbnail"
                        style={{ width: '100%', height: 'auto', maxHeight: 200, objectFit: 'contain', borderRadius: '12px' }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange('thumbnailImage', null);
                        }}
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Stack spacing={1} alignItems="center">
                      <CloudUploadIcon sx={{ fontSize: 48, color: '#A3AED0' }} />
                      <Typography variant="body2" fontWeight="600" color="#1B254B">
                        Upload Thumbnail
                      </Typography>
                      <Typography variant="caption" color="#A3AED0">
                        High resolution JPG, PNG
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>

              {/* Product Gallery */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#4D5E80', fontWeight: 600 }}>
                  Product Gallery (Max 10 Images)
                </Typography>
                <Box
                  onClick={() => document.getElementById('gallery-input').click()}
                  sx={{
                    border: '2px dashed #CBD5E0',
                    borderRadius: '16px',
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#F8FAFC',
                    transition: '0.2s',
                    '&:hover': { borderColor: THEME.primary, bgcolor: '#F5F0F7' },
                    mb: 2
                  }}
                >
                  <input id="gallery-input" type="file" hidden multiple accept="image/*" onChange={handleGalleryUpload} />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AddIcon sx={{ color: THEME.primary }} />
                    <Typography variant="body2" fontWeight="600" color="#1B254B">
                      Add Gallery Images
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {formData.existingGallery.map((img, i) => (
                    <Box key={`ex-${i}`} sx={{ position: 'relative', width: 100, height: 100 }}>
                      <img
                        src={getImageUrl(img)}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E0E4EC' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newGallery = [...formData.existingGallery];
                          newGallery.splice(i, 1);
                          handleChange('existingGallery', newGallery);
                        }}
                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', border: '1px solid #E0E4EC' }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                  {formData.galleryImages.map((file, i) => (
                    <Box key={`new-${i}`} sx={{ position: 'relative', width: 100, height: 100 }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E0E4EC' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newImages = [...formData.galleryImages];
                          newImages.splice(i, 1);
                          handleChange('galleryImages', newImages);
                        }}
                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', border: '1px solid #E0E4EC' }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Size Guide Image */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#4D5E80', fontWeight: 600 }}>
                  Size Guide Image
                </Typography>
                <Box
                  onClick={() => document.getElementById('sizeguide-input').click()}
                  sx={{
                    border: '2px dashed #CBD5E0',
                    borderRadius: '16px',
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    bgcolor: '#F8FAFC',
                    transition: '0.2s',
                    '&:hover': { borderColor: THEME.primary, bgcolor: '#F5F0F7' }
                  }}
                >
                  <input id="sizeguide-input" type="file" hidden accept="image/*" onChange={(e) => handleChange('sizeGuideImage', e.target.files[0])} />
                  {formData.sizeGuideImage || formData.existingSizeGuideImage ? (
                    <Box sx={{ width: '100%', height: '100%', maxWidth: 200 }}>
                      <img
                        src={
                          formData.sizeGuideImage instanceof File
                            ? URL.createObjectURL(formData.sizeGuideImage)
                            : getImageUrl(formData.existingSizeGuideImage || formData.sizeGuideImage)
                        }
                        alt="Size Guide"
                        style={{ width: '100%', height: 'auto', maxHeight: 100, objectFit: 'contain', borderRadius: '8px' }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange('sizeGuideImage', null);
                          handleChange('existingSizeGuideImage', '');
                        }}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Stack spacing={1} alignItems="center">
                      <CloudUploadIcon sx={{ fontSize: 32, color: '#A3AED0' }} />
                      <Typography variant="caption" fontWeight="600">Upload Size Guide</Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* 3. Pricing & Availability Section - BILLING FORM STYLE */}
          <Paper
            sx={{
              borderRadius: '24px',
              p: 0,
              background: 'white',
              boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid #E5E7EB'
            }}
          >
            {/* Header Banner */}
            <Box
              sx={{
                background: THEME.gradient,
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  filter: 'blur(40px)'
                }}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="center" position="relative">
                <Box>
                  <Typography variant="h5" fontWeight={800} color="white" mb={0.5}>
                    Pricing & Availability
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Configure your product pricing details
                  </Typography>
                </Box>
                <LocalOfferIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Stack>
            </Box>

            {/* Availability Toggles */}
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(to right, #F8F9FF, #FFF5F8)',
                borderBottom: '2px solid #F0F0F0'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      background: 'white',
                      border: formData.availableForPurchase ? `2px solid ${THEME.primary}` : '2px solid #E5E7EB',
                      boxShadow: formData.availableForPurchase ? '0 8px 24px rgba(156,39,176,0.15)' : 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleChange('availableForPurchase', !formData.availableForPurchase)}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: formData.availableForPurchase ? THEME.gradient : '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <LocalMallIcon sx={{ color: formData.availableForPurchase ? 'white' : '#9CA3AF' }} />
                        </Box>
                        <Box>
                          <Typography fontWeight={700} fontSize="1rem">
                            Available For Purchase
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sell this product directly
                          </Typography>
                        </Box>
                      </Stack>
                      <Switch
                        checked={formData.availableForPurchase}
                        onChange={(e) => handleChange('availableForPurchase', e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      background: 'white',
                      border: formData.availableForRental ? `2px solid ${THEME.secondary}` : '2px solid #E5E7EB',
                      boxShadow: formData.availableForRental ? '0 8px 24px rgba(233,30,99,0.15)' : 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleChange('availableForRental', !formData.availableForRental)}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: formData.availableForRental ? 'linear-gradient(135deg, #E91E63, #F06292)' : '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <EventAvailableIcon sx={{ color: formData.availableForRental ? 'white' : '#9CA3AF' }} />
                        </Box>
                        <Box>
                          <Typography fontWeight={700} fontSize="1rem">
                            Available For Rental
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rent out this product
                          </Typography>
                        </Box>
                      </Stack>
                      <Switch
                        checked={formData.availableForRental}
                        onChange={(e) => handleChange('availableForRental', e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Pricing Details */}
            <Box sx={{ p: 4 }}>
              <Stack spacing={4}>
                {/* PURCHASE INVOICE */}
                {formData.availableForPurchase && (
                  <Box>
                    <Box
                      sx={{
                        mb: 3,
                        pb: 2,
                        borderBottom: '2px solid #F0F0F0'
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: alpha(THEME.primary, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <LocalMallIcon sx={{ color: THEME.primary, fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography fontWeight={700} fontSize="1.1rem">
                            Purchase Invoice
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Set your selling price and applicable taxes
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Invoice Items */}
                    <Box
                      sx={{
                        border: '2px solid #E5E7EB',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                      }}
                    >
                      {/* Price & Discount Row */}
                      <Box
                        sx={{ p: 3.5, background: 'linear-gradient(135deg, #FAFBFC 0%, #F5F3FF 100%)', borderBottom: '2px solid #E5E7EB' }}
                      >
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.primary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Unit Price *
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="0.00"
                                type="number"
                                value={formData.unitPrice}
                                onChange={(e) => handleChange('unitPrice', e.target.value)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Box
                                        sx={{
                                          width: 36,
                                          height: 36,
                                          borderRadius: '10px',
                                          background: THEME.gradient,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          mr: 1
                                        }}
                                      >
                                        <Typography fontWeight={800} color="white" fontSize="1.1rem">
                                          ₹
                                        </Typography>
                                      </Box>
                                    </InputAdornment>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: 'white',
                                    borderRadius: '14px',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    border: '2px solid #E5E7EB',
                                    '&:hover': {
                                      borderColor: THEME.primary
                                    },
                                    '&.Mui-focused': {
                                      borderColor: THEME.primary,
                                      boxShadow: `0 0 0 3px ${alpha(THEME.primary, 0.1)}`
                                    }
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    py: 2
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.primary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Discount Type
                              </Typography>
                              <FormControl fullWidth>
                                <Select
                                  value={formData.discountType}
                                  onChange={(e) => handleChange('discountType', e.target.value)}
                                  displayEmpty
                                  sx={{
                                    background: 'white',
                                    borderRadius: '14px',
                                    fontWeight: 700,
                                    border: '2px solid #E5E7EB',
                                    '& .MuiSelect-select': {
                                      py: 2
                                    },
                                    '&:hover': {
                                      borderColor: THEME.primary
                                    },
                                    '&.Mui-focused': {
                                      borderColor: THEME.primary,
                                      boxShadow: `0 0 0 3px ${alpha(THEME.primary, 0.1)}`
                                    }
                                  }}
                                >
                                  {discountOptions.map((opt) => (
                                    <MenuItem key={opt} value={opt} sx={{ fontWeight: 600 }}>
                                      {opt}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.primary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Discount Value
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="0"
                                type="number"
                                disabled={formData.discountType === 'None'}
                                value={formData.discountValue}
                                onChange={(e) => handleChange('discountValue', e.target.value)}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Typography fontWeight={700} color="text.secondary">
                                        {formData.discountType === 'Percentage' ? '%' : '$'}
                                      </Typography>
                                    </InputAdornment>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: formData.discountType === 'None' ? '#F3F4F6' : 'white',
                                    borderRadius: '14px',
                                    fontWeight: 700,
                                    border: '2px solid #E5E7EB',
                                    '&:hover': {
                                      borderColor: THEME.primary
                                    }
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    py: 2
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Tax Row */}
                      <Box sx={{ p: 3.5, background: 'white', borderBottom: '2px solid #E5E7EB' }}>
                        <Box sx={{ position: 'relative' }}>
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{
                              mb: 1,
                              display: 'block',
                              color: THEME.primary,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Tax (GST)
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="0"
                            type="number"
                            value={formData.tax}
                            onChange={(e) => handleChange('tax', e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Box
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: '10px',
                                      background: alpha(THEME.primary, 0.1),
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      ml: 1
                                    }}
                                  >
                                    <Typography fontWeight={800} color={THEME.primary} fontSize="1rem">
                                      %
                                    </Typography>
                                  </Box>
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: '#FAFBFC',
                                borderRadius: '14px',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                border: '2px solid #E5E7EB',
                                '&:hover': {
                                  borderColor: THEME.primary,
                                  background: 'white'
                                },
                                '&.Mui-focused': {
                                  borderColor: THEME.primary,
                                  background: 'white',
                                  boxShadow: `0 0 0 3px ${alpha(THEME.primary, 0.1)}`
                                }
                              },
                              '& .MuiOutlinedInput-input': {
                                py: 2
                              }
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Total Row */}
                      <Box
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)'
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700} fontSize="1.1rem" color={THEME.primary}>
                            Total Amount
                          </Typography>
                          <Box
                            sx={{
                              px: 3,
                              py: 1.5,
                              borderRadius: '12px',
                              background: 'white',
                              minWidth: 150,
                              textAlign: 'center',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Typography fontWeight={800} fontSize="1.5rem" color={THEME.primary}>
                              ₹{formData.totalPrice || '0.00'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* RENTAL INVOICE */}
                {formData.availableForRental && (
                  <Box>
                    <Box
                      sx={{
                        mb: 3,
                        pb: 2,
                        borderBottom: '2px solid #F0F0F0'
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: alpha(THEME.secondary, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <EventAvailableIcon sx={{ color: THEME.secondary, fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography fontWeight={700} fontSize="1.1rem">
                            Rental Invoice
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Configure rental pricing and policies
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Rental Items */}
                    <Box
                      sx={{
                        border: '2px solid #FCE4EC',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(233,30,99,0.1)'
                      }}
                    >
                      {/* Daily Rate & Minimum Days */}
                      <Box
                        sx={{ p: 3.5, background: 'linear-gradient(135deg, #FFF5F7 0%, #FCE4EC 100%)', borderBottom: '2px solid #FCE4EC' }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.secondary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Price Per Day *
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="0.00"
                                type="number"
                                value={formData.pricePerDay}
                                onChange={(e) => handleChange('pricePerDay', e.target.value)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Box
                                        sx={{
                                          width: 36,
                                          height: 36,
                                          borderRadius: '10px',
                                          background: 'linear-gradient(135deg, #E91E63, #F06292)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          mr: 1
                                        }}
                                      >
                                        <Typography fontWeight={800} color="white" fontSize="1.1rem">
                                          ₹
                                        </Typography>
                                      </Box>
                                    </InputAdornment>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: 'white',
                                    borderRadius: '14px',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    border: '2px solid #FCE4EC',
                                    '&:hover': {
                                      borderColor: THEME.secondary
                                    },
                                    '&.Mui-focused': {
                                      borderColor: THEME.secondary,
                                      boxShadow: `0 0 0 3px ${alpha(THEME.secondary, 0.1)}`
                                    }
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    py: 2
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.secondary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Minimum Days *
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="0"
                                type="number"
                                value={formData.minimumDays}
                                onChange={(e) => handleChange('minimumDays', e.target.value)}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Box
                                        sx={{
                                          px: 2,
                                          py: 1,
                                          borderRadius: '8px',
                                          background: alpha(THEME.secondary, 0.1),
                                          ml: 1
                                        }}
                                      >
                                        <Typography fontWeight={700} color={THEME.secondary} fontSize="0.85rem">
                                          DAYS
                                        </Typography>
                                      </Box>
                                    </InputAdornment>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: 'white',
                                    borderRadius: '14px',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    border: '2px solid #FCE4EC',
                                    '&:hover': {
                                      borderColor: THEME.secondary
                                    },
                                    '&.Mui-focused': {
                                      borderColor: THEME.secondary,
                                      boxShadow: `0 0 0 3px ${alpha(THEME.secondary, 0.1)}`
                                    }
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    py: 2
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Additional Charges */}
                      <Box sx={{ p: 3.5, background: 'white', borderBottom: '2px solid #FCE4EC' }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.secondary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Advance Booking
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="0.00"
                                type="number"
                                value={formData.advanceForBooking}
                                onChange={(e) => handleChange('advanceForBooking', e.target.value)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Typography fontWeight={800} color={THEME.secondary} fontSize="1rem">
                                        ₹
                                      </Typography>
                                    </InputAdornment>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: '#FAFBFC',
                                    borderRadius: '14px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    border: '2px solid #F5F5F5',
                                    '&:hover': {
                                      borderColor: THEME.secondary,
                                      background: 'white'
                                    },
                                    '&.Mui-focused': {
                                      borderColor: THEME.secondary,
                                      background: 'white',
                                      boxShadow: `0 0 0 3px ${alpha(THEME.secondary, 0.1)}`
                                    }
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    py: 1.8
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.secondary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Late Charges / Day
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="0.00"
                                type="number"
                                value={formData.lateCharges}
                                onChange={(e) => handleChange('lateCharges', e.target.value)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Typography fontWeight={800} color={THEME.secondary} fontSize="1rem">
                                        ₹
                                      </Typography>
                                    </InputAdornment>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: '#FAFBFC',
                                    borderRadius: '14px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    border: '2px solid #F5F5F5',
                                    '&:hover': {
                                      borderColor: THEME.secondary,
                                      background: 'white'
                                    },
                                    '&.Mui-focused': {
                                      borderColor: THEME.secondary,
                                      background: 'white',
                                      boxShadow: `0 0 0 3px ${alpha(THEME.secondary, 0.1)}`
                                    }
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    py: 1.8
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative' }}>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                  mb: 1,
                                  display: 'block',
                                  color: THEME.secondary,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Damage Policy
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="Enter policy details"
                                value={formData.damagePolicy}
                                onChange={(e) => handleChange('damagePolicy', e.target.value)}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: '#FAFBFC',
                                    borderRadius: '14px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    border: '2px solid #F5F5F5',
                                    '&:hover': {
                                      borderColor: THEME.secondary,
                                      background: 'white'
                                    },
                                    '&.Mui-focused': {
                                      borderColor: THEME.secondary,
                                      background: 'white',
                                      boxShadow: `0 0 0 3px ${alpha(THEME.secondary, 0.1)}`
                                    }
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    py: 1.8
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Rental Total */}
                      <Box
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #FCE4EC, #F8BBD0)'
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700} fontSize="1.1rem" color={THEME.secondary}>
                            Rental Total (Min Period)
                          </Typography>
                          <Box
                            sx={{
                              px: 3,
                              py: 1.5,
                              borderRadius: '12px',
                              background: 'white',
                              minWidth: 150,
                              textAlign: 'center',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Typography fontWeight={800} fontSize="1.5rem" color={THEME.secondary}>
                              ${formData.rentalTotalPrice || '0.00'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>
          </Paper>
          <Paper
            sx={{
              borderRadius: '16px',
              p: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <SectionHeader icon={InventoryIcon} title="Inventory Status" subtitle="Manage your stock levels" />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Available Stock"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleChange('stockQuantity', e.target.value)}
                  placeholder="Number of units in stock"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Low Stock Warning"
                  type="number"
                  value={formData.lowStockAlert}
                  onChange={(e) => handleChange('lowStockAlert', e.target.value)}
                  helperText="System will notify you when stock reaches this level"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* 5. Shipping Section */}
          <Paper
            sx={{
              borderRadius: '16px',
              p: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <SectionHeader icon={LocalShippingIcon} title="Shipping" subtitle="Configure shipping preferences" />

            <Stack spacing={3}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: '#F8FAFC',
                  borderRadius: '12px'
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="600" color="#4D5E80">
                    Free Shipping
                  </Typography>
                  <Typography variant="caption" color="#64748B">
                    Offer free shipping to customers
                  </Typography>
                </Box>
                <Switch
                  checked={formData.freeShipping}
                  onChange={(e) => {
                    handleChange('freeShipping', e.target.checked);
                    if (e.target.checked) handleChange('flatRateShipping', false);
                  }}
                  color="success"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: '#F8FAFC',
                  borderRadius: '12px'
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="600" color="#4D5E80">
                    Flat Rate Shipping
                  </Typography>
                  <Typography variant="caption" color="#64748B">
                    Set a fixed shipping price
                  </Typography>
                </Box>
                <Switch
                  checked={formData.flatRateShipping}
                  onChange={(e) => {
                    handleChange('flatRateShipping', e.target.checked);
                    if (e.target.checked) handleChange('freeShipping', false);
                  }}
                  color="primary"
                />
              </Box>

              {formData.flatRateShipping && (
                <TextField
                  fullWidth
                  label="Shipping Price"
                  type="number"
                  value={formData.shippingPrice}
                  onChange={(e) => handleChange('shippingPrice', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              )}
            </Stack>
          </Paper>

          {/* 6. Suitable Occasions Section */}
          <Paper
            sx={{
              borderRadius: '16px',
              p: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <SectionHeader icon={EventIcon} title="Suitable Occasions" subtitle="Select the events where this boutique item fits best" />
            <Autocomplete
              multiple
              options={occasionOptions}
              value={formData.selectedOccasions}
              onChange={(event, newValue) => handleChange('selectedOccasions', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select suitable occasions"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    size="medium"
                    sx={{
                      background: alpha(THEME.primary, 0.1),
                      color: THEME.primary,
                      fontWeight: 500,
                      borderRadius: '8px',
                      height: 32
                    }}
                  />
                ))
              }
            />
          </Paper>
          {/* 7. Policies & Status Section */}
          <Paper
            sx={{
              borderRadius: '24px',
              p: 4,
              background: 'white',
              boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}
          >
            <SectionHeader icon={InfoIcon} title="Policies & Status" subtitle="Manage return policies and item visibility" />
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Return Policy"
                    multiline
                    rows={3}
                    placeholder="e.g. 7 days return policy, items must be in original condition..."
                    value={formData.returnPolicy}
                    onChange={(e) => handleChange('returnPolicy', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        backgroundColor: '#F9FAFB'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cancellation Policy"
                    multiline
                    rows={3}
                    placeholder="e.g. Cancel within 24 hours for full refund..."
                    value={formData.cancellationPolicy}
                    onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        backgroundColor: '#F9FAFB'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Stack direction="row" spacing={4} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={700}>Top Pick Status:</Typography>
                  <Switch
                    checked={formData.isTopPick}
                    onChange={(e) => handleChange('isTopPick', e.target.checked)}
                    color="primary"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Show this item in 'Top Picks' section
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={700}>Item Visibility:</Typography>
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    color="success"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formData.isActive ? 'Item is live' : 'Item is hidden'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
          {/* 8. Related Items Section */}
          <Paper
            sx={{
              borderRadius: '16px',
              p: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <SectionHeader icon={CategoryIcon} title="Frequently Bought Together" subtitle="Link related boutique items or categories" />

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#4A5568' }}>
                LINKING METHOD
              </Typography>
              <RadioGroup
                row
                value={relatedLinkBy}
                onChange={(e) => {
                  setRelatedLinkBy(e.target.value);
                  setRelatedItems([]);
                  setSelectedRelatedObjects([]);
                }}
              >
                <FormControlLabel
                  value="product"
                  control={<Radio color="primary" />}
                  label={<Typography fontWeight={600}>Specific Products</Typography>}
                />
                <FormControlLabel
                  value="category"
                  control={<Radio color="primary" />}
                  label={<Typography fontWeight={600}>Whole Categories</Typography>}
                />
              </RadioGroup>
            </Box>

            <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#4A5568' }}>
                SELECTED {relatedLinkBy === 'product' ? 'BOUTIQUE ITEMS' : 'CATEGORIES'}
              </Typography>

              <Grid container spacing={2}>
                {selectedRelatedObjects.map((item) => (
                  <Grid item key={item._id}>
                    <Chip
                      label={item.productName || item.name || item.title}
                      onDelete={() => {
                        setRelatedItems((prev) => prev.filter((id) => id !== item._id));
                        setSelectedRelatedObjects((prev) => prev.filter((obj) => obj._id !== item._id));
                      }}
                      sx={{
                        height: '45px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        bgcolor: alpha(THEME.primary, 0.08),
                        color: THEME.primary,
                        border: `1px solid ${alpha(THEME.primary, 0.2)}`,
                        '& .MuiChip-deleteIcon': {
                          color: THEME.primary,
                          '&:hover': { color: THEME.secondary }
                        }
                      }}
                    />
                  </Grid>
                ))}
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenRelatedModal(true)}
                    sx={{
                      height: '45px',
                      borderRadius: '12px',
                      borderStyle: 'dashed',
                      borderWidth: '2px',
                      px: 3,
                      fontWeight: 700,
                      color: THEME.primary,
                      borderColor: THEME.primary,
                      '&:hover': {
                        borderWidth: '2px',
                        bgcolor: alpha(THEME.primary, 0.05)
                      }
                    }}
                  >
                    Add {relatedLinkBy === 'product' ? 'Boutique Item' : 'Category'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>



          {/* ================= TERMS & CONDITIONS ================= */}
          <Box sx={{ mb: 4 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff, #fafafa)',
                border: '1px solid #eee'
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                Terms & Conditions
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Define rules & policies shown to customers during booking
              </Typography>

              {termsSections.map((section, sIndex) => (
                <Box
                  key={sIndex}
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#fff'
                  }}
                >
                  {/* Section Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Section Heading"
                      placeholder="e.g. Booking & Confirmation"
                      value={section.heading}
                      onChange={(e) => {
                        const copy = [...termsSections];
                        copy[sIndex].heading = e.target.value;
                        setTermsSections(copy);
                      }}
                    />

                    {/* Remove Section */}
                    {termsSections.length > 1 && (
                      <Button
                        onClick={() => setTermsSections((prev) => prev.filter((_, i) => i !== sIndex))}
                        sx={{ ml: 1, color: 'error.main' }}
                      >
                        ✕
                      </Button>
                    )}
                  </Box>

                  {/* Points */}
                  {section.points.map((point, pIndex) => (
                    <Box key={pIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TextField
                        fullWidth
                        label={`Point ${pIndex + 1}`}
                        placeholder="Enter policy detail"
                        value={point}
                        onChange={(e) => {
                          const copy = [...termsSections];
                          copy[sIndex].points[pIndex] = e.target.value;
                          setTermsSections(copy);
                        }}
                      />

                      {/* Remove Point */}
                      {section.points.length > 1 && (
                        <Button
                          onClick={() => {
                            const copy = [...termsSections];
                            copy[sIndex].points.splice(pIndex, 1);
                            setTermsSections(copy);
                          }}
                          sx={{ ml: 1, color: 'error.main' }}
                        >
                          ✕
                        </Button>
                      )}
                    </Box>
                  ))}

                  {/* Add Point */}
                  <Button
                    size="small"
                    onClick={() => {
                      const copy = [...termsSections];
                      copy[sIndex].points.push('');
                      setTermsSections(copy);
                    }}
                    sx={{ mt: 1, color: THEME.primary }}
                  >
                    + Add Point
                  </Button>
                </Box>
              ))}

              {/* Add Section */}
              <Button
                variant="outlined"
                onClick={() => setTermsSections([...termsSections, { heading: '', points: [''] }])}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  borderColor: THEME.primary,
                  color: THEME.primary
                }}
              >
                + Add Section
              </Button>
            </Card>
          </Box>

          {/* Submit Button */}
          <GradientButton
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={submitting || !currentVendor}
            sx={{
              borderRadius: '16px',
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'Update Product' : 'Publish Product'}
          </GradientButton>
        </Stack>
      </Box>

      {/* FOOTER NOTE */}
      <Box sx={{ textAlign: 'center', mt: 6, px: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Need help? Contact support@bookmyevent.ae
        </Typography>
      </Box>
      {/* RELATED ITEMS SELECTION DIALOG */}
      <Dialog
        open={openRelatedModal}
        onClose={() => setOpenRelatedModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '28px',
            p: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogTitle sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight={900} sx={{ color: '#1B254B', letterSpacing: '-0.5px' }}>
                Select {relatedLinkBy === 'product' ? 'Boutique Items' : 'Categories'}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {drilldownCategory ? `Showing products in ${drilldownCategory.title}` : `Browse available ${relatedLinkBy}s to link`}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenRelatedModal(false)}
              sx={{
                bgcolor: '#F4F7FE',
                '&:hover': { bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ minHeight: '450px', p: 4, bgcolor: '#F8FAFC' }}>
          {loadingRelated ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: 2 }}>
              <CircularProgress size={40} thickness={4} />
              <Typography fontWeight={600} color="text.secondary">
                Fetching details...
              </Typography>
            </Box>
          ) : (
            <>
              {drilldownCategory && (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToCategories}
                    variant="outlined"
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderColor: '#E2E8F0',
                      color: '#4A5568',
                      '&:hover': { borderColor: THEME.primary, color: THEME.primary }
                    }}
                  >
                    Back to Categories
                  </Button>

                  {relatedLinkBy === 'category' && (
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        px: 3,
                        bgcolor: alpha(THEME.primary, 0.05),
                        borderRadius: '16px',
                        border: `1px solid ${alpha(THEME.primary, 0.1)}`
                      }}
                    >
                      <Typography fontWeight={800} color={THEME.primary}>
                        Select Entire Category: {drilldownCategory.title}
                      </Typography>
                      <Checkbox
                        checked={relatedItems.includes(drilldownCategory._id)}
                        onChange={(e) => {
                          const id = drilldownCategory._id;
                          if (e.target.checked) {
                            setRelatedItems((prev) => [...prev, id]);
                            setSelectedRelatedObjects((prev) => [...prev, drilldownCategory]);
                          } else {
                            setRelatedItems((prev) => prev.filter((x) => x !== id));
                            setSelectedRelatedObjects((prev) => prev.filter((x) => x._id !== id));
                          }
                        }}
                        sx={{ color: THEME.primary, '&.Mui-checked': { color: THEME.primary } }}
                      />
                    </Box>
                  )}
                </Stack>
              )}

              {relatedOptions.length === 0 ? (
                <Box sx={{ py: 10, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700} color="text.secondary">
                    No items found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try different selection criteria
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2.5}>
                  {relatedOptions.map((option) => {
                    const id = option._id;
                    const isSelected = relatedItems.includes(id);
                    const isCategoryItem = !option.productName && option.title;
                    const canDrilldown = isCategoryItem && !drilldownCategory;

                    return (
                      <Grid item xs={12} sm={6} md={4} key={id}>
                        <Card
                          onClick={() => {
                            if (canDrilldown) {
                              handleCategoryClick(option);
                            } else {
                              if (isSelected) {
                                setRelatedItems((prev) => prev.filter((x) => x !== id));
                                setSelectedRelatedObjects((prev) => prev.filter((obj) => obj._id !== id));
                              } else {
                                setRelatedItems((prev) => [...prev, id]);
                                setSelectedRelatedObjects((prev) => [...prev, option]);
                              }
                            }
                          }}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '20px',
                            border: isSelected ? `2px solid ${THEME.primary}` : '2.5px solid white',
                            bgcolor: isSelected ? alpha(THEME.primary, 0.02) : 'white',
                            boxShadow: isSelected ? `0 12px 24px ${alpha(THEME.primary, 0.1)}` : '0 4px 12px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: isSelected ? 'none' : 'translateY(-6px)',
                              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                              borderColor: isSelected ? THEME.primary : alpha(THEME.primary, 0.3)
                            }
                          }}
                        >
                          <Box sx={{ position: 'relative', pt: '85%', bgcolor: '#f1f1f1' }}>
                            <img
                              src={
                                option.thumbnail ||
                                (option.image
                                  ? option.image.startsWith('http')
                                    ? option.image
                                    : `${API_BASE}${option.image}`
                                  : '/placeholder.jpg')
                              }
                              alt={option.productName || option.title || option.name}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: '0.5s'
                              }}
                            />
                            {isSelected && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  bgcolor: THEME.primary,
                                  color: 'white',
                                  borderRadius: '50%',
                                  p: 0.5,
                                  display: 'flex',
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                  zIndex: 2
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </Box>
                            )}
                            {canDrilldown && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                  p: 1.5,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  opacity: 0.9
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="white"
                                  fontWeight={700}
                                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                >
                                  CLICK TO VIEW ITEMS <ArrowBackIcon sx={{ transform: 'rotate(180deg)', fontSize: 14 }} />
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <SubcategoryBadge
                              label={isCategoryItem ? 'Category' : option.category?.title || 'Ornament'}
                              color={isCategoryItem ? THEME.secondary : THEME.primary}
                            />
                            <Typography fontWeight={800} sx={{ mt: 1, fontSize: '0.95rem', color: '#1B254B', lineHeight: 1.2 }}>
                              {option.productName || option.title || option.name}
                            </Typography>
                            {!isCategoryItem && option.buyPricing && (
                              <Typography variant="body1" sx={{ mt: 1, fontWeight: 900, color: THEME.primary }}>
                                ₹{option.buyPricing.totalPrice || option.buyPricing.unitPrice}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, bgcolor: '#ffffff', borderTop: '1px solid #E2E8F0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpenRelatedModal(false)}
            sx={{
              borderRadius: '16px',
              background: THEME.gradient,
              py: 2,
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: `0 12px 24px ${alpha(THEME.primary, 0.25)}`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 15px 30px ${alpha(THEME.primary, 0.35)}`
              }
            }}
          >
            Confirm Selection ({relatedItems.length} selected)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddBoutique;
