import { IconDashboard } from '@tabler/icons-react';


const icons = { IconDashboard };


const dashboard = {
  id: 'dashboard',
  title: 'DASHBOARD',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
