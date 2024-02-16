/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

import { createSlice } from '@reduxjs/toolkit';

import { ContestBreadcrumb, IContestStrategyFilter } from '../../common/contest-types';
import { IContestCategory } from '../../common/types';

interface IContestState {
    selectedCategory: IContestCategory | null;
    selectedStrategy: IContestStrategyFilter | null;
    breadcrumbItems: Array<ContestBreadcrumb>;
}

const initialState: IContestState = {
    selectedCategory: null,
    selectedStrategy: null,
    breadcrumbItems: [],
};

// eslint-disable-next-line import/group-exports
export const contestSlice = createSlice({
    name: 'contests',
    initialState,
    reducers: {
        setContestCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setContestStrategy: (state, action) => {
            state.selectedStrategy = action.payload;
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
