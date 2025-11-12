import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  InputAdornment,
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

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
    borderColor: '#E15B65',
  },
  '& input[type="file"]': {
    display: 'none',
  },
}));

const ImagePreviewContainer = styled(Box)({
  position: 'relative',
  display: 'inline-block',
});

// Helper function to get providerId from localStorage
const getProviderId = () => {
  let providerId = localStorage.getItem('providerId');
  
  // Fallback: Try to extract from user object if providerId is not directly available
  if (!providerId) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const logRes = localStorage.getItem('logRes');
        
        // Try different possible locations for providerId
        if (logRes) {
          providerId = user.profile?._id || user._id;
        } else {
          providerId = user.providerId || user._id;
        }
        
        // Store it for future use
        if (providerId) {
          localStorage.setItem('providerId', providerId);
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }
  
  return providerId;
};

const AddNewMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('form');
  const [formData, setFormData] = useState({
    packageTitle: '',
    subtitle: '',
    description: '',
    startingPrice: '',
  });
  const [menuSections, setMenuSections] = useState([
    { id: Date.now(), heading: '', includes: '' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryMap, setCategoryMap] = useState({});
  const API_BASE_URL = 'https://api.bookmyevent.ae';

  const getImageUrl = (path) => {
    if (!path) return '/placeholder.jpg';
    let normalized = path.toLowerCase().replace(/^uploads/i, '/uploads');
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    return `${API_BASE_URL}${normalized}`;
  };

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const moduleId = localStorage.getItem('moduleId');
        const headers = { Accept: 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(
          `${API_BASE_URL}/api/categories/modules/${moduleId}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formattedCategories = data.data.map((category) => ({
            value: category._id,
            label: category.title || category.name,
          }));
          setAvailableCategories(formattedCategories);
          const map = {};
          data.data.forEach((category) => {
            map[category._id] = category.title || category.name;
          });
          setCategoryMap(map);
        } else {
          setAvailableCategories([]);
          setCategoryMap({});
        }
        setLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setAvailableCategories([]);
        setCategoryMap({});
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (location.state?.editPackage) {
      const pkg = location.state.editPackage;
      setCurrentPackage(pkg);
      populateForm(pkg);
    }
  }, [location.state]);

  useEffect(() => {
    if (currentPackage && availableCategories.length > 0 && !selectedCategory && currentPackage.categories?.length > 0) {
      const categoryId = currentPackage.categories[0]?._id || currentPackage.categories[0];
      const categoryObj = availableCategories.find((cat) => cat.value === categoryId);
      if (categoryObj) {
        setSelectedCategory(categoryObj);
      }
    }
  }, [availableCategories, currentPackage, selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuChange = (id, field, value) => {
    setMenuSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const addMenuSection = () => {
    setMenuSections((prev) => [
      ...prev,
      { id: Date.now(), heading: '', includes: '' },
    ]);
  };

  const deleteMenuSection = (id) => {
    setMenuSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleGalleryChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setGalleryFiles((prev) => [...prev, ...newFiles]);
  };

  const deleteGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const populateForm = (pkg) => {
    setFormData({
      packageTitle: pkg.title || '',
      subtitle: pkg.subtitle || '',
      description: pkg.description || '',
      startingPrice: pkg.price?.toString() || '',
    });
    setMenuSections(
      (pkg.includes || []).map((inc, index) => ({
        id: Date.now() + index,
        heading: inc.title || '',
        includes: inc.items?.join(', ') || '',
      }))
    );
    const categoryObj = pkg.categories?.[0];
    if (categoryObj) {
      setSelectedCategory({ value: categoryObj._id || categoryObj, label: categoryObj.title || categoryObj.name || '' });
    } else {
      setSelectedCategory(null);
    }
    setThumbnailFile(null);
    setGalleryFiles([]);
  };

  const handleEdit = () => {
    if (currentPackage) {
      populateForm(currentPackage);
    }
    setViewMode('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setToastMessage('No authentication token found. Please log in.');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    
    const providerId = getProviderId();
    const moduleId = localStorage.getItem('moduleId');
    
    if (!providerId) {
      setToastMessage('Provider ID is missing. Please log in again.');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }
    
    console.log('Using providerId:', providerId);
    
    const transformedIncludes = menuSections
      .filter((s) => s.includes.trim())
      .map((s) => ({
        title: s.heading.trim() || 'Menu Item',
        items: s.includes.split(',').map(item => item.trim()).filter(item => item)
      }));
    const price = parseFloat(formData.startingPrice) || 0;
    const cateringFormData = new FormData();
    cateringFormData.append('providerId', providerId);
    cateringFormData.append('module', moduleId || '');
    cateringFormData.append('title', formData.packageTitle || 'Custom Package');
    cateringFormData.append('subtitle', formData.subtitle || '');
    cateringFormData.append('description', formData.description || '');
    cateringFormData.append('cateringType', 'custom');
    cateringFormData.append('includes', JSON.stringify(transformedIncludes));
    if (selectedCategory) {
      cateringFormData.append('categories', JSON.stringify([selectedCategory.value]));
    } else {
      cateringFormData.append('categories', JSON.stringify([]));
    }
    cateringFormData.append('price', price.toString());
    if (thumbnailFile) {
      cateringFormData.append('thumbnail', thumbnailFile);
    }
    galleryFiles.forEach((file) => {
      cateringFormData.append('images', file);
    });
    const isEdit = !!currentPackage?._id;
    const url = isEdit ? `${API_BASE_URL}/api/catering/${currentPackage._id}` : `${API_BASE_URL}/api/catering`;
    const method = isEdit ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        body: cateringFormData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }
      if (response.ok) {
        setFormData({
          packageTitle: '',
          subtitle: '',
          description: '',
          startingPrice: '',
        });
        setMenuSections([
          { id: Date.now(), heading: '', includes: '' },
        ]);
        setSelectedCategory(null);
        setThumbnailFile(null);
        setGalleryFiles([]);
        setCurrentPackage(result.data);
        setViewMode('preview');
        setToastMessage(result.message || `Catering ${isEdit ? 'updated' : 'created'} successfully!`);
        setToastSeverity('success');
        setOpenToast(true);
      } else {
        throw new Error(result.error || result.message || 'Failed to save catering');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setToastMessage(`Error saving catering: ${error.message}`);
      setToastSeverity('error');
      setOpenToast(true);
    }
  };

  if (viewMode === 'preview' && currentPackage) {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
        <Box sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3, overflowX: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              Package Preview
            </Typography>
          </Box>
          <Box sx={{ position: 'relative', mb: 3 }}>
            <img
              src={getImageUrl(currentPackage.thumbnail)}
              alt={currentPackage.title}
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.jpg';
              }}
            />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white', p: 2 }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {currentPackage.title || 'Untitled Package'}
              </Typography>
              <Typography variant="body2">
                {currentPackage.subtitle || 'Traditional Style'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
            {currentPackage.description || 'No description available.'}
          </Typography>
          {currentPackage.categories && currentPackage.categories.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Category</Typography>
              <Chip label={currentPackage.categories[0]?.title || currentPackage.categories[0] || 'Uncategorized'} variant="outlined" color="primary" />
            </Box>
          )}
          <Typography variant="h6" sx={{ mb: 2 }}>Includes</Typography>
          {(currentPackage.includes || []).map((inc, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                {inc.title || 'Untitled Section'}
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 0 }}>
                {inc.items?.map((item, itemIndex) => (
                  <Typography key={itemIndex} variant="body2" component="li">
                    {item}
                  </Typography>
                )) || <Typography variant="body2" color="text.secondary">No items</Typography>}
              </Stack>
            </Box>
          ))}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Starting Price</Typography>
            <Typography variant="h4" color="primary">
              ₹{currentPackage.price || 0} Per Head
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Gallery</Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {(currentPackage.images || []).slice(0, 6).map((img, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={getImageUrl(img)}
                    alt={`Gallery image ${index + 1}`}
                    style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </Box>
              ))}
              {(!currentPackage.images || currentPackage.images.length === 0) && (
                <Typography variant="body2" color="text.secondary">No images</Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit} sx={{ color: '#E15B65', borderColor: '#E15B65' }}>
              Edit Menu
            </Button>
          </Box>
          <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
              {toastMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3, overflowX: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {currentPackage && (
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h5" component="h1">
            {currentPackage ? 'Edit Menu' : 'Add New Menu'}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Package Title" name="packageTitle" value={formData.packageTitle} onChange={handleInputChange} placeholder="Type package title" sx={{ mb: 2 }} variant="outlined" />
          <TextField fullWidth label="Subtitle" name="subtitle" value={formData.subtitle} onChange={handleInputChange} placeholder="Type subtitle" sx={{ mb: 2 }} variant="outlined" />
          <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Type description" multiline rows={3} sx={{ mb: 2 }} variant="outlined" />
          <Autocomplete
            fullWidth
            options={availableCategories}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                placeholder={loadingCategories ? "Loading categories..." : "Select a category"}
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loadingCategories}
              />
            )}
          />
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Menu List</Typography>
              <Button variant="contained" size="small" onClick={addMenuSection} startIcon={<AddIcon />} sx={{ backgroundColor: '#E15B65', color: 'white' }}>
                Add
              </Button>
            </Box>
            {menuSections.map((section) => (
              <Box key={section.id} sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: 1, p: 2, mb: 2 }}>
                <TextField fullWidth label="Add heading here" value={section.heading} onChange={(e) => handleMenuChange(section.id, 'heading', e.target.value)} sx={{ mb: 2 }} variant="outlined" />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField fullWidth label="Includes" value={section.includes} onChange={(e) => handleMenuChange(section.id, 'includes', e.target.value)} multiline rows={3} sx={{ flex: 1 }} variant="outlined" placeholder="Enter items separated by commas" />
                  <IconButton onClick={() => deleteMenuSection(section.id)} color="error" sx={{ alignSelf: 'flex-end' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Thumbnail Image</Typography>
              <UploadDropArea onClick={() => document.getElementById('thumbnail-upload').click()}>
                {thumbnailFile ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <ImagePreviewContainer>
                      <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail preview" style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }} />
                      <IconButton onClick={clearThumbnail} size="small" sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'white', color: 'error', boxShadow: theme.shadows[2] }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ImagePreviewContainer>
                    <Typography variant="body2" color="text.secondary">{thumbnailFile.name}</Typography>
                  </Box>
                ) : currentPackage?.thumbnail ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <img src={getImageUrl(currentPackage.thumbnail)} alt="Current thumbnail" style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }} />
                    <Typography variant="body2" color="text.secondary">Current thumbnail. Click to replace.</Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                    <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
                    <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
                  </Box>
                )}
                <input type="file" id="thumbnail-upload" hidden accept="image/jpeg,image/png,image/jpg" onChange={handleThumbnailChange} />
              </UploadDropArea>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Gallery Images</Typography>
              <UploadDropArea onClick={() => document.getElementById('gallery-upload').click()}>
                {galleryFiles.length > 0 ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ justifyContent: 'center', mb: 1 }}>
                      {galleryFiles.map((file, index) => (
                        <ImagePreviewContainer key={index}>
                          <img src={URL.createObjectURL(file)} alt={`Gallery preview ${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />
                          <IconButton onClick={() => deleteGalleryFile(index)} size="small" sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'white', color: 'error', boxShadow: theme.shadows[2] }}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </ImagePreviewContainer>
                      ))}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{galleryFiles.length} image(s) selected</Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                    <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>Click to upload</Typography>
                    <Typography variant="body2" color="text.secondary">Or drag and drop</Typography>
                  </Box>
                )}
                <input type="file" id="gallery-upload" hidden accept="image/jpeg,image/png,image/jpg" multiple onChange={handleGalleryChange} />
              </UploadDropArea>
              {currentPackage?.images?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">Existing Images</Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1}>
                    {currentPackage.images.map((img, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img src={getImageUrl(img)} alt={`Existing gallery ${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField fullWidth label="₹ Price (Starting From)" name="startingPrice" value={formData.startingPrice} onChange={handleInputChange} type="number" inputProps={{ min: 0 }} InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="body2" color="text.secondary">Per Head</Typography></InputAdornment> }} variant="outlined" />
          </Box>
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#E15B65', color: 'white', py: 1.5 }}>
            {currentPackage ? 'Update Menu' : 'Create Menu'}
          </Button>
        </Box>
        <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddNewMenu;