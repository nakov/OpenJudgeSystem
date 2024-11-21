import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { defaultPathIdentifier } from '../../common/constants';
import { IMentorConversationRequestModel, IMentorConversationResponseModel } from '../../common/types';
import getCustomBaseQuery from '../middlewares/customBaseQuery';

const mentorService = createApi({
    reducerPath: 'mentorService',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_UI_SERVER_URL}/${defaultPathIdentifier}/mentor`,
        credentials: 'include',
        prepareHeaders: (headers: any) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        startConversation: builder.mutation<IMentorConversationResponseModel, IMentorConversationRequestModel>({
            query: ({ ...mentorConversationRequestModel }) => ({
                url: '/StartConversation',
                method: 'POST',
                body: mentorConversationRequestModel,
            }),
        }),
    }),
});

export const { useStartConversationMutation } = mentorService;

export default mentorService;
