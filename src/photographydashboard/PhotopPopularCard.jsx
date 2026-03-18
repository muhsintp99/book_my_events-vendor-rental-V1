import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import PhotographyAreaChartCard from './PhotoAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

// ==============================|| PHOTOGRAPHY POPULAR PACKAGES CARD ||============================== //

export default function PhotographyPopularCard({
  isLoading = false,
  popularPackages = [],
  totalPackageRevenue = 0
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent sx={{ p: '24px !important' }}>
            <Stack spacing={3}>
              {/* ================= HEADER ================= */}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Top Booked Packages</Typography>
                <IconButton size="small" onClick={handleClick} sx={{ color: 'grey.500' }}>
                  <MoreHorizOutlinedIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleClose}>Today</MenuItem>
                  <MenuItem onClick={handleClose}>This Month</MenuItem>
                  <MenuItem onClick={handleClose}>This Year</MenuItem>
                </Menu>
              </Stack>

              {/* ================= CHART ================= */}
              <Box>
                <PhotographyAreaChartCard title="Package Revenue" amount={totalPackageRevenue} />
              </Box>

              {/* ================= PACKAGE LIST ================= */}
              <Stack spacing={2}>
                {popularPackages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                     <Typography variant="body2" color="textSecondary">No photography package data</Typography>
                  </Box>
                ) : (
                  popularPackages.map((item, index) => (
                    <Box key={index}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: 'success.main',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                             <KeyboardArrowUpOutlinedIcon sx={{ fontSize: '1rem' }} />
                             {item.bookings} bookings
                          </Typography>
                        </Stack>

                        <Stack alignItems="flex-end" spacing={0.5}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            ₹{Number(item.revenue || 0).toLocaleString('en-IN')}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                             Revenue
                          </Typography>
                        </Stack>
                      </Stack>
                      {index !== popularPackages.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))
                )}
              </Stack>
            </Stack>
          </CardContent>

          <CardActions sx={{ p: 1.5, pt: 0, justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Button size="small" color="primary" sx={{ fontWeight: 600, textTransform: 'none' }} endIcon={<ChevronRightOutlinedIcon />}>
               View Detailed Analysis
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

PhotographyPopularCard.propTypes = {
  isLoading: PropTypes.bool,
  popularPackages: PropTypes.array,
  totalPackageRevenue: PropTypes.number
};
