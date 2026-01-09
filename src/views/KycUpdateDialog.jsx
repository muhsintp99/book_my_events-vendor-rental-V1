import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import {
  AccountBalanceRounded,
  AccountCircleRounded,
  NumbersRounded,
  CodeRounded,
  AccountBalanceWalletRounded,
  CloseRounded
} from '@mui/icons-material';

export default function KycUpdateDialog({ open, onClose }) {
  const [form, setForm] = useState({
    accountHolder: '',
    ifsc: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: ''
  });
  const [error, setError] = useState('');
  const [loadingBank, setLoadingBank] = useState(false);

  const fetchBankName = async (ifscCode) => {
    if (ifscCode.length === 11) {
      setLoadingBank(true);
      try {
        const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
        if (response.ok) {
          const data = await response.json();
          setForm((prev) => ({ ...prev, bankName: data.BANK }));
        }
      } catch (err) {
        console.error('Error fetching bank details:', err);
      } finally {
        setLoadingBank(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Strict validation logic
    if (name === 'accountHolder') {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
      setForm((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === 'accountNumber' || name === 'confirmAccountNumber') {
      const filteredValue = value.replace(/[^0-9]/g, '');
      setForm((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === 'ifsc') {
      const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setForm((prev) => ({ ...prev, ifsc: upperValue }));
      if (upperValue.length === 11) {
        fetchBankName(upperValue);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.accountNumber !== form.confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }
    console.log('BANK DETAILS DATA:', form);
    // Add validation logic here if needed
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
        color: '#fff'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
            <AccountBalanceWalletRounded sx={{ color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
              Bank Details
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
              Secure payment settlements
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} autoComplete="off">
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center' }}>
            Please provide your accurate bank information to ensure timely and secure settlement.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Holder Name"
                name="accountHolder"
                value={form.accountHolder}
                onChange={handleChange}
                required
                variant="outlined"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                type="text"
                required
                variant="outlined"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Account Number"
                name="confirmAccountNumber"
                value={form.confirmAccountNumber}
                onChange={handleChange}
                type="text"
                required
                error={!!error}
                helperText={error}
                variant="outlined"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersRounded color={error ? 'error' : 'primary'} sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: error ? 'error.main' : 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifsc"
                value={form.ifsc}
                onChange={handleChange}
                required
                variant="outlined"
                inputProps={{ autoComplete: 'new-password', maxLength: 11 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CodeRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loadingBank}
                placeholder={loadingBank ? 'Fetching bank name...' : ''}
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{
            mt: 4,
            p: 2,
            borderRadius: '12px',
            bgcolor: 'rgba(30, 60, 114, 0.04)',
            border: '1px dashed rgba(30, 60, 114, 0.2)'
          }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
              ℹ️ Your data is encrypted and securely stored for payout purposes only.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: '12px',
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              px: 6,
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
              boxShadow: '0 8px 16px -4px rgba(30, 60, 114, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2a5298 0%, #1e3c72 100%)',
                boxShadow: '0 12px 20px -6px rgba(30, 60, 114, 0.4)',
              }
            }}
          >
            Verify KYC
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}