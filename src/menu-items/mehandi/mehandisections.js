// assets
import {
  IconUserPlus,
  IconUserCheck,
  IconUsers,
  IconUpload,
  IconDownload
} from '@tabler/icons-react';

// constants
const icons = {
  IconUserPlus,
  IconUserCheck,
  IconUsers,
  IconUpload,
  IconDownload
};

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //
const mehandisection = {
  id: 'business-management', // Changed to unique ID
  title: 'MEHANDI SECTION',
  type: 'group',
  children: [
    // {
    //   id: 'Provider-Config',
    //   title: 'Provider Config',
    //   type: 'item',
    //   url: '/business/new',
    //   icon: icons.IconUserPlus,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'Notification-SetUP',
    //   title: 'Notification Set UP',
    //   type: 'item',
    //   url: '/business/add',
    //   icon: icons.IconUserCheck,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'My-venue',
    //   title: 'My Venue',
    //   type: 'item',
    //   url: '/business/myshop',
    //   icon: icons.IconUsers,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'My-Business-Plan',
    //   title: 'My Business Plan',
    //   type: 'item',
    //   url: '/business/plan',
    //   icon: icons.IconUpload,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'My-Wallet',
    //   title: 'My Wallet',
    //   type: 'item',
    //   url: '/business/export',
    //   icon: icons.IconDownload,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'Disbursement-Method',
    //   title: 'Disbursement Method',
    //   type: 'item',
    //   url: '/business/disburse',
    //   icon: icons.IconDownload,
    //   breadcrumbs: false
    // },
    {
      id: 'Reviews',
      title: 'Reviews',
      type: 'item',
      url: '/business/review',
      icon: icons.IconDownload,
      breadcrumbs: false
    },
    // {
    //   id: 'Chat',
    //   title: 'Chat',
    //   type: 'item',
    //   url: '/business/chat',
    //   icon: icons.IconDownload,
    //   breadcrumbs: false
    // }
  ]
};

export default mehandisection;