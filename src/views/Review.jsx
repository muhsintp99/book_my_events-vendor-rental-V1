import React, { useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Modal, Menu, MenuItem } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Review = () => {
  const [reviews, setReviews] = useState([
    {
      id: 100031,
      vehicle: 'Mercedes-B... Trip ID #100031',
      reviewer: 'Jonathan Jack +8************',
      rating: 5,
      review: 'Booked a luxury car for a business event, and it was top-notch. The car was cle...',
      date: '06 Feb 2025 05:23:pm',
      replyDate: 'Not replied Yet',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const filteredReviews = reviews.filter(review =>
    review.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText(review.replyDate !== 'Not replied Yet' ? 'Reply updated on ' + review.replyDate : '');
    setOpenReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setOpenReplyModal(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const handleUpdateReply = () => {
    if (selectedReview && replyText) {
      const updatedReviews = reviews.map(review =>
        review.id === selectedReview.id ? { ...review, replyDate: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) } : review
      );
      setReviews(updatedReviews);
      setUpdateMessage('Review reply updated');
      setTimeout(() => setUpdateMessage(''), 3000);
      handleCloseReplyModal();
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
            sx={{ textTransform: 'none',color:'#E15B65' }}
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
                  <TableCell>{review.id}</TableCell>
                  <TableCell>
                    <img
                      src="https://via.placeholder.com/50"
                      alt={review.vehicle}
                      style={{ marginRight: '10px', verticalAlign: 'middle' }}
                    />
                    {review.vehicle}
                  </TableCell>
                  <TableCell>{review.reviewer}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
                      ))}
                      <Typography sx={{ ml: 1 }}>{review.review}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>{review.replyDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ReplyIcon />}
                      sx={{ textTransform: 'none', bgcolor:'#E15B65' }}
                      onClick={() => handleOpenReplyModal(review)}
                    >
                      {review.replyDate !== 'Not replied Yet' ? 'View Reply' : 'Give Reply'}
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
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseReplyModal} sx={{ minWidth: 'auto' }}>
              <CloseIcon />
            </Button>
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <img
              src="https://via.placeholder.com/50"
              alt={selectedReview?.vehicle}
              style={{ marginRight: '10px', verticalAlign: 'middle' }}
            />
            <Typography variant="h6">{selectedReview?.vehicle}</Typography>
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            {/* <Typography sx={{ mr: 1 }}>{selectedReview?.reviewer}</Typography> */}
            <Box sx={{ display: 'flex' }}>
              {[...Array(selectedReview?.rating)].map((_, i) => (
                <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
              ))}
            </Box>
          </Box>
          <Typography sx={{ mb: 2 }}>{selectedReview?.review}</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              readOnly: selectedReview?.replyDate !== 'Not replied Yet',
            }}
            placeholder={selectedReview?.replyDate !== 'Not replied Yet' ? '' : 'Write your reply here'}
          />
          {selectedReview?.replyDate === 'Not replied Yet' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateReply}
              sx={{ alignSelf: 'flex-end', textTransform: 'none', backgroundColor:'#E15B65' }}
            >
              Update Reply
            </Button>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Review;