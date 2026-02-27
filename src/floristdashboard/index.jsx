import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import FloristEarningCard from './FloristEarningCard';
import FloristOrderchart from './FloristOrderchart';
import FloristPopularCard from './FloristPopularCard';
import FloristGrowthBarChart from './FloristGrowthBarChart';
import FloristIncomeDarkCard from './cards/FloristIncomeDarkCard';
import FloristIncomeLightCard from './cards/FloristIncomeLightCard';

import WelcomeBanner from './WelcomeBanner';
import { gridSpacing } from 'store/constant';

import monthChart from './chartdata/florist-ordermonthline-chart';
import yearChart from './chartdata/florist-orderyear-linechart';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| FLORIST DASHBOARD ||============================== //

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
                        <FloristEarningCard isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <FloristOrderchart
                            isLoading={isLoading}
                            monthChart={monthChart}
                            yearChart={yearChart}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <FloristIncomeDarkCard isLoading={isLoading} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <FloristIncomeLightCard
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
                        <FloristGrowthBarChart isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FloristPopularCard isLoading={isLoading} />
                    </Grid>

                </Grid>
            </Grid>

        </Grid>
    );
}
