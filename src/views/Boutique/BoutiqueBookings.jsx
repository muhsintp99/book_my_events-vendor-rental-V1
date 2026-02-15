import React from 'react';
import { Checkroom } from '@mui/icons-material';
import PremiumBookings from '../Common/PremiumBookings';

const getBoutiquePackageData = (booking) => {
    // The backend uses 'boutiqueId' field in bookings
    const pkg = booking.boutiqueId || booking.packageId || {};

    // Extract image - boutique packages use 'thumbnail' and 'galleryImages'
    let thumbnail = '';
    if (pkg.thumbnail) {
        thumbnail = pkg.thumbnail;
    } else if (pkg.galleryImages && pkg.galleryImages.length > 0) {
        thumbnail = pkg.galleryImages[0];
    }

    return {
        name: pkg.name || booking.packageName || 'Boutique Package',
        thumbnail: thumbnail,
        packageType: pkg.availabilityMode || booking.bookingMode || 'purchase',
        sizes: pkg.availableSizes || [],
        colors: pkg.availableColors || [],
        category: pkg.category?.title || 'Fashion',
        id: pkg._id || 'N/A'
    };
};

const BoutiqueBookings = ({ initialTab = 'All', hideTabs = false }) => {
    return (
        <PremiumBookings
            moduleType={['boutique', 'boutique artist', 'Boutique', 'Boutique Artist']}
            moduleLabel="Boutique"
            moduleUrlName="boutique"
            getDataFn={getBoutiquePackageData}
            ModuleIcon={Checkroom}
            initialTab={initialTab}
            hideTabs={hideTabs}
        />
    );
};

export default BoutiqueBookings;
