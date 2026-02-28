const chartData = {
    type: 'line',
    height: 90,
    options: {
        chart: {
            id: 'Eventpro-revenue-chart-year',
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        tooltip: {
            theme: 'light',
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: 'Total '
            },
            marker: {
                show: false
            }
        }
    },
    series: [
        {
            name: 'Orders',
            data: [35, 44, 9, 54, 45, 66, 41, 69]
        }
    ]
};

export default chartData;

