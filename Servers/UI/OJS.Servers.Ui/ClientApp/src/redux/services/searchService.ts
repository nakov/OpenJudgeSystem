/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../common/constants';
import { IIndexContestsType, IPagedResultType, IProblemSearchType, IUserType } from '../../common/types';

interface IGetSearchQueryParams {
    searchTerm: string;
    page: number;
}

export const searchService = createApi({
    reducerPath: 'searchService',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_UI_SERVER_URL}/${defaultPathIdentifier}/`,
        credentials: 'include',
        prepareHeaders: (headers: any) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getContestsSearch: builder.query<IPagedResultType<IIndexContestsType>, IGetSearchQueryParams>({
            query: ({ searchTerm, page }) => (
                { url: `/Search/GetContestsSearchResults`, params: { searchTerm, page } }),
        }),
        getProblemsSearch: builder.query<IPagedResultType<IProblemSearchType>, IGetSearchQueryParams>({
            query: ({ searchTerm, page }) => (
                { url: `/Search/GetProblemsSearchResults`, params: { searchTerm, page } }),
        }),
        getUsersSearch: builder.query<IPagedResultType<IUserType>, IGetSearchQueryParams>({
            query: ({ searchTerm, page }) => (
                { url: `/Search/GetUsersSearchResults`, params: { searchTerm, page } }),
        }),
    }),
});

export const {
    useLazyGetContestsSearchQuery,
    useLazyGetProblemsSearchQuery,
    useLazyGetUsersSearchQuery,
} = searchService;

export default searchService;
