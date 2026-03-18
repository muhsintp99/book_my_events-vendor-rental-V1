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
  `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

// ==============================|| CATERING TOTAL ORDERS CARD ||============================== //

export default function CateringOrderchart({
  isLoading,
  totalOrders = 0,
  totalEarnings = 0,
  monthValue = 0,
  yearValue = 0,
  monthlyOrders = 0,
  yearlyOrders = 0
}) {
  const theme = useTheme();
  const [isMonth, setIsMonth] = React.useState(true);

  // Use lifetime totals if the filtered ones are 0, or just show the filtered ones as secondary details
  const displayEarnings = isMonth ? (monthValue || 0) : (yearValue || 0);

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
                <Stack spacing={0.5} sx={{ minWidth: 140 }}>
                  <Typography
                    sx={{
                      fontSize: '2.125rem',
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {totalOrders}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    TOTAL ORDERS
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    Earnings: {displayEarnings > 0 ? formatCurrency(displayEarnings) : formatCurrency(totalEarnings)}
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

CateringOrderchart.propTypes = {
  isLoading: PropTypes.bool,
  totalOrders: PropTypes.number,
  totalEarnings: PropTypes.number,
  monthValue: PropTypes.number,
  yearValue: PropTypes.number,
  monthlyOrders: PropTypes.number,
  yearlyOrders: PropTypes.number
};
