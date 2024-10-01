import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';

import { defaultPathIdentifier } from '../../common/constants';
import {
    NOT_LOGGED_IN_MESSAGE,
    SOMETHING_WENT_WRONG_MESSAGE,
    UNAUTHORIZED_MESSAGE,
    UNEXPECTED_ERROR_MESSAGE,
} from '../../common/messages';
import { ExceptionData } from '../../common/types';

type ExtraOptionsType = object
type ResultError = {
    data: Array<ExceptionData>;
}

const errorStatusCodes = [ 400, 401, 403, 422, 500 ];
const successfulStatusCodes = [ 200, 204 ];
const getCustomBaseQuery = (baseQueryName: string) => async (args: FetchArgs, api: BaseQueryApi, extraOptions:ExtraOptionsType) => {
    const baseQuery = fetchBaseQuery({
        credentials: 'include',
        // TODO: Make this usable by UI
        baseUrl: `${import.meta.env.VITE_ADMINISTRATION_URL}/${defaultPathIdentifier}/${baseQueryName}`,
        prepareHeaders: (headers) => headers,
        responseHandler: async (response: Response) => {
            const contentType = response.headers.get('Content-Type');

            if (contentType?.includes('application/octet-stream') ||
            contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
            contentType?.includes('application/zip')) {
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = 'file.zip';
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
                    if (match) {
                        filename = decodeURIComponent(match[1]);
                    }
                }
                const blob = await response.blob();

                return { blob, filename };
            }

            if (response.headers.get('Content-Length')) {
                return '';
            }

            return response.json();
        },
    });

    const result = await baseQuery(args, api, extraOptions);
    const response = result.meta?.response;

    if (response && errorStatusCodes.some((status) => status === response.status)) {
        const errorsArray = result.error as ResultError;
        let data = [] as Array<ExceptionData>;
        try {
            data = errorsArray.data as Array<ExceptionData>;
            data.forEach((x) => {
                if (!x.message) {
                    // eslint-disable-next-line no-param-reassign
                    x.message = UNEXPECTED_ERROR_MESSAGE;
                }
            });
        } catch {
            const errorData = result?.error?.data as ExceptionData;
            const message = response.status === 401
                ? errorData?.name === NOT_LOGGED_IN_MESSAGE
                    ? NOT_LOGGED_IN_MESSAGE
                    : UNAUTHORIZED_MESSAGE
                : response.status === 403
                    ? UNAUTHORIZED_MESSAGE
                    : SOMETHING_WENT_WRONG_MESSAGE;

            data = [ { message, name: errorData?.name || '', status: response.status } ] as Array<ExceptionData>;
        }

        return { error: data };
    }

    if (response && successfulStatusCodes.some((status) => status === response!.status)) {
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('text')) {
            return { data: result.error?.data };
        }
    }

    return result;
};

export default getCustomBaseQuery;
