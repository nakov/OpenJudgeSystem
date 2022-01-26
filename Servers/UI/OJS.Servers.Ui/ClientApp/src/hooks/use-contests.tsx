import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
import { getIndexContestsUrl, startContestParticipationUrl } from '../utils/urls';
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

interface IContestType {

}

interface IContestsContext {
    activeContests: IIndexContestsType[]
    pastContests: IIndexContestsType[]
    getForHome: () => Promise<void>;
    startContestParticipation: () => Promise<void>;
    setCurrentContestId: (contestId: number) => void;
}

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
    const [ currentContestId, setCurrentContestId ] = useState<number>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ currentContest, setCurrentContest ] = useState<IContestType>();
    const { startLoading, stopLoading } = useLoading();
    const {
        get: getContestsForIndexRequest,
        data: getContestsForIndexData,
    } = useHttp(getIndexContestsUrl);

    const startCurrentContestParticipationUrl = useMemo(() => `${startContestParticipationUrl}/${currentContestId}`, [
        currentContestId,
    ]);
    const {
        get: startContestParticipationRequest,
        data: startContestParticipationData,
    } = useHttp(startCurrentContestParticipationUrl);

    const getForHome = useCallback(async () => {
        startLoading();
        await getContestsForIndexRequest();
        stopLoading();
    }, [ getContestsForIndexRequest, startLoading, stopLoading ]);

    const startContestParticipation = useCallback(async () => {
        startLoading();
        await startContestParticipationRequest();
        stopLoading();
    }, [ startContestParticipationRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getContestsForIndexData != null) {
            const responseData = getContestsForIndexData as IGetContestsForIndexResponseType;
            setActiveContests(responseData.activeContests);
            setPastContests(responseData.pastContests);
        }
    }, [ getContestsForIndexData ]);

    useEffect(() => {
        if (startContestParticipationData != null) {
            const responseData = startContestParticipationData as IGetContestsForIndexResponseType;
            setCurrentContest(responseData);
        }
    }, [ startContestParticipationData ]);

    const value = {
        activeContests,
        pastContests,
        getForHome,
        startContestParticipation,
        setCurrentContestId,
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
