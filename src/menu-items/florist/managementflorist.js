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

const floristManagementMenu = {
  title: 'florist& stage Management',
  id: 'florist-mehandi',
  type: 'group',
  icon: icons.IconBriefcase,
  children: [
    {
      id: 'florist-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'all-florist',
          title: 'All',
          type: 'item',
          url: '/bookings/allflorist',
          icon: icons.IconDashboard
        },
        {
          id: 'pending-florist',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingflorist',
          icon: icons.IconClock
        },
        {
          id: 'confirmed-florist',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/floristconfirmed',
          icon: icons.IconUserCheck
        },
        {
          id: 'completed-florist',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedflorist',
          icon: icons.IconGraph
        },
        {
          id: 'cancelled-florist',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledflorist',
          icon: icons.IconKey
        },
        {
          id: 'payment-failed-florist',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedflorist',
          icon: icons.IconCreditCard
        }
      ]
    }
  ]
};

export default floristManagementMenu;
