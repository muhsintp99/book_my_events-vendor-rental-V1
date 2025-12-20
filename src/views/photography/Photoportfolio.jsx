// ================= COMPLETE UPDATED FILE WITH RED THEME ================= //

import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Dialog,
  DialogContent
} from '@mui/material';

import {
  CloudUpload,
  Close,
  VideoLibrary,
  Delete,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon
} from '@mui/icons-material';

import axios from 'axios';

const API_BASE_URL = 'https://api.bookmyevent.ae';
const api = axios.create({ baseURL: API_BASE_URL });

// 🔥 RED COLOR CONSTANT
const RED = "#e53935";

export default function PortfolioManagement({ providerId: propProviderId }) {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 🔐 SUBSCRIPTION
  const [isFreePlan, setIsFreePlan] = useState(false);

  const providerId =
    propProviderId ||
    JSON.parse(localStorage.getItem("user") || "{}")?._id ||
    localStorage.getItem("userId");

  // MODAL
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [currentMediaUrls, setCurrentMediaUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);

  // IMAGE STATES
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioTags, setPortfolioTags] = useState([]);
  const [portfolioTagInput, setPortfolioTagInput] = useState('');
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);

  // VIDEO STATES
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoTags, setVideoTags] = useState([]);
  const [videoTagInput, setVideoTagInput] = useState('');
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoLinks, setVideoLinks] = useState([]);
  const [videoLinkInput, setVideoLinkInput] = useState('');
  const [videoList, setVideoList] = useState([]);

  // FETCH DATA
  useEffect(() => {
    if (providerId) {
      fetchPortfolioData();
      fetchSubscription();
    }
  }, [providerId]);

  // 🔐 SUBSCRIPTION CHECK
  const fetchSubscription = async () => {
    try {
      const res = await api.get(`/api/subscriptions/user/${providerId}`);
      const plan = res.data.subscription?.planId;

      if (!plan || plan.price === 0 || plan.planType === "free") {
        setIsFreePlan(true);
      } else {
        setIsFreePlan(false);
      }
    } catch {
      setIsFreePlan(true);
    }
  };

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/portfolio/provider/${providerId}`);
      if (!res.data.success) return;

      const all = res.data.data || [];

      const imageItems = all.filter(i =>
        i.media?.some(m => m.type === 'image')
      );

      setPortfolioList(
        imageItems.map(i => ({
          id: i._id,
          title: i.workTitle || 'Untitled',
          description: i.description || '',
          tags: Array.isArray(i.tags) ? i.tags : [],
          media: i.media
            .filter(m => m.type === 'image')
            .flatMap(m => m.images || [])
        }))
      );

      const videoItems = all.filter(i =>
        i.media?.some(m => m.type === 'video' || m.type === 'videoLink')
      );

      setVideoList(
        videoItems.map(i => ({
          id: i._id,
          title: i.workTitle || 'Untitled',
          description: i.description || '',
          tags: i.tags || [],
          media: i.media.flatMap(m => {
            if (m.type === "video")
              return (m.videos || []).map(v => ({ type: "video", url: v }));
            if (m.type === "videoLink")
              return (m.videoLinks || []).map(v => ({ type: "videoLink", url: v }));
            return [];
          })
        }))
      );

    } catch {
      showSnackbar("Unable to load portfolio", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (msg, sev = "success") =>
    setSnackbar({ open: true, message: msg, severity: sev });

  // FULLSCREEN MEDIA
  const openFullscreen = (mediaArray, index = 0, isVideo = false) => {
    const urls = mediaArray.map(item =>
      item.type === "videoLink"
        ? formatVideoUrl(item.url)
        : `${API_BASE_URL}/${item.url}`
    );
    setCurrentMediaUrls(urls);
    setCurrentIndex(index);
    setIsVideoMode(isVideo);
    setMediaModalOpen(true);
  };

  const formatVideoUrl = (url) => {
    if (url.includes("youtube.com")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be")) return url.replace("youtu.be/", "youtube.com/embed/");
    if (url.includes("vimeo.com")) {
      const id = url.split("/").pop().split("?")[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const closeFullscreen = () => setMediaModalOpen(false);
  const prevMedia = () => setCurrentIndex(i => (i === 0 ? currentMediaUrls.length - 1 : i - 1));
  const nextMedia = () => setCurrentIndex(i => (i === currentMediaUrls.length - 1 ? 0 : i + 1));

  // TAG HELPER
  const addTag = (input, setInput, setTags) => {
    if (input.trim()) {
      setTags(prev => [...prev, input.trim()]);
      setInput('');
    }
  };

  // IMAGE HANDLERS
  const handlePortfolioImages = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f)
    }));
    setPortfolioImages(prev => [...prev, ...previews]);
  };

  const removePortfolioImage = (i) => {
    URL.revokeObjectURL(portfolioImages[i].preview);
    setPortfolioImages(prev => prev.filter((_, idx) => idx !== i));
  };

  // VIDEO HANDLERS
  const handleVideoFiles = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f)
    }));
    setVideoFiles(prev => [...prev, ...previews]);
  };

  const removeVideoFile = (i) => {
    URL.revokeObjectURL(videoFiles[i].preview);
    setVideoFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const addVideoLink = () => {
    if (videoLinkInput.trim()) {
      setVideoLinks(prev => [...prev, videoLinkInput.trim()]);
      setVideoLinkInput('');
    }
  };

  const removeVideoLink = (i) =>
    setVideoLinks(prev => prev.filter((_, idx) => idx !== i));

  // UPLOAD
  const uploadMedia = async (
    title, desc, tags, files, links,
    setTitle, setDesc, setTags, setFiles, setLinks,
    isVideo = false
  ) => {

    if (isFreePlan)
      return showSnackbar("Upgrade your plan to add portfolio", "warning");

    if (!title.trim() || (files.length === 0 && links.length === 0))
      return showSnackbar("Title and media required", "warning");

    const formData = new FormData();
    formData.append("providerId", providerId);
    formData.append("module", "default");
    formData.append("workTitle", title);
    formData.append("description", desc);
    formData.append("tags", JSON.stringify(tags));

    if (isVideo) {
      files.forEach(f => formData.append("videos", f.file));
      if (links.length > 0)
        formData.append("videoLinks", JSON.stringify(links));
    } else {
      files.forEach(f => formData.append("images", f.file));
    }

    try {
      setLoading(true);
      await api.post("/api/portfolio", formData);
      showSnackbar("Added successfully");
      fetchPortfolioData();
      setTitle('');
      setDesc('');
      setTags([]);
      setFiles([]);
      if (setLinks) setLinks([]);
    } catch (err) {
      if (err.response?.status === 403)
        showSnackbar(err.response.data.message, "warning");
      else
        showSnackbar("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      setLoading(true);
      await api.delete(`/api/portfolio/${id}`);
      showSnackbar("Deleted!");
      fetchPortfolioData();
    } catch {
      showSnackbar("Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>

      {loading && (
        <Box sx={{
          position: 'fixed',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <CircularProgress size={60} sx={{ color: RED }} />
        </Box>
      )}

      {isFreePlan && (
        <Alert
          severity="warning"
          sx={{ mb: 3, border: `1px solid ${RED}`, color: RED }}
        >
          You are on a FREE plan. Upgrade to add portfolio.
        </Alert>
      )}
      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* TABS */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: RED } }}
          sx={{
            '& .MuiTab-root.Mui-selected': { color: RED, fontWeight: 600 }
          }}
        >
          <Tab label="Images" />
          <Tab label="Videos" />
        </Tabs>

        {/* IMAGES TAB */}
        {tabValue === 0 && (
          <>
            <CardContent>
              <Typography variant="h6" sx={{ color: RED }}>Add Portfolio Images</Typography>

              <TextField fullWidth label="Title"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                sx={{ mb: 3 }}
              />

              <TextField fullWidth multiline rows={3} label="Description"
                value={portfolioDesc}
                onChange={(e) => setPortfolioDesc(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Box sx={{ mb: 2 }}>
                {portfolioTags.map((t, i) => (
                  <Chip key={i} label={t}
                    onDelete={() =>
                      setPortfolioTags(prev => prev.filter((_, idx) => idx !== i))
                    }
                    sx={{ mr: 1, bgcolor: RED, color: "white" }}
                  />
                ))}
              </Box>

              <TextField fullWidth label="Add Tag (Enter)"
                value={portfolioTagInput}
                onChange={(e) => setPortfolioTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                    addTag(portfolioTagInput, setPortfolioTagInput, setPortfolioTags))
                }
                sx={{ mb: 3 }}
              />

              <Button variant="contained" component="label"
                startIcon={<CloudUpload />}
                sx={{ mb: 2, bgcolor: RED, '&:hover': { bgcolor: "#c62828" } }}
              >
                Upload Images
                <input hidden type="file" multiple accept="image/*"
                  onChange={handlePortfolioImages} />
              </Button>

              <Grid container spacing={2}>
                {portfolioImages.map((img, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={img.preview}
                        style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8 }}
                      />
                      <IconButton size="small"
                        onClick={() => removePortfolioImage(i)}
                        sx={{
                          position: "absolute", top: 4, right: 4,
                          bgcolor: RED, color: "white"
                        }}>
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button fullWidth variant="contained"
                sx={{ mt: 4, bgcolor: RED, '&:hover': { bgcolor: "#c62828" } }}
                onClick={() =>
                  uploadMedia(
                    portfolioTitle, portfolioDesc, portfolioTags,
                    portfolioImages, [],
                    setPortfolioTitle, setPortfolioDesc,
                    setPortfolioTags, setPortfolioImages,
                    null, false
                  )
                }
              >
                Add Portfolio
              </Button>
            </CardContent>

            <CardContent>
              <Typography variant="h6" sx={{ color: RED }}>Portfolio List</Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ bgcolor: "#ffebee" }}>
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
                        <TableCell colSpan={6} align="center">No images</TableCell>
                      </TableRow>
                    ) : (
                      portfolioList.map((item, i) => (
                        <TableRow key={item.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.title}</TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                              {item.media.slice(0, 3).map((url, idx) => (
                                <img
                                  key={idx}
                                  src={`${API_BASE_URL}/${url}`}
                                  style={{
                                    width: 70, height: 60,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    cursor: "pointer"
                                  }}
                                  onClick={() =>
                                    openFullscreen(
                                      item.media.map(u => ({ type: "image", url: u })),
                                      idx,
                                      false
                                    )
                                  }
                                />
                              ))}
                            </Box>
                          </TableCell>

                          <TableCell>{item.media.length}</TableCell>

                          <TableCell>
                            {item.tags.map((t, idx) => (
                              <Chip
                                key={idx}
                                size="small"
                                label={t}
                                sx={{ mr: 0.5, bgcolor: RED, color: "white" }}
                              />
                            ))}
                          </TableCell>

                          <TableCell>
                            <IconButton
                              onClick={() => handleDelete(item.id)}
                              sx={{ color: RED }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

            </CardContent>
          </>
        )}

        {/* VIDEOS TAB */}
        {tabValue === 1 && (
          <>
            <CardContent>
              <Typography variant="h6" sx={{ color: RED }}>Add Portfolio Videos</Typography>

              <TextField fullWidth label="Title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                sx={{ mb: 3 }}
              />

              <TextField fullWidth multiline rows={3} label="Description"
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Box sx={{ mb: 2 }}>
                {videoTags.map((t, i) => (
                  <Chip key={i} label={t}
                    onDelete={() =>
                      setVideoTags(prev => prev.filter((_, idx) => idx !== i))
                    }
                    sx={{ mr: 1, bgcolor: RED, color: "white" }}
                  />
                ))}
              </Box>

              <TextField fullWidth label="Add Tag (Enter)"
                value={videoTagInput}
                onChange={(e) => setVideoTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                    addTag(videoTagInput, setVideoTagInput, setVideoTags))
                }
                sx={{ mb: 3 }}
              />

              <Button variant="contained" component="label"
                startIcon={<CloudUpload />}
                sx={{ mb: 2, bgcolor: RED, '&:hover': { bgcolor: "#c62828" } }}
              >
                Upload Videos
                <input hidden type="file" multiple accept="video/*"
                  onChange={handleVideoFiles} />
              </Button>

              <Typography sx={{ my: 2 }}>Or add video links</Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField fullWidth label="Video Link"
                  value={videoLinkInput}
                  onChange={(e) => setVideoLinkInput(e.target.value)}
                />
                <Button variant="contained"
                  sx={{ bgcolor: RED, '&:hover': { bgcolor: "#c62828" } }}
                  onClick={addVideoLink}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                {videoLinks.map((l, i) => (
                  <Chip
                    key={i}
                    label={l}
                    onDelete={() => removeVideoLink(i)}
                    sx={{ mr: 1, mb: 1, bgcolor: RED, color: "white" }}
                  />
                ))}
              </Box>

              <Grid container spacing={2}>
                {videoFiles.map((vid, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Box sx={{ position: "relative" }}>
                      <video
                        src={vid.preview}
                        controls
                        style={{ width: "100%", height: 150, borderRadius: 8 }}
                      />
                      <IconButton size="small"
                        onClick={() => removeVideoFile(i)}
                        sx={{
                          position: "absolute", top: 4, right: 4,
                          bgcolor: RED, color: "white"
                        }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button fullWidth variant="contained"
                sx={{ mt: 4, bgcolor: RED, '&:hover': { bgcolor: "#c62828" } }}
                onClick={() =>
                  uploadMedia(
                    videoTitle, videoDesc, videoTags,
                    videoFiles, videoLinks,
                    setVideoTitle, setVideoDesc, setVideoTags,
                    setVideoFiles, setVideoLinks,
                    true
                  )
                }
              >
                Add Video
              </Button>
            </CardContent>

            <CardContent>
              <Typography variant="h6" sx={{ color: RED }}>Video List</Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ bgcolor: "#ffebee" }}>
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
                    {videoList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No videos</TableCell>
                      </TableRow>
                    ) : (
                      videoList.map((item, i) => (
                        <TableRow key={item.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.title}</TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {item.media.slice(0, 3).map((m, idx) => (
                                <Box
                                  key={idx}
                                  onClick={() => openFullscreen(item.media, idx, true)}
                                  sx={{
                                    width: 80, height: 60,
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    background: RED,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  {m.type === "videoLink" ? <LinkIcon /> : <VideoLibrary />}
                                </Box>
                              ))}
                            </Box>
                          </TableCell>

                          <TableCell>{item.media.length}</TableCell>

                          <TableCell>
                            {item.tags.map((t, idx) => (
                              <Chip
                                key={idx}
                                size="small"
                                label={t}
                                sx={{ mr: 0.5, bgcolor: RED, color: "white" }}
                              />
                            ))}
                          </TableCell>

                          <TableCell>
                            <IconButton
                              onClick={() => handleDelete(item.id)}
                              sx={{ color: RED }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>

                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

            </CardContent>
          </>
        )}
      </Card>

      {/* FULLSCREEN VIEW */}
      <Dialog open={mediaModalOpen} onClose={closeFullscreen} maxWidth="lg" fullWidth>
        <DialogContent
          sx={{
            bgcolor: "black",
            position: "relative",
            minHeight: "80vh",
            p: 0
          }}
        >
          <IconButton
            onClick={closeFullscreen}
            sx={{ position: "absolute", top: 10, right: 10, color: RED }}
          >
            <Close fontSize="large" />
          </IconButton>

          {isVideoMode ? (
            <iframe
              src={currentMediaUrls[currentIndex]}
              style={{ width: "100%", height: "75vh", border: "none" }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <img
              src={currentMediaUrls[currentIndex]}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
                margin: "auto"
              }}
            />
          )}

          {currentMediaUrls.length > 1 && (
            <>
              <IconButton
                onClick={prevMedia}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  color: RED,
                  bgcolor: "rgba(255,255,255,0.1)"
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>

              <IconButton
                onClick={nextMedia}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  color: RED,
                  bgcolor: "rgba(255,255,255,0.1)"
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>
            </>
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
}
