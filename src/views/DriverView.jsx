import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Switch,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#fff",
  borderRadius: 8,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  maxWidth: "800px",
  margin: "auto",
}));

const DriverView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [driver, setDriver] = useState([{name:"anu",phone: 7518685221,email :"h@gmail.com"}]);
  

  useEffect(() => {
    const driverData = location.state?.driver;
    if (driverData) {
      setDriver(driverData);
    }
  }, [location]);

  const handleEdit = () => {
    navigate("/drivers/edit", { state: { driver } });
  };

  const handleDelete = () => {
    const savedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const updatedDrivers = savedDrivers.filter(d => d.id !== driver.id);
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    navigate("/drivers");
  };

  const handleStatusToggle = () => {
    if (driver) {
      setDriver({ ...driver, status: !driver.status });
    }
  };

  if (!driver) return <Typography>Loading...</Typography>;

  return (
    <StyledBox>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://via.placeholder.com/24"
            alt="Driver Icon"
            style={{ marginRight: 8 }}
          />
          <Typography variant="h5" component="h1">
            Driver Details
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            sx={{ mr: 1 }}
          >
            Delete
          </Button>
          <Switch
            checked={driver.status}
            onChange={handleStatusToggle}
            color="primary"
          />
          <span>Status</span>
          <IconButton color="primary" onClick={handleEdit} sx={{ ml: 1 }}>
            <Edit />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        <img
          src={driver.profileImage || "https://via.placeholder.com/150"}
          alt="Profile Image"
          style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: 4 }}
        />
        <Box>
          <Typography variant="h6">{driver.name}</Typography>
          <Typography>Phone: {driver.phone}</Typography>
          <Typography>Email: {driver.email || "N/A"}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Box>
          <Typography variant="subtitle1">Identity Information</Typography>
          <Typography>Identity Type: {driver.identityType || "N/A"}</Typography>
          <Typography>Identity Number: {driver.identityNumber || "N/A"}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">Provider Info</Typography>
          <Typography>Provider: N/A <span style={{ color: "#f4a261" }}>★ 5.0</span></Typography>
          <Typography>Phone: N/A</Typography>
        </Box>
      </Box>
    </StyledBox>
  );
};

export default DriverView;