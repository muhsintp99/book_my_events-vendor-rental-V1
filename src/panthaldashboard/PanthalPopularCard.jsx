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
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import PanthalAreaChartCard from './PanthalAreaChartCard';
import PanthalAreaChartConfig from './chartdata/Panthal-areachart';

/* ================= DEFAULT DATA ================= */
const defaultPackages = [
    {
        name: 'Premium Event Hosting',
        amount: 8000,
        trend: 'up',
        note: '+12% booking growth'
    },
    {
        name: 'Corporate MC Package',
        amount: 5500,
        trend: 'up',
        note: '+8% demand growth'
    },
    {
        name: 'Wedding Panthal Special',
        amount: 12000,
        trend: 'down',
        note: '-3% seasonal decline'
    }
];

export default function PanthalPopularCard({
    isLoading = false,
    title = 'Top Booked Panthals',
    packages = defaultPackages
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

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
                                    <Typography variant="h4">{title}</Typography>

                                    <IconButton size="small" onClick={handleClick}>
                                        <MoreHorizOutlinedIcon fontSize="small" />
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
                                </Grid>
                            </Grid>

                            {/* ================= CHART ================= */}
                            <Grid xs={12} sx={{ mt: -1 }}>
                                <PanthalAreaChartCard chartConfig={PanthalAreaChartConfig} />
                            </Grid>

                            {/* ================= PACKAGE LIST ================= */}
                            <Grid xs={12}>
                                {packages.length === 0 ? (
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ textAlign: 'center', py: 2 }}
                                    >
                                        No package data available
                                    </Typography>
                                ) : (
                                    packages.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <Grid container direction="column">
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Typography variant="subtitle1">
                                                        {item.name}
                                                    </Typography>

                                                    <Grid container alignItems="center" spacing={1} sx={{ width: 'auto' }}>
                                                        <Typography variant="subtitle1">
                                                            ₹{item.amount.toLocaleString()}
                                                        </Typography>

                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                bgcolor:
                                                                    item.trend === 'up'
                                                                        ? 'success.light'
                                                                        : 'orange.light',
                                                                color:
                                                                    item.trend === 'up'
                                                                        ? 'success.dark'
                                                                        : 'orange.dark'
                                                            }}
                                                        >
                                                            {item.trend === 'up' ? (
                                                                <KeyboardArrowUpOutlinedIcon fontSize="small" />
                                                            ) : (
                                                                <KeyboardArrowDownOutlinedIcon fontSize="small" />
                                                            )}
                                                        </Avatar>
                                                    </Grid>
                                                </Grid>

                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        color:
                                                            item.trend === 'up'
                                                                ? 'success.dark'
                                                                : 'orange.dark'
                                                    }}
                                                >
                                                    {item.note}
                                                </Typography>
                                            </Grid>

                                            {index !== packages.length - 1 && (
                                                <Divider sx={{ my: 1.5 }} />
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>

                    {/* ================= FOOTER ================= */}
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            View All Panthals
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions>
                </MainCard>
            )}
        </>
    );
}

PanthalPopularCard.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    packages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            amount: PropTypes.number,
            trend: PropTypes.oneOf(['up', 'down']),
            note: PropTypes.string
        })
    )
};

