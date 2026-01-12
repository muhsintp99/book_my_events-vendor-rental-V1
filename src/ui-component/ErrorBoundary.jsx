import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { IconRefresh, IconAlertTriangle } from '@tabler/icons-react';

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error('App Error:', error);

    // Check if it's a chunk load error
    const isChunkError =
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.stack?.includes('Failed to fetch dynamically imported module') ||
        error?.name === 'TypeError' && error?.message?.includes('import');

    if (isChunkError) {
        // Automatically reload the page once if a chunk error is detected
        // We use session storage to prevent infinite reload loops
        const hasReloaded = sessionStorage.getItem('chunk-error-reloaded');
        if (!hasReloaded) {
            sessionStorage.setItem('chunk-error-reloaded', 'true');
            window.location.reload();
            return null;
        }
    }

    const handleReload = () => {
        sessionStorage.removeItem('chunk-error-reloaded');
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#f4f7fb',
                p: 3
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 6 },
                        textAlign: 'center',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'rgba(225, 91, 101, 0.1)',
                            color: '#E15B65',
                            mx: 'auto',
                            mb: 4
                        }}
                    >
                        <IconAlertTriangle size={48} />
                    </Box>

                    <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                        Oops! Something went wrong
                    </Typography>

                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, fontSize: '1.1rem' }}>
                        {isChunkError
                            ? "A new version of the application is available. We need to refresh the page to apply updates."
                            : "We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists."}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<IconRefresh size={20} />}
                            onClick={handleReload}
                            sx={{
                                bgcolor: '#E15B65',
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                '&:hover': { bgcolor: '#c94a53' }
                            }}
                        >
                            Reload Page
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleGoHome}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderColor: 'divider',
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', borderColor: 'text.secondary' }
                            }}
                        >
                            Go to Home
                        </Button>
                    </Box>

                    {process.env.NODE_ENV === 'development' && (
                        <Box sx={{ mt: 5, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, textAlign: 'left', overflowX: 'auto' }}>
                            <Typography variant="caption" component="pre" sx={{ color: 'text.secondary' }}>
                                {error?.message || 'Unknown error'}
                                {error?.stack}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default ErrorBoundary;
