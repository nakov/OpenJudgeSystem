import { useCallback, useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import isNil from 'lodash/isNil';

import { HttpStatus } from '../common/common';
import { IDictionary, UrlType } from '../common/common-types';
import { getUrl, makeHttpCall } from '../utils/http-utils';

interface IErrorDataType {
    title: string;
    status: number;
    detail: string;
}

interface IHttpProps<T> {
    url: string | ((parameters: T) => string);
    parameters?: T | null;
    headers?: IDictionary<string> | null;
    bodyAsFormData?: boolean;
}

interface IHttpResultType<T> {
    data: T | IErrorDataType;
    status: number;
    headers: IDictionary<string>;
}

interface IHttpJsonExceptionResponse {
    detail: string;
}

const useHttp = <TParametersType, TReturnDataType, TRequestDataType = null, >({
    url,
    parameters,
    headers,
    bodyAsFormData = false,
}: IHttpProps<TParametersType>) => {
    const [ response, setResponse ] = useState<IHttpResultType<TReturnDataType> | null>(null);
    const [ status, setStatus ] = useState<HttpStatus>(HttpStatus.NotStarted);
    const [ isSuccess, setIsSuccess ] = useState(false);

    const internalParameters = useMemo(() => parameters as IDictionary<TParametersType>, [ parameters ]);

    const contentDispositionHeaderText = 'content-disposition';
    const filenameStringPattern = 'filename*=UTF-8\'\'';
    const defaultAttachmentFilename = 'attachment';

    const error = useMemo(() => {
        if (isNil(response) || response.status === 200) {
            return null;
        }

        if (!isNil(response.data)) {
            const errorDataType = response.data as IErrorDataType;

            return errorDataType.detail;
        }

        return 'error';
    }, [ response ]);

    const handleBeforeCall = useCallback(
        async () => {
            setStatus(HttpStatus.Pending);
            setResponse(null);
        },
        [],
    );

    const handleSuccess = useCallback(
        async (successResponse: any) => {
            setResponse(successResponse);
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

            setResponse(err.response);
        },
        [],
    );

    const data = useMemo(() => {
        const { data: responseData } = response || {};

        return responseData as TReturnDataType || null;
    }, [ response ]);

    const actualHeaders = useMemo(
        () => ({
            ...headers ?? {},
            'Content-Type': 'application/json',
        }),
        [ headers ],
    );

    const headersFormData = useMemo(
        () => ({
            ...headers ?? {},
            'Content-Type': 'multipart/form-data',
        }),
        [ headers ],
    );

    type Entries<T> = {
        [K in keyof T]: [K, T[K]];
    }[keyof T][];

    const getEntries = useCallback(<T extends object>(obj: T) => Object.entries(obj) as Entries<T>, []);

    const getAsFormData = useCallback(async (requestDatObj: TRequestDataType) => {
        if (isNil(requestDatObj)) {
            return null;
        }

        const bodyFormData = new FormData();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const entries = getEntries(requestDatObj);

        entries.forEach((key, obj) => {
            console.log(typeof obj);
            if ((typeof requestDatObj[key]).toString() === 'blob') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                await bodyFormData.append(key, requestDatObj[key] as Blob);
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                await bodyFormData.append(key, requestDatObj[key] as string);
            }
        });

        return bodyFormData;
    }, [ getEntries ]);

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
        (requestData: TRequestDataType, responseType = 'json') => makeHttpCall({
            url: getUrl<TParametersType>(url as UrlType<TParametersType>, internalParameters),
            method: 'post',
            body: bodyAsFormData
                ? getAsFormData(requestData)
                : requestData,
            headers: bodyAsFormData
                ? headersFormData
                : actualHeaders,
            responseType,
            onSuccess: handleSuccess,
            onError: handleError,
            onBeforeCall: handleBeforeCall,
        }),
        [
            url, internalParameters, bodyAsFormData, getAsFormData,
            headersFormData, actualHeaders, handleSuccess,
            handleError, handleBeforeCall ],
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
