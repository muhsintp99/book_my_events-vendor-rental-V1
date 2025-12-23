// ================= COMPLETE UPDATED FILE (BACKEND-DRIVEN PREMIUM LOGIC) =================

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

import { Close, Delete, CloudUpload, VideoLibrary, Link as LinkIcon } from '@mui/icons-material';

import axios from 'axios';

const API_BASE_URL = 'https://api.bookmyevent.ae';
const api = axios.create({ baseURL: API_BASE_URL });
const RED = '#e53935';

export default function PortfolioManagement() {
  /* ================= AUTH ================= */
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const providerId = user?._id;
  const moduleId = localStorage.getItem('moduleId');

  /* ================= SUBSCRIPTION STATE (SOURCE OF TRUTH) ================= */
  const [isPremium, setIsPremium] = useState(false);
  const [subLoading, setSubLoading] = useState(true);

  /* ================= UI STATE ================= */
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [portfolioList, setPortfolioList] = useState([]);

  // COMMON
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // IMAGES
  const [images, setImages] = useState([]);

  // VIDEOS
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoLinks, setVideoLinks] = useState([]);
  const [videoLinkInput, setVideoLinkInput] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  /* ================= SUBSCRIPTION CHECK ================= */
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!providerId || !moduleId) {
          setIsPremium(false);
          return;
        }

        const res = await api.get(`/api/subscription/status/${providerId}?moduleId=${moduleId}`);

       const subscription = res.data?.subscription;

if (subscription?.status === "active" && subscription?.isCurrent) {
  setIsPremium(true);
  return;
}

// 🔁 FALLBACK (instant UI sync after payment)
const upgrade = JSON.parse(localStorage.getItem("upgrade") || "{}");

if (
  upgrade?.status === "active" &&
  upgrade?.module === moduleId
) {
  setIsPremium(true);
} else {
  setIsPremium(false);
}

      } catch {
        setIsPremium(false);
      } finally {
        setSubLoading(false);
      }
    };

    checkSubscription();
  }, [providerId, moduleId]);

  /* ================= FETCH PORTFOLIO ================= */
  useEffect(() => {
    if (providerId) fetchPortfolio();
  }, [providerId]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/portfolio/provider/${providerId}`);
      setPortfolioList(res.data.data || []);
    } catch {
      showSnackbar('Failed to load portfolio', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  /* ================= IMAGE HANDLING ================= */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => prev.concat(files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= VIDEO HANDLING ================= */
  const handleVideoFiles = (e) => {
    const files = Array.from(e.target.files);
    setVideoFiles((prev) => prev.concat(files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))));
  };

  const removeVideoFile = (index) => {
    URL.revokeObjectURL(videoFiles[index].preview);
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addVideoLink = () => {
    if (videoLinkInput.trim()) {
      setVideoLinks((prev) => [...prev, videoLinkInput.trim()]);
      setVideoLinkInput('');
    }
  };

  /* ================= UPLOAD ================= */
  const uploadPortfolio = async (isVideo) => {
    if (!isPremium) return showSnackbar('Upgrade to Premium to add portfolio', 'warning');

    if (!title.trim()) return showSnackbar('Title is required', 'warning');

    if (!isVideo && images.length === 0) return showSnackbar('Add at least one image', 'warning');

    if (isVideo && videoFiles.length === 0 && videoLinks.length === 0) return showSnackbar('Add video file or link', 'warning');

    if (!moduleId) return showSnackbar('Module missing. Re-login.', 'error');

    const formData = new FormData();
    formData.append('providerId', providerId);
    formData.append('module', moduleId);
    formData.append('workTitle', title);
    formData.append('description', desc);
    formData.append('tags', JSON.stringify(tags));

    if (isVideo) {
      videoFiles.forEach((v) => formData.append('videos', v.file));
      if (videoLinks.length > 0) {
        formData.append('videoLinks', JSON.stringify(videoLinks));
      }
    } else {
      images.forEach((i) => formData.append('images', i.file));
    }

    try {
      setLoading(true);
      await api.post('/api/portfolio', formData);
      showSnackbar('Portfolio added');
      resetForm();
      fetchPortfolio();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setTags([]);
    setImages([]);
    setVideoFiles([]);
    setVideoLinks([]);
  };

  /* ================= DELETE ================= */
  const deletePortfolio = async (id) => {
    if (!window.confirm('Delete portfolio?')) return;
    try {
      await api.delete(`/api/portfolio/${id}`);
      fetchPortfolio();
      showSnackbar('Deleted');
    } catch {
      showSnackbar('Delete failed', 'error');
    }
  };

  /* ================= LOADING GUARD ================= */
  if (subLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: RED }} />
      </Box>
    );
  }

  /* ================= RENDER ================= */
  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress sx={{ color: RED }} />
        </Box>
      )}

      {!isPremium && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are on a FREE plan. Upgrade to add portfolio.
        </Alert>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* ================= TABS ================= */}
      <Card>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} TabIndicatorProps={{ style: { backgroundColor: RED } }}>
          <Tab label="Images" />
          <Tab label="Videos" />
        </Tabs>

        {/* ================= IMAGES TAB ================= */}
        {tabValue === 0 && (
          <CardContent>
            <Typography variant="h6" sx={{ color: RED }}>
              Add Portfolio Images
            </Typography>

            <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Add Tag (Enter)"
              value={tagInput}
              onKeyDown={addTag}
              onChange={(e) => setTagInput(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button component="label" variant="contained" sx={{ bgcolor: RED }} disabled={!isPremium}>
              <CloudUpload sx={{ mr: 1 }} /> Upload Images
              <input hidden multiple type="file" accept="image/*" onChange={handleImages} />
            </Button>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {images.map((img, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box sx={{ position: 'relative' }}>
                    <img src={img.preview} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                    <IconButton onClick={() => removeImage(i)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: RED, color: '#fff' }}>
                      <Close />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button fullWidth sx={{ mt: 3, bgcolor: RED }} variant="contained" disabled={!isPremium} onClick={() => uploadPortfolio(false)}>
              Add Portfolio
            </Button>
          </CardContent>
        )}

        {/* ================= VIDEOS TAB ================= */}
        {tabValue === 1 && (
          <CardContent>
            <Typography variant="h6" sx={{ color: RED }}>
              Add Portfolio Videos
            </Typography>

            <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button component="label" variant="contained" sx={{ bgcolor: RED, mb: 2 }} disabled={!isPremium}>
              <VideoLibrary sx={{ mr: 1 }} /> Upload Videos
              <input hidden multiple type="file" accept="video/*" onChange={handleVideoFiles} />
            </Button>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField fullWidth label="Video Link" value={videoLinkInput} onChange={(e) => setVideoLinkInput(e.target.value)} />
              <Button variant="contained" sx={{ bgcolor: RED }} onClick={addVideoLink} disabled={!isPremium}>
                <LinkIcon />
              </Button>
            </Box>

            <Button fullWidth sx={{ bgcolor: RED }} variant="contained" disabled={!isPremium} onClick={() => uploadPortfolio(true)}>
              Add Video
            </Button>
          </CardContent>
        )}
      </Card>

      {/* ================= LIST ================= */}
      <Typography sx={{ mt: 4, mb: 1, color: RED }} variant="h6">
        Portfolio List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#fdeaea' }}>
            <TableRow>
              <TableCell>SI</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {portfolioList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No portfolio found
                </TableCell>
              </TableRow>
            ) : (
              portfolioList.map((p, i) => {
                const images = p.media?.find((m) => m.type === 'image')?.images || [];
                const videos = p.media?.find((m) => m.type === 'video')?.videos || [];
                const links = p.media?.find((m) => m.type === 'videoLink')?.videoLinks || [];

                return (
                  <TableRow key={p._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{p.workTitle}</TableCell>

                    <TableCell>
                      {images[0] ? (
                        <img src={`${API_BASE_URL}${images[0]}`} style={{ width: 60, height: 50, objectFit: 'cover' }} />
                      ) : (
                        <VideoLibrary color="action" />
                      )}
                    </TableCell>

                    <TableCell>{images.length + videos.length + links.length}</TableCell>

                    <TableCell>
                      {p.tags?.map((t, idx) => (
                        <Chip key={idx} size="small" label={t} sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>

                    <TableCell>
                      <IconButton color="error" onClick={() => deletePortfolio(p._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
