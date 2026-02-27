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

// ==============================|| CAKE MANAGEMENT MENU ||============================== //

const lightManagementMenu = {
  title: 'light& sound Management',
  id: 'light-sound',
  type: 'group',
  icon: icons.IconBriefcase,
  children: [
    {
      id: 'light-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'all-light',
          title: 'All',
          type: 'item',
          url: '/bookings/alllight',
          icon: icons.IconDashboard
        },
        {
          id: 'pending-light',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendinglight',
          icon: icons.IconClock
        },
        {
          id: 'confirmed-light',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/lightconfirmed',
          icon: icons.IconUserCheck
        },
        {
          id: 'completed-light',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedlight',
          icon: icons.IconGraph
        },
        {
          id: 'cancelled-light',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledlight',
          icon: icons.IconKey
        },
        {
          id: 'payment-failed-light',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedlight',
          icon: icons.IconCreditCard
        }
      ]
    }
  ]
};

export default lightManagementMenu;
