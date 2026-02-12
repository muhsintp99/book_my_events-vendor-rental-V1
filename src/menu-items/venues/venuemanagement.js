// assets (Tabler Icons)
import {
  IconHome2,
  IconTags,
  IconPlus,
  IconList,
  IconChefHat,
  IconCalendarTime,
  IconRocket
} from '@tabler/icons-react';

// constants
const icons = {
  IconHome2,
  IconTags,
  IconPlus,
  IconList,
  IconChefHat,
  IconCalendarTime,
  IconRocket
};

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //

const venuemanagement = {
  id: 'venue-management',
  title: 'VENUE MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'venue-setup',
      title: 'Venue Setup',
      type: 'collapse',
      icon: icons.IconHome2, // 🏠 Venue / Building
      children: [
        {
          id: 'create-new',
          title: 'Create New',
          type: 'item',
          url: '/venue-setup/new',
          icon: icons.IconPlus // ➕ Add
        },
        {
          id: 'list',
          title: 'List',
          type: 'item',
          url: '/venue-setup/lists',
          icon: icons.IconList // 📋 List
        },
        {
          id: 'food-menu',
          title: 'Food Menu',
          type: 'item',
          url: '/venue-setup/foodmenu',
          icon: icons.IconChefHat // 👨‍🍳 Food
        }
      ]
    },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/venue/categories',
      icon: icons.IconTags, // 🏷 Categories
      breadcrumbs: false
    },
    {
      id: 'schedules',
      title: 'Schedules',
      type: 'item',
      url: '/venue/schedules',
      icon: icons.IconCalendarTime, // 📅 Schedule
      breadcrumbs: false
    },
    {
      id: 'venue-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/venue/upgrade',
      icon: icons.IconRocket, // 🚀 Upgrade
      breadcrumbs: false
    },
        {
      id: 'venue-ENQUIRIES',
      title: 'Enquiries',
      type: 'item',
      url: '/venue/enquiries',
      icon: icons.IconRocket, // 🚀 Upgrade
      breadcrumbs: false
    }
  ]
};

export default venuemanagement;
