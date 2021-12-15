import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
import { getIndexContestsUrl } from '../utils/urls';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';

interface IIndexContestsType {
    id: number,
    name: string,
    endTime: Date,
    canPractice: boolean,
    canCompete: boolean,
    category: string
}

interface IContestsContext {
    activeContests: IIndexContestsType[]
    pastContests: IIndexContestsType[]
    getForHome: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IGetContestsForIndexResponseType {
    activeContests: IIndexContestsType[]
    pastContests: IIndexContestsType[]
}

const defaultState = {};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);

interface IContestsProviderProps extends IHaveChildrenProps {}

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ activeContests, setActiveContests ] = useState<IIndexContestsType[]>([]);
    const [ pastContests, setPastContests ] = useState<IIndexContestsType[]>([]);
    const { startLoading, stopLoading } = useLoading();
    const {
        get: getContestsForIndexRequest,
        data: getContestsForIndexData,
    } = useHttp(getIndexContestsUrl);

    const getForHome = useCallback(async () => {
        startLoading();
        await getContestsForIndexRequest();
        stopLoading();
    }, [ getContestsForIndexRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getContestsForIndexData != null) {
            console.log(getContestsForIndexData);
            const responseData = getContestsForIndexData as IGetContestsForIndexResponseType;
            setActiveContests(responseData.activeContests);
            setPastContests(responseData.pastContests);
        }
    }, [ getContestsForIndexData ]);

    const value = {
        activeContests,
        pastContests,
        getForHome,
    };

    return (
        <ContestsContext.Provider value={value}>
            {children}
        </ContestsContext.Provider>
    );
};

const useContests = () => useContext(ContestsContext);

export {
    useContests,
};

export type { IIndexContestsType };

export default ContestsProvider;
