import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box, Button, Step, StepLabel, Stepper, Typography, TextField,
    Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText,
    CircularProgress, Checkbox, FormControlLabel, Alert, Avatar,
    Divider, Chip, Paper, InputAdornment, IconButton
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
import bookLogo from 'assets/images/book.png';

const API = 'https://api.bookmyevent.ae';
const RED = '#E15B65';
const RED_DARK = '#c0392b';
const RED_BG = 'rgba(225,91,101,0.07)';

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
            maxHeight: 280, overflow: 'hidden',
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
const PageWrap = styled(Box)({
    minHeight: '100vh', background: 'linear-gradient(135deg,#f0f2f8 0%,#e8eaf3 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px 64px',
});
const Card = styled(Paper)({
    width: '100%', maxWidth: 880, borderRadius: 24,
    boxShadow: '0 8px 48px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.05)',
    padding: '40px 44px', background: '#fff',
});
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
function validate(s, f) {
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
    if (s === 1) { if (!f.storeName.trim()) e.storeName = 'Required'; }
    if (s === 2) { if (!f.storeAddress.city.trim()) e.city = 'City required'; }
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
function VerificationScreen() {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
        return () => clearInterval(t);
    }, []);

    const steps2 = [
        { icon: '📝', label: 'Registration Received', done: true },
        { icon: '🔍', label: 'Admin Review in Progress', active: true },
        { icon: '✉️', label: 'Approval Email Sent to You', done: false },
        { icon: '🚀', label: 'Account Activated!', done: false },
    ];

    return (
        <PageWrap>
            <Box sx={{ mb: 3 }}>
                <img src={bookLogo} alt="BookMyEvent" style={{ height: 44, objectFit: 'contain' }} />
            </Box>
            <Card elevation={0} sx={{ textAlign: 'center', maxWidth: 640, animation: `${scaleIn} .5s ease` }}>
                {/* Animated icon */}
                <Box sx={{ mb: 3, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{
                        width: 110, height: 110, borderRadius: '50%',
                        background: `linear-gradient(135deg,${alpha(RED, 0.12)},${alpha(RED, 0.05)})`,
                        border: `2px solid ${alpha(RED, 0.2)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: `${floatY} 3s ease-in-out infinite`
                    }}>
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 52, color: RED }} />
                    </Box>
                    {/* Orbiting dot */}
                    <Box sx={{
                        position: 'absolute', width: 140, height: 140, borderRadius: '50%',
                        border: `2px dashed ${alpha(RED, 0.3)}`, animation: `${spin} 8s linear infinite`
                    }}>
                        <Box sx={{
                            position: 'absolute', top: -5, left: '50%', width: 10, height: 10,
                            borderRadius: '50%', bgcolor: RED, transform: 'translateX(-50%)'
                        }} />
                    </Box>
                </Box>

                <Typography variant="h4" fontWeight={800} sx={{ color: '#1a1a2e', mb: 1, letterSpacing: '-0.5px' }}>
                    Registration Submitted! 🎉
                </Typography>
                <Typography variant="h6" fontWeight={500} sx={{ color: RED, mb: 0.5, fontSize: 16 }}>
                    Under Verification{dots}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 480, mx: 'auto', lineHeight: 1.7, fontSize: 13.5 }}>
                    Your vendor account is now <strong>pending admin review</strong>. Our team will verify your details
                    and activate your account within <strong>24–48 hours</strong>. You'll receive a confirmation
                    email once approved.
                </Typography>

                {/* Mini process steps */}
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    {steps2.map(({ icon, label, done, active }, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: i < steps2.length - 1 ? 1.5 : 0 }}>
                            <Box sx={{
                                width: 42, height: 42, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: done ? '#e8f5e9' : active ? RED_BG : '#f5f5f5',
                                border: done ? '2px solid #4caf50' : active ? `2px solid ${RED}` : '2px solid #eee',
                                fontSize: 18
                            }}>
                                {icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{
                                    fontSize: 13.5, fontWeight: done || active ? 600 : 400,
                                    color: done ? '#4caf50' : active ? RED : '#bbb'
                                }}>
                                    {label}
                                </Typography>
                                {active && (
                                    <Box sx={{
                                        mt: 0.5, height: 3, borderRadius: 4, overflow: 'hidden',
                                        background: `linear-gradient(90deg,${RED},${alpha(RED, 0.3)},${RED})`,
                                        backgroundSize: '400px 3px', animation: `${shimmer} 1.8s linear infinite`
                                    }} />
                                )}
                            </Box>
                            {done && <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18, flexShrink: 0 }} />}
                        </Box>
                    ))}
                </Box>

                <Box sx={{ p: 2.5, borderRadius: 14, background: 'linear-gradient(135deg,#fff9f9,#fff)', border: `1px solid ${alpha(RED, 0.15)}`, mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        📧 &nbsp;Check your inbox for a <strong>registration confirmation email.</strong><br />
                        Once approved, you can log in with your registered credentials.
                    </Typography>
                </Box>

                <Button component={Link} to="/pages/login" variant="outlined"
                    sx={{
                        borderRadius: 12, px: 4, py: 1.4, fontWeight: 700, fontSize: 14, textTransform: 'none',
                        borderColor: RED, color: RED, textDecoration: 'none',
                        '&:hover': { background: RED_BG, borderColor: RED_DARK }
                    }}>
                    Back to Login
                </Button>
            </Card>
        </PageWrap>
    );
}

/* ─────────────── Main Component ─────────────── */
export default function VendorRegisterStepper() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitErr, setSubmitErr] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [modules, setModules] = useState([]);
    const [zones, setZones] = useState([]);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const logoRef = useRef(); const coverRef = useRef(); const tinRef = useRef();

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        vendorType: 'individual', module: '', password: '', confirmPassword: '',
        storeName: '', businessTIN: '', tinExpireDate: '', zone: '',
        storeAddress: { street: '', city: '', state: '', zipCode: '', fullAddress: '' },
        subscriptionPlan: 'free', logo: null, coverImage: null, tinCertificate: null,
    });

    useEffect(() => {
        fetch(`${API}/api/modules`).then(r => r.json())
            .then(d => setModules(Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []))
            .catch(() => { });
        fetch(`${API}/api/zones`).then(r => r.json())
            .then(d => setZones(Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (step !== 3) return;
        setPlansLoading(true);
        const url = form.module ? `${API}/api/subscription/plan/module/${form.module}` : `${API}/api/admin/subscription/plan`;
        fetch(url).then(r => r.json())
            .then(d => setPlans(Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []))
            .catch(() => setPlans([])).finally(() => setPlansLoading(false));
    }, [step]);

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
    const setAddr = (k, v) => { setForm(f => ({ ...f, storeAddress: { ...f.storeAddress, [k]: v } })); setErrors(e => ({ ...e, [k]: '' })); };

    const next = () => {
        const errs = validate(step, form);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({}); setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submit = async () => {
        if (!agreed) { setSubmitErr('Please agree to the Terms & Conditions'); return; }
        setLoading(true); setSubmitErr('');
        try {
            const fd = new FormData();
            ['firstName', 'lastName', 'email', 'phone', 'vendorType', 'password', 'storeName'].forEach(k => fd.append(k, form[k].trim?.() ?? form[k]));
            fd.append('role', 'vendor');
            if (form.businessTIN) fd.append('businessTIN', form.businessTIN.trim());
            if (form.tinExpireDate) fd.append('tinExpireDate', form.tinExpireDate);
            if (form.module) fd.append('module', form.module);
            if (form.zone) fd.append('zone', form.zone);
            if (form.subscriptionPlan !== 'free') fd.append('subscriptionPlan', form.subscriptionPlan);
            fd.append('storeAddress', JSON.stringify(form.storeAddress));
            if (form.logo) fd.append('logo', form.logo);
            if (form.coverImage) fd.append('coverImage', form.coverImage);
            if (form.tinCertificate) fd.append('tinCertificate', form.tinCertificate);
            const res = await fetch(`${API}/api/auth/register`, { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');
            setSubmitted(true);
        } catch (err) {
            setSubmitErr(err.message);
        } finally { setLoading(false); }
    };

    if (submitted) return <VerificationScreen />;

    const selModule = modules.find(m => m._id === form.module);
    const selZone = zones.find(z => z._id === form.zone);
    const selPlan = form.subscriptionPlan === 'free' ? FREE_PLAN : plans.find(p => p._id === form.subscriptionPlan);

    /* ── shared label sx ── */
    const LB_SX = {
        color: '#777', fontSize: 13.5, fontWeight: 500,
        '&.Mui-focused': { color: RED }
    };

    /* ── step content ── */
    const content = [

        /* STEP 1 */
        <Box key={0} sx={{ animation: `${fadeUp} .35s ease`, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Row: First Name | Last Name */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth label="First Name *" value={form.firstName}
                    onChange={e => set('firstName', e.target.value)} size="medium"
                    error={!!errors.firstName} helperText={errors.firstName} sx={INPUT_SX} />
                <TextField fullWidth label="Last Name *" value={form.lastName}
                    onChange={e => set('lastName', e.target.value)} size="medium"
                    error={!!errors.lastName} helperText={errors.lastName} sx={INPUT_SX} />
            </Box>
            {/* Row: Email | Phone */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth label="Email Address *" type="email" value={form.email}
                    onChange={e => set('email', e.target.value)} size="medium"
                    error={!!errors.email} helperText={errors.email} sx={INPUT_SX} />
                <TextField fullWidth label="Phone Number *" value={form.phone}
                    onChange={e => set('phone', e.target.value)} size="medium"
                    error={!!errors.phone} helperText={errors.phone} sx={INPUT_SX} />
            </Box>
            {/* Row: Vendor Type | (half spacer) */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
                    <FormControl fullWidth size="medium">
                        <InputLabel sx={LB_SX}>Vendor Type</InputLabel>
                        <Select value={form.vendorType} label="Vendor Type" onChange={e => set('vendorType', e.target.value)}
                            sx={SELECT_SX} MenuProps={MENU_PROPS}>
                            <MenuItem value="individual">Individual</MenuItem>
                            <MenuItem value="company">Company / Business</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ flex: 1 }} /> {/* spacer */}
            </Box>
            {/* Row: Service Module — FULL WIDTH always */}
            <FormControl fullWidth size="medium" error={!!errors.module}>
                <InputLabel sx={LB_SX}>Service Module *</InputLabel>
                <Select value={form.module} label="Service Module *" onChange={e => set('module', e.target.value)}
                    sx={SELECT_SX} MenuProps={MENU_PROPS}>
                    {modules.length === 0
                        ? <MenuItem disabled value=""><em style={{ color: '#aaa' }}>Loading modules…</em></MenuItem>
                        : modules.map(m => <MenuItem key={m._id} value={m._id}>{m.title}</MenuItem>)
                    }
                </Select>
                {errors.module && <FormHelperText>{errors.module}</FormHelperText>}
            </FormControl>
            {/* Row: Password | Confirm Password */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth label="Password *" size="medium"
                    type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    error={!!errors.password} helperText={errors.password} sx={INPUT_SX}
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
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowConf(p => !p)} edge="end">
                                    {showConf ? <VisibilityIcon sx={{ fontSize: 18 }} /> : <VisibilityOffIcon sx={{ fontSize: 18 }} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
            </Box>
        </Box>,

        /* STEP 2 */
        <Box key={1} sx={{ animation: `${fadeUp} .35s ease`, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Row: Store Name — full width */}
            <TextField fullWidth label="Store / Business Name *" value={form.storeName}
                onChange={e => set('storeName', e.target.value)} size="medium"
                error={!!errors.storeName} helperText={errors.storeName} sx={INPUT_SX} />
            {/* Row: Business TIN | TIN Expiry */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth label="Business TIN (optional)" value={form.businessTIN}
                    onChange={e => set('businessTIN', e.target.value)} size="medium" sx={INPUT_SX} />
                <TextField fullWidth label="TIN Expiry Date" type="date" value={form.tinExpireDate}
                    onChange={e => set('tinExpireDate', e.target.value)} size="medium"
                    InputLabelProps={{ shrink: true }} sx={INPUT_SX} />
            </Box>
            {/* Row: Zone — FULL WIDTH always */}
            <FormControl fullWidth size="medium">
                <InputLabel sx={LB_SX}>Zone / Area (optional)</InputLabel>
                <Select value={form.zone} label="Zone / Area (optional)" onChange={e => set('zone', e.target.value)}
                    sx={SELECT_SX} MenuProps={MENU_PROPS}>
                    <MenuItem value=""><em style={{ color: '#aaa' }}>None — skip this</em></MenuItem>
                    {zones.map(z => <MenuItem key={z._id} value={z._id}>{z.name}{z.city ? ` — ${z.city}` : ''}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>,

        /* STEP 3 */
        <Box key={2} sx={{ animation: `${fadeUp} .35s ease` }}>
            <Grid container spacing={2.5}>
                <Grid item xs={12}>
                    <TextField fullWidth label="Full Address" value={form.storeAddress.fullAddress}
                        onChange={e => setAddr('fullAddress', e.target.value)} size="medium"
                        multiline rows={2} sx={INPUT_SX} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Street / Building" value={form.storeAddress.street}
                        onChange={e => setAddr('street', e.target.value)} size="medium" sx={INPUT_SX} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="City *" value={form.storeAddress.city}
                        onChange={e => setAddr('city', e.target.value)} size="medium"
                        error={!!errors.city} helperText={errors.city} sx={INPUT_SX} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="State / Emirate" value={form.storeAddress.state}
                        onChange={e => setAddr('state', e.target.value)} size="medium" sx={INPUT_SX} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="ZIP / PO Box" value={form.storeAddress.zipCode}
                        onChange={e => setAddr('zipCode', e.target.value)} size="medium" sx={INPUT_SX} />
                </Grid>
            </Grid>
        </Box>,

        /* STEP 4 – Plan */
        <Box key={3} sx={{ animation: `${fadeUp} .35s ease` }}>
            {plansLoading
                ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress sx={{ color: RED }} /></Box>
                : <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6} md={4}>
                        <PlanBox picked={form.subscriptionPlan === 'free'} onClick={() => set('subscriptionPlan', 'free')}>
                            {form.subscriptionPlan === 'free' && (
                                <Box sx={{
                                    position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%',
                                    bgcolor: RED, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <CheckIcon sx={{ fontSize: 13, color: '#fff' }} />
                                </Box>
                            )}
                            <Chip label="FREE" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, fontSize: 10, mb: 1.5 }} />
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1a1a2e', mb: 0.5 }}>Free Plan</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                                <Typography variant="h4" fontWeight={900} sx={{ color: '#4caf50' }}>₹0</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: .8 }}>/forever</Typography>
                            </Box>
                            <Divider sx={{ mb: 1.5 }} />
                            {FREE_PLAN.features.map((f, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: .8 }}>
                                    <CheckCircleIcon sx={{ fontSize: 15, color: '#4caf50', flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: 12.5, color: '#555' }}>{f}</Typography>
                                </Box>
                            ))}
                        </PlanBox>
                    </Grid>
                    {plans.map((pl, idx) => {
                        const picked = form.subscriptionPlan === pl._id;
                        const feats = Array.isArray(pl.features) ? pl.features : ['Unlimited packages', 'Priority listing', 'Premium badge', '24/7 support'];
                        return (
                            <Grid item xs={12} sm={6} md={4} key={pl._id}>
                                <PlanBox picked={picked} onClick={() => set('subscriptionPlan', pl._id)}>
                                    {idx === 0 && plans.length > 1 && (
                                        <Box sx={{
                                            position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                                            bgcolor: RED, borderRadius: 20, px: 1.5, py: .4, display: 'flex', alignItems: 'center', gap: .5
                                        }}>
                                            <WorkspacePremiumIcon sx={{ fontSize: 12, color: '#fff' }} />
                                            <Typography sx={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>POPULAR</Typography>
                                        </Box>
                                    )}
                                    {picked && <Box sx={{
                                        position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%',
                                        bgcolor: RED, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <CheckIcon sx={{ fontSize: 13, color: '#fff' }} /></Box>}
                                    <Chip label={pl.duration ? `${pl.duration} DAYS` : 'PLAN'} size="small"
                                        sx={{ bgcolor: RED_BG, color: RED, fontWeight: 700, fontSize: 10, mb: 1.5 }} />
                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1a1a2e', mb: .5, pr: picked ? 3 : 0 }}>{pl.name}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                                        <Typography variant="h4" fontWeight={900} sx={{ color: RED }}>₹{pl.price ?? pl.amount ?? 0}</Typography>
                                        {pl.duration && <Typography variant="body2" color="text.secondary" sx={{ ml: .8 }}>/{pl.duration}d</Typography>}
                                    </Box>
                                    <Divider sx={{ mb: 1.5 }} />
                                    {feats.map((f, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: .8 }}>
                                            <CheckCircleIcon sx={{ fontSize: 15, color: RED, flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: 12.5, color: '#555' }}>{f}</Typography>
                                        </Box>
                                    ))}
                                </PlanBox>
                            </Grid>
                        );
                    })}
                    {plans.length === 0 && !plansLoading && (
                        <Grid item xs={12}>
                            <Box sx={{ py: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">No paid plans available. Continue with Free.</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            }
        </Box>,

        /* STEP 5 – Media */
        <Box key={4} sx={{ animation: `${fadeUp} .35s ease` }}>
            <Grid container spacing={2.5}>
                {[
                    { label: 'Business Logo', note: 'PNG / JPG, max 5MB', field: 'logo', ref: logoRef, accept: 'image/*' },
                    { label: 'Cover Image', note: 'PNG / JPG, max 5MB', field: 'coverImage', ref: coverRef, accept: 'image/*' },
                    { label: 'TIN Certificate', note: 'PDF / PNG / JPG', field: 'tinCertificate', ref: tinRef, accept: 'image/*,application/pdf' },
                ].map(({ label, note, field, ref: r, accept }) => (
                    <Grid item xs={12} sm={4} key={field}>
                        <UpBox isset={form[field] ? 'true' : undefined} onClick={() => r.current?.click()}>
                            <input type="file" accept={accept} ref={r} hidden onChange={e => set(field, e.target.files[0])} />
                            {form[field] ? (
                                <>
                                    {form[field].type?.startsWith('image')
                                        ? <Avatar src={URL.createObjectURL(form[field])} variant="rounded" sx={{ width: 56, height: 56, mx: 'auto', mb: 1.5, borderRadius: 2 }} />
                                        : <CheckCircleIcon sx={{ fontSize: 44, color: '#4caf50', mb: 1 }} />}
                                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#4caf50', mb: .3 }}>
                                        {form[field].name.length > 22 ? form[field].name.slice(0, 22) + '…' : form[field].name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 11.5, color: '#aaa' }}>Click to replace</Typography>
                                </>
                            ) : (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 38, color: '#c8cfe0', mb: 1.5 }} />
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#555', mb: .3 }}>{label}</Typography>
                                    <Typography sx={{ fontSize: 11.5, color: '#aaa' }}>{note}</Typography>
                                </>
                            )}
                        </UpBox>
                    </Grid>
                ))}
            </Grid>
        </Box>,

        /* STEP 6 – Review */
        <Box key={5} sx={{ animation: `${fadeUp} .35s ease` }}>
            {[
                { title: 'Personal', icon: <PersonOutlineIcon sx={{ fontSize: 15 }} />, goTo: 0, rows: [['Name', `${form.firstName} ${form.lastName}`], ['Email', form.email], ['Phone', form.phone], ['Type', form.vendorType === 'individual' ? 'Individual' : 'Company'], ['Module', selModule?.title || '—']] },
                { title: 'Business', icon: <BusinessCenterOutlinedIcon sx={{ fontSize: 15 }} />, goTo: 1, rows: [['Store', form.storeName || '—'], ['TIN', form.businessTIN || '—'], ['Zone', selZone?.name || '—']] },
                { title: 'Location', icon: <LocationOnOutlinedIcon sx={{ fontSize: 15 }} />, goTo: 2, rows: [['City', form.storeAddress.city || '—'], ['State', form.storeAddress.state || '—'], ['ZIP', form.storeAddress.zipCode || '—']] },
                { title: 'Plan', icon: <StarOutlineIcon sx={{ fontSize: 15 }} />, goTo: 3, rows: [['Plan', selPlan?.name || 'Free'], ['Price', selPlan?.price === 0 ? 'Free' : `₹${selPlan?.price}`]] },
                { title: 'Media', icon: <PermMediaOutlinedIcon sx={{ fontSize: 15 }} />, goTo: 4, rows: [['Logo', form.logo?.name || 'Not uploaded'], ['Cover', form.coverImage?.name || 'Not uploaded'], ['Cert', form.tinCertificate?.name || 'Not uploaded']] },
            ].map(({ title, icon, goTo, rows }) => (
                <Box key={title} sx={{ mb: 2, p: 2.5, border: '1px solid #eef0f8', borderRadius: 14, background: '#fafcff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: RED }}>{icon}
                            <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#333' }}>{title}</Typography>
                        </Box>
                        <Box onClick={() => setStep(goTo)} sx={{ cursor: 'pointer', color: '#bbb', '&:hover': { color: RED }, display: 'flex' }}>
                            <EditIcon sx={{ fontSize: 15 }} />
                        </Box>
                    </Box>
                    <Grid container rowSpacing={.8} columnSpacing={2}>
                        {rows.map(([k, v]) => (
                            <Grid item xs={12} sm={6} key={k}>
                                <Box sx={{ display: 'flex', gap: .8 }}>
                                    <Typography sx={{ fontSize: 12, color: '#aab', minWidth: 72, fontWeight: 500 }}>{k}:</Typography>
                                    <Typography sx={{ fontSize: 12, color: '#333', fontWeight: 600, wordBreak: 'break-all' }}>{v}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}

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
            <Box sx={{ mb: 3.5, textAlign: 'center' }}>
                <Link to="/pages/login">
                    <img src={bookLogo} alt="BookMyEvent" style={{ height: 44, objectFit: 'contain' }} />
                </Link>
                <Typography sx={{ fontSize: 10.5, letterSpacing: 2, color: '#aab', textTransform: 'uppercase', mt: .5 }}>
                    Vendor Registration Portal
                </Typography>
            </Box>

            <Card elevation={0}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                        Join as a Vendor
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>
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
                                            fontSize: 11.5, fontWeight: active ? 700 : 500,
                                            color: active ? RED : done ? '#4caf50' : '#bbb', mt: .5
                                        }
                                    }}
                                >{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                {/* Progress rail */}
                <Box sx={{ display: 'flex', mb: 4, mt: 1.5, px: .5 }}>
                    {STEPS.map((_, i) => (
                        <Box key={i} sx={{
                            flex: 1, height: 3, borderRadius: 4,
                            background: i < step ? '#4caf50' : i === step ? RED : '#eef0f8',
                            mx: .3, transition: 'background .3s'
                        }} />
                    ))}
                </Box>

                {/* Step header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#1a1a2e', fontSize: 17 }}>
                        {['Personal Information', 'Business Details', 'Location', 'Choose Your Plan', 'Media & Documents', 'Review & Submit'][step]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: .3, fontSize: 13 }}>
                        {['Tell us about yourself and your service category', 'Provide your business details', 'Where is your business located?', 'Select the best plan for your needs', 'Upload your business media and documents', 'Review everything before submitting'][step]}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3.5, borderColor: '#f0f2f8' }} />

                {/* Content */}
                <Box sx={{ minHeight: 280 }}>{content[step]}</Box>

                {/* Nav */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 3, borderTop: '1px solid #f0f2f8' }}>
                    <SBtn variant="outlined" onClick={() => setStep(s => s - 1)} disabled={step === 0}>← Back</SBtn>
                    <Box sx={{ display: 'flex', gap: .7 }}>
                        {STEPS.map((_, i) => (
                            <Box key={i} sx={{
                                width: step === i ? 22 : 7, height: 7, borderRadius: 4,
                                background: step === i ? RED : step > i ? '#4caf50' : '#e0e5f0', transition: 'all .3s'
                            }} />
                        ))}
                    </Box>
                    {step < STEPS.length - 1
                        ? <PBtn onClick={next}>Continue →</PBtn>
                        : <PBtn onClick={submit} disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : null}>
                            {loading ? 'Submitting…' : '🎉 Submit Registration'}
                        </PBtn>
                    }
                </Box>

                <Box sx={{ textAlign: 'center', mt: 2.5 }}>
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Typography component={Link} to="/pages/login"
                            sx={{ color: RED, fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            Sign In
                        </Typography>
                    </Typography>
                </Box>
            </Card>
        </PageWrap>
    );
}
