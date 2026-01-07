import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// default dashboard cards
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

// module dashboards
import VehicleIndex from '../../../vehicledashboard';
import CateringIndex from '../../../cateringdashboard';
import MakeupIndex from '../../../makeupdashboard';
import PhotographyIndex from '../../../photographydashboard';

// welcome banner
import WelcomeBanner from '../../../makeupdashboard/WelcomeBanner';

// constants
import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const Module = localStorage.getItem('logRes');

  console.log('logRes in module:', Module);

  // ✅ hooks MUST run first
  useEffect(() => {
    setLoading(false);
  }, []);

  // ================= MODULE DASHBOARDS =================
  if (Module === 'Transport') {
    return <VehicleIndex isLoading={isLoading} />;
  }

  if (Module === 'Catering') {
    return <CateringIndex isLoading={isLoading} />;
  }

  if (Module === 'Makeup Artist') {
    return <MakeupIndex isLoading={isLoading} />;
  }

  if (Module === 'Photography') {
    return <PhotographyIndex isLoading={isLoading} />;
  }

  // ================= DEFAULT DASHBOARD =================
 return (
  <Grid container spacing={gridSpacing}>

    {/* ✅ WELCOME BANNER */}
    <Grid size={12}>
      <WelcomeBanner />
    </Grid>

    {/* TOP CARDS */}
    <Grid size={12}>
      <Grid container spacing={gridSpacing}>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <EarningCard isLoading={isLoading} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TotalOrderLineChartCard isLoading={isLoading} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={gridSpacing}>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <TotalIncomeDarkCard isLoading={isLoading} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <TotalIncomeLightCard
                {...{
                  isLoading,
                  total: 0,
                  label: 'Total Income',
                  icon: <StorefrontTwoToneIcon fontSize="inherit" />
                }}
              />
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </Grid>

    {/* BOTTOM SECTION */}
    <Grid size={12}>
      <Grid container spacing={gridSpacing}>

        <Grid size={{ xs: 12, md: 8 }}>
          <TotalGrowthBarChart isLoading={isLoading} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PopularCard isLoading={isLoading} />
        </Grid>

      </Grid>
    </Grid>

  </Grid>
);

}
