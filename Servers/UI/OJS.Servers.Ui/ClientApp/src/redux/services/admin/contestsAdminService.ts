import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
    IAdminContestResponseType,
    IAdminPagedResultType,
    IGetAllContestsAdminParams,
} from '../../../common/types';

const contestsAdminService = createApi({
    reducerPath: 'adminContests',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001/api',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllAdminContests: builder.query<IAdminPagedResultType<IAdminContestResponseType>, IGetAllContestsAdminParams>({
            query: ({ filter, page, ItemsPerPage, sorting }) => ({
                url: '/contest',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
        }),
    }),
});

export const { useGetAllAdminContestsQuery } = contestsAdminService;

export default contestsAdminService;
