import { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ USE PRODUCTION API
const API_BASE = 'https://api.bookmyevent.ae';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('orderId');

  // Get from localStorage (may be undefined if session expired)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const localUserId = user?._id;
  const localModuleId = localStorage.getItem('moduleId');

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying payment...');

  // Use refs to store userId/moduleId that we get from subscription response
  const userIdRef = useRef(localUserId);
  const moduleIdRef = useRef(localModuleId);

  useEffect(() => {
  if (!orderId) {
    setStatus("error");
    setMessage("Invalid payment reference.");
    return;
  }

  const verify = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/payment/verify-subscription-payment`,
        { orderId }
      );

      if (res.data.success && res.data.subscription?.status === "active") {
        setStatus("success");
        setMessage("🎉 Subscription activated successfully!");

        // OPTIONAL: redirect after success
        setTimeout(() => {
          window.location.replace("/login");
        }, 2000);
        return;
      }

      if (res.data.status === "pending") {
        setStatus("verifying");
        setMessage("Payment is being processed. Please wait...");
        return;
      }

      setStatus("error");
      setMessage(res.data.message || "Payment failed");

    } catch (err) {
      setStatus("error");
      setMessage("Unable to verify payment. Please contact support.");
    }
  };

  verify();
}, [orderId]);


  const updateLocalStorageAndRedirect = (subscription) => {
    console.log('💾 Updating localStorage...');
    console.log('📦 Subscription data:', subscription);

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

    // 🔧 FIX: Extract moduleId as string (handle both object and string)
    const moduleIdString =
      typeof subscription.moduleId === 'object' ? subscription.moduleId?._id || subscription.moduleId : subscription.moduleId;

    // 🔧 FIX: Extract planId as string or object properly
    const planData = subscription.planId;

    console.log('📝 Storing moduleId:', moduleIdString);
    console.log('📝 Storing plan:', planData);

    // ✅ UPDATE LOCALSTORAGE - Store moduleId as string for reliable comparison
    localStorage.setItem(
      'upgrade',
      JSON.stringify({
        isSubscribed: true,
        status: 'active',
        plan: planData,
        module: moduleIdString, // 🔧 FIX: Always store as string
        access: {
          canAccess: true,
          isExpired: false,
          daysLeft: daysLeft
        }
      })
    );

    // 🔥 Update moduleId in localStorage
    localStorage.setItem('moduleId', moduleIdString);

    console.log('✅ LocalStorage updated successfully');
    console.log('🔍 Verification - upgrade:', localStorage.getItem('upgrade'));
    console.log('🔍 Verification - moduleId:', localStorage.getItem('moduleId'));

    setStatus('success');
    setMessage('🎉 Subscription activated successfully! Redirecting...');

    // ✅ CLEAN URL
    window.history.replaceState({}, '', '/payment-success');

    // ✅ REDIRECT (use window.location.replace for full page reload to ensure state sync)
    setTimeout(() => {
      window.location.replace('/makeupartist/portfolio');
    }, 2000);
  };

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
      {status === 'verifying' && <CircularProgress size={60} sx={{ color: '#c62828' }} />}

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
          Please do not close this page. This usually takes 5-10 seconds...
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
