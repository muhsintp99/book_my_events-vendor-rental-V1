import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

// dashboards
import VehicleIndex from '../../../vehicledashboard';
import CateringIndex from '../../../cateringdashboard';
import MakeupIndex from '../../../makeupdashboard';
import PhotographyIndex from '../../../photographydashboard';
import CakeIndex from '../../../cakedashboard';


// cards
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

// welcome banner
import WelcomeBanner from '../../../makeupdashboard/WelcomeBanner';

// KYC popup
import KycUpdateDialog from '../../KycUpdateDialog';

// constants
import { gridSpacing } from 'store/constant';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [showKycPopup, setShowKycPopup] = useState(false);

  const Module = localStorage.getItem('logRes');
  const user = JSON.parse(localStorage.getItem('user'));

  // ================= INITIAL LOAD =================
  useEffect(() => {
    setLoading(false);

    // 🔑 Check KYC after 4 seconds
    const timer = setTimeout(() => {
      if (!user?.kycCompleted) {
        setShowKycPopup(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const renderDashboard = () => {
    if (Module === 'Transport') return <VehicleIndex isLoading={isLoading} />;
    if (Module === 'Catering') return <CateringIndex isLoading={isLoading} />;
    if (Module === 'Makeup Artist') return <MakeupIndex isLoading={isLoading} />;
    if (Module === 'Photography') return <PhotographyIndex isLoading={isLoading} />;
    if (Module === 'Cake') return <CakeIndex isLoading={isLoading} />;


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

      {/* ================= KYC POPUP ================= */}
      <KycUpdateDialog
        open={showKycPopup}
        onClose={() => setShowKycPopup(false)}
      />
    </>
  );
}
