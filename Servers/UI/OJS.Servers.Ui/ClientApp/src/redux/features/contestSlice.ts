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

export const contestSlice = createSlice({
    name: 'filterContests',
    initialState,
    reducers: {
        setContestCategory: (state, action) => {
            state.category = action.payload;
        },
        setContestStatus: (state, action) => {
            state.status = action.payload;
        },
        setContestStrategy: (state, action) => {
            state.strategy = action.payload;
        },
        clearContestFilters: (state) => {
            state.category = null;
            state.status = 'All';
            state.strategy = null;
        },
    },
});

export const {
    setContestCategory,
    setContestStatus,
    setContestStrategy,
    clearContestFilters,
} = contestSlice.actions;

export default contestSlice.reducer;
