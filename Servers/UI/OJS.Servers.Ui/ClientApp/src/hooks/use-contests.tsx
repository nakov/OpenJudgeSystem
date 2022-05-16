import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isEmpty, isNil, without } from 'lodash';
import { IHaveChildrenProps } from '../components/common/Props';
import { IIndexContestsType } from '../common/types';
import { ContestState, FilterType, IFilter } from '../common/contest-types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import { generateFilterItems } from '../common/filter-utils';
import { useLoading } from './use-loading';

interface IContestsContext {
    state: {
        contests: IIndexContestsType[];
        possibleFilters: IFilter[];
        filters: IFilter[];
    };
    actions: {
        reload: () => Promise<void>;
        applyFilter: (filter: IFilter, singleForType?: boolean) => void;
        clearFilters: () => void;
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
};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ contests, setContests ] = useState(defaultState.state.contests);
    const [ possibleFilters ] = useState(defaultState.state.possibleFilters);
    const [ filters, setFilters ] = useState(defaultState.state.filters);

    const { getUrlForAllContests } = useUrls();
    const { startLoading, stopLoading } = useLoading();

    const getUrl = useCallback(
        () => getUrlForAllContests({ filters }),
        [ filters, getUrlForAllContests ],
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
            setContests(data as IIndexContestsType[]);
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
        },
    };

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
