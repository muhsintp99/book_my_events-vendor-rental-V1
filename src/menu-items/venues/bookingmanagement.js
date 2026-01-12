// assets (Tabler Icons)
import {
  IconCalendarEvent,
  IconListDetails,
  IconClock,
  IconAlertCircle,
  IconCircleCheck,
  IconProgress,
  IconChecks,
  IconBan,
  IconCreditCardOff
} from '@tabler/icons-react';

// constants
const icons = {
  IconCalendarEvent,
  IconListDetails,
  IconClock,
  IconAlertCircle,
  IconCircleCheck,
  IconProgress,
  IconChecks,
  IconBan,
  IconCreditCardOff
};

// ==============================|| BOOKING MANAGEMENT MENU GROUP ||============================== //

const bookingmanagement = {
  title: 'BOOKING MANAGEMENT',
  id: 'bookingmanagement',
  type: 'group',
  children: [
    {
      id: 'bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconCalendarEvent, // 📅 All bookings
      children: [
        {
          id: 'all-bookings',
          title: 'All',
          type: 'item',
          url: '/bookings',
          icon: icons.IconListDetails // 📋 All list
        },
        {
          id: 'scheduled-booking',
          title: 'Scheduled',
          type: 'item',
          url: '/bookings/scheduled',
          icon: icons.IconClock // ⏰ Scheduled
        },
        {
          id: 'pending-bookings',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pending',
          icon: icons.IconAlertCircle // ⚠ Pending
        },
        {
          id: 'confirmed-bookings',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/confirmed',
          icon: icons.IconCircleCheck // ✅ Confirmed
        },
        {
          id: 'ongoing-bookings',
          title: 'Ongoing',
          type: 'item',
          url: '/bookings/ongoing',
          icon: icons.IconProgress // 🔄 Ongoing
        },
        {
          id: 'completed-bookings',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completed',
          icon: icons.IconChecks // ✔ Completed
        },
        {
          id: 'canceled-bookings',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/canceled',
          icon: icons.IconBan // 🚫 Cancelled
        },
        {
          id: 'payment-failed-bookings',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/payment-failed',
          icon: icons.IconCreditCardOff // 💳❌ Payment failed
        }
      ]
    }
  ]
};

export default bookingmanagement;
