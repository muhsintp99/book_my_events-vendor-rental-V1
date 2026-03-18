import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
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

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: '#E15B65', // Light coral from transport
    opacity: 0.1,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: '#FF7675', // Lighter red
    opacity: 0.1,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ==============================|| VENUE INCOME LIGHT CARD ||============================== //

export default function VenueIncomeLightCard({ isLoading, total = 0, label, icon }) {
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
                      backgroundColor: 'rgba(225, 91, 101, 0.1)', // Light red tint
                      color: '#E15B65' // Matching coral
                    }}
                  >
                    {icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45,
                    ml: 1 // Padding for alignment
                  }}
                  primary={
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ₹{Number(total).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500], mt: 0.25, fontWeight: 600 }}>
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

VenueIncomeLightCard.propTypes = { 
  isLoading: PropTypes.bool,
  total: PropTypes.number,
  label: PropTypes.string,
  icon: PropTypes.node
};
