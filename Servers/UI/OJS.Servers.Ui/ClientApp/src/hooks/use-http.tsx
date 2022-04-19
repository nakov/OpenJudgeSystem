import { useCallback, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { HttpStatus } from '../common/common';
import { IDictionary } from '../common/common-types';

const useHttp = (url: string, headers: IDictionary<string> | null = null) => {
    const [ response, setResponse ] = useState<any>(null);
    const [ status, setStatus ] = useState<HttpStatus>(HttpStatus.NotStarted);
    const [ error, setError ] = useState<Error | null>(null);
    const [ actualHeaders, setActualHeaders ] = useState<IDictionary<string>>({});

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

    const replacePlaceholder = useCallback(
        (
            urlToReplace: string,
            parameter: string, value: any,
        ) => urlToReplace.replace(`%${parameter}%`, (value || '').toString()),
        [],
    );

    const replaceParameters = useCallback(
        (urlToReplace: string, parameters: IDictionary<any>) => Object.keys(parameters)
            .reduce((currentUrl, parameter) => replacePlaceholder(currentUrl, parameter, parameters[parameter]), urlToReplace),
        [ replacePlaceholder ],
    );

    const data = useMemo(() => {
        if (response == null || response.data == null) {
            return null;
        }

        return response.data;
    }, [ response ]);

    const get = useCallback(
        (parameters?: IDictionary<any>, responseType = 'json') => {
            const urlWithParameters = replaceParameters(url, parameters == null
                ? {}
                : parameters);

            return request(() => axios.get(
                urlWithParameters,
                { responseType, headers: actualHeaders },
            ));
        },
        [ actualHeaders, replaceParameters, request, url ],
    );

    const post = useCallback(
        (requestData: any, parameters?: IDictionary<any>) => request(() => axios.post(
            replaceParameters(url, parameters == null
                ? {}
                : parameters),
            requestData,
            { headers: actualHeaders },
        )),
        [ actualHeaders, replaceParameters, request, url ],
    );

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
    };
};

export {
    // eslint-disable-next-line import/prefer-default-export
    useHttp,
};
