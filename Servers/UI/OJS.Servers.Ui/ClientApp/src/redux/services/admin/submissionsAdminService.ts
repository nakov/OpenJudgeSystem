import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IGetAllAdminParams,
    IPagedResultType,
    ISubmissionsAdminGridViewType,
} from '../../../common/types';
import { IRetestSubmissionUrlParams } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const submissionsAdminService = createApi({
    reducerPath: 'submissionsAdminService',
    baseQuery: getCustomBaseQuery('submissions'),
    endpoints: (builder) => ({
        getAllSubmissions: builder.query<IPagedResultType<ISubmissionsAdminGridViewType>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: '/getAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
        }),
        deleteSubmission: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
        }),
        retest: builder.mutation({
            query: (submissionId) => ({
                url: `/retest/${submissionId}`,
                method: 'POST',
            }),
        }),
        // eslint-disable-next-line max-len
        downloadFileSubmission: builder.query<{blob: Blob; filename: string }, IRetestSubmissionUrlParams>({ query: ({ id }) => ({ url: `/Download/${id}` }) }),
    }),
});

export const {
    useGetAllSubmissionsQuery,
    useDownloadFileSubmissionQuery,
    useDeleteSubmissionMutation,
    useRetestMutation,
} = submissionsAdminService;

export default submissionsAdminService;
