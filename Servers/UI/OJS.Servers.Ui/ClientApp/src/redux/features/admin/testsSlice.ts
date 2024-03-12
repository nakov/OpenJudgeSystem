import { createSlice } from '@reduxjs/toolkit';

import { IAdminSlice } from './contestsAdminSlice';

const initialState: IAdminSlice = {};

export const testsAdminSlice = createSlice({
    name: 'adminTests',
    initialState,
    reducers: {
        setAdminTestsFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                state[key]!.selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminTestsSorters: (state, action) => {
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
    setAdminTestsFilters,
    setAdminTestsSorters,
} = testsAdminSlice.actions;

export default testsAdminSlice.reducer;
