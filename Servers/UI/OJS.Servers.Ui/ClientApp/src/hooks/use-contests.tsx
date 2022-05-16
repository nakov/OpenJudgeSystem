import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil, without } from 'lodash';
import { IHaveChildrenProps, IHavePagesProps } from '../components/common/Props';
import { IIndexContestsType } from '../common/types';
import { ContestState, FilterType, IFilter } from '../common/contest-types';
import { IPagedResultType } from '../common/types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import { generateFilterItems } from '../common/filter-utils';
import { useLoading } from './use-loading';

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
            ...generateFilterItems(FilterType.Status, ContestState.Active, ContestState.Past),
            ...generateFilterItems(FilterType.Strategy, 'Python', 'JS', 'Java', 'C#', 'Go'),
        ],
        filters: [] as IFilter[],
    },
    pageNumber: 1,
};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ contests, setContests ] = useState(defaultState.state.contests);
    const [ possibleFilters ] = useState(defaultState.state.possibleFilters);
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

    const applyFilter = useCallback(
        (filter: IFilter, singleForType = false) => {
            let newFilters = isNil(filters.find(f => f.id === filter.id))
                ? [ ...filters, filter ]
                : without(filters, filter);

            if (singleForType) {
                newFilters = newFilters.filter(f => f.type !== filter.type || f.id === filter.id);
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
