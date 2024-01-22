/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { defaultPathIdentifier } from '../../../common/constants';
import { ExceptionData, ISubmissionTypeInProblem } from '../../../common/types';

type ExtraOptionsType = {
// Add extra options if needed
}
type ResultError = {
    data: Array<ExceptionData>;
}
const errorStatusCodes = [ 400, 401, 403, 500 ];
const succesfullStatusCodes = [ 200, 204 ];

const customBaseQuery = async (args: FetchArgs, api: BaseQueryApi, extraOptions:ExtraOptionsType) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/SubmissionTypes`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
        credentials: 'include',
    });

    const result = await baseQuery(args, api, extraOptions);
    const response = result.meta?.response;
    if (response && errorStatusCodes.some((status) => status === Number(response.status))) {
        const errorsArray = result.error as ResultError;
        return { error: errorsArray.data as Array<ExceptionData> };
    }

    if (response && succesfullStatusCodes.some((status) => status === Number(response!.status))) {
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('text')) {
            return { data: result.error?.data };
        }
    }

    return result;
};

// eslint-disable-next-line import/group-exports
export const submissionTypesAdminService = createApi({
    reducerPath: 'submissionTypes',
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({ getForProblem: builder.query<Array<ISubmissionTypeInProblem>, null>({ query: () => ({ url: '/problemView' }), keepUnusedDataFor: 0 }) }),
});

// eslint-disable-next-line import/group-exports
export const { useGetForProblemQuery } = submissionTypesAdminService;
export default submissionTypesAdminService;
