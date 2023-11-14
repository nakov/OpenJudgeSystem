import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IContestStrategyFilter } from '../common/contest-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { getAllContestStrategyFiltersUrl } from '../utils/urls';

import { useHttp } from './use-http';

interface IContestStrategyFiltersContext {
    state: {
        strategies: IContestStrategyFilter[];
        isLoaded: boolean;
    };
    actions: {
        load: () => Promise<void>;
    };
}

const defaultState = { state: { strategies: [] as IContestStrategyFilter[] } };

type IContestStrategyFiltersProviderProps = IHaveChildrenProps

const ContestStrategyFiltersContext = createContext<IContestStrategyFiltersContext>(defaultState as IContestStrategyFiltersContext);

const ContestStrategyFiltersProvider = ({ children }: IContestStrategyFiltersProviderProps) => {
    const [ strategies, setStrategies ] = useState(defaultState.state.strategies);

    const {
        get,
        data,
        isSuccess,
        isLoading,
    } = useHttp<null, IContestStrategyFilter[]>({ url: getAllContestStrategyFiltersUrl });

    const load = useCallback(
        async () => {
            if (isEmpty(data) && !isLoading) {
                await get();
            }
        },
        [ get, data, isLoading ],
    );

    useEffect(
        () => {
            if (isNil(data)) {
                return;
            }

            setStrategies(data);
        },
        [ data ],
    );

    const value = useMemo(
        () => ({
            state: {
                strategies,
                isLoaded: isSuccess,
            },
            actions: { load },
        }),
        [ isSuccess, load, strategies ],
    );

    return (
        <ContestStrategyFiltersContext.Provider value={value}>
            {children}
        </ContestStrategyFiltersContext.Provider>
    );
};

const useContestStrategyFilters = () => useContext(ContestStrategyFiltersContext);

export default ContestStrategyFiltersProvider;

export {
    useContestStrategyFilters,
};
