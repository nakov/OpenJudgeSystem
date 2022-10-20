import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';
import { IIndexContestsType, IPagedResultType } from '../common/types';
import { FilterSortType, FilterType, IContestParam, IFilter, ISort, ToggleParam } from '../common/contest-types';
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
import {
    DEFAULT_FILTER_TYPE,
    DEFAULT_SORT_FILTER_TYPE,
    DEFAULT_SORT_TYPE,
    DEFAULT_STATUS_FILTER_TYPE,
} from '../common/constants';

interface IContestsContext {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        possibleSortingTypes: ISort[];
        filters: IFilter[];
        sortingTypes: ISort[];
        pagesInfo: IPagesInfo;
        currentPage: number;
    };
    actions: {
        reload: () => Promise<void>;
        clearFilters: (type: FilterType, defaultId?: number) => void;
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
        possibleSortingTypes: [] as ISort[],
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

    const possibleFilters = useMemo(
        () => strategiesAreLoaded && categoriesAreLoaded
            ? generateStatusFilters()
                .concat(generateCategoryFilters(categories))
                .concat(generateStrategyFilters(strategies)) as IFilter[]
            : [] as IFilter[],
        [ categories, categoriesAreLoaded, strategies, strategiesAreLoaded ],
    );

    const possibleSortingTypes = useMemo(
        () => generateSortingStrategy() as unknown as ISort[],
        [],
    );
    
    const filters = useMemo(
        () => collectParams(params, possibleFilters, DEFAULT_FILTER_TYPE, DEFAULT_STATUS_FILTER_TYPE),
        [ params, possibleFilters ],
    );

    const sortingTypes = useMemo(
        () => collectParams(params, possibleSortingTypes, DEFAULT_SORT_FILTER_TYPE, DEFAULT_SORT_TYPE),
        [ params, possibleSortingTypes ],
    );

    const currentPage = useMemo(
        () => collectCurrentPage(params),
        [ params ],
    );

    const clearFilters = useCallback(
        (type: FilterType, filterTypeId: number) => {
            if (type === FilterType.Sort) {
                const filterSortTypeId = filterTypeId || possibleSortingTypes.filter(s => s.name === DEFAULT_SORT_TYPE)[0]?.id;
                
                unsetParam(type);
                setParam(type, filterSortTypeId);
            } else {
                const filterId = filterTypeId || strategiesAreLoaded && categoriesAreLoaded
                    ? possibleFilters
                        .filter(f => f.type === DEFAULT_FILTER_TYPE)
                        .filter(sf => sf.name === DEFAULT_STATUS_FILTER_TYPE)[0]?.id
                    : null;

                unsetParam(FilterType.Status);
                unsetParam(FilterType.Strategy);
                unsetParam(FilterType.Category);
                setParam(type, filterId);
            }
        },
        [ unsetParam, setParam, possibleSortingTypes, categoriesAreLoaded, strategiesAreLoaded, possibleFilters ],
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
                sorting: sortingTypes as ISort[],
                page: currentPage,
            });
        },
        [ currentPage, filters, sortingTypes ],
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
            possibleSortingTypes,
            pagesInfo,
            filters,
            sortingTypes,
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
