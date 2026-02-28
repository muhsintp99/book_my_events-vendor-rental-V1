const chartData = {
    type: 'line',
    height: 90,
    options: {
        chart: {
            id: 'Panthal-revenue-chart',
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
            data: [45, 66, 41, 89, 25, 44, 9, 54]
        }
    ]
};

export default chartData;

