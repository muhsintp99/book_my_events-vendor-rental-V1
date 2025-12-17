




// assets
import {
  IconBuilding,
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
  IconBuilding,
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
      icon: icons.IconBuilding, // updated icon
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
          id: 'food-menu',
          title: 'Food Menu',
          type: 'item',
          url: '/venue-setup/foodmenu'
        },
        {
          id: 'bulk-import',
          title: 'Bulk Import',
          type: 'item',
          url: '/page-not-found'
        },
        {
          id: 'bulk-export',
          title: 'Bulk Export',
          type: 'item',
          url: '/page-not-found'
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
    },
     {
      id: 'Vnueupgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/venue/upgrade',
      icon: icons.IconCalendar,
      breadcrumbs: false
    },
    //  {
    //   id: 'Venueenquiries',
    //   title: 'Enquiries',
    //   type: 'item',
    //   url: '/venue/enquiries',
    //   icon: icons.IconCalendar,
    //   breadcrumbs: false
    // },
    //  {
    //   id: 'Venueenquirieschat',
    //   title: 'Enquiries chat',
    //   type: 'item',
    //   url: '/venue/enquirieschat',
    //   icon: icons.IconCalendar,
    //   breadcrumbs: false
    // }
  ]
};

export default venuemanagement;
