// ==============================|| DASHBOARD - FLORIST AREA CHART ||============================== //

const chartData = {
    type: 'area',
    height: 95,
    options: {
        chart: {
            id: 'florist-support-chart-2',
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 1
        },
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: (seriesName) => 'Bookings '
                }
            },
            marker: {
                show: false
            }
        }
    },
    series: [
        {
            data: [0, 15, 10, 50, 30, 40, 25]
        }
    ]
};

export default chartData;
