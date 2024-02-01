import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IIndexProblemsType, IPagedResultType, IProblemAdministration } from '../../../common/types';
import { IGetByContestId, IProblemUrlById } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

// eslint-disable-next-line import/group-exports
export const problemsAdminService = createApi({
    reducerPath: 'problems',
    baseQuery: getCustomBaseQuery('problems'),
    endpoints: (builder) => ({
        getAllAdminProblems: builder.query<IPagedResultType<IIndexProblemsType>, IGetAllAdminParams>({
            query: ({ filter, page, ItemsPerPage, sorting }) => ({
                url: 'GetAll',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 10,
        }),
        getProblemById: builder.query<IProblemAdministration, IProblemUrlById>({ query: ({ id }) => ({ url: `/ById/${id}` }) }),
        deleteProblem: builder.mutation<string, IProblemUrlById >({ query: ({ id }) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
        updateProblem: builder.mutation({
            query: (problem) => ({
                url: `/${problem.id}`,
                method: 'PATCH',
                body: problem,
            }),
        }),
        getContestProblems: builder.query<IPagedResultType<IIndexProblemsType>, IGetByContestId>({
            query: ({ contestId, filter, page, ItemsPerPage, sorting }) => ({
                url: `/GetByContestId/${contestId}`,
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
        }),
        retestById: builder.mutation({
            query: (problem) => ({
                url: '/Retest',
                method: 'POST',
                body: problem,
            }),
        }),
        deleteByContest: builder.mutation({
            query: (contestId) => ({
                url: `/Delete/${contestId}`,
                method: 'DELETE',
            }),
        }),
        copyAll: builder.mutation<string, {sourceContestId:number; destinationContestId:number} >({
            query: ({ sourceContestId, destinationContestId }) => ({
                url: 'copyAll',
                method: 'POST',
                body: { sourceContestId, destinationContestId },
            }),
        }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllAdminProblemsQuery,
    useGetProblemByIdQuery,
    useDeleteProblemMutation,
    useUpdateProblemMutation,
    useGetContestProblemsQuery,
    useRetestByIdMutation,
    useDeleteByContestMutation,
    useCopyAllMutation,

} = problemsAdminService;
export default problemsAdminService;
