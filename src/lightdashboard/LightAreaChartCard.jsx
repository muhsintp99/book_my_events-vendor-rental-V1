import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// ===========================|| LIGHT AREA CHART CARD ||=========================== //

export default function LightAreaChartCard({
    title = 'Packages',
    amount = 0,
    chartConfig,
    height = 160
}) {
    const theme = useTheme();

    // Red theme colors for Light dashboard (same as Mehandi)
    const coralMain = '#dd666eff';
    const coralDark = '#A33A43';
    const coralLight = '#FF8A92';

    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (!chartConfig) return;

        setConfig({
            ...chartConfig,
            options: {
                ...chartConfig.options,
                colors: [coralMain],
                tooltip: {
                    ...chartConfig.options?.tooltip,
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
        });
    }, [chartConfig]);

    return (
        <Card
            sx={{
                bgcolor: coralLight,
                border: `1px solid ${coralMain}`,
                boxShadow: `0 4px 12px rgba(225, 91, 101, 0.3)`,
                borderRadius: 3
            }}
        >
            {/* ================= HEADER ================= */}
            <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
                <Grid size={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
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
            {config ? (
                <Chart {...config} height={height} />
            ) : (
                <Typography
                    variant="subtitle2"
                    sx={{ textAlign: 'center', py: 4, color: '#fff' }}
                >
                    No chart data
                </Typography>
            )}
        </Card>
    );
}

LightAreaChartCard.propTypes = {
    title: PropTypes.string,
    amount: PropTypes.number,
    height: PropTypes.number,
    chartConfig: PropTypes.shape({
        series: PropTypes.array,
        options: PropTypes.object
    })
};
