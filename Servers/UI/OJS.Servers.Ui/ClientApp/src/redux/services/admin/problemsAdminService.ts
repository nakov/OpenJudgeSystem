/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IIndexProblemsType, IPagedResultType, IProblemAdministration, IProblemResouceInLinstModel } from '../../../common/types';
import { IGetByContestId, IProblemUrlById } from '../../../common/url-types';
import { CREATE_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls';
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
        getProblemById: builder.query<IProblemAdministration, IProblemUrlById>({ query: ({ id }) => ({ url: `/Get/${id}` }) }),
        deleteProblem: builder.mutation<string, number >({ query: (id) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
        updateProblem: builder.mutation({
            query: (problem: FormData) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: problem,
            }),
        }),
        createProblem: builder.mutation({
            query: (problem: FormData) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
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
                url: `/DeleteAll/${contestId}`,
                method: 'DELETE',
            }),
        }),
        copyAll: builder.mutation<string, {sourceContestId:number; destinationContestId:number} >({
            query: ({ sourceContestId, destinationContestId }) => ({
                url: 'CopyAll',
                method: 'POST',
                body: { sourceContestId, destinationContestId },
            }),
        }),
        downloadAdditionalFiles: builder.query<{ blob: Blob; filename: string }, number>({ query: (problemId) => ({ url: `DownloadAdditionalFiles/${problemId}` }), keepUnusedDataFor: 5 }),
        copy: builder.mutation<string, {destinationContestId:number; problemId: number; problemGroupId: number | undefined} >({
            query: ({ destinationContestId, problemId, problemGroupId }) => ({
                url: 'Copy',
                method: 'POST',
                body: { destinationContestId, problemId, problemGroupId },
            }),
        }),
        getResources: builder.query<IPagedResultType<IProblemResouceInLinstModel>, number>({ query: (problemId) => ({ url: `GetResources/${problemId}` }), keepUnusedDataFor: 5 }),
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
    useCreateProblemMutation,
    useDownloadAdditionalFilesQuery,
    useCopyMutation,
    useGetResourcesQuery,

} = problemsAdminService;
export default problemsAdminService;
