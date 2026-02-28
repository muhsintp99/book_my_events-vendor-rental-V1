import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

// dashboards
import VehicleIndex from '../../../vehicledashboard';
import CateringIndex from '../../../cateringdashboard';
import MakeupIndex from '../../../makeupdashboard';
import PhotographyIndex from '../../../photographydashboard';
import CakeIndex from '../../../cakedashboard';
import OrnamentsIndex from '../../../ornamentsdashboard';
import MehandiIndex from '../../../mehandidashboard';
import InvitationIndex from '../../../invitationdashboard';
import FloristIndex from '../../../floristdashboard';
import BoutiqueIndex from '../../../boutiquedashboard';
import LightIndex from '../../../lightdashboard';
import BouncersIndex from '../../../bouncersdashboard';

// cards
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

// welcome banner
import WelcomeBanner from '../../../makeupdashboard/WelcomeBanner';

// constants
import { gridSpacing } from 'store/constant';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  const Module = localStorage.getItem('logRes');

  // ================= INITIAL LOAD =================
  useEffect(() => {
    setLoading(false);
  }, []);

  // ================= DASHBOARD RENDER =================
  const renderDashboard = () => {
    const activeModule = (Module || '').trim();
    console.log('Dashboard Module Identified:', activeModule);

    const moduleKey = activeModule.toLowerCase();

    if (moduleKey === 'transport') return <VehicleIndex isLoading={isLoading} />;
    if (moduleKey === 'catering') return <CateringIndex isLoading={isLoading} />;
    if (moduleKey === 'makeup artist' || moduleKey === 'makeup') return <MakeupIndex isLoading={isLoading} />;
    if (moduleKey === 'photography') return <PhotographyIndex isLoading={isLoading} />;
    if (moduleKey === 'cake') return <CakeIndex isLoading={isLoading} />;
    if (['ornaments', 'ornament'].includes(moduleKey)) return <OrnamentsIndex isLoading={isLoading} />;
    if (moduleKey === 'mehandi' || moduleKey === 'mehandi artist') return <MehandiIndex isLoading={isLoading} />;
    if (moduleKey.includes('invitation')) return <InvitationIndex isLoading={isLoading} />;
    if (moduleKey.includes('florist')) return <FloristIndex isLoading={isLoading} />;
    if (moduleKey.includes('boutique')) return <BoutiqueIndex isLoading={isLoading} />;
    if (moduleKey.includes('light')) return <LightIndex isLoading={isLoading} />;
    if (moduleKey.includes('bouncers')) return <BouncersIndex isLoading={isLoading} />;

    return (
      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <WelcomeBanner />
        </Grid>

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
                <Grid size={{ xs: 12 }}>
                  <TotalIncomeDarkCard isLoading={isLoading} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TotalIncomeLightCard
                    isLoading={isLoading}
                    total={0}
                    label="Total Income"
                    icon={<StorefrontTwoToneIcon fontSize="inherit" />}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

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
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
}
