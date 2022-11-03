import { useCallback, useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';

import { HttpStatus } from '../common/common';
import { Anything, IDictionary, IFileResponseType, UrlType } from '../common/common-types';
import { getUrl, makeHttpCall } from '../utils/http-utils';

const useHttp = (
    url: UrlType,
    parameters: IDictionary<any> | null = null,
    headers: IDictionary<string> | null = null,
) => {
    const [ response, setResponse ] = useState<any | null>(null);
    const [ status, setStatus ] = useState<HttpStatus>(HttpStatus.NotStarted);
    const [ error, setError ] = useState<Error | null>(null);
    const [ isSuccess, setIsSuccess ] = useState(false);

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

        return response.data;
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
            url: getUrl(url, parameters),
            method: 'get',
            headers: actualHeaders,
            responseType,
            onSuccess: handleSuccess,
            onError: handleError,
            onBeforeCall: handleBeforeCall,
        }),
        [ url, parameters, actualHeaders, handleSuccess, handleError, handleBeforeCall ],
    );

    const post = useCallback(
        (requestData: Anything, responseType = 'json') => makeHttpCall({
            url: getUrl(url, parameters),
            method: 'post',
            body: requestData,
            headers: actualHeaders,
            responseType,
            onSuccess: handleSuccess,
            onError: handleError,
            onBeforeCall: handleBeforeCall,
        }),
        [ url, parameters, actualHeaders, handleSuccess, handleError, handleBeforeCall ],
    );

    const getFilenameFromHeaders = useCallback((responseObj: IFileResponseType) => {
        const filename = responseObj
            .headers[contentDispositionHeaderText]
            .split(filenameStringPattern)[1];

        if (filename == null) {
            return defaultAttachmentFilename;
        }

        return filename;
    }, []);

    const saveAttachment = useCallback(() => {
        if (!response) {
            return;
        }

        const filename = decodeURIComponent(getFilenameFromHeaders(response as IFileResponseType));

        saveAs(
            response.data,
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
