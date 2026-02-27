import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function LightOrderchart({
    isLoading = false,
    title = 'Total Orders',
    monthValue = 0,
    yearValue = 0,
    monthChart,
    yearChart,
    trend = 'down'
}) {
    const theme = useTheme();
    const [isMonth, setIsMonth] = React.useState(true);

    const TrendIcon = trend === 'up' ? ArrowUpwardIcon : ArrowDownwardIcon;

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: '#673ab7',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        '&>div': { position: 'relative', zIndex: 5 },
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: '#5e35b1',
                            borderRadius: '50%',
                            top: -85,
                            right: -95
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: '#b39ddb',
                            borderRadius: '50%',
                            top: -125,
                            right: -15,
                            opacity: 0.5
                        }
                    }}
                >
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            {/* ================= HEADER ================= */}
                            <Grid container justifyContent="space-between">
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        bgcolor: '#4527a0',
                                        color: '#fff',
                                        mt: 1
                                    }}
                                >
                                    <LocalMallOutlinedIcon fontSize="inherit" />
                                </Avatar>

                                <Grid>
                                    <Button
                                        size="small"
                                        variant={isMonth ? 'contained' : 'text'}
                                        sx={{ color: 'inherit' }}
                                        onClick={() => setIsMonth(true)}
                                    >
                                        Month
                                    </Button>
                                    <Button
                                        size="small"
                                        variant={!isMonth ? 'contained' : 'text'}
                                        sx={{
                                            color: '#4527a0',
                                            backgroundColor: !isMonth ? '#d1c4e9' : 'transparent'
                                        }}
                                        onClick={() => setIsMonth(false)}
                                    >
                                        Year
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* ================= CONTENT ================= */}
                            <Grid sx={{ mt: 1 }}>
                                <Grid container alignItems="center">
                                    {/* LEFT */}
                                    <Grid xs={6}>
                                        <Grid container alignItems="center">
                                            <Typography
                                                sx={{
                                                    fontSize: '2.125rem',
                                                    fontWeight: 500,
                                                    mr: 1,
                                                    mt: 1.75,
                                                    mb: 0.75
                                                }}
                                            >
                                                ₹{(isMonth ? monthValue : yearValue).toLocaleString()}
                                            </Typography>

                                            <Avatar
                                                sx={{
                                                    ...theme.typography.smallAvatar,
                                                    bgcolor: '#ede7f6',
                                                    color: '#5e35b1'
                                                }}
                                            >
                                                <TrendIcon fontSize="inherit" />
                                            </Avatar>

                                            <Grid xs={12}>
                                                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                                    {title}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* RIGHT (CHART) */}
                                    <Grid
                                        xs={6}
                                        sx={{
                                            '.apexcharts-tooltip.apexcharts-theme-light': {
                                                color: theme.palette.text.primary,
                                                background: theme.palette.background.default
                                            }
                                        }}
                                    >
                                        {isMonth && monthChart ? (
                                            <Chart {...monthChart} />
                                        ) : !isMonth && yearChart ? (
                                            <Chart {...yearChart} />
                                        ) : (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ textAlign: 'center', mt: 4 }}
                                            >
                                                No chart data
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
}

LightOrderchart.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    monthValue: PropTypes.number,
    yearValue: PropTypes.number,
    trend: PropTypes.oneOf(['up', 'down']),
    monthChart: PropTypes.object,
    yearChart: PropTypes.object
};
