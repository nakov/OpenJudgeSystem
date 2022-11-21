import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AdministrationPage from '../../pages/administration/AdministrationPage';
import ContestPage from '../../pages/contest/ContestPage';
import ContestRegisterPage from '../../pages/contest/ContestRegisterPage';
import ContestResultsPage from '../../pages/contest-results/ContestResultsPage';
import ContestsPage from '../../pages/contests/ContestsPage';
import HomePage from '../../pages/home/HomePage';
import LoginPage from '../../pages/login/LoginPage';
import LogoutPage from '../../pages/logout/LogoutPage';
import ProfilePage from '../../pages/profile/ProfilePage';
import RegisterPage from '../../pages/register/RegisterPage';
import { withTitle } from '../../pages/shared/set-page-title';
import SubmissionDetailsPage from '../../pages/submission-details/SubmissionDetailsPage';
import SubmissionsPage from '../../pages/submissions/SubmissionsPage';

import styles from './PageContent.module.scss';

const routes = [
    {
        path: '/login',
        Element: withTitle(LoginPage, 'Login'),
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
        Element: withTitle(HomePage, 'SoftUni Judge'),
    },
    {
        path: '/profile',
        Element: withTitle(ProfilePage, 'My Profile'),
    },
    {
        path: '/submissions',
        Element: withTitle(SubmissionsPage, 'Submissions'),
    },
    {
        path: '/submissions/:submissionId/details',
        Element: SubmissionDetailsPage,
    },
    {
        path: '/contests/:contestId/register/:participationType',
        Element: withTitle(ContestRegisterPage, 'Enter Contest Password'),
    },
    {
        path: '/contests',
        Element: withTitle(ContestsPage, 'Contests'),
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
    },
];

const PageContent = () => (
    <main className={styles.main}>
        <Routes>
            {routes.map(({ path, Element }) => (
                <Route key={path} path={path} element={<Element />} />
            ))}
        </Routes>
    </main>
);

export default PageContent;
