// // assets
// import {
//   IconCar,
//   IconCategory,
//   IconTrademark,
//   IconPlus,
//   IconList,
//   IconClipboardCheck,
//   IconUpload,
//   IconDownload,
//   IconEngine
// } from '@tabler/icons-react';

// // constants
// const icons = {
//   IconCar,
//   IconCategory,
//   IconTrademark,
//   IconPlus,
//   IconList,
//   IconClipboardCheck,
//   IconUpload,
//   IconDownload,
//   IconEngine
// };

// // ==============================|| DASHBOARD FULL MENU GROUP ||============================== //

// const bookingmanagement = {
//   id: 'venue-management',
//   title: 'VENUE MANAGEMENT',
//   type: 'group',
//   children: [
//     {
//       id: 'venue-setup',
//       title: 'Venue Setup',
//       type: 'collapse',
//       icon: icons.IconCar, // updated icon
//       children: [
//         {
//           id: 'create-new',
//           title: 'Create New',
//           type: 'item',
//           url: '/vehicle-setup/leads'  // matches MainRoutes
//         },
//         {
//           id: 'list',
//           title: 'List',
//           type: 'item',
//           url: '/vehicle-setup/lists'
//         },
//         {
//           id: 'bulk-import',
//           title: 'Bulk Import',
//           type: 'item',
//           url: '/vehicle-setup/bulk-import'
//         },
//         {
//           id: 'bulk-export',
//           title: 'Bulk Export',
//           type: 'item',
//           url: '/vehicle-setup/bulk-export'
//         }
//       ]
//     },
//     // {
//     //   id: 'venue-brands',
//     //   title: 'Brands',
//     //   type: 'item',
//     //   url: '/vehicles/brands',
//     //   icon: icons.IconTrademark,
//     //   breadcrumbs: false
//     // },
//     {
//       id: 'categories',
//       title: 'Categories',
//       type: 'item',
//       url: '/vehicles/categories',
//       icon: icons.IconCategory,
//       breadcrumbs: false
//     }
//   ]
// };

// export default bookingmanagement;



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

// ==============================|| TRIP MANAGEMENT MENU GROUP ||============================== //

const bookingmanagement= {
  title: 'BOOKING MANAGEMENT',
  id: 'bookingmanagement', // Fixed typo: was 'tripmanagemet'
  type: 'group',
  children: [
    {
      id: 'bookings',
      title: 'Bookings',
      type: 'collapse',
      icon: icons.IconBuildingSkyscraper,
      children: [
        {
          id: 'all-bookings',
          title: 'All',
          type: 'item',
          url: '/bookings'
        },
        {
          id: 'scheduled-booking',
          title: 'Scheduled',
          type: 'item',
          url: '/bookings/scheduled'
        },
        {
          id: 'pending-bookings',
          title: 'Pending',
          type: 'item',
          url: '/bookings/pending'
        },
        {
          id: 'confirmed-bookings',
          title: 'Confirmed',
          type: 'item',
          url: '/bookings/confirmed'
        },
        {
          id: 'ongoing-bookings',
          title: 'Ongoing',
          type: 'item',
          url: '/bookings/ongoing'
        },
        {
          id: 'completed-bookings',
          title: 'Completed',
          type: 'item',
          url: '/bookings/completed'
        },
        {
          id: 'canceled-bookings',
          title: 'Canceled',
          type: 'item',
          url: '/bookings/canceled'
        },
        {
          id: 'payment-failed-bookings',
          title: 'Payment Failed',
          type: 'item',
          url: '/bookings/payment-failed'
        }
      ]
    }
  ]
};

export default bookingmanagement;
