import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import HomePage from '../../pages/home/HomePage';
import LogoutPage from '../../pages/logout/LogoutPage';
import LoginPage from '../../pages/login/LoginPage';
import RegisterPage from '../../pages/register/RegisterPage';
import ProfilePage from '../../pages/profile/ProfilePage';
import SubmissionPage from '../../pages/submissions/SubmissionPage';
import ContestPage from '../../pages/contest/ContestPage';
import ContestResultsPage from '../../pages/contest-results/ContestResultsPage';
import ContestsPage from '../../pages/contests/ContestsPage';
import AdministrationPage from '../../pages/administration/AdministrationPage';
import styles from './PageContent.module.scss';
import SubmissionDetailsPage from '../../pages/submission-details/SubmissionDetailsPage';

const routes = [
    {
        path: '/login',
        Element: LoginPage,
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
        path: '/submissions/:submissionId',
        Element: SubmissionPage,
    },
    {
        path: '/submissions/:submissionId/details',
        Element: SubmissionDetailsPage,
    },
    {
        path: '/contests',
        Element: ContestsPage,
    },
    {
        path: '/contests/:contestId/:participationType',
        Element: ContestPage,
    },
    {
        path: '/contests/:contestId/:participationType/results/:resultType',
        Element: ContestResultsPage,
    },
    {
        path: '/administration',
        Element: AdministrationPage,
    }
];

const PageContent = () => (
    <main className={styles.main}>
        <Routes>
            {routes.map(({ path, Element }) => (
                <Route key={path} path={path} element={<Element />} />
            ))}
            {/*<Route path='/administration' element={<RedirectPage />} />*/}
        </Routes>
    </main>
);

export default PageContent;
