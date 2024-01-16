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

const submissionDetailsSlice = createSlice({
    name: submissionDetailsSliceName,
    initialState,
    reducers: {
        setSubmission: (state:ISubmissionDetailsReduxState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section When Not To Use It
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.currentSubmission = action.payload;
        },
        setCurrentSubmissionResults: (state:ISubmissionDetailsReduxState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section (When Not To Use It)
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.currentSubmissionResults = action.payload;
        },
        setDownloadErrorMessage: (state:ISubmissionDetailsReduxState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section (When Not To Use It)
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.downloadErrorMessage = action.payload;
        },
        setCurrentPage: (state:ISubmissionDetailsReduxState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section (When Not To Use It)
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.currentPage = action.payload;
        },
        setRetestIsSuccess: (state:ISubmissionDetailsReduxState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section (When Not To Use It)
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.retestIsSuccess = action.payload;
        },
    },
});

// eslint-disable-next-line prefer-destructuring
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
