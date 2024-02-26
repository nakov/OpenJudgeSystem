import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IContestCategories,
    IContestCategoryAdministration,
    IGetAllAdminParams,
    IIndexContestCategoriesType,
    IPagedResultType,
} from '../../../common/types';
import { IContestCategoriesUrlParams } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

// eslint-disable-next-line import/group-exports
export const contestCategoriesAdminService = createApi({
    reducerPath: 'contestCategories',
    baseQuery: getCustomBaseQuery('contestCategories'),
    endpoints: (builder) => ({
        getAllAdminContestCategories: builder.query<IPagedResultType<IIndexContestCategoriesType>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: '/getAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 10,
        }),
        getContestCategoryById: builder.query<IContestCategoryAdministration, IContestCategoriesUrlParams>({
            query: ({ id }) => ({ url: `Get/${id}` }),
            keepUnusedDataFor: 10,
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
        deleteContestCategory: builder.mutation<string, IContestCategoriesUrlParams >({
            query: ({ id }) => ({
                url: `/Delete/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetCategoriesQuery,
    useGetAllAdminContestCategoriesQuery,
    useCreateContestCategoryMutation,
    useGetContestCategoryByIdQuery,
    useUpdateContestCategoryByIdMutation,
    useDeleteContestCategoryMutation,
} = contestCategoriesAdminService;

export default contestCategoriesAdminService;
