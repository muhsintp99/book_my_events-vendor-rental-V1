// ================= COMPLETE PORTFOLIO MANAGEMENT (FINAL FIXED VERSION) =================

import React, { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Dialog
} from "@mui/material";

import {
  CloudUpload,
  Delete,
  Close,
  VideoLibrary,
  Link as LinkIcon
} from "@mui/icons-material";

import axios from "axios";

const API_BASE = "https://api.bookmyevent.ae";
const api = axios.create({ baseURL: API_BASE });
const RED = "#e53935";

export default function PortfolioManagement() {
  /* ================= AUTH ================= */
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const providerId = user?._id;
  const moduleId = localStorage.getItem("moduleId");

  /* ================= STATE ================= */
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  // ADD SECTION
  const [addTab, setAddTab] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoLink, setVideoLink] = useState("");

  // LIST SECTION
  const [listTab, setListTab] = useState(0); // 0 = Images, 1 = Videos
  const [portfolioList, setPortfolioList] = useState([]);

  // GALLERY
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  /* ================= SUBSCRIPTION ================= */
  useEffect(() => {
    if (!providerId || !moduleId) return;

    api
      .get(`/api/subscription/status/${providerId}?moduleId=${moduleId}`)
      .then((res) => {
        const sub = res.data?.subscription;
        setIsPremium(sub?.status === "active" && sub?.isCurrent);
      })
      .catch(() => setIsPremium(false));
  }, [providerId, moduleId]);

  /* ================= FETCH PORTFOLIO ================= */
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    const res = await api.get(`/api/portfolio/provider/${providerId}`);
    setPortfolioList(res.data.data || []);
  };

  /* ================= ADD HANDLERS ================= */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((p) =>
      p.concat(files.map((f) => ({ file: f, preview: URL.createObjectURL(f) })))
    );
  };

  const uploadPortfolio = async (isVideo) => {
    if (!isPremium) return alert("Upgrade to premium");
    if (!title.trim()) return alert("Title required");

    const fd = new FormData();
    fd.append("providerId", providerId);
    fd.append("module", moduleId);
    fd.append("workTitle", title);
    fd.append("description", desc);
    fd.append("tags", tags);

    if (isVideo) {
      videoFiles.forEach((v) => fd.append("videos", v));
      if (videoLink) fd.append("videoLinks", JSON.stringify([videoLink]));
    } else {
      images.forEach((i) => fd.append("images", i.file));
    }

    setLoading(true);
    await api.post("/api/portfolio", fd);
    setLoading(false);

    // reset
    setTitle("");
    setDesc("");
    setTags("");
    setImages([]);
    setVideoFiles([]);
    setVideoLink("");

    fetchPortfolio();
  };

  /* ================= DELETE ================= */
  const deletePortfolio = async (id) => {
    if (!window.confirm("Delete portfolio?")) return;
    await api.delete(`/api/portfolio/${id}`);
    fetchPortfolio();
  };

  /* ================= GALLERY ================= */
  const openGallery = (imgs, index) => {
    setGalleryImages(imgs);
    setActiveImage(index);
    setGalleryOpen(true);
  };

  /* ================= FILTER LOGIC (THE FIX) ================= */
  const filteredPortfolioList = portfolioList.filter((p) => {
    if (listTab === 0) {
      // IMAGES TAB
      return p.media?.some((m) => m.type === "image");
    }
    if (listTab === 1) {
      // VIDEOS TAB
      return p.media?.some(
        (m) => m.type === "video" || m.type === "videoLink"
      );
    }
    return false;
  });

  return (
    <Box sx={{ p: 3 }}>
      {!isPremium && <Alert severity="warning">FREE PLAN</Alert>}

      {/* ================= ADD PORTFOLIO ================= */}
      <Card sx={{ mb: 4 }}>
        <Tabs value={addTab} onChange={(_, v) => setAddTab(v)}>
          <Tab label="Images" />
          <Tab label="Videos" />
        </Tabs>

        <CardContent>
          <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} sx={{ mb: 2 }} />

          {addTab === 0 && (
            <>
              <Button component="label" variant="contained" sx={{ bgcolor: RED }}>
                <CloudUpload sx={{ mr: 1 }} /> Upload Images
                <input hidden multiple type="file" accept="image/*" onChange={handleImages} />
              </Button>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {images.map((img, i) => (
                  <Grid item xs={3} key={i}>
                    <img src={img.preview} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                  </Grid>
                ))}
              </Grid>

              <Button fullWidth sx={{ mt: 3, bgcolor: RED }} variant="contained" onClick={() => uploadPortfolio(false)}>
                Add Portfolio
              </Button>
            </>
          )}

          {addTab === 1 && (
            <>
              <Button component="label" variant="contained" sx={{ bgcolor: RED }}>
                <VideoLibrary sx={{ mr: 1 }} /> Upload Videos
                <input hidden multiple type="file" accept="video/*" onChange={(e) => setVideoFiles([...e.target.files])} />
              </Button>

              <TextField fullWidth label="Video Link" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} sx={{ mt: 2 }} />

              <Button fullWidth sx={{ mt: 3, bgcolor: RED }} variant="contained" onClick={() => uploadPortfolio(true)}>
                Add Video
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* ================= LIST ================= */}
      <Tabs value={listTab} onChange={(_, v) => setListTab(v)} sx={{ mb: 2 }}>
        <Tab label="Images" />
        <Tab label="Videos" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#fdeaea" }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPortfolioList.map((p) => {
              const imgs = p.media?.find((m) => m.type === "image")?.images || [];

              return (
                <TableRow key={p._id}>
                  <TableCell>{p.workTitle}</TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {imgs.slice(0, 2).map((img, i) => (
                        <Box key={i} sx={{ position: "relative" }}>
                          <img
                            src={`${API_BASE}/${img}`}
                            style={{ width: 50, height: 50, objectFit: "cover", cursor: "pointer" }}
                            onClick={() => openGallery(imgs, i)}
                          />
                          {i === 1 && imgs.length > 2 && (
                            <Box
                              onClick={() => openGallery(imgs, i)}
                              sx={{
                                position: "absolute",
                                inset: 0,
                                bgcolor: "rgba(0,0,0,.6)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700
                              }}
                            >
                              +{imgs.length - 2}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell>{imgs.length}</TableCell>

                  <TableCell>
                    <IconButton color="error" onClick={() => deletePortfolio(p._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ================= GALLERY ================= */}
      <Dialog open={galleryOpen} onClose={() => setGalleryOpen(false)} fullScreen>
        <Box sx={{ bgcolor: "#000", height: "100vh", color: "#fff", p: 2 }}>
          <IconButton onClick={() => setGalleryOpen(false)} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <img src={`${API_BASE}/${galleryImages[activeImage]}`} style={{ maxHeight: "70vh", maxWidth: "100%" }} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={`${API_BASE}/${img}`}
                onClick={() => setActiveImage(i)}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  border: activeImage === i ? "2px solid #fff" : "1px solid #444",
                  cursor: "pointer"
                }}
              />
            ))}
          </Box>
        </Box>
      </Dialog>

      {loading && <CircularProgress />}
    </Box>
  );
}
