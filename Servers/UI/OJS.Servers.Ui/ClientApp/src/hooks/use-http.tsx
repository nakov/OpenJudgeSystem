import { useCallback, useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import isNil from 'lodash/isNil';

import { HttpStatus } from '../common/common';
import { Anything, IDictionary, UrlType } from '../common/common-types';
import { getUrl, makeHttpCall } from '../utils/http-utils';

interface IHttpProps<T> {
    url: string | ((parameters: T) => string);
    parameters?: T | null;
    headers?: IDictionary<string> | null;
}

interface IHttpResultType<T> {
    data: T | null;
    status: number;
    headers: IDictionary<string>;
}

interface IHttpJsonExceptionResponse {
    detail: string;
}

const useHttp = <TParametersType, TReturnDataType>({
    url,
    parameters,
    headers,
}: IHttpProps<TParametersType>) => {
    const [ response, setResponse ] = useState<IHttpResultType<TReturnDataType> | null>(null);
    const [ status, setStatus ] = useState<HttpStatus>(HttpStatus.NotStarted);
    const [ error, setError ] = useState<Error | null>(null);
    const [ isSuccess, setIsSuccess ] = useState(false);

    const internalParameters = useMemo(() => parameters as IDictionary<TParametersType>, [ parameters ]);

    const contentDispositionHeaderText = 'content-disposition';
    const filenameStringPattern = 'filename*=UTF-8\'\'';
    const defaultAttachmentFilename = 'attachment';

    const handleBeforeCall = useCallback(
        async () => {
            setStatus(HttpStatus.Pending);
            setResponse(null);
            setError(null);
        },
        [],
    );

    const handleSuccess = useCallback(
        async (successResponse: any) => {
            setResponse(successResponse);
            setError(null);
            setStatus(HttpStatus.Success);
        },
        [],
    );

    const handleError = useCallback(
        async (err: any) => {
            switch (err.response.status) {
            case 401:
                setStatus(HttpStatus.Unauthorized);
                break;
            default:
                setStatus(HttpStatus.Error);
                break;
            }

            setError(err);
            setResponse(err.response);
        },
        [],
    );

    const data = useMemo(() => {
        if (response == null || response.data == null) {
            return null;
        }

        return response.data as TReturnDataType;
    }, [ response ]);

    const actualHeaders = useMemo(
        () => ({
            ...headers ?? {},
            'Content-Type': 'application/json',
        }),
        [ headers ],
    );

    const get = useCallback(
        (responseType = 'json') => makeHttpCall({
            url: getUrl(url as UrlType<TParametersType>, internalParameters),
            method: 'get',
            headers: actualHeaders,
            responseType,
            onSuccess: handleSuccess,
            onError: handleError,
            onBeforeCall: handleBeforeCall,
        }),
        [ url, internalParameters, actualHeaders, handleSuccess, handleError, handleBeforeCall ],
    );

    const post = useCallback(
        (requestData: Anything, responseType = 'json') => makeHttpCall({
            url: getUrl<TParametersType>(url as UrlType<TParametersType>, internalParameters),
            method: 'post',
            body: requestData,
            headers: actualHeaders,
            responseType,
            onSuccess: handleSuccess,
            onError: handleError,
            onBeforeCall: handleBeforeCall,
        }),
        [ url, internalParameters, actualHeaders, handleSuccess, handleError, handleBeforeCall ],
    );

    const getFilenameFromHeaders = useCallback((responseObj: IHttpResultType<Blob>) => {
        const filename = responseObj
            .headers[contentDispositionHeaderText]
            .split(filenameStringPattern)[1];

        if (filename == null) {
            return defaultAttachmentFilename;
        }

        return filename;
    }, []);

    const saveAttachment = useCallback(() => {
        if (isNil(response)) {
            return;
        }

        const responseAsFileResponse = response as IHttpResultType<Blob>;

        const filename = decodeURIComponent(getFilenameFromHeaders(responseAsFileResponse));

        saveAs(
            response.data as Blob,
            filename,
        );

        setResponse(null);
    }, [ getFilenameFromHeaders, response ]);

    useEffect(
        () => {
            if (status === HttpStatus.Success) {
                setIsSuccess(true);
            }
        },
        [ status ],
    );

    return {
        get,
        post,
        response,
        data,
        status,
        error,
        saveAttachment,
        isSuccess,
    };
};

export {
    // eslint-disable-next-line import/prefer-default-export
    useHttp,
};

export type {
    IHttpProps,
    IHttpJsonExceptionResponse,
};
