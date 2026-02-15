import React from 'react';
import PremiumBookings from '../Common/PremiumBookings';
import { CameraAlt } from '@mui/icons-material';

const PhotographyBookings = (props) => {
    return (
        <PremiumBookings
            {...props}
            moduleType="photography"
            moduleUrlName="photography"
            moduleLabel="Photography"
            primaryColor="#ec4899" // Pinkish color for photography
            moduleIcon={CameraAlt}
            getDataFn={(b) => {
                // Photography specific data extraction
                const photoRef = b.photographyId || b.packageId || {};
                const galleryImg = (photoRef.gallery && photoRef.gallery.length > 0) ? photoRef.gallery[0] : '';

                return {
                    name: photoRef.packageTitle || b.packageName || 'Photography Session',
                    thumbnail: photoRef.thumbnail || galleryImg || b.thumbnail || '',
                    category: photoRef.categories?.[0]?.title || 'Photography',
                    id: photoRef.photographyId || photoRef._id || b._id || 'N/A'
                };
            }}
        />
    );
};

export default PhotographyBookings;
