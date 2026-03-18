import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

export default function BoutiqueEarningCard({ isLoading, totalEarnings = 0 }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            background: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            height: 190,
            boxShadow: '0 8px 32px 0 rgba(214, 48, 49, 0.3)',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              top: -85,
              right: -95,
              zIndex: 1
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '50%',
              top: -125,
              right: -15,
              zIndex: 1
            }
          }}
        >
          <Box sx={{ p: 2.25, position: 'relative', zIndex: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff'
                  }}
                >
                  <CardMedia
                    component="img"
                    src={EarningIcon}
                    alt="earning"
                    sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }}
                  />
                </Avatar>

                <IconButton
                  size="small"
                  onClick={handleClick}
                  sx={{ color: 'rgba(255, 255, 255, 0.8)', bgcolor: 'rgba(255, 255, 255, 0.1)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
                >
                  <MoreHorizIcon />
                </IconButton>

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
              </Stack>

              <Stack spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    sx={{
                      fontSize: '2.125rem',
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '-0.5px'
                    }}
                  >
                    ₹{Number(totalEarnings).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </Typography>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      color: '#fff'
                    }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: '0.875rem' }} />
                  </Avatar>
                </Stack>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Total Earnings
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </MainCard>
      )}
    </>
  );
}

BoutiqueEarningCard.propTypes = { isLoading: PropTypes.bool, totalEarnings: PropTypes.number };
