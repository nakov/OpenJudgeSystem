/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { IPagedResultType, IParticiapntsInContestView } from '../../../common/types';
import { IGetByContestId } from '../../../common/url-types';

// eslint-disable-next-line import/group-exports
export const submissionsAdminService = createApi({
    reducerPath: 'participants',
    baseQuery: fetchBaseQuery({
        credentials: 'include',
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/participants`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAll: builder.query<IPagedResultType<IParticiapntsInContestView>, IGetByContestId>({ query: ({ contestId, filter, page, ItemsPerPage, sorting }) => ({ url: `/contest/${contestId}`,
            params: {
                filter,
                page,
                ItemsPerPage,
                sorting,
            } }) }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllQuery,
} = submissionsAdminService;

export default submissionsAdminService;
