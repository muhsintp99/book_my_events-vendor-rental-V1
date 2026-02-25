// import dashboard from './dashboard';
// import pages from './pages';
// import utilities from './utilities';
// import other from './other';
// import vehiclemanagement from './vendors/vehiclemanagement';
// import Marketingsection from './vendors/marketingsection';
// import Businesssection from './vendors/businesssection';
// import Reportsection from './vendors/reportsection';
// import Employeesection from './vendors/employeesection';
// import Tripmanagement from './vendors/tripmanagement';
// import bookingmanagement from './venues/bookingmanagement';
// import venuemanagement from './venues/venuemanagement';
// import Marketingssection from './venues/marketingsection';
// import Businessection from './venues/businesssection';
// import Reportssection from './venues/reportsection';

// // ==============================|| MENU ITEMS ||============================== //
// const logRes ='rental'
// // localStorage.getItem('logRes');

// const menuItems = {
//   items: [dashboard,
//     Tripmanagement,
//     ...(logRes === 'rental' ? [vehiclemanagement] : [])
//     ,Marketingsection,Businesssection,Reportsection,Employeesection]
// };
// const venueItems= {
//   items: [dashboard,
//     bookingmanagement,
//     venuemanagement,
//     Marketingssection,
//     Businessection,
//     Reportssection]

// }

// export default {menuItems,venueItems};

// import dashboard from './dashboard';
// import vehiclemanagement from './vendors/vehiclemanagement';
// import Tripmanagement from './vendors/tripmanagement';
// import bookingmanagement from './venues/bookingmanagement';
// import venuemanagement from './venues/venuemanagement';
// import Marketingsection from './vendors/marketingsection';
// import Businesssection from './vendors/businesssection';
// import Reportsection from './vendors/reportsection';
// import Employeesection from './vendors/employeesection';
// import Businessection from './venues/businesssection';

// // ==============================|| MENU ITEMS ||============================== //
// // const logRes = (localStorage.getItem('logRes') || '');
// const logRes = (localStorage.getItem('logRes') || '').toLowerCase();
// // ensures value is lowercase even if stored as "Rental" or "RENTAL"

// console.log("logRes:", logRes);

// // Common sections
// const commonSections = [
//   Marketingsection,
//   Reportsection,
// ];

// // Rental-specific
// const rentalSections = [Tripmanagement, vehiclemanagement, Employeesection, Businesssection];

// // Venue-specific
// const venueSections = [bookingmanagement, venuemanagement, Businessection];

// // Menu items builder
// const menuItems = {
//   items: [
//     dashboard,
//     ...(logRes === 'rental' ? rentalSections : venueSections),
//     ...commonSections
//   ]
// };

// export default menuItems;

import dashboard from './dashboard';

// Rental Modules
import vehiclemanagement from './vendors/vehiclemanagement';
import Reportsection from './vendors/reportsection';

// import Tripmanagement from './vendors/tripmanagement';
import Employeesection from './vendors/employeesection';

// Venue Modules
// import bookingmanagement from './venues/bookingmanagement';
import venuemanagement from './venues/venuemanagement';
import Businessection from './venues/businesssection';
import Report from './venues/reportsection';
import Employee from './venues/employee';

// Common
import Marketingsection from './venues/marketingsection';

// Other specific modules

import eventmanagement from './Event/eventmanagement';
import mehandimanagement from './mehandi/mehandimanagement';

// catering
import cateringmanagement from './catering/cateringmanagement';
import Reports from './catering/Report';
import Employees from './catering/employees';

// makeup
import Makeupmanagement from './makeup/Makeupmanagement';
import Reportmakeup from './makeup/reportmakeup';
import photomanagement from './photography/photomanagement';
import Photographysection from './photography/photographysession';
import Reportphotography from './photography/reportphotography';
import management from './venues/management';
import makeupManagement from './makeup/Managementmakeup';
import cateringManagementMenu from './catering/Managementcatering';
import photographyManagementMenu from './photography/Managementphotography';
import cakemanagement from './cakes/cakemanagement';
import Cakesection from './cakes/cakesections';
import cakeManagementMenu from './cakes/managementcake';
import tripmanagement from './vendors/tripmanagement';
import ornamentsManagementMenu from './ornaments/managementornaments';
import ornamentsmanagement from './ornaments/ornamentsmanagement';
import ornamentsection from './ornaments/ornamentssections';
import boutiqueManagementMenu from './boutique/managementboutique';
import boutiquemanagement from './boutique/boutiquemanagement';
import mehandiManagementMenu from './mehandi/managementmehandi';
import mehandisection from './mehandi/mehandisections';

// ==============================|| MENU ITEMS ||============================== //
const logRes = (localStorage.getItem('logRes') || '').toLowerCase().replace(/\s+/g, ''); // remove spaces
console.log('logRes:', logRes);

// Common sections for all
const commonSections = [Marketingsection];

let specificSections = [];

// handle conditions
if (logRes === 'transport') {
  // specificSections = [ vehiclemanagement,Reportsection,Employeesection];
  specificSections = [tripmanagement, vehiclemanagement];
} else if (logRes === 'venues') {
  // specificSections = [management, venuemanagement, Businessection, Report, Employee];
  specificSections = [management, venuemanagement];
} else if (logRes === 'event') {
  specificSections = [eventmanagement];
} else if (logRes.includes('mehandi')) {
  specificSections = [mehandiManagementMenu, mehandimanagement, mehandisection, Reportsection, Employee];
} else if (logRes === 'photography') {
  // specificSections = [ photographyManagementMenu ,photomanagement,Photographysection,Reportphotography];
  specificSections = [photographyManagementMenu, photomanagement];
} else if (logRes === 'catering') {
  // specificSections = [ cateringManagementMenu,cateringmanagement, Reports, Employees];
  specificSections = [cateringManagementMenu, cateringmanagement];
} else if (logRes === 'makeupartist') {
  // specificSections = [makeupManagement, Makeupmanagement,Businessection,Employee,Reportmakeup];
  specificSections = [makeupManagement, Makeupmanagement];
} else if (logRes === 'cake') {
  // specificSections = [cakeManagementMenu,cakemanagement,Cakesection,Employeesection,Reportsection];
  specificSections = [cakeManagementMenu, cakemanagement];
} else if (logRes === 'ornaments') {
  // specificSections = [cakeManagementMenu,cakemanagement,Cakesection,Employeesection,Reportsection];
  specificSections = [ornamentsManagementMenu, ornamentsmanagement];
} else if (logRes === 'boutique') {
  // specificSections = [cakeManagementMenu,cakemanagement,Cakesection,Employeesection,Reportsection];
  specificSections = [boutiqueManagementMenu, boutiquemanagement];
}

const menuItems = {
  items: [dashboard, ...specificSections, ...commonSections]
};

export default menuItems;
