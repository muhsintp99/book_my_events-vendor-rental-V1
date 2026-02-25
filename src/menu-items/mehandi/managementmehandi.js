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

const mehandiManagementMenu = {
  title: 'mehandi Management',
  id: 'management-mehandi',
  type: 'group',
  icon: icons.IconBriefcase,
  children: [
    {
      id: 'mehandi-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'all-mehandi',
          title: 'All',
          type: 'item',
          url: '/bookings/allmehandi',
          icon: icons.IconDashboard
        },
        {
          id: 'pending-mehandi',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingmehandi',
          icon: icons.IconClock
        },
        {
          id: 'confirmed-mehandi',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/mehandiconfirmed',
          icon: icons.IconUserCheck
        },
        {
          id: 'completed-mehandi',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedmehandi',
          icon: icons.IconGraph
        },
        {
          id: 'cancelled-mehandi',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledmehandi',
          icon: icons.IconKey
        },
        {
          id: 'payment-failed-mehandi',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedmehandi',
          icon: icons.IconCreditCard
        }
      ]
    }
  ]
};

export default mehandiManagementMenu;
