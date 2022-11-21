import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { IHaveChildrenProps } from '../../components/common/Props';

interface IInternalUrlParamsContext {
    state: {
        params: any;
    };
    actions: {
        setParams: (newParams: unknown) => void;
    };
}

type IInternalUrlParamsProvider = IHaveChildrenProps

const InternalUrlParamsContext = createContext<IInternalUrlParamsContext>({} as IInternalUrlParamsContext);

const defaultState = { state: { params: {} as Record<string, unknown> } };

const InternalUrlParamsProvider = ({ children }: IInternalUrlParamsProvider) => {
    const [ internalParams, setInternalParams ] = useState(defaultState.state.params);

    const setParams = useCallback(
        (newParams: any) => {
            setInternalParams(newParams);
        },
        [],
    );

    const value = useMemo(
        () => ({
            state: { params: internalParams },
            actions: { setParams },
        }),
        [ internalParams, setParams ],
    );

    return (
        <InternalUrlParamsContext.Provider value={value}>
            {children}
        </InternalUrlParamsContext.Provider>
    );
};

const useInternalUrlParams = () => useContext(InternalUrlParamsContext);

export default InternalUrlParamsProvider;

export {
    useInternalUrlParams,
};
