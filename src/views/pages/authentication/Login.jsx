import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';

// new imports for LogoSection
import { DASHBOARD_PATH } from 'config';
import bookLogo from 'assets/images/book.png';

// ✅ New LogoSection component
function LogoSection() {
  return (
    <Link to={DASHBOARD_PATH} aria-label="theme-logo">
      <img
        src={bookLogo}
        alt="Book Logo"
        style={{ width: 160, height: 50 }}
      />
    </Link>
  );
}

export default function Login() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container direction="column" sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
        <Grid size={12}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Grid sx={{ mb: 3 }}>

                    <LogoSection />
                  </Grid>
                  <Grid size={12}>
                    <Grid container direction={{ xs: 'column-reverse', md: 'row' }} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Grid>
                        <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Typography gutterBottom variant={downMD ? 'h3' : 'h2'} sx={{ color: '#E15B65' }}>
                            Hi, Welcome Back
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={12}>
                    <Grid container direction="column" sx={{ alignItems: 'center' }} size={12}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Don&apos;t have an account?{' '}
                        <Typography
                          component={Link}
                          to="/pages/register"
                          variant="body2"
                          sx={{ color: '#E15B65', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          Register as Vendor
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ px: 3, my: 3 }} size={12}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
}
