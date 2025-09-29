import React from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';

const Chat = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <Box sx={{ width: '300px', borderRight: '1px solid #ccc', p: 2, backgroundColor: '#ffffff' }}>
        <Typography variant="h3" sx={{ color: '#333' }}>Conversation List</Typography>
        <TextField
          fullWidth
          placeholder="Search"
          variant="outlined"
          size="small"
          sx={{ mb: 2, mt: 1, backgroundColor: '#ffffff' }}
        />
        {/* <List>
          <ListItem button>
            <ListItemText primary="View conversation" sx={{ color: '#666' }} />
          </ListItem>
        </List> */}
      </Box>
      <Box sx={{ flexGrow: 1, p: 2, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" sx={{ color: '#636363ff' }}>View conversation</Typography>
        {/* Chat area can be expanded here */}
      </Box>
    </Box>
  );
};

export default Chat;