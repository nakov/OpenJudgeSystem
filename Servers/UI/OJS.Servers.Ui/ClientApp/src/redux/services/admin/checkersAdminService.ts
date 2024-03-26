import { createApi } from '@reduxjs/toolkit/query/react';

import { ICheckerAdministrationModel, ICheckerInListModel, IGetAllAdminParams, IPagedResultType } from '../../../common/types';
import { CREATE_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls/administration-urls';
import customBaseQuery from '../../middlewares/customBaseQuery';

export const checkerAdminService = createApi({
    reducerPath: 'checkersAdmin',
    baseQuery: customBaseQuery('checkers'),
    endpoints: (builder) => ({
        getCheckersForProblem: builder.query<Array<{id: number; name: string}>, null>({ query: () => ({ url: '/GetForProblems' }) }),
        getAllCheckers: builder.query<IPagedResultType<ICheckerInListModel>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: 'GetAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 5,
        }),
        getCheckerById: builder.query<ICheckerAdministrationModel, number>({
            query: (id) => ({ url: `/Get/${id}` }),
            keepUnusedDataFor: 0,
        }),
        deleteChecker: builder.mutation<string, number>({ query: (id) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
        createChecker: builder.mutation({
            query: (checker: ICheckerAdministrationModel) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: checker,
            }),
        }),
        updateChecker: builder.mutation({
            query: (checker: ICheckerAdministrationModel) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: checker,
            }),
        }),
    }),
});

export const {
    useGetCheckersForProblemQuery,
    useGetAllCheckersQuery,
    useDeleteCheckerMutation,
    useGetCheckerByIdQuery,
    useCreateCheckerMutation,
    useUpdateCheckerMutation,
} = checkerAdminService;
export default checkerAdminService;
