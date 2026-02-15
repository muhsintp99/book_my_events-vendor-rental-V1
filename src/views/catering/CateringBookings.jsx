import React from 'react';
import PremiumBookings from '../Common/PremiumBookings';
import { Restaurant } from '@mui/icons-material';

const CateringBookings = (props) => {
    return (
        <PremiumBookings
            {...props}
            moduleType={['Catering', 'catering']}
            moduleUrlName="catering"
            moduleLabel="Catering"
            primaryColor="#10b981" // Green for catering
            moduleIcon={Restaurant}
            getDataFn={(b) => {
                const caterRef = b.cateringId || b.packageId || {};
                return {
                    name: caterRef.title || b.packageName || 'Catering Service',
                    thumbnail: caterRef.thumbnail || (caterRef.images && caterRef.images.length > 0 ? caterRef.images[0] : (b.thumbnail || '')),
                    category: caterRef.category?.title || 'Catering',
                    id: caterRef._id || b._id || 'N/A'
                };
            }}
        />
    );
};

export default CateringBookings;
