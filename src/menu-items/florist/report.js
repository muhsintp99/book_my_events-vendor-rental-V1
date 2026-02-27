// assets
import {
  IconReportMoney,      
  IconUserCheck,     
  IconChefHat,         
  IconReceiptTax,        
  IconDownload       
} from '@tabler/icons-react';

// constants
const icons = {
  IconReportMoney,
  IconUserCheck,
  IconChefHat,
  IconReceiptTax,
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
      url: '/report/floristexp',
      icon: icons.IconReportMoney,
      breadcrumbs: false
    },
    {
      id: 'Disbursement-Method',
      title: 'Disbursement Method',
      type: 'item',
      url: '/report/florist-disburse',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'mehandi-Report',
      title: 'Florist & Stage Report',
      type: 'item',
      url: '/report/floristreport',
      icon: icons.IconChefHat,
      breadcrumbs: false
    },
    {
      id: 'Tax-Report',
      title: 'Tax Report',
      type: 'item',
      url: '/report/floristtax',
      icon: icons.IconReceiptTax,
      breadcrumbs: false
    },
 
  ]
};

export default Reportsection;
