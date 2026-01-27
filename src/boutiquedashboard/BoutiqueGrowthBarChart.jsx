import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| CONSTANTS ||============================== //

const STATUS_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

// ==============================|| COMPONENT ||============================== //

export default function TotalGrowthBarChart({ isLoading }) {
  const theme = useTheme();
  const [value, setValue] = useState('today');

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            {/* HEADER */}
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Growth
                  </Typography>
                  <Typography variant="h3">₹0.00</Typography>
                </Grid>

                <Grid item>
                  <TextField
                    select
                    size="small"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            {/* EMPTY STATE (NO CHART) */}
            <Grid item xs={12}>
              <Box
                sx={{
                  height: 300,
                  borderRadius: 2,
                  border: `1px dashed ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.background.default
                }}
              >
                <Typography color="textSecondary">
                  No chart data available
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};
