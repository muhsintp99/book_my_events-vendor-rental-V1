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
const Reportssection = {
  id: 'report-management', // Changed to unique ID
  title: 'REPORT SECTION',
  type: 'group',
  children: [
    {
      id: 'sales-Report',
      title: 'Sales Report',
      type: 'item',
      url: '/report/venueexp',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'Disbursement-Method',
      title: 'Disbursement Method',
      type: 'item',
      url: '/report/disbursement',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'Venue-Report',
      title: 'Venue Report',
      type: 'item',
      url: '/report/venuereport',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'tax-Report',
      title: 'Tax Report',
      type: 'item',
      url: '/report/venuetax',
      icon: icons.IconUpload,
      breadcrumbs: false
    },
    // {
    //   id: 'bulk-export',
    //   title: 'Bulk Export',
    //   type: 'item',
    //   url: '/providers/export',
    //   icon: icons.IconDownload,
    //   breadcrumbs: false
    // }
  ]
};

export default Reportssection;