import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import vehiclemanagement from './vendors/vehiclemanagement';
import Driversection from './vendors/driversection';
import Marketingsection from './vendors/marketingsection';
import Businesssection from './vendors/businesssection';
import Reportsection from './vendors/reportsection';
import Employeesection from './vendors/employeesection';
import Tripmanagement from './vendors/tripmanagement';

// ==============================|| MENU ITEMS ||============================== //
        localStorage.getItem('logRes'); // use 'token' key to match ProtectedRoute

const menuItems = {
  items: [dashboard,Tripmanagement,vehiclemanagement,Marketingsection,Businesssection,Reportsection,Employeesection]
};

export default menuItems;
