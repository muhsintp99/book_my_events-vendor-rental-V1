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

const Employeesection = {
  id: 'employee-management',
  title: 'EMPLOYEE SECTION',
  type: 'group',
  children: [
    {
      id: 'Employee-Role',
      title: 'Employee Role',
      type: 'item',
      url: '/employee/venuerole',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
   {
          id: 'Employees',
          title: 'Employees',
          type: 'collapse',
          icon: icons.IconBuildingSkyscraper,  // <- changed icon here
          children: [
            {
              id: 'Create-new',
              title: 'Add New ',
              type: 'item',
              url: '/employee/new'
            },
            {
              id: 'list',
              title: 'List',
              type: 'item',
              url: '/employee/list'
            }
           
          ]
        },
  ]
};

export default Employeesection;
