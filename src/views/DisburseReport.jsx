import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, IconButton, Menu } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const DisbursementReport = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    const headers = ['Sl,Id,Created At,Disburse Amount,Payment Method,Status'];
    const rows = []; // Replace with actual data if available
    const csvContent = headers.concat(rows).join('\n');
    const excelContent = `<table><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></table>`;
    const blob = new Blob([format === 'csv' ? csvContent : excelContent], { type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `disbursement_report_${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📋 Disbursement Report</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', p: 2, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', p: 3, border: '1px solid #e0e0e0', borderRadius: 2, width: '30%', height: 150 }}>
            <Typography variant="h6" sx={{ color: '#4caf50' }}>$0.00</Typography>
            <Typography variant="body2">Pending Disbursements</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Box sx={{ bgcolor: '#e0f7e9', borderRadius: '50%', p: 2, mr: 1 }}>
                <Typography>📄</Typography>
              </Box>
              <InfoIcon sx={{ color: '#4caf50', fontSize: 20 }} />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, border: '1px solid #e0e0e0', borderRadius: 2, width: '30%', height: 150 }}>
            <Typography variant="h6" sx={{ color: '#ff9800' }}>$0.00</Typography>
            <Typography variant="body2">Completed Disbursements</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Box sx={{ bgcolor: '#fff3e0', borderRadius: '50%', p: 2, mr: 1 }}>
                <Typography>🏠</Typography>
              </Box>
              <InfoIcon sx={{ color: '#ff9800', fontSize: 20 }} />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, border: '1px solid #e0e0e0', borderRadius: 2, width: '30%', height: 150 }}>
            <Typography variant="h6" sx={{ color: '#f44336' }}>$0.00</Typography>
            <Typography variant="body2">Canceled Transactions</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Box sx={{ bgcolor: '#fce4ec', borderRadius: '50%', p: 2, mr: 1 }}>
                <Typography>📉</Typography>
              </Box>
              <InfoIcon sx={{ color: '#f44336', fontSize: 20 }} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, backgroundColor: 'white', height: 70, borderRadius: 2, p: 2 }}>
        <TextField
          select
          label="Search Data"
          defaultValue="All Payment Method"
          variant="outlined"
          sx={{ mr: 2, minWidth: 200, marginLeft: 2 }}
        >
          <MenuItem value="All Payment Method">All Payment Method</MenuItem>
          <MenuItem value="Payment Method 1">Card</MenuItem>
          <MenuItem value="Payment Method 2">6Cash</MenuItem>
        </TextField>
        <TextField
          select
          label="All status"
          defaultValue="All Time"
          variant="outlined"
          sx={{ mr: 2, minWidth: 200 }}
        >
          <MenuItem value="All Time">All Time</MenuItem>
          <MenuItem value="Today">Pending</MenuItem>
          <MenuItem value="This Week">Completed</MenuItem>
          <MenuItem value="This Month">Canceled</MenuItem>
        </TextField>
        <TextField
          select
          label="All Time"
          defaultValue="All Time"
          variant="outlined"
          sx={{ mr: 2, minWidth: 200 }}
        >
          <MenuItem value="All Time">All Time</MenuItem>
          <MenuItem value="This year">This year</MenuItem>
          <MenuItem value="Previous year">Previous year</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="This week">This week</MenuItem>
          <MenuItem value="Custom">Custom</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" sx={{ height: '40px', paddingRight: 10, marginLeft: 10 }}>
          Filter
        </Button>
      </Box>
      <Box sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
          <Typography variant="h6" sx={{ color: '#6b7280' }}>Total Disbursements <Typography component="span" sx={{ ml: 1, bgcolor: '#e0e0e0', px: 1, py: 0.5, borderRadius: 1, fontSize: '14px' }}>0</Typography></Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Search by Id"
              variant="outlined"
              size="small"
              sx={{ mr: 2, width: '200px' }}
            />
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
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
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', p: 1, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', width: '10%' }}>Sl</Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', width: '20%' }}>Id</Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', width: '20%' }}>Created At</Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', width: '20%' }}>Disburse Amount</Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', width: '20%' }}>Payment Method</Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', width: '10%' }}>Status</Typography>
          </Box>
        </Box>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Box component="img" src="https://via.placeholder.com/150" alt="No Data Found" sx={{ mb: 2 }} />
          <Typography variant="h6" color="error">
            No Data Found
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DisbursementReport;