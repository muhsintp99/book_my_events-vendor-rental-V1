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
  Snackbar,
  Alert,
  InputAdornment,
  Switch,
} from "@mui/material";
import { styled } from "@mui/system";

const AddCoupon = () => {
  const [title, setTitle] = useState("");
  const [couponType, setCouponType] = useState("Default");
  const [code, setCode] = useState("9uHNozDS");
  const [limitForUser, setLimitForUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [minTripAmount, setMinTripAmount] = useState("0");
  const [discountType, setDiscountType] = useState("Amount ($)");
  const [discount, setDiscount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("0");
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    if (startDate && startDate < today) {
      setToastMessage("Start date cannot be in the past");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }
    if (expireDate && expireDate < today) {
      setToastMessage("Expire date cannot be in the past");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }
    if (expireDate && startDate && expireDate < startDate) {
      setToastMessage("Expire date cannot be before start date");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }
    if (!title.trim()) {
      setToastMessage("Title is required");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }
    const newCoupon = {
      sl: coupons.length + 1,
      title,
      code,
      couponType,
      totalUses: 0,
      minTripAmount,
      maxDiscount,
      discount,
      discountType,
      startDate,
      expireDate,
      status: "Active",
      action: "Edit",
    };
    setCoupons([...coupons, newCoupon]);
    console.log({
      title,
      couponType,
      code,
      limitForUser,
      startDate,
      expireDate,
      minTripAmount,
      discountType,
      discount,
      maxDiscount,
    });
    setToastMessage("Coupon submitted successfully!");
    setToastSeverity("success");
    setOpenToast(true);
    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setCouponType("Default");
    setCode("9uHNozDS");
    setLimitForUser("");
    setStartDate("");
    setExpireDate("");
    setMinTripAmount("0");
    setDiscountType("Amount ($)");
    setDiscount("");
    setMaxDiscount("0");
  };

  const handleToggle = (sl) => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.sl === sl ? { ...coupon, status: coupon.status === "Active" ? "Inactive" : "Active" } : coupon
      )
    );
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "white", minHeight: "100vh", width: "100%" }}>
      <Box sx={{ maxWidth: "lg", margin: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h1">
            Add New Coupon
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Card sx={{ p: 2, boxShadow: "none", border: `1px solid #e0e0e0` }}>
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Default
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  English(EN)
                </Typography>
                <Typography variant="body2" sx={{ ml: 2, mr: 1 }}>
                  Arabic
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  -عربي-(AR)
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Title (Default)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New coupon"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl fullWidth>
                  <Select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="Default">Default</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: 9uHNozDS"
                />
                <TextField
                  fullWidth
                  label="Limit for same user"
                  value={limitForUser}
                  onChange={(e) => setLimitForUser(e.target.value)}
                  placeholder="Ex: 10"
                />
                <TextField
                  fullWidth
                  label="Start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Expire date"
                  type="date"
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: startDate || new Date().toISOString().split("T")[0] }}
                />
                <TextField
                  fullWidth
                  label="Min trip amount"
                  value={minTripAmount}
                  onChange={(e) => setMinTripAmount(e.target.value)}
                  placeholder="0"
                />
                <FormControl fullWidth>
                  <Select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="Amount ($)">Amount ($)</MenuItem>
                    <MenuItem value="Percentage (%)">Percentage (%)</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Ex: 100"
                />
              </Box>
              <TextField
                fullWidth
                label="Max discount"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="0"
              />
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
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" component="h2">
              Coupon List
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
              {coupons.length}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <TextField
              variant="outlined"
              placeholder="Ex: Search by title or code"
              size="small"
              sx={{ width: 200 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">🔍</InputAdornment>,
              }}
            />
          </Box>
          <Card sx={{ p: 2, boxShadow: "none", border: `1px solid #e0e0e0`, borderRadius: 1 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: 1,
                  mb: 2,
                  color: "text.secondary",
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: 1,
                }}
              >
                <Typography sx={{ width: 50, fontWeight: "bold" }}>Sl</Typography>
                <Typography sx={{ width: 100, fontWeight: "bold" }}>Title</Typography>
                <Typography sx={{ width: 100, fontWeight: "bold" }}>Code</Typography>
                <Typography sx={{ width: 100, fontWeight: "bold" }}>Type</Typography>
                <Typography sx={{ width: 100, fontWeight: "bold" }}>Total Uses</Typography>
                <Typography sx={{ width: 120, fontWeight: "bold" }}>Min Trip Amount</Typography>
                <Typography sx={{ width: 120, fontWeight: "bold" }}>Max Discount</Typography>
                <Typography sx={{ width: 100, fontWeight: "bold" }}>Discount</Typography>
                <Typography sx={{ width: 120, fontWeight: "bold" }}>Discount Type</Typography>
                <Typography sx={{ width: 120, fontWeight: "bold" }}>Start Date</Typography>
                <Typography sx={{ width: 120, fontWeight: "bold" }}>Expire Date</Typography>
                <Typography sx={{ width: 100, fontWeight: "bold" }}>Status</Typography>
                <Typography sx={{ width: 100, fontWeight: "bold" }}>Action</Typography>
              </Box>
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <Box
                    key={coupon.sl}
                    sx={{
                      display: "flex",
                      flexWrap: "nowrap",
                      gap: 1,
                      py: 1,
                      borderBottom: "1px solid #e0e0e0",
                      alignItems: "center",
                      backgroundColor: coupon.status === "Inactive" ? "#f5f5f5" : "inherit",
                    }}
                  >
                    <Typography sx={{ width: 50, color: "#333" }}>{coupon.sl}</Typography>
                    <Typography sx={{ width: 100, color: "#333" }}>{coupon.title}</Typography>
                    <Typography sx={{ width: 100, color: "#333" }}>{coupon.code}</Typography>
                    <Typography sx={{ width: 100, color: "#333" }}>{coupon.couponType}</Typography>
                    <Typography sx={{ width: 100, color: "#333" }}>{coupon.totalUses}</Typography>
                    <Typography sx={{ width: 120, color: "#333" }}>{coupon.minTripAmount}</Typography>
                    <Typography sx={{ width: 120, color: "#333" }}>{coupon.maxDiscount}</Typography>
                    <Typography sx={{ width: 100, color: "#333" }}>{coupon.discount}</Typography>
                    <Typography sx={{ width: 120, color: "#333" }}>{coupon.discountType}</Typography>
                    <Typography sx={{ width: 120, color: "#333" }}>{coupon.startDate}</Typography>
                    <Typography sx={{ width: 120, color: "#333" }}>{coupon.expireDate}</Typography>
                    <Box sx={{ width: 100, display: "flex", alignItems: "center" }}>
                      <Typography sx={{ color: "#333", mr: 1 }}>
                        {coupon.status}
                      </Typography>
                      <Switch
                        checked={coupon.status === "Active"}
                        onChange={() => handleToggle(coupon.sl)}
                        color="primary"
                      />
                    </Box>
                    <Typography sx={{ width: 100, color: "#333" }}>{coupon.action}</Typography>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    component="img"
                    src="https://via.placeholder.com/100"
                    alt="No Data Found"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body1">No Data Found</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
export default AddCoupon;