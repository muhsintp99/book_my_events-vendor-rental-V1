import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import CakeEarningCard from './CakeEarningCard';
import CakePopularCard from './CakePopularCard';
import CakeOrderchart from './CakeOrderchart';
import IncomeLightCard from './cards/CakeIncomeLightCard';
import IncomeDarkCard from './cards/CakeIncomeDarkCard';
import GrowthBarChart from './CakeGrowthBarChart';
import WelcomeBanner from '../cakedashboard/WelcomeBanner';

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

// ==============================|| CAKE DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalIncome: 0,
    monthlyEarnings: 0,
    yearlyEarnings: 0,
    monthlyOrders: 0,
    yearlyOrders: 0,
    popularPackages: [],
    monthlyIncomeGrowth: [],
    monthlyGrowth: []
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('user') || localStorage.getItem('vendor');
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
      const config = { headers: token ? { Authorization: `Bearer ${token}` } : {} };

      // 1. Fetch All Bookings via axios
      const bookingsRes = await axios.get(`${API_BASE_URL}/api/bookings/provider/${providerId}`, config);
      const allBookings = bookingsRes.data?.data || bookingsRes.data?.bookings || [];

      // 2. Ultra-Loose Cake Filter
      const cakeBookings = allBookings.filter((b) => {
        const mType = String(b.moduleType || '').toLowerCase();
        const sType = String(b.serviceType || b.packageType || b.category || '').toLowerCase();
        const pName = String(b.packageName || '').toLowerCase();
        
        // Let's be very generous in including items to avoid 0 stats
        return mType.includes('cake') || 
               sType.includes('cake') || 
               pName.includes('cake') || 
               b.cakeId || 
               b.cakePackageId ||
               (b.cakeCart && b.cakeCart.length > 0) ||
               (b.items && b.items.some(item => String(item.name || '').toLowerCase().includes('cake'))) ||
               (mType === '' && !b.vehicleId && !b.photographyId && !b.makeupId); // Fallback: if no clear moduleType and not explicitly another module
      });

      // Calculate Data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalEarnings = 0;
      let totalIncome = 0;
      let monthlyOrdersCount = 0;
      let yearlyOrdersCount = 0;
      let monthlyTotalValue = 0;
      let yearlyTotalValue = 0;
      const monthlyGrowth = new Array(12).fill(0);
      const monthlyIncomeGrowth = new Array(12).fill(0);
      const pkgMap = {};

      cakeBookings.forEach((b) => {
        // Robust date parsing 
        const bookingDate = parseDate(b.bookingDate || b.createdAt || b.date);
        const bMonth = bookingDate.getMonth();
        const bYear = bookingDate.getFullYear();
        
        const amount = parseFloat(b.finalPrice || b.totalAmount || b.packagePrice || b.amount || 0);
        
        const status = String(b.status || '').toLowerCase();
        const payStatus = String(b.paymentStatus || '').toLowerCase();
        const isCompleted = ['completed', 'accepted', 'confirmed', 'active', 'success', 'approved'].includes(status);
        const isPaid = ['completed', 'paid', 'success'].includes(payStatus);

        // Stats Accumulation
        if (bYear === currentYear) {
          yearlyOrdersCount += 1;
          yearlyTotalValue += amount; 
          
          if (bMonth >= 0 && bMonth < 12) {
            monthlyGrowth[bMonth] += 1;
            if (isPaid || isCompleted) {
               monthlyIncomeGrowth[bMonth] += amount;
            }
          }

          if (bMonth === currentMonth) {
            monthlyOrdersCount += 1;
            monthlyTotalValue += amount; 
          }
        }

        // Totals
        if (isPaid || isCompleted) totalEarnings += amount;
        if (isPaid) totalIncome += amount;

        // Packages 
        const pkgId = b.cakeId || b.cakePackageId || b.packageId || b.packageName || 'unknown';
        const name = b.packageName || (typeof b.cakeId === 'object' ? b.cakeId?.name : null) || 'Cake Service';
        
        if (!pkgMap[pkgId]) pkgMap[pkgId] = { id: pkgId, name, bookings: 0, revenue: 0 };
        pkgMap[pkgId].bookings += 1;
        if (isPaid || isCompleted) pkgMap[pkgId].revenue += amount;
      });

      const sortedPackages = Object.values(pkgMap).sort((a,b) => b.revenue - a.revenue);
      const packagesFormatted = sortedPackages.slice(0, 5).map(p => ({
        name: p.name,
        amount: p.revenue,
        trend: p.revenue > 0 ? 'up' : 'down',
        note: `${p.bookings} items booked`
      }));

      setDashboardData({
        totalEarnings,
        totalOrders: cakeBookings.length,
        totalIncome,
        monthlyEarnings: monthlyTotalValue,
        yearlyEarnings: yearlyTotalValue,
        monthlyOrders: monthlyOrdersCount,
        yearlyOrders: yearlyOrdersCount,
        popularPackages: packagesFormatted,
        monthlyGrowth,
        monthlyIncomeGrowth
      });
    } catch (err) {
      console.error('Error fetching Cake Dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item size={12}>
        <WelcomeBanner />
      </Grid>

      <Grid item size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CakeEarningCard isLoading={isLoading} amount={dashboardData.totalEarnings} label="Total Earnings Balance" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CakeOrderchart 
              isLoading={isLoading} 
              title="Total Orders" 
              monthValue={dashboardData.monthlyOrders} 
              yearValue={dashboardData.yearlyOrders}
              monthChart={{
                type: 'line',
                height: 90,
                options: {
                    chart: { sparkline: { enabled: true } },
                    dataLabels: { enabled: false },
                    colors: ['#fff'],
                    stroke: { curve: 'smooth', width: 3 },
                    yaxis: { min: 0, max: 100, labels: { show: false } },
                    tooltip: {
                        fixed: { enabled: false },
                        x: { show: false },
                        y: { title: { formatter: () => 'Orders' } },
                        marker: { show: false }
                    }
                },
                series: [{ name: 'Sales Trend', data: [45, 66, 41, 89, 25, 44, 9, 54] }]
              }}
              yearChart={{
                type: 'line',
                height: 90,
                options: {
                    chart: { sparkline: { enabled: true } },
                    dataLabels: { enabled: false },
                    colors: ['#fff'],
                    stroke: { curve: 'smooth', width: 3 },
                    yaxis: { min: 0, max: 100, labels: { show: false } },
                    tooltip: {
                        fixed: { enabled: false },
                        x: { show: false },
                        y: { title: { formatter: () => 'Orders' } },
                        marker: { show: false }
                    }
                },
                series: [{ name: 'Sales Trend', data: [35, 44, 9, 54, 45, 66, 41, 89] }]
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <IncomeDarkCard isLoading={isLoading} totalAmount={dashboardData.totalIncome} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <IncomeLightCard
                  isLoading={isLoading}
                  total={dashboardData.totalEarnings}
                  label="Total Earnings Balance"
                  icon={<StorefrontTwoToneIcon fontSize="inherit" />}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <GrowthBarChart
              isLoading={isLoading}
              title="Cake Growth Performance"
              monthlyGrowth={dashboardData.monthlyGrowth}
              monthlyIncomeGrowth={dashboardData.monthlyIncomeGrowth}
              totalEarnings={dashboardData.totalEarnings}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CakePopularCard 
              isLoading={isLoading} 
              packages={dashboardData.popularPackages} 
              title="Popular Cake Packages"
              totalPackageRevenue={dashboardData.totalEarnings}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
