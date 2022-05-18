import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {IHaveChildrenProps} from "../components/common/Props";
import {IContestStrategyFilter} from "../common/contest-types";
import {useLoading} from "./use-loading";
import {useUrls} from "./use-urls";
import {useHttp} from "./use-http";
import {isEmpty} from "lodash";

interface IContestStrategyFiltersContext {
    state: {
        strategies: IContestStrategyFilter[];
    };
    actions: {
        load: () => Promise<void>;
    };
}

const defaultState = {
    state: {
        strategies: [] as IContestStrategyFilter[],
    },
};

interface IContestStrategyFiltersProviderProps extends IHaveChildrenProps {
}

const ContestStrategyFiltersContext = createContext<IContestStrategyFiltersContext>(defaultState as IContestStrategyFiltersContext);

const ContestStrategyFiltersProvider = ({ children }: IContestStrategyFiltersProviderProps) => {
    const [ strategies, setStrategies ] = useState(defaultState.state.strategies);
    
    const { startLoading, stopLoading } = useLoading();
    const { getUrlForAllContestStrategyFilter } = useUrls();
    
    const {
        get,
        data,
    } = useHttp(getUrlForAllContestStrategyFilter);
    
    const load = useCallback(
        async () => {
            startLoading();
            await get();
            stopLoading();
        },
        [ get ],
    );

    useEffect(
        () => {
            if (isEmpty(data)) {
                return;
            }
            
            setStrategies(data);
        },
        [ data ],
    );
    
    useEffect(
        () => {
            (async () => {
                await load();
            })();
        },
        [],
    )
    
    const value = {
        state: {
            strategies,
        },
        actions: {
            load,
        }
    } as IContestStrategyFiltersContext;

    return (
        <ContestStrategyFiltersContext.Provider value={value}>
            {children}
        </ContestStrategyFiltersContext.Provider>
    );
}

const useContestStrategyFilters = () => useContext(ContestStrategyFiltersContext);

export default ContestStrategyFiltersProvider;

export {
    useContestStrategyFilters,
};