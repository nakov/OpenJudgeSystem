import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useParams } from 'react-router';
import { Params, Route, Routes } from 'react-router-dom';

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
import SearchBar from '../../search/search-bar/SearchBar';

import styles from '../../../layout/content/PageContent.module.scss';

interface IRoute {
    path: string;
    Element: React.FC;
    title: string | ((params: Params<string>) => string);
}

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
            title: (params: Readonly<Params<string>>) => `Profile of ${params.username || 'Unknown'}`,
        },
        // Submissions routes,
        {
            path: '/submissions/:submissionId/details',
            Element: SubmissionDetailsPage,
            title: (params: Readonly<Params<string>>) => `Submission Details - ${params.submissionId || 'Unknown'}`,
        },
        {
            path: '/submissions/retest/:submissionId',
            Element: SubmissionRetestPage,
            title: (params: Readonly<Params<string>>) => `Submission Retest - ${params.submissionId || 'Unknown'}`,
        },
        {
            path: '/tests/edit/:testId',
            Element: TestEditPage,
            title: (params: Readonly<Params<string>>) => `Edit Test - ${params.testId || 'Unknown'}`,
        },
        // Contest Routes
        {
            path: '/contests/:contestId',
            Element: ContestDetailsPage,
            title: (params: Readonly<Params<string>>) => `Contest Details - ${params.contestId || 'Unknown'}`,
        },
        {
            path: '/contests/register/:contestId/:participationType',
            Element: ContestRegister,
            title: (params: Readonly<Params<string>>) => `Contest Register - ${params.contestId || 'Unknown'} 
                for ${params.participationType || 'Unknown'} type`,
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
        {
            path: '/contests/:contestId/:participationType',
            Element: ContestSolutionSubmitPage,
            title: (params: Readonly<Params<string>>) => `Solution Submit - ${params.contestId || 'Unknown'}
                for ${params.participationType || 'Unknown'} type`,
        },
        {
            path: '/contests/:contestId/:participationType/results/:resultType',
            Element: ContestResultsPage,
            title: (params: Readonly<Params<string>>) => `Contest Results - ${params.contestId || 'Unknown'} 
                for ${params.participationType || 'Unknown'} for ${params.resultType || 'Unknown'} type`,
        },
        {
            path: '/contests',
            Element: ContestsPage,
            title: 'SoftUni Judge Contests',
        },
        // Catch-All Route
        {
            path: '*',
            Element: NotFoundPage,
            title: 'SoftUni Judge Not Found',
        },
    ];

    const params = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const backgroundColorClassName = getColorClassName(themeColors.baseColor400);

    return (
        <HelmetProvider>
            <MuiUiThemeProvider>
                <PageHeader />
                <SearchBar />
                <main className={`${styles.main} ${backgroundColorClassName}`}>
                    <Routes>
                        {routes.map(({ path, Element, title }) => {
                            const elementAsPage = asPage(Element);
                            const elementWithTitle = withTitle({ Component: elementAsPage, title, params });

                            return (
                                <Route
                                  key={path}
                                  path={path}
                                  element={elementWithTitle}
                                />
                            );
                        })}
                    </Routes>
                </main>
                <PageFooter />
            </MuiUiThemeProvider>
        </HelmetProvider>
    );
};
export default ClientPortal;
