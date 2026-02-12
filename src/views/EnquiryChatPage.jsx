import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import axios from "axios";

const EnquiryChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const enquiry = location.state?.enquiry;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const vendorId = user?.providerId || user?._id;

  /* ==============================
     REDIRECT IF NO ENQUIRY
  ============================== */
  useEffect(() => {
    if (!enquiry?._id) {
      navigate("/venue/enquiries");
    }
  }, [enquiry?._id, navigate]);

  /* ==============================
     FETCH CHAT HISTORY
  ============================== */
  useEffect(() => {
    if (!enquiry?._id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.bookmyevent.ae/api/enquiries/${enquiry._id}/messages`
        );
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [enquiry?._id]);

  /* ==============================
     SOCKET CONNECT
  ============================== */
  const pendingMessagesRef = useRef(new Set());

  useEffect(() => {
    if (!enquiry?._id || !vendorId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_enquiry", {
      enquiryId: enquiry._id,
      vendorId,
    });

    const handleReceive = (data) => {
      console.log("📨 Received message:", data);

      const messageKey = data._id || `${data.senderId}-${data.timestamp}`;

      if (pendingMessagesRef.current.has(messageKey) || pendingMessagesRef.current.has(data.timestamp)) {
        pendingMessagesRef.current.delete(messageKey);
        pendingMessagesRef.current.delete(data.timestamp);

        // Update the optimistic message with server data
        setMessages((prev) =>
          prev.map(msg =>
            (msg.timestamp === data.timestamp && msg.senderId === data.senderId)
              ? { ...data, time: data.time || new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              : msg
          )
        );
        return;
      }

      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg._id === data._id ||
            (msg.timestamp && msg.timestamp === data.timestamp && msg.senderId === data.senderId)
        );
        if (exists) return prev;
        return [...prev, { ...data, time: data.time || new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
      });
    };

    const handleDeleted = (data) => {
      console.log("🗑️ Message deleted:", data.messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_deleted", handleDeleted);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_deleted", handleDeleted);
    };
  }, [enquiry?._id, vendorId]);

  /* ==============================
     AUTO SCROLL
  ============================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ==============================
     SEND MESSAGE
  ============================== */
  const handleSend = () => {
    if (!message.trim() || !enquiry?._id) return;

    const currentMsg = message;
    setMessage(""); // Clear input

    const timestamp = new Date().toISOString();
    const payload = {
      enquiryId: enquiry._id,
      senderId: vendorId,
      receiverId: enquiry.userId?._id || enquiry.userId, // FIXED: Added receiverId
      senderName: user?.businessName || user?.name || "Vendor",
      senderRole: "vendor",
      text: currentMsg,
      message: currentMsg,
      timestamp: timestamp,
    };

    // Optimistic update
    const tempId = "optimistic-" + Date.now();
    pendingMessagesRef.current.add(timestamp);

    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        _id: tempId,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    socket.emit("send_message", payload);
  };

  const handleDeletedMessage = (messageId) => {
    if (!socket.connected || !enquiry?._id) return;
    if (window.confirm("Unsend this message?")) {
      socket.emit("delete_message", { messageId, enquiryId: enquiry._id });
    }
  };

  if (!enquiry?._id) return <Box p={4}><CircularProgress /></Box>;

  const customerName = enquiry.userId?.firstName
    ? `${enquiry.userId.firstName} ${enquiry.userId.lastName || ""}`.trim()
    : enquiry.fullName || "Customer";

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper elevation={0} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", borderRadius: 0, overflow: "hidden" }}>
        {/* HEADER */}
        <Box sx={{ p: 2, bgcolor: "#1abc9c", color: "#fff" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "#fff" }}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>{customerName.charAt(0)}</Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>{customerName}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>{enquiry.moduleId?.title || "Enquiry"}</Typography>
            </Box>
          </Stack>
        </Box>

        {/* CHAT BODY */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3, bgcolor: "#fff", display: "flex", flexDirection: "column", gap: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : messages.length === 0 ? (
            <Box textAlign="center" py={4} color="text.secondary">No messages yet.</Box>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderId === vendorId;
              const isOptimistic = String(msg._id).startsWith("optimistic-");

              return (
                <Box key={msg._id || i} sx={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                  <Box sx={{ p: 1.5, borderRadius: isMe ? "12px 12px 0 12px" : "12px 11px 12px 0", bgcolor: isMe ? "#1abc9c" : "#bbc6cc", color: isMe ? "#fff" : "#000", position: "relative", "&:hover .delete-msg": { opacity: 1 } }}>
                    <Typography variant="body2">{msg.text || msg.message}</Typography>

                    {isMe && !isOptimistic && (
                      <IconButton
                        className="delete-msg"
                        size="small"
                        onClick={() => handleDeletedMessage(msg._id)}
                        sx={{ position: "absolute", top: -10, right: -10, bgcolor: "#ff4d4d", color: "#fff", p: 0.2, opacity: 0, transition: "opacity 0.2s", "&:hover": { bgcolor: "#cc0000" } }}
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}

                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 0.5 }}>
                      {isOptimistic && <Typography variant="caption" sx={{ fontSize: "10px", fontStyle: "italic", opacity: 0.7 }}>sending...</Typography>}
                      <Typography variant="caption" sx={{ fontSize: "10px", opacity: 0.7 }}>{msg.time}</Typography>
                    </Stack>
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT */}
        <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "#fff" }}>
          <Stack direction="row" spacing={1}>
            <TextField fullWidth size="small" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }} />
            <IconButton onClick={handleSend} disabled={!message.trim()} sx={{ bgcolor: "#1abc9c", color: "#fff", "&:hover": { bgcolor: "#16a085" } }}>
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default EnquiryChatPage;