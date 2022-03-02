import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { getIndexContestsUrl, startContestParticipationUrl, getAllowedSubmissionTypesForProblemUrl } from '../../utils/urls';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { IContestType, IProblemType, IIndexContestsType, IGetContestsForIndexResponseType, IStartParticipationResponseType } from './types';

interface IContestsContext {
    currentContest: IContestType | null,
    currentProblem: IProblemType | null,
    setProblem: (problem: IProblemType) => void,
    setSubmissionType: (id: number) => void,
    activeContests: IIndexContestsType[]
    pastContests: IIndexContestsType[]
    getForHome: () => Promise<void>;
    startContestParticipation: (id: number, isOfficial: boolean) => Promise<void>;
}

const defaultState = {
    currentContest: null,
    currentProblem: null,
};

const ContestsContext = createContext<IContestsContext>(defaultState as IContestsContext);

interface IContestsProviderProps extends IHaveChildrenProps {}

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ activeContests, setActiveContests ] = useState<IIndexContestsType[]>([]);
    const [ pastContests, setPastContests ] = useState<IIndexContestsType[]>([]);
    const [ currentContest, setCurrentContest ] = useState<IContestType | null>(defaultState.currentContest);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ allProblems, setAllProblems ] = useState<IProblemType[]>();
    const [ currentProblem, setCurrentProblem ] = useState<IProblemType | null>(defaultState.currentProblem);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ selectedSubmissionTypeId, setSelectedSubmissionTypeId ] = useState<number>();
    const { startLoading, stopLoading } = useLoading();
    const {
        get: getContestsForIndexRequest,
        data: getContestsForIndexData,
    } = useHttp(getIndexContestsUrl);

    const {
        get: startContestParticipationRequest,
        data: startContestParticipationData,
    } = useHttp(startContestParticipationUrl);

    const {
        get: getAllowedSubmissionTypesForProblemRequest,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data: getAllowedSubmissionTypesForProblemData,
    } = useHttp(getAllowedSubmissionTypesForProblemUrl);

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getAllowedSubmissionTypesForProblem = useCallback(async (problemId: number) => {
        startLoading();
        await getAllowedSubmissionTypesForProblemRequest({ id: problemId.toString() });
        stopLoading();
    }, [ getAllowedSubmissionTypesForProblemRequest, startLoading, stopLoading ]);

    const setProblem = (problem: IProblemType) => {
        setCurrentProblem(problem);
    };

    const setSubmissionType = (id: number) => {
        setSelectedSubmissionTypeId(id);
    };

    const orderProblemsByOrderBy = (problems: IProblemType[]) => problems.sort((a, b) => a.orderBy - b.orderBy);

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
            console.log(responseData.contest);
            const problems = orderProblemsByOrderBy(responseData.contest.problems);
            setAllProblems(problems);
            setCurrentProblem(problems[0]);
        }
    }, [ startContestParticipationData ]);

    // useEffect(() => {
    //     if (currentProblem != null) {
    //         getAllowedSubmissionTypesForProblem(currentProblem.id);
    //     }
    // }, [ currentProblem, getAllowedSubmissionTypesForProblem ]);

    const value = {
        currentContest,
        currentProblem,
        setProblem,
        setSubmissionType,
        activeContests,
        pastContests,
        getForHome,
        startContestParticipation,
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
