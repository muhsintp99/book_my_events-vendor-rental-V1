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





import dashboard from './dashboard';
import vehiclemanagement from './vendors/vehiclemanagement';
import Tripmanagement from './vendors/tripmanagement';
import bookingmanagement from './venues/bookingmanagement';
import venuemanagement from './venues/venuemanagement';
import Marketingsection from './vendors/marketingsection';
import Businesssection from './vendors/businesssection';
import Reportsection from './vendors/reportsection';
import Employeesection from './vendors/employeesection';
import Businessection from './venues/businesssection';

// ==============================|| MENU ITEMS ||============================== //
const logRes = localStorage.getItem('logRes'); // "rental" or "venue"

// Common sections (same for both)
const commonSections = [
  Marketingsection,
  Reportsection,
  
];

// Rental-specific
const rentalSections = [Tripmanagement, vehiclemanagement,Employeesection,Businesssection];

// Venue-specific
const venueSections = [bookingmanagement, venuemanagement,Businessection];

// Menu items builder
const menuItems = {
  items: [
    dashboard,
    ...(logRes === 'rental' ? rentalSections : venueSections),
    ...commonSections
  ]
};

export default menuItems;
