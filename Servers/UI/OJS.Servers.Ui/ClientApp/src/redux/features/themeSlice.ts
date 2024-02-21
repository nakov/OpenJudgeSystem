import { createSlice } from '@reduxjs/toolkit';

type THEME_VALUES = 'light' | 'dark';

interface IThemeState {
    mode: THEME_VALUES;
}

const initialState: IThemeState = { mode: 'dark' };

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode === 'light'
                ? state.mode = 'dark'
                : state.mode = 'light';
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
