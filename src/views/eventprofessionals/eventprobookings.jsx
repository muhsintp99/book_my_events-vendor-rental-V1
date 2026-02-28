import React from 'react';
import { Engineering } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getEventproPackageData = (booking) => {
    const pkg = booking.eventproId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Event Professional Package',
        thumbnail: pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.title || 'Event Professionals',
        id: pkg._id || 'N/A'
    };
};

const Eventprobookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['event professionals', 'Event Professionals', 'eventprofessionals', 'eventpro']}
            moduleLabel="Event Professionals"
            moduleUrlName="eventprofessionals"
            getDataFn={getEventproPackageData}
            ModuleIcon={Engineering}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default Eventprobookings;
