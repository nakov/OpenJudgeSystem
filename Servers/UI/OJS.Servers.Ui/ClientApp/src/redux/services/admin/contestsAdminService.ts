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
        getContestById: builder.query<IContestAdministration, IContestDetailsUrlParams>({ query: ({ id }) => ({ url: `/ById/${id}` }), keepUnusedDataFor: 10 }),
        deleteContest: builder.mutation<string, IContestDetailsUrlParams >({ query: ({ id }) => ({ url: `/delete/${id}`, method: 'DELETE' }) }),
        updateContest: builder.mutation<string, IContestDetailsUrlParams & IContestAdministration >({ query: ({ id, ...contestAdministrationModel }) => ({ url: `/update${id}`, method: 'PATCH', body: contestAdministrationModel }) }),
        createContest: builder.mutation<string, IContestDetailsUrlParams & IContestAdministration >({ query: ({ ...contestAdministrationModel }) => ({ url: '/create', method: 'POST', body: contestAdministrationModel }) }),
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
