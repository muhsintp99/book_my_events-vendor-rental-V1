// import { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import Avatar from '@mui/material/Avatar';
// import Chip from '@mui/material/Chip';
// import ClickAwayListener from '@mui/material/ClickAwayListener';
// import Divider from '@mui/material/Divider';
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Paper from '@mui/material/Paper';
// import Popper from '@mui/material/Popper';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import Switch from '@mui/material/Switch';
// import Grid from '@mui/material/Grid';
// import Badge from '@mui/material/Badge';
// import {


//   TextField,
//   Button,
//   Card,
//   CardContent,
//   InputAdornment,
//   IconButton,
//   AppBar,
//   Toolbar,
//   Container,
//   Stack,
// } from '@mui/material';
// import {
//   ArrowBack,
//   Person,
//   Phone,
//   Language,
//   Email,
//   LocationOn
// } from '@mui/icons-material';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import YouTubeIcon from '@mui/icons-material/YouTube';
// import MusicNoteIcon from '@mui/icons-material/MusicNote';
// import PushPinIcon from '@mui/icons-material/PushPin';
// import CameraAltIcon from '@mui/icons-material/CameraAlt';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import TelegramIcon from '@mui/icons-material/Telegram';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import Transitions from 'ui-component/extended/Transitions';
// import useConfig from 'hooks/useConfig';

// // assets
// import User1 from 'assets/images/users/user-round.svg';
// import {
//   IconLogout,
//   IconSettings,
//   IconUser,
//   IconBuilding,
//   IconBell,
//   IconMoon,
//   IconCreditCard,
//   IconHelp,
//   IconMapPin,
//   IconCheck
// } from '@tabler/icons-react';

// // ==============================|| PROFILE MENU ||============================== //

// export default function ProfileSection() {
//   const theme = useTheme();
//   const navigate = useNavigate(); // Add this hook
//   const { borderRadius } = useConfig();


//   const [open, setOpen] = useState(false);
// const [isedit, SetIsedit] = useState(false)
// console.log(isedit);
// //edit


//   // State for toggles
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);

//   const anchorRef = useRef(null);

//   const handleToggle = () => {
//     setOpen((prevOpen) => !prevOpen);
//   };

//   const handleClose = (event) => {
//     if (anchorRef.current && anchorRef.current.contains(event.target)) {
//       return;
//     }
//     setOpen(false);
//   };

//   // Navigation handlers
//   // const handleBusinessDetails = () => {
//   //   navigate('/business/details');
//   //   setOpen(false);
//   // };



//   const handleHelpSupport = () => {
//     navigate('/help/support');
//     setOpen(false);
//   };

//   // Toggle handlers
//   const handleNotificationToggle = () => {
//     setNotificationsEnabled(!notificationsEnabled);
//   };



//   // ✅ Old working Logout function
//   // const handleLogout = () => {
//   //   localStorage.clear(); // clears all localStorage items
//   //   navigate('/pages/login'); // keep your existing login route
//   //   setOpen(false);
//   // };

//   // Add logout handler
//   const handleLogout = () => {
//     // Clear any stored authentication data
//     localStorage.removeItem('token'); // Remove auth token
//     localStorage.removeItem('user'); // Remove user data
//     sessionStorage.clear(); // Clear session storage

//     // Close the menu
//     setOpen(false);

//     // Navigate to sign in page
//     navigate('/login'); // Adjust the path as needed for your app
//   };

//   const prevOpen = useRef(open);
//   useEffect(() => {
//     if (prevOpen.current === true && open === false) {
//       anchorRef.current.focus();
//     }
//     prevOpen.current = open;
//   }, [open]);

//   return (
//     <>
//       {/* Avatar acts as dropdown trigger */}
//       <Avatar
//         src={User1}
//         alt="user-images"
//         sx={{
//           ...theme.typography.mediumAvatar,
//           margin: '8px 0 8px 8px !important',
//           cursor: 'pointer'
//         }}
//         ref={anchorRef}
//         onClick={handleToggle}
//         aria-controls={open ? 'menu-list-grow' : undefined}
//         aria-haspopup="true"
//       />

//       <Popper
//         placement="bottom"
//         open={open}
//         anchorEl={anchorRef.current}
//         role={undefined}
//         transition
//         disablePortal
//         modifiers={[
//           {
//             name: 'offset',
//             options: { offset: [0, 14] }
//           }
//         ]}
//       >
//         {({ TransitionProps }) => (
//           <ClickAwayListener onClickAway={handleClose}>
//             <Transitions in={open} {...TransitionProps}>
//               <Paper>
//                 {open && isedit===false &&(
//                   <MainCard
//                     border={false}
//                     elevation={16}
//                     content={false}
//                     boxShadow
//                     shadow={theme.shadows[16]}
//                     sx={{
//                       maxHeight: '90vh', // limit popper height
//                       overflowY: 'auto', // enable scroll
//                       '&::-webkit-scrollbar': { width: 6 }
//                     }}
//                   >
//                     {/* Profile Header Section */}
//                     <Box
//                       sx={{
//                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                         p: 3,
//                         borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
//                         color: 'white',
//                         position: 'sticky',
//                         top: 0,
//                         zIndex: 1,
//                         padding: 0,
//                         paddingTop: 2
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
//                         <Badge
//                           overlap="circular"
//                           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                           badgeContent={
//                             <Box
//                               sx={{
//                                 width: 20,
//                                 height: 20,
//                                 borderRadius: '50%',
//                                 backgroundColor: '#4caf50',
//                                 border: '3px solid white'
//                               }}
//                             />
//                           }
//                         >
//                           <Avatar
//                             src={User1}
//                             alt="user-profile"
//                             sx={{
//                               width: 100,
//                               height: 100,
//                               border: '4px solid rgba(255,255,255,0.2)',
//                               mb: 1
//                             }}
//                           />
//                         </Badge>
//                         <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
//                           Jon Dowe
//                         </Typography>
//                         <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
//                           venue vendor
//                         </Typography>
//                         <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
//                           <IconMapPin size={16} style={{ marginRight: 4 }} />
//                           <Typography variant="body2">Location</Typography>
//                         </Box>
//                       </Box>

//                       {/* Statistics */}
//                       <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
//                         <Grid item xs={4}>
//                           <Box sx={{ textAlign: 'center' }}>
//                             <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
//                               248
//                             </Typography>
//                             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                               Orders
//                             </Typography>
//                             <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
//                               Completed
//                             </Typography>
//                           </Box>
//                         </Grid>
//                         <Grid item xs={4}>
//                           <Box sx={{ textAlign: 'center' }}>
//                             <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
//                               4.8
//                             </Typography>
//                             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                               Average
//                             </Typography>
//                             <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
//                               Rating
//                             </Typography>
//                           </Box>
//                         </Grid>
//                         <Grid item xs={4}>
//                           <Box sx={{ textAlign: 'center' }}>
//                             <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
//                               ₹2.4L
//                             </Typography>
//                             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                               Total
//                             </Typography>
//                             <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
//                               Earnings
//                             </Typography>
//                           </Box>
//                         </Grid>
//                       </Grid>

//                       {/* Verification Badge */}
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                           backgroundColor: 'rgba(255,255,255,0.1)',
//                           borderRadius: 2,
//                           p: 1.5
//                         }}
//                       >
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <IconCheck size={20} style={{ color: '#4caf50', marginRight: 8 }} />
//                           <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
//                             Verified Vendor
//                           </Typography>
//                         </Box>
//                         <Chip
//                           label="Active"
//                           sx={{
//                             backgroundColor: '#4caf50',
//                             color: 'white',
//                             fontWeight: 500,
//                             fontSize: '0.75rem'
//                           }}
//                           size="small"
//                         />
//                       </Box>
//                     </Box>

//                     {/* Scrollable Settings Section */}
//                     <Box sx={{ p: 2 }}>
//                       <Divider />

//                       <List
//                         component="nav"
//                         sx={{
//                           width: '100%',
//                           maxWidth: 350,
//                           minWidth: 300,
//                           borderRadius: `${borderRadius}px`,
//                           '& .MuiListItemButton-root': { mt: 0.5 }
//                         }}
//                       >
//                         {/* Edit Profile */}
//                         <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}
//                           onClick={() => SetIsedit(true)} >

//                           <ListItemIcon>
//                             <IconUser stroke={1.5} size="20px" />
//                           </ListItemIcon>
//                           <ListItemText
//                             primary={<Typography variant="body2">Edit Profile</Typography>}
//                             secondary={<Typography variant="caption" color="textSecondary">Update your profile information</Typography>}
//                           />
//                         </ListItemButton>

//                         {/* Business Details */}
//                         {/* <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleBusinessDetails}>
//                           <ListItemIcon>
//                             <IconBuilding stroke={1.5} size="20px" />
//                           </ListItemIcon>
//                           <ListItemText
//                             primary={<Typography variant="body2">Business Details</Typography>}
//                             secondary={<Typography variant="caption" color="textSecondary">Manage your business information</Typography>}
//                           />
//                         </ListItemButton> */}

//                         {/* Notifications */}
//                         <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
//                           <ListItemIcon>
//                             <IconBell stroke={1.5} size="20px" />
//                           </ListItemIcon>
//                           <ListItemText
//                             primary={<Typography variant="body2">Notifications</Typography>}
//                             secondary={<Typography variant="caption" color="textSecondary">{notificationsEnabled ? 'Enabled' : 'Disabled'}</Typography>}
//                           />
//                           <Switch checked={notificationsEnabled} onChange={handleNotificationToggle} color="primary" size="small" />
//                         </ListItemButton>




//                         {/* Help & Support */}
//                         <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleHelpSupport}>
//                           <ListItemIcon>
//                             <IconHelp stroke={1.5} size="20px" />
//                           </ListItemIcon>
//                           <ListItemText
//                             primary={<Typography variant="body2">Help & Support</Typography>}
//                             secondary={<Typography variant="caption" color="textSecondary">Get help and contact support</Typography>}
//                           />
//                         </ListItemButton>

//                         <Divider sx={{ my: 1 }} />

//                         {/* ✅ Logout */}
//                         <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleLogout}>
//                           <ListItemIcon>
//                             <IconLogout stroke={1.5} size="20px" />
//                           </ListItemIcon>
//                           <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
//                         </ListItemButton>
//                       </List>
//                     </Box>
//                   </MainCard>
//                 )}
//                 {/* ----edit profile---- */}
//                 {open && isedit===true && (

//                   <MainCard
//                     border={false}
//                     elevation={16}
//                     content={false}
//                     boxShadow
//                     shadow={theme.shadows[16]}
//                     sx={{
//                       maxWidth: '800px',
//                       maxHeight: '90vh', // limit popper height
//                       overflowY: 'auto', // enable scroll
//                       '&::-webkit-scrollbar': { width: 8 }
//                     }}
//                   >
//                     <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
//       {/* Header */}
//       <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
//         <Toolbar>
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="back"
//                           onClick={() => SetIsedit(false)}

//             sx={{ mr: 1 }}
//           >
//             <ArrowBack />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
//             Profile
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Content */}
//       <Container maxWidth="xl" sx={{ py: 3 }}>
//         {/* Title Section */}
//         <Box sx={{ mb: 3 }}>
//           <Typography 
//             variant="h4" 
//             component="h1" 
//             sx={{ 
//               fontWeight: 300, 
//               color: '#333',
//               fontStyle: 'italic',
//               mb: 1
//             }}
//           >
//             Edit Vendor Profile
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Update your business information.
//           </Typography>
//         </Box>

//         {/* Form Card */}
//         <Card elevation={1} sx={{ borderRadius: 3 }}>
//           <CardContent sx={{ p: 3 }}>
//             {/* Section Header */}
//             <Box sx={{ mb: 3 }}>
//               <Typography 
//                 variant="h6" 
//                 component="h2" 
//                 sx={{ 
//                   borderLeft: '4px solid #2196f3',
//                   pl: 2,
//                   color: '#333',
//                   fontWeight: 500
//                 }}
//               >
//                 Basic Information
//               </Typography>
//             </Box>

//             <Stack spacing={3}>
//               {/* Vendor Name */}
//               <TextField
//                 fullWidth
//                 label="Vendor Name"
//                 value={"Tech Solutions"}
//                 // onChange={handleInputChange('vendorName')}
//                 variant="outlined"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Person sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               {/* Phone Number */}
//               <TextField
//                 fullWidth
//                 label="Phone Number"
//                 value={"998989898"}
//                 // onChange={handleInputChange('phoneNumber')}
//                 variant="outlined"
//                 type="tel"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Phone sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               {/* Website */}
//               <TextField
//                 fullWidth
//                 label="Website"
//                 value={"IconWorldWww.www"}
//                 // onChange={handleInputChange('website')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Language sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               {/* Email Address */}
//               <TextField
//                 fullWidth
//                 label="Email Address"
//                 value={"agmail.com"}
//                 // onChange={handleInputChange('emailAddress')}
//                 variant="outlined"
//                 type="email"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Email sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               {/* Business Address */}
//               <TextField
//                 fullWidth
//                 label="Business Address"
//                 value={"business ave,city"}
//                 // onChange={handleInputChange('businessAddress')}
//                 variant="outlined"
//                 multiline
//                 rows={3}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
//                       <LocationOn sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />
//             </Stack>

//             <Box sx={{ mb: 3, mt: 4 }}>
//               <Typography 
//                 variant="h6" 
//                 component="h2" 
//                 sx={{ 
//                   borderLeft: '4px solid #2196f3',
//                   pl: 2,
//                   color: '#333',
//                   fontWeight: 500
//                 }}
//               >
//                 Social Media Links
//               </Typography>
//             </Box>

//             <Stack spacing={3}>
//               <TextField
//                 fullWidth
//                 label="Instagram"
//                 value="https://instagram.com/techsu"
//                 // onChange={handleInputChange('instagram')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <InstagramIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 label="Facebook"
//                 value="https://facebook.com/techsu"
//                 // onChange={handleInputChange('facebook')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FacebookIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 label="Twitter / X"
//                 value="https://twitter.com/techsol"
//                 // onChange={handleInputChange('twitter')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <TwitterIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 label="LinkedIn"
//                 value="https://linkedin.com/compa"
//                 // onChange={handleInputChange('linkedin')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LinkedInIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />
//             </Stack>

//             <Box sx={{ mb: 3, mt: 4 }}>
//               <Typography 
//                 variant="h6" 
//                 component="h2" 
//                 sx={{ 
//                   borderLeft: '4px solid #2196f3',
//                   pl: 2,
//                   color: '#333',
//                   fontWeight: 500
//                 }}
//               >
//                 Video & Content Platforms
//               </Typography>
//             </Box>

//             <Stack spacing={3}>
//               <TextField
//                 fullWidth
//                 label="YouTube"
//                 value="https://youtube.com/@techs"
//                 // onChange={handleInputChange('youtube')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <YouTubeIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 label="TikTok"
//                 value="https://tiktok.com/@techsol"
//                 // onChange={handleInputChange('tiktok')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <MusicNoteIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />
//             </Stack>

//             <Box sx={{ mb: 3, mt: 4 }}>

//             </Box>

//             <Stack spacing={3}>
//               <TextField
//                 fullWidth
//                 label="Pinterest"
//                 value="https://pinterest.com/techs"
//                 // onChange={handleInputChange('pinterest')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PushPinIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 label="Snapchat"
//                 value="https://snapchat.com/add/t."
//                 // onChange={handleInputChange('snapchat')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CameraAltIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />
//             </Stack>

//             <Box sx={{ mb: 3, mt: 4 }}>
//               <Typography 
//                 variant="h6" 
//                 component="h2" 
//                 sx={{ 
//                   borderLeft: '4px solid #2196f3',
//                   pl: 2,
//                   color: '#333',
//                   fontWeight: 500
//                 }}
//               >
//                 Messaging & Communication
//               </Typography>
//             </Box>

//             <Stack spacing={3}>
//               <TextField
//                 fullWidth
//                 label="WhatsApp Business"
//                 value="+1 (555) 123-4567"
//                 // onChange={handleInputChange('whatsapp')}
//                 variant="outlined"
//                 type="tel"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <WhatsAppIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 label="Telegram"
//                 value="https://t.me/techsolutions"
//                 // onChange={handleInputChange('telegram')}
//                 variant="outlined"
//                 type="url"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <TelegramIcon sx={{ color: '#999' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     bgcolor: '#f8f9fa'
//                   }
//                 }}
//               />
//             </Stack>

//             <Divider sx={{ my: 3 }} />

//             {/* Action Buttons */}
//             <Stack direction="row" spacing={2}>
//               <Button
//                 variant="outlined"
//                 fullWidth
//               onClick={() => SetIsedit(false)}
//                 sx={{
//                   borderRadius: 2,
//                   py: 1.5,
//                   borderColor: '#ddd',
//                   color: '#666',
//                   '&:hover': {
//                     borderColor: '#bbb',
//                     bgcolor: '#f5f5f5'
//                   }
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="contained"
//                 fullWidth
//               onClick={() => SetIsedit(false)}
//                 sx={{
//                   borderRadius: 2,
//                   py: 1.5,
//                   bgcolor: '#2196f3',
//                   '&:hover': {
//                     bgcolor: '#1976d2'
//                   }
//                 }}
//               >
//                 Save Changes
//               </Button>
//             </Stack>
//           </CardContent>
//         </Card>
//         <Box sx={{ mt: 2, textAlign: 'center' }}>
//           <Typography variant="body2" color="text.secondary">
//             Keep your profile updated to help customers find and connect with you
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//                     </MainCard>

//                 )}

//               </Paper>
//             </Transitions>
//           </ClickAwayListener>
//         )}
//       </Popper>
//     </>
//   );
// }


import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import {
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Phone,
  Language,
  Email,
  LocationOn
} from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PushPinIcon from '@mui/icons-material/PushPin';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
// assets
import User1 from 'assets/images/users/user-round.svg';
import {
  IconLogout,
  IconSettings,
  IconUser,
  IconBuilding,
  IconBell,
  IconMoon,
  IconCreditCard,
  IconHelp,
  IconMapPin,
  IconCheck
} from '@tabler/icons-react';

// ==============================|| PROFILE MENU ||============================== //
export default function ProfileSection() {
  const theme = useTheme();
  const navigate = useNavigate(); // Add this hook
  const { borderRadius } = useConfig();
  const [open, setOpen] = useState(false);
  const [isedit, SetIsedit] = useState(false)
  console.log(isedit);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  //edit
  // State for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const anchorRef = useRef(null);

  const PROFILE_API = "https://api.bookmyevent.ae/api/profile";

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('logRes');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedRole) {
      setRole(storedRole);
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(PROFILE_API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success && data.data.length > 0) {
        const prof = data.data[0];
        setProfile(prof);
        // Parse socialLinks if it's a JSON string
        const socialLinks = prof.socialLinks 
          ? (typeof prof.socialLinks === 'string' ? JSON.parse(prof.socialLinks) : prof.socialLinks)
          : {};
        setFormData({
          name: user?.name || prof.name || "Tech Solutions",
          phone: prof.mobileNumber || "",
          website: socialLinks.website || "",
          email: user?.email || prof.userId?.email || "",
          address: prof.address || user?.address || "business ave,city",
          facebook: socialLinks.facebook || "",
          instagram: socialLinks.instagram || "",
          twitter: socialLinks.twitter || "",
          linkedin: socialLinks.linkedin || "",
          youtube: socialLinks.youtube || "",
          whatsapp: socialLinks.whatsapp || "",
          tiktok: socialLinks.tiktok || "",
          pinterest: socialLinks.pinterest || "",
          snapchat: socialLinks.snapchat || "",
          telegram: socialLinks.telegram || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const transformProfilePhoto = (path) => {
    if (!path) return User1;
    return `https://api.bookmyevent.ae${path}`;
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const socialLinksObj = {
        website: formData.website || "",
        facebook: formData.facebook || "",
        instagram: formData.instagram || "",
        twitter: formData.twitter || "",
        linkedin: formData.linkedin || "",
        youtube: formData.youtube || "",
        whatsapp: formData.whatsapp || "",
        tiktok: formData.tiktok || "",
        pinterest: formData.pinterest || "",
        snapchat: formData.snapchat || "",
        telegram: formData.telegram || ""
      };
      const updatePayload = {
        name: formData.name,
        address: formData.address,
        mobileNumber: formData.phone,
        socialLinks: JSON.stringify(socialLinksObj)
      };
      await axios.put(`${PROFILE_API}/${profile._id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile updated successfully!"); // Replace with toast if needed
      SetIsedit(false);
      fetchProfile();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  // Navigation handlers
  // const handleBusinessDetails = () => {
  //   navigate('/business/details');
  //   setOpen(false);
  // };
  const handleHelpSupport = () => {
    navigate('/help/support');
    setOpen(false);
  };
  // Toggle handlers
  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  // Add logout handler
  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token'); // Remove auth token
    localStorage.removeItem('user'); // Remove user data
    sessionStorage.clear(); // Clear session storage
    // Close the menu
    setOpen(false);
    // Navigate to sign in page
    navigate('/login'); // Adjust the path as needed for your app
  };
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  return (
    <>
      {/* Avatar acts as dropdown trigger */}
      <Avatar
        src={profile ? transformProfilePhoto(profile.profilePhoto) : undefined}
        alt="user-avatar"
        sx={{
          ...theme.typography.mediumAvatar,
          margin: '8px 0 8px 8px !important',
          cursor: 'pointer',
          bgcolor: '#cbb406ff',
          color: '#fff',
          fontWeight: 600
        }}
        ref={anchorRef}
        onClick={handleToggle}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
      >
        {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
      </Avatar>
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: { offset: [0, 14] }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && isedit === false && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{
                      maxHeight: '90vh', // limit popper height
                      overflowY: 'auto', // enable scroll
                      '&::-webkit-scrollbar': { width: 6 }
                    }}
                  >
                    {/* Profile Header Section */}
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #e8888fff 0%, #b2434cff 100%)',
                        p: 3,
                        borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
                        color: 'white',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        padding: 0,
                        paddingTop: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                                border: '3px solid white'
                              }}
                            />
                          }
                        >
                          <Avatar
                            src={profile ? transformProfilePhoto(profile.profilePhoto) : User1}
                            sx={{
                              width: 100,
                              height: 100,
                              border: '4px solid rgba(190, 136, 136, 0.27)',
                              mb: 1,
                              bgcolor: '#ffc108ff', // Plain color background
                              fontSize: 48,
                              fontWeight: 600,
                              color: '#fff',
                              textTransform: 'uppercase'
                            }}
                          >
                            {(!profile || !profile.profilePhoto) && (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                          </Avatar>
                        </Badge>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                          {user?.email || profile?.userId?.email || 'user@example.com'}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                          {role || 'venue vendor'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                          <IconMapPin size={16} style={{ marginRight: 4 }} />
                          <Typography variant="body2">Location</Typography>
                        </Box>
                        {/* <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                          <Email size={16} style={{ marginRight: 4 }} />
                          <Typography variant="body2">{user?.email || 'user@example.com'}</Typography>
                        </Box> */}
                      </Box>
                      {/* Statistics */}
                      <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
                              248
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Orders
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Completed
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
                              4.8
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Average
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Rating
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
                              ₹2.4L
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Total
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Earnings
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* Verification Badge */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          p: 1.5
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconCheck size={20} style={{ color: '#4caf50', marginRight: 8 }} />
                          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                            Verified Vendor
                          </Typography>
                        </Box>
                        <Chip
                          label="Active"
                          sx={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                          size="small"
                        />
                      </Box>
                    </Box>
                    {/* Scrollable Settings Section */}
                    <Box sx={{ p: 2 }}>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        {/* Edit Profile */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}
                          onClick={() => SetIsedit(true)} >
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Edit Profile</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">Update your profile information</Typography>}
                          />
                        </ListItemButton>
                        {/* Business Details */}
                        {/* <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleBusinessDetails}>
                          <ListItemIcon>
                            <IconBuilding stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Business Details</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">Manage your business information</Typography>}
                          />
                        </ListItemButton> */}
                        {/* Notifications */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                          <ListItemIcon>
                            <IconBell stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Notifications</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">{notificationsEnabled ? 'Enabled' : 'Disabled'}</Typography>}
                          />
                          <Switch checked={notificationsEnabled} onChange={handleNotificationToggle} color="primary" size="small" />
                        </ListItemButton>
                        {/* Help & Support */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleHelpSupport}>
                          <ListItemIcon>
                            <IconHelp stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Help & Support</Typography>}
                            secondary={<Typography variant="caption" color="textSecondary">Get help and contact support</Typography>}
                          />
                        </ListItemButton>
                        <Divider sx={{ my: 1 }} />
                        {/* ✅ Logout */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleLogout}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
                {/* ----edit profile---- */}
                {open && isedit === true && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{
                      maxWidth: '800px',
                      maxHeight: '90vh', // limit popper height
                      overflowY: 'auto', // enable scroll
                      '&::-webkit-scrollbar': { width: 8 }
                    }}
                  >
                    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
                      {/* Header */}
                      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
                        <Toolbar>
                          <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="back"
                            onClick={() => SetIsedit(false)}
                            sx={{ mr: 1 }}
                          >
                            <ArrowBack />
                          </IconButton>
                          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
                            Profile
                          </Typography>
                        </Toolbar>
                      </AppBar>
                      {/* Content */}
                      <Container maxWidth="xl" sx={{ py: 3 }}>
                        {/* Title Section */}
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                              fontWeight: 300,
                              color: '#333',
                              fontStyle: 'italic',
                              mb: 1
                            }}
                          >
                            Edit Vendor Profile
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Update your business information.
                          </Typography>
                        </Box>
                        {/* Form Card */}
                        <Card elevation={1} sx={{ borderRadius: 3 }}>
                          <CardContent sx={{ p: 3 }}>
                            {/* Section Header */}
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  borderLeft: '4px solid #2196f3',
                                  pl: 2,
                                  color: '#333',
                                  fontWeight: 500
                                }}
                              >
                                Basic Information
                              </Typography>
                            </Box>
                            <Stack spacing={3}>
                              {/* Vendor Name */}
                              <TextField
                                fullWidth
                                label="Vendor Name"
                                value={formData.name || ""}
                                onChange={handleInputChange('name')}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Person sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              {/* Phone Number */}
                              <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phone || ""}
                                onChange={handleInputChange('phone')}
                                variant="outlined"
                                type="tel"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Phone sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              {/* Website */}
                              <TextField
                                fullWidth
                                label="Website"
                                value={formData.website || ""}
                                onChange={handleInputChange('website')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Language sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              {/* Email Address */}
                              <TextField
                                fullWidth
                                label="Email Address"
                                value={formData.email || ""}
                                // Read-only, since email might not be updatable
                                variant="outlined"
                                type="email"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Email sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                  readOnly: true
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              {/* Business Address */}
                              <TextField
                                fullWidth
                                label="Business Address"
                                value={formData.address || ""}
                                onChange={handleInputChange('address')}
                                variant="outlined"
                                multiline
                                rows={3}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                      <LocationOn sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                            </Stack>
                            <Box sx={{ mb: 3, mt: 4 }}>
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  borderLeft: '4px solid #2196f3',
                                  pl: 2,
                                  color: '#333',
                                  fontWeight: 500
                                }}
                              >
                                Social Media Links
                              </Typography>
                            </Box>
                            <Stack spacing={3}>
                              <TextField
                                fullWidth
                                label="Instagram"
                                value={formData.instagram || ""}
                                onChange={handleInputChange('instagram')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <InstagramIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              <TextField
                                fullWidth
                                label="Facebook"
                                value={formData.facebook || ""}
                                onChange={handleInputChange('facebook')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <FacebookIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              <TextField
                                fullWidth
                                label="Twitter / X"
                                value={formData.twitter || ""}
                                onChange={handleInputChange('twitter')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <TwitterIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              <TextField
                                fullWidth
                                label="LinkedIn"
                                value={formData.linkedin || ""}
                                onChange={handleInputChange('linkedin')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LinkedInIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                            </Stack>
                            <Box sx={{ mb: 3, mt: 4 }}>
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  borderLeft: '4px solid #2196f3',
                                  pl: 2,
                                  color: '#333',
                                  fontWeight: 500
                                }}
                              >
                                Video & Content Platforms
                              </Typography>
                            </Box>
                            <Stack spacing={3}>
                              <TextField
                                fullWidth
                                label="YouTube"
                                value={formData.youtube || ""}
                                onChange={handleInputChange('youtube')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <YouTubeIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              <TextField
                                fullWidth
                                label="TikTok"
                                value={formData.tiktok || ""}
                                onChange={handleInputChange('tiktok')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <MusicNoteIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                            </Stack>
                            <Box sx={{ mb: 3, mt: 4 }}>
                            </Box>
                            <Stack spacing={3}>
                              <TextField
                                fullWidth
                                label="Pinterest"
                                value={formData.pinterest || ""}
                                onChange={handleInputChange('pinterest')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PushPinIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              <TextField
                                fullWidth
                                label="Snapchat"
                                value={formData.snapchat || ""}
                                onChange={handleInputChange('snapchat')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CameraAltIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                            </Stack>
                            <Box sx={{ mb: 3, mt: 4 }}>
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  borderLeft: '4px solid #2196f3',
                                  pl: 2,
                                  color: '#333',
                                  fontWeight: 500
                                }}
                              >
                                Messaging & Communication
                              </Typography>
                            </Box>
                            <Stack spacing={3}>
                              <TextField
                                fullWidth
                                label="WhatsApp Business"
                                value={formData.whatsapp || ""}
                                onChange={handleInputChange('whatsapp')}
                                variant="outlined"
                                type="tel"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <WhatsAppIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                              <TextField
                                fullWidth
                                label="Telegram"
                                value={formData.telegram || ""}
                                onChange={handleInputChange('telegram')}
                                variant="outlined"
                                type="url"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <TelegramIcon sx={{ color: '#999' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa'
                                  }
                                }}
                              />
                            </Stack>
                            <Divider sx={{ my: 3 }} />
                            {/* Action Buttons */}
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => SetIsedit(false)}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.5,
                                  borderColor: '#ddd',
                                  color: '#666',
                                  '&:hover': {
                                    borderColor: '#bbb',
                                    bgcolor: '#f5f5f5'
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSave}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.5,
                                  bgcolor: '#2196f3',
                                  '&:hover': {
                                    bgcolor: '#1976d2'
                                  }
                                }}
                              >
                                Save Changes
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Keep your profile updated to help customers find and connect with you
                          </Typography>
                        </Box>
                      </Container>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}