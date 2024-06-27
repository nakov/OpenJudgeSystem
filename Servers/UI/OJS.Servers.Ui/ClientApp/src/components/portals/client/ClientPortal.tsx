import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import HashUrlParamProvider from '../../../hooks/common/use-hash-url-params';
import RouteUrlParamsProvider from '../../../hooks/common/use-route-url-params';
import UrlParamsProvider from '../../../hooks/common/use-url-params';
import ProblemSubmissionsProvider from '../../../hooks/submissions/use-problem-submissions';
import ProfileSubmissionsProvider from '../../../hooks/submissions/use-profile-submissions';
import SubmissionsProvider from '../../../hooks/submissions/use-submissions';
import CurrentContestsProvider from '../../../hooks/use-current-contest';
import MuiUiThemeProvider from '../../../hooks/use-mui-ui-theme';
import PageProvider from '../../../hooks/use-pages';
import ParticipationsProvider from '../../../hooks/use-participations';
import ProblemsProvider from '../../../hooks/use-problems';
import useTheme from '../../../hooks/use-theme';
import PageFooter from '../../../layout/footer/PageFooter';
import PageHeader from '../../../layout/header/PageHeader';
import InitProviders, { ProviderType } from '../../common/InitProviders';
import SearchBar from '../../search/search-bar/SearchBar';

import styles from './ClientPortal.module.scss';

const ClientPortal = () => {
    const { themeColors, getColorClassName } = useTheme();
    const backgroundColorClassName = getColorClassName(themeColors.baseColor400);

    const providers = [
        HashUrlParamProvider,
        UrlParamsProvider,
        RouteUrlParamsProvider,
        PageProvider,
        ParticipationsProvider,
        CurrentContestsProvider,
        ProblemSubmissionsProvider,
        ProblemsProvider,
        SubmissionsProvider,
        ProfileSubmissionsProvider,
    ] as ProviderType[];

    return (
        <InitProviders providers={providers}>
            <HelmetProvider>
                <MuiUiThemeProvider>
                    <PageHeader />
                    <SearchBar />
                    <main className={`${styles.main} ${backgroundColorClassName}`}>
                        <Outlet />
                    </main>
                    <PageFooter />
                    <ScrollRestoration />
                </MuiUiThemeProvider>
            </HelmetProvider>
        </InitProviders>
    );
};

export default ClientPortal;
