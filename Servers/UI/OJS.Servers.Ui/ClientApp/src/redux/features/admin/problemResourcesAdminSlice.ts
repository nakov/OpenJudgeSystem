/* eslint-disable import/group-exports */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { IAdminSlice } from './contestsAdminSlice';

const initialState: IAdminSlice = {};

export const problemResourceAdminSlice = createSlice({
    name: 'adminProblemResources',
    initialState,
    reducers: {
        setAdminProblemResourceFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                state[key]!.selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminProblemResourceSorters: (state, action) => {
            const { key, sorters } = action.payload;

            if (state[key]) {
                state[key]!.selectedSorters = sorters;
            } else {
                state[key] = { selectedFilters: null, selectedSorters: sorters };
            }
        },
    },
});

export const {
    setAdminProblemResourceFilters,
    setAdminProblemResourceSorters,
} = problemResourceAdminSlice.actions;

export default problemResourceAdminSlice.reducer;
