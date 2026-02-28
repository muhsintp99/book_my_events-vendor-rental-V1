import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import BouncersEarningCard from './BouncersEarningCard';
import BouncersOrderchart from './BouncersOrderchart';
import BouncersPopularCard from './BouncersPopularCard';
import BouncersGrowthBarChart from './BouncersGrowthBarChart';
import BouncersIncomeDarkCard from './cards/BouncersIncomeDarkCard';
import BouncersIncomeLightCard from './cards/BouncersIncomeLightCard';

import WelcomeBanner from './WelcomeBanner';
import { gridSpacing } from 'store/constant';

import monthChart from './chartdata/bouncers-ordermonthline-chart';
import yearChart from './chartdata/bouncers-orderyear-linechart';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| BOUNCERS DASHBOARD ||============================== //

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
                        <BouncersEarningCard isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <BouncersOrderchart
                            isLoading={isLoading}
                            monthChart={monthChart}
                            yearChart={yearChart}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <BouncersIncomeDarkCard isLoading={isLoading} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <BouncersIncomeLightCard
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
                        <BouncersGrowthBarChart isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <BouncersPopularCard isLoading={isLoading} />
                    </Grid>

                </Grid>
            </Grid>

        </Grid>
    );
}
