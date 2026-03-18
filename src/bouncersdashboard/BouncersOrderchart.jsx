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

export default function BouncersOrderchart({
  isLoading = false,
  title = 'Total Enquiries',
  monthValue = 0,
  yearValue = 0,
  monthChart,
  yearChart
}) {
  const theme = useTheme();
  const [isMonth, setIsMonth] = React.useState(false);

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
                    Total
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Stack spacing={0.5} sx={{ minWidth: 120 }}>
                  <Typography
                    sx={{
                      fontSize: '2.125rem',
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {(isMonth ? monthValue : yearValue).toLocaleString()}
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
                    {title}
                  </Typography>
                </Stack>

                <Box sx={{ flexGrow: 1, height: 80 }}>
                  {isMonth && monthChart ? (
                    <Chart {...monthChart} />
                  ) : !isMonth && yearChart ? (
                    <Chart {...yearChart} />
                  ) : (
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>No statistics</Typography>
                    </Box>
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

BouncersOrderchart.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  monthValue: PropTypes.number,
  yearValue: PropTypes.number,
  monthChart: PropTypes.object,
  yearChart: PropTypes.object
};
