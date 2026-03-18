import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

// project imports
import VehicleAreaChartCard from './VehicleAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// icons
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const formatCurrency = (val) =>
  `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default function PopularCard({ isLoading, vehicles = [], totalVehicleRevenue = 0 }) {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent sx={{ p: 2, pb: '12px !important' }}>
            <Grid container spacing={2}>
              {/* HEADER */}
              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Popular Vehicles
                  </Typography>
                </Grid>
              </Grid>

              {/* CHART */}
              <Grid item xs={12} sx={{ mt: -0.5 }}>
                <VehicleAreaChartCard totalRevenue={totalVehicleRevenue} />
              </Grid>

              {/* VEHICLE LIST */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                {vehicles.length > 0 ? (
                  vehicles.map((v, index) => (
                    <React.Fragment key={v.id || index}>
                      <Grid container direction="column" sx={{ mb: 1.5 }}>
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {v.name || 'Vehicle'}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                  {formatCurrency(v.revenue || v.price || 0)}
                                </Typography>
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: '4px',
                                    bgcolor: (v.revenue > 0 || v.bookings > 0) ? '#b9f6ca' : '#ffe0b2',
                                    color: (v.revenue > 0 || v.bookings > 0) ? 'success.dark' : 'warning.dark'
                                  }}
                                >
                                  {(v.revenue > 0 || v.bookings > 0) ? (
                                    <KeyboardArrowUpOutlinedIcon fontSize="inherit" />
                                  ) : (
                                    <KeyboardArrowDownOutlinedIcon fontSize="inherit" />
                                  )}
                                </Avatar>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Typography variant="caption" sx={{ color: v.bookings > 0 ? 'success.dark' : 'warning.dark', fontWeight: 600 }}>
                            {v.bookings} rental{v.bookings !== 1 ? 's' : ''}
                          </Typography>
                        </Grid>
                        {index < vehicles.length - 1 && <Divider sx={{ mt: 1.5, mb: 1 }} />}
                      </Grid>
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      No vehicle data available
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>

          <CardActions sx={{ p: 1, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation sx={{ textTransform: 'none', fontWeight: 700 }}>
              View All
              <ChevronRightOutlinedIcon sx={{ ml: 0.5 }} />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}


PopularCard.propTypes = {
  isLoading: PropTypes.bool,
  vehicles: PropTypes.array,
  totalVehicleRevenue: PropTypes.number
};
