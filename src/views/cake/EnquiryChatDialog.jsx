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
import { socket } from "../../socket";

const EnquiryChatDialog = ({ open, onClose, enquiry }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")); // logged-in vendor

  if (!enquiry || !user) return null;

  /* =================================================
     🔐 ALLOW ONLY OWNER VENDOR
  ================================================= */
  const isOwnerVendor =
    enquiry.vendorId === user._id ||
    enquiry.vendorId?._id === user._id;

  if (!isOwnerVendor) {
    return (
      <Dialog open={open} onClose={onClose}>
        <Box p={4} textAlign="center">
          <Typography color="error" fontWeight={600}>
            You are not authorized to view this chat
          </Typography>
        </Box>
      </Dialog>
    );
  }

  /* =================================================
     SOCKET CONNECT & JOIN ROOM
  ================================================= */
  useEffect(() => {
    if (!enquiry?._id) return;

    socket.connect();

    socket.emit("join_enquiry", {
      enquiryId: enquiry._id,
      vendorId: user._id,
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [enquiry, user._id]);

  /* =================================================
     AUTO SCROLL
  ================================================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =================================================
     SEND MESSAGE (NO DUPLICATES)
  ================================================= */
  const handleSend = () => {
    if (!message.trim()) return;

    const payload = {
      enquiryId: enquiry._id,
      senderId: user._id,
      senderRole: "vendor",
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", payload);
    setMessage("");
  };

 return (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    {/* HEADER */}
    <Box
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: "#075E54",
        color: "#fff"
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: "#25D366" }}>
          {enquiry.fullName?.charAt(0)}
        </Avatar>

        <Box flex={1}>
          <Typography fontWeight={600}>
            {enquiry.fullName}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Vendor Chat
          </Typography>
        </Box>

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>

    {/* CHAT BODY */}
    <Box
      sx={{
        height: 420,
        px: 2,
        py: 1,
        overflowY: "auto",
        bgcolor: "#ECE5DD"
      }}
    >
      {messages.map((msg, i) => {
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
                borderRadius: 2,
                bgcolor: isMe ? "#DCF8C6" : "#fff",
                boxShadow: "0 1px 1px rgba(0,0,0,0.15)"
              }}
            >
              <Typography
                variant="body2"
                sx={{ wordBreak: "break-word" }}
              >
                {msg.text}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  opacity: 0.6,
                  mt: 0.5,
                  fontSize: "0.7rem"
                }}
              >
                {msg.time}
              </Typography>
            </Box>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>

    {/* INPUT */}
    <Box
      sx={{
        p: 1.5,
        bgcolor: "#f7f7f7",
        borderTop: "1px solid #ddd"
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <ChatBubbleOutlineIcon sx={{ color: "#888" }} />

        <TextField
          fullWidth
          size="small"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          sx={{
            bgcolor: "#fff",
            borderRadius: 5
          }}
        />

        <IconButton
          onClick={handleSend}
          sx={{
            bgcolor: "#25D366",
            color: "#fff",
            "&:hover": { bgcolor: "#1ebd5a" }
          }}
        >
          <SendIcon />
        </IconButton>
      </Stack>
    </Box>
  </Dialog>
);
};

export default EnquiryChatDialog;
