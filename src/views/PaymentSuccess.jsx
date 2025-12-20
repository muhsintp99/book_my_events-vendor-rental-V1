import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const orderId = params.get("order_id");
    if (!orderId) {
      setMessage("Invalid payment session");
      return;
    }

    const verify = async () => {
      try {
        await axios.post(
          "https://api.bookmyevent.ae/api/subscription/verify",
          { orderId }
        );

        setMessage("✅ Payment successful! Activating plan…");

        setTimeout(() => {
          navigate("/makeupartist/upgrade", { replace: true });
        }, 1500);
      } catch (err) {
        setMessage("❌ Payment verification failed");
      }
    };

    verify();
  }, [params, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography fontWeight={600}>{message}</Typography>
    </Box>
  );
}
