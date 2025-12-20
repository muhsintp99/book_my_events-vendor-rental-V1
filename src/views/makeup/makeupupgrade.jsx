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
  
  // ✅ NEW: Track current subscription
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const moduleId = localStorage.getItem("moduleId");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;



  /* ---------- HANDLE JUSPAY RETURN ---------- */
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");

  if (!orderId) return;

  const verifyPayment = async () => {
    try {
      setSnackbar({
        open: true,
        message: "Verifying payment, please wait..."
      });

      const res = await axios.post(
        "https://api.bookmyevent.ae/api/subscription/verify",
        { orderId }
      );

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: "🎉 Premium Plan Activated Successfully!"
        });

        // 🔄 Refresh subscription status
        setSubscriptionLoading(true);
        const subRes = await axios.get(
          `https://api.bookmyevent.ae/api/subscription/status/${userId}`
        );

        if (subRes.data.success) {
          setCurrentSubscription(subRes.data.subscription);
        }

        // 🧹 Clean URL (remove order_id)
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Payment verification failed"
      });
    } finally {
      setSubscriptionLoading(false);
      localStorage.removeItem("pendingUpgrade");
    }
  };

  verifyPayment();
}, [userId]);


  /* ---------- FETCH CURRENT SUBSCRIPTION ---------- */
  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      if (!userId || !moduleId) {
        setSubscriptionLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/subscription/status/${userId}`
        );
        
        if (res.data.success && res.data.subscription) {
          // Check if subscription is for current module and is active
          const sub = res.data.subscription;
          if (sub.moduleId?._id === moduleId && sub.status === 'active') {
            setCurrentSubscription(sub);
          }
        }
      } catch (error) {
        console.log("No active subscription found");
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchCurrentSubscription();
  }, [userId, moduleId]);

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

  /* ---------- HANDLE UPGRADE - DIRECT TO PAYMENT ---------- */
  const handleUpgrade = async (plan) => {
    if (!userId || !moduleId) {
      setSnackbar({ open: true, message: "User or module missing" });
      return;
    }

    try {
      setPayingPlanId(plan._id);

      console.log("🚀 Creating payment session...");
      console.log("Plan:", plan.name, "Price:", plan.price);

      // ✅ DIRECTLY create payment session
      const paymentRes = await axios.post(
        "https://api.bookmyevent.ae/api/payment/create-subscription-payment",
        {
          providerId: userId,
          planId: plan._id,
          amount: plan.price,
          customerEmail: user.email,
          customerPhone: user.mobile || user.phone || "9999999999"
        }
      );

      console.log("✅ Payment response:", paymentRes.data);

      if (paymentRes.data?.payment_links?.web) {
        // Store pending upgrade info for payment callback
        localStorage.setItem('pendingUpgrade', JSON.stringify({
          userId,
          moduleId,
          planId: plan._id,
          planName: plan.name,
          amount: plan.price
        }));

        setSnackbar({ 
          open: true, 
          message: "Redirecting to payment page..." 
        });

        // Redirect to payment page
        setTimeout(() => {
          window.location.href = paymentRes.data.payment_links.web;
        }, 1000);
      } else {
        throw new Error("Payment link not available");
      }
    } catch (error) {
      console.error("❌ Payment error:", error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || error.message || "Payment initiation failed" 
      });
      setPayingPlanId(null);
    }
  };

  /* ---------- LOADING ---------- */
  if (loading || subscriptionLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: "#c62828" }} />
      </Box>
    );
  }

  // ✅ Check if user already has this plan
  const isCurrentPlan = (planId) => {
    return currentSubscription?.planId?._id === planId;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafc", py: 6 }}>
      <Box maxWidth="md" mx="auto" px={2}>

        <Typography variant="h4" fontWeight={800} textAlign="center">
          {currentSubscription ? "Manage Your Plan" : "Upgrade Your Plan"}
        </Typography>
        <Typography textAlign="center" color="text.secondary" mb={3}>
          Choose the best plan for your business
        </Typography>

        {/* ✅ Show current plan info */}
        {currentSubscription ? (
          <Alert severity="success" sx={{ mb: 4, border: "1px solid #4caf50" }}>
            Current Plan: <b>{currentSubscription.planId?.name || "PREMIUM"}</b> 
            {" - "}Expires on: <b>{new Date(currentSubscription.endDate).toLocaleDateString()}</b>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 4, border: "1px solid #2196f3" }}>
            Current Plan: <b>FREE</b> - Upgrade to unlock premium features
          </Alert>
        )}

        <Grid container spacing={3} justifyContent="center">

          {/* ================= FREE PLAN (only show if no subscription) ================= */}
          {!currentSubscription && (
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: "100%", 
                borderRadius: 4, 
                border: "2px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <CardContent>
                  <Chip 
                    label="CURRENT PLAN" 
                    sx={{ bgcolor: "#9e9e9e", color: "#fff", mb: 2 }} 
                  />
                  <Typography variant="h6" fontWeight={800}>FREE</Typography>
                  <Typography color="text.secondary" sx={{ minHeight: 48 }}>
                    Basic access to get started on the platform
                  </Typography>

                  <Typography variant="h4" fontWeight={900} color="#9e9e9e" mt={2}>
                    ₹0
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1}>
                    {["Limited listings", "Basic visibility", "Standard support"].map(f => (
                      <Box key={f} display="flex" alignItems="center">
                        <CheckCircleIcon sx={{ color: "#9e9e9e", mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">{f}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Button 
                    fullWidth 
                    disabled 
                    sx={{ 
                      mt: 3, 
                      bgcolor: "#e0e0e0", 
                      color: "#757575", 
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: "none"
                    }}
                  >
                    Current Plan
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* ================= PREMIUM PLANS ================= */}
          {plans.map(plan => {
            const showDesc = expandedDesc === plan._id;
            const showFeatures = expandedFeatures === plan._id;
            const isPaying = payingPlanId === plan._id;
            const isCurrent = isCurrentPlan(plan._id);

            return (
              <Grid item xs={12} md={6} key={plan._id}>
                <Card sx={{ 
                  height: "100%", 
                  borderRadius: 4, 
                  border: isCurrent ? "3px solid #4caf50" : "3px solid #c62828",
                  boxShadow: isCurrent 
                    ? "0 4px 20px rgba(76, 175, 80, 0.2)" 
                    : "0 4px 20px rgba(198, 40, 40, 0.2)",
                  position: "relative",
                  overflow: "visible"
                }}>
                  <CardContent>
                    <Chip
                      icon={isCurrent ? <CheckCircleIcon /> : <WorkspacePremiumIcon />}
                      label={isCurrent ? "CURRENT PLAN" : "BEST VALUE"}
                      sx={{ 
                        bgcolor: isCurrent ? "#4caf50" : "#c62828", 
                        color: "#fff", 
                        mb: 2,
                        fontWeight: 700
                      }}
                    />

                    <Typography variant="h6" fontWeight={800} color={isCurrent ? "#4caf50" : "#c62828"}>
                      {plan.name}
                    </Typography>

                    {/* DESCRIPTION */}
                    {plan.description && plan.description.length > MAX_DESC_CHARS ? (
                      <Typography color="text.secondary" sx={{ minHeight: 48 }}>
                        {showDesc
                          ? plan.description
                          : `${plan.description.slice(0, MAX_DESC_CHARS)}...`}
                        <Button
                          size="small"
                          onClick={() => setExpandedDesc(showDesc ? null : plan._id)}
                          sx={{ 
                            textTransform: "none", 
                            fontWeight: 600, 
                            color: isCurrent ? "#4caf50" : "#c62828",
                            p: 0,
                            minWidth: "auto",
                            ml: 0.5
                          }}
                        >
                          {showDesc ? "Read less" : "Read more"}
                        </Button>
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" sx={{ minHeight: 48 }}>
                        {plan.description}
                      </Typography>
                    )}

                    <Typography variant="h4" fontWeight={900} color={isCurrent ? "#4caf50" : "#c62828"} mt={2}>
                      ₹{plan.price}
                      <Typography 
                        component="span" 
                        sx={{ fontSize: 14, fontWeight: 400, color: "text.secondary", ml: 1 }}
                      >
                        / year
                      </Typography>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* FEATURES */}
                    <Stack spacing={1}>
                      {(showFeatures ? plan.features : plan.features.slice(0, MAX_FEATURES)).map((f, i) => (
                        <Box key={i} display="flex" alignItems="flex-start">
                          <CheckCircleIcon sx={{ color: isCurrent ? "#4caf50" : "#c62828", mr: 1, mt: 0.3, fontSize: 20 }} />
                          <Typography variant="body2">{f}</Typography>
                        </Box>
                      ))}
                    </Stack>

                    {plan.features.length > MAX_FEATURES && (
                      <Button
                        size="small"
                        onClick={() => setExpandedFeatures(showFeatures ? null : plan._id)}
                        sx={{ 
                          mt: 1, 
                          textTransform: "none", 
                          fontWeight: 600, 
                          color: isCurrent ? "#4caf50" : "#c62828",
                          p: 0
                        }}
                      >
                        {showFeatures ? "Show less" : `+${plan.features.length - MAX_FEATURES} more features`}
                      </Button>
                    )}

                    <Button
                      fullWidth
                      disabled={isPaying || isCurrent}
                      onClick={() => handleUpgrade(plan)}
                      sx={{
                        mt: 3,
                        bgcolor: isCurrent ? "#e0e0e0" : "#c62828",
                        color: isCurrent ? "#757575" : "#fff",
                        fontWeight: 800,
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontSize: 16,
                        "&:hover": { bgcolor: isCurrent ? "#e0e0e0" : "#b71c1c" },
                        "&:disabled": { bgcolor: "#e0e0e0" }
                      }}
                    >
                      {isCurrent ? (
                        "Current Plan"
                      ) : isPaying ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <CircularProgress size={20} sx={{ color: "#fff" }} />
                          Redirecting...
                        </Box>
                      ) : (
                        currentSubscription ? "Switch Plan" : "Upgrade To Premium"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Help Text */}
        <Box sx={{ mt: 4, p: 2, bgcolor: "#fff3e0", borderRadius: 2, border: "1px solid #ffb74d" }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            💡 <strong>Note:</strong> After clicking "Upgrade To Premium", you'll be redirected to a secure payment page. 
            Your subscription will be activated immediately after successful payment.
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar({ open: false, message: "" })} 
          severity={snackbar.message.includes("Failed") || snackbar.message.includes("failed") ? "error" : "info"}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}