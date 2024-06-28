import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Params, Route, Routes } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import MuiUiThemeProvider from '../../../hooks/use-mui-ui-theme';
import useTheme from '../../../hooks/use-theme';
import PageFooter from '../../../layout/footer/PageFooter';
import PageHeader from '../../../layout/header/PageHeader';
import ContestEditPage from '../../../pages/administration/ContestEditPage';
import ContestProblemsPage from '../../../pages/administration/ContestProblemsPage';
import SubmissionRetestPage from '../../../pages/administration/SubmissionRetestPage';
import TestEditPage from '../../../pages/administration/TestEditPage';
import LoginPage from '../../../pages/auth/login/LoginPage';
import LogoutPage from '../../../pages/auth/logout/LogoutPage';
import RegisterPage from '../../../pages/auth/register/RegisterPage';
import ContestResultsPage from '../../../pages/contest-results/ContestResultsPage';
import ContestDetailsPage from '../../../pages/contests/contest-details/ContestDetailsPage';
import ContestRegister from '../../../pages/contests/contest-register/ContestRegister';
import ContestSolutionSubmitPage from '../../../pages/contests/contest-solution-submit/ContestSolutionSubmitPage';
import ContestsPage from '../../../pages/contests/ContestsPage';
import HomePage from '../../../pages/home/HomePage';
import NotFoundPage from '../../../pages/not-found/NotFoundPage';
import ProfilePage from '../../../pages/profile/ProfilePage';
import SearchPage from '../../../pages/search/SearchPage';
import { asPage } from '../../../pages/shared/set-page-params';
import withTitle from '../../../pages/shared/with-title';
import SubmissionDetailsPage from '../../../pages/submissions/submission-details/SubmissionDetailsPage';
import SubmissionsPage from '../../../pages/submissions/SubmissionsPage';
import { capitalizeFirstLetter } from '../../../utils/string-utils';
import SearchBar from '../../search/search-bar/SearchBar';

import styles from '../../../layout/content/PageContent.module.scss';

const ClientPortal = () => {
    const routes: Array<IRoute> = [
        // Static Routes
        {
            path: '/',
            Element: HomePage,
            title: 'Home',
        },
        {
            path: '/login',
            Element: LoginPage,
            title: 'Login',
        },
        {
            path: '/register',
            Element: RegisterPage,
            title: 'Register',
        },
        {
            path: '/logout',
            Element: LogoutPage,
            title: 'Logout',
        },
        {
            path: '/search',
            Element: SearchPage,
            title: 'Search',
        },
        {
            path: '/submissions',
            Element: SubmissionsPage,
            title: 'Submissions',
        },
        // Profile routes
        {
            path: '/profile/:username?',
            Element: ProfilePage,
            title: (params: Readonly<Params<string>>) => !isEmpty(params.username)
                ? `${params.username}'s profile`
                : 'My Profile',
        },
        // Submissions routes,
        {
            path: '/submissions/:submissionId/details',
            Element: SubmissionDetailsPage,
            title: (params: Readonly<Params<string>>) => `Submission #${params.submissionId}`,
        },
        {
            path: '/submissions/retest/:submissionId',
            Element: SubmissionRetestPage,
            title: (params: Readonly<Params<string>>) => `Retest - ${params.submissionId}`,
        },
        {
            path: '/tests/edit/:testId',
            Element: TestEditPage,
            title: (params: Readonly<Params<string>>) => `Edit Test - ${params.testId}`,
        },
        // Contest Routes
        {
            path: '/contests/:slug',
            Element: ContestsPage,
            title: 'Contests',
        },
        {
            path: '/contests/:slug/:contestId',
            Element: ContestDetailsPage,
            title: (params: Readonly<Params<string>>) => `Contest #${params.contestId}`,
        },
        {
            path: '/contests/:slug/:contestId/:participationType',
            Element: ContestSolutionSubmitPage,
            title: (params: Readonly<Params<string>>) => `
        ${capitalizeFirstLetter(params.participationType!)} #${params.contestId}`,
        },
        {
            path: '/contests/:slug/:contestId/:participationType/register',
            Element: ContestRegister,
            title: (params: Readonly<Params<string>>) => `Contest Register - ${params.contestId}`,
        },
        {
            path: '/contests/:slug/:contestId/:participationType/results/:resultType',
            Element: ContestResultsPage,
            title: (params: Readonly<Params<string>>) => `Results #${params.contestId}`,
        },
        {
            path: '/contests/problems/:contestId',
            Element: ContestProblemsPage,
            title: (params: Readonly<Params<string>>) => `Contest Problems = ${params.contestId}`,
        },
        {
            path: '/contests/edit/:contestId',
            Element: ContestEditPage,
            title: (params: Readonly<Params<string>>) => `Contest Edit - ${params.contestId || 'Unknown'}`,
        },
        // Catch-All Route
        {
            path: '*',
            Element: NotFoundPage,
            title: 'Page Not Found',
        },
    ];

    const { themeColors, getColorClassName } = useTheme();
    const backgroundColorClassName = getColorClassName(themeColors.baseColor400);

    return (
        <HelmetProvider>
            <MuiUiThemeProvider>
                <PageHeader />
                <SearchBar />
                <main className={`${styles.main} ${backgroundColorClassName}`}>
                    <Routes>
                        {
                            routes.map(({ path, Element, title }) => {
                                const elementAsPage = asPage(Element);
                                const elementWithTitle = withTitle({
                                    Component: elementAsPage,
                                    title,
                                });

                                return (
                                    <Route
                                      key={path}
                                      path={path}
                                      element={elementWithTitle}
                                    />
                                );
                            })
                        }
                    </Routes>
                </main>
                <PageFooter />
            </MuiUiThemeProvider>
        </HelmetProvider>
    );
};

interface IRoute {
    path: string;
    Element: React.FC;
    title: string | ((params: Params<string>) => string);
}

export default ClientPortal;
