import { createSlice } from '@reduxjs/toolkit';

import { submissionDetailsSliceName } from '../../common/reduxNames';
import { ISubmissionDetailsReduxState } from '../../common/types';

const initialState: ISubmissionDetailsReduxState = {
    currentSubmission: null,
    currentSubmissionResults: {
        items: [],
        totalItemsCount: 0,
        itemsPerPage: 0,
        pagesCount: 0,
        pageNumber: 0,
    },
    validationErrors: [],
    downloadErrorMessage: null,
    currentPage: 1,
    retestIsSuccess: false,
};

export const submissionDetailsSlice = createSlice({
    name: submissionDetailsSliceName,
    initialState,
    reducers: {
        setSubmission: (state:ISubmissionDetailsReduxState, action) => {
            state.currentSubmission = action.payload;
        },
        setCurrentSubmissionResults: (state:ISubmissionDetailsReduxState, action) => {
            state.currentSubmissionResults = action.payload;
        },
        setDownloadErrorMessage: (state:ISubmissionDetailsReduxState, action) => {
            state.downloadErrorMessage = action.payload;
        },
        setCurrentPage: (state:ISubmissionDetailsReduxState, action) => {
            state.currentPage = action.payload;
        },
        setRetestIsSuccess: (state:ISubmissionDetailsReduxState, action) => {
            state.retestIsSuccess = action.payload;
        },
    },
});

const {
    setSubmission,
    setCurrentSubmissionResults,
    setDownloadErrorMessage,
    setCurrentPage,
    setRetestIsSuccess,
} = submissionDetailsSlice.actions;

export {
    setSubmission,
    setCurrentSubmissionResults,
    setDownloadErrorMessage,
    setCurrentPage,
    setRetestIsSuccess,
};

export default submissionDetailsSlice.reducer;
