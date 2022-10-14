import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { UrlType } from '../../common/common-types';
import { IGetContestResultsParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useUrls } from '../use-urls';

import { IContestResultsParticipationType, IContestResultsType } from './types';

interface ICurrentContestResultsContext {
    state: {
        contestResults: IContestResultsType;
    };
    actions: {
        load: (id: number, official: boolean, full: boolean) => Promise<void>;
    };
}

type ICurrentContestResultsProviderProps = IHaveChildrenProps

const defaultState = { state: { contestResults: { results: [] as IContestResultsParticipationType[] } as IContestResultsType } };

const ContestResultsContext = createContext<ICurrentContestResultsContext>(defaultState as ICurrentContestResultsContext);

const CurrentContestResultsProvider = ({ children }: ICurrentContestResultsProviderProps) => {
    const { getContestResultsUrl } = useUrls();
    const [ contestResults, setContestResults ] = useState(defaultState.state.contestResults);
    const { startLoading, stopLoading } = useLoading();
    const [ getContestResultsParams, setGetContestResultsParams ] = useState<IGetContestResultsParams>();

    const {
        get: getContestResults,
        data: apiContestResults,
    } = useHttp(getContestResultsUrl as UrlType, getContestResultsParams);

    const load = useCallback(async (id: number, official: boolean, full: boolean) => {
        if (isNil(id)) {
            return;
        }

        setGetContestResultsParams({ id, official, full });
    }, []);

    useEffect(
        () => {
            if (isNil(apiContestResults)) {
                return;
            }

            setContestResults(apiContestResults);
        },
        [ apiContestResults ],
    );

    useEffect(
        () => {
            if (isNil(getContestResultsParams)) {
                return;
            }

            (async () => {
                startLoading();
                await getContestResults();
                stopLoading();
            })();
        },
        [ getContestResults, getContestResultsParams, startLoading, stopLoading ],
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
