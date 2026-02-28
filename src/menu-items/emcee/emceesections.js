// assets
import {
    IconUserPlus,
    IconUserCheck,
    IconUsers,
    IconUpload,
    IconDownload
} from '@tabler/icons-react';

// constants
const icons = {
    IconUserPlus,
    IconUserCheck,
    IconUsers,
    IconUpload,
    IconDownload
};

// ==============================|| EMCEE SECTION MENU GROUP ||============================== //
const emceesection = {
    id: 'emcee-business-management',
    title: 'EMCEE & EVENT HOST SECTION',
    type: 'group',
    children: [
        {
            id: 'Reviews',
            title: 'Reviews',
            type: 'item',
            url: '/business/review',
            icon: icons.IconDownload,
            breadcrumbs: false
        }
    ]
};

export default emceesection;
