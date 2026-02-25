import {
  IconBrush,
  IconPlus,
  IconClipboardList,
  IconCategory,
  IconCrown,
  IconCalendarEvent,
  IconMessageCircle
} from '@tabler/icons-react';

const icons = {
  IconBrush,
  IconPlus,
  IconClipboardList,
  IconCategory,
  IconCrown,
  IconCalendarEvent,
  IconMessageCircle
};

const mehandimanagement = {
  id: 'mehandi-management',
  title: 'MEHANDI MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'mehandi-setup',
      title: 'Mehandi Setup',
      type: 'collapse',
      icon: icons.IconBrush,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/mehandi/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'package-list',
          title: 'Package List',
          type: 'item',
          url: '/mehandi/packagelist',
          icon: icons.IconClipboardList
        }
      ]
    },
    {
      id: 'mehandi-categories',
      title: 'Categories',
      type: 'item',
      url: '/mehandi/categories',
      icon: icons.IconCategory
    },
    {
      id: 'mehandi-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/mehandi/upgrade',
      icon: icons.IconCrown
    },
    {
      id: 'mehandi-portfolio',
      title: 'Portfolio',
      type: 'item',
      url: '/mehandi/portfolio',
      icon: icons.IconCrown
    },
    {
      id: 'mehandi-schedules',
      title: 'Schedules',
      type: 'item',
      url: '/mehandi/schedules',
      icon: icons.IconCalendarEvent
    },
    {
      id: 'mehandi-enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/mehandi/enquiry',
      icon: icons.IconMessageCircle
    }
  ]
};

export default mehandimanagement;