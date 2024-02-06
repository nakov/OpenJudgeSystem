import { createSlice } from '@reduxjs/toolkit';

// interfaces & types
import { IContestStrategyFilter, IFilter } from '../../common/contest-types';

interface IContestState {
    category: IFilter | null;
    status: string;
    strategy: IContestStrategyFilter | null;
}

const initialState: IContestState = {
    category: null,
    status: 'All',
    strategy: null,
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
        setContestStatus: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.status = action.payload;
        },
        setContestStrategy: (state, action) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            state.strategy = action.payload;
        },
        clearContestFilters: (state) => {
            // eslint-disable-next-line no-param-reassign
            state.category = null;
            // eslint-disable-next-line no-param-reassign
            state.status = 'All';
            // eslint-disable-next-line no-param-reassign
            state.strategy = null;
        },
    },
});

// eslint-disable-next-line import/group-exports,prefer-destructuring
export const {
    setContestCategory,
    setContestStatus,
    setContestStrategy,
    clearContestFilters,
} = contestSlice.actions;

export default contestSlice.reducer;
