import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

// chart data
import ChartDataMonth from '../vehicledashboard/chartdata/Vehicle-Rent-MonthlineChart';
import ChartDataYear from '../vehicledashboard/chartdata/Vehicle-rent-YearlineChart';

const formatCurrency = (val) =>
  `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ==============================|| VENUE TOTAL BOOKINGS CHART ||============================== //

export default function VenueTotalBookingsChart({
  isLoading,
  monthValue = 0,
  yearValue = 0,
  monthOrders = 0,
  yearOrders = 0
}) {
  const theme = useTheme();
  const [isMonth, setIsMonth] = React.useState(true);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            background: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            height: 190,
            boxShadow: '0 8px 32px 0 rgba(214, 48, 49, 0.3)',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              top: -85,
              right: -95,
              zIndex: 1
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              top: -125,
              right: -15,
              zIndex: 1
            }
          }}
        >
          <Box sx={{ p: 2.25, position: 'relative', zIndex: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff'
                  }}
                >
                  <LocalMallOutlinedIcon fontSize="inherit" />
                </Avatar>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant={isMonth ? 'contained' : 'text'}
                    sx={{ color: '#fff', bgcolor: isMonth ? 'rgba(255, 255, 255, 0.2)' : 'transparent', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}
                    onClick={() => setIsMonth(true)}
                  >
                    Month
                  </Button>
                  <Button
                    size="small"
                    variant={!isMonth ? 'contained' : 'text'}
                    sx={{ color: '#fff', bgcolor: !isMonth ? 'rgba(255, 255, 255, 0.2)' : 'transparent', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}
                    onClick={() => setIsMonth(false)}
                  >
                    Year
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Stack spacing={0.5} sx={{ minWidth: 150 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      sx={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      {isMonth ? formatCurrency(monthValue) : formatCurrency(yearValue)}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Bookings: {isMonth ? monthOrders : yearOrders}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    flexGrow: 1,
                    height: 80,
                    '& .apexcharts-tooltip.apexcharts-theme-light': {
                      color: theme.palette.text.primary,
                      background: theme.palette.background.default
                    }
                  }}
                >
                  {isMonth ? <Chart {...ChartDataMonth} height={80} /> : <Chart {...ChartDataYear} height={80} />}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </MainCard>
      )}
    </>
  );
}

VenueTotalBookingsChart.propTypes = {
  isLoading: PropTypes.bool,
  monthValue: PropTypes.number,
  yearValue: PropTypes.number,
  monthOrders: PropTypes.number,
  yearOrders: PropTypes.number
};
