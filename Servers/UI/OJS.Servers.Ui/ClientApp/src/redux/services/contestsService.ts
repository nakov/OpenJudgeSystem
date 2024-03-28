/* eslint-disable object-curly-newline */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../common/constants';
import { IContestStrategyFilter } from '../../common/contest-types';
import {
    IContestCategory,
    IContestDetailsResponseType,
    IGetAllContestsOptions,
    IIndexContestsType,
    IPagedResultType, IRegisterForContestResponseType, IStartParticipationResponseType,
} from '../../common/types';
import {
    IContestDetailsUrlParams,
    IStartParticipationParams,
    ISubmitContestPasswordParams,
    ISubmitContestSolutionParams,
} from '../../common/url-types';

// eslint-disable-next-line import/group-exports
export const contestsService = createApi({
    reducerPath: 'contestService',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_UI_SERVER_URL}/${defaultPathIdentifier}/`,
        credentials: 'include',
        prepareHeaders: (headers: any) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllContests: builder.query<IPagedResultType<IIndexContestsType>, IGetAllContestsOptions>({
            query: ({ sortType, page, category, strategy }) => ({
                url: '/Contests/GetAll',
                params: {
                    sortType,
                    page,
                    category,
                    strategy,
                },
            }),
        }),
        getContestById: builder.query<IContestDetailsResponseType, IContestDetailsUrlParams>({
            query: ({ id }) => ({ url: `/Contests/Details/${id}` }),
            keepUnusedDataFor: 10,
        }),
        getContestCategories: builder.query<Array<IContestCategory>, void>({ query: () => '/ContestCategories/GetCategoriesTree' }),
        getContestStrategies: builder.query<IContestStrategyFilter[], void>({ query: () => '/SubmissionTypes/GetAllOrderedByLatestUsage' }),
        getContestRegisteredUser: builder.query<IRegisterForContestResponseType, IStartParticipationParams>({
            query: ({ id, isOfficial }) => ({
                url: `/Contests/Register/${id}`,
                params: {
                    official: isOfficial,
                },
            }),
        }),
        getContestUserParticipation: builder.query<IStartParticipationResponseType, IStartParticipationParams>({
            query: ({ id, isOfficial }) => ({
                url: `/Compete/Index/${id}`,
                params: {
                    official: isOfficial,
                },
            }),
        }),
        submitContestSolution: builder.mutation<void, ISubmitContestSolutionParams>({
            query: ({ content, official, problemId, submissionTypeId }) => ({
                url: '/Compete/Submit',
                method: 'POST',
                body: { content, official, problemId, submissionTypeId },
            }),
        }),
        submitContestPassword: builder.mutation<void, ISubmitContestPasswordParams>({
            query: ({ contestId, isOfficial, password }) => ({
                url: `/Contests/SubmitContestPassword/${contestId}`,
                method: 'POST',
                params: {
                    isOfficial,
                },
                body: {
                    password,
                },
            }),
        }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllContestsQuery,
    useGetContestCategoriesQuery,
    useGetContestStrategiesQuery,
    useGetContestByIdQuery,
    useGetContestRegisteredUserQuery,
    useLazyGetContestByIdQuery,
    useLazyGetContestUserParticipationQuery,
    useSubmitContestSolutionMutation,
    useSubmitContestPasswordMutation,
} = contestsService;
