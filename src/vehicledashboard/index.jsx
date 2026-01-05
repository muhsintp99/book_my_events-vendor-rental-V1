import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import VehicleEarningCard from './VehicleEarningCard';
import VehiclePopularCard from './VehiclePopularCard';
import VehicleTotalRentChart from './vehicleTotalRentChart';
import VehicleTotalIncomeDarkCard from '../vehicledashboard/cards.jsx/VehicleTotalIncomeDarkCard';
import VehicleIncomeLightCard from '../vehicledashboard/cards.jsx/VehicleIncomeLightCard';
import VehicleTotalGrowthBarChart from './VehicleTotalGrowthBarChart';
import WelcomeBanner from '../vehicledashboard/WelcomeBanner';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| VEHICLE DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>

      {/* ✅ WELCOME BANNER */}
      <Grid size={12}>
        <WelcomeBanner />
      </Grid>

      {/* ===================== TOP CARDS ===================== */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <VehicleEarningCard isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <VehicleTotalRentChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <VehicleTotalIncomeDarkCard isLoading={isLoading} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <VehicleIncomeLightCard
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
            <VehicleTotalGrowthBarChart isLoading={isLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <VehiclePopularCard isLoading={isLoading} />
          </Grid>

        </Grid>
      </Grid>

    </Grid>
  );
}
