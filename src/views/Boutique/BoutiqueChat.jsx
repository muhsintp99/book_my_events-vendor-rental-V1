import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    Avatar,
    Paper,
    Chip,
    alpha,
    Divider,
    Button,
    useTheme,
    useMediaQuery,
    Popover,
    Grid,
    Menu,
    MenuItem,
    Fade,
    InputBase,
    Badge,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    CircularProgress
} from '@mui/material';
import {
    Send,
    ArrowBack,
    Chat,
    MoreVert,
    AttachFile,
    CheckCircle,
    PhotoCamera,
    Search,
    EmojiEmotions,
    Add,
    InsertDriveFile,
    DeleteOutline,
    NotificationsOffOutlined,
    PersonOutline,
    Close,
    FilterList
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket } from '../../socket';
import axios from 'axios';

const THEME = {
    primary: '#9C27B0',
    secondary: '#E91E63',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
    glass: 'rgba(255, 255, 255, 0.8)',
    dark: '#1A1A2E'
};

const COMMON_EMOJIS = ['😊', '😂', '😍', '👍', '🙏', '🔥', '✨', '❤️', '🎉', '👗', '👜', '📍', '💯', '👏', '🙌', '⭐'];

const getCustomerName = (enq) => {
    if (!enq) return 'Customer';
    if (enq.userId?.firstName) return (enq.userId.firstName + ' ' + (enq.userId.lastName || '')).trim();
    return enq.fullName || 'Customer';
};

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

// Customization enquiries handled via state.

const BoutiqueChat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const userStr = localStorage.getItem('user') || '{}';
    const user = JSON.parse(userStr);
    const vendorId = user?.providerId || user?._id;

    // State
    const [enquiries, setEnquiries] = useState([]);
    const [activeEnquiry, setActiveEnquiry] = useState(location.state?.enquiry || null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    const [sidebarSearch, setSidebarSearch] = useState('');
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileChatOpen, setMobileChatOpen] = useState(!!location.state?.enquiry);

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const pendingMessagesRef = useRef(new Set());

    const filteredChats = useMemo(() => {
        let list = enquiries;
        if (location.state?.product?._id) {
            list = list.filter(e => String(e.packageId) === String(location.state.product._id));
        }
        return list.filter(e => getCustomerName(e).toLowerCase().includes(sidebarSearch.toLowerCase()));
    }, [enquiries, sidebarSearch, location.state?.product?._id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch Customization Enquiries
    useEffect(() => {
        if (!vendorId) return;
        const fetchEnquiries = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://api.bookmyevent.ae/api/enquiries/provider/${vendorId}`);
                const all = res.data.data || [];
                const customizations = all.filter(e => {
                    const desc = (e.description || '').toLowerCase();
                    const moduleType = (e.moduleId?.moduleType || '').toLowerCase();
                    const title = (e.moduleId?.title || '').toLowerCase();
                    const isBoutique = moduleType === 'boutique' || title.includes('boutique');
                    const isCustom = desc.includes('customize') || desc.includes('design');
                    return isBoutique && isCustom;
                });
                setEnquiries(customizations);
                if (!activeEnquiry && customizations.length > 0) {
                    setActiveEnquiry(customizations[0]);
                }
            } catch (err) {
                console.error("Failed to fetch enquiries:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnquiries();
    }, [vendorId]);

    // Fetch Messages
    useEffect(() => {
        if (!activeEnquiry?._id) return;
        const fetchMessages = async () => {
            try {
                setChatLoading(true);
                const res = await axios.get(`https://api.bookmyevent.ae/api/enquiries/${activeEnquiry._id}/messages`);
                setMessages(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            } finally {
                setChatLoading(false);
            }
        };
        fetchMessages();
    }, [activeEnquiry?._id]);

    // Socket Setup
    useEffect(() => {
        if (!activeEnquiry?._id || !vendorId) return;

        if (!socket.connected) socket.connect();
        socket.emit('join_enquiry', { enquiryId: activeEnquiry._id, vendorId: vendorId });

        const handleReceive = (data) => {
            if (data.enquiryId && data.enquiryId !== activeEnquiry._id) return;

            const key = data._id || data.timestamp;
            if (pendingMessagesRef.current.has(key)) {
                pendingMessagesRef.current.delete(key);
                setMessages(prev => prev.map(msg =>
                    (msg.timestamp === data.timestamp && String(msg.senderId) === String(data.senderId)) ?
                        { ...data, time: data.time || new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : msg
                ));
                return;
            }

            setMessages(prev => {
                const exists = prev.some(msg => msg._id === data._id || (data.timestamp && msg.timestamp === data.timestamp));
                if (exists) return prev;
                return [...prev, { ...data, time: data.time || new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
            });
        };

        const handleDeleted = (data) => {
            setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
        };

        socket.on('receive_message', handleReceive);
        socket.on('message_deleted', handleDeleted);

        return () => {
            socket.off('receive_message', handleReceive);
            socket.off('message_deleted', handleDeleted);
        };
    }, [activeEnquiry?._id, vendorId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (content = message, type = 'text') => {
        if (type === 'text' && !content.trim()) return;
        if (!activeEnquiry?._id) return;

        const timestamp = new Date().toISOString();
        const payload = {
            enquiryId: activeEnquiry._id,
            senderId: vendorId,
            receiverId: activeEnquiry.userId?._id || activeEnquiry.userId,
            senderName: user?.businessName || user?.name || 'Vendor',
            senderRole: 'vendor',
            text: type === 'text' ? content : 'Sent an image',
            message: type === 'text' ? content : 'Sent an image',
            timestamp: timestamp,
            type: type
        };

        pendingMessagesRef.current.add(timestamp);
        setMessages(prev => [
            ...prev,
            { ...payload, _id: 'optimistic-' + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        socket.emit('send_message', payload);
        if (type === 'text') setMessage('');
    };

    const handleFileClick = () => fileInputRef.current?.click();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => handleSend(event.target.result, 'image');
            reader.readAsDataURL(file);
        }
    };

    const handleEmojiOpen = (e) => setEmojiAnchorEl(e.currentTarget);
    const handleEmojiClose = () => setEmojiAnchorEl(null);
    const handleEmojiSelect = (emoji) => {
        setMessage(prev => prev + emoji);
        handleEmojiClose();
    };

    const handleMenuOpen = (e) => setMenuAnchorEl(e.currentTarget);
    const handleMenuClose = () => setMenuAnchorEl(null);
    const handleClearChat = () => {
        // Option to clear messages locally or via API
        setMessages([]);
        handleMenuClose();
    };

    const handleSelectChat = (enq) => {
        setActiveEnquiry(enq);
        if (isMobile) setMobileChatOpen(true);
    };

    const Sidebar = () => (
        <Box sx={{
            width: { xs: '100%', md: 350 },
            height: '100%',
            borderRight: '1px solid #E0E4EC',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white'
        }}>
            {/* Sidebar Header */}
            <Box sx={{ p: 2, bgcolor: 'white' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={800} color={THEME.primary}>Customization</Typography>
                    <Stack direction="row" spacing={1}>
                        <IconButton size="small" sx={{ bgcolor: alpha(THEME.primary, 0.05) }}><FilterList fontSize="small" /></IconButton>
                    </Stack>
                </Stack>
                <Paper sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', bgcolor: '#F1F5F9', borderRadius: '12px', boxShadow: 'none' }}>
                    <Search sx={{ color: '#64748B', ml: 1 }} />
                    <InputBase
                        sx={{ ml: 1, flex: 1, p: 1, fontWeight: 500 }}
                        placeholder="Search customers..."
                        value={sidebarSearch}
                        onChange={(e) => setSidebarSearch(e.target.value)}
                    />
                </Paper>
            </Box>

            {/* Chat List */}
            <List sx={{ flexGrow: 1, overflowY: 'auto', py: 0 }}>
                {loading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={30} /></Box>
                ) : filteredChats.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">No customizations found</Typography>
                    </Box>
                ) : (
                    filteredChats.map((enq) => (
                        <ListItem key={enq._id} disablePadding>
                            <ListItemButton
                                selected={activeEnquiry?._id === enq._id}
                                onClick={() => handleSelectChat(enq)}
                                sx={{
                                    py: 2,
                                    px: 2,
                                    borderLeft: `4px solid ${activeEnquiry?._id === enq._id ? THEME.primary : 'transparent'}`,
                                    '&.Mui-selected': { bgcolor: alpha(THEME.primary, 0.05) }
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circle"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color="success"
                                        sx={{ '& .MuiBadge-badge': { border: '2px solid white' } }}
                                    >
                                        <Avatar sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary, fontWeight: 700 }}>
                                            {getInitials(getCustomerName(enq))}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight={700}>{getCustomerName(enq)}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(enq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </Typography>
                                        </Stack>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{ maxWidth: '180px', color: '#64748B' }}
                                        >
                                            {enq.description}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))
                )}
            </List>
        </Box>
    );

    return (
        <Box sx={{
            height: 'calc(100vh - 120px)',
            display: 'flex',
            bgcolor: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            border: '1px solid rgba(224, 228, 236, 0.5)',
            m: { xs: 1, md: 3 }
        }}>
            {/* Sidebar Container */}
            {(!isMobile || !mobileChatOpen) && <Sidebar />}

            {/* Chat Pane Container */}
            {(!isMobile || mobileChatOpen) && (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC' }}>
                    {/* Hidden File Input */}
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />

                    {/* Chat Header */}
                    <Box sx={{ p: isMobile ? 1.5 : 2, bgcolor: 'white', borderBottom: '1px solid #E0E4EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
                            {isMobile && (
                                <IconButton onClick={() => setMobileChatOpen(false)}>
                                    <ArrowBack />
                                </IconButton>
                            )}
                            {!showSearch ? (
                                <>
                                    <Avatar sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, bgcolor: THEME.primary, fontWeight: 800, fontSize: isMobile ? '1rem' : '1.2rem' }}>
                                        {getInitials(getCustomerName(activeEnquiry))}
                                    </Avatar>
                                    <Box>
                                        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={800} sx={{ lineHeight: 1.2 }}>{getCustomerName(activeEnquiry)}</Typography>
                                        <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 1.5} alignItems={isMobile ? "flex-start" : "center"}>
                                            <Typography variant="caption" sx={{ color: THEME.secondary, fontWeight: 700 }}>{activeEnquiry?.email}</Typography>
                                            {!isMobile && <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#CBD5E1' }} />}
                                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>{activeEnquiry?.contact}</Typography>
                                        </Stack>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ flex: 1, bgcolor: '#f1f5f9', borderRadius: '12px', px: 2, py: 1, display: 'flex', alignItems: 'center', animation: 'fadeIn 0.3s ease-in-out' }}>
                                    <Search sx={{ color: '#64748B', mr: 1 }} />
                                    <InputBase fullWidth placeholder="Search messages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ fontWeight: 500 }} />
                                    <IconButton size="small" onClick={() => { setShowSearch(false); setSearchQuery(''); }}><Close fontSize="small" /></IconButton>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            {!showSearch && <IconButton onClick={() => setShowSearch(true)} sx={{ bgcolor: alpha(THEME.primary, 0.05) }}><Search fontSize="small" /></IconButton>}
                            <IconButton onClick={handleMenuOpen} sx={{ bgcolor: alpha(THEME.primary, 0.05) }}><MoreVert fontSize="small" /></IconButton>
                        </Stack>
                    </Box>

                    {/* Chat Messages */}
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: isMobile ? 2 : 3, display: 'flex', flexDirection: 'column', gap: 2, backgroundImage: 'radial-gradient(#9C27B010 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        {chatLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <CircularProgress size={40} />
                            </Box>
                        ) : messages.length === 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                                <Chat sx={{ fontSize: 60, color: THEME.primary, mb: 1 }} />
                                <Typography variant="h6" fontWeight={600}>No messages yet</Typography>
                            </Box>
                        ) : (
                            messages.map((msg, idx) => {
                                const isVendor = msg.senderRole === 'vendor';
                                return (
                                    <Box key={msg._id || idx} sx={{ alignSelf: isVendor ? 'flex-end' : 'flex-start', maxWidth: { xs: '90%', md: '70%' }, display: 'flex', flexDirection: 'column', alignItems: isVendor ? 'flex-end' : 'flex-start' }}>
                                        <Paper sx={{
                                            p: msg.type === 'image' ? 0.5 : 2,
                                            borderRadius: isVendor ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                            bgcolor: isVendor ? THEME.primary : 'white',
                                            color: isVendor ? 'white' : THEME.dark,
                                            boxShadow: isVendor ? '0 8px 16px rgba(156, 39, 176, 0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
                                            border: isVendor ? 'none' : '1px solid rgba(224, 228, 236, 0.5)',
                                            overflow: 'hidden'
                                        }}>
                                            {msg.type === 'image' ? (
                                                <Box sx={{ width: '100%', borderRadius: '16px', overflow: 'hidden', display: 'flex' }}>
                                                    <img src={msg.file} alt="sent" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                                                </Box>
                                            ) : (
                                                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.5 }}>{msg.text || msg.message}</Typography>
                                            )}
                                        </Paper>
                                        <Typography variant="caption" sx={{ mt: 0.5, px: 1, color: '#94A3B8', fontWeight: 600 }}>
                                            {msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {isVendor && <CheckCircle sx={{ fontSize: 12, ml: 0.5, verticalAlign: 'middle', color: THEME.primary }} />}
                                        </Typography>
                                    </Box>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Chat Input */}
                    <Box sx={{ p: isMobile ? 1.5 : 2.5, bgcolor: 'white', borderTop: '1px solid #E0E4EC' }}>
                        <Paper component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                            <IconButton onClick={handleFileClick} sx={{ color: '#64748B' }}><Add /></IconButton>
                            <TextField fullWidth placeholder="Type a message..." variant="standard" value={message} onChange={(e) => setMessage(e.target.value)} InputProps={{ disableUnderline: true }} sx={{ ml: 1, flex: 1, '& .MuiInputBase-input': { fontWeight: 500 } }} />
                            <IconButton onClick={handleEmojiOpen} sx={{ color: '#64748B' }}><EmojiEmotions /></IconButton>
                            <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                            <IconButton onClick={() => handleSend()} sx={{ p: 1.2, color: 'white', bgcolor: THEME.primary, '&:hover': { bgcolor: THEME.secondary } }}>
                                <Send sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Paper>
                    </Box>
                </Box>
            )}

            {/* Popovers & Menus */}
            <Popover open={Boolean(emojiAnchorEl)} anchorEl={emojiAnchorEl} onClose={handleEmojiClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'bottom', horizontal: 'right' }} PaperProps={{ sx: { p: 1, borderRadius: '16px' } }}>
                <Grid container spacing={1} sx={{ width: '200px', p: 1 }}>
                    {COMMON_EMOJIS.map((emoji) => (
                        <Grid item xs={3} key={emoji}>
                            <IconButton onClick={() => handleEmojiSelect(emoji)} size="small" sx={{ fontSize: '1.2rem' }}>{emoji}</IconButton>
                        </Grid>
                    ))}
                </Grid>
            </Popover>

            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: '16px', minWidth: 180, mt: 1.5 } }}>
                <MenuItem onClick={handleMenuClose}><PersonOutline sx={{ mr: 1.5, color: THEME.primary }} /><Typography variant="body2" fontWeight={600}>View Profile</Typography></MenuItem>
                <MenuItem onClick={handleMenuClose}><NotificationsOffOutlined sx={{ mr: 1.5, color: '#64748B' }} /><Typography variant="body2" fontWeight={600}>Mute Chat</Typography></MenuItem>
                <Divider />
                <MenuItem onClick={handleClearChat} sx={{ color: '#F44336' }}><DeleteOutline sx={{ mr: 1.5 }} /><Typography variant="body2" fontWeight={600}>Clear History</Typography></MenuItem>
            </Menu>

            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </Box>
    );
};

export default BoutiqueChat;
