import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Stack,
  Alert,
  InputAdornment,
  Fade
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  Edit,
  Save,
  CurrencyRupee,
  LocalOffer,
  Title as TitleIcon,
  Description,
  Image,
  AddCircle,
  RemoveCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const GradientPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #f9fafc 100%)',
  borderRadius: 24,
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 100%)'
  }
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #e0e0e0',
  borderRadius: 16,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: '#fafafa',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#FF9A9E',
    backgroundColor: '#fff9f9'
  }
}));

const PriceCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  border: '1px solid #f0f0f0',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#FF9A9E',
    boxShadow: '0 4px 12px rgba(255, 154, 158, 0.1)'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3)
}));

const CakeAddonsAdmin = () => {
  const [addons, setAddons] = useState([{ id: 1, name: '', price: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleAddRow = () => {
    setAddons([...addons, { id: Date.now(), name: '', price: '' }]);
  };

  const handleRemoveRow = (id) => {
    if (addons.length > 1) {
      setAddons(addons.filter((addon) => addon.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setAddons(addons.map((addon) => (addon.id === id ? { ...addon, [field]: value } : addon)));
  };

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcon(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const calculateTotal = () => {
    return addons
      .reduce((sum, addon) => {
        const price = parseFloat(addon.price) || 0;
        return sum + price;
      }, 0)
      .toFixed(2);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 3 }}>
      <GradientPaper sx={{ p: { xs: 3, md: 5 } }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <LocalOffer fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Cake Add-ons Manager
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create beautiful add-ons with pricing, descriptions, and images
              </Typography>
            </Box>
          </Box>
          <Chip label={`${addons.length} add-on${addons.length !== 1 ? 's' : ''}`} color="primary" variant="outlined" sx={{ mt: 1 }} />
        </Box>

        {/* Saved Alert */}
        <Fade in={saved}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSaved(false)}>
            Add-ons saved successfully!
          </Alert>
        </Fade>

        <Grid container spacing={2.5}>
          {/* Left Column - Form */}
          <Grid item xs={12} md={8}>
            {/* Title & Description */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TitleIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Basic Information
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Add-ons Title"
                    placeholder="Premium Frosting & Decoration Options"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Edit fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    placeholder="Describe what makes these add-ons special..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Add-ons Pricing */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CurrencyRupee color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Add-ons Pricing
                    </Typography>
                  </Box>
                  <Chip label={`Total: ₹${calculateTotal()}`} color="primary" icon={<CurrencyRupee />} variant="filled" />
                </Box>

                <Stack spacing={2}>
                  {addons.map((addon, index) => (
                    <PriceCard key={addon.id}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={5}>
                            <TextField
                              fullWidth
                              label="Add-on Name"
                              placeholder="Chocolate Ganache Drizzle"
                              value={addon.name}
                              onChange={(e) => handleChange(addon.id, 'name', e.target.value)}
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 1 }
                              }}
                            />
                          </Grid>

                          <Grid item xs={8} sm={5}>
                            <TextField
                              fullWidth
                              label="Price"
                              placeholder="9.99"
                              value={addon.price}
                              onChange={(e) => handleChange(addon.id, 'price', e.target.value)}
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CurrencyRupee fontSize="small" />
                                  </InputAdornment>
                                )
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 1 }
                              }}
                            />
                          </Grid>

                          <Grid item xs={4} sm={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveRow(addon.id)}
                                disabled={addons.length === 1}
                                size="small"
                              >
                                <RemoveCircle />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </PriceCard>
                  ))}
                </Stack>

                <StyledButton startIcon={<AddCircle />} onClick={handleAddRow} variant="outlined" color="primary" fullWidth sx={{ mt: 3 }}>
                  Add New Add-on
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Image & Preview */}
          <Grid item xs={12} md={4}>
            {/* Image Upload */}
            {/* Icon Upload */}
            <Card xs={12} sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Image color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Add-on Icon
                  </Typography>
                </Box>

                <UploadBox onClick={() => document.getElementById('icon-upload')?.click()}>
                  <input id="icon-upload" hidden type="file" accept="image/svg+xml,image/png" onChange={handleIconUpload} />

                  {icon ? (
                    <Stack spacing={2} alignItems="center">
                      <Avatar src={icon} sx={{ width: 80, height: 80, bgcolor: 'grey.100' }} />
                      <Button variant="outlined" startIcon={<CloudUpload />} size="small">
                        Change Icon
                      </Button>
                    </Stack>
                  ) : (
                    <Stack spacing={1.5} alignItems="center">
                      <AddCircle sx={{ fontSize: 56, color: 'text.secondary' }} />
                      <Typography variant="body1">Upload an add-on icon</Typography>
                      <Typography variant="body2" color="text.secondary">
                        SVG or PNG (icon style)
                      </Typography>
                    </Stack>
                  )}
                </UploadBox>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: 'primary.light' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Preview
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Title
                  </Typography>
                  <Typography variant="body1">{title || 'Your add-ons title will appear here'}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Add-ons List
                  </Typography>
                  <Stack spacing={1}>
                    {addons.map((addon, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'grey.50'
                        }}
                      >
                        <Typography variant="body2">{addon.name || 'Add-on name'}</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {addon.price ? `₹${addon.price}` : '₹0.00'}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" fontWeight={600}>
                      Total
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="primary">
                      ₹{calculateTotal()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            All changes are auto-saved locally
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton variant="outlined" color="inherit" onClick={() => setAddons([{ id: 1, name: '', price: '' }])}>
              Reset
            </StyledButton>
            <StyledButton
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                background: 'linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #FF7B7F 0%, #F8C0B0 100%)'
                }
              }}
            >
              Save Add-ons
            </StyledButton>
          </Box>
        </Box>
      </GradientPaper>
    </Container>
  );
};

export default CakeAddonsAdmin;
