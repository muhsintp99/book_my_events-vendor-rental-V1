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
    Stack,
    Tooltip,
    Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CloudUpload, Delete, Close, Collections, VideoLibrary, Visibility, Star } from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'https://api.bookmyevent.ae';
const api = axios.create({ baseURL: API_BASE });
const PRIMARY_COLOR = '#E15B65';

export default function InvitationPortfolio() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const providerId = user?.providerId || user?._id;
    const moduleId = localStorage.getItem('moduleId');

    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addTab, setAddTab] = useState(0);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState('');

    const [thumbnail, setThumbnail] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [videoLink, setVideoLink] = useState('');
    const [videoThumbnail, setVideoThumbnail] = useState(null);

    const [listTab, setListTab] = useState(0);
    const [portfolio, setPortfolio] = useState([]);
    const [openGallery, setOpenGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [activeImage, setActiveImage] = useState(0);

    /* ================= SUBSCRIPTION CHECK ================= */
    useEffect(() => {
        if (!providerId || !moduleId) return;
        api.get(`/api/subscription/status/${providerId}?moduleId=${moduleId}`).then((res) => {
            const s = res.data?.subscription;
            setIsPremium(s?.status === 'active' && s?.isCurrent);
        });
    }, [providerId, moduleId]);

    /* ================= FETCH PORTFOLIO ================= */
    const fetchPortfolio = async () => {
        try {
            const res = await api.get(`/api/portfolio/provider/${providerId}`);
            setPortfolio(res.data.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    useEffect(() => {
        if (providerId) fetchPortfolio();
    }, [providerId]);

    /* ================= ADD PORTFOLIO ================= */
    const addPortfolio = async () => {
        if (!isPremium) return alert('Upgrade to premium to unlock portfolio features');
        if (!title.trim()) return alert('Work title is required');

        const fd = new FormData();
        fd.append('providerId', providerId);
        fd.append('module', moduleId);
        fd.append('workTitle', title);
        fd.append('description', desc);
        fd.append('tags', tags);

        if (addTab === 0) {
            if (!thumbnail) return alert('Thumbnail image is required');
            fd.append('thumbnail', thumbnail);
            gallery.forEach((g) => fd.append('images', g));
        } else {
            videoFiles.forEach((v) => fd.append('videos', v));
            if (videoLink) fd.append('videoLinks', JSON.stringify([videoLink]));
            if (videoThumbnail) fd.append('videoThumbnail', videoThumbnail);
        }

        try {
            setLoading(true);
            await api.post('/api/portfolio', fd);
            setTitle(''); setDesc(''); setTags(''); setThumbnail(null); setGallery([]);
            setVideoFiles([]); setVideoLink(''); setVideoThumbnail(null);
            fetchPortfolio();
            alert('Portfolio work added successfully! ✨');
        } catch (err) {
            alert('Failed to add portfolio work');
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        if (window.confirm('Are you sure you want to delete this work?')) {
            await api.delete(`/api/portfolio/${id}`);
            fetchPortfolio();
        }
    };

    const filteredPortfolio = listTab === 0
        ? portfolio.filter(p => p.media?.some(m => m.type === 'image'))
        : portfolio.filter(p => p.media?.some(m => m.type === 'video' || m.type === 'videoLink'));

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: '#fdf6ee' }}>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#1a0a00' }}>
                        Work <Box component="span" sx={{ color: PRIMARY_COLOR }}>Portfolio</Box>
                    </Typography>
                    <Typography color="text.secondary">Showcase your invitation masterpieces to your clients.</Typography>
                </Box>
                {!isPremium && (
                    <Button variant="contained" color="warning" startIcon={<Star />} onClick={() => window.location.href = '/invitation/upgrade'}>
                        Unlock Premium
                    </Button>
                )}
            </Box>

            {/* Add New Section */}
            <Card sx={{ mb: 4, borderRadius: 3, border: `1px solid rgba(225, 91, 101, 0.1)` }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Add New Project</Typography>

                    <Tabs value={addTab} onChange={(_, v) => setAddTab(v)} sx={{ mb: 4, borderBottom: '1px solid #eee' }}>
                        <Tab label="Image Highlights" />
                        <Tab label="Video Showreel" />
                    </Tabs>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <Stack spacing={3}>
                                <TextField fullWidth label="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                <TextField fullWidth label="Description" multiline rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
                                <TextField fullWidth label="Search Tags (e.g., Wedding, Minimalist, Luxury)" value={tags} onChange={(e) => setTags(e.target.value)} />
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Box sx={{ p: 4, bgcolor: '#FFFBF7', borderRadius: '16px', border: '2px dashed rgba(225, 91, 101, 0.2)', textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', '&:hover': { borderColor: PRIMARY_COLOR, bgcolor: 'rgba(225, 91, 101, 0.04)' } }}>
                                {addTab === 0 ? (
                                    <Stack spacing={2} alignItems="center">
                                        <Stack direction="row" spacing={2}>
                                            <Button component="label" variant="contained" size="small" sx={{ bgcolor: PRIMARY_COLOR, borderRadius: '10px' }}>
                                                <CloudUpload sx={{ mr: 1, fontSize: 18 }} /> Thumbnail
                                                <input hidden type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                                            </Button>
                                            <Button component="label" variant="outlined" size="small" color="primary" sx={{ borderRadius: '10px' }}>
                                                <Collections sx={{ mr: 1, fontSize: 18 }} /> Add Gallery
                                                <input hidden multiple type="file" accept="image/*" onChange={(e) => setGallery([...e.target.files])} />
                                            </Button>
                                        </Stack>
                                        {(thumbnail || gallery.length > 0) ? (
                                            <Typography variant="caption" sx={{ color: PRIMARY_COLOR, fontWeight: 700 }}>
                                                {thumbnail ? '✓ Thumbnail' : ''} {gallery.length > 0 ? `• ${gallery.length} Images` : ''}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">Upload main thumbnail and project highlights</Typography>
                                        )}
                                    </Stack>
                                ) : (
                                    <Stack spacing={2} sx={{ width: '100%' }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Video Link (YouTube/Vimeo)"
                                            value={videoLink}
                                            onChange={(e) => setVideoLink(e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <Divider>
                                            <Typography variant="caption" color="text.secondary">OR</Typography>
                                        </Divider>
                                        <Button component="label" variant="outlined" size="small" color="primary" sx={{ borderRadius: '10px' }}>
                                            <VideoLibrary sx={{ mr: 1, fontSize: 18 }} /> Upload MP4 Video
                                            <input hidden multiple type="file" accept="video/*" onChange={(e) => setVideoFiles(Array.from(e.target.files))} />
                                        </Button>
                                        {videoFiles.length > 0 && <Typography variant="caption" color="primary">✓ {videoFiles.length} video selected</Typography>}
                                    </Stack>
                                )}
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                onClick={addPortfolio}
                                sx={{ mt: 2, py: 1.5, bgcolor: PRIMARY_COLOR, boxShadow: '0 8px 16px rgba(225, 91, 101, 0.2)', '&:hover': { bgcolor: '#C2444E' } }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish to Portfolio'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* List Section */}
            <Box sx={{ mt: 6 }}>
                <Tabs value={listTab} onChange={(_, v) => setListTab(v)} sx={{ mb: 3 }}>
                    <Tab label={`Images (${portfolio.filter(p => p.media?.some(m => m.type === 'image')).length})`} />
                    <Tab label={`Videos (${portfolio.filter(p => p.media?.some(m => m.type === 'video' || m.type === 'videoLink')).length})`} />
                </Tabs>

                <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #efefef' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fff9f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Project Details</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Preview</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Media Count</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPortfolio.length === 0 ? (
                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>No items added to this section.</TableCell></TableRow>
                            ) : (
                                filteredPortfolio.map((p) => {
                                    const imageMedia = p.media.find(m => m.type === 'image');
                                    return (
                                        <TableRow key={p._id} hover>
                                            <TableCell>
                                                <Typography variant="subtitle1" fontWeight={700}>{p.workTitle}</Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>{p.description}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                {listTab === 0 && imageMedia && (
                                                    <Box
                                                        component="img"
                                                        src={`${API_BASE}/${imageMedia.thumbnail}`}
                                                        sx={{ width: 80, height: 60, borderRadius: 2, objectFit: 'cover', cursor: 'pointer', border: '1px solid #eee' }}
                                                        onClick={() => { setGalleryImages(imageMedia.gallery || []); setActiveImage(0); setOpenGallery(true); }}
                                                    />
                                                )}
                                                {listTab === 1 && (
                                                    <IconButton color="primary"><Visibility /></IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {listTab === 0 ? imageMedia?.gallery?.length || 0 : p.media?.length || 0}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Tooltip title="Edit"><IconButton size="small"><EditIcon fontSize="small" /></IconButton></Tooltip>
                                                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => remove(p._id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Viewer Modal */}
            <Dialog open={openGallery} onClose={() => setOpenGallery(false)} maxWidth="lg">
                <Box sx={{ p: 2, bgcolor: '#000', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <IconButton onClick={() => setOpenGallery(false)} sx={{ color: '#fff' }}><Close /></IconButton>
                    </Box>
                    <Box component="img" src={`${API_BASE}/${galleryImages[activeImage]}`} sx={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 2 }} />
                    <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center', overflowX: 'auto', p: 1 }}>
                        {galleryImages.map((img, i) => (
                            <Box
                                key={i}
                                component="img"
                                src={`${API_BASE}/${img}`}
                                onClick={() => setActiveImage(i)}
                                sx={{ width: 60, height: 45, borderRadius: 1, cursor: 'pointer', opacity: activeImage === i ? 1 : 0.5, border: activeImage === i ? '2px solid #fff' : 'none' }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Dialog>

        </Box>
    );
}
