import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| INVITATION AREA CHART CARD ||============================== //

export default function InvitationAreaChartCard({ totalRevenue }) {
  const theme = useTheme();

  const chartData = {
    type: 'area',
    height: 120,
    options: {
      chart: {
        id: 'invitation-support-chart',
        sparkline: { enabled: true }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.0,
          stops: [0, 90, 100]
        }
      },
      colors: ['#E15B65'], // Coral Red
      tooltip: {
        theme: 'light',
        fixed: { enabled: false },
        x: { show: false },
        y: {
          title: { formatter: () => 'Revenue ₹' }
        },
        marker: { show: false }
      }
    },
    series: [
      {
        name: 'Revenue',
        data: [0, 15, 10, 50, 30, 40, 25, 60] // Decorative Sparkline
      }
    ]
  };

  return (
    <MainCard
      sx={{
        bgcolor: '#FFF5F5',
        boxShadow: '0 8px 24px rgba(239, 83, 80, 0.08)',
        border: '1px solid rgba(239, 83, 80, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        mb: 2 // Margin bottom to space it from the list
      }}
      content={false}
    >
      <Box sx={{ p: 3, pb: 0, position: 'relative', zIndex: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#D63031' }}>
          ₹{Number(totalRevenue || 0).toLocaleString('en-IN')}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#E15B65', mt: 0.5 }}>
          Total Invitation Revenue
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Chart {...chartData} />
      </Box>
    </MainCard>
  );
}

InvitationAreaChartCard.propTypes = { totalRevenue: PropTypes.number };
