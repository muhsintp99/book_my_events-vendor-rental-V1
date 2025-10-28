// import { lazy } from 'react';

// // project imports
// import MainLayout from 'layout/MainLayout';
// import Loadable from 'ui-component/Loadable';
// import DriverView from '../views/DriverView';
// import { ImportExport } from '@mui/icons-material';


// // dashboard routing
// // const Login = Loadable(lazy(() => import('../views/pages/auth-forms/AuthLogin')));
// // const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
// // Fixed the import path - removed the '../' and made sure it matches your file structure
// const AllTrips = Loadable(lazy(() => import('views/Alltrips')));
// const Scheduled = Loadable(lazy(()=> import('../views/Scheduled')));
// const Pendings = Loadable(lazy(()=> import('../views/Pendings')));
// const Confirmed = Loadable(lazy(()=> import('../views/Confirmed')));
// const Ongoing = Loadable(lazy(()=> import('../views/Ongoing')));
// const Completed = Loadable(lazy(()=> import('../views/Completed')));
// const Canceled = Loadable(lazy(()=> import('../views/Canceled')));
// const PaymentFailed = Loadable(lazy(()=> import('../views/PaymentFailed')));

// //report section routing
// const ExpenseReport = Loadable(lazy(()=> import('../views/ExpenseReport')));
// const DisbursementReport = Loadable(lazy(()=> import('../views/DisburseReport')));
// const TripReport = Loadable(lazy(()=> import('../views/TripReport')));
// const VatReport = Loadable(lazy(()=> import('../views/VatReport')));
// const TripDetail = Loadable(lazy(()=> import('../views/TripDetails')));


// //vehicle setup routing
// const CreateNew = Loadable(lazy(()=> import('../views/CreateNew')));
// const List = Loadable(lazy(()=> import('../views/List')));
// const ListView = Loadable(lazy(()=> import('../views/ListView')));
// const Category = Loadable(lazy(()=> import('../views/Category')));
// const Brandlist = Loadable(lazy(()=> import('../views/BrandList')));

// //driver section routing
// const AddDriver = Loadable(lazy(()=> import('../views/AddDriver')));
// const Drivers = Loadable(lazy(()=> import('../views/Drivers')));

// //marketing section routing
// const Coupon = Loadable(lazy(()=> import('../views/Coupon')))
// const Banners = Loadable(lazy(()=> import('../views/Banners')))

// //business section routing
// const ProviderConfig = Loadable(lazy(()=> import('../views/ProviderConfig')));
// const Notification = Loadable(lazy(()=> import('../views/Notification')))
// const BusinessPlan = Loadable(lazy(()=> import('../views/BusinessPlan')));
// const ChangePlan =Loadable(lazy(()=> import('../views/ChangePlan')));
// const MyShop = Loadable(lazy(()=> import('../views/MyShop')));
// const ShiftPlan =Loadable(lazy(()=> import('../views/ShiftPlan')));
// const EditProvider = Loadable(lazy(()=> import('../views/EditProvider')));
// const Wallet = Loadable(lazy(()=> import('../views/Wallet')));
// const Disbursement = Loadable(lazy(()=> import('../views/Disbursement')));
// const Review = Loadable(lazy(()=> import('../views/Review')));
// const Chat = Loadable(lazy(()=> import('../views/Chat')));

// //employee section routing
// const  EmployeeRole = Loadable(lazy(()=> import('../views/EmployeeRole')));
// const AddEmployee= Loadable(lazy(()=> import('../views/AddEmployee')));
// const EmployeeList = Loadable(lazy(()=> import('../views/EmployeeList')));


// // sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));



// // ==============================|| MAIN ROUTING ||============================== //

// const MainRoutes = {
//   path: '/',
//   element: <MainLayout />,
//   children: [
//     {
//       path: '/',
//       element: <DashboardDefault />
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'default',
//           element: <DashboardDefault />
//         }
//       ]
//     },
//     {
//       path: 'trips',
//       children: [
//         {
//           path: '', // This will handle /trips
//           element: <AllTrips />
//         },

//         {
//           path: 'scheduled',
//           element: <Scheduled /> 
//         },
//         {
//           path: 'pending',
//           element: <Pendings />
//         },
//         {
//           path: 'confirmed',
//           element: <Confirmed />
//         },
//         {
//           path: 'ongoing',
//           element: <Ongoing />
//         },
//         {
//           path: 'completed',
//           element: <Completed />
//         },
//         {
//           path: 'canceled',
//           element: <Canceled />
//         },
//         {
//           path: 'payment-failed',
//           element: <PaymentFailed />
//         }
//       ]
//     },
//     {
//       path: 'vehicle-setup',
//       children: [
//         {
//           path: '/vehicle-setup/leads',
//           element: <CreateNew />
//         },
//         {
//           path: '/vehicle-setup/lists',
//           element: <List />
//         },
//         {
//           path: '/vehicle-setup/listview',
//           element: <ListView />
//         }
//       ]
//     },
//     {
//       path: 'vehicles',
//       children: [
//         {
//           path: '/vehicles/categories',
//           element: <Category/>
//         }
//       ]
//     },
//     {
//       path: 'vehicles',
//       children: [
//         {
//           path: '/vehicles/brands',
//           element: <Brandlist/>
//         }
//       ]
//     },
//     {
//       path: 'providers',
//       children: [
//         {
//           path: '/providers/new',
//           element: <AddDriver/>
//         },
//         {
//           path: '/providers/add',
//           element: <Drivers/>
//         },
//         {
//           path: '/providers/driverview',
//           element: <DriverView/>
//         },
//         {
//           path: '/providers/newcoupon',
//           element: <Coupon/>
//         },
//         {
//           path: '/providers/banner',
//           element: <Banners/>
//         }
//       ]
//     },
//     {
//       path: 'business',
//       children: [
//         {
//           path: '/business/new',
//           element: <ProviderConfig/>
//         },
//         {
//           path: '/business/add',
//           element: <Notification/>
//         },
//         {
//           path: '/business/list',
//           element: <MyShop/>
//         },
//         {
//           path: '/business/editpro',
//           element: <EditProvider/>
//         },
//         {
//           path: '/business/plan',
//           element: <BusinessPlan/>
//         },
//         {
//           path: '/business/changeplan',
//           element: <ChangePlan/>
//         },
//         {
//           path: '/business/shiftplan',
//           element: <ShiftPlan/>
//         },
//         {
//           path: '/business/export',
//           element: <Wallet/>
//         },
//         {
//           path: '/business/disburse',
//           element: <Disbursement/>
//         },
//         {
//           path: '/business/review',
//           element: <Review/>
//         },
//         {
//           path: '/business/chat',
//           element: <Chat/>
//         }
//       ]
//     },
//     {
//       path: 'report',
//       children: [
//         {
//           path: '/report/expense',
//           element: <ExpenseReport/>
//         },
//         {
//           path: '/report/disburse',
//           element: <DisbursementReport/>
//         },
//         {
//           path: '/report/trip',
//           element: <TripReport/>

//         },
//         {
//           path: '/report/tripdetail',
//           element: <TripDetail/>
//         },
//         {
//           path: '/report/vat',
//           element: <VatReport/>
//         }
//       ]
//     },
//     {
//       path: 'employee',
//       children: [
//         {
//           path:'/employee/role',
//           element: <EmployeeRole/>
          
//         },
//         {
//           path: '/employee/new',
//           element: <AddEmployee/>
//         },
//         {
//           path: '/employee/list',
//           element: <EmployeeList/>
//         }
//       ]
//     },

//     {
//       path: 'sample-page',
//       element: <SamplePage />
//     }
//   ]
// };

// export default MainRoutes;


import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';
import Schedules from '../views/Schedules';
import Register from '../views/pages/authentication/Register';

// auth pages
const Login = Loadable(lazy(() => import('views/pages/authentication/Login')));

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const PageNotFound = Loadable(lazy(()=> import('views/PageNotFound')));

// trips
const AllTrips = Loadable(lazy(() => import('views/Alltrips')));
const Scheduled = Loadable(lazy(()=> import('views/Scheduled')));
const Pendings = Loadable(lazy(()=> import('views/Pendings')));
const Confirmed = Loadable(lazy(()=> import('views/Confirmed')));
const Ongoing = Loadable(lazy(()=> import('views/Ongoing')));
const Completed = Loadable(lazy(()=> import('views/Completed')));
const Canceled = Loadable(lazy(()=> import('views/Canceled')));
const PaymentFailed = Loadable(lazy(()=> import('views/PaymentFailed')));

//venue 
const VenueCreate = Loadable(lazy(()=> import('views/VenueCreate')));
const VenueList = Loadable(lazy(()=> import('views/VenueList')));
const VenueListView = Loadable(lazy(()=> import('views/VenueListView')));
const VenueCategory = Loadable(lazy(()=> import('views/VenueCategory')));
const FoodMenu = Loadable(lazy(()=> import('views/FoodMenu')));

// reports
const ExpenseReport = Loadable(lazy(()=> import('views/ExpenseReport')));
const DisbursementReport = Loadable(lazy(()=> import('views/DisburseReport')));
const TripReport = Loadable(lazy(()=> import('views/TripReport')));
const VatReport = Loadable(lazy(()=> import('views/VatReport')));
const TripDetail = Loadable(lazy(()=> import('views/TripDetails')));

// vehicles
const CreateNew = Loadable(lazy(()=> import('views/CreateNew')));
const List = Loadable(lazy(()=> import('views/List')));
const ListView = Loadable(lazy(()=> import('views/ListView')));
const Category = Loadable(lazy(()=> import('views/Category')));
const Brandlist = Loadable(lazy(()=> import('views/BrandList')));
// driver
const AddDriver = Loadable(lazy(()=> import('views/AddDriver')));
const Drivers = Loadable(lazy(()=> import('views/Drivers')));
const DriverView = Loadable(lazy(() => import('views/DriverView')));

// marketing
const Coupon = Loadable(lazy(()=> import('views/Coupon')));
const Banners = Loadable(lazy(()=> import('views/Banners')));

//vehicle marketing
const VehicleBanners = Loadable(lazy(()=> import('views/VehicleBanners')));

// business
const ProviderConfig = Loadable(lazy(()=> import('views/ProviderConfig')));
const Notification = Loadable(lazy(()=> import('views/Notification')));
const BusinessPlan = Loadable(lazy(()=> import('views/BusinessPlan')));
const ChangePlan =Loadable(lazy(()=> import('views/ChangePlan')));
const MyShop = Loadable(lazy(()=> import('views/MyShop')));
const ShiftPlan =Loadable(lazy(()=> import('views/ShiftPlan')));
const EditProvider = Loadable(lazy(()=> import('views/EditProvider')));
const Wallet = Loadable(lazy(()=> import('views/Wallet')));
const Disbursement = Loadable(lazy(()=> import('views/Disbursement')));
const Review = Loadable(lazy(()=> import('views/Review')));
const Chat = Loadable(lazy(()=> import('views/Chat')));

// employee
const EmployeeRole = Loadable(lazy(()=> import('views/EmployeeRole')));
const AddEmployee= Loadable(lazy(()=> import('views/AddEmployee')));
const EmployeeList = Loadable(lazy(()=> import('views/EmployeeList')));

// sample page
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

const VenueMyShop = Loadable(lazy(()=> import('views/VenueMyShop')))


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    // ✅ Public login route
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'register',
      element: <Register />
    },
    

    // ✅ Protected dashboard + all child routes
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/default" replace /> },
        {
          path: 'dashboard',
          children: [
            { path: 'default', element: <DashboardDefault /> }
          ]
        },
        
        {
          path: 'trips',
          children: [
            { path: '', element: <AllTrips /> },
            { path: 'scheduled', element: <Scheduled /> },
            { path: 'pending', element: <Pendings /> },
            { path: 'confirmed', element: <Confirmed /> },
            { path: 'ongoing', element: <Ongoing /> },
            { path: 'completed', element: <Completed /> },
            { path: 'canceled', element: <Canceled /> },
            { path: 'payment-failed', element: <PaymentFailed /> }
          ]
        },
        {
          path: 'vehicle-setup',
          children: [
            { path: 'leads', element: <CreateNew /> },
            { path: 'lists', element: <List /> },
            { path: 'leads/:vehicleId', element: <CreateNew /> },
            { path: 'listview', element: <ListView /> },
            { path:"listview/:id" ,element: <ListView/>}  
          ]
        },
        {
          path: 'vehicles',
          children: [
            { path: 'categories', element: <Category/> },
            { path: 'brands', element: <Brandlist/> },
          ]
        },
        {
          path: 'vehicle',
          children: [
            { path: 'new', element: <AddDriver/> },
            { path: 'add', element: <Drivers/> },
            { path: 'driverview', element: <DriverView/> },
            { path: 'newcoupon', element: <Coupon/> },
            { path: 'banners', element: <VehicleBanners/> }
          ]
        },
        {
          path: 'business',
          children: [
            { path: 'new', element: <ProviderConfig/> },
            { path: 'add', element: <Notification/> },
            { path: 'list', element: <MyShop/> },
            { path: 'editpro', element: <EditProvider/> },
            { path: 'plan', element: <BusinessPlan/> },
            { path: 'changeplan', element: <ChangePlan/> },
            { path: 'shiftplan', element: <ShiftPlan/> },
            { path: 'export', element: <Wallet/> },
            { path: 'disburse', element: <Disbursement/> },
            { path: 'review', element: <Review/> },
            { path: 'chat', element: <Chat/> }
          ]
        },
        {
          path: 'report',
          children: [
            { path: 'expense', element: <ExpenseReport/> },
            { path: 'disburse', element: <DisbursementReport/> },
            { path: 'trip', element: <TripReport/> },
            { path: 'tripdetail', element: <TripDetail/> },
            { path: 'vat', element: <VatReport/> }
          ]
        },
        {
          path: 'employee',
          children: [
            { path:'role', element: <EmployeeRole/> },
            { path: 'new', element: <AddEmployee/> },
            { path: 'list', element: <EmployeeList/> }
          ]
        },
        { path: 'sample-page', element: <SamplePage /> },
         {
      path: 'bookings',
      children: [
        {
          path: '', 
          element: <AllTrips />
        },

        {
          path: 'scheduled',
          element: <Scheduled /> 
        },
        {
          path: 'pending',
          element: <Pendings />
        },
        {
          path: 'confirmed',
          element: <Confirmed />
        },
        {
          path: 'ongoing',
          element: <Ongoing />
        },
        {
          path: 'completed',
          element: <Completed />
        },
        {
          path: 'canceled',
          element: <Canceled />
        },
        {
          path: 'payment-failed',
          element: <PaymentFailed />
        }
      ]
    },
    {
      path: '/page-not-found',
      element: <PageNotFound />
    },
    {
      path: 'venue-setup',
      children: [
        {
          path: '/venue-setup/new',
          element: <VenueCreate />
        },
        {
          path: '/venue-setup/new/:id',
          element: <VenueCreate />
        },
        {
          path: '/venue-setup/lists',
          element: <VenueList />
        },
        {
          path: '/venue-setup/listview/:id',
          element: <VenueListView />
        },
        {
          path: '/venue-setup/foodmenu',
          element: <FoodMenu />
        
        }
      ]
    },
    {
      path: 'venue',
      children: [
        {
          path: '/venue/categories',
          element: <VenueCategory/>
        },
        {
          path: '/venue/schedules',
          element: <Schedules/>
        }
      ]
    },
     {
      path: 'business',
      children: [
        {
          path: '/business/myshop',
          element: <VenueMyShop/>
        }
      ]
    },
     {
      path: 'providers',
      children: [
        {
          path: 'banners',
          element: <Banners/>
        }
      ]
    },

      ]
    }
  ]
};

export default MainRoutes;
