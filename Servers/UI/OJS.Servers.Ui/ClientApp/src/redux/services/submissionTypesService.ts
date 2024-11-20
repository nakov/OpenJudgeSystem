import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { defaultPathIdentifier } from 'src/common/constants';
import { submissionTypesServiceName } from 'src/common/reduxNames';
import { IAllowedStrategyType } from 'src/common/types';

const submissionTypesService = createApi({
    reducerPath: submissionTypesServiceName,
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_UI_SERVER_URL}/${defaultPathIdentifier}/`,
        credentials: 'include',
        prepareHeaders: (headers: Headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSubmissionTypesForCategory: builder.query<
            IAllowedStrategyType[],
            { contestCategoryId: number }>({
                query: ({ contestCategoryId }) => (
                    { url: `SubmissionTypes/GetAllForContestCategory?contestCategoryId=${contestCategoryId}` }),
            }),
    }),
});

const { useGetSubmissionTypesForCategoryQuery } = submissionTypesService;

export { useGetSubmissionTypesForCategoryQuery };

export default submissionTypesService;
