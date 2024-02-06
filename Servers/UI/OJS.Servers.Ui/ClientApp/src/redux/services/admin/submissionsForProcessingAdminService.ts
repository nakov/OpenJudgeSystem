/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IContestAdministration,
    IGetAllAdminParams,
    IPagedResultType,
    ISubmissionForProcessingAdminGridViewType,
} from '../../../common/types';
import { IContestDetailsUrlParams } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';
// eslint-disable-next-line import/group-exports
export const submissionsForProcessingAdminService = createApi({
    reducerPath: 'submissionsForProcessing',
    baseQuery: getCustomBaseQuery('submissionsForProcessing'),
    endpoints: (builder) => ({
        getAllSubmissions: builder.query<IPagedResultType<ISubmissionForProcessingAdminGridViewType>, IGetAllAdminParams>({
            query: ({
                filter, page, ItemsPerPage, sorting }) => ({
                url: '/getAll',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                } }) }),
        getById: builder.query<ISubmissionForProcessingAdminGridViewType, { id:number }>({
            query: ({ id }) => ({
                url: `/Get/${id}`,
            }),
            keepUnusedDataFor: 10,
        }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllSubmissionsQuery,
    useGetByIdQuery,
} = submissionsForProcessingAdminService;

export default submissionsForProcessingAdminService;
