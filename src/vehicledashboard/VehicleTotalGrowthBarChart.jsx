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
import barChartOptions from './chartdata/vehicle-growth-barchart';

const periods = [
  { value: 'year', label: 'This Year' },
  { value: 'month', label: 'This Month' },
  { value: 'today', label: 'Today' }
];

export default function VehicleTotalGrowthBarChart({ 
  isLoading, 
  monthlyGrowth = [], 
  monthlyIncomeGrowth = [], 
  totalEarnings = 0 
}) {
  const theme = useTheme();
  const { fontFamily } = useConfig();
  const [period, setPeriod] = useState('year');
  const [chartOptions, setChartOptions] = useState(barChartOptions);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const currentMonthIdx = now.getMonth();

  // Filter Data based on selected period
  const chartData = useMemo(() => {
    if (period === 'month') {
      return {
        series: [
          {
            name: 'Revenue (₹)',
            data: [monthlyIncomeGrowth[currentMonthIdx] || 0]
          },
          {
            name: 'Rentals',
            data: [monthlyGrowth[currentMonthIdx] || 0]
          }
        ],
        categories: [months[currentMonthIdx]]
      };
    }
    if (period === 'today') {
      return {
        series: [
          {
            name: 'Revenue (₹)',
            data: [monthlyIncomeGrowth[currentMonthIdx] || 0] // Actually would be daily but using month for now
          },
          {
            name: 'Rentals',
            data: [monthlyGrowth[currentMonthIdx] || 0]
          }
        ],
        categories: ['Today']
      };
    }
    // Default: Year
    return {
      series: [
        {
          name: 'Revenue (₹)',
          data: monthlyIncomeGrowth.length ? monthlyIncomeGrowth : new Array(12).fill(0)
        },
        {
          name: 'Rentals',
          data: monthlyGrowth.length ? monthlyGrowth : new Array(12).fill(0)
        }
      ],
      categories: months
    };
  }, [period, monthlyIncomeGrowth, monthlyGrowth, currentMonthIdx]);

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
      colors: ['#C2444E', '#E15B65'],
      xaxis: { 
        ...prev.xaxis, 
        categories: chartData.categories, // DYNAMIC CATEGORIES
        labels: { style: { colors: textPrimary, fontWeight: 600 } } 
      },
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
  }, [fontFamily, textPrimary, divider, theme, chartData.categories]);

  const displayTotal = useMemo(() => {
    if (period === 'today' || period === 'month') {
      return monthlyIncomeGrowth[currentMonthIdx] || 0;
    }
    return totalEarnings;
  }, [period, monthlyIncomeGrowth, totalEarnings, currentMonthIdx]);

  const growthPercentage = useMemo(() => {
    if (currentMonthIdx === 0) return 0;
    const lastMonthIncome = monthlyIncomeGrowth[currentMonthIdx - 1] || 0;
    const currentMonthIncome = monthlyIncomeGrowth[currentMonthIdx] || 0;
    if (lastMonthIncome === 0) return currentMonthIncome > 0 ? 100 : 0;
    return (((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1);
  }, [monthlyIncomeGrowth, currentMonthIdx]);

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
                <Typography variant="subtitle2" color="textSecondary">Total Growth</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h3">
                        ₹{Number(displayTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    {(period === 'year' || period === 'month') && growthPercentage !== 0 && (
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
              <TextField select value={period} onChange={(e) => setPeriod(e.target.value)} size="small">
                {periods.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            
            <Box sx={{ position: 'relative', pt: 1 }}>
              {hasData ? (
                <Chart options={chartOptions} series={chartData.series} type="bar" height={420} />
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
                  <Typography variant="body2" color="grey.400">Your performance for this period will appear here</Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

VehicleTotalGrowthBarChart.propTypes = { 
  isLoading: PropTypes.bool,
  monthlyGrowth: PropTypes.array,
  monthlyIncomeGrowth: PropTypes.array,
  totalEarnings: PropTypes.number
};
