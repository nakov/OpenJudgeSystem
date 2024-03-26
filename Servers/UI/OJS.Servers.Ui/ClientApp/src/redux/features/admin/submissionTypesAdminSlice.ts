import { createSlice } from '@reduxjs/toolkit';

import { IAdministrationFilter } from '../../../pages/administration-new/administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../../../pages/administration-new/administration-sorting/AdministrationSorting';

interface IAdminSlice {
    [key: string]: null | {
        selectedFilters: null | IAdministrationFilter[];
        selectedSorters: null | IAdministrationSorter[];
    };
}

const initialState: IAdminSlice = {};

export const submissionTypesAdminSlice = createSlice({
    name: 'adminSubmissionTypes',
    initialState,
    reducers: {
        setAdminSUbmissionTypesFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                // @ts-ignore
                state[key].selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminSUbmissionTypesSorters: (state, action) => {
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
    setAdminSUbmissionTypesFilters,
    setAdminSUbmissionTypesSorters,
} = submissionTypesAdminSlice.actions;

export default submissionTypesAdminSlice.reducer;
