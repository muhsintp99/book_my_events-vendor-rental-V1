import React from 'react';
import PremiumBookings from '../Common/PremiumBookings';
import { Brush } from '@mui/icons-material';

const MakeupBookings = (props) => {
    return (
        <PremiumBookings
            {...props}
            moduleType={['Makeup', 'Makeup Artist', 'makeupartist']}
            moduleUrlName="makeup"
            moduleLabel="Makeup Artist"
            primaryColor="#8b5cf6" // Purple for makeup
            moduleIcon={Brush}
            getDataFn={(b) => {
                const pkg = b.makeupId || b.packageId || {};
                return {
                    name: pkg.packageTitle || b.packageName || 'Makeup Session',
                    thumbnail: (pkg.gallery && pkg.gallery.length > 0) ? pkg.gallery[0] : (pkg.thumbnail || b.thumbnail || ''),
                    category: pkg.makeupType || 'Makeup',
                    id: pkg._id || b._id || 'N/A'
                };
            }}
        />
    );
};

export default MakeupBookings;
