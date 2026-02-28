export default {
    type: 'area',
    height: 160,
    options: {
        chart: {
            id: 'bouncers-support-chart',
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
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: 'Bookings '
            },
            marker: {
                show: false
            }
        }
    },
    series: [
        {
            data: [0, 0, 0, 0, 0, 0, 0]
        }
    ]
};
