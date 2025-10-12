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

const picmanagement = {
  id: 'photography-section',
  title: 'PHOTOGRAPHY SECTION',
  type: 'group',
  children: [
    {
      id: 'photography-setup',
      title: 'Photography Setup',
      type: 'collapse',
      icon: icons.IconCar, // updated icon
      children: [
        {
          id: 'create',
          title: 'Create',
          type: 'item',
          url: '/photo-setup/new'  // matches MainRoutes
        },
        {
          id: 'list',
          title: 'List',
          type: 'item',
          url: '/photo-setup/list'
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
    }
  ]
};

export default picmanagement;
