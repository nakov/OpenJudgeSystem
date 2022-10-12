import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { IContestStrategyFilter } from '../common/contest-types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

interface IContestStrategyFiltersContext {
    state: {
        strategies: IContestStrategyFilter[];
        isLoaded: boolean,
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

    const { startLoading, stopLoading } = useLoading();
    const { getAllContestStrategyFiltersUrl } = useUrls();

    const {
        get,
        data,
        isSuccess,
    } = useHttp(getAllContestStrategyFiltersUrl);

    const load = useCallback(
        async () => {
            startLoading();
            await get();
            stopLoading();
        },
        [ get, startLoading, stopLoading ],
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

    const value = {
        state: {
            strategies,
            isLoaded: isSuccess,
        },
        actions: { load },
    } as IContestStrategyFiltersContext;

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
