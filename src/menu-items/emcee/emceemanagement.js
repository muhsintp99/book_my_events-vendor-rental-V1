import {
    IconMicrophone,      // Main Emcee Group
    IconUserPlus,        // Add Package
    IconListDetails,     // Package List
    IconCategory,        // Categories
    IconCrown,           // Upgrade
    IconPhoto,           // Portfolio
    IconCalendarEvent,   // Schedules
    IconMessageCircle,   // Enquiries
    IconUsers            // Emcee Group
} from '@tabler/icons-react';

const icons = {
    IconMicrophone,
    IconUserPlus,
    IconListDetails,
    IconCategory,
    IconCrown,
    IconPhoto,
    IconCalendarEvent,
    IconMessageCircle,
    IconUsers
};

const emceemanagement = {
    id: 'emcee-management',
    title: 'EMCEE MANAGEMENT',
    type: 'group',
    icon: icons.IconMicrophone,
    children: [
        {
            id: 'emcee-setup',
            title: 'Emcee & Event Host',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'add-package',
                    title: 'Add Package',
                    type: 'item',
                    url: '/emcee/addpackage',
                    icon: icons.IconUserPlus
                },
                {
                    id: 'package-list',
                    title: 'Package List',
                    type: 'item',
                    url: '/emcee/packagelist',
                    icon: icons.IconListDetails
                }
            ]
        },
        {
            id: 'emcee-categories',
            title: 'Categories',
            type: 'item',
            url: '/emcee/categories',
            icon: icons.IconCategory
        },
        {
            id: 'emcee-upgrade',
            title: 'Upgrade',
            type: 'item',
            url: '/emcee/upgrade',
            icon: icons.IconCrown
        },
        {
            id: 'emcee-portfolio',
            title: 'Portfolio',
            type: 'item',
            url: '/emcee/portfolio',
            icon: icons.IconPhoto
        },
        {
            id: 'emcee-enquiries',
            title: 'Enquiries',
            type: 'item',
            url: '/emcee/enquiry',
            icon: icons.IconMessageCircle
        }
    ]
};

export default emceemanagement;
