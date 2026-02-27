import {
    IconPalette,        // Design / Invitation Setup
    IconPrinter,        // Printing
    IconPackage,        // Package
    IconListDetails,    // Package List
    IconCategory,       // Categories
    IconCrown,          // Upgrade
    IconPhoto,          // Portfolio
    IconCalendarEvent,  // Schedules
    IconMessageCircle   // Enquiries
} from '@tabler/icons-react';

const icons = {
    IconPalette,
    IconPrinter,
    IconPackage,
    IconListDetails,
    IconCategory,
    IconCrown,
    IconPhoto,
    IconCalendarEvent,
    IconMessageCircle
};

const invitationmanagement = {
    id: 'invitation-management',
    title: 'INVITATION MANAGEMENT',
    type: 'group',
    children: [
        {
            id: 'invitation-setup',
            title: 'Invitation & Printing Setup',
            type: 'collapse',
            icon: icons.IconPalette,
            children: [
                {
                    id: 'add-invitation-package',
                    title: 'Add Package',
                    type: 'item',
                    url: '/invitation/add-package',
                    icon: icons.IconPackage
                },
                {
                    id: 'invitation-package-list',
                    title: 'Package List',
                    type: 'item',
                    url: '/invitation/list',
                    icon: icons.IconListDetails
                }
            ]
        },
        {
            id: 'invitation-categories',
            title: 'Categories',
            type: 'item',
            url: '/invitation/categories',
            icon: icons.IconCategory
        },
        {
            id: 'invitation-upgrade',
            title: 'Upgrade',
            type: 'item',
            url: '/invitation/upgrade',
            icon: icons.IconCrown
        },
        {
            id: 'invitation-portfolio',
            title: 'Portfolio',
            type: 'item',
            url: '/invitation/portfolio',
            icon: icons.IconPhoto
        },
        {
            id: 'invitation-schedules',
            title: 'Schedules',
            type: 'item',
            url: '/invitation/schedules',
            icon: icons.IconCalendarEvent
        },
        {
            id: 'invitation-enquiries',
            title: 'Enquiries',
            type: 'item',
            url: '/invitation/enquiry',
            icon: icons.IconMessageCircle
        }
    ]
};

export default invitationmanagement;