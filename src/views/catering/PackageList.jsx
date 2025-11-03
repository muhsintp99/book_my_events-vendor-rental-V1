import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  width: 280,
  height: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  position: 'relative',
}));

const ActionOverlay = styled(Box)({
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  gap: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '50%',
  padding: '4px',
  opacity: 0,
  transition: 'opacity 0.2s',
  '&:hover': {
    opacity: 1,
  },
});

const AddCard = styled(Box)(({ theme }) => ({
  width: 280,
  height: 300,
  border: '2px dashed #E15B65',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const CateringPackagesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'preview'
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const API_BASE_URL = 'https://api.bookmyevent.ae';

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const providerId = localStorage.getItem('providerId') || localStorage.getItem('moduleId');
    if (!providerId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/catering/provider/${providerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setPackages(result.caterings || []);
      } else {
        throw new Error('Failed to fetch packages');
      }
    } catch (error) {
      setToastMessage('Failed to fetch packages');
      setToastSeverity('error');
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageClick = (pkg) => {
    setCurrentPackage(pkg);
    setViewMode('preview');
  };

  const handleEdit = (pkg) => {
    navigate('/catering/addpackage', { state: { editPackage: pkg } });
  };

  const handleOpenDeleteDialog = (pkgId) => {
    setSelectedPackageId(pkgId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPackageId(null);
  };

  const confirmDelete = async () => {
    if (!selectedPackageId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setToastMessage('No authentication token found. Please log in.');
      setToastSeverity('error');
      setOpenToast(true);
      handleCloseDeleteDialog();
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/catering/${selectedPackageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setToastMessage('Package deleted successfully!');
        setToastSeverity('success');
        setOpenToast(true);
        fetchPackages(); // Refresh list
        if (currentPackage?._id === selectedPackageId) {
          setViewMode('list');
          setCurrentPackage(null);
        }
      } else {
        throw new Error(result.message || 'Failed to delete package');
      }
    } catch (error) {
      setToastMessage(`Error deleting package: ${error.message}`);
      setToastSeverity('error');
      setOpenToast(true);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  if (loading && viewMode === 'list') {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading packages...</Typography>
      </Box>
    );
  }

  if (viewMode === 'preview' && currentPackage) {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
        <Box sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3, overflowX: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton onClick={() => { setViewMode('list'); setCurrentPackage(null); }} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              Package Preview
            </Typography>
          </Box>
          {/* Thumbnail with overlay */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <img
              src={currentPackage.thumbnail ? `${API_BASE_URL}/${currentPackage.thumbnail}` : '/placeholder.jpg'}
              alt={currentPackage.title}
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 8,
              }}
              onError={(e) => {
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
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {currentPackage.title}
              </Typography>
              <Typography variant="body2">
                {currentPackage.subtitle || 'Traditional Style'}
              </Typography>
            </Box>
          </Box>
          {/* Description */}
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
            {currentPackage.description}
          </Typography>
          {/* Includes */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Includes
          </Typography>
          {(currentPackage.includes || []).map((inc, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                {inc.title}
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 0 }}>
                {inc.items.map((item, itemIndex) => (
                  <Typography key={itemIndex} variant="body2" component="li">
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
          {/* Price */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Starting Price
            </Typography>
            <Typography variant="h4" color="primary">
              ₹{currentPackage.price} Per Head
            </Typography>
          </Box>
          {/* Gallery Images at bottom */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Gallery
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {(currentPackage.images || []).slice(0, 6).map((img, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={`${API_BASE_URL}/${img}`}
                    alt={`Gallery image ${index + 1}`}
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleEdit(currentPackage)}
              sx={{ color: '#E15B65', borderColor: '#E15B65' }}
            >
              Edit Package
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenDeleteDialog(currentPackage._id)}
              sx={{ backgroundColor: '#E15B65', color: 'white' }}
            >
              Delete Package
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
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this package? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh', width: '100%' }}>
      <Box sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3, overflowX: 'hidden' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          Catering Packages
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {packages.map((pkg) => (
            <StyledCard
              key={pkg._id}
              onClick={() => handlePackageClick(pkg)}
              onMouseEnter={(e) => e.currentTarget.querySelector('.action-overlay')?.style.setProperty('opacity', '1')}
              onMouseLeave={(e) => e.currentTarget.querySelector('.action-overlay')?.style.setProperty('opacity', '0')}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={pkg.thumbnail ? `${API_BASE_URL}/${pkg.thumbnail}` : '/placeholder.jpg'}
                  alt={pkg.title}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <ActionOverlay className="action-overlay">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(pkg); }}>
                    <EditIcon fontSize="small" color="primary" />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDeleteDialog(pkg._id); }}>
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </ActionOverlay>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                  {pkg.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {pkg.subtitle || 'Traditional Style'}
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{pkg.price} Per Head
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
          <AddCard onClick={() => navigate('/catering/addpackage')}>
            <AddIcon sx={{ fontSize: 48, color: '#E15B65', mb: 2 }} />
            <Typography variant="h6" color="#E15B65">
              Add New Package
            </Typography>
          </AddCard>
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
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this package? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CateringPackagesList;