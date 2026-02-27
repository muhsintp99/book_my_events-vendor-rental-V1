import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';

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

    if (activeModule.toLowerCase() === 'transport') return <VehicleIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase() === 'catering') return <CateringIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase() === 'makeup artist' || activeModule.toLowerCase() === 'makeup') return <MakeupIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase() === 'photography') return <PhotographyIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase() === 'cake') return <CakeIndex isLoading={isLoading} />;
    if (['ornaments', 'ornament'].includes(activeModule.toLowerCase())) return <OrnamentsIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase() === 'mehandi' || activeModule.toLowerCase() === 'mehandi artist') return <MehandiIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase().includes('invitation')) return <InvitationIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase().includes('florist')) return <FloristIndex isLoading={isLoading} />;
    if (activeModule.toLowerCase().includes('boutique')) return <BoutiqueIndex isLoading={isLoading} />;

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
