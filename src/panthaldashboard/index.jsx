import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import PanthalEarningCard from './PanthalEarningCard';
import PanthalOrderchart from './PanthalOrderchart';
import PanthalPopularCard from './PanthalPopularCard';
import PanthalGrowthBarChart from './PanthalGrowthBarChart';
import PanthalIncomeDarkCard from './cards/PanthalIncomeDarkCard';
import PanthalIncomeLightCard from './cards/PanthalIncomeLightCard';

import WelcomeBanner from './WelcomeBanner';
import { gridSpacing } from 'store/constant';

import monthChart from './chartdata/Panthal-ordermonthline-chart';
import yearChart from './chartdata/Panthal-orderyear-linechart';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| Panthal DASHBOARD ||============================== //

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
                        <PanthalEarningCard isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <PanthalOrderchart
                            isLoading={isLoading}
                            monthChart={monthChart}
                            yearChart={yearChart}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <PanthalIncomeDarkCard isLoading={isLoading} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                <PanthalIncomeLightCard
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
                        <PanthalGrowthBarChart isLoading={isLoading} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <PanthalPopularCard isLoading={isLoading} />
                    </Grid>

                </Grid>
            </Grid>

        </Grid>
    );
}

