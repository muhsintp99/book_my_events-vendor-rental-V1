import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// project imports
import defaultChartData from './chartdata/arechart';

export default function VehicleAreaChartCard({
  title = 'Packages',
  amount = 0,
  chartData = defaultChartData
}) {
  // Coral-red theme
  const coralMain = '#DD666E';
  const coralDark = '#A33A43';
  const coralLight = '#FF8A92';

  const [chartConfig, setChartConfig] = useState(chartData);

  useEffect(() => {
    setChartConfig((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        colors: [coralMain],
        tooltip: {
          ...prev?.options?.tooltip,
          theme: 'light'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100],
            colorStops: [
              { offset: 0, color: coralLight, opacity: 0.8 },
              { offset: 50, color: coralMain, opacity: 0.6 },
              { offset: 100, color: coralDark, opacity: 0.3 }
            ]
          }
        }
      }
    }));
  }, []);

  return (
    <Card
      sx={{
        bgcolor: coralLight,
        border: `1px solid ${coralMain}`,
        boxShadow: '0 4px 12px rgba(225, 91, 101, 0.3)',
        borderRadius: 3
      }}
    >
      {/* ================= HEADER ================= */}
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ₹{amount.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* ================= CHART ================= */}
      <Chart {...chartConfig} />
    </Card>
  );
}

VehicleAreaChartCard.propTypes = {
  title: PropTypes.string,
  amount: PropTypes.number,
  chartData: PropTypes.object
};
