// assets
import {
  IconCategory,
  IconPlus,
  IconList,
  IconEngine,
  IconBowlSpoon,
  IconCalendarEvent,
  IconTruckDelivery,
  IconPuzzle,
  IconRocket
} from '@tabler/icons-react';

// constants
const icons = {
  IconCategory,
  IconPlus,
  IconList,
  IconEngine,
  IconBowlSpoon,
  IconCalendarEvent,
  IconTruckDelivery,
  IconPuzzle,
  IconRocket
};

// ==============================|| CAKE MANAGEMENT MENU ||============================== //

const cakemanagement = {
  id: 'cake-management',
  title: 'CAKE MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'cake-setup',
      title: 'Cake Setup',
      type: 'collapse',
      icon: icons.IconBowlSpoon,
      children: [
        {
          id: 'add-package',
          title: 'Add Package',
          type: 'item',
          url: '/cake/addpackage',
          icon: icons.IconPlus
        },
        {
          id: 'package-list',
          title: 'Package List',
          type: 'item',
          url: '/cake/packagelist',
          icon: icons.IconList
        }
      ]
    },

    {
      id: 'cake-addons',
      title: 'Add-ons',
      type: 'item',
      url: '/cake/Addons',
      icon: icons.IconPuzzle,
      breadcrumbs: false
    },

    {
      id: 'delivery-profile',
      title: 'Delivery Profile',
      type: 'item',
      url: '/cake/deliveryprofile',
      icon: icons.IconTruckDelivery,
      breadcrumbs: false
    },

    {
      id: 'cake-categories',
      title: 'Categories',
      type: 'item',
      url: '/cake/categories',
      icon: icons.IconCategory,
      breadcrumbs: false
    },

    {
      id: 'cake-upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/cake/upgrade',
      icon: icons.IconRocket,
      breadcrumbs: false
    },

    {
      id: 'cake-schedules',
      title: 'Schedules',
      type: 'item',
      url: '/cake/schedules',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    }
  ]
};

export default cakemanagement;
