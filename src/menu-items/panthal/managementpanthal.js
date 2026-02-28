import {
    IconDashboard, IconUserPlus, IconUsers, IconBriefcase, IconCalendarEvent,
    IconCreditCard, IconUserCheck, IconClock, IconCurrencyDollar, IconKey, IconGraph
} from '@tabler/icons-react';

const icons = { IconDashboard, IconUserPlus, IconUsers, IconBriefcase, IconCalendarEvent, IconCreditCard, IconUserCheck, IconClock, IconKey, IconGraph };

const panthalManagementMenu = {
    title: 'Panthal & Decorations Management',
    id: 'panthal-decorations',
    type: 'group',
    icon: icons.IconBriefcase,
    children: [
        {
            id: 'panthal-bookings',
            title: 'Bookings',
            type: 'collapse',
            icon: icons.IconCalendarEvent,
            children: [
                { id: 'all-panthal', title: 'All', type: 'item', url: '/bookings/allpanthal', icon: icons.IconDashboard },
                { id: 'pending-panthal', title: 'Pending', type: 'item', url: '/bookings/pendingpanthal', icon: icons.IconClock },
                { id: 'confirmed-panthal', title: 'Confirmed', type: 'item', url: '/bookings/panthalconfirmed', icon: icons.IconUserCheck },
                { id: 'completed-panthal', title: 'Completed', type: 'item', url: '/bookings/completedpanthal', icon: icons.IconGraph },
                { id: 'cancelled-panthal', title: 'Canceled', type: 'item', url: '/bookings/cancelledpanthal', icon: icons.IconKey },
                { id: 'payment-failed-panthal', title: 'Payment Failed', type: 'item', url: '/bookings/paymentfailedpanthal', icon: icons.IconCreditCard }
            ]
        }
    ]
};

export default panthalManagementMenu;
