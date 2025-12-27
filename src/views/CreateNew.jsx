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
  CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, ArrowBack as ArrowBackIcon, DirectionsCar as DirectionsCarIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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
  const [engineCapacity, setEngineCapacity] = useState('');
  const [enginePower, setEnginePower] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [airCondition, setAirCondition] = useState('yes');
  const [fuelType, setFuelType] = useState('');
  const [transmissionType, setTransmissionType] = useState('');
  const [licensePlateNumber, setLicensePlateNumber] = useState('');
  const [licensePlateError, setLicensePlateError] = useState('');
  const [tripType, setTripType] = useState('hourly');
  const [hourlyWisePrice, setHourlyWisePrice] = useState('');
  const [perDayPrice, setPerDayPrice] = useState('');
  const [distanceWisePrice, setDistanceWisePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  // Parent & Sub Categories
  // Vehicle Attributes
  const [vehicleAttributes, setVehicleAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  // Additional Vehicle Details
  const [seatType, setSeatType] = useState('');
  const [audioSystem, setAudioSystem] = useState('');
  const [airbags, setAirbags] = useState('');
  const [camera, setCamera] = useState('');
  const [bootSpace, setBootSpace] = useState('');
  const [fuelTank, setFuelTank] = useState('');
  // Advance Booking
  // Advance Booking (Flat Amount)
  const [advanceBookingAmount, setAdvanceBookingAmount] = useState('');

  const [connectivity, setConnectivity] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [safety, setSafety] = useState([]);
  const [insuranceIncluded, setInsuranceIncluded] = useState([]);
  const [insuranceExcluded, setInsuranceExcluded] = useState([]);
  const [attributeMap, setAttributeMap] = useState({});

  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [parentCategory, setParentCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

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
      // ✅ Advance booking prefill (flat amount)
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
      setEngineCapacity(vehicle.engineCapacity?.toString() || '');
      setEnginePower(vehicle.enginePower?.toString() || '');
      setSeatingCapacity(vehicle.seatingCapacity?.toString() || '');
      setAirCondition(vehicle.airCondition ? 'yes' : 'no');
      setFuelType(vehicle.fuelType || '');
      setTransmissionType(vehicle.transmissionType || '');
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
      setSeatType(vehicle.seatType || '');
      setAudioSystem(vehicle.audioSystem || '');
      setCamera(vehicle.camera || '');
      setAirbags(vehicle.airbags?.toString() || '');
      setBootSpace(vehicle.bootSpace?.toString() || '');
      setFuelTank(vehicle.fuelTank?.toString() || '');

      setConnectivity(vehicle.connectivity || []);
      setSensors(vehicle.sensors || []);
      setSafety(vehicle.safety || []);
      setInsuranceIncluded(vehicle.insuranceIncluded || []);
      setInsuranceExcluded(vehicle.insuranceExcluded || []);
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
    setName('');
    setDescription('');
    setVenueAddress('');
    setThumbnailFile(null);
    setNewVehicleImages([]);
    setBrand('');
    setModel('');
    setCategory('');
    setZone('');
    setSelectedZoneName('');
    setEngineCapacity('');
    setEnginePower('');
    setSeatingCapacity('');
    setAirCondition('yes');
    setFuelType('');
    setTransmissionType('');
    setLicensePlateNumber('');
    setLicensePlateError('');
    setTripType('hourly');
    setHourlyWisePrice('');
    setPerDayPrice('');
    setDistanceWisePrice('');
    setDiscount('');
    setSearchTags([]);
    setCurrentTag('');
    setExistingThumbnail('');
    setExistingImages([]);
    setLatitude('');
    setLongitude('');
    setOperatingHours('');
    setViewMode('create');
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (map) {
      setMap(null);
    }
  }, []);

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
        !engineCapacity ||
        !enginePower ||
        !seatingCapacity ||
        !fuelType ||
        !transmissionType ||
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
      formData.append('name', name);
      formData.append('description', description);
      formData.append('brand', brand);
      formData.append('category', parentCategory);
      formData.append('subCategories[]', subCategory);
      formData.append('zone', zone);
      formData.append('model', model);
      formData.append('engineCapacity', parseInt(engineCapacity));
      formData.append('enginePower', parseInt(enginePower));
      formData.append('seatingCapacity', parseInt(seatingCapacity));
      formData.append('airCondition', airCondition === 'yes');
      formData.append('fuelType', fuelType.toLowerCase());
      // Attach dynamic vehicle attributes
      formData.append('attributes', JSON.stringify(selectedAttributes));
      formData.append('seatType', seatType);
      formData.append('audioSystem', audioSystem);
      formData.append('camera', camera);
      formData.append('advanceBookingAmount', advanceBookingAmount || 0);

      if (airbags) formData.append('airbags', airbags);
      if (bootSpace) formData.append('bootSpace', bootSpace);
      if (fuelTank) formData.append('fuelTank', fuelTank);

      // Arrays
      formData.append('connectivity', JSON.stringify(connectivity));
      formData.append('sensors', JSON.stringify(sensors));
      formData.append('safety', JSON.stringify(safety));
      formData.append('insuranceIncluded', JSON.stringify(insuranceIncluded));
      formData.append('insuranceExcluded', JSON.stringify(insuranceExcluded));

      formData.append('transmissionType', transmissionType.toLowerCase());
      formData.append('licensePlateNumber', licensePlateNumber);
      formData.append('venueAddress', venueAddress);
      formData.append('latitude', parseFloat(latitude));
      formData.append('longitude', parseFloat(longitude));
      if (operatingHours) formData.append('operatingHours', operatingHours);
      formData.append('pricing[type]', tripType);
      formData.append('pricing[hourly]', tripType === 'hourly' ? parseFloat(hourlyWisePrice) || 0 : 0);
      formData.append('pricing[perDay]', tripType === 'perDay' ? parseFloat(perDayPrice) || 0 : 0);
      formData.append('pricing[distanceWise]', tripType === 'distanceWise' ? parseFloat(distanceWisePrice) || 0 : 0);
      if (discount) formData.append('discount', parseFloat(discount));
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
      engineCapacity,
      enginePower,
      seatingCapacity,
      airCondition,
      fuelType,
      transmissionType,
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
      seatType,
      audioSystem,
      camera,
      advanceBookingAmount,
      airbags,
      bootSpace,
      fuelTank,
      connectivity,
      sensors,
      safety,
      insuranceIncluded,
      insuranceExcluded
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
                <Typography variant="h6" gutterBottom>
                  Images*
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropImages}
                  onClick={() => document.getElementById('images-upload').click()}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', width: '100%' }}>
                    {existingImages.length > 0 && (
                      <>
                        {existingImages.map((url, index) => (
                          <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                            <img
                              src={url}
                              alt={`Existing vehicle image ${index + 1}`}
                              style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: theme.shape.borderRadius }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                borderRadius: '50%',
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px'
                              }}
                            >
                              Existing
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                    {newVehicleImages.length > 0 && (
                      <>
                        {newVehicleImages.map((file, index) => (
                          <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New vehicle image ${index + 1}`}
                              style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: theme.shape.borderRadius }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => setNewVehicleImages((prev) => prev.filter((_, i) => i !== index))}
                              sx={{ position: 'absolute', top: -4, right: -4, backgroundColor: 'white', width: 24, height: 24 }}
                            >
                              <Typography sx={{ fontSize: 14, color: 'red' }}>×</Typography>
                            </IconButton>
                          </Box>
                        ))}
                      </>
                    )}
                    {existingImages.length === 0 && newVehicleImages.length === 0 && (
                      <>
                        <CloudUploadIcon sx={{ fontSize: 40, color: '#E15B65', mb: 1 }} />
                        <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium', borderColor: '#E15B65' }}>
                          Click to upload
                        </Typography>
                        <Typography variant="body2" color="#E15B65">
                          Or drag and drop
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, width: '100%', textAlign: 'center' }}>
                    {existingImages.length + newVehicleImages.length} image(s) {existingImages.length > 0 ? '(including existing)' : ''}.
                    Upload to add more.
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert the vehicle's general information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(3) }}>
                  <Stack spacing={2}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="brand-label">Brand*</InputLabel>
                      <Select
                        labelId="brand-label"
                        id="brand-select"
                        value={brand}
                        label="Brand"
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
                    <FormControl fullWidth variant="outlined" required>
                      <TextField
                        id="seating-capacity-input"
                        label="Seating Capacity*"
                        variant="outlined"
                        value={seatingCapacity}
                        onChange={(e) => setSeatingCapacity(e.target.value)}
                        placeholder="Input how many persons can seat"
                        type="number"
                        inputProps={{ min: 1 }}
                      />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="transmission-type-label">Transmission Type*</InputLabel>
                      <Select
                        labelId="transmission-type-label"
                        id="transmission-type-select"
                        value={transmissionType}
                        label="Transmission Type"
                        onChange={(e) => setTransmissionType(e.target.value)}
                      >
                        <MenuItem value="">Select transmission type</MenuItem>
                        <MenuItem value="automatic">Automatic</MenuItem>
                        <MenuItem value="manual">Manual</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Model*"
                      variant="outlined"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Model Name"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Engine Capacity (cc)*"
                      variant="outlined"
                      value={engineCapacity}
                      onChange={(e) => setEngineCapacity(e.target.value)}
                      placeholder="Ex: 2000"
                      type="number"
                      inputProps={{ min: 0 }}
                      required
                    />
                    <FormControl component="fieldset" fullWidth>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        Air Condition
                      </Typography>
                      <RadioGroup row value={airCondition} onChange={(e) => setAirCondition(e.target.value)}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                  <Stack spacing={2}>
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

                    <TextField
                      fullWidth
                      label="Engine Power (hp)*"
                      variant="outlined"
                      value={enginePower}
                      onChange={(e) => setEnginePower(e.target.value)}
                      placeholder="Ex: 150"
                      type="number"
                      inputProps={{ min: 0 }}
                      required
                    />
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="fuel-type-label">Fuel Type*</InputLabel>
                      <Select
                        labelId="fuel-type-label"
                        id="fuel-type-select"
                        value={fuelType}
                        label="Fuel Type"
                        onChange={(e) => setFuelType(e.target.value)}
                      >
                        <MenuItem value="">Select fuel type</MenuItem>
                        <MenuItem value="petrol">Petrol</MenuItem>
                        <MenuItem value="diesel">Diesel</MenuItem>
                        <MenuItem value="electric">Electric</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="zone-label">Zone*</InputLabel>
                    <Select labelId="zone-label" id="zone-select" value={zone} label="Zone" onChange={handleZoneChange}>
                      <MenuItem value="">Select zone</MenuItem>
                      {zones.length > 0 ? (
                        zones.map((z) => (
                          <MenuItem key={z._id} value={z._id}>
                            {z.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No zones available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Venue Address*"
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
            </Card>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Vehicle Details
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)',
                    gap: 3
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Seat Type</InputLabel>
                    <Select value={seatType} label="Seat Type" onChange={(e) => setSeatType(e.target.value)}>
                      <MenuItem value="">Select Seat Type</MenuItem>
                      <MenuItem value="cloth">Cloth</MenuItem>
                      <MenuItem value="leather">Leather</MenuItem>
                      <MenuItem value="vinyl">Vinyl</MenuItem>
                      <MenuItem value="alcantara">Alcantara</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Audio System" value={audioSystem} onChange={(e) => setAudioSystem(e.target.value)} />
                  <FormControl fullWidth>
                    <InputLabel>Camera</InputLabel>
                    <Select value={camera} label="Camera" onChange={(e) => setCamera(e.target.value)}>
                      <MenuItem value="">Select Camera</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="rear">Rear</MenuItem>
                      <MenuItem value="front">Front</MenuItem>
                      <MenuItem value="360-degree">360 Degree</MenuItem>
                      <MenuItem value="multiple">Multiple</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField label="Airbags" type="number" value={airbags} onChange={(e) => setAirbags(e.target.value)} />

                  <TextField label="Boot Space (Litres)" type="number" value={bootSpace} onChange={(e) => setBootSpace(e.target.value)} />

                  <TextField
                    label="Fuel Tank Capacity (Litres)"
                    type="number"
                    value={fuelTank}
                    onChange={(e) => setFuelTank(e.target.value)}
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Connectivity (comma separated)"
                    placeholder="Bluetooth, USB"
                    value={connectivity.join(', ')}
                    onChange={(e) => setConnectivity(e.target.value.split(',').map((v) => v.trim()))}
                  />

                  <TextField
                    fullWidth
                    label="Sensors (comma separated)"
                    placeholder="Parking, Lane"
                    sx={{ mt: 2 }}
                    value={sensors.join(', ')}
                    onChange={(e) => setSensors(e.target.value.split(',').map((v) => v.trim()))}
                  />

                  <TextField
                    fullWidth
                    label="Safety Features (comma separated)"
                    placeholder="ABS, Traction Control"
                    sx={{ mt: 2 }}
                    value={safety.join(', ')}
                    onChange={(e) => setSafety(e.target.value.split(',').map((v) => v.trim()))}
                  />

                  <TextField
                    fullWidth
                    label="Insurance Included"
                    placeholder="Collision, Theft"
                    sx={{ mt: 2 }}
                    value={insuranceIncluded.join(', ')}
                    onChange={(e) => setInsuranceIncluded(e.target.value.split(',').map((v) => v.trim()))}
                  />

                  <TextField
                    fullWidth
                    label="Insurance Excluded"
                    placeholder="Personal Injury"
                    sx={{ mt: 2 }}
                    value={insuranceExcluded.join(', ')}
                    onChange={(e) => setInsuranceExcluded(e.target.value.split(',').map((v) => v.trim()))}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Identity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert the vehicle's license plate number
                </Typography>
                <TextField
                  fullWidth
                  label="License Plate Number*"
                  variant="outlined"
                  value={licensePlateNumber}
                  onChange={(e) => {
                    setLicensePlateNumber(e.target.value);
                    validateLicensePlate(e.target.value);
                  }}
                  placeholder="Type license plate number (6-8 alphanumeric)"
                  required
                  error={!!licensePlateError}
                  helperText={licensePlateError}
                />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Pricing & Discounts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Insert pricing and discount information
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trip Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose the trip type you prefer
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', gap: theme.spacing(2) }}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: tripType === 'hourly' ? '#E15B65' : undefined,
                        borderWidth: tripType === 'hourly' ? 2 : 1
                      }}
                      onClick={() => setTripType('hourly')}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={tripType === 'hourly'}
                            onChange={() => setTripType('hourly')}
                            sx={{ color: '#E15B65', '&.Mui-checked': { color: '#E15B65' } }}
                          />
                        }
                        label="Hourly"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Set your hourly rental price
                      </Typography>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: tripType === 'perDay' ? '#E15B65' : undefined,
                        borderWidth: tripType === 'perDay' ? 2 : 1
                      }}
                      onClick={() => setTripType('perDay')}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={tripType === 'perDay'}
                            onChange={() => setTripType('perDay')}
                            sx={{ color: '#E15B65', '&.Mui-checked': { color: '#E15B65' } }}
                          />
                        }
                        label="Per Day"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Set your per day rental price
                      </Typography>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: tripType === 'distanceWise' ? '#E15B65' : undefined,
                        borderWidth: tripType === 'distanceWise' ? 2 : 1
                      }}
                      onClick={() => setTripType('distanceWise')}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={tripType === 'distanceWise'}
                            onChange={() => setTripType('distanceWise')}
                            sx={{ color: '#E15B65', '&.Mui-checked': { color: '#E15B65' } }}
                          />
                        }
                        label="DistanceWise"
                        labelPlacement="start"
                        sx={{ m: 0, '.MuiFormControlLabel-label': { ml: 'auto' } }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Set your distance wise rental price
                      </Typography>
                    </Card>
                  </Box>
                </Box>
                {tripType === 'hourly' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Hourly Price (₹/per hour)*"
                      variant="outlined"
                      value={hourlyWisePrice}
                      onChange={(e) => setHourlyWisePrice(e.target.value)}
                      placeholder="Ex: 2500.00"
                      type="number"
                      inputProps={{ step: '0.01', min: 0 }}
                      required
                    />
                  </Box>
                )}
                {tripType === 'perDay' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Per Day Price (₹/per day)*"
                      variant="outlined"
                      value={perDayPrice}
                      onChange={(e) => setPerDayPrice(e.target.value)}
                      placeholder="Ex: 15000.00"
                      type="number"
                      inputProps={{ step: '0.01', min: 0 }}
                      required
                    />
                  </Box>
                )}
                {tripType === 'distanceWise' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Distance Price (₹/per km)*"
                      variant="outlined"
                      value={distanceWisePrice}
                      onChange={(e) => setDistanceWisePrice(e.target.value)}
                      placeholder="Ex: 100.00"
                      type="number"
                      inputProps={{ step: '0.01', min: 0 }}
                      required
                    />
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Discount
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set a discount amount (e.g., 10 for 10%)
                  </Typography>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    variant="outlined"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Ex: 10"
                    type="number"
                    inputProps={{ step: 'any', min: 0, max: 100 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* ===== Advance Booking Amount ===== */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Advance Booking Amount
                </Typography>

                <TextField
                  fullWidth
                  type="number"
                  label="Advance Amount"
                  value={advanceBookingAmount}
                  onChange={(e) => setAdvanceBookingAmount(e.target.value)}
                  inputProps={{ min: 0 }}
                  helperText="Flat advance amount payable during booking"
                />
              </CardContent>
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