import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Schedules from '../Schedules';

const Schedulesinvitation = () => {
    return (
        <Schedules
            moduleLabel="Invitation"
            moduleUrlName="invitation"
            ModuleIcon={CalendarMonthIcon}
        />
    );
};

export default Schedulesinvitation;
