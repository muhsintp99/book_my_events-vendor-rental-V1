import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EmployeeRole = () => {
  const [roleName, setRoleName] = useState('Role name example');
  const [permissions, setPermissions] = useState({
    Trip: false,
    Vehicle: false,
    Driver: false,
    Marketing: false,
    'Store setup': false,
    'My wallet': false,
    Profile: false,
    Employees: false,
    'My shop': false,
    Reviews: false,
    Chat: false,
    Report: false,
  });
  const [tabValue, setTabValue] = useState(0);
  const [vehicleNameDefault, setVehicleNameDefault] = useState('');
  const [shortDescriptionDefault, setShortDescriptionDefault] = useState('');
  const [vehicleNameEnglish, setVehicleNameEnglish] = useState('');
  const [shortDescriptionEnglish, setShortDescriptionEnglish] = useState('');
  const [vehicleNameArabic, setVehicleNameArabic] = useState('');
  const [shortDescriptionArabic, setShortDescriptionArabic] = useState('');
  const [openToast, setOpenToast] = useState(false);
  // table state
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem('roles');
    return savedRoles ? JSON.parse(savedRoles) : [
      {
        id: 1,
        roleName: 'manager',
        modules: 'Vehicle',
        createdAt: '11-Sep-25',
      },
    ];
  });
  const [editMode, setEditMode] = useState(false);
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
    // Notify Addemployee page of new roles
    window.dispatchEvent(new Event('rolesUpdated'));
  }, [roles]);

  const handlePermissionChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!vehicleNameDefault.trim()) {
      alert('Role name is required to submit.');
      return;
    }
    const activePermissions = Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(', ');
    const newRole = {
      id: editRole ? editRole.id : Date.now(),
      roleName: vehicleNameDefault.trim(),
      modules: activePermissions || 'None',
      createdAt: editRole ? editRole.createdAt : new Date().toLocaleDateString('en-GB'),
    };
    if (editRole) {
      setRoles(roles.map(role => role.id === editRole.id ? newRole : role));
      setEditMode(false);
      setEditRole(null);
    } else {
      setRoles([...roles, newRole]);
    }
    console.log({ roleName, permissions });
    setOpenToast(true);
    handleReset();
  };

  const handleReset = () => {
    setRoleName('Role name example');
    setPermissions({
      Trip: false,
      Vehicle: false,
      Driver: false,
      Marketing: false,
      'Store setup': false,
      'My wallet': false,
      Profile: false,
      Employees: false,
      'My shop': false,
      Reviews: false,
      Chat: false,
      Report: false,
    });
    setVehicleNameDefault('');
    setShortDescriptionDefault('');
    setVehicleNameEnglish('');
    setShortDescriptionEnglish('');
    setVehicleNameArabic('');
    setShortDescriptionArabic('');
    setEditMode(false);
    setEditRole(null);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const handleDelete = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const handleEdit = (role) => {
    setEditMode(true);
    setEditRole(role);
    setVehicleNameDefault(role.roleName);
    setTabValue(0); // Reset to Default tab
    // Set permissions based on modules string
    const newPermissions = { ...permissions };
    role.modules.split(', ').forEach(perm => {
      if (perm in newPermissions) newPermissions[perm] = true;
    });
    setPermissions(newPermissions);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ p: 3, width: 1200, margin: 'auto', backgroundColor: 'white' }}>
      <Typography variant="h6" gutterBottom>
        <span role="img" aria-label="user">👤</span> Custom Role
      </Typography>
      {/* Role Form Section */}
      <Box
        component="form"
        sx={{
          backgroundColor: '#fff',
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Role Form
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="language tabs">
              <Tab label="Default" {...a11yProps(0)} />
              <Tab label="English(EN)" {...a11yProps(1)} />
              <Tab label="العربية - Arabic (AR)" {...a11yProps(2)} />
            </Tabs>
          </Box>
        </Box>
        {/* Tabs */}
        <TabPanel value={tabValue} index={0}>
          <TextField
            fullWidth
            label="Role name (Default)*"
            variant="outlined"
            value={vehicleNameDefault}
            onChange={(e) => setVehicleNameDefault(e.target.value)}
            placeholder="Type role name"
            sx={{ mb: 2 }}
            required
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Short description (Default)"
            variant="outlined"
            multiline
            rows={4}
            value={shortDescriptionDefault}
            onChange={(e) => setShortDescriptionDefault(e.target.value)}
            placeholder="Type short description"
            inputProps={{ maxLength: 500 }}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <TextField
            fullWidth
            label="Role name (English)"
            variant="outlined"
            value={vehicleNameEnglish}
            onChange={(e) => setVehicleNameEnglish(e.target.value)}
            placeholder="Type role name in English"
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Short description (English)"
            variant="outlined"
            multiline
            rows={4}
            value={shortDescriptionEnglish}
            onChange={(e) => setShortDescriptionEnglish(e.target.value)}
            placeholder="Type short description in English"
            inputProps={{ maxLength: 500 }}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <TextField
            fullWidth
            label="Role name (Arabic)"
            variant="outlined"
            value={vehicleNameArabic}
            onChange={(e) => setVehicleNameArabic(e.target.value)}
            placeholder="اكتب اسم الدور بالعربية"
            sx={{ mb: 2 }}
            dir="rtl"
            inputProps={{ style: { textAlign: 'right' }, maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Short description (Arabic)"
            variant="outlined"
            multiline
            rows={4}
            value={shortDescriptionArabic}
            onChange={(e) => setShortDescriptionArabic(e.target.value)}
            placeholder="اكتب وصفًا قصيرًا بالعربية"
            dir="rtl"
            inputProps={{ style: { textAlign: 'right' }, maxLength: 500 }}
          />
        </TabPanel>
        {/* Permissions */}
        <Typography variant="subtitle1" gutterBottom>
          Module Permission :
        </Typography>
        <FormGroup row sx={{ justifyContent: 'space-between', mb: 2 }}>
          {['Trip', 'Vehicle', 'Driver', 'Marketing'].map((perm) => (
            <FormControlLabel
              key={perm}
              control={<Checkbox checked={permissions[perm]} onChange={handlePermissionChange} name={perm} />}
              label={perm}
            />
          ))}
        </FormGroup>
        <FormGroup row sx={{ justifyContent: 'space-between', mb: 2 }}>
          {['Store setup', 'My wallet', 'Profile', 'Employees'].map((perm) => (
            <FormControlLabel
              key={perm}
              control={<Checkbox checked={permissions[perm]} onChange={handlePermissionChange} name={perm} />}
              label={perm}
            />
          ))}
        </FormGroup>
        <FormGroup row sx={{ justifyContent: 'space-between', mb: 2 }}>
          {['My shop', 'Reviews', 'Chat', 'Report'].map((perm) => (
            <FormControlLabel
              key={perm}
              control={<Checkbox checked={permissions[perm]} onChange={handlePermissionChange} name={perm} />}
              label={perm}
            />
          ))}
        </FormGroup>
        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
      {!editMode && (
        <Box sx={{ mt: 5, backgroundColor: '#fff', p: 2, borderRadius: 1, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">📋 Roles Table</Typography>
            <TextField
              size="small"
              placeholder="Search role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow>
                  <TableCell>Sl#</TableCell>
                  <TableCell>Role Name</TableCell>
                  <TableCell>Modules</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles
                  .filter((role) =>
                    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((role, index) => (
                    <TableRow key={role.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{role.roleName}</TableCell>
                      <TableCell>{role.modules}</TableCell>
                      <TableCell>{role.createdAt}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEdit(role)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(role.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {/* Snackbar */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="info" sx={{ backgroundColor: '#1976d2', color: 'white' }}>
          Role updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default EmployeeRole;