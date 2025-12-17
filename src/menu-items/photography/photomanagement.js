// ==============================|| PHOTOGRAPHY MANAGEMENT MENU ||============================== //

// Tabler Icons
import {
  IconCamera,
  IconSettings,
  IconPlus,
  IconListDetails,
  IconCategory2,
  IconPhoto,
  IconRocket,
  IconMessageCircle
} from '@tabler/icons-react';

// Icons object
const icons = {
  IconCamera,
  IconSettings,
  IconPlus,
  IconListDetails,
  IconCategory2,
  IconPhoto,
  IconRocket,
  IconMessageCircle
};

const photomanagement = {
  id: 'photo-management',
  title: 'PHOTOGRAPHY MANAGEMENT',
  type: 'group',
  icon: icons.IconCamera,
  children: [
    {
      id: 'photography-setup',
      title: 'Photography Setup',
      type: 'collapse',
      icon: icons.IconSettings,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/photography/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'list',
          title: 'Package List',
          type: 'item',
          url: '/photography/packagelist',
          icon: icons.IconListDetails
        }
      ]
    },

    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/venue/categories',
      icon: icons.IconCategory2,
      breadcrumbs: false
    },

    {
      id: 'portfolio',
      title: 'Portfolio',
      type: 'item',
      url: '/photography/portfolio',
      icon: icons.IconPhoto,
      breadcrumbs: false
    },

    {
      id: 'upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/photography/upgrade',
      icon: icons.IconRocket,
      breadcrumbs: false
    },

    {
      id: 'enquiry',
      title: 'Enquiries',
      type: 'item',
      url: '/photography/enquiry',
      icon: icons.IconMessageCircle,
      breadcrumbs: false
    }
  ]
};

export default photomanagement;
