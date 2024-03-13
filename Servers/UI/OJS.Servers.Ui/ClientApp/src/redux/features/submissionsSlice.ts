import { createSlice } from '@reduxjs/toolkit';

import { submissionsSliceName } from '../../common/reduxNames';
import { IRecentSubmissionsReduxState } from '../../common/types';

const initialState: IRecentSubmissionsReduxState = {
    submissions: {
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
        setSubmissions: (state: IRecentSubmissionsReduxState, action) => {
            state.submissions = action.payload;
        },
        setCurrentPage: (state: IRecentSubmissionsReduxState, action) => {
            state.currentPage = action.payload;
        },
    },
});

const {
    setSubmissions,
    setCurrentPage,
} = submissionsSlice.actions;

export {
    setSubmissions,
    setCurrentPage,
};

export default submissionsSlice.reducer;
