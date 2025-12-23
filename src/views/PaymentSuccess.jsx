import { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function PaymentSuccess() {
  const [params] = useSearchParams();

  const orderId = params.get("orderId");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const moduleId = localStorage.getItem("moduleId");

  useEffect(() => {
    if (!orderId || !userId || !moduleId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/subscription/status/${userId}?moduleId=${moduleId}`
        );

        if (res.data?.subscription?.status === "active") {
          clearInterval(interval);

          localStorage.setItem(
            "upgrade",
            JSON.stringify({
              isSubscribed: true,
              status: "active",
              plan: res.data.subscription.planId,
              module: res.data.subscription.moduleId,
              access: {
                canAccess: true,
                isExpired: false
              }
            })
          );

          window.location.href = "/makeupartist/portfolio";
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
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
