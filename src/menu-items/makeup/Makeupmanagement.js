// ==============================|| MAKEUP MANAGEMENT MENU ||============================== //

// Tabler Icons
import {
  IconBrush,        // Main makeup icon
  IconPalette,      // Makeup setup icon
  IconPlus,         // Add package icon
  IconListDetails,  // Makeup list icon
  IconCategory2     // Categories icon
} from '@tabler/icons-react';

// Icons object for easy access
const icons = {
  IconBrush,
  IconPalette,
  IconPlus,
  IconListDetails,
  IconCategory2
};

// Makeup Menu Structure
const makeupmanagement = {
  id: 'makeup-management',
  title: 'MAKEUP MANAGEMENT',
  type: 'group',
  icon: icons.IconBrush,        // Main group icon
  children: [
    {
      id: 'makeup-setup',
      title: 'Makeup Setup',
      type: 'collapse',
      icon: icons.IconPalette,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/makeupartist/addpackage',       // Fixed URL
          icon: icons.IconPlus
        },
        {
          id: 'makeup-list',
          title: 'Makeup List',
          type: 'item',
          url: '/makeupartist/packagelist',      // Fixed URL
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
      icon: icons.IconCategory2,
      breadcrumbs: false
    }
  ]
};

export default makeupmanagement;
