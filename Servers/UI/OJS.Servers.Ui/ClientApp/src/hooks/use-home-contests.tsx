import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../components/common/Props';
import { getIndexContestsUrl, getProblemResourceUrl } from '../utils/urls';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import {
    IIndexContestsType,
    IGetContestsForIndexResponseType,
} from '../common/types';
import { IFileResourceType } from '../common/common-types';

interface IHomeContestsContext {
    state: {
        activeContests: IIndexContestsType[];
        pastContests: IIndexContestsType[];
    };
    actions: {
        getForHome: () => Promise<void>;
        getProblemResourceFile: (resourceId: number) => Promise<void>;
        problemResourceContent: IFileResourceType | null;
        clearFileContentState: () => void;
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
    const [ problemResourceContent, setProblemResourceContent ] = useState<IFileResourceType | null>(null);

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

    const clearFileContentState = useCallback(() => {
        setProblemResourceContent(null);
    }, []);

    useEffect(() => {
        if (getProblemResourceResponse != null) {
            setProblemResourceContent(getProblemResourceResponse as IFileResourceType);
        }
    }, [ getProblemResourceResponse ]);

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
            problemResourceContent,
            clearFileContentState,
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
