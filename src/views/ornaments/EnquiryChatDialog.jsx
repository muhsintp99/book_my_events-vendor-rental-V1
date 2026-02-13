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
  Avatar,
  CircularProgress,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { socket } from "../../socket";

const EnquiryChatDialog = ({ open, onClose, enquiry }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const loggedInId = user?._id;

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!open || !enquiry?._id) return;

    setLoading(true);

    const enquiryId = enquiry._id;
    const vendorId = user?._id;
    const userId = enquiry.userId?._id || enquiry.userId;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setSocketConnected(true);

      socket.emit("join_enquiry", {
        enquiryId,
        vendorId,
        userId,
      });
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleHistory = (history) => {
      setMessages(history || []);
      setLoading(false);
    };

    const handleReceive = (msg) => {
      setMessages((prev) => {
        // Replace optimistic message
        const tempMsg = prev.find(
          (m) =>
            m._id?.startsWith("temp-") &&
            (m.message === msg.message || m.text === msg.message) &&
            String(m.senderId) === String(msg.senderId)
        );

        if (tempMsg) {
          return prev.map((m) =>
            m._id === tempMsg._id ? msg : m
          );
        }

        return [...prev, msg];
      });
    };

    const handleDelete = ({ messageId }) => {
      setMessages((prev) =>
        prev.filter((m) => m._id !== messageId)
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message_history", handleHistory);
    socket.on("receive_message", handleReceive);
    socket.on("message_deleted", handleDelete);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message_history", handleHistory);
      socket.off("receive_message", handleReceive);
      socket.off("message_deleted", handleDelete);
    };
  }, [open, enquiry?._id]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = () => {
    if (!message.trim()) return;

    const tempId = "temp-" + Date.now();
    const currentMsg = message;

    const payload = {
      enquiryId: enquiry._id,
      senderId: loggedInId,
      receiverId: enquiry.userId?._id || enquiry.userId,
      senderRole: "vendor",
      message: currentMsg,
      timestamp: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        _id: tempId,
      },
    ]);

    setMessage("");

    if (socket.connected) {
      socket.emit("send_message", payload);
    }
  };

  /* ================= ENTER KEY ================= */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ================= DELETE MESSAGE ================= */
  const handleDeleteMessage = (messageId) => {
    if (socket.connected) {
      socket.emit("delete_message", {
        messageId,
        enquiryId: enquiry._id,
      });
    }
  };

  const isMe = (senderId) =>
    String(senderId) === String(loggedInId);

  if (!enquiry) return null;

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
        },
      }}
    >
      {/* ================= HEADER ================= */}
      <DialogTitle sx={{ bgcolor: "#075E54", color: "#fff" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "#25D366" }}>
            {enquiry.fullName?.charAt(0) || "C"}
          </Avatar>

          <Box flex={1}>
            <Typography fontWeight={600}>
              {enquiry.fullName}
            </Typography>
            <Typography variant="caption">
              {enquiry.moduleId?.title}
              {socketConnected && " • Connected"}
            </Typography>
          </Box>

          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* ================= BODY ================= */}
      <DialogContent
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "#ECE5DD",
          p: 2,
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((msg) => {
            const fromMe = isMe(msg.senderId);
            const isTemp = msg._id?.startsWith("temp-");

            return (
              <Box
                key={msg._id}
                display="flex"
                justifyContent={fromMe ? "flex-end" : "flex-start"}
                mb={1}
              >
                <Box
  sx={{
    p: 1.5,
    borderRadius: fromMe
      ? "15px 15px 2px 15px"
      : "15px 15px 15px 2px",
    bgcolor: fromMe ? "#DCF8C6" : "#fff",
    position: "relative",
    maxWidth: "75%",
    transition: "0.2s ease",

    // 👇 Hover effect
    "&:hover .delete-btn": {
      opacity: 1,
      transform: "scale(1)",
    },
  }}
>
  <Typography variant="body2">
    {msg.message || msg.text}
  </Typography>

  {/* DELETE BUTTON - HIDDEN BY DEFAULT */}
  {fromMe && !isTemp && (
    <IconButton
      className="delete-btn"
      size="small"
      onClick={() => handleDeleteMessage(msg._id)}
      sx={{
        position: "absolute",
        top: -8,
        right: -8,
        bgcolor: "#ff4d4d",
        color: "#fff",
        p: 0.5,

        // 👇 Hidden initially
        opacity: 0,
        transform: "scale(0.8)",
        transition: "all 0.2s ease",

        "&:hover": {
          bgcolor: "#cc0000",
        },
      }}
    >
      <DeleteIcon sx={{ fontSize: 12 }} />
    </IconButton>
  )}


                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.5,
                      mt: 0.5,
                      fontSize: "0.65rem",
                      color: "text.secondary",
                    }}
                  >
                    {isTemp ? (
                      "sending..."
                    ) : (
                      <DoneAllIcon
                        sx={{ fontSize: 12, color: "#4caf50" }}
                      />
                    )}
                    {new Date(
                      msg.timestamp || msg.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </DialogContent>

      {/* ================= FOOTER ================= */}
      <DialogActions sx={{ p: 1.5, bgcolor: "#f7f7f7" }}>
        <ChatBubbleOutlineIcon sx={{ color: "#888" }} />

        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // ✅ ENTER FIX
          multiline
          maxRows={3}
          disabled={!socketConnected}
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
          disabled={!message.trim() || !socketConnected}
          sx={{
            bgcolor:
              message.trim() && socketConnected
                ? "#25D366"
                : "#ccc",
            color: "#fff",
            "&:hover": {
              bgcolor: "#1ebd5a",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default EnquiryChatDialog;
