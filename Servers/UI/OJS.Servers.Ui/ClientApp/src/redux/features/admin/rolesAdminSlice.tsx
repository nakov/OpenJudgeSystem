import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IFilterReducerActionType, ISorterReducerActionType } from '../../../common/types';

import { IAdminSlice } from './contestsAdminSlice';

const initialState: IAdminSlice = {};

export const rolesAdminSlice = createSlice({
    name: 'adminRoles',
    initialState,
    reducers: {
        setAdminRolesFilters: (state, action: PayloadAction<IFilterReducerActionType>) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                state[key]!.selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminRolesSorters: (state, action: PayloadAction<ISorterReducerActionType>) => {
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
    setAdminRolesFilters,
    setAdminRolesSorters,
} = rolesAdminSlice.actions;

export default rolesAdminSlice.reducer;
