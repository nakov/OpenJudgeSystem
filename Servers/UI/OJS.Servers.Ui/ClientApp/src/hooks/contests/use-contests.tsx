import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { getIndexContestsUrl, startContestParticipationUrl } from '../../utils/urls';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { IContestType } from './types';

interface IIndexContestsType {
    id: number,
    name: string,
    endTime: Date,
    canPractice: boolean,
    canCompete: boolean,
    category: string
}

interface IContestsContext {
    currentContest: IContestType | null,
    activeContests: IIndexContestsType[]
    pastContests: IIndexContestsType[]
    getForHome: () => Promise<void>;
    startContestParticipation: (id: number, isOfficial: boolean) => Promise<void>;
}

interface IGetContestsForIndexResponseType {
    activeContests: IIndexContestsType[]
    pastContests: IIndexContestsType[]
}

interface IStartParticipationResponseType {
    contest: IContestType,
    contestIsCompete: boolean,
    lastSubmissionTime: Date,
    remainingTimeInMilliseconds: number
}

const defaultState = { currentContest: null };

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);

interface IContestsProviderProps extends IHaveChildrenProps {}

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ activeContests, setActiveContests ] = useState<IIndexContestsType[]>([]);
    const [ pastContests, setPastContests ] = useState<IIndexContestsType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ currentContest, setCurrentContest ] = useState<IContestType | null>(defaultState.currentContest);
    const { startLoading, stopLoading } = useLoading();
    const {
        get: getContestsForIndexRequest,
        data: getContestsForIndexData,
    } = useHttp(getIndexContestsUrl);

    const {
        get: startContestParticipationRequest,
        data: startContestParticipationData,
    } = useHttp(startContestParticipationUrl);

    const getForHome = useCallback(async () => {
        startLoading();
        await getContestsForIndexRequest({});
        stopLoading();
    }, [ getContestsForIndexRequest, startLoading, stopLoading ]);

    const startContestParticipation = useCallback(async (id: number, isOfficial: boolean) => {
        startLoading();
        const idStr = id.toString();
        await startContestParticipationRequest({ id: idStr, official: isOfficial.toString() });
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
            const responseData = startContestParticipationData as IStartParticipationResponseType;
            setCurrentContest(responseData.contest);
        }
    }, [ startContestParticipationData ]);

    const value = {
        currentContest,
        activeContests,
        pastContests,
        getForHome,
        startContestParticipation,
    };

    useEffect(() => {
        console.log(currentContest);
    }, [ currentContest ]);

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
