import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import VehicleEarningCard from './VehicleEarningCard';
import VehiclePopularCard from './VehiclePopularCard';
import VehicleTotalRentChart from './vehicleTotalRentChart';
import VehicleTotalIncomeDarkCard from '../vehicledashboard/cards.jsx/VehicleTotalIncomeDarkCard';
import VehicleIncomeLightCard from '../vehicledashboard/cards.jsx/VehicleIncomeLightCard';
import VehicleTotalGrowthBarChart from './VehicleTotalGrowthBarChart';
import WelcomeBanner from '../vehicledashboard/WelcomeBanner';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';

// Helper to parse dates robustly (matches PremiumBookings logic)
const parseDate = (d) => {
  if (!d) return new Date(0);
  let date = new Date(d);
  if (isNaN(date.getTime()) && typeof d === 'string') {
    const parts = d.split(/[/-]/);
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        // Assume DD/MM/YYYY
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (parts[0].length === 4) {
        // Assume YYYY/MM/DD
        date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
      }
    }
  }
  return isNaN(date.getTime()) ? new Date(0) : date;
};

// ==============================|| VEHICLE DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    totalRentals: 0,
    totalIncome: 0,
    monthlyRentals: 0,
    yearlyRentals: 0,
    monthlyEarnings: 0,
    yearlyEarnings: 0,
    bookings: [],
    popularVehicles: [],
    monthlyGrowth: new Array(12).fill(0),
    monthlyIncomeGrowth: new Array(12).fill(0)
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const providerId = user?._id;
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

      // 2. Fetch All Vehicles
      let vehicleNameMap = {};
      try {
        const vehRes = await axios.get(`${API_BASE_URL}/api/vehicles/provider/${providerId}`, config);
        const vehicles = vehRes.data?.data || vehRes.data || [];
        if (Array.isArray(vehicles)) {
          vehicles.forEach((v) => {
            vehicleNameMap[v._id] = {
              name: v.name || v.title || 'Vehicle',
              price: v.pricing?.grandTotal || v.pricing?.perDay || v.pricing?.basicPackage?.price || 0
            };
          });
        }
      } catch (e) {
        console.warn('Vehicle list fetch failed:', e);
      }

      // 3. Filter Vehicle Bookings
      const vehicleBookings = allBookings.filter((b) => {
        const mType = String(b.moduleType || '').toLowerCase();
        return mType === 'vehicle' || mType === 'transport' || b.vehicleId;
      });

      // 4. Calculate Data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalEarnings = 0;
      let totalIncome = 0;
      let monthlyRentalsCount = 0;
      let yearlyRentalsCount = 0;
      let monthlyTotalValue = 0;
      let yearlyTotalValue = 0;
      const monthlyGrowth = new Array(12).fill(0);
      const monthlyIncomeGrowth = new Array(12).fill(0);
      const vehicleMap = {};

      vehicleBookings.forEach((b) => {
        // Robust date parsing (prioritize bookingDate for event value, createdAt for history)
        const bookingDate = parseDate(b.bookingDate || b.createdAt);
        const bMonth = bookingDate.getMonth();
        const bYear = bookingDate.getFullYear();
        
        const amount = parseFloat(b.finalPrice || b.totalAmount || b.packagePrice || 0);
        
        const status = String(b.status || '').toLowerCase();
        const payStatus = String(b.paymentStatus || '').toLowerCase();
        const isCompleted = ['completed', 'accepted', 'confirmed', 'done', 'approved'].includes(status);
        const isPaid = ['completed', 'paid', 'success'].includes(payStatus);

        // Current Year Statistics
        if (bYear === currentYear) {
          yearlyRentalsCount += 1;
          yearlyTotalValue += amount; // Sum ALL for year stats
          monthlyGrowth[bMonth] += 1;
          
          if (isPaid || isCompleted) {
            monthlyIncomeGrowth[bMonth] += amount;
          }

          if (bMonth === currentMonth) {
            monthlyRentalsCount += 1;
            monthlyTotalValue += amount; // Sum ALL for month stats
          }
        }

        // Totals (Left Card shows PAID/COMPLETED only)
        if (isPaid || isCompleted) totalEarnings += amount;
        if (isPaid) totalIncome += amount;

        // Popular Vehicle Mapping
        const vehIdStr = typeof b.vehicleId === 'object' ? b.vehicleId?._id : b.vehicleId;
        const vehId = vehIdStr || 'unknown';
        
        if (!vehicleMap[vehId]) {
          const info = vehicleNameMap[vehId];
          vehicleMap[vehId] = {
            id: vehId,
            name: info?.name || b.vehicleName || 'Vehicle Rental',
            price: info?.price || 0,
            bookings: 0,
            revenue: 0
          };
        }
        vehicleMap[vehId].bookings += 1;
        if (isPaid || isCompleted) {
          vehicleMap[vehId].revenue += amount;
        }
      });

      let popularVehicles = Object.values(vehicleMap)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      if (popularVehicles.length === 0 && Object.keys(vehicleNameMap).length > 0) {
        Object.entries(vehicleNameMap).slice(0, 5).forEach(([id, info]) => {
          popularVehicles.push({ id, name: info.name, bookings: 0, revenue: 0, price: info.price });
        });
      }

      setDashboardData({
        totalEarnings,
        totalRentals: vehicleBookings.length,
        totalIncome,
        monthlyRentals: monthlyRentalsCount,
        yearlyRentals: yearlyRentalsCount,
        monthlyEarnings: monthlyTotalValue, // Using Total Value for the middle card to avoid ₹0 confusion
        yearlyEarnings: yearlyTotalValue,
        bookings: vehicleBookings,
        popularVehicles,
        monthlyGrowth,
        monthlyIncomeGrowth
      });
    } catch (err) {
      console.error('Vehicle Dashboard data fetch error:', err);
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

      {/* TOP CARDS ROW */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <VehicleEarningCard isLoading={isLoading} totalEarnings={dashboardData.totalEarnings} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <VehicleTotalRentChart 
              isLoading={isLoading} 
              monthValue={dashboardData.monthlyEarnings}
              yearValue={dashboardData.yearlyEarnings}
              monthOrders={dashboardData.monthlyRentals}
              yearOrders={dashboardData.yearlyRentals}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <VehicleTotalIncomeDarkCard isLoading={isLoading} totalIncome={dashboardData.totalIncome} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <VehicleIncomeLightCard
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

      {/* BOTTOM SECTION ROW */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <VehicleTotalGrowthBarChart 
              isLoading={isLoading} 
              monthlyGrowth={dashboardData.monthlyGrowth}
              monthlyIncomeGrowth={dashboardData.monthlyIncomeGrowth}
              totalEarnings={dashboardData.totalEarnings}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <VehiclePopularCard 
              isLoading={isLoading} 
              vehicles={dashboardData.popularVehicles} 
              totalVehicleRevenue={dashboardData.totalIncome} 
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
