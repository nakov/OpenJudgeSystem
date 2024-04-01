import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../common/constants';
import { submissionsServiceName } from '../../common/reduxNames';
import { IPagedResultType, IPublicSubmission } from '../../common/types';
import { IGetSubmissionsUrlParams } from '../../common/url-types';

const submissionsService = createApi({
    reducerPath: submissionsServiceName,
    baseQuery: fetchBaseQuery({
        baseUrl: window.URLS.UI_URL,
        prepareHeaders: (headers: Headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
        credentials: 'include',
        responseHandler: async (response: Response) => {
            if (response.headers.get('Content-Length')) {
                return '';
            }

            return response.json();
        },
    }),
    endpoints: (builder) => ({
        getUnprocessedCount: builder.query<
            number,
            null>({ query: () => ({ url: `/${defaultPathIdentifier}/Submissions/UnprocessedTotalCount` }) }),
        // eslint-disable-next-line max-len
        getLatestSubmissions: builder.query<
            IPagedResultType<IPublicSubmission>,
            IGetSubmissionsUrlParams>({
                query: ({ status, page }) => (
                    { url: `/${defaultPathIdentifier}/Submissions/GetSubmissions?status=${status}&page=${page}` }),
            }),
        getLatestSubmissionsInRole: builder.query<
            IPagedResultType<IPublicSubmission>,
            IGetSubmissionsUrlParams>({
                query: ({ status, page }) => (
                    { url: `/${defaultPathIdentifier}/Submissions/GetSubmissionsForUserInRole?status=${status}&page=${page}` }),
            }),
        getSubmissionResultsByProblem: builder.query<IPagedResultType<IPublicSubmission>, IGetSubmissionsByUserParams>({
            query: ({ id, page, isOfficial }) => ({
                url: `${defaultPathIdentifier}/Submissions/GetUserSubmissionsByProblem/${id}`,
                params: {
                    isOfficial,
                    page,
                },
            }),
        }),
        getSubmissionDetails: builder.query<any, { id: number }>({
            query: ({ id }) => ({
                url: `${defaultPathIdentifier}/Submissions/Details/${id}`
            })
        })
    }),
});

const {
    useGetUnprocessedCountQuery,
    useGetLatestSubmissionsQuery,
    useGetLatestSubmissionsInRoleQuery,
    useGetSubmissionDetailsQuery,
    useLazyGetSubmissionResultsByProblemQuery,
} = submissionsService;

export {
    useGetUnprocessedCountQuery,
    useGetLatestSubmissionsQuery,
    useGetSubmissionDetailsQuery,
    useGetLatestSubmissionsInRoleQuery,
};
export default submissionsService;
