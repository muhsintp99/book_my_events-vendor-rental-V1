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
import ChartDataMonth from './chartdata/makeup-ordermonthline-chart';
import ChartDataYear from './chartdata/makeup-orderyear-linechart';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const formatCurrency = (val) =>
  `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function TotalOrderLineChartCard({
  isLoading,
  totalOrders = 0,
  monthlyOrders = 0,
  yearlyOrders = 0,
  monthlyEarnings = 0,
  yearlyEarnings = 0
}) {
  const theme = useTheme();

  const [timeValue, setTimeValue] = React.useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

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
                    variant={timeValue ? 'contained' : 'text'}
                    sx={{ color: '#fff', bgcolor: timeValue ? 'rgba(255, 255, 255, 0.2)' : 'transparent', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}
                    onClick={(e) => handleChangeTime(e, true)}
                  >
                    Month
                  </Button>
                  <Button
                    size="small"
                    variant={!timeValue ? 'contained' : 'text'}
                    sx={{ color: '#fff', bgcolor: !timeValue ? 'rgba(255, 255, 255, 0.2)' : 'transparent', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}
                    onClick={(e) => handleChangeTime(e, false)}
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
                      {timeValue ? formatCurrency(monthlyEarnings) : formatCurrency(yearlyEarnings)}
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
                    Orders: {timeValue ? monthlyOrders : yearlyOrders}
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
                  {timeValue ? <Chart {...ChartDataMonth} height={80} /> : <Chart {...ChartDataYear} height={80} />}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </MainCard>
      )}
    </>
  );
}

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool,
  totalOrders: PropTypes.number,
  monthlyOrders: PropTypes.number,
  yearlyOrders: PropTypes.number,
  monthlyEarnings: PropTypes.number,
  yearlyEarnings: PropTypes.number
};

