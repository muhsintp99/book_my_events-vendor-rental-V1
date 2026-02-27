import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import WelcomeBanner from './WelcomeBanner';
import BoutiqueEarningCard from './BoutiqueEarningCard';
import BoutiquePopularCard from './BoutiquePopularCard';
import BoutiqueOrderChart from './BoutiqueOrderChart';
import BoutiqueIncomeLightCard from './cards/BoutiqueIncomeLightCard';
import BoutiqueIncomeDarkCard from './cards/BoutiqueIncomeDarkCard';
import BoutiqueGrowthBarChart from './BoutiqueGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| BOUTIQUE DASHBOARD ||============================== //

export default function BoutiqueDashboard() {
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
            <BoutiqueEarningCard isLoading={isLoading} />
          </Grid>

          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <BoutiqueOrderChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <BoutiqueIncomeDarkCard isLoading={isLoading} />
              </Grid>

              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <BoutiqueIncomeLightCard
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
            <BoutiqueGrowthBarChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <BoutiquePopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
}
