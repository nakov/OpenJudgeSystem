import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { IHaveChildrenProps } from '../components/common/Props';
import { getHomeStatisticsUrl } from '../utils/urls';

import { useHttp } from './use-http';

interface IHomeStatisticsContext {
    state: {
        statistics: IHomeStatistics | null;
    };
    actions: {
        load: () => Promise<void>;
    };
}

const HomeStatisticsContext = createContext<IHomeStatisticsContext>({} as IHomeStatisticsContext);

interface IHomeStatistics {
    usersCount: number;
    submissionsCount: number;
    submissionsPerDayCount: number;
    problemsCount: number;
    strategiesCount: number;
    contestsCount: number;
}

type IHomeStatisticsProviderProps = IHaveChildrenProps

const HomeStatisticsProvider = ({ children }: IHomeStatisticsProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ statistics, setStatistics ] = useState <IHomeStatistics | null>(null);

    const {
        get,
        data,
    } = useHttp<null, IHomeStatistics>({ url: getHomeStatisticsUrl });

    const load = useCallback(
        async () => {
            setIsLoading(true);
            await get();
            setIsLoading(false);
        },
        [ get ],
    );

    useEffect(
        () => {
            setStatistics(data);
        },
        [ data ],
    );

    const value = useMemo(
        () => ({
            state: { statistics, isLoading },
            actions: { load },
        }),
        [ load, statistics, isLoading ],
    );

    return (
        <HomeStatisticsContext.Provider value={value}>
            {children}
        </HomeStatisticsContext.Provider>
    );
};

const useHomeStatistics = () => useContext(HomeStatisticsContext);

export default HomeStatisticsProvider;

export {
    useHomeStatistics,
};
