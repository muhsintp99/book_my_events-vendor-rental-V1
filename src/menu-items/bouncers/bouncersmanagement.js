import {
  IconShieldCheck,     // Main Security Group
  IconUserPlus,        // Add Package
  IconListDetails,     // Package List
  IconCategory,        // Categories
  IconCrown,           // Upgrade
  IconPhoto,           // Portfolio
  IconCalendarEvent,   // Schedules
  IconMessageCircle,   // Enquiries
  IconUsers            // Bouncers Group
} from '@tabler/icons-react';

const icons = {
  IconShieldCheck,
  IconUserPlus,
  IconListDetails,
  IconCategory,
  IconCrown,
  IconPhoto,
  IconCalendarEvent,
  IconMessageCircle,
  IconUsers
};

const bouncersmanagement = {
  id: 'bouncers-management',
  title: 'BOUNCERS MANAGEMENT',
  type: 'group',
  icon: icons.IconShieldCheck,   // 🔥 Security shield for group
  children: [
    {
      id: 'bouncers-setup',
      title: 'Bouncers & Security',
      type: 'collapse',
      icon: icons.IconUsers,  // 👥 Bouncers group icon
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/bouncers/addpackage',
          icon: icons.IconUserPlus   // ➕ Add person
        },
        {
          id: 'package-list',
          title: 'Package List',
          type: 'item',
          url: '/bouncers/packagelist',
          icon: icons.IconListDetails  // 📋 List
        }
      ]
    },
    {
      id: 'bouncers-categories',
      title: 'Categories',
      type: 'item',
      url: '/bouncers/categories',
      icon: icons.IconCategory
    },
    {
      id: 'bouncers-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/bouncers/upgrade',
      icon: icons.IconCrown
    },
    {
      id: 'bouncers-portfolio',
      title: 'Portfolio',
      type: 'item',
      url: '/bouncers/portfolio',
      icon: icons.IconPhoto
    },
    {
      id: 'bouncers-enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/bouncers/enquiry',
      icon: icons.IconMessageCircle
    }
  ]
};

export default bouncersmanagement;