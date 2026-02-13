import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, IconButton, Stack, Avatar, Paper,
  CircularProgress, InputBase, Badge, List, ListItem, ListItemAvatar,
  ListItemText, ListItemButton, Divider, useTheme, useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import axios from 'axios';

var ACCENT = '#D81B60';
var ACCENT_DARK = '#880E4F';
var ACCENT_LIGHT = '#FCE4EC';
var ACCENT_BG = '#FFF0F5';

var EnquiryChatPage = function () {
  var location = useLocation();
  var navigate = useNavigate();
  var theme = useTheme();
  var isMobile = useMediaQuery(theme.breakpoints.down('md'));
  var initialEnquiry = location.state || null;

  var userStr = localStorage.getItem('user') || '{}';
  var user = JSON.parse(userStr);
  var vendorId = user?.providerId || user?._id;

  var [enquiries, setEnquiries] = useState([]);
  var [activeEnquiry, setActiveEnquiry] = useState(initialEnquiry);
  var [message, setMessage] = useState('');
  var [messages, setMessages] = useState([]);
  var [loading, setLoading] = useState(true);
  var [chatLoading, setChatLoading] = useState(false);
  var [sidebarSearch, setSidebarSearch] = useState('');
  var [mobileChatOpen, setMobileChatOpen] = useState(!!initialEnquiry);
  var messagesEndRef = useRef(null);
  var pendingMessagesRef = useRef(new Set());

  var getCustomerName = function (enq) {
    if (!enq) return 'Customer';
    if (enq.userId?.firstName) return (enq.userId.firstName + ' ' + (enq.userId.lastName || '')).trim();
    return enq.fullName || 'Customer';
  };

  var getInitials = function (name) {
    if (!name) return '?';
    var parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  var isMe = function (sid) { return String(sid) === String(vendorId); };

  // Fetch boutique enquiries
  useEffect(function () {
    if (!vendorId) { setLoading(false); return; }
    var doFetch = async function () {
      try {
        setLoading(true);
        var res = await axios.get('https://api.bookmyevent.ae/api/enquiries/provider/' + vendorId);
        var all = res.data.data || [];
        var filtered = all.filter(function (e) {
          var mt = (e.moduleId?.moduleType || '').toLowerCase();
          var title = (e.moduleId?.title || '').toLowerCase();
          return mt === 'boutique' || mt === 'fashion' || title.includes('boutique') || title.includes('dress');
        });
        setEnquiries(filtered);
        if (!initialEnquiry && filtered.length > 0) setActiveEnquiry(filtered[0]);
      } catch (err) {
        console.error('Failed to fetch enquiries:', err);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [vendorId]);

  // Fetch messages
  useEffect(function () {
    if (!activeEnquiry?._id) return;
    var doFetch = async function () {
      try {
        setChatLoading(true);
        var res = await axios.get('https://api.bookmyevent.ae/api/enquiries/' + activeEnquiry._id + '/messages');
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setMessages([]);
      } finally {
        setChatLoading(false);
      }
    };
    doFetch();
  }, [activeEnquiry?._id]);

  // Socket
  useEffect(function () {
    if (!activeEnquiry?._id || !vendorId) return;
    if (!socket.connected) socket.connect();
    socket.emit('join_enquiry', { enquiryId: activeEnquiry._id, vendorId: vendorId });

    var handleReceive = function (data) {
      if (data.enquiryId && data.enquiryId !== activeEnquiry._id) return;
      var key = data._id || (data.senderId + '-' + data.timestamp);
      if (pendingMessagesRef.current.has(key) || pendingMessagesRef.current.has(data.timestamp)) {
        pendingMessagesRef.current.delete(key);
        pendingMessagesRef.current.delete(data.timestamp);
        setMessages(function (prev) {
          return prev.map(function (msg) {
            if (msg.timestamp === data.timestamp && String(msg.senderId) === String(data.senderId)) {
              return { ...data, _id: data._id, time: data.time || new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            }
            return msg;
          });
        });
        return;
      }
      setMessages(function (prev) {
        var exists = prev.some(function (msg) { return msg._id === data._id || (msg.timestamp && msg.timestamp === data.timestamp && msg.senderId === data.senderId); });
        if (exists) return prev;
        return [...prev, { ...data, time: data.time || new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
      });
    };

    var handleDeleted = function (data) {
      setMessages(function (prev) { return prev.filter(function (msg) { return msg._id !== data.messageId; }); });
    };

    socket.on('receive_message', handleReceive);
    socket.on('message_deleted', handleDeleted);
    return function () { socket.off('receive_message', handleReceive); socket.off('message_deleted', handleDeleted); };
  }, [activeEnquiry?._id, vendorId]);

  useEffect(function () { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  var handleSend = function () {
    if (!message.trim() || !activeEnquiry?._id) return;
    var currentMsg = message;
    setMessage('');
    var timestamp = new Date().toISOString();
    var payload = {
      enquiryId: activeEnquiry._id, senderId: vendorId,
      receiverId: (activeEnquiry.userId?._id || activeEnquiry.userId),
      senderName: user?.businessName || user?.name || 'Vendor',
      senderRole: 'vendor', text: currentMsg, message: currentMsg, timestamp: timestamp
    };
    pendingMessagesRef.current.add(timestamp);
    setMessages(function (prev) { return [...prev, { ...payload, _id: 'optimistic-' + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]; });
    socket.emit('send_message', payload);
  };

  var handleDeleteMsg = function (messageId) {
    if (!socket.connected || !activeEnquiry?._id) return;
    if (window.confirm('Unsend this message?')) {
      socket.emit('delete_message', { messageId: messageId, enquiryId: activeEnquiry._id });
    }
  };

  var handleSelectEnquiry = function (enq) {
    setActiveEnquiry(enq);
    setMessages([]);
    if (isMobile) setMobileChatOpen(true);
  };

  var filteredEnquiries = enquiries.filter(function (e) {
    var q = sidebarSearch.toLowerCase();
    return getCustomerName(e).toLowerCase().includes(q) || (e.email || '').toLowerCase().includes(q);
  });

  var customerName = activeEnquiry ? getCustomerName(activeEnquiry) : '';

  return (
    <Box sx={{
      height: 'calc(100vh - 100px)', display: 'flex', bgcolor: 'white',
      borderRadius: { xs: '0px', md: '16px' }, overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #E0E4EC', m: { xs: 0, md: 2 }
    }}>

      {/* LEFT SIDEBAR */}
      {(!isMobile || !mobileChatOpen) && (
        <Box sx={{
          width: { xs: '100%', md: 340 }, minWidth: { md: 340 }, height: '100%',
          borderRight: '1px solid #E0E4EC', display: 'flex', flexDirection: 'column', bgcolor: 'white'
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="h5" fontWeight={800} sx={{ color: ACCENT }}>Chats</Typography>
              <IconButton size="small" sx={{ bgcolor: ACCENT_LIGHT }}>
                <FilterListIcon fontSize="small" sx={{ color: ACCENT }} />
              </IconButton>
            </Stack>
            <Paper sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', bgcolor: '#F1F5F9', borderRadius: '12px', boxShadow: 'none' }}>
              <SearchIcon sx={{ color: '#64748B', ml: 1 }} />
              <InputBase sx={{ ml: 1, flex: 1, p: 0.8, fontWeight: 500, fontSize: '0.9rem' }}
                placeholder="Search customers..." value={sidebarSearch}
                onChange={function (e) { setSidebarSearch(e.target.value); }} />
            </Paper>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={28} sx={{ color: ACCENT }} />
              </Box>
            ) : filteredEnquiries.length === 0 ? (
              <Box textAlign="center" py={4} color="text.secondary">
                <Typography variant="body2">No enquiries found</Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {filteredEnquiries.map(function (enq) {
                  var name = getCustomerName(enq);
                  var initials = getInitials(name);
                  var isActive = activeEnquiry?._id === enq._id;
                  var dateStr = enq.createdAt ? new Date(enq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';

                  return (
                    <ListItem key={enq._id} disablePadding>
                      <ListItemButton selected={isActive}
                        onClick={function () { handleSelectEnquiry(enq); }}
                        sx={{
                          py: 1.8, px: 2,
                          borderLeft: isActive ? '4px solid ' + ACCENT : '4px solid transparent',
                          '&.Mui-selected': { bgcolor: ACCENT_BG },
                          '&:hover': { bgcolor: '#FFF5F8' }
                        }}>
                        <ListItemAvatar>
                          <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot" color="success" sx={{ '& .MuiBadge-badge': { border: '2px solid white' } }}>
                            <Avatar sx={{ bgcolor: ACCENT_LIGHT, color: ACCENT, fontWeight: 700, fontSize: '0.85rem' }}>
                              {initials}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ maxWidth: 150 }}>{name}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{dateStr}</Typography>
                            </Stack>
                          }
                          secondary={
                            <Typography variant="body2" noWrap sx={{ maxWidth: '200px', color: '#64748B', fontSize: '0.8rem' }}>
                              {enq.moduleId?.title || enq.email || 'Boutique Enquiry'}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        </Box>
      )}

      {/* RIGHT CHAT PANE */}
      {(!isMobile || mobileChatOpen) && (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC', height: '100%' }}>
          {!activeEnquiry ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
              <ChatIcon sx={{ fontSize: 80, color: ACCENT, mb: 2 }} />
              <Typography variant="h5" fontWeight={700} color="text.secondary">Select a conversation</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Choose a customer from the list to start chatting</Typography>
            </Box>
          ) : (
            <React.Fragment>
              {/* Header */}
              <Box sx={{ p: isMobile ? 1.5 : 2, bgcolor: 'white', borderBottom: '1px solid #E0E4EC', display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {isMobile && (
                    <IconButton onClick={function () { setMobileChatOpen(false); }}>
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <Avatar sx={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, bgcolor: ACCENT, fontWeight: 800, fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
                    {getInitials(customerName)}
                  </Avatar>
                  <Box>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={800} sx={{ lineHeight: 1.2 }}>{customerName}</Typography>
                    <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 0 : 1.5} alignItems={isMobile ? 'flex-start' : 'center'}>
                      {activeEnquiry.email && (
                        <Typography variant="caption" sx={{ color: ACCENT, fontWeight: 700 }}>{activeEnquiry.email}</Typography>
                      )}
                      {!isMobile && activeEnquiry.contact && (
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                      )}
                      {activeEnquiry.contact && (
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>{activeEnquiry.contact}</Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Messages */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: isMobile ? 2 : 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {chatLoading ? (
                  <Box display="flex" justifyContent="center" py={4}><CircularProgress sx={{ color: ACCENT }} /></Box>
                ) : messages.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                    <ChatIcon sx={{ fontSize: 60, color: ACCENT, mb: 1 }} />
                    <Typography variant="h6" fontWeight={600}>No messages yet</Typography>
                    <Typography variant="body2" color="text.secondary">Start the conversation!</Typography>
                  </Box>
                ) : (
                  messages.map(function (msg, i) {
                    var fromMe = isMe(msg.senderId);
                    var isOpt = String(msg._id).startsWith('optimistic-');
                    return (
                      <Box key={msg._id || i} sx={{
                        alignSelf: fromMe ? 'flex-end' : 'flex-start',
                        maxWidth: { xs: '85%', md: '65%' }, display: 'flex', flexDirection: 'column',
                        alignItems: fromMe ? 'flex-end' : 'flex-start'
                      }}>
                        <Paper elevation={0} sx={{
                          p: 1.5, px: 2,
                          borderRadius: fromMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          bgcolor: fromMe ? ACCENT : 'white',
                          color: fromMe ? 'white' : '#1A1A2E',
                          boxShadow: fromMe ? '0 4px 12px rgba(216,27,96,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                          border: fromMe ? 'none' : '1px solid #eef0f4',
                          position: 'relative', '&:hover .delete-msg': { opacity: 1 }
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>{msg.text || msg.message}</Typography>
                          {fromMe && !isOpt && (
                            <IconButton className="delete-msg" size="small"
                              onClick={function () { handleDeleteMsg(msg._id); }}
                              sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#ff4d4d', color: '#fff', p: 0.2, opacity: 0, transition: 'opacity 0.2s', '&:hover': { bgcolor: '#cc0000' } }}>
                              <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          )}
                        </Paper>
                        <Typography variant="caption" sx={{ mt: 0.3, px: 1, color: '#94A3B8', fontWeight: 600, fontSize: '0.65rem' }}>
                          {isOpt
                            ? <span style={{ fontStyle: 'italic', opacity: 0.7 }}>sending...</span>
                            : <span>{msg.time} {fromMe && <DoneAllIcon sx={{ fontSize: 12, ml: 0.5, verticalAlign: 'middle', color: ACCENT }} />}</span>
                          }
                        </Typography>
                      </Box>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box sx={{ p: isMobile ? 1.5 : 2, bgcolor: 'white', borderTop: '1px solid #E0E4EC' }}>
                <Paper component="form" elevation={0}
                  onSubmit={function (e) { e.preventDefault(); handleSend(); }}
                  sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <IconButton sx={{ color: '#64748B' }}><AddIcon /></IconButton>
                  <TextField fullWidth placeholder="Type a message..." variant="standard"
                    value={message} onChange={function (e) { setMessage(e.target.value); }}
                    InputProps={{ disableUnderline: true }}
                    sx={{ ml: 1, flex: 1, '& .MuiInputBase-input': { fontWeight: 500 } }} />
                  <IconButton sx={{ color: '#64748B' }}><EmojiEmotionsIcon /></IconButton>
                  <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                  <IconButton onClick={handleSend} disabled={!message.trim()}
                    sx={{ p: 1.2, color: 'white', bgcolor: ACCENT, '&:hover': { bgcolor: ACCENT_DARK }, '&.Mui-disabled': { bgcolor: ACCENT_LIGHT, color: 'white' } }}>
                    <SendIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Paper>
              </Box>
            </React.Fragment>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EnquiryChatPage;
