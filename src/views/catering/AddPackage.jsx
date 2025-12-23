import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Stack, InputAdornment, Snackbar, Alert, Autocomplete, Chip } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Close as CloseIcon
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
    borderColor: '#E15B65'
  },
  '& input[type="file"]': {
    display: 'none'
  }
}));

const ImagePreviewContainer = styled(Box)({
  position: 'relative',
  display: 'inline-block'
});

// ------------------------- Helpers -------------------------
const API_BASE_URL = 'https://api.bookmyevent.ae';

// Simple and reliable providerId fetch: Option 1 (user._id)
const getProviderId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    // provider is the user's _id when vendor is logged in
    return user?._id || null;
  } catch (err) {
    console.error('getProviderId parse error', err);
    return null;
  }
};

const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
};

const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  let normalized = String(path || '')
    .toLowerCase()
    .replace(/^uploads/i, '/uploads');
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  return `${API_BASE_URL}${normalized}`;
};

// populate a simple category formatter
const formatCategoriesForAutocomplete = (categories = []) =>
  categories.map((c) => ({ value: c._id, label: c.title || c.name || 'Untitled' }));

// ------------------------- Component -------------------------
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
    advanceBookingAmount: ''
  });

  const [menuSections, setMenuSections] = useState([{ id: Date.now(), heading: '', includes: '' }]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const [currentPackage, setCurrentPackage] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // fetch categories for current module (moduleId stored in localStorage by your flow)
  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const token = getAuthToken();
        const moduleId = localStorage.getItem('moduleId');
        if (!moduleId) {
          console.warn('No moduleId in localStorage');
        }

        const headers = { Accept: 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const url = moduleId ? `${API_BASE_URL}/api/categories/modules/${moduleId}` : `${API_BASE_URL}/api/categories`;

        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`Failed to load categories: ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          if (json.success && Array.isArray(json.data)) {
            const formatted = formatCategoriesForAutocomplete(json.data);
            setAvailableCategories(formatted);

            const map = {};
            (json.data || []).forEach((c) => {
              map[c._id] = c.title || c.name || '';
            });
            setCategoryMap(map);
          } else {
            setAvailableCategories([]);
            setCategoryMap({});
          }
        }
      } catch (err) {
        console.error('fetchCategories error', err);
        setAvailableCategories([]);
        setCategoryMap({});
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  // if we navigate here with editPackage in location.state
  useEffect(() => {
    if (location.state?.editPackage) {
      const pkg = location.state.editPackage;
      setCurrentPackage(pkg);
      populateForm(pkg);
    }
  }, [location.state]);

  // when categories load, preselect from currentPackage
  useEffect(() => {
    if (currentPackage && availableCategories.length > 0 && !selectedCategory && currentPackage.categories?.length > 0) {
      const catId = currentPackage.categories[0]?._id || currentPackage.categories[0];
      const found = availableCategories.find((c) => c.value === catId);
      if (found) setSelectedCategory(found);
      else setSelectedCategory({ value: catId, label: categoryMap[catId] || 'Uncategorized' });
    }
  }, [availableCategories, currentPackage]);

  const populateForm = (pkg) => {
    setFormData({
      packageTitle: pkg.title || '',
      subtitle: pkg.subtitle || '',
      description: pkg.description || '',
      startingPrice: pkg.price?.toString() || '',
      advanceBookingAmount: pkg.advanceBookingAmount?.toString() || '' // ✅
    });

    setMenuSections(
      (pkg.includes || []).map((inc, i) => ({ id: Date.now() + i, heading: inc.title || '', includes: (inc.items || []).join(', ') }))
    );

    const categoryObj = pkg.categories?.[0];
    if (categoryObj) {
      setSelectedCategory({ value: categoryObj._id || categoryObj, label: categoryObj.title || categoryObj.name || '' });
    } else {
      setSelectedCategory(null);
    }

    // keep current images visible; do not overwrite thumbnailFile/galleryFiles unless user selects new
    setThumbnailFile(null);
    setGalleryFiles([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleMenuChange = (id, field, value) => {
    setMenuSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addMenuSection = () => setMenuSections((p) => [...p, { id: Date.now(), heading: '', includes: '' }]);
  const deleteMenuSection = (id) => setMenuSections((p) => p.filter((s) => s.id !== id));

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailFile(file);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setGalleryFiles((p) => [...p, ...files]);
  };

  const deleteGalleryFile = (index) => setGalleryFiles((p) => p.filter((_, i) => i !== index));
  const clearThumbnail = () => setThumbnailFile(null);

  const handleCloseToast = (e, reason) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
  };

  const handleEdit = () => {
    if (currentPackage) populateForm(currentPackage);
    setViewMode('form');
  };

  // ------------------------- Submit -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getAuthToken();
    if (!token) {
      setToastMessage('Authentication required');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }

    const providerId = getProviderId();
    if (!providerId) {
      console.error('Provider ID missing. user:', localStorage.getItem('user'));
      setToastMessage('Provider ID missing. Please login as vendor.');
      setToastSeverity('error');
      setOpenToast(true);
      return;
    }

    const moduleId = localStorage.getItem('moduleId') || currentPackage?.module?._id || currentPackage?.module || '';

    // prepare includes payload
    const transformedIncludes = menuSections
      .filter((s) => s.includes && s.includes.trim())
      .map((s) => ({
        title: s.heading.trim() || 'Section',
        items: s.includes
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      }));

    const price = parseFloat(formData.startingPrice) || 0;

    const payload = new FormData();
    payload.append('providerId', providerId);
    if (moduleId) payload.append('module', moduleId);

    payload.append('title', formData.packageTitle || 'Custom Package');
    payload.append('subtitle', formData.subtitle || '');
    payload.append('description', formData.description || '');
    payload.append('cateringType', 'custom');
    payload.append('includes', JSON.stringify(transformedIncludes));

    if (selectedCategory) payload.append('categories', JSON.stringify([selectedCategory.value]));
    else payload.append('categories', JSON.stringify([]));

    payload.append('price', String(price));
    const advanceAmount = parseFloat(formData.advanceBookingAmount) || 0;
    payload.append('advanceBookingAmount', String(advanceAmount)); // ✅

    if (thumbnailFile) payload.append('thumbnail', thumbnailFile);
    galleryFiles.forEach((f) => payload.append('images', f));

    const isEdit = !!currentPackage?._id;
    const url = isEdit ? `${API_BASE_URL}/api/catering/${currentPackage._id}` : `${API_BASE_URL}/api/catering`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await res.json().catch(() => ({ success: false, message: 'Invalid JSON response' }));

      if (!res.ok) {
        console.error('Save failed', result);
        setToastMessage(result.error || result.message || 'Failed to save');
        setToastSeverity('error');
        setOpenToast(true);
        return;
      }

      // success: backend returns populated data
      setFormData({ packageTitle: '', subtitle: '', description: '', startingPrice: '', advanceBookingAmount: '', });
      setMenuSections([{ id: Date.now(), heading: '', includes: '' }]);
      setSelectedCategory(null);
      setThumbnailFile(null);
      setGalleryFiles([]);
      setCurrentPackage(result.data || null);
      setViewMode('preview');

      setToastMessage(result.message || `Catering ${isEdit ? 'updated' : 'created'} successfully`);
      setToastSeverity('success');
      setOpenToast(true);
    } catch (err) {
      console.error('submit error', err);
      setToastMessage('Error saving catering: ' + (err.message || err));
      setToastSeverity('error');
      setOpenToast(true);
    }
  };

  // ------------------------- Preview -------------------------
  if (viewMode === 'preview' && currentPackage) {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            margin: 'auto',
            backgroundColor: 'white',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
            p: 3,
            overflowX: 'hidden'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">Package Preview</Typography>
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
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
                p: 2
              }}
            >
              <Typography variant="h6">{currentPackage.title || 'Untitled Package'}</Typography>
              <Typography variant="body2">{currentPackage.subtitle || ''}</Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
            {currentPackage.description || 'No description available.'}
          </Typography>

          {currentPackage.categories && currentPackage.categories.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Category
              </Typography>
              <Chip
                label={currentPackage.categories[0]?.title || currentPackage.categories[0] || 'Uncategorized'}
                variant="outlined"
                color="primary"
              />
            </Box>
          )}

          <Typography variant="h6" sx={{ mb: 2 }}>
            Includes
          </Typography>
          {(currentPackage.includes || []).map((inc, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                {inc.title || 'Untitled Section'}
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 0 }}>
                {inc.items?.map((it, i) => (
                  <Typography key={i} variant="body2" component="li">
                    {it}
                  </Typography>
                )) || (
                  <Typography variant="body2" color="text.secondary">
                    No items
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Starting Price
            </Typography>
            <Typography variant="h4" color="primary">
              ₹{currentPackage.price || 0} Per Head
            </Typography>
            {currentPackage.advanceBookingAmount > 0 && (
  <Typography variant="body2" color="text.secondary">
    Advance Booking Amount: ₹{currentPackage.advanceBookingAmount}
  </Typography>
)}

          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Gallery
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {(currentPackage.images || []).slice(0, 6).map((img, i) => (
                <Box key={i} sx={{ position: 'relative' }}>
                  <img
                    src={getImageUrl(img)}
                    alt={`Gallery ${i + 1}`}
                    style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit} sx={{ color: '#E15B65', borderColor: '#E15B65' }}>
              Edit Menu
            </Button>
          </Box>

          <Snackbar
            open={openToast}
            autoHideDuration={6000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
              {toastMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    );
  }

  // ------------------------- Form -------------------------
  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          margin: 'auto',
          backgroundColor: 'white',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          p: 3,
          overflowX: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {currentPackage && (
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h5">{currentPackage ? 'Edit Menu' : 'Add New Menu'}</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Package Title"
            name="packageTitle"
            value={formData.packageTitle}
            onChange={handleInputChange}
            placeholder="Type package title"
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder="Type subtitle"
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Type description"
            multiline
            rows={3}
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <Autocomplete
            fullWidth
            options={availableCategories}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            value={selectedCategory}
            onChange={(e, v) => setSelectedCategory(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                placeholder={loadingCategories ? 'Loading categories...' : 'Select a category'}
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loadingCategories}
              />
            )}
          />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Menu List</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={addMenuSection}
                startIcon={<AddIcon />}
                sx={{ backgroundColor: '#E15B65', color: 'white' }}
              >
                Add
              </Button>
            </Box>

            {menuSections.map((section) => (
              <Box key={section.id} sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: 1, p: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add heading here"
                  value={section.heading}
                  onChange={(e) => handleMenuChange(section.id, 'heading', e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    label="Includes"
                    value={section.includes}
                    onChange={(e) => handleMenuChange(section.id, 'includes', e.target.value)}
                    multiline
                    rows={3}
                    sx={{ flex: 1 }}
                    variant="outlined"
                    placeholder="Enter items separated by commas"
                  />
                  <IconButton onClick={() => deleteMenuSection(section.id)} color="error" sx={{ alignSelf: 'flex-end' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Thumbnail Image
              </Typography>
              <UploadDropArea onClick={() => document.getElementById('thumbnail-upload').click()}>
                {thumbnailFile ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <ImagePreviewContainer>
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail preview"
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      />
                      <IconButton
                        onClick={clearThumbnail}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: 'white',
                          color: 'error',
                          boxShadow: theme.shadows[2]
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ImagePreviewContainer>
                    <Typography variant="body2" color="text.secondary">
                      {thumbnailFile.name}
                    </Typography>
                  </Box>
                ) : currentPackage?.thumbnail ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={getImageUrl(currentPackage.thumbnail)}
                      alt="Current thumbnail"
                      style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: theme.spacing(1) }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Current thumbnail. Click to replace.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                    <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                      Click to upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Or drag and drop
                    </Typography>
                  </Box>
                )}
                <input type="file" id="thumbnail-upload" hidden accept="image/jpeg,image/png,image/jpg" onChange={handleThumbnailChange} />
              </UploadDropArea>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Gallery Images
              </Typography>
              <UploadDropArea onClick={() => document.getElementById('gallery-upload').click()}>
                {galleryFiles.length > 0 ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ justifyContent: 'center', mb: 1 }}>
                      {galleryFiles.map((file, i) => (
                        <ImagePreviewContainer key={i}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Gallery preview ${i + 1}`}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <IconButton
                            onClick={() => deleteGalleryFile(i)}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: 'white',
                              color: 'error',
                              boxShadow: theme.shadows[2]
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </ImagePreviewContainer>
                      ))}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {galleryFiles.length} image(s) selected
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                    <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                      Click to upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Or drag and drop
                    </Typography>
                  </Box>
                )}
                <input
                  type="file"
                  id="gallery-upload"
                  hidden
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleGalleryChange}
                />
              </UploadDropArea>

              {currentPackage?.images?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Existing Images
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1}>
                    {currentPackage.images.map((img, i) => (
                      <Box key={i} sx={{ position: 'relative' }}>
                        <img
                          src={getImageUrl(img)}
                          alt={`Existing gallery ${i + 1}`}
                          style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="₹ Price (Starting From)"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleInputChange}
              type="number"
              inputProps={{ min: 0 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" color="text.secondary">
                      Per Head
                    </Typography>
                  </InputAdornment>
                )
              }}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="₹ Advance Booking Amount"
              name="advanceBookingAmount"
              value={formData.advanceBookingAmount}
              onChange={handleInputChange}
              type="number"
              inputProps={{ min: 0 }}
              variant="outlined"
              helperText="Amount to be paid in advance"
            />
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#E15B65', color: 'white', py: 1.5 }}>
            {currentPackage ? 'Update Menu' : 'Create Menu'}
          </Button>
        </Box>

        <Snackbar
          open={openToast}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddNewMenu;
