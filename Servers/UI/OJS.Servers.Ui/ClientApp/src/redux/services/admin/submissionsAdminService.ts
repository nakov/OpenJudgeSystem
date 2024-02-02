/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import {
    IGetAllAdminParams,
    IPagedResultType,
    ISubmissionsAdminGridViewType,
} from '../../../common/types';
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
    }),
    endpoints: (builder) => ({
        getAllSubmissions: builder.query<IPagedResultType<ISubmissionsAdminGridViewType>, IGetAllAdminParams>({
            query: ({
                filter,
                page,
                ItemsPerPage,
                sorting }) => ({
                url: '',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                } }) }),
        retest: builder.mutation({
            query: (submissionId) => ({
                url: `/retest/${submissionId}`,
                method: 'POST',
            }) }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllSubmissionsQuery,
    useRetestMutation,
} = submissionsAdminService;

export default submissionsAdminService;
