/* eslint-disable max-len */
/* eslint-disable import/group-exports */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType } from '../../../common/types';
import { CREATE_ENDPOINT, DELETE_ENDPOINT, GET_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls';
import { ITestAdministration, ITestInListData } from '../../../components/administration/tests/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const testsAdminService = createApi({
    reducerPath: 'tests',
    baseQuery: getCustomBaseQuery('tests'),
    endpoints: (builder) => ({
        getAllAdminTests: builder.query<IPagedResultType<ITestInListData>, IGetAllAdminParams>({
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
        deleteTest: builder.mutation<string, number >({ query: (id) => ({ url: `/${DELETE_ENDPOINT}/${id}`, method: 'DELETE' }) }),
        getTestById:
        builder.query<ITestAdministration, number>({ query: (id) => ({ url: `/${GET_ENDPOINT}/${id}` }) }),
        updateTest: builder.mutation<string, ITestAdministration >({
            query: (problemGroup) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: problemGroup,
            }),
        }),
        createTest: builder.mutation<string, ITestAdministration >({
            query: (problemGroup) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: problemGroup,
            }),
        }),

    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllAdminTestsQuery,
    useCreateTestMutation,
    useDeleteTestMutation,
    useUpdateTestMutation,
    useGetTestByIdQuery,

} = testsAdminService;
export default testsAdminService;
