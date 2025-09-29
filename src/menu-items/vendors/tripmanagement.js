// assets
import {
  IconDashboard,
  IconUserPlus,
  IconUsers,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconFileText,
  IconVideo,
  IconBell,
  IconCalendarEvent,
  IconCreditCard,
  IconSettings,
  IconCalendar,
  IconUserCheck,
  IconClock,
  IconCurrencyDollar,
  IconKey,
  IconGraph
} from '@tabler/icons-react';

// constants
const icons = {
  IconDashboard,
  IconUserPlus,
  IconUsers,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconFileText,
  IconVideo,
  IconBell,
  IconCalendarEvent,
  IconCreditCard,
  IconSettings,
  IconCalendar,
  IconUserCheck,
  IconClock,
  IconCurrencyDollar,
  IconKey,
  IconGraph
};

// ==============================|| TRIP MANAGEMENT MENU GROUP ||============================== //

const tripmanagement = {
  title: 'TRIP MANAGEMENT',
  id: 'tripmanagement', // Fixed typo: was 'tripmanagemet'
  type: 'group',
  children: [
    {
      id: 'trips',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconBuildingSkyscraper,
      children: [
        {
          id: 'all-trips',
          title: 'All',
          type: 'item',
          url: '/trips'
        },
        {
          id: 'scheduled-trips',
          title: 'Scheduled',
          type: 'item',
          url: '/trips/scheduled'
        },
        {
          id: 'pending-trips',
          title: 'Pending',
          type: 'item',
          url: '/trips/pending'
        },
        {
          id: 'confirmed-trips',
          title: 'Confirmed',
          type: 'item',
          url: '/trips/confirmed'
        },
        {
          id: 'ongoing-trips',
          title: 'Ongoing',
          type: 'item',
          url: '/trips/ongoing'
        },
        {
          id: 'completed-trips',
          title: 'Completed',
          type: 'item',
          url: '/trips/completed'
        },
        {
          id: 'canceled-trips',
          title: 'Canceled',
          type: 'item',
          url: '/trips/canceled'
        },
        {
          id: 'payment-failed-trips',
          title: 'Payment Failed',
          type: 'item',
          url: '/trips/payment-failed'
        }
      ]
    }
  ]
};

export default tripmanagement;