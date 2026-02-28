import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import EmceeEarningCard from './EmceeEarningCard';
import EmceeOrderchart from './EmceeOrderchart';
import EmceePopularCard from './EmceePopularCard';
import EmceeGrowthBarChart from './EmceeGrowthBarChart';
import EmceeIncomeDarkCard from './cards/EmceeIncomeDarkCard';
import EmceeIncomeLightCard from './cards/EmceeIncomeLightCard';

import WelcomeBanner from './WelcomeBanner';
import { gridSpacing } from 'store/constant';

import monthChart from './chartdata/emcee-ordermonthline-chart';
import yearChart from './chartdata/emcee-orderyear-linechart';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| EMCEE DASHBOARD ||============================== //

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
                        <EmceeEarningCard isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <EmceeOrderchart
                            isLoading={isLoading}
                            monthChart={monthChart}
                            yearChart={yearChart}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <EmceeIncomeDarkCard isLoading={isLoading} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <EmceeIncomeLightCard
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
                        <EmceeGrowthBarChart isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <EmceePopularCard isLoading={isLoading} />
                    </Grid>

                </Grid>
            </Grid>

        </Grid>
    );
}
