import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { styled } from "@mui/system";

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
    borderColor: theme.palette.primary.main,
  },
  "& input[type='file']": {
    display: "none",
  },
}));

const countryCodes = [
  { code: "+1", flag: "🇺🇸", name: "United States", iso: "us" },
  { code: "+596", flag: "🇲🇶", name: "Martinique", iso: "mq" },
  { code: "+222", flag: "🇲🇷", name: "Mauritania", iso: "mr" },
  { code: "+230", flag: "🇲🇺", name: "Mauritius", iso: "mu" },
  { code: "+262", flag: "🇾🇹", name: "Mayotte", iso: "yt" },
  { code: "+52", flag: "🇲🇽", name: "Mexico", iso: "mx" },
  { code: "+91", flag: "🇮🇳", name: "India", iso: "in" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom", iso: "gb" },
  { code: "+33", flag: "🇫🇷", name: "France", iso: "fr" },
  { code: "+49", flag: "🇩🇪", name: "Germany", iso: "de" },
  { code: "+81", flag: "🇯🇵", name: "Japan", iso: "jp" },
  { code: "+86", flag: "🇨🇳", name: "China", iso: "cn" },
];

const phoneLengths = {
  "+1": 10,
  "+596": 9,
  "+222": 8,
  "+230": 7,
  "+262": 9,
  "+52": 10,
  "+91": 10,
  "+44": 10,
  "+33": 9,
  "+49": 10,
  "+81": 10,
  "+86": 11,
};

const AddDriver = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [search, setSearch] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [identityType, setIdentityType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [identityImage, setIdentityImage] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const validateForm = () => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Valid email is required";
    if (!phoneNumber || phoneNumber.length !== phoneLengths[countryCode]) return "Valid phone number is required";
    if (!identityType) return "Identity type is required";
    if (!identityNumber.trim()) return "Identity number is required";
    if (!profileImage) return "Profile image is required";
    if (!identityImage) return "Identity image is required";
    return null;
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 1024 * 1024) {
      setToastMessage("Profile image must be less than 1MB");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }
    setProfileImage(file);
  };

  const handleIdentityImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 1024 * 1024) {
      setToastMessage("Identity image must be less than 1MB");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }
    setIdentityImage(file);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleDropProfileImage = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.size > 1024 * 1024) {
      setToastMessage("Profile image must be less than 1MB");
      setToastSeverity("error");
      setOpenToast(true);
    } else {
      setProfileImage(file);
    }
  };

  const handleDropIdentityImage = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.size > 1024 * 1024) {
      setToastMessage("Identity image must be less than 1MB");
      setToastSeverity("error");
      setOpenToast(true);
    } else {
      setIdentityImage(file);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    const maxLen = phoneLengths[countryCode] || 10;
    if (value.length > maxLen) value = value.slice(0, maxLen);
    setPhoneNumber(value);
    if (value.length !== maxLen) {
      setPhoneError(`Phone number must be ${maxLen} digits for ${countryCode}`);
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const error = validateForm();
    if (error) {
      setToastMessage(error);
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }

    const newDriver = {
      id: Date.now(), // Unique ID based on timestamp
      name: `${firstName} ${lastName}`,
      phone: `${countryCode} ${phoneNumber}`,
      totalTrips: 0,
      complete: 0,
      cancel: 0,
      status: true,
      email,
      identityType,
      identityNumber,
      profileImage: profileImage ? URL.createObjectURL(profileImage) : null,
      identityImage: identityImage ? URL.createObjectURL(identityImage) : null,
    };

    // Load existing drivers from local storage
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    // Add new driver
    const updatedDrivers = [...existingDrivers, newDriver];
    // Save to local storage
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));

    console.log(newDriver);

    setToastMessage("Form submitted successfully!");
    setToastSeverity("success");
    setOpenToast(true);

    // Reset form
    handleReset();
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setCountryCode("+1");
    setPhoneNumber("");
    setSearch("");
    setProfileImage(null);
    setPhoneError("");
    setIdentityType("");
    setIdentityNumber("");
    setIdentityImage(null);
    setToastMessage("");
    setOpenToast(false);
  };

  const filteredCountries = countryCodes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "white", minHeight: "100vh", width: "100%" }}>
      <Box sx={{ maxWidth: "lg", margin: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <img
            src="https://via.placeholder.com/24"
            alt="Driver Icon"
            style={{ marginRight: 8 }}
          />
          <Typography variant="h5" component="h1">
            Add New Driver
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Insert the basic information of the driver
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 4,
            }}
          >
            <Card
              sx={{
                flex: 2,
                p: 2,
                boxShadow: "none",
                border: `1px solid #e0e0e0`,
              }}
            >
              <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  User Info
                </Typography>
                <TextField
                  fullWidth
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Type your first name"
                  error={firstName !== "" && !firstName.trim()}
                  helperText={firstName !== "" && !firstName.trim() ? "First name is required" : ""}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Type your last name"
                  error={lastName !== "" && !lastName.trim()}
                  helperText={lastName !== "" && !lastName.trim() ? "Last name is required" : ""}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Type your email address"
                  error={email !== "" && (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))}
                  helperText={email !== "" && (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) ? "Valid email is required" : ""}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  error={phoneNumber !== "" && (phoneError || !phoneNumber)}
                  helperText={phoneNumber !== "" && (phoneError || (!phoneNumber ? "Phone number is required" : ""))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FormControl variant="standard">
                          <Select
                            value={countryCode}
                            onChange={(e) => {
                              setCountryCode(e.target.value);
                              setPhoneNumber("");
                              setPhoneError("");
                            }}
                            renderValue={(value) => {
                              const country = countryCodes.find(
                                (c) => c.code === value
                              );
                              return (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <img
                                    src={`https://flagcdn.com/w20/${country?.iso}.png`}
                                    alt={country?.name}
                                    style={{
                                      width: 20,
                                      height: 14,
                                      borderRadius: 2,
                                    }}
                                  />
                                  {country?.code}
                                </span>
                              );
                            }}
                            MenuProps={{
                              PaperProps: { style: { maxHeight: 300, width: 280 } },
                            }}
                          >
                            <MenuItem disableRipple disableTouchRipple>
                              <TextField
                                placeholder="Search..."
                                size="small"
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </MenuItem>
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <MenuItem key={country.code} value={country.code}>
                                  <img
                                    src={`https://flagcdn.com/w20/${country.iso}.png`}
                                    alt={country.name}
                                    style={{
                                      width: 20,
                                      height: 14,
                                      borderRadius: 2,
                                      marginRight: 8,
                                    }}
                                  />
                                  {country.name} ({country.code})
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>No results</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </CardContent>
            </Card>
            <Card
              sx={{
                flex: 1,
                p: 2,
                boxShadow: "none",
                border: `1px solid #e0e0e0`,
              }}
            >
              <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Profile Image
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  JPG, JPEG, PNG Less Than 1MB (Ratio 1:1)
                </Typography>
                <UploadDropArea
                  onDragOver={handleDragOver}
                  onDrop={handleDropProfileImage}
                  onClick={() =>
                    document.getElementById("profile-upload").click()
                  }
                >
                  {profileImage ? (
                    <Box>
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 100,
                          objectFit: "contain",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {profileImage.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon
                        sx={{ fontSize: 40, color: "#757575", mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ mb: 0.5, fontWeight: "medium" }}
                      >
                        Click to upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Or drag and drop
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="profile-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleProfileImageChange}
                  />
                </UploadDropArea>
              </CardContent>
            </Card>
          </Box>
          <Card
            sx={{
              p: 2,
              mb: 4,
              boxShadow: "none",
              border: `1px solid #e0e0e0`,
            }}
          >
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Typography variant="h6" gutterBottom>
                Identity Info
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <FormControl fullWidth>
                  <Select
                    value={identityType}
                    displayEmpty
                    onChange={(e) => setIdentityType(e.target.value)}
                    error={identityType !== "" && !identityType}
                  >
                    <MenuItem value="">
                      <em>Select identity type</em>
                    </MenuItem>
                    <MenuItem value="passport">Passport</MenuItem>
                    <MenuItem value="nid">Nid</MenuItem>
                    <MenuItem value="driving">Driving License</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  placeholder="Ex: 123654789512364"
                  value={identityNumber}
                  onChange={(e) => setIdentityNumber(e.target.value)}
                  error={identityNumber !== "" && !identityNumber.trim()}
                  helperText={identityNumber !== "" && !identityNumber.trim() ? "Identity number is required" : ""}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)
              </Typography>
              <UploadDropArea
                onDragOver={handleDragOver}
                onDrop={handleDropIdentityImage}
                onClick={() => document.getElementById("identity-upload").click()}
              >
                {identityImage ? (
                  <Box>
                    <img
                      src={URL.createObjectURL(identityImage)}
                      alt="Identity preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 100,
                        objectFit: "contain",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {identityImage.name}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon
                      sx={{ fontSize: 40, color: "#757575", mb: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ mb: 0.5, fontWeight: "medium" }}
                    >
                      Click to upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Or drag and drop
                    </Typography>
                  </Box>
                )}
                <input
                  type="file"
                  id="identity-upload"
                  hidden
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleIdentityImageChange}
                />
              </UploadDropArea>
            </CardContent>
          </Card>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={handleReset} size="large">
              Reset
            </Button>
            <Button variant="contained" type="submit" size="large">
              Submit
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={openToast}
          autoHideDuration={6000}
          onClose={() => setOpenToast(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenToast(false)}
            severity={toastSeverity}
            sx={{ width: "100%" }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddDriver;