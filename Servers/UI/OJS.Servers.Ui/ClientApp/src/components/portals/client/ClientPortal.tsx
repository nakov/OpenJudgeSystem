import React, { useCallback, useEffect } from 'react';
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

    const { isDarkMode } = useTheme(); // Get the current theme mode

    const toggleScrollbarStyles = useCallback(() => {
        // Add or remove the scrollbar styles based on the theme mode
        const rootElement = document.documentElement; // This refers to the `html` element
        const darkScrollbarClass = 'darkScrollbar';
        const lightScrollbarClass = 'lightScrollbar';

        if (isDarkMode) {
            rootElement.classList.add(darkScrollbarClass);
            rootElement.classList.remove(lightScrollbarClass);
        } else {
            rootElement.classList.add(lightScrollbarClass);
            rootElement.classList.remove(darkScrollbarClass);
        }

        // Cleanup in case the effect is run multiple times (e.g., toggling theme back and forth)
        return () => {
            rootElement.classList.remove(darkScrollbarClass, lightScrollbarClass);
        };
    }, [ isDarkMode ]);

    useEffect(() => {
        toggleScrollbarStyles();
    }, [ isDarkMode, toggleScrollbarStyles ]);

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
