import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ISubmissionDetailsUrlParams } from '../../common/app-url-types';
import { defaultPathIdentifier } from '../../common/constants';
import { submissionDetailsPageServiceName } from '../../common/reduxNames';
import { IPagedResultType } from '../../common/types';
import { IDownloadSubmissionFileUrlParams, IGetSubmissionDetailsByIdUrlParams } from '../../common/url-types';
import { ISubmissionDetailsType, ISubmissionResults } from '../../hooks/submissions/types';

const submissionDetailsService = createApi({
    reducerPath: submissionDetailsPageServiceName,
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
        responseHandler: async (response: Response) => {
            const contentType = response.headers.get('Content-Type');
            if (contentType?.includes('application/octet-stream')) {
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = 'submission.zip';
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
                    if (match) {
                        filename = decodeURIComponent(match[1]);
                    }
                }
                const blob = await response.blob();
                return { blob, filename };
            }
            return response.json();
        },
    }),
    endpoints: (builder) => ({
        // eslint-disable-next-line max-len
        getCurrentSubmission: builder.query<ISubmissionDetailsType, ISubmissionDetailsUrlParams>({ query: ({ submissionId }) => ({ url: `/${defaultPathIdentifier}/Submissions/Details/${submissionId}` }) }),
        getSubmissionResults: builder.query<IPagedResultType<ISubmissionResults>, IGetSubmissionDetailsByIdUrlParams>({
            query: ({ submissionId, page }) => ({
                url: `/${defaultPathIdentifier}/Submissions/GetSubmissionResults/${submissionId}`,
                params: { page },
            }),
        }),
        // eslint-disable-next-line max-len
        saveAttachment: builder.query<{ blob: Blob; filename: string }, IDownloadSubmissionFileUrlParams>({ query: ({ id }) => ({ url: `/${defaultPathIdentifier}/Submissions/Download/${id}` }) }),
    }),
});

const { useGetCurrentSubmissionQuery, useGetSubmissionResultsQuery, useSaveAttachmentQuery } = submissionDetailsService;

export { useGetCurrentSubmissionQuery, useGetSubmissionResultsQuery, useSaveAttachmentQuery };
export default submissionDetailsService;
