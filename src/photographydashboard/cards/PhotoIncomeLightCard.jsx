import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme, styled } from '@mui/material/styles';
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

/* ================= STYLED CARD ================= */
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(
      210.04deg,
      ${theme.palette.warning.dark} -50.94%,
      rgba(144, 202, 249, 0) 83.49%
    )`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(
      140.9deg,
      ${theme.palette.warning.dark} -14.02%,
      rgba(144, 202, 249, 0) 70.5%
    )`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

/* ================= COMPONENT ================= */
export default function TotalIncomeLightCard({
  isLoading = false,
  total = 0,
  label = 'Total Income',
  icon,
  variant = 'warning' // 'warning' | 'error' | 'success' | 'primary'
}) {
  const theme = useTheme();

  const palette = theme.palette[variant] || theme.palette.warning;

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: alpha(palette.light, 0.25),
                      color: palette.dark
                    }}
                  >
                    {icon}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography variant="h4">
                      ₹{total.toLocaleString()}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{ color: 'grey.500', mt: 0.5 }}
                    >
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

/* ================= PROPS ================= */
TotalIncomeLightCard.propTypes = {
  isLoading: PropTypes.bool,
  total: PropTypes.number,
  label: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['warning', 'error', 'success', 'primary'])
};
