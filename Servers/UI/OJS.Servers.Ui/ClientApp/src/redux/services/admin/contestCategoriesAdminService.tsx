import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { IContestCategories } from '../../../common/types';

// eslint-disable-next-line import/group-exports
export const contestCategoriesAdminService = createApi({
    reducerPath: 'contestCategories',
    baseQuery: fetchBaseQuery({
        credentials: 'include',
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/contestCategories`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    // eslint-disable-next-line max-len
    endpoints: (builder) => ({ getCategories: builder.query<Array<IContestCategories>, null>({ query: () => ({ url: '/dropdown' }), keepUnusedDataFor: 0 }) }),
});

// eslint-disable-next-line import/group-exports
export const { useGetCategoriesQuery } = contestCategoriesAdminService;

export default contestCategoriesAdminService;
