/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IGetAllAdminParams,
    IPagedResultType,
    IUserAdministration,
    IUserAutocomplete,
    IUserInExamGroupModel,
} from '../../../common/types';
import { IGetByExamGroupId, IUserUrlParams } from '../../../common/url-types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

// eslint-disable-next-line import/group-exports
export const usersService = createApi({
    reducerPath: 'users',
    baseQuery: getCustomBaseQuery('users'),
    endpoints: (builder) => ({
        getAllAdminUsers: builder.query<IPagedResultType<IUserAdministration>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: '/getAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 10,
        }),
        // getUserById: builder.query<IUserAdministration, IUserUrlParams>({ query: ({ id }) => ({ url: `/Get/${id}` }), keepUnusedDataFor: 10 }),
        deleteUser: builder.mutation<string, IUserUrlParams >({ query: ({ id }) => ({ url: `/Delete/${id}`, method: 'DELETE' }) }),
        // updateUser: builder.mutation<string, IUserAdministration >({ query: ({ ...examGroupAdministrationModel }) => ({ url: '/Edit', method: 'PATCH', body: examGroupAdministrationModel }) }),
        // createUser: builder.mutation<string, IUserUrlParams & IUserAdministration >({ query: ({ ...userAdministrationModel }) => ({ url: '/Create', method: 'POST', body: userAdministrationModel }) }),
        getUsersForDropdown: builder.query<Array<IUserAutocomplete>, string>({ query: (queryString) => ({ url: `/GetForDropdown?searchString=${encodeURIComponent(queryString)}` }), keepUnusedDataFor: 10 }),
        getByExamGroupId: builder.query<IPagedResultType<IUserInExamGroupModel>, IGetByExamGroupId>({
            query: ({ examGroupId, filter, page, itemsPerPage, sorting }) => ({
                url: `/GetForExamGroupDetails/${examGroupId}`,
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
        }),
    }),
});

// eslint-disable-next-line import/group-exports
export const {
    useGetAllAdminUsersQuery,
    // useGetUserByIdQuery,
    useDeleteUserMutation,
    // useUpdateUserMutation,
    // useCreateUserMutation,
    useGetByExamGroupIdQuery,
    useGetUsersForDropdownQuery,
} = usersService;

export default usersService;
