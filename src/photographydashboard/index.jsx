import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import PhotoEarningCard from './PhotoEarningCard';
import PhotoPopularCard from './PhotopPopularCard';
import PhotopOrderchart from './PhotoOrderChart';
import PhotoIncomeLightCard from './cards/PhotoIncomeLightCard';
import PhotoIncomeDarkCard from './cards/PhotoIncomeDarkCard';
import PhotoGrowthBarChart from './PhotoGrowthBarChart';
import WelcomeBanner from './WelcomeBanner';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| PHOTOGRAPHY DASHBOARD ||============================== //

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
            <PhotoEarningCard isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PhotopOrderchart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <PhotoIncomeDarkCard isLoading={isLoading} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <PhotoIncomeLightCard
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
            <PhotoGrowthBarChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PhotoPopularCard isLoading={isLoading} />
          </Grid>

        </Grid>
      </Grid>

    </Grid>
  );
}
