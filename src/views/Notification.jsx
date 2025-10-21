import React, { useState } from 'react';
import { Box, Typography, Switch, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { styled } from '@mui/system';

const BlueSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#E15B65',
      '& + .MuiSwitch-track': {
        backgroundColor: '#E15B65',
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#e1888eff',
  },
}));

const NotificationSetup = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, topic: 'Provider Account Block', push: true, mail: true, sms: false },
    { id: 2, topic: 'Provider Account Unblock', push: true, mail: true, sms: false },
    { id: 3, topic: 'Provider Withdraw Approve', push: true, mail: true, sms: false },
    { id: 4, topic: 'Provider Withdraw Rejection', push: true, mail: true, sms: false },
    { id: 5, topic: 'Provider Trip Notification', push: true, mail: false, sms: false },
    { id: 6, topic: 'Provider Subscription Success', push: true, mail: true, sms: false },
    { id: 7, topic: 'Provider Subscription Renew', push: true, mail: true, sms: false },
    { id: 8, topic: 'Provider Subscription Shift', push: true, mail: true, sms: false },
    { id: 9, topic: 'Provider Subscription Cancel', push: true, mail: true, sms: false },
    { id: 10, topic: 'Provider Subscription Plan Update', push: false, mail: true, sms: false },
  ]);
  const [openPushModal, setOpenPushModal] = useState(false);
  const [openMailModal, setOpenMailModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isEnablePush, setIsEnablePush] = useState(false);
  const [isEnableMail, setIsEnableMail] = useState(false);

  const handleTogglePush = (id, type) => {
    const item = notifications.find(item => item.id === id);
    setSelectedTopic(item.topic);
    setIsEnablePush(!item.push);
    setOpenPushModal(true);
  };

  const handleToggleMail = (id, type) => {
    const item = notifications.find(item => item.id === id);
    setSelectedTopic(item.topic);
    setIsEnableMail(!item.mail);
    setOpenMailModal(true);
  };

  const handleConfirmPush = () => {
    setNotifications(notifications.map(item =>
      item.topic === selectedTopic ? { ...item, push: !item.push } : item
    ));
    setOpenSnackbar(true);
    setOpenPushModal(false);
  };

  const handleConfirmMail = () => {
    setNotifications(notifications.map(item =>
      item.topic === selectedTopic ? { ...item, mail: !item.mail } : item
    ));
    setOpenSnackbar(true);
    setOpenMailModal(false);
  };

  const handleCancelPush = () => {
    setOpenPushModal(false);
  };

  const handleCancelMail = () => {
    setOpenMailModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
      <Typography variant="h3" gutterBottom>
        Notification Setup
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        From here you setup what types of notification you can receive from BookMyEvent
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sl</TableCell>
            <TableCell>Topics</TableCell>
            <TableCell>Push Notification</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>SMS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                {item.topic}
                <Typography variant="body2" color="textSecondary">
                  Sent notification on {item.topic.toLowerCase()}
                </Typography>
              </TableCell>
              <TableCell>
                <BlueSwitch
                  checked={item.push}
                  onChange={() => handleTogglePush(item.id, 'push')}
                />
              </TableCell>
              <TableCell>
                <BlueSwitch
                  checked={item.mail}
                  onChange={() => handleToggleMail(item.id, 'mail')}
                />
              </TableCell>
              <TableCell>N/A</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openPushModal} onClose={handleCancelPush} PaperProps={{ sx: { width: '300px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #E5E7EB' }}>
          <Box component="span" mr={1}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#E0E7FF" />
              <path d="M12 8V14" stroke="#4C51BF" strokeWidth="2" />
              <circle cx="12" cy="17" r="1" fill="#4C51BF" />
            </svg>
          </Box>
          <Typography variant="h6">Want to {isEnablePush ? 'enable' : 'disable'} the Push Notification For {selectedTopic}?</Typography>
          <Box component="span" sx={{ color: '#6B7280', cursor: 'pointer' }} onClick={handleCancelPush}>
            ✕
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography sx={{ color: '#4B5563' }}>Push Notification Will Be {isEnablePush ? 'Enabled' : 'disabled'} For {selectedTopic} block</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid #E5E7EB' }}>
          <Button onClick={handleCancelPush} variant="contained" sx={{ backgroundColor: '#FEE2E2', color: '#DC2626', '&:hover': { backgroundColor: '#FECACA' }, textTransform: 'none', px: 2, py: 0.5, borderRadius: '4px' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmPush} variant="contained" sx={{ backgroundColor: '#1b8dd0ff', color: '#FFFFFF', '&:hover': { backgroundColor: '#6dbaedff' }, textTransform: 'none', px: 2, py: 0.5, borderRadius: '4px' }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openMailModal} onClose={handleCancelMail} PaperProps={{ sx: { width: '300px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #E5E7EB' }}>
          <Box component="span" mr={1}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#E0E7FF" />
              <path d="M12 8V14" stroke="#4C51BF" strokeWidth="2" />
              <circle cx="12" cy="17" r="1" fill="#4C51BF" />
            </svg>
          </Box>
          <Typography variant="h6">Want to {isEnableMail ? 'enable' : 'disable'} the Mail For {selectedTopic}?</Typography>
          <Box component="span" sx={{ color: '#6B7280', cursor: 'pointer' }} onClick={handleCancelMail}>
            ✕
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography sx={{ color: '#4B5563' }}>Mail Will Be {isEnableMail ? 'Enabled' : 'disabled'} For {selectedTopic} {isEnableMail ? 'block' : 'unblock'}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid #E5E7EB' }}>
          <Button onClick={handleCancelMail} variant="contained" sx={{ backgroundColor: '#FEE2E2', color: '#DC2626', '&:hover': { backgroundColor: '#FECACA' }, textTransform: 'none', px: 2, py: 0.5, borderRadius: '4px' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmMail} variant="contained" sx={{ backgroundColor: '#E15B65', color: '#FFFFFF', '&:hover': { backgroundColor: '#d63640ff' }, textTransform: 'none', px: 2, py: 0.5, borderRadius: '4px' }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={<Box sx={{ backgroundColor: '#E15B65', color: '#FFFFFF', p: 1, borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
          <svg width="16" height="16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-4-4-2 2-1.4-1.4 3.4-3.4 5.4 5.4-1.4 1.4z" fill="#FFFFFF" />
          </svg>
          Notification settings updated
        </Box>}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Paper>
  );
};

export default NotificationSetup;