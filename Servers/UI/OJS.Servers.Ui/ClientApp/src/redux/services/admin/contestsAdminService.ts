import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IGetAllContestsAdminParams,
    IIndexContestsType,
    IPagedResultType } from '../../../common/types';

export const contestService = createApi({
    reducerPath: 'contests',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001/api',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllAdminContests: builder.query<IPagedResultType<IIndexContestsType>, IGetAllContestsAdminParams>({
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

export const { useGetAllAdminContestsQuery } = contestService;
