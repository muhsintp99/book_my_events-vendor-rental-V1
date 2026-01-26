// assets
import {
  IconDiamond,        // Ornaments / Jewelry
  IconPackage,        // Package
  IconPlus,           // Add
  IconListDetails,    // List
  IconTags,           // Categories
  IconSettings,       // Upgrade / Settings
  IconCalendarEvent,  // Schedules
  IconMessageCircle   // Enquiries
} from '@tabler/icons-react';

// constants
const icons = {
  IconDiamond,
  IconPackage,
  IconPlus,
  IconListDetails,
  IconTags,
  IconSettings,
  IconCalendarEvent,
  IconMessageCircle
};

// ==============================|| ORNAMENTS MANAGEMENT MENU ||============================== //

const ornamentsmanagement = {
  id: 'ornaments-management',
  title: 'ORNAMENTS MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'ornaments-setup',
      title: 'Ornaments Setup',
      type: 'collapse',
      icon: icons.IconDiamond,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/ornaments/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'package-list',
          title: 'Package List',
          type: 'item',
          url: '/ornaments/packagelist',
          icon: icons.IconListDetails
        }
      ]
    },

    {
      id: 'ornaments-categories',
      title: 'Categories',
      type: 'item',
      url: '/ornaments/categories',
      icon: icons.IconTags,
      breadcrumbs: false
    },

    {
      id: 'ornaments-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/ornaments/upgrade',
      icon: icons.IconSettings,
      breadcrumbs: false
    },

    {
      id: 'ornaments-schedules',
      title: 'Schedules',
      type: 'item',
      url: '/ornaments/schedules',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    },

    {
      id: 'ornaments-enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/ornaments/enquiry',
      icon: icons.IconMessageCircle,
      breadcrumbs: false
    }
  ]
};

export default ornamentsmanagement;
