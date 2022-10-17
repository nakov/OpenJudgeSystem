import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';
import { IIndexContestsType, IPagedResultType } from '../common/types';
import {
    ContestStatus,
    FilterSortType,
    FilterType,
    IContestParam,
    IFilter,
    ISort,
    SortType,
    ToggleParam,
} from '../common/contest-types';
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
import generateSortingStrategy from '../common/contest-sorting-utils';
import { useCategoriesBreadcrumbs } from './use-contest-categories-breadcrumb';

interface IContestsContext {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        possibleSorting: ISort[];
        filters: IFilter[];
        sorting: ISort[];
        pagesInfo: IPagesInfo;
        currentPage: number;
    };
    actions: {
        reload: () => Promise<void>;
        clearFilters: (type: FilterType, defaultId: number | null) => void;
        clearSorting: () => void;
        toggleParam: (param: IFilter | ISort) => void;
        changePage: (pageNumber: number) => void;
    };
}

interface IContestsProviderProps extends IHaveChildrenProps {
}

const defaultState = {
    state: {
        contests: [] as IIndexContestsType[],
        possibleFilters: [] as IFilter[],
        possibleSorting: [] as ISort[],
        pagesInfo: { pageNumber: 1 },
    },
};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);


const collectParams = <T extends FilterSortType>(
    params: IUrlParam[], 
    possibleFilters: IContestParam<T>[], 
    filterType: FilterType, 
    defaultValue: any) => {
    const collectedFilters = params
        .map(({ key, value }) => findFilterByTypeAndName(possibleFilters, key, value))
        .filter(f => !isNil(f)) as IContestParam<FilterSortType>[];
    
    if (isEmpty(filterByType(collectedFilters, filterType))) {
        const defaultStatusFilters = filterByType(possibleFilters, filterType)
            .filter(({ name }) => name === defaultValue);

        collectedFilters.push(...defaultStatusFilters);
    }
    
    return collectedFilters;
};

const collectCurrentPage = (params: IUrlParam[]) => {
    const { value } = params.find(p => p.key === PageParams.page) || { value: 1 };

    return parseInt(value, 10);
};

const defaultFilterType = FilterType.Status;
const defaultStatusFilterType = ContestStatus.All;

const defaultSortFilterType = FilterType.Sort;
const defaultSortType = SortType.StartDate;

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ contests, setContests ] = useState(defaultState.state.contests);
    const [ getAllContestsUrlParams, setGetAllContestsUrlParams ] = useState<IAllContestsUrlParams | null>();
    const [ pagesInfo, setPagesInfo ] = useState<IPagesInfo>(defaultState.state.pagesInfo as IPagesInfo);

    const {
        state: { params },
        actions: {
            setParam,
            unsetParam,
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
    
    const { actions: { clearBreadcrumb } } = useCategoriesBreadcrumbs();

    const possibleFilters = useMemo(
        () => strategiesAreLoaded && categoriesAreLoaded
            ? generateStatusFilters()
                .concat(generateCategoryFilters(categories))
                .concat(generateStrategyFilters(strategies)) as IFilter[]
            : [] as IFilter[],
        [ categories, categoriesAreLoaded, strategies, strategiesAreLoaded ],
    );

    const possibleSorting = useMemo(
        () => generateSortingStrategy() as unknown as ISort[],
        [],
    );
    
    const filters = useMemo(
        () => collectParams(params, possibleFilters, defaultFilterType, defaultStatusFilterType),
        [ params, possibleFilters ],
    );

    const sorting = useMemo(
        () => collectParams(params, possibleSorting, defaultSortFilterType, defaultSortType),
        [ params, possibleSorting ],
    );

    const currentPage = useMemo(
        () => collectCurrentPage(params),
        [ params ],
    );

    const clearFilters = useCallback(
        (type: FilterType, defaultId: number) => {
            if (type === FilterType.Sort) {
                unsetParam(type);
                setParam(type, defaultId);
            } else {
                unsetParam(FilterType.Status);
                unsetParam(FilterType.Strategy);
                unsetParam(FilterType.Category);
                setParam(FilterType.Status, defaultId);
                clearBreadcrumb();
            }
        },
        [ unsetParam, setParam, clearBreadcrumb ],
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

    const toggleParam = useCallback<ToggleParam>((param) => {
        const { type, id } = param;
        const paramName = type.toString();

        const shouldRemoveParam = params.some(({
            key,
            value,
        }) => areStringEqual(key, type, false) && areStringEqual(value, id, false));

        unsetParam(paramName);

        if (!shouldRemoveParam) {
            setParam(paramName, id);
        }

        changePage(1);
    },[ changePage, params, setParam, unsetParam ]);

    useEffect(
        () => {
            setGetAllContestsUrlParams({ 
                filters: filters as IFilter[],
                sorting: sorting as ISort[],
                page: currentPage,
            });
        },
        [ currentPage, filters, sorting ],
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
            possibleSorting,
            pagesInfo,
            filters,
            sorting,
            currentPage,
        },
        actions: {
            reload,
            clearFilters,
            toggleParam,
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
