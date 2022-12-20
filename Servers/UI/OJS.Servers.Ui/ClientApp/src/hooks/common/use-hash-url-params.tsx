import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { IHaveChildrenProps } from '../../components/common/Props';

interface IHashUrlParamsContext {
    state: { params: string };
    actions: {
        setHash: (hashParameter: string) => void;
        clearHash: () => void;
    };
}

type IHashUrlParamProviderProps = IHaveChildrenProps

const HashUrlParamContext = createContext<IHashUrlParamsContext>({} as IHashUrlParamsContext);

const HashUrlParamProvider = ({ children }: IHashUrlParamProviderProps) => {
    const location = useLocation();
    const params = useMemo(() => {
        const { hash } = location;

        return hash.substring(1);
    }, [ location ]);

    const setHash = useCallback(
        (param: string) => {
            window.location.hash = param;
        },
        [],
    );

    const clearHash = useCallback(
        () => {
            window.history.replaceState('', document.title, location.pathname);
        },
        [ location.pathname ],
    );

    const value = useMemo(
        () => ({
            state: { params },
            actions: {
                setHash,
                clearHash,
            },
        }),
        [ params, setHash, clearHash ],
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
