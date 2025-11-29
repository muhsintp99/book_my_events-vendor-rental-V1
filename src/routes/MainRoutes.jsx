import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';
import Schedules from '../views/Schedules';
import Register from '../views/pages/authentication/Register';

const DeleteProfile = Loadable(lazy(() => import('views/DeleteProfile')));

// auth pages
const Login = Loadable(lazy(() => import('views/pages/authentication/Login')));
const Forgotpass = Loadable(lazy(() => import('views/pages/auth-forms/Forgotpass')));

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const PageNotFound = Loadable(lazy(() => import('views/PageNotFound')));

// trips
const AllTrips = Loadable(lazy(() => import('views/Alltrips')));
const Scheduled = Loadable(lazy(() => import('views/Scheduled')));
const Pendings = Loadable(lazy(() => import('views/Pendings')));
const Confirmed = Loadable(lazy(() => import('views/Confirmed')));
const Ongoing = Loadable(lazy(() => import('views/Ongoing')));
const Completed = Loadable(lazy(() => import('views/Completed')));
const Canceled = Loadable(lazy(() => import('views/Canceled')));
const PaymentFailed = Loadable(lazy(() => import('views/PaymentFailed')));

//venue
const VenueCreate = Loadable(lazy(() => import('views/VenueCreate')));
const VenueList = Loadable(lazy(() => import('views/VenueList')));
const VenueCategory = Loadable(lazy(() => import('views/VenueCategory')));
const FoodMenu = Loadable(lazy(() => import('views/FoodMenu')));
const VenueListView = Loadable(lazy(() => import('views/VenueListView')));

// reports
const ExpenseReport = Loadable(lazy(() => import('views/ExpenseReport')));
const DisbursementReport = Loadable(lazy(() => import('views/DisburseReport')));
const TripReport = Loadable(lazy(() => import('views/TripReport')));
const VatReport = Loadable(lazy(() => import('views/VatReport')));
const TripDetail = Loadable(lazy(() => import('views/TripDetails')));

// vehicles
const CreateNew = Loadable(lazy(() => import('views/CreateNew')));
const List = Loadable(lazy(() => import('views/List')));
const ListView = Loadable(lazy(() => import('views/ListView')));
const Category = Loadable(lazy(() => import('views/Category')));
const Brandlist = Loadable(lazy(() => import('views/BrandList')));
// driver
const AddDriver = Loadable(lazy(() => import('views/AddDriver')));
const Drivers = Loadable(lazy(() => import('views/Drivers')));
const DriverView = Loadable(lazy(() => import('views/DriverView')));

// marketing
const Coupon = Loadable(lazy(() => import('views/Coupon')));
const Banners = Loadable(lazy(() => import('views/Banners')));

// business
const ProviderConfig = Loadable(lazy(() => import('views/ProviderConfig')));
const Notification = Loadable(lazy(() => import('views/Notification')));
const BusinessPlan = Loadable(lazy(() => import('views/BusinessPlan')));
const ChangePlan = Loadable(lazy(() => import('views/ChangePlan')));
const MyShop = Loadable(lazy(() => import('views/MyShop')));
const ShiftPlan = Loadable(lazy(() => import('views/ShiftPlan')));
const EditProvider = Loadable(lazy(() => import('views/EditProvider')));
const Wallet = Loadable(lazy(() => import('views/Wallet')));
const Disbursement = Loadable(lazy(() => import('views/Disbursement')));
const Review = Loadable(lazy(() => import('views/Review')));
const Chat = Loadable(lazy(() => import('views/Chat')));

// employee
const EmployeeRole = Loadable(lazy(() => import('views/EmployeeRole')));
const AddEmployee = Loadable(lazy(() => import('views/AddEmployee')));
const EmployeeList = Loadable(lazy(() => import('views/EmployeeList')));

// sample page
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const VenueMyShop = Loadable(lazy(() => import('views/VenueMyShop')));

//venuereport

const VenueReport = Loadable(lazy(() => import('views/Venuereport')));
const VenueTaxReport = Loadable(lazy(() => import('views/VenueTaxReport')));
const VenueExpReport = Loadable(lazy(() => import('views/VenueExpReport')));
const VenueDisburseRepo = Loadable(lazy(() => import('views/VenueDisburseRepo')));

//venue employee
const VenueEmpRole = Loadable(lazy(() => import('views/VenueEmpRole')));

//----------------------------------------------------------------------------//

//CATERING
const AddPackage = Loadable(lazy(() => import('views/catering/AddPackage')));
const PackageList = Loadable(lazy(() => import('views/catering/PackageList')));
const CateringReport = Loadable(lazy(() => import('views/catering/CateringReport')));
const EmployeRole = Loadable(lazy(() => import('views/catering/EmployeRole')));
const CateringtaxReport = Loadable(lazy(() => import('views/catering/CateringTax')));
const CateringDisburse = Loadable(lazy(() => import('views/catering/CateringDisburse')));
const CateringExpense = Loadable(lazy(() => import('views/catering/CateringExpense')));



// MAKEUP
const AddmakeupPackage = Loadable(lazy(() => import('../views/makeup/AddmakePackage')));
const MakeupList = Loadable(lazy(() => import('../views/makeup/Makeuplist')));
const Portfolio = Loadable(lazy(() => import('../views/makeup/MakeupPortfolio')));
// const EmployeRole = Loadable(lazy(() => import('views/catering/EmployeRole')));
// const CateringtaxReport = Loadable(lazy(() => import('views/catering/CateringTax')));
// const CateringDisburse = Loadable(lazy(() => import('views/catering/CateringDisburse')));
// const CateringExpense = Loadable(lazy(() => import('views/catering/CateringExpense')));


// photographyy
const AddphotographyPackage = Loadable(lazy(() => import('../views/photography/AddphotographyPackage')));
const Photographylist = Loadable(lazy(() => import('../views/photography/Photographylist')));
const PhotographyPortfolio = Loadable(lazy(() => import('../views/photography/Photoportfolio')));
//----------------------------------------------------------------------------//

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    // ✅ Public login route
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'forgot-password', element: <Forgotpass /> },
    { path: 'delete-profile', element: <DeleteProfile /> },

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
          children: [{ path: 'default', element: <DashboardDefault /> }]
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
            { path: 'listview/:id', element: <ListView /> }
          ]
        },
        {
          path: 'vehicles',
          children: [
            { path: 'categories', element: <Category /> },
            { path: 'brands', element: <Brandlist /> }
          ]
        },
        {
          path: 'vehicle',
          children: [
            { path: 'new', element: <AddDriver /> },
            { path: 'add', element: <Drivers /> },
            { path: 'driverview', element: <DriverView /> },
            { path: 'newcoupon', element: <Coupon /> }
            // { path: 'banners', element: <VehicleBanners/> }
          ]
        },
        {
          path: 'business',
          children: [
            { path: 'new', element: <ProviderConfig /> },
            { path: 'add', element: <Notification /> },
            { path: 'list', element: <MyShop /> },
            { path: 'editpro', element: <EditProvider /> },
            { path: 'plan', element: <BusinessPlan /> },
            { path: 'changeplan', element: <ChangePlan /> },
            { path: 'shiftplan', element: <ShiftPlan /> },
            { path: 'export', element: <Wallet /> },
            { path: 'disburse', element: <Disbursement /> },
            { path: 'review', element: <Review /> },
            { path: 'chat', element: <Chat /> }
          ]
        },
        {
          path: 'report',
          children: [
            { path: 'expense', element: <ExpenseReport /> },
            { path: 'disburse', element: <DisbursementReport /> },
            { path: 'trip', element: <TripReport /> },
            { path: 'tripdetail', element: <TripDetail /> },
            { path: 'vat', element: <VatReport /> }
          ]
        },
        //venue report
        {
          path: 'report',
          children: [
            { path: 'venueexp', element: <VenueExpReport /> },
            { path: 'disbursement', element: <VenueDisburseRepo /> },
            { path: 'venuereport', element: <VenueReport /> },
            { path: 'venuetax', element: <VenueTaxReport /> }
          ]
        },
        {
          path: 'employee',
          children: [
            { path: 'role', element: <EmployeeRole /> },
            { path: 'new', element: <AddEmployee /> },
            { path: 'list', element: <EmployeeList /> }
          ]
        },
        { path: 'sample-page', element: <SamplePage /> },
        {
          path: 'bookings',
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
        { path: '/page-not-found', element: <PageNotFound /> },

        {
          path: 'venue-setup',
          children: [
            { path: '/venue-setup/new', element: <VenueCreate /> },
            { path: '/venue-setup/new/:id', element: <VenueCreate /> },
            { path: '/venue-setup/lists', element: <VenueList /> },
            { path: '/venue-setup/foodmenu', element: <FoodMenu /> },
            { path: '/venue-setup/listview/:id', element: <VenueListView /> }
          ]
        },
        {
          path: 'venue',
          children: [
            { path: '/venue/categories', element: <VenueCategory /> },
            { path: '/venue/schedules', element: <Schedules /> }
          ]
        },
        //venue employee
        {
          path: 'employee',
          children: [{ path: '/employee/venuerole', element: <VenueEmpRole /> }]
        },
        {
          path: 'business',
          children: [{ path: '/business/myshop', element: <VenueMyShop /> }]
        },
        {
          path: 'providers',
          children: [
            { path: 'banners', element: <Banners /> },
            { path: 'newcoupon', element: <Coupon /> }
          ]
        },

        //CATERING
        {
          path: 'catering',
          children: [
            { path: 'addpackage', element: <AddPackage /> },
            { path: 'packagelist', element: <PackageList /> },
            { path: 'cateringreport', element: <CateringReport /> }
          ]
        },
        {
          path: 'report',
          children: [
            { path: 'cateringreport', element: <CateringReport /> },
            { path: 'cateringtax', element: <CateringtaxReport /> },
            { path: 'cater-disburse', element: <CateringDisburse /> },
            { path: 'cateringexp', element: <CateringExpense /> }
          ]
        },
        {
          path: 'employee',
          children: [{ path: 'cateringrole', element: <EmployeRole /> }]
        },




         //MAKEUP
        {
          path: 'makeup',
          children: [
            { path: 'addpackage', element: <AddmakeupPackage /> },
            { path: 'packagelist', element: <MakeupList /> },
            { path: 'portfolio', element: <Portfolio /> }
          ]
        },
        {
          path: 'report',
          children: [
            { path: 'makeupreport', element: <CateringReport /> },
            { path: 'makeuptax', element: <CateringtaxReport /> },
            { path: 'disbursement', element: <CateringDisburse /> },
            { path: 'makeupexp', element: <CateringExpense /> }
          ]
        },
        {
          path: 'employee',
          children: [{ path: 'cateringrole', element: <EmployeRole /> }]
        },



        // photographyyyyy
        {
          path: 'photography',
          children: [
            { path: 'addpackage', element: <AddphotographyPackage /> },
            { path: 'packagelist', element: <Photographylist /> },
            { path: 'portfolio', element: <PhotographyPortfolio /> }
          ]
        },
        {
          path: 'report',
          children: [
            { path: 'photographyreport', element: <CateringReport /> },
            { path: 'phoographytax', element: <CateringtaxReport /> },
            { path: 'disbursement', element: <CateringDisburse /> },
            { path: 'photographyexp', element: <CateringExpense /> }
          ]
        },
        {
          path: 'employee',
          children: [{ path: 'cateringrole', element: <EmployeRole /> }]
        }
      ]
    }
  ]
};
export default MainRoutes;
