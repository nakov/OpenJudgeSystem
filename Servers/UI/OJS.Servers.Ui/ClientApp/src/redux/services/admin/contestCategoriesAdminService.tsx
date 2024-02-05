import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IContestCategories } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';
import { defaultPathIdentifier } from '../../../common/constants';
import {
    IContestCategoryAdministration,
    IContestCategories,
    IGetAllAdminParams,
    IIndexContestCategoriesType,
    IPagedResultType, IContestAdministration, ExceptionData
} from '../../../common/types';
import {IContestCategoriesUrlParams, IContestDetailsUrlParams} from "../../../common/url-types";

// eslint-disable-next-line import/group-exports
export const contestCategoriesAdminService = createApi({
    reducerPath: 'contestCategories',
    baseQuery: getCustomBaseQuery('contestCategories'),
    endpoints: (builder) => ({
        getAllAdminContestCategories: builder.query<IPagedResultType<IIndexContestCategoriesType>, IGetAllAdminParams>({
            query: ({filter, page, ItemsPerPage, sorting}) => ({
                url: '',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 10,
        }),
        getContestCategoryById: builder.query<IContestCategoryAdministration, IContestCategoriesUrlParams>({
            query: ({ id }) => ({
                url: `GetById/${id}` }),
            keepUnusedDataFor: 10 }),
        getCategories: builder.query<Array<IContestCategories>, null>({ query: () => ({ url: '/GetForContestDropdown' })}),
        createContestCategory: builder.mutation<string, IContestCategoriesUrlParams & IContestCategoryAdministration>({
            query: ({...contestCategoryAdministrationModel}) => ({
                url: '/',
                method: 'POST',
                body: contestCategoryAdministrationModel
            })
        }),
        updateContestCategoryById: builder.mutation<string, IContestCategoriesUrlParams & IContestCategoryAdministration >({
            query: ({ id, ...contestCategoryAdministrationModel }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: contestCategoryAdministrationModel
            })
        }),
    }),
});

// eslint-disable-next-line import/group-exports
export const { useGetCategoriesQuery,
    useGetAllAdminContestCategoriesQuery,
    useCreateContestCategoryMutation,
    useGetContestCategoryByIdQuery,
    useUpdateContestCategoryByIdMutation
} = contestCategoriesAdminService;

export default contestCategoriesAdminService;
