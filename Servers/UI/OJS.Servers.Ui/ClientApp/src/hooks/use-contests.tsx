import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {isEmpty, isNil, without} from 'lodash';
import {IHaveChildrenProps, IHavePagesProps} from '../components/common/Props';
import {IIndexContestsType, IPagedResultType} from '../common/types';
import {ContestState, FilterType, IFilter} from '../common/contest-types';
import {useHttp} from './use-http';
import {useUrls} from './use-urls';
import {generateFilterItems} from '../common/filter-utils';
import {useLoading} from './use-loading';
import {useContestStrategyFilters} from "./use-contest-strategy-filters";

interface IContestsContext extends IHavePagesProps {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        filters: IFilter[];
    };
    actions: {
        reload: () => Promise<void>;
        applyFilter: (filter: IFilter, singleForType?: boolean) => void;
        clearFilters: () => void;
        setPage: (page: number) => void;
    };
}

interface IContestsProviderProps extends IHaveChildrenProps {
}

const defaultState = {
    state: {
        contests: [] as IIndexContestsType[],
        possibleFilters: [
            ...generateFilterItems(
                FilterType.Status,
                { name: ContestState.Active, value: ContestState.Active },
                { name: ContestState.Past, value: ContestState.Past }),
        ],
        filters: [] as IFilter[],
    },
    pageNumber: 1,
};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ contests, setContests ] = useState(defaultState.state.contests);
    const [ possibleFilters, setPossibleFilters ] = useState(defaultState.state.possibleFilters);
    const [ filters, setFilters ] = useState(defaultState.state.filters);
    const [ page, setPage ] = useState(defaultState.pageNumber);
    const [ pageProps, setPageProps ] = useState({} as IHavePagesProps);

    const { getUrlForAllContests } = useUrls();
    const { startLoading, stopLoading } = useLoading();

    const getUrl = useCallback(
        () => getUrlForAllContests({ filters, page }),
        [ filters, getUrlForAllContests, page ],
    );

    const {
        get,
        data,
    } = useHttp(getUrl);
    
    const {
        state: {
            strategies,
        },
    } = useContestStrategyFilters();

    const applyFilter = useCallback(
        (filter: IFilter, singleForType = false) => {
            let newFilters = !filters.some(({ id }) => id === filter.id)
                ? [ ...filters, filter ]
                : without(filters, filter);

            if (singleForType) {
                newFilters = newFilters.filter(({ id, type }) => type !== filter.type || id === filter.id);
            }

            setFilters(newFilters);
            setPage(defaultState.pageNumber);
        },
        [ filters ],
    );

    const clearFilters = useCallback(
        () => {
            setFilters([]);
        },
        [],
    );

    const reload = useCallback(
        async () => {
            startLoading();
            await get();
            stopLoading();
        },
        [ get ],
    );

    useEffect(
        () => {
            (async () => {
                await reload();
            })();
        },
        [ reload ],
    );

    useEffect(
        () => {
            if (isNil(strategies) || isEmpty(strategies)) {
                return;
            }
            
            const strategyFilters = strategies.map((s) => {
                return {
                    name: s.name,
                    value: s.id.toString(),
                };
            });
            
            const strategyFilterItems = generateFilterItems(FilterType.Strategy, ...strategyFilters);
            const newPossibleFilters = possibleFilters.concat(strategyFilterItems);
            setPossibleFilters(newPossibleFilters);
        },
        [ strategies ],
    );

    useEffect(
        () => {
            const contestsResult = data as IPagedResultType<IIndexContestsType>;
            const newData = contestsResult?.items as IIndexContestsType[];
            setContests(newData);
            const { pageNumber, itemsPerPage, pagesCount, totalItemsCount } = contestsResult || {};
            setPageProps({ pageNumber, itemsPerPage, pagesCount, totalItemsCount });
        },
        [ data ],
    );

    const value = {
        state: {
            contests,
            possibleFilters,
            filters,
        },
        actions: {
            reload,
            applyFilter,
            clearFilters,
            setPage,
        },
        ...pageProps,
    } as IContestsContext;

    return (
        <ContestsContext.Provider value={value}>
            {children}
        </ContestsContext.Provider>
    );
};

const useContests = () => useContext(ContestsContext);

export default ContestsProvider;

export {
    useContests,
};
