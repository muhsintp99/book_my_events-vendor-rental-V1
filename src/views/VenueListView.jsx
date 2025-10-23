import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import { ArrowBack, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

export default function VenueListView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = "https://api.bookmyevent.ae/api";
  const [venue, setVenue] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  useEffect(() => {
    fetchVenue();
    fetchCategories();
  }, [id]);

  const fetchVenue = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Fetched venue:", result);
      if (result.success) {
        setVenue(result.data);
      } else {
        console.error("Failed to fetch venue:", result.message);
        setToastMessage(result.message || "Failed to load venue");
        setToastSeverity("error");
        setOpenToast(true);
      }
    } catch (error) {
      console.error("Error fetching venue:", error);
      setToastMessage("Error loading venue");
      setToastSeverity("error");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Fetched categories:", result);
      if (result.success) {
        const map = {};
        (result.data || []).forEach((cat) => {
          map[cat._id] = cat.name || cat.title;
        });
        setCategoriesMap(map);
      } else {
        console.error("Failed to fetch categories:", result.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCategoryNames = (categories) => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories
        .map((cat) => {
          const catId = typeof cat === "object" ? cat._id : cat;
          return categoriesMap[catId] || catId || "Unknown Category";
        })
        .join(", ");
    }
    return venue?.category || "-";
  };

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "#fafafa",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!venue) {
    return (
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
        <Typography variant="h6" color="error">
          Venue not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 2 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/venue-setup/lists")}
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#080303ff" }}>
            Venue Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Venue Name
            </Typography>
            <Typography>{venue.venueName || "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Description
            </Typography>
            <Typography>{venue.shortDescription || "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Address
            </Typography>
            <Typography>{venue.venueAddress || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Category
            </Typography>
            <Typography>{getCategoryNames(venue.categories)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Latitude
            </Typography>
            <Typography>{venue.latitude || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Longitude
            </Typography>
            <Typography>{venue.longitude || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Opening Hours
            </Typography>
            <Typography>{venue.openingHours || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Closing Hours
            </Typography>
            <Typography>{venue.closingHours || "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Holiday Scheduling
            </Typography>
            <Typography>{venue.holidaySchedule || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Parking Availability
            </Typography>
            <Typography>{venue.parkingAvailability ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Parking Capacity
            </Typography>
            <Typography>{venue.parkingCapacity || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Food & Catering
            </Typography>
            <Typography>{venue.foodCateringAvailability ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Stage/Lighting/Audio
            </Typography>
            <Typography>{venue.stageLightingAudio ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Wheelchair Accessibility
            </Typography>
            <Typography>{venue.wheelchairAccessibility ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Security Arrangements
            </Typography>
            <Typography>{venue.securityArrangements ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Wi-Fi Availability
            </Typography>
            <Typography>{venue.wifiAvailability ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              AC Available
            </Typography>
            <Typography>{venue.acAvailable ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              AC Type
            </Typography>
            <Typography>{venue.acType ? venue.acType : "Not Specified"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Non-AC Available
            </Typography>
            <Typography>{venue.nonAcAvailable ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Washrooms Info
            </Typography>
            <Typography>{venue.washroomsInfo || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Dressing Rooms
            </Typography>
            <Typography>{venue.dressingRooms || "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Pricing Schedule
            </Typography>
            {venue.pricingSchedule && Object.keys(venue.pricingSchedule).length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Slot</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Per Day</TableCell>
                      <TableCell>Per Hour</TableCell>
                      <TableCell>Per Person</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(venue.pricingSchedule).map(([day, slots]) => (
                      <React.Fragment key={day}>
                        {Object.entries(slots).map(([slotType, slot]) =>
                          slot ? (
                            <TableRow key={`${day}-${slotType}`}>
                              <TableCell>{day.charAt(0).toUpperCase() + day.slice(1)}</TableCell>
                              <TableCell>{slotType.charAt(0).toUpperCase() + slotType.slice(1)}</TableCell>
                              <TableCell>{`${slot.startTime || ""} ${slot.startAmpm || ""} - ${slot.endTime || ""} ${slot.endAmpm || ""}`}</TableCell>
                              <TableCell>{slot.perDay || "-"}</TableCell>
                              <TableCell>{slot.perHour || "-"}</TableCell>
                              <TableCell>{slot.perPerson || "-"}</TableCell>
                            </TableRow>
                          ) : null
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>-</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Discount
            </Typography>
            <Typography>{venue.discount ? `${venue.discount}%` : "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Custom Packages
            </Typography>
            <Typography>{venue.customPackages || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Dynamic Pricing
            </Typography>
            <Typography>{venue.dynamicPricing ? "Enabled" : "Disabled"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Advance Deposit
            </Typography>
            <Typography>{venue.advanceDeposit ? `${venue.advanceDeposit}%` : "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Cancellation Policy
            </Typography>
            <Typography>{venue.cancellationPolicy || "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Extra Charges
            </Typography>
            <Typography>{venue.extraCharges || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Seating Arrangement
            </Typography>
            <Typography>{venue.seatingArrangement || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Max Guests Seated
            </Typography>
            <Typography>{venue.maxGuestsSeated || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Max Guests Standing
            </Typography>
            <Typography>{venue.maxGuestsStanding || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Multiple Halls
            </Typography>
            <Typography>{venue.multipleHalls ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Nearby Transport
            </Typography>
            <Typography>{venue.nearbyTransport || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Elderly Accessibility
            </Typography>
            <Typography>{venue.accessibilityInfo ? "Yes" : "No"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Accessibility Information
            </Typography>
            <Typography>{venue.accessibilityInfo || "-"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Search Tags
            </Typography>
            <Typography>
              {Array.isArray(venue?.searchTags)
                ? venue.searchTags.join(", ")
                : venue?.searchTags || "-"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={openToast}
        autoHideDuration={4000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenToast(false)} severity={toastSeverity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}