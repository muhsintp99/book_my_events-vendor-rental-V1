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
      <Box
        p={4}
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f9fb 0%, #eef5f8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert
          severity="warning"
          sx={{
            bgcolor: "rgba(255, 193, 7, 0.1)",
            color: "#f57f17",
            border: "1px solid rgba(255, 193, 7, 0.3)",
          }}
        >
          No enquiry selected. Redirecting...
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f9fb 0%, #eef5f8 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 900,
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#fff",
          border: "1px solid rgba(26, 188, 156, 0.15)",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(26, 188, 156, 0.1)",
          position: "relative",
          zIndex: 1,
          animation: "slideIn 0.6s ease-out",
          "@keyframes slideIn": {
            from: {
              opacity: 0,
              transform: "translateY(20px)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            background: "linear-gradient(135deg, #16a085 0%, #1abc9c 100%)",
            color: "#fff",
            position: "relative",
            borderBottom: "1px solid rgba(26, 188, 156, 0.3)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => navigate("/venue/enquiries")}
              sx={{
                color: "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateX(-4px)",
                },
              }}
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>

            <Avatar
              sx={{
                bgcolor: "#4ecdc4",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#fff",
                width: 44,
                height: 44,
              }}
            >
              {enquiry.fullName?.charAt(0) || "C"}
            </Avatar>

            <Box flex={1}>
              <Typography
                fontWeight={700}
                sx={{
                  fontSize: "1.1rem",
                  letterSpacing: "0.3px",
                }}
              >
                {enquiry.fullName || "Customer"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.85,
                  fontWeight: 500,
                  letterSpacing: "0.2px",
                }}
              >
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
            background: "linear-gradient(180deg, #f8fbfc 0%, #f5f9fb 100%)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: "relative",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(26, 188, 156, 0.25)",
              borderRadius: "4px",
              "&:hover": {
                background: "rgba(26, 188, 156, 0.4)",
              },
            },
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
              <CircularProgress
                sx={{
                  color: "#1abc9c",
                }}
              />
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
              <Stack alignItems="center" spacing={2}>
                <ChatBubbleOutlineIcon
                  sx={{
                    fontSize: "4rem",
                    color: "rgba(26, 188, 156, 0.25)",
                  }}
                />
                <Typography
                  sx={{
                    color: "rgba(0, 0, 0, 0.45)",
                    fontSize: "1rem",
                    letterSpacing: "0.3px",
                    fontWeight: 500,
                  }}
                >
                  No messages yet. Start the conversation!
                </Typography>
              </Stack>
            </Box>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderId === vendorId;

              return (
                <Box
                  key={i}
                  display="flex"
                  justifyContent={isMe ? "flex-end" : "flex-start"}
                  sx={{
                    animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
                    "@keyframes fadeIn": {
                      from: {
                        opacity: 0,
                        transform: isMe
                          ? "translateX(10px)"
                          : "translateX(-10px)",
                      },
                      to: {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      maxWidth: "65%",
                      borderRadius: isMe ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      background: isMe
                        ? "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)"
                        : "#e8f5f3",
                      border: isMe
                        ? "1px solid rgba(26, 188, 156, 0.3)"
                        : "1px solid rgba(26, 188, 156, 0.2)",
                      boxShadow: isMe
                        ? "0 4px 12px rgba(26, 188, 156, 0.2)"
                        : "0 2px 8px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: isMe
                          ? "0 8px 20px rgba(26, 188, 156, 0.3)"
                          : "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-word",
                        color: isMe ? "#fff" : "#1a1a1a",
                        fontWeight: 500,
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                      }}
                    >
                      {msg.text}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        opacity: isMe ? 0.85 : 0.65,
                        mt: 0.8,
                        fontSize: "0.75rem",
                        color: isMe ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.6)",
                        fontWeight: 500,
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
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
        </Box>

        {/* INPUT */}
        <Box
          sx={{
            p: 2.5,
            background: "#fff",
            borderTop: "1px solid rgba(26, 188, 156, 0.15)",
            display: "flex",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <ChatBubbleOutlineIcon
            sx={{
              color: "rgba(26, 188, 156, 0.6)",
              transition: "color 0.3s ease",
              fontSize: "1.3rem",
            }}
          />

          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#1a1a1a",
                borderRadius: "24px",
                background: "#f8fbfc",
                border: "1.5px solid rgba(26, 188, 156, 0.3)",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "rgba(26, 188, 156, 0.3)",
                },
                "&:hover": {
                  background: "#f0f9f8",
                  borderColor: "rgba(26, 188, 156, 0.4)",
                },
                "&.Mui-focused": {
                  background: "#ecf8f7",
                  borderColor: "rgba(26, 188, 156, 0.7)",
                  boxShadow: "0 0 12px rgba(26, 188, 156, 0.15)",
                  "& fieldset": {
                    borderColor: "rgba(26, 188, 156, 0.7)",
                  },
                },
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "0.95rem",
                fontWeight: 500,
                "&::placeholder": {
                  color: "rgba(0, 0, 0, 0.4)",
                  opacity: 1,
                },
              },
            }}
          />

          <IconButton
            onClick={handleSend}
            disabled={!message.trim()}
            sx={{
              background: message.trim()
                ? "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)"
                : "rgba(26, 188, 156, 0.15)",
              color: message.trim() ? "#fff" : "rgba(26, 188, 156, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "12px",
              padding: "12px",
              "&:hover": message.trim()
                ? {
                    background:
                      "linear-gradient(135deg, #1c9d8f 0%, #179079 100%)",
                    boxShadow: "0 6px 16px rgba(26, 188, 156, 0.3)",
                    transform: "scale(1.05)",
                  }
                : {},
              "&:disabled": {
                cursor: "not-allowed",
              },
            }}
          >
            <SendIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default EnquiryChatPage;