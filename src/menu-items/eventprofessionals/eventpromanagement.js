import {
    IconTools, IconUserPlus, IconListDetails, IconCategory,
    IconCrown, IconPhoto, IconCalendarEvent, IconMessageCircle, IconUsers
} from '@tabler/icons-react';

const icons = { IconTools, IconUserPlus, IconListDetails, IconCategory, IconCrown, IconPhoto, IconCalendarEvent, IconMessageCircle, IconUsers };

const eventpromanagement = {
    id: 'eventpro-management',
    title: 'EVENT PRO MANAGEMENT',
    type: 'group',
    icon: icons.IconTools,
    children: [
        {
            id: 'eventpro-setup',
            title: 'Event Professionals',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                { id: 'add-package', title: 'Add Package', type: 'item', url: '/eventprofessionals/addpackage', icon: icons.IconUserPlus },
                { id: 'package-list', title: 'Package List', type: 'item', url: '/eventprofessionals/packagelist', icon: icons.IconListDetails }
            ]
        },
        { id: 'eventpro-categories', title: 'Categories', type: 'item', url: '/eventprofessionals/categories', icon: icons.IconCategory },
        { id: 'eventpro-upgrade', title: 'Upgrade', type: 'item', url: '/eventprofessionals/upgrade', icon: icons.IconCrown },
        { id: 'eventpro-portfolio', title: 'Portfolio', type: 'item', url: '/eventprofessionals/portfolio', icon: icons.IconPhoto },
        { id: 'eventpro-enquiries', title: 'Enquiries', type: 'item', url: '/eventprofessionals/enquiry', icon: icons.IconMessageCircle }
    ]
};

export default eventpromanagement;
