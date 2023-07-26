import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import InitProviders, { ProviderType } from './components/common/InitProviders';
import HashUrlParamProvider from './hooks/common/use-hash-url-params';
import RouteUrlParamsProvider from './hooks/common/use-route-url-params';
import UrlParamsProvider from './hooks/common/use-url-params';
import CurrentContestResultsProvider from './hooks/contests/use-current-contest-results';
import ProblemSubmissionsProvider from './hooks/submissions/use-problem-submissions';
import PublicSubmissionsProvider from './hooks/submissions/use-public-submissions';
import SubmissionsProvider from './hooks/submissions/use-submissions';
import SubmissionsDetailsProvider from './hooks/submissions/use-submissions-details';
import AppUrlsProvider from './hooks/use-app-urls';
import AuthProvider from './hooks/use-auth';
import ContestCategoriesProvider from './hooks/use-contest-categories';
import CategoriesBreadcrumbProvider from './hooks/use-contest-categories-breadcrumb';
import ContestStrategyFiltersProvider from './hooks/use-contest-strategy-filters';
import ContestsProvider from './hooks/use-contests';
import CurrentContestsProvider from './hooks/use-current-contest';
import HomeContestsProvider from './hooks/use-home-contests';
import HomeStatisticsProvider from './hooks/use-home-statistics';
import LoadingProvider from './hooks/use-loading';
import ContestModalProvider from './hooks/use-modal';
import NotificationsProvider from './hooks/use-notifications';
import PageWithTitleProvider from './hooks/use-page-titles';
import PageProvider from './hooks/use-pages';
import ParticipationsProvider from './hooks/use-participations';
import ProblemsProvider from './hooks/use-problems';
import SearchProvider from './hooks/use-search';
import ServicesProvider from './hooks/use-services';
import UsersProvider from './hooks/use-users';
import PageContent from './layout/content/PageContent';
import PageFooter from './layout/footer/PageFooter';
import PageHeader from './layout/header/PageHeader';
import SearchBar from './layout/search-bar/SearchBar';

import './styles/global.scss';

const App = () => {
    const providers = [
        UrlParamsProvider,
        RouteUrlParamsProvider,
        AppUrlsProvider,
        ServicesProvider,
        PageProvider,
        LoadingProvider,
        NotificationsProvider,
        PageWithTitleProvider,
        HashUrlParamProvider,
        AuthProvider,
        UsersProvider,
        ContestCategoriesProvider,
        ContestStrategyFiltersProvider,
        CategoriesBreadcrumbProvider,
        ContestsProvider,
        ContestModalProvider,
        HomeContestsProvider,
        ParticipationsProvider,
        CurrentContestsProvider,
        CurrentContestResultsProvider,
        ProblemsProvider,
        ProblemSubmissionsProvider,
        SubmissionsProvider,
        SubmissionsDetailsProvider,
        HomeStatisticsProvider,
        PublicSubmissionsProvider,
        SearchProvider,
    ] as ProviderType[];

    return (
        <Router>
            <InitProviders providers={providers}>
                <PageHeader />
                <SearchBar />
                <PageContent />
                <PageFooter />
            </InitProviders>
        </Router>
    );
};

export default App;
