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

// eslint-disable-next-line import/group-exports
export const contestSlice = createSlice({
    name: 'contests',
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
        updateContestCategoryBreadcrumbItem: (state, action) => {
            // eslint-disable-next-line prefer-destructuring
            const { index, element } = action.payload;

            if (index < state.breadcrumbItems.length) {
                state.breadcrumbItems.splice(index);
                state.breadcrumbItems.push(element);
                return;
            }

            if (!state.breadcrumbItems[index]) {
                state.breadcrumbItems.push(element);
            } else {
                // eslint-disable-next-line no-param-reassign
                state.breadcrumbItems[index] = element;
            }
        },
        clearContestCategoryBreadcrumbItems: (state) => {
            // eslint-disable-next-line no-param-reassign
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
