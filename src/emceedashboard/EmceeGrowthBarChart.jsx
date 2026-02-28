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

// base chart config
import barChartOptions from './chartdata/emcee-growth-barchart';

/* ================= DEFAULT FILTERS ================= */
const defaultFilters = [
    { value: 'today', label: 'Today' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
];

export default function EmceeGrowthBarChart({
    isLoading = false,
    title = 'Total Growth',
    totalAmount = 0,
    filters = defaultFilters,
    series = [],
    height = 480
}) {
    const theme = useTheme();
    const [value, setValue] = useState(filters[0]?.value || '');
    const [chartOptions, setChartOptions] = useState(barChartOptions);

    const textPrimary = theme.palette.text.primary;
    const divider = theme.palette.divider;
    const grey500 = theme.palette.grey[500];

    useEffect(() => {
        setChartOptions((prev) => ({
            ...prev,
            colors: ['#C2444E', '#F09898', '#ff7f87ff', '#FCE9E9'],
            xaxis: {
                ...prev.xaxis,
                labels: { style: { colors: textPrimary } }
            },
            yaxis: {
                labels: { style: { colors: textPrimary } }
            },
            grid: {
                ...prev.grid,
                borderColor: divider
            },
            tooltip: { theme: 'light' },
            legend: {
                ...prev.legend,
                labels: { colors: grey500 }
            }
        }));
    }, [theme, textPrimary, divider, grey500]);

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
                                    <Typography variant="subtitle2">{title}</Typography>
                                    <Typography variant="h3">
                                        ₹{totalAmount.toLocaleString()}
                                    </Typography>
                                </Grid>

                                <Grid>
                                    <TextField
                                        select
                                        size="small"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {filters.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
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
                                '& .apexcharts-menu': {
                                    bgcolor: 'background.paper'
                                },
                                '.apexcharts-theme-light .apexcharts-menu-item:hover': {
                                    bgcolor: 'grey.200'
                                },
                                '& .apexcharts-theme-light svg': {
                                    fill: theme.palette.grey[400]
                                }
                            }}
                        >
                            {series.length === 0 ? (
                                <Typography
                                    variant="subtitle2"
                                    sx={{ textAlign: 'center', py: 6 }}
                                >
                                    No growth data available
                                </Typography>
                            ) : (
                                <Chart
                                    options={chartOptions}
                                    series={series}
                                    type="bar"
                                    height={height}
                                />
                            )}
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
}

EmceeGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    totalAmount: PropTypes.number,
    height: PropTypes.number,
    filters: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
        })
    ),
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            data: PropTypes.arrayOf(PropTypes.number)
        })
    )
};
