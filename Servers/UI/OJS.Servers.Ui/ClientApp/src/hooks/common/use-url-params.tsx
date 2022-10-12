import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IDictionary, IUrlParam } from '../../common/common-types';
import { IHaveChildrenProps } from '../../components/common/Props';

interface IUrlParamsContext {
    state: {
        params: IUrlParam[];
    };
    actions: {
        setParam: (key: string, value: any) => void;
        unsetParam: (key: string) => void;
        clearParams: () => void;
    };
}

type IUrlParamsProviderProps = IHaveChildrenProps

const defaultState = { state: {} };

const UrlParamsContext = createContext<IUrlParamsContext>(defaultState as IUrlParamsContext);

const searchParamsToParams = (searchParams: URLSearchParams) => {
    const params = {} as IDictionary<string[]>;

    searchParams.forEach((value, key) => {
        if (!params[key]) {
            params[key] = [];
        }

        params[key].push(value);
    });

    return Object.keys(params)
        .map((key) => {
            const value = params[key].length === 1
                ? params[key][0]
                : params[key];

            return { key, value };
        });
};

const UrlParamsProvider = ({ children }: IUrlParamsProviderProps) => {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const params = useMemo(
        () => searchParamsToParams(searchParams),
        [ searchParams ],
    );

    const setParam = useCallback(
        (key: string, value: any) => {
            const keyToLower = key.toLowerCase();

            if (searchParams.has(keyToLower) || searchParams.has(key)) {
                searchParams.delete(key);
                searchParams.delete(keyToLower);
            }

            searchParams.append(keyToLower, value);

            setSearchParams(searchParams);
        },
        [ searchParams, setSearchParams ],
    );

    const unsetParam = useCallback(
        (key: string) => {
            searchParams.delete(key);
            searchParams.delete(key.toLowerCase());
            setSearchParams(searchParams);
        },
        [ searchParams, setSearchParams ],
    );
    
    const clearParams = useCallback(
        () => {
            setSearchParams({});
        },
        [ setSearchParams ],
    );

    const value = {
        state: { params },
        actions: {
            setParam,
            unsetParam,
            clearParams,
        },
    };

    return (
        <UrlParamsContext.Provider value={value}>
            {children}
        </UrlParamsContext.Provider>
    );
};


const useUrlParams = () => useContext(UrlParamsContext);

export default UrlParamsProvider;

export {
    useUrlParams,
};
