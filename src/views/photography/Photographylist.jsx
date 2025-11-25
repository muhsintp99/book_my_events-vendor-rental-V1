import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AppBar, Toolbar, Typography, Box, Button, Select, MenuItem, FormControl,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Switch, IconButton, Stack, Chip, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, Snackbar, Avatar, InputAdornment,
  Skeleton, Grid, Divider, List, ListItem, ListItemText, ListItemIcon, Tooltip,
  Card, CardMedia, FormControlLabel, Checkbox, Accordion, AccordionSummary,
  AccordionDetails, Autocomplete, OutlinedInput, InputLabel
} from "@mui/material";
import {
  Visibility, Edit, Delete, Search, Refresh, Add, Download, Close, Category,
  AttachMoney, Schedule, Info, Image as ImageIcon, CheckCircle,
  ExpandMore, DirectionsCar, Policy, Payment, List as ListIcon, DeleteOutline
} from "@mui/icons-material";
import { Alert } from "@mui/material";

const PINK = "#E15B65";
const API_BASE_URL = "https://api.bookmyevent.ae/api/photography-packages";

export default function PhotographyList() {
  const [photographyList, setPhotographyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [pendingSearch, setPendingSearch] = useState("");
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Edit form state
  const [editForm, setEditForm] = useState({
    packageTitle: "",
    description: "",
    categories: [],
    includedServices: [],
    price: "",
    advanceBookingAmount: "",
    cancellationPolicy: "",
    travelToVenue: true,
    isActive: true,
    gallery: []
  });

  // For adding new service
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceItems, setNewServiceItems] = useState("");

  // Image handling
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const fileInputRef = useRef();

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const providerId = userData?._id;

  const getImageUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://api.bookmyevent.ae/${cleanPath}`;
  };

  const ImageAvatar = ({ src, alt, title }) => {
    const [error, setError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    if (!src || error) {
      return (
        <Avatar variant="rounded" sx={{ width: 70, height: 70, bgcolor: PINK, fontSize: "1.8rem", fontWeight: "bold", color: "white" }}>
          {title?.[0]?.toUpperCase() || "P"}
        </Avatar>
      );
    }

    return (
      <Box sx={{ position: "relative" }}>
        {imgLoading && <Skeleton variant="rectangular" width={70} height={70} sx={{ borderRadius: 2 }} />}
        <Avatar
          variant="rounded"
          src={src}
          alt={alt}
          sx={{ width: 70, height: 70, borderRadius: 2, display: imgLoading ? "none" : "block" }}
          imgProps={{
            onLoad: () => setImgLoading(false),
            onError: () => { setError(true); setImgLoading(false); }
          }}
        />
      </Box>
    );
  };

  const fetchPhotography = useCallback(async () => {
    if (!providerId || !token) {
      setToast({ open: true, message: "Please login again", severity: "error" });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/provider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to load packages");
      const result = await res.json();
      if (result.success) setPhotographyList(result.data || []);
    } catch (err) {
      setToast({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => { fetchPhotography(); }, [fetchPhotography]);

  useEffect(() => {
    const timer = setTimeout(() => setFilters((prev) => ({ ...prev, search: pendingSearch })), 400);
    return () => clearTimeout(timer);
  }, [pendingSearch]);

  const handleView = (pkg) => { setSelectedPackage(pkg); setSelectedImageIndex(0); setOpenView(true); };

  const handleEditOpen = (pkg) => {
    setSelectedPackage(pkg);
    setEditForm({
      packageTitle: pkg.packageTitle || "",
      description: pkg.description || "",
      categories: pkg.categories || [],
      includedServices: pkg.includedServices || [],
      price: pkg.price || "",
      advanceBookingAmount: pkg.advanceBookingAmount || "",
      cancellationPolicy: pkg.cancellationPolicy || "",
      travelToVenue: pkg.travelToVenue || false,
      isActive: pkg.isActive || false,
      gallery: pkg.gallery || []
    });
    setImagePreviews((pkg.gallery || []).map(getImageUrl));
    setNewImages([]);
    setNewServiceTitle("");
    setNewServiceItems("");
    setOpenEdit(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    if (index < editForm.gallery.length) {
      setEditForm(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index)
      }));
    } else {
      const newIndex = index - editForm.gallery.length;
      setNewImages(prev => prev.filter((_, i) => i !== newIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addService = () => {
    if (!newServiceTitle.trim()) return;
    const items = newServiceItems.split("\n").map(i => i.trim()).filter(Boolean);
    setEditForm(prev => ({
      ...prev,
      includedServices: [...prev.includedServices, { title: newServiceTitle, items }]
    }));
    setNewServiceTitle("");
    setNewServiceItems("");
  };

  const removeService = (index) => {
    setEditForm(prev => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, i) => i !== index)
    }));
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("packageTitle", editForm.packageTitle);
      formData.append("description", editForm.description || "");
      formData.append("price", editForm.price);
      formData.append("advanceBookingAmount", editForm.advanceBookingAmount || "");
      formData.append("cancellationPolicy", editForm.cancellationPolicy || "");
      formData.append("travelToVenue", editForm.travelToVenue);
      formData.append("isActive", editForm.isActive);

      editForm.categories.forEach((cat, i) => {
        formData.append(`categories[${i}]`, cat._id);
      });

      editForm.includedServices.forEach((service, i) => {
        formData.append(`includedServices[${i}][title]`, service.title);
        service.items.forEach((item, j) => {
          formData.append(`includedServices[${i}][items][${j}]`, item);
        });
      });

      // Keep existing gallery paths
      editForm.gallery.forEach((path, i) => {
        formData.append("existingGallery", path);
      });

      // Add new images
      newImages.forEach(file => {
        formData.append("gallery", file);
      });

      const res = await fetch(`${API_BASE_URL}/${selectedPackage._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setPhotographyList(prev => prev.map(p => p._id === selectedPackage._id ? data.data : p));
        setToast({ open: true, message: "Package updated successfully!", severity: "success" });
        setOpenEdit(false);
      } else {
        setToast({ open: true, message: data.message || "Update failed", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Failed to update package", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/toggle-active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPhotographyList(prev => prev.map(p => p._id === id ? { ...p, isActive: !current } : p));
        setToast({ open: true, message: "Status updated", severity: "success" });
      }
    } catch {
      setToast({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${packageToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPhotographyList(prev => prev.filter(p => p._id !== packageToDelete));
        setToast({ open: true, message: "Package deleted", severity: "success" });
      }
    } catch {
      setToast({ open: true, message: "Delete failed", severity: "error" });
    } finally {
      setOpenConfirm(false);
      setPackageToDelete(null);
    }
  };

  const filteredPackages = useMemo(() => {
    return photographyList.filter((p) => {
      const matchesSearch = !filters.search ||
        p.packageTitle?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || p.categories?.some((c) => c._id === filters.category);
      return matchesSearch && matchesCategory;
    });
  }, [photographyList, filters]);

  const categories = useMemo(() => {
    const map = new Map();
    photographyList.forEach((p) => p.categories?.forEach((c) => map.set(c._id, c)));
    return Array.from(map.values());
  }, [photographyList]);

  const handleExport = () => {
    const headers = ["No", "Title", "Categories", "Price", "Advance", "Travel", "Status"];
    const rows = filteredPackages.map((p, i) => [
      i + 1,
      p.packageTitle || "",
      p.categories?.map(c => c.title).join(" | ") || "-",
      p.price || 0,
      p.advanceBookingAmount || "-",
      p.travelToVenue ? "Yes" : "No",
      p.isActive ? "Active" : "Inactive"
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `photography_packages_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const DetailItem = ({ icon, label, value, chip, success, error }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
      <Box sx={{ color: PINK, mt: 0.5 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{label}</Typography>
        {chip ? (
          <Chip label={value} size="small" color={success ? "success" : error ? "error" : "default"} sx={{ mt: 0.5 }} />
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>{value || "Not specified"}</Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", p: 3 }}>
      {/* Header & Filters - unchanged */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            My Photography Packages ({photographyList.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ bgcolor: PINK, "&:hover": { bgcolor: "#c14a54" } }}
            onClick={() => window.location.href = "/photography/new"}
          >
            Add New Package
          </Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search packages..."
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ width: { xs: "100%", sm: 300 } }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))} displayEmpty>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ ml: "auto", gap: 1, display: "flex" }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchPhotography}>Refresh</Button>
            <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>Export CSV</Button>
          </Box>
        </Stack>
      </Paper>

      {/* Table - unchanged */}
      <Paper sx={{ mt: 3 }}>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell>#</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell>Travel</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>}
              {!loading && filteredPackages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      {photographyList.length === 0 ? "No photography packages created yet" : "No packages match your search"}
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2, bgcolor: PINK }} onClick={() => window.location.href = "/photography/new"}>
                      Create Your First Package
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {filteredPackages.map((p, i) => (
                <TableRow key={p._id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell><ImageAvatar src={getImageUrl(p.gallery?.[0])} alt={p.packageTitle} title={p.packageTitle} /></TableCell>
                  <TableCell><Typography fontWeight="medium">{p.packageTitle}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {p.categories?.length > 0 ? p.categories.map(c => (
                        <Chip key={c._id} label={c.title} size="small" color="primary" variant="outlined" />
                      )) : <Chip label="No Category" size="small" />}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold" color="primary">AED {p.price?.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={p.travelToVenue ? "Yes" : "No"} color={p.travelToVenue ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell>
                    <Switch checked={p.isActive} onChange={() => handleToggleStatus(p._id, p.isActive)} color="success" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View Details"><IconButton size="small" onClick={() => handleView(p)}><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit Package"><IconButton size="small" color="primary" onClick={() => handleEditOpen(p)}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setPackageToDelete(p._id); setOpenConfirm(true); }}><Delete fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Modal - unchanged */}
      {/* ... (keep your existing View Dialog) ... */}

      {/* === FULLY UPGRADED EDIT MODAL === */}
      <Dialog open={openEdit} onClose={() => !saving && setOpenEdit(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ bgcolor: PINK, color: "white" }}>
          Edit Photography Package
          <IconButton sx={{ position: "absolute", right: 8, top: 8, color: "white" }} onClick={() => setOpenEdit(false)} disabled={saving}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Package Title" required
                value={editForm.packageTitle}
                onChange={(e) => setEditForm({ ...editForm, packageTitle: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth label="Description" multiline rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={categories}
                getOptionLabel={(option) => option.title}
                value={editForm.categories}
                onChange={(e, newValue) => setEditForm({ ...editForm, categories: newValue })}
                renderInput={(params) => <TextField {...params} label="Categories" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option.title} {...getTagProps({ index })} />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Price (AED)" type="number" required
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Advance Booking Amount (e.g. 50% or 5000)"
                value={editForm.advanceBookingAmount}
                onChange={(e) => setEditForm({ ...editForm, advanceBookingAmount: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth label="Cancellation Policy" multiline rows={2}
                value={editForm.cancellationPolicy}
                onChange={(e) => setEditForm({ ...editForm, cancellationPolicy: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={editForm.travelToVenue} onChange={(e) => setEditForm({ ...editForm, travelToVenue: e.target.checked })} />}
                label="Travel to Venue"
              />
              <FormControlLabel
                control={<Checkbox checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />}
                label="Package is Active (Visible to customers)"
              />
            </Grid>

            {/* Included Services */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Included Services</Typography>
              {editForm.includedServices.map((service, idx) => (
                <Box key={idx} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2, position: "relative" }}>
                  <Typography fontWeight="bold">{service.title}</Typography>
                  <List dense>
                    {service.items.map((item, i) => (
                      <ListItem key={i}><ListItemText primary={`• ${item}`} /></ListItem>
                    ))}
                  </List>
                  <IconButton size="small" sx={{ position: "absolute", top: 8, right: 8 }} onClick={() => removeService(idx)}>
                    <DeleteOutline />
                  </IconButton>
                </Box>
              ))}

              <Box sx={{ mt: 2, p: 2, border: "2px dashed #ccc", borderRadius: 2 }}>
                <TextField
                  fullWidth label="Service Title (e.g. Photography)" size="small"
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth label="Items (one per line)"
                  multiline rows={4} size="small"
                  placeholder="Candid Photography&#10;Traditional Photography&#10;Drone Shots"
                  value={newServiceItems}
                  onChange={(e) => setNewServiceItems(e.target.value)}
                />
                <Button variant="outlined" sx={{ mt: 2 }} onClick={addService} disabled={!newServiceTitle.trim()}>
                  Add Service
                </Button>
              </Box>
            </Grid>

            {/* Gallery */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Gallery Images</Typography>
              <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
                Upload New Images
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {imagePreviews.map((src, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Box sx={{ position: "relative" }}>
                      <img src={src} alt="" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8 }} />
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
                        onClick={() => removeImage(i)}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEdit(false)} disabled={saving}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: PINK }} onClick={handleEditSave} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation & Toast - unchanged */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Package?</DialogTitle>
        <DialogContent><DialogContentText>This action cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}