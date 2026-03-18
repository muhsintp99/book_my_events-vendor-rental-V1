import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import chartData from '../vehicledashboard/chartdata/area-chart';

// ===========================|| VENUE AREA CHART CARD ||=========================== //

const VenueAreaChartCard = ({ title }) => {
  const theme = useTheme();
  const { fontFamily } = useConfig();
  const [config, setConfig] = useState(chartData);

  useEffect(() => {
    const newChartData = {
      ...chartData,
      options: {
        ...chartData.options,
        chart: { ...chartData.options.chart, fontFamily: fontFamily, sparkline: { enabled: true } },
        colors: ['#fff'],
        stroke: { curve: 'smooth', width: 3 },
        tooltip: { theme: 'light', x: { show: false }, marker: { show: false } }
      },
      series: [{ name: 'Revenue', data: [15, 35, 20, 60, 40, 75, 55] }] // Sparkline defaults
    };
    setConfig(newChartData);
  }, [fontFamily]);

  return (
    <Card
      sx={{
        bgcolor: '#FF7675',
        background: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '16px',
        boxShadow: '0 4px 20px 0 rgba(214, 48, 49, 0.25)',
        p: 2
      }}
    >
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, opacity: 0.9 }}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Box sx={{ height: 60 }}>
            {config && config.options && (
              <Chart options={config.options} series={config.series} type="area" height={60} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

VenueAreaChartCard.propTypes = {
  title: PropTypes.string
};

export default VenueAreaChartCard;
