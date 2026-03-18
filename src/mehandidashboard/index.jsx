import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import MehandiEarningCard from './MehandiEarningCard';
import MehandiPopularCard from './MehandiPopularCard';
import MehandiOrderchart from './MehandiOrderchart';
import MehandiIncomeDarkCard from './cards/MehandiIncomeDarkCard';
import MehandiIncomeLightCard from './cards/MehandiIncomeLightCard';
import MehandiGrowthBarChart from './MehandiGrowthBarChart';
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

// ==============================|| MEHANDI DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalIncome: 0,
    monthlyOrders: 0,
    yearlyOrders: 0,
    bookings: [],
    popularPackages: [],
    monthlyGrowth: new Array(12).fill(0),
    monthlyIncomeGrowth: new Array(12).fill(0),
    totalPackageRevenue: 0
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

      // 1. Fetch All Bookings
      const bookingsRes = await axios.get(`${API_BASE_URL}/api/bookings/provider/${providerId}`, config);
      const allBookings = bookingsRes.data?.data || bookingsRes.data?.bookings || [];

      // 2. Loose Mehandi Filter
      const mehandiBookings = allBookings.filter((b) => {
        const mType = String(b.moduleType || '').toLowerCase();
        const sType = String(b.serviceType || b.packageType || b.category || '').toLowerCase();
        const pName = String(b.packageName || '').toLowerCase();
        
        // Strict match parameters to secure authentic Mehandi revenue
        return mType.includes('mehandi') || 
               sType.includes('mehandi') || 
               pName.includes('mehandi') || 
               b.mehandiId || 
               b.mehandiPackageId ||
               (b.items && b.items.some(item => String(item.name || '').toLowerCase().includes('mehandi')));
      });

      // 3. Fetch All Packages (Optional fallback mapping)
      let packageNameMap = {};
      try {
        const pkgRes = await axios.get(`${API_BASE_URL}/api/mehandis/provider/${providerId}`, config);
        const pkgs = pkgRes.data?.data || pkgRes.data || [];
        if (Array.isArray(pkgs)) {
          pkgs.forEach((p) => {
            packageNameMap[p._id] = {
              name: p.name || p.title || p.packageName || 'Mehandi Service',
              price: p.price || p.pricing?.grandTotal || p.salePrice || 0
            };
          });
        }
      } catch (e) {
        console.warn('Mehandi list fetch failed:', e);
      }

      // 4. Calculate Data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalEarnings = 0;
      let totalIncome = 0;
      let monthlyOrdersCount = 0;
      let yearlyOrdersCount = 0;
      
      const monthlyGrowth = new Array(12).fill(0);
      const monthlyIncomeGrowth = new Array(12).fill(0);
      
      const packageMap = {};

      mehandiBookings.forEach((b) => {
        const bookingDate = parseDate(b.bookingDate || b.createdAt || b.date);
        const bMonth = bookingDate.getMonth();
        const bYear = bookingDate.getFullYear();
        
        // Parse raw amount flexibly
        const amount = parseFloat(b.finalPrice || b.totalAmount || b.packagePrice || b.price || b.amount || 0);
        
        const status = String(b.status || '').toLowerCase();
        const payStatus = String(b.paymentStatus || '').toLowerCase();
        const isCompleted = ['completed', 'accepted', 'confirmed', 'approve', 'approved', 'active', 'success'].includes(status);
        const isPaid = ['completed', 'paid', 'success'].includes(payStatus);

        // Current Year Growth Tracking
        if (bYear === currentYear) {
          yearlyOrdersCount += 1;
          monthlyGrowth[bMonth] += 1;
          
          if (isPaid || isCompleted) {
            monthlyIncomeGrowth[bMonth] += amount;
          }

          if (bMonth === currentMonth) {
            monthlyOrdersCount += 1;
          }
        }

        // Totals
        if (isPaid || isCompleted) totalEarnings += amount;
        if (isPaid) totalIncome += amount; 

        // Popular Package Extractor
        const pkgIdStr = typeof b.packageId === 'object' ? b.packageId?._id : (b.packageId || b.mehandiId || b.mehandiPackageId);
        const pkgId = pkgIdStr || 'unknown';
        
        if (!packageMap[pkgId]) {
          const info = packageNameMap[pkgId];
          const nameStr = typeof b.packageId === 'object' ? (b.packageId?.name || b.packageId?.title) : b.packageName;
          
          packageMap[pkgId] = {
            id: pkgId,
            name: nameStr || info?.name || 'Custom Mehandi Service',
            price: info?.price || amount || 0,
            bookings: 0,
            revenue: 0
          };
        }
        packageMap[pkgId].bookings += 1;
        if (isPaid || isCompleted) {
          packageMap[pkgId].revenue += amount;
        }
      });

      let popularPackages = Object.values(packageMap)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      const totalPackageRevenue = popularPackages.reduce((sum, pkg) => sum + pkg.revenue, 0);

      // Populate empty list with unbooked packages if needed
      if (popularPackages.length === 0 && Object.keys(packageNameMap).length > 0) {
        Object.entries(packageNameMap).slice(0, 5).forEach(([id, info]) => {
          popularPackages.push({ id, name: info.name, bookings: 0, revenue: 0, price: info.price });
        });
      }

      setDashboardData({
        totalEarnings,
        totalOrders: mehandiBookings.length, 
        totalIncome,
        monthlyOrders: monthlyOrdersCount,
        yearlyOrders: yearlyOrdersCount,
        bookings: mehandiBookings,
        popularPackages,
        monthlyGrowth,
        monthlyIncomeGrowth,
        totalPackageRevenue
      });
    } catch (err) {
      console.error('Mehandi Dashboard data fetch error:', err);
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
    series: [{ name: 'Orders', data: [5, 12, 8, 25, 10, 30, 15] }]
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <WelcomeBanner />
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MehandiEarningCard isLoading={isLoading} totalEarnings={dashboardData.totalEarnings} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MehandiOrderchart 
              isLoading={isLoading} 
              title="Total Orders" 
              monthValue={dashboardData.monthlyOrders} 
              yearValue={dashboardData.totalOrders}
              monthChart={monthChartDecoration}
              yearChart={monthChartDecoration}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <MehandiIncomeDarkCard isLoading={isLoading} totalAmount={dashboardData.totalIncome} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <MehandiIncomeLightCard
                  isLoading={isLoading}
                  total={dashboardData.totalEarnings}
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
            <MehandiGrowthBarChart 
              isLoading={isLoading} 
              monthlyGrowth={dashboardData.monthlyGrowth}
              monthlyIncomeGrowth={dashboardData.monthlyIncomeGrowth}
              totalEarnings={dashboardData.totalEarnings}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MehandiPopularCard 
               isLoading={isLoading} 
               packages={dashboardData.popularPackages} 
               totalPackageRevenue={dashboardData.totalPackageRevenue}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
