import React, { createContext, useCallback, useMemo, useState } from 'react';

import { Anything } from '../../common/common-types';
import { IHaveChildrenProps } from '../../components/common/Props';

interface IRouteUrlParamsContext {
    state: {
        params: any;
    };
    actions: {
        setParams: (newParams: Anything) => void;
    };
}

type IRouteUrlParamsProvider = IHaveChildrenProps

const RouteUrlParamsContext = createContext<IRouteUrlParamsContext>({} as IRouteUrlParamsContext);

const defaultState = { state: { params: {} as Anything } };

const RouteUrlParamsProvider = ({ children }: IRouteUrlParamsProvider) => {
    const [ internalParams, setInternalParams ] = useState(defaultState.state.params);

    const setParams = useCallback((newParams: any) => {
        setInternalParams(newParams);
    }, []);

    const value = useMemo(
        () => ({
            state: { params: internalParams },
            actions: { setParams },
        }),
        [ internalParams, setParams ],
    );

    return (
        <RouteUrlParamsContext.Provider value={value}>
            {children}
        </RouteUrlParamsContext.Provider>
    );
};

export default RouteUrlParamsProvider;
