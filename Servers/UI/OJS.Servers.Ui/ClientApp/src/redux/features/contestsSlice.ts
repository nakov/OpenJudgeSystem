import { createSlice } from '@reduxjs/toolkit';

import { IContestStrategyFilter, IFilter } from '../../common/contest-types';

interface IContestState {
    category: IFilter | null;
    strategy: IContestStrategyFilter | null;
    breadcrumbItems: Array<any>;
}

const initialState: IContestState = {
    category: null,
    strategy: null,
    breadcrumbItems: [],
};

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

export const {
    setContestCategory,
    setContestStrategy,
    updateContestCategoryBreadcrumbItem,
    clearContestCategoryBreadcrumbItems,
} = contestSlice.actions;

export default contestSlice.reducer;
