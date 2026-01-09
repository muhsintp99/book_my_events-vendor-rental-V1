import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { keyframes } from '@mui/system';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

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

export default function WelcomeBanner({ hasSubscription = false }) {
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
          background:
            'linear-gradient(135deg, #c63b4a 0%, #e11d48 45%, #fb7185 100%)',
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
            Welcome aboard! 🎉
          </Typography>

          <Typography
            sx={{
              fontSize: '0.95rem',
              opacity: 0.95,
              maxWidth: 520,
              lineHeight: 1.5
            }}
          >
Thanks for registering with us. Your profile is currently under verification and will be approved within <strong> 48 hours</strong>.  
Meanwhile, feel free to add your packages and complete your profile to get ready for bookings.           
            Sit back while we prepare everything for you.
          </Typography>
        </Box>
      </Box>

      {/* ================= RIGHT : SUBSCRIPTION BOX ================= */}
      <Box
        sx={{
          background: '#3',
          borderRadius: 3,
          px: 3,
          py: 2.5,
          minHeight: 135,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 10px 26px rgba(0,0,0,0.08)',
          transition: '0.3s ease',

          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 16px 34px rgba(0,0,0,0.12)'
          }
        }}
      >
        <WorkspacePremiumIcon
          sx={{
            fontSize: 34,
            mb: 1,
            color: hasSubscription ? '#16a34a' : '#e11d48'
          }}
        />

        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
          Subscription
        </Typography>

        <Chip
          label={hasSubscription ? 'Active Plan' : 'No Active Plan'}
          color={hasSubscription ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 600, width: 'fit-content' }}
        />
      </Box>
    </Box>
  );
}
