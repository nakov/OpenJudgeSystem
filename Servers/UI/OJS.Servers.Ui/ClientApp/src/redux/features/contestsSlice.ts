/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ContestBreadcrumb, IContestStrategyFilter } from '../../common/contest-types';
import { IContestCategory, IContestDetailsResponseType } from '../../common/types';

interface IContestState {
    selectedCategory: IContestCategory | null;
    selectedStrategy: IContestStrategyFilter | null;
    breadcrumbItems: Array<ContestBreadcrumb>;
    contestDetails: IContestDetailsResponseType | null;
}

const initialState: IContestState = {
    selectedCategory: null,
    selectedStrategy: null,
    breadcrumbItems: [],
    contestDetails: null,
};

// eslint-disable-next-line import/group-exports
export const contestSlice = createSlice({
    name: 'contests',
    initialState,
    reducers: {
        setContestCategory: (state, action: PayloadAction<IContestCategory | null>) => {
            state.selectedCategory = action.payload;
        },
        setContestStrategy: (state, action: PayloadAction<IContestStrategyFilter | null>) => {
            state.selectedStrategy = action.payload;
        },
        updateContestCategoryBreadcrumbItem: (state, action: PayloadAction<{ elements: Array<ContestBreadcrumb> | undefined}>) => {
            const { elements } = action.payload;
            if (!elements) {
                return;
            }
            state.breadcrumbItems = [ ...elements ];
        },
        clearContestCategoryBreadcrumbItems: (state) => {
            state.breadcrumbItems = [];
        },
        setContestDetails: (state, action: PayloadAction<{ contest: IContestDetailsResponseType | null }>) => {
            const { contest } = action.payload;
            state.contestDetails = contest;
        },
    },
});

// eslint-disable-next-line import/group-exports,prefer-destructuring
export const {
    setContestDetails,
    setContestCategory,
    setContestStrategy,
    updateContestCategoryBreadcrumbItem,
    clearContestCategoryBreadcrumbItems,
} = contestSlice.actions;

export default contestSlice.reducer;
