import React, { useMemo } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './hooks/use-auth';
import PageHeader from './layout/header/PageHeader';
import PageContent from './layout/content/PageContent';
import PageFooter from './layout/footer/PageFooter';
import LoadingProvider from './hooks/use-loading';
import ServicesProvider from './hooks/use-services';
import NotificationsProvider from './hooks/use-notifications';
import HomeContestsProvider from './hooks/use-home-contests';
import UsersProvider from './hooks/use-users';
import SubmissionsProvider from './hooks/submissions/use-submissions';
import SubmissionsDetailsProvider from './hooks/submissions/use-submissions-details';
import ParticipationsProvider from './hooks/use-participations';

import './styles/global.scss';
import UrlsProvider from './hooks/use-urls';
import CurrentContestsProvider from './hooks/use-current-contest';
import ProblemsProvider from './hooks/use-problems';
import ProblemSubmissionsProvider from './hooks/submissions/use-problem-submissions';
import ContestsProvider from './hooks/use-contests';
import ContestCategoriesProvider from './hooks/use-contest-categories';
import CurrentContestResultsProvider from './hooks/contests/use-current-contest-results';
import ContestStrategyFiltersProvider from './hooks/use-contest-strategy-filters';
import UserCookiesService from './services/user-cookies-service';
import InitProviders, { ProviderType } from './components/common/InitProviders';
import HomeStatisticsProvider from './hooks/use-home-statistics';
import UrlParamsProvider from './hooks/common/use-url-params';
import CategoriesBreadcrumbProvider from './hooks/submissions/use-contest-categories-breadcrumb';

const App = () => {
    const userCookiesService = useMemo(
        () => new UserCookiesService(),
        [],
    );
    const user = userCookiesService.getUser();
    const providers = [
        UrlParamsProvider,
        UrlsProvider,
        ServicesProvider,
        LoadingProvider,
        NotificationsProvider,
        { Provider: AuthProvider, props: { user } },
        UsersProvider,
        ContestCategoriesProvider,
        ContestStrategyFiltersProvider,
        ContestsProvider,
        HomeContestsProvider,
        ParticipationsProvider,
        CurrentContestsProvider,
        CurrentContestResultsProvider,
        ProblemsProvider,
        ProblemSubmissionsProvider,
        SubmissionsProvider,
        SubmissionsDetailsProvider,
        HomeStatisticsProvider,
        CategoriesBreadcrumbProvider,
    ] as ProviderType[];

    return (
        <Router>
            <InitProviders providers={providers}>
                <PageHeader />
                <PageContent />
                <PageFooter />
            </InitProviders>
        </Router>
    );
};

export default App;
