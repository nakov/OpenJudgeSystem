/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import customBaseQuery from '../../middlewares/customBaseQuery';

export const checkerAdminService = createApi({
    reducerPath: 'checkersAdmin',
    baseQuery: customBaseQuery('checkers'),
    endpoints: (builder) => ({
        getCheckersForProblem: builder.query<Array<{id: number; name: string}>, null>({ query: () => ({ url: '/GetForProblems' }) }),
        getAllCheckers: builder.query<Array<IChecke
    }),
});

export const { useGetCheckersForProblemQuery } = checkerAdminService;
export default checkerAdminService;
