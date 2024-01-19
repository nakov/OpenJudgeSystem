/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { IPagedResultType, IParticiapntsInContestView } from '../../../common/types';
import { IGetParticipantsByContestId } from '../../../common/url-types';

// eslint-disable-next-line import/group-exports
export const participantsAdminService = createApi({
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
        getByContestId: builder.query<IPagedResultType<IParticiapntsInContestView>, IGetParticipantsByContestId>({ query: ({ contestId, filter, page, ItemsPerPage, sorting }) => ({ url: `/contest/${contestId}`,
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
    useGetByContestIdQuery,
} = participantsAdminService;

export default participantsAdminService;
