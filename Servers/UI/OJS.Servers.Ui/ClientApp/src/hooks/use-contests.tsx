import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IUrlParam, UrlType } from '../common/common-types';
import {
    DEFAULT_FILTER_TYPE,
    DEFAULT_SORT_FILTER_TYPE,
    DEFAULT_SORT_TYPE,
    DEFAULT_STATUS_FILTER_TYPE,
} from '../common/constants';
import generateSortingStrategy from '../common/contest-sorting-utils';
import { FilterSortType, FilterType, IContestParam, IFilter, ISort, ToggleParam } from '../common/contest-types';
import { filterByType, findFilterByTypeAndName } from '../common/filter-utils';
import { PageParams } from '../common/pages-types';
import { IIndexContestsType, IPagedResultType } from '../common/types';
import { IAllContestsUrlParams, IGetContestByProblemParams } from '../common/url-types';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';
import { areStringEqual } from '../utils/compare-utils';

import { useUrlParams } from './common/use-url-params';
import { generateCategoryFilters, generateStatusFilters, generateStrategyFilters } from './contests/contest-filter-utils';
import { useContestCategories } from './use-contest-categories';
import { useContestStrategyFilters } from './use-contest-strategy-filters';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

interface IContestsContext {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        possibleSortingTypes: ISort[];
        filters: IFilter[];
        sortingTypes: ISort[];
        pagesInfo: IPagesInfo;
        currentPage: number;
        contest: IIndexContestsType;
    };
    actions: {
        reload: () => Promise<void>;
        clearFilters: () => void;
        clearSorts: () => void;
        toggleParam: (param: IFilter | ISort) => void;
        changePage: (pageNumber: number) => void;
        loadContestByProblemId: (problemId: number) => void;
    };
}

type IContestsProviderProps = IHaveChildrenProps

const defaultState = {
    state: {
        contests: [] as IIndexContestsType[],
        possibleFilters: [] as IFilter[],
        possibleSortingTypes: [] as ISort[],
        pagesInfo: { pageNumber: 1 },
        contest: {} as IIndexContestsType,
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
        .filter((f) => !isNil(f)) as IContestParam<FilterSortType>[];

    if (isEmpty(filterByType(collectedFilters, filterType))) {
        const defaultStatusFilters = filterByType(possibleFilters, filterType)
            .filter(({ name }) => name === defaultValue);

        collectedFilters.push(...defaultStatusFilters);
    }

    return collectedFilters;
};

const collectCurrentPage = (params: IUrlParam[]) => {
    const { value } = params.find((p) => p.key === PageParams.page) || { value: '1' };

    const theValue = isArray(value)
        ? value[0]
        : value;

    return parseInt(theValue, 10);
};

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ contests, setContests ] = useState(defaultState.state.contests);
    const [ getAllContestsUrlParams, setGetAllContestsUrlParams ] = useState<IAllContestsUrlParams | null>();
    const [ pagesInfo, setPagesInfo ] = useState<IPagesInfo>(defaultState.state.pagesInfo as IPagesInfo);
    const [ getContestByProblemUrlParams, setGetContestByProblemUrlParams ] = useState<IGetContestByProblemParams | null>();
    const [ contest, setContest ] = useState(defaultState.state.contest);

    const {
        state: { params },
        actions: {
            setParam,
            unsetParam,
        },
    } = useUrlParams();

    const { getAllContestsUrl, getContestByProblemUrl } = useUrls();
    const { startLoading, stopLoading } = useLoading();

    const {
        get: getContests,
        data: contestsData,
    } = useHttp(getAllContestsUrl as UrlType, getAllContestsUrlParams);

    const {
        get: getContest,
        data: contestData,
    } = useHttp(getContestByProblemUrl as UrlType, getContestByProblemUrlParams);

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

    const clearSorts = useCallback(
        () => {
            const defaultSortFilterTypeId = possibleSortingTypes.filter((s) => s.name === DEFAULT_SORT_TYPE)[0]?.id;

            unsetParam(DEFAULT_SORT_FILTER_TYPE);
            setParam(DEFAULT_SORT_FILTER_TYPE, defaultSortFilterTypeId);
        },
        [ setParam, unsetParam, possibleSortingTypes ],
    );

    const clearFilters = useCallback(
        () => {
            unsetParam(FilterType.Status);
            unsetParam(FilterType.Strategy);
            unsetParam(FilterType.Category);

            const defaultFilterTypeId = possibleFilters
                .filter((f) => f.type === DEFAULT_FILTER_TYPE)
                .filter((sf) => sf.name === DEFAULT_STATUS_FILTER_TYPE)[0]?.id;

            setParam(DEFAULT_FILTER_TYPE, defaultFilterTypeId);
        },
        [ unsetParam, setParam, possibleFilters ],
    );

    const reload = useCallback(
        async () => {
            startLoading();
            await getContests();
            stopLoading();
        },
        [ getContests, startLoading, stopLoading ],
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
    }, [ changePage, params, setParam, unsetParam ]);

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

    const loadContestByProblemId = useCallback((problemId: number) => {
        if (isNil(problemId)) {
            return;
        }

        setGetContestByProblemUrlParams({ problemId });
    }, []);

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
            if (isNil(getContestByProblemUrlParams)) {
                return;
            }

            (async () => {
                await getContest();
            })();
        },
        [ getContestByProblemUrlParams, getContest ],
    );

    useEffect(() => {
        if (isNil(contestData)) {
            return;
        }

        const contestResult = contestData as IIndexContestsType;
        setContest(contestResult);
    }, [ contestData ]);

    useEffect(
        () => {
            if (isNil(contestsData)) {
                return;
            }

            const contestsResult = contestsData as IPagedResultType<IIndexContestsType>;
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
        [ contestsData ],
    );

    const value = useMemo(
        () => ({
            state: {
                contests,
                possibleFilters,
                possibleSortingTypes,
                pagesInfo,
                filters,
                sortingTypes,
                currentPage,
                contest,
            },
            actions: {
                reload,
                clearFilters,
                clearSorts,
                toggleParam,
                changePage,
                loadContestByProblemId,
            },
        }),
        [
            changePage,
            clearFilters,
            contests,
            currentPage,
            filters,
            pagesInfo,
            possibleFilters,
            reload,
            clearSorts,
            possibleSortingTypes,
            sortingTypes,
            toggleParam,
            loadContestByProblemId,
            contest,
        ],
    );

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
