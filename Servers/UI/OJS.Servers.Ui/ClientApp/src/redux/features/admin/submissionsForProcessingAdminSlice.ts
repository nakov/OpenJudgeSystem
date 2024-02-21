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

export const submissionsForProcessingAdminSlice = createSlice({
    name: 'adminSubmissionsForProcessing',
    initialState,
    reducers: {
        setAdminSubmissionsForProcessingFilters: (state, action) => {
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

export const {
    setAdminSubmissionsForProcessingFilters,
    setAdminSubmissionsForProcessingSorters,
} = submissionsForProcessingAdminSlice.actions;

export default submissionsForProcessingAdminSlice.reducer;
