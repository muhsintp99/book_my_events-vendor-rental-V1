// import React, { useState } from 'react';

// function BookingCalendar() {
//   const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 15)); // October 15, 2025
//   const [selectedDate, setSelectedDate] = useState(15);

//   // Dummy booking data (only a few booked/pending days, rest are free)
//   const bookingStatus = {
//     1: 'free', 2: 'free', 3: 'free', 4: 'free',
//     5: 'free', 6: 'free', 7: 'free', 8: 'free', 9: 'free', 10: 'free', 11: 'free',
//     12: 'free', 13: 'free', 14: 'free', 15: 'pending', 16: 'free', 17: 'booked',
//     18: 'free', 19: 'booked', 20: 'pending', 21: 'free', 22: 'free', 23: 'booked',
//     24: 'free', 25: 'free', 26: 'free', 27: 'free', 28: 'free', 29: 'free', 30: 'free', 31: 'free'
//   };

//   const bookings = {
//     15: [
//       {
//         id: 1,
//         time: '10:00 am - 2:00 pm',
//         bookedBy: 'Demo User 1',
//         location: 'Auditorium A',
//         status: 'PENDING',
//         color: '#ffd54f'
//       }
//     ],
//     17: [
//       {
//         id: 2,
//         time: '9:00 am - 3:00 pm',
//         bookedBy: 'John Smith',
//         location: 'Banquet Hall',
//         status: 'CONFIRMED',
//         color: '#ef5350'
//       }
//     ],
//     19: [
//       {
//         id: 3,
//         time: '1:00 pm - 6:00 pm',
//         bookedBy: 'Priya Sharma',
//         location: 'Conference Room 2',
//         status: 'CONFIRMED',
//         color: '#ef5350'
//       }
//     ],
//     20: [
//       {
//         id: 4,
//         time: '11:00 am - 4:00 pm',
//         bookedBy: 'Raj Patel',
//         location: 'Exhibition Hall',
//         status: 'PENDING',
//         color: '#ffd54f'
//       }
//     ],
//     23: [
//       {
//         id: 5,
//         time: '2:00 pm - 8:00 pm',
//         bookedBy: 'Alice Brown',
//         location: 'Ballroom',
//         status: 'CONFIRMED',
//         color: '#ef5350'
//       }
//     ]
//   };

//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     return { firstDay, daysInMonth };
//   };

//   const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
//   const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'booked': return '#ef5350'; // red
//       case 'pending': return '#ffd54f'; // yellow
//       case 'free': return '#66bb6a'; // green
//       default: return '#66bb6a';
//     }
//   };

//   const changeMonth = (direction) => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
//     setSelectedDate(null); // Reset selected date when month changes
//   };

//   const renderCalendarDays = () => {
//     const days = [];
//     const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     // Week day headers
//     weekDays.forEach(day => (
//       days.push(
//         <div key={day} style={styles.weekDay}>
//           {day}
//         </div>
//       )
//     ));

//     // Empty cells before month starts
//     for (let i = 0; i < firstDay; i++) {
//       days.push(<div key={`empty-${i}`} />);
//     }

//     // Calendar days
//     for (let day = 1; day <= daysInMonth; day++) {
//       const status = bookingStatus[day] || 'free';
//       const isSelected = day === selectedDate;

//       days.push(
//         <div
//           key={day}
//           onClick={() => setSelectedDate(day)}
//           style={{
//             ...styles.dayCell,
//             ...(isSelected ? { backgroundColor: '#ef5350', color: '#fff' } : {})
//           }}
//         >
//           <div style={styles.dayNumber}>{day}</div>
//           <div style={{
//             ...styles.statusDot,
//             backgroundColor: getStatusColor(status)
//           }} />
//         </div>
//       );
//     }

//     return days;
//   };

//   const selectedBookings = bookings[selectedDate] || [];
//   const selectedStatus = bookingStatus[selectedDate] || 'free';

//   const getStatusText = () => {
//     if (selectedBookings.length === 0) return 'No bookings - All slots available';
//     if (selectedStatus === 'booked') return `${selectedBookings.length} bookings - Fully booked`;
//     if (selectedStatus === 'pending') return `${selectedBookings.length} booking - Pending confirmation`;
//     return 'All slots available';
//   };

//   const getDayName = () => {
//     if (!selectedDate) return '';
//     return new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
//       .toLocaleDateString('en-US', { weekday: 'short' });
//   };

//   const styles = {
//     container: {
//       width: '100%',
//       margin: '0 auto',
//       padding: '40px',
//       backgroundColor: '#fafafa',
//       minHeight: '100vh',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     },
//     navigation: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: '32px',
//       padding: '0 20px'
//     },
//     navButton: {
//       padding: '12px',
//       border: 'none',
//       background: '#fff',
//       cursor: 'pointer',
//       borderRadius: '50%',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     },
//     monthTitle: {
//       fontSize: '28px',
//       fontStyle: 'italic',
//       fontWeight: '400',
//       color: '#333'
//     },
//     calendarGrid: {
//       backgroundColor: '#fff',
//       borderRadius: '16px',
//       marginBottom: '32px',
//       padding: '40px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
//     },
//     grid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(7, 1fr)',
//       gap: '20px'
//     },
//     weekDay: {
//       textAlign: 'center',
//       padding: '12px',
//       color: '#999',
//       fontSize: '16px',
//       fontWeight: '500'
//     },
//     dayCell: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '30px 0',
//       cursor: 'pointer',
//       borderRadius: '16px',
//       transition: 'background-color 0.2s'
//     },
//     dayNumber: {
//       fontSize: '24px',
//       fontWeight: '400'
//     },
//     statusDot: {
//       width: '10px',
//       height: '10px',
//       borderRadius: '50%'
//     },
//     legend: {
//       backgroundColor: '#fff',
//       borderRadius: '12px',
//       padding: '24px',
//       marginBottom: '32px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
//     },
//     legendContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       gap: '24px'
//     },
//     legendItem: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     legendDot: {
//       width: '12px',
//       height: '12px',
//       borderRadius: '50%'
//     },
//     legendText: {
//       fontSize: '15px',
//       color: '#666'
//     },
//     selectedInfo: {
//       marginBottom: '24px'
//     },
//     selectedHeader: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '24px'
//     },
//     selectedNumber: {
//       fontSize: '64px',
//       fontWeight: '300',
//       color: '#333'
//     },
//     selectedDetails: {
//       display: 'flex',
//       flexDirection: 'column'
//     },
//     selectedTitle: {
//       fontSize: '22px',
//       fontWeight: '500',
//       color: '#333'
//     },
//     selectedStatus: {
//       fontSize: '16px',
//       color: '#666'
//     },
//     selectedDay: {
//       fontSize: '14px',
//       color: '#999',
//       marginLeft: '100px',
//       marginTop: '6px'
//     },
//     bookingsTitle: {
//       fontSize: '22px',
//       fontWeight: '500',
//       marginBottom: '20px',
//       color: '#333'
//     },
//     bookingsContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '20px'
//     },
//     bookingCard: {
//       borderRadius: '20px',
//       padding: '28px',
//       color: '#fff',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
//     },
//     bookingHeader: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       marginBottom: '8px'
//     },
//     bookingTime: {
//       fontSize: '15px',
//       fontWeight: '500'
//     },
//     bookingStatus: {
//       fontSize: '11px',
//       padding: '4px 12px',
//       borderRadius: '12px',
//       fontWeight: '500',
//       backgroundColor: 'rgba(255,255,255,0.3)'
//     },
//     bookingName: {
//       fontSize: '24px',
//       fontWeight: '500',
//       marginBottom: '10px'
//     },
//     bookingLocation: {
//       fontSize: '15px',
//       marginBottom: '14px'
//     },
//     noBookings: {
//       backgroundColor: '#f5f5f5',
//       borderRadius: '20px',
//       padding: '48px',
//       textAlign: 'center'
//     },
//     floatingButton: {
//       position: 'fixed',
//       bottom: '32px',
//       right: '32px',
//       backgroundColor: '#ef5350',
//       color: '#fff',
//       border: 'none',
//       borderRadius: '50%',
//       width: '64px',
//       height: '64px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
//       cursor: 'pointer'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Month Navigation */}
//       <div style={styles.navigation}>
//         <button onClick={() => changeMonth(-1)} style={styles.navButton}>◀</button>
//         <h2 style={styles.monthTitle}>{monthName}</h2>
//         <button onClick={() => changeMonth(1)} style={styles.navButton}>▶</button>
//       </div>

//       {/* Calendar */}
//       <div style={styles.calendarGrid}>
//         <div style={styles.grid}>{renderCalendarDays()}</div>
//       </div>

//       {/* Legend */}
//       <div style={styles.legend}>
//         <div style={styles.legendContainer}>
//           <div style={styles.legendItem}>
//             <div style={{...styles.legendDot, backgroundColor: '#ef5350'}} />
//             <span style={styles.legendText}>Booked</span>
//           </div>
//           <div style={styles.legendItem}>
//             <div style={{...styles.legendDot, backgroundColor: '#ffd54f'}} />
//             <span style={styles.legendText}>Pending</span>
//           </div>
//           <div style={styles.legendItem}>
//             <div style={{...styles.legendDot, backgroundColor: '#66bb6a'}} />
//             <span style={styles.legendText}>Free</span>
//           </div>
//         </div>
//       </div>

//       {/* Selected Date Info */}
//       {selectedDate && (
//         <div style={styles.selectedInfo}>
//           <div style={styles.selectedHeader}>
//             <span style={styles.selectedNumber}>{selectedDate}</span>
//             <div style={styles.selectedDetails}>
//               <h3 style={styles.selectedTitle}>Selected Date</h3>
//               <p style={styles.selectedStatus}>{getStatusText()}</p>
//             </div>
//           </div>
//           <p style={styles.selectedDay}>{getDayName()}</p>
//         </div>
//       )}

//       {/* Bookings or No Bookings */}
//       {selectedBookings.length > 0 ? (
//         <div>
//           <h3 style={styles.bookingsTitle}>Bookings</h3>
//           <div style={styles.bookingsContainer}>
//             {selectedBookings.map(b => (
//               <div key={b.id} style={{...styles.bookingCard, backgroundColor: b.color}}>
//                 <div style={styles.bookingHeader}>
//                   <span style={styles.bookingTime}>{b.time}</span>
//                   <span style={styles.bookingStatus}>{b.status}</span>
//                 </div>
//                 <h4 style={styles.bookingName}>Booked by {b.bookedBy}</h4>
//                 <p style={styles.bookingLocation}>{b.location}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div style={styles.noBookings}>
//           <h4>No Bookings Today</h4>
//           <p>All slots are available for booking</p>
//         </div>
//       )}

//       {/* Floating Add Button */}
//       <button style={styles.floatingButton}>＋</button>
//     </div>
//   );
// }

// export default BookingCalendar;

import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 15));
  const [selectedDate, setSelectedDate] = useState(15);
  const [openDialog, setOpenDialog] = useState(false);

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const getCurrentMonthBookings = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const isOctober2025 = year === 2025 && month === 9;
    
    const status = {};
    for (let day = 1; day <= daysInMonth; day++) {
      if (isOctober2025) {
        if (day === 17 || day === 19 || day === 20) {
          status[day] = 'booked';
        } else if (day === 18 || day === 21 || day === 24) {
          status[day] = 'available';
        } else {
          status[day] = 'free';
        }
      } else {
        // All other months are fully free
        status[day] = 'free';
      }
    }
    return status;
  };

  const bookingStatus = getCurrentMonthBookings();

  const bookings = {
    15: [],
    17: [
      {id: 1, time: '9:00 am - 3:00 pm',bookedBy: 'Adam Smith',location: 'Grand Ballroom',status: 'CONFIRMED',  color: '#ef5350'},
      {id: 2, time: '4:00 pm - 9:00 pm',bookedBy: 'Rihan Patel', location: 'Conference Hall A',status: 'CONFIRMED',color: '#7e57c2'}
    ],
    18: [
      {id: 1, time: '9:00 am - 3:00 pm',bookedBy: 'John doe',location: 'grand plaza',status: 'PENDING',color: '#ffd54f'} ],
    20: [
      { id: 1,time: '9:00 am - 3:00 pm', bookedBy: 'Ann',location: 'Grand mallroom',status: 'CONFIRMED',color: '#ef5350'} ],
    21: [
      {
        id: 3,
        time: '3:00 pm - 7:00 pm',
        bookedBy: 'Jaan',
        location: 'Event Space',
        status: 'PENDING',
        color: '#ffd54f'
      }
    ],
    24: [
      {
        id: 4,
        time: '3:00 pm - 7:00 pm',
        bookedBy: 'Jennifer Lee',
        location: 'Event Space',
        status: 'PENDING',
        color: '#ffd54f'
      }, {
        id: 2,time: '4:00 pm - 9:00 pm',bookedBy: 'Rihan Patel',location: 'Conference Hall A',status: 'CONFIRMED',color: '#7e57c2'}
    ]
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getStatusColor = (status) => {
    switch(status) {
      case 'booked': return '#ef5350';
      case 'available': return '#ffd54f';
      case 'free': return '#66bb6a';
      default: return '#66bb6a';
    }
  };

  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    weekDays.forEach(day => (
      days.push(
        <div key={day} style={styles.weekDay}>
          {day}
        </div>
      )
    ));

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = bookingStatus[day] || 'free';
      // Check if this day is actually today
      const isToday = day === todayDate && 
                      currentDate.getMonth() === todayMonth && 
                      currentDate.getFullYear() === todayYear;

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(day)}
          style={styles.dayCell}
        >
          <div
            style={{
              ...styles.dayNumber,
              ...(isToday ? styles.todayNumber : {})
            }}
          >
            {day}
          </div>
          <div style={{
            ...styles.statusDot,
            backgroundColor: getStatusColor(status)
          }} />
        </div>
      );
    }

    return days;
  };

  const selectedBookings = bookings[selectedDate] || [];
  const selectedStatus = bookingStatus[selectedDate] || 'free';

  const getStatusText = () => {
    if (selectedBookings.length === 0) return 'No bookings - All slots available';
    if (selectedStatus === 'booked') return `${selectedBookings.length} bookings - Fully booked`;
    if (selectedStatus === 'available') return `${selectedBookings.length} booking - Some slots available`;
    return 'All slots available';
  };

  const getDayName = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
      .toLocaleDateString('en-US', { weekday: 'short' });
  };

  const styles = {
    container: {
      width: '100%',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      fontSize: '32px',
      textAlign: 'center',
      marginBottom: '40px',
      fontWeight: '500',
      color: '#333'
    },
    navigation: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      padding: '0 20px'
    },
    navButton: {
      padding: '12px',
      border: 'none',
      background: '#fff',
      cursor: 'pointer',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    monthTitle: {
      fontSize: '28px',
      fontStyle: 'italic',
      fontWeight: '400',
      color: '#333'
    },
    calendarGrid: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      marginBottom: '32px',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '16px'
    },
    weekDay: {
      textAlign: 'center',
      padding: '12px',
      color: '#999',
      fontSize: '16px',
      fontWeight: '500'
    },
    dayCell: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
      cursor: 'pointer',
      borderRadius: '16px',
      transition: 'background-color 0.2s'
    },
    dayNumber: {
      fontSize: '20px',
      fontWeight: '400',
      color: '#333',
      marginBottom: '6px'
    },
    todayNumber: {
      backgroundColor: '#ef5350',
      color: '#fff',
      borderRadius: '50%',
      width: '52px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600'
    },
    statusDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%'
    },
    legend: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    legendContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    legendDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    },
    legendText: {
      fontSize: '15px',
      color: '#666'
    },
    selectedInfo: {
      marginBottom: '24px'
    },
    selectedHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    selectedNumber: {
      fontSize: '64px',
      fontWeight: '300',
      color: '#333'
    },
    selectedDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    selectedTitle: {
      fontSize: '22px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '6px'
    },
    selectedStatus: {
      fontSize: '16px',
      color: '#666'
    },
    selectedDay: {
      fontSize: '14px',
      color: '#999',
      marginLeft: '100px',
      marginTop: '6px'
    },
    bookingsTitle: {
      fontSize: '22px',
      fontWeight: '500',
      marginBottom: '20px',
      color: '#333'
    },
    bookingsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    bookingCard: {
      borderRadius: '20px',
      padding: '28px',
      color: '#fff',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    bookingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    },
    bookingTime: {
      fontSize: '15px',
      fontWeight: '500'
    },
    bookingStatus: {
      fontSize: '11px',
      padding: '4px 12px',
      borderRadius: '12px',
      fontWeight: '500',
      backgroundColor: 'rgba(255,255,255,0.3)'
    },
    bookingName: {
      fontSize: '24px',
      fontWeight: '500',
      marginBottom: '10px'
    },
    bookingLocation: {
      fontSize: '15px',
      marginBottom: '14px'
    },
    viewDetails: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer'
    },
    viewDetailsText: {
      fontSize: '15px',
      textDecoration: 'underline'
    },
    noBookings: {
      backgroundColor: '#f5f5f5',
      borderRadius: '20px',
      padding: '48px',
      textAlign: 'center'
    },
    noBookingsIcon: {
      width: '100px',
      height: '100px',
      margin: '0 auto 20px'
    },
    noBookingsTitle: {
      fontSize: '24px',
      fontWeight: '500',
      marginBottom: '10px',
      color: '#333'
    },
    noBookingsText: {
      fontSize: '16px',
      color: '#666'
    },
    floatingButton: {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      backgroundColor: '#ef5350',
      color: '#fff',
      borderRadius: '50%',
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.2s'
    }
  };

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: '16px',
      padding: theme.spacing(2),
    },
  }));

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div style={styles.container}>

      <div style={styles.navigation}>
        <button 
          onClick={() => changeMonth(-1)}
          style={styles.navButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h2 style={styles.monthTitle}>{monthName}</h2>
        <button 
          onClick={() => changeMonth(1)}
          style={styles.navButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div style={styles.calendarGrid}>
        <div style={styles.grid}>
          {renderCalendarDays()}
        </div>
      </div>

      <div style={styles.legend}>
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendDot, backgroundColor: '#ef5350'}} />
            <span style={styles.legendText}>Fully Booked</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendDot, backgroundColor: '#ffd54f'}} />
            <span style={styles.legendText}>Slots Available</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendDot, backgroundColor: '#66bb6a'}} />
            <span style={styles.legendText}>Fully Free</span>
          </div>
        </div>
      </div>

      <div style={styles.selectedInfo}>
        <div style={styles.selectedHeader}>
          <span style={styles.selectedNumber}>{selectedDate}</span>
          <div style={styles.selectedDetails}>
            <h3 style={styles.selectedTitle}>Selected Date</h3>
            <p style={styles.selectedStatus}>{getStatusText()}</p>
          </div>
        </div>
        <p style={styles.selectedDay}>{getDayName()}</p>
      </div>

      {selectedBookings.length > 0 && (
        <div>
          <h3 style={styles.bookingsTitle}>Today's Bookings</h3>
          <div style={styles.bookingsContainer}>
            {selectedBookings.map(booking => (
              <div 
                key={booking.id} 
                style={{...styles.bookingCard, backgroundColor: booking.color}}
              >
                <div style={styles.bookingHeader}>
                  <span style={styles.bookingTime}>{booking.time}</span>
                  <span style={{
                    ...styles.bookingStatus,
                    ...(booking.color === '#ffd54f' ? {backgroundColor: 'rgba(255,255,255,0.5)', color: '#000'} : {})
                  }}>
                    {booking.status}
                  </span>
                </div>
                <h4 style={styles.bookingName}>
                  Booked by {booking.bookedBy}
                </h4>
                <p style={styles.bookingLocation}>{booking.location}</p>
                <div style={styles.viewDetails}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span style={styles.viewDetailsText}>View Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBookings.length === 0 && (
        <div style={styles.noBookings}>
          <div style={styles.noBookingsIcon}>
            <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="15" width="60" height="50" rx="4" stroke="#ccc" strokeWidth="2" fill="none"/>
              <path d="M25 15 L25 10 M55 15 L55 10" stroke="#ccc" strokeWidth="2"/>
              <path d="M20 25 L60 25" stroke="#ccc" strokeWidth="2"/>
              <path d="M35 45 L45 45 M35 45 L40 40 M35 45 L40 50" stroke="#66bb6a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h4 style={styles.noBookingsTitle}>No Bookings Today</h4>
          <p style={styles.noBookingsText}>All slots are available for booking</p>
        </div>
      )}

      <Button
        variant="contained"
        style={styles.floatingButton}
        onClick={handleOpenDialog}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e53935'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef5350'}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </Button>

      <StyledDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Booking</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Select Booking Date"
            type="date"
            fullWidth
            variant="outlined"
            defaultValue="2025-10-15"
          />
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <TextField
              margin="dense"
              label="Start Time"
              type="time"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="End Time"
              type="time"
              fullWidth
              variant="outlined"
            />
          </div>
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            style={{ marginTop: '16px' }}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            type="tel"
            fullWidth
            variant="outlined"
            style={{ marginTop: '16px' }}
          />
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            style={{ marginTop: '16px' }}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            style={{ marginTop: '16px' }}
          />
          <TextField
            margin="dense"
            label="Additional Notes (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            style={{ marginTop: '16px' }}
          />
          <FormControl component="fieldset" style={{ marginTop: '16px' }}>
            <FormLabel component="legend">Payment Method</FormLabel>
            <RadioGroup
              name="payment-method"
              defaultValue="full"
            >
              <FormControlLabel value="full" control={<Radio />} label="Pay Full Amount (Pay the complete amount now)" />
              <FormControlLabel value="advance" control={<Radio />} label="Pay Advance Amount (Pay 50% now, rest later)" />
              <FormControlLabel value="cash" control={<Radio />} label="Pay As Cash (Pay at the venue)" />
            </RadioGroup>
          </FormControl>
          <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>
            Submit
          </Button>
        </DialogContent>
      </StyledDialog>
    </div>
  );
}

export default BookingCalendar;