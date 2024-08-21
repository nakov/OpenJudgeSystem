/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import {
    IGetAllAdminParams,
    IPagedResultType,
    ISubmissionTypeInSubmissionDocumentInListModel,
    ISubmissionTypeInSubmissionDocumentInViewModel,
} from '../../../common/types';
import {
    GET_ALL_ENDPOINT,
} from '../../../common/urls/administration-urls';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

const submissionTypesInSubmissionDocumentsAdminService = createApi({
    reducerPath: 'submissionTypesInSubmissionDocuments',
    baseQuery: getCustomBaseQuery('submissionTypesInSubmissionDocuments'),
    endpoints: (builder) => ({
        getAllSubmissionTypesInSubmissionDocuments: builder.query<IPagedResultType<ISubmissionTypeInSubmissionDocumentInListModel>, IGetAllAdminParams>({
            query: ({ filter, page, itemsPerPage, sorting }) => ({
                url: `/${GET_ALL_ENDPOINT}`,
                method: 'GET',
                params: {
                    filter,
                    page,
                    itemsPerPage,
                    sorting,
                },
            }),
            keepUnusedDataFor: 3,
        }),
        getAllSubmissionTypesInSubmissionDocumentsByMultipleSubmissionTypeIds: builder.query<Array<ISubmissionTypeInSubmissionDocumentInViewModel>, Array<number>>({
            query: (submissionTypeIds) => {
                const params = new URLSearchParams();

                submissionTypeIds.forEach((id) => params.append('submissionTypeIds', id.toString()));

                return {
                    url: '/GetAllBySubmissionTypeIds',
                    method: 'GET',
                    params,
                };
            },
        }),

    }),
});

export const {
    useGetAllSubmissionTypesInSubmissionDocumentsQuery,
    useGetAllSubmissionTypesInSubmissionDocumentsByMultipleSubmissionTypeIdsQuery,
} = submissionTypesInSubmissionDocumentsAdminService;

export default submissionTypesInSubmissionDocumentsAdminService;
