import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled drop area
const UploadDropArea = styled(Box)(({ theme }) => ({
  border: "2px dashed #e0e0e0",
  borderRadius: 8,
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  cursor: "pointer",
  backgroundColor: "#fafafa",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const Banner = () => {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setToastMessage("Only JPG, JPEG, PNG files allowed");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToastMessage("File size must be less than 2MB");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setToastMessage("Title is required");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }
    if (!image) {
      setToastMessage("Banner image is required");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }
    console.log({
      language: tab === 0 ? "Default" : tab === 1 ? "English" : "Arabic",
      title,
      link,
      image,
    });
    setToastMessage("Banner submitted successfully!");
    setToastSeverity("success");
    setToastOpen(true);
    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setLink("");
    setImage(null);
    setPreview(null);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#fff", minHeight: "100vh", width: "100%" }}>
      <Box sx={{ maxWidth: "lg", margin: "auto" }}>
        {/* Header */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Add New Banner
        </Typography>
        <Card sx={{ p: 2, boxShadow: "none", border: "1px solid #e0e0e0" }}>
          <CardContent>
            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={handleTabChange}
              sx={{ mb: 2 }}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Default" />
              <Tab label="English (EN)" />
              <Tab label="Arabic - العربية (AR)" />
            </Tabs>
            {/* Title */}
            <TextField
              fullWidth
              label={`Title (${tab === 0 ? "Default" : tab === 1 ? "EN" : "AR"})`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New banner"
              sx={{ mb: 2 }}
            />
            {/* Link */}
            <TextField
              fullWidth
              label="Default Link (Optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Default link"
              sx={{ mb: 3 }}
            />
            {/* Banner Image */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Banner Image
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              JPG, JPEG, PNG Less Than 2MB <b>(Ratio 3:1)</b>
            </Typography>
            <UploadDropArea
              onClick={() => document.getElementById("banner-upload").click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxHeight: 160, borderRadius: 8 }}
                />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Click to upload
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Or drag and drop
                  </Typography>
                </>
              )}
              <input
                id="banner-upload"
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </UploadDropArea>
          </CardContent>
        </Card>
        {/* Buttons */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={handleReset} size="large">
            Reset
          </Button>
          <Button variant="contained" type="submit" size="large" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>

        {/* Banner List Section */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Banner List <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: 12 }}>0</span></Typography>
            <Box>
              <TextField
                variant="outlined"
                placeholder="Search by banner title..."
                size="small"
                sx={{ mr: 2 }}
              />
              <Button variant="contained" size="small" sx={{ backgroundColor: "#3287d7ff", color: "#fff" }}>
                Export
              </Button>
            </Box>
          </Box>
          <Card sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>SL</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Banner Info</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Banner Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Featured</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Box
                          component="img"
                          src="https://via.placeholder.com/150?text=No+Data+Found"
                          alt="No Data Found"
                          sx={{ width: 150, height: 150 }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          No Data Found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Banner;