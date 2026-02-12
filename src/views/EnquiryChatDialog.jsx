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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";

const VenueEnquiryChatPage = () => {
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
     SOCKET CONNECT
  ============================== */
  /* ==============================
     SOCKET SETUP
  ============================== */
  useEffect(() => {
    if (!enquiry?._id || !vendorId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_enquiry", {
      enquiryId: enquiry._id,
      vendorId,
    });

    socket.on("message_history", (history) => {
      setMessages(history || []);
      setLoading(false);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            (msg._id && msg._id === data._id) ||
            (msg.timestamp === data.timestamp && msg.senderId === data.senderId)
        );
        if (exists) return prev;
        return [...prev, data];
      });
    });

    return () => {
      socket.off("message_history");
      socket.off("receive_message");
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

    // Extract IDs if they are objects (populated)
    const rid = enquiry.userId?._id || enquiry.userId;
    const sid = user?._id;

    const payload = {
      enquiryId: enquiry._id,
      senderId: sid,
      receiverId: rid,
      senderName: user.businessName || user.name || "Vendor",
      senderRole: "vendor",
      text: currentMsg,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
    };

    console.log("📤 Sending message from Vendor:", payload);

    // Optimistic update
    setMessages((prev) => [...prev, {
      ...payload,
      message: currentMsg, // Ensure both text/message are present
      _id: "temp-" + Date.now() // Temporary ID for dedup
    }]);

    // Emit through socket
    if (socket && socket.connected) {
      socket.emit("send_message", payload);
    }
  };

  const isMe = (senderId) => {
    const sid = String(senderId?._id || senderId);
    const vid = String(vendorId?._id || vendorId);
    return sid === vid;
  };

  if (!enquiry?._id) {
    return (
      <Box p={4}>
        <Alert severity="warning">
          No enquiry selected. Redirecting...
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper elevation={0} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", borderRadius: 0, overflow: "hidden" }}>
        {/* HEADER */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "#075E54",
            color: "#fff",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => navigate("/venue/enquiries")}
              sx={{ color: "#fff" }}
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>

            <Avatar sx={{ bgcolor: "#25D366" }}>
              {enquiry.fullName?.charAt(0) || "C"}
            </Avatar>

            <Box flex={1}>
              <Typography fontWeight={600}>
                {enquiry.fullName || "Customer"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Venue Enquiry
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* CHAT BODY */}
        <Box
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          ) : (
            messages.map((msg, i) => {
              const fromMe = isMe(msg.senderId);

              return (
                <Box
                  key={msg._id || i}
                  display="flex"
                  justifyContent={fromMe ? "flex-end" : "flex-start"}
                  mb={1}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.2,
                      maxWidth: "75%",
                      borderRadius: "18px",
                      bgcolor: fromMe ? "#DCF8C6" : "#fff",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      {msg.text || msg.message}
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
                      {msg.time || new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: "#f7f7f7",
            borderTop: "1px solid #ddd",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <ChatBubbleOutlineIcon sx={{ color: "#888" }} />

          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default VenueEnquiryChatPage;