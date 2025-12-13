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

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //

const management = {
  title: 'Management',
  id: 'makeupmanagemet',
  type: 'group',
  children: [
    {
      id: 'Makeup',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconBuildingSkyscraper,
      children: [
        {
          id: 'all-makeup',
          title: 'All',
          type: 'item',
          url: '/bookings/all'
        },
        {
          id: 'pending-makeup',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pending'
        },
        {
          id: 'confirmed-makeup',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/makeupconfirmed'
        },
        {
          id: 'completed-makeup',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedmakeup'
        },
        {
          id: 'cancelled-makeup',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledmakeup'
        },
        {
          id: 'payment-failed-makeup',
          title: 'Payment failed',
          type: 'item',
          url: '/bookings/paymentfailedmakeup'
        }
      ]
    }
  ]
};

export default management;