import React, { FC } from 'react';
import { Anything } from '../../common/common-types';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Link, useLocation } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import PublishIcon from "@mui/icons-material/Publish";
import BugReportIcon from "@mui/icons-material/BugReport";
import TaskIcon from "@mui/icons-material/Task";

import styles from './set-admin-navigation.module.scss';

const drawerWidth = 240;

const administrationItems = [
    {
        name: 'Contests',
        icon: <SportsScoreIcon />,
        path: '/administration/contests'
    }, {
        name: 'Submissions',
        icon: <PublishIcon />,
        path: '/administration/submissions'
    }, {
        name: 'Tests',
        icon: <BugReportIcon />,
        path: '/administration/tests'
    }, {
        name: 'Problems',
        icon: <TaskIcon />,
        path: '/administration/problems'
    }, {
        name: 'Submission Types',
        icon: <PublishIcon />,
        path: '/administration/submissionTypes'
    }
];

const withAdministrationNav = (ComponentToWrap: FC) => (props: Anything) => {
    const location = useLocation();
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Box sx={{ display: 'flex', zIndex: 0 }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', marginTop: '20px' }}>
                    <List>
                        {administrationItems.map((item, index) => (
                            <ListItem key={item.name} disablePadding>
                                <Link to={item.path} className={`${location.pathname === item.path ? styles.activeAdminNavLink : ''} ${styles.adminNavLink}`}>
                                    <ListItemButton>
                                        <ListItemIcon style={{ color: location.pathname === item.path ? '#42abf8' : '#3e4c5d' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <ComponentToWrap {...props} />
            </Box>
        </Box>
    );
};

export {
    withAdministrationNav,
};
