import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';
import { IIndexContestsType, IPagedResultType } from '../common/types';
import { ContestStatus, FilterType, IFilter, ISort, SortType, ToggleParam } from '../common/contest-types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import {
    filterByType,
    findFilterByTypeAndName,
} from '../common/filter-utils';
import { useLoading } from './use-loading';
import { useContestStrategyFilters } from './use-contest-strategy-filters';
import { useContestCategories } from './use-contest-categories';
import { IUrlParam, UrlType } from '../common/common-types';
import { IAllContestsUrlParams } from '../common/url-types';
import { useUrlParams } from './common/use-url-params';
import { PageParams } from '../common/pages-types';
import {
    generateCategoryFilters,
    generateStatusFilters,
    generateStrategyFilters,
} from './contests/contest-filter-utils';
import { areStringEqual } from '../utils/compare-utils';
import { toLowerCase } from '../utils/string-utils';
import generateSortingStrategy from '../common/contest-sorting-utils';

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
        clearFilters: () => void;
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

const defaultSorting = 'StartDate';
const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);


const collectFilters = (params: IUrlParam[], possibleFilters: IFilter[]) => {
    const collectedFilters = params.map(({ key, value }) => findFilterByTypeAndName(possibleFilters, key, value))
        .filter(f => !isNil(f)) as IFilter[];

    if (isEmpty(filterByType(collectedFilters, FilterType.Status))) {
        const defaultStatusFilters = filterByType(possibleFilters, FilterType.Status)
            .filter(({ name }) => name === ContestStatus.All);

        collectedFilters.push(...defaultStatusFilters);
    }
    
    return collectedFilters;
};

const isSort = (value: ISort) : value is ISort => {
    const valueType = value as ISort;

    return valueType.type === 'string';
};
//
// const filterFunc = <K extends ISort | IFilter>(key: string, value:any, possibleValues: K[]) => {
//     if(possibleValues.every(v => isSort(v))) {
//         return possibleValues.filter(s => s.id === Number(value) 
//         && toLowerCase(s.type) === key) as ISort[];
//     }
//
//     return findFilterByTypeAndName(possibleValues as IFilter[], key, value);
// };
//
// const collectParams = <T extends IUrlParam, K extends ISort | IFilter, F extends Function>
// (params: T[], possibleValues: K[], filter: F) => {
//     const collectedValues = params.map(({ key, value }) => filter(key, value, possibleValues));
//
//     if (isEmpty(collectedValues)) {
//         const defaultSortingType = possibleValues.filter(s => s.name === defaultSorting);
//
//         collectedValues.push(...defaultSortingType);
//     }
//
//     if (isEmpty(filterByType(collectedValues as IFilter[], FilterType.Status))) {
//         const defaultStatusFilters = filterByType(possibleValues as IFilter[], FilterType.Status)
//             .filter(({ name }) => name === ContestStatus.All);
//
//         collectedValues.push(...defaultStatusFilters);
//     }
//
//     return collectedValues;
// };

const collectSorting = (params: IUrlParam[], possibleSorting: ISort []) => {
    const collectedSorting = params.map(({ key, value }) => 
        possibleSorting.find(s => s.id === Number(value) && toLowerCase(s.type) === key))
        .filter(f => !isNil(f)) as unknown as ISort[];
    
    if (isEmpty(collectedSorting)) {
        const defaultSortingType = possibleSorting.filter(s => s.name === defaultSorting);

        collectedSorting.push(...defaultSortingType);
    }
    
    return collectedSorting;
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

    const possibleSorting = useMemo(
        () => generateSortingStrategy(),
        [],
    );
    
    const filters = useMemo(
        () => collectFilters(params, possibleFilters),
        [ params, possibleFilters ],
    );

    const sorting = useMemo(
        () => collectSorting(params, possibleSorting),
        [ params, possibleSorting ],
    );

    const currentPage = useMemo(
        () => collectCurrentPage(params),
        [ params ],
    );

    const clearFilters = useCallback(
        () => clearParams(),
        [ clearParams ],
    );

    const clearSorting = useCallback(
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

    const toggleParam = useCallback<ToggleParam>((param) => {
        const { name, type, id } = param;
        const paramName = type.toString();

        const shouldRemoveFilter = params.some(({
            key,
            value,
        }) => areStringEqual(key, type, false) && areStringEqual(value, id, false)) ||
            isSort(param)
            ? name === SortType.StartDate
            : type === FilterType.Status && name === ContestStatus.All;

        unsetParam(paramName);

        if (!shouldRemoveFilter) {
            setParam(paramName, id);
        }

        changePage(1);
    },[ changePage, params, setParam, unsetParam ]);

    useEffect(
        () => {
            setGetAllContestsUrlParams({
                filters: collectFilters(params, possibleFilters),
                sorting: collectSorting(params, possibleSorting as ISort[]),
                page: currentPage,
            });
        },
        [ currentPage, params, possibleFilters, possibleSorting ],
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
            clearSorting,
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
