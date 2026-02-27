import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Stack, Divider, Alert, CircularProgress, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import axios from 'axios';

/* ---------- CONFIG ---------- */
const MAX_DESC_CHARS = 120;
const MAX_FEATURES = 3;
const API_BASE = 'https://api.bookmyevent.ae';

const THEME_COLOR = '#673ab7';
const THEME_HOVER = '#5e35b1';

export default function LightUpgradePlanUI() {
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

                        // ✅ Clean URL
                        window.history.replaceState({}, '', window.location.pathname);

                        setTimeout(() => {
                            window.location.replace('/light/portfolio');
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

        const freshModuleId = localStorage.getItem('moduleId');

        const checkLocalStorageFallback = (checkModuleId) => {
            try {
                const upgrade = JSON.parse(localStorage.getItem('upgrade') || '{}');
                const upgradeModuleId = typeof upgrade?.module === 'object' ? upgrade?.module?._id : upgrade?.module;

                if (upgrade?.status === 'active' && upgradeModuleId === checkModuleId) {
                    setCurrentSubscription({
                        status: 'active',
                        isCurrent: true,
                        planId: upgrade?.plan,
                        moduleId: upgradeModuleId
                    });
                    return true;
                }
            } catch (e) {
                console.error('localStorage parse error:', e);
            }
            return false;
        };

        const fetchCurrentSubscription = async () => {
            const effectiveModuleId = freshModuleId || moduleId;

            if (!userId || !effectiveModuleId) {
                checkLocalStorageFallback(effectiveModuleId);
                setSubscriptionLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_BASE}/api/subscription/status/${userId}?moduleId=${effectiveModuleId}`);

                if (res.data.success && res.data.subscription) {
                    const sub = res.data.subscription;

                    if (sub.status === 'active' && sub.isCurrent) {
                        const subModuleId = typeof sub.moduleId === 'object' ? sub.moduleId?._id || sub.moduleId : sub.moduleId;

                        const endDate = new Date(sub.endDate);
                        const now = new Date();
                        const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

                        localStorage.setItem(
                            'upgrade',
                            JSON.stringify({
                                isSubscribed: true,
                                status: 'active',
                                plan: sub.planId,
                                module: subModuleId,
                                access: { canAccess: true, isExpired: false, daysLeft }
                            })
                        );
                        localStorage.setItem('moduleId', subModuleId);

                        setCurrentSubscription(sub);
                        setSubscriptionLoading(false);
                        return;
                    }
                }
                checkLocalStorageFallback(effectiveModuleId);
            } catch (error) {
                console.error('❌ API error:', error.message);
                checkLocalStorageFallback(effectiveModuleId);
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

    /* ---------- HANDLE UPGRADE ---------- */
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

            if (!razorpay?.subscriptionId) throw new Error('Subscription ID missing from backend');

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
                                window.location.replace('/light/portfolio');
                            }, 1500);
                        } else {
                            throw new Error('Verification failed');
                        }
                    } catch (err) {
                        console.error('❌ Verification error:', err);
                        setSnackbar({
                            open: true,
                            message: err.response?.data?.message || 'Payment verification failed',
                            severity: 'error'
                        });
                    }
                },
                prefill: { email: customer.email, contact: customer.phone },
                theme: { color: THEME_COLOR }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('❌ Razorpay Error:', error);
            setSnackbar({ open: true, message: error.message || 'Payment failed', severity: 'error' });
            setPayingPlanId(null);
        }
    };

    if (loading || subscriptionLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: THEME_COLOR }} />
            </Box>
        );
    }

    const isCurrentPlan = (planId) => currentSubscription?.planId?._id === planId;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafc', py: 6 }}>
            <Box maxWidth="md" mx="auto" px={2}>
                <Typography variant="h4" fontWeight={800} textAlign="center">
                    {currentSubscription ? 'Manage Your Plan' : 'Upgrade Your Plan'}
                </Typography>
                <Typography textAlign="center" color="text.secondary" mb={3}>
                    Choose the best plan for your Light & Sound business
                </Typography>

                {currentSubscription ? (
                    <Alert severity="success" sx={{ mb: 4, border: `1px solid ${THEME_COLOR}`, bgcolor: '#f3e5f5' }}>
                        Current Plan: <b>{currentSubscription.planId?.name || 'PREMIUM'}</b>
                    </Alert>
                ) : (
                    <Alert severity="info" sx={{ mb: 4, border: '1px solid #2196f3' }}>
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
                                    <Typography color="text.secondary" sx={{ minHeight: 48 }}>Basic access to get started on the platform</Typography>
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
                                    <Button fullWidth disabled sx={{ mt: 3, bgcolor: '#e0e0e0', color: '#757575', fontWeight: 700, borderRadius: 2, textTransform: 'none' }}>Current Plan</Button>
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
                                <Card sx={{
                                    height: '100%',
                                    borderRadius: 4,
                                    border: isCurrent ? '3px solid #4caf50' : `3px solid ${THEME_COLOR}`,
                                    boxShadow: isCurrent ? '0 4px 20px rgba(76, 175, 80, 0.2)' : `0 4px 20px ${alpha(THEME_COLOR, 0.2)}`
                                }}>
                                    <CardContent>
                                        <Chip
                                            icon={isCurrent ? <CheckCircleIcon /> : <WorkspacePremiumIcon />}
                                            label={isCurrent ? 'CURRENT PLAN' : 'BEST VALUE'}
                                            sx={{ bgcolor: isCurrent ? '#4caf50' : THEME_COLOR, color: '#fff', mb: 2, fontWeight: 700 }}
                                        />
                                        <Typography variant="h6" fontWeight={800} color={isCurrent ? '#4caf50' : THEME_COLOR}>{plan.name}</Typography>

                                        <Typography color="text.secondary" sx={{ minHeight: 48 }}>
                                            {showDesc ? plan.description : (plan.description?.length > MAX_DESC_CHARS ? `${plan.description.slice(0, MAX_DESC_CHARS)}...` : plan.description)}
                                            {plan.description?.length > MAX_DESC_CHARS && (
                                                <Button size="small" onClick={() => setExpandedDesc(showDesc ? null : plan._id)} sx={{ textTransform: 'none', fontWeight: 600, color: THEME_COLOR, p: 0, minWidth: 'auto', ml: 0.5 }}>
                                                    {showDesc ? 'Read less' : 'Read more'}
                                                </Button>
                                            )}
                                        </Typography>

                                        <Box sx={{ mt: 2 }}>
                                            <Chip label="🎉 Pre-Launch Offer" sx={{ bgcolor: '#f3e5f5', color: THEME_COLOR, fontWeight: 700, mb: 1 }} />
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                                                <Typography sx={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: 18, fontWeight: 600 }}>₹20,000</Typography>
                                                <Typography sx={{ fontSize: 32, fontWeight: 900, color: isCurrent ? '#4caf50' : THEME_COLOR }}>₹{plan.price}</Typography>
                                                <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>/ year</Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.5 }}>Limited time launch offer for early partners</Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Stack spacing={1}>
                                            {(showFeatures ? plan.features : plan.features.slice(0, MAX_FEATURES)).map((f, i) => (
                                                <Box key={i} display="flex" alignItems="flex-start">
                                                    <CheckCircleIcon sx={{ color: isCurrent ? '#4caf50' : THEME_COLOR, mr: 1, mt: 0.3, fontSize: 20 }} />
                                                    <Typography variant="body2">{f}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>

                                        {plan.features.length > MAX_FEATURES && (
                                            <Button size="small" onClick={() => setExpandedFeatures(showFeatures ? null : plan._id)} sx={{ mt: 1, textTransform: 'none', fontWeight: 600, color: THEME_COLOR, p: 0 }}>
                                                {showFeatures ? 'Show less' : `+${plan.features.length - MAX_FEATURES} more features`}
                                            </Button>
                                        )}

                                        <Button
                                            fullWidth
                                            disabled={isPaying || isCurrent}
                                            onClick={() => handleUpgrade(plan)}
                                            sx={{
                                                mt: 3,
                                                bgcolor: isCurrent ? '#e0e0e0' : THEME_COLOR,
                                                color: isCurrent ? '#757575' : '#fff',
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontSize: 16,
                                                '&:hover': { bgcolor: isCurrent ? '#e0e0e0' : THEME_HOVER },
                                                '&:disabled': { bgcolor: '#e0e0e0' }
                                            }}
                                        >
                                            {isCurrent ? 'Current Plan' : (isPaying ? 'Redirecting...' : (currentSubscription ? 'Switch Plan' : 'Upgrade To Premium'))}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Box sx={{ mt: 4, p: 2, bgcolor: '#f3e5f5', borderRadius: 2, border: '1px solid #d1c4e9' }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        💡 <strong>Note:</strong> After clicking "Upgrade To Premium", you'll be redirected to a secure payment page. Your subscription will be activated immediately after successful payment.
                    </Typography>
                </Box>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
