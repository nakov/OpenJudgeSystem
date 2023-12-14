/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { IAdministrationContestProblems, IContestAdministration, IGetAllContestsAdminParams,
    IIndexContestsType,
    IPagedResultType } from '../../../common/types';
import { IContestDetailsUrlParams } from '../../../common/url-types';

// eslint-disable-next-line import/group-exports
export const contestService = createApi({
    reducerPath: 'contests',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_ADMINISTRATION_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllAdminContests: builder.query<IPagedResultType<IIndexContestsType>, IGetAllContestsAdminParams>({
            query: ({ filter, page, ItemsPerPage, sorting }) => ({
                url: `${defaultPathIdentifier}/contest`,
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
        }),
        // eslint-disable-next-line max-len
        getContestById: builder.query<IContestAdministration, IContestDetailsUrlParams>({ query: ({ id }) => ({ url: `${defaultPathIdentifier}/contest/${id}` }) }),
        getContestProblems: builder.query<Array<IAdministrationContestProblems>, IContestDetailsUrlParams>({ query: ({ id }) => ({ url: `${defaultPathIdentifier}/contest/Problems/${id}` }) }),
    }),
});

// eslint-disable-next-line import/group-exports
export const { useGetAllAdminContestsQuery, useGetContestByIdQuery, useGetContestProblemsQuery } = contestService;
export default contestService;
