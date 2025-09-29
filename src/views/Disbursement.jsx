import React, { useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Modal, Select, MenuItem, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const DisbursementMethodSetup = () => {
  const [disbursementMethods, setDisbursementMethods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethodName, setPaymentMethodName] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [defaultUpdateMessage, setDefaultUpdateMessage] = useState('');

  const handleAddMethod = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPaymentMethodName('');
    setPaymentInfo('');
    setAccountName('');
    setAccountNumber('');
    setEmail('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!paymentMethodName) newErrors.paymentMethodName = 'Payment method is required';
    if (paymentMethodName === 'Card' && !accountName) newErrors.accountName = 'Account name is required';
    if (paymentMethodName === 'Card' && !accountNumber) newErrors.accountNumber = 'Account number is required';
    if (paymentMethodName === 'Card' && !email) newErrors.email = 'Email is required';
    else if (paymentMethodName === 'Card' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email is invalid';
    if (paymentMethodName === '6cash' && !accountName) newErrors.accountName = 'Account name is required';
    if (paymentMethodName === '6cash' && !accountNumber) newErrors.accountNumber = 'Account number is required';
    return newErrors;
  };

  const handleSubmitModal = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setDisbursementMethods([...disbursementMethods, { id: Date.now(), name: paymentMethodName, info: `${accountName ? `Account Name: ${accountName}\n` : ''}${accountNumber ? `Account Number: ${accountNumber}\n` : ''}${email ? `Email: ${email.replace(/(.{2}).*?(?=@)/, '$1****')}\n` : ''}`.trim(), default: false }]);
      handleCloseModal();
    } else {
      setErrors(validationErrors);
    }
  };

  const handleDeleteMethod = (id) => {
    setDisbursementMethods(disbursementMethods.filter(method => method.id !== id));
  };

  const handleToggleDefault = (id) => {
    const updatedMethods = disbursementMethods.map(method => {
      if (method.id === id) {
        return { ...method, default: !method.default };
      }
      return { ...method, default: false };
    });
    setDisbursementMethods(updatedMethods);
    setDefaultUpdateMessage('Default method updated');
    setTimeout(() => setDefaultUpdateMessage(''), 3000); // Hide message after 3 seconds
  };

  const filteredMethods = disbursementMethods.filter(method =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Disbursement Method Setup
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">
          Disbursement Methods {disbursementMethods.length}
        </Typography>
        <Box>
          <TextField
            placeholder="Ex: Search by name"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddMethod}
          >
            Add New Method
          </Button>
        </Box>
      </Box>
      {defaultUpdateMessage && (
        <Box sx={{ mb: 2, p: 1, backgroundColor: '#2196F3', color: 'white', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
          {defaultUpdateMessage}
        </Box>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="disbursement methods table">
          <TableHead>
            <TableRow>
              <TableCell>SI</TableCell>
              <TableCell>Payment Method Name</TableCell>
              <TableCell>Payment Info</TableCell>
              <TableCell>Default</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
                    <img
                      src="https://via.placeholder.com/100"
                      alt="No Data Found"
                      style={{ marginBottom: '10px' }}
                    />
                    <Typography color="error">No Data Found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredMethods.map((method, index) => (
                <TableRow key={method.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.info.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}</TableCell>
                  <TableCell>
                    <Switch
                      checked={method.default}
                      onChange={() => handleToggleDefault(method.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeleteMethod(method.id)}
                      startIcon={<DeleteIcon />}
                      sx={{ color: 'red' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" gutterBottom>
            Add method
          </Typography>
          <Select
            fullWidth
            value={paymentMethodName}
            onChange={(e) => setPaymentMethodName(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.paymentMethodName}
            helperText={errors.paymentMethodName}
          >
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="6cash">6cash</MenuItem>
          </Select>
          {paymentMethodName === 'Card' && (
            <>
              <TextField
                fullWidth
                label="ACCOUNT NAME"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter your card holder name"
                sx={{ mb: 2 }}
                error={!!errors.accountName}
                helperText={errors.accountName}
              />
              <TextField
                fullWidth
                label="ACCOUNT NUMBER"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account number"
                sx={{ mb: 2 }}
                error={!!errors.accountNumber}
                helperText={errors.accountNumber}
              />
              <TextField
                fullWidth
                label="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
                sx={{ mb: 2 }}
                error={!!errors.email}
                helperText={errors.email}
              />
            </>
          )}
          {paymentMethodName === '6cash' && (
            <>
              <TextField
                fullWidth
                label="ACCOUNT NAME"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter your account name"
                sx={{ mb: 2 }}
                error={!!errors.accountName}
                helperText={errors.accountName}
              />
              <TextField
                fullWidth
                label="ACCOUNT NUMBER"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account Number"
                sx={{ mb: 2 }}
                error={!!errors.accountNumber}
                helperText={errors.accountNumber}
              />
            </>
          )}
          <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmitModal}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default DisbursementMethodSetup;