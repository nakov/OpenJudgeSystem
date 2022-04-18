import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { IHaveChildrenProps } from '../components/common/Props';
import { IContestType } from '../common/types';
import { ContestState } from '../common/contest-types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';

interface IContestsContext {
    state: {
        contests: IContestType[];
        filter: ContestState | null;
    };
    actions: {
        reload: () => Promise<void>;
        selectFilter: (filter: ContestState | null) => void;
        clearFilter: () => void;
    };
}

interface IContestsProviderProps extends IHaveChildrenProps {
}

const defaultState = {
    state: {
        contests: [] as IContestType[],
        filter: null,
    },
};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ contests, setContests ] = useState(defaultState.state.contests);
    const [ filter, setFilter ] = useState<ContestState | null>(defaultState.state.filter);

    const { getUrlForAllContests } = useUrls();

    const getUrl = useCallback(
        () => getUrlForAllContests({ filter }),
        [ filter, getUrlForAllContests ],
    );

    const {
        get,
        data,
    } = useHttp(getUrl);

    const selectFilter = useCallback(
        (newFilter) => {
            setFilter(newFilter);
        },
        [],
    );

    const clearFilter = useCallback(
        () => selectFilter(null),
        [ selectFilter ],
    );

    const reload = useCallback(
        async () => {
            await get();
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
            setContests(data as IContestType[]);
        },
        [ data ],
    );

    const value = {
        state: {
            contests,
            filter,
        },
        actions: {
            reload,
            selectFilter,
            clearFilter,
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
