import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';
import AdministrationPage from '../../pages/administration/AdministrationPage';
import ContestEditPage from '../../pages/administration/ContestEditPage';
import ContestProblemsPage from '../../pages/administration/ContestProblemsPage';
import SubmissionRetestPage from '../../pages/administration/SubmissionRetestPage';
import TestEditPage from '../../pages/administration/TestEditPage';
import Administration from '../../pages/administration-new/Administration';
import AdministrationContestsPage from '../../pages/administration-new/AdministrationContests';
import { AdministrationSubmissionsPage } from '../../pages/administration-new/AdministrationSubmissions';
import AdministrationContestPage from '../../pages/administration-new/Contest/AdministrationContestPage';
import ContestDetailsPage from '../../pages/contest/ContestDetailsPage';
import ContestPage from '../../pages/contest/ContestPage';
import ContestResultsPage from '../../pages/contest-results/ContestResultsPage';
import ContestsPage from '../../pages/contests/ContestsPage';
import HomePage from '../../pages/home/HomePage';
import LoginPage from '../../pages/login/LoginPage';
import LogoutPage from '../../pages/logout/LogoutPage';
import NotFoundPage from '../../pages/not-found/NotFoundPage';
import ProfilePage from '../../pages/profile/ProfilePage';
import RegisterPage from '../../pages/register/RegisterPage';
import SearchPage from '../../pages/search/SearchPage';
import withAdministrationNav from '../../pages/shared/set-admin-navigation';
import { asPage } from '../../pages/shared/set-page-params';
import { withTitle } from '../../pages/shared/set-page-title';
import SubmissionDetailsPage from '../../pages/submission-details/SubmissionDetailsPage';
import SubmissionsPage from '../../pages/submissions/SubmissionsPage';

import styles from './PageContent.module.scss';

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
        title: 'My Profile',
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
        path: '/contests',
        Element: ContestsPage,
    },
    {
        path: '/contests/:contestId/:participationType',
        Element: ContestPage,
    },
    {
        path: '/contests/:contestId',
        Element: ContestDetailsPage,
    },
    {
        path: '/contests/:contestId/:participationType/results/:resultType',
        Element: ContestResultsPage,
    },
    {
        path: '/Submissions/Retest/:submissionId',
        Element: SubmissionRetestPage,
    },
    {
        path: '/Contest/Problems/:contestId',
        Element: ContestProblemsPage,
    },
    {
        path: '/Contest/Edit/:contestId',
        Element: ContestEditPage,
    },
    {
        path: '/Tests/Edit/:testId',
        Element: TestEditPage,
    },
    {
        path: '/search',
        Element: SearchPage,
    },
    {
        path: '*',
        Element: NotFoundPage,
    },
];

const adminRoutes = [
    {
        path: '/administration',
        Element: AdministrationContestsPage,
    },
    {
        path: '/administration/contests',
        Element: AdministrationContestsPage,
    },
    {
        path: '/administration/contests/:id',
        Element: AdministrationContestPage,
    },
    {
        path: '/administration/submissions',
        Element: AdministrationSubmissionsPage,
    },
    {
        path: '/administration/tests',
        Element: Administration,
    },
    {
        path: '/administration/problems',
        Element: Administration,
    },
    {
        path: '/administration/submissionTypes',
        Element: Administration,
    },
    {
        path: '/administration-new',
        Element: AdministrationPage,
        title: 'Administration',
    },
];

const PageContent = () => {
    const { state: loggedInUser } = useAuth();
    const { user: { isAdmin } } = loggedInUser;

    const renderRoute = (path: string, Element: FC, title: string | undefined, isAdminRoute: boolean) => {
        let WrappedElement = asPage(withTitle(Element, title));
        if (isAdminRoute) {
            WrappedElement = withAdministrationNav(Element);
        }
        return (
            <Route key={path} path={path} element={<WrappedElement />} />
        );
    };

    return (
        <main className={styles.main}>
            <Routes>
                {routes.map(({ path, Element, title }) => renderRoute(path, Element, title, false))}
                {isAdmin && adminRoutes.map(({ path, Element, title }) => renderRoute(path, Element, title, true))}
            </Routes>
        </main>
    );
};

export default PageContent;
