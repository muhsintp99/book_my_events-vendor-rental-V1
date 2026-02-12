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
import axios from "axios";

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
      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.timestamp === data.timestamp &&
            msg.senderId === data.senderId
        );
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
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

    const payload = {
      enquiryId: enquiry._id,
      senderId: vendorId,
      senderName: user?.businessName || user?.name || "Vendor",
      senderRole: "vendor",
      text: message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", payload);
    setMessage("");
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 450,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
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
              const isMe = msg.senderId === vendorId;

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
                      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
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
                      {new Date(msg.timestamp).toLocaleTimeString()}
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