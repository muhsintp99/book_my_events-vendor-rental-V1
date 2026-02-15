import React from 'react';
import { Diamond } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getOrnamentData = (booking) => {
    const pkg = booking.packageId || booking.ornamentId || booking.moduleId || {};
    return {
        name: pkg.name || pkg.title || booking.packageName || 'Ornament',
        thumbnail: pkg.thumbnail || booking.thumbnail || '',
        category: pkg.category?.title || pkg.material || 'Jewels',
        id: pkg.ornamentId || pkg._id || 'N/A'
    };
};

const OrnamentsBookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['Ornament', 'Ornaments', 'ornament', 'ornaments']}
            moduleLabel="Ornament"
            moduleUrlName="ornaments"
            getDataFn={getOrnamentData}
            ModuleIcon={Diamond}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default OrnamentsBookings;
