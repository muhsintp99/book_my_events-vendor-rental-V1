import React from 'react';
import { Celebration } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getPanthalPackageData = (booking) => {
    const pkg = booking.panthalId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Panthal & Decorations Package',
        thumbnail: pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.title || 'Panthal & Decorations',
        id: pkg._id || 'N/A'
    };
};

const Panthalbookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['panthal', 'Panthal', 'panthal & decorations', 'Panthal & Decorations']}
            moduleLabel="Panthal & Decorations"
            moduleUrlName="panthal"
            getDataFn={getPanthalPackageData}
            ModuleIcon={Celebration}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default Panthalbookings;
