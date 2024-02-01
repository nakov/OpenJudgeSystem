import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';

import { defaultPathIdentifier } from '../../common/constants';
import { ExceptionData } from '../../common/types';

type ExtraOptionsType = object
type ResultError = {
    data: Array<ExceptionData>;
}

const errorStatusCodes = [ 400, 401, 403, 422, 500 ];
const succesfullStatusCodes = [ 200, 204 ];
const getCustomBaseQuery = (baseUrl:string) => async (args: FetchArgs, api: BaseQueryApi, extraOptions:ExtraOptionsType) => {
    const baseQuery = fetchBaseQuery({
        credentials: 'include',
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/${baseUrl}`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
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

export default getCustomBaseQuery;
