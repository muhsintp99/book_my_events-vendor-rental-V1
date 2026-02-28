import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import EventproEarningCard from './EventproEarningCard';
import EventproOrderchart from './EventproOrderchart';
import EventproPopularCard from './EventproPopularCard';
import EventproGrowthBarChart from './EventproGrowthBarChart';
import EventproIncomeDarkCard from './cards/EventproIncomeDarkCard';
import EventproIncomeLightCard from './cards/EventproIncomeLightCard';

import WelcomeBanner from './WelcomeBanner';
import { gridSpacing } from 'store/constant';

import monthChart from './chartdata/Eventpro-ordermonthline-chart';
import yearChart from './chartdata/Eventpro-orderyear-linechart';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| Eventpro DASHBOARD ||============================== //

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>

            {/* ===================== WELCOME BANNER ===================== */}
            <Grid size={12}>
                <WelcomeBanner />
            </Grid>

            {/* ===================== TOP CARDS ===================== */}
            <Grid size={12}>
                <Grid container spacing={gridSpacing}>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <EventproEarningCard isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <EventproOrderchart
                            isLoading={isLoading}
                            monthChart={monthChart}
                            yearChart={yearChart}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <EventproIncomeDarkCard isLoading={isLoading} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <EventproIncomeLightCard
                                    {...{
                                        isLoading,
                                        total: 0.00,
                                        label: 'Total Income',
                                        icon: <StorefrontTwoToneIcon fontSize="inherit" />
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>

            {/* ===================== BOTTOM SECTION ===================== */}
            <Grid size={12}>
                <Grid container spacing={gridSpacing}>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <EventproGrowthBarChart isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <EventproPopularCard isLoading={isLoading} />
                    </Grid>

                </Grid>
            </Grid>

        </Grid>
    );
}

