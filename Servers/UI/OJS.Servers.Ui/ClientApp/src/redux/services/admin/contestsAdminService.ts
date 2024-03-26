import { createApi } from '@reduxjs/toolkit/query/react';

import { IContestAdministration, IContestAutocomplete, IGetAllAdminParams,
    IIndexContestsType,
    IPagedResultType } from '../../../common/types';
import { IContestDetailsUrlParams } from '../../../common/url-types';
import { CREATE_ENDPOINT, DELETE_ENDPOINT, GET_ENDPOINT, GETALL_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls/administration-urls';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const contestService = createApi({
    reducerPath: 'contestsAdminService',
    baseQuery: getCustomBaseQuery('contests'),
    endpoints: (builder) => ({
        getAllAdminContests: builder.query<IPagedResultType<IIndexContestsType>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: `/${GETALL_ENDPOINT}`,
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 10,
        }),

        getContestById: builder.query<IContestAdministration, IContestDetailsUrlParams>({
            query: ({ id }) => ({ url: `/${GET_ENDPOINT}/${id}` }),
            keepUnusedDataFor: 10,
        }),

        deleteContest: builder.mutation<string, number >({ query: (id) => ({ url: `/${DELETE_ENDPOINT}/${id}`, method: 'DELETE' }) }),

        updateContest: builder.mutation<string, IContestAdministration >({
            query: ({ ...contestAdministrationModel }) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: contestAdministrationModel,
            }),
        }),

        createContest: builder.mutation<string, IContestDetailsUrlParams & IContestAdministration >({
            query: ({ ...contestAdministrationModel }) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: contestAdministrationModel,
            }),
        }),

        getCopyAll: builder.query<Array<IContestAutocomplete>, string>({
            query: (queryString) => ({ url: `/GetAllForProblem?searchString=${encodeURIComponent(queryString)}` }),
            keepUnusedDataFor: 10,
        }),

        downloadResults: builder.mutation<{ blob: Blob; filename: string }, {id:number; type:number} >({
            query: ({ ...contestAdministrationModel }) => ({
                url: '/Export',
                method: 'POST',
                body: contestAdministrationModel,
            }),
        }),
    }),
});

export const {
    useGetAllAdminContestsQuery,
    useGetContestByIdQuery,
    useDeleteContestMutation,
    useUpdateContestMutation,
    useCreateContestMutation,
    useGetCopyAllQuery,
    useDownloadResultsMutation,
} = contestService;
export default contestService;
