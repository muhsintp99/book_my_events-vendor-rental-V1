import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// ==============================|| PHOTOGRAPHY AREA CHART CARD ||============================== //

export default function PhotographyAreaChartCard({
  title = 'Packages',
  amount = 0,
  chartConfig,
  height = 140
}) {
  const [config, setConfig] = useState(null);

  // Default chart config
  const defaultChartConfig = {
    type: 'area',
    series: [{
      name: 'Revenue',
      data: [31, 40, 28, 51, 42, 109, 100, 85, 92, 70, 60, 40]
    }],
    options: {
      chart: {
        id: 'photo-area-chart',
        sparkline: { enabled: true }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 }
    }
  };

  useEffect(() => {
    const activeConfig = chartConfig || defaultChartConfig;

    setConfig({
      ...activeConfig,
      options: {
        ...activeConfig.options,
        colors: ['#fff'],
        chart: {
            ...activeConfig.options?.chart,
            sparkline: { enabled: true }
        },
        tooltip: {
          ...activeConfig.options?.tooltip,
          theme: 'light'
        },
        stroke: {
            curve: 'smooth',
            width: 3,
            colors: ['rgba(255, 255, 255, 0.8)']
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 95, 100],
            colorStops: [
              { offset: 0, color: '#fff', opacity: 0.6 },
              { offset: 100, color: '#fff', opacity: 0.1 }
            ]
          }
        }
      }
    });
  }, [chartConfig]);

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)',
        border: 'none',
        boxShadow: '0 8px 32px 0 rgba(214, 48, 49, 0.3)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, color: '#fff', position: 'relative', zIndex: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            ₹{Number(amount || 0).toLocaleString('en-IN')}
          </Typography>
        </Stack>
      </Box>

      {config ? (
        <Box sx={{ mt: -2, position: 'relative', zIndex: 1, '& .apexcharts-canvas': { filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' } }}>
            <Chart {...config} height={height} />
        </Box>
      ) : (
        <Box sx={{ height: height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>No statistics</Typography>
        </Box>
      )}
    </Card>
  );
}

PhotographyAreaChartCard.propTypes = {
  title: PropTypes.string,
  amount: PropTypes.number,
  height: PropTypes.number,
  chartConfig: PropTypes.object
};
