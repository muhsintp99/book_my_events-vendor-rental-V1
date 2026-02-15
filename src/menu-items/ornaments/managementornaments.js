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

const ornamentsManagementMenu = {
  title: 'ornaments Management',
  id: 'management-ornaments',
  type: 'group',
  icon: icons.IconBriefcase,
  children: [
    {
      id: 'ornaments-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'all-ornaments',
          title: 'All',
          type: 'item',
          url: '/bookings/allornaments',
          icon: icons.IconDashboard
        },
        {
          id: 'pending-ornaments',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingornaments',
          icon: icons.IconClock
        },
        {
          id: 'confirmed-ornaments',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/ornamentsconfirmed',
          icon: icons.IconUserCheck
        },
        // {
        //   id: 'completed-ornaments',
        //   title: 'Completed',
        //   type: 'item',
        //   url: '/bookings/completedornaments',
        //   icon: icons.IconGraph
        // },
        {
          id: 'cancelled-ornaments',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledornaments',
          icon: icons.IconKey
        },
        {
          id: 'payment-failed-ornaments',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedornaments',
          icon: icons.IconCreditCard
        }
      ]
    }
  ]
};

export default ornamentsManagementMenu;
