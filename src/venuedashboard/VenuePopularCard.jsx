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
import VenueAreaChartCard from './VenueAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| VENUE POPULAR CARD ||============================== //

export default function VenuePopularCard({ isLoading, venues = [], totalVenueRevenue = 0 }) {
  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Top Booked Venues</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizIcon sx={{ color: 'grey.300', cursor: 'pointer' }} />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <VenueAreaChartCard title={`Venues ${formatCurrency(totalVenueRevenue)}`} />
              </Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                {venues.length === 0 ? (
                  <Box sx={{ py: 3, textAlign: 'center', opacity: 0.5 }}>
                    <Typography variant="body2">No data available</Typography>
                  </Box>
                ) : (
                  venues.map((venue, index) => (
                    <React.Fragment key={venue.id || index}>
                      <Grid container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 600 }}>
                                {venue.name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 700 }}>
                                  {formatCurrency(venue.revenue)}
                                </Typography>
                                {venue.revenue > 0 ? (
                                  <KeyboardArrowUpOutlinedIcon fontSize="small" sx={{ color: 'success.main' }} />
                                ) : (
                                  <KeyboardArrowUpOutlinedIcon fontSize="small" sx={{ color: 'success.main', opacity: 0.5 }} />
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle2" sx={{ color: 'success.dark', fontWeight: 600 }}>
                            {venue.bookings} bookings
                          </Typography>
                        </Grid>
                      </Grid>
                      {index !== venues.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </React.Fragment>
                  ))
                )}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation sx={{ textTransform: 'none', fontWeight: 600 }}>
              View All Venues
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

// Minimal placeholder icons
function MoreHorizIcon(props) {
  return (
    <Box component="span" sx={{ fontSize: 20, ...props.sx }}>
      •••
    </Box>
  );
}

VenuePopularCard.propTypes = {
  isLoading: PropTypes.bool,
  venues: PropTypes.array,
  totalVenueRevenue: PropTypes.number
};
