/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import {
    IGetAllAdminParams,
    IPagedResultType,
    ISubmissionsAdminGridViewType,
} from '../../../common/types';
import { IRetestSubmissionUrlParams } from '../../../common/url-types';
// eslint-disable-next-line import/group-exports
export const submissionsAdminService = createApi({
    reducerPath: 'submissions',
    baseQuery: fetchBaseQuery({
        credentials: 'include',
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/submissions`,
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

            if (response.headers.get('Content-Length')) {
                return '';
            }

            return response.json();
        },
    }),
    endpoints: (builder) => ({
        getAllSubmissions: builder.query<IPagedResultType<ISubmissionsAdminGridViewType>, IGetAllAdminParams>({
            query: ({
                filter, page, ItemsPerPage, sorting }) => ({
                url: '/getAll',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                } }) }),
        deleteSubmission: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }) }),
        retest: builder.mutation({
            query: (submissionId) => ({
                url: `/retest/${submissionId}`,
                method: 'POST',
            }) }),
        downloadFileSubmission: builder.query<{ blob: Blob; filename: string }, IRetestSubmissionUrlParams>({
            query: ({ id }) => ({
                url: `/download/${id}`,
            }) }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllSubmissionsQuery,
    useDownloadFileSubmissionQuery,
    useDeleteSubmissionMutation,
    useRetestMutation,
} = submissionsAdminService;

export default submissionsAdminService;
