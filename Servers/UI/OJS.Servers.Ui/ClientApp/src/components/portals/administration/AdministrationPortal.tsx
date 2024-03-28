/* eslint-disable @typescript-eslint/no-use-before-define */

import { useEffect, useState } from 'react';
import { FaCheckDouble, FaUsers } from 'react-icons/fa';
import { GiFiles } from 'react-icons/gi';
import { MdOutlineAirlineStops, MdOutlineRememberMe } from 'react-icons/md';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ScienceIcon from '@mui/icons-material/Science';
import TableViewIcon from '@mui/icons-material/TableView';
import { Box, CSSObject, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Theme, Toolbar, Tooltip } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import 'dayjs/locale/bg';

import { CHECKERS_PATH, CONTEST_CATEGORIES_PATH, CONTESTS_PATH, NEW_ADMINISTRATION_PATH, PARTICIPANTS_PATH, PROBLEM_GROUPS_PATH, PROBLEM_RESOURCES_PATH, PROBLEMS_PATH, ROLES_PATH, SUBMISSION_TYPES_PATH, SUBMISSIONS_FOR_PROCESSING_PATH, SUBMISSIONS_PATH, TESTS_PATH, USERS_PATH } from '../../../common/urls/administration-urls';
import AdministrationPage from '../../../pages/administration/AdministrationPage';
import AdministrationContestCategories from '../../../pages/administration-new/categoriesContest/AdministrationContestCategories';
import AdministrationContestsPage from '../../../pages/administration-new/contests/AdministrationContests';
import ParticipantsAdministrationPage from '../../../pages/administration-new/participants/ParticipantsAdministrationPage';
import AdministrationProblemResourcesPage from '../../../pages/administration-new/problem-resources/AdministrationProblemResourcesPage';
import AdministrationProblemGroupsPage from '../../../pages/administration-new/problemGroups/AdministrationProblemGroupsPage';
import AdministrationProblemsPage from '../../../pages/administration-new/problems/AdministrationProblemsPage';
import AdministrationRolesPage from '../../../pages/administration-new/roles/AdministrationRolesPage';
import AdministrationSubmissionTypesPage from '../../../pages/administration-new/submission-types/AdministrationSubmissionTypesPage';
import AdministrationSubmissionsPage from '../../../pages/administration-new/submissions/AdministrationSubmissionsPage';
import AdminSubmissionForProcessingDetails
    from '../../../pages/administration-new/submissions-for-processing/AdministrationSubmissionForProcessing';
import AdministrationSubmissionsForProcessingPage from '../../../pages/administration-new/submissions-for-processing/AdministrationSubmissionsForProcessingPage';
import AdministrationTestsPage from '../../../pages/administration-new/tests/AdministrationTestsPage';
import AdministrationUsersPage from '../../../pages/administration-new/users/AdministrationUsersPage';
import AdministrationCheckersPage from '../../../pages/checkers/AdministrationCheckersPage';
import NotFoundPage from '../../../pages/not-found/NotFoundPage';
import AdministrationContestPage from '../../administration/contests/AdministrationContestPage';
import AdministrationProblemGroup from '../../administration/problem-groups/AdministrationProblemGroup';
import AdministrationProblemResource from '../../administration/problem-resources/AdministrationProblemResource';
import AdministrationProblem from '../../administration/Problems/AdministrationProblem';
import AdministrationRole from '../../administration/roles/AdministrationRole';
import AdministrationTest from '../../administration/tests/AdministrationTest';
import AdministrationUser from '../../administration/users/AdministrationUser';

import styles from './AdministrationPortal.module.scss';

interface IAppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const drawerWidth = 240;

const administrationItems = [
    {
        name: 'Contests',
        icon: <AutoStoriesIcon />,
        path: `${CONTESTS_PATH}`,
    },
    {
        name: 'Contest Categories',
        icon: <BookmarksIcon />,
        path: `${CONTEST_CATEGORIES_PATH}`,
    },
    {
        name: 'Submissions',
        icon: <PlaylistAddCheckCircleIcon />,
        path: `${SUBMISSIONS_PATH}`,
    },
    {
        name: 'Submissions For Processing',
        icon: <DataSaverOnIcon />,
        path: `${SUBMISSIONS_FOR_PROCESSING_PATH}`,
    },
    {
        name: 'Tests',
        icon: <ScienceIcon />,
        path: `${TESTS_PATH}`,
    },
    {
        name: 'Problems',
        icon: <NotListedLocationIcon />,
        path: `${PROBLEMS_PATH}`,
    },
    {
        name: 'Problem Groups',
        icon: <TableViewIcon />,
        path: `${PROBLEM_GROUPS_PATH}`,
    },
    {
        name: 'Problem Resources',
        icon: <GiFiles />,
        path: `${PROBLEM_RESOURCES_PATH}`,
    },
    {
        name: 'Submission Types',
        icon: <BorderAllIcon />,
        path: `${SUBMISSION_TYPES_PATH}`,
    },
    {
        name: 'Checkers',
        icon: <FaCheckDouble />,
        path: `${CHECKERS_PATH}`,
    },
    {
        name: 'Participants',
        icon: <MdOutlineRememberMe />,
        path: `${PARTICIPANTS_PATH}`,
    },
    {
        name: 'Roles',
        icon: <MdOutlineAirlineStops />,
        path: `${ROLES_PATH}`,
    },
    {
        name: 'Users',
        icon: <FaUsers />,
        path: `${USERS_PATH}`,
    },

];
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'visible',
    overflowY: 'visible',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'visible',
    overflowY: 'visible',
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
    boxShadow: '0px 0px 19px -4px rgba(22,0,0,0.75)',
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

const mobileBreak = 1300;

const AdministrationPortal = () => {
    const location = useLocation();
    const [ open, setOpen ] = useState(true);
    const [ locationTitle, setLocationTitle ] = useState('');

    useEffect(() => {
        const locationPathnameElements = location.pathname.split('/');
        const lastElementOfThePathname = locationPathnameElements[locationPathnameElements.length - 1];
        let pageTitle = '';
        if (!/^\d+$/.test(lastElementOfThePathname)) {
            const section = administrationItems.find((x) => x.path.split('/').pop() === lastElementOfThePathname);
            pageTitle = capitalizeFirstLetter(section
                ? section.name
                : '');
            setLocationTitle(pageTitle);
        } else {
            pageTitle = capitalizeFirstLetter(`${locationPathnameElements[locationPathnameElements.length - 2]}
            Id: ${lastElementOfThePathname}`);

            setLocationTitle(pageTitle);
        }
        document.title = `Administration ${pageTitle} - SoftUni Judge`;
    }, [ location.pathname ]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return function cleanUp() {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleResize = () => {
        setOpen(!(window.innerWidth < mobileBreak));
    };

    const capitalizeFirstLetter = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

    const isSelected = (pathName: string) => {
        const sectionPathName = location.pathname.split('/');
        if (sectionPathName[sectionPathName.length - 1].toLocaleLowerCase() === pathName.toLocaleLowerCase()) {
            return true;
        }
        return false;
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const adminRoutes = [
        {
            path: `${CONTESTS_PATH}`,
            Element: AdministrationContestsPage,
        },
        {
            path: `${CONTESTS_PATH}/:id`,
            Element: AdministrationContestPage,
        },
        {
            path: `${CONTEST_CATEGORIES_PATH}`,
            Element: AdministrationContestCategories,
        },
        {
            path: `${SUBMISSIONS_PATH}`,
            Element: AdministrationSubmissionsPage,
        },
        {
            path: `${SUBMISSIONS_FOR_PROCESSING_PATH}`,
            Element: AdministrationSubmissionsForProcessingPage,
        },
        {
            path: `${SUBMISSIONS_FOR_PROCESSING_PATH}/:id`,
            Element: AdminSubmissionForProcessingDetails,
        },
        {
            path: `${TESTS_PATH}`,
            Element: AdministrationTestsPage,
        },
        {
            path: `${TESTS_PATH}/:id`,
            Element: AdministrationTest,
        },
        {
            path: `${PROBLEMS_PATH}`,
            Element: AdministrationProblemsPage,
        },
        {
            path: `${PROBLEMS_PATH}/:id`,
            Element: AdministrationProblem,
        },
        {
            path: `${PROBLEM_GROUPS_PATH}`,
            Element: AdministrationProblemGroupsPage,
        },
        {
            path: `${PROBLEM_GROUPS_PATH}/:id`,
            Element: AdministrationProblemGroup,
        },
        {
            path: `${PROBLEM_RESOURCES_PATH}`,
            Element: AdministrationProblemResourcesPage,
        },
        {
            path: `${PROBLEM_RESOURCES_PATH}/:id`,
            Element: AdministrationProblemResource,
        },
        {
            path: `${SUBMISSION_TYPES_PATH}`,
            Element: AdministrationSubmissionTypesPage,
        },
        {
            path: `${CHECKERS_PATH}`,
            Element: AdministrationCheckersPage,
        },
        {
            path: `${PARTICIPANTS_PATH}`,
            Element: ParticipantsAdministrationPage,
        },
        {
            path: `${ROLES_PATH}`,
            Element: AdministrationRolesPage,
        },
        {
            path: `${ROLES_PATH}/:id`,
            Element: AdministrationRole,
        },
        {
            path: `${USERS_PATH}`,
            Element: AdministrationUsersPage,
        },
        {
            path: `${USERS_PATH}/:id`,
            Element: AdministrationUser,
        },
        {

            path: '/administration',
            Element: AdministrationPage,
            title: 'Administration',
        },
    ];

    const renderSectionicon = (name: string, icon: any) => {
        if (!open) {
            return (
                <Tooltip title={name}>
                    <div>{icon}</div>
                </Tooltip>
            );
        }
        return icon;
    };

    return (
        <Box sx={{ zIndex: 0 }}>
            <Box sx={{ display: 'flex', zIndex: 0 }}>
                <AppBar position="fixed" open={open} className={styles.appBar}>
                    <Toolbar>
                        <div className={styles.adminHeaderWrapper}>
                            <Link to="/" className={styles.adminHeaderLink}>
                                <Tooltip title="Return to client app">
                                    <KeyboardReturnIcon />
                                </Tooltip>
                            </Link>
                            <div className={styles.locationTitle}>{locationTitle}</div>
                            <Link to="/logout" className={styles.adminHeaderLink}>Sign out</Link>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                  variant="permanent"
                  open={open}
                  sx={{ zIndex: 100 }}
                >
                    {!open
                        ? (
                            <IconButton className={`${styles.arrowRight} ${styles.arrowCommon}`} color="primary" onClick={handleDrawerOpen}>
                                <ChevronRightIcon />
                            </IconButton>
                        )
                        : (
                            <IconButton className={`${styles.arrow} ${styles.arrowCommon}`} color="primary" onClick={handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        )}
                    <DrawerHeader>
                        <div />
                    </DrawerHeader>
                    <List sx={{ overflow: 'hidden' }}>
                        {administrationItems.map((item) => (
                            <Box key={item.path}>
                                <ListItem key={item.name} disablePadding>
                                    <Link
                                      to={item.path}
                                      className={`${isSelected(item.path)
                                          ? styles.activeAdminNavLink
                                          : ''} ${styles.adminNavLink}`}
                                    >
                                        <ListItemButton className={isSelected(item.path)
                                            ? styles.selectedSection
                                            : ''}
                                        >
                                            <ListItemIcon className={isSelected(item.path)
                                                ? styles.listItemIcon
                                                : ''}
                                            >
                                                {renderSectionicon(item.name, item.icon)}
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                    </List>
                </Drawer>
                <Box className={styles.main} component="main" sx={{ flexGrow: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
                        <Routes>
                            {adminRoutes.map(({ path, Element }) => <Route key={path} path={path} element={<Element />} />)}
                            <Route path="/" element={<Navigate to={`/${NEW_ADMINISTRATION_PATH}/${CONTESTS_PATH}`} replace />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </LocalizationProvider>
                </Box>
            </Box>
        </Box>
    );
};
export default AdministrationPortal;
