import React, { createContext, useCallback, useContext, useState } from 'react';
import { IHaveChildrenProps } from '../components/common/Props';
import { useLoading } from './use-loading';

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

const fakeData = {
    usersCount: 15_000,
    submissionsCount: 2_000_000,
    submissionsPerMinute: 160,
    contestsCount: 2000,
    problemsCount: 10_000,
    strategiesCount: 37,
};

const HomeStatisticsProvider = ({ children }: IHomeStatisticsProviderProps) => {
    const [ statistics, setStatistics ] = useState <IHomeStatistics | null>(null);
    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const load = useCallback(
        async () => {
            await startLoading();
            setStatistics(fakeData);
            await stopLoading();
        },
        [ startLoading, stopLoading ],
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
