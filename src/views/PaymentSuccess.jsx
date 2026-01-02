import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'https://api.bookmyevent.ae';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setMessage('Invalid payment reference.');
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/api/payment/verify-subscription-payment`,
          { orderId }
        );

        if (res.data.success && res.data.subscription?.status === 'active') {
          setStatus('success');
          setMessage('🎉 Subscription activated successfully!');

          // Redirect to login (safe & clean)
          setTimeout(() => {
            window.location.replace('/login');
          }, 2000);
          return;
        }

        if (res.data.status === 'pending') {
          setStatus('verifying');
          setMessage('Payment is being processed. Please wait...');
          return;
        }

        setStatus('error');
        setMessage(res.data.message || 'Payment failed');
      } catch (err) {
        setStatus('error');
        setMessage('Unable to verify payment. Please contact support.');
      }
    };

    verify();
  }, [orderId]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        p: 3,
        bgcolor: '#f9fafc'
      }}
    >
      {status === 'verifying' && (
        <CircularProgress size={60} sx={{ color: '#c62828' }} />
      )}

      {status === 'success' && <Box sx={{ fontSize: 80 }}>✅</Box>}

      {status === 'error' && (
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {message}
        </Alert>
      )}

      <Typography variant="h5" fontWeight={600} textAlign="center">
        {message}
      </Typography>

      {status === 'verifying' && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Please do not close this page. This usually takes a few seconds...
        </Typography>
      )}

      {orderId && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, opacity: 0.6 }}>
          Order ID: {orderId}
        </Typography>
      )}
    </Box>
  );
}
