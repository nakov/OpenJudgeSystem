import { createSlice } from '@reduxjs/toolkit';

type THEME_VALUES = 'light' | 'dark';

interface IThemeState {
    mode: THEME_VALUES;
}

const initialState: IThemeState = { mode: 'dark' };

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            // eslint-disable-next-line no-unused-expressions
            state.mode === 'light'
                // eslint-disable-next-line no-param-reassign,prefer-destructuring
                ? state.mode = 'dark'
                // eslint-disable-next-line no-param-reassign,prefer-destructuring
                : state.mode = 'light';
        },
    },
});

// eslint-disable-next-line prefer-destructuring,import/group-exports
export const { toggleTheme } = themeSlice.actions;

// eslint-disable-next-line import/group-exports,prefer-destructuring
export const themeSliceName = themeSlice.name;

export default themeSlice.reducer;
