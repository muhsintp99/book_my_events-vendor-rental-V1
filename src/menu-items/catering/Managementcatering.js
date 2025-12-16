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

// ==============================|| CATERING MANAGEMENT MENU ||============================== //

const cateringManagementMenu = {
  title: 'Management',
  id: 'management-catering',
  type: 'group',
  children: [
    {
      id: 'catering-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconBuildingSkyscraper,
      children: [
        {
          id: 'all-catering',
          title: 'All',
          type: 'item',
          url: '/bookings/allcatering'
        },
        {
          id: 'pending-catering',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingcatering'
        },
        {
          id: 'confirmed-catering',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/cateringconfirmed'
        },
        {
          id: 'completed-catering',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedcatering'
        },
        {
          id: 'cancelled-catering',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledcatering'
        },
        {
          id: 'payment-failed-catering',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedcatering'
        }
      ]
    }
  ]
};

export default cateringManagementMenu;
