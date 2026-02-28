import {
    IconBrush, IconUserPlus, IconListDetails, IconCategory,
    IconCrown, IconPhoto, IconCalendarEvent, IconMessageCircle, IconUsers
} from '@tabler/icons-react';

const icons = { IconBrush, IconUserPlus, IconListDetails, IconCategory, IconCrown, IconPhoto, IconCalendarEvent, IconMessageCircle, IconUsers };

const panthalmanagement = {
    id: 'panthal-management',
    title: 'PANTHAL MANAGEMENT',
    type: 'group',
    icon: icons.IconBrush,
    children: [
        {
            id: 'panthal-setup',
            title: 'Panthal & Decorations',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                { id: 'add-package', title: 'Add Package', type: 'item', url: '/panthal/addpackage', icon: icons.IconUserPlus },
                { id: 'package-list', title: 'Package List', type: 'item', url: '/panthal/packagelist', icon: icons.IconListDetails }
            ]
        },
        { id: 'panthal-categories', title: 'Categories', type: 'item', url: '/panthal/categories', icon: icons.IconCategory },
        { id: 'panthal-upgrade', title: 'Upgrade', type: 'item', url: '/panthal/upgrade', icon: icons.IconCrown },
        { id: 'panthal-portfolio', title: 'Portfolio', type: 'item', url: '/panthal/portfolio', icon: icons.IconPhoto },
        { id: 'panthal-enquiries', title: 'Enquiries', type: 'item', url: '/panthal/enquiry', icon: icons.IconMessageCircle }
    ]
};

export default panthalmanagement;
