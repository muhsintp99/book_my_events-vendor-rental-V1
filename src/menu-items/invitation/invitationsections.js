// assets
import {
    IconDownload
} from '@tabler/icons-react';

// constants
const icons = {
    IconDownload
};

// ==============================|| DASHBOARD FULL MENU GROUP ||============================== //
const invitationsections = {
    id: 'invitation-business-management',
    title: 'INVITATION SECTION',
    type: 'group',
    children: [
        {
            id: 'invitation-Reviews',
            title: 'Reviews',
            type: 'item',
            url: '/invitation/review',
            icon: icons.IconDownload,
            breadcrumbs: false
        }
    ]
};

export default invitationsections;
