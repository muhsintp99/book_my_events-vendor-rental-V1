import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';

// project imports
import LightEarningCard from './LightEarningCard';
import LightPopularCard from './LightPopularCard';
import LightOrderchart from './LightOrderchart';
import LightGrowthBarChart from './LightGrowthBarChart';
import WelcomeBanner from './WelcomeBanner';

import { gridSpacing } from 'store/constant';

// ==============================|| LIGHT DASHBOARD ||============================== //

const LightDashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const providerId = user?._id;

                if (providerId) {
                    const response = await axios.get(`https://api.bookmyevent.ae/api/light/dashboard/${providerId}`);
                    if (response.data.success) {
                        setDashboardData(response.data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching light dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <WelcomeBanner isLoading={isLoading} />
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <LightEarningCard isLoading={isLoading} data={dashboardData?.earning} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <LightOrderchart isLoading={isLoading} data={dashboardData?.orders} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                {/* You can add more cards here */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <LightGrowthBarChart isLoading={isLoading} data={dashboardData?.growth} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <LightPopularCard isLoading={isLoading} data={dashboardData?.popularPackages} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LightDashboard;
