import { useCallback, useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { saveAs } from 'file-saver';
import { isFunction } from 'lodash';
import { HttpStatus } from '../common/common';
import { UrlType, IDictionary, IFileResponseType } from '../common/common-types';

const getUrl = (url: UrlType, params: IDictionary<any> | null) => (
    isFunction(url)
        ? url(params)
        : url
);

const useHttp = (
    url: UrlType,
    parameters: IDictionary<any> | null = null,
    headers: IDictionary<string> | null = null,
) => {
    // const [ internalUrl, setInternalUrl ] = useState('');

    const [ response, setResponse ] = useState<any>(null);
    const [ status, setStatus ] = useState<HttpStatus>(HttpStatus.NotStarted);
    const [ error, setError ] = useState<Error | null>(null);
    const [ actualHeaders, setActualHeaders ] = useState<IDictionary<string>>({});

    const contentDispositionHeaderText = 'content-disposition';
    const filenameStringPattern = 'filename*=UTF-8\'\'';
    const defaultAttachmentFilename = 'attachment';

    const request = useCallback(async (func: () => Promise<any>) => {
        try {
            setStatus(HttpStatus.Pending);
            setResponse(null);
            setError(null);
            const resp = await func();
            setResponse(await resp);
            setError(null);
            setStatus(HttpStatus.Success);
        } catch (err: any) {
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
        }
    }, []);

    const data = useMemo(() => {
        if (response == null || response.data == null) {
            return null;
        }

        return response.data;
    }, [ response ]);

    const get = useCallback(
        (responseType = 'json') => request(() => axios.get(
            getUrl(url, parameters),
            { responseType, headers: actualHeaders },
        )),
        [ request, url, parameters, actualHeaders ],
    );

    const post = useCallback(
        (requestData: any) => request(() => axios.post(
            getUrl(url, parameters),
            requestData,
            { headers: actualHeaders },
        )),
        [ request, url, parameters, actualHeaders ],
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

    const saveAttachment = useCallback((responseObj: IFileResponseType) => {
        if (!responseObj) {
            return;
        }

        const filename = decodeURIComponent(getFilenameFromHeaders(responseObj));

        saveAs(
            responseObj.data,
            filename,
        );
    }, [ getFilenameFromHeaders ]);

    useEffect(
        () => {
            setActualHeaders({
                'content-type': 'application/json',
                ...headers ?? {},
            });
        },
        [ headers ],
    );

    return {
        get,
        post,
        response,
        data,
        status,
        error,
        saveAttachment,
    };
};
export {
    // eslint-disable-next-line import/prefer-default-export
    useHttp,
};
