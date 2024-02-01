/* eslint-disable import/group-exports */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IProblemGroupsData } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const problemGroupsAdminService = createApi({
    reducerPath: 'problemGroups',
    baseQuery: getCustomBaseQuery('problemGroups'),
    endpoints: (builder) => ({
        getProblemGroupsForProblem: builder.query<any, null>({ query: () => ({ url: '/GetForProblem' }) }),
        getAllAdminProblemGroups: builder.query<IPagedResultType<IProblemGroupsData>, IGetAllAdminParams>({
            query: ({ filter, page, ItemsPerPage, sorting }) => ({
                url: 'GetAll',
                params: {
                    filter,
                    page,
                    ItemsPerPage,
                    sorting,
                },
            }),
        }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetProblemGroupsForProblemQuery,
    useGetAllAdminProblemGroupsQuery,
} = problemGroupsAdminService;
export default problemGroupsAdminService;
