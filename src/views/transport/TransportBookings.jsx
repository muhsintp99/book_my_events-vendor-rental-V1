import React from 'react';
import PremiumBookings from '../Common/PremiumBookings';
import { DirectionsCar } from '@mui/icons-material';

const TransportBookings = (props) => {
    return (
        <PremiumBookings
            {...props}
            moduleType="transport"
            moduleUrlName="transport"
            moduleLabel="Transport"
            primaryColor="#3b82f6" // Blue for transport
            moduleIcon={DirectionsCar}
            getDataFn={(b) => {
                const pkg = b.packageId || {};
                return {
                    name: b.vehicleName || pkg.name || 'Vehicle Rental',
                    thumbnail: pkg.thumbnail || b.thumbnail || '',
                    category: pkg.vehicleType || 'Transport',
                    id: b.vehicleId || b._id || 'N/A'
                };
            }}
        />
    );
};

export default TransportBookings;
