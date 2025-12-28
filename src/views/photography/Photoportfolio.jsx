import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  Divider,
  Tabs,
  Tab
} from "@mui/material";

import {
  CloudUpload,
  Delete,
  Close,
  Collections,
  VideoLibrary
} from "@mui/icons-material";

import axios from "axios";

const API_BASE = "https://api.bookmyevent.ae";
const api = axios.create({ baseURL: API_BASE });
const RED = "#e53935";

export default function PortfolioManagement() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const providerId = user?._id;
  const moduleId = localStorage.getItem("moduleId");

  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- ADD STATES ---------- */
  const [addTab, setAddTab] = useState(0); // 0 = images, 1 = videos
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  // images
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);

  // videos
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoLink, setVideoLink] = useState("");

  /* ---------- LIST STATES ---------- */
  const [listTab, setListTab] = useState(0); // 0 = images, 1 = videos
  const [portfolio, setPortfolio] = useState([]);

  /* ---------- MODALS ---------- */
  const [openGallery, setOpenGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  const [openVideo, setOpenVideo] = useState(false);
  const [activeVideo, setActiveVideo] = useState("");

  /* ================= SUBSCRIPTION ================= */
  useEffect(() => {
    if (!providerId || !moduleId) return;
    api
      .get(`/api/subscription/status/${providerId}?moduleId=${moduleId}`)
      .then((res) => {
        const s = res.data?.subscription;
        setIsPremium(s?.status === "active" && s?.isCurrent);
      });
  }, [providerId, moduleId]);

  /* ================= FETCH ================= */
  const fetchPortfolio = async () => {
    const res = await api.get(`/api/portfolio/provider/${providerId}`);
    setPortfolio(res.data.data || []);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  /* ================= ADD ================= */
  const addPortfolio = async () => {
    if (!isPremium) return alert("Upgrade plan required");
    if (!title.trim()) return alert("Title required");

    const fd = new FormData();
    fd.append("providerId", providerId);
    fd.append("module", moduleId);
    fd.append("workTitle", title);
    fd.append("description", desc);
    fd.append("tags", tags);

    if (addTab === 0) {
      if (!thumbnail) return alert("Thumbnail required");
      fd.append("thumbnail", thumbnail);
      gallery.forEach((g) => fd.append("images", g));
    } else {
      videoFiles.forEach((v) => fd.append("videos", v));
      if (videoLink) fd.append("videoLinks", JSON.stringify([videoLink]));
    }

    setLoading(true);
    await api.post("/api/portfolio", fd);
    setLoading(false);

    // reset
    setTitle("");
    setDesc("");
    setTags("");
    setThumbnail(null);
    setGallery([]);
    setVideoFiles([]);
    setVideoLink("");

    fetchPortfolio();
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Delete portfolio?")) return;
    await api.delete(`/api/portfolio/${id}`);
    fetchPortfolio();
  };

  /* ================= FILTER LIST ================= */
  const filteredPortfolio =
    listTab === 0
      ? portfolio.filter((p) => p.media?.some((m) => m.type === "image"))
      : portfolio.filter((p) =>
          p.media?.some(
            (m) => m.type === "video" || m.type === "videoLink"
          )
        );

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: "auto" }}>
      {!isPremium && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Upgrade to premium to add portfolio works
        </Alert>
      )}

      {/* ================= ADD PORTFOLIO ================= */}
<Card sx={{ mb: 5, borderRadius: 3, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Add Portfolio Work
          </Typography>

          <Tabs value={addTab} onChange={(_, v) => setAddTab(v)} sx={{ mb: 3 }}>
            <Tab label="Images" />
            <Tab label="Videos" />
          </Tabs>

          <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 3 }} />
          <TextField fullWidth multiline rows={3} label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} sx={{ mb: 3 }} />
          <TextField fullWidth label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} sx={{ mb: 4 }} />

          {/* ---------- IMAGE TAB ---------- */}
          {addTab === 0 && (
            <>
              <Button component="label" variant="contained" sx={{ bgcolor: RED, mb: 2 }}>
                <CloudUpload sx={{ mr: 1 }} /> Upload Thumbnail
                <input hidden type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
              </Button>

              {thumbnail && (
                <Box sx={{ mb: 3 }}>
                  <img src={URL.createObjectURL(thumbnail)} style={{ width: 180, height: 180, objectFit: "cover", borderRadius: 12 }} />
                </Box>
              )}

              <Button component="label" variant="outlined" sx={{ mb: 2 }}>
                <Collections sx={{ mr: 1 }} /> Upload Gallery Images
                <input hidden multiple type="file" accept="image/*" onChange={(e) => setGallery([...e.target.files])} />
              </Button>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
                {gallery.map((g, i) => (
                  <img key={i} src={URL.createObjectURL(g)} style={{ width: 100, height: 100, borderRadius: 10 }} />
                ))}
              </Box>
            </>
          )}

          {/* ---------- VIDEO TAB ---------- */}
          {addTab === 1 && (
            <>
              <Button component="label" variant="contained" sx={{ bgcolor: RED, mb: 2 }}>
                <VideoLibrary sx={{ mr: 1 }} /> Upload Videos
                <input hidden multiple type="file" accept="video/*" onChange={(e) => setVideoFiles([...e.target.files])} />
              </Button>

              <TextField
                fullWidth
                label="Video Link (YouTube / Vimeo)"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                sx={{ mb: 3 }}
              />
            </>
          )}

          <Button fullWidth variant="contained" sx={{ bgcolor: RED, py: 1.4 }} onClick={addPortfolio}>
            Add Portfolio
          </Button>
        </CardContent>
      </Card>

      {/* ================= LIST ================= */}
      <Tabs value={listTab} onChange={(_, v) => setListTab(v)} sx={{ mb: 2 }}>
        <Tab label="Images" />
        <Tab label="Videos" />
      </Tabs>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fdeaea" }}>
            <TableRow>
              <TableCell>Work</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell align="center">Count</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPortfolio.map((p) => {
              const imageMedia = p.media.find((m) => m.type === "image");
              const videoMedia = p.media.find(
                (m) => m.type === "video" || m.type === "videoLink"
              );

              return (
                <TableRow key={p._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{p.workTitle}</Typography>
                    <Typography variant="caption">{p.description}</Typography>
                  </TableCell>

                  <TableCell>
                    {listTab === 0 && imageMedia && (
                      <img
                        src={`${API_BASE}/${imageMedia.thumbnail}`}
                        style={{ width: 70, height: 70, borderRadius: 10, cursor: "pointer" }}
                        onClick={() => {
                          setGalleryImages(imageMedia.gallery || []);
                          setActiveImage(0);
                          setOpenGallery(true);
                        }}
                      />
                    )}

                    {listTab === 1 && videoMedia && (
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const src =
                            videoMedia.videos?.[0]
                              ? `${API_BASE}/${videoMedia.videos[0]}`
                              : videoMedia.videoLinks?.[0];
                          setActiveVideo(src);
                          setOpenVideo(true);
                        }}
                      >
                        <VideoLibrary />
                      </IconButton>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {listTab === 0
                      ? imageMedia?.gallery?.length || 0
                      : (videoMedia?.videos?.length || 0) +
                        (videoMedia?.videoLinks?.length || 0)}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton color="error" onClick={() => remove(p._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ================= GALLERY MODAL ================= */}
      <Dialog open={openGallery} onClose={() => setOpenGallery(false)} fullScreen>
        <Box sx={{ bgcolor: "#000", height: "100vh", p: 2 }}>
          <IconButton onClick={() => setOpenGallery(false)} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <img src={`${API_BASE}/${galleryImages[activeImage]}`} style={{ maxHeight: "70vh", maxWidth: "100%" }} />
          </Box>

          <Divider sx={{ my: 2, bgcolor: "#333" }} />

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={`${API_BASE}/${img}`}
                onClick={() => setActiveImage(i)}
                style={{
                  width: 60,
                  height: 60,
                  border: activeImage === i ? "2px solid #fff" : "1px solid #444",
                  cursor: "pointer"
                }}
              />
            ))}
          </Box>
        </Box>
      </Dialog>

      {/* ================= VIDEO MODAL ================= */}
      <Dialog open={openVideo} onClose={() => setOpenVideo(false)} fullScreen>
        <Box sx={{ bgcolor: "#000", height: "100vh", p: 2 }}>
          <IconButton onClick={() => setOpenVideo(false)} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80%" }}>
            {activeVideo?.includes("http") ? (
              <iframe src={activeVideo} width="80%" height="80%" frameBorder="0" allowFullScreen />
            ) : (
              <video src={activeVideo} controls style={{ maxWidth: "80%" }} />
            )}
          </Box>
        </Box>
      </Dialog>

      {loading && <CircularProgress />}
    </Box>
  );
}
