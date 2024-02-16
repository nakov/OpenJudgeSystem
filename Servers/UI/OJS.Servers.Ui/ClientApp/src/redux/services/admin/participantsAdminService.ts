/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IPagedResultType, IParticiapntsInContestView } from '../../../common/types';
import { IGetByContestId } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

// eslint-disable-next-line import/group-exports
export const participantsAdminService = createApi({
    reducerPath: 'participants',
    baseQuery: getCustomBaseQuery('participants'),
    endpoints: (builder) => ({
        getByContestId: builder.query<IPagedResultType<IParticiapntsInContestView>, IGetByContestId>({ query: ({ contestId, filter, page, ItemsPerPage, sorting }) => ({ url: `/GetByContestId/${contestId}`,
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
