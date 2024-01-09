import { createSlice } from '@reduxjs/toolkit';

import { FilterColumnTypeEnum } from '../../../common/enums';
import { IAdministrationFilter } from '../../../pages/administration-new/administration-filters/AdministrationFilters';

interface IContestsAdminSlice {
    selectedFilters: IAdministrationFilter[];
    selectedSorters: string[];
}

const initialState: IContestsAdminSlice = {
    selectedFilters: [ {
        column: '',
        operator: '',
        value: '',
        inputType: FilterColumnTypeEnum.STRING,
        availableOperators: [],
        availableColumns: [],
    } ],
    selectedSorters: [],
};

// eslint-disable-next-line import/group-exports
export const contestsAdminSlice = createSlice({
    name: 'adminContests',
    initialState,
    reducers: {
        setInitialAdminContestsColumns: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.selectedFilters[0].availableColumns = action.payload;
        },
        setAdminContestsFilters: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.selectedFilters = action.payload;
        },
        setAdminContestsSorters: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.selectedSorters = action.payload;
        },
    },
});

// eslint-disable-next-line prefer-destructuring,import/group-exports
export const {
    setAdminContestsFilters,
    setAdminContestsSorters,
    setInitialAdminContestsColumns,
} = contestsAdminSlice.actions;

export default contestsAdminSlice.reducer;
