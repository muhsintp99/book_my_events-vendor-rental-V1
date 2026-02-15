import React from 'react';
import PremiumBookings from '../Common/PremiumBookings';
import { DirectionsCar } from '@mui/icons-material';

const TransportBookings = (props) => {
    return (
        <PremiumBookings
            {...props}
            moduleType={['Transport', 'Vehicle', 'transport']}
            moduleUrlName="transport"
            moduleLabel="Transport"
            primaryColor="#3b82f6" // Blue for transport
            moduleIcon={DirectionsCar}
            getDataFn={(b) => {
                const pkg = b.vehicleId || b.packageId || {};
                return {
                    name: b.vehicleName || pkg.name || 'Vehicle Rental',
                    thumbnail: pkg.featuredImage || (pkg.galleryImages && pkg.galleryImages.length > 0 ? pkg.galleryImages[0] : (pkg.thumbnail || b.thumbnail || '')),
                    category: pkg.category?.title || pkg.vehicleType || 'Transport',
                    id: pkg._id || b.vehicleId || b._id || 'N/A'
                };
            }}
        />
    );
};

export default TransportBookings;
