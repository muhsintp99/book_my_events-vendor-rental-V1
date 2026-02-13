import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Dialog } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import EnquiryChatDialog from "./EnquiryChatDialog";

const EnquiryChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    // Get enquiry from navigation state
    const enquiryData = location.state?.enquiry || location.state;

    if (enquiryData && enquiryData._id) {
      setEnquiry(enquiryData);
      setOpen(true);
    } else {
      // If no enquiry data, redirect back
      console.warn("No enquiry data found, redirecting...");
      navigate("/makeup/enquiries");
    }
  }, [location.state, navigate]);

  const handleCloseDialog = () => {
    setOpen(false);
    navigate("/venue/enquiries");
  };

  if (!enquiry) {
    return (
      <Box p={3}>
        <Paper
          sx={{
            minHeight: "70vh",
            bgcolor: "#f5f7fa",
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No Enquiry Selected
          </Typography>
          <Typography color="text.secondary">
            Please select an enquiry to start chatting
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <EnquiryChatDialog
        open={open}
        enquiry={enquiry}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default EnquiryChatPage;