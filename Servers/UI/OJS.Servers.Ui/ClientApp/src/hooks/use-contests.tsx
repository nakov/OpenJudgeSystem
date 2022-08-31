import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';
import { IIndexContestsType, IPagedResultType } from '../common/types';
import { ContestStatus, FilterType, IFilter } from '../common/contest-types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import { filterByType, findFilterByTypeAndName } from '../common/filter-utils';
import { useLoading } from './use-loading';
import { useContestStrategyFilters } from './use-contest-strategy-filters';
import { useContestCategories } from './use-contest-categories';
import { IUrlParam, UrlType } from '../common/common-types';
import { IAllContestsUrlParams } from '../common/url-types';
import { useUrlParams } from './common/use-url-params';
import { PageParams } from '../common/pages-types';
import { generateCategoryFilters, generateStatusFilters, generateStrategyFilters } from './contests/contest-filter-utils';
import { areStringEqual } from '../utils/compare-utils';

interface IContestsContext {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        filters: IFilter[];
        pagesInfo: IPagesInfo;
        currentPage: number;
    };
    actions: {
        reload: () => Promise<void>;
        clearFilters: () => void;
        toggleFilter: (filter: IFilter) => void;
        changePage: (pageNumber: number) => void;
    };
}

interface IContestsProviderProps extends IHaveChildrenProps {
}

const defaultState = {
    state: {
        contests: [] as IIndexContestsType[],
        possibleFilters: [] as IFilter[],
        pagesInfo: { pageNumber: 1 },
    },
};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);


const collectFilters = (params: IUrlParam[], possibleFilters: IFilter[]) => {
    const collectedFilters = params.map(({ value, key }) => findFilterByTypeAndName(possibleFilters, key, value))
        .filter(f => !isNil(f)) as IFilter[];

    if (isEmpty(filterByType(collectedFilters, FilterType.Status))) {
        const defaultStatusFilters = filterByType(possibleFilters, FilterType.Status)
            .filter(({ name }) => name === ContestStatus.All);

        collectedFilters.push(...defaultStatusFilters);
    }

    return collectedFilters;
};

const collectCurrentPage = (params: IUrlParam[]) => {
    const { value } = params.find(p => p.key === PageParams.page) || { value: 1 };

    return parseInt(value, 10);
};

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ contests, setContests ] = useState(defaultState.state.contests);
    const [ getAllContestsUrlParams, setGetAllContestsUrlParams ] = useState<IAllContestsUrlParams | null>();
    const [ pagesInfo, setPagesInfo ] = useState<IPagesInfo>(defaultState.state.pagesInfo as IPagesInfo);

    const {
        state: { params },
        actions: {
            setParam,
            unsetParam,
            clearParams,
        },
    } = useUrlParams();

    const { getAllContestsUrl } = useUrls();
    const { startLoading, stopLoading } = useLoading();

    const {
        get,
        data,
    } = useHttp(getAllContestsUrl as UrlType, getAllContestsUrlParams);

    const { state: { strategies, isLoaded: strategiesAreLoaded } } = useContestStrategyFilters();
    const { state: { categories, isLoaded: categoriesAreLoaded } } = useContestCategories();

    const possibleFilters = useMemo(
        () => strategiesAreLoaded && categoriesAreLoaded
            ? generateStatusFilters()
                .concat(generateCategoryFilters(categories))
                .concat(generateStrategyFilters(strategies))
            : [],
        [ categories, categoriesAreLoaded, strategies, strategiesAreLoaded ],
    );

    const filters = useMemo(
        () => collectFilters(params, possibleFilters),
        [ params, possibleFilters ],
    );

    const currentPage = useMemo(
        () => collectCurrentPage(params),
        [ params ],
    );

    const clearFilters = useCallback(
        () => clearParams(),
        [ clearParams ],
    );

    const reload = useCallback(
        async () => {
            startLoading();
            await get();
            stopLoading();
        },
        [ get, startLoading, stopLoading ],
    );

    const changePage = useCallback(
        (pageNumber: number) => {
            unsetParam(PageParams.page);
            setParam(PageParams.page, pageNumber);
        },
        [ setParam, unsetParam ],
    );

    const toggleFilter = useCallback(
        (filter: IFilter) => {
            const { name, type, id } = filter;
            const paramName = type.toString();

            const shouldRemoveFilter = params.some(({
                key,
                value,
            }) => areStringEqual(key, type, false) && areStringEqual(value, id, false)) ||
                (type === FilterType.Status && name === ContestStatus.All);

            unsetParam(paramName);

            if (!shouldRemoveFilter) {
                setParam(paramName, id);
            }

            changePage(1);
        },
        [ changePage, params, setParam, unsetParam ],
    );

    useEffect(
        () => {
            setGetAllContestsUrlParams({
                filters: collectFilters(params, possibleFilters),
                page: currentPage,
            });
        },
        [ currentPage, params, possibleFilters ],
    );

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
            if (isNil(data)) {
                return;
            }

            const contestsResult = data as IPagedResultType<IIndexContestsType>;
            const newData = contestsResult.items as IIndexContestsType[];
            const {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            } = contestsResult || {};

            const newPagesInfo = {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            };

            setContests(newData);
            setPagesInfo(newPagesInfo);
        },
        [ data ],
    );

    const value = {
        state: {
            contests,
            possibleFilters,
            pagesInfo,
            filters,
            currentPage,
        },
        actions: {
            reload,
            clearFilters,
            toggleFilter,
            changePage,
        },
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
