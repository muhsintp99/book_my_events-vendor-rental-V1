import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
    window.addEventListener('employeeAdded', () => {
      const updatedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      setEmployees(updatedEmployees);
    });
    return () => window.removeEventListener('employeeAdded', () => {});
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    const data = employees.map((employee, index) => 
      `${index + 1},${employee.firstName} ${employee.lastName},${employee.email},${employee.phone},${employee.role}`
    ).join('%0A');
    const header = 'Sl,Name,Email,Phone,Role';
    const fullData = `${header}%0A${data}`;
    const blob = new Blob([fullData], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employee_list.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <Box sx={{ padding: 2, backgroundColor:'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ mr: 1 }}>👤</Box> Employee List <Box component="span" sx={{ ml: 1, color: 'text.secondary' }}>({employees.length})</Box>
        </Typography>
        <Button onClick={() => navigate("/employee/new")} variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: '#E15B65', '&:hover': { backgroundColor: '#f33542ff' } }}>
          Add New Employee
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Ex: Search by name or email..."
          size="small"
          sx={{ width: '300px' }}
          InputProps={{
            endAdornment: <IconButton edge="end"><SearchIcon /></IconButton>,
          }}
        />
        <Button
          variant="outlined" color='#E15B65'
          size="small"
          onClick={handleClick}  sx={{color:'#E15B65'}}
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
      <Table sx={{ minWidth: 650 }} aria-label="employee table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  {/* Action placeholder */}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box component="img" src="https://via.placeholder.com/150" alt="No Data" sx={{ width: '150px', height: '150px' }} />
                  <Typography variant="body1">No Data Found</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
export default EmployeeList;