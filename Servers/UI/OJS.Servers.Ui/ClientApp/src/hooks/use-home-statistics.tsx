import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { IHaveChildrenProps } from '../components/common/Props';

import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

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
    const [ statistics, setStatistics ] = useState <IHomeStatistics | null>(null);
    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const { getHomeStatisticsUrl } = useUrls();

    const {
        get,
        data,
    } = useHttp<null, IHomeStatistics>({ url: getHomeStatisticsUrl });

    const load = useCallback(
        async () => {
            await startLoading();
            await get();
            await stopLoading();
        },
        [ get, startLoading, stopLoading ],
    );

    useEffect(
        () => {
            setStatistics(data);
        },
        [ data ],
    );

    const value = useMemo(
        () => ({
            state: { statistics },
            actions: { load },
        }),
        [ load, statistics ],
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
