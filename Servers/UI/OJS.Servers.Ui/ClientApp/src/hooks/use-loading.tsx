import * as React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
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

    const value = {
        startLoading,
        stopLoading,
    };

    const showLoading = () => {
        if (isLoading) {
            return (<Loading isLoading />);
        }

        return null;
    };

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
