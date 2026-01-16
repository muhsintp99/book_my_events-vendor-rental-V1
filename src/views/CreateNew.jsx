// export default Createnew;
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Grid,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, ArrowBack as ArrowBackIcon, DirectionsCar as DirectionsCarIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Switch } from '@mui/material';

// Styled component for the upload area
const UploadDropArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '150px',
  '&:hover': {
    borderColor: theme.palette.primary.main
  },
  '& input[type="file"]': {
    display: 'none'
  }
}));

const Createnew = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [transmissionType, setTransmissionType] = useState('');
  const [enginePower, setEnginePower] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [torque, setTorque] = useState('');
  const [mileage, setMileage] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [interiorLighting, setInteriorLighting] = useState('normal');
  const [fuelType, setFuelType] = useState('');
  const [pushbackSeats, setPushbackSeats] = useState('no');
  const [reclinerSeats, setReclinerSeats] = useState('no');

  const [airConditionZone, setAirConditionZone] = useState('');

  // Package Pricing Fields
  const [basicPackagePrice, setBasicPackagePrice] = useState('');
  const [hoursIncluded, setHoursIncluded] = useState('');
  const [kmIncluded, setKmIncluded] = useState('');
  const [additionalPricePerKm, setAdditionalPricePerKm] = useState('');
  const [afterKilometer, setAfterKilometer] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [advanceType, setAdvanceType] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');

  // Feature states
  const [carFeatures, setCarFeatures] = useState({
    leatherSeats: false,
    adjustableSeats: false,
    armrest: false,
    musicSystem: false,
    bluetooth: false,
    usbAux: false,
    airbags: false,
    abs: false,
    rearCamera: false,
    parkingSensors: false,
    powerWindows: false,
    centralLock: false,
    keylessEntry: false,
    wifi: false,
    chargingPoints: false
  });

  const [busFeatures, setBusFeatures] = useState({
    curtains: false,
    readingLights: false,
    musicSystem: false,
    microphone: false,
    fireExtinguisher: false,
    firstAidKit: false,
    luggageCarrier: false,
    wifi: false,
    chargingPoints: false
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae/api';
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78';
  const moduleId = localStorage.getItem('moduleId');

  // Memoized values
  const locationState = useMemo(() => location.state?.vehicle, [location.state]);
  const vehicleKeyFromState = useMemo(() => location.state?.vehicle?._id, [location.state]);
  const effectiveVehicleId = useMemo(() => {
    return id || location.state?.vehicle?._id || '';
  }, [id, vehicleKeyFromState]);

  const initialViewMode = useMemo(() => {
    return effectiveVehicleId ? 'edit' : 'create';
  }, [effectiveVehicleId]);

  const [viewMode, setViewMode] = useState(initialViewMode);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [newVehicleImages, setNewVehicleImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [zone, setZone] = useState('');
  const [selectedZoneName, setSelectedZoneName] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [airCondition, setAirCondition] = useState('yes');
  const [licensePlateNumber, setLicensePlateNumber] = useState('');
  const [licensePlateError, setLicensePlateError] = useState('');
  const [tripType, setTripType] = useState('hourly');
  const [hourlyWisePrice, setHourlyWisePrice] = useState('');
  const [perDayPrice, setPerDayPrice] = useState('');
  const [distanceWisePrice, setDistanceWisePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [features, setFeatures] = useState({
    driverIncluded: false,
    sunroof: false,
    decorationAvailable: false
  });
  const [decorationPrice, setDecorationPrice] = useState('');

  const [termsSections, setTermsSections] = useState([
    {
      heading: '',
      points: ['']
    }
  ]);
  const [searchTags, setSearchTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vehicleAttributes, setVehicleAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [seatType, setSeatType] = useState('');
  const [audioSystem, setAudioSystem] = useState('');
  const [airbags, setAirbags] = useState('');
  const [bootSpace, setBootSpace] = useState('');
  const [fuelTank, setFuelTank] = useState('');
  const [advanceBookingAmount, setAdvanceBookingAmount] = useState('');
  const [attributeMap, setAttributeMap] = useState({});
  const [vehicleDocuments, setVehicleDocuments] = useState([]);

  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');

  const [subCategory, setSubCategory] = useState('');
  const isCategorySelected = Boolean(parentCategory);

  const [zones, setZones] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [venueAddress, setVenueAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);

  // Check if selected category is Bus or Car
  const isBusCategory = useMemo(() => {
    if (!parentCategory || !parentCategories.length) return false;
    const selectedParentCat = parentCategories.find((cat) => cat._id === parentCategory);
    console.log('Category check (Bus):', selectedParentCat?.title);
    return selectedParentCat?.title?.toLowerCase().includes('bus');
  }, [parentCategory, parentCategories]);

  const isCarCategory = useMemo(() => {
    if (!parentCategory || !parentCategories.length) return false;
    const selectedParentCat = parentCategories.find((cat) => cat._id === parentCategory);
    console.log('Category check (Car):', selectedParentCat?.title);
    return selectedParentCat?.title?.toLowerCase().includes('car') || selectedParentCat?.title?.toLowerCase().includes('vehicle');
  }, [parentCategory, parentCategories]);
  const handleVehicleDocumentsChange = (event) => {
    const files = Array.from(event.target.files);
    setVehicleDocuments((prev) => [...prev, ...files]);
  };

  const handleDropVehicleDocuments = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setVehicleDocuments((prev) => [...prev, ...files]);
  };

  // Load Google Maps script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not provided');
      setToastMessage('Google Maps API key is required for map features.');
      setToastSeverity('warning');
      setOpenToast(true);
      return;
    }

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapsLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [GOOGLE_MAPS_API_KEY]);

  // Initialize map when mapsLoaded becomes true
  useEffect(() => {
    if (mapsLoaded && window.google && window.google.maps) {
      initMap();
    }
  }, [mapsLoaded]);

  const initMap = useCallback(() => {
    if (!window.google || !mapRef.current || !mapsLoaded) return;

    const centerLat = latitude && longitude ? parseFloat(latitude) : 20.5937;
    const centerLng = latitude && longitude ? parseFloat(longitude) : 78.9629;
    const center = { lat: centerLat, lng: centerLng };

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center
    });

    // Add click listener
    newMap.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLatitude(lat.toString());
      setLongitude(lng.toString());

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: newMap
      });

      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setVenueAddress(results[0].formatted_address);
          setToastMessage('Location set and address auto-filled!');
          setToastSeverity('success');
          setOpenToast(true);
        } else {
          setToastMessage('Location set, but could not determine address.');
          setToastSeverity('info');
          setOpenToast(true);
        }
      });
    });

    setMap(newMap);
  }, [mapsLoaded, latitude, longitude]);

  // Initialize Places Autocomplete
  useEffect(() => {
    if (!mapsLoaded || !map || !searchInputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ['place_id', 'geometry', 'name', 'formatted_address']
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const loc = place.geometry.location;

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(loc);
        map.setZoom(17);
      }

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      markerRef.current = new window.google.maps.Marker({
        position: loc,
        map
      });

      setLatitude(loc.lat().toString());
      setLongitude(loc.lng().toString());
      setVenueAddress(place.formatted_address || place.name);
      setToastMessage('Location selected!');
      setToastSeverity('success');
      setOpenToast(true);
    });

    return () => {
      if (window.google && window.google.maps.event) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [mapsLoaded, map]);

  // Update map center and marker when lat/long change
  useEffect(() => {
    if (!map || !latitude || !longitude) return;

    const pos = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

    map.setCenter(pos);
    map.setZoom(12);

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        position: pos,
        map
      });
    } else {
      markerRef.current.setPosition(pos);
    }
  }, [latitude, longitude, map]);

  // Geocode zone when selected
  useEffect(() => {
    if (!selectedZoneName) return;
    if (!mapsLoaded || !window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: selectedZoneName }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        const newLat = loc.lat().toString();
        const newLng = loc.lng().toString();
        setLatitude(newLat);
        setLongitude(newLng);
        setVenueAddress(results[0].formatted_address);

        // Update map center and marker
        if (map) {
          map.setCenter({ lat: loc.lat(), lng: loc.lng() });
          map.setZoom(12);

          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          markerRef.current = new window.google.maps.Marker({
            position: { lat: loc.lat(), lng: loc.lng() },
            map: map
          });
        }

        setToastMessage(`Location set for ${selectedZoneName}!`);
        setToastSeverity('success');
        setOpenToast(true);
      } else {
        setToastMessage(`Could not find location for ${selectedZoneName}`);
        setToastSeverity('warning');
        setOpenToast(true);
      }
    });
  }, [selectedZoneName, mapsLoaded, map]);

  // Set vehicle data from API response or location state
  const setVehicleData = useCallback(
    (vehicle) => {
      console.log('Setting vehicle data:', vehicle);

      if (vehicle.brand && vehicle.brand._id && !brands.some((b) => b._id === vehicle.brand._id)) {
        setBrands((prev) => [
          ...prev,
          {
            _id: vehicle.brand._id,
            title: vehicle.brand.title || vehicle.brand.name || 'Unknown Brand'
          }
        ]);
      }

      // Advance booking prefill
      setAdvanceBookingAmount(vehicle.advanceBookingAmount?.toString() || '');

      if (vehicle.category?.parentCategory?._id) {
        const parentId = vehicle.category.parentCategory._id;

        setParentCategory(parentId);
        setSubCategory(vehicle.category._id);

        axios
          .get(`${API_BASE_URL}/categories/parents/${parentId}/subcategories`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then((res) => setSubCategories(res.data.data || []))
          .catch(() => setSubCategories([]));
      }

      // ================= TERMS & CONDITIONS =================
      if (vehicle.termsAndConditions && Array.isArray(vehicle.termsAndConditions) && vehicle.termsAndConditions.length > 0) {
        setTermsSections(
          vehicle.termsAndConditions.map((section) => ({
            heading: section.heading || '',
            points: Array.isArray(section.points) && section.points.length > 0 ? section.points : ['']
          }))
        );
      } else {
        // fallback (create mode or old vehicles)
        setTermsSections([{ heading: '', points: [''] }]);
      }

      // Handle category - it comes as an array from API
      let categoryId = '';
      if (Array.isArray(vehicle.category) && vehicle.category.length > 0) {
        categoryId = vehicle.category[0]._id;
        if (!categories.some((c) => c._id === categoryId)) {
          setCategories((prev) => [
            ...prev,
            {
              _id: categoryId,
              title: vehicle.category[0].title || 'Unknown Category'
            }
          ]);
        }
      } else if (vehicle.category && typeof vehicle.category === 'object' && vehicle.category._id) {
        categoryId = vehicle.category._id;
        if (!categories.some((c) => c._id === categoryId)) {
          setCategories((prev) => [
            ...prev,
            {
              _id: categoryId,
              title: vehicle.category.title || 'Unknown Category'
            }
          ]);
        }
      } else if (typeof vehicle.category === 'string') {
        categoryId = vehicle.category;
      }

      if (vehicle.zone && vehicle.zone._id && !zones.some((z) => z._id === vehicle.zone._id)) {
        setZones((prev) => [
          ...prev,
          {
            _id: vehicle.zone._id,
            name: vehicle.zone.name || 'Unknown Zone'
          }
        ]);
      }
      setName(vehicle.name || '');
      setDescription(vehicle.description || '');
      setBrand(vehicle.brand?._id || '');
      setCategory(categoryId);
      console.log('Category ID being set:', categoryId);

      const zoneId = vehicle.zone?._id || '';
      setZone(zoneId);
      const zoneObj = zones.find((z) => z._id === zoneId) || (vehicle.zone && { name: vehicle.zone.name });
      setSelectedZoneName(zoneObj ? zoneObj.name : '');
      setModel(vehicle.model || '');
      setSeatingCapacity(vehicle.seatingCapacity?.toString() || '');
      setAirCondition(vehicle.airCondition ? 'yes' : 'no');
      setLicensePlateNumber(vehicle.licensePlateNumber || '');
      setSearchTags(vehicle.searchTags || []);
      setVenueAddress(vehicle.venueAddress || '');
      setLatitude(vehicle.latitude?.toString() || '');
      setLongitude(vehicle.longitude?.toString() || '');

      setOperatingHours(vehicle.operatingHours || '');
      console.log('Operating hours being set:', vehicle.operatingHours);

      if (vehicle.pricing) {
        setTripType(vehicle.pricing.type || 'hourly');
        setHourlyWisePrice(vehicle.pricing.hourly?.toString() || '');
        setPerDayPrice(vehicle.pricing.perDay?.toString() || '');
        setDistanceWisePrice(vehicle.pricing.distanceWise?.toString() || '');
      }
      setDiscount(vehicle.discount?.toString() || '');
      // ---------------- Additional Vehicle Details ----------------
      setFeatures({
        driverIncluded: vehicle.features?.driverIncluded ?? false,
        sunroof: vehicle.features?.sunroof ?? false,
        decorationAvailable: vehicle.features?.decorationAvailable ?? false
      });
      // ✅ Populate decoration price when editing
      setDecorationPrice(vehicle.features?.decorationPrice?.toString() || '');
    },
    [brands, categories, zones]
  );

  useEffect(() => {
    return () => {
      newVehicleImages.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [newVehicleImages]);

  // Fetch brands, categories, and zones
  useEffect(() => {
    const fetchBrandsCategoriesAndZones = async () => {
      try {
        if (!moduleId) {
          throw new Error('Module ID is not defined. Please log in or set moduleId in localStorage.');
        }

        const token = localStorage.getItem('token');

        const [brandsResponse, parentCategoriesResponse, zonesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/brands/module/${moduleId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),

          // ✅ FIXED
          axios.get(`${API_BASE_URL}/categories/parents/${moduleId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),

          axios.get(`${API_BASE_URL}/zones`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          })
        ]);

        setParentCategories(parentCategoriesResponse.data?.data || []);

        /* ---------------- BRANDS ---------------- */
        const brandsData = Array.isArray(brandsResponse.data) ? brandsResponse.data : brandsResponse.data.data || [];

        setBrands(brandsData);

        /* ---------------- PARENT CATEGORIES ---------------- */
        const parentCats = parentCategoriesResponse.data?.data || [];
        setParentCategories(parentCats);

        /* ---------------- ZONES ---------------- */
        const rawZones = zonesResponse.data.data || zonesResponse.data || [];
        const zonesData = Array.isArray(rawZones)
          ? rawZones
              .filter((zone) => zone.isActive)
              .map((zone) => ({
                _id: zone._id,
                name: zone.name
              }))
          : [];

        setZones(zonesData);

        /* ---------------- DEBUG LOGS ---------------- */
        console.log('Module ID:', moduleId);
        console.log('Brands:', brandsData);
        console.log('Parent Categories:', parentCats);
        console.log('Zones:', zonesData);

        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching brands/categories/zones:', error.response?.data || error);

        setBrands([]);
        setParentCategories([]);
        setZones([]);
        setIsDataLoaded(true);

        setToastMessage(error.response?.data?.message || 'Failed to fetch brands, categories, or zones');
        setToastSeverity('error');
        setOpenToast(true);
      }
    };

    fetchBrandsCategoriesAndZones();
  }, [moduleId, API_BASE_URL]);

  // Auto-select first parent category when categories are loaded (CREATE MODE ONLY)
  useEffect(() => {
    if (parentCategories.length > 0 && !parentCategory && viewMode === 'create') {
      const firstCategory = parentCategories[0];
      setParentCategory(firstCategory._id);

      // Auto-load subcategories for first category
      axios
        .get(`${API_BASE_URL}/categories/parents/${firstCategory._id}/subcategories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((res) => {
          const subs = res.data.data || [];
          setSubCategories(subs);

          // Auto-select first subcategory if available
          if (subs.length > 0) {
            setSubCategory(subs[0]._id);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch subcategories:', error);
          setSubCategories([]);
        });
    }
  }, [parentCategories, parentCategory, viewMode, API_BASE_URL]);

  // Fetch Vehicle Attributes
  useEffect(() => {
    const fetchVehicleAttributes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/vehicle-attributes`);

        const attrs = res.data?.data || [];

        // Only active attributes
        const activeAttrs = attrs.filter((attr) => attr.status);

        // Map attributes by title
        const map = {};
        activeAttrs.forEach((attr) => {
          map[attr.title.toLowerCase()] = attr.values || [];
        });

        setVehicleAttributes(activeAttrs);
        setAttributeMap(map);

        console.log('✅ Vehicle Attributes Loaded:', activeAttrs);
      } catch (error) {
        console.error('❌ Failed to load vehicle attributes', error);
      }
    };

    fetchVehicleAttributes();
  }, [API_BASE_URL]);

  // Fetch or use location state for vehicle data in edit mode
  useEffect(() => {
    if (!isDataLoaded) return;
    const vehicleData = location.state?.vehicle;
    if (vehicleData) {
      setVehicleData(vehicleData);
      setExistingThumbnail(vehicleData.thumbnail || '');
      setExistingImages(vehicleData.images || []);
      setViewMode('edit');
    } else if (id) {
      const fetchVehicle = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const vehicle = response.data.data || response.data;
          console.log('Vehicle data fetched for edit:', vehicle);
          setVehicleData(vehicle);
          setExistingThumbnail(vehicle.thumbnail || '');
          setExistingImages(vehicle.images || []);
          setViewMode('edit');
        } catch (error) {
          setToastMessage(error.response?.data?.message || 'Failed to fetch vehicle data');
          setToastSeverity('error');
          setOpenToast(true);
          console.error('Error fetching vehicle:', error.response?.data || error);
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [isDataLoaded, id, setVehicleData]);

  const handleParentCategoryChange = async (e) => {
    const parentId = e.target.value;
    setParentCategory(parentId);
    setSubCategory('');
    setSubCategories([]);

    if (!parentId) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/categories/parents/${parentId}/subcategories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSubCategories(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sub categories', error);
      setSubCategories([]);
    }
  };

  // File handling
  const handleThumbnailFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) setThumbnailFile(file);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDropThumbnail = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setThumbnailFile(file);
  }, []);

  const handleVehicleImagesChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    setNewVehicleImages((prev) => [...prev, ...files]);
  }, []);

  const handleDropImages = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setNewVehicleImages((prev) => [...prev, ...files]);
  }, []);

  // Tag handling
  const handleTagInputChange = useCallback((event) => {
    setCurrentTag(event.target.value);
  }, []);

  // ---------------- Handle Attribute Selection ----------------
  const handleAttributeChange = (attributeId, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: value
    }));
  };

  const handleTagKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter' && currentTag.trim()) {
        setSearchTags((prev) => [...prev, currentTag.trim()]);
        setCurrentTag('');
        event.preventDefault();
      }
    },
    [currentTag]
  );

  const handleRemoveTag = useCallback((tagToRemove) => {
    setSearchTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  // License plate validation
  const validateLicensePlate = useCallback((value) => {
    const regex = /^[A-Z0-9]{6,8}$/;
    if (!regex.test(value)) {
      setLicensePlateError('License plate must be 6-8 alphanumeric characters');
      return false;
    }
    setLicensePlateError('');
    return true;
  }, []);

  // Reset form
  const handleReset = useCallback(() => {
    // -------- BASIC INFO --------
    setName('');
    setDescription('');
    setVenueAddress('');
    setBrand('');
    setModel('');
    setCategory('');
    setZone('');
    setSelectedZoneName('');
    setParentCategory('');
    setSubCategory('');

    // -------- MEDIA --------
    setThumbnailFile(null);
    setNewVehicleImages([]);
    setExistingThumbnail('');
    setExistingImages([]);

    // -------- VEHICLE INFO --------
    setSeatingCapacity('');
    setAirCondition('yes');
    setLicensePlateNumber('');
    setLicensePlateError('');
    setTransmissionType('');
    setEnginePower('');
    setEngineCapacity('');
    setTorque('');
    setMileage('');
    setVehicleType('');
    setFuelType('');
    setPushbackSeats('no');
    setAirConditionZone('');

    // -------- FEATURES (NEW) --------
    setFeatures({
      driverIncluded: false,
      sunroof: false,
      decorationAvailable: false
    });

    // Reset car features
    setCarFeatures({
      leatherSeats: false,
      adjustableSeats: false,
      armrest: false,
      musicSystem: false,
      bluetooth: false,
      usbAux: false,
      airbags: false,
      abs: false,
      rearCamera: false,
      parkingSensors: false,
      powerWindows: false,
      centralLock: false,
      keylessEntry: false,
      wifi: false,
      chargingPoints: false
    });

    // Reset bus features
    setBusFeatures({
      curtains: false,
      readingLights: false,
      musicSystem: false,
      microphone: false,
      fireExtinguisher: false,
      firstAidKit: false,
      luggageCarrier: false,
      wifi: false,
      chargingPoints: false
    });

    // -------- PACKAGE PRICING --------
    setBasicPackagePrice('');
    setHoursIncluded('');
    setKmIncluded('');
    setAdditionalPricePerKm('');
    setAfterKilometer('');
    setDiscountType('');
    setAdvanceType('');
    setAdvanceAmount('');
    setInteriorLighting('normal');

    // -------- PRICING --------
    setTripType('hourly');
    setHourlyWisePrice('');
    setPerDayPrice('');
    setDistanceWisePrice('');
    setDiscount('');
    setDecorationPrice('');

    // -------- TAGS --------
    setSearchTags([]);
    setCurrentTag('');

    // -------- LOCATION --------
    setLatitude('');
    setLongitude('');
    setOperatingHours('');

    // -------- VIEW MODE --------
    setViewMode('create');

    // -------- MAP CLEANUP --------
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    if (map) {
      setMap(null);
    }
  }, [map]);

  // Form submission
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const isEdit = viewMode === 'edit';
      setLoading(true);

      // Validate required fields
      if (
        !name ||
        !brand ||
        !model ||
        !parentCategory ||
        !subCategory ||
        !zone ||
        !seatingCapacity ||
        !licensePlateNumber ||
        !tripType ||
        !venueAddress ||
        !latitude ||
        !longitude
      ) {
        setToastMessage('Please fill all required fields.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      // ✅ Validate decoration price when decoration is available
      if (features.decorationAvailable && (!decorationPrice || parseFloat(decorationPrice) <= 0)) {
        setToastMessage('Please provide a valid decoration price when decoration is available.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      if (
        (tripType === 'hourly' && !hourlyWisePrice) ||
        (tripType === 'perDay' && !perDayPrice) ||
        (tripType === 'distanceWise' && !distanceWisePrice)
      ) {
        setToastMessage(`Please provide a price for ${tripType} trip type.`);
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      if (!thumbnailFile && !existingThumbnail && !isEdit) {
        setToastMessage('Please upload a thumbnail image.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      if (newVehicleImages.length === 0 && existingImages.length === 0 && !isEdit) {
        setToastMessage('Please upload at least one vehicle image.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      if (!validateLicensePlate(licensePlateNumber)) {
        setToastMessage('Invalid license plate number.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }
      if (!termsSections.length || !termsSections[0].heading) {
        setToastMessage('Please add at least one Terms & Conditions section.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      // Validate token
      const token = localStorage.getItem('token');
      if (!token) {
        setToastMessage('No authentication token found. Please log in.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append('transmissionType', transmissionType);
      formData.append('enginePower', enginePower ? parseInt(enginePower) : '');
      formData.append('name', name);
      formData.append('description', description);
      formData.append('brand', brand);
      formData.append('category', parentCategory);
      formData.append('subCategories[]', subCategory);
      formData.append('zone', zone);
      formData.append('model', model);
      formData.append('seatingCapacity', parseInt(seatingCapacity));
      formData.append('airCondition', airCondition === 'yes');

      // ✅ FIXED: Send features as individual fields, not nested JSON
      formData.append('features[driverIncluded]', features.driverIncluded);
      formData.append('features[sunroof]', features.sunroof);
      formData.append('features[decorationAvailable]', features.decorationAvailable);
      if (features.decorationAvailable && decorationPrice) {
        formData.append('decorationPrice', parseFloat(decorationPrice));
      }

      // Add category-specific fields
      if (isCarCategory) {
        formData.append('vehicleType', vehicleType);
        formData.append('engineCapacity', engineCapacity);
        formData.append('torque', torque);
        formData.append('mileage', mileage);
        formData.append('fuelType', fuelType);
        formData.append('interiorLighting', interiorLighting);

        // Add car features
        formData.append('carFeatures[leatherSeats]', carFeatures.leatherSeats);
        formData.append('carFeatures[adjustableSeats]', carFeatures.adjustableSeats);
        formData.append('carFeatures[armrest]', carFeatures.armrest);
        formData.append('carFeatures[musicSystem]', carFeatures.musicSystem);
        formData.append('carFeatures[bluetooth]', carFeatures.bluetooth);
        formData.append('carFeatures[usbAux]', carFeatures.usbAux);
        formData.append('carFeatures[airbags]', carFeatures.airbags);
        formData.append('carFeatures[abs]', carFeatures.abs);
        formData.append('carFeatures[rearCamera]', carFeatures.rearCamera);
        formData.append('carFeatures[parkingSensors]', carFeatures.parkingSensors);
        formData.append('carFeatures[powerWindows]', carFeatures.powerWindows);
        formData.append('carFeatures[centralLock]', carFeatures.centralLock);
        formData.append('carFeatures[keylessEntry]', carFeatures.keylessEntry);
        formData.append('carFeatures[wifi]', carFeatures.wifi);
        formData.append('carFeatures[chargingPoints]', carFeatures.chargingPoints);

        // Package pricing for car
        formData.append('basicPackagePrice', basicPackagePrice);
        formData.append('hoursIncluded', hoursIncluded);
        formData.append('kmIncluded', kmIncluded);
        formData.append('additionalPricePerKm', additionalPricePerKm);
        formData.append('afterKilometer', afterKilometer);
        formData.append('discountType', discountType);
        formData.append('advanceType', advanceType);
        formData.append('advanceAmount', advanceAmount);
      }

      if (isBusCategory) {
        formData.append('pushbackSeats', pushbackSeats);
        formData.append('airConditionZone', airConditionZone);
        formData.append('fuelType', fuelType);

        // Add bus features
        formData.append('busFeatures[curtains]', busFeatures.curtains);
        formData.append('busFeatures[readingLights]', busFeatures.readingLights);
        formData.append('busFeatures[musicSystem]', busFeatures.musicSystem);
        formData.append('busFeatures[microphone]', busFeatures.microphone);
        formData.append('busFeatures[fireExtinguisher]', busFeatures.fireExtinguisher);
        formData.append('busFeatures[firstAidKit]', busFeatures.firstAidKit);
        formData.append('busFeatures[luggageCarrier]', busFeatures.luggageCarrier);
        formData.append('busFeatures[wifi]', busFeatures.wifi);
        formData.append('busFeatures[chargingPoints]', busFeatures.chargingPoints);
      }

      // Attach dynamic vehicle attributes
      formData.append('attributes', JSON.stringify(selectedAttributes));

      formData.append('licensePlateNumber', licensePlateNumber);
      formData.append('termsAndConditions', JSON.stringify(termsSections));

      formData.append('venueAddress', venueAddress);
      formData.append('latitude', parseFloat(latitude));
      formData.append('longitude', parseFloat(longitude));
      if (operatingHours) formData.append('operatingHours', operatingHours);

      formData.append('pricing[type]', tripType);
      formData.append('pricing[hourly]', tripType === 'hourly' ? parseFloat(hourlyWisePrice) || 0 : 0);
      formData.append('pricing[perDay]', tripType === 'perDay' ? parseFloat(perDayPrice) || 0 : 0);
      formData.append('pricing[distanceWise]', tripType === 'distanceWise' ? parseFloat(distanceWisePrice) || 0 : 0);

      if (discount) formData.append('discount', parseFloat(discount));
      if (advanceBookingAmount) formData.append('advanceBookingAmount', parseFloat(advanceBookingAmount));

      searchTags.forEach((tag) => formData.append('searchTags[]', tag));
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      newVehicleImages.forEach((file) => formData.append('images', file));

      // Log FormData for debugging
      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        formDataEntries[key] = value instanceof File ? value.name : value;
      }
      console.log('FormData:', formDataEntries);

      try {
        let response;
        let newOrUpdatedVehicle;
        if (isEdit) {
          if (!effectiveVehicleId) {
            throw new Error('Invalid vehicle ID for update');
          }
          response = await axios.put(`${API_BASE_URL}/vehicles/${effectiveVehicleId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          newOrUpdatedVehicle = response.data.data || response.data;
        } else {
          response = await axios.post(`${API_BASE_URL}/vehicles`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          newOrUpdatedVehicle = response.data.data || response.data;
        }
        console.log('API Response:', response.data);
        setToastMessage(isEdit ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
        setToastSeverity('success');
        setOpenToast(true);
        handleReset();
        if (isEdit) {
          navigate('/vehicle-setup/lists', { state: { vehicle: newOrUpdatedVehicle } });
        }
      } catch (error) {
        console.error('API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message
        });
        let errorMsg = error.response?.data?.message || 'Failed to save vehicle';
        if (error.response?.data?.errors) {
          errorMsg = error.response.data.errors.map((err) => err.msg).join(', ');
        }
        setToastMessage(errorMsg);
        setToastSeverity('error');
        setOpenToast(true);
      } finally {
        setLoading(false);
      }
    },
    [
      viewMode,
      effectiveVehicleId,
      name,
      brand,
      model,
      category,
      zone,
      seatingCapacity,
      airCondition,
      features,
      decorationPrice,
      licensePlateNumber,
      tripType,
      hourlyWisePrice,
      perDayPrice,
      distanceWisePrice,
      discount,
      searchTags,
      thumbnailFile,
      newVehicleImages,
      existingThumbnail,
      existingImages,
      validateLicensePlate,
      handleReset,
      navigate,
      API_BASE_URL,
      moduleId,
      isDataLoaded,
      vehicleKeyFromState,
      setVehicleData,
      venueAddress,
      latitude,
      longitude,
      operatingHours,
      parentCategory,
      subCategory,
      selectedAttributes,
      advanceBookingAmount,
      termsSections,
      isCarCategory,
      isBusCategory,
      transmissionType,
      enginePower,
      engineCapacity,
      torque,
      mileage,
      vehicleType,
      interiorLighting,
      fuelType,
      pushbackSeats,
      airConditionZone,
      carFeatures,
      busFeatures,
      basicPackagePrice,
      hoursIncluded,
      kmIncluded,
      additionalPricePerKm,
      afterKilometer,
      discountType,
      advanceType,
      advanceAmount
    ]
  );

  const handleCloseToast = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
  }, []);

  const isEdit = viewMode === 'edit';

  const handleZoneChange = useCallback(
    (e) => {
      const zoneId = e.target.value;
      setZone(zoneId);
      const zoneObj = zones.find((z) => z._id === zoneId);
      setSelectedZoneName(zoneObj ? zoneObj.name : '');
    },
    [zones]
  );

  // Handle car feature changes
  const handleCarFeatureChange = (feature) => (event) => {
    setCarFeatures((prev) => ({
      ...prev,
      [feature]: event.target.checked
    }));
  };

  // Handle bus feature changes
  const handleBusFeatureChange = (feature) => (event) => {
    setBusFeatures((prev) => ({
      ...prev,
      [feature]: event.target.checked
    }));
  };

  return (
    <Box sx={{ p: isSmallScreen ? 2 : 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box
        sx={{
          maxWidth: 'lg',
          margin: 'auto',
          backgroundColor: 'white',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          p: isSmallScreen ? 2 : 3,
          overflowX: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isEdit && (
              <IconButton onClick={() => navigate('/vehicle-setup/lists')} color="primary">
                <ArrowBackIcon />
              </IconButton>
            )}
            <DirectionsCarIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography variant="h5" component="h1">
              {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
            </Typography>
          </Box>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Insert the basic information of the vehicle
        </Typography>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
          </Box>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 3, mb: 4 }}>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 2, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  General Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert the basic information of the vehicle
                </Typography>
                <TextField
                  fullWidth
                  label="Vehicle Name*"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type vehicle name"
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Short Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type short description"
                  sx={{ mb: 2 }}
                />
              </CardContent>
            </Card>
            <Card sx={{ flex: isSmallScreen ? 'auto' : 1, p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Thumbnail*
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropThumbnail}
                  onClick={() => document.getElementById('thumbnail-upload').click()}
                >
                  {thumbnailFile ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {thumbnailFile.name}
                      </Typography>
                    </Box>
                  ) : existingThumbnail ? (
                    <Box>
                      <img
                        src={existingThumbnail}
                        alt="Existing thumbnail"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 100,
                          objectFit: 'contain',
                          marginBottom: theme.spacing(1),
                          borderColor: '#E15B65'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Existing thumbnail. Upload to replace.
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 40, color: '#E15B65', mb: 1 }} />
                      <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                        Click to upload
                      </Typography>
                      <Typography variant="body2" color="#E15B65">
                        Or drag and drop
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="thumbnail-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleThumbnailFileChange}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                {/* Header */}
                <Typography variant="h6" gutterBottom>
                  Images<span style={{ color: '#E15B65' }}>*</span>
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload high quality images (JPG, JPEG, PNG • Max 1MB • Ratio 2:1)
                </Typography>

                {/* Upload Area */}
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropImages}
                  onClick={() => document.getElementById('images-upload').click()}
                  sx={{
                    backgroundColor: '#fafafa',
                    border: '2px dashed #E15B65',
                    borderRadius: 2,
                    p: 3,
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: '#fff1f2'
                    }
                  }}
                >
                  {/* IMAGES GRID */}
                  {existingImages.length > 0 || newVehicleImages.length > 0 ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                        gap: 2,
                        width: '100%'
                      }}
                    >
                      {/* Existing Images */}
                      {existingImages.map((url, index) => (
                        <Box
                          key={`existing-${index}`}
                          sx={{
                            position: 'relative',
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <img src={url} alt={`Existing ${index}`} style={{ width: '100%', height: 90, objectFit: 'cover' }} />

                          <Box
                            sx={{
                              position: 'absolute',
                              top: 6,
                              left: 6,
                              backgroundColor: '#000',
                              color: '#fff',
                              fontSize: 10,
                              px: 0.8,
                              py: 0.2,
                              borderRadius: 1,
                              opacity: 0.75
                            }}
                          >
                            Existing
                          </Box>
                        </Box>
                      ))}

                      {/* New Images */}
                      {newVehicleImages.map((file, index) => (
                        <Box
                          key={`new-${index}`}
                          sx={{
                            position: 'relative',
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index}`}
                            style={{ width: '100%', height: 90, objectFit: 'cover' }}
                          />

                          <IconButton
                            size="small"
                            onClick={() => setNewVehicleImages((prev) => prev.filter((_, i) => i !== index))}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: '#fff',
                              boxShadow: 1,
                              '&:hover': { backgroundColor: '#fee2e2' }
                            }}
                          >
                            ✕
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    /* EMPTY STATE */
                    <Box sx={{ textAlign: 'center' }}>
                      <CloudUploadIcon sx={{ fontSize: 46, color: '#E15B65', mb: 1 }} />
                      <Typography fontWeight={600} color="#E15B65">
                        Click to upload images
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        or drag & drop files here
                      </Typography>
                    </Box>
                  )}

                  {/* Footer Info */}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                    {existingImages.length + newVehicleImages.length} image(s) selected
                  </Typography>

                  <input
                    type="file"
                    id="images-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                    onChange={handleVehicleImagesChange}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Insert the vehicle's general information
                </Typography>

                {/* Row 1: Top Stacks (3 Columns) */}
                {/* Row 1: Top Stacks (3 Columns) */}
                <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(3), mb: 4 }}>
                  {/* Stack 1: Basic Info */}
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Basic Info
                    </Typography>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="brand-label">Select Brand / Manufacturer</InputLabel>
                      <Select
                        labelId="brand-label"
                        id="brand-select"
                        value={brand}
                        label="Select Brand / Manufacturer"
                        onChange={(e) => setBrand(e.target.value)}
                      >
                        <MenuItem value="">Select vehicle brand</MenuItem>
                        {brands.map((b) => (
                          <MenuItem key={b._id} value={b._id}>
                            {b.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Enter Model Name"
                      variant="outlined"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. Camry, Bus X"
                      required
                    />

                    {/* Only show Year of Manufacture for Car category */}
                    {!isBusCategory && <TextField fullWidth label="Year of Manufacture" variant="outlined" placeholder="e.g. 2023" />}
                  </Stack>

                  {/* Stack 2: Capacity & Comfort */}
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Capacity & Comfort
                    </Typography>
                    <TextField
                      fullWidth
                      label="Seating Capacity"
                      variant="outlined"
                      value={seatingCapacity}
                      onChange={(e) => setSeatingCapacity(e.target.value)}
                      placeholder="Number of seats"
                      type="number"
                      inputProps={{ min: 1 }}
                      required
                    />

                    {/* Show Legroom Type only for Bus */}
                    {isBusCategory && (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Select Legroom Type</InputLabel>
                        <Select
                          value=""
                          label="Select Legroom Type"
                          onChange={(e) => {
                            /* Handle legroom type */
                          }}
                        >
                          <MenuItem value="">Select Legroom</MenuItem>
                          <MenuItem value="standard">Standard</MenuItem>
                          <MenuItem value="extra">Extra</MenuItem>
                          <MenuItem value="premium">Premium</MenuItem>
                        </Select>
                      </FormControl>
                    )}

                    {/* Pushback Seats & Recliner Seats - Side by Side for Bus */}
                    {isBusCategory && (
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        {/* Pushback Seats */}
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Pushback seats
                          </Typography>
                          <RadioGroup row value={pushbackSeats} onChange={(e) => setPushbackSeats(e.target.value)}>
                            <FormControlLabel
                              value="yes"
                              control={<Radio size="small" />}
                              label={<Typography variant="body2">Yes</Typography>}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio size="small" />}
                              label={<Typography variant="body2">No</Typography>}
                            />
                          </RadioGroup>
                        </Box>

                        {/* Recliner Seats */}
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Recliner Seats
                          </Typography>
                          <RadioGroup row value={reclinerSeats} onChange={(e) => setReclinerSeats(e.target.value)}>
                            <FormControlLabel
                              value="yes"
                              control={<Radio size="small" />}
                              label={<Typography variant="body2">Yes</Typography>}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio size="small" />}
                              label={<Typography variant="body2">No</Typography>}
                            />
                          </RadioGroup>
                        </Box>
                      </Box>
                    )}

                    {/* Air Conditioning - Only show radio for Car */}
                    {!isBusCategory && (
                      <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Air Conditioning
                        </Typography>
                        <RadioGroup row value={airCondition} onChange={(e) => setAirCondition(e.target.value)}>
                          <FormControlLabel
                            value="yes"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">Yes</Typography>}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">No</Typography>}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  </Stack>
                  {/* Stack 3: Zone & Location */}
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Zone & Location
                    </Typography>

                    {/* Zone */}
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="zone-label">Zone*</InputLabel>
                      <Select labelId="zone-label" value={zone} label="Zone" onChange={handleZoneChange}>
                        <MenuItem value="">Select zone</MenuItem>
                        {zones.map((z) => (
                          <MenuItem key={z._id} value={z._id}>
                            {z.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Parent Category */}
                    <FormControl fullWidth required>
                      <InputLabel>Parent Category</InputLabel>
                      <Select value={parentCategory} label="Parent Category" onChange={handleParentCategoryChange}>
                        <MenuItem value="">Select Parent Category</MenuItem>
                        {parentCategories.map((cat) => (
                          <MenuItem key={cat._id} value={cat._id}>
                            {cat.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Sub Category */}
                    <FormControl fullWidth required disabled={!parentCategory}>
                      <InputLabel>Sub Category</InputLabel>
                      <Select value={subCategory} label="Sub Category" onChange={(e) => setSubCategory(e.target.value)}>
                        <MenuItem value="">Select Sub Category</MenuItem>
                        {subCategories.map((sub) => (
                          <MenuItem key={sub._id} value={sub._id}>
                            {sub.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>

                {/* Section: Engine & Drive */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                    Engine & Performance
                  </Typography>

                  {isBusCategory ? (
                    /* BUS LAYOUT */
                    <Stack spacing={3}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(3) }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Select Fuel Type</InputLabel>
                          <Select value={fuelType} label="Select Fuel Type" onChange={(e) => setFuelType(e.target.value)}>
                            <MenuItem value="">Select Fuel</MenuItem>
                            <MenuItem value="petrol">Petrol</MenuItem>
                            <MenuItem value="diesel">Diesel</MenuItem>
                            <MenuItem value="electric">Electric</MenuItem>
                            <MenuItem value="hybrid">Hybrid</MenuItem>
                            <MenuItem value="cng">CNG</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                          <InputLabel>Transmission</InputLabel>
                          <Select value={transmissionType} label="Transmission" onChange={(e) => setTransmissionType(e.target.value)}>
                            <MenuItem value="">Select Transmission</MenuItem>
                            <MenuItem value="manual">Manual</MenuItem>
                            <MenuItem value="automatic">Automatic</MenuItem>
                            <MenuItem value="semi-automatic">Semi-Automatic</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                          <InputLabel>Climate Control</InputLabel>
                          <Select value={airCondition} label="Climate Control" onChange={(e) => setAirCondition(e.target.value)}>
                            <MenuItem value="yes">AC</MenuItem>
                            <MenuItem value="no">Non-AC</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Air Conditioning Radio - Only for Bus */}
                      <FormControl component="fieldset" fullWidth>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Air Conditioning
                        </Typography>
                        <RadioGroup row value={airCondition} onChange={(e) => setAirCondition(e.target.value)}>
                          <FormControlLabel
                            value="yes"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">Yes</Typography>}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">No</Typography>}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  ) : (
                    /* CAR LAYOUT */
                    <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(3) }}>
                      <FormControl fullWidth>
                        <InputLabel>Select Fuel Type</InputLabel>
                        <Select value={fuelType} label="Select Fuel Type" onChange={(e) => setFuelType(e.target.value)}>
                          <MenuItem value="">Select Fuel</MenuItem>
                          <MenuItem value="petrol">Petrol</MenuItem>
                          <MenuItem value="diesel">Diesel</MenuItem>
                          <MenuItem value="electric">Electric</MenuItem>
                          <MenuItem value="hybrid">Hybrid</MenuItem>
                          <MenuItem value="cng">CNG</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth required>
                        <InputLabel>Transmission</InputLabel>
                        <Select value={transmissionType} label="Transmission" onChange={(e) => setTransmissionType(e.target.value)}>
                          <MenuItem value="">Select Transmission</MenuItem>
                          <MenuItem value="manual">Manual</MenuItem>
                          <MenuItem value="automatic">Automatic</MenuItem>
                          <MenuItem value="semi-automatic">Semi-Automatic</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Vehicle Class</InputLabel>
                        <Select value={vehicleType} label="Vehicle Class" onChange={(e) => setVehicleType(e.target.value)}>
                          <MenuItem value="standard">Standard</MenuItem>
                          <MenuItem value="luxury">Luxury</MenuItem>
                          <MenuItem value="vintage">Vintage</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Engine Capacity (CC)"
                        variant="outlined"
                        type="number"
                        value={engineCapacity}
                        onChange={(e) => setEngineCapacity(e.target.value)}
                        placeholder="e.g. 2000"
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        fullWidth
                        label="Engine Power (HP)"
                        variant="outlined"
                        type="number"
                        value={enginePower}
                        onChange={(e) => setEnginePower(e.target.value)}
                        placeholder="e.g. 180"
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        fullWidth
                        label="Torque"
                        variant="outlined"
                        value={torque}
                        onChange={(e) => setTorque(e.target.value)}
                        placeholder="e.g. 250 Nm"
                      />
                      <TextField
                        fullWidth
                        label="Mileage"
                        variant="outlined"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        placeholder="e.g. 15 km/l"
                      />
                    </Box>
                  )}
                </Box>
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Vihicles Address*"
                    variant="outlined"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="Enter venue address"
                    required
                  />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Location and Operating Hours
                  </Typography>
                  <TextField
                    fullWidth
                    label="Search Location"
                    inputRef={searchInputRef}
                    variant="outlined"
                    placeholder="Enter a location"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      sx={{ flex: 1 }}
                      label="Latitude*"
                      variant="outlined"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g., 25.2048"
                      required
                    />
                    <TextField
                      sx={{ flex: 1 }}
                      label="Longitude*"
                      variant="outlined"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g., 55.2708"
                      required
                    />
                  </Box>
                  {mapsLoaded && GOOGLE_MAPS_API_KEY ? (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Click on the map below to select a location
                      </Typography>
                      <Box
                        ref={mapRef}
                        sx={{
                          height: 300,
                          width: '100%',
                          borderRadius: theme.shape.borderRadius,
                          border: `1px solid ${theme.palette.grey[300]}`,
                          mb: 2
                        }}
                      />
                    </>
                  ) : (
                    <Box
                      sx={{
                        height: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${theme.palette.grey[300]}`,
                        borderRadius: theme.shape.borderRadius,
                        mb: 2
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Map loading...
                      </Typography>
                    </Box>
                  )}
                  <TextField
                    fullWidth
                    label="Operating Hours"
                    variant="outlined"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    multiline
                    rows={2}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* ---------------- Vehicle Attributes ---------------- */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vehicle Attributes
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select additional attributes for the vehicle
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)',
                    gap: 3
                  }}
                >
                  {vehicleAttributes.map((attr) => (
                    <FormControl key={attr._id} fullWidth>
                      <InputLabel>{attr.title}</InputLabel>
                      <Select
                        value={selectedAttributes[attr._id] || ''}
                        label={attr.title}
                        onChange={(e) => handleAttributeChange(attr._id, e.target.value)}
                      >
                        <MenuItem value="">Select {attr.title}</MenuItem>

                        {attr.values.map((val) => (
                          <MenuItem key={val} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <CardContent sx={{ '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" gutterBottom>
                Vehicle Identity
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Insert the vehicle number and driver availability
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isSmallScreen ? '1fr' : '2fr 1fr',
                  gap: 3,
                  alignItems: 'center'
                }}
              >
                {/* Vehicle Number */}
                <TextField
                  fullWidth
                  label="Vehicle Number*"
                  variant="outlined"
                  value={licensePlateNumber}
                  onChange={(e) => {
                    setLicensePlateNumber(e.target.value);
                    validateLicensePlate(e.target.value);
                  }}
                  placeholder="Enter vehicle number"
                  required
                  error={!!licensePlateError}
                  helperText={licensePlateError}
                />

                {/* Driver Included */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Driver Included
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={features.driverIncluded === true}
                          onChange={() =>
                            setFeatures((prev) => ({
                              ...prev,
                              driverIncluded: true
                            }))
                          }
                        />
                      }
                      label="Yes"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={features.driverIncluded === false}
                          onChange={() =>
                            setFeatures((prev) => ({
                              ...prev,
                              driverIncluded: false
                            }))
                          }
                        />
                      }
                      label="No"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Box>

          {/* ================= VEHICLE FEATURES ================= */}
          {/* ================= VEHICLE FEATURES ================= */}
          {isCategorySelected && isCarCategory && (
            <Card
              sx={{
                mt: 6,
                mb: 6,
                borderRadius: 3,
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafafa'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  borderBottom: '1px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #f9fafb, #ffffff)'
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  🚗 Vehicle Features
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select features available in this vehicle
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ px: 4, py: 4 }}>
                <Stack spacing={4}>
                  {/* Feature Section Component */}
                  {[
                    {
                      title: 'Interior Comfort',
                      items: [
                        ['Leather Seats', 'leatherSeats'],
                        ['Adjustable Seats', 'adjustableSeats'],
                        ['Armrest', 'armrest']
                      ]
                    },
                    {
                      title: 'Entertainment',
                      items: [
                        ['Music System', 'musicSystem'],
                        ['Bluetooth', 'bluetooth'],
                        ['USB / AUX', 'usbAux']
                      ]
                    },
                    {
                      title: 'Safety & Compliance',
                      items: [
                        ['Airbags', 'airbags'],
                        ['ABS', 'abs'],
                        ['Rear Camera', 'rearCamera'],
                        ['Parking Sensors', 'parkingSensors']
                      ]
                    },
                    {
                      title: 'Convenience',
                      items: [
                        ['Power Windows', 'powerWindows'],
                        ['Central Lock', 'centralLock'],
                        ['Keyless Entry', 'keylessEntry']
                      ]
                    },
                    {
                      title: 'Extra Addons',
                      items: [
                        ['Wifi', 'wifi'],
                        ['Charging Points', 'chargingPoints']
                      ]
                    }
                  ].map((section) => (
                    <Box
                      key={section.title}
                      sx={{
                        p: 3,
                        backgroundColor: section.title === 'Extra Addons' ? '#e7f0f5' : '#ffffff', // 👈 added
                        borderRadius: 2,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <Typography fontWeight={600} mb={2}>
                        {section.title}
                      </Typography>

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)',
                          gap: 1.5
                        }}
                      >
                        {section.items.map(([label, key]) => (
                          <FormControlLabel
                            key={key}
                            control={<Checkbox checked={carFeatures[key]} onChange={handleCarFeatureChange(key)} />}
                            label={label}
                          />
                        ))}
                      </Box>

                      {/* Interior Lighting only for Extra Addons */}
                      {section.title === 'Extra Addons' && (
                        <Box sx={{ mt: 3 }}>
                          <Typography fontWeight={600} mb={1}>
                            Interior Lighting
                          </Typography>
                          <RadioGroup row value={interiorLighting} onChange={(e) => setInteriorLighting(e.target.value)}>
                            <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                            <FormControlLabel value="premium" control={<Radio />} label="Premium" />
                          </RadioGroup>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Card>
          )}

          {isCategorySelected && isBusCategory && (
            <Card
              sx={{
                mt: 6,
                mb: 6,
                borderRadius: 3,
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafafa'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  borderBottom: '1px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #f9fafb, #ffffff)'
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  🚌 Bus Features
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select features available in this bus
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ px: 4, py: 4 }}>
                <Stack spacing={4}>
                  {[
                    {
                      title: 'Interior Features',
                      items: [
                        ['Curtains', 'curtains'],
                        ['Reading Lights', 'readingLights']
                      ]
                    },
                    {
                      title: 'Entertainment & Communication',
                      items: [
                        ['Music System', 'musicSystem'],
                        ['Microphone', 'microphone']
                      ]
                    },
                    {
                      title: 'Safety & Compliance',
                      items: [
                        ['Fire Extinguisher', 'fireExtinguisher'],
                        ['First Aid Kit', 'firstAidKit']
                      ]
                    },
                    {
                      title: 'Storage',
                      items: [['Luggage Carrier', 'luggageCarrier']]
                    },
                    {
                      title: 'Extra Addons',
                      items: [
                        ['Wifi', 'wifi'],
                        ['Charging Points', 'chargingPoints']
                      ]
                    }
                  ].map((section) => (
                    <Box
                      key={section.title}
                      sx={{
                        p: 3,
                        backgroundColor: section.title === 'Extra Addons' ? '#e5edf6' : '#ffffff', // 👈 added
                        borderRadius: 2,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <Typography fontWeight={600} mb={2}>
                        {section.title}
                      </Typography>

                      {/* ===== EXTRA ADDONS (CORRECT LAYOUT) ===== */}
                      {section.title === 'Extra Addons' ? (
                        <>
                          {/* CHECKBOXES ROW */}
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
                              gap: 2,
                              mb: 3
                            }}
                          >
                            <FormControlLabel
                              control={<Checkbox checked={busFeatures.wifi} onChange={handleBusFeatureChange('wifi')} />}
                              label="Wifi"
                            />

                            <FormControlLabel
                              control={
                                <Checkbox checked={busFeatures.chargingPoints} onChange={handleBusFeatureChange('chargingPoints')} />
                              }
                              label="Charging Points"
                            />
                          </Box>

                          {/* INTERIOR LIGHTING BELOW */}
                          <Box>
                            <Typography
                              sx={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                mb: 1
                              }}
                            >
                              Interior Lighting
                            </Typography>

                            <RadioGroup row value={interiorLighting} onChange={(e) => setInteriorLighting(e.target.value)}>
                              <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                              <FormControlLabel value="premium" control={<Radio />} label="Premium" />
                            </RadioGroup>
                          </Box>
                        </>
                      ) : (
                        /* ===== ALL OTHER SECTIONS ===== */
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)',
                            gap: 1.5
                          }}
                        >
                          {section.items.map(([label, key]) => (
                            <FormControlLabel
                              key={key}
                              control={<Checkbox checked={busFeatures[key]} onChange={handleBusFeatureChange(key)} />}
                              label={label}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Card>
          )}

          {/* Show Package Pricing only for Car category */}
          {isCategorySelected && (isCarCategory || isBusCategory) && (
            <Box sx={{ mb: 4 }}>
              {/* ================= PACKAGE PRICING ================= */}
              <Card
                sx={{
                  mt: 6,
                  mb: 6,
                  borderRadius: 3,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}
              >
                {/* Header with Gradient */}
                <Box
                  sx={{
                    px: 4,
                    py: 3,
                    background: 'linear-gradient(135deg, #f5efef 0%, #efdfe1 100%)',
                    color: 'white'
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Package Pricing
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    Set base price, discount & advance booking options
                  </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ p: 4, backgroundColor: '#fafbfc' }}>
                  <Grid container spacing={3}>
                    {/* Column 1 - Package Details */}
                    <Grid item xs={12} md={8}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          border: '2px solid #e5e7eb',
                          height: '100%',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(225, 91, 101, 0.15)',
                            borderColor: '#E15B65'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: '#E15B65',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <Typography sx={{ color: 'white', fontSize: 20, fontWeight: 700 }}>₹</Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1f2937' }}>
                            Package Details
                          </Typography>
                        </Box>

                        <Stack spacing={2.5}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block', fontWeight: 600 }}>
                              Base Package Price
                            </Typography>
                            <TextField
                              fullWidth
                              type="number"
                              value={basicPackagePrice}
                              onChange={(e) => setBasicPackagePrice(e.target.value)}
                              placeholder="0"
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 1, color: '#E15B65', fontWeight: 600, fontSize: 18 }}>₹</Typography>
                              }}
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#E15B65'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#E15B65'
                                  }
                                }
                              }}
                            />
                          </Box>

                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block', fontWeight: 600 }}>
                                Hours Included
                              </Typography>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={hoursIncluded}
                                  onChange={(e) => setHoursIncluded(e.target.value)}
                                  displayEmpty
                                  sx={{
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#E15B65'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#E15B65'
                                    }
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="4">4 Hrs</MenuItem>
                                  <MenuItem value="6">6 Hrs</MenuItem>
                                  <MenuItem value="8">8 Hrs</MenuItem>
                                  <MenuItem value="10">10 Hrs</MenuItem>
                                  <MenuItem value="12">12 Hrs</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>

                            <Box>
                              <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block', fontWeight: 600 }}>
                                KM Included
                              </Typography>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={kmIncluded}
                                  onChange={(e) => setKmIncluded(e.target.value)}
                                  displayEmpty
                                  sx={{
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#E15B65'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#E15B65'
                                    }
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="50">50 KM</MenuItem>
                                  <MenuItem value="100">100 KM</MenuItem>
                                  <MenuItem value="150">150 KM</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 1.5,
                              backgroundColor: '#fef3f2',
                              border: '1px dashed #E15B65'
                            }}
                          >
                            <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block', fontWeight: 600 }}>
                              Extra Charges
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                              <TextField
                                fullWidth
                                label="Price/KM"
                                type="number"
                                value={additionalPricePerKm}
                                onChange={(e) => setAdditionalPricePerKm(e.target.value)}
                                InputProps={{
                                  startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary', fontSize: 14 }}>₹</Typography>
                                }}
                                size="small"
                              />

                              <FormControl fullWidth size="small">
                                <InputLabel>After KM</InputLabel>
                                <Select value={afterKilometer} label="After KM" onChange={(e) => setAfterKilometer(e.target.value)}>
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="1">Per KM</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>

                    {/* Column 2 - Discounts & Advance */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          border: '2px solid #e5e7eb',
                          height: '100%',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(225, 91, 101, 0.15)',
                            borderColor: '#E15B65'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <Typography sx={{ color: 'white', fontSize: 20, fontWeight: 700 }}>%</Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1f2937' }}>
                            Offers & Advance
                          </Typography>
                        </Box>

                        <Stack spacing={3}>
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              backgroundColor: '#f0fdf4',
                              border: '1px solid #bbf7d0'
                            }}
                          >
                            <Typography variant="body2" fontWeight={600} sx={{ color: '#15803d', mb: 2 }}>
                              Apply Discount
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select value={discountType} label="Type" onChange={(e) => setDiscountType(e.target.value)}>
                                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                                  <MenuItem value="flat">Flat Rate (₹)</MenuItem>
                                </Select>
                              </FormControl>

                              <TextField
                                fullWidth
                                label="Value"
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                size="small"
                              />
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              backgroundColor: '#eff6ff',
                              border: '1px solid #bfdbfe'
                            }}
                          >
                            <Typography variant="body2" fontWeight={600} sx={{ color: '#1e40af', mb: 2 }}>
                              Advance Booking
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select value={advanceType} label="Type" onChange={(e) => setAdvanceType(e.target.value)}>
                                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                                  <MenuItem value="flat">Flat (₹)</MenuItem>
                                </Select>
                              </FormControl>

                              <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={advanceAmount}
                                onChange={(e) => setAdvanceAmount(e.target.value)}
                                InputProps={{
                                  startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary', fontSize: 14 }}>₹</Typography>
                                }}
                                size="small"
                              />
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>

                    {/* Column 3 - Grand Total */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 3,
                          ml: { xs: 0, md: 30 }, // 👈 moves RIGHT on desktop
                          display: 'flex',

                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          border: '2px solid #e5e7eb',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(225, 91, 101, 0.15)',
                            borderColor: '#E15B65'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: '#f59e0b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <Typography sx={{ color: 'white', fontSize: 20, fontWeight: 700 }}>Σ</Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1f2937' }}>
                            Summary
                          </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Box
                            sx={{
                              p: 5,
                              borderRadius: 3,
                              background: 'linear-gradient(135deg, #E15B65 0%, #c94450 100%)',
                              color: 'white',
                              textAlign: 'center',
                              boxShadow: '0 10px 30px rgba(225, 91, 101, 0.35)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -30,
                                right: -30,
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)'
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -40,
                                left: -40,
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.06)'
                              }
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                opacity: 1,
                                mb: 2,
                                position: 'relative',
                                zIndex: 1,
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.95)'
                              }}
                            >
                              Grand Total
                            </Typography>

                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                              <Typography
                                variant="h2"
                                fontWeight={700}
                                sx={{
                                  mb: 1.5,
                                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                  fontSize: { xs: '2.5rem', md: '3rem' }
                                }}
                              >
                                ₹ {basicPackagePrice || '0'}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                mt: 2.5,
                                pt: 2.5,
                                borderTop: '2px solid rgba(255, 255, 255, 0.2)',
                                position: 'relative',
                                zIndex: 1
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  opacity: 0.95,
                                  fontWeight: 500,
                                  fontSize: '0.85rem',
                                  lineHeight: 1.5
                                }}
                              >
                                Base Price + Taxes & Fees
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              mt: 3,
                              p: 2.5,
                              borderRadius: 2,
                              backgroundColor: '#fffbeb',
                              border: '1px solid #fde68a',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1.5
                            }}
                          >
                            <Typography sx={{ fontSize: '1.2rem' }}>💡</Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#92400e',
                                lineHeight: 1.7,
                                fontSize: '0.813rem',
                                fontWeight: 500
                              }}
                            >
                              Final amount calculated based on base price and applied discounts
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Box>
          )}

          <Box
            sx={{
              mt: 3,
              p: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Vehicle Features
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: features.decorationAvailable
                  ? { xs: '1fr', md: '1fr 1fr' } // ON → two boxes
                  : 'max-content', // OFF → compact width
                gap: 3,
                alignItems: 'center'
              }}
            >
              {/* LEFT BOX — Decoration Toggle */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  px: 3,
                  py: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  width: 'fit-content', // 🔥 keeps switch near heading
                  minWidth: 260
                }}
              >
                <Typography fontSize={14} fontWeight={500}>
                  Decoration Available
                </Typography>

                <Switch
                  checked={features.decorationAvailable}
                  onChange={(e) =>
                    setFeatures((prev) => ({
                      ...prev,
                      decorationAvailable: e.target.checked
                    }))
                  }
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#E15B65'
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#E15B65'
                    }
                  }}
                />
              </Box>

              {/* RIGHT BOX — Decoration Price (only when ON) */}
              {features.decorationAvailable && (
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    backgroundColor: 'white',
                    minWidth: 260
                  }}
                >
                  <TextField
                    fullWidth
                    label="Decoration Price (₹)"
                    type="number"
                    value={decorationPrice}
                    onChange={(e) => setDecorationPrice(e.target.value)}
                    inputProps={{ min: 0 }}
                    placeholder="e.g. 5000"
                  />
                </Box>
              )}
            </Box>
          </Box>
          {/* ================= VEHICLE DOCUMENTS UPLOAD ================= */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Upload Vehicle Documents
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload RC, Insurance, Permit or any supporting vehicle documents
            </Typography>

            <UploadDropArea
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropVehicleDocuments}
              onClick={() => document.getElementById('vehicle-documents-upload').click()}
              sx={{ minHeight: 160 }}
            >
              {vehicleDocuments.length > 0 ? (
                <Stack spacing={1} sx={{ width: '100%' }}>
                  {vehicleDocuments.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1,
                        border: '1px solid #e5e7eb',
                        borderRadius: 1,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        📄 {file.name}
                      </Typography>

                      <IconButton size="small" onClick={() => setVehicleDocuments((prev) => prev.filter((_, i) => i !== index))}>
                        ✕
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 42, color: '#E15B65', mb: 1 }} />
                  <Typography fontWeight={600} color="#E15B65">
                    Click to upload documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Or drag & drop files here (PDF, JPG, PNG)
                  </Typography>
                </>
              )}

              <input
                id="vehicle-documents-upload"
                type="file"
                hidden
                multiple
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleVehicleDocumentsChange}
              />
            </UploadDropArea>
          </Box>

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
                    sx={{ mt: 1, color: '#E15B65' }}
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
                  borderColor: '#E15B65',
                  color: '#E15B65'
                }}
              >
                + Add Section
              </Button>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Search Tags
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert tags for appearing in user search results
                </Typography>
                <TextField
                  fullWidth
                  label="Type and press Enter"
                  variant="outlined"
                  value={currentTag}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Type and press Enter"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {searchTags.map((tag, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.grey[200],
                        borderRadius: theme.shape.borderRadius,
                        px: 1,
                        py: 0.5
                      }}
                    >
                      <Typography variant="body2">{tag}</Typography>
                      <IconButton size="small" onClick={() => handleRemoveTag(tag)}>
                        <Typography sx={{ fontSize: 14 }}>×</Typography>
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="#E15B65" size="large" onClick={handleReset} sx={{ color: '#E15B65' }}>
              {isEdit ? 'Cancel' : 'Reset'}
            </Button>
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ color: 'white', bgcolor: '#E15B65' }}
            >
              {loading ? 'Submitting...' : isEdit ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { minWidth: '600px', maxWidth: '600px', width: 'auto' } }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{
            width: '100%',
            backgroundColor: toastSeverity === 'success' ? '#1976d2' : '#d32f2f',
            color: 'white',
            '& .MuiAlert-message': {
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              fontSize: '1rem',
              lineHeight: 1.5
            }
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Createnew;
