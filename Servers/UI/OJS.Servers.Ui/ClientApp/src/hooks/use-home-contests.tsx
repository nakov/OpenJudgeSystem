import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import {
    IGetContestsForIndexResponseType,
    IIndexContestsType,
} from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';
import { getIndexContestsUrl } from '../utils/urls';

import { useHttp } from './use-http';

interface IHomeContestsContext {
    state: {
        activeContests: IIndexContestsType[];
        pastContests: IIndexContestsType[];
        isLoaded: boolean;
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

    const {
        isLoading: contestsAreLoading,
        get: getContests,
        data: contestsData,
        isSuccess,
    } = useHttp<null, IGetContestsForIndexResponseType, null>({ url: getIndexContestsUrl });

    const getForHome = useCallback(
        async () => {
            await getContests();
        },
        [ getContests ],
    );

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
                isLoaded: isSuccess,
                contestsAreLoading
            },
            actions: { getForHome },
        }),
        [ activeContests, getForHome, isSuccess, pastContests ],
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
