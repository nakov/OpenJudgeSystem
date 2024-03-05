/* eslint-disable max-len */
import { createApi } from '@reduxjs/toolkit/query/react';

import { ISubmissionTypeInProblem } from '../../../common/types';
import getCustomBaseQuery from '../../middlewares/customBaseQuery';

export const submissionTypesAdminService = createApi({
    reducerPath: 'submissionTypes',
    baseQuery: getCustomBaseQuery('submissionTypes'),
    endpoints: (builder) => ({ getForProblem: builder.query<Array<ISubmissionTypeInProblem>, null>({ query: () => ({ url: '/GetForProblem' }) }) }),
});

export const { useGetForProblemQuery } = submissionTypesAdminService;
export default submissionTypesAdminService;
