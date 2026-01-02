import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import MakeupAreaChartCard from './PhotoAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

export default function PopularCard({ isLoading }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
  <>
    {isLoading ? (
      <SkeletonPopularCard />
    ) : (
      <MainCard content={false}>
        <CardContent>
          <Grid container spacing={gridSpacing}>
            {/* ================= HEADER ================= */}
            <Grid xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                  <Typography variant="h4">Top Booked Photography Packages</Typography>
                </Grid>
                <Grid>
                  <IconButton size="small" sx={{ mt: -0.625 }}>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{ cursor: 'pointer' }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                  </IconButton>
                  <Menu
                    id="menu-popular-card"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleClose}>Today</MenuItem>
                    <MenuItem onClick={handleClose}>This Month</MenuItem>
                    <MenuItem onClick={handleClose}>This Year</MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Grid>

            {/* ================= CHART ================= */}
            <Grid xs={12} sx={{ mt: -1 }}>
              <MakeupAreaChartCard />
            </Grid>

            {/* ================= PACKAGE LIST ================= */}
            <Grid xs={12}>
              {/* PREMIUM */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Premium Photography Package</Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">1,839 bookings</Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'success.light',
                        color: 'success.dark'
                      }}
                    >
                      <KeyboardArrowUpOutlinedIcon fontSize="small" />
                    </Avatar>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                  +12% booking growth
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* SILVER */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Silver Photography Package</Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">100 bookings</Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'orange.light',
                        color: 'orange.dark'
                      }}
                    >
                      <KeyboardArrowDownOutlinedIcon fontSize="small" />
                    </Avatar>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ color: 'orange.dark' }}>
                  Reduced demand this period
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* PLATINUM */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Platinum Photography Package</Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">200 bookings</Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'success.light',
                        color: 'success.dark'
                      }}
                    >
                      <KeyboardArrowUpOutlinedIcon fontSize="small" />
                    </Avatar>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                  High-value client demand
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* DIAMOND */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Diamond Photography Package</Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">189 bookings</Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'orange.light',
                        color: 'orange.dark'
                      }}
                    >
                      <KeyboardArrowDownOutlinedIcon fontSize="small" />
                    </Avatar>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ color: 'orange.dark' }}>
                  Slight booking decline
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* BRONZE */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Bronze Photography Package</Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">189 bookings</Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'orange.light',
                        color: 'orange.dark'
                      }}
                    >
                      <KeyboardArrowDownOutlinedIcon fontSize="small" />
                    </Avatar>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ color: 'orange.dark' }}>
                  Low booking conversion rate
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        {/* ================= FOOTER ================= */}
        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
          <Button size="small" disableElevation>
            View All Photography Packages
            <ChevronRightOutlinedIcon />
          </Button>
        </CardActions>
      </MainCard>
    )}
  </>
);

}

PopularCard.propTypes = { isLoading: PropTypes.bool };
