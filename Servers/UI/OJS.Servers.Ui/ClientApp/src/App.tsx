import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import AuthProvider, { IUserPermissionsType, IUserType } from './hooks/use-auth';
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
import { getCookie } from './utils/cookies';

interface IProvider {
    Provider: FC,
    props?: any,
}

type ProviderType = IProvider | FC;

interface IInitProviderProps {
    providers: ProviderType[],
    children: any,
}

const InitProviders = ({ providers, children } : IInitProviderProps) => {
    const initial = (<>{children}</>);
    return providers
        .reverse()
        .reduce(
            (current, item) => {
                let Provider = item as FC;
                let props = {};
                const providerItem = item as IProvider;

                if (providerItem.Provider) {
                    Provider = providerItem.Provider;
                    props = providerItem.props;
                }

                return (
                // eslint-disable-next-line react/jsx-props-no-spreading
                    <Provider {...props}>
                        {current}
                    </Provider>
                );
            },
            initial,
        );
};

const defaultState = {
    user: {
        username: '',
        isLoggedIn: null,
        permissions: { canAccessAdministration: false } as IUserPermissionsType,
    },
};

const tryGetUserDetailsFromCookie = () => {
    const loggedInUsername = getCookie('logged_in_username');
    const canAccessAdministrationCookie = getCookie('can_access_administration');
    let { permissions } = defaultState.user;
    let loggedIn = false;

    if (loggedInUsername) {
        const canAccessAdministration = canAccessAdministrationCookie.length > 0;
        permissions = { canAccessAdministration } as IUserPermissionsType;
        loggedIn = true;
    }

    return {
        username: loggedInUsername,
        isLoggedIn: loggedIn,
        permissions,
    } as IUserType;
};

const App = () => {
    const user = tryGetUserDetailsFromCookie();
    const providers = [
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
    ] as ProviderType[];

    return (
        <InitProviders providers={providers}>
            <Router>
                <PageHeader />
                <PageContent />
                <PageFooter />
            </Router>
        </InitProviders>
    );
};

export default App;
