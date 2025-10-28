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

const Marketingssection = {
  id: 'marketing-management',
  title: 'MARKETING SECTION',
  type: 'group',
  children: [
    {
      id: 'Coupon',
      title: 'Coupon',
      type: 'item',
      url: '/providers/newcoupon',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'Banners',
      title: 'Banners',
      type: 'item',
      url: '/providers/banners',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
   
  ]
};

export default Marketingssection;
