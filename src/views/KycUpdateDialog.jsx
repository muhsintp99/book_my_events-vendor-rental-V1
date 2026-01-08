import React, { useState } from 'react';
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
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';

export default function KycUpdateDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    idType: '',
    idNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifsc: ''
  });

  const steps = ['Personal Details', 'Address Details', 'Bank Details'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    console.log('KYC FORM DATA:', form);
    onClose();
    setActiveStep(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Full Name" 
                name="fullName" 
                value={form.fullName} 
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Mobile Number" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Email" 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Government ID Type"
                name="idType"
                value={form.idType}
                onChange={handleChange}
                required
              >
                <MenuItem value="aadhaar">Aadhaar</MenuItem>
                <MenuItem value="pan">PAN</MenuItem>
                <MenuItem value="passport">Passport</MenuItem>
                <MenuItem value="driving">Driving License</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Government ID Number" 
                name="idNumber" 
                value={form.idNumber} 
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Address" 
                name="address" 
                value={form.address} 
                onChange={handleChange}
                multiline
                rows={2}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth 
                label="City" 
                name="city" 
                value={form.city} 
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth 
                label="State" 
                name="state" 
                value={form.state} 
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth 
                label="Pincode" 
                name="pincode" 
                value={form.pincode} 
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Account Holder Name" 
                name="accountHolder" 
                value={form.accountHolder} 
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Bank Name" 
                name="bankName" 
                value={form.bankName} 
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Account Number" 
                name="accountNumber" 
                value={form.accountNumber} 
                onChange={handleChange}
                type="number"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="IFSC Code" 
                name="ifsc" 
                value={form.ifsc} 
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Action Required ⚠️
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Please update your KYC and bank details to ensure smooth and timely
          payment settlements for your bookings.
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">
          Later
        </Button>
        
        <Box>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          
          {activeStep < steps.length - 1 ? (
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#E15B65', '&:hover': { bgcolor: '#C84B55' } }} 
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#E15B65', '&:hover': { bgcolor: '#C84B55' } }} 
              onClick={handleSubmit}
            >
              Submit KYC
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}