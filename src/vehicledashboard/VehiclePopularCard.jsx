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
import VehicleAreaChartCard from './VehicleAreaChartCard';
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
                  <Typography variant="h4">Top Booked Vehicles</Typography>
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
              <VehicleAreaChartCard />
            </Grid>

            {/* ================= VEHICLE LIST ================= */}
            <Grid xs={12}>
              {/* TOYOTA */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Toyota Fleet</Typography>
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
                  +10% booking growth
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* BMW */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">BMW Fleet</Typography>
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
                  -10% demand drop
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* AUDI */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Audi Fleet</Typography>
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
                  +8% booking growth
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* VOLKSWAGEN */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Volkswagen Fleet</Typography>
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
                  Slight decline this period
                </Typography>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* HYUNDAI */}
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Hyundai Fleet</Typography>
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
                  Low utilization rate
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        {/* ================= FOOTER ================= */}
        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
          <Button size="small" disableElevation>
            View All Vehicles
            <ChevronRightOutlinedIcon />
          </Button>
        </CardActions>
      </MainCard>
    )}
  </>
);

}

PopularCard.propTypes = { isLoading: PropTypes.bool };
