import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

// ✅ USE PRODUCTION API
const API_BASE = "https://api.bookmyevent.ae";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const moduleId = localStorage.getItem("moduleId");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    console.log("🚀 PaymentSuccess component mounted");
    console.log("📋 URL params - orderId:", orderId);
    console.log("📋 localStorage - userId:", userId);
    console.log("📋 localStorage - moduleId:", moduleId);
    console.log("📋 Full URL:", window.location.href);

    if (!orderId) {
      console.error("❌ No orderId in URL!");
      setStatus("error");
      setMessage("No order ID found. Please check the URL.");
      return;
    }

    if (!userId || !moduleId) {
      console.error("❌ Missing userId or moduleId in localStorage!");
      setStatus("error");
      setMessage("Missing user information. Please login again.");
      return;
    }

    let pollInterval;
    let pollCount = 0;
    const MAX_POLLS = 20;

    const verifyAndActivate = async () => {
      try {
        console.log("🔍 Starting payment verification...");
        console.log("🔗 Calling:", `${API_BASE}/api/payment/verify-subscription-payment`);
        console.log("📦 Payload:", { orderId });

        // 🔥 STEP 1: VERIFY PAYMENT (Backend checks Juspay + activates)
        const verifyRes = await axios.post(
          `${API_BASE}/api/payment/verify-subscription-payment`,
          { orderId }
        );

        console.log("✅ Verify API Response:", JSON.stringify(verifyRes.data, null, 2));

        // 🔥 STEP 2: CHECK IF IMMEDIATELY ACTIVATED
        if (
          verifyRes.data.success &&
          verifyRes.data.subscription?.status === "active" &&
          verifyRes.data.subscription?.isCurrent
        ) {
          console.log("✅ Payment verified and subscription ACTIVE!");
          updateLocalStorageAndRedirect(verifyRes.data.subscription);
          return;
        }

        // Check if success but subscription not active yet
        if (verifyRes.data.success && verifyRes.data.subscription) {
          console.log("⚠️ Subscription exists but status:", verifyRes.data.subscription.status);
        }

        // 🔁 STEP 3: PAYMENT PENDING - START POLLING
        console.log("⏳ Payment pending, starting polling...");
        setMessage("Payment confirmed. Activating subscription...");

        pollInterval = setInterval(async () => {
          pollCount++;

          if (pollCount > MAX_POLLS) {
            clearInterval(pollInterval);
            setStatus("error");
            setMessage(
              "Activation is taking longer than expected. Your payment is successful. Please refresh the page in a few minutes or contact support."
            );
            return;
          }

          try {
            console.log(`🔄 Poll attempt ${pollCount}/${MAX_POLLS}`);

            const subRes = await axios.get(
              `${API_BASE}/api/subscription/status/${userId}?moduleId=${moduleId}`
            );

            console.log("📡 Poll response:", subRes.data);

            const sub = subRes.data?.subscription;

            if (sub?.status === "active" && sub?.isCurrent) {
              clearInterval(pollInterval);
              console.log("✅ Subscription activated via polling!");
              updateLocalStorageAndRedirect(sub);
            }
          } catch (err) {
            console.error("Polling error:", err.message);
            // Continue polling despite errors
          }
        }, 3000);
      } catch (err) {
        console.error("❌ Payment verification FAILED!");
        console.error("❌ Error:", err.message);
        console.error("❌ Response:", err.response?.data);

        // Check if it's a payment pending error (still success)
        if (
          err.response?.data?.status === "pending" ||
          err.response?.data?.message?.includes("pending")
        ) {
          console.log("⏳ Payment is pending, will poll...");
          setMessage("Payment is being processed. Checking status...");
          // Don't set error - payment might still succeed
        } else {
          setStatus("error");
          setMessage(
            err.response?.data?.message ||
            "Payment verification failed. Please contact support with order ID: " +
            orderId
          );
        }
      }
    };

    verifyAndActivate();

    // Cleanup on unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [orderId, userId, moduleId]);

  const updateLocalStorageAndRedirect = (subscription) => {
    console.log("💾 Updating localStorage...");
    console.log("📦 Subscription data:", subscription);

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const daysLeft = Math.max(
      0,
      Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    );

    // 🔧 FIX: Extract moduleId as string (handle both object and string)
    const moduleIdString = typeof subscription.moduleId === 'object'
      ? subscription.moduleId?._id || subscription.moduleId
      : subscription.moduleId;

    // 🔧 FIX: Extract planId as string or object properly
    const planData = subscription.planId;

    console.log("📝 Storing moduleId:", moduleIdString);
    console.log("📝 Storing plan:", planData);

    // ✅ UPDATE LOCALSTORAGE - Store moduleId as string for reliable comparison
    localStorage.setItem(
      "upgrade",
      JSON.stringify({
        isSubscribed: true,
        status: "active",
        plan: planData,
        module: moduleIdString, // 🔧 FIX: Always store as string
        access: {
          canAccess: true,
          isExpired: false,
          daysLeft: daysLeft,
        },
      })
    );

    // 🔥 Update moduleId in localStorage
    localStorage.setItem("moduleId", moduleIdString);

    console.log("✅ LocalStorage updated successfully");
    console.log("🔍 Verification - upgrade:", localStorage.getItem("upgrade"));
    console.log("🔍 Verification - moduleId:", localStorage.getItem("moduleId"));

    setStatus("success");
    setMessage("🎉 Subscription activated successfully! Redirecting...");

    // ✅ CLEAN URL
    window.history.replaceState({}, "", "/payment-success");

    // ✅ REDIRECT (use window.location.replace for full page reload to ensure state sync)
    setTimeout(() => {
      window.location.replace("/makeupartist/portfolio");
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
        p: 3,
        bgcolor: "#f9fafc",
      }}
    >
      {status === "verifying" && (
        <CircularProgress size={60} sx={{ color: "#c62828" }} />
      )}

      {status === "success" && <Box sx={{ fontSize: 80 }}>✅</Box>}

      {status === "error" && (
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {message}
        </Alert>
      )}

      <Typography variant="h5" fontWeight={600} textAlign="center">
        {message}
      </Typography>

      {status === "verifying" && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Please do not close this page. This usually takes 5-10 seconds...
        </Typography>
      )}

      {orderId && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, opacity: 0.6 }}
        >
          Order ID: {orderId}
        </Typography>
      )}
    </Box>
  );
}