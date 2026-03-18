import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import PanthalEarningCard from './PanthalEarningCard';
import PanthalPopularCard from './PanthalPopularCard';
import PanthalOrderchart from './PanthalOrderchart';
import PanthalIncomeDarkCard from './cards/PanthalIncomeDarkCard';
import PanthalIncomeLightCard from './cards/PanthalIncomeLightCard';
import PanthalGrowthBarChart from './PanthalGrowthBarChart';
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

// ==============================|| PANTHAL DASHBOARD ||============================== //

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
      // Note: Using the endpoint found in panthalenquiries.jsx
      const enquiryRes = await axios.get(`${API_BASE_URL}/api/enquiries/provider/${providerId}`, config);
      const allEnquiries = enquiryRes.data?.data || enquiryRes.data?.enquiries || [];

      // 2. Strict Panthal Filter (Only pure matching Panthal/Decoration features)
      const panthalEnquiries = allEnquiries.filter((e) => {
        const mTitle = String(e.moduleId?.title || '').toLowerCase();
        const eType = String(e.eventType || '').toLowerCase();
        
        return mTitle.includes('panthal') || 
               mTitle.includes('decor') ||
               eType.includes('panthal') || 
               eType.includes('decor');
      });

      // 3. Calculate Data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalEnquiriesCount = panthalEnquiries.length;
      let monthlyEnquiriesCount = 0;
      const monthlyGrowthEnquiries = new Array(12).fill(0);
      const enquiryMap = {};

      panthalEnquiries.forEach((e) => {
        const eDate = parseDate(e.bookingDate || e.createdAt);
        const bMonth = eDate.getMonth();
        const bYear = eDate.getFullYear();

        if (bYear === currentYear) {
          monthlyGrowthEnquiries[bMonth] += 1;
          if (bMonth === currentMonth) {
            monthlyEnquiriesCount += 1;
          }
        }

        // Popular Enquiry Tracking (by Module Title or Event Type)
        const nameKey = e.moduleId?.title || e.eventType || 'Panthal Service';
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
        enquiries: panthalEnquiries,
        popularEnquiries,
        monthlyGrowthEnquiries
      });
    } catch (err) {
      console.error('Panthal Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Decorative Dynamic Sparkline Options
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
            <PanthalEarningCard isLoading={isLoading} totalEnquiryMonth={dashboardData.monthlyEnquiries} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PanthalOrderchart 
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
                <PanthalIncomeDarkCard isLoading={isLoading} totalEnquiries={dashboardData.totalEnquiries} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <PanthalIncomeLightCard
                  isLoading={isLoading}
                  total={dashboardData.totalEnquiries}
                  label="Total Enquiries"
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
            <PanthalGrowthBarChart 
              isLoading={isLoading} 
              monthlyGrowthEnquiries={dashboardData.monthlyGrowthEnquiries}
              totalEnquiries={dashboardData.totalEnquiries}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PanthalPopularCard 
               isLoading={isLoading} 
               enquiries={dashboardData.popularEnquiries} 
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
