import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  Star as StarIcon,
  Storefront as TakeawayIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import Slider from "@mui/material/Slider";

import axios from 'axios';

const PINK = '#E91E63';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://api.bookmyevent.ae';
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
  height: '250px',
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
  padding: '20px',
  borderRadius: '24px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  position: 'relative',
  transition: 'all 0.3s ease',
  height: '100%',
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

const VariationRow = ({ variation, onChange, onImageUpload, onDelete }) => {
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      {/* Variation Name */}
      <TableCell sx={{ py: 3, pl: 4 }}>
        <Typography sx={{ fontWeight: 800, color: '#1F2937', fontSize: '15px' }}>{variation.name}</Typography>
      </TableCell>

      {/* Price */}
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

      {/* Media + Actions */}
      <TableCell sx={{ py: 3, pr: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Upload image */}
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

          {/* Preview */}
          {variation.image && (
            <Box
              sx={{
                position: 'relative',
                width: 45,
                height: 45,
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
            </Box>
          )}

          {/* ❌ DELETE VARIATION */}
          <IconButton
            onClick={onDelete}
            sx={{
              bgcolor: alpha('#EF4444', 0.1),
              color: '#EF4444',
              '&:hover': {
                bgcolor: '#EF4444',
                color: '#fff'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
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
  const DEFAULT_WEIGHTS = ['0.5Kg', '1 Kg', '2 Kg', '3 Kg', '5 Kg+'];

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [relatedLinkBy, setRelatedLinkBy] = useState('product');
  const [relatedItems, setRelatedItems] = useState([]);
  const [selectedRelatedObjects, setSelectedRelatedObjects] = useState([]);
  const [openRelatedModal, setOpenRelatedModal] = useState(false);
  const [drilldownCategory, setDrilldownCategory] = useState(null);

  // Google Maps
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78';
  const [pickupLocation, setPickupLocation] = useState({
    latitude: '',
    longitude: '',
    address: ''
  });
  const [radiusKm, setRadiusKm] = useState(26);
  const circleRef = useRef(null);
  const [coveredPincodes, setCoveredPincodes] = useState([]);

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
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [relatedOptions, setRelatedOptions] = useState([]); // products OR categories
  const [loadingRelated, setLoadingRelated] = useState(false);

  const [customWeight, setCustomWeight] = useState('');
  const [weightOptions, setWeightOptions] = useState(ATTRIBUTE_VALUES.Weight);

  // Variants & Pricing
  const [unitPrice, setUnitPrice] = useState('');
  const [discountType, setDiscountType] = useState('no_discount');
  const [discountValue, setDiscountValue] = useState('');
  const [attrValues, setAttrValues] = useState({ Weight: [], Ingredient: [] });
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState(['Weight', 'Ingredient']);

  // Addons & Shipping
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [shipping, setShipping] = useState({ free: false, flatRate: false, takeaway: false, takeawayLocation: '', price: '' });

  // Media
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [availableAddons, setAvailableAddons] = useState([]);

  // ------------------------------ EFFECTS & HANDLERS ------------------------------

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const vendorData = localStorage.getItem('vendor') || localStorage.getItem('user');
        let parsedVendor = null;
        if (vendorData) {
          parsedVendor = JSON.parse(vendorData);
          setCurrentVendor(parsedVendor);

          // 🔥 Fetch vendor profile from API to get saved location (zone/lat/lng)
          if (!isEditMode && !id) {
            try {
              // ✅ Use USER ID — new endpoint looks up vendorprofile by user field
              const userData = localStorage.getItem('user');
              const parsedUser = userData ? JSON.parse(userData) : null;
              const userId = parsedUser?._id || parsedUser?.id || parsedVendor?.user || parsedVendor?._id || parsedVendor?.id;
              const tkn = localStorage.getItem('token');
              console.log("🔍 Fetching vendor profile for userId:", userId);
              const profileRes = await axios.get(`${API_BASE}/api/vendorprofiles/find/${userId}`, {
                headers: { Authorization: `Bearer ${tkn}` }
              });
              const profile = profileRes.data?.data;

              if (profile?.latitude && profile?.longitude) {
                setPickupLocation({
                  latitude: profile.latitude.toString(),
                  longitude: profile.longitude.toString(),
                  address: profile.storeAddress?.fullAddress || ''
                });
                if (profile.storeAddress?.fullAddress) {
                  setShipping(prev => ({ ...prev, takeawayLocation: profile.storeAddress.fullAddress }));
                }
                console.log("✅ Loaded vendor location from profile:", profile.latitude, profile.longitude);
              } else if (parsedVendor.latitude && parsedVendor.longitude) {
                // Fallback to localStorage
                setPickupLocation({
                  latitude: parsedVendor.latitude,
                  longitude: parsedVendor.longitude,
                  address: parsedVendor.storeAddress?.fullAddress || ''
                });
                if (parsedVendor.storeAddress?.fullAddress) {
                  setShipping(prev => ({ ...prev, takeawayLocation: parsedVendor.storeAddress.fullAddress }));
                }
              }
            } catch (profileErr) {
              console.error('Failed to fetch vendor profile for location:', profileErr);
              // Fallback to localStorage
              if (parsedVendor.latitude && parsedVendor.longitude) {
                setPickupLocation({
                  latitude: parsedVendor.latitude,
                  longitude: parsedVendor.longitude,
                  address: parsedVendor.storeAddress?.fullAddress || ''
                });
                if (parsedVendor.storeAddress?.fullAddress) {
                  setShipping(prev => ({ ...prev, takeawayLocation: parsedVendor.storeAddress.fullAddress }));
                }
              }
            }
          }
        }
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
              takeaway: cake.shipping?.takeaway || false,
              takeawayLocation: cake.shipping?.takeawayLocation || '',
              price: cake.shipping?.price || ''
            });

            if (cake.shipping?.pickupLatitude && cake.shipping?.pickupLongitude) {
              setPickupLocation({
                latitude: cake.shipping.pickupLatitude.toString(),
                longitude: cake.shipping.pickupLongitude.toString(),
                address: cake.shipping.takeawayLocation || ''
              });
              if (cake.shipping.deliveryRadius) {
                setRadiusKm(Number(cake.shipping.deliveryRadius));
              }
            }
            if (cake.variations?.length)
              setVariations(cake.variations.map((v, idx) => ({ id: v._id || `old-${idx}`, name: v.name, price: v.price, image: v.image })));
            setSelectedAddons(cake.addons || []);
            setUnit(cake.unit || 'Kg');
            setWeight(cake.weight || '');

            // Load related items objects if they exist
            if (cake.relatedItems?.items?.length) {
              const itemIds = cake.relatedItems.items.map((i) => i._id || i);
              setRelatedItems(itemIds);

              // Only set objects for items that are actually objects
              const objects = cake.relatedItems.items.filter((i) => typeof i === 'object' && i !== null);
              setSelectedRelatedObjects(objects);
              setRelatedLinkBy(cake.relatedItems.linkBy || 'product');
            }
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
    if (window.google?.maps) {
      setMapsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        try {
          document.head.removeChild(script);
        } catch (e) {
          console.error('Error removing map script');
        }
      }
    };
  }, []);

  useEffect(() => {
    if (mapsLoaded && shipping.free && window.google?.maps) {
      initPickupMap();
    }
  }, [mapsLoaded, shipping.free]);

  const initPickupMap = useCallback(() => {
    if (!window.google || !mapRef.current) return;

    const center = {
      lat: pickupLocation.latitude ? parseFloat(pickupLocation.latitude) : 25.2048,
      lng: pickupLocation.longitude ? parseFloat(pickupLocation.longitude) : 55.2708
    };

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    newMap.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      setPickupLocation((prev) => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
      }));

      if (markerRef.current) markerRef.current.setMap(null);
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: newMap,
        animation: window.google.maps.Animation.DROP
      });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setPickupLocation((prev) => ({
            ...prev,
            address: results[0].formatted_address
          }));
          setShipping((prev) => ({ ...prev, takeawayLocation: results[0].formatted_address }));
        }
      });
    });
    // Create radius circle
    circleRef.current = new window.google.maps.Circle({
      strokeColor: '#2563EB',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#2563EB',
      fillOpacity: 0.15,
      map: newMap,
      center,
      radius: radiusKm * 1000 // meters
    });

    setMap(newMap);

    if (searchInputRef.current && !window.autocompleteInstance) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ['geometry', 'formatted_address']
      });
      window.autocompleteInstance = autocomplete; // Prevent double binding

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const loc = place.geometry.location;

        if (markerRef.current) markerRef.current.setMap(null);
        markerRef.current = new window.google.maps.Marker({
          position: loc,
          map: newMap,
          animation: window.google.maps.Animation.DROP
        });

        setPickupLocation({
          latitude: loc.lat().toString(),
          longitude: loc.lng().toString(),
          address: place.formatted_address
        });

        setShipping((prev) => ({ ...prev, takeawayLocation: place.formatted_address }));
        newMap.setCenter(loc);
        newMap.setZoom(14);
      });
    }
  }, [pickupLocation.latitude, pickupLocation.longitude, shipping.takeaway]);

  // Debounce ref
  const debounceRef = useRef(null);

  const fetchPincodesInRadius = useCallback(async () => {
    if (!pickupLocation.latitude || !pickupLocation.longitude) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/pincodes/radius`, {
          params: {
            lat: pickupLocation.latitude,
            lng: pickupLocation.longitude,
            radius: radiusKm
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setCoveredPincodes(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching pincodes:", err);
      }
    }, 500);
  }, [pickupLocation.latitude, pickupLocation.longitude, radiusKm]);

  useEffect(() => {
    if (map && circleRef.current && pickupLocation.latitude && pickupLocation.longitude) {
      const lat = parseFloat(pickupLocation.latitude);
      const lng = parseFloat(pickupLocation.longitude);
      const newCenter = { lat, lng };

      // Update Circle
      circleRef.current.setCenter(newCenter);
      circleRef.current.setRadius(radiusKm * 1000);

      // Update Marker
      if (markerRef.current) {
        markerRef.current.setPosition(newCenter);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: newCenter,
          map: map,
          animation: window.google.maps.Animation.DROP
        });
      }

      // Fit Map Bounds to Circle
      const bounds = circleRef.current.getBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }

      // Fetch pincodes
      fetchPincodesInRadius();
    }
  }, [pickupLocation.latitude, pickupLocation.longitude, radiusKm, map, fetchPincodesInRadius]);


  useEffect(() => {
    const fetchAddons = async () => {
      const vendorId = currentVendor?._id || currentVendor?.id;
      if (!vendorId) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/cake-addons/provider/${vendorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAvailableAddons(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching addons:', err);
      }
    };
    fetchAddons();
  }, [currentVendor]);

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

  const handleAttrValueToggle = (attr, values) => {
    const newAttrValues = {
      ...attrValues,
      [attr]: values
    };

    setAttrValues(newAttrValues);

    const activeAttrs = ATTRIBUTES.filter((a) => newAttrValues[a]?.length > 0);

    if (!activeAttrs.length) {
      setVariations([]);
      return;
    }

    const combinations = activeAttrs.reduce(
      (acc, curr) =>
        acc.length === 0 ? newAttrValues[curr].map((v) => [v]) : acc.flatMap((d) => newAttrValues[curr].map((e) => [...d, e])),
      []
    );

    setVariations(
      combinations.map((combo, idx) => ({
        id: `new-${idx}`,
        name: combo.join(' - '),
        price: unitPrice || '',
        image: null,
        attributeValues: combo
      }))
    );
  };
  const fetchRelatedOptions = async () => {
    try {
      setLoadingRelated(true);
      setDrilldownCategory(null); // Reset drilldown when starting fresh

      const token = localStorage.getItem('token');
      const providerId = currentVendor?._id || currentVendor?.id;

      let url = '';

      if (relatedLinkBy === 'product') {
        if (!providerId) {
          console.error('Provider ID missing');
          return;
        }
        url = `${API_BASE}/api/cakes/provider/${providerId}`;
      } else {
        url = `${API_BASE}/api/categories/parents/${CAKE_MODULE_ID}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const options = res.data?.data || [];
      setRelatedOptions(options);

      // Cache info for already selected items if they appear in options
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
      // Fetch cakes for this specific category - Ensure limit is high for selection
      const res = await axios.get(`${API_BASE}/api/cakes/category/${cat._id}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cakes = res.data?.data || [];
      setRelatedOptions(cakes);

      // Cache info
      setSelectedRelatedObjects((prev) => {
        const updated = [...prev];
        cakes.forEach((c) => {
          const idx = updated.findIndex((x) => x._id === c._id);
          if (idx !== -1) updated[idx] = c;
        });
        return updated;
      });
    } catch (err) {
      console.error('Failed to load cakes for category', err);
      setRelatedOptions([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleBackToCategories = () => {
    setDrilldownCategory(null);
    fetchRelatedOptions();
  };

  const removeWeight = (weight) => {
    // 1️⃣ Remove from weight options
    setWeightOptions((prev) => prev.filter((w) => w !== weight));

    // 2️⃣ Remove from selected attribute values
    setAttrValues((prev) => {
      const updated = {
        ...prev,
        Weight: prev.Weight.filter((w) => w !== weight)
      };

      // 3️⃣ Rebuild variations correctly
      const activeAttrs = ATTRIBUTES.filter((a) => updated[a]?.length > 0);

      if (!activeAttrs.length) {
        setVariations([]);
        return updated;
      }

      const combinations = activeAttrs.reduce(
        (acc, curr) => (acc.length === 0 ? updated[curr].map((v) => [v]) : acc.flatMap((d) => updated[curr].map((e) => [...d, e]))),
        []
      );

      setVariations(
        combinations.map((combo, idx) => ({
          id: `new-${idx}`,
          name: combo.join(' - '),
          price: unitPrice || '',
          image: null
        }))
      );

      return updated;
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

  /* ------------------------------ HANDLERS ------------------------------ */

  const handleAddonToggle = (addonId) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((item) => item.addonId === addonId);
      if (exists) {
        return prev.filter((item) => item.addonId !== addonId);
      } else {
        return [...prev, { addonId, selectedItems: [] }];
      }
    });
  };

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
    setRelatedItems([]);
    setSelectedRelatedObjects([]);
    setDrilldownCategory(null);
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
    formData.append(
      'shipping',
      JSON.stringify({
        ...shipping,
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        deliveryRadius: radiusKm
      })
    );
    formData.append('prepTime', prepTime);
    formData.append('basePrice', unitPrice || 0);
    formData.append('discountType', discountType);
    formData.append('discountValue', discountValue || 0);

    // Format attributes for backend: [{ name: 'Weight', values: [...] }, ...]
    const formattedAttributes = Object.keys(attrValues)
      .filter((key) => attrValues[key] && attrValues[key].length > 0)
      .map((key) => ({
        name: key,
        values: attrValues[key]
      }));
    formData.append('attributes', JSON.stringify(formattedAttributes));

    formData.append(
      'relatedItems',
      JSON.stringify({
        linkBy: relatedLinkBy,
        items: relatedItems,
        linkByRef: relatedLinkBy === 'product' ? 'Cake' : 'Category'
      })
    );

    let variationFileIdx = 0;
    const validVariants = variations
      .filter((v) => v.price)
      .map((v) => {
        const variant = {
          name: v.name,
          price: Number(v.price),
          attributeValues: v.attributeValues || []
        };

        if (v.image) {
          if (typeof v.image === 'string') {
            variant.image = v.image; // Keep existing image path
          } else if (v.image instanceof File) {
            variant.image = `VAR_FILE_${variationFileIdx}`;
            formData.append('variationImages', v.image);
            variationFileIdx++;
          }
        }
        return variant;
      });
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
        setTimeout(() => navigate('/cake/packagelist'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving cake');
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTakeawayToggle = (checked) => {
    let location = shipping.takeawayLocation;
    if (checked && !location && currentVendor) {
      const addr = currentVendor.storeAddress || currentVendor.address;
      if (addr) {
        if (typeof addr === 'string') {
          location = addr;
        } else {
          location =
            addr.fullAddress ||
            `${addr.street ? addr.street + ', ' : ''}${addr.city ? addr.city + ', ' : ''}${addr.state || ''}`.trim().replace(/, *$/, '');
        }
      }
    }
    setShipping({ ...shipping, takeaway: checked, takeawayLocation: location });
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

      <Box sx={{ width: '100%', margin: '48px auto', px: { xs: 2, md: 4 } }}>
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
          <StyledSectionTitle>Gallery </StyledSectionTitle>
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
                <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} /> Thumbnail
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

            {/* 🧾 Pricing Details – Attribute Based UI */}
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                border: '1px solid #E5E7EB',
                bgcolor: '#FFFFFF'
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>Variant Details</Typography>

              <Typography sx={{ color: '#6B7280', fontSize: 14, mb: 3 }}>Choose the Attributes & Input Values Of Each Attribute</Typography>

              {/* ATTRIBUTE SELECTOR */}
              <FormControl fullWidth>
                <PremiumSelect
                  multiple
                  value={selectedAttributes}
                  onChange={(e) => {
                    const attrs = e.target.value;
                    setSelectedAttributes(attrs);

                    // Clear values for unselected attributes
                    setAttrValues((prev) => ({
                      Weight: attrs.includes('Weight') ? prev.Weight : [],
                      Ingredient: attrs.includes('Ingredient') ? prev.Ingredient : []
                    }));
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selected.map((attr) => (
                        <Chip key={attr} label={attr} sx={{ fontWeight: 700 }} />
                      ))}
                    </Box>
                  )}
                >
                  {ATTRIBUTES.map((attr) => (
                    <MenuItem key={attr} value={attr}>
                      <Checkbox checked={selectedAttributes.includes(attr)} />
                      <ListItemText primary={attr} />
                    </MenuItem>
                  ))}
                </PremiumSelect>
              </FormControl>

              {/* VALUES OF EACH ATTRIBUTE */}
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>Values of Each Attribute</Typography>

                {selectedAttributes.includes('Weight') && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      border: '1px solid #E5E7EB',
                      borderRadius: 2,
                      mb: 2,
                      overflow: 'hidden'
                    }}
                  >
                    {/* Left label */}
                    <Box
                      sx={{
                        px: 2.5,
                        py: 2,
                        bgcolor: '#E5E7EB',
                        fontWeight: 700,
                        minWidth: 160
                      }}
                    >
                      Select Weight
                    </Box>

                    {/* Right content */}
                    <Box sx={{ p: 2, flex: 1 }}>
                      {/* Weight chips */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {weightOptions.map((w) => {
                          const isSelected = attrValues.Weight.includes(w);
                          const isCustom = !DEFAULT_WEIGHTS.includes(w);

                          return (
                            <Chip
                              key={w}
                              label={w}
                              onClick={() =>
                                handleAttrValueToggle(
                                  'Weight',
                                  isSelected ? attrValues.Weight.filter((x) => x !== w) : [...attrValues.Weight, w]
                                )
                              }
                              onDelete={isCustom ? () => removeWeight(w) : undefined}
                              variant={isSelected ? 'filled' : 'outlined'}
                              sx={{
                                fontWeight: 700,
                                bgcolor: isSelected ? alpha(PINK, 0.15) : undefined,
                                color: isSelected ? PINK : undefined,
                                borderColor: isSelected ? PINK : undefined
                              }}
                            />
                          );
                        })}

                        {/* Add weight trigger */}
                        {!showAddWeight && (
                          <Chip
                            label="+ Add Weight"
                            onClick={() => setShowAddWeight(true)}
                            sx={{
                              fontWeight: 800,
                              color: PINK,
                              border: `2px dashed ${alpha(PINK, 0.4)}`,
                              bgcolor: alpha(PINK, 0.05),
                              cursor: 'pointer'
                            }}
                          />
                        )}
                      </Box>

                      {/* Add weight panel */}
                      {showAddWeight && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            border: `1.5px solid ${alpha(PINK, 0.3)}`,
                            background: `linear-gradient(135deg, ${alpha(PINK, 0.05)}, #fff)`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            maxWidth: 320
                          }}
                        >
                          <TextField
                            size="small"
                            autoFocus
                            placeholder="e.g. 6 Kg"
                            value={customWeight}
                            onChange={(e) => setCustomWeight(e.target.value)}
                            sx={{ flex: 1 }}
                          />

                          <Button
                            variant="contained"
                            sx={{ bgcolor: PINK, fontWeight: 800 }}
                            onClick={() => {
                              const value = customWeight.trim();

                              if (!value || weightOptions.includes(value)) return;

                              setWeightOptions((prev) => [...prev, value]);
                              handleAttrValueToggle('Weight', [...attrValues.Weight, value]);

                              setCustomWeight('');
                              setShowAddWeight(false);
                            }}
                          >
                            Add
                          </Button>

                          <IconButton onClick={() => setShowAddWeight(false)}>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                {selectedAttributes.includes('Ingredient') && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #E5E7EB',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        bgcolor: '#E5E7EB',
                        fontWeight: 600,
                        minWidth: 160
                      }}
                    >
                      Select Ingredient
                    </Box>

                    <Box sx={{ p: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {ATTRIBUTE_VALUES.Ingredient.map((ing) => (
                        <Chip
                          key={ing}
                          label={ing}
                          onClick={() =>
                            handleAttrValueToggle(
                              'Ingredient',
                              attrValues.Ingredient.includes(ing)
                                ? attrValues.Ingredient.filter((x) => x !== ing)
                                : [...attrValues.Ingredient, ing]
                            )
                          }
                          variant={attrValues.Ingredient.includes(ing) ? 'filled' : 'outlined'}
                          sx={{ fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
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
                      onDelete={() => setVariations((prev) => prev.filter((p) => p.id !== v.id))}
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
            <StyledSectionTitle sx={{ fontSize: 28 }}>Curated Boosters & Add-ons</StyledSectionTitle>
            <StyledSectionSubtitle sx={{ maxWidth: 720, mx: 'auto', mt: 1 }}>
              Group related extras to enhance the customer's celebration experience
            </StyledSectionSubtitle>
          </Box>

          {availableAddons.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#F9FAFB', borderRadius: '20px', border: '1px dashed #E5E7EB' }}>
              <Typography variant="h6" sx={{ color: '#6B7280', fontWeight: 700 }}>
                No Add-ons Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 1 }}>
                Create add-ons in the "Add-ons" management section to see them here.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start' }}>
              {availableAddons.map((addon) => {
                const isSelected = selectedAddons.some((s) => s.addonId === addon._id);

                return (
                  <Box
                    key={addon._id}
                    onClick={() => handleAddonToggle(addon._id)}
                    sx={{
                      width: '330px',
                      flexShrink: 0,
                      position: 'relative',
                      borderRadius: '24px',
                      cursor: 'pointer',
                      bgcolor: isSelected ? alpha(PINK, 0.04) : '#ffffff',
                      border: '2px solid',
                      borderColor: isSelected ? PINK : '#F1F5F9',
                      boxShadow: isSelected ? `0 12px 28px ${alpha(PINK, 0.15)}` : '0 8px 24px rgba(17,24,39,0.04)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        borderColor: isSelected ? PINK : alpha(PINK, 0.4),
                        boxShadow: isSelected ? `0 25px 50px ${alpha(PINK, 0.25)}` : '0 20px 45px rgba(17,24,39,0.1)',
                        '& .addon-img': {
                          transform: 'scale(1.1)'
                        }
                      }
                    }}
                  >
                    {/* Selection Indicator Badge */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          width: 32,
                          height: 32,
                          bgcolor: PINK,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          zIndex: 2,
                          boxShadow: `0 8px 16px ${alpha(PINK, 0.4)}`,
                          animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                      >
                        <StarIcon sx={{ fontSize: 18 }} />
                      </Box>
                    )}

                    {/* Image Area */}
                    <Box sx={{ width: '100%', height: 180, bgcolor: '#F9FAFB', overflow: 'hidden', position: 'relative' }}>
                      {addon.image ? (
                        <img
                          src={addon.image}
                          alt={addon.title}
                          className="addon-img"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CBD5E1' }}>
                          <CakeIcon sx={{ fontSize: 48 }} />
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: isSelected ? alpha(PINK, 0.1) : 'transparent',
                          transition: '0.3s'
                        }}
                      />
                    </Box>

                    {/* Content Area */}
                    <Box
                      sx={{
                        p: 2.5,
                        textAlign: 'center',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '15px',
                          color: isSelected ? PINK : '#111827',
                          mb: 1,
                          lineHeight: 1.3,
                          letterSpacing: '-0.01em',
                          minHeight: '40px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {addon.title}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 900,
                            color: isSelected ? PINK : '#6B7280',
                            fontSize: '18px',
                            letterSpacing: '-0.02em',
                            position: 'relative',
                            '&::after': isSelected
                              ? {
                                content: '""',
                                position: 'absolute',
                                bottom: -2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '20px',
                                height: '2px',
                                bgcolor: PINK,
                                borderRadius: '2px'
                              }
                              : {}
                          }}
                        >
                          ₹{addon.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </PremiumCard>

        {/* 🚚 SECTION 5: SHIPPING LOGISTICS */}
        <PremiumCard>
          <StyledSectionTitle>Shipping</StyledSectionTitle>
          <StyledSectionSubtitle>Ensure your cake arrives safely with precise delivery controls.</StyledSectionSubtitle>

          <Grid container spacing={4}>
            {/* Delivery Master Toggle */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: '24px',
                  border: `2px solid ${shipping.free ? PINK : '#F3F4F6'}`,
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
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Box sx={{ bgcolor: alpha(PINK, 0.1), p: 1.5, borderRadius: '14px' }}>
                    <ShippingIcon sx={{ color: PINK }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '15px' }}>Home Delivery</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      {shipping.free
                        ? shipping.flatRate
                          ? 'Paid Delivery Enabled'
                          : 'Complimentary Delivery Enabled'
                        : 'Enable Doorstep Delivery'}
                    </Typography>
                  </Box>
                </Stack>

                <Switch checked={shipping.free} onChange={(e) => setShipping({ ...shipping, free: e.target.checked })} />
              </Box>

              {/* Conditional Delivery Options */}
              {shipping.free && (
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '22px',
                      border: `2px solid ${shipping.flatRate ? PINK : '#F3F4F6'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: shipping.flatRate ? alpha(PINK, 0.02) : '#fff'
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PaymentsIcon sx={{ color: PINK, fontSize: 20 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>Standard Flat Rate</Typography>
                        <Typography variant="caption">Charge customer for delivery</Typography>
                      </Box>
                    </Stack>
                    <Switch
                      size="small"
                      checked={shipping.flatRate}
                      onChange={(e) =>
                        setShipping({ ...shipping, flatRate: e.target.checked, price: e.target.checked ? shipping.price : 0 })
                      }
                    />
                  </Box>

                  {shipping.flatRate && (
                    <PremiumTextField
                      fullWidth
                      label="Flat Rate amount"
                      placeholder="0.00"
                      value={shipping.price}
                      onChange={(e) => setShipping({ ...shipping, price: e.target.value })}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, fontWeight: 700, color: '#9CA3AF' }}>₹</Typography>
                      }}
                    />
                  )}
                </Stack>
              )}
            </Grid>

            {/* Takeaway Master Toggle */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: '24px',
                  border: `2px solid ${shipping.takeaway ? PINK : '#F3F4F6'}`,
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
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Box sx={{ bgcolor: alpha(PINK, 0.1), p: 1.5, borderRadius: '14px' }}>
                    <TakeawayIcon sx={{ color: PINK }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '15px' }}>Takeaway / Pickup</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Allow customer to collect from store
                    </Typography>
                  </Box>
                </Stack>

                <Switch checked={shipping.takeaway} onChange={(e) => handleTakeawayToggle(e.target.checked)} />
              </Box>
            </Grid>

            {/* FULL WIDTH MAP & LOCATION SECTION */}
            {shipping.free && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 3,
                    p: 0,
                    borderRadius: '24px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Controls Section with Padding */}
                  <Box sx={{ p: { xs: 2, md: 4 }, pb: 2 }}>
                    <Stack spacing={3}>
                      {/* Search Location */}
                      <Box>
                        <Typography
                          sx={{
                            mb: 1.5,
                            fontWeight: 800,
                            color: '#374151',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            letterSpacing: '1px'
                          }}
                        >
                          Search Pickup Location
                        </Typography>
                        <PremiumTextField fullWidth inputRef={searchInputRef} placeholder="Search for your store location or landmark..." />
                      </Box>

                      {/* Instruction */}
                      <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon fontSize="small" sx={{ color: PINK }} />
                        Click on the map to pin the exact pickup location for customers
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Google Map - Full Width */}
                  {mapsLoaded ? (
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 500,
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      {/* Google Map */}
                      <Box
                        ref={mapRef}
                        sx={{
                          width: '100%',
                          height: '100%'
                        }}
                      />

                      {/* Radius Slider Overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 20,
                          left: 20,
                          right: 20,
                          zIndex: 10,
                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          p: 2.5,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          maxWidth: '500px',
                          margin: '0 auto'
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, color: '#1F2937', minWidth: '80px' }}>
                          Radius: {radiusKm} km
                        </Typography>

                        <Slider
                          value={radiusKm}
                          min={1}
                          max={100}
                          onChange={(e, val) => setRadiusKm(val)}
                          sx={{
                            color: '#2563EB',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 20,
                              height: 20,
                              backgroundColor: '#fff',
                              border: '2px solid currentColor',
                              '&:hover': {
                                boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)',
                              },
                            },
                            '& .MuiSlider-track': {
                              border: 'none',
                            },
                            '& .MuiSlider-rail': {
                              opacity: 0.3,
                              backgroundColor: '#bfbfbf',
                            },
                          }}
                        />

                        {coveredPincodes.length > 0 && (
                          <Chip
                            label={`${coveredPincodes.length} Pincodes`}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 700, borderRadius: '8px' }}
                          />
                        )}
                      </Box>
                    </Box>
                  ) : (

                    <Box
                      sx={{
                        height: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #E5E7EB',
                        borderRadius: '20px',
                        bgcolor: '#F9FAFB'
                      }}
                    >
                      <CircularProgress sx={{ color: PINK, mb: 2 }} />
                      <Typography sx={{ fontWeight: 700, color: '#6B7280' }}>Initializing Map Engine...</Typography>
                    </Box>
                  )}

                  {/* Coordinates & Address */}
                  <Box sx={{ p: { xs: 2, md: 4 }, pt: 2 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2}>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ mb: 1, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '11px' }}>
                              Latitude
                            </Typography>
                            <PremiumTextField
                              value={pickupLocation.latitude}
                              onChange={(e) => setPickupLocation((p) => ({ ...p, latitude: e.target.value }))}
                              placeholder="0.0000"
                              disabled
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ mb: 1, fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '11px' }}>
                              Longitude
                            </Typography>
                            <PremiumTextField
                              value={pickupLocation.longitude}
                              onChange={(e) => setPickupLocation((p) => ({ ...p, longitude: e.target.value }))}
                              placeholder="0.0000"
                              disabled
                            />
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            mb: 1,
                            fontWeight: 800,
                            color: '#374151',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            letterSpacing: '1px'
                          }}
                        >
                          Final Pickup Address
                        </Typography>
                        <PremiumTextField
                          multiline
                          rows={2}
                          value={shipping.takeawayLocation}
                          onChange={(e) => setShipping({ ...shipping, takeawayLocation: e.target.value })}
                          placeholder="Pin on map or type full address here..."
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </PremiumCard>

        {/* 🏷️ SECTION 6: SEARCH ENGINE OPTIMIZATION */}
        <PremiumCard>
          <StyledSectionTitle>Tags</StyledSectionTitle>
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

            <RadioGroup
              row
              value={relatedLinkBy}
              onChange={(e) => {
                setRelatedLinkBy(e.target.value);
                setRelatedItems([]); // reset selection
                setRelatedOptions([]); // reset data
              }}
            >
              <FormControlLabel
                value="product"
                control={<Radio sx={{ '&.Mui-checked': { color: PINK } }} />}
                label={<Typography sx={{ fontWeight: 700 }}>Product</Typography>}
              />

              <FormControlLabel
                value="category"
                control={<Radio sx={{ '&.Mui-checked': { color: PINK } }} />}
                label={<Typography sx={{ fontWeight: 700 }}>Category</Typography>}
              />
            </RadioGroup>
          </Box>

          <Box
            onClick={() => {
              fetchRelatedOptions(); // ✅ FETCH DATA
              setOpenRelatedModal(true);
            }}
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

          {relatedItems.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}
              >
                Selected Items ({relatedItems.length})
              </Typography>
              <Grid container spacing={2}>
                {relatedItems.map((id) => {
                  const item =
                    selectedRelatedObjects.find((x) => x._id === id) ||
                    relatedOptions.find((x) => x._id === id) ||
                    categories.find((x) => x._id === id);

                  if (!item) return null;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: '16px',
                          bgcolor: '#F9FAFB',
                          border: '1px solid #E5E7EB',
                          position: 'relative',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: PINK,
                            bgcolor: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '10px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            bgcolor: '#fff',
                            border: '1px solid #eee'
                          }}
                        >
                          <img
                            src={
                              item.thumbnail ||
                              (item.image ? (item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`) : '/placeholder.png')
                            }
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
                          <Typography
                            noWrap
                            sx={{
                              fontWeight: 800,
                              fontSize: '13px',
                              color: '#111827'
                            }}
                          >
                            {item.name || item.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            {item.price ? `₹${item.price}` : item.module?.title || 'Related'}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setRelatedItems((prev) => prev.filter((x) => x !== id));
                            setSelectedRelatedObjects((prev) => prev.filter((x) => x._id !== id));
                          }}
                          sx={{
                            ml: 1,
                            color: '#9CA3AF',
                            '&:hover': { color: '#EF4444', bgcolor: alpha('#EF4444', 0.1) }
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

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
      {/* 🔽 ADD RELATED ITEM MODAL HERE */}
      <Dialog open={openRelatedModal} onClose={() => setOpenRelatedModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {drilldownCategory && (
              <IconButton size="small" onClick={handleBackToCategories} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {drilldownCategory
                ? `Packages in ${drilldownCategory.title}`
                : `Select ${relatedLinkBy === 'product' ? 'Products' : 'Categories'}`}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenRelatedModal(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loadingRelated ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="inherit" sx={{ color: PINK }} />
            </Box>
          ) : (
            <>
              {drilldownCategory && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: alpha(PINK, 0.03),
                    border: `1px dashed ${PINK}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: '#111827' }}>Link Entire Category</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Add "{drilldownCategory.title}" to related items
                    </Typography>
                  </Box>
                  <Checkbox
                    checked={relatedItems.includes(drilldownCategory._id)}
                    onChange={() =>
                      setRelatedItems((prev) =>
                        prev.includes(drilldownCategory._id)
                          ? prev.filter((x) => x !== drilldownCategory._id)
                          : [...prev, drilldownCategory._id]
                      )
                    }
                    sx={{ color: PINK, '&.Mui-checked': { color: PINK } }}
                  />
                </Box>
              )}

              {relatedOptions.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: '#6B7280', fontWeight: 600 }}>
                    {drilldownCategory ? 'No packages found in this category' : `No ${relatedLinkBy}s found`}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {relatedOptions.map((item) => {
                    const id = item._id;
                    const isItemCategory = relatedLinkBy === 'category' && !drilldownCategory;
                    const selected = relatedItems.includes(id);

                    return (
                      <Grid item xs={12} key={id}>
                        <Box
                          onClick={() => {
                            if (isItemCategory) {
                              handleCategoryClick(item);
                            } else {
                              // If in product mode OR selecting a specific product from category
                              const isSelected = relatedItems.includes(id);
                              if (isSelected) {
                                setRelatedItems((prev) => prev.filter((x) => x !== id));
                                setSelectedRelatedObjects((prev) => prev.filter((x) => x._id !== id));
                              } else {
                                setRelatedItems((prev) => [...prev, id]);
                                setSelectedRelatedObjects((prev) => [...prev, item]);
                              }
                            }
                          }}
                          sx={{
                            display: 'flex',
                            gap: 2,
                            p: 2,
                            borderRadius: '14px',
                            cursor: 'pointer',
                            border: selected ? `2px solid ${PINK}` : '1px solid #E5E7EB',
                            bgcolor: selected ? alpha(PINK, 0.06) : '#FFFFFF',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              borderColor: PINK,
                              boxShadow: `0 4px 12px ${alpha(PINK, 0.1)}`
                            }
                          }}
                        >
                          {/* IMAGE */}
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: '10px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              bgcolor: '#F3F4F6'
                            }}
                          >
                            <img
                              src={
                                isItemCategory
                                  ? item.image
                                    ? `${API_BASE}${item.image}`
                                    : '/placeholder.png'
                                  : item.thumbnail || '/placeholder.png'
                              }
                              alt={item.title || item.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </Box>

                          {/* DETAILS */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              noWrap
                              sx={{
                                fontWeight: 800,
                                fontSize: '14px',
                                color: '#111827',
                                mb: 0.5
                              }}
                            >
                              {item.title || item.name}
                            </Typography>

                            <Typography
                              noWrap
                              sx={{
                                fontSize: '12px',
                                color: '#6B7280'
                              }}
                            >
                              {isItemCategory ? item.module?.title || 'Category' : item.category?.title || 'Package'}
                            </Typography>
                          </Box>

                          {/* ACTION AREA */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.price && <Typography sx={{ fontWeight: 900, color: PINK, mr: 1 }}>₹{item.price}</Typography>}
                            {isItemCategory ? (
                              <ArrowBackIcon sx={{ transform: 'rotate(180deg)', color: '#CBD5E1', fontSize: 20 }} />
                            ) : (
                              <Box
                                sx={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '6px',
                                  border: `2px solid ${selected ? PINK : '#D1D5DB'}`,
                                  bgcolor: selected ? PINK : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontSize: 14
                                }}
                              >
                                {selected && '✓'}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: '#F9FAFB' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpenRelatedModal(false)}
            sx={{
              bgcolor: PINK,
              color: '#fff',
              borderRadius: '14px',
              py: 1.5,
              fontWeight: 900,
              textTransform: 'none',
              boxShadow: `0 8px 20px ${alpha(PINK, 0.3)}`,
              '&:hover': { bgcolor: '#D81B60', boxShadow: `0 10px 25px ${alpha(PINK, 0.4)}` }
            }}
          >
            Confirm Selection ({relatedItems.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default AddCakePackage;
