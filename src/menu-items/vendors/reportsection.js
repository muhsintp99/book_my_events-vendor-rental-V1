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
      url: '/report/expense',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'Disbursement-Method',
      title: 'Disbursement Method',
      type: 'item',
      url: '/report/disburse',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'Trip-Report',
      title: 'Trip Report',
      type: 'item',
      url: '/report/trip',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'Vat-Report',
      title: 'Vat Report',
      type: 'item',
      url: '/report/vat',
      icon: icons.IconUpload,
      breadcrumbs: false
    },
    {
      id: 'bulk-export',
      title: 'Bulk Export',
      type: 'item',
      url: '/page-not-found',
      icon: icons.IconDownload,
      breadcrumbs: false
    }
  ]
};

export default Reportsection;
