import React from 'react';
import PremiumBookings from '../Common/PremiumBookings';
import { Cake as CakeIcon } from '@mui/icons-material';

const CakeBookings = (props) => {
    return (
        <PremiumBookings
            {...props}
            moduleType="cake"
            moduleUrlName="cake"
            moduleLabel="Cake"
            primaryColor="#f43f5e" // Rose color for cake
            moduleIcon={CakeIcon}
            getDataFn={(b) => {
                // Robust extraction for cakes
                const cakeRef = b.cakeId || b.packageId || {};
                const cartItem = (b.cakeCart && b.cakeCart.length > 0) ? b.cakeCart[0] : null;

                return {
                    name: cartItem?.name || cakeRef.name || b.packageName || 'Cake Order',
                    thumbnail: cartItem?.image || cakeRef.thumbnail || b.thumbnail || '',
                    category: cakeRef.category?.title || 'Cakes',
                    id: cakeRef._id || b._id || 'N/A'
                };
            }}
        />
    );
};

export default CakeBookings;
