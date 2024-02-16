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
export const submissionsForProcessingAdminSlice = createSlice({
    name: 'adminSubmissionsForProcessing',
    initialState,
    reducers: {
        setAdminSubmissionsForProcessingFilters: (state, action) => {
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
        setAdminSubmissionsForProcessingSorters: (state, action) => {
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
    setAdminSubmissionsForProcessingFilters,
    setAdminSubmissionsForProcessingSorters,
} = submissionsForProcessingAdminSlice.actions;

export default submissionsForProcessingAdminSlice.reducer;
