/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { ISubmissionTypeInProblem } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

// eslint-disable-next-line import/group-exports
export const submissionTypesAdminService = createApi({
    reducerPath: 'submissionTypes',
    baseQuery: getCustomBaseQuery('submissionTypes'),
    endpoints: (builder) => ({ getForProblem: builder.query<Array<ISubmissionTypeInProblem>, null>({ query: () => ({ url: '/GetForProblem' }) }) }),
});

// eslint-disable-next-line import/group-exports
export const { useGetForProblemQuery } = submissionTypesAdminService;
export default submissionTypesAdminService;
