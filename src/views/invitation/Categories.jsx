import { useState, useEffect } from 'react';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Box,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    Stack,
    IconButton,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
    Avatar,
    Divider,
    InputAdornment
} from '@mui/material';
import {
    Add,
    Delete,
    Category,
    AutoAwesome,
    BookmarkBorder,
    Label,
    Search,
    FilterList
} from '@mui/icons-material';

// ── Theme ─────────────────────────────────────────────────
const theme = createTheme({
    palette: {
        primary: { main: '#E15B65', dark: '#C2444E', light: '#F09898', contrastText: '#fff' },
        secondary: { main: '#D4A017' },
        background: { default: '#FDF6EE', paper: '#fff' },
        text: { primary: '#1A0A00', secondary: '#7A5C4A' }
    },
    typography: {
        fontFamily: "'DM Sans', sans-serif",
        h4: { fontFamily: "'Playfair Display', serif" }
    },
    shape: { borderRadius: 14 }
});

export default function InvitationCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.bookmyevent.ae';
    const moduleId = localStorage.getItem('moduleId');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/invitation/categories?moduleId=${moduleId}`);
            const data = await res.json();
            if (data.success) setCategories(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (moduleId) fetchCategories();
    }, [moduleId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            setBusy(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/invitation/categories/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategory, moduleId })
            });
            const data = await res.json();
            if (data.success) {
                setSnack({ open: true, msg: 'Category added! ✨', severity: 'success' });
                setCategories([...categories, data.data]);
                setNewCategory('');
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setSnack({ open: true, msg: err.message, severity: 'error' });
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/invitation/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSnack({ open: true, msg: 'Category removed', severity: 'success' });
                setCategories(categories.filter(c => c._id !== id));
            }
        } catch (err) {
            setSnack({ open: true, msg: 'Failed to delete category', severity: 'error' });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ width: '100%', bgcolor: '#FDF6EE', minHeight: '100%', p: { xs: 2.5, sm: 4 } }}>

                <Box sx={{ mb: 4.5 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.6rem', sm: '2rem' } }}>
                        Design{' '}
                        <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                            Categories
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Organize your invitation styles and printing methods.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Add Category Form */}
                    <Grid item xs={12} md={5}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(225, 91, 101, 0.1)', boxShadow: '0 4px 20px rgba(225, 91, 101, 0.05)' }}>
                            <Stack spacing={2.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(225, 91, 101, 0.1)', color: 'primary.main', width: 40, height: 40 }}>
                                        <Add />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight={700}>Create Category</Typography>
                                </Box>

                                <Box component="form" onSubmit={handleAdd}>
                                    <TextField
                                        fullWidth
                                        label="Category Name"
                                        placeholder="e.g. Traditional, Minimalist, Luxury..."
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        sx={{ mb: 2.5 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Label color="primary" fontSize="small" /></InputAdornment>
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        disabled={busy || !newCategory.trim()}
                                        startIcon={busy ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #E15B65 0%, #C2444E 100%)',
                                            boxShadow: '0 6px 12px rgba(225, 91, 101, 0.2)'
                                        }}
                                    >
                                        {busy ? 'Adding...' : 'Add Category'}
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Categories List */}
                    <Grid item xs={12} md={7}>
                        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#fff' }}>
                            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#FFFBF7', borderBottom: '1px solid rgba(225, 91, 101,0.08)' }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FilterList fontSize="small" color="primary" /> Available Styles
                                </Typography>
                                <Chip label={`${categories.length} Styles`} size="small" sx={{ fontWeight: 700, color: '#E15B65', bgcolor: 'rgba(225, 91, 101, 0.1)' }} />
                            </Box>

                            <Box sx={{ maxHeight: '450px', overflowY: 'auto', p: 1 }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress color="primary" /></Box>
                                ) : categories.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                                        <Category sx={{ fontSize: 40, mb: 1.5, color: '#ccc' }} />
                                        <Typography variant="body2" color="text.secondary">No categories created yet.</Typography>
                                    </Box>
                                ) : (
                                    <Stack divider={<Divider sx={{ opacity: 0.4 }} />}>
                                        {categories.map((cat, idx) => (
                                            <Box key={cat._id} sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: '#FFFBF7' }
                                            }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography sx={{ color: 'primary.light', fontWeight: 800, fontSize: '0.9rem', width: 24 }}>0{idx + 1}</Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>{cat.name}</Typography>
                                                </Stack>
                                                <IconButton size="small" onClick={() => handleDelete(cat._id)} sx={{ color: 'grey.400', '&:hover': { color: '#dc2626', bgcolor: 'rgba(220, 38, 38, 0.05)' } }}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 3 }}>{snack.msg}</Alert>
                </Snackbar>

            </Box>
        </ThemeProvider>
    );
}
