import React, { useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Menu } from '@mui/material';
import { styled } from '@mui/system';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const StyledCard = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  width: '23%',
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  textAlign: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '4px',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#888',
    },
  },
}));

const VatReport = () => {
  const [dateRange, setDateRange] = useState('09/05/2025 - 09/11/2025');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (range) => {
    const today = new Date();
    let startDate, endDate;
    switch (range) {
      case 'Today':
        startDate = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        endDate = startDate;
        break;
      case 'Yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = yesterday.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        endDate = startDate;
        break;
      case 'Last 7 Days':
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6);
        startDate = last7Days.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        endDate = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        break;
      case 'Last 30 Days':
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 29);
        startDate = last30Days.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        endDate = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        break;
      case 'This Month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        endDate = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        break;
      case 'Last Month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = lastMonth.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        endDate = lastMonthEnd.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        break;
      case 'Custom Range':
        startDate = '09/10/2025';
        endDate = '09/10/2025';
        break;
      default:
        startDate = '09/05/2025';
        endDate = '09/11/2025';
    }
    setDateRange(`${startDate} - ${endDate}`);
    handleClose();
  };

  return (
    <StyledContainer>
      <Typography variant="h6" gutterBottom>
        Tax Report
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <StyledTextField
          label="Date Range"
          value={dateRange}
          InputProps={{
            readOnly: true,
            endAdornment: <CalendarTodayIcon onClick={handleClick} style={{ cursor: 'pointer' }} />,
          }}
          variant="outlined"
          size="small"
          onClick={handleClick}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleDateSelect('Today')}>Today</MenuItem>
          <MenuItem onClick={() => handleDateSelect('Yesterday')}>Yesterday</MenuItem>
          <MenuItem onClick={() => handleDateSelect('Last 7 Days')}>Last 7 Days</MenuItem>
          <MenuItem onClick={() => handleDateSelect('Last 30 Days')}>Last 30 Days</MenuItem>
          <MenuItem onClick={() => handleDateSelect('This Month')}>This Month</MenuItem>
          <MenuItem onClick={() => handleDateSelect('Last Month')}>Last Month</MenuItem>
          <MenuItem onClick={() => handleDateSelect('Custom Range')}>Custom Range</MenuItem>
        </Menu>
        <Button
          variant="contained"
          sx={{ ml: 2, backgroundColor: '#26A69A', '&:hover': { backgroundColor: '#2E7D32' } }}
        >
          Filter
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <StyledCard>
          <img src="https://img.icons8.com/ios-filled/50/000000/delivery.png" alt="Trips Icon" />
          <Typography variant="h6">0</Typography>
          <Typography variant="body2">Total Trips</Typography>
        </StyledCard>
        <StyledCard sx={{ backgroundColor: '#E3F2FD' }}>
          <img src="https://img.icons8.com/ios-filled/50/000000/money.png" alt="Amount Icon" />
          <Typography variant="h6">₹0.00</Typography>
          <Typography variant="body2">Total Trip Amount</Typography>
        </StyledCard>
        <StyledCard sx={{ backgroundColor: '#F1F8E9' }}>
          <img src="https://img.icons8.com/ios-filled/50/000000/tax.png" alt="Tax Icon" />
          <Typography variant="h6">₹0.00</Typography>
          <Typography variant="body2">Total Tax Amount</Typography>
        </StyledCard>
      </Box>
    </StyledContainer>
  );
};

export default VatReport;