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

const Marketingsection = {
  id: 'market-management',
  title: 'MARKETING SECTION',
  type: 'group',
  children: [
    {
      id: 'Coupon',
      title: 'Coupon',
      type: 'item',
      url: '/vehicle/newcoupon',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'Banners',
      title: 'Banners',
      type: 'item',
      url: '/vehicle/banners',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
   
  ]
};

export default Marketingsection;
