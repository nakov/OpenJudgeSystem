import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ISubmissionDetailsUrlParams } from '../../common/app-url-types';
import { IPagedResultType } from '../../common/types';
import { IDownloadSubmissionFileUrlParams, IGetSubmissionDetailsByIdUrlParams } from '../../common/url-types';
import { ISubmissionDetailsType, ISubmissionResults } from '../../hooks/submissions/types';

const submissionDetailsService = createApi({
    reducerPath: 'submissionDetailsPage',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // eslint-disable-next-line max-len
        getCurrentSubmission: builder.query<ISubmissionDetailsType, ISubmissionDetailsUrlParams>({ query: ({ submissionId }) => ({ url: `/api/Submissions/Details/${submissionId}` }) }),
        getSubmissionResults: builder.query<IPagedResultType<ISubmissionResults>, IGetSubmissionDetailsByIdUrlParams>({
            query: ({ submissionId, page }) => ({
                url: `/api/Submissions/GetSubmissionResults/${submissionId}`,
                params: { page },
            }),
            keepUnusedDataFor: 0,
        }),
        // eslint-disable-next-line max-len
        saveAttachment: builder.query<Blob, IDownloadSubmissionFileUrlParams>({ query: ({ id }) => ({ url: `/api/Submissions/Download/${id}` }) }),
    }),
});

const { useGetCurrentSubmissionQuery, useGetSubmissionResultsQuery, useSaveAttachmentQuery } = submissionDetailsService;

export { useGetCurrentSubmissionQuery, useGetSubmissionResultsQuery, useSaveAttachmentQuery };
export default submissionDetailsService;
