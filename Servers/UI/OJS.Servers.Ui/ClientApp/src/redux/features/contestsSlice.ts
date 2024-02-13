import { createSlice } from '@reduxjs/toolkit';

import { IContestStrategyFilter, IFilter } from '../../common/contest-types';

interface IContestState {
    category: IFilter | null;
    strategy: IContestStrategyFilter | null;
    filteredStrategies: [];
}

const initialState: IContestState = {
    category: null,
    strategy: null,
    filteredStrategies: [],
};

// eslint-disable-next-line import/group-exports
export const contestSlice = createSlice({
    name: 'filterContests',
    initialState,
    reducers: {
        setContestCategory: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.category = action.payload;
        },
        setContestStrategy: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.strategy = action.payload;
        },
        setContestFilteredStrategies: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.filteredStrategies = action.payload;
        },
        clearContestFilters: (state) => {
            // eslint-disable-next-line no-param-reassign
            state.category = null;
            // eslint-disable-next-line no-param-reassign
            state.strategy = null;
        },
    },
});

// eslint-disable-next-line import/group-exports,prefer-destructuring
export const {
    setContestCategory,
    setContestStrategy,
    clearContestFilters,
    setContestFilteredStrategies,
} = contestSlice.actions;

export default contestSlice.reducer;
