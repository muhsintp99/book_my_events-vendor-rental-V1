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

const cakeManagementMenu = {
  title: 'Cake Management',
  id: 'management-cake',
  type: 'group',
  icon: icons.IconBriefcase,
  children: [
    {
      id: 'cake-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'all-cake',
          title: 'All',
          type: 'item',
          url: '/bookings/allcake',
          icon: icons.IconDashboard
        },
        {
          id: 'pending-cake',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingcake',
          icon: icons.IconClock
        },
        {
          id: 'confirmed-cake',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/cakeconfirmed',
          icon: icons.IconUserCheck
        },
        {
          id: 'completed-cake',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedcake',
          icon: icons.IconGraph
        },
        {
          id: 'cancelled-cake',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledcake',
          icon: icons.IconKey
        },
        {
          id: 'payment-failed-cake',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedcake',
          icon: icons.IconCreditCard
        }
      ]
    }
  ]
};

export default cakeManagementMenu;
