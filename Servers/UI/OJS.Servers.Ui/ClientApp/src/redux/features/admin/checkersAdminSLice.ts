/* eslint-disable import/prefer-default-export */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAdminSlice, IFilterReducerActionType, ISorterReducerActionType } from '../../../common/types';

const initialState: IAdminSlice = {};
export const checkersAdminSlice = createSlice({
    name: 'adminCheckers',
    initialState,
    reducers: {
        setAdminCheckersFilters: (state, action: PayloadAction<IFilterReducerActionType>) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                // @ts-ignore
                state[key].selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminCheckersSorters: (state, action: PayloadAction<ISorterReducerActionType>) => {
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
    setAdminCheckersFilters,
    setAdminCheckersSorters,
} = checkersAdminSlice.actions;

export default checkersAdminSlice.reducer;
