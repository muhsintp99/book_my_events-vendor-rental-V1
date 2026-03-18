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
import ChartDataMonth from './cards/chartdata/boutique-ordermonthline-chart';
import ChartDataYear from './cards/chartdata/boutique-orderyear-linechart';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function BoutiqueOrderChart({ isLoading, monthValue = 0, yearValue = 0, trend = 'down' }) {
  const theme = useTheme();
  const [isMonth, setIsMonth] = React.useState(true);

  const TrendIcon = trend === 'up' ? ArrowUpwardIcon : ArrowDownwardIcon;

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            background: 'linear-gradient(135deg, #AF7AC5 0%, #9B59B6 100%)',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 8px 32px 0 rgba(155, 89, 182, 0.3)',
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
                <Stack spacing={0.5} sx={{ minWidth: 120 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      sx={{
                        fontSize: '2.125rem',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      ₹{(isMonth ? monthValue : yearValue).toLocaleString('en-IN')}
                    </Typography>
                    <Avatar
                        sx={{
                        width: 20,
                        height: 20,
                        bgcolor: trend === 'up' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)',
                        color: '#fff'
                        }}
                    >
                        <TrendIcon sx={{ fontSize: '0.75rem' }} />
                    </Avatar>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Total Orders
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
                  {isMonth ? (
                    <Chart {...ChartDataMonth} height={80} />
                  ) : (
                    <Chart {...ChartDataYear} height={80} />
                  )}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </MainCard>
      )}
    </>
  );
}

BoutiqueOrderChart.propTypes = {
  isLoading: PropTypes.bool,
  monthValue: PropTypes.number,
  yearValue: PropTypes.number,
  trend: PropTypes.oneOf(['up', 'down'])
};

