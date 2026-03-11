import React, { useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Modal, Menu, MenuItem, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchReviews = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const providerId = userData?.providerId || userData?._id;
      if (!providerId) return;

      const res = await fetch(`https://api.bookmyevent.ae/api/reviews/vendor/${providerId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review =>
    (review.targetType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (review.comment || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText(review.replyFromOwner || '');
    setOpenReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setOpenReplyModal(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const handleUpdateReply = async () => {
    if (selectedReview && replyText) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://api.bookmyevent.ae/api/reviews/${selectedReview._id}/reply`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ replyText })
        });
        const data = await res.json();
        if (data.success) {
          setUpdateMessage('Review reply updated');
          fetchReviews();
          setTimeout(() => setUpdateMessage(''), 3000);
          handleCloseReplyModal();
        }
      } catch (err) {
        console.error('Failed to update reply:', err);
      }
    }
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = (format) => {
    if (format) {
      const csv = reviews.map(review => Object.values(review).join(',')).join('\n');
      const blob = new Blob([csv], { type: format === 'CSV' ? 'text/csv' : format === 'Excel' ? 'application/vnd.ms-excel' : 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reviews.${format.toLowerCase()}`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ mr: 1 }}>
          <span role="img" aria-label="star">⭐</span> Customers Reviews
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Reviews {reviews.length}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Ex: Search by vehicle name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2 }}
        />
        <div>
          <Button
            variant="outlined" color='#E15B65'
            size="small"
            sx={{ textTransform: 'none', color: '#E15B65' }}
            onClick={handleExportClick}>
            Export
            <span style={{ marginLeft: '5px' }}>▼</span>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleExportClose(null)}>
            <MenuItem onClick={() => handleExportClose('PDF')}>PDF</MenuItem>
            <MenuItem onClick={() => handleExportClose('Excel')}>Excel</MenuItem>
            <MenuItem onClick={() => handleExportClose('CSV')}>CSV</MenuItem>
          </Menu>
        </div>
      </Box>
      {updateMessage && (
        <Box sx={{ position: 'fixed', top: 10, left: 0, right: 0, zIndex: 1000, mb: 2, p: 1, backgroundColor: '#2196F3', color: 'white', borderRadius: 1, textAlign: 'center' }}>
          {updateMessage}
        </Box>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="customer reviews table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Review Id</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Reviewer</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reply Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="error">No Data Found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review, index) => (
                <TableRow key={review.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{review._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>
                    {review.targetType}
                  </TableCell>
                  <TableCell>{review.user?.firstName} {review.user?.lastName}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
                      ))}
                      <Typography sx={{ ml: 1 }}>{review.comment}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{review.replyFromOwner ? new Date(review.repliedAt).toLocaleDateString() : 'Not replied Yet'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ReplyIcon />}
                      sx={{ textTransform: 'none', bgcolor: '#E15B65' }}
                      onClick={() => handleOpenReplyModal(review)}
                    >
                      {review.replyFromOwner ? 'View Reply' : 'Give Reply'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      <Modal open={openReplyModal} onClose={handleCloseReplyModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            bgcolor: '#fafafa'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              {selectedReview?.replyFromOwner ? 'Edit Reply' : 'Give Reply'}
            </Typography>
            <IconButton onClick={handleCloseReplyModal} size="small" sx={{ color: '#666' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Original Review Section */}
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: '#f8f9fa', 
              borderRadius: 2,
              border: '1px solid #eee'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#E15B65' }}>
                  {selectedReview?.user?.firstName} {selectedReview?.user?.lastName}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      sx={{ 
                        color: i < (selectedReview?.rating || 0) ? '#FFD700' : '#e0e0e0', 
                        fontSize: 16 
                      }} 
                    />
                  ))}
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic' }}>
                "{selectedReview?.comment}"
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#999' }}>
                Service: {selectedReview?.targetType} • {selectedReview && new Date(selectedReview.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            {/* Reply Section */}
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Your Response
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white'
                }
              }}
            />

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                onClick={handleCloseReplyModal}
                sx={{ 
                  textTransform: 'none', 
                  color: '#666',
                  borderRadius: 2
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdateReply}
                disabled={!replyText.trim() || replyText === selectedReview?.replyFromOwner}
                sx={{ 
                  textTransform: 'none', 
                  backgroundColor: '#E15B65',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#d14a54'
                  }
                }}
              >
                {selectedReview?.replyFromOwner ? 'Update Reply' : 'Send Reply'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Review;