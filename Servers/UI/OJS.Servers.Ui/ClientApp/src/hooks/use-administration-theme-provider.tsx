import { FC, ReactNode } from 'react';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

import { ThemeMode } from '../common/enums';

interface IAdministrationThemeProviderProps {
    children: ReactNode;
    mode: ThemeMode;
}

const getColors = (mode: ThemeMode) => ({
    palette: {
        primary: {
            main: '#2196F3',
            dark: '#1C272C',
            light: '#353a4821',
        },
        secondary: { main: '#393838' },
        deleted: mode === ThemeMode.Light
            ? '#C0C0C0'
            : '#f3f1f1',
    },
    textColors: {
        primary: mode === ThemeMode.Light
            ? '#14181c'
            : '#f3f1f1',
    },
    background: {
        default: mode === ThemeMode.Light
            ? '#F9F9F9'
            : '#212328',
    },
});

const isDeletedClassName = 'is-deleted-record';
const isVisibleClassName = 'is-visible-record';

const AdministrationThemeProvider: FC<IAdministrationThemeProviderProps> = (props: IAdministrationThemeProviderProps) => {
    const { children, mode } = props;

    // eslint-disable-next-line import/group-exports

    const theme = createTheme({
        palette: {
            mode,
            text: { primary: getColors(mode).textColors.primary },
        },
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: mode === ThemeMode.Light
                            ? '#ffffff'
                            : '#333333',
                        color: getColors(mode).textColors.primary,
                        '& *': { color: 'inherit' },
                    },
                },
            },
            MuiDataGrid: { styleOverrides: { root: { borderRadius: '14px', borderWidth: '1px' } } },
            MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
            MuiCssBaseline: {
                styleOverrides:
                {
                    body: {
                        backgroundColor: getColors(mode).background.default,
                        color: getColors(mode).textColors.primary,
                        '.box-wrapper': { backgroundColor: getColors(mode).background.default },
                        isDeletedClassName: { backgroundColor: getColors(mode).palette.deleted },
                    },
                    a: {
                        color: 'inherit',
                        textDecoration: 'none',
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export {
    isDeletedClassName,
    isVisibleClassName,
    getColors,
};
export default AdministrationThemeProvider;
