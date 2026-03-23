import {
  IconFlower,          // Florist Setup
  IconPackage,         // Add Package
  IconListDetails,     // Package List
  IconCategory,        // Categories
  IconCrown,           // Upgrade
  IconPhoto,           // Portfolio
  IconCalendarEvent,   // Schedules
  IconMessageCircle    // Enquiries
} from '@tabler/icons-react';

const icons = {
  IconFlower,
  IconPackage,
  IconListDetails,
  IconCategory,
  IconCrown,
  IconPhoto,
  IconCalendarEvent,
  IconMessageCircle
};

const floristmanagement = {
  id: 'florist-management',
  title: 'FLORIST & STAGE MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'florist-setup',
      title: 'FLORIST & STAGE SETUP',
      type: 'collapse',
      icon: icons.IconFlower,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/florist/addpackage',
          icon: icons.IconPackage
        },
        {
          id: 'package-list',
          title: 'Package List',
          type: 'item',
          url: '/florist/packagelist',
          icon: icons.IconListDetails
        }
      ]
    },
    {
      id: 'florist-categories',
      title: 'Categories',
      type: 'item',
      url: '/florist/categories',
      icon: icons.IconCategory
    },
    {
      id: 'florist-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/florist/upgrade',
      icon: icons.IconCrown
    },
    {
      id: 'florist-portfolio',
      title: 'Portfolio',
      type: 'item',
      url: '/florist/portfolio',
      icon: icons.IconPhoto
    },
    {
      id: 'florist-schedules',
      title: 'Schedules',
      type: 'item',
      url: '/florist/schedules',
      icon: icons.IconCalendarEvent
    },
    {
      id: 'florist-enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/florist/enquiry',
      icon: icons.IconMessageCircle
    }
  ]
};

export default floristmanagement;