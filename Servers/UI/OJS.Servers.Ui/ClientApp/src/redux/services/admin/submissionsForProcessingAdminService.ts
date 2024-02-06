/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IGetAllAdminParams,
    IPagedResultType,
    ISubmissionForProcessingAdminGridViewType,
} from '../../../common/types';
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
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllSubmissionsQuery,
} = submissionsForProcessingAdminService;

export default submissionsForProcessingAdminService;
