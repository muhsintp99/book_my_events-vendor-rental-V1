import {
  IconSpeakerphone,    // Light & Sound Setup (Main)
  IconPlus,            // Add Package
  IconList,            // Package List
  IconCategory,        // Categories
  IconCrown,           // Upgrade
  IconPhoto,           // Portfolio
  IconCalendarEvent,   // Schedules
  IconMessageCircle,   // Enquiries
  IconBulb             // Light Management Group
} from '@tabler/icons-react';

const icons = {
  IconSpeakerphone,
  IconPlus,
  IconList,
  IconCategory,
  IconCrown,
  IconPhoto,
  IconCalendarEvent,
  IconMessageCircle,
  IconBulb
};

const lightmanagement = {
  id: 'light-management',
  title: 'LIGHT & SOUND MANAGEMENT',
  type: 'group',
  icon: icons.IconBulb,   // 🔥 Added relevant group icon
  children: [
    {
      id: 'light-setup',
      title: 'Light & Sound',
      type: 'collapse',
      icon: icons.IconSpeakerphone,  // 🎵 Sound related
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/light/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'package-list',
          title: 'Package List',
          type: 'item',
          url: '/light/packagelist',
          icon: icons.IconList
        }
      ]
    },
    {
      id: 'light-categories',
      title: 'Categories',
      type: 'item',
      url: '/light/categories',
      icon: icons.IconCategory
    },
    {
      id: 'light-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/light/upgrade',
      icon: icons.IconCrown
    },
    {
      id: 'light-portfolio',
      title: 'Portfolio',
      type: 'item',
      url: '/light/portfolio',
      icon: icons.IconPhoto
    },
    // {
    //   id: 'light-schedules',
    //   title: 'Schedules',
    //   type: 'item',
    //   url: '/light/schedules',
    //   icon: icons.IconCalendarEvent
    // },
    {
      id: 'light-enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/light/enquiry',
      icon: icons.IconMessageCircle
    }
  ]
};

export default lightmanagement;