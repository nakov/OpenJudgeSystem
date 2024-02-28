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

export const contestCategoriesAdminSlice = createSlice({
    name: 'adminContestsCategories',
    initialState,
    reducers: {
        setAdminContestCategoriesFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                // @ts-ignore
                state[key].selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminContestCategoriesSorters: (state, action) => {
            const { key, sorters } = action.payload;

            if (state[key]) {
                // @ts-ignore
                state[key].selectedSorters = sorters;
            } else {
                state[key] = { selectedFilters: null, selectedSorters: sorters };
            }
        },
    },
});

export const {
    setAdminContestCategoriesFilters,
    setAdminContestCategoriesSorters,
} = contestCategoriesAdminSlice.actions;

export default contestCategoriesAdminSlice.reducer;
