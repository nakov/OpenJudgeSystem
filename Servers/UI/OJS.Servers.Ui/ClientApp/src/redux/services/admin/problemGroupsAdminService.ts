/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IProblemGroupsData } from '../../../common/types';
import { CREATE_ENDPOINT, DELETE_ENDPOINT, GET_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls';
import { IProblemGroupAdministrationModel } from '../../../components/administration/problem-groups/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const problemGroupsAdminService = createApi({
    reducerPath: 'problemGroups',
    baseQuery: getCustomBaseQuery('problemGroups'),
    endpoints: (builder) => ({
        getProblemGroupsForProblem: builder.query<any, null>({ query: () => ({ url: '/GetForProblem' }) }),
        getAllAdminProblemGroups: builder.query<IPagedResultType<IProblemGroupsData>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: 'GetAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
        }),
        deleteProblemGroup: builder.mutation<string, number >({ query: (id) => ({ url: `/${DELETE_ENDPOINT}/${id}`, method: 'DELETE' }) }),
        getProblemGroupById:
        builder.query<IProblemGroupAdministrationModel, number>({ query: (id) => ({ url: `/${GET_ENDPOINT}/${id}` }) }),
        updateProblemGroup: builder.mutation<string, IProblemGroupAdministrationModel >({
            query: (problemGroup) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: problemGroup,
            }),
        }),
        createProblemGroup: builder.mutation<string, IProblemGroupAdministrationModel >({
            query: (problemGroup) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: problemGroup,
            }),
        }),

    }),
});

export const {
    useGetProblemGroupsForProblemQuery,
    useGetAllAdminProblemGroupsQuery,
    useDeleteProblemGroupMutation,
    useGetProblemGroupByIdQuery,
    useUpdateProblemGroupMutation,
    useCreateProblemGroupMutation,
} = problemGroupsAdminService;
export default problemGroupsAdminService;
