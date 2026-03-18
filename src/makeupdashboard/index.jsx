import { useEffect, useState, useCallback } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import WelcomeBanner from './WelcomeBanner';
import MakeupEarningCard from './MakeupEarningCard';
import MakeupPopularCard from './MakeupPopularCard';
import MakeupOrderchart from './MakeupOrderChart';
import MakeupIncomeLightCard from './cards/MakeupIncomeLightCard';
import MakeupIncomeDarkCard from './cards/MakeupIncomeDarkCard';
import MakeupGrowthBarChart from './MakeupGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

// ==============================|| MAKEUP DASHBOARD ||============================== //

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

      // Fetch all bookings for this provider
      const bookingsRes = await fetch(
        `${API_BASE_URL}/api/bookings/provider/${providerId}`,
        { headers }
      );
      const bookingsJson = await bookingsRes.json();
      const allBookings = bookingsJson?.data || bookingsJson?.bookings || [];

      // Filter only makeup bookings
      const makeupBookings = allBookings.filter(
        (b) =>
          b.moduleType === 'Makeup' ||
          b.moduleType === 'Makeup Artist' ||
          b.makeupId
      );

      // Calculate metrics
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Completed bookings (Accepted + payment completed)
      const completedBookings = makeupBookings.filter(
        (b) => b.paymentStatus === 'completed' || b.status === 'Accepted'
      );

      // Total earnings = sum of finalPrice from completed bookings
      const totalEarnings = completedBookings.reduce(
        (sum, b) => sum + (b.finalPrice || b.packagePrice || 0), 0
      );

      // Total orders count
      const totalOrders = makeupBookings.length;

      // Total income from paid bookings
      const paidBookings = makeupBookings.filter(
        (b) => b.paymentStatus === 'completed'
      );
      const totalIncome = paidBookings.reduce(
        (sum, b) => sum + (b.finalPrice || b.packagePrice || 0), 0
      );

      // Monthly orders (current month)
      const monthlyBookings = makeupBookings.filter((b) => {
        const d = new Date(b.createdAt || b.bookingDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      const monthlyOrders = monthlyBookings.length;
      const monthlyEarnings = monthlyBookings
        .filter((b) => b.paymentStatus === 'completed' || b.status === 'Accepted')
        .reduce((sum, b) => sum + (b.finalPrice || b.packagePrice || 0), 0);

      // Yearly orders (current year)
      const yearlyBookings = makeupBookings.filter((b) => {
        const d = new Date(b.createdAt || b.bookingDate);
        return d.getFullYear() === currentYear;
      });
      const yearlyOrders = yearlyBookings.length;
      const yearlyEarnings = yearlyBookings
        .filter((b) => b.paymentStatus === 'completed' || b.status === 'Accepted')
        .reduce((sum, b) => sum + (b.finalPrice || b.packagePrice || 0), 0);

      // Monthly growth data (earnings per month for the current year)
      const monthlyGrowth = new Array(12).fill(0);
      const monthlyIncomeGrowth = new Array(12).fill(0);
      yearlyBookings.forEach((b) => {
        const d = new Date(b.createdAt || b.bookingDate);
        const month = d.getMonth();
        monthlyGrowth[month] += 1; // booking count
        if (b.paymentStatus === 'completed' || b.status === 'Accepted') {
          monthlyIncomeGrowth[month] += (b.finalPrice || b.packagePrice || 0);
        }
      });

      // Popular packages - first try to fetch actual makeup package names
      let packageNameMap = {};
      try {
        const pkgRes = await fetch(
          `${API_BASE_URL}/api/makeup-packages/provider/${providerId}`,
          { headers }
        );
        const pkgJson = await pkgRes.json();
        const packages = pkgJson?.data || pkgJson || [];
        if (Array.isArray(packages)) {
          packages.forEach((p) => {
            packageNameMap[p._id] = {
              name: p.packageTitle || p.packageName || p.name || 'Makeup Package',
              price: p.packagePrice || 0
            };
          });
        }
      } catch (e) {
        console.log('Could not fetch makeup packages for names:', e);
      }

      // Aggregate bookings by makeup package
      const packageMap = {};
      makeupBookings.forEach((b) => {
        // Robust ID extraction (makeupId or packageId could be an object)
        const rawPkg = b.makeupId || b.packageId || {};
        const pkgKey = typeof rawPkg === 'object' ? rawPkg._id : (rawPkg !== 'unknown' ? rawPkg : null);
        
        const finalKey = pkgKey || b.packageId || b._id || 'unknown';

        if (!packageMap[finalKey]) {
          const pkgInfo = packageNameMap[finalKey];
          packageMap[finalKey] = {
            id: finalKey,
            name: pkgInfo?.name || rawPkg.packageTitle || b.packageName || 'Makeup Package',
            price: pkgInfo?.price || rawPkg.packagePrice || 0,
            bookings: 0,
            revenue: 0
          };
        }
        packageMap[finalKey].bookings += 1;
        if (b.paymentStatus === 'completed' || b.status === 'Accepted') {
          packageMap[finalKey].revenue += (b.finalPrice || b.packagePrice || 0);
        }
      });

      let popularPackages = Object.values(packageMap)
        .sort((a, b) => b.bookings - a.bookings);

      // Fill with other available packages if we have fewer than 5 total shown
      if (popularPackages.length < 5 && Object.keys(packageNameMap).length > 0) {
        Object.entries(packageNameMap).forEach(([id, info]) => {
          if (popularPackages.length < 5 && !popularPackages.find(p => p.id === id)) {
            popularPackages.push({
              id,
              name: info.name,
              bookings: 0,
              revenue: 0,
              price: info.price
            });
          }
        });
      }
      
      // Still slice to 5 just in case
      popularPackages = popularPackages.slice(0, 5);

      setDashboardData({
        totalEarnings,
        totalOrders,
        totalIncome,
        monthlyOrders,
        yearlyOrders,
        monthlyEarnings,
        yearlyEarnings,
        bookings: makeupBookings,
        popularPackages,
        monthlyGrowth,
        monthlyIncomeGrowth
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Grid container spacing={gridSpacing}>

      {/* ===================== WELCOME BANNER ===================== */}
      <Grid size={12}>
        <WelcomeBanner />
      </Grid>

      {/* ===================== TOP CARDS ===================== */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <MakeupEarningCard
              isLoading={isLoading}
              totalEarnings={dashboardData.totalEarnings}
            />
          </Grid>

          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <MakeupOrderchart
              isLoading={isLoading}
              totalOrders={dashboardData.totalOrders}
              monthlyOrders={dashboardData.monthlyOrders}
              yearlyOrders={dashboardData.yearlyOrders}
              monthlyEarnings={dashboardData.monthlyEarnings}
              yearlyEarnings={dashboardData.yearlyEarnings}
            />
          </Grid>

          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <MakeupIncomeDarkCard
                  isLoading={isLoading}
                  totalIncome={dashboardData.totalIncome}
                />
              </Grid>

              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <MakeupIncomeLightCard
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

      {/* ===================== BOTTOM SECTION ===================== */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <MakeupGrowthBarChart
              isLoading={isLoading}
              monthlyGrowth={dashboardData.monthlyGrowth}
              monthlyIncomeGrowth={dashboardData.monthlyIncomeGrowth}
              totalEarnings={dashboardData.totalEarnings}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <MakeupPopularCard
              isLoading={isLoading}
              popularPackages={dashboardData.popularPackages}
              totalPackageRevenue={dashboardData.totalIncome}
            />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
}
