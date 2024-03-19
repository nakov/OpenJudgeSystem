import { createApi } from '@reduxjs/toolkit/query/react';

import { IUserAutocompleteData } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const usersAdminService = createApi({
    reducerPath: 'adminUsers',
    baseQuery: getCustomBaseQuery('users'),
    endpoints: (builder) => ({
        getUsersAutocomplete: builder.query<Array<IUserAutocompleteData>, string>({
            query: (queryString) => ({ url: `/GetNameAndId?searchString=${encodeURIComponent(queryString)}` }),
            keepUnusedDataFor: 10,
        }),
    }),
});

export const { useGetUsersAutocompleteQuery } = usersAdminService;
export default usersAdminService;
