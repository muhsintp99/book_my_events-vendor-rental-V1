import React from 'react';
import { Box, Typography, TextField, MenuItem, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate } from 'react-router-dom';

const TripReport = () => {
  const navigate = useNavigate();
  const tripData = [
    {
      id: '100036',
      customer: 'Jhon\n+8***********',
      totalFare: 155.57,
      discount: 12.50,
      couponDiscount: 0.00,
      referralDiscount: 0.00,
      totalDiscounted: 12.50,
      tax: 94.43,
      additionalCharge: 10.00,
      totalTripAmount: 247.50,
      totalAmountReceivedBy: 'Not Received Yet',
      paymentMethod: '',
      tripStatus: 'Pending',
      actions: ['View', 'Print']
    },
    {
      id: '100035',
      customer: 'Jonathon Jack',
      totalFare: 15.56,
      discount: 1.25,
      couponDiscount: 0.00,
      referralDiscount: 0.00,
      totalDiscounted: 1.25,
      tax: 9.44,
      additionalCharge: 10.00,
      totalTripAmount: 33.75,
      totalAmountReceivedBy: 'Not Received Yet',
      paymentMethod: '',
      tripStatus: 'Confirmed',
      actions: ['View', 'Print']
    },
    {
      id: '100033',
      customer: 'MS 123',
      totalFare: 121.73,
      discount: 18.96,
      couponDiscount: 0.00,
      referralDiscount: 0.00,
      totalDiscounted: 18.96,
      tax: 67.83,
      additionalCharge: 10.00,
      totalTripAmount: 180.60,
      totalAmountReceivedBy: 'Not Received Yet',
      paymentMethod: '',
      tripStatus: 'Pending',
      actions: ['View', 'Print']
    },
    {
      id: '100031',
      customer: 'Jonathon Jack',
      totalFare: 121.73,
      discount: 18.96,
      couponDiscount: 0.00,
      referralDiscount: 0.00,
      totalDiscounted: 18.96,
      tax: 67.83,
      additionalCharge: 10.00,
      totalTripAmount: 180.60,
      totalAmountReceivedBy: 'Vendor',
      paymentMethod: 'Wallet',
      tripStatus: 'Completed',
      actions: ['View', 'Print']
    }
  ];
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, backgroundColor: 'white', borderRadius: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Typography variant="h6" sx={{ mr: 1 }}>📋 Trip Report</Typography>
        </Box>
      </Box>
   
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, backgroundColor: 'white', height: 70, borderRadius: 2, p: 2 }}>
        <TextField
          select
          label="Search Data"
          defaultValue="All Time"
          variant="outlined"
          sx={{ mr: 2, minWidth: 200, marginLeft: 2 }}
        >
          <MenuItem value="All Time">All Time</MenuItem>
          <MenuItem value="This year">This year</MenuItem>
          <MenuItem value="Previous year">Previous year</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="This week">This week</MenuItem>
          <MenuItem value="Custom">Custom</MenuItem>
        </TextField>
      </Box>
   
      <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', p: 2, borderRadius: 2, mb: 4 }}>
        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2, width: '18%', backgroundColor: '#f0f8ff' }}>
          <Typography variant="h6" sx={{ color: '#ff9800' }}>4</Typography>
          <Typography variant="body2">Total trips</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{ bgcolor: '#ffe0b2', borderRadius: '50%', p: 1 }}>
              <Typography>📝</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2, width: '18%', backgroundColor: '#e8f5e9' }}>
          <Typography variant="h6" sx={{ color: '#4caf50' }}>3</Typography>
          <Typography variant="body2">In progress trips <InfoIcon sx={{ fontSize: 16, color: '#4caf50' }} /></Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{ bgcolor: '#c8e6c9', borderRadius: '50%', p: 1 }}>
              <Typography>⏳</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2, width: '18%', backgroundColor: '#e0f7fa' }}>
          <Typography variant="h6" sx={{ color: '#0288d1' }}>0</Typography>
          <Typography variant="body2">Ongoing trips</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{ bgcolor: '#b2ebf2', borderRadius: '50%', p: 1 }}>
              <Typography>🚚</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2, width: '18%', backgroundColor: '#ffebee' }}>
          <Typography variant="h6" sx={{ color: '#f44336' }}>1</Typography>
          <Typography variant="body2">Completed trips</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{ bgcolor: '#ef9a9a', borderRadius: '50%', p: 1 }}>
              <Typography>✅</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2, width: '18%', backgroundColor: '#fce4ec' }}>
          <Typography variant="h6" sx={{ color: '#e91e63' }}>0</Typography>
          <Typography variant="body2">Canceled trips</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{ bgcolor: '#f8bbd0', borderRadius: '50%', p: 1 }}>
              <Typography>❌</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* New Trip Details Section */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Total Trips <span style={{ color: '#999', fontSize: '14px' }}>4</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search by Trip ID"
              variant="outlined"
              size="small"
              sx={{ width: 250 }}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" sx={{ bgcolor: '#1976d2', color: 'white', '&:hover': { bgcolor: '#1565c0' } }}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              sx={{ color: '#666', borderColor: '#ccc' }}
            >
              Export ▼
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Sl</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Trip Id</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Customer Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Total Fare Of Vehicle</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Discount On Vehicle</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Coupon Discount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Referral Discount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Total Discounted Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Tax</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Additional Charge</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Total Trip Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Total Amount Received By</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Trip Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', padding: '8px', whiteSpace: 'nowrap' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tripData.map((trip, index) => (
                <TableRow key={trip.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>
                    <Typography variant="body2" sx={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}>
                      {trip.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {trip.customer}
                    </Typography>
                    <Chip
                      label={trip.totalAmountReceivedBy === 'Not Received Yet' ? 'Unpaid' : 'Paid'}
                      size="small"
                      sx={{
                        bgcolor: trip.totalAmountReceivedBy === 'Not Received Yet' ? '#f44336' : '#4caf50',
                        color: 'white',
                        fontSize: '10px',
                        height: '20px',
                        marginTop: '4px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>${trip.totalFare.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>${trip.discount.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>${trip.couponDiscount.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>${trip.referralDiscount.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>${trip.totalDiscounted.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>${trip.tax.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>${trip.additionalCharge.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      ${trip.totalTripAmount.toFixed(2)}
                    </Typography>
                    <Chip
                      label={trip.totalAmountReceivedBy === 'Not Received Yet' ? 'Unpaid' : 'Paid'}
                      size="small"
                      sx={{
                        bgcolor: trip.totalAmountReceivedBy === 'Not Received Yet' ? '#f44336' : '#4caf50',
                        color: 'white',
                        fontSize: '10px',
                        height: '20px',
                        marginTop: '4px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>{trip.totalAmountReceivedBy}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>{trip.paymentMethod}</TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>
                    <Chip
                      label={trip.tripStatus}
                      size="small"
                      sx={{
                        bgcolor: trip.tripStatus === 'Pending' ? '#bbdefb' : trip.tripStatus === 'Confirmed' ? '#b2dfdb' : '#c8e6c9',
                        color: trip.tripStatus === 'Pending' ? '#1976d2' : trip.tripStatus === 'Confirmed' ? '#00695c' : '#2e7d32',
                        fontSize: '10px',
                        height: '20px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', padding: '8px' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                     <Button  onClick={() => navigate(`/report/tripdetail?id=${trip.id}`)}     variant="outlined" size="small" sx={{ color: '#1976d2', borderColor: '#1976d2' }}>
                                           {trip.actions}
                                         </Button>
                      <IconButton size="small" sx={{ color: '#4caf50' }}>
                        <PrintIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
export default TripReport;