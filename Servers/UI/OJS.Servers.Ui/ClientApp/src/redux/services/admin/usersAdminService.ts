import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IUserAdministrationModel, IUserAutocompleteData, IUserInListModel } from '../../../common/types';
import { IGetByRoleId, IGetByUserId } from '../../../common/url-types';
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

        getLecturerContests: builder.query<IPagedResultType<IUserInListModel>, IGetByUserId>({
            query: ({ userId, filter, page, itemsPerPage, sorting }) => ({
                url: `/GetLecturerContests/${userId}`,
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
        }),

        addLecturerToContest: builder.mutation<string, {lecturerId: string; contestId: number} >({
            query: ({ lecturerId, contestId }) => ({
                url: '/AddLecturerToContest',
                method: 'POST',
                body: { lecturerId, contestId },
            }),
        }),

        removeLecturerFromContest: builder.mutation<string, {lecturerId: string; contestId: number} >({
            query: ({ lecturerId, contestId }) => ({
                url: `/removeLecturerFromContest?lecturerId=${lecturerId}&contestId=${contestId}`,
                method: 'DELETE',
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
    useGetLecturerContestsQuery,
    useAddLecturerToContestMutation,
    useRemoveLecturerFromContestMutation,
} = usersAdminService;
export default usersAdminService;
