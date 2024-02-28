import { createSlice } from '@reduxjs/toolkit';

import { IAdminSlice } from './contestsAdminSlice';

const initialState: IAdminSlice = {};

export const problemsAdminSlice = createSlice({
    name: 'adminProblems',
    initialState,
    reducers: {
        setAdminProblemsFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                // @typescript-eslint/ban-ts-comment
                // @ts-ignore
                state[key].selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminProblemsSorters: (state, action) => {
            const { key, sorters } = action.payload;

            if (state[key]) {
                // @typescript-eslint/ban-ts-comment
                // @ts-ignore
                state[key].selectedSorters = sorters;
            } else {
                state[key] = { selectedFilters: null, selectedSorters: sorters };
            }
        },
    },
});

export const {
    setAdminProblemsFilters,
    setAdminProblemsSorters,
} = problemsAdminSlice.actions;

export default problemsAdminSlice.reducer;
