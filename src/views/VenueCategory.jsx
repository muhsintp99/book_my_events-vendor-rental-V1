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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { exportCategories } from '../utils/exportUtils';

const Category = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const moduleId = localStorage.getItem('moduleId');
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

  // Helper: get token from storage
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
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

        // Check if response has success and data properties
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formattedCategories = data.data.map((category) => ({
            id: category.categoryId || category._id,
            name: category.title || category.name,
            image: category.image ? `${API_BASE_URL}${category.image}` : '',
          }));
          setCategories(formattedCategories);
          setFilteredCategories(formattedCategories);
        } else {
          setError('No categories found for this module');
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setError(error.message);
      }
    };
    fetchCategories();
  }, [moduleId, API_BASE_URL]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = categories.filter((category) =>
      (category.name && category.name.toLowerCase().includes(lower)) ||
      (category.id && category.id.toLowerCase().includes(lower))
    );
    setFilteredCategories(filtered);
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    const title = 'Venue Category List';
    const fileName = 'venue_categories';
    const exporter = exportCategories(filteredCategories, fileName, title);

    if (format === 'excel') {
      exporter.excel();
    } else if (format === 'pdf') {
      exporter.pdf();
    }
    handleClose();
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.grey[100],
        minHeight: '100vh',
      }}>
      <Box
        sx={{
          maxWidth: 'lg',
          margin: 'auto',
          backgroundColor: 'white',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          p: 3,
        }} >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 3,
          }}>
          <Typography variant="h5" component="h1">
            Category List
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search categories"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!e.target.value.trim()) {
                  setFilteredCategories(categories);
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              size="small" sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E15B65',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E15B65',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E15B65',
                  },
                },
              }} />
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleSearch} sx={{ borderColor: '#E15B65', color: '#E15B65' }}>
              Search
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowDropDownIcon />}
              onClick={handleClick} sx={{ borderColor: '#E15B65', color: '#E15B65' }}>
              Export
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => handleExport('excel')}>Excel</MenuItem>
              <MenuItem onClick={() => handleExport('pdf')}>PDF</MenuItem>
            </Menu>
          </Box>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fce9ea' }}>
                <TableCell>SI No</TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>Category Image</TableCell>
                <TableCell>Category Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow key={category.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No Image
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{category.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Category;