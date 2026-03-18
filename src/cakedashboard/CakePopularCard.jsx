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
import CakeAreaChartCard from './CakeAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

/* ================= DEFAULT EMPTY DATA ================= */
const formatCurrency = (val) =>
  `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function CakePopularCard({ 
  isLoading = false, 
  title = 'Popular Cake Packages', 
  packages = [], 
  totalPackageRevenue = 0 
}) {
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
                    {title}
                  </Typography>
                </Grid>
              </Grid>

              {/* CHART */}
              <Grid item xs={12} sx={{ mt: -1 }}>
                <CakeAreaChartCard totalRevenue={totalPackageRevenue} />
              </Grid>

              {/* PACKAGE LIST */}
              {packages.length > 0 ? (
                packages.map((pkg, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12}>
                      <Grid container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs sx={{ minWidth: 0, pr: 1 }}>
                              <Typography 
                                variant="subtitle1" 
                                color="inherit"
                                sx={{ 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap'
                                }}
                              >
                                {pkg.name || 'Cake Package'}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Grid container alignItems="center" justifyContent="flex-end" sx={{ flexWrap: 'nowrap' }}>
                                <Grid item>
                                  <Typography variant="subtitle1" color="inherit">
                                    {formatCurrency(pkg.amount || pkg.revenue || pkg.price || 0)}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Avatar
                                    variant="rounded"
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '5px',
                                      bgcolor: pkg.amount > 0 || pkg.trend === 'up' ? '#b9f6ca' : '#ffe0b2',
                                      color: pkg.amount > 0 || pkg.trend === 'up' ? 'success.dark' : 'warning.dark',
                                      ml: 1.5
                                    }}
                                  >
                                    {pkg.amount > 0 || pkg.trend === 'up' ? (
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
                          <Typography 
                            variant="subtitle2" 
                            sx={{ color: pkg.amount > 0 || pkg.trend === 'up' ? 'success.dark' : 'warning.dark', mt: 0.5 }}
                          >
                            {pkg.note ? pkg.note : `${pkg.bookings} bookings`}
                          </Typography>
                        </Grid>
                      </Grid>
                      {index < packages.length - 1 && <Divider sx={{ my: 1.5 }} />}
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

CakePopularCard.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  packages: PropTypes.array,
  totalPackageRevenue: PropTypes.number
};
