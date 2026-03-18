import { useEffect, useState, useCallback } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import CateringEarningCard from './CateringEarningCard';
import CateringPopularCard from './CateringPopularCard';
import CateringOrderchart from './CateringOrderchart';
import IncomeLightCard from './cards/CateringIncomeLightCard';
import IncomeDarkCard from './cards/CateringIncomeDarkCard';
import GrowthBarChart from './CateringGrowthBarChart';
import WelcomeBanner from './WelcomeBanner';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

// ==============================|| CATERING DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalIncome: 0,
    monthlyOrders: 0,
    yearlyOrders: 0,
    monthlyEarnings: 0,
    yearlyEarnings: 0,
    bookings: [],
    popularPackages: [],
    monthlyGrowth: new Array(12).fill(0),
    monthlyIncomeGrowth: new Array(12).fill(0)
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('user') || localStorage.getItem('vendor');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const providerId = user?._id;
      if (!providerId) return;

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const bookingsRes = await fetch(`${API_BASE_URL}/api/bookings/provider/${providerId}`, { headers });
      const bookingsJson = await bookingsRes.json();
      const allBookings = bookingsJson?.data || bookingsJson?.bookings || [];

      // Very loose filtering to catch any potential catering bookings
      const cateringBookings = allBookings.filter(
        (b) => 
          String(b.moduleType || '').toLowerCase() === 'catering' || 
          b.cateringId || 
          String(b.packageType || '').toLowerCase() === 'catering' ||
          b.packageName?.toLowerCase().includes('catering')
      );

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Metrics calculation
      const validForEarnings = (b) => 
        b.paymentStatus === 'completed' || 
        ['Accepted', 'Confirmed', 'Completed'].includes(b.status);

      const totalEarnings = cateringBookings
        .filter(validForEarnings)
        .reduce((sum, b) => sum + (Number(b.finalPrice || b.packagePrice || b.totalAmount || 0)), 0);
      
      const totalOrders = cateringBookings.length;

      const totalIncome = cateringBookings
        .filter((b) => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + (Number(b.finalPrice || b.packagePrice || b.totalAmount || 0)), 0);

      const monthlyBookings = cateringBookings.filter((b) => {
        const d = new Date(b.createdAt || b.bookingDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      const monthlyOrders = monthlyBookings.length;
      const monthlyEarnings = monthlyBookings
        .filter(validForEarnings)
        .reduce((sum, b) => sum + (Number(b.finalPrice || b.packagePrice || b.totalAmount || 0)), 0);

      const yearlyBookings = cateringBookings.filter((b) => {
        const d = new Date(b.createdAt || b.bookingDate);
        return d.getFullYear() === currentYear;
      });
      const yearlyOrders = yearlyBookings.length;
      const yearlyEarnings = yearlyBookings
        .filter(validForEarnings)
        .reduce((sum, b) => sum + (Number(b.finalPrice || b.packagePrice || b.totalAmount || 0)), 0);

      const monthlyGrowth = new Array(12).fill(0);
      const monthlyIncomeGrowth = new Array(12).fill(0);
      yearlyBookings.forEach((b) => {
        const d = new Date(b.createdAt || b.bookingDate);
        const month = d.getMonth();
        monthlyGrowth[month] += 1;
        if (validForEarnings(b)) {
          monthlyIncomeGrowth[month] += Number(b.finalPrice || b.packagePrice || b.totalAmount || 0);
        }
      });

      // Package fetching
      let packageNameMap = {};
      try {
        const pkgRes = await fetch(`${API_BASE_URL}/api/catering/provider/${providerId}`, { headers });
        const pkgJson = await pkgRes.json();
        const packages = pkgJson?.data || pkgJson || [];
        if (Array.isArray(packages)) {
          packages.forEach((p) => {
            packageNameMap[p._id] = {
              name: p.title || p.packageName || 'Catering Package',
              price: p.price || 0
            };
          });
        }
      } catch (e) { console.log(e); }

      // Aggregating popular packages
      const packageMap = {};
      cateringBookings.forEach((b) => {
        const rawPkg = b.cateringId || b.packageId;
        const pkgId = (rawPkg && typeof rawPkg === 'object' ? rawPkg._id : rawPkg) || 'unknown_item';
        
        if (!packageMap[pkgId]) {
          const pkgInfo = packageNameMap[pkgId];
          packageMap[pkgId] = {
            id: pkgId,
            name: pkgInfo?.name || (rawPkg && typeof rawPkg === 'object' ? rawPkg.title : null) || b.packageName || 'Catering Service',
            price: pkgInfo?.price || (rawPkg && typeof rawPkg === 'object' ? rawPkg.price : 0) || 0,
            bookings: 0,
            revenue: 0
          };
        }
        packageMap[pkgId].bookings += 1;
        if (validForEarnings(b)) {
          packageMap[pkgId].revenue += Number(b.finalPrice || b.packagePrice || b.totalAmount || 0);
        }
      });

      let popularPackages = Object.values(packageMap).sort((a, b) => b.bookings - a.bookings);
      
      // Auto-fill logic
      if (popularPackages.length < 5 && Object.keys(packageNameMap).length > 0) {
        Object.entries(packageNameMap).forEach(([id, info]) => {
          if (popularPackages.length < 5 && !popularPackages.find(p => p.id === id)) {
            popularPackages.push({ id, name: info.name, bookings: 0, revenue: 0, price: info.price });
          }
        });
      }
      popularPackages = popularPackages.slice(0, 5);

      setDashboardData({
        totalEarnings,
        totalOrders,
        totalIncome,
        monthlyOrders,
        yearlyOrders,
        monthlyEarnings,
        yearlyEarnings,
        bookings: cateringBookings,
        popularPackages,
        monthlyGrowth,
        monthlyIncomeGrowth
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <WelcomeBanner />
      </Grid>

      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CateringEarningCard isLoading={isLoading} amount={dashboardData.totalEarnings} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CateringOrderchart
              isLoading={isLoading}
              totalOrders={dashboardData.totalOrders}
              totalEarnings={dashboardData.totalEarnings}
              monthValue={dashboardData.monthlyEarnings}
              yearValue={dashboardData.yearlyEarnings}
              monthlyOrders={dashboardData.monthlyOrders}
              yearlyOrders={dashboardData.yearlyOrders}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <IncomeDarkCard isLoading={isLoading} totalIncome={dashboardData.totalIncome} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <IncomeLightCard
                  {...{
                    isLoading,
                    total: dashboardData.totalEarnings,
                    label: 'Total Income',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <GrowthBarChart
              isLoading={isLoading}
              monthlyGrowth={dashboardData.monthlyGrowth}
              monthlyIncomeGrowth={dashboardData.monthlyIncomeGrowth}
              totalEarnings={dashboardData.totalEarnings}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CateringPopularCard
              isLoading={isLoading}
              popularPackages={dashboardData.popularPackages}
              totalPackageRevenue={dashboardData.totalEarnings}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
