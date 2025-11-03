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

const Reportsection = {
  id: 'report-management',
  title: 'REPORT SECTION',
  type: 'group',
  children: [
    {
      id: 'Expense-Report',
      title: 'Expense Report',
      type: 'item',
      url: '/report/cateringexp',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'Disbursement-Method',
      title: 'Disbursement Method',
      type: 'item',
      url: '/report/cater-disburse',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'catering-Report',
      title: 'Catering Report',
      type: 'item',
      url: '/report/cateringreport',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'Tax-Report',
      title: 'Tax Report',
      type: 'item',
      url: '/report/vat',
      icon: icons.IconUpload,
      breadcrumbs: false
    },
 
  ]
};

export default Reportsection;
