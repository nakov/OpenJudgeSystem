import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IUserAdministrationModel, IUserAutocompleteData, IUserInListModel } from '../../../common/types';
import { IGetByRoleId } from '../../../common/url-types';
import { GET_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls/administration-urls';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const usersAdminService = createApi({
    reducerPath: 'users',
    baseQuery: getCustomBaseQuery('users'),
    endpoints: (builder) => ({
        getUsersAutocomplete: builder.query<Array<IUserAutocompleteData>, string>({
            query: (queryString) => ({ url: `/GetNameAndId?searchString=${encodeURIComponent(queryString)}` }),
            keepUnusedDataFor: 10,
        }),

        getAllUsers: builder.query<IPagedResultType<IUserInListModel>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: '/GetAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
        }),

        getUserById:
        builder.query<IUserAdministrationModel, string>({ query: (id) => ({ url: `/${GET_ENDPOINT}/${id}` }) }),

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

        updateUser: builder.mutation<string, IUserAdministrationModel >({
            query: (user) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: user,
            }),
        }),
    }),
});

export const {
    useGetUsersAutocompleteQuery,
    useGetUsersByRoleQuery,
    useGetUserByIdQuery,
    useGetAllUsersQuery,
    useUpdateUserMutation,
} = usersAdminService;
export default usersAdminService;
