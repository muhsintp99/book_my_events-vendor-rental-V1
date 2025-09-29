import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Drivers = () => {
  const initialDrivers = [
    { id: 1, name: "Athena Bertha", phone: "+1 615-209-9835", totalTrips: 0, complete: 0, cancel: 0, status: true },
    { id: 2, name: "Ruth Kerry", phone: "+1 913-159-8408", totalTrips: 1, complete: 1, cancel: 0, status: true },
    { id: 3, name: "TaShya Thor", phone: "+1 893-883-9769", totalTrips: 0, complete: 0, cancel: 0, status: true },
  ];

  const [drivers, setDrivers] = useState(() => {
    // Load drivers from local storage and merge with initial drivers
    const savedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    return [...initialDrivers, ...savedDrivers];
  });

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Sync drivers state with local storage when it changes
  useEffect(() => {
    // Only save non-initial drivers to local storage
    const nonInitialDrivers = drivers.filter(
      (driver) => !initialDrivers.some((initial) => initial.id === driver.id)
    );
    localStorage.setItem("drivers", JSON.stringify(nonInitialDrivers));
  }, [drivers]);

  const handleStatusToggle = (id) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === id ? { ...driver, status: !driver.status } : driver
      )
    );
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(search.toLowerCase())
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
            Drivers
          </Typography>
        </Box>
        <Box
          sx={{
            mb: 3,
            backgroundColor: "#f5f7fa",
            borderRadius: 1,
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "#fff",
                borderColor: "#e0e0e0",
                color: "#757575",
                "&:hover": { backgroundColor: "#f5f7fa" },
              }}
            >
              All
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
              {drivers.length}
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#45a049" },
              }}
            >
              Active
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
              {drivers.filter((driver) => driver.status).length}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "#fff",
                borderColor: "#e0e0e0",
                color: "#757575",
                "&:hover": { backgroundColor: "#f5f7fa" },
              }}
            >
              Inactive
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
              {drivers.filter((driver) => !driver.status).length}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
            <TextField
              placeholder="Search by driver name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 20,
                  backgroundColor: "#fff",
                  "& fieldset": { borderColor: "#e0e0e0" },
                },
                width: 200,
              }}
              InputProps={{
                sx: { padding: "4px 8px" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                minWidth: "auto",
                padding: "6px 12px",
                "&:hover": { backgroundColor: "#1976d2" },
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{
                minWidth: "auto",
                padding: "6px 12px",
                "&:hover": { backgroundColor: "#4786ddff" },
              }}
              onClick={() => navigate("/providers/new")}
            >
              New Driver
            </Button>
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sl</StyledTableCell>
                <StyledTableCell>Driver Info</StyledTableCell>
                <StyledTableCell>Total Trip</StyledTableCell>
                <StyledTableCell>Complete</StyledTableCell>
                <StyledTableCell>Cancel Trip</StyledTableCell>
                <StyledTableCell>Driver Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <StyledTableCell>{driver.id}</StyledTableCell>
                  <StyledTableCell>
                    {driver.name} <br /> {driver.phone}
                  </StyledTableCell>
                  <StyledTableCell>{driver.totalTrips}</StyledTableCell>
                  <StyledTableCell>{driver.complete}</StyledTableCell>
                  <StyledTableCell>{driver.cancel}</StyledTableCell>
                  <StyledTableCell>
                    <Switch
                      checked={driver.status}
                      onChange={() => handleStatusToggle(driver.id)}
                      color="primary"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton onClick={()=>{navigate('/providers/driverview')}} color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Drivers;