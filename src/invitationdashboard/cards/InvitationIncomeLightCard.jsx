import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  background: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)',
  color: '#fff',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ==============================|| INVITATION TOTAL INCOME LIGHT CARD ||============================== //

export default function InvitationIncomeLightCard({ isLoading, total = 0, label = 'Total Earnings Balance' }) {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: '#8d1e27ff',
                      color: '#fff'
                    }}
                  >
                    <StorefrontTwoToneIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45,
                    ml: 1
                  }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                      ₹{Number(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="subtitle2" sx={{ color: 'white', mt: 0.25, fontWeight: 600 }}>
                      {label}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
}

InvitationIncomeLightCard.propTypes = {
  isLoading: PropTypes.bool,
  total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string
};
