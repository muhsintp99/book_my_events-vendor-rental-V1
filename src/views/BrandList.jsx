
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

const Brandlist = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [error, setError] = useState(null);
  const moduleId = '68ce96fd8db0c860bfcd67d1'; // From DOCUMENT
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae'; // Fallback URL

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Validate API base URL
        if (!API_BASE_URL) {
          throw new Error('API base URL is not defined. Please set VITE_API_BASE_URL in your .env file.');
        }

        const response = await fetch(`${API_BASE_URL}/api/brands/module/${moduleId}`, {
          headers: {
            'Accept': 'application/json',
            // Add authentication headers if required, e.g.:
            // 'Authorization': `Bearer ${token}`
          }
        });

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Verify content type is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json();

        // Process brands directly (backend returns array of brands)
        if (Array.isArray(data) && data.length > 0) {
          const formattedBrands = data.map(brand => ({
            id: brand.brandId,
            image: `${API_BASE_URL}/${brand.icon}`, // Prepend base URL to image path
            name: brand.title
          }));
          setBrands(formattedBrands);
          setFilteredBrands(formattedBrands);
        } else {
          setError('No brands found for this module');
        }
      } catch (error) {
        console.error('Error fetching brands:', error.message);
        setError(`Failed to fetch brands: ${error.message}`);
      }
    };
    fetchBrands();
  }, []);

  // For Export Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    let csvContent = "Sr,Brand Id,Brand Name\n";
    filteredBrands.forEach((brand, index) => {
      csvContent += `${index + 1},${brand.id},${brand.name}\n`;
    });
    const blob = new Blob([csvContent], {
      type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brand_list.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
    handleClose();
  };

  const handleSearch = () => {
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 'lg', margin: 'auto', backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1], p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Brand List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search by brand name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
            <Button
              variant="outlined"
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>Brand Id</TableCell>
              <TableCell>Brand Image</TableCell>
              <TableCell>Brand Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrands.map((brand, index) => (
              <TableRow key={brand.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{brand.id}</TableCell>
                <TableCell>
                  <img src={brand.image} alt={brand.name} style={{ width: 100, height: 50, objectFit: 'contain' }} />
                </TableCell>
                <TableCell>{brand.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Brandlist;
