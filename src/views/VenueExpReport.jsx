import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Menu } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const ExpenseReport = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    const data = 'Sl,venue Id,Date & Time,Expense Type,Customer Name,Expense Amount%0A1,100031,2025-02-06 05:23pm,Discount On venue,Jonathon Jack,₹17.06';
    const blob = new Blob([data], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_report.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Expense Report
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        This report will show all the venue in which the Provider discount has been used. The Provider discounts are: Free delivery, Coupon discount & venue discounts(partial according to trip commission).
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 5, backgroundColor: 'white', height: 70, borderRadius: 2 }}>
        <TextField
          select
          label="Search Data"
          defaultValue="All Time"
          variant="outlined"
          sx={{ mr: 2, minWidth: 200, marginLeft: 2, backgroundColor:'white', mb:2 }}
        >
          <MenuItem value="All Time">All Time</MenuItem>
          <MenuItem value="This Year">This Year</MenuItem>
          <MenuItem value="Previous Year">Previous Year</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="This Week">This Week</MenuItem>
          <MenuItem value="Custom">Custom</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" sx={{ height: '50px', paddingRight: 30, marginLeft: 80, bgcolor:'#E15B65' }}>
          Filter
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, backgroundColor: 'white', height: 60 }}>
        <Typography variant="h6">Expense Lists 1</Typography>
        <Box>
          <TextField
            label="Search by Order ID"
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined" color='#E15B65'
            size="small"
            onClick={handleClick} sx={{color:'#E15B65'}}
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
            <MenuItem onClick={() => handleExport('csv')}>Csv</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S1</TableCell>
            <TableCell>Venue Id</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Expense Type</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Expense Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>100031</TableCell>
            <TableCell>2025-02-06 05:23pm</TableCell>
            <TableCell>Discount On Venue</TableCell>
            <TableCell>Jonathon Jack</TableCell>
            <TableCell>17.06</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
export default ExpenseReport;