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
import { Search as SearchIcon, Download as DownloadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae'; // Fallback to provided API URL

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error('API base URL is not defined. Please set VITE_API_BASE_URL in your .env file.');
        }

        const response = await fetch(`${API_BASE_URL}/api/vehicle-categories`, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Access `data.data` instead of `data`
        if (data.success && Array.isArray(data.data)) {
          const formattedCategories = data.data.map(category => ({
            id: category.vehicleCategoryId || category._id,
            name: category.title,
            image: category.image ? `${API_BASE_URL}${category.image}` : '',
          }));
          setCategories(formattedCategories);
          setFilteredCategories(formattedCategories);
        } else {
          setError('No categories found for this module');
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setError(`Failed to fetch categories: ${error.message}`);
      }
    };
    fetchCategories();
  }, []);

  // Search functionality
  const handleSearch = () => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  // Export functionality
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    const title = 'Category List';
    const fileName = 'vehicle_categories';
    const exporter = exportCategories(filteredCategories, fileName, title);

    if (format === 'excel') {
      exporter.excel();
    } else if (format === 'pdf') {
      exporter.pdf();
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 'lg', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3 }}>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
            <Button
              variant="outlined" color='#E15B65'
              startIcon={<SearchIcon />}
              onClick={handleSearch} sx={{ color: '#E15B65' }}
            >
              Search
            </Button>
            <Button
              variant="outlined" color='#E15B65'
              endIcon={<ArrowDropDownIcon />}
              onClick={handleClick} sx={{ color: '#E15B65' }}
            >
              Export
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
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
                    <img src={category.image} alt={category.name} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
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