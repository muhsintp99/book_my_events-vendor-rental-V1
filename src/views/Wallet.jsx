import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';

const Wallet = () => {
  const [value, setValue] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const [withdrawMethod, setWithdrawMethod] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [accountName, setAccountName] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [openToast, setOpenToast] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [payableBalance, setPayableBalance] = useState(160.32); // Initial payable balance

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setWithdrawMethod('');
    setAmount('');
    setAccountName('');
    setAccountNumber('');
    setEmail('');
  };

  const handleSubmit = () => {
    const currentDate = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const withdrawAmount = parseFloat(amount) || 0;
    if (withdrawAmount <= payableBalance) {
      const newWithdrawal = {
        sl: withdrawals.length + 1,
        amount: `$${amount}`,
        requestTime: currentDate,
        disbursementMethod: withdrawMethod,
        transactionType: 'Withdraw Request',
        status: 'Pending',
        note: 'N/A',
      };
      setWithdrawals([newWithdrawal, ...withdrawals]);
      setPayableBalance((prev) => (prev - withdrawAmount).toFixed(2));
      setOpenToast(true);
    }
    handleCloseModal();
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6f7ff', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <WalletIcon sx={{ mr: 1, color: '#1976d2' }} />
        <Typography variant="h5" fontWeight="600" color="#333">
          Provider Wallet
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Paper sx={{ p: 2, width: '32%', textAlign: 'center', backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography variant="h5" color="black">
            Cash in Hand <span style={{ fontSize: '0.75rem', color: '#757575' }}>i</span>
          </Typography>
          <Typography variant="h3" fontWeight="600" color="#d32f2f">
            ₹0.00
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, width: '32%', textAlign: 'center', backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography variant="h5" color="black">
            Withdraw able balance
          </Typography>
          <Typography variant="h3" fontWeight="600" color="#388e3c">
            ₹{payableBalance}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, width: '32%', textAlign: 'center', backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography variant="h5" color="black">
            Payable Balance
          </Typography>
          <Typography variant="h3" fontWeight="600" color="#388e3c">
            ₹{payableBalance}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 1, backgroundColor: '#4895e2ff', '&:hover': { backgroundColor: '#088dc7ff' }, textTransform: 'none' }}
            onClick={handleOpenModal}
            disabled={payableBalance <= 0}
          >
            Request Withdraw <span style={{ fontSize: '0.75rem', color: '#757575' }}>i</span>
          </Button>
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Paper sx={{ p: 2, width: '32%', textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
          <Typography variant="h5" color="black">
            Pending withdraw
          </Typography>
          <Typography variant="h3" fontWeight="600" color="#d32f2f">
            ₹0.00
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, width: '32%', textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
          <Typography variant="h5" color="black">
            Total Withdrawn
          </Typography>
          <Typography variant="h3" fontWeight="600" color="#5fade1ff">
            ₹0.00
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, width: '32%', textAlign: 'center', backgroundColor: '#e0f7fa', borderRadius: 2 }}>
          <Typography variant="h4" color="black">
            Total earning
          </Typography>
          <Typography variant="h3" fontWeight="600" color="#0288d1">
            ₹160.32
          </Typography>
        </Paper>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={value} onChange={handleChange} aria-label="wallet tabs">
          <Tab label="Withdraw request" />
          <Tab label="Payment history" />
          <Tab label="Next Payouts" />
        </Tabs>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="withdraw request table">
        <TableHead>
          <TableRow>
            <TableCell>Sl</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Request Time</TableCell>
            <TableCell>Disbursement Method</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {withdrawals.length > 0 ? (
            withdrawals.map((row) => (
              <TableRow key={row.sl}>
                <TableCell>{row.sl}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.requestTime}</TableCell>
                <TableCell>{row.disbursementMethod}</TableCell>
                <TableCell>{row.transactionType}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small" sx={{ backgroundColor: '#ff4444', '&:hover': { backgroundColor: '#cc0000' } }}>
                    ✕
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            border: 'none',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2">
              Withdraw request
            </Typography>
            <Button onClick={handleCloseModal} sx={{ minWidth: 'unset', padding: 0 }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1, color: '#757575' }}>×</span>
            </Button>
          </Box>
          <TextField
            select
            label="Select Withdraw Method"
            value={withdrawMethod}
            onChange={(e) => setWithdrawMethod(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              style: { borderRadius: 8 },
            }}
          >
            <MenuItem value="card">card</MenuItem>
            <MenuItem value="6cash">6cash</MenuItem>
          </TextField>
          {withdrawMethod === '6cash' && (
            <>
              <TextField
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { borderRadius: 8 },
                }}
                placeholder="Enter your account name"
              />
              <TextField
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { borderRadius: 8 },
                }}
                placeholder="Enter your account Number"
              />
            </>
          )}
          {withdrawMethod === 'card' && (
            <>
              <TextField
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { borderRadius: 8 },
                }}
                placeholder="Enter your cardholder name"
              />
              <TextField
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { borderRadius: 8 },
                }}
                placeholder="Enter your account number"
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { borderRadius: 1 },
                }}
                placeholder="Enter your account email"
              />
            </>
          )}
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              style: { borderRadius: 8 },
            }}
            placeholder="160.32"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handleCloseModal} sx={{ borderRadius: 8 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 8, backgroundColor: '#51aee1ff', '&:hover': { backgroundColor: '#5b9fe6ff' } }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ mb: 2 }}
      >
        <Alert onClose={handleCloseToast} severity="info" sx={{ backgroundColor: '#0288d1', color: 'white', borderRadius: 8 }}>
          Withdraw request has been sent.
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default Wallet;