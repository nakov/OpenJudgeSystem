import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';
import { IIndexContestsType, IPagedResultType } from '../common/types';
import { ContestStatus, FilterType, IContestQueryParam, IFilter, ISort, SortType, ToggleParam } from '../common/contest-types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import { filterByType } from '../common/filter-utils';
import { useLoading } from './use-loading';
import { useContestStrategyFilters } from './use-contest-strategy-filters';
import { useContestCategories } from './use-contest-categories';
import { IUrlParam, UrlType } from '../common/common-types';
import { IAllContestsUrlParams } from '../common/url-types';
import { useUrlParams } from './common/use-url-params';
import { PageParams } from '../common/pages-types';
import { generateCategoryFilters, generateStatusFilters, generateStrategyFilters } from './contests/contest-filter-utils';
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

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);


// const collectFilters = (params: IUrlParam[], possibleFilters: IFilter[]) => {
//     const collectedFilters = params.map(({ key, value }) 
//     => findFilterByTypeAndName(possibleFilters, key, value))
//         .filter(f => !isNil(f)) as IFilter[];
//
//     if (isEmpty(filterByType(collectedFilters, FilterType.Status))) {
//         const defaultStatusFilters = filterByType(possibleFilters, FilterType.Status)
//             .filter(({ name }) => name === ContestStatus.All);
//
//         collectedFilters.push(...defaultStatusFilters);
//     }
//    
//     return collectedFilters;
// };

const isSort = (value: ISort) : value is ISort => {
    const valueType = value as ISort;

    return valueType.type === SortType;
};

// const filterFunc = <T extends ISort | IFilter>(key: string, value:any, possibleValues: 
// T[]) : ISort[] | IFilter | undefined => {
//     console.log('TEST POSSIBLE  VALUES BLALALALA');
//     console.log(possibleValues);
//    
//     if(possibleValues.every(v => isSort(v))) {
//         const test = possibleValues.filter(s => s.id === Number(value) && 
//         toLowerCase(s.type) === key).filter(s => !isNil(s)) as ISort[];
//        
//         return test;
//     }
//    
//     console.log('FILTER FUNC POSSIBLE VALUES');
//     console.log(possibleValues);
//     console.log(key, value);
//    
//     return findFilterByTypeAndName(possibleValues as IFilter[], key, value);
// };

const collectParams = <T extends IUrlParam, K extends IContestQueryParam>
    (params: T[], possibleValues: K[]) => {
    console.log('POSSIBLE VALUES BEFORE');
    console.log(possibleValues);
    const collectedValues = params.map(({ key, value }) =>
        possibleValues.filter(s => s.id === Number(value) && toLowerCase(s.type) === key));
    
    console.log('COLLECTED VALUES MIDDLE');
    console.log(collectedValues);
    
    if (isEmpty(collectedValues)) {
        const defaultSortingType = possibleValues.filter(s => s.name === SortType.StartDate) as unknown as ISort[];

        collectedValues.push(...defaultSortingType);
    }

    if (isEmpty(filterByType(collectedValues, FilterType.Status))) {
        const defaultStatusFilters = filterByType(possibleValues as IFilter[], FilterType.Status)
            .filter(({ name }) => name === ContestStatus.All);

        collectedValues.push(...defaultStatusFilters);
    }

    console.log('COLLECTED VALUES AFTER');
    console.log(collectedValues);
    
    return collectedValues.flat(2);
};

// const collectSorting = (params: IUrlParam[], possibleSorting: ISort []) => {
//     const collectedSorting = params.map(({ key, value }) => 
//         possibleSorting.find(s => s.id === Number(value) && toLowerCase(s.type) === key))
//         .filter(f => !isNil(f)) as unknown as ISort[];
//    
//     if (isEmpty(collectedSorting)) {
//         const defaultSortingType = possibleSorting.filter(s => s.name === defaultSorting);
//
//         collectedSorting.push(...defaultSortingType);
//     }
//    
//     return collectedSorting;
// };

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
        () => collectParams(params, possibleFilters),
        [ params, possibleFilters ],
    );

    const sorting = useMemo(
        () => collectParams(params, possibleSorting),
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

        const shouldRemoveParam = params.some(({
            key,
            value,
        }) => areStringEqual(key, type, false) && areStringEqual(value, id, false)) ||
            param.type === SortType
            ? name === SortType.StartDate
            : type === FilterType.Status && name === ContestStatus.All;

        unsetParam(paramName);

        if (!shouldRemoveParam) {
            setParam(paramName, id);
        }

        changePage(1);
    },[ changePage, params, setParam, unsetParam ]);

    useEffect(
        () => {
            setGetAllContestsUrlParams({
                filters: collectParams(params, possibleFilters as IFilter[]),
                sorting: collectParams(params, possibleSorting as ISort[]),
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
