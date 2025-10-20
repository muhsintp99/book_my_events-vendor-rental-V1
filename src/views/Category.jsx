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
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Explicit import to avoid resolution issues

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
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  // Export functionality
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    let csvContent = "SI,Category Id,Category Name\n";
    filteredCategories.forEach((category, index) => {
      csvContent += `${index + 1},${category.id},${category.name}\n`;
    });
    const blob = new Blob([csvContent], {
      type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `category_list.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 'lg', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Category List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              onClick={handleSearch} sx={{color:'#E15B65'}}
            >
              Search
            </Button>
            <Button
              variant="outlined" color='#E15B65'
              endIcon={<ArrowDropDownIcon />}
              onClick={handleClick} sx={{color:'#E15B65'}}
            >
              Export
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleExport('excel')}>Excel</MenuItem>
              <MenuItem onClick={() => handleExport('csv')}>CSV</MenuItem>
            </Menu>
          </Box>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SI</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Category Id</TableCell>
              <TableCell>Category Image</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                <img src={category.image} alt={category.name} style={{ width: 100, height: 50, objectFit: 'contain' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Category;