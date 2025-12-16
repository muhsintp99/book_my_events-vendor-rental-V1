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
const Upgradevenue = Loadable(lazy(() => import('../views/audiupgrade')));


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
const Upgrade = Loadable(lazy(() => import('../views/upgrade')));

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

//CATERING
const AddPackage = Loadable(lazy(() => import('views/catering/AddPackage')));
const PackageList = Loadable(lazy(() => import('views/catering/PackageList')));
const CateringReport = Loadable(lazy(() => import('views/catering/CateringReport')));
const EmployeRole = Loadable(lazy(() => import('views/catering/EmployeRole')));
const CateringtaxReport = Loadable(lazy(() => import('views/catering/CateringTax')));
const CateringDisburse = Loadable(lazy(() => import('views/catering/CateringDisburse')));
const CateringExpense = Loadable(lazy(() => import('views/catering/CateringExpense')));
const Cateringupgrade = Loadable(lazy(() => import('../views/catering/cateringupgrade')));


// Bookings
const Allbookings = Loadable(lazy(() => import('../views/Alltrips')));
const Scheduledbookings = Loadable(lazy(() => import('../views/Scheduled')));
const Pendingbookings = Loadable(lazy(() => import('../views/Pendings')));
const Confirmedbookings = Loadable(lazy(() => import('../views/Confirmed')));
const Ongoingbookings = Loadable(lazy(() => import('../views/Ongoing')));
const Completedbookings = Loadable(lazy(() => import('../views/Completed')));
const Cancelledbookings = Loadable(lazy(() => import('../views/Canceled')));
const Paymentfailedbookings = Loadable(lazy(() => import('../views/PaymentFailed')));

// MAKEUP
const AddmakeupPackage = Loadable(lazy(() => import('../views/makeup/AddmakePackage')));
const MakeupList = Loadable(lazy(() => import('../views/makeup/Makeuplist')));
const Portfolio = Loadable(lazy(() => import('../views/makeup/MakeupPortfolio')));

// MAKEUP BOOKINGS
const AllMakeup = Loadable(lazy(() => import('views/makeup/Allmakeup')));
const MakeupPending = Loadable(lazy(() => import('views/makeup/Makeuppending')));
const MakeupConfirmed = Loadable(lazy(() => import('views/makeup/Makeupconfirmed')));
const MakeupCompleted = Loadable(lazy(() => import('views/makeup/Makeupcompleted')));
const MakeupCancelled = Loadable(lazy(() => import('views/makeup/Makeupcancelled')));
const MakeupPaymentFailed = Loadable(lazy(() => import('../views/PaymentFailed')));
const Makeupupgrade = Loadable(lazy(() => import('../views/makeup/makeupupgrade')));

//PHOTOGRAPHY BOOKINGS
const AllPhotography = Loadable(lazy(() => import('../views/photography/Allphotography')));
const PhotographyPending = Loadable(lazy(() => import('../views/photography/Photographypending')));
const PhotographyConfirmed = Loadable(lazy(() => import('../views/photography/Photographyconfirmed')));
const PhotographyCompleted = Loadable(lazy(() => import('../views/photography/Photographycompleted')));
const PhotographyCancelled = Loadable(lazy(() => import('../views/photography/Allphotography')));
const PhotographyPaymentFailed = Loadable(lazy(() => import('../views/PaymentFailed')));


// CATERING BOOKINGS
const AllCatering = Loadable(lazy(() => import('../views/catering/AllCatering')));
const CateringPending = Loadable(lazy(() => import('../views/catering/CateringPending')));
const CateringConfirmed = Loadable(lazy(() => import('../views/catering/CateringConfirmed')));
const CateringCompleted = Loadable(lazy(() => import('../views/catering/CateringCompleted')));
const CateringCancelled = Loadable(lazy(() => import('../views/catering/CateringCancelled')));
const CateringPaymentFailed = Loadable(lazy(() => import('../views/PaymentFailed')));

// PHOTOGRAPHY
const AddphotographyPackage = Loadable(lazy(() => import('../views/photography/AddphotographyPackage')));
const Photographylist = Loadable(lazy(() => import('../views/photography/Photographylist')));
const PhotographyPortfolio = Loadable(lazy(() => import('../views/photography/Photoportfolio')));
const Photographyupgrade = Loadable(lazy(() => import('../views/photography/photoupgrade')));



// ===========================|| MAIN ROUTING ||============================ //

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
            { path: 'brands', element: <Brandlist /> },
            { path: 'upgrade', element: <Upgrade /> }

          ]
        },
        {
          path: 'vehicle',
          children: [
            { path: 'new', element: <AddDriver /> },
            { path: 'add', element: <Drivers /> },
            { path: 'driverview', element: <DriverView /> },
            { path: 'newcoupon', element: <Coupon /> }
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
            { path: 'chat', element: <Chat /> },
            { path: 'myshop', element: <VenueMyShop /> }
          ]
        },
        {
          path: 'report',
          children: [
            { path: 'expense', element: <ExpenseReport /> },
            { path: 'disburse', element: <DisbursementReport /> },
            { path: 'trip', element: <TripReport /> },
            { path: 'tripdetail', element: <TripDetail /> },
            { path: 'vat', element: <VatReport /> },
            { path: 'venueexp', element: <VenueExpReport /> },
            { path: 'disbursement', element: <VenueDisburseRepo /> },
            { path: 'venuereport', element: <VenueReport /> },
            { path: 'venuetax', element: <VenueTaxReport /> },
            { path: 'cateringreport', element: <CateringReport /> },
            { path: 'cateringtax', element: <CateringtaxReport /> },
            { path: 'cater-disburse', element: <CateringDisburse /> },
            { path: 'cateringexp', element: <CateringExpense /> },
            { path: 'makeupreport', element: <CateringReport /> },
            { path: 'makeuptax', element: <CateringtaxReport /> },
            { path: 'makeupexp', element: <CateringExpense /> },
            { path: 'photographyreport', element: <CateringReport /> },
            { path: 'phoographytax', element: <CateringtaxReport /> },
            { path: 'photographyexp', element: <CateringExpense /> }
          ]
        },

        // Bookings (General)
        {
          path: 'bookings',
          children: [
            { path: 'all', element: <Allbookings /> },
            { path: 'scheduled', element: <Scheduledbookings /> },
            { path: 'Pending', element: <Pendingbookings /> },
            { path: 'confirmed', element: <Confirmedbookings /> },
            { path: 'ongoing', element: <Ongoingbookings /> },
            { path: 'completed', element: <Completedbookings /> },
            { path: 'cancelled', element: <Cancelledbookings /> },
            { path: 'paymentfailedbookings', element: <Paymentfailedbookings /> },
            // MAKEUP BOOKINGS
            { path: 'allmakeup', element: <AllMakeup /> },
            { path: 'pendingmakeup', element: <MakeupPending /> },
            { path: 'makeupconfirmed', element: <MakeupConfirmed /> },
            { path: 'completedmakeup', element: <MakeupCompleted /> },
            { path: 'cancelledmakeup', element: <MakeupCancelled /> },
            { path: 'paymentfailedmakeup', element: <MakeupPaymentFailed /> },

            // CATERING BOOKINGS
             { path: 'allcatering', element: <AllCatering /> },
            { path: 'pendingcatering', element: <CateringPending /> },
            { path: 'cateringconfirmed', element: <CateringConfirmed /> },
            { path: 'completedcatering', element: <CateringCompleted /> },
            { path: 'cancelledcatering', element: <CateringCancelled /> },
            { path: 'paymentfailedcatering', element: <CateringPaymentFailed /> },

            // PHOTOGRAPHY BOOKINGS
              { path: 'allphotography', element: <AllPhotography /> },
            { path: 'pendingphotography', element: <PhotographyPending /> },
            { path: 'photographyconfirmed', element: <PhotographyConfirmed /> },
            { path: 'completedphotography', element: <PhotographyCompleted /> },
            { path: 'cancelledphotography', element: <PhotographyCancelled /> },
            { path: 'paymentfailedphotography', element: <PhotographyPaymentFailed /> },
          ]
        },

        {
          path: 'employee',
          children: [
            { path: 'role', element: <EmployeeRole /> },
            { path: 'new', element: <AddEmployee /> },
            { path: 'list', element: <EmployeeList /> },
            { path: 'venuerole', element: <VenueEmpRole /> },
            { path: 'cateringrole', element: <EmployeRole /> }
          ]
        },
        { path: 'sample-page', element: <SamplePage /> },
        { path: '/page-not-found', element: <PageNotFound /> },

        {
          path: 'venue-setup',
          children: [
            { path: 'new', element: <VenueCreate /> },
            { path: 'new/:id', element: <VenueCreate /> },
            { path: 'lists', element: <VenueList /> },
            { path: 'foodmenu', element: <FoodMenu /> },
            { path: 'listview/:id', element: <VenueListView /> }
          ]
        },
        {
          path: 'venue',
          children: [
            { path: 'categories', element: <VenueCategory /> },
            { path: 'schedules', element: <Schedules /> },
                        { path: 'upgrade', element: <Upgradevenue /> }

            
          ]
        },
        {
          path: 'providers',
          children: [
            { path: 'banners', element: <Banners /> },
            { path: 'newcoupon', element: <Coupon /> }
          ]
        },

        // CATERING
        {
          path: 'catering',
          children: [
            { path: 'addpackage', element: <AddPackage /> },
            { path: 'packagelist', element: <PackageList /> },
            { path: 'cateringreport', element: <CateringReport /> },
            { path: 'upgrade', element: <Cateringupgrade /> },

          ]
        },

        // MAKEUP
        {
          path: 'makeupartist',
          children: [
            { path: 'addpackage', element: <AddmakeupPackage /> },
            { path: 'packagelist', element: <MakeupList /> },
            { path: 'portfolio', element: <Portfolio /> },
             { path: 'upgrade', element: <Makeupupgrade /> },

          ]
        },

        // PHOTOGRAPHY
        {
          path: 'photography',
          children: [
            { path: 'addpackage', element: <AddphotographyPackage /> },
            { path: 'packagelist', element: <Photographylist /> },
            { path: 'portfolio', element: <PhotographyPortfolio /> },
            { path: 'upgrade', element: <Photographyupgrade /> }

          ]
        }
      ]
    }
  ]
};

export default MainRoutes;