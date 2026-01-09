import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import CakeEarningCard from './CakeEarningCard';
import CakePopularCard from './CakePopularCard';
import CakeOrderchart from './CakeOrderchart';
import IncomeLightCard from './cards/CakeIncomeDarkCard';
import IncomeDarkCard from './cards/CakeIncomeDarkCard';
import GrowthBarChart from './CakeGrowthBarChart';
import WelcomeBanner from '../cakedashboard/WelcomeBanner';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| CATERING DASHBOARD ||============================== //

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
            <CakeEarningCard isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CakeOrderchart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <IncomeDarkCard isLoading={isLoading} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <IncomeLightCard
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
            <GrowthBarChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CakePopularCard isLoading={isLoading} />
          </Grid>

        </Grid>
      </Grid>

    </Grid>
  );
}
