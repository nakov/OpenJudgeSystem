import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNaN from 'lodash/isNaN';
import isNil from 'lodash/isNil';

import { IGetContestResultsParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { getContestResultsUrl } from '../../utils/urls';
import { IErrorDataType, useHttp } from '../use-http';

import { IContestResultsParticipationType, IContestResultsType } from './types';

interface ICurrentContestResultsContext {
    state: {
        contestResults?: IContestResultsType;
        contestResultsError: IErrorDataType | null;
        areContestResultsLoaded: boolean;
    };
    actions: {
        load: (id: number, official: boolean, full: boolean) => void;
    };
}

type ICurrentContestResultsProviderProps = IHaveChildrenProps

const defaultState = { state: { contestResults: { results: [] as IContestResultsParticipationType[] } as IContestResultsType } };

const ContestResultsContext = createContext<ICurrentContestResultsContext>(defaultState as ICurrentContestResultsContext);

const CurrentContestResultsProvider = ({ children }: ICurrentContestResultsProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
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
        (id: number, official: boolean, full: boolean) => {
            if (isNil(id) || isNaN(id)) {
                return;
            }

            setGetContestResultsParams({ id, official, full });
        },
        [],
    );

    useEffect(
        () => {
            if (isEmpty(getContestResultsParams)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getContestResults();
                setIsLoading(false);
            })();
        },
        [ getContestResults, getContestResultsParams ],
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
                contestResultsError,
                areContestResultsLoaded,
                isLoading,
            },
            actions: { load },
        }),
        [ areContestResultsLoaded, contestResults, contestResultsError, load, isLoading ],
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
