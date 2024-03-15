/* eslint-disable import/prefer-default-export */
import { createSlice } from '@reduxjs/toolkit';

import { IAdminSlice } from '../../../common/types';

const initialState: IAdminSlice = {};
export const checkersAdminSlice = createSlice({
    name: 'adminCheckers',
    initialState,
    reducers: {
        setAdminCheckersFilters: (state, action) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                // @ts-ignore
                state[key].selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminCheckersSorters: (state, action) => {
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
