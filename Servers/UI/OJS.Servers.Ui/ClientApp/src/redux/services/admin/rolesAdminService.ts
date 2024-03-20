import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IRoleAdministrationModel, IRoleInListModel } from '../../../common/types';
import { CREATE_ENDPOINT, DELETE_ENDPOINT, GET_ENDPOINT, UPDATE_ENDPOINT } from '../../../common/urls/administration-urls';
import customBaseQuery from '../../middlewares/customBaseQuery';

export const rolesAdminService = createApi({
    reducerPath: 'roles',
    baseQuery: customBaseQuery('roles'),
    endpoints: (builder) => ({
        getAllRoles: builder.query<IPagedResultType<IRoleInListModel>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: 'GetAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 5,
        }),

        getRoleById:
        builder.query<IRoleAdministrationModel, string>({ query: (id) => ({ url: `/${GET_ENDPOINT}/${id}` }) }),

        updateRole: builder.mutation<string, IRoleAdministrationModel >({
            query: (role) => ({
                url: `/${UPDATE_ENDPOINT}`,
                method: 'PATCH',
                body: role,
            }),
        }),

        createRole: builder.mutation<string, IRoleAdministrationModel >({
            query: (role) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: role,
            }),
        }),

        deleteRoles: builder.mutation<string, string >({ query: (id) => ({ url: `/${DELETE_ENDPOINT}/${id}`, method: 'DELETE' }) }),
    }),
});

export const {
    useGetAllRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useGetRoleByIdQuery,
    useDeleteRolesMutation,
} = rolesAdminService;

export default rolesAdminService;
