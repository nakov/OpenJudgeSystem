/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ContestBreadcrumb, IContestStrategyFilter } from '../../common/contest-types';
import { IContestCategory, IContestDetailsResponseType, IIndexContestsType, IPagedResultType } from '../../common/types';

interface IContestState {
    selectedCategory: IContestCategory | null;
    selectedStrategy: IContestStrategyFilter | null;
    breadcrumbItems: Array<ContestBreadcrumb>;
    contestDetails: IContestDetailsResponseType | null;
    contestCategories: Array<IContestCategory>;
    userContestParticipations: IPagedResultType<IIndexContestsType>;
    profileUserContestParticipationsPage: number;
}

const initialState: IContestState = {
    selectedCategory: null,
    selectedStrategy: null,
    breadcrumbItems: [],
    contestDetails: null,
    contestCategories: [],
    userContestParticipations: {
        items: [],
        totalItemsCount: 0,
        itemsPerPage: 0,
        pagesCount: 0,
        pageNumber: 0,
    },
    profileUserContestParticipationsPage: 1,
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
        setUserContestParticipations: (state, action: PayloadAction<IPagedResultType<IIndexContestsType>>) => {
            state.userContestParticipations = action.payload;
        },
        setProfileUserContestParticipationsPage: (state, action: PayloadAction<number>) => {
            state.profileUserContestParticipationsPage = action.payload;
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
        setContestCategories: (state, action: PayloadAction<{ contestCategories: Array<IContestCategory> }>) => {
            const { contestCategories } = action.payload;
            state.contestCategories = contestCategories;
        },
    },
});

// eslint-disable-next-line import/group-exports,prefer-destructuring
export const {
    setContestDetails,
    setContestCategory,
    setContestStrategy,
    setUserContestParticipations,
    setProfileUserContestParticipationsPage,
    updateContestCategoryBreadcrumbItem,
    clearContestCategoryBreadcrumbItems,
    setContestCategories,
} = contestSlice.actions;

export default contestSlice.reducer;
