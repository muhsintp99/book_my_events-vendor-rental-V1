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

// ==============================|| BOUNCERS MANAGEMENT MENU ||============================== //

const bouncersManagementMenu = {
  title: 'Bouncers & Securitys Management',
  id: 'bouncers-securitys',
  type: 'group',
  icon: icons.IconBriefcase,
  children: [
    {
      id: 'bouncers-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'all-bouncers',
          title: 'All',
          type: 'item',
          url: '/bookings/allbouncers',
          icon: icons.IconDashboard
        },
        {
          id: 'pending-bouncers',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingbouncers',
          icon: icons.IconClock
        },
        {
          id: 'confirmed-bouncers',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/bouncersconfirmed',
          icon: icons.IconUserCheck
        },
        {
          id: 'completed-bouncers',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedbouncers',
          icon: icons.IconGraph
        },
        {
          id: 'cancelled-bouncers',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledbouncers',
          icon: icons.IconKey
        },
        {
          id: 'payment-failed-bouncers',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedbouncers',
          icon: icons.IconCreditCard
        }
      ]
    }
  ]
};

export default bouncersManagementMenu;
