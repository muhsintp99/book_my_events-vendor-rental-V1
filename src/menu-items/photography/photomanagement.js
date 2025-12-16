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
  IconCalendar,
  IconCamera,
  IconPhoto
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
  IconCalendar,
  IconCamera,
  IconPhoto
};

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //

const photomanagement = {
  id: 'photo-management',
  title: 'PHOTOGRAPHY MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'photography-setup',
      title: 'Photography Setup',
      type: 'collapse',
      icon: icons.IconCamera, // 📸 Updated Photography Icon
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: 'photography/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'list',
          title: 'Package List',
          type: 'item',
          url: 'photography/packagelist',
          icon: icons.IconList
        },
        // {
        //   id: 'portfolio',
        //   title: 'Portfolio',
        //   type: 'item',
        //   url: 'photography/portfolio',
        //   icon: icons.IconPhoto // 🖼 Updated Portfolio Icon
        // }
      ]
    },

    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/venue/categories',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
     {
      id: 'portfolio',
      title: 'Portfolio',
      type: 'item',
      url: '/photography/portfolio',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
     {
      id: 'upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/photography/upgrade',
      icon: icons.IconCategory,
      breadcrumbs: false
    }
  ]
};

export default photomanagement;
