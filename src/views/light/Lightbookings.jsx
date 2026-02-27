import React from 'react';
import { Lightbulb } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getLightPackageData = (booking) => {
    // The backend uses 'lightId' or similar. 
    // Usually it's 'packageId' if generic.
    const pkg = booking.lightId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Light Package',
        thumbnail: pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.title || 'Light & Sound',
        id: pkg._id || 'N/A'
    };
};

const Lightbookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['light', 'lighting', 'light & sound', 'Light', 'Lighting', 'Light & Sound']}
            moduleLabel="Light & Sound"
            moduleUrlName="light"
            getDataFn={getLightPackageData}
            ModuleIcon={Lightbulb}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default Lightbookings;
