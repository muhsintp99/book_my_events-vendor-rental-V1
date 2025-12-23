import { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

// ✅ USE PROD API
const API_BASE = "https://api.bookmyevent.ae";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const moduleId = localStorage.getItem("moduleId");

  useEffect(() => {
    if (!orderId || !userId || !moduleId) return;

    let interval;

    const startVerification = async () => {
      try {
        // 🔥 STEP 1: VERIFY PAYMENT (IMPORTANT)
        await axios.post(
          `${API_BASE}/api/payment/verify-subscription-payment`,
          { orderId }
        );

        // 🔁 STEP 2: POLL SUBSCRIPTION STATUS
        interval = setInterval(async () => {
          const res = await axios.get(
            `${API_BASE}/api/subscription/status/${userId}?moduleId=${moduleId}`
          );

          const sub = res.data?.subscription;

          if (sub?.status === "active" && sub?.isCurrent) {
            clearInterval(interval);

            localStorage.setItem(
              "upgrade",
              JSON.stringify({
                isSubscribed: true,
                status: "active",
                plan: sub.planId,
                module: sub.moduleId,
                access: {
                  canAccess: true,
                  isExpired: false
                }
              })
            );

            // ✅ CLEAN URL
            window.history.replaceState({}, "", "/payment-success");

            // ✅ REDIRECT
            window.location.href = "/makeupartist/portfolio";
          }
        }, 3000);
      } catch (err) {
        console.error("Payment verification failed:", err);
      }
    };

    startVerification();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, userId, moduleId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography fontWeight={600}>
        Activating your subscription, please wait…
      </Typography>
    </Box>
  );
}
