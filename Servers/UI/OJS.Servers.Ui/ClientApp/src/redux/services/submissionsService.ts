import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../common/constants';
import { submissionsPageServiceName } from '../../common/reduxNames';
import { IPagedResultType, IPublicSubmission } from '../../common/types';
import { IGetSubmissionsUrlParams } from '../../common/url-types';

const submissionsService = createApi({
    reducerPath: submissionsPageServiceName,
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
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getTotalCount: builder.query<
            number,
            null>({ query: () =>
                ({ url: `/${defaultPathIdentifier}/Submissions/TotalCount` }) }),
        // eslint-disable-next-line max-len
        getLatestSubmissions: builder.query<
            IPagedResultType<IPublicSubmission>,
            IGetSubmissionsUrlParams>({ query: ({ status, page }) => 
                ({ url: `/${defaultPathIdentifier}/Submissions/GetSubmissions?status=${status}&page=${page}` }) }),
        getLatestSubmissionsInRole: builder.query<
            IPagedResultType<IPublicSubmission>,
            IGetSubmissionsUrlParams>({ query: ({ status, page }) => 
                ({ url: `/${defaultPathIdentifier}/Submissions/GetSubmissionsForUserInRole?status=${status}&page=${page}` }) }),
    }),
});

const {
    useGetTotalCountQuery,
    useGetLatestSubmissionsQuery,
    useGetLatestSubmissionsInRoleQuery,
} = submissionsService;

export {
    useGetTotalCountQuery,
    useGetLatestSubmissionsQuery, 
    useGetLatestSubmissionsInRoleQuery,
};
export default submissionsService;
