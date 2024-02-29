/* eslint-disable import/group-exports */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IProblemResouceInLinstModel } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const problemResourcesAdminService = createApi({
    reducerPath: 'problemResources',
    baseQuery: getCustomBaseQuery('problemGroups'),
    endpoints: (builder) => ({
        getAllAdminProblemResources: builder.query<IPagedResultType<IProblemResouceInLinstModel>, IGetAllAdminParams>({
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

export const { useGetAllAdminProblemResourcesQuery } = problemResourcesAdminService;
export default problemResourcesAdminService;
