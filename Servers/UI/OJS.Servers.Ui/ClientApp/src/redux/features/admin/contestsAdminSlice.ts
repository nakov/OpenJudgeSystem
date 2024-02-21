/* eslint-disable import/exports-last */
import { createSlice } from '@reduxjs/toolkit';

import { IAdministrationFilter } from '../../../pages/administration-new/administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../../../pages/administration-new/administration-sorting/AdministrationSorting';

export interface IAdminSlice {
    [key: string]: null | {
        selectedFilters: null | IAdministrationFilter[];
        selectedSorters: null | IAdministrationSorter[];
    };
}

const initialState: IAdminSlice = {};

export const contestsAdminSlice = createSlice({
    name: 'adminContests',
    initialState,
    reducers: {
        setAdminContestsFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                // @typescript-eslint/ban-ts-comment
                // @ts-ignore
                state[key].selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminContestsSorters: (state, action) => {
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
    setAdminContestsFilters,
    setAdminContestsSorters,
} = contestsAdminSlice.actions;

export default contestsAdminSlice.reducer;
