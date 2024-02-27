/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/group-exports */
import { createSlice } from '@reduxjs/toolkit';

import { ContestBreadcrumb, IContestStrategyFilter, IFilter } from '../../common/contest-types';

interface IContestState {
    category: IFilter | null;
    status: string;
    strategy: IContestStrategyFilter | null;
}

const initialState: IContestState = {
    category: null,
    status: 'All',
    strategy: null,
    breadcrumbItems: [],
};

// eslint-disable-next-line import/group-exports
export const contestSlice = createSlice({
    name: 'contests',
    initialState,
    reducers: {
        setContestCategory: (state, action) => {
            state.category = action.payload;
        },
        setContestStrategy: (state, action) => {
            state.strategy = action.payload;
        },
        updateContestCategoryBreadcrumbItem: (state, action) => {
            const { elements } = action.payload;
            if (!elements) {
                return;
            }
            state.breadcrumbItems = [ ...elements ];
        },
        clearContestCategoryBreadcrumbItems: (state) => {
            state.breadcrumbItems = [];
        },
    },
});

// eslint-disable-next-line import/group-exports,prefer-destructuring
export const {
    setContestCategory,
    setContestStrategy,
    updateContestCategoryBreadcrumbItem,
    clearContestCategoryBreadcrumbItems,
} = contestSlice.actions;

export default contestSlice.reducer;
