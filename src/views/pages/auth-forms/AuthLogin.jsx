import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Box
} from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import usePWAInstall from 'hooks/usePWAInstall';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const { supportsPWA, installPWA } = usePWAInstall();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      /* ================= LOGIN ================= */
      const res = await axios.post(
        "https://api.bookmyevent.ae/api/auth/login",
        { email, password }
      );

      const { token, user, profile } = res.data;

      /* ================= TOKEN ================= */
      if (checked) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      /* ================= USER ================= */
      localStorage.setItem("user", JSON.stringify(user));

      /* ================= MODULE ================= */
      let moduleId = null;
      if (profile?.module?._id) {
        moduleId = profile.module._id;
        localStorage.setItem("moduleId", moduleId);
        localStorage.setItem("logRes", profile.module.title);
      }

      /* ================= SUBSCRIPTION (SOURCE OF TRUTH) ================= */
      if (user?._id && moduleId) {
        try {
          const subRes = await axios.get(
            `https://api.bookmyevent.ae/api/subscription/status/${user._id}?moduleId=${moduleId}`
          );

          const subscription = subRes.data?.subscription;

          if (subscription?.status === "active" && subscription?.isCurrent) {
            const endDate = new Date(subscription.endDate);
            const now = new Date();
            const daysLeft = Math.max(
              0,
              Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
            );

            // ✅ ACTIVE SUBSCRIPTION
            localStorage.setItem(
              "upgrade",
              JSON.stringify({
                isSubscribed: true,
                status: "active",
                plan: subscription.planId,
                module: subscription.moduleId,
                access: {
                  canAccess: true,
                  isExpired: false,
                  daysLeft: daysLeft
                }
              })
            );
          } else {
            // ❌ NO ACTIVE SUBSCRIPTION
            localStorage.setItem(
              "upgrade",
              JSON.stringify({
                isSubscribed: false,
                status: "free",
                access: { canAccess: false }
              })
            );
          }
        } catch (err) {
          console.error("Subscription fetch failed:", err);
          // Set FREE on error
          localStorage.setItem(
            "upgrade",
            JSON.stringify({
              isSubscribed: false,
              status: "free",
              access: { canAccess: false }
            })
          );
        }
      }

      /* ================= REDIRECT ================= */
      window.location.href = "/dashboard/default";

    } catch (err) {
      if (err.response?.data?.status === 'pending' || err.response?.data?.status === 'rejected') {
        const vendorStatus = err.response.data.status;
        const rejectReason = err.response.data.message;
        navigate('/pages/register', { state: { status: vendorStatus, rejectReason } });
        return;
      }

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
        <InputLabel>Email Address</InputLabel>
        <OutlinedInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          required
        />
      </FormControl>

      {error && <FormHelperText error>{error}</FormHelperText>}

      <Grid container justifyContent="space-between" alignItems="center">
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          }
          label="Keep me logged in"
        />
        <Typography
          component={Link}
          to="/forgot-password"
          color="#E15B65"
          sx={{ textDecoration: "none" }}
        >
          Forgot Password?
        </Typography>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ bgcolor: "#E15B65" }}
          >
            Sign In
          </Button>
        </AnimateButton>
      </Box>

      {
        supportsPWA && (
          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={installPWA}
              startIcon={<InstallMobileIcon />}
              sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
            >
              Install App
            </Button>
          </Box>
        )
      }
    </form >
  );
}
