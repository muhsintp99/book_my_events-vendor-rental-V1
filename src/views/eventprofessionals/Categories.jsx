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
  Paper,
  InputAdornment,
  CircularProgress
} from '@mui/material';

import {
  Search as SearchIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Category = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const moduleId = localStorage.getItem('moduleId'); // should store 68e78b706a1614cf448a35a3
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

  /* ================= FETCH MODULE BASED CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!moduleId) {
          throw new Error('Module ID not found in localStorage');
        }

        const response = await fetch(
          `${API_BASE_URL}/api/categories/modules/${moduleId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((cat) => ({
            id: cat.categoryId || cat._id,
            name: cat.title,
            image: cat.image
              ? `${API_BASE_URL}${cat.image}`
              : '',
            status: cat.isActive
          }));

          setCategories(formatted);
          setFilteredCategories(formatted);
        } else {
          setError('No categories found for this module');
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [moduleId]);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  /* ================= EXPORT ================= */
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    let csvContent = 'SI,Category Id,Category Name\n';

    filteredCategories.forEach((cat, index) => {
      csvContent += `${index + 1},${cat.id},${cat.name}\n`;
    });

    const blob = new Blob([csvContent], {
      type:
        format === 'excel'
          ? 'application/vnd.ms-excel'
          : 'text/csv'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eventpro_categories.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8f9fc', minHeight: '100vh' }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4
        }}
      >
        {/* ================= HEADER ================= */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#4527A0'
            }}
          >
            Event Professional Category List
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            <Button
              variant="contained"
              endIcon={<ArrowDropDownIcon />}
              onClick={handleClick}
              sx={{
                bgcolor: '#4527A0',
                '&:hover': { bgcolor: '#311B92' }
              }}
            >
              Export
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleExport('excel')}>
                Excel
              </MenuItem>
              <MenuItem onClick={() => handleExport('csv')}>
                CSV
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fce9ea' }}>
                <TableCell>SI</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCategories.map((cat, index) => (
                <TableRow
                  key={cat.id}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: '#fff5f6'
                    }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Box
                      component="img"
                      src={cat.image}
                      alt={cat.name}
                      sx={{
                        width: 80,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 2
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    {cat.name}
                  </TableCell>

                  <TableCell>{cat.id}</TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 3,
                        display: 'inline-block',
                        fontSize: 12,
                        bgcolor: cat.status
                          ? '#e6f4ea'
                          : '#fdecea',
                        color: cat.status
                          ? '#2e7d32'
                          : '#d32f2f'
                      }}
                    >
                      {cat.status ? 'Active' : 'Inactive'}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default Category;
