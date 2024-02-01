/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { IContestCategories } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

// eslint-disable-next-line import/group-exports
export const contestCategoriesAdminService = createApi({
    reducerPath: 'contestCategories',
    baseQuery: getCustomBaseQuery('contestCategories'),
    endpoints: (builder) => ({ getCategories: builder.query<Array<IContestCategories>, null>({ query: () => ({ url: '/GetForContestDropdown' }) }) }),
});

// eslint-disable-next-line import/group-exports
export const { useGetCategoriesQuery } = contestCategoriesAdminService;

export default contestCategoriesAdminService;
