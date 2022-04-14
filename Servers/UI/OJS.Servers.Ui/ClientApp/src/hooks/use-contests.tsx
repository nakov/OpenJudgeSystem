import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { IHaveChildrenProps } from '../components/common/Props';
import { getIndexContestsUrl, getProblemResourceUrl } from '../utils/urls';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import {
    IProblemType,
    IIndexContestsType,
    IGetContestsForIndexResponseType,
    ISubmissionTypeType,
} from '../common/types';

interface IContestsContext2 {
    currentProblem: IProblemType | null;
    selectedSubmissionTypeId: number | null;
    setProblem: (problem: IProblemType) => void;
    setSubmissionType: (id: number) => void;
    activeContests: IIndexContestsType[];
    pastContests: IIndexContestsType[];
    getForHome: () => Promise<void>;
    getProblemResourceFile: (resourceId: number) => Promise<void>;
    getProblemResourceResponse: AxiosResponse;
}

const defaultState = {
    currentProblem: null,
    selectedSubmissionTypeId: 0,
};

const ContestsContext = createContext<IContestsContext2>(defaultState as IContestsContext2);

interface IContestsProviderProps extends IHaveChildrenProps {
}

const ContestsProvider = ({ children }: IContestsProviderProps) => {
    const [ activeContests, setActiveContests ] = useState<IIndexContestsType[]>([]);
    const [ pastContests, setPastContests ] = useState<IIndexContestsType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ allProblems, setAllProblems ] = useState<IProblemType[]>();
    const [ currentProblem, setCurrentProblem ] = useState<IProblemType | null>(defaultState.currentProblem);
    const [ selectedSubmissionTypeId, setSelectedSubmissionTypeId ] = useState<number>(defaultState.selectedSubmissionTypeId);

    const { startLoading, stopLoading } = useLoading();
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

    const hasDefaultSubmissionType = useCallback(
        (submissionTypes: ISubmissionTypeType[]) => submissionTypes.some((st) => st.isSelectedByDefault),
        [],
    );

    const setSubmissionType = useCallback(
        (id: number) => setSelectedSubmissionTypeId(id),
        [],
    );

    const setDefaultSubmissionType = useCallback((submissionTypes: ISubmissionTypeType[]) => {
        const submissionType = hasDefaultSubmissionType(submissionTypes)
            ? submissionTypes.filter((st) => st.isSelectedByDefault)[0]
            : submissionTypes[0];
        setSubmissionType(submissionType.id);
    }, [ hasDefaultSubmissionType, setSubmissionType ]);

    const setProblem = useCallback(
        (problem: IProblemType) => {
            setCurrentProblem(problem);
            setDefaultSubmissionType(problem.allowedSubmissionTypes);
        },
        [ setDefaultSubmissionType ],
    );

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

    useEffect(() => {
        console.log(currentProblem);
    }, [ currentProblem ]);

    const value = {
        currentProblem,
        selectedSubmissionTypeId,
        activeContests,
        pastContests,

        setProblem,
        setSubmissionType,
        getForHome,
        getProblemResourceFile,
        getProblemResourceResponse,
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
