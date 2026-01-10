import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  useTheme,
  Menu,
  MenuItem,
  Collapse,
  IconButton,
  Chip,
  TableContainer,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Category as CategoryIcon,
  SubdirectoryArrowRight,
} from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const CAKE_MODULE_ID = '68e5fc09651cc12c1fc0f9c9';

const CakeCategory = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [parentCategories, setParentCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';
  const token = localStorage.getItem('token');

  const handleImageError = (id, type = 'parent') => {
    setImageErrors(prev => ({
      ...prev,
      [`${type}-${id}`]: true
    }));
  };

  // Fetch parent categories and their subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        if (!API_BASE_URL) {
          throw new Error('API base URL is not defined.');
        }

        // Fetch parent categories
        const parentResponse = await fetch(`${API_BASE_URL}/api/categories/parents/${CAKE_MODULE_ID}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!parentResponse.ok) {
          throw new Error(`HTTP error! Status: ${parentResponse.status}`);
        }

        const parentData = await parentResponse.json();

        if (parentData.success && Array.isArray(parentData.data)) {
          // Helper function to construct image URL
          const getImageUrl = (imagePath) => {
            if (!imagePath) return '';
            if (imagePath.startsWith('http')) return imagePath;
            const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
            return `${API_BASE_URL}${cleanPath}`;
          };

          // Fetch subcategories for each parent
          const categoriesWithSubs = await Promise.all(
            parentData.data.map(async (parent) => {
              try {
                const subResponse = await fetch(
                  `${API_BASE_URL}/api/categories/parents/${parent._id}/subcategories`,
                  {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (subResponse.ok) {
                  const subData = await subResponse.json();
                  // Format subcategories with proper image URLs
                  const formattedSubs = (subData.success ? subData.data : []).map(sub => ({
                    ...sub,
                    image: getImageUrl(sub.image)
                  }));
                  
                  return {
                    id: parent._id,
                    name: parent.title,
                    image: getImageUrl(parent.image),
                    description: parent.description || '',
                    subCategories: formattedSubs,
                  };
                }
              } catch (err) {
                console.error(`Error fetching subcategories for ${parent.title}:`, err);
              }

              return {
                id: parent._id,
                name: parent.title,
                image: getImageUrl(parent.image),
                description: parent.description || '',
                subCategories: [],
              };
            })
          );

          setParentCategories(categoriesWithSubs);
          setFilteredCategories(categoriesWithSubs);
        } else {
          setError('No categories found for cake module');
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setError(`Failed to fetch categories: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL, token]);

  // Toggle row expansion
  const handleToggleRow = (categoryId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCategories(parentCategories);
      return;
    }

    const filtered = parentCategories.filter((category) => {
      const matchesParent = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubcategory = category.subCategories?.some((sub) =>
        sub.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesParent || matchesSubcategory;
    });

    setFilteredCategories(filtered);
  };

  // Export functionality
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    let csvContent = "SI,Type,Category Name,Parent Category\n";
    let rowIndex = 1;

    filteredCategories.forEach((category) => {
      csvContent += `${rowIndex++},Parent,${category.name},-\n`;
      
      category.subCategories?.forEach((sub) => {
        csvContent += `${rowIndex++},Subcategory,${sub.title},${category.name}\n`;
      });
    });

    const blob = new Blob([csvContent], {
      type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cake_categories_${new Date().toISOString().slice(0, 10)}.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
    handleClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#E91E63' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh' }}>
      <Box
        sx={{
          maxWidth: 'lg',
          margin: 'auto',
          backgroundColor: 'white',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          p: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Cake Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Parent categories and their subcategories
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              size="small"
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{ color: '#E91E63', borderColor: '#E91E63', '&:hover': { borderColor: '#c2185b' } }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowDropDownIcon />}
              onClick={handleClick}
              sx={{ color: '#E91E63', borderColor: '#E91E63', '&:hover': { borderColor: '#c2185b' } }}
            >
              Export
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => handleExport('excel')}>Excel</MenuItem>
              <MenuItem onClick={() => handleExport('csv')}>CSV</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Statistics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            icon={<CategoryIcon />}
            label={`${filteredCategories.length} Parent Categories`}
            color="primary"
            sx={{ bgcolor: '#E91E63' }}
          />
          <Chip
            icon={<SubdirectoryArrowRight />}
            label={`${filteredCategories.reduce((acc, cat) => acc + (cat.subCategories?.length || 0), 0)} Subcategories`}
            variant="outlined"
            sx={{ borderColor: '#E91E63', color: '#E91E63' }}
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fce4ec' }}>
              <TableRow>
                <TableCell width={50}></TableCell>
                <TableCell width={50}>SI</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell align="center">Subcategories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    {/* Parent Category Row */}
                    <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRow(category.id)}
                          disabled={!category.subCategories || category.subCategories.length === 0}
                        >
                          {expandedRows[category.id] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon sx={{ color: '#E91E63' }} />
                          <Box>
                            <Typography fontWeight={600}>{category.name}</Typography>
                            {category.description && (
                              <Typography variant="caption" color="text.secondary">
                                {category.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {category.image && !imageErrors[`parent-${category.id}`] ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }}
                            onError={() => handleImageError(category.id, 'parent')}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 80,
                              height: 60,
                              bgcolor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={category.subCategories?.length || 0}
                          size="small"
                          color={category.subCategories?.length > 0 ? 'success' : 'default'}
                        />
                      </TableCell>
                    </TableRow>

                    {/* Subcategories Row */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                        <Collapse in={expandedRows[category.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2, bgcolor: '#fafafa', borderRadius: 1, p: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: '#E91E63', fontWeight: 600 }}>
                              Subcategories
                            </Typography>
                            {category.subCategories && category.subCategories.length > 0 ? (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>SI</TableCell>
                                    <TableCell>Subcategory Name</TableCell>
                                    <TableCell>Image</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {category.subCategories.map((sub, subIndex) => (
                                    <TableRow key={sub._id}>
                                      <TableCell>{subIndex + 1}</TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <SubdirectoryArrowRight sx={{ fontSize: 18, color: '#E91E63' }} />
                                          <Typography>{sub.title}</Typography>
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        {sub.image && !imageErrors[`sub-${sub._id}`] ? (
                                          <img
                                            src={sub.image}
                                            alt={sub.title}
                                            style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 4 }}
                                            onError={() => handleImageError(sub._id, 'sub')}
                                          />
                                        ) : (
                                          <Box
                                            sx={{
                                              width: 60,
                                              height: 45,
                                              bgcolor: '#e0e0e0',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              borderRadius: 1,
                                            }}
                                          >
                                            <Typography variant="caption" color="text.secondary">
                                              No Image
                                            </Typography>
                                          </Box>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No subcategories available
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CakeCategory;