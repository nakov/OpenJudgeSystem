/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IContestAdministration, IContestAutocomplete, IGetAllAdminParams,
    IIndexContestsType,
    IPagedResultType } from '../../../common/types';
import { IContestDetailsUrlParams } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

// eslint-disable-next-line import/group-exports
export const contestService = createApi({
    reducerPath: 'contests',
    baseQuery: getCustomBaseQuery('contests'),
    endpoints: (builder) => ({
        getAllAdminContests: builder.query<IPagedResultType<IIndexContestsType>, IGetAllAdminParams>({
            query: ({ filter, page, ItemsPerPage, sorting }) => ({
                url: '/getAll',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 10,
        }),
        getContestById: builder.query<IContestAdministration, IContestDetailsUrlParams>({ query: ({ id }) => ({ url: `/Get/${id}` }), keepUnusedDataFor: 10 }),
        deleteContest: builder.mutation<string, IContestDetailsUrlParams >({ query: ({ id }) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
        updateContest: builder.mutation<string, IContestAdministration >({ query: ({ ...contestAdministrationModel }) => ({ url: '/Edit', method: 'PATCH', body: contestAdministrationModel }) }),
        createContest: builder.mutation<string, IContestDetailsUrlParams & IContestAdministration >({ query: ({ ...contestAdministrationModel }) => ({ url: '/Create', method: 'POST', body: contestAdministrationModel }) }),
        getCopyAll: builder.query<Array<IContestAutocomplete>, string>({ query: (queryString) => ({ url: `/GetAllForProblem?searchString=${encodeURIComponent(queryString)}` }), keepUnusedDataFor: 10 }),
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
