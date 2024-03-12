import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, ISubmissionTypeAdministrationModel, ISubmissionTypeInProblem, ISubmissionTypesInListModel } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const submissionTypesAdminService = createApi({
    reducerPath: 'submissionTypes',
    baseQuery: getCustomBaseQuery('submissionTypes'),
    endpoints: (builder) => ({
        getForProblem: builder.query<Array<ISubmissionTypeInProblem>, null>({ query: () => ({ url: '/GetForProblem' }) }),
        getAllSubmissionTypes: builder.query<IPagedResultType<ISubmissionTypesInListModel>, IGetAllAdminParams>({
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
        deleteSubmissionType: builder.mutation<string, number>({ query: (id) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
        getCompilers: builder.query<Array<string>, null>({ query: () => ({ url: '/GetCompilers' }) }),
        getExecutionStrategies: builder.query<Array<string>, null>({ query: () => ({ url: '/GetExecutionStrategies' }) }),
        getById: builder.query<ISubmissionTypeAdministrationModel, number>({
            query: (id) => ({ url: `/Get/${id}` }),
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useGetForProblemQuery,
    useGetAllSubmissionTypesQuery,
    useDeleteSubmissionTypeMutation,
    useGetCompilersQuery,
    useGetExecutionStrategiesQuery,
    useGetByIdQuery,
} = submissionTypesAdminService;
export default submissionTypesAdminService;
