import React, { useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import InitProviders, { ProviderType } from './components/common/InitProviders';
import HashUrlParamProvider from './hooks/common/use-hash-url-params';
import UrlParamsProvider from './hooks/common/use-url-params';
import CurrentContestResultsProvider from './hooks/contests/use-current-contest-results';
import ProblemSubmissionsProvider from './hooks/submissions/use-problem-submissions';
import PublicSubmissionsProvider from './hooks/submissions/use-public-submissions';
import SubmissionsProvider from './hooks/submissions/use-submissions';
import SubmissionsDetailsProvider from './hooks/submissions/use-submissions-details';
import AuthProvider from './hooks/use-auth';
import ContestCategoriesProvider from './hooks/use-contest-categories';
import CategoriesBreadcrumbProvider from './hooks/use-contest-categories-breadcrumb';
import ContestStrategyFiltersProvider from './hooks/use-contest-strategy-filters';
import ContestsProvider from './hooks/use-contests';
import CurrentContestsProvider from './hooks/use-current-contest';
import HomeContestsProvider from './hooks/use-home-contests';
import HomeStatisticsProvider from './hooks/use-home-statistics';
import LoadingProvider from './hooks/use-loading';
import NotificationsProvider from './hooks/use-notifications';
import ParticipationsProvider from './hooks/use-participations';
import ProblemsProvider from './hooks/use-problems';
import ServicesProvider from './hooks/use-services';
import UrlsProvider from './hooks/use-urls';
import UsersProvider from './hooks/use-users';
import PageContent from './layout/content/PageContent';
import PageFooter from './layout/footer/PageFooter';
import PageHeader from './layout/header/PageHeader';
import UserCookiesService from './services/user-cookies-service';

import './styles/global.scss';

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
        PublicSubmissionsProvider,
        HashUrlParamProvider,
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
