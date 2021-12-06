import { useCallback, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { HttpStatus } from '../common/common';
import { IDictionary } from '../common/types';
import { useAuth } from './use-auth';

const useHttp = (url: string, headers: IDictionary<string> | null = null) => {
    const [ response, setResponse ] = useState<any>(null);
    const [ status, setStatus ] = useState<HttpStatus>(HttpStatus.NotStarted);
    const [ error, setError ] = useState<Error | null>(null);
    const [ actualHeaders, setActualHeaders ] = useState<IDictionary<string>>({});
    const [ authHeader, setAuthHeader ] = useState({});
    const { getToken } = useAuth();
    const token = getToken();

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
            setError(err);
            setResponse(null);
            setStatus(HttpStatus.Error);
        }
    }, [ ]);

    const data = useMemo(() => {
        if (response == null || response.data.Data == null) {
            return null;
        }

        return response.data.Data;
    }, [ response ]);

    const get = useCallback(
        () => request(() => axios.get(
            url,
            { headers: actualHeaders },
        )),
        [ actualHeaders, request, url ],
    );

    const post = useCallback(
        (requestData: any) => request(() => axios.post(
            url,
            requestData,
            { headers: actualHeaders },
        )),
        [ actualHeaders, request, url ],
    );

    useEffect(
        () => {
            setActualHeaders({
                'content-type': 'application/json',
                ...authHeader,
                ...headers ?? {},
            });
        },
        [ authHeader, headers ],
    );

    useEffect(() => {
        if (token) {
            setAuthHeader({ Authorization: `Bearer ${token}` });
        }
    }, [ token ]);

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
