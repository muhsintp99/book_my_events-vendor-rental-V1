// ==============================|| MAKEUP MANAGEMENT MENU ||============================== //

// Tabler Icons
import {
  IconBrush,
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
  IconBrush,
  IconSettings,
  IconPlus,
  IconListDetails,
  IconCategory2,
  IconPhoto,
  IconRocket,
  IconMessageCircle
};

// Makeup Menu Structure
const makeupmanagement = {
  id: 'makeup-management',
  title: 'MAKEUP MANAGEMENT',
  type: 'group',
  icon: icons.IconBrush,
  children: [
    {
      id: 'makeup-setup',
      title: 'Makeup Setup',
      type: 'collapse',
      icon: icons.IconSettings,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/makeupartist/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'makeup-list',
          title: 'Makeup List',
          type: 'item',
          url: '/makeupartist/packagelist',
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
      url: '/makeupartist/portfolio',
      icon: icons.IconPhoto,
      breadcrumbs: false
    },

    {
      id: 'upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/makeupartist/upgrade',
      icon: icons.IconRocket,
      breadcrumbs: false
    },

    {
      id: 'enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/makeupartist/Enqury',
      icon: icons.IconMessageCircle,
      breadcrumbs: false
    }
  ]
};

export default makeupmanagement;
