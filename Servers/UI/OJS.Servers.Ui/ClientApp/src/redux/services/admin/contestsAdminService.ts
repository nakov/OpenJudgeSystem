/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { IAdministrationContestProblems, IContestAdministration, IGetAllAdminParams,
    IIndexContestsType,
    IPagedResultType } from '../../../common/types';
import { IContestDetailsUrlParams } from '../../../common/url-types';

type ExtraOptionsType = {
// Add extra options if needed
}
type DataType = {
    errors: object;
    title:string;
    detail:string;
}
const errorStatusCodes = [ 400, 401, 403, 500 ];
const succesfullStatusCodes = [ 200, 204 ];

const customBaseQuery = async (args: FetchArgs, api: BaseQueryApi, extraOptions:ExtraOptionsType) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/contests`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    });

    const result = await baseQuery(args, api, extraOptions);
    const response = result.meta?.response;
    if (result.error && response && errorStatusCodes.some((status) => status === Number(result.error.status))) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && !contentType.includes('application/json')) {
            const receivedData = await await result.error.data as DataType;
            const errorText = receivedData.title;
            return { error: { status: 400, data: errorText as string } };
        }

        const receivedData = await await result.error.data as DataType;
        const errorText = receivedData.detail;
        return { error: { status: 400, data: errorText as string } };
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
        getContestById: builder.query<IContestAdministration, IContestDetailsUrlParams>({ query: ({ id }) => ({ url: `/${id}` }), keepUnusedDataFor: 0 }),
        getContestProblems: builder.query<Array<IAdministrationContestProblems>, IContestDetailsUrlParams>({ query: ({ id }) => ({ url: `/Problems/${id}` }), keepUnusedDataFor: 0 }),
        deleteContest: builder.mutation<string, IContestDetailsUrlParams >({ query: ({ id }) => ({ url: `/${id}`, method: 'DELETE' }) }),
        updateContest: builder.mutation<string, IContestDetailsUrlParams & IContestAdministration >({ query: ({ id, ...contestAdministrationModel }) => ({ url: `/${id}`, method: 'PATCH', body: contestAdministrationModel }) }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllAdminContestsQuery,
    useGetContestByIdQuery,
    useGetContestProblemsQuery,
    useDeleteContestMutation,
    useUpdateContestMutation,
} = contestService;
export default contestService;
