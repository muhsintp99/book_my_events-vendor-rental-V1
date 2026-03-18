import { useEffect, useState } from 'react';

// material-ui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// Inlined Chart Data to prevent missing imports
const chartData = {
  type: 'area',
  height: 95,
  options: {
    chart: { 
      id: 'support-chart', 
      sparkline: { enabled: true } 
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    tooltip: {
      fixed: { enabled: false },
      x: { show: false },
      y: { title: { formatter: () => 'Revenue: ' } },
      marker: { show: false }
    }
  },
  series: [{
    name: 'Packages',
    data: [10, 45, 20, 70, 40, 60, 20, 80, 50, 96, 60, 40]
  }]
};

// ===========================|| CAKE AREA CHART CARD ||=========================== //

export default function CakeAreaChartCard({ totalRevenue = 0 }) {
  // Custom coral-red color theme matching makeup
  const coralMain = '#dd666eff';
  const coralDark = '#A33A43';
  const coralLight = '#FF8A92';

  const [chartConfig, setChartConfig] = useState(chartData);

  useEffect(() => {
    setChartConfig((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        colors: [coralMain],
        tooltip: { ...prevState?.options?.tooltip, theme: 'light' },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.8,
            opacityTo: 0.1,
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
        borderRadius: 3
      }}
    >
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                Packages
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                ₹{Number(totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Chart {...chartConfig} />
    </Card>
  );
}
