import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// project imports
import chartData from './chartdata/area-chart';

// ===========================|| VEHICLE AREA CHART CARD ||=========================== //

export default function VehicleAreaChartCard({ totalRevenue = 0 }) {
  // Coral-red theme
  const coralMain = '#dd666eff';
  const coralDark = '#A33A43';
  const coralLight = '#FF8A92';

  const [config, setConfig] = useState(chartData);

  useEffect(() => {
    setConfig((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        colors: [coralMain],
        tooltip: { ...prevState?.options?.tooltip, theme: 'light' },
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
        boxShadow: `0 4px 12px rgba(225, 91, 101, 0.3)`,
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                Vehicles
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                ₹{Number(totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Chart {...config} />
    </Card>
  );
}

VehicleAreaChartCard.propTypes = {
  totalRevenue: PropTypes.number
};
