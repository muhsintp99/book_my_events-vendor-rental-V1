import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

// project imports
import InvitationAreaChartCard from './InvitationAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

// ==============================|| INVITATION POPULAR CARD ||============================== //

export default function InvitationPopularCard({ isLoading, packages = [], totalPackageRevenue = 0 }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard
          content={false}
          sx={{
            boxShadow: '0 8px 32px 0 rgba(100, 116, 139, 0.05)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Top Booked Invitations
              </Typography>
              <IconButton onClick={handleClick} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#E15B65' } }}>
                <MoreHorizOutlinedIcon />
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
            </Box>

            {/* Sparkline & Total Revenue at the Top */}
            <InvitationAreaChartCard totalRevenue={totalPackageRevenue} />

            {/* Package List Container */}
            <Box sx={{ mt: 2 }}>
              {packages.slice(0, 5).map((pkg, index) => (
                <React.Fragment key={pkg.id || index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                      px: 2,
                      borderRadius: '16px',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#fff0f0' } // Light red hover
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: '#334155',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 0.5
                        }}
                      >
                        {pkg.name || 'Invitation Service'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#E15B65', fontWeight: 600 }}>
                          {pkg.bookings} packages booked
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flexShrink: 0 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.25 }}>
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                            Earned: ₹{(pkg.revenue || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ml: 2,
                          width: 28,
                          height: 28,
                          bgcolor: '#ecfdf5',
                          color: '#10b981'
                        }}
                      >
                        <KeyboardArrowUpOutlinedIcon fontSize="small" />
                      </Avatar>
                    </Box>
                  </Box>
                  {index < Math.min(packages.length - 1, 4) && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                </React.Fragment>
              ))}

              {packages.length === 0 && (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    No completed packages to display yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>

          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation sx={{ color: '#E15B65', fontWeight: 700 }}>
              View All Invitation Packages
              <ChevronRightOutlinedIcon sx={{ ml: 0.5, fontSize: 18 }} />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

InvitationPopularCard.propTypes = {
  isLoading: PropTypes.bool,
  packages: PropTypes.array,
  totalPackageRevenue: PropTypes.number
};
