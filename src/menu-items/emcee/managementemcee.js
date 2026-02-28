// assets
import {
    IconDashboard,
    IconUserPlus,
    IconUsers,
    IconBuildingSkyscraper,
    IconBriefcase,
    IconFileText,
    IconVideo,
    IconBell,
    IconCalendarEvent,
    IconCreditCard,
    IconSettings,
    IconCalendar,
    IconUserCheck,
    IconClock,
    IconCurrencyDollar,
    IconKey,
    IconGraph
} from '@tabler/icons-react';

// constants
const icons = {
    IconDashboard,
    IconUserPlus,
    IconUsers,
    IconBuildingSkyscraper,
    IconBriefcase,
    IconFileText,
    IconVideo,
    IconBell,
    IconCalendarEvent,
    IconCreditCard,
    IconSettings,
    IconCalendar,
    IconUserCheck,
    IconClock,
    IconCurrencyDollar,
    IconKey,
    IconGraph
};

// ==============================|| EMCEE MANAGEMENT MENU ||============================== //

const emceeManagementMenu = {
    title: 'Emcee & Event Host Management',
    id: 'emcee-event-host',
    type: 'group',
    icon: icons.IconBriefcase,
    children: [
        {
            id: 'emcee-bookings',
            title: 'Bookings',
            type: 'collapse',
            icon: icons.IconCalendarEvent,
            children: [
                {
                    id: 'all-emcee',
                    title: 'All',
                    type: 'item',
                    url: '/bookings/allemcee',
                    icon: icons.IconDashboard
                },
                {
                    id: 'pending-emcee',
                    title: 'Pending',
                    type: 'item',
                    url: '/bookings/pendingemcee',
                    icon: icons.IconClock
                },
                {
                    id: 'confirmed-emcee',
                    title: 'Confirmed',
                    type: 'item',
                    url: '/bookings/emceeconfirmed',
                    icon: icons.IconUserCheck
                },
                {
                    id: 'completed-emcee',
                    title: 'Completed',
                    type: 'item',
                    url: '/bookings/completedemcee',
                    icon: icons.IconGraph
                },
                {
                    id: 'cancelled-emcee',
                    title: 'Canceled',
                    type: 'item',
                    url: '/bookings/cancelledemcee',
                    icon: icons.IconKey
                },
                {
                    id: 'payment-failed-emcee',
                    title: 'Payment Failed',
                    type: 'item',
                    url: '/bookings/paymentfailedemcee',
                    icon: icons.IconCreditCard
                }
            ]
        }
    ]
};

export default emceeManagementMenu;
