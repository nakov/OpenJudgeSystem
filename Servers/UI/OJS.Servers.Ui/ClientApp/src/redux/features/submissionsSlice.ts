import { createSlice } from '@reduxjs/toolkit';

import { submissionsSliceName } from '../../common/reduxNames';
import { IRecentSubmissionsReduxState } from '../../common/types';

const initialState: IRecentSubmissionsReduxState = {
    latestSubmissions: {
        items: [],
        totalItemsCount: 0,
        itemsPerPage: 0,
        pagesCount: 0,
        pageNumber: 0,
    },
    currentPage: 1,
};

export const submissionsSlice = createSlice({
    name: submissionsSliceName,
    initialState,
    reducers: {
        setLatestSubmissions: (state: IRecentSubmissionsReduxState, action) => {
            state.latestSubmissions = action.payload;
        },
        setCurrentPage: (state: IRecentSubmissionsReduxState, action) => {
            state.currentPage = action.payload;
        },
    },
});

const {
    setLatestSubmissions,
    setCurrentPage,
} = submissionsSlice.actions;

export {
    setLatestSubmissions,
    setCurrentPage,
};

export default submissionsSlice.reducer;
