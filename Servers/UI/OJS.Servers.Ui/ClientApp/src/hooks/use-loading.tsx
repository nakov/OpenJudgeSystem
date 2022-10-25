import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { IHaveChildrenProps } from '../components/common/Props';
import Loading from '../components/guidelines/loading/Loading';

interface ILoadingContext {
    startLoading: () => void;
    stopLoading: () => void;
}

const defaultState = {};

const LoadingContext = createContext<ILoadingContext>(defaultState as ILoadingContext);

const LoadingProvider = ({ children }: IHaveChildrenProps) => {
    const [ isLoading, setLoading ] = useState(false);

    const startLoading = useCallback(
        () => setLoading(true),
        [],
    );

    const stopLoading = useCallback(
        () => setLoading(false),
        [],
    );

    const showLoading = () => {
        if (isLoading) {
            return (<Loading isLoading />);
        }

        return null;
    };

    const value = useMemo(
        () => ({
            startLoading,
            stopLoading,
        }),
        [ startLoading, stopLoading ],
    );

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {showLoading()}
        </LoadingContext.Provider>
    );
};

const useLoading = () => useContext(LoadingContext);

export default LoadingProvider;

export {
    useLoading,
};
