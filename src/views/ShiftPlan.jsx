import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

// Payment methods with logo URLs
const paymentMethods = [
  { label: "Wallet", value: "wallet", extra: "$160.32", logo: "https://img.icons8.com/ios-filled/50/000000/wallet-app.png" },
  { label: "Paypal", value: "paypal", logo: "https://www.logo.wine/a/logo/PayPal/PayPal-Logo.wine.svg" },
  { label: "Bkash", value: "bkash", logo: "/images/bkash.png" },
  { label: "Stripe", value: "stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { label: "Razor pay", value: "razorpay", logo: "https://razorpay.com/favicon.png" },
  { label: "Senang pay", value: "senangpay", logo: "https://seeklogo.com/images/S/senangpay-logo-6ED0D6AC73-seeklogo.com.png" },
  { label: "Flutterwave", value: "flutterwave", logo: "https://flutterwave.com/images/logo-colored.svg" },
  { label: "Paystack", value: "paystack", logo: "https://seeklogo.com/images/P/paystack-logo-B3BA0B8D28-seeklogo.com.png" },
  { label: "Ssl commerz", value: "sslcommerz", logo: "https://sslcommerz.com/favicon.ico" },
];

const ShiftPlan = ({ open: controlledOpen, onClose }) => {
  const [internalOpen, setInternalOpen] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("");

  // Decide whether to use controlled or internal open state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 3, p: 1, maxHeight: "90vh" },
      }}
    >
      <DialogContent dividers>
        {/* Top Heading */}
        <Box textAlign="center" mt={2}>
          <Typography variant="h3" fontWeight="bold">
            Shift to New Subscription Plan
          </Typography>
        </Box>

        {/* Extra Box Row */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={4} p={3}>
          <Card
            sx={{
              borderRadius: 3,
              flex: 1,
              textAlign: "center",
              py: 4,
              bgcolor: "#eeeeefff",
              color: "white",
              height: 180,
            }}
          >
            <Typography variant="h3">Commission</Typography>
            <Typography variant="h4" fontWeight="bold">10 %</Typography>
          </Card>

          <Box>
            <Typography fontSize={32} color="success.main">↔</Typography>
          </Box>

          <Card
            sx={{
              borderRadius: 3,
              flex: 1,
              textAlign: "center",
              py: 4,
              bgcolor: "#89b8e8ff",
              color: "white",
              height: 180,
            }}
          >
            <Typography variant="h3">Regular</Typography>
            <Typography variant="h4" fontWeight="bold">$ 500.00</Typography>
            <Typography variant="body2">365 Days</Typography>
          </Card>
        </Box>

        {/* Validity / Price / Bill Status */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          sx={{ bgcolor: "grey.100", borderRadius: 2 }}
        >
          <Box sx={{ maxWidth: 800, mt: 3, mb: 3 }}>
            <Typography variant="body1" color="text.secondary">Validity</Typography>
            <Typography variant="h2" fontWeight="bold">365 Days</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Price</Typography>
            <Typography variant="h2" fontWeight="bold">$ 500.00</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Bill status</Typography>
            <Typography variant="h2" fontWeight="bold" color="primary">
              Migrate to new plan
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Payment Methods */}
        <Typography variant="subtitle1" gutterBottom>
          Pay Via Online{" "}
          <Typography component="span" color="text.secondary" variant="body2">
            (Faster & secure way to pay bill)
          </Typography>
        </Typography>

        <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
          <Grid container spacing={2} mt={1}>
            {paymentMethods.map((method, index) => (
              <Grid item xs={12} sm={6} key={method.value}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    height: "100%",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => setSelectedMethod(method.value)}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: 60,
                      height: "100%",
                    }}
                  >
                    <FormControlLabel
                      value={method.value}
                      control={<Radio />}
                      label={method.label}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      {method.extra && (
                        <Typography variant="body2" color="text.secondary">
                          {method.extra}
                        </Typography>
                      )}
                      {method.logo && (
                        <img
                          src={method.logo}
                          alt={method.label}
                          style={{ width: 50, height: 25, objectFit: "contain" }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={() => alert(`Selected: ${selectedMethod}`)}
          variant="contained"
          color="primary"
          disabled={!selectedMethod}
        >
          Change Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftPlan;
