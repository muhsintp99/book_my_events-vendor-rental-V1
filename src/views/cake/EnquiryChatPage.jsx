import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import EnquiryChatDialog from "./EnquiryChatDialog";

const EnquiryChatPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [open, setOpen] = useState(true);
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    if (state) {
      setEnquiry(state);
    } else {
      // fallback (direct URL access)
      setEnquiry({
        fullName: "John Doe",
        description: "Need evening makeup service",
        moduleId: { title: "Makeup Artist" },
      });
    }
  }, [state]);

  if (!enquiry) return null;

  return (
    <Box p={3}>
      <Paper
        sx={{
          minHeight: "70vh",
          bgcolor: "#f5f7fa",
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Enquiry Chat
        </Typography>
        <Typography color="text.secondary">
          Chat with customer
        </Typography>
      </Paper>

      <EnquiryChatDialog
        open={open}
        enquiry={enquiry}
        onClose={() => {
          setOpen(false);
          navigate("/makeupartist/Enqury");
        }}
      />
    </Box>
  );
};

export default EnquiryChatPage;
