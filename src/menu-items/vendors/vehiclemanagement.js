// assets
import {
  IconCar,
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
  IconCar,
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

const vehiclemanagement = {
  id: 'vehicle-management',
  title: 'VEHICLE MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'vehicle-setup',
      title: 'Vehicle Setup',
      type: 'collapse',
      icon: icons.IconCar, // updated icon
      children: [
        {
          id: 'create-new',
          title: 'Create New',
          type: 'item',
          url: '/vehicle-setup/leads'  // matches MainRoutes
        },
        {
          id: 'list',
          title: 'List',
          type: 'item',
          url: '/vehicle-setup/lists'
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
    {
      id: 'vehicle-brands',
      title: 'Brands',
      type: 'item',
      url: '/vehicles/brands',
      icon: icons.IconTrademark,
      breadcrumbs: false
    },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/vehicles/categories',
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
      id: 'upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/vehicles/upgrade',
      icon: icons.IconCalendar,
      breadcrumbs: false
    }
  ]
};

export default vehiclemanagement;
