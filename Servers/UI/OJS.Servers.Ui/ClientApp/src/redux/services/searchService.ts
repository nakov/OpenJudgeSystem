/* eslint-disable max-len */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../common/constants';
import { IContestType, IPagedResultType, IProblemType, IUserType } from '../../common/types';

interface IGetSearchQueryParams {
    searchTerm: string;
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
        getContestsSearch: builder.query<IPagedResultType<IContestType>, IGetSearchQueryParams>({
            query: ({ searchTerm }) => (
                { url: `/Search/GetContestsSearchResults`, params: { searchTerm } }),
        }),
        getProblemsSearch: builder.query<IPagedResultType<IProblemType>, IGetSearchQueryParams>({
            query: ({ searchTerm }) => (
                { url: `/Search/GetProblemsSearchResults`, params: { searchTerm } }),
        }),
        getUsersSearch: builder.query<IPagedResultType<IUserType>, IGetSearchQueryParams>({
            query: ({ searchTerm }) => (
                { url: `/Search/GetUsersSearchResults`, params: { searchTerm } }),
        }),
    }),
});

export const {
    useLazyGetContestsSearchQuery,
    useLazyGetProblemsSearchQuery,
    useLazyGetUsersSearchQuery,
} = searchService;

export default searchService;
