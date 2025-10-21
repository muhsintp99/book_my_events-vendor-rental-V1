import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Chip,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";

const zones = ["Main Demo Zone", "Dhaka"];

// --- Tab Panel helper ---
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Styled upload area
const UploadDropArea = styled(Box)(({ theme }) => ({
  border: "2px dashed #e0e0e0",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  backgroundColor: theme.palette.grey[50],
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "150px",
  "&:hover": {
    borderColor: '#E15B65',
  },
  "& input[type='file']": {
    display: "none",
  },
}));

const ProviderConfig = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);
  const [scheduledOrder, setScheduledOrder] = useState(true);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstValue, setGstValue] = useState("");
  const [pickupTime, setPickupTime] = useState({
    first: "20",
    second: "50",
    unit: "Minutes",
  });
  const [pickupZones, setPickupZones] = useState(["Main Demo Zone", ]);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalDay, setModalDay] = useState("");
  const [modalStartTime, setModalStartTime] = useState("12:11 pm");
  const [modalEndTime, setModalEndTime] = useState("--:-- --");

  // Delete confirmation modal states
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  // general info states
  const [tabValue, setTabValue] = useState(0);
  const [metaNameDefault, setMetaNameDefault] = useState("");
  const [metaDescriptionDefault, setMetaDescriptionDefault] = useState("");
  const [metaNameEnglish, setMetaNameEnglish] = useState("");
  const [metaDescriptionEnglish, setMetaDescriptionEnglish] = useState("");
  const [metaNameArabic, setMetaNameArabic] = useState("");
  const [metaDescriptionArabic, setMetaDescriptionArabic] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [activeTimes, setActiveTimes] = useState([
    { day: "Monday", opening: "12:00 AM", closing: "11:59 PM" },
    { day: "Tuesday", opening: "12:00 AM", closing: "11:59 PM" },
    { day: "Wednesday", opening: "12:00 AM", closing: "11:59 PM" },
    { day: "Thursday", opening: "12:00 AM", closing: "11:59 PM" },
    { day: "Friday", opening: "12:00 AM", closing: "11:59 PM" },
    { day: "Saturday", opening: "12:00 AM", closing: "11:59 PM" },
    { day: "Sunday", opening: "12:00 AM", closing: "11.59 PM"}
  ]);

  const handleZoneChange = (event) => {
    const {
      target: { value },
    } = event;
    setPickupZones(typeof value === "string" ? value.split(",") : value);
  };

  const handleReset = () => {
    setIsTemporarilyClosed(false);
    setScheduledOrder(true);
    setGstEnabled(false);
    setGstValue("");
    setPickupTime({ first: "20", second: "50", unit: "Minutes" });
    setPickupZones(["Main Demo Zone"]);
    setMetaNameDefault("");
    setMetaDescriptionDefault("");
    setMetaNameEnglish("");
    setMetaDescriptionEnglish("");
    setMetaNameArabic("");
    setMetaDescriptionArabic("");
    setThumbnailFile(null);
  };

  const handleSubmit = (e, buttonType) => {
    e.preventDefault();
    console.log({
      isTemporarilyClosed,
      scheduledOrder,
      gstEnabled,
      gstValue,
      pickupTime,
      pickupZones,
      metaNameDefault,
      metaDescriptionDefault,
      metaNameEnglish,
      metaDescriptionEnglish,
      metaNameArabic,
      metaDescriptionArabic,
      thumbnailFile,
      activeTimes,
    });
    setToastMessage(buttonType === "update" ? "Updated successfully!" : "Save changes successfully!");
    setOpenToast(true);
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenToast(false);
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleThumbnailFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setThumbnailFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropThumbnail = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setThumbnailFile(file);
  };

  const addTimeSlot = (index) => {
    const day = activeTimes[index].day;
    setModalDay(day);
    setModalStartTime("12:11 pm");
    setModalEndTime("--:-- --");
    setOpenModal(true);
  };

  const removeTimeSlot = (index) => {
    if (activeTimes.length > 1) {
      setDeleteIndex(index);
      setOpenDeleteModal(true);
    }
  };

  const handleTimeChange = (index, field, value) => {
    const newActiveTimes = [...activeTimes];
    newActiveTimes[index][field] = value;
    setActiveTimes(newActiveTimes);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setModalDay("");
    setModalStartTime("12:11 pm");
    setModalEndTime("--:-- --");
  };

  const handleModalReset = () => {
    setModalStartTime("12:11 pm");
    setModalEndTime("--:-- --");
  };

  const handleModalSubmit = () => {
    const dayIndex = activeTimes.findIndex(time => time.day === modalDay);
    if (dayIndex !== -1) {
      const newActiveTimes = [...activeTimes];
      newActiveTimes.splice(dayIndex + 1, 0, { 
        day: modalDay, 
        opening: modalStartTime, 
        closing: modalEndTime 
      });
      setActiveTimes(newActiveTimes);
    }
    handleModalClose();
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setDeleteIndex(-1);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== -1 && activeTimes.length > 1) {
      const newActiveTimes = activeTimes.filter((_, i) => i !== deleteIndex);
      setActiveTimes(newActiveTimes);
    }
    handleDeleteModalClose();
  };

  return (
    <Box p={3}>
      {/* Provider Setup */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                To view a list of all active zones on your{" "}
                <a href="#admin">Admin Landing</a> Page, Enable the 'Available Zones' Feature
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
              <TextField
                placeholder="Provider Temporarily Closed Title"
                size="small"
                sx={{ mr: 2, flex: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Switch
                        checked={isTemporarilyClosed}
                        onChange={(e) => setIsTemporarilyClosed(e.target.checked)}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Basic Settings */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Basic Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Vendor Settings
          </Typography>
          <Grid container spacing={3}>
            {/* Scheduled Trip */}
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom display="flex" alignItems="center">
                Scheduled Trip
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: "#E15B65" }} />
              </Typography>
              <Box display="flex" alignItems="center" sx={{ border: "1px solid #ddd", borderRadius: 1, px: 2, height: 45 }}>
                <Typography sx={{ flex: 1 }}>Scheduled Order</Typography>
                <Switch  checked={scheduledOrder} onChange={(e) => setScheduledOrder(e.target.checked)} />
              </Box>
            </Grid>

            {/* GST */}
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom display="flex" alignItems="center">
                GST
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: "#E15B65" }} />
              </Typography>
              <Box display="flex" alignItems="center" sx={{ border: "1px solid #ddd", borderRadius: 1, px: 1, height: 45 }}>
                <TextField
                  placeholder="Enter GST %"
                  size="small"
                  value={gstValue}
                  onChange={(e) => setGstValue(e.target.value)}
                  disabled={!gstEnabled}
                  sx={{ flex: 1, mr: 2 }}
                />
                <Switch checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} />
              </Box>
            </Grid>

            {/* Pickup Time */}
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Approx. Pickup Time</Typography>
              <Box display="flex">
                <TextField
                  size="small"
                  value={pickupTime.first}
                  onChange={(e) => setPickupTime({ ...pickupTime, first: e.target.value })}
                  sx={{ width: "33%", mr: 1 }}
                />
                <TextField
                  size="small"
                  value={pickupTime.second}
                  onChange={(e) => setPickupTime({ ...pickupTime, second: e.target.value })}
                  sx={{ width: "33%", mr: 1 }}
                />
                <FormControl size="small" sx={{ width: "34%" }}>
                  <Select value={pickupTime.unit} onChange={(e) => setPickupTime({ ...pickupTime, unit: e.target.value })}>
                    <MenuItem value="Minutes">Minutes</MenuItem>
                    <MenuItem value="Hours">Hours</MenuItem>
                    <MenuItem value="Days">Days</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Pickup Zone */}
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom display="flex" alignItems="center">
                Pickup zone
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: "text.secondary" }} />
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={pickupZones}
                  onChange={handleZoneChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone} value={zone}>
                      {zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Action buttons */}
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" color="#E15B65" sx={{ width: 120, height: 40, fontWeight: 500, color:"#E15B65" }} onClick={handleReset}>
              Reset
            </Button>
            <Button
              variant="contained"
              sx={{
                width: 120,
                height: 40,
                backgroundColor: "#E15B65",
                "&:hover": { backgroundColor: "#f28b92ff" },
                fontWeight: 500,
              }}
              onClick={(e) => handleSubmit(e, "update")}
            >
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* General Information + Thumbnail (replaces Provider Meta Data) */}
      <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: 3, mb: 4 }}>
        {/* General Info */}
        <Card sx={{ flex: isSmallScreen ? "auto" : 2, p: 2, boxShadow: "none", border: `1px solid ${theme.palette.grey[200]}` }}>
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <Typography variant="h6" gutterBottom>
              Provider Meta Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Provider Meta Data & Image
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Default" {...a11yProps(0)} />
                <Tab label="English (EN)" {...a11yProps(1)} />
                <Tab label="العربية (AR)" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* Default */}
            <TabPanel value={tabValue} index={0}>
              <TextField
                fullWidth
                label="Meta Title (Default)"
                variant="outlined"
                value={metaNameDefault}
                onChange={(e) => setMetaNameDefault(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Meta description (Default)"
                variant="outlined"
                multiline
                rows={4}
                value={metaDescriptionDefault}
                onChange={(e) => setMetaDescriptionDefault(e.target.value)}
              />
            </TabPanel>

            {/* English */}
            <TabPanel value={tabValue} index={1}>
              <TextField
                fullWidth
                label="Meta Title (English)"
                variant="outlined"
                value={metaNameEnglish}
                onChange={(e) => setMetaNameEnglish(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Meta description (English)"
                variant="outlined"
                multiline
                rows={4}
                value={metaDescriptionEnglish}
                onChange={(e) => setMetaDescriptionEnglish(e.target.value)}
              />
            </TabPanel>

            {/* Arabic */}
            <TabPanel value={tabValue} index={2}>
              <TextField
                fullWidth
                label="Meta Title (Arabic)"
                variant="outlined"
                value={metaNameArabic}
                onChange={(e) => setMetaNameArabic(e.target.value)}
                sx={{ mb: 2 }}
                dir="rtl"
                inputProps={{ style: { textAlign: "right" } }}
              />
              <TextField
                fullWidth
                label="Meta description (Arabic)"
                variant="outlined"
                multiline
                rows={4}
                value={metaDescriptionArabic}
                onChange={(e) => setMetaDescriptionArabic(e.target.value)}
                dir="rtl"
                inputProps={{ style: { textAlign: "right" } }}
              />
            </TabPanel>
          </CardContent>
        </Card>

        {/* Thumbnail */}
        <Card sx={{ flex: isSmallScreen ? "auto" : 1, p: 2, boxShadow: "none", border: `1px solid ${theme.palette.grey[200]}` }}>
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <Typography variant="h6" gutterBottom>
              Meta Image
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
            </Typography>
            <UploadDropArea
              onDragOver={handleDragOver}
              onDrop={handleDropThumbnail}
              onClick={() => document.getElementById("thumbnail-upload").click()}
            >
              {thumbnailFile ? (
                <Box>
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Thumbnail preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 100,
                      objectFit: "contain",
                      marginBottom: theme.spacing(1),
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {thumbnailFile.name}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[400], mb: 1 }} />
                  <Typography variant="body2" color="#E15B65" sx={{ mb: 0.5, fontWeight: "medium" }}>
                    Click to upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Or drag and drop
                  </Typography>
                </Box>
              )}
              <input
                type="file"
                id="thumbnail-upload"
                hidden
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleThumbnailFileChange}
              />
            </UploadDropArea>
            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                sx={{
                  width: 120,
                  height: 40,
                  backgroundColor: "#E15B65",
                  "&:hover": { backgroundColor: "#e23b46ff" },
                  fontWeight: 500,
                }}
                onClick={(e) => handleSubmit(e, "save")}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Provider Active Time */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Provider Active Time
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Set the time when Provider is active to show in app and website
          </Typography>
          <Grid container spacing={3}>
            {activeTimes.map((timeSlot, index) => (
              <Grid item xs={12} key={index}>
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Typography sx={{ minWidth: 100, fontWeight: 500 }}>
                    {timeSlot.day} :
                  </Typography>
                  
                  {/* Opening Time Box */}
                  <Box 
                    sx={{ 
                      border: '2px solid #e0e0e0',
                      borderRadius: 2,
                      p: 2,
                      minWidth: 150,
                      textAlign: 'center',
                      backgroundColor: '#fafafa'
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} sx={{ mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: '#666',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Opening Time
                      </Typography>
                    </Box>
                    <TextField
                      size="small"
                      value={timeSlot.opening}
                      onChange={(e) => handleTimeChange(index, "opening", e.target.value)}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>

                  {/* Closing Time Box */}
                  <Box 
                    sx={{ 
                      border: '2px solid #e0e0e0',
                      borderRadius: 2,
                      p: 2,
                      minWidth: 150,
                      textAlign: 'center',
                      backgroundColor: '#fafafa'
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} sx={{ mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: '#666',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Closing Time
                      </Typography>
                    </Box>
                    <TextField
                      size="small"
                      value={timeSlot.closing}
                      onChange={(e) => handleTimeChange(index, "closing", e.target.value)}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={1}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      sx={{ 
                        minWidth: 40, 
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        fontSize: '18px'
                      }} 
                      onClick={() => removeTimeSlot(index)}
                      disabled={activeTimes.length === 1}
                    >
                      ×
                    </Button>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        minWidth: 40,
                        width: 40, 
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#20B2AA',
                        '&:hover': { backgroundColor: '#1a9d96' },
                        fontSize: '18px'
                      }} 
                      onClick={() => addTimeSlot(index)}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Schedule Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleModalClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
            maxWidth: 500,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create Schedule For {modalDay}
          </Typography>
          <IconButton 
            onClick={handleModalClose}
            sx={{ 
              color: 'grey.500',
              '&:hover': { backgroundColor: 'grey.100' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Start time:
          </Typography>
          <TextField
            fullWidth
            value={modalStartTime}
            onChange={(e) => setModalStartTime(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8f9fa',
              }
            }}
          />
          
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            End time:
          </Typography>
          <TextField
            fullWidth
            value={modalEndTime}
            onChange={(e) => setModalEndTime(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8f9fa',
              }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleModalReset}
            sx={{ 
              minWidth: 80,
              height: 36,
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            onClick={handleModalSubmit}
            sx={{ 
              minWidth: 80,
              height: 36,
              backgroundColor: '#20B2AA',
              '&:hover': { backgroundColor: '#1a9d96' },
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={openDeleteModal} 
        onClose={handleDeleteModalClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
            maxWidth: 500,
            textAlign: 'center',
            p: 3
          }
        }}
      >
        <DialogContent sx={{ pt: 3, pb: 3 }}>
          {/* Warning Icon */}
          <Box 
            sx={{ 
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#FFF3CD',
              border: '3px solid #FFE69C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto'
            }}
          >
            <Typography 
              sx={{ 
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#856404'
              }}
            >
              !
            </Typography>
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: '#495057',
              mb: 2
            }}
          >
            Want to delete this schedule
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6C757D',
              mb: 4
            }}
          >
            If you select Yes the time schedule will be deleted.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button 
            variant="contained"
            onClick={handleDeleteModalClose}
            sx={{ 
              minWidth: 100,
              height: 44,
              backgroundColor: '#8E9CAF',
              '&:hover': { backgroundColor: '#7A8699' },
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              fontSize: '16px'
            }}
          >
            No
          </Button>
          <Button 
            variant="contained" 
            onClick={handleDeleteConfirm}
            sx={{ 
              minWidth: 100,
              height: 44,
              backgroundColor: '#20B2AA',
              '&:hover': { backgroundColor: '#1a9d96' },
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              fontSize: '16px'
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleToastClose} severity="info" sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProviderConfig;