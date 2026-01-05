import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import CateringEarningCard from './CateringEarningCard';
import CateringPopularCard from './CateringPopularCard';
import CateringOrderchart from './CateringOrderchart';
import IncomeLightCard from './cards/CateringIncomeDarkCard';
import IncomeDarkCard from './cards/CateringIncomeDarkCard';
import GrowthBarChart from './CateringGrowthBarChart';
import WelcomeBanner from '../cateringdashboard/WelcomeBanner';

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
            <CateringEarningCard isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CateringOrderchart isLoading={isLoading} />
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
                    total: 203,
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
            <CateringPopularCard isLoading={isLoading} />
          </Grid>

        </Grid>
      </Grid>

    </Grid>
  );
}
