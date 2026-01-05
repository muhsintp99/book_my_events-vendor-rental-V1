import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function WelcomeBanner() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, #c63b4a 0%, #e11d48 45%, #fb7185 100%)',
        borderRadius: 4,
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 5 },
        minHeight: { xs: 170, md: 220 },
        color: '#fff',
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        animation: `${fadeSlide} 0.8s ease-out`,
        transition: 'all 0.4s ease',
        boxShadow: '0 18px 45px rgba(225, 29, 72, 0.35)',

        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 26px 60px rgba(225, 29, 72, 0.45)'
        }
      }}
    >
      {/* Floating background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          filter: 'blur(10px)',
          animation: `${float} 8s ease-in-out infinite`
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: -70,
          left: -70,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(14px)',
          animation: `${float} 10s ease-in-out infinite`
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: '1.9rem', md: '2.7rem' },
            fontWeight: 800,
            letterSpacing: '-0.6px',
            mb: 1
          }}
        >
          Welcome aboard! 🎉
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            opacity: 0.95,
            mb: 0.6
          }}
        >
          Thanks for registering with us.
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            opacity: 0.85,
            maxWidth: 540,
            lineHeight: 1.6
          }}
        >
          Your profile is currently under verification and will be approved within
          <strong> 48 hours</strong>.  
          Sit back while we prepare everything for you.
        </Typography>
      </Box>
    </Box>
  );
}
