import { createSlice } from '@reduxjs/toolkit';

import { ISubmissionDetailsType, ISubmissionResults } from '../../hooks/submissions/types';
import { IErrorDataType } from '../../hooks/use-http';

interface ISubmissionDetailsState {
    currentSubmission: ISubmissionDetailsType | null;
    currentSubmissionResults: ISubmissionResults[];
    validationErrors: IErrorDataType[];
    downloadErrorMessage: string | null;
    currentPage: number;
}
const initialState: ISubmissionDetailsState = {
    currentSubmission: null,
    currentSubmissionResults: [],
    validationErrors: [],
    downloadErrorMessage: null,
    currentPage: 1,
};

const submissionDetailsSlice = createSlice({
    name: 'submissionDetails',
    initialState,
    reducers: {
        setSubmission: (state:ISubmissionDetailsState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section When Not To Use It
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.currentSubmission = action.payload;
        },
        setCurrentSubmissionResults: (state:ISubmissionDetailsState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section (When Not To Use It)
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.currentSubmissionResults = action.payload;
        },
        setDownloadErrorMessage: (state:ISubmissionDetailsState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section (When Not To Use It)
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.downloadErrorMessage = action.payload;
        },
        setCurrentPage: (state:ISubmissionDetailsState, action) => {
            // refer to https://eslint.org/docs/latest/rules/no-param-reassign section (When Not To Use It)
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            state.currentPage = action.payload;
        },
    },
});

// eslint-disable-next-line prefer-destructuring
const { setSubmission, setCurrentSubmissionResults, setDownloadErrorMessage, setCurrentPage } = submissionDetailsSlice.actions;

export {
    setSubmission,
    setCurrentSubmissionResults,
    setDownloadErrorMessage,
    setCurrentPage,
};

export default submissionDetailsSlice.reducer;
