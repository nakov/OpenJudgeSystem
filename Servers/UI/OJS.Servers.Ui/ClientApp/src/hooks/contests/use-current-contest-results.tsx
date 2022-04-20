import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../../components/common/Props';
import { IContestResultsType } from './types';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { getContestResultsUrl } from '../../utils/urls';

interface ICurrentContestResultsContext {
    state: {
        results: IContestResultsType,
    };
    actions: {
        getResults: (id: number, official: boolean, full: boolean) => Promise<void>,
    };
}

interface ICurrentContestResultsProviderProps extends IHaveChildrenProps {
}

const defaultState = { state: { results: {} as IContestResultsType } };

const ContestResultsContext = createContext<ICurrentContestResultsContext>(defaultState as ICurrentContestResultsContext);

const CurrentContestResultsProvider = ({ children }: ICurrentContestResultsProviderProps) => {
    const [ results, setResults ] = useState(defaultState.state.results);

    const { startLoading, stopLoading } = useLoading();

    const {
        get: getApiContestResults,
        data: apiContestResults,
    } = useHttp(getContestResultsUrl);

    const getResults = useCallback(async (id, official, full) => {
            startLoading();
            await getApiContestResults({
                id,
                official,
                full,
            });
            stopLoading();
    }, [ getApiContestResults, startLoading, stopLoading ]);

    useEffect(
        () => {
            if (apiContestResults != null) {
                setResults(apiContestResults);
            }
        },
        [ apiContestResults ],
    );

    const value = {
        state: { results },
        actions: { getResults },
    };

    return (
        <ContestResultsContext.Provider value={value}>
            {children}
        </ContestResultsContext.Provider>
    );
};

const useCurrentContestResults = () => useContext(ContestResultsContext);

export default CurrentContestResultsProvider;

export {
    useCurrentContestResults,
};
