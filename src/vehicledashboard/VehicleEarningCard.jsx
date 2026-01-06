import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

export default function EarningCard({
  isLoading = false,
  amount = 0,
  label = 'Total Earnings',
  trend = 'up'
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const TrendIcon = trend === 'down' ? ArrowDownwardIcon : ArrowUpwardIcon;

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: '#E15B65',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: '#C2444E',
              borderRadius: '50%',
              top: -85,
              right: -95
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: '#fba7adff',
              borderRadius: '50%',
              top: -125,
              right: -15,
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              {/* ================= HEADER ================= */}
              <Grid container justifyContent="space-between">
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: '#cf2836ff',
                    mt: 1
                  }}
                >
                  <CardMedia
                    component="img"
                    src={EarningIcon}
                    alt="earning"
                    sx={{ width: 24, height: 24 }}
                  />
                </Avatar>

                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    bgcolor: '#ad2430ff',
                    cursor: 'pointer'
                  }}
                  onClick={handleClick}
                >
                  <MoreHorizIcon fontSize="inherit" />
                </Avatar>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleClose}>
                    <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive
                  </MenuItem>
                </Menu>
              </Grid>

              {/* ================= VALUE ================= */}
              <Grid container alignItems="center">
                <Typography
                  sx={{
                    fontSize: '2.125rem',
                    fontWeight: 500,
                    mr: 1,
                    mt: 1.75,
                    mb: 0.75
                  }}
                >
                  ₹{amount.toLocaleString()}
                </Typography>

                <Avatar
                  sx={{
                    ...theme.typography.smallAvatar,
                    bgcolor: '#f0c4c8ff',
                    color: 'secondary.dark'
                  }}
                >
                  <TrendIcon fontSize="inherit" />
                </Avatar>
              </Grid>

              {/* ================= LABEL ================= */}
              <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                {label}
              </Typography>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
  amount: PropTypes.number,
  label: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down'])
};
