import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IFilterReducerActionType, ISorterReducerActionType } from '../../../common/types';

import { IAdminSlice } from './contestsAdminSlice';

const initialState: IAdminSlice = {};

export const participantsAdminSlice = createSlice({
    name: 'adminParticipants',
    initialState,
    reducers: {
        setAdminParticipantsFilters: (state, action: PayloadAction<IFilterReducerActionType>) => {
            const { key, filters } = action.payload;

            if (state[key]) {
                state[key]!.selectedFilters = filters;
            } else {
                state[key] = { selectedFilters: filters, selectedSorters: null };
            }
        },
        setAdminParticipantsSorters: (state, action: PayloadAction<ISorterReducerActionType>) => {
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
    setAdminParticipantsFilters,
    setAdminParticipantsSorters,
} = participantsAdminSlice.actions;

export default participantsAdminSlice.reducer;
