import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AppBar, Toolbar, Typography, Box, Button, Select, MenuItem, FormControl,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Switch, IconButton, Stack, Chip, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, Snackbar, Avatar, InputAdornment,
  Skeleton, Grid, Divider, List, ListItem, ListItemText, ListItemIcon, Tooltip,
  Card, CardMedia, FormControlLabel, Checkbox, Accordion, AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Visibility, Edit, Delete, Search, Refresh, Add, Download, Close, Category,
  AttachMoney, Palette, Schedule, Info, Image as ImageIcon, CheckCircle, Cancel,
  ExpandMore, LocalOffer, DirectionsCar, EventAvailable, Policy, Payment,
  Spa, List as ListIcon,
} from "@mui/icons-material";
import { Alert } from "@mui/material";

const API_BASE_URL = "https://api.bookmyevent.ae/api/makeup-packages";

export default function MakeupList() {
  const [makeupList, setMakeupList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [pendingSearch, setPendingSearch] = useState("");
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedMakeup, setSelectedMakeup] = useState(null);
  const [makeupToDelete, setMakeupToDelete] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
        <Avatar variant="rounded" sx={{ width: 70, height: 70, bgcolor: "#E15B65", fontSize: "1.8rem", fontWeight: "bold", color: "white" }}>
          {title?.[0]?.toUpperCase() || "M"}
        </Avatar>
      );
    }

    return (
      <Box sx={{ position: "relative" }}>
        {imgLoading && <Skeleton variant="rectangular" width={70} height={70} sx={{ borderRadius: 2 }} />}
        <Avatar variant="rounded" src={src} alt={alt} sx={{ width: 70, height: 70, borderRadius: 2, display: imgLoading ? "none" : "block" }}
          imgProps={{ onLoad: () => setImgLoading(false), onError: () => { setError(true); setImgLoading(false); } }} />
      </Box>
    );
  };

  const fetchMakeup = useCallback(async () => {
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
      if (result.success) setMakeupList(result.data || []);
    } catch (err) {
      setToast({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => { fetchMakeup(); }, [fetchMakeup]);

  useEffect(() => {
    const timer = setTimeout(() => setFilters((prev) => ({ ...prev, search: pendingSearch })), 400);
    return () => clearTimeout(timer);
  }, [pendingSearch]);

  const handleView = (makeup) => { setSelectedMakeup(makeup); setSelectedImageIndex(0); setOpenView(true); };

  const handleEditOpen = (makeup) => { setSelectedMakeup(makeup); setEditForm({ ...makeup }); setOpenEdit(true); };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${selectedMakeup._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setMakeupList((prev) => prev.map((m) => (m._id === selectedMakeup._id ? data.data : m)));
        setToast({ open: true, message: "Package updated successfully", severity: "success" });
        setOpenEdit(false);
      } else {
        setToast({ open: true, message: data.message || "Update failed", severity: "error" });
      }
    } catch { setToast({ open: true, message: "Something went wrong", severity: "error" }); }
    finally { setSaving(false); }
  };

  const handleToggleStatus = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/toggle-active`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setMakeupList((prev) => prev.map((m) => (m._id === id ? { ...m, isActive: !current } : m)));
        setToast({ open: true, message: "Status updated", severity: "success" });
      }
    } catch { setToast({ open: true, message: "Failed to update status", severity: "error" }); }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${makeupToDelete}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setMakeupList((prev) => prev.filter((m) => m._id !== makeupToDelete));
        setToast({ open: true, message: "Package deleted", severity: "success" });
      }
    } catch { setToast({ open: true, message: "Delete failed", severity: "error" }); }
    finally { setOpenConfirm(false); setMakeupToDelete(null); }
  };

  const filteredMakeups = useMemo(() => {
    return makeupList.filter((m) => {
      const matchesSearch = !filters.search || m.packageTitle?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || m.categories?.some((c) => c._id === filters.category);
      return matchesSearch && matchesCategory;
    });
  }, [makeupList, filters]);

  const categories = useMemo(() => {
    const map = new Map();
    makeupList.forEach((m) => m.categories?.forEach((c) => map.set(c._id, c)));
    return Array.from(map.values());
  }, [makeupList]);

  const handleExport = () => {
    const headers = ["No", "Title", "Categories", "Type", "Base Price", "Final Price", "Status"];
    const rows = filteredMakeups.map((m, i) => [i + 1, m.packageTitle || "", m.categories?.map((c) => c.title).join(" | ") || "", m.makeupType || "", m.basePrice || 0, m.finalPrice || 0, m.isActive ? "Active" : "Inactive"]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `makeup_packages_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const DetailItem = ({ icon, label, value, chip, success, error }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
      <Box sx={{ color: "#E15B65", mt: 0.5 }}>{icon}</Box>
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
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>My Makeup Packages ({makeupList.length})</Typography>
          <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: "#E15B65", "&:hover": { bgcolor: "#c14a54" } }} onClick={() => window.location.href = "/makeup/new"}>Add New Package</Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField size="small" placeholder="Search packages..." value={pendingSearch} onChange={(e) => setPendingSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} sx={{ width: { xs: "100%", sm: 300 } }} />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))} displayEmpty>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ ml: "auto", gap: 1, display: "flex" }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchMakeup}>Refresh</Button>
            <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>Export CSV</Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ mt: 3 }}>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell>#</TableCell><TableCell>Image</TableCell><TableCell>Title</TableCell>
                <TableCell>Categories</TableCell><TableCell>Type</TableCell><TableCell align="right">Price</TableCell>
                <TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>}
              {!loading && filteredMakeups.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary">{makeupList.length === 0 ? "No packages created yet" : "No packages match your search"}</Typography>
                  <Button variant="contained" sx={{ mt: 2, bgcolor: "#E15B65" }} onClick={() => window.location.href = "/makeup/new"}>Create Your First Package</Button>
                </TableCell></TableRow>
              )}
              {filteredMakeups.map((m, i) => (
                <TableRow key={m._id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell><ImageAvatar src={getImageUrl(m.gallery?.[0])} alt={m.packageTitle} title={m.packageTitle} /></TableCell>
                  <TableCell><Typography fontWeight="medium">{m.packageTitle}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {m.categories?.map((c) => <Chip key={c._id} label={c.title} size="small" color="primary" variant="outlined" />)}
                    </Stack>
                  </TableCell>
                  <TableCell>{m.makeupType || "-"}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold" color="primary">AED {m.finalPrice?.toLocaleString()}</Typography>
                    {m.basePrice > m.finalPrice && <Typography variant="caption" color="text.secondary"><del>AED {m.basePrice}</del></Typography>}
                  </TableCell>
                  <TableCell><Switch checked={m.isActive} onChange={() => handleToggleStatus(m._id, m.isActive)} color="success" /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View Details"><IconButton size="small" onClick={() => handleView(m)}><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit Package"><IconButton size="small" color="primary" onClick={() => handleEditOpen(m)}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setMakeupToDelete(m._id); setOpenConfirm(true); }}><Delete fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Details Modal - UPDATED WITH ALL FIELDS */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ bgcolor: "#E15B65", color: "white", pr: 6 }}>
          <Typography variant="h6">{selectedMakeup?.packageTitle}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>ID: {selectedMakeup?.makeupId}</Typography>
          <IconButton sx={{ position: "absolute", right: 8, top: 8, color: "white" }} onClick={() => setOpenView(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedMakeup && (
            <Box>
              {/* Gallery Section */}
              <Box sx={{ bgcolor: "#1a1a1a", p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  {selectedMakeup.gallery?.[selectedImageIndex] ? (
                    <Card elevation={3} sx={{ maxWidth: 500 }}>
                      <CardMedia component="img" height="300" image={getImageUrl(selectedMakeup.gallery[selectedImageIndex])} alt={selectedMakeup.packageTitle} sx={{ objectFit: "cover" }} />
                    </Card>
                  ) : (
                    <Box sx={{ height: 300, width: "100%", maxWidth: 500, bgcolor: "#333", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2 }}>
                      <ImageIcon sx={{ fontSize: 80, color: "#666" }} />
                    </Box>
                  )}
                </Box>
                {selectedMakeup.gallery?.length > 1 && (
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                    {selectedMakeup.gallery.map((img, i) => (
                      <Avatar key={i} variant="rounded" src={getImageUrl(img)} onClick={() => setSelectedImageIndex(i)}
                        sx={{ width: 60, height: 60, cursor: "pointer", border: selectedImageIndex === i ? "3px solid #E15B65" : "3px solid transparent", opacity: selectedImageIndex === i ? 1 : 0.7, "&:hover": { opacity: 1 } }} />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Details Section */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Left Column - Basic Info */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "#E15B65" }}>Basic Information</Typography>
                    <DetailItem icon={<Category />} label="Categories" value={selectedMakeup.categories?.map(c => c.title).join(", ") || "None"} />
                    <DetailItem icon={<Palette />} label="Makeup Type" value={selectedMakeup.makeupType} />
                    <DetailItem icon={<Schedule />} label="Duration" value={selectedMakeup.duration} />
                    <DetailItem icon={<CheckCircle />} label="Status" value={selectedMakeup.isActive ? "Active" : "Inactive"} chip success={selectedMakeup.isActive} error={!selectedMakeup.isActive} />
                    <DetailItem icon={<Info />} label="Description" value={selectedMakeup.description} />
                  </Grid>

                  {/* Right Column - Pricing & Policies */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "#E15B65" }}>Pricing & Policies</Typography>
                    <DetailItem icon={<AttachMoney />} label="Base Price" value={`AED ${selectedMakeup.basePrice?.toLocaleString()}`} />
                    <DetailItem icon={<LocalOffer />} label="Offer Discount" value={selectedMakeup.offerPrice ? `AED ${selectedMakeup.offerPrice?.toLocaleString()}` : "No offer"} />
                    <DetailItem icon={<AttachMoney />} label="Final Price" value={<Typography sx={{ color: "#E15B65", fontWeight: "bold" }}>AED {selectedMakeup.finalPrice?.toLocaleString()}</Typography>} />
                    <DetailItem icon={<Payment />} label="Advance Booking Amount" value={selectedMakeup.advanceBookingAmount ? `AED ${selectedMakeup.advanceBookingAmount}` : "Not specified"} />
                    <DetailItem icon={<Policy />} label="Cancellation Policy" value={selectedMakeup.cancellationPolicy} />
                  </Grid>

                  {/* Full Width - Additional Features */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "#E15B65" }}>Additional Features</Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      <Chip icon={<Spa />} label={selectedMakeup.trialMakeupIncluded ? "Trial Makeup Included" : "No Trial Makeup"} color={selectedMakeup.trialMakeupIncluded ? "success" : "default"} variant={selectedMakeup.trialMakeupIncluded ? "filled" : "outlined"} />
                      <Chip icon={<DirectionsCar />} label={selectedMakeup.travelToVenue ? "Travel to Venue Included" : "No Travel to Venue"} color={selectedMakeup.travelToVenue ? "success" : "default"} variant={selectedMakeup.travelToVenue ? "filled" : "outlined"} />
                      <Chip icon={<EventAvailable />} label={selectedMakeup.isTopPick ? "Top Pick" : "Not a Top Pick"} color={selectedMakeup.isTopPick ? "warning" : "default"} variant={selectedMakeup.isTopPick ? "filled" : "outlined"} />
                    </Stack>
                  </Grid>

                  {/* Included Services */}
                  {selectedMakeup.includedServices?.length > 0 && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "#E15B65" }}>Included Services</Typography>
                      {selectedMakeup.includedServices.map((service, idx) => (
                        <Accordion key={idx} defaultExpanded={idx === 0} sx={{ mb: 1, "&:before": { display: "none" }, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: "#f8f9fa" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <ListIcon sx={{ color: "#E15B65" }} />
                              <Typography fontWeight={500}>{service.title}</Typography>
                              <Chip label={`${service.items?.length || 0} items`} size="small" sx={{ ml: 1 }} />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List dense>
                              {service.items?.map((item, i) => (
                                <ListItem key={i}>
                                  <ListItemIcon sx={{ minWidth: 32 }}><CheckCircle sx={{ fontSize: 18, color: "success.main" }} /></ListItemIcon>
                                  <ListItemText primary={item} />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Grid>
                  )}

                  {/* Metadata */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={4} sx={{ color: "text.secondary" }}>
                      <Typography variant="caption">Created: {new Date(selectedMakeup.createdAt).toLocaleString()}</Typography>
                      <Typography variant="caption">Updated: {new Date(selectedMakeup.updatedAt).toLocaleString()}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setOpenView(false); handleEditOpen(selectedMakeup); }} variant="outlined">Edit Package</Button>
          <Button variant="contained" sx={{ bgcolor: "#E15B65" }} onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Package</DialogTitle>
        <IconButton sx={{ position: "absolute", right: 8, top: 8 }} onClick={() => setOpenEdit(false)}><Close /></IconButton>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Package Title" value={editForm.packageTitle || ""} onChange={(e) => setEditForm({ ...editForm, packageTitle: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" multiline rows={3} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Base Price (AED)" type="number" value={editForm.basePrice || ""} onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Final Price (AED)" type="number" value={editForm.finalPrice || ""} onChange={(e) => setEditForm({ ...editForm, finalPrice: Number(e.target.value) })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Offer Price (AED)" type="number" value={editForm.offerPrice || ""} onChange={(e) => setEditForm({ ...editForm, offerPrice: Number(e.target.value) })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Advance Booking (AED)" value={editForm.advanceBookingAmount || ""} onChange={(e) => setEditForm({ ...editForm, advanceBookingAmount: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Duration" value={editForm.duration || ""} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Cancellation Policy" multiline rows={2} value={editForm.cancellationPolicy || ""} onChange={(e) => setEditForm({ ...editForm, cancellationPolicy: e.target.value })} /></Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={editForm.trialMakeupIncluded || false} onChange={(e) => setEditForm({ ...editForm, trialMakeupIncluded: e.target.checked })} />} label="Trial Makeup Included" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={editForm.travelToVenue || false} onChange={(e) => setEditForm({ ...editForm, travelToVenue: e.target.checked })} />} label="Travel to Venue" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={editForm.isActive || false} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />} label="Active (Visible to customers)" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={saving}>{saving ? <CircularProgress size={24} /> : "Save Changes"}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Package?</DialogTitle>
        <DialogContent><DialogContentText>This action cannot be undone. This package will be permanently deleted.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete Permanently</Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}