import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    Box, Button, Step, StepLabel, Stepper, Typography, TextField,
    Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText,
    CircularProgress, Checkbox, FormControlLabel, Alert, Avatar,
    Divider, Chip, Paper, InputAdornment, IconButton, Card, CardContent, Stack,
    ListItemText, OutlinedInput, Snackbar
} from '@mui/material';
import { styled, keyframes, alpha } from '@mui/material/styles';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import MapPinIcon from '@mui/icons-material/AddLocationAlt';
import TagIcon from '@mui/icons-material/Tag';
import bookLogo from 'assets/images/book.png';

const API = 'https://api.bookmyevent.ae';
const RED = '#E15B65';
const RED_DARK = '#c0392b';
const RED_BG = 'rgba(225,91,101,0.07)';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78';

/* ── animations ── */
const fadeUp = keyframes`from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}`;
const floatY = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}`;
const shimmer = keyframes`0%{background-position:-400px 0}100%{background-position:400px 0}`;

/* ── shared sx helpers ── */
const INPUT_SX = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        fontSize: 14,
        fontWeight: 500,
        background: '#fff',
        transition: 'box-shadow .2s, border-color .2s',
        '& fieldset': { borderColor: '#dde1ec', borderWidth: '1.5px' },
        '&:hover fieldset': { borderColor: alpha(RED, 0.55) },
        '&.Mui-focused fieldset': { borderColor: RED, borderWidth: '2px' },
        '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(RED, 0.14)}` },
    },
    '& label': { fontSize: 13.5, fontWeight: 500, color: '#888' },
    '& label.Mui-focused': { color: RED },
    '& .MuiFormHelperText-root': { ml: '2px', fontSize: 11.5 },
};

const SELECT_SX = {
    borderRadius: '12px',
    fontSize: 14,
    fontWeight: 500,
    background: '#fff',
    transition: 'box-shadow .2s',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dde1ec', borderWidth: '1.5px' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(RED, 0.55) },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: RED, borderWidth: '2px' },
    '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(RED, 0.14)}` },
};

const MENU_PROPS = {
    PaperProps: {
        sx: {
            mt: 1, borderRadius: '14px', border: '1px solid #eef0f8',
            boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
            maxHeight: 280, overflowY: 'auto',
            '& .MuiList-root': { padding: '6px' },
            '& .MuiMenuItem-root': {
                borderRadius: '8px', fontSize: 14, fontWeight: 500, color: '#333',
                margin: '2px 0', px: 2, py: '10px', transition: 'all .18s',
                '&:hover': { background: RED_BG, color: RED },
                '&.Mui-selected': {
                    background: RED_BG, color: RED, fontWeight: 700,
                    '&:hover': { background: alpha(RED, 0.12) }
                },
            },
        }
    }
};

/* ── styled wrappers ── */
const PageWrap = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '24px 12px 64px',
    [theme.breakpoints.up('sm')]: {
        padding: '48px 24px 80px',
    },
}));

const RegCard = styled(Paper)(({ theme }) => ({
    width: '100%',
    maxWidth: 920,
    borderRadius: 32,
    boxShadow: '0 25px 80px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    padding: '32px 24px',
    background: '#fff',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
        padding: '56px 64px',
    },
    '&::after': {
        content: '""',
        position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
        background: `linear-gradient(90deg, ${RED}, #f472b6, ${RED})`,
    }
}));
const PBtn = styled(Button)({
    background: `linear-gradient(135deg,${RED},${RED_DARK})`,
    color: '#fff', borderRadius: 12, padding: '13px 36px',
    fontWeight: 700, fontSize: 14, textTransform: 'none',
    boxShadow: '0 4px 18px rgba(225,91,101,0.35)',
    '&:hover': { background: `linear-gradient(135deg,${RED_DARK},${RED})`, boxShadow: '0 6px 24px rgba(225,91,101,0.5)' },
    '&:disabled': { background: '#e0e0e0', color: '#bbb', boxShadow: 'none' },
});
const SBtn = styled(Button)({
    borderRadius: 12, padding: '12px 28px', fontWeight: 600, fontSize: 14,
    textTransform: 'none', color: '#666', border: '1.5px solid #ddd', background: '#fff',
    '&:hover': { borderColor: RED, color: RED, background: RED_BG },
    '&:disabled': { opacity: 0.3 },
});
const UpBox = styled(Box)(({ isset }) => ({
    border: `2px dashed ${isset ? '#4caf50' : '#dde1ec'}`,
    borderRadius: 16, padding: '32px 16px', textAlign: 'center', cursor: 'pointer',
    position: 'relative',
    transition: 'all .25s', background: isset ? 'rgba(76,175,80,0.04)' : '#fafcff',
    '&:hover': { borderColor: RED, background: RED_BG },
}));
const PlanBox = styled(Box)(({ picked }) => ({
    border: `2px solid ${picked ? RED : '#e4e7f0'}`,
    borderRadius: 18, padding: '24px 20px', cursor: 'pointer',
    transition: 'all .25s', position: 'relative', background: picked ? RED_BG : '#fff',
    boxShadow: picked ? `0 0 0 4px ${alpha(RED, 0.12)},0 4px 24px rgba(0,0,0,0.08)` : '0 2px 12px rgba(0,0,0,0.05)',
    '&:hover': { borderColor: RED, boxShadow: '0 6px 28px rgba(0,0,0,0.09)' },
}));

/* ── constants ── */
const STEPS = ['Personal Info', 'Business Details', 'Location', 'Choose Plan', 'Media', 'Review'];
const STEP_ICONS = [PersonOutlineIcon, BusinessCenterOutlinedIcon, LocationOnOutlinedIcon, StarOutlineIcon, PermMediaOutlinedIcon, TaskAltIcon];
const FREE_PLAN = { _id: 'free', name: 'Free', price: 0, features: ['Basic listing', 'Up to 5 packages', 'Standard visibility', 'Email alerts'] };

/* ── validation ── */
function validate(s, f, isSecondary) {
    const e = {};
    if (s === 0) {
        if (!f.firstName.trim()) e.firstName = 'Required';
        if (!f.lastName.trim()) e.lastName = 'Required';
        if (!/^[\w.+-]+@[\w-]+\.\w{2,}$/.test(f.email)) e.email = 'Enter a valid email';
        if (!f.phone.trim()) e.phone = 'Required';
        if (!f.module) e.module = 'Select a service module';
        if (f.password.length < 6) e.password = 'Min 6 characters';
        if (f.password !== f.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    if (s === 1) { 
        if (!f.storeName.trim()) e.storeName = 'Required'; 
        if (!f.zone) e.zone = 'Primary Zone is required';
        if (isSecondary) {
            if (!f.specialised) e.specialised = 'Required';
            if (!f.startingPrice) e.startingPrice = 'Required';
        }
    }
    if (s === 2) { /* City is optional */ }
    return e;
}

/* ── step bubble ── */
function Bubble({ Icon, active, done }) {
    return (
        <Box sx={{
            width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: done ? '#4caf50' : active ? RED : '#eff1f8', color: done || active ? '#fff' : '#bbb',
            boxShadow: active ? `0 4px 14px ${alpha(RED, 0.42)}` : 'none', transition: 'all .3s'
        }}>
            {done ? <CheckIcon sx={{ fontSize: 17 }} /> : <Icon sx={{ fontSize: 17 }} />}
        </Box>
    );
}

/* ─────────────── Verification Pending Screen ─────────────── */
function VerificationScreen({ status = 'pending', rejectReason = '' }) {
    const [dots, setDots] = useState('');
    useEffect(() => {
        if (status !== 'pending') return;
        const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
        return () => clearInterval(t);
    }, [status]);

    let steps2 = [];
    let title = '';
    let subtitle = '';
    let description = '';
    let mainIcon = <VerifiedUserOutlinedIcon sx={{ fontSize: 52, color: RED }} />;
    let iconColor = RED;
    let iconBorderColor = alpha(RED, 0.2);
    let bgGradient = `linear-gradient(135deg,${alpha(RED, 0.1)},${alpha(RED, 0.02)})`;

    if (status === 'pending') {
        title = 'Application Under Review';
        subtitle = `Verification in Progress${dots}`;
        description = <>Thank you for joining BookMyEvent. Your vendor account is currently <strong>under admin review</strong>. We're verifying your details to ensure a high-quality marketplace. Expect activation within <strong>24–48 hours</strong>.</>;
        steps2 = [
            { icon: <EditIcon sx={{ fontSize: 18 }} />, label: 'Registration Received', done: true },
            { icon: <HourglassTopIcon sx={{ fontSize: 18 }} />, label: 'Admin Review in Progress', active: true },
            { icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />, label: 'Approval Email Sent', done: false },
            { icon: <TaskAltIcon sx={{ fontSize: 18 }} />, label: 'Account Activation', done: false },
        ];
    } else if (status === 'approved') {
        title = 'Account Activated! 🎉';
        subtitle = 'Verification Successful';
        description = <>Congratulations! Your vendor profile has been <strong>successfully verified and approved</strong>. You're now a member of our premium vendor community.</>;
        iconColor = '#10b981';
        iconBorderColor = alpha('#10b981', 0.2);
        bgGradient = `linear-gradient(135deg,${alpha('#10b981', 0.1)},${alpha('#10b981', 0.02)})`;
        mainIcon = <CheckCircleIcon sx={{ fontSize: 52, color: iconColor }} />;
        steps2 = [
            { icon: <EditIcon sx={{ fontSize: 18 }} />, label: 'Registration Received', done: true },
            { icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />, label: 'Review Completed', done: true },
            { icon: <CheckCircleIcon sx={{ fontSize: 18 }} />, label: 'Approval Email Sent', done: true },
            { icon: <TaskAltIcon sx={{ fontSize: 18 }} />, label: 'Account Live!', done: true },
        ];
    } else if (status === 'rejected') {
        title = 'Registration Update';
        subtitle = 'Verification Unsuccessful';
        description = <>We appreciate your interest. However, we're currently unable to approve your vendor registration. {rejectReason && <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha('#ef4444', 0.08), border: `1px solid ${alpha('#ef4444', 0.1)}` }}><Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>Reason: {rejectReason}</Typography></Box>}</>;
        iconColor = '#ef4444';
        iconBorderColor = alpha('#ef4444', 0.2);
        bgGradient = `linear-gradient(135deg,${alpha('#ef4444', 0.1)},${alpha('#ef4444', 0.02)})`;
        mainIcon = <CancelOutlinedIcon sx={{ fontSize: 52, color: iconColor }} />;
        steps2 = [
            { icon: <EditIcon sx={{ fontSize: 18 }} />, label: 'Registration Received', done: true },
            { icon: <ErrorOutlineIcon sx={{ fontSize: 18 }} />, label: 'Review Failed', active: true, error: true },
            { icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />, label: 'Action Required', done: false },
        ];
    }

    // Polling logic for live status updates
    const [currentStatus, setCurrentStatus] = useState(status);
    const [checkLoading, setCheckLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, msg: '', type: 'info' });

    const checkStatus = useCallback(async () => {
        let userId = localStorage.getItem('pendingVendorId');
        
        // If no ID in storage, check URL/state (fallback)
        if (!userId) {
            const urlParams = new URLSearchParams(window.location.search);
            userId = urlParams.get('userId'); // Potential fallback if we append it
        }

        if (!userId) {
            setToast({ open: true, msg: 'User ID missing in local storage. Try refreshing from the last step.', type: 'warning' });
            return;
        }

        if (currentStatus === 'approved') return;

        setCheckLoading(true);
        try {
            // Attempt a general profile check or dedicated status check
            // We'll try the known profile provider endpoint (usually needs no token for basic status or has a public status shim)
            const res = await fetch(`https://api.bookmyevent.ae/api/auth/register-status/${userId}`);
            
            if (res.status === 404) {
                // If the new endpoint doesn't exist, try the general profile one
                const profileRes = await fetch(`https://api.bookmyevent.ae/api/profile/provider/${userId}`);
                if (profileRes.ok) {
                    const profData = await profileRes.json();
                    if (profData.success && profData.data?.status) {
                        const newS = profData.data.status;
                        if (newS === currentStatus) {
                            setToast({ open: true, msg: `Registration is still ${newS.toUpperCase()}...`, type: 'info' });
                        } else {
                            setCurrentStatus(newS);
                            setToast({ open: true, msg: `Excellent! Your status is now ${newS.toUpperCase()}`, type: 'success' });
                        }
                        setCheckLoading(false);
                        return;
                    }
                }
            }

            const data = await res.json();
            if (data.success && data.status) {
                if (data.status === currentStatus) {
                    setToast({ open: true, msg: `Your application is still in ${data.status.toUpperCase()} status.`, type: 'info' });
                } else {
                    setCurrentStatus(data.status);
                    setToast({ open: true, msg: `Status updated to ${data.status.toUpperCase()}!`, type: 'success' });
                }
            } else {
                setToast({ open: true, msg: 'Still pending. Please wait for admin approval.', type: 'info' });
            }
        } catch (err) {
            setToast({ open: true, msg: 'Unable to reach status server. Please try again later.', type: 'error' });
            console.error('Status check failed', err);
        } finally {
            setCheckLoading(false);
        }
    }, [currentStatus]);

    useEffect(() => {
        let interval;
        if (currentStatus === 'pending') {
            interval = setInterval(checkStatus, 20000); // Check every 20s
        }
        return () => clearInterval(interval);
    }, [currentStatus, checkStatus]);

    // If status changed via polling, re-render with new data
    if (currentStatus !== status) {
        return <VerificationScreen status={currentStatus} rejectReason={rejectReason} />;
    }

    return (
        <PageWrap sx={{ background: '#f8fafc' }}>
            <Box sx={{ mb: 4, animation: `${fadeUp} .6s ease` }}>
                <img src={bookLogo} alt="BookMyEvent" style={{ height: 48, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} />
            </Box>

            <RegCard elevation={0} sx={{
                textAlign: 'center',
                maxWidth: 680,
                animation: `${scaleIn} .7s cubic-bezier(0.16, 1, 0.3, 1)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
                    background: iconColor
                }
            }}>
                {/* Visual Status Indicator */}
                <Box sx={{ mb: 4, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{
                        width: 120, height: 120, borderRadius: '50%',
                        background: bgGradient,
                        border: `2px solid ${iconBorderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: `${floatY} 4s ease-in-out infinite`,
                        boxShadow: `0 12px 32px ${alpha(iconColor, 0.15)}`
                    }}>
                        {mainIcon}
                    </Box>

                    {status === 'pending' && (
                        <Box sx={{
                            position: 'absolute', width: 154, height: 154, borderRadius: '50%',
                            border: `2px dashed ${alpha(iconColor, 0.3)}`, animation: `${spin} 12s linear infinite`
                        }}>
                            <Box sx={{
                                position: 'absolute', top: -6, left: '50%', width: 12, height: 12,
                                borderRadius: '50%', bgcolor: iconColor, transform: 'translateX(-50%)',
                                boxShadow: `0 0 12px ${iconColor}`
                            }} />
                        </Box>
                    )}
                </Box>

                <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', mb: 1, letterSpacing: '-0.02em' }}>
                    {title}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{
                    color: iconColor, mb: 2, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em'
                }}>
                    {subtitle}
                </Typography>

                <Typography variant="body1" sx={{
                    color: '#64748b', mb: 5, maxWidth: 520, mx: 'auto', lineHeight: 1.8, fontSize: 15
                }}>
                    {description}
                </Typography>

                {/* Refined Timeline */}
                <Box sx={{ mb: 5, p: 4, borderRadius: 4, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: '#334155', textAlign: 'left', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em' }}>
                        Processing Timeline
                    </Typography>

                    <Box sx={{ position: 'relative' }}>
                        {steps2.map(({ icon, label, done, active, error }, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: i < steps2.length - 1 ? 3 : 0, position: 'relative' }}>
                                {/* Connector Line */}
                                {i < steps2.length - 1 && (
                                    <Box sx={{
                                        position: 'absolute', left: 21, top: 46, width: '2px', height: 'calc(100% - 30px)',
                                        bgcolor: done ? '#10b981' : '#cbd5e1', zIndex: 0
                                    }} />
                                )}

                                <Box sx={{
                                    width: 44, height: 44, borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: done ? '#10b981' : error ? '#ef4444' : active ? iconColor : '#fff',
                                    color: done || active || error ? '#fff' : '#94a3b8',
                                    border: done ? 'none' : error ? 'none' : active ? 'none' : '2px solid #e2e8f0',
                                    zIndex: 1, boxShadow: done || active ? `0 4px 12px ${alpha(done ? '#10b981' : iconColor, 0.3)}` : 'none',
                                    transition: 'all .4s ease'
                                }}>
                                    {done ? <CheckIcon sx={{ fontSize: 20 }} /> : icon}
                                </Box>

                                <Box sx={{ flex: 1, pt: 1 }}>
                                    <Typography sx={{
                                        fontSize: 14, fontWeight: 700,
                                        color: done ? '#059669' : error ? '#dc2626' : active ? iconColor : '#64748b',
                                        transition: 'all .3s'
                                    }}>
                                        {label}
                                    </Typography>
                                    {active && !error && (
                                        <Box sx={{
                                            mt: 1.5, height: 4, borderRadius: 4, overflow: 'hidden',
                                            bgcolor: alpha(iconColor, 0.15), width: '60%'
                                        }}>
                                            <Box sx={{
                                                height: '100%', width: '40%', borderRadius: 4,
                                                bgcolor: iconColor, animation: `${shimmer} 2s linear infinite`
                                            }} />
                                        </Box>
                                    )}
                                </Box>
                                {done && <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20, mt: 1 }} />}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Support/Footer Box */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2.5, height: '100%', borderRadius: 3, bgcolor: '#fff', border: '1px solid #e2e8f0', textAlign: 'left', display: 'flex', gap: 2 }}>
                            <HelpOutlineIcon sx={{ color: '#64748b', mt: 0.5 }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={800} color="#1e293b">Account Guidance</Typography>
                                <Typography variant="caption" color="text.secondary">Detailed activation steps have been sent to your email.</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2.5, height: '100%', borderRadius: 3, bgcolor: '#fff', border: '1px solid #e2e8f0', textAlign: 'left', display: 'flex', gap: 2 }}>
                            <SupportAgentIcon sx={{ color: '#64748b', mt: 0.5 }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={800} color="#1e293b">Need Support?</Typography>
                                <Typography variant="caption" color="text.secondary">Contact us at support@bookmyevent.ae for assistance.</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Button component={Link} to="/pages/login" variant="contained"
                        sx={{
                            borderRadius: 3, px: 6, py: 1.8, fontWeight: 800, fontSize: 14, textTransform: 'none',
                            bgcolor: '#1e293b', color: '#fff', boxShadow: '0 10px 20px rgba(30,41,59,0.2)',
                            '&:hover': { bgcolor: '#0f172a', transform: 'translateY(-2px)' },
                            transition: 'all .3s ease'
                        }}>
                        Return to Login
                    </Button>
                </Stack>
            </RegCard>

            <Snackbar 
                open={toast.open} 
                autoHideDuration={4000} 
                onClose={() => setToast(p => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={toast.type} sx={{ borderRadius: 3, fontWeight: 700, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                    {toast.msg}
                </Alert>
            </Snackbar>

            <Typography variant="caption" sx={{ mt: 4, color: '#94a3b8', fontWeight: 600 }}>
                &copy; {new Date().getFullYear()} BookMyEvent Technology. All rights reserved.
            </Typography>
        </PageWrap>
    );
}

/* ─────────────── Main Component ─────────────── */
export default function VendorRegisterStepper() {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Check if we arrived here via a redirect (e.g., from login due to pending/rejected status)
    const initialStatus = location.state?.status || null;
    const initialReason = location.state?.rejectReason || '';

    const [submitted, setSubmitted] = useState(!!initialStatus);
    const [vendorStatus, setVendorStatus] = useState(initialStatus || 'pending');
    const [rejectReason, setRejectReason] = useState(initialReason);

    const [submitErr, setSubmitErr] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [modules, setModules] = useState([]);
    const [zones, setZones] = useState([]);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [expandedFeatures, setExpandedFeatures] = useState(null);
    const logoRef = useRef(); const coverRef = useRef(); const tinRef = useRef();

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        vendorType: 'individual', module: '', password: '', confirmPassword: '',
        storeName: '', businessTIN: '', tinExpireDate: '', zone: '', multiZones: [],
        storeAddress: { street: '', city: '', state: '', zipCode: '', fullAddress: '' },
        latitude: '', longitude: '',
        subscriptionPlan: 'free', logo: null, coverImage: null, tinCertificate: null,
        maxBookings: '', services: [], specialised: '', startingPrice: '', minBookingPrice: ''
    });

    // Google Maps states and refs
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const searchInputRef = useRef(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [map, setMap] = useState(null);

    // Load Google Maps script
    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) return;
        if (window.google && window.google.maps) {
            setMapsLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapsLoaded(true);
        document.head.appendChild(script);
        return () => {
            if (document.head.contains(script)) document.head.removeChild(script);
        };
    }, []);

    // Init map
    const initMap = useCallback(() => {
        if (!window.google || !mapRef.current || !mapsLoaded) return;

        const centerLat = form.latitude && form.longitude ? parseFloat(form.latitude) : 25.2048;
        const centerLng = form.latitude && form.longitude ? parseFloat(form.longitude) : 55.2708;
        const center = { lat: centerLat, lng: centerLng };

        const newMap = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });

        newMap.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            set('latitude', lat.toString());
            set('longitude', lng.toString());

            if (markerRef.current) markerRef.current.setMap(null);
            markerRef.current = new window.google.maps.Marker({ position: { lat, lng }, map: newMap });

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const address = results[0].address_components || [];
                    const get = (type) => {
                        const item = address.find((a) => a.types.includes(type));
                        return item ? item.long_name : '';
                    };

                    setForm(prev => ({
                        ...prev,
                        storeAddress: {
                            street: get('route'),
                            city: get('locality') || get('administrative_area_level_2') || '',
                            state: get('administrative_area_level_1') || '',
                            zipCode: get('postal_code') || '',
                            fullAddress: results[0].formatted_address || ''
                        },
                        latitude: lat.toString(),
                        longitude: lng.toString()
                    }));
                }
            });
        });

        setMap(newMap);
    }, [mapsLoaded]);

    useEffect(() => {
        if (mapsLoaded && !map && step === 2) {
            initMap();
        }
    }, [mapsLoaded, step, map, initMap]);

    // Autocomplete for search input
    useEffect(() => {
        if (!mapsLoaded || !map || !searchInputRef.current || !window.google || step !== 2) return;

        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
            fields: ['place_id', 'geometry', 'name', 'formatted_address', 'address_components']
        });

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry?.location) return;

            const loc = place.geometry.location;
            if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
            else {
                map.setCenter(loc);
                map.setZoom(17);
            }

            if (markerRef.current) markerRef.current.setMap(null);
            markerRef.current = new window.google.maps.Marker({ position: loc, map });

            const address = place.address_components || [];
            const get = (type) => {
                const item = address.find((a) => a.types.includes(type));
                return item ? item.long_name : '';
            };

            setForm(prev => ({
                ...prev,
                latitude: loc.lat().toString(),
                longitude: loc.lng().toString(),
                storeAddress: {
                    street: get('route') || '',
                    city: get('locality') || get('administrative_area_level_2') || '',
                    state: get('administrative_area_level_1') || '',
                    zipCode: get('postal_code') || '',
                    fullAddress: place.formatted_address || place.name || ''
                }
            }));
        });

        return () => {
            if (listener && listener.remove) listener.remove();
        };
    }, [mapsLoaded, map, step]);

    // Update marker when lat/lng change
    useEffect(() => {
        if (!map || !form.latitude || !form.longitude || step !== 2) return;
        const pos = { lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) };
        if (markerRef.current) {
            markerRef.current.setPosition(pos);
        } else {
            markerRef.current = new window.google.maps.Marker({ position: pos, map });
        }
    }, [form.latitude, form.longitude, map, step]);

    useEffect(() => {
        Promise.all([
            fetch(`${API}/api/modules`).then(r => r.json()).catch(() => ({ data: [] })),
            fetch(`${API}/api/secondary-modules`).then(r => r.json()).catch(() => [])
        ]).then(([modRes, secRes]) => {
            const mods = Array.isArray(modRes.data) ? modRes.data : Array.isArray(modRes) ? modRes : [];
            const secs = Array.isArray(secRes.data) ? secRes.data : Array.isArray(secRes) ? secRes : [];
            const mappedSecs = secs.map(s => ({ ...s, isSecondary: true }));
            setModules([...mods, ...mappedSecs]);
        });
        fetch(`${API}/api/zones`).then(r => r.json())
            .then(d => setZones(Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);

    useEffect(() => {
        const selMod = modules.find(m => m._id === form.module);
        if (selMod?.isSecondary) {
            fetch(`${API}/api/secondary-modules/${form.module}`).then(r => r.json())
                .then(data => {
                    const modData = data.module || data.data || data;
                    const cats = Array.isArray(modData?.categories) ? modData.categories : [];
                    setCategories(cats.map(c => ({ ...c, _id: c._id?.$oid || c._id })));
                }).catch(() => setCategories([]));
        }
    }, [form.module, modules]);

    useEffect(() => {
        if (step !== 3) return;
        setPlansLoading(true);
        const url = form.module ? `${API}/api/subscription/plan/module/${form.module}` : `${API}/api/admin/subscription/plan`;
        fetch(url).then(r => r.json())
            .then(d => setPlans(Array.isArray(d.plans) ? d.plans : Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []))
            .catch(() => setPlans([])).finally(() => setPlansLoading(false));
    }, [step, form.module]);

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
    const setAddr = (k, v) => { setForm(f => ({ ...f, storeAddress: { ...f.storeAddress, [k]: v } })); setErrors(e => ({ ...e, [k]: '' })); };

    const next = () => {
        const selMod = modules.find(m => m._id === form.module);
        const errs = validate(step, form, selMod?.isSecondary);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({}); setStep(s => {
            if (s === 2) setMap(null); // Clear map when leaving Location step to ensure fresh init on return
            return s + 1;
        }); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Also ensures map is cleared when using back button
    useEffect(() => {
        if (step !== 2) setMap(null);
    }, [step]);

    /* ── Razorpay script loader ── */
    const loadRazorpayScript = () => new Promise(resolve => {
        if (window.Razorpay) { resolve(true); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.async = true;
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

    const submit = async () => {
        if (!agreed) { setSubmitErr('Please agree to the Terms & Conditions'); return; }
        setLoading(true); setSubmitErr('');
        try {
            const fd = new FormData();
            ['firstName', 'lastName', 'email', 'phone', 'vendorType', 'password', 'storeName', 'latitude', 'longitude', 'maxBookings', 'specialised', 'startingPrice', 'minBookingPrice'].forEach(k => {
                if (form[k]) fd.append(k, form[k].trim?.() ?? form[k]);
            });
            if (form.services && form.services.length > 0) {
                fd.append('services', JSON.stringify(form.services));
            }
            fd.append('role', 'vendor');
            if (form.businessTIN) fd.append('businessTIN', form.businessTIN.trim());
            if (form.tinExpireDate) fd.append('tinExpireDate', form.tinExpireDate);
            if (form.module) fd.append('module', form.module);
            if (form.zone) fd.append('zone', form.zone);
            
            const submitMod = modules.find(m => m._id === form.module);
            const isSubmitMultiZone = submitMod && ['makeup', 'photography', 'mehandi'].some(kw => submitMod.title.toLowerCase().includes(kw));

            if (isSubmitMultiZone && form.multiZones && form.multiZones.length > 0) {
              const allZones = [form.zone, ...form.multiZones.filter(z => z !== form.zone)].filter(Boolean);
              fd.append('zones', allZones.join(','));
            } else if (form.zone) {
              fd.append('zones', form.zone);
            }
            if (form.subscriptionPlan !== 'free') fd.append('subscriptionPlan', form.subscriptionPlan);
            fd.append('storeAddress', JSON.stringify(form.storeAddress));
            if (form.logo) fd.append('logo', form.logo);
            if (form.coverImage) fd.append('coverImage', form.coverImage);
            if (form.tinCertificate) fd.append('tinCertificate', form.tinCertificate);
            const res = await fetch(`${API}/api/auth/register`, { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');

            // ── Free plan → show verification screen ──
            if (form.subscriptionPlan === 'free') {
                const pendingId = data.userId || data._id || data.user?._id;
                if (pendingId) localStorage.setItem('pendingVendorId', pendingId);
                setVendorStatus('pending');
                setSubmitted(true);
                return;
            }

            // ── Premium plan → trigger Razorpay payment ──
            const userId = data.userId || data._id || data.user?._id;
            const userEmail = data.user?.email || form.email;
            const userPhone = data.user?.phone || form.phone || '9999999999';

            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error('Payment gateway failed to load. Please contact support.');

            const subRes = await fetch(`${API}/api/razorpay/subscription/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providerId: userId,
                    planId: form.subscriptionPlan,
                    customerEmail: userEmail,
                    customerPhone: userPhone,
                })
            });
            const subData = await subRes.json();
            if (!subRes.ok || !subData.razorpay?.subscriptionId) throw new Error(subData.message || 'Failed to create subscription');

            const { razorpay, customer } = subData;

            const options = {
                key: razorpay.key,
                subscription_id: razorpay.subscriptionId,
                name: 'Book My Event',
                description: `Premium Subscription`,
                image: '/logo.png',
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`${API}/api/razorpay/subscription/verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response)
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            // Store token if available
                            if (data.token) localStorage.setItem('token', data.token);
                            setVendorStatus('pending');
                            setSubmitted(true);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        setSubmitErr(err.message || 'Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: function () {
                        // User closed payment without paying – just show verification screen
                        setVendorStatus('pending');
                        setSubmitted(true);
                    }
                },
                prefill: {
                    email: customer?.email || userEmail,
                    contact: customer?.phone || userPhone,
                },
                theme: { color: '#E15B65' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            setSubmitErr(err.message);
        } finally { setLoading(false); }
    };

    if (submitted) return <VerificationScreen status={vendorStatus} rejectReason={rejectReason} />;

    const selModule = modules.find(m => m._id === form.module);
    const selZone = zones.find(z => z._id === form.zone);
    const selMultiZones = (form.multiZones || []).map(id => zones.find(z => z._id === id)?.name).filter(Boolean);
    const selPlan = form.subscriptionPlan === 'free' ? FREE_PLAN : plans.find(p => p._id === form.subscriptionPlan);
    const isMultiZoneModule = selModule && ['makeup', 'photography', 'mehandi'].some(kw => selModule.title.toLowerCase().includes(kw));
    const isSecondaryModule = selModule?.isSecondary === true;

    /* ── shared label sx ── */
    const LB_SX = {
        color: '#777', fontSize: 13.5, fontWeight: 500,
        '&.Mui-focused': { color: RED }
    };

    /* ── step content ── */
    const content = [

        /* STEP 1 */
        <Box key={0} sx={{ animation: `${fadeUp} .35s ease`, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Row: First Name | Last Name */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth label="First Name *" value={form.firstName}
                    onChange={e => set('firstName', e.target.value)} size="medium"
                    error={!!errors.firstName} helperText={errors.firstName} sx={INPUT_SX} />
                <TextField fullWidth label="Last Name *" value={form.lastName}
                    onChange={e => set('lastName', e.target.value)} size="medium"
                    error={!!errors.lastName} helperText={errors.lastName} sx={INPUT_SX} />
            </Stack>
            {/* Row: Email | Phone */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth label="Email Address *" type="email" value={form.email}
                    onChange={e => set('email', e.target.value)} size="medium"
                    error={!!errors.email} helperText={errors.email} sx={INPUT_SX} />
                <TextField fullWidth label="Phone Number *" value={form.phone}
                    onChange={e => set('phone', e.target.value)} size="medium"
                    error={!!errors.phone} helperText={errors.phone} sx={INPUT_SX} />
            </Stack>
            {/* Row: Vendor Type | (half spacer) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: { xs: '1', sm: '0 0 calc(50% - 8px)' } }}>
                    <FormControl fullWidth size="medium">
                        <InputLabel sx={LB_SX}>Vendor Type</InputLabel>
                        <Select value={form.vendorType} label="Vendor Type" onChange={e => set('vendorType', e.target.value)}
                            sx={SELECT_SX} MenuProps={MENU_PROPS}>
                            <MenuItem value="individual">Individual</MenuItem>
                            <MenuItem value="company">Company / Business</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} /> {/* spacer */}
            </Stack>
            {/* Row: Service Module — FULL WIDTH always */}
            <FormControl fullWidth size="medium" error={!!errors.module}>
                <InputLabel sx={LB_SX}>Service Module *</InputLabel>
                <Select value={form.module} label="Service Module *" onChange={e => set('module', e.target.value)}
                    sx={SELECT_SX} MenuProps={MENU_PROPS}>
                    {modules.length === 0
                        ? <MenuItem disabled value=""><em style={{ color: '#aaa' }}>Loading modules…</em></MenuItem>
                        : modules.map(m => (
                            <MenuItem key={m._id} value={m._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                    src={m.icon ? `${API}${m.icon}` : ''}
                                    variant="rounded"
                                    sx={{ width: 24, height: 24, bgcolor: alpha(RED, 0.1), color: RED }}
                                />
                                {m.title}
                            </MenuItem>
                        ))
                    }
                </Select>
                {errors.module && <FormHelperText>{errors.module}</FormHelperText>}
            </FormControl>
            {/* Row: Password | Confirm Password */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth label="Password *" size="medium"
                    type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    error={!!errors.password} helperText={errors.password} sx={INPUT_SX}
                    inputProps={{ minLength: 6, maxLength: 8 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPass(p => !p)} edge="end">
                                    {showPass ? <VisibilityIcon sx={{ fontSize: 18 }} /> : <VisibilityOffIcon sx={{ fontSize: 18 }} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
                <TextField fullWidth label="Confirm Password *" size="medium"
                    type={showConf ? 'text' : 'password'} value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={INPUT_SX}
                    inputProps={{ minLength: 6, maxLength: 8 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowConf(p => !p)} edge="end">
                                    {showConf ? <VisibilityIcon sx={{ fontSize: 18 }} /> : <VisibilityOffIcon sx={{ fontSize: 18 }} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
            </Stack>
        </Box>,

        /* STEP 2 */
        <Box key={1} sx={{ animation: `${fadeUp} .35s ease`, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Row: Store Name — full width */}
            <TextField fullWidth label="Store / Business Name *" value={form.storeName}
                onChange={e => set('storeName', e.target.value)} size="medium"
                error={!!errors.storeName} helperText={errors.storeName} sx={INPUT_SX} />
            {/* Row: Business TIN | TIN Expiry */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth label="Business TIN (optional)" value={form.businessTIN}
                    onChange={e => set('businessTIN', e.target.value)} size="medium" sx={INPUT_SX} />
                <TextField fullWidth label="TIN Expiry Date" type="date" value={form.tinExpireDate}
                    onChange={e => set('tinExpireDate', e.target.value)} size="medium"
                    InputLabelProps={{ shrink: true }} sx={INPUT_SX} />
            </Stack>
            {/* Row: Primary Zone */}
            <FormControl fullWidth size="medium" error={!!errors.zone}>
                <InputLabel sx={LB_SX}>Primary Zone / Area *</InputLabel>
                <Select value={form.zone} label="Primary Zone / Area *" onChange={e => { set('zone', e.target.value); set('multiZones', form.multiZones.filter(mz => mz !== e.target.value)); }}
                    sx={SELECT_SX} MenuProps={MENU_PROPS}>
                    <MenuItem value=""><em style={{ color: '#aaa' }}>None</em></MenuItem>
                    {zones.map(z => <MenuItem key={z._id} value={z._id}>{z.name}{z.city ? ` — ${z.city}` : ''}</MenuItem>)}
                </Select>
                {errors.zone && <FormHelperText>{errors.zone}</FormHelperText>}
            </FormControl>

            {/* Row: Multi Zones - Conditionally Rendered */}
            {isMultiZoneModule && (
                <FormControl fullWidth size="medium">
                    <InputLabel sx={LB_SX}>Additional Zones (Optional)</InputLabel>
                    <Select
                        multiple
                        value={form.multiZones || []}
                        onChange={(e) => set('multiZones', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                        input={<OutlinedInput label="Additional Zones (Optional)" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((val) => {
                                    const matched = zones.find(z => z._id === val);
                                    return matched ? (
                                        <Chip 
                                            key={val} 
                                            label={matched.name}
                                            size="small" 
                                            onDelete={() => set('multiZones', form.multiZones.filter(m => m !== val))}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            sx={{ bgcolor: alpha(RED, 0.1), color: RED, fontWeight: 600, '& .MuiChip-deleteIcon': { color: RED, '&:hover': { color: RED_DARK } } }}
                                        />
                                    ) : null;
                                })}
                            </Box>
                        )}
                        sx={SELECT_SX}
                        MenuProps={MENU_PROPS}
                    >
                        {zones.map(z => {
                            if (z._id === form.zone) return null;
                            return (
                                <MenuItem key={z._id} value={z._id}>
                                    <Checkbox checked={(form.multiZones || []).includes(z._id)} sx={{ '&.Mui-checked': { color: RED } }} />
                                    <ListItemText primary={`${z.name}${z.city ? ` — ${z.city}` : ''}`} />
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            )}

            {isSecondaryModule && (
                <>
                    <Typography variant="subtitle2" sx={{ color: RED, fontWeight: 700, mt: 2 }}>Services & Specialisation</Typography>
                    <FormControl fullWidth size="medium">
                        <InputLabel sx={LB_SX}>Services (Multi-Selection)</InputLabel>
                        <Select multiple value={form.services || []} onChange={(e) => set('services', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)} sx={SELECT_SX}
                            input={<OutlinedInput label="Services (Multi-Selection)" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((val) => {
                                        const c = categories.find(cat => cat._id === val);
                                        return c ? <Chip key={val} label={c.title || c.name} size="small" /> : null;
                                    })}
                                </Box>
                            )}
                            MenuProps={MENU_PROPS}
                        >
                            {categories.map(c => (
                                <MenuItem key={c._id} value={c._id}>
                                    <Checkbox checked={(form.services || []).includes(c._id)} sx={{ '&.Mui-checked': { color: RED } }} />
                                    <ListItemText primary={c.title || c.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="medium" error={!!errors.specialised}>
                        <InputLabel sx={LB_SX}>Specialised (Single) *</InputLabel>
                        <Select value={form.specialised} onChange={(e) => set('specialised', e.target.value)} sx={SELECT_SX} MenuProps={MENU_PROPS}>
                            {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.title || c.name}</MenuItem>)}
                        </Select>
                        {errors.specialised && <FormHelperText>{errors.specialised}</FormHelperText>}
                    </FormControl>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField fullWidth label="Starting Price *" type="number" value={form.startingPrice} onChange={e => set('startingPrice', e.target.value)} error={!!errors.startingPrice} helperText={errors.startingPrice} sx={INPUT_SX} />
                        <TextField fullWidth label="Minimum Booking Price" type="number" value={form.minBookingPrice} onChange={e => set('minBookingPrice', e.target.value)} sx={INPUT_SX} />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField fullWidth label="Max Bookings Per Day" type="number" value={form.maxBookings} onChange={e => set('maxBookings', e.target.value)} sx={INPUT_SX} />
                    </Stack>
                </>
            )}
        </Box>,

        /* STEP 3 - Location */
        <Box key={2} sx={{ animation: `${fadeUp} .35s ease`, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ mb: 1 }}>
                <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 800, mb: 1 }}>Business Location</Typography>
                <Typography variant="body2" color="text.secondary">Enter your precise business address and position on the map.</Typography>
            </Box>

            <Stack spacing={2.5}>
                <TextField 
                    fullWidth 
                    label="Complete Business Address *" 
                    value={form.storeAddress.fullAddress}
                    onChange={e => setAddr('fullAddress', e.target.value)} 
                    multiline 
                    rows={3} 
                    sx={INPUT_SX}
                    placeholder="Enter your full business address here..."
                />

                <TextField 
                    fullWidth 
                    label="Street / Building No." 
                    value={form.storeAddress.street}
                    onChange={e => setAddr('street', e.target.value)} 
                    sx={INPUT_SX} 
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ color: '#cbd5e1', fontSize: 20 }} /></InputAdornment>
                    }}
                />

                <TextField 
                    fullWidth 
                    label="City" 
                    value={form.storeAddress.city}
                    onChange={e => setAddr('city', e.target.value)} 
                    error={!!errors.city} 
                    helperText={errors.city} 
                    sx={INPUT_SX}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><BusinessCenterOutlinedIcon sx={{ color: '#cbd5e1', fontSize: 20 }} /></InputAdornment>
                    }}
                />

                <TextField 
                    fullWidth 
                    label="State / Province / Emirate" 
                    value={form.storeAddress.state}
                    onChange={e => setAddr('state', e.target.value)} 
                    sx={INPUT_SX} 
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><MapPinIcon sx={{ color: '#cbd5e1', fontSize: 20 }} /></InputAdornment>
                    }}
                />

                <TextField 
                    fullWidth 
                    label="ZIP / Postal Code" 
                    value={form.storeAddress.zipCode}
                    onChange={e => setAddr('zipCode', e.target.value)} 
                    sx={INPUT_SX} 
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><TagIcon sx={{ color: '#cbd5e1', fontSize: 20 }} /></InputAdornment>
                    }}
                />
            </Stack>

            <Divider sx={{ my: 2, '&::before, &::after': { borderColor: '#f1f5f9' } }}>
                <Chip label="PINPOINT ON MAP" size="small" sx={{ fontWeight: 800, fontSize: 10, bgcolor: '#f8fafc', color: '#64748b', px: 1 }} />
            </Divider>

            <Box sx={{ mb: 1 }}>
                <TextField
                    fullWidth
                    label="Search Place or Area"
                    inputRef={searchInputRef}
                    placeholder="Type to find your business location..."
                    sx={{
                        ...INPUT_SX,
                        '& .MuiOutlinedInput-root': {
                            ...INPUT_SX['& .MuiOutlinedInput-root'],
                            bgcolor: alpha(RED, 0.02),
                            borderColor: alpha(RED, 0.1)
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: RED, fontSize: 20 }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box sx={{ 
                position: 'relative', 
                height: { xs: 300, sm: 400 }, 
                width: '100%', 
                borderRadius: 5, 
                overflow: 'hidden', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
                {!mapsLoaded && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc', zIndex: 2 }}>
                        <CircularProgress size={32} sx={{ color: RED }} />
                    </Box>
                )}
                <Box ref={mapRef} sx={{ height: '100%', width: '100%' }} />
                
                <Box sx={{ 
                    position: 'absolute', 
                    bottom: 20, 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    bgcolor: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(8px)', 
                    padding: '10px 20px', 
                    borderRadius: 3, 
                    border: '1px solid #e2e8f0', 
                    zIndex: 1,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <LocationOnIcon sx={{ color: RED, fontSize: 18 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                        Drag pin or click to set location
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ 
                bgcolor: '#f8fafc', 
                p: 2.5, 
                borderRadius: 4, 
                border: '1px solid #f1f5f9',
                display: 'flex',
                gap: 2
            }}>
                <TextField 
                    fullWidth 
                    label="Latitude" 
                    value={form.latitude}
                    size="small" 
                    sx={{ ...INPUT_SX, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                    InputProps={{ readOnly: true, startAdornment: <Typography variant="caption" sx={{ mr: 1, color: '#94a3b8', fontWeight: 800 }}>LAT</Typography> }} 
                />
                <TextField 
                    fullWidth 
                    label="Longitude" 
                    value={form.longitude}
                    size="small" 
                    sx={{ ...INPUT_SX, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                    InputProps={{ readOnly: true, startAdornment: <Typography variant="caption" sx={{ mr: 1, color: '#94a3b8', fontWeight: 800 }}>LNG</Typography> }} 
                />
            </Box>
        </Box>,

        /* STEP 4 – Plan */
        <Box key={3} sx={{ animation: `${fadeUp} .35s ease` }}>
            {plansLoading
                ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress sx={{ color: RED }} /></Box>
                : <>
                    <Grid container spacing={3} justifyContent="center">
                        {/* FREE PLAN */}
                        <Grid item xs={12} md={8}>
                            <Card
                                onClick={() => set('subscriptionPlan', 'free')}
                                sx={{
                                    height: '100%', borderRadius: 4, cursor: 'pointer',
                                    border: form.subscriptionPlan === 'free' ? '3px solid #4caf50' : '2px solid #e0e0e0',
                                    boxShadow: form.subscriptionPlan === 'free' ? '0 4px 20px rgba(76,175,80,0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
                                    transition: 'all .25s',
                                    '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Chip label="AVAILABLE PLAN" sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 700, fontSize: 11 }} />
                                        {form.subscriptionPlan === 'free' && <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 22 }} />}
                                    </Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#555', mb: 0.5 }}>FREE</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Basic access to get started on the platform</Typography>
                                    <Typography variant="h4" fontWeight={900} sx={{ color: '#4caf50', mb: 2 }}>₹0</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1}>
                                        {['Limited listings', 'Basic visibility', 'Standard support', 'Up to 5 packages'].map(f => (
                                            <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                                <Typography variant="body2" color="text.secondary">{f}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                    <Button fullWidth sx={{ mt: 3, bgcolor: '#4caf50', color: '#fff', fontWeight: 700, borderRadius: 2, textTransform: 'none', py: 1.2, '&:hover': { bgcolor: '#388e3c' } }}>Continue with Free Plan</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, background: '#f9faff', border: `1px solid ${alpha(RED, 0.15)}`, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            no paid plans available continue with free
                        </Typography>
                    </Box>
                </>
            }
        </Box>,

        /* STEP 5 – Media */
        <Box key={4} sx={{ animation: `${fadeUp} .35s ease` }}>
            <Stack spacing={3}>
                {[
                    { label: 'Business Logo / Brand Identity', note: 'Square recommended, PNG or JPG (max 5MB)', field: 'logo', ref: logoRef, accept: 'image/*', icon: <ExploreOutlinedIcon sx={{ fontSize: 32 }} /> },
                    { label: 'Brand Cover Header Image', note: 'Landscape recommended, PNG or JPG (max 5MB)', field: 'coverImage', ref: coverRef, accept: 'image/*', icon: <MapIcon sx={{ fontSize: 32 }} /> },
                    { label: 'TIN / Business License Certificate', note: 'Legal proof, PDF or high-quality JPG', field: 'tinCertificate', ref: tinRef, accept: 'image/*,application/pdf', icon: <WorkspacePremiumIcon sx={{ fontSize: 32 }} /> },
                ].map(({ label, note, field, ref: r, accept, icon }) => (
                    <UpBox 
                        key={field} 
                        isset={form[field] ? 'true' : undefined} 
                        onClick={() => r.current?.click()}
                        sx={{ 
                            textAlign: 'left', 
                            py: 4, 
                            px: 3, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 3,
                            boxShadow: form[field] ? '0 4px 12px rgba(76, 175, 80, 0.1)' : 'none'
                        }}
                    >
                        {form[field] && (
                            <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); set(field, null); }}
                                sx={{
                                    position: 'absolute', top: 12, right: 12,
                                    bgcolor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444',
                                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)', transform: 'rotate(90deg)' },
                                    transition: 'all .3s'
                                }}
                            >
                                <CancelOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        )}
                        <input type="file" accept={accept} ref={r} hidden onChange={e => set(field, e.target.files[0])} />
                        
                        <Box sx={{ 
                            width: 64, 
                            height: 64, 
                            borderRadius: '16px', 
                            bgcolor: form[field] ? alpha('#4caf50', 0.1) : alpha(RED, 0.05), 
                            color: form[field] ? '#4caf50' : RED, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {form[field] ? (
                                form[field].type?.startsWith('image') 
                                    ? <Avatar src={URL.createObjectURL(form[field])} variant="rounded" sx={{ width: 44, height: 44, borderRadius: '10px' }} />
                                    : <CheckCircleIcon sx={{ fontSize: 32 }} />
                            ) : (
                                icon
                            )}
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#1e293b', mb: 0.5 }}>{label}</Typography>
                            <Typography sx={{ fontSize: 13, color: form[field] ? '#4caf50' : '#64748b', fontWeight: 500 }}>
                                {form[field] 
                                    ? `Selected: ${form[field].name.length > 35 ? form[field].name.slice(0, 35) + '...' : form[field].name}` 
                                    : note}
                            </Typography>
                        </Box>

                        {!form[field] && (
                            <Button 
                                variant="outlined" 
                                size="small" 
                                sx={{ 
                                    borderRadius: 2, 
                                    borderColor: '#e2e8f0', 
                                    color: '#64748b', 
                                    fontWeight: 700,
                                    display: { xs: 'none', sm: 'flex' }
                                }}
                            >
                                Upload
                            </Button>
                        )}
                    </UpBox>
                ))}
            </Stack>
        </Box>,

        /* STEP 6 – Review */
        <Box key={5} sx={{ animation: `${fadeUp} .35s ease` }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {[
                    { title: 'Personal', icon: <PersonOutlineIcon sx={{ fontSize: 16 }} />, goTo: 0, rows: [['Name', `${form.firstName} ${form.lastName}`], ['Email', form.email], ['Phone', form.phone], ['Type', form.vendorType === 'individual' ? 'Individual' : 'Company'], ['Module', selModule?.title || '—']] },
                    { 
                        title: 'Business', 
                        icon: <BusinessCenterOutlinedIcon sx={{ fontSize: 16 }} />, 
                        goTo: 1, 
                        rows: [
                            ['Store', form.storeName || '—'],
                            ...(isSecondaryModule ? [
                                ['Specialised', categories.find(c => c._id === form.specialised)?.title || categories.find(c => c._id === form.specialised)?.name || '—'],
                                ['Starting Price', form.startingPrice || '—']
                            ] : [
                                ['TIN', form.businessTIN || '—']
                            ]),
                            ['Primary Zone', selZone?.name || '—'],
                            ...(isMultiZoneModule ? [['Additional Zones', selMultiZones.length ? selMultiZones.join(', ') : '—']] : [])
                        ] 
                    },
                    { title: 'Location', icon: <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />, goTo: 2, rows: [['City', form.storeAddress.city || '—'], ['State', form.storeAddress.state || '—'], ['ZIP', form.storeAddress.zipCode || '—']] },
                    { title: 'Plan', icon: <StarOutlineIcon sx={{ fontSize: 16 }} />, goTo: 3, rows: [['Plan', selPlan?.name || 'Free'], ['Price', selPlan?.price === 0 ? 'Free' : `₹${selPlan?.price}`]] },
                    { title: 'Media', icon: <PermMediaOutlinedIcon sx={{ fontSize: 16 }} />, goTo: 4, rows: [['Logo', form.logo?.name || 'Not uploaded'], ['Cover', form.coverImage?.name || 'Not uploaded'], ['Cert', form.tinCertificate?.name || 'Not uploaded']] },
                ].map(({ title, icon, goTo, rows }) => (
                    <Box key={title} sx={{
                        p: { xs: 2.5, sm: 3 },
                        border: '1px solid #f1f5f9',
                        borderRadius: 4,
                        background: '#f8fafc',
                        transition: 'all .2s ease',
                        '&:hover': { borderColor: alpha(RED, 0.2), background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ p: 0.8, borderRadius: 1, bgcolor: alpha(RED, 0.1), color: RED, display: 'flex' }}>{icon}</Box>
                                <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#1e293b' }}>{title}</Typography>
                            </Box>
                            <IconButton size="small" onClick={() => setStep(goTo)} sx={{ color: '#94a3b8', '&:hover': { color: RED, bgcolor: alpha(RED, 0.05) } }}>
                                <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                        <Stack spacing={1.2}>
                            {rows.map(([k, v]) => (
                                <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                    <Typography sx={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{k}</Typography>
                                    <Typography sx={{ fontSize: 13, color: '#1e293b', fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>{v}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Box>

            {submitErr && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{submitErr}</Alert>}
            <Box sx={{ mt: 2, p: 2, border: '1px solid #eef0f8', borderRadius: 14, background: '#fafcff' }}>
                <FormControlLabel
                    control={<Checkbox checked={agreed} onChange={e => setAgreed(e.target.checked)} sx={{ '&.Mui-checked': { color: RED } }} />}
                    label={<Typography variant="body2" color="text.secondary">
                        I agree to the{' '}<span style={{ color: RED, fontWeight: 600, cursor: 'pointer' }}>Terms & Conditions</span>{' '}and{' '}
                        <span style={{ color: RED, fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
                    </Typography>}
                />
            </Box>
        </Box>,
    ];

    return (
        <PageWrap>
            <Box sx={{ mb: { xs: 2.5, sm: 4 }, textAlign: 'center' }}>
                <Link to="/pages/login">
                    <img src={bookLogo} alt="BookMyEvent" style={{ height: 48, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
                </Link>
                <Typography sx={{ fontSize: 11, letterSpacing: 3, color: '#94a3b8', textTransform: 'uppercase', mt: 1, fontWeight: 700 }}>
                    Vendor Registration Portal
                </Typography>
            </Box>

            <RegCard elevation={0}>
                <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-0.025em', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                        Join as a Vendor
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, color: '#64748b', fontSize: { xs: 14, sm: 16 } }}>
                        Complete the steps below to create your vendor account
                    </Typography>
                </Box>

                {/* Stepper */}
                <Stepper activeStep={step} alternativeLabel sx={{ mb: 0 }}>
                    {STEPS.map((label, i) => {
                        const Icon = STEP_ICONS[i]; const done = step > i; const active = step === i;
                        return (
                            <Step key={label} completed={done}>
                                <StepLabel
                                    StepIconComponent={() => <Bubble Icon={Icon} active={active} done={done} />}
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            display: { xs: 'none', sm: 'block' },
                                            fontSize: 12, fontWeight: active ? 800 : 600,
                                            color: active ? RED : done ? '#10b981' : '#94a3b8', mt: 1
                                        }
                                    }}
                                >{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                {/* Progress rail */}
                <Box sx={{ display: 'flex', mb: { xs: 4, sm: 6 }, mt: { xs: 3, sm: 1.5 }, px: .5 }}>
                    {STEPS.map((_, i) => (
                        <Box key={i} sx={{
                            flex: 1, height: { xs: 4, sm: 3 }, borderRadius: 4,
                            background: i < step ? '#10b981' : i === step ? RED : '#f1f5f9',
                            mx: .5, transition: 'all .3s ease'
                        }} />
                    ))}
                </Box>

                {/* Step header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', fontSize: { xs: 18, sm: 20 }, letterSpacing: '-0.01em' }}>
                        {['Personal Information', 'Business Details', 'Location', 'Choose Your Plan', 'Media & Documents', 'Review & Submit'][step]}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: { xs: 13, sm: 14.5 }, color: '#64748b', lineHeight: 1.6 }}>
                        {['Tell us about yourself and your service category', 'Provide your business details', 'Where is your business located?', 'Select the best plan for your needs', 'Upload your business media and documents', 'Review everything before submitting'][step]}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3.5, borderColor: '#f0f2f8' }} />

                {/* Content */}
                <Box sx={{ minHeight: 280 }}>{content[step]}</Box>

                {/* Nav */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5, pt: 4, borderTop: '1px solid #f1f5f9' }}>
                    <SBtn variant="outlined" onClick={() => setStep(s => s - 1)} disabled={step === 0} sx={{ minWidth: { xs: 90, sm: 120 } }}>
                        ← Back
                    </SBtn>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                        {STEPS.map((_, i) => (
                            <Box key={i} sx={{
                                width: step === i ? 24 : 8, height: 8, borderRadius: 4,
                                background: step === i ? RED : step > i ? '#10b981' : '#e2e8f0',
                                transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} />
                        ))}
                    </Box>

                    {step < STEPS.length - 1
                        ? <PBtn onClick={next} sx={{ minWidth: { xs: 110, sm: 160 } }}>Continue →</PBtn>
                        : <PBtn onClick={submit} disabled={loading} sx={{ minWidth: { xs: 140, sm: 200 } }}
                            startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : null}>
                            {loading ? 'Submitting…' : '🎉 Submit'}
                        </PBtn>
                    }
                </Stack>

                <Box sx={{ textAlign: 'center', mt: 2.5 }}>
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Typography component={Link} to="/pages/login"
                            sx={{ color: RED, fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            Sign In
                        </Typography>
                    </Typography>
                </Box>
            </RegCard>
        </PageWrap>
    );
}
