// assets
import {
    IconDashboard,
    IconBriefcase,
    IconCalendarEvent,
    IconCreditCard,
    IconUserCheck,
    IconClock,
    IconKey,
    IconGraph
} from '@tabler/icons-react';

// constants
const icons = {
    IconDashboard,
    IconBriefcase,
    IconCalendarEvent,
    IconCreditCard,
    IconUserCheck,
    IconClock,
    IconKey,
    IconGraph
};

// ==============================|| INVITATION MANAGEMENT MENU ||============================== //

const managementinvitation = {
    title: 'Invitation Management',
    id: 'management-invitation',
    type: 'group',
    icon: icons.IconBriefcase,
    children: [
        {
            id: 'invitation-bookings',
            title: 'Bookings',
            type: 'collapse',
            icon: icons.IconCalendarEvent,
            children: [
                {
                    id: 'all-invitation',
                    title: 'All',
                    type: 'item',
                    url: '/bookings/allinvitation',
                    icon: icons.IconDashboard
                },
                {
                    id: 'pending-invitation',
                    title: 'Pending',
                    type: 'item',
                    url: '/bookings/pendinginvitation',
                    icon: icons.IconClock
                },
                {
                    id: 'confirmed-invitation',
                    title: 'Confirmed',
                    type: 'item',
                    url: '/bookings/invitationconfirmed',
                    icon: icons.IconUserCheck
                },
                {
                    id: 'completed-invitation',
                    title: 'Completed',
                    type: 'item',
                    url: '/bookings/completedinvitation',
                    icon: icons.IconGraph
                },
                {
                    id: 'cancelled-invitation',
                    title: 'Canceled',
                    type: 'item',
                    url: '/bookings/cancelledinvitation',
                    icon: icons.IconKey
                },
                {
                    id: 'payment-failed-invitation',
                    title: 'Payment Failed',
                    type: 'item',
                    url: '/bookings/paymentfailedinvitation',
                    icon: icons.IconCreditCard
                }
            ]
        }
    ]
};

export default managementinvitation;
