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

// eslint-disable-next-line import/group-exports
export const examGroupsAdminSlice = createSlice({
    name: 'adminExamGroups',
    initialState,
    reducers: {
        setAdminExamGroupsFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                // @ts-ignore
                state[key].selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminExamGroupsSorters: (state, action) => {
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

// eslint-disable-next-line prefer-destructuring,import/group-exports
export const {
    setAdminExamGroupsFilters,
    setAdminExamGroupsSorters,
} = examGroupsAdminSlice.actions;

export default examGroupsAdminSlice.reducer;
