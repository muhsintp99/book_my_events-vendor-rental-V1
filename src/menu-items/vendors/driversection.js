// assets
import {
  IconUserPlus,      
  IconUserCheck,     
  IconUsers,         
  IconUpload,        
  IconDownload       
} from '@tabler/icons-react';

// constants
const icons = {
  IconUserPlus,
  IconUserCheck,
  IconUsers,
  IconUpload,
  IconDownload
};

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //

const Driversection = {
  id: 'provider-management',
  title: 'DRIVER SECTION',
  type: 'group',
  children: [
    {
      id: 'Add Driver',
      title: 'Add Driver',
      type: 'item',
      url: '/providers/new',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'driverlist',
      title: 'Driver List',
      type: 'item',
      url: '/providers/add',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
   
  ]
};

export default Driversection;
