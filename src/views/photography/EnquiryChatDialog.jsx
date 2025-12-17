import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const EnquiryChatDialog = ({ open, onClose, enquiry }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  if (!enquiry) return null;

  const messages = [
    {
      sender: "user",
      text: enquiry.description,
      time: "10:10 AM",
    },
    {
      sender: "vendor",
      text: "Thanks for contacting us! 😊",
      time: "10:12 AM",
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Send message:", message);
    setMessage("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg,#1976d2,#42a5f5)",
          color: "#fff",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#fff", color: "#1976d2" }}>
            {enquiry.fullName?.charAt(0)}
          </Avatar>

          <Box flex={1}>
            <Typography fontWeight={600}>{enquiry.fullName}</Typography>
            <Typography variant="caption">
              {enquiry.moduleId?.title} • Enquiry Chat
            </Typography>
          </Box>

          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <Divider />

      {/* CHAT BODY */}
      <Box
        sx={{
          height: 380,
          p: 2,
          overflowY: "auto",
          bgcolor: "#f4f6f8",
        }}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent={msg.sender === "vendor" ? "flex-end" : "flex-start"}
            mb={1.5}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "75%",
                bgcolor: msg.sender === "vendor" ? "#1976d2" : "#fff",
                color: msg.sender === "vendor" ? "#fff" : "#000",
                boxShadow: 1,
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT */}
      <Box sx={{ p: 1.5, borderTop: "1px solid #e0e0e0" }}>
        <Stack direction="row" spacing={1}>
          <ChatBubbleOutlineIcon color="action" />
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default EnquiryChatDialog;
