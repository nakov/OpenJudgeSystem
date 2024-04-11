import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../common/constants';
import { IContestStrategyFilter } from '../../common/contest-types';
import {
    IContestCategory,
    IContestDetailsResponseType,
    IContestsSortAndFilterOptions,
    IGetContestParticipationsForUserQueryParams,
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
        getAllContests: builder.query<IPagedResultType<IIndexContestsType>, IContestsSortAndFilterOptions>({
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
        getContestCategories: builder.query<Array<IContestCategory>, void>({
            query: () => ({ url: '/ContestCategories/GetCategoriesTree' }),
            /* eslint-disable object-curly-newline */
        }),
        getContestStrategies: builder.query<IContestStrategyFilter[], void>({
            query: () => ({ url: '/SubmissionTypes/GetAllOrderedByLatestUsage' }),
            /* eslint-disable object-curly-newline */
        }),
        getContestsParticipationsForUser: builder.query<
            IPagedResultType<IIndexContestsType>,
            IGetContestParticipationsForUserQueryParams>({
                query: ({ username, sortType, sortTypeDirection, page, category, strategy }) => ({
                    url: `/Contests/GetParticipatedByUser?username=${username}`,
                    params: {
                        sortType,
                        sortTypeDirection,
                        page,
                        category,
                        strategy,
                    },
                }),
            }),
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
    useLazyGetContestByIdQuery,
    useLazyGetContestsParticipationsForUserQuery,
    useGetContestRegisteredUserQuery,
    useLazyGetContestUserParticipationQuery,
    useSubmitContestSolutionMutation,
    useSubmitContestPasswordMutation,
} = contestsService;
