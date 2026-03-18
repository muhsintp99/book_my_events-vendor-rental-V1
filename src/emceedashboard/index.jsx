import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EmceeEarningCard from './EmceeEarningCard';
import EmceePopularCard from './EmceePopularCard';
import EmceeOrderchart from './EmceeOrderchart';
import EmceeIncomeDarkCard from './cards/EmceeIncomeDarkCard';
import EmceeIncomeLightCard from './cards/EmceeIncomeLightCard';
import EmceeGrowthBarChart from './EmceeGrowthBarChart';
import WelcomeBanner from './WelcomeBanner';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

// Helper to parse dates robustly
const parseDate = (d) => {
  if (!d) return new Date(0);
  let date = new Date(d);
  if (isNaN(date.getTime()) && typeof d === 'string') {
    const parts = d.split(/[/-]/);
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (parts[0].length === 4) {
        date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
      }
    }
  }
  return isNaN(date.getTime()) ? new Date(0) : date;
};

// ==============================|| EMCEE DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalEnquiries: 0,
    monthlyEnquiries: 0,
    enquiries: [],
    popularEnquiries: [],
    monthlyGrowthEnquiries: new Array(12).fill(0)
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const providerId = user?._id || user?.id;
      if (!providerId) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      };

      // 1. Fetch All Enquiries
      const enquiryRes = await axios.get(`${API_BASE_URL}/api/enquiries/provider/${providerId}`, config);
      const allEnquiries = enquiryRes.data?.data || enquiryRes.data?.enquiries || [];

      // 2. Strict Emcee Filter
      const emceeEnquiries = allEnquiries.filter((e) => {
        const mTitle = String(e.moduleId?.title || '').toLowerCase();
        const eType = String(e.eventType || '').toLowerCase();
        
        return mTitle.includes('emcee') || 
               mTitle.includes('host') ||
               eType.includes('emcee') || 
               eType.includes('host');
      });

      // 3. Calculate Data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalEnquiriesCount = emceeEnquiries.length;
      let monthlyEnquiriesCount = 0;
      const monthlyGrowthEnquiries = new Array(12).fill(0);
      const enquiryMap = {};

      emceeEnquiries.forEach((e) => {
        const eDate = parseDate(e.bookingDate || e.createdAt);
        const bMonth = eDate.getMonth();
        const bYear = eDate.getFullYear();

        if (bYear === currentYear) {
          monthlyGrowthEnquiries[bMonth] += 1;
          if (bMonth === currentMonth) {
            monthlyEnquiriesCount += 1;
          }
        }

        const nameKey = e.moduleId?.title || e.eventType || 'Emcee Service';
        if (!enquiryMap[nameKey]) {
          enquiryMap[nameKey] = {
            name: nameKey,
            count: 0
          };
        }
        enquiryMap[nameKey].count += 1;
      });

      let popularEnquiries = Object.values(enquiryMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setDashboardData({
        totalEnquiries: totalEnquiriesCount,
        monthlyEnquiries: monthlyEnquiriesCount,
        enquiries: emceeEnquiries,
        popularEnquiries,
        monthlyGrowthEnquiries
      });
    } catch (err) {
      console.error('Emcee Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const monthChartDecoration = {
    type: 'line',
    height: 90,
    options: {
      chart: { sparkline: { enabled: true }, dropShadow: { enabled: true, top: 2, left: 0, blur: 2, color: '#000', opacity: 0.1 } },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#fff'],
      tooltip: { fixed: { enabled: false }, x: { show: false }, marker: { show: false } }
    },
    series: [{ name: 'Enquiries', data: [5, 12, 8, 25, 10, 30, 15] }]
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <WelcomeBanner />
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <EmceeEarningCard isLoading={isLoading} totalEnquiryMonth={dashboardData.monthlyEnquiries} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <EmceeOrderchart 
              isLoading={isLoading} 
              title="Total Enquiries" 
              monthValue={dashboardData.monthlyEnquiries} 
              yearValue={dashboardData.totalEnquiries}
              monthChart={monthChartDecoration}
              yearChart={monthChartDecoration}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <EmceeIncomeDarkCard isLoading={isLoading} totalEnquiries={dashboardData.totalEnquiries} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <EmceeIncomeLightCard
                  isLoading={isLoading}
                  total={dashboardData.totalEnquiries}
                  label="Total Enquiries Balance"
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
            <EmceeGrowthBarChart 
              isLoading={isLoading} 
              monthlyGrowthEnquiries={dashboardData.monthlyGrowthEnquiries}
              totalEnquiries={dashboardData.totalEnquiries}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <EmceePopularCard 
               isLoading={isLoading} 
               enquiries={dashboardData.popularEnquiries} 
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
