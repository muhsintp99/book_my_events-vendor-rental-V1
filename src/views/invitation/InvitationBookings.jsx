import React from 'react';
import { CardGiftcard } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getInvitationPackageData = (booking) => {
    // The backend uses 'invitationId' or 'packageId' field in bookings
    const pkg = booking.invitationId || booking.packageId || {};

    return {
        name: pkg.packageName || booking.packageName || 'Invitation Package',
        thumbnail: pkg.thumbnail || pkg.image || '',
        packageType: pkg.packageType || 'Standard',
        price: booking.packagePrice || pkg.packagePrice || 0,
        advance: booking.advanceAmount || pkg.advanceBookingAmount || 0,
        category: pkg.category?.name || 'Invitation',
        id: pkg._id || 'N/A'
    };
};

const InvitationBookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['invitation', 'invitation & printing', 'Invitation', 'Invitation & Printing']}
            moduleLabel="Invitation"
            moduleUrlName="invitation"
            getDataFn={getInvitationPackageData}
            ModuleIcon={CardGiftcard}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default InvitationBookings;
