import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil } from 'lodash';
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
import { UrlType } from '../common/common-types';
import { IAllContestsUrlParams } from '../common/url-types';

interface IContestsContext extends IHavePagesProps {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        filters: IFilter[];
    };
    actions: {
        reload: () => Promise<void>;
        applyFilters: (filters: IFilter[], page?: number | undefined) => void;
        clearFilters: () => void;
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
    const [ pageProps, setPageProps ] = useState({ pageNumber: defaultState.pageNumber } as IHavePagesProps);
    const [ getAllContestsUrlParams, setGetAllContestsUrlParams ] = useState<IAllContestsUrlParams | null>();

    const { getAllContestsUrl } = useUrls();
    const { startLoading, stopLoading } = useLoading();

    const {
        get,
        data,
    } = useHttp(getAllContestsUrl as UrlType, getAllContestsUrlParams);

    const { state: { strategies, isLoaded: strategiesAreLoaded } } = useContestStrategyFilters();
    const { state: { categories, isLoaded: categoriesAreLoaded } } = useContestCategories();

    const applyFilters = useCallback(
        (newFilters: IFilter[], pageToGo?: number) => {
            setFilters(newFilters);
            setGetAllContestsUrlParams({
                filters: newFilters,
                page: pageToGo || defaultState.pageNumber,
            });
        },
        [ ],
    );

    const clearFilters = useCallback(
        () => {
            setFilters([]);
        },
        [ ],
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
        const strategyFilters = strategies?.map(({ name, id }) => ({
            name,
            value: id.toString(),
        })) ?? [];

        return generateFilterItems(FilterType.Strategy, ...strategyFilters);
    }, [ strategies ]);

    const generateCategoryFilters = useCallback(() => {
        const categoryFilters = [] as IFilter[];
        categories?.forEach((c) => addCategoryLeafFilters(c, categoryFilters));

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
            if (isNil(getAllContestsUrlParams)) {
                return;
            }

            (async () => {
                await reload();
            })();
        },
        [ getAllContestsUrlParams, reload ],
    );

    useEffect(
        () => {
            if (strategiesAreLoaded && categoriesAreLoaded) {
                setPossibleFilters(generatePossibleFilters());
            }
        },
        [ setPossibleFilters, generatePossibleFilters, strategiesAreLoaded, categoriesAreLoaded ],
    );

    useEffect(
        () => {
            if (isNil(data)) {
                return;
            }

            const contestsResult = data as IPagedResultType<IIndexContestsType>;
            const newData = contestsResult.items as IIndexContestsType[];
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
