import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import {
    IGetContestsForIndexResponseType,
    IIndexContestsType,
} from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

interface IHomeContestsContext {
    state: {
        activeContests: IIndexContestsType[];
        pastContests: IIndexContestsType[];
    };
    actions: {
        getForHome: () => Promise<void>;
    };
}

const defaultState = {
    state: {
        activeContests: [] as IIndexContestsType[],
        pastContests: [] as IIndexContestsType[],
    },
};

const HomeContestsContext = createContext<IHomeContestsContext>(defaultState as IHomeContestsContext);

type IHomeContestsProviderProps = IHaveChildrenProps

const HomeContestsProvider = ({ children }: IHomeContestsProviderProps) => {
    const [ activeContests, setActiveContests ] = useState<IIndexContestsType[]>([]);
    const [ pastContests, setPastContests ] = useState<IIndexContestsType[]>([]);
    const { getIndexContestsUrl } = useUrls();

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        get: getContests,
        data: contestsData,
    } = useHttp(getIndexContestsUrl);

    const getForHome = useCallback(async () => {
        startLoading();
        await getContests();
        stopLoading();
    }, [ getContests, startLoading, stopLoading ]);

    useEffect(() => {
        if (isNil(contestsData)) {
            return;
        }

        const {
            activeContests: active,
            pastContests: past,
        } = contestsData as IGetContestsForIndexResponseType;

        setActiveContests(active);
        setPastContests(past);
    }, [ contestsData ]);

    const value = useMemo(
        () => ({
            state: {
                activeContests,
                pastContests,
            },
            actions: { getForHome },
        }),
        [ activeContests, getForHome, pastContests ],
    );

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
