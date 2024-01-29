/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { ExceptionData, IContestAdministration, IContestAutocomplete, IGetAllAdminParams,
    IIndexContestsType,
    IPagedResultType } from '../../../common/types';
import { IContestDetailsUrlParams } from '../../../common/url-types';

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
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/contests`,
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
export const contestService = createApi({
    reducerPath: 'contests',
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getAllAdminContests: builder.query<IPagedResultType<IIndexContestsType>, IGetAllAdminParams>({
            query: ({ filter, page, ItemsPerPage, sorting }) => ({
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
        getContestById: builder.query<IContestAdministration, IContestDetailsUrlParams>({ query: ({ id }) => ({ url: `/${id}` }), keepUnusedDataFor: 10 }),
        deleteContest: builder.mutation<string, IContestDetailsUrlParams >({ query: ({ id }) => ({ url: `/${id}`, method: 'DELETE' }) }),
        updateContest: builder.mutation<string, IContestDetailsUrlParams & IContestAdministration >({ query: ({ id, ...contestAdministrationModel }) => ({ url: `/${id}`, method: 'PATCH', body: contestAdministrationModel }) }),
        createContest: builder.mutation<string, IContestDetailsUrlParams & IContestAdministration >({ query: ({ ...contestAdministrationModel }) => ({ url: '/', method: 'POST', body: contestAdministrationModel }) }),
        getCopyAll: builder.query<Array<IContestAutocomplete>, string>({ query: (queryString) => ({ url: `/copyAll?searchString=${encodeURIComponent(queryString)}` }), keepUnusedDataFor: 10 }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllAdminContestsQuery,
    useGetContestByIdQuery,
    useDeleteContestMutation,
    useUpdateContestMutation,
    useCreateContestMutation,
    useGetCopyAllQuery,
} = contestService;
export default contestService;
