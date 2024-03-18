import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MuiUiThemeProvider from '../../../hooks/use-muiUiTheme';
import useTheme from '../../../hooks/use-theme';
import PageFooter from '../../../layout/footer/PageFooter';
import PageHeader from '../../../layout/header/PageHeader';
import SearchBar from '../../../layout/search-bar/SearchBar';
import ContestEditPage from '../../../pages/administration/ContestEditPage';
import ContestProblemsPage from '../../../pages/administration/ContestProblemsPage';
import SubmissionRetestPage from '../../../pages/administration/SubmissionRetestPage';
import TestEditPage from '../../../pages/administration/TestEditPage';
import ContestDetailsPage from '../../../pages/contest/ContestDetailsPage';
import ContestPage from '../../../pages/contest/ContestPage';
import ContestResultsPage from '../../../pages/contest-results/ContestResultsPage';
import ContestsPage from '../../../pages/contests/ContestsPage';
import HomePage from '../../../pages/home/HomePage';
import LoginPage from '../../../pages/login/LoginPage';
import LogoutPage from '../../../pages/logout/LogoutPage';
import NotFoundPage from '../../../pages/not-found/NotFoundPage';
import ProfilePage from '../../../pages/profile/ProfilePage';
import RegisterPage from '../../../pages/register/RegisterPage';
import SearchPage from '../../../pages/search/SearchPage';
import { asPage } from '../../../pages/shared/set-page-params';
import SubmissionDetailsPage from '../../../pages/submission-details/SubmissionDetailsPage';
import SubmissionsPage from '../../../pages/submissions/SubmissionsPage';

import styles from '../../../layout/content/PageContent.module.scss';

const ClientPortal = () => {
    const routes = [
        {
            path: '/login',
            Element: LoginPage,
            title: 'Login',
        },
        {
            path: '/register',
            Element: RegisterPage,
        },
        {
            path: '/logout',
            Element: LogoutPage,
        },
        {
            path: '/',
            Element: HomePage,
        },
        {
            path: '/profile',
            Element: ProfilePage,
        },
        {
            path: '/profile/:username',
            Element: ProfilePage,
        },
        {
            path: '/submissions',
            Element: SubmissionsPage,
            title: 'Submissions',
        },
        {
            path: '/submissions/:submissionId/details',
            Element: SubmissionDetailsPage,
        },
        {
            title: 'Contests',
            path: 'contests',
            Element: ContestsPage,
        },
        {
            path: 'contests/:contestId',
            Element: ContestDetailsPage,
        },
        {
            path: 'contests/:contestId/:participationType',
            Element: ContestPage,
        },
        {
            path: 'contests/:contestId/:participationType/results/:resultType',
            Element: ContestResultsPage,
        },
        {
            path: 'Submissions/Retest/:submissionId',
            Element: SubmissionRetestPage,
        },
        {
            path: 'Contest/Problems/:contestId',
            Element: ContestProblemsPage,
        },
        {
            path: 'Contest/Edit/:contestId',
            Element: ContestEditPage,
        },
        {
            path: 'Tests/Edit/:testId',
            Element: TestEditPage,
        },
        {
            path: 'search',
            Element: SearchPage,
        },
        {
            path: '*',
            Element: NotFoundPage,
        },
    ];

    const { themeColors, getColorClassName } = useTheme();
    const backgroundColorClassName = getColorClassName(themeColors.baseColor400);

    return (
        <MuiUiThemeProvider>
            <PageHeader />
            <SearchBar />
            <main className={`${styles.main} ${backgroundColorClassName}`}>
                <Routes>
                    {routes.map(({ path, Element }) => <Route key={path} path={path} element={React.createElement(asPage(Element))} />)}
                </Routes>
            </main>
            <PageFooter />
        </MuiUiThemeProvider>

    );
};
export default ClientPortal;
