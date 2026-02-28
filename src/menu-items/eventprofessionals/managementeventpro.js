import {
    IconDashboard, IconUserPlus, IconUsers, IconBriefcase, IconCalendarEvent,
    IconCreditCard, IconUserCheck, IconClock, IconKey, IconGraph
} from '@tabler/icons-react';

const icons = { IconDashboard, IconUserPlus, IconUsers, IconBriefcase, IconCalendarEvent, IconCreditCard, IconUserCheck, IconClock, IconKey, IconGraph };

const eventproManagementMenu = {
    title: 'Event Professionals Management',
    id: 'eventpro-bookings-group',
    type: 'group',
    icon: icons.IconBriefcase,
    children: [
        {
            id: 'eventpro-bookings',
            title: 'Bookings',
            type: 'collapse',
            icon: icons.IconCalendarEvent,
            children: [
                { id: 'all-eventpro', title: 'All', type: 'item', url: '/bookings/alleventpro', icon: icons.IconDashboard },
                { id: 'pending-eventpro', title: 'Pending', type: 'item', url: '/bookings/pendingeventpro', icon: icons.IconClock },
                { id: 'confirmed-eventpro', title: 'Confirmed', type: 'item', url: '/bookings/eventproconfirmed', icon: icons.IconUserCheck },
                { id: 'completed-eventpro', title: 'Completed', type: 'item', url: '/bookings/completedeventpro', icon: icons.IconGraph },
                { id: 'cancelled-eventpro', title: 'Canceled', type: 'item', url: '/bookings/cancelledeventpro', icon: icons.IconKey },
                { id: 'payment-failed-eventpro', title: 'Payment Failed', type: 'item', url: '/bookings/paymentfailedeventpro', icon: icons.IconCreditCard }
            ]
        }
    ]
};

export default eventproManagementMenu;
