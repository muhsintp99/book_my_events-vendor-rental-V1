import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Stack
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import EnquiryChatDialog from "./EnquiryChatDialog";

const EnquiryChatPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [open, setOpen] = useState(true);
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    const enquiryData = state?.enquiry || state;

    if (enquiryData && enquiryData._id) {
      setEnquiry(enquiryData);
      setOpen(true);
    } else {
      navigate("/venue/enquiries");
    }
  }, [state, navigate]);

  if (!enquiry) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#075E54",
            color: "#fff",
            px: 2,
            py: 1.5
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

            <Box>
              <Typography fontWeight={600}>
                {enquiry.fullName || "Customer"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Venue Enquiry
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Chat Dialog Component */}
        <EnquiryChatDialog
          open={open}
          enquiry={enquiry}
          onClose={() => {
            setOpen(false);
            navigate("/venue/enquiries");
          }}
        />
      </Paper>
    </Box>
  );
};

export default EnquiryChatPage;
