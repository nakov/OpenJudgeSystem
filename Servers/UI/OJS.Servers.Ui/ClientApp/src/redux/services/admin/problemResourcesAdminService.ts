/* eslint-disable import/group-exports */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IProblemResouceInLinstModel, IProblemResourceAdministrationModel } from '../../../common/types';
import { CREATE_ENDPOINT, DELETE_ENDPOINT, GET_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const problemResourcesAdminService = createApi({
    reducerPath: 'problemResources',
    baseQuery: getCustomBaseQuery('problemResources'),
    endpoints: (builder) => ({
        getAllAdminProblemResources: builder.query<IPagedResultType<IProblemResouceInLinstModel>, IGetAllAdminParams>({
            query: ({ filter, page, ItemsPerPage, sorting }) => ({
                url: 'GetAll',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
        }),
        deleteProblemResource: builder.mutation<string, number >({
            query: (id) => ({
                url: `/${DELETE_ENDPOINT}/${id}`,
                method: 'DELETE',
            }),
        }),
        getProblemResourceById:
        builder.query<IProblemResourceAdministrationModel, number>({ query: (id) => ({ url: `/${GET_ENDPOINT}/${id}` }) }),

        updateProblemResource: builder.mutation<string, FormData >({
            query: (resource: FormData) => ({
                url: `/${UPDATE_ENDPOINT}/`,
                method: 'PATCH',
                body: resource,
            }),
        }),
        downloadResource: builder.query<{ blob: Blob; filename: string }, number>({
            query: (resourceId) => ({ url: `/Download/${resourceId}` }),
            keepUnusedDataFor: 5,
        }),
        createProblemResource: builder.mutation<string, FormData >({
            query: (resource:FormData) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: resource,
            }),
        }),
    }),
});

export const {
    useGetAllAdminProblemResourcesQuery,
    useDeleteProblemResourceMutation,
    useGetProblemResourceByIdQuery,
    useCreateProblemResourceMutation,
    useUpdateProblemResourceMutation,
    useDownloadResourceQuery,
} = problemResourcesAdminService;

export default problemResourcesAdminService;
