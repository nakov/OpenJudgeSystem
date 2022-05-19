import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../../components/common/Props';
import { IContestResultsParticipationType, IContestResultsType } from './types';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { getContestResultsUrl } from '../../utils/urls';

interface ICurrentContestResultsContext {
    state: {
        contestResults: IContestResultsType,
    };
    actions: {
        load: (id: number, official: boolean, full: boolean) => Promise<void>,
    };
}

interface ICurrentContestResultsProviderProps extends IHaveChildrenProps {
}

const defaultState = { state: { contestResults: { results: [] as IContestResultsParticipationType[] } as IContestResultsType } };

const ContestResultsContext = createContext<ICurrentContestResultsContext>(defaultState as ICurrentContestResultsContext);

const CurrentContestResultsProvider = ({ children }: ICurrentContestResultsProviderProps) => {
    const [ contestResults, setContestResults ] = useState(defaultState.state.contestResults);
    const { startLoading, stopLoading } = useLoading();

    const {
        get: getApiContestResults,
        data: apiContestResults,
    } = useHttp(getContestResultsUrl);

    const load = useCallback(async (id, official, full) => {
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
                setContestResults(apiContestResults);
            }
        },
        [ apiContestResults ],
    );

    const value = {
        state: { contestResults },
        actions: { load },
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
