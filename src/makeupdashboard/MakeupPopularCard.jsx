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

// project imports
import MakeupAreaChartCard from './MakeupAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// icons
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const formatCurrency = (val) =>
  `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PopularCard({ isLoading, popularPackages = [], totalPackageRevenue = 0 }) {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              {/* HEADER */}
              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="h4">
                    Popular Makeup Packages
                  </Typography>
                </Grid>
              </Grid>

              {/* CHART */}
              <Grid item xs={12} sx={{ mt: -1 }}>
                <MakeupAreaChartCard totalRevenue={totalPackageRevenue} />
              </Grid>

              {/* PACKAGE LIST */}
              {popularPackages.length > 0 ? (
                popularPackages.map((pkg, index) => (
                  <React.Fragment key={pkg.id || index}>
                    <Grid item xs={12}>
                      <Grid container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                {pkg.name || 'Makeup Package'}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                  <Typography variant="subtitle1" color="inherit">
                                    {formatCurrency(pkg.revenue || pkg.price || 0)}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Avatar
                                    variant="rounded"
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '5px',
                                      bgcolor: pkg.revenue > 0 ? '#b9f6ca' : '#ffe0b2',
                                      color: pkg.revenue > 0 ? 'success.dark' : 'warning.dark',
                                      ml: 2
                                    }}
                                  >
                                    {pkg.revenue > 0 ? (
                                      <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                    ) : (
                                      <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                                    )}
                                  </Avatar>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle2" sx={{ color: pkg.bookings > 0 ? 'success.dark' : 'warning.dark' }}>
                            {pkg.bookings} booking{pkg.bookings !== 1 ? 's' : ''}
                          </Typography>
                        </Grid>
                      </Grid>
                      {index < popularPackages.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </Grid>
                  </React.Fragment>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      No packages data available yet
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>

          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

PopularCard.propTypes = {
  isLoading: PropTypes.bool,
  popularPackages: PropTypes.array,
  totalPackageRevenue: PropTypes.number
};
