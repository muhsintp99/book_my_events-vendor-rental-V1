import React from 'react';
import PremiumBookings from '../Common/PremiumBookings';
import { Brush } from '@mui/icons-material';

const MakeupBookings = (props) => {
    return (
        <PremiumBookings
            {...props}
            moduleType="makeupartist"
            moduleUrlName="makeup"
            moduleLabel="Makeup Artist"
            primaryColor="#8b5cf6" // Purple for makeup
            moduleIcon={Brush}
            getDataFn={(b) => {
                const pkg = b.packageId || {};
                return {
                    name: pkg.name || b.packageName || 'Makeup Session',
                    thumbnail: pkg.thumbnail || b.thumbnail || '',
                    category: pkg.category?.title || 'Makeup',
                    id: pkg._id || b._id || 'N/A'
                };
            }}
        />
    );
};

export default MakeupBookings;
