import React from 'react';
import { Spa } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getMehandiPackageData = (booking) => {
    // The backend uses 'mehandiId' field in bookings
    const pkg = booking.mehandiId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Mehandi Package',
        thumbnail: pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.title || 'Mehandi Artist',
        id: pkg._id || 'N/A'
    };
};

const Mehandibookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['mehandi', 'mehandi artist', 'Mehandi', 'Mehandi Artist']}
            moduleLabel="Mehandi"
            moduleUrlName="mehandi"
            getDataFn={getMehandiPackageData}
            ModuleIcon={Spa}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default Mehandibookings;
