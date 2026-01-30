// assets
import {
  IconBuildingStore,   // Boutique Setup
  IconPackage,         // Package / Package List
  IconPlus,            // Add Package
  IconCategory,        // Categories
  IconRocket,          // Upgrade
  IconCalendarTime,    // Schedules
  IconMessageQuestion  // Enquiries
} from '@tabler/icons-react';

// constants
const icons = {
  IconBuildingStore,
  IconPackage,
  IconPlus,
  IconCategory,
  IconRocket,
  IconCalendarTime,
  IconMessageQuestion
};

// ==============================|| BOUTIQUE MANAGEMENT MENU ||============================== //

const boutiquemanagement = {
  id: 'boutique-management',
  title: 'BOUTIQUE MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'boutique-setup',
      title: 'Boutique Setup',
      type: 'collapse',
      icon: icons.IconBuildingStore,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/boutique/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'package-list',
          title: 'Package List',
          type: 'item',
          url: '/boutique/packagelist',
          icon: icons.IconPackage
        },

      ]
    },

    {
      id: 'boutique-categories',
      title: 'Categories',
      type: 'item',
      url: '/boutique/categories',
      icon: icons.IconCategory,
      breadcrumbs: false
    },

    {
      id: 'boutique-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/boutique/upgrade',
      icon: icons.IconRocket,
      breadcrumbs: false
    },

    {
      id: 'boutique-schedules',
      title: 'Schedules',
      type: 'item',
      url: '/boutique/schedules',
      icon: icons.IconCalendarTime,
      breadcrumbs: false
    },

    {
      id: 'boutique-enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/boutique/enquiry',
      icon: icons.IconMessageQuestion,
      breadcrumbs: false
    }
  ]
};

export default boutiquemanagement;
