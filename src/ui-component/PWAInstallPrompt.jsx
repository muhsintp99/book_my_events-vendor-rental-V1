import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Slide } from '@mui/material';
import { IconX, IconDownload, IconSquareRoundedPlus } from '@tabler/icons-react';

const IOSShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z"/>
  </svg>
);

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    setIsIOS(checkIOS);
    setIsStandalone(checkStandalone);

    const dismissed = localStorage.getItem('pwaInstallDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    if (checkStandalone || (dismissed && daysSinceDismissed < 3)) {
      return;
    }

    if (checkIOS && !checkStandalone) {
      setTimeout(() => setShowBanner(true), 2000);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) return;
    if (!deferredPrompt) return;

    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  if (isStandalone || !showBanner) return null;

  return (
    <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          p: 2,
          pb: { xs: 3, sm: 2 }
        }}
      >
        <Box
          sx={{
            maxWidth: 440,
            mx: 'auto',
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.12), 0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.100'
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 4,
              bgcolor: 'grey.300',
              borderRadius: 2,
              mx: 'auto',
              mt: 1.5
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1.5, gap: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2.5,
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid',
                borderColor: 'grey.200',
                overflow: 'hidden'
              }}
            >
              <img
                src="/book.png"
                alt="Book My Events"
                style={{
                  width: 44,
                  height: 'auto',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.src = '/favicon.svg';
                  e.target.style.width = '30px';
                  e.target.style.height = '30px';
                }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'grey.900', lineHeight: 1.3 }}>
                Install Vendor Panel
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.500', fontSize: '0.8rem', mt: 0.2 }}>
                {isIOS ? 'Add to your home screen for quick access' : 'Quick access & works offline'}
              </Typography>
            </Box>

            <IconButton
              onClick={handleDismiss}
              size="small"
              sx={{ color: 'grey.400', '&:hover': { color: 'grey.600' } }}
            >
              <IconX size={18} />
            </IconButton>
          </Box>

          {isIOS ? (
            <Box sx={{ px: 2, pb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 1,
                  mb: 1.5
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <IOSShareIcon />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: 'grey.700', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}
                  >
                    1. Tap Share
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'grey.400'
                  }}
                >
                  →
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <IconSquareRoundedPlus size={22} />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: 'grey.700', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}
                  >
                    2. Add to Home
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleDismiss}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'grey.600',
                  borderColor: 'grey.300',
                  '&:hover': { bgcolor: 'grey.50', borderColor: 'grey.400' }
                }}
              >
                Maybe later
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, px: 2, pb: 2 }}>
              <Button
                variant="text"
                onClick={handleDismiss}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'grey.600',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Not now
              </Button>
              <Button
                variant="contained"
                onClick={handleInstallClick}
                disabled={installing}
                startIcon={<IconDownload size={18} />}
                sx={{
                  flex: 1.5,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                  }
                }}
              >
                {installing ? 'Installing...' : 'Install'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Slide>
  );
};

export default PWAInstallPrompt;
