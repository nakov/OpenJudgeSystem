import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { IHaveChildrenProps } from '../../components/common/Props';

interface IHashUrlParamsContext {
    state: { params: unknown };
    actions: {
        changeHash: (hashParameter: number) => void;
    };
}

type IHashUrlParamProviderProps = IHaveChildrenProps

const HashUrlParamContext = createContext<IHashUrlParamsContext>({} as IHashUrlParamsContext);

const HashUrlParamProvider = ({ children }: IHashUrlParamProviderProps) => {
    const location = useLocation();
    const params = useMemo(() => {
        const { hash } = location;

        return hash;
    }, [ location ]);

    const changeHash = useCallback(
        (param: number) => {
            window.location.hash = param.toString();
        },
        [],
    );

    const value = useMemo(
        () => ({
            state: { params },
            actions: { changeHash },
        }),
        [ changeHash, params ],
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
