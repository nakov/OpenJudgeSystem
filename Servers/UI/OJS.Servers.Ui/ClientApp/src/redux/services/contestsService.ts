/* eslint-disable import/group-exports */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IContestStrategyFilter } from '../../common/contest-types';
import { IGetAllContestsOptions,
    IGetContestsForIndexResponseType,
    IIndexContestsType,
    IPagedResultType } from '../../common/types';

export const contestService = createApi({
    reducerPath: 'contests',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5002/api/',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllContests: builder.query<IPagedResultType<IIndexContestsType>, IGetAllContestsOptions>({
            query: ({ status, sortType, page, category, strategy }) => ({
                url: '/Contests/GetAll',
                params: {
                    status,
                    sortType,
                    page,
                    category,
                    strategy,
                },
            }),
        }),
        getIndexContests: builder.query<IGetContestsForIndexResponseType, void>({ query: () => '/Contests/GetForHomeIndex' }),
        getContestCategories: builder.query<any, void>({ query: () => '/ContestCategories/GetCategoriesTree' }),
        getContestStrategies: builder.query<IContestStrategyFilter[], void>({ query: () => '/SubmissionTypes/GetAllOrderedByLatestUsage' }),
        getContestById: builder.query<any, void>({ query: (contestId) => `contests/${contestId}` }),
        getContestByProblemId: builder.query<any, void>({ query: (problemId) => `/contest/${problemId}` }),
    }),
});

export const {
    useGetAllContestsQuery,
    useGetIndexContestsQuery,
    useGetContestCategoriesQuery,
    useGetContestStrategiesQuery,
    useGetContestByIdQuery,
    useGetContestByProblemIdQuery,
} = contestService;
