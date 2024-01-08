/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { IAdministrationContestProblems, IContestAdministration, IGetAllAdminParams,
    IIndexContestsType,
    IPagedResultType } from '../../../common/types';
import { IContestDetailsUrlParams } from '../../../common/url-types';

// eslint-disable-next-line import/group-exports
export const contestService = createApi({
    reducerPath: 'contests',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/contests`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
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
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllAdminContestsQuery,
    useGetContestByIdQuery,
    useGetContestProblemsQuery,
} = contestService;
export default contestService;
