import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import VenueEarningCard from './VenueEarningCard';
import VenuePopularCard from './VenuePopularCard';
import VenueTotalBookingsChart from './VenueTotalBookingsChart';
import VenueTotalIncomeDarkCard from './cards.jsx/VenueTotalIncomeDarkCard';
import VenueIncomeLightCard from './cards.jsx/VenueIncomeLightCard';
import VenueTotalGrowthBarChart from './VenueTotalGrowthBarChart';
import WelcomeBanner from '../vehicledashboard/WelcomeBanner';

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

// ==============================|| VENUE DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    totalIncome: 0,
    monthlyBookings: 0,
    yearlyBookings: 0,
    monthlyEarnings: 0,
    yearlyEarnings: 0,
    bookings: [],
    popularVenues: [],
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

      // 2. Fetch All Venues
      let venueNameMap = {};
      try {
        const venRes = await axios.get(`${API_BASE_URL}/api/venues/provider/${providerId}`, config);
        const venues = venRes.data?.data || venRes.data || [];
        if (Array.isArray(venues)) {
          venues.forEach((v) => {
            venueNameMap[v._id] = {
              name: v.venueName || v.name || v.title || 'Venue',
              price: v.perDayPrice || v.hourlyPrice || 0
            };
          });
        }
      } catch (e) {
        console.warn('Venue list fetch failed:', e);
      }

      // 3. Filter Venue Bookings
      const venueBookings = allBookings.filter((b) => {
        const mType = String(b.moduleType || '').toLowerCase();
        return mType === 'venue' || mType === 'venues' || b.venueId;
      });

      // 4. Calculate Data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalEarnings = 0;
      let totalIncome = 0;
      let monthlyBookingsCount = 0;
      let yearlyBookingsCount = 0;
      let monthlyTotalValue = 0;
      let yearlyTotalValue = 0;
      const monthlyGrowth = new Array(12).fill(0);
      const monthlyIncomeGrowth = new Array(12).fill(0);
      const venueMap = {};

      venueBookings.forEach((b) => {
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
          yearlyBookingsCount += 1;
          yearlyTotalValue += amount;
          monthlyGrowth[bMonth] += 1;
          
          if (isPaid || isCompleted) {
            monthlyIncomeGrowth[bMonth] += amount;
          }

          if (bMonth === currentMonth) {
            monthlyBookingsCount += 1;
            monthlyTotalValue += amount;
          }
        }

        // Totals
        if (isPaid || isCompleted) totalEarnings += amount;
        if (isPaid) totalIncome += amount;

        // Popular Venue Mapping
        const venIdStr = typeof b.venueId === 'object' ? b.venueId?._id : (b.venueId || b.packageId);
        const venId = venIdStr || 'unknown';
        
        if (!venueMap[venId]) {
          const info = venueNameMap[venId];
          venueMap[venId] = {
            id: venId,
            name: info?.name || b.venueName || 'Venue Rental',
            price: info?.price || 0,
            bookings: 0,
            revenue: 0
          };
        }
        venueMap[venId].bookings += 1;
        if (isPaid || isCompleted) {
          venueMap[venId].revenue += amount;
        }
      });

      let popularVenues = Object.values(venueMap)
        .sort((a, b) => b.bookings - a.bookings);

      // Fill with other available venues if we have fewer than 5 total shown
      if (popularVenues.length < 5 && Object.keys(venueNameMap).length > 0) {
        Object.entries(venueNameMap).forEach(([id, info]) => {
          if (popularVenues.length < 5 && !popularVenues.find(v => v.id === id)) {
            popularVenues.push({ 
                id, 
                name: info.name, 
                bookings: 0, 
                revenue: 0, 
                price: info.price 
            });
          }
        });
      }
      
      popularVenues = popularVenues.slice(0, 5);

      setDashboardData({
        totalEarnings,
        totalBookings: venueBookings.length,
        totalIncome,
        monthlyBookings: monthlyBookingsCount,
        yearlyBookings: yearlyBookingsCount,
        monthlyEarnings: monthlyTotalValue,
        yearlyEarnings: yearlyTotalValue,
        bookings: venueBookings,
        popularVenues,
        monthlyGrowth,
        monthlyIncomeGrowth
      });
    } catch (err) {
      console.error('Venue Dashboard data fetch error:', err);
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
            <VenueEarningCard isLoading={isLoading} totalEarnings={dashboardData.totalEarnings} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <VenueTotalBookingsChart 
              isLoading={isLoading} 
              monthValue={dashboardData.monthlyEarnings}
              yearValue={dashboardData.yearlyEarnings}
              monthOrders={dashboardData.monthlyBookings}
              yearOrders={dashboardData.yearlyBookings}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <VenueTotalIncomeDarkCard isLoading={isLoading} totalIncome={dashboardData.totalIncome} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <VenueIncomeLightCard
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
            <VenueTotalGrowthBarChart 
              isLoading={isLoading} 
              monthlyGrowth={dashboardData.monthlyGrowth}
              monthlyIncomeGrowth={dashboardData.monthlyIncomeGrowth}
              totalEarnings={dashboardData.totalEarnings}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <VenuePopularCard 
              isLoading={isLoading} 
              venues={dashboardData.popularVenues} 
              totalVenueRevenue={dashboardData.totalIncome} 
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
