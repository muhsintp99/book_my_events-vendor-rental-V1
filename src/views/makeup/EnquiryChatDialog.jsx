import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    Button,
    Avatar,
    CircularProgress,
    Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { socket } from "../../socket";

const EnquiryChatDialog = ({ open, onClose, enquiry }) => {

    // ❗️ MOVE THIS TO TOP — before hooks
    if (!open || !enquiry) return null;

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const messagesEndRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user")) || {};
    const loggedInId = user?.providerId || user?._id;

    /* =================================================
       AUTO SCROLL
    ================================================= */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* =================================================
       SOCKET SETUP
    ================================================= */
useEffect(() => {
    if (!open || !enquiry?._id) return;

    setLoading(true);
    setMessages([]);

    // Ensure socket connection
    if (!socket.connected) {
        socket.connect();
    }

    // Immediately sync state
    setSocketConnected(socket.connected);

    // Join room
    socket.emit("join_enquiry", {
        enquiryId: enquiry._id,
        vendorId: loggedInId,
        vendorName: user.businessName || user.name || "Vendor",
    });

    // Receive history
    socket.on("message_history", (history) => {
        setMessages(history || []);
        setLoading(false);
    });

    // Receive new messages
    socket.on("receive_message", (data) => {
        setMessages((prev) => [...prev, data]);
    });

    // Socket status listeners
    socket.on("connect", () => {
        setSocketConnected(true);
    });

    socket.on("disconnect", () => {
        setSocketConnected(false);
    });

    // Safety: stop loading after 1s
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1000);

    return () => {
        clearTimeout(timer);
        socket.off("message_history");
        socket.off("receive_message");
        socket.off("connect");
        socket.off("disconnect");
    };

}, [open, enquiry?._id]);




    /* =================================================
       SEND MESSAGE
    ================================================= */
    const handleSend = () => {
        if (!message.trim()) return;

        const payload = {
            enquiryId: enquiry._id,
            senderId: user._id,
            senderName: user.businessName || user.name || "Vendor",
            senderRole: "vendor",
            text: message,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
        };

        // Emit through socket
        socket.emit("send_message", payload, (acknowledgment) => {
            console.log("Message sent:", acknowledgment);
        });

        // Optimistically add to local messages
        setMessage("");
    };

    /* =================================================
       HANDLE ENTER KEY
    ================================================= */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                }
            }}
        >
            {/* HEADER */}
            <DialogTitle
                sx={{
                    bgcolor: "#075E54",
                    color: "#fff",
                    p: 2,
                    flexShrink: 0,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: "#25D366", width: 40, height: 40 }}>
                        {enquiry.fullName?.charAt(0) || "C"}
                    </Avatar>

                    <Box flex={1}>
                        <Typography fontWeight={600} variant="subtitle2">
                            {enquiry.fullName || "Customer"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {enquiry.moduleId?.title || "Venue"} Enquiry
                            {socketConnected && " • Connected"}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "#fff",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                        }}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            {/* CHAT BODY */}
            <DialogContent
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    bgcolor: "#ECE5DD",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <CircularProgress size={40} />
                    </Box>
                ) : messages.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Typography color="text.secondary" textAlign="center">
                            No messages yet. Start the conversation!
                        </Typography>
                    </Box>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.senderId === user._id;

                        return (
                            <Box
                                key={i}
                                display="flex"
                                justifyContent={isMe ? "flex-end" : "flex-start"}
                                mb={1}
                            >
                                <Box
                                    sx={{
                                        px: 2,
                                        py: 1.2,
                                        maxWidth: "75%",
                                        borderRadius: "18px",
                                        bgcolor: isMe ? "#DCF8C6" : "#fff",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    <Typography variant="body2">
                                        {msg.text}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            textAlign: "right",
                                            opacity: 0.6,
                                            mt: 0.5,
                                            fontSize: "0.7rem",
                                        }}
                                    >
                                        {msg.time || new Date(msg.timestamp).toLocaleTimeString()}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </DialogContent>

            {/* INPUT FOOTER */}
            <DialogActions
                sx={{
                    p: 1.5,
                    bgcolor: "#f7f7f7",
                    borderTop: "1px solid #ddd",
                    gap: 1,
                    flexShrink: 0,
                }}
            >
                <ChatBubbleOutlineIcon sx={{ color: "#888" }} />

               <TextField
    fullWidth
    size="small"
    placeholder="Type a message..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={handleKeyDown}
    multiline
    maxRows={3}
    disabled={!open}
    sx={{
        bgcolor: "#fff",
        borderRadius: "20px",
        "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
        },
    }}
/>


            <IconButton
    onClick={handleSend}
    disabled={!message.trim()}
    sx={{
        bgcolor: message.trim() ? "#25D366" : "#ccc",
        color: "#fff",
        "&:hover": {
            bgcolor: message.trim() ? "#1ebd5a" : "#ccc",
        },
    }}
    size="small"
>
    <SendIcon />
</IconButton>

            </DialogActions>
        </Dialog>
    );
};

export default EnquiryChatDialog;