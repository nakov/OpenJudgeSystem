import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../components/common/Props';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
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
    submissionsPerMinute: number;
    problemsCount: number;
    strategiesCount: number;
    contestsCount: number;
}

interface IHomeStatisticsProviderProps extends IHaveChildrenProps {
}

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
    } = useHttp(getHomeStatisticsUrl);

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
            setStatistics(data as IHomeStatistics);
        },
        [ data ],
    );

    const value = {
        state: { statistics },
        actions: { load },
    };

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
