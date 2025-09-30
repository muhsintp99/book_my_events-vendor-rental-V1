




// assets
import {
  IconVenus,
  IconCategory,
  IconTrademark,
  IconPlus,
  IconList,
  IconClipboardCheck,
  IconUpload,
  IconDownload,
  IconEngine,
  IconCalendar
} from '@tabler/icons-react';

// constants
const icons = {
  IconVenus,
  IconCategory,
  IconTrademark,
  IconPlus,
  IconList,
  IconClipboardCheck,
  IconUpload,
  IconDownload,
  IconEngine,
  IconCalendar
};

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //

const venuemanagement = {
  id: 'venue-management',
  title: 'VENUE MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'venue-setup',
      title: 'Venue Setup',
      type: 'collapse',
      icon: icons.IconVenus, // updated icon
      children: [
        {
          id: 'create-new',
          title: 'Create New',
          type: 'item',
          url: '/venue-setup/new'  // matches MainRoutes
        },
        {
          id: 'list',
          title: 'List',
          type: 'item',
          url: '/venue-setup/lists'
        },
        {
          id: 'bulk-import',
          title: 'Bulk Import',
          type: 'item',
          url: '/venue-setup/bulk-import'
        },
        {
          id: 'bulk-export',
          title: 'Bulk Export',
          type: 'item',
          url: '/venue-setup/bulk-export'
        }
      ]
    },
    // {
    //   id: 'venue-brands',
    //   title: 'Brands',
    //   type: 'item',
    //   url: '/vehicles/brands',
    //   icon: icons.IconTrademark,
    //   breadcrumbs: false
    // },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/venue/categories',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
     {
      id: 'schedules',
      title: 'Schedules',
      type: 'item',
      url: '/venue/schedules',
      icon: icons.IconCalendar,
      breadcrumbs: false
    }
  ]
};

export default venuemanagement;
