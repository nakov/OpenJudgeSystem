import React, { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';

import { Anything } from '../../common/common-types';
import GithubIcon from '../../components/guidelines/icons/GitHubIcon';

import styles from './set-admin-navigation.module.scss';

const drawerWidth = 240;

interface IAppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const administrationItems = [
    {
        name: 'Contests',
        icon: <GithubIcon />,
        path: '/administration/contests',
    }, {
        name: 'Submissions',
        icon: <GithubIcon />,
        path: '/administration/submissions',
    }, {
        name: 'Tests',
        icon: <GithubIcon />,
        path: '/administration/tests',
    }, {
        name: 'Problems',
        icon: <GithubIcon />,
        path: '/administration/problems',
    }, {
        name: 'Submission Types',
        icon: <GithubIcon />,
        path: '/administration/submissionTypes',
    },
];

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(8)} + 1px)` },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<IAppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create([ 'width', 'margin' ], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create([ 'width', 'margin' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    },
    ...!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    },
}));

const withAdministrationNav = (ComponentToWrap: FC) => (props: Anything) => {
    const location = useLocation();
    const theme = useTheme();
    const [ open, setOpen ] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Box sx={{ display: 'flex', zIndex: 0 }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{
                          marginRight: 5,
                          ...open && { display: 'none' },
                      }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className={styles.adminHeaderWrapper}>
                        <Link to="/" className={styles.adminHeaderLink}>
                            Back to Platform
                        </Link>
                        <Link to="/logout" className={styles.adminHeaderLink}>Sign out</Link>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl'
                            ? <ChevronRightIcon />
                            : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                {/* <Box sx={{ overflow: 'auto', marginTop: '20px' }}> */}
                <List>
                    {administrationItems.map((item, index) => (
                        <ListItem key={item.name} disablePadding>
                            <Link
                              to={item.path}
                              className={`${location.pathname === item.path
                                  ? styles.activeAdminNavLink
                                  : ''} ${styles.adminNavLink}`}
                            >
                                <ListItemButton>
                                    <ListItemIcon style={{
                                        color: location.pathname === item.path
                                            ? '#42abf8'
                                            : '#3e4c5d',
                                    }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <ComponentToWrap {...props} />
            </Box>
        </Box>
    );
};

export default withAdministrationNav;
