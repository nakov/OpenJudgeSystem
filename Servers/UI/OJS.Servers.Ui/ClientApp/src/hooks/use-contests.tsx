import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { IHaveChildrenProps, IHavePagesProps } from '../components/common/Props';
import { IIndexContestsType, IPagedResultType } from '../common/types';
import { ContestState, FilterType, IFilter } from '../common/contest-types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import { generateFilterItems } from '../common/filter-utils';
import { useLoading } from './use-loading';
import { useContestStrategyFilters } from './use-contest-strategy-filters';
import { useContestCategories } from './use-contest-categories';
import { ITreeItemType } from '../components/guidelines/trees/Tree';

interface IContestsContext extends IHavePagesProps {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        filters: IFilter[];
    };
    actions: {
        reload: () => Promise<void>;
        applyFilters: (filters: IFilter[]) => void;
        clearFilters: () => void;
        setPage: (page: number) => void;
    };
}

interface IContestsProviderProps extends IHaveChildrenProps {
}

const defaultState = {
    state: {
        contests: [] as IIndexContestsType[],
        possibleFilters: [] as IFilter[],
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

    const { getAllContestsUrl } = useUrls();
    const { startLoading, stopLoading } = useLoading();

    const getUrl = useCallback(
        () => getAllContestsUrl({ filters, page }),
        [ filters, getAllContestsUrl, page ],
    );

    const {
        get,
        data,
    } = useHttp(getUrl);

    const { state: { strategies } } = useContestStrategyFilters();
    const { state: { categories } } = useContestCategories();

    const applyFilters = useCallback(
        (newFilters: IFilter[]) => {
            setFilters(newFilters);
            setPage(defaultState.pageNumber);
        },
        [],
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
        [ get, startLoading, stopLoading ],
    );

    const addCategoryLeafFilters = useCallback(
        ({ id, name, children: treeChildren }: ITreeItemType, arr: IFilter[]) => {
            treeChildren?.forEach((c) => {
                addCategoryLeafFilters(c, arr);
            });

            const filter = { name, value: id.toString() } as IFilter;
            arr.push(filter);
        },
        [],
    );

    const generateStrategyFilters = useCallback(() => {
        if (isNil(strategies) || isEmpty(strategies)) {
            return [];
        }
        const strategyFilters = strategies.map(({ name, id }) => ({
            name,
            value: id.toString(),
        }));

        return generateFilterItems(FilterType.Strategy, ...strategyFilters);
    }, [ strategies ]);

    const generateCategoryFilters = useCallback(() => {
        if (isNil(categories) || isEmpty(categories)) {
            return [];
        }

        const categoryFilters = [] as IFilter[];
        categories.forEach((c) => addCategoryLeafFilters(c, categoryFilters));

        return generateFilterItems(FilterType.Category, ...categoryFilters);
    }, [ categories, addCategoryLeafFilters ]);

    const generateStatusFilters = useCallback(() => generateFilterItems(
        FilterType.Status,
        { name: ContestState.Active, value: ContestState.Active },
        { name: ContestState.Past, value: ContestState.Past },
    ), []);

    const generatePossibleFilters = useCallback(() => {
        const statusFilters = generateStatusFilters();
        const categoryFilterItems = generateCategoryFilters();
        const strategyFilterItems = generateStrategyFilters();
        return statusFilters
            .concat(categoryFilterItems)
            .concat(strategyFilterItems);
    }, [ generateStatusFilters, generateCategoryFilters, generateStrategyFilters ]);

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
            setPossibleFilters(generatePossibleFilters());
        },
        [ setPossibleFilters, generatePossibleFilters ],
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
            applyFilters,
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
