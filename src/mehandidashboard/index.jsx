import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import MehandiEarningCard from './MehandiEarningCard';
import MehandiOrderchart from './MehandiOrderchart';
import MehandiPopularCard from './MehandiPopularCard';
import MehandiGrowthBarChart from './MehandiGrowthBarChart';
import MehandiIncomeDarkCard from './cards/MehandiIncomeDarkCard';
import MehandiIncomeLightCard from './cards/MehandiIncomeLightCard';

import WelcomeBanner from './WelcomeBanner';
import { gridSpacing } from 'store/constant';

import monthChart from './chartdata/mehandi-ordermonthline-chart';
import yearChart from './chartdata/mehandi-orderyear-linechart';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| MEHANDI DASHBOARD ||============================== //

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
            <MehandiEarningCard isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MehandiOrderchart
              isLoading={isLoading}
              monthChart={monthChart}
              yearChart={yearChart}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <MehandiIncomeDarkCard isLoading={isLoading} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <MehandiIncomeLightCard
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
            <MehandiGrowthBarChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <MehandiPopularCard isLoading={isLoading} />
          </Grid>

        </Grid>
      </Grid>

    </Grid>
  );
}
