import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Avatar,
  CircularProgress,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const DeleteProfile = ({ onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

  const handleDelete = async () => {
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("https://api.bookmyevent.ae/api/delete-user", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ email, password }), 
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile deleted successfully!");
        localStorage.clear();
        window.location.href = "/"; 
      } else {
        alert(data?.message || "Failed to delete profile.");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9ff",
      }}
    >
      <Card
        sx={{
          height: 500, 
          width: 400,
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          p: 3,
          backgroundColor: "#fff",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#E15B65",
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
          }}
        >
          <PersonIcon sx={{ fontSize: 40, color: "#fff" }} />
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#2f2f46",
            mb: 1,
            paddingBottom: 3,
          }}
        >
          Delete profile?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: 16,
            color: "#6b6b8a",
            mb: 3,
            px: 3,
            lineHeight: 1.5,
            paddingBottom: 2,
          }}
        >
          Are you sure you want to delete your profile? This action cannot be
          undone.
        </Typography>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!localStorage.getItem("userEmail")} 
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <Box>
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              mb: 1.5,
              height: 45,
              bgcolor: "#E15B65",
              color: "#fff",
            }}
            onClick={handleDelete}
            disabled={loading || !email || !password}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Delete"}
          </Button>
          <Typography
            variant="body2"
            sx={{
              color: "#2f2f46",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={onCancel}
          >
            Cancel
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default DeleteProfile;