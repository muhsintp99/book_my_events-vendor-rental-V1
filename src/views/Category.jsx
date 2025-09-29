<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
<<<<<<< HEAD
  Button,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Explicit import to avoid resolution issues
=======
  IconButton,
  Tooltip,
  Button,
  useTheme,
} from '@mui/material';
import { Settings as SettingsIcon, Download as DownloadIcon } from '@mui/icons-material';
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa

const Category = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
<<<<<<< HEAD
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const moduleId = '68ce96fd8db0c860bfcd67d1'; // From DOCUMENT
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae'; // Fallback to provided API URL

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error('API base URL is not defined. Please set VITE_API_BASE_URL in your .env file.');
        }

        const response = await fetch(`${API_BASE_URL}/api/categories/module/${moduleId}`, {
          headers: {
            'Accept': 'application/json',
            // Add authentication headers if required, e.g.:
            // 'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedCategories = data.map(category => ({
            id: category.categoryId,
            name: category.title,
            image: `${API_BASE_URL}/${category.image}`
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
=======
  const categories = [
    { id: 11, image: 'https://via.placeholder.com/100x50', name: 'Luxury Minibus' },
    { id: 10, image: 'https://via.placeholder.com/100x50', name: 'Crossover' },
    { id: 9, image: 'https://via.placeholder.com/100x50', name: 'Limousine' },
    { id: 8, image: 'https://via.placeholder.com/100x50', name: 'Family Van' },
    { id: 7, image: 'https://via.placeholder.com/100x50', name: 'Electric Car' },
    { id: 6, image: 'https://via.placeholder.com/100x50', name: 'Executive Sedan' },
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    // Logic for exporting data
    alert('Export functionality to be implemented');
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
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
              variant="outlined"
<<<<<<< HEAD
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowDropDownIcon />}
              onClick={handleClick}
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
=======
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
           
          </Box>
        </Box>
>>>>>>> 50aee26ee41309eee8d419ec36916c3ef6a9d0fa
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SI</TableCell>
              <TableCell>Category Id</TableCell>
              <TableCell>Category Image</TableCell>
              <TableCell>Category Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  <img src={category.image} alt={category.name} style={{ width: 100, height: 50, objectFit: 'contain' }} />
                </TableCell>
                <TableCell>{category.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Category;