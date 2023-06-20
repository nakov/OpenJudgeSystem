import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import { IHaveChildrenProps } from '../../components/common/Props';

interface IHashUrlParamsContext {
    state: { hashParam: string };
    actions: {
        setHash: (hashParameter: string) => void;
        clearHash: () => void;
    };
}

type IHashUrlParamProviderProps = IHaveChildrenProps

const defaultState = { state: { hashParam: '' } };

const HashUrlParamContext = createContext<IHashUrlParamsContext>({} as IHashUrlParamsContext);

const HashUrlParamProvider = ({ children }: IHashUrlParamProviderProps) => {
    const location = useLocation();
    const [ hashParam, setHashParam ] = useState<string>(defaultState.state.hashParam);

    useEffect(
        () => {
            const { hash } = location;
            setHashParam(hash.substring(1));
        },
        [ location ],
    );

    const setHash = useCallback(
        (param: string) => {
            if (isEmpty(location.hash)) {
                const url = `${location.pathname}${location.search}#${param}`;
                window.history.replaceState('', document.title, `${url}`);
                location.hash = param;

                setHashParam(param);
            } else {
                window.location.hash = param;

                setHashParam(param);
            }
        },
        [ location ],
    );

    const clearHash = useCallback(
        () => {
            window.history.replaceState('', document.title, location.pathname + location.search);
        },
        [ location.pathname, location.search ],
    );

    const value = useMemo(
        () => ({
            state: { hashParam },
            actions: {
                setHash,
                clearHash,
            },
        }),
        [ hashParam, setHash, clearHash ],
    );

    return (
        <HashUrlParamContext.Provider value={value}>
            {children}
        </HashUrlParamContext.Provider>
    );
};

const useHashUrlParams = () => useContext(HashUrlParamContext);

export default HashUrlParamProvider;

export {
    useHashUrlParams,
};
