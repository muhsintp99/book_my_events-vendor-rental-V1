import React, { useEffect, useState } from 'react';
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
    Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { CloudUpload, Delete, Close, Collections, VideoLibrary } from '@mui/icons-material';

import axios from 'axios';

const API_BASE = 'https://api.bookmyevent.ae';
const api = axios.create({ baseURL: API_BASE });
const PRIMARY_COLOR = '#0f172a';

export default function BouncersPortfolioManagement() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const providerId = user?._id;
    const moduleId = localStorage.getItem('moduleId');

    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);

    /* ---------- ADD STATES ---------- */
    const [addTab, setAddTab] = useState(0);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState('');
    // EDIT MODE
    const [editId, setEditId] = useState(null);
    const isEditMode = Boolean(editId);
    // EXISTING MEDIA (EDIT MODE)
    const [existingThumbnail, setExistingThumbnail] = useState(null);
    const [existingGallery, setExistingGallery] = useState([]);

    // images
    const [thumbnail, setThumbnail] = useState(null);
    const [gallery, setGallery] = useState([]);

    // videos
    const [videoFiles, setVideoFiles] = useState([]);
    const [videoLink, setVideoLink] = useState('');
    const [videoThumbnail, setVideoThumbnail] = useState(null);

    /* ---------- LIST ---------- */
    const [listTab, setListTab] = useState(0);
    const [portfolio, setPortfolio] = useState([]);

    /* ---------- MODALS ---------- */
    const [openGallery, setOpenGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [activeImage, setActiveImage] = useState(0);

    const [openVideo, setOpenVideo] = useState(false);
    const [activeVideo, setActiveVideo] = useState('');

    /* ================= SUBSCRIPTION ================= */
    useEffect(() => {
        if (!providerId || !moduleId) return;
        api.get(`/api/subscription/status/${providerId}?moduleId=${moduleId}`).then((res) => {
            const s = res.data?.subscription;
            setIsPremium(s?.status === 'active' && s?.isCurrent);
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

    const getYoutubeThumbnail = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
        return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
    };

    /* ================= ADD ================= */
    const addPortfolio = async () => {
        if (!isPremium) return alert('Upgrade plan required');
        if (!title.trim()) return alert('Title required');

        if (addTab === 1) {
            if (!videoFiles.length && !videoLink) {
                return alert('Please upload a video or add a video link');
            }
            if (!videoThumbnail) {
                return alert('Video thumbnail is required');
            }
        }

        const fd = new FormData();
        fd.append('providerId', providerId);
        fd.append('module', moduleId);
        fd.append('workTitle', title);
        fd.append('description', desc);
        fd.append('tags', tags);

        if (addTab === 0) {
            if (!thumbnail && !existingThumbnail) return alert('Thumbnail required');
            if (thumbnail) fd.append('thumbnail', thumbnail);
            gallery.forEach((g) => fd.append('images', g));
        } else {
            videoFiles.forEach((v) => fd.append('videos', v));
            if (videoLink) fd.append('videoLinks', JSON.stringify([videoLink]));
            if (videoThumbnail) fd.append('videoThumbnail', videoThumbnail);
        }

        setLoading(true);
        try {
            if (isEditMode) {
                await api.put(`/api/portfolio/${editId}`, fd);
            } else {
                await api.post('/api/portfolio', fd);
            }

            // reset
            setTitle('');
            setDesc('');
            setTags('');
            setThumbnail(null);
            setGallery([]);
            setVideoFiles([]);
            setVideoLink('');
            setVideoThumbnail(null);
            setEditId(null);
            setAddTab(0);
            setExistingThumbnail(null);
            setExistingGallery([]);

            fetchPortfolio();
        } catch (error) {
            console.error('Portfolio error:', error);
            alert('Failed to save portfolio');
        } finally {
            setLoading(false);
        }
    };


    /* ================= DELETE ================= */
    const remove = async (id) => {
        if (!window.confirm('Delete portfolio?')) return;
        await api.delete(`/api/portfolio/${id}`);
        fetchPortfolio();
    };

    const handleEdit = (p) => {
        setEditId(p._id);
        setTitle(p.workTitle || '');
        setDesc(p.description || '');
        setTags(p.tags || '');

        const imageMedia = p.media?.find((m) => m.type === 'image');
        const videoMedia = p.media?.find(
            (m) => m.type === 'video' || m.type === 'videoLink'
        );

        if (imageMedia) {
            setAddTab(0);
            setExistingThumbnail(imageMedia.thumbnail || null);
            setExistingGallery(imageMedia.gallery || []);
            setThumbnail(null);
            setGallery([]);
        }

        if (videoMedia) {
            setAddTab(1);
            setVideoFiles([]);
            setVideoLink(videoMedia.videoLinks?.[0] || '');
            setVideoThumbnail(null);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* ================= FILTER ================= */
    const filteredPortfolio =
        listTab === 0
            ? portfolio.filter((p) => p.media?.some((m) => m.type === 'image'))
            : portfolio.filter((p) => p.media?.some((m) => m.type === 'video' || m.type === 'videoLink'));

    return (
        <Box sx={{ p: 3, maxWidth: 1800, mx: 'auto' }}>
            {!isPremium && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Upgrade to premium to add portfolio works
                </Alert>
            )}

            {/* ================= ADD ================= */}
            <Card sx={{ mb: 5, borderRadius: 3, width: '100%' }}>
                <CardContent>
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        {isEditMode ? 'Edit Portfolio Work' : 'Add Portfolio Work'}
                    </Typography>

                    <Tabs
                        value={addTab}
                        onChange={(_, v) => setAddTab(v)}
                        sx={{
                            mb: 3,
                            '& .MuiTabs-indicator': { backgroundColor: PRIMARY_COLOR },
                            '& .MuiTab-root.Mui-selected': { color: PRIMARY_COLOR }
                        }}
                    >
                        <Tab label="Images" />
                        <Tab label="Videos" />
                    </Tabs>

                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 3 }} />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <TextField fullWidth label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} sx={{ mb: 4 }} />

                    {/* IMAGE TAB */}
                    {addTab === 0 && (
                        <>
                            <Button component="label" variant="contained" sx={{ bgcolor: PRIMARY_COLOR, mb: 2, '&:hover': { bgcolor: '#1e293b' } }}>
                                <CloudUpload sx={{ mr: 1 }} /> Upload Thumbnail
                                <input hidden type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                            </Button>

                            {/* EXISTING THUMBNAIL */}
                            {existingThumbnail && !thumbnail && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Current Thumbnail</Typography>
                                    <img
                                        src={`${API_BASE}/${existingThumbnail}`}
                                        style={{ width: 180, height: 180, borderRadius: 12, objectFit: 'cover' }}
                                    />
                                </Box>
                            )}

                            {/* NEW THUMBNAIL PREVIEW */}
                            {thumbnail && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>New Thumbnail</Typography>
                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        style={{ width: 180, height: 180, borderRadius: 12, objectFit: 'cover' }}
                                    />
                                </Box>
                            )}


                            <Button component="label" variant="outlined" sx={{ mb: 2, color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}>
                                <Collections sx={{ mr: 1 }} /> Upload Gallery Images
                                <input hidden multiple type="file" accept="image/*" onChange={(e) => setGallery([...e.target.files])} />
                            </Button>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                                {/* EXISTING GALLERY */}
                                {existingGallery.map((img, i) => (
                                    <img
                                        key={`existing-${i}`}
                                        src={`${API_BASE}/${img}`}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 10,
                                            objectFit: 'cover'
                                        }}
                                    />
                                ))}

                                {/* NEW UPLOADS */}
                                {gallery.map((g, i) => (
                                    <img
                                        key={`new-${i}`}
                                        src={URL.createObjectURL(g)}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 10,
                                            border: `2px solid ${PRIMARY_COLOR}`,
                                            objectFit: 'cover'
                                        }}
                                    />
                                ))}
                            </Box>

                        </>
                    )}

                    {/* VIDEO TAB */}
                    {addTab === 1 && (
                        <>
                            <Button component="label" variant="contained" sx={{ bgcolor: PRIMARY_COLOR, mb: 2, '&:hover': { bgcolor: '#1e293b' } }}>
                                <VideoLibrary sx={{ mr: 1 }} /> Upload Videos
                                <input hidden multiple type="file" accept="video/*" onChange={(e) => setVideoFiles(Array.from(e.target.files))} />
                            </Button>

                            {videoFiles.map((v, i) => (
                                <Box key={i} sx={{ mb: 2 }}>
                                    <video src={URL.createObjectURL(v)} controls style={{ width: 260, borderRadius: 8 }} />
                                    <IconButton color="error" onClick={() => setVideoFiles((prev) => prev.filter((_, idx) => idx !== i))}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            ))}

                            <Button component="label" variant="outlined" sx={{ mb: 2, color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}>
                                <CloudUpload sx={{ mr: 1 }} /> Upload Video Thumbnail
                                <input hidden type="file" accept="image/*" onChange={(e) => setVideoThumbnail(e.target.files[0])} />
                            </Button>

                            {videoThumbnail && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption">Video Thumbnail Preview</Typography>
                                    <img
                                        src={URL.createObjectURL(videoThumbnail)}
                                        style={{
                                            width: 160,
                                            height: 100,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            display: 'block',
                                            marginTop: 8
                                        }}
                                    />
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                label="Video Link (YouTube / Vimeo)"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                        </>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ bgcolor: PRIMARY_COLOR, py: 1.4, '&:hover': { bgcolor: '#1e293b' } }}
                        onClick={addPortfolio}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (isEditMode ? 'Update Portfolio' : 'Add Portfolio')}
                    </Button>

                </CardContent>
            </Card>

            {/* ================= LIST ================= */}
            <Tabs
                value={listTab}
                onChange={(_, v) => setListTab(v)}
                sx={{
                    mb: 2,
                    '& .MuiTabs-indicator': { backgroundColor: PRIMARY_COLOR },
                    '& .MuiTab-root.Mui-selected': { color: PRIMARY_COLOR }
                }}
            >
                <Tab label="Images" />
                <Tab label="Videos" />
            </Tabs>

            <TableContainer component={Paper} sx={{ borderRadius: 3, width: '100%' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                            <TableCell>Work</TableCell>
                            <TableCell>Preview</TableCell>
                            <TableCell align="center">Count</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredPortfolio.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="text.secondary">No portfolio items found</Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {filteredPortfolio.map((p) => {
                            const imageMedia = p.media.find((m) => m.type === 'image');
                            const videoMedia = p.media.find((m) => m.type === 'video' || m.type === 'videoLink');

                            return (
                                <TableRow key={p._id} hover>
                                    <TableCell>
                                        <Typography fontWeight={600}>{p.workTitle}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {p.description}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        {listTab === 0 && imageMedia && (
                                            <img
                                                src={`${API_BASE}/${imageMedia.thumbnail}`}
                                                style={{
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: 10,
                                                    cursor: 'pointer',
                                                    objectFit: 'cover'
                                                }}
                                                onClick={() => {
                                                    setGalleryImages(imageMedia.gallery || []);
                                                    setActiveImage(0);
                                                    setOpenGallery(true);
                                                }}
                                            />
                                        )}

                                        {listTab === 1 && videoMedia && (
                                            <Box
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    const src = videoMedia.videos?.[0] ? `${API_BASE}/${videoMedia.videos[0]}` : videoMedia.videoLinks?.[0];
                                                    setActiveVideo(src);
                                                    setOpenVideo(true);
                                                }}
                                            >
                                                {videoMedia.thumbnail && (
                                                    <img
                                                        src={`${API_BASE}/${videoMedia.thumbnail}`}
                                                        alt="video thumbnail"
                                                        style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }}
                                                    />
                                                )}

                                                {!videoMedia.videos?.length && videoMedia.videoLinks?.[0] && (
                                                    <img
                                                        src={getYoutubeThumbnail(videoMedia.videoLinks[0]) || '/video-placeholder.png'}
                                                        alt="video thumbnail"
                                                        style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }}
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {listTab === 0
                                            ? imageMedia?.gallery?.length || 0
                                            : (videoMedia?.videos?.length || 0) + (videoMedia?.videoLinks?.length || 0)}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <IconButton size="small" sx={{ color: PRIMARY_COLOR }} onClick={() => handleEdit(p)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => remove(p._id)}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ================= IMAGE GALLERY MODAL ================= */}
            <Dialog open={openGallery} onClose={() => setOpenGallery(false)} fullScreen>
                <Box sx={{ bgcolor: '#000', height: '100vh', p: 2 }}>
                    <IconButton onClick={() => setOpenGallery(false)} sx={{ color: '#fff' }}>
                        <Close />
                    </IconButton>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <img src={`${API_BASE}/${galleryImages[activeImage]}`} style={{ maxHeight: '70vh', maxWidth: '100%' }} />
                    </Box>

                    <Divider sx={{ my: 2, bgcolor: '#333' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {galleryImages.map((img, i) => (
                            <img
                                key={i}
                                src={`${API_BASE}/${img}`}
                                onClick={() => setActiveImage(i)}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 8,
                                    border: activeImage === i ? '2px solid #fff' : '1px solid #444',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Dialog>

            {/* ================= VIDEO MODAL ================= */}
            <Dialog open={openVideo} onClose={() => setOpenVideo(false)} fullScreen>
                <Box sx={{ bgcolor: '#000', height: '100vh', p: 2 }}>
                    <IconButton onClick={() => setOpenVideo(false)} sx={{ color: '#fff' }}>
                        <Close />
                    </IconButton>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                        {activeVideo?.includes('http') ? (
                            <iframe src={activeVideo} width="80%" height="80%" frameBorder="0" allowFullScreen />
                        ) : (
                            <video src={activeVideo} controls style={{ maxWidth: '80%' }} />
                        )}
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
}
