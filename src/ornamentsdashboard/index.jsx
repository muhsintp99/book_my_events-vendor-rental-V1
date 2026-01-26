import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import WelcomeBanner from './WelcomeBanner';
import OrnamentsEarningCard from './OrnamentsEarningCard';
import OrnamentsPopularCard from './OrnamentsPopularCard';
import OrnamentsOrderChart from './OrnamentsOrderChart';
import OrnamentsIncomeLightCard from './cards/OrnamentsIncomeLightCard';
import OrnamentsIncomeDarkCard from './cards/OrnamentsIncomeDarkCard';
import OrnamentsGrowthBarChart from './OrnamentsGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| ORNAMENTS DASHBOARD ||============================== //

export default function OrnamentsDashboard() {
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
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <OrnamentsEarningCard isLoading={isLoading} />
          </Grid>

          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <OrnamentsOrderChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <OrnamentsIncomeDarkCard isLoading={isLoading} />
              </Grid>

              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <OrnamentsIncomeLightCard
                  {...{
                    isLoading,
                    total: '0.00',
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
            <OrnamentsGrowthBarChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <OrnamentsPopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
}
