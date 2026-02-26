import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Stack, Divider, Alert, CircularProgress, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import axios from 'axios';

/* ---------- CONFIG ---------- */
const MAX_DESC_CHARS = 120;
const MAX_FEATURES = 3;
const API_BASE = 'https://api.bookmyevent.ae';

export default function InvitationUpgrade() {
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
    const userId = user?.providerId || user?._id;

    /* ---------- HANDLE PAYMENT RETURN ---------- */
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
                    setSnackbar({ open: true, message: '🎉 Premium Plan Activated!', severity: 'success' });
                    const resModuleId = typeof res.data.subscription.moduleId === 'object' ? res.data.subscription.moduleId?._id : res.data.subscription.moduleId;
                    const subRes = await axios.get(`${API_BASE}/api/subscription/status/${userId}?moduleId=${resModuleId}`);

                    if (subRes.data.success && subRes.data.subscription) {
                        const subscription = subRes.data.subscription;
                        const moduleIdString = typeof subscription.moduleId === 'object' ? subscription.moduleId?._id : subscription.moduleId;
                        localStorage.setItem('moduleId', moduleIdString);

                        const endDate = new Date(subscription.endDate);
                        const now = new Date();
                        const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

                        localStorage.setItem('upgrade', JSON.stringify({
                            isSubscribed: true,
                            status: 'active',
                            plan: subscription.planId,
                            module: moduleIdString,
                            access: { canAccess: true, isExpired: false, daysLeft }
                        }));

                        setCurrentSubscription(subscription);
                        window.history.replaceState({}, '', window.location.pathname);
                        setTimeout(() => { window.location.replace('/invitation/portfolio'); }, 2000);
                    }
                } else {
                    setSnackbar({ open: true, message: res.data.message || 'Payment verification failed', severity: 'error' });
                }
            } catch (err) {
                setSnackbar({ open: true, message: 'Payment verification failed', severity: 'error' });
            } finally {
                setSubscriptionLoading(false);
            }
        };
        verifyPayment();
    }, [userId, moduleId]);

    /* ---------- FETCH CURRENT SUBSCRIPTION ---------- */
    useEffect(() => {
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
                console.error('API error:', error);
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

    /* ---------- HANDLE UPGRADE ---------- */
    const handleUpgrade = async (plan) => {
        setSnackbar({ open: true, message: 'Processing upgrade...', severity: 'info' });
        // Mocking upgrade flow as specific payment integration depends on backend
        setTimeout(() => {
            setSnackbar({ open: true, message: 'Subscription request sent. Redirecting to payment...', severity: 'success' });
        }, 1000);
    };

    if (loading || subscriptionLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: '#E15B65' }} />
            </Box>
        );
    }

    const isCurrentPlan = (planId) => currentSubscription?.planId?._id === planId || currentSubscription?.planId === planId;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafc', py: 6 }}>
            <Box maxWidth="md" mx="auto" px={2}>
                <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 1 }}>
                    {currentSubscription ? 'Manage Your Invitation Plan' : 'Elevate Your Business'}
                </Typography>
                <Typography textAlign="center" color="text.secondary" mb={5}>
                    Choose the best premium plan for your Invitation & Printing services
                </Typography>

                {currentSubscription ? (
                    <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>
                        Current Plan: <b>{currentSubscription.planId?.name || 'PREMIUM'}</b>
                    </Alert>
                ) : (
                    <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
                        Current Plan: <b>FREE</b> - Upgrade to unlock Portfolio & advanced features
                    </Alert>
                )}

                <Grid container spacing={3} justifyContent="center">
                    {plans.map((plan) => {
                        const isCurrent = isCurrentPlan(plan._id);
                        return (
                            <Grid item xs={12} md={6} key={plan._id}>
                                <Card sx={{ height: '100%', borderRadius: 4, border: isCurrent ? '3px solid #4caf50' : '3px solid #E15B65', boxShadow: 3 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Chip
                                            icon={isCurrent ? <CheckCircleIcon /> : <WorkspacePremiumIcon />}
                                            label={isCurrent ? 'ACTIVE PLAN' : 'RECOMMENDED'}
                                            sx={{ bgcolor: isCurrent ? '#4caf50' : '#E15B65', color: '#fff', mb: 2, fontWeight: 700 }}
                                        />
                                        <Typography variant="h5" fontWeight={800} color={isCurrent ? '#4caf50' : '#E15B65'} gutterBottom>
                                            {plan.name}
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                                            {plan.description}
                                        </Typography>
                                        <Typography variant="h3" fontWeight={900} sx={{ mb: 3 }}>
                                            ₹{plan.price} <Typography component="span" variant="body1">/ year</Typography>
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <Stack spacing={2}>
                                            {plan.features?.map((f, i) => (
                                                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                    <CheckCircleIcon sx={{ color: isCurrent ? '#4caf50' : '#E15B65', fontSize: 20 }} />
                                                    <Typography variant="body2">{f}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            disabled={isCurrent}
                                            onClick={() => handleUpgrade(plan)}
                                            sx={{ mt: 4, py: 1.5, borderRadius: 2, bgcolor: isCurrent ? '#ccc' : '#E15B65', '&:hover': { bgcolor: '#C2444E' } }}
                                        >
                                            {isCurrent ? 'Current Plan' : 'Upgrade Now'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
