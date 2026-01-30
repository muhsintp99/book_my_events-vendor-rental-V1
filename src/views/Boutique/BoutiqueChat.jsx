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
    ListItemButton
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

const THEME = {
    primary: '#9C27B0',
    secondary: '#E91E63',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
    glass: 'rgba(255, 255, 255, 0.8)',
    dark: '#1A1A2E'
};

const COMMON_EMOJIS = ['😊', '😂', '😍', '👍', '🙏', '🔥', '✨', '❤️', '🎉', '👗', '👜', '📍', '💯', '👏', '🙌', '⭐'];

const INITIAL_CHATS = [
    {
        id: 1,
        name: "Sarah Johnson",
        avatar: "SJ",
        email: "sarah.j@example.com",
        phone: "+1 (555) 012-3456",
        online: true,
        lastMessage: "That's great! I'll send over some references soon.",
        time: "09:25 AM",
        unreadCount: 2,
        messages: [
            { id: 1, sender: 'customer', text: "Hello, I'm interested in working with your boutique for some upcoming designs. How do we get started?", time: '09:15 AM', type: 'text' },
            { id: 2, sender: 'vendor', text: "Hi there! Welcome to our boutique. We'd love to help you. You can share your ideas here, and we can discuss the specifics!", time: '09:20 AM', type: 'text' },
            { id: 3, sender: 'customer', text: "That's great! I'll send over some references soon.", time: '09:25 AM', type: 'text' }
        ]
    },
    {
        id: 2,
        name: "Michael Chen",
        avatar: "MC",
        email: "m.chen@outlook.com",
        phone: "+1 (555) 098-7654",
        online: false,
        lastMessage: "Do you offer international shipping?",
        time: "Yesterday",
        unreadCount: 0,
        messages: [
            { id: 1, sender: 'customer', text: "Hi, I saw your new collection. It looks amazing!", time: 'Yesterday', type: 'text' },
            { id: 2, sender: 'customer', text: "Do you offer international shipping?", time: 'Yesterday', type: 'text' }
        ]
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        avatar: "ER",
        email: "elena.rd@gmail.com",
        phone: "+1 (555) 456-7890",
        online: true,
        lastMessage: "I loved the fabric quality!",
        time: "10:45 AM",
        unreadCount: 0,
        messages: [
            { id: 1, sender: 'customer', text: "The sample arrived today.", time: '10:40 AM', type: 'text' },
            { id: 2, sender: 'customer', text: "I loved the fabric quality!", time: '10:45 AM', type: 'text' }
        ]
    }
];

const BoutiqueChat = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [chats, setChats] = useState(INITIAL_CHATS);
    const [activeChatId, setActiveChatId] = useState(1);
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [message, setMessage] = useState('');
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileChatOpen, setMobileChatOpen] = useState(false);

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const activeChat = useMemo(() =>
        chats.find(c => c.id === activeChatId) || chats[0],
        [chats, activeChatId]);

    const filteredChats = useMemo(() =>
        chats.filter(c => c.name.toLowerCase().includes(sidebarSearch.toLowerCase())),
        [chats, sidebarSearch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat.messages]);

    const handleSend = (content = message, type = 'text') => {
        if (type === 'text' && !content.trim()) return;

        const newMessage = {
            id: activeChat.messages.length + 1,
            sender: 'vendor',
            text: type === 'text' ? content : null,
            file: type === 'image' ? content : null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: type
        };

        const updatedChats = chats.map(chat => {
            if (chat.id === activeChatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: type === 'text' ? content : 'Sent an image',
                    time: newMessage.time
                };
            }
            return chat;
        });

        setChats(updatedChats);
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
        setChats(chats.map(c => c.id === activeChatId ? { ...c, messages: [] } : c));
        handleMenuClose();
    };

    const handleSelectChat = (id) => {
        setActiveChatId(id);
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
                    <Typography variant="h5" fontWeight={800} color={THEME.primary}>Chats</Typography>
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
                {filteredChats.map((chat) => (
                    <ListItem key={chat.id} disablePadding>
                        <ListItemButton
                            selected={activeChatId === chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            sx={{
                                py: 2,
                                px: 2,
                                borderLeft: `4px solid ${activeChatId === chat.id ? THEME.primary : 'transparent'}`,
                                '&.Mui-selected': { bgcolor: alpha(THEME.primary, 0.05) }
                            }}
                        >
                            <ListItemAvatar>
                                <Badge
                                    overlap="circle"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    color={chat.online ? "success" : "default"}
                                    sx={{ '& .MuiBadge-badge': { border: '2px solid white' } }}
                                >
                                    <Avatar sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary, fontWeight: 700 }}>
                                        {chat.avatar}
                                    </Avatar>
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle1" fontWeight={700}>{chat.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{chat.time}</Typography>
                                    </Stack>
                                }
                                secondary={
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{ maxWidth: '180px', color: chat.unreadCount > 0 ? '#1E293B' : '#64748B', fontWeight: chat.unreadCount > 0 ? 600 : 400 }}
                                        >
                                            {chat.lastMessage}
                                        </Typography>
                                        {chat.unreadCount > 0 && (
                                            <Chip
                                                label={chat.unreadCount}
                                                size="small"
                                                sx={{ height: 18, minWidth: 18, bgcolor: THEME.primary, color: 'white', fontWeight: 800, fontSize: '0.65rem' }}
                                            />
                                        )}
                                    </Stack>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
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
                                        {activeChat.avatar}
                                    </Avatar>
                                    <Box>
                                        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={800} sx={{ lineHeight: 1.2 }}>{activeChat.name}</Typography>
                                        <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 1.5} alignItems={isMobile ? "flex-start" : "center"}>
                                            <Typography variant="caption" sx={{ color: THEME.secondary, fontWeight: 700 }}>{activeChat.email}</Typography>
                                            {!isMobile && <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#CBD5E1' }} />}
                                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>{activeChat.phone}</Typography>
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
                        {activeChat.messages.length === 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                                <Chat sx={{ fontSize: 60, color: THEME.primary, mb: 1 }} />
                                <Typography variant="h6" fontWeight={600}>No messages yet</Typography>
                            </Box>
                        ) : (
                            activeChat.messages.map((msg) => {
                                const isVendor = msg.sender === 'vendor';
                                return (
                                    <Box key={msg.id} sx={{ alignSelf: isVendor ? 'flex-end' : 'flex-start', maxWidth: { xs: '90%', md: '70%' }, display: 'flex', flexDirection: 'column', alignItems: isVendor ? 'flex-end' : 'flex-start' }}>
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
                                                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.5 }}>{msg.text}</Typography>
                                            )}
                                        </Paper>
                                        <Typography variant="caption" sx={{ mt: 0.5, px: 1, color: '#94A3B8', fontWeight: 600 }}>
                                            {msg.time} {isVendor && <CheckCircle sx={{ fontSize: 12, ml: 0.5, verticalAlign: 'middle', color: THEME.primary }} />}
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
