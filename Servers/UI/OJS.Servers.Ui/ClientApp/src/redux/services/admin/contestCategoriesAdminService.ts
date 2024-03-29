import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IContestCategories,
    IContestCategoryAdministration,
    IFileModel,
    IGetAllAdminParams,
    IIndexContestCategoriesType,
    IPagedResultType,
} from '../../../common/types';
import { IContestCategoriesUrlParams } from '../../../common/url-types';
import { EXCEL_RESULTS_ENDPOINT, GETALL_ENDPOINT } from '../../../common/urls/administration-urls';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const contestCategoriesAdminService = createApi({
    reducerPath: 'contestCategories',
    baseQuery: getCustomBaseQuery('contestCategories'),
    endpoints: (builder) => ({
        getAllAdminContestCategories: builder.query<IPagedResultType<IIndexContestCategoriesType>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: `/${GETALL_ENDPOINT}`,
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 5,
        }),

        getContestCategoryById: builder.query<IContestCategoryAdministration, IContestCategoriesUrlParams>({
            query: ({ id }) => ({ url: `Get/${id}` }),
            keepUnusedDataFor: 0,
        }),

        getCategories: builder.query<Array<IContestCategories>, null>({ query: () => ({ url: '/GetForContestDropdown' }) }),
        createContestCategory: builder.mutation<string, IContestCategoriesUrlParams & IContestCategoryAdministration>({
            query: ({ ...contestCategoryAdministrationModel }) => ({
                url: '/Create',
                method: 'POST',
                body: contestCategoryAdministrationModel,
            }),
        }),

        updateContestCategoryById: builder.mutation<string, IContestCategoryAdministration >({
            query: ({ ...contestCategoryAdministrationModel }) => ({
                url: '/Edit',
                method: 'PATCH',
                body: contestCategoryAdministrationModel,
            }),
        }),

        deleteContestCategory: builder.mutation<string, number >({
            query: (id) => ({
                url: `/Delete/${id}`,
                method: 'DELETE',
            }),
        }),

        exportContestCategoriesToExcel: builder.query<IFileModel, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: `/${EXCEL_RESULTS_ENDPOINT}`,
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetAllAdminContestCategoriesQuery,
    useCreateContestCategoryMutation,
    useGetContestCategoryByIdQuery,
    useUpdateContestCategoryByIdMutation,
    useDeleteContestCategoryMutation,
    useLazyExportContestCategoriesToExcelQuery,
} = contestCategoriesAdminService;

export default contestCategoriesAdminService;
