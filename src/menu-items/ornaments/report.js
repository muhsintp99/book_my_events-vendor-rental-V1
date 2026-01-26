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
      url: '/report/cakeexp',
      icon: icons.IconReportMoney,
      breadcrumbs: false
    },
    {
      id: 'Disbursement-Method',
      title: 'Disbursement Method',
      type: 'item',
      url: '/report/ornaments-disburse',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'ornaments-Report',
      title: 'ornaments Report',
      type: 'item',
      url: '/report/ornamentsreport',
      icon: icons.IconChefHat,
      breadcrumbs: false
    },
    {
      id: 'Tax-Report',
      title: 'Tax Report',
      type: 'item',
      url: '/report/ornamentstax',
      icon: icons.IconReceiptTax,
      breadcrumbs: false
    },
 
  ]
};

export default Reportsection;
