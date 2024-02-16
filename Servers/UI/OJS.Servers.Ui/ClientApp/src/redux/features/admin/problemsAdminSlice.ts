import { createSlice } from '@reduxjs/toolkit';

import { IAdminSlice } from './contestsAdminSlice';

const initialState: IAdminSlice = {};

// eslint-disable-next-line import/group-exports
export const problemsAdminSlice = createSlice({
    name: 'adminProblems',
    initialState,
    reducers: {
        setAdminProblemsFilters: (state, action) => {
            // eslint-disable-next-line prefer-destructuring
            const { key, filters } = action.payload;

            if (state[key]) {
                // eslint-disable-next-line no-param-reassign,@typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line no-param-reassign
                state[key].selectedFilters = filters;
            } else {
                // eslint-disable-next-line no-param-reassign
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminProblemsSorters: (state, action) => {
            // eslint-disable-next-line prefer-destructuring
            const { key, sorters } = action.payload;

            if (state[key]) {
                // eslint-disable-next-line no-param-reassign,@typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line no-param-reassign
                state[key].selectedSorters = sorters;
            } else {
                // eslint-disable-next-line no-param-reassign
                state[key] = { selectedFilters: null, selectedSorters: sorters };
            }
        },
    },
});

// eslint-disable-next-line prefer-destructuring,import/group-exports
export const {
    setAdminProblemsFilters,
    setAdminProblemsSorters,
} = problemsAdminSlice.actions;

export default problemsAdminSlice.reducer;
