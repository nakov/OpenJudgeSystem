import { createSlice } from '@reduxjs/toolkit';

import { IAdminSlice } from './contestsAdminSlice';

const initialState: IAdminSlice = {};

export const problemGroupsAdminSlice = createSlice({
    name: 'adminProblemGroups',
    initialState,
    reducers: {
        setAdminProblemGroupsFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                state[key]!.selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminProblemGroupsSorters: (state, action) => {
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
    setAdminProblemGroupsFilters,
    setAdminProblemGroupsSorters,
} = problemGroupsAdminSlice.actions;

export default problemGroupsAdminSlice.reducer;
