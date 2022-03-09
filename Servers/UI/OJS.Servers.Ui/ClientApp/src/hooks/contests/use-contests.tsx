import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { getIndexContestsUrl, startContestParticipationUrl } from '../../utils/urls';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import {
    IContestType,
    IProblemType,
    IIndexContestsType,
    IGetContestsForIndexResponseType,
    IStartParticipationResponseType,
    ISubmissionTypeType,
} from './types';

interface IContestsContext {
    currentContest: IContestType | null,
    currentProblem: IProblemType | null,
    selectedSubmissionTypeId: number | null,
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
    selectedSubmissionTypeId: 0,
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
    const [ selectedSubmissionTypeId, setSelectedSubmissionTypeId ] = useState<number>(defaultState.selectedSubmissionTypeId);
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

    const hasDefaultSubmissionType = (submissionTypes: ISubmissionTypeType[]) => submissionTypes.some((st) => st.isSelectedByDefault);

    const setSubmissionType = (id: number) => {
        setSelectedSubmissionTypeId(id);
    };

    const setDefaultSubmissionType = useCallback((submissionTypes: ISubmissionTypeType[]) => {
        const submissionType = hasDefaultSubmissionType(submissionTypes)
            ? submissionTypes.filter((st) => st.isSelectedByDefault)[0]
            : submissionTypes[0];
        setSubmissionType(submissionType.id);
    }, []);

    const setProblem = (problem: IProblemType) => {
        setCurrentProblem(problem);
        setDefaultSubmissionType(problem.allowedSubmissionTypes);
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
            const problems = orderProblemsByOrderBy(responseData.contest.problems);
            setAllProblems(problems);
            setCurrentProblem(problems[0]);
            setDefaultSubmissionType(problems[0].allowedSubmissionTypes);
        }
    }, [ setDefaultSubmissionType, startContestParticipationData ]);

    useEffect(() => {
        console.log(currentProblem);
    }, [ currentProblem ]);

    const value = {
        currentContest,
        currentProblem,
        selectedSubmissionTypeId,
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
