import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../components/common/Props';
import { useUrls } from './use-urls';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import {
    IIndexContestsType,
    IGetContestsForIndexResponseType,
} from '../common/types';

interface IHomeContestsContext {
    state: {
        activeContests: IIndexContestsType[];
        pastContests: IIndexContestsType[];
    };
    actions: {
        getForHome: () => Promise<void>;
    }
}

const defaultState = {
    state: {
        activeContests: [] as IIndexContestsType[],
        pastContests: [] as IIndexContestsType[],
    },
};

const HomeContestsContext = createContext<IHomeContestsContext>(defaultState as IHomeContestsContext);

interface IHomeContestsProviderProps extends IHaveChildrenProps {
}

const HomeContestsProvider = ({ children }: IHomeContestsProviderProps) => {
    const [ activeContests, setActiveContests ] = useState<IIndexContestsType[]>([]);
    const [ pastContests, setPastContests ] = useState<IIndexContestsType[]>([]);
    const { getGetIndexContestsUrl } = useUrls();

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        get: getContests,
        data: getContestsData,
    } = useHttp(getGetIndexContestsUrl);

    const getForHome = useCallback(async () => {
        startLoading();
        await getContests();
        stopLoading();
    }, [ getContests, startLoading, stopLoading ]);

    useEffect(() => {
        if (getContestsData != null) {
            const {
                activeContests: rActiveContests,
                pastContests: rPastContests,
            } = getContestsData as IGetContestsForIndexResponseType;
            setActiveContests(rActiveContests);
            setPastContests(rPastContests);
        }
    }, [ getContestsData ]);

    const value = {
        state: {
            activeContests,
            pastContests,
        },
        actions: { getForHome },
    };

    return (
        <HomeContestsContext.Provider value={value}>
            {children}
        </HomeContestsContext.Provider>
    );
};

const useHomeContests = () => useContext(HomeContestsContext);

export {
    useHomeContests,
};

export type { IIndexContestsType };

export default HomeContestsProvider;
