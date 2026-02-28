import React from 'react';
import { Security } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getBouncersPackageData = (booking) => {
    // The backend uses 'bouncersId' or similar. 
    // Usually it's 'packageId' if generic.
    const pkg = booking.bouncersId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Bouncers Package',
        thumbnail: pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.title || 'Bouncers & Security',
        id: pkg._id || 'N/A'
    };
};

const Bouncersbookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['bouncers', 'security', 'Bouncers', 'Security']}
            moduleLabel="Bouncers & Security"
            moduleUrlName="bouncers"
            getDataFn={getBouncersPackageData}
            ModuleIcon={Security}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default Bouncersbookings;
