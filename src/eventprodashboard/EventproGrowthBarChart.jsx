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

const defaultChartOptions = {
    chart: {
      type: 'bar',
      height: 480,
      stacked: true,
      toolbar: { show: true, tools: { download: true } }
    },
    plotOptions: {
      bar: { columnWidth: '45%', borderRadius: 4 }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      show: true
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left'
    }
  };

const status = [
  { value: 'year', label: 'This Year' },
  { value: 'month', label: 'This Month' },
  { value: 'today', label: 'Today' }
];

export default function EventproGrowthBarChart({ 
  isLoading, 
  monthlyGrowthEnquiries = [], 
  totalEnquiries = 0 
}) {
  const theme = useTheme();
  const { fontFamily } = useConfig();
  const [value, setValue] = useState('year');
  const [chartOptions, setChartOptions] = useState(defaultChartOptions);

  const series = useMemo(() => [
    {
      name: 'Enquiries',
      data: monthlyGrowthEnquiries.length ? monthlyGrowthEnquiries : new Array(12).fill(0)
    }
  ], [monthlyGrowthEnquiries]);

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
      colors: ['#D63031'], 
      xaxis: { ...prev.xaxis, labels: { style: { colors: textPrimary, fontWeight: 600 } } },
      yaxis: { 
        ...prev.yaxis, 
        labels: { 
            style: { colors: textPrimary, fontWeight: 500 }
        } 
      },
      grid: { borderColor: divider, strokeDashArray: 4 },
      tooltip: { theme: 'light', shared: true, intersect: false },
      legend: { ...(prev.legend ?? {}), labels: { ...(prev.legend?.labels ?? {}), colors: textPrimary } }
    }));
  }, [fontFamily, textPrimary, divider, theme]);

  const now = new Date();
  const currentMonth = now.getMonth();
  
  const displayTotal = useMemo(() => {
    return totalEnquiries; 
  }, [totalEnquiries]);

  const growthPercentage = useMemo(() => {
    if (currentMonth === 0) return 0;
    const lastMonthEnquiries = monthlyGrowthEnquiries[currentMonth - 1] || 0;
    const currentMonthEnquiries = monthlyGrowthEnquiries[currentMonth] || 0;
    if (lastMonthEnquiries === 0) return currentMonthEnquiries > 0 ? 100 : 0;
    return (((currentMonthEnquiries - lastMonthEnquiries) / lastMonthEnquiries) * 100).toFixed(1);
  }, [monthlyGrowthEnquiries, currentMonth]);

  const hasData = monthlyGrowthEnquiries.some(v => v > 0);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Stack sx={{ gap: gridSpacing }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2" color="textSecondary">Event Pro Enquiry Growth</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {Number(displayTotal).toLocaleString()}
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
                  <Typography variant="h4" color="grey.400">No Enquiry Data Yet</Typography>
                  <Typography variant="body2" color="grey.400">Your monthly performance will appear here</Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

EventproGrowthBarChart.propTypes = { 
  isLoading: PropTypes.bool,
  monthlyGrowthEnquiries: PropTypes.array,
  totalEnquiries: PropTypes.number
};
