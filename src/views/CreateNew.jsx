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
import {
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
  DirectionsCar as DirectionsCarIcon,
  EventSeat as ChairIcon,
  MusicNote as MusicIcon,
  Security as SafetyIcon,
  Settings as ConvenienceIcon,
  Wifi as WifiIcon,
  Usb as UsbIcon,
  Luggage as LuggageIcon,
  Tv as TvIcon,
  VolumeUp as SpeakerIcon,
  MeetingRoom as DoorIcon,
  Sensors as SensorsIcon,
  CameraAlt as CameraIcon,
  Bluetooth as BluetoothIcon,
  GpsFixed as GpsIcon,
  Emergency as EmergencyIcon,
  Visibility as CctvIcon,
  Store as StorageIcon
} from '@mui/icons-material';
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
  const [legroomType, setLegroomType] = useState('');

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
    footRest: false, // NEW
    bottleHolder: false, // NEW

    musicSystem: false,
    microphone: false,
    ledDisplay: false, // NEW
    tvScreen: false, // NEW

    fireExtinguisher: false,
    firstAidKit: false,
    ledEmergencyExit: false, // NEW
    cctv: false, // NEW

    luggageCarrier: false,
    overheadStorage: false, // NEW

    wifi: false,
    chargingPoints: false
  });

  const [vanFeatures, setVanFeatures] = useState({
    curtains: false,
    readingLights: false,
    footRest: false,
    bottleHolder: false,

    musicSystem: false,
    tvScreen: false,

    fireExtinguisher: false,
    firstAidKit: false,
    cctv: false,

    luggageCarrier: false,
    overheadStorage: false,

    wifi: false,
    chargingPoints: false
  });

  const [bikeFeatures, setBikeFeatures] = useState({
    helmet: false,
    storageBox: false,
    abs: false,
    mobileHolder: false,
    rearRack: false,
    windshield: false
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

  const isVanCategory = useMemo(() => {
    if (!parentCategory || !parentCategories.length) return false;
    const selectedParentCat = parentCategories.find((cat) => cat._id === parentCategory);
    console.log('Category check (Van):', selectedParentCat?.title);
    return selectedParentCat?.title?.toLowerCase().includes('van');
  }, [parentCategory, parentCategories]);

  const isBikeCategory = useMemo(() => {
    if (!parentCategory || !parentCategories.length) return false;
    const selectedParentCat = parentCategories.find((cat) => cat._id === parentCategory);
    console.log('Category check (Bike):', selectedParentCat?.title);
    return selectedParentCat?.title?.toLowerCase().includes('bike');
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

      // ============= BRAND HANDLING =============
      if (vehicle.brand && vehicle.brand._id && !brands.some((b) => b._id === vehicle.brand._id)) {
        setBrands((prev) => [
          ...prev,
          {
            _id: vehicle.brand._id,
            title: vehicle.brand.title || vehicle.brand.name || 'Unknown Brand'
          }
        ]);
      }

      // ============= FEATURED IMAGE & GALLERY IMAGES (NEW) =============
      if (vehicle.featuredImage) {
        setExistingThumbnail(vehicle.featuredImage);
      }

      if (vehicle.galleryImages && Array.isArray(vehicle.galleryImages)) {
        setExistingImages(vehicle.galleryImages);
      }

      // ============= CATEGORY & SUBCATEGORY HANDLING =============
      // Handle parent category
      if (vehicle.category?._id) {
        setParentCategory(vehicle.category._id);

        // Fetch subcategories for this parent category
        axios
          .get(`${API_BASE_URL}/categories/parents/${vehicle.category._id}/subcategories`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then((res) => setSubCategories(res.data.data || []))
          .catch(() => setSubCategories([]));
      }

      // Handle subcategory (single ObjectId reference)
      if (vehicle.subCategory) {
        if (typeof vehicle.subCategory === 'object' && vehicle.subCategory._id) {
          setSubCategory(vehicle.subCategory._id);
        } else if (typeof vehicle.subCategory === 'string') {
          setSubCategory(vehicle.subCategory);
        }
      }

      // ============= ZONE HANDLING =============
      if (vehicle.zone && vehicle.zone._id && !zones.some((z) => z._id === vehicle.zone._id)) {
        setZones((prev) => [
          ...prev,
          {
            _id: vehicle.zone._id,
            name: vehicle.zone.name || 'Unknown Zone'
          }
        ]);
      }

      const zoneId = vehicle.zone?._id || '';
      setZone(zoneId);
      const zoneObj = zones.find((z) => z._id === zoneId) || (vehicle.zone && { name: vehicle.zone.name });
      setSelectedZoneName(zoneObj ? zoneObj.name : '');

      // ============= BASIC INFORMATION =============
      setName(vehicle.name || '');
      setDescription(vehicle.description || '');
      setBrand(vehicle.brand?._id || '');
      setModel(vehicle.model || '');
      setLicensePlateNumber(vehicle.licensePlateNumber || '');

      // ============= CAPACITY & COMFORT (NESTED) =============
      if (vehicle.capacityAndComfort) {
        setSeatingCapacity(vehicle.capacityAndComfort.seatingCapacity?.toString() || '');
        setPushbackSeats(vehicle.capacityAndComfort.pushbackSeats ? 'yes' : 'no');
        setReclinerSeats(vehicle.capacityAndComfort.reclinerSeats ? 'yes' : 'no');

        // Add these if you have state for them:
        // setLegroomType(vehicle.capacityAndComfort.legroomType || '');
        // setNumberOfSeats(vehicle.capacityAndComfort.numberOfSeats?.value?.toString() || '');
        // setNumberOfDoors(vehicle.capacityAndComfort.numberOfDoors?.value?.toString() || '');
      }

      // ============= ENGINE CHARACTERISTICS (NESTED) =============
      if (vehicle.engineCharacteristics) {
        setTransmissionType(vehicle.engineCharacteristics.transmissionType?.value || '');
        setEnginePower(vehicle.engineCharacteristics.powerBHP?.toString() || '');
        setEngineCapacity(vehicle.engineCharacteristics.engineCapacityCC?.toString() || '');
        setTorque(vehicle.engineCharacteristics.torque || '');
        setMileage(vehicle.engineCharacteristics.mileage || '');
        setFuelType(vehicle.engineCharacteristics.fuelType || '');
        setAirCondition(vehicle.engineCharacteristics.airConditioning ? 'yes' : 'no');
      }

      // ============= LOCATION (NESTED) =============
      if (vehicle.location) {
        setVenueAddress(vehicle.location.address || '');
        setLatitude(vehicle.location.latitude?.toString() || '');
        setLongitude(vehicle.location.longitude?.toString() || '');
      }

      // ============= AVAILABILITY (NESTED) =============
      if (vehicle.availability) {
        setFeatures((prev) => ({
          ...prev,
          driverIncluded: vehicle.availability.driverIncluded ?? false,
          sunroof: vehicle.availability.sunroof ?? false
        }));

        if (vehicle.availability.acAvailable !== undefined) {
          setAirCondition(vehicle.availability.acAvailable ? 'yes' : 'no');
        }
      }

      // ============= FEATURES (CATEGORY-SPECIFIC - NESTED) =============
      if (vehicle.features) {
        // BUS FEATURES
        if (vehicle.features.interiorFeatures) {
          setBusFeatures((prev) => ({
            ...prev,
            curtains: vehicle.features.interiorFeatures.curtains ?? false,
            readingLights: vehicle.features.interiorFeatures.readingLights ?? false,
            footRest: vehicle.features.interiorFeatures.footRest ?? false,
            bottleHolder: vehicle.features.interiorFeatures.bottleHolder ?? false
          }));
        }

        if (vehicle.features.entertainment) {
          setBusFeatures((prev) => ({
            ...prev,
            musicSystem: vehicle.features.entertainment.musicSystem ?? false,
            microphone: vehicle.features.entertainment.microphone ?? false,
            ledDisplay: vehicle.features.entertainment.lcdDisplay ?? false,
            tvScreen: vehicle.features.entertainment.tvScreen ?? false
          }));
        }

        if (vehicle.features.safetyAndCompliance) {
          setBusFeatures((prev) => ({
            ...prev,
            fireExtinguisher: vehicle.features.safetyAndCompliance.fireExtinguisher ?? false,
            firstAidKit: vehicle.features.safetyAndCompliance.firstAidKit ?? false,
            ledEmergencyExit: vehicle.features.safetyAndCompliance.emergencyExit ?? false,
            cctv: vehicle.features.safetyAndCompliance.cctv ?? false
          }));
        }

        if (vehicle.features.storage) {
          setBusFeatures((prev) => ({
            ...prev,
            luggageCarrier: vehicle.features.storage.luggageCarrier ?? false,
            overheadStorage: vehicle.features.storage.overheadStorage ?? false
          }));
        }

        // CAR FEATURES
        if (vehicle.features.interiorComfort) {
          setCarFeatures((prev) => ({
            ...prev,
            leatherSeats: vehicle.features.interiorComfort.leatherSeats ?? false,
            adjustableSeats: vehicle.features.interiorComfort.adjustableSeats ?? false,
            armrest: vehicle.features.interiorComfort.armrest ?? false
          }));
        }

        if (vehicle.features.entertainment) {
          setCarFeatures((prev) => ({
            ...prev,
            musicSystem: vehicle.features.entertainment.musicSystem ?? false,
            bluetooth: vehicle.features.entertainment.bluetooth ?? false,
            usbAux: vehicle.features.entertainment.usbAux ?? false
          }));
        }

        if (vehicle.features.safety) {
          setCarFeatures((prev) => ({
            ...prev,
            airbags: vehicle.features.safety.airbags ?? false,
            abs: vehicle.features.safety.abs ?? false,
            rearCamera: vehicle.features.safety.rearCamera ?? false,
            parkingSensors: vehicle.features.safety.parkingSensors ?? false
          }));
        }

        if (vehicle.features.convenience) {
          setCarFeatures((prev) => ({
            ...prev,
            powerWindows: vehicle.features.convenience.powerWindows ?? false,
            centralLock: vehicle.features.convenience.centralLock ?? false,
            keylessEntry: vehicle.features.convenience.keylessEntry ?? false
          }));
        }

        // VAN FEATURES
        if (vehicle.features.interiorFeatures) {
          setVanFeatures((prev) => ({
            ...prev,
            curtains: vehicle.features.interiorFeatures.curtains ?? false,
            readingLights: vehicle.features.interiorFeatures.readingLights ?? false,
            footRest: vehicle.features.interiorFeatures.footRest ?? false,
            bottleHolder: vehicle.features.interiorFeatures.bottleHolder ?? false
          }));
        }

        if (vehicle.features.entertainment) {
          setVanFeatures((prev) => ({
            ...prev,
            musicSystem: vehicle.features.entertainment.musicSystem ?? false,
            tvScreen: vehicle.features.entertainment.tvScreen ?? false
          }));
        }

        if (vehicle.features.safetyAndCompliance) {
          setVanFeatures((prev) => ({
            ...prev,
            fireExtinguisher: vehicle.features.safetyAndCompliance.fireExtinguisher ?? false,
            firstAidKit: vehicle.features.safetyAndCompliance.firstAidKit ?? false,
            cctv: vehicle.features.safetyAndCompliance.cctv ?? false
          }));
        }

        if (vehicle.features.storage) {
          setVanFeatures((prev) => ({
            ...prev,
            luggageCarrier: vehicle.features.storage.luggageCarrier ?? false,
            overheadStorage: vehicle.features.storage.overheadStorage ?? false
          }));
        }

        // BIKE FEATURES
        if (vehicle.features.safetyAccessories) {
          setBikeFeatures((prev) => ({
            ...prev,
            helmet: vehicle.features.safetyAccessories.helmet ?? false,
            abs: vehicle.features.safetyAccessories.abs ?? false,
            mobileHolder: vehicle.features.safetyAccessories.mobileHolder ?? false
          }));
        }

        if (vehicle.features.utilityStorage) {
          setBikeFeatures((prev) => ({
            ...prev,
            storageBox: vehicle.features.utilityStorage.storageBox ?? false,
            rearRack: vehicle.features.utilityStorage.rearRack ?? false,
            windshield: vehicle.features.utilityStorage.windshield ?? false
          }));
        }
      }

      // ============= EXTRA ADDONS (NESTED) =============
      if (vehicle.extraAddons) {
        const catTitle = vehicle.category?.title?.toLowerCase() || '';

        if (catTitle.includes('bus')) {
          setBusFeatures((prev) => ({
            ...prev,
            wifi: vehicle.extraAddons.wifi ?? false,
            chargingPoints: vehicle.extraAddons.chargingPorts ?? false
          }));
        } else if (catTitle.includes('van')) {
          setVanFeatures((prev) => ({
            ...prev,
            wifi: vehicle.extraAddons.wifi ?? false,
            chargingPoints: vehicle.extraAddons.chargingPorts ?? false
          }));
        } else if (catTitle.includes('car') || catTitle.includes('vehicle')) {
          setCarFeatures((prev) => ({
            ...prev,
            wifi: vehicle.extraAddons.wifi ?? false,
            chargingPoints: vehicle.extraAddons.chargingPorts ?? false
          }));
        }

        setInteriorLighting(vehicle.extraAddons.interiorLighting ? 'premium' : 'normal');
      }

      // ============= PRICING (NESTED) =============
      if (vehicle.pricing) {
        // Basic Package
        if (vehicle.pricing.basicPackage) {
          setBasicPackagePrice(vehicle.pricing.basicPackage.price?.toString() || '');
          setHoursIncluded(vehicle.pricing.basicPackage.includedHours?.toString() || '');
          setKmIncluded(vehicle.pricing.basicPackage.includedKilometers?.toString() || '');
        }

        // Extra Charges
        if (vehicle.pricing.extraKmPrice) {
          setAdditionalPricePerKm(vehicle.pricing.extraKmPrice.price?.toString() || '');
          setAfterKilometer(vehicle.pricing.extraKmPrice.km?.toString() || '');
        }

        // Discount
        if (vehicle.pricing.discount) {
          setDiscountType(vehicle.pricing.discount.type === 'flat_rate' ? 'flat' : 'percentage');
          setDiscount(vehicle.pricing.discount.value?.toString() || '');
        }

        // Decoration
        if (vehicle.pricing.decoration) {
          setFeatures((prev) => ({
            ...prev,
            decorationAvailable: vehicle.pricing.decoration.available ?? false
          }));
          setDecorationPrice(vehicle.pricing.decoration.price?.toString() || '');
        }
      }

      // ============= ADVANCE BOOKING AMOUNT =============
      setAdvanceAmount(vehicle.advanceBookingAmount?.toString() || '');

      // ============= CAR-SPECIFIC FIELDS =============
      if (vehicle.vehicleType) {
        setVehicleType(vehicle.vehicleType);
      }

      // ============= TERMS & CONDITIONS =============
      if (vehicle.termsAndConditions && Array.isArray(vehicle.termsAndConditions) && vehicle.termsAndConditions.length > 0) {
        setTermsSections(
          vehicle.termsAndConditions.map((section) => ({
            heading: section.heading || '',
            points: Array.isArray(section.points) && section.points.length > 0 ? section.points : ['']
          }))
        );
      } else if (typeof vehicle.termsAndConditions === 'string') {
        // Legacy: if it's stored as a single string
        setTermsSections([
          {
            heading: 'Terms & Conditions',
            points: [vehicle.termsAndConditions]
          }
        ]);
      } else {
        // Fallback: create mode or no data
        setTermsSections([{ heading: '', points: [''] }]);
      }

      // ============= SEARCH TAGS =============
      setSearchTags(vehicle.searchTags || []);

      console.log('✅ Vehicle data populated successfully');
    },
    [brands, categories, zones, API_BASE_URL, setBusFeatures, setVanFeatures, setCarFeatures, setBikeFeatures]
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
  const validateLicensePlate = () => {
    setLicensePlateError('');
    return true;
  };

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

    setBusFeatures({
      curtains: false,
      readingLights: false,
      footRest: false,
      bottleHolder: false,

      musicSystem: false,
      microphone: false,
      ledDisplay: false,
      tvScreen: false,

      fireExtinguisher: false,
      firstAidKit: false,
      ledEmergencyExit: false,
      cctv: false,

      luggageCarrier: false,
      overheadStorage: false,

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

      // Validate pricing
      if (isBusCategory || isCarCategory) {
        if (!basicPackagePrice) {
          setToastMessage('Please provide a basic package price.');
          setToastSeverity('error');
          setOpenToast(true);
          setLoading(false);
          return;
        }
      }

      if (!thumbnailFile && !existingThumbnail && !isEdit) {
        setToastMessage('Please upload a featured image.');
        setToastSeverity('error');
        setOpenToast(true);
        setLoading(false);
        return;
      }

      if (newVehicleImages.length === 0 && existingImages.length === 0 && !isEdit) {
        setToastMessage('Please upload at least one gallery image.');
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

      // ==================== PREPARE FORMDATA ====================
      const formData = new FormData();

      // Basic Information
      formData.append('name', name);
      formData.append('description', description);
      formData.append('brand', brand);
      formData.append('category', parentCategory);
      formData.append('subCategory', subCategory);
      formData.append('model', model);

      // ==================== CAPACITY & COMFORT (NESTED) ====================
      formData.append('capacityAndComfort[seatingCapacity]', parseInt(seatingCapacity) || 0);
      formData.append('capacityAndComfort[legroomType]', legroomType || '');

      formData.append('capacityAndComfort[pushbackSeats]', pushbackSeats === 'yes');
      formData.append('capacityAndComfort[reclinerSeats]', reclinerSeats === 'yes');

      // ==================== ENGINE CHARACTERISTICS (NESTED) ====================
      formData.append('engineCharacteristics[transmissionType][value]', transmissionType || '');
      formData.append('engineCharacteristics[transmissionType][available]', !!transmissionType);
      formData.append('engineCharacteristics[powerBHP]', enginePower ? parseInt(enginePower) : 0);
      formData.append('engineCharacteristics[engineCapacityCC]', engineCapacity ? parseInt(engineCapacity) : 0);
      formData.append('engineCharacteristics[torque]', torque || '');
      formData.append('engineCharacteristics[mileage]', mileage || '');
      formData.append('engineCharacteristics[fuelType]', fuelType || '');
      formData.append('engineCharacteristics[airConditioning]', airCondition === 'yes');

      // ==================== LOCATION (NESTED) ====================
      formData.append('location[address]', venueAddress);
      formData.append('location[latitude]', parseFloat(latitude) || 0);
      formData.append('location[longitude]', parseFloat(longitude) || 0);
      formData.append('zone', zone);

      // ==================== AVAILABILITY (NESTED) ====================
      formData.append('availability[driverIncluded]', features.driverIncluded || false);
      formData.append('availability[sunroof]', features.sunroof || false);
      formData.append('availability[acAvailable]', airCondition === 'yes');

      // ==================== FEATURES (CATEGORY-SPECIFIC - NESTED JSON) ====================
      if (isBusCategory) {
        const busFeatureStructure = {
          interiorFeatures: {
            curtains: busFeatures.curtains || false,
            readingLights: busFeatures.readingLights || false,
            footRest: busFeatures.footRest || false,
            mirror: false // Add if you have this field
          },
          entertainment: {
            musicSystem: busFeatures.musicSystem || false,
            microphone: busFeatures.microphone || false,
            lcdDisplay: busFeatures.ledDisplay || false,
            tvScreen: busFeatures.tvScreen || false
          },
          safetyAndCompliance: {
            fireExtinguisher: busFeatures.fireExtinguisher || false,
            firstAidKit: busFeatures.firstAidKit || false,
            emergencyExit: busFeatures.ledEmergencyExit || false,
            cctv: busFeatures.cctv || false
          },
          storage: {
            luggageCarrier: busFeatures.luggageCarrier || false,
            overheadStorage: busFeatures.overheadStorage || false
          }
        };
        formData.append('features', JSON.stringify(busFeatureStructure));
      }

      if (isCarCategory) {
        const carFeatureStructure = {
          interiorComfort: {
            leatherSeats: carFeatures.leatherSeats || false,
            adjustableSeats: carFeatures.adjustableSeats || false,
            armrest: carFeatures.armrest || false
          },
          entertainment: {
            musicSystem: carFeatures.musicSystem || false,
            bluetooth: carFeatures.bluetooth || false,
            usbAux: carFeatures.usbAux || false
          },
          safety: {
            airbags: carFeatures.airbags || false,
            abs: carFeatures.abs || false,
            rearCamera: carFeatures.rearCamera || false,
            parkingSensors: carFeatures.parkingSensors || false
          },
          convenience: {
            powerWindows: carFeatures.powerWindows || false,
            centralLock: carFeatures.centralLock || false,
            keylessEntry: carFeatures.keylessEntry || false
          }
        };
        formData.append('features', JSON.stringify(carFeatureStructure));
      }

      if (isVanCategory) {
        const vanFeatureStructure = {
          interiorFeatures: {
            curtains: vanFeatures.curtains || false,
            readingLights: vanFeatures.readingLights || false,
            footRest: vanFeatures.footRest || false,
            bottleHolder: vanFeatures.bottleHolder || false
          },
          entertainment: {
            musicSystem: vanFeatures.musicSystem || false,
            tvScreen: vanFeatures.tvScreen || false
          },
          safetyAndCompliance: {
            fireExtinguisher: vanFeatures.fireExtinguisher || false,
            firstAidKit: vanFeatures.firstAidKit || false,
            cctv: vanFeatures.cctv || false
          },
          storage: {
            luggageCarrier: vanFeatures.luggageCarrier || false,
            overheadStorage: vanFeatures.overheadStorage || false
          }
        };
        formData.append('features', JSON.stringify(vanFeatureStructure));
      }

      if (isBikeCategory) {
        const bikeFeatureStructure = {
          safetyAccessories: {
            helmet: bikeFeatures.helmet || false,
            abs: bikeFeatures.abs || false,
            mobileHolder: bikeFeatures.mobileHolder || false
          },
          utilityStorage: {
            storageBox: bikeFeatures.storageBox || false,
            rearRack: bikeFeatures.rearRack || false,
            windshield: bikeFeatures.windshield || false
          }
        };
        formData.append('features', JSON.stringify(bikeFeatureStructure));
      }

      // ==================== EXTRA ADDONS (NESTED) ====================
      let wifi = false;
      let chargingPorts = false;
      if (isBusCategory) {
        wifi = busFeatures.wifi;
        chargingPorts = busFeatures.chargingPoints;
      } else if (isVanCategory) {
        wifi = vanFeatures.wifi;
        chargingPorts = vanFeatures.chargingPoints;
      } else if (isCarCategory) {
        wifi = carFeatures.wifi;
        chargingPorts = carFeatures.chargingPoints;
      }
      formData.append('extraAddons[wifi]', wifi);
      formData.append('extraAddons[chargingPorts]', chargingPorts);
      formData.append('extraAddons[interiorLighting]', interiorLighting === 'premium');

      // ==================== PRICING (NESTED) ====================
      formData.append('pricing[basicPackage][price]', parseFloat(basicPackagePrice) || 0);
      formData.append('pricing[basicPackage][includedKilometers]', parseFloat(kmIncluded) || 0);
      formData.append('pricing[basicPackage][includedHours]', parseFloat(hoursIncluded) || 0);

      formData.append('pricing[extraKmPrice][km]', parseFloat(afterKilometer) || 0);
      formData.append('pricing[extraKmPrice][price]', parseFloat(additionalPricePerKm) || 0);

      formData.append('pricing[discount][type]', discountType === 'flat' ? 'flat_rate' : 'percentage');
      formData.append('pricing[discount][value]', parseFloat(discount) || 0);

      formData.append('pricing[decoration][available]', features.decorationAvailable || false);
      formData.append('pricing[decoration][price]', parseFloat(decorationPrice) || 0);

      // ==================== CALCULATE GRAND TOTAL ====================
      const calculateGrandTotal = () => {
        const base = parseFloat(basicPackagePrice) || 0;
        const dec = (features.decorationAvailable && decorationPrice) ? parseFloat(decorationPrice) : 0;
        const disc = parseFloat(discount) || 0;
        let discAmt = 0;

        if (discountType === 'percentage') {
          discAmt = (base * disc) / 100;
        } else if (discountType === 'flat') {
          discAmt = disc;
        }

        return Math.max(base + dec - discAmt, 0);
      };

      formData.append('pricing[grandTotal]', calculateGrandTotal());

      // ==================== ADVANCE BOOKING AMOUNT ====================
      formData.append('advanceBookingAmount', parseFloat(advanceAmount) || 0);

      // ==================== VEHICLE IDENTITY ====================
      formData.append('licensePlateNumber', licensePlateNumber);

      // ==================== CAR-SPECIFIC FIELDS ====================
      if (isCarCategory && vehicleType) {
        formData.append('vehicleType', vehicleType);
      }

      // ==================== TERMS & CONDITIONS ====================
      formData.append('termsAndConditions', JSON.stringify(termsSections));

      // ==================== SEARCH TAGS ====================
      searchTags.forEach((tag) => formData.append('searchTags[]', tag));

      // ==================== FILE UPLOADS ====================
      // Featured Image (was thumbnail)
      if (thumbnailFile) {
        formData.append('featuredImage', thumbnailFile);
      }

      // Gallery Images (was images)
      newVehicleImages.forEach((file) => {
        formData.append('galleryImages', file);
      });

      // ==================== DEBUG LOG ====================
      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        formDataEntries[key] = value instanceof File ? value.name : value;
      }
      console.log('📤 FormData being sent:', formDataEntries);

      // ==================== API CALL ====================
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

        console.log('✅ API Response:', response.data);
        setToastMessage(isEdit ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
        setToastSeverity('success');
        setOpenToast(true);
        handleReset();

        if (isEdit) {
          navigate('/vehicle-setup/lists', { state: { vehicle: newOrUpdatedVehicle } });
        }
      } catch (error) {
        console.error('❌ API Error:', {
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
      description,
      brand,
      model,
      parentCategory,
      subCategory,
      zone,
      seatingCapacity,
      airCondition,
      features,
      decorationPrice,
      licensePlateNumber,
      venueAddress,
      latitude,
      longitude,
      transmissionType,
      enginePower,
      engineCapacity,
      torque,
      mileage,
      vehicleType,
      interiorLighting,
      fuelType,
      pushbackSeats,
      reclinerSeats,
      carFeatures,
      busFeatures,
      basicPackagePrice,
      hoursIncluded,
      kmIncluded,
      additionalPricePerKm,
      afterKilometer,
      discountType,
      discount,
      advanceAmount,
      termsSections,
      searchTags,
      thumbnailFile,
      newVehicleImages,
      existingThumbnail,
      existingImages,
      validateLicensePlate,
      handleReset,
      navigate,
      API_BASE_URL,
      setCarFeatures,
      setBusFeatures,
      setVanFeatures,
      setBikeFeatures,
      isBusCategory,
      isCarCategory,
      isVanCategory,
      isBikeCategory,
      API_BASE_URL,
      zones
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

  // Handle van feature changes
  const handleVanFeatureChange = (feature) => (event) => {
    setVanFeatures((prev) => ({
      ...prev,
      [feature]: event.target.checked
    }));
  };

  // Handle bike feature changes
  const handleBikeFeatureChange = (feature) => (event) => {
    setBikeFeatures((prev) => ({
      ...prev,
      [feature]: event.target.checked
    }));
  };

  // ================= GRAND TOTAL CALCULATION =================
  const basePrice = Number(basicPackagePrice) || 0;
  const decPrice = (features.decorationAvailable && decorationPrice) ? Number(decorationPrice) : 0;
  const discountValue = Number(discount) || 0;

  let discountAmount = 0;

  if (discountType === 'percentage') {
    discountAmount = (basePrice * discountValue) / 100;
  }

  if (discountType === 'flat') {
    discountAmount = discountValue;
  }

  // Prevent discount from exceeding base price
  if (discountAmount > basePrice) {
    discountAmount = basePrice;
  }

  const grandTotal = Math.max(basePrice + decPrice - discountAmount, 0);

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
                  Featured Image*
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
                        alt="Featured image preview"
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
                        alt="Existing featured image"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 100,
                          objectFit: 'contain',
                          marginBottom: theme.spacing(1),
                          borderColor: '#E15B65'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Existing featured image. Upload to replace.
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
                    name="featuredImage"
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
                  Gallery Images<span style={{ color: '#E15B65' }}>*</span>
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload high quality images (JPG, JPEG, PNG • Max 1MB • Ratio 2:1)
                </Typography>

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
                  {existingImages.length > 0 || newVehicleImages.length > 0 ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                        gap: 2,
                        width: '100%'
                      }}
                    >
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

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                    {existingImages.length + newVehicleImages.length} image(s) selected
                  </Typography>

                  <input
                    type="file"
                    id="images-upload"
                    name="galleryImages"
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

                    {/* Show Legroom Type only for Bus and Van */}
                    {(isBusCategory || isVanCategory) && (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="legroom-label">Select Legroom Type</InputLabel>
                        <Select
                          labelId="legroom-label"
                          value={legroomType} // ✅ controlled value
                          label="Select Legroom Type"
                          onChange={(e) => setLegroomType(e.target.value)} // ✅ update state
                        >
                          <MenuItem value="">Select Legroom</MenuItem>
                          <MenuItem value="standard">Standard</MenuItem>
                          <MenuItem value="extra">Extra</MenuItem>
                          <MenuItem value="premium">Premium</MenuItem>
                        </Select>
                      </FormControl>
                    )}

                    {/* Pushback Seats & Recliner Seats - Side by Side for Bus and Van */}
                    {(isBusCategory || isVanCategory) && (
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

                  {isBusCategory || isVanCategory ? (
                    /* BUS & VAN LAYOUT */
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
                  {/* <TextField
                    fullWidth
                    label="Operating Hours"
                    variant="outlined"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    multiline
                    rows={2}
                  /> */}
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* ---------------- Vehicle Attributes ----------------
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
          </Box> */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.grey[200]}` }}>
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
            </Card>
          </Box>
          {/* ================= VEHICLE FEATURES ================= */}
          {/* ================= VEHICLE FEATURES ================= */}
          {isCategorySelected && isCarCategory && (
            <Card
              sx={{
                mt: 6,
                mb: 6,
                borderRadius: 4,
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                backgroundColor: '#ffffff',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  background: 'linear-gradient(135deg, #e9ebef 0%, #b3b7c1 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Vehicle Features & Amenities
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Customize the luxury and comfort options for your vehicle
                  </Typography>
                </Box>
                <DirectionsCarIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>

              {/* Grid Content */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={10} sx={{ width: '100%', m: 0 }}>
                  {[
                    {
                      title: 'Interior Comfort',
                      icon: <ChairIcon />,
                      number: '01',
                      items: [
                        ['Leather Seats', 'leatherSeats'],
                        ['Adjustable Seats', 'adjustableSeats'],
                        ['Armrest', 'armrest']
                      ]
                    },
                    {
                      title: 'Entertainment',
                      icon: <MusicIcon />,
                      number: '02',
                      items: [
                        ['Music System', 'musicSystem'],
                        ['Bluetooth', 'bluetooth'],
                        ['USB / AUX', 'usbAux']
                      ]
                    },
                    {
                      title: 'Safety & Compliance',
                      icon: <SafetyIcon />,
                      number: '03',
                      items: [
                        ['Airbags', 'airbags'],
                        ['ABS', 'abs'],
                        ['Rear Camera', 'rearCamera'],
                        ['Parking Sensors', 'parkingSensors']
                      ]
                    },
                    {
                      title: 'Convenience',
                      icon: <ConvenienceIcon />,
                      number: '04',
                      items: [
                        ['Power Windows', 'powerWindows'],
                        ['Central Lock', 'centralLock'],
                        ['Keyless Entry', 'keylessEntry']
                      ]
                    }
                  ].map((section, idx) => (
                    <Grid item xs={12} sm={12} md={6} lg={6} key={section.title} sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid #f0f0f0',
                          backgroundColor: '#f9fafb',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 20px rgba(0,0,0,0.05)',
                            borderColor: '#E15B65'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              backgroundColor: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                              color: '#E15B65'
                            }}
                          >
                            {section.icon}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 900,
                              color: '#E15B65',
                              opacity: 0.2,
                              fontSize: '1.5rem',
                              lineHeight: 1
                            }}
                          >
                            {section.number}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                          {section.title}
                        </Typography>

                        <Stack spacing={1}>
                          {section.items.map(([label, key]) => (
                            <FormControlLabel
                              key={key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={carFeatures[key]}
                                  onChange={handleCarFeatureChange(key)}
                                  sx={{
                                    color: '#d1d5db',
                                    '&.Mui-checked': { color: '#E15B65' }
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>
                                  {label}
                                </Typography>
                              }
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Extra Addons - Full Width Special Section */}
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)',
                    border: '1px solid #fee2e2'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#E15B65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(225, 91, 101, 0.3)'
                      }}
                    >
                      <WifiIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#991b1b' }}>
                        Premium Add-ons & Lighting
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b91c1c', opacity: 0.8 }}>
                        Special features to enhance the premium feel
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={carFeatures.wifi}
                              onChange={handleCarFeatureChange('wifi')}
                              sx={{ '&.Mui-checked': { color: '#E15B65' } }}
                            />
                          }
                          label={<Typography sx={{ fontWeight: 600 }}>High-Speed Wifi</Typography>}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={carFeatures.chargingPoints}
                              onChange={handleCarFeatureChange('chargingPoints')}
                              sx={{ '&.Mui-checked': { color: '#E15B65' } }}
                            />
                          }
                          label={<Typography sx={{ fontWeight: 600 }}>Charging Points</Typography>}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: 'white',
                          borderRadius: 3,
                          border: '1px solid #fee2e2',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#991b1b', minWidth: 120 }}>
                          Interior Lighting
                        </Typography>
                        <RadioGroup row value={interiorLighting} onChange={(e) => setInteriorLighting(e.target.value)}>
                          <FormControlLabel
                            value="normal"
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#E15B65' } }} />}
                            label={<Typography variant="body2">Standard</Typography>}
                          />
                          <FormControlLabel
                            value="premium"
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#E15B65' } }} />}
                            label={<Typography variant="body2">Premium RGB</Typography>}
                          />
                        </RadioGroup>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Card>
          )}
          {isCategorySelected && isBusCategory && (
            <Card
              sx={{
                mt: 6,
                mb: 6,
                borderRadius: 4,
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                backgroundColor: '#ffffff',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  background: 'linear-gradient(135deg, #ecedf1 0%, #adb0ba 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Bus Features & Amenities
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Configure passenger comfort and safety options for the bus
                  </Typography>
                </Box>
                <SpeakerIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>

              {/* Grid Content */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={10} sx={{ width: '100%', m: 0 }}>
                  {[
                    {
                      title: 'Interior Comfort',
                      icon: <ChairIcon />,
                      number: '01',
                      items: [
                        ['Curtains', 'curtains'],
                        ['Reading Lights', 'readingLights'],
                        ['Foot Rest', 'footRest'],
                        ['Bottle Holder', 'bottleHolder']
                      ]
                    },
                    {
                      title: 'Entertainment',
                      icon: <TvIcon />,
                      number: '02',
                      items: [
                        ['Music System', 'musicSystem'],
                        ['Microphone', 'microphone'],
                        ['LED Display', 'ledDisplay'],
                        ['TV / Screen', 'tvScreen']
                      ]
                    },
                    {
                      title: 'Safety & Compliance',
                      icon: <SafetyIcon />,
                      number: '03',
                      items: [
                        ['Fire Extinguisher', 'fireExtinguisher'],
                        ['First Aid Kit', 'firstAidKit'],
                        ['LED Emergency Exit', 'ledEmergencyExit'],
                        ['CCTV', 'cctv']
                      ]
                    },
                    {
                      title: 'Storage & Utilities',
                      icon: <LuggageIcon />,
                      number: '04',
                      items: [
                        ['Luggage Carrier', 'luggageCarrier'],
                        ['Overhead Storage', 'overheadStorage']
                      ]
                    }
                  ].map((section) => (
                    <Grid item xs={12} sm={12} md={6} lg={3} key={section.title} sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid #f0f0f0',
                          backgroundColor: '#f8fafc',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 20px rgba(0,0,0,0.05)',
                            borderColor: '#98a0bc'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              backgroundColor: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                              color: '#7882a3'
                            }}
                          >
                            {section.icon}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 900,
                              color: '#1e40af',
                              opacity: 0.1,
                              fontSize: '1.5rem',
                              lineHeight: 1
                            }}
                          >
                            {section.number}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                          {section.title}
                        </Typography>

                        <Stack spacing={1}>
                          {section.items.map(([label, key]) => (
                            <FormControlLabel
                              key={key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={busFeatures[key]}
                                  onChange={handleBusFeatureChange(key)}
                                  sx={{
                                    color: '#d1d5db',
                                    '&.Mui-checked': { color: '#1e40af' }
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>
                                  {label}
                                </Typography>
                              }
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Extra Addons - Full Width Special Section */}
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '1px solid #bfdbfe'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#42454f',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
                      }}
                    >
                      <WifiIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                        Premium Add-ons & Lighting
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#1e40af', opacity: 0.8 }}>
                        Special connectivity and ambient features for passengers
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={busFeatures.wifi}
                              onChange={handleBusFeatureChange('wifi')}
                              sx={{ '&.Mui-checked': { color: '#1e40af' } }}
                            />
                          }
                          label={<Typography sx={{ fontWeight: 600 }}>Guest Wifi</Typography>}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={busFeatures.chargingPoints}
                              onChange={handleBusFeatureChange('chargingPoints')}
                              sx={{ '&.Mui-checked': { color: '#1e40af' } }}
                            />
                          }
                          label={<Typography sx={{ fontWeight: 600 }}>USB Charging ports</Typography>}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: 'white',
                          borderRadius: 3,
                          border: '1px solid #bfdbfe',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e3a8a', minWidth: 120 }}>
                          Interior Lighting
                        </Typography>
                        <RadioGroup row value={interiorLighting} onChange={(e) => setInteriorLighting(e.target.value)}>
                          <FormControlLabel
                            value="normal"
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#1e40af' } }} />}
                            label={<Typography variant="body2">Normal</Typography>}
                          />
                          <FormControlLabel
                            value="premium"
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#1e40af' } }} />}
                            label={<Typography variant="body2">Premium Ambient</Typography>}
                          />
                        </RadioGroup>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Card>
          )}
          {isCategorySelected && isVanCategory && (
            <Card
              sx={{
                mt: 6,
                mb: 6,
                borderRadius: 4,
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                backgroundColor: '#ffffff',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  background: 'linear-gradient(135deg, #ecedf1 0%, #adb0ba 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Van Features & Amenities
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Configure passenger comfort and safety options for the van
                  </Typography>
                </Box>
                <SpeakerIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>

              {/* Grid Content */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={10} sx={{ width: '100%', m: 0 }}>
                  {[
                    {
                      title: 'Interior Comfort',
                      icon: <ChairIcon />,
                      number: '01',
                      items: [
                        ['Curtains', 'curtains'],
                        ['Reading Lights', 'readingLights'],
                        ['Foot Rest', 'footRest'],
                        ['Bottle Holder', 'bottleHolder']
                      ]
                    },
                    {
                      title: 'Entertainment',
                      icon: <TvIcon />,
                      number: '02',
                      items: [
                        ['Music System', 'musicSystem'],
                        ['TV / Screen', 'tvScreen']
                      ]
                    },
                    {
                      title: 'Safety & Compliance',
                      icon: <SafetyIcon />,
                      number: '03',
                      items: [
                        ['Fire Extinguisher', 'fireExtinguisher'],
                        ['First Aid Kit', 'firstAidKit'],
                        ['CCTV', 'cctv']
                      ]
                    },
                    {
                      title: 'Storage & Utilities',
                      icon: <LuggageIcon />,
                      number: '04',
                      items: [
                        ['Luggage Carrier', 'luggageCarrier'],
                        ['Overhead Storage', 'overheadStorage']
                      ]
                    }
                  ].map((section) => (
                    <Grid item xs={12} sm={12} md={6} lg={3} key={section.title} sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid #f0f0f0',
                          backgroundColor: '#f8fafc',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 20px rgba(0,0,0,0.05)',
                            borderColor: '#98a0bc'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              backgroundColor: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                              color: '#7882a3'
                            }}
                          >
                            {section.icon}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 900,
                              color: '#1e40af',
                              opacity: 0.1,
                              fontSize: '1.5rem',
                              lineHeight: 1
                            }}
                          >
                            {section.number}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                          {section.title}
                        </Typography>

                        <Stack spacing={1}>
                          {section.items.map(([label, key]) => (
                            <FormControlLabel
                              key={key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={vanFeatures[key]}
                                  onChange={handleVanFeatureChange(key)}
                                  sx={{
                                    color: '#d1d5db',
                                    '&.Mui-checked': { color: '#1e40af' }
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>
                                  {label}
                                </Typography>
                              }
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Extra Addons - Full Width Special Section */}
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '1px solid #bfdbfe'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#42454f',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
                      }}
                    >
                      <WifiIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                        Premium Add-ons & Lighting
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#1e40af', opacity: 0.8 }}>
                        Special connectivity and ambient features for passengers
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={vanFeatures.wifi}
                              onChange={handleVanFeatureChange('wifi')}
                              sx={{ '&.Mui-checked': { color: '#1e40af' } }}
                            />
                          }
                          label={<Typography sx={{ fontWeight: 600 }}>Guest Wifi</Typography>}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={vanFeatures.chargingPoints}
                              onChange={handleVanFeatureChange('chargingPoints')}
                              sx={{ '&.Mui-checked': { color: '#1e40af' } }}
                            />
                          }
                          label={<Typography sx={{ fontWeight: 600 }}>USB Charging ports</Typography>}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: 'white',
                          borderRadius: 3,
                          border: '1px solid #bfdbfe',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e3a8a', minWidth: 120 }}>
                          Interior Lighting
                        </Typography>
                        <RadioGroup row value={interiorLighting} onChange={(e) => setInteriorLighting(e.target.value)}>
                          <FormControlLabel
                            value="normal"
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#1e40af' } }} />}
                            label={<Typography variant="body2">Normal</Typography>}
                          />
                          <FormControlLabel
                            value="premium"
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#1e40af' } }} />}
                            label={<Typography variant="body2">Premium Ambient</Typography>}
                          />
                        </RadioGroup>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Card>
          )}

          {isCategorySelected && isBikeCategory && (
            <Card
              sx={{
                mt: 6,
                mb: 6,
                borderRadius: 4,
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                backgroundColor: '#ffffff',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  background: 'linear-gradient(135deg, #e9ebef 0%, #b3b7c1 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Bike Features & Amenities
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Customize safety and utility options for your bike
                  </Typography>
                </Box>
                <DirectionsCarIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>

              {/* Grid Content */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={10} sx={{ width: '100%', m: 0 }}>
                  {[
                    {
                      title: 'Safety & Accessories',
                      icon: <SafetyIcon />,
                      number: '01',
                      items: [
                        ['Helmet Included', 'helmet'],
                        ['ABS', 'abs'],
                        ['Mobile Holder', 'mobileHolder']
                      ]
                    },
                    {
                      title: 'Utility & Storage',
                      icon: <LuggageIcon />,
                      number: '02',
                      items: [
                        ['Storage Box (Top Box)', 'storageBox'],
                        ['Rear Rack', 'rearRack'],
                        ['Windshield', 'windshield']
                      ]
                    }
                  ].map((section, idx) => (
                    <Grid item xs={12} sm={12} md={6} lg={6} key={section.title} sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid #f0f0f0',
                          backgroundColor: '#f9fafb',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 20px rgba(0,0,0,0.05)',
                            borderColor: '#E15B65'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              backgroundColor: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                              color: '#E15B65'
                            }}
                          >
                            {section.icon}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 900,
                              color: '#E15B65',
                              opacity: 0.2,
                              fontSize: '1.5rem',
                              lineHeight: 1
                            }}
                          >
                            {section.number}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                          {section.title}
                        </Typography>

                        <Stack spacing={1}>
                          {section.items.map(([label, key]) => (
                            <FormControlLabel
                              key={key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={bikeFeatures[key]}
                                  onChange={handleBikeFeatureChange(key)}
                                  sx={{
                                    color: '#d1d5db',
                                    '&.Mui-checked': { color: '#E15B65' }
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>
                                  {label}
                                </Typography>
                              }
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          )}

          {isCategorySelected && (isCarCategory || isBusCategory || isVanCategory || isBikeCategory) && (
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
                {/* Header */}
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
                  <Stack spacing={3}>
                    {/* Row 1: Package Details & Offers */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        border: '2px solid #e5e7eb',
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

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        {/* Basic Package Info */}
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            backgroundColor: '#fef3f2',
                            border: '1px solid #fecaca',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#991b1b', mb: 2 }}>
                            Basic Package
                          </Typography>
                          <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            <TextField
                              fullWidth
                              label="Base Package Price"
                              type="number"
                              value={basicPackagePrice}
                              onChange={(e) => setBasicPackagePrice(e.target.value)}
                              placeholder="0"
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 0.5, color: '#E15B65', fontWeight: 600 }}>₹</Typography>
                              }}
                              size="small"
                            />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, mt: 3 }}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Hours Included</InputLabel>
                                <Select value={hoursIncluded} label="Hours Included" onChange={(e) => setHoursIncluded(e.target.value)}>
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="4">4 Hrs</MenuItem>
                                  <MenuItem value="6">6 Hrs</MenuItem>
                                  <MenuItem value="8">8 Hrs</MenuItem>
                                  <MenuItem value="10">10 Hrs</MenuItem>
                                  <MenuItem value="12">12 Hrs</MenuItem>
                                </Select>
                              </FormControl>

                              <FormControl fullWidth size="small">
                                <InputLabel>KM Included</InputLabel>
                                <Select value={kmIncluded} label="KM Included" onChange={(e) => setKmIncluded(e.target.value)}>
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="50">50 KM</MenuItem>
                                  <MenuItem value="100">100 KM</MenuItem>
                                  <MenuItem value="150">150 KM</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </Stack>
                        </Box>

                        {/* Apply Discount */}
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#15803d', mb: 2 }}>
                            Apply Discount
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
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

                          {/* Grand Total Summary */}
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #e3dedf 0%, #ceaaad 100%)',
                              textAlign: 'center',
                              boxShadow: '0 4px 14px rgba(225, 91, 101, 0.25)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              minHeight: 160
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 0.5
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(255,255,255,0.35)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 1
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: '#000'
                                  }}
                                >
                                  Σ
                                </Typography>
                              </Box>

                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 700,
                                  color: '#000'
                                }}
                              >
                                GRAND TOTAL
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: '1.6rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                color: '#000'
                              }}
                            >
                              ₹ {grandTotal}
                            </Typography>

                            {discountAmount > 0 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: '#6b7280',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Original: ₹ {basePrice}
                              </Typography>
                            )}

                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: '#000'
                              }}
                            >
                              {discountAmount > 0 ? `Discount Applied: ₹ ${discountAmount}` : 'Base Price'}
                            </Typography>

                            <Box
                              sx={{
                                mt: 2,
                                pt: 1.5,
                                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5
                              }}
                            >
                              <Typography sx={{ fontSize: '0.9rem' }}>💡</Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1.3 }}>
                                Final amount based on base price and discounts
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Row 3: Extra Charges & Advance */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        border: '2px solid #e5e7eb',
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

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                        {/* Extra Charges */}
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            backgroundColor: '#fff7ed',
                            border: '1px solid #fed7aa',
                            height: '100%'
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#9a3412', mb: 2 }}>
                            Extra Charges
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                              fullWidth
                              label="Price/KM"
                              type="number"
                              value={additionalPricePerKm}
                              onChange={(e) => setAdditionalPricePerKm(e.target.value)}
                              placeholder="0"
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

                        {/* Advance Booking */}
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            height: '100%'
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
                      </Box>
                    </Box>
                  </Stack>
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
