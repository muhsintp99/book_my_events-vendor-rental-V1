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
import Tripmanagement from './vendors/tripmanagement';
import Employeesection from './vendors/employeesection';
import Businesssection from './vendors/businesssection';

// Venue Modules
import bookingmanagement from './venues/bookingmanagement';
import venuemanagement from './venues/venuemanagement';
import Businessection from './venues/businesssection';

// Common
import Marketingsection from './vendors/marketingsection';
import Reportsection from './vendors/reportsection';

// Other specific modules
import photographymanagement from './photography/photomanagement';
import eventmanagement from './Event/eventmanagement';
import mehandimanagement from './mehandi/mehandimanagement';
import cateringmanagement from './catering/cateringmanagement';


// ==============================|| MENU ITEMS ||============================== //
const logRes = (localStorage.getItem('logRes') || '').toLowerCase(); 
console.log("logRes:", logRes);

// Common sections for all
const commonSections = [Marketingsection, Reportsection];

let specificSections = [];

// handle conditions
if (logRes === 'rental') {
  specificSections = [Tripmanagement, vehiclemanagement, Employeesection, Businesssection];
} else if (logRes === 'auditorium') {
  specificSections = [bookingmanagement, venuemanagement, Businessection];
} else if (logRes === 'event') {
  specificSections = [eventmanagement];
} else if (logRes === 'mehandi') {
  specificSections = [mehandimanagement];
} else if (logRes === 'photography') {
  specificSections = [photographymanagement];
} else if (logRes === 'catering') {
  specificSections = [cateringmanagement];
} else if (logRes === 'makeup') {
  // specificSections = [makeupmanagement];
  specificSections = [];
} else if (logRes === 'dj_music') {
  // specificSections = [djmusicmanagement];
  specificSections = [];
}

const menuItems = {
  items: [
    dashboard,
    ...specificSections,
    ...commonSections
  ]
};

export default menuItems;
