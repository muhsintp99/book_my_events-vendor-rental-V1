import { IconUserPlus, IconUserCheck, IconUsers, IconUpload, IconDownload } from '@tabler/icons-react';
const icons = { IconUserPlus, IconUserCheck, IconUsers, IconUpload, IconDownload };

const panthalsection = {
    id: 'panthal-business-management',
    title: 'PANTHAL & DECORATIONS SECTION',
    type: 'group',
    children: [
        { id: 'Reviews', title: 'Reviews', type: 'item', url: '/business/review', icon: icons.IconDownload, breadcrumbs: false }
    ]
};

export default panthalsection;
