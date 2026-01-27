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

const boutiqueManagementMenu = {
  title: 'boutique Management',
  id: 'management-boutique',
  type: 'group',
  icon: icons.IconBriefcase,
  children: [
    {
      id: 'boutique-bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'all-boutique',
          title: 'All',
          type: 'item',
          url: '/bookings/allboutique',
          icon: icons.IconDashboard
        },
        {
          id: 'pending-boutique',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pendingboutique',
          icon: icons.IconClock
        },
        {
          id: 'confirmed-boutique',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/boutiqueconfirmed',
          icon: icons.IconUserCheck
        },
        {
          id: 'completed-boutique',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completedboutique',
          icon: icons.IconGraph
        },
        {
          id: 'cancelled-boutique',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/cancelledboutique',
          icon: icons.IconKey
        },
        {
          id: 'payment-failed-boutique',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/paymentfailedboutique',
          icon: icons.IconCreditCard
        }
      ]
    }
  ]
};

export default boutiqueManagementMenu;
