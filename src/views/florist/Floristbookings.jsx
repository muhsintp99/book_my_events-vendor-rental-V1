import React from 'react';
import { LocalFlorist } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getFloristPackageData = (booking) => {
    // The backend uses 'floristId' or similar. We should check the booking model if possible, 
    // but usually it's module-specific id or packageId.
    const pkg = booking.floristId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Florist Package',
        thumbnail: pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.title || 'Florist & Stage Decoration',
        id: pkg._id || 'N/A'
    };
};

const Floristbookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['florist', 'florist & stage decoration', 'Florist', 'Florist & Stage Decoration']}
            moduleLabel="Florist"
            moduleUrlName="florist"
            getDataFn={getFloristPackageData}
            ModuleIcon={LocalFlorist}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default Floristbookings;
