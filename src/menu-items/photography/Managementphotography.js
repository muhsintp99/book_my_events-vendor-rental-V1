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

const photographyManagementMenu = {
  title: 'Management',
  id: 'management-photography',
  type: 'group',
  children: [
    {
      id: 'photography-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconBuildingSkyscraper,
      children: [
        {
          id: 'all-photography',
          title: 'All',
          type: 'item',
          url: '/bookings/allphotography'
        },
        {
          id: 'pending-catering',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingphotography'
        },
        {
          id: 'confirmed-catering',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/photographyconfirmed'
        },
        // {
        //   id: 'completed-catering',
        //   title: 'Completed',
        //   type: 'item',
        //   url: '/bookings/completedphotography'
        // },
        {
          id: 'cancelled-catering',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledphotography'
        },
        {
          id: 'payment-failed-catering',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedphotography'
        }
      ]
    }
  ]
};

export default photographyManagementMenu;
