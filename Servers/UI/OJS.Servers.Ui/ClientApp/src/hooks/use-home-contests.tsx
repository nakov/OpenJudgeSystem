import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { IHaveChildrenProps } from '../components/common/Props';
import { getIndexContestsUrl, getProblemResourceUrl } from '../utils/urls';
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
        getProblemResourceFile: (resourceId: number) => Promise<void>;
        getProblemResourceResponse: AxiosResponse;
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

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        get: getContestsForIndexRequest,
        data: getContestsForIndexData,
    } = useHttp(getIndexContestsUrl);

    const {
        get: getProblemResourceRequest,
        response: getProblemResourceResponse,
    } = useHttp(getProblemResourceUrl);

    const getForHome = useCallback(async () => {
        startLoading();
        await getContestsForIndexRequest({});
        stopLoading();
    }, [ getContestsForIndexRequest, startLoading, stopLoading ]);

    const getProblemResourceFile = useCallback(async (resourceId: number) => {
        startLoading();
        await getProblemResourceRequest({ id: resourceId.toString() }, 'blob');
        stopLoading();
    }, [ getProblemResourceRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getContestsForIndexData != null) {
            const {
                activeContests: rActiveContests,
                pastContests: rPastContests,
            } = getContestsForIndexData as IGetContestsForIndexResponseType;
            setActiveContests(rActiveContests);
            setPastContests(rPastContests);
        }
    }, [ getContestsForIndexData ]);

    const value = {
        state: {
            activeContests,
            pastContests,
        },
        actions: {
            getForHome,
            getProblemResourceFile,
            getProblemResourceResponse,
        },
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
