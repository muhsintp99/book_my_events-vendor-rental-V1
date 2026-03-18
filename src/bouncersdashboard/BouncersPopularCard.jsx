import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
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
import BouncersAreaChartCard from './BouncersAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

export default function BouncersPopularCard({ isLoading, enquiries = [] }) {
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
                Top Enquired Bouncers
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

            {/* Sparkline & Total Analytics at the Top */}
            <BouncersAreaChartCard totalEnquiries={enquiries.reduce((sum, e) => sum + e.count, 0)} />

            {/* Enquiry List Container */}
            <Box sx={{ mt: 2 }}>
              {enquiries.slice(0, 5).map((item, index) => (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                      px: 2,
                      borderRadius: '16px',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#fff0f0' }
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
                        {item.name || 'Bouncer Service'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#E15B65', fontWeight: 600 }}>
                          {item.count} enquiries received
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flexShrink: 0 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
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
                  {index < Math.min(enquiries.length - 1, 4) && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                </React.Fragment>
              ))}

              {enquiries.length === 0 && (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    No enquiry data available yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>

          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation sx={{ color: '#E15B65', fontWeight: 700 }}>
              View All Enquiries
              <ChevronRightOutlinedIcon sx={{ ml: 0.5, fontSize: 18 }} />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

BouncersPopularCard.propTypes = {
  isLoading: PropTypes.bool,
  enquiries: PropTypes.array
};
