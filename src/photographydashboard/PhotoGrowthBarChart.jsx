import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

// assets
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// third party
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import barChartOptions from './chartdata/photogrowth-barchart';

const status = [
  { value: 'year', label: 'This Year' },
  { value: 'month', label: 'This Month' },
  { value: 'today', label: 'Today' }
];

// ==============================|| PHOTOGRAPHY GROWTH BAR CHART ||============================== //

export default function PhotographyGrowthBarChart({ 
  isLoading, 
  monthlyGrowth = [], 
  monthlyIncomeGrowth = [], 
  totalEarnings = 0 
}) {
  const theme = useTheme();
  const { fontFamily } = useConfig();
  const [value, setValue] = useState('year');
  const [chartOptions, setChartOptions] = useState(barChartOptions);

  // Dynamic Series
  const series = useMemo(() => [
    {
      name: 'Revenue (₹)',
      data: monthlyIncomeGrowth.length ? monthlyIncomeGrowth : new Array(12).fill(0)
    },
    {
      name: 'Bookings',
      data: monthlyGrowth.length ? monthlyGrowth : new Array(12).fill(0)
    }
  ], [monthlyIncomeGrowth, monthlyGrowth]);

  const textPrimary = theme.palette.text.primary;
  const divider = theme.palette.divider;

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      chart: { 
        ...prev.chart, 
        fontFamily: fontFamily,
        stacked: true,
        toolbar: { show: true, tools: { download: true } }
      },
      colors: ['#D63031', '#FF7675'], // Red/Coral theme
      xaxis: { ...prev.xaxis, labels: { style: { colors: textPrimary, fontWeight: 600 } } },
      yaxis: { 
        ...prev.yaxis, 
        labels: { 
            style: { colors: textPrimary, fontWeight: 500 },
            formatter: (val) => {
                if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
                return `₹${val}`;
            }
        } 
      },
      grid: { borderColor: divider, strokeDashArray: 4 },
      tooltip: { theme: 'light', shared: true, intersect: false },
      legend: { ...(prev.legend ?? {}), labels: { ...(prev.legend?.labels ?? {}), colors: textPrimary } }
    }));
  }, [fontFamily, textPrimary, divider]);

  const now = new Date();
  const currentMonth = now.getMonth();
  
  const displayTotal = useMemo(() => {
    if (value === 'today' || value === 'month') {
      return monthlyIncomeGrowth[currentMonth] || 0;
    }
    return totalEarnings;
  }, [value, monthlyIncomeGrowth, totalEarnings, currentMonth]);

  const growthPercentage = useMemo(() => {
    if (currentMonth === 0) return 0;
    const lastMonthIncome = monthlyIncomeGrowth[currentMonth - 1] || 0;
    const currentMonthIncome = monthlyIncomeGrowth[currentMonth] || 0;
    if (lastMonthIncome === 0) return currentMonthIncome > 0 ? 100 : 0;
    return (((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1);
  }, [monthlyIncomeGrowth, currentMonth]);

  const hasData = monthlyGrowth.some(v => v > 0) || monthlyIncomeGrowth.some(v => v > 0);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Stack sx={{ gap: gridSpacing }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2" color="textSecondary">Photography Growth</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        ₹{Number(displayTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    {growthPercentage !== 0 && (
                        <Chip
                            icon={Number(growthPercentage) >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                            label={`${growthPercentage}%`}
                            size="small"
                            color={Number(growthPercentage) >= 0 ? "success" : "error"}
                            variant="outlined"
                            sx={{ fontWeight: 700, borderRadius: '6px' }}
                        />
                    )}
                </Stack>
              </Stack>
              <TextField select value={value} onChange={(e) => setValue(e.target.value)} size="small">
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            
            <Box sx={{ position: 'relative', pt: 1 }}>
              {hasData ? (
                <Chart options={chartOptions} series={series} type="bar" height={420} />
              ) : (
                <Box
                  sx={{
                     height: 350,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'center',
                     border: `1px dashed ${theme.palette.divider}`,
                     borderRadius: 3,
                     bgcolor: 'grey.50',
                     gap: 1
                  }}
                >
                  <Typography variant="h4" color="grey.400">No Statistics Yet</Typography>
                  <Typography variant="body2" color="grey.400">Monthly booking performance will appear here</Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

PhotographyGrowthBarChart.propTypes = { 
  isLoading: PropTypes.bool,
  monthlyGrowth: PropTypes.array,
  monthlyIncomeGrowth: PropTypes.array,
  totalEarnings: PropTypes.number
};
