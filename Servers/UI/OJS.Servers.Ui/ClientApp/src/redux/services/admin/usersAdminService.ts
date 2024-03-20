import { createApi } from '@reduxjs/toolkit/query/react';

import { IPagedResultType, IUserAutocompleteData, IUserInListModel } from '../../../common/types';
import { IGetByRoleId } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const usersAdminService = createApi({
    reducerPath: 'adminUsers',
    baseQuery: getCustomBaseQuery('users'),
    endpoints: (builder) => ({
        getUsersAutocomplete: builder.query<Array<IUserAutocompleteData>, string>({
            query: (queryString) => ({ url: `/GetNameAndId?searchString=${encodeURIComponent(queryString)}` }),
            keepUnusedDataFor: 10,
        }),

        getUsersByRole: builder.query<IPagedResultType<IUserInListModel>, IGetByRoleId>({
            query: ({ roleId, filter, page, itemsPerPage, sorting }) => ({
                url: `/GetByRoleId/${roleId}`,
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
        }),

        deleteUser: builder.mutation<string, string>({ query: (id) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
    }),
});

export const {
    useGetUsersAutocompleteQuery,
    useGetUsersByRoleQuery,
    useDeleteUserMutation,
} = usersAdminService;
export default usersAdminService;
