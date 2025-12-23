import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://api.bookmyevent.ae";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const moduleId = localStorage.getItem("moduleId");

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (!orderId || !userId || !moduleId) {
      setStatus("error");
      setMessage("Missing required information");
      return;
    }

    let pollCount = 0;
    const MAX_POLLS = 20; // Poll for max 60 seconds (20 * 3sec)

    const verifyAndActivate = async () => {
      try {
        console.log("🔍 Verifying payment for orderId:", orderId);

        // 🔥 STEP 1: CALL VERIFY ENDPOINT (THIS TRIGGERS BACKEND ACTIVATION)
        const verifyRes = await axios.post(
          `${API_BASE}/api/payment/verify-subscription-payment`,
          { orderId }
        );

        console.log("✅ Verify response:", verifyRes.data);

        // 🔥 STEP 2: CHECK IF IMMEDIATELY ACTIVATED
        if (verifyRes.data.success && verifyRes.data.subscription?.status === "active") {
          updateLocalStorageAndRedirect(verifyRes.data.subscription);
          return;
        }

        // 🔁 STEP 3: POLL SUBSCRIPTION STATUS (BACKUP)
        setMessage("Activating subscription...");
        
        const pollInterval = setInterval(async () => {
          pollCount++;
          
          if (pollCount > MAX_POLLS) {
            clearInterval(pollInterval);
            setStatus("error");
            setMessage("Activation timeout. Please refresh the page or contact support.");
            return;
          }

          try {
            console.log(`🔄 Polling attempt ${pollCount}/${MAX_POLLS}`);

            const subRes = await axios.get(
              `${API_BASE}/api/subscription/status/${userId}?moduleId=${moduleId}`
            );

            const sub = subRes.data?.subscription;

            if (sub?.status === "active" && sub?.isCurrent) {
              clearInterval(pollInterval);
              console.log("✅ Subscription activated!");
              updateLocalStorageAndRedirect(sub);
            }
          } catch (err) {
            console.error("Polling error:", err);
          }
        }, 3000); // Poll every 3 seconds

        // Cleanup
        return () => clearInterval(pollInterval);

      } catch (err) {
        console.error("❌ Payment verification failed:", err);
        setStatus("error");
        setMessage(err.response?.data?.message || "Payment verification failed. Please contact support.");
      }
    };

    verifyAndActivate();
  }, [orderId, userId, moduleId]);

  const updateLocalStorageAndRedirect = (subscription) => {
    console.log("💾 Updating localStorage and redirecting...");

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

    // ✅ UPDATE LOCALSTORAGE
    localStorage.setItem(
      "upgrade",
      JSON.stringify({
        isSubscribed: true,
        status: "active",
        plan: subscription.planId,
        module: subscription.moduleId,
        access: {
          canAccess: true,
          isExpired: false,
          daysLeft: daysLeft
        }
      })
    );

    setStatus("success");
    setMessage("🎉 Subscription activated successfully! Redirecting...");

    // ✅ CLEAN URL
    window.history.replaceState({}, "", "/payment-success");

    // ✅ REDIRECT AFTER 2 SECONDS
    setTimeout(() => {
      window.location.href = "/makeupartist/portfolio";
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        p: 3
      }}
    >
      {status === "verifying" && <CircularProgress size={60} sx={{ color: "#c62828" }} />}
      
      {status === "success" && (
        <Box sx={{ fontSize: 60 }}>✅</Box>
      )}

      {status === "error" && (
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {message}
        </Alert>
      )}

      <Typography variant="h6" fontWeight={600} textAlign="center">
        {message}
      </Typography>

      {status === "verifying" && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Please do not close this page...
        </Typography>
      )}
    </Box>
  );
}