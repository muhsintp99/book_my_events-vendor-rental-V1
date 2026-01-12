import { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { keyframes } from '@mui/system';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarsIcon from '@mui/icons-material/Stars';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function WelcomeBanner() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [upgrade, setUpgrade] = useState(() => JSON.parse(localStorage.getItem('upgrade')));
  const [kycStatus, setKycStatus] = useState(user?.kycStatus);
  const isSubscribed = upgrade?.isSubscribed === true && upgrade?.status === 'active';

  // Poll localStorage for KYC status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUpgrade = JSON.parse(localStorage.getItem('upgrade'));

      if (updatedUser?.kycStatus !== kycStatus) {
        setUser(updatedUser);
        setKycStatus(updatedUser?.kycStatus);
      }

      if (JSON.stringify(updatedUpgrade) !== JSON.stringify(upgrade)) {
        setUpgrade(updatedUpgrade);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [kycStatus, upgrade]);


  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' },
        gap: 3,
        mb: 4,
        animation: `${fadeSlide} 0.6s ease-out`
      }}
    >
      {/* ================= LEFT : WELCOME BANNER ================= */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #c63b4a 0%, #e11d48 45%, #fb7185 100%)',
          borderRadius: 3,
          px: { xs: 3, md: 4 },
          py: { xs: 2.5, md: 3 },
          minHeight: 135,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 14px 35px rgba(225, 29, 72, 0.35)',
          transition: '0.3s ease',

          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 22px 45px rgba(225, 29, 72, 0.45)'
          }
        }}
      >
        {/* Decorative circle */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)'
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '1.45rem', md: '1.9rem' },
              fontWeight: 800,
              mb: 0.5,
              letterSpacing: '-0.4px'
            }}
          >
            {kycStatus === 'pending' ? '' : 'Welcome aboard! 🎉'}
          </Typography>

          <Typography
            sx={{
              fontSize: '0.95rem',
              opacity: 0.95,
              maxWidth: 520,
              lineHeight: 1.5
            }}
          >
            {kycStatus === 'pending' ? (
              'Thank you for registering. Your profile is under verification and will be approved after successful KYC updation.'
            ) : (
              <>
                Thanks for registering with us. Your profile is currently under verification and will be approved within <strong> 48 hours</strong>.
                Meanwhile, feel free to add your packages and complete your profile to get ready for bookings.
              </>
            )}
          </Typography>
        </Box>
      </Box>

      {/* ================= RIGHT : SUBSCRIPTION CARD ================= */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: isSubscribed
            ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            : '#fff',
          borderRadius: 3,
          px: 3,
          py: 2.5,
          minHeight: 135,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: isSubscribed ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #e2e8f0',
          boxShadow: isSubscribed
            ? '0 10px 25px rgba(245, 158, 11, 0.15)'
            : '0 10px 26px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease-in-out',

          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isSubscribed
              ? '0 18px 35px rgba(245, 158, 11, 0.2)'
              : '0 16px 34px rgba(0,0,0,0.08)',
            borderColor: isSubscribed ? '#f59e0b' : '#cbd5e1'
          }
        }}
      >
        {/* Subtle decorative background icon for Pro */}
        {isSubscribed && (
          <StarsIcon
            sx={{
              position: 'absolute',
              right: -10,
              bottom: -10,
              fontSize: 80,
              color: 'rgba(245, 158, 11, 0.05)',
              transform: 'rotate(-15deg)'
            }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: isSubscribed ? 'rgba(245, 158, 11, 0.1)' : 'rgba(225, 29, 72, 0.08)',
              color: isSubscribed ? '#f59e0b' : '#e11d48'
            }}
          >
            {isSubscribed ? (
              <StarsIcon sx={{ fontSize: 24 }} />
            ) : (
              <WorkspacePremiumIcon sx={{ fontSize: 24 }} />
            )}
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1.05rem',
                color: '#1e293b',
                lineHeight: 1.2
              }}
            >
              {isSubscribed ? 'Vendor Pro' : 'Subscription'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                display: 'block',
                mt: 0.2
              }}
            >
              {isSubscribed ? 'Premium Access' : 'Standard Member'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={isSubscribed ? 'Active Account' : 'Upgrade Now'}
            size="small"
            icon={isSubscribed ? <CheckCircleIcon style={{ color: 'inherit', fontSize: 16 }} /> : undefined}
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 26,
              background: isSubscribed ? '#16a34a' : '#f1f5f9',
              color: isSubscribed ? '#fff' : '#475569',
              border: 'none',
              px: 0.5,
              '& .MuiChip-icon': { color: '#fff' }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

