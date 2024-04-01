/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IGetAllAdminParams, IPagedResultType, IParticipantAdministrationModel, IParticipantInListModel } from '../../../common/types';
import { IGetByContestId } from '../../../common/url-types';
import { CREATE_ENDPOINT, DELETE_ENDPOINT } from '../../../common/urls/administration-urls';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const participantsAdminService = createApi({
    reducerPath: 'participants',
    baseQuery: getCustomBaseQuery('participants'),
    endpoints: (builder) => ({
        getByContestId: builder.query<IPagedResultType<IParticipantInListModel>, IGetByContestId>({
            query: ({ contestId, filter, page, itemsPerPage, sorting }) => ({
                url: `/GetByContestId/${contestId}`,
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
        }),
        getAllParticipants: builder.query<IPagedResultType<IParticipantInListModel>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: 'GetAll',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 0,
        }),
        deleteParticipant: builder.mutation<string, number >({ query: (id) => ({ url: `/${DELETE_ENDPOINT}/${id}`, method: 'DELETE' }) }),
        createParticipant: builder.mutation<string, IParticipantAdministrationModel >({
            query: (participant) => ({
                url: `/${CREATE_ENDPOINT}`,
                method: 'POST',
                body: participant,
            }),
        }),
    }),
});

export const {
    useGetByContestIdQuery,
    useCreateParticipantMutation,
    useDeleteParticipantMutation,
    useGetAllParticipantsQuery,

} = participantsAdminService;

export default participantsAdminService;
