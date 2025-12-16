




// assets
import {
  IconBuilding,
  IconCategory,
  IconTrademark,
  IconPlus,
  IconList,
  IconClipboardCheck,
  IconUpload,
  IconDownload,
  IconEngine,
  IconCalendar,IconBowlSpoon
} from '@tabler/icons-react';

// constants
const icons = {
  IconBuilding,
  IconCategory,
  IconTrademark,
  IconPlus,
  IconList,
  IconClipboardCheck,
  IconUpload,
  IconDownload,
  IconEngine,
  IconCalendar,IconBowlSpoon
};

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //

const venuemanagement = {
  id: 'catering-management',
  title: 'CATERING MANAGEMENT',
  type: 'group',
  children: [
    {
      id: 'catering-setup',
      title: 'Catering Setup',
      type: 'collapse',
      icon: icons.IconBowlSpoon,
      children: [
        {
          id: 'add pacakge',
          title: 'Add Pacakage',
          type: 'item',
          url: 'catering/addpackage',
          icon: icons.IconPlus  
        },
        {
          id: 'list',
          title: 'Package List',
          type: 'item',
          url: 'catering/packagelist',
          icon: icons.IconList
        },
      
      ]
    },
    
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/venue/categories',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
    
    {
      id: 'upgrade',
      title: 'Upgrade',
      type: 'item',
      url: '/catering/upgrade',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
  ]
};

export default venuemanagement;
