import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import MuiUiThemeProvider from '../../../hooks/use-mui-ui-theme';
import useTheme from '../../../hooks/use-theme';
import PageFooter from '../../../layout/footer/PageFooter';
import PageHeader from '../../../layout/header/PageHeader';
import SearchBar from '../../search/search-bar/SearchBar';

import styles from './ClientPortal.module.scss';

const ClientPortal = () => {
    const { themeColors, getColorClassName } = useTheme();
    const backgroundColorClassName = getColorClassName(themeColors.baseColor400);

    return (
        <MuiUiThemeProvider>
            <PageHeader />
            <SearchBar />
            <main className={`${styles.main} ${backgroundColorClassName}`}>
                <Outlet />
            </main>
            <PageFooter />
            <ScrollRestoration />
        </MuiUiThemeProvider>
    );
};

export default ClientPortal;
