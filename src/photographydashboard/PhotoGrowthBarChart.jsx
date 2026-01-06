import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart base options
import baseChartOptions from './chartdata/photogrowth-barchart';

const STATUS_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

export default function TotalGrowthBarChart({
  isLoading = false,
  total = 0,
  series = [],
  onRangeChange
}) {
  const theme = useTheme();
  const [range, setRange] = useState('today');
  const [chartOptions, setChartOptions] = useState(baseChartOptions);

  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      colors: ['#C2444E', '#F09898', '#FF7F87', '#FCE9E9'],
      xaxis: {
        ...prev.xaxis,
        labels: { style: { colors: primary } }
      },
      yaxis: {
        labels: { style: { colors: primary } }
      },
      grid: { ...prev.grid, borderColor: divider },
      tooltip: { theme: 'light' },
      legend: {
        ...prev.legend,
        labels: { ...prev.legend?.labels, colors: grey500 }
      }
    }));
  }, [theme.palette, primary, divider, grey500]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    onRangeChange?.(e.target.value);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            {/* ================= HEADER ================= */}
            <Grid xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                  <Typography variant="subtitle2">Total Growth</Typography>
                  <Typography variant="h3">
                    ₹{total.toLocaleString()}
                  </Typography>
                </Grid>

                <TextField
                  select
                  value={range}
                  onChange={handleRangeChange}
                  size="small"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {/* ================= CHART ================= */}
            <Grid
              xs={12}
              sx={{
                ...theme.applyStyles('light', {
                  '& .apexcharts-series:nth-of-type(4) path:hover': {
                    filter: 'brightness(0.95)',
                    transition: 'all 0.3s ease'
                  }
                }),
                '& .apexcharts-menu': { bgcolor: 'background.paper' },
                '.apexcharts-theme-light .apexcharts-menu-item:hover': {
                  bgcolor: 'grey.200'
                },
                '& .apexcharts-theme-light svg:hover': {
                  fill: theme.palette.grey[400]
                }
              }}
            >
              {series.length ? (
                <Chart
                  options={chartOptions}
                  series={series}
                  type="bar"
                  height={480}
                />
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{ textAlign: 'center', py: 8 }}
                >
                  No growth data available
                </Typography>
              )}
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
  total: PropTypes.number,
  series: PropTypes.array,
  onRangeChange: PropTypes.func
};
