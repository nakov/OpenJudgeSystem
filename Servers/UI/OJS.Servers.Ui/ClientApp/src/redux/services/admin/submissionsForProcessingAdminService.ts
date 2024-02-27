/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IGetAllAdminParams,
    IPagedResultType,
    ISubmissionForProcessingAdminGridViewType,
} from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const submissionsForProcessingAdminService = createApi({
    reducerPath: 'submissionsForProcessing',
    baseQuery: getCustomBaseQuery('submissionsForProcessing'),
    endpoints: (builder) => ({
        getAllSubmissions: builder.query<IPagedResultType<ISubmissionForProcessingAdminGridViewType>, IGetAllAdminParams>({
            query: ({
                filter, page, itemsPerPage, sorting }) => ({
                url: '/getAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
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

export const {
    useGetAllSubmissionsQuery,
    useGetByIdQuery,
} = submissionsForProcessingAdminService;

export default submissionsForProcessingAdminService;
