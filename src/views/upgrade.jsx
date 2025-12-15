import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Snackbar
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import axios from "axios";

/* ---------- CONFIG ---------- */
const MAX_DESC_CHARS = 120;
const MAX_FEATURES = 3;

export default function UpgradePlanUI() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingPlanId, setPayingPlanId] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState(null);
  const [expandedFeatures, setExpandedFeatures] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const moduleId = localStorage.getItem("moduleId");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  /* ---------- FETCH MODULE PLANS ---------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/subscription/plan/module/${moduleId}`
        );
        setPlans(res.data.plans || []);
      } catch {
        setSnackbar({ open: true, message: "Failed to load plans" });
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchPlans();
  }, [moduleId]);

  /* ---------- START PAYMENT ---------- */
  const handleUpgrade = async (planId) => {
    if (!userId || !moduleId) {
      setSnackbar({ open: true, message: "User or module missing" });
      return;
    }

    try {
      setPayingPlanId(planId);

      const res = await axios.post(
        "https://api.bookmyevent.ae/api/payment/create-subscription-payment",
        {
          userId,
          moduleId,
          planId // ✅ ONLY planId — NO amount
        }
      );

      if (res.data?.payment_links?.web) {
        window.location.href = res.data.payment_links.web;
      } else {
        throw new Error("Payment link missing");
      }
    } catch {
      setSnackbar({ open: true, message: "Payment initiation failed" });
      setPayingPlanId(null);
    }
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: "#c62828" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafc", py: 6 }}>
      <Box maxWidth="md" mx="auto">

        <Typography variant="h4" fontWeight={800} textAlign="center">
          Upgrade Your Plan
        </Typography>
        <Typography textAlign="center" color="text.secondary" mb={3}>
          Choose the best plan for your business
        </Typography>

        <Alert severity="success" sx={{ mb: 4, border: "1px solid #c62828", color: "#c62828" }}>
          Current Plan: <b>FREE</b>
        </Alert>

        <Grid container spacing={3} justifyContent="center">

          {/* ================= FREE PLAN ================= */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", borderRadius: 4, border: "2px solid #c62828" }}>
              <CardContent>
                <Chip label="CURRENT PLAN" sx={{ bgcolor: "#c62828", color: "#fff", mb: 2 }} />
                <Typography variant="h6" fontWeight={800}>FREE</Typography>
                <Typography color="text.secondary">
                  Basic access to get started on the platform
                </Typography>

                <Typography variant="h4" fontWeight={900} color="#c62828" mt={2}>₹0</Typography>
                <Divider sx={{ my: 2 }} />

                <Stack spacing={1}>
                  {["Limited listings", "Basic visibility", "Standard support"].map(f => (
                    <Box key={f} display="flex" alignItems="center">
                      <CheckCircleIcon sx={{ color: "#c62828", mr: 1 }} />
                      <Typography variant="body2">{f}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Button fullWidth disabled sx={{ mt: 3, bgcolor: "#e57373", color: "#fff", fontWeight: 700 }}>
                  Current Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* ================= PREMIUM PLANS ================= */}
          {plans.map(plan => {
            const showDesc = expandedDesc === plan._id;
            const showFeatures = expandedFeatures === plan._id;

            return (
              <Grid item xs={12} md={6} key={plan._id}>
                <Card sx={{ height: "100%", borderRadius: 4, border: "2px solid #c62828" }}>
                  <CardContent>
                    <Chip
                      icon={<WorkspacePremiumIcon />}
                      label="BEST VALUE"
                      sx={{ bgcolor: "#c62828", color: "#fff", mb: 2 }}
                    />

                    <Typography variant="h6" fontWeight={800}>{plan.name}</Typography>

                    {/* DESCRIPTION */}
                    <Typography color="text.secondary">
                      {showDesc
                        ? plan.description
                        : `${plan.description.slice(0, MAX_DESC_CHARS)}...`}
                      <Button
                        size="small"
                        onClick={() => setExpandedDesc(showDesc ? null : plan._id)}
                        sx={{ textTransform: "none", fontWeight: 600, color: "#c62828" }}
                      >
                        {showDesc ? "Read less" : "Read more"}
                      </Button>
                    </Typography>

                    <Typography variant="h4" fontWeight={900} color="#c62828" mt={2}>
                      ₹{plan.price} <span style={{ fontSize: 14 }}>/ year</span>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* FEATURES */}
                    <Stack spacing={1}>
                      {(showFeatures ? plan.features : plan.features.slice(0, MAX_FEATURES)).map((f, i) => (
                        <Box key={i} display="flex" alignItems="center">
                          <CheckCircleIcon sx={{ color: "#c62828", mr: 1 }} />
                          <Typography variant="body2">{f}</Typography>
                        </Box>
                      ))}
                    </Stack>

                    {plan.features.length > MAX_FEATURES && (
                      <Button
                        size="small"
                        onClick={() => setExpandedFeatures(showFeatures ? null : plan._id)}
                        sx={{ mt: 1, textTransform: "none", fontWeight: 600, color: "#c62828" }}
                      >
                        {showFeatures ? "Show less" : "Read more"}
                      </Button>
                    )}

                    <Button
                      fullWidth
                      disabled={payingPlanId === plan._id}
                      onClick={() => handleUpgrade(plan._id)}
                      sx={{
                        mt: 3,
                        bgcolor: "#c62828",
                        color: "#fff",
                        fontWeight: 800,
                        borderRadius: 3,
                        "&:hover": { bgcolor: "#b71c1c" }
                      }}
                    >
                      {payingPlanId === plan._id ? "Redirecting..." : "Upgrade To Premium"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Box>
  );
}
