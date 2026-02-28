import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Stack, Divider, Alert, CircularProgress, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import axios from 'axios';

/* ---------- CONFIG ---------- */
const MAX_DESC_CHARS = 120;
const MAX_FEATURES = 3;
const API_BASE = 'https://api.bookmyevent.ae';
const PRIMARY_COLOR = '#0f172a';

export default function PanthalUpgradePlanUI() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingPlanId, setPayingPlanId] = useState(null);
    const [expandedDesc, setExpandedDesc] = useState(null);
    const [expandedFeatures, setExpandedFeatures] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);

    const moduleId = localStorage.getItem('moduleId');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?._id;

    /* ---------- HANDLE JUSPAY RETURN ---------- */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('orderId');

        if (!orderId) {
            setSubscriptionLoading(false);
            return;
        }

        const verifyPayment = async () => {
            try {
                setSnackbar({ open: true, message: 'Verifying payment...', severity: 'info' });

                const res = await axios.post(`${API_BASE}/api/payment/verify-subscription-payment`, { orderId });

                if (res.data.success) {
                    setSnackbar({
                        open: true,
                        message: '🎉 Premium Plan Activated!',
                        severity: 'success'
                    });

                    const resModuleId =
                        typeof res.data.subscription.moduleId === 'object'
                            ? res.data.subscription.moduleId?._id || res.data.subscription.moduleId
                            : res.data.subscription.moduleId;

                    const subRes = await axios.get(`${API_BASE}/api/subscription/status/${userId}?moduleId=${resModuleId}`);

                    if (subRes.data.success && subRes.data.subscription) {
                        const subscription = subRes.data.subscription;
                        const moduleIdString =
                            typeof subscription.moduleId === 'object' ? subscription.moduleId?._id || subscription.moduleId : subscription.moduleId;

                        localStorage.setItem('moduleId', moduleIdString);

                        const endDate = new Date(subscription.endDate);
                        const now = new Date();
                        const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

                        localStorage.setItem(
                            'upgrade',
                            JSON.stringify({
                                isSubscribed: true,
                                status: 'active',
                                plan: subscription.planId,
                                module: moduleIdString,
                                access: {
                                    canAccess: true,
                                    isExpired: false,
                                    daysLeft: daysLeft
                                }
                            })
                        );

                        setCurrentSubscription(subscription);
                        window.history.replaceState({}, '', window.location.pathname);

                        setTimeout(() => {
                            window.location.replace('/panthal/portfolio');
                        }, 2000);
                    }
                } else {
                    setSnackbar({
                        open: true,
                        message: res.data.message || 'Payment verification failed',
                        severity: 'error'
                    });
                }
            } catch (err) {
                console.error('❌ Payment verification error:', err);
                setSnackbar({
                    open: true,
                    message: err.response?.data?.message || 'Payment verification failed',
                    severity: 'error'
                });
            } finally {
                setSubscriptionLoading(false);
            }
        };

        verifyPayment();
    }, [userId, moduleId]);

    /* ---------- FETCH CURRENT SUBSCRIPTION ---------- */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('orderId')) return;

        const fetchCurrentSubscription = async () => {
            if (!userId || !moduleId) {
                setSubscriptionLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_BASE}/api/subscription/status/${userId}?moduleId=${moduleId}`);
                if (res.data.success && res.data.subscription) {
                    const sub = res.data.subscription;
                    if (sub.status === 'active' && sub.isCurrent) {
                        setCurrentSubscription(sub);
                    }
                }
            } catch (error) {
                console.error('❌ API error:', error.message);
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
                const res = await axios.get(`${API_BASE}/api/subscription/plan/module/${moduleId}`);
                setPlans(res.data.plans || []);
            } catch {
                setSnackbar({ open: true, message: 'Failed to load plans', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (moduleId) fetchPlans();
    }, [moduleId]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    /* ---------- HANDLE UPGRADE - DIRECT TO PAYMENT ---------- */
    const handleUpgrade = async (plan) => {
        if (!userId || !moduleId) {
            setSnackbar({ open: true, message: 'User or module missing', severity: 'warning' });
            return;
        }

        try {
            setPayingPlanId(plan._id);
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error('Razorpay SDK failed to load');

            const res = await axios.post(`${API_BASE}/api/razorpay/subscription/create`, {
                providerId: userId,
                planId: plan._id,
                customerEmail: user.email,
                customerPhone: user.mobile || '9999999999'
            });

            const { razorpay, customer } = res.data;

            const options = {
                key: razorpay.key,
                subscription_id: razorpay.subscriptionId,
                name: 'Book My Event',
                description: `${plan.name} Subscription`,
                image: '/logo.png',
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${API_BASE}/api/razorpay/subscription/verify`, response);
                        if (verifyRes.data.success) {
                            setSnackbar({ open: true, message: '🎉 Subscription Activated!', severity: 'success' });
                            setTimeout(() => {
                                window.location.replace('/panthal/portfolio');
                            }, 1500);
                        } else {
                            throw new Error('Verification failed');
                        }
                    } catch (err) {
                        setSnackbar({ open: true, message: 'Payment verification failed', severity: 'error' });
                    }
                },
                prefill: {
                    email: customer.email,
                    contact: customer.phone
                },
                theme: {
                    color: PRIMARY_COLOR
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Payment failed', severity: 'error' });
            setPayingPlanId(null);
        }
    };

    if (loading || subscriptionLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: PRIMARY_COLOR }} />
            </Box>
        );
    }

    const isCurrentPlan = (planId) => {
        return currentSubscription?.planId?._id === planId;
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafc', py: 6 }}>
            <Box maxWidth="md" mx="auto" px={2}>
                <Typography variant="h4" fontWeight={800} textAlign="center">
                    {currentSubscription ? 'Manage Your Plan' : 'Upgrade Your Plan'}
                </Typography>
                <Typography textAlign="center" color="text.secondary" mb={3}>
                    Choose the best plan for your Panthal & Decorations business
                </Typography>

                {currentSubscription ? (
                    <Alert severity="success" sx={{ mb: 4, border: '1px solid #4caf50' }}>
                        Current Plan: <b>{currentSubscription.planId?.name || 'PREMIUM'}</b>
                    </Alert>
                ) : (
                    <Alert severity="info" sx={{ mb: 4, border: '1px solid #0f172a' }}>
                        Current Plan: <b>FREE</b> - Upgrade to unlock premium features
                    </Alert>
                )}

                <Grid container spacing={3} justifyContent="center">
                    {!currentSubscription && (
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', borderRadius: 4, border: '2px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <CardContent>
                                    <Chip label="CURRENT PLAN" sx={{ bgcolor: '#9e9e9e', color: '#fff', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={800}>FREE</Typography>
                                    <Typography color="text.secondary" sx={{ minHeight: 48 }}>Basic access to get started</Typography>
                                    <Typography variant="h4" fontWeight={900} color="#9e9e9e" mt={2}>₹0</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1}>
                                        {['Limited listings', 'Basic visibility', 'Standard support'].map((f) => (
                                            <Box key={f} display="flex" alignItems="center">
                                                <CheckCircleIcon sx={{ color: '#9e9e9e', mr: 1, fontSize: 20 }} />
                                                <Typography variant="body2">{f}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                    <Button fullWidth disabled sx={{ mt: 3, bgcolor: '#e0e0e0', color: '#757575', fontWeight: 700, borderRadius: 2 }}>
                                        Current Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {plans.map((plan) => {
                        const showDesc = expandedDesc === plan._id;
                        const showFeatures = expandedFeatures === plan._id;
                        const isPaying = payingPlanId === plan._id;
                        const isCurrent = isCurrentPlan(plan._id);

                        return (
                            <Grid item xs={12} md={6} key={plan._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 4,
                                        border: isCurrent ? '3px solid #4caf50' : `3px solid ${PRIMARY_COLOR}`,
                                        boxShadow: isCurrent ? '0 4px 20px rgba(76, 175, 80, 0.2)' : '0 4px 20px rgba(15, 23, 42, 0.2)'
                                    }}
                                >
                                    <CardContent>
                                        <Chip
                                            icon={isCurrent ? <CheckCircleIcon /> : <WorkspacePremiumIcon />}
                                            label={isCurrent ? 'CURRENT PLAN' : 'BEST VALUE'}
                                            sx={{ bgcolor: isCurrent ? '#4caf50' : PRIMARY_COLOR, color: '#fff', mb: 2, fontWeight: 700 }}
                                        />
                                        <Typography variant="h6" fontWeight={800} color={isCurrent ? '#4caf50' : PRIMARY_COLOR}>
                                            {plan.name}
                                        </Typography>

                                        <Typography color="text.secondary" sx={{ minHeight: 48 }}>
                                            {showDesc ? plan.description : `${plan.description?.slice(0, MAX_DESC_CHARS) || ''}...`}
                                            {plan.description?.length > MAX_DESC_CHARS && (
                                                <Button size="small" onClick={() => setExpandedDesc(showDesc ? null : plan._id)}>
                                                    {showDesc ? 'Read less' : 'Read more'}
                                                </Button>
                                            )}
                                        </Typography>

                                        <Box sx={{ mt: 2 }}>
                                            <Chip label="🎉 Pre-Launch Offer" sx={{ bgcolor: '#fff3cd', color: '#b45309', fontWeight: 700, mb: 1 }} />
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                                                <Typography sx={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: 18 }}>₹20,000</Typography>
                                                <Typography sx={{ fontSize: 32, fontWeight: 900, color: isCurrent ? '#4caf50' : PRIMARY_COLOR }}>₹{plan.price}</Typography>
                                                <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>/ year</Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Stack spacing={1}>
                                            {(showFeatures ? plan.features : plan.features.slice(0, MAX_FEATURES)).map((f, i) => (
                                                <Box key={i} display="flex" alignItems="flex-start">
                                                    <CheckCircleIcon sx={{ color: isCurrent ? '#4caf50' : PRIMARY_COLOR, mr: 1, mt: 0.3, fontSize: 20 }} />
                                                    <Typography variant="body2">{f}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>

                                        <Button
                                            fullWidth
                                            disabled={isPaying || isCurrent}
                                            onClick={() => handleUpgrade(plan)}
                                            sx={{
                                                mt: 3,
                                                bgcolor: isCurrent ? '#e0e0e0' : PRIMARY_COLOR,
                                                color: isCurrent ? '#757575' : '#fff',
                                                fontWeight: 800,
                                                py: 1.5,
                                                '&:hover': { bgcolor: isCurrent ? '#e0e0e0' : '#1e293b' }
                                            }}
                                        >
                                            {isCurrent ? 'Current Plan' : isPaying ? 'Redirecting...' : 'Upgrade To Premium'}
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
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
