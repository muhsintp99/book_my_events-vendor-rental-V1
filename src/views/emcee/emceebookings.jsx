import React from 'react';
import { Mic } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getEmceePackageData = (booking) => {
    const pkg = booking.emceeId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Emcee Package',
        thumbnail: pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.title || 'Event Host / Emcee',
        id: pkg._id || 'N/A'
    };
};

const Emceebookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['emcee', 'Emcee', 'event host', 'Event Host']}
            moduleLabel="Event Host / Emcee"
            moduleUrlName="emcee"
            getDataFn={getEmceePackageData}
            ModuleIcon={Mic}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default Emceebookings;
