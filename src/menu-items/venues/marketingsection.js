import {
  IconTicket,      
  IconPhotoEdit,     
  IconUsers,         
  IconUpload,        
  IconDownload       
} from '@tabler/icons-react';

const icons = {
  IconTicket,
  IconPhotoEdit,
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
      icon: icons.IconTicket,
      breadcrumbs: false
    },
    {
      id: 'Banners',
      title: 'Banners',
      type: 'item',
      url: '/providers/banners',
      icon: icons.IconPhotoEdit,
      breadcrumbs: false
    },
  ]
};

export default Marketingssection;
