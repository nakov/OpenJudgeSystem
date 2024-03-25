import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, ISubmissionTypeAdministrationModel, ISubmissionTypeInProblem, ISubmissionTypesInListModel } from '../../../common/types';
import { CREATE_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls/administration-urls';
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
            keepUnusedDataFor: 3,
        }),
        deleteSubmissionType: builder.mutation<string, number>({ query: (id) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
        getCompilers: builder.query<Array<string>, null>({ query: () => ({ url: '/GetCompilers' }) }),
        getExecutionStrategies: builder.query<Array<string>, null>({ query: () => ({ url: '/GetExecutionStrategies' }) }),
        getById: builder.query<ISubmissionTypeAdministrationModel, number>({
            query: (id) => ({ url: `/Get/${id}` }),
            keepUnusedDataFor: 0,
        }),
        updateSubmissionType: builder.mutation<string, ISubmissionTypeAdministrationModel >({
            query: (problemGroup) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: problemGroup,
            }),
        }),
        createSubmissionType: builder.mutation<string, ISubmissionTypeAdministrationModel >({
            query: (problemGroup) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: problemGroup,
            }),
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
    useUpdateSubmissionTypeMutation,
    useCreateSubmissionTypeMutation,

} = submissionTypesAdminService;
export default submissionTypesAdminService;
