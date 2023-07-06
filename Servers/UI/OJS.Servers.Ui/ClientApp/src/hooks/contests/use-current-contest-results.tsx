import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNaN from 'lodash/isNaN';
import isNil from 'lodash/isNil';

import { IGetContestResultsParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { IErrorDataType, useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useUrls } from '../use-urls';

import { IContestResultsParticipationType, IContestResultsType } from './types';

interface ICurrentContestResultsContext {
    state: {
        contestResults?: IContestResultsType | null;
        getContestResultsParams: IGetContestResultsParams | undefined;
        contestResultsError: IErrorDataType | null;
        areContestResultsLoaded: boolean;
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
    const { startLoading, stopLoading } = useLoading();
    const [ getContestResultsParams, setGetContestResultsParams ] = useState<IGetContestResultsParams>();
    const [ contestResultsError, setContestResultsError ] = useState<IErrorDataType | null>(null);

    const [ contestResults, setContestsResults ] = useState<IContestResultsType>(defaultState.state.contestResults);
    const {
        get: getContestResults,
        data: apiContestResultsData,
        error: getContestResultsError,
        isSuccess: areContestResultsLoaded,
    } = useHttp<IGetContestResultsParams, IContestResultsType>({
        url: getContestResultsUrl,
        parameters: getContestResultsParams,
    });

    const load = useCallback(
        async (id: number, official: boolean, full: boolean) => {
            if (isNil(id) || isNaN(id)) {
                return;
            }

            setGetContestResultsParams({ id, official, full });
        },
        [],
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

    useEffect(
        () => {
            if (isNil(apiContestResultsData)) {
                return;
            }

            if (!isNil(getContestResultsError)) {
                setContestResultsError(getContestResultsError);
                return;
            }

            setContestsResults(apiContestResultsData);
            setContestResultsError(null);
        },
        [ apiContestResultsData, getContestResultsError ],
    );

    const value = useMemo(
        () => ({
            state: {
                contestResults,
                getContestResultsParams,
                contestResultsError,
                areContestResultsLoaded,
            },
            actions: { load },
        }),
        [ areContestResultsLoaded, contestResults, contestResultsError, getContestResultsParams, load ],
    );

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
