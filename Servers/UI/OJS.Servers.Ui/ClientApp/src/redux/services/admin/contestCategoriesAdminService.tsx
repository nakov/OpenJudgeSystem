import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import {
    IContestCategoryAdministration,
    IContestCategories,
    IGetAllAdminParams,
    IIndexContestCategoriesType,
    IPagedResultType, IContestAdministration, ExceptionData
} from '../../../common/types';
import {IContestCategoriesUrlParams, IContestDetailsUrlParams} from "../../../common/url-types";
import {BaseQueryApi, FetchArgs} from "@reduxjs/toolkit/dist/query/react";

type ExtraOptionsType = {
// Add extra options if needed
}
type ResultError = {
    data: Array<ExceptionData>;
}
const errorStatusCodes = [ 400, 401, 403, 422, 500 ];
const succesfullStatusCodes = [ 200, 204 ];

const customBaseQuery = async (args: FetchArgs, api: BaseQueryApi, extraOptions:ExtraOptionsType) => {
    const baseQuery = fetchBaseQuery({
        credentials: 'include',
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/contestCategories`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    });

    const result = await baseQuery(args, api, extraOptions);
    const response = result.meta?.response;
    if (response && errorStatusCodes.some((status) => status === Number(response.status))) {
        const errorsArray = result.error as ResultError;
        return { error: errorsArray.data as Array<ExceptionData> };
    }

    if (response && succesfullStatusCodes.some((status) => status === Number(response!.status))) {
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('text')) {
            return { data: result.error?.data };
        }
    }

    return result;
};

// eslint-disable-next-line import/group-exports
export const contestCategoriesAdminService = createApi({
    reducerPath: 'contestCategories',
    baseQuery: customBaseQuery,
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
        getCategories: builder.query<Array<IContestCategories>, null>({query: () => ({url: '/dropdown'})}),
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
