import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
// import NotificationSection from './NotificationSection';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// icons
import { IconMenu2, IconMapPin } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // navigate Demo Modules
  const handleDemoModulesClick = () => {
    navigate('/modulepage'); // update route if needed
  };

  // navigate Venue
  const handleVenueClick = () => {
    navigate('/venuepage'); // update route if needed
  };

  return (
    <>
      {/* Logo & toggler */}
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex', alignItems: 'center' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            bgcolor: '#db787fff',
            color: 'white',
            '&:hover': { bgcolor: '#E15B65', color: 'white' },
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Buttons + Notification + Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Demo Modules Button */}
        {/* <Button
          variant="contained"
          size="large"
          sx={{
            textTransform: 'none',
            borderRadius: '50px',
            px: 3,
            py: 1.5,
            fontSize: '1rem'
          }}
          onClick={handleDemoModulesClick}
        >
          Demo Modules
        </Button> */}

        {/* Venue Button */}
        {/* <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            textTransform: 'none',
            borderRadius: '50px',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          onClick={handleVenueClick}
        >
          <IconMapPin size={20} />
          Venue
        </Button> */}

        {/* Notifications + Profile */}
        {/* <NotificationSection /> */}
        <ProfileSection />
      </Box>
    </>
  );
}
