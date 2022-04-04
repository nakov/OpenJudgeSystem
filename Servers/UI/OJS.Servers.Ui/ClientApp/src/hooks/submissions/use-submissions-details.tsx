import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { ITestRunType, ISubmissionType, ISubmissionDetailsType, ISubmissionResultType } from './types';
import { getSubmissionDetailsUrl, getSubmissionResultsByProblem } from '../../utils/urls';
import { useContests } from '../contests/use-contests';

interface ISubmissionsDetailsContext {
    setCurrentSubmissionId: (submissionId: number) => void;
    currentSubmission: ISubmissionDetailsType | undefined,
    getSubmissionDetails: () => Promise<void>,
    currentProblemSubmissionResults: ISubmissionResultType[]
    getSubmissionResults: (problemId: number) => Promise<void>
}

const defaultState = { currentProblemSubmissionResults: [] as ISubmissionResultType[] };

const SubmissionsDetailsContext = createContext<ISubmissionsDetailsContext>(defaultState as ISubmissionsDetailsContext);

interface ISubmissionsDetailsProviderProps extends IHaveChildrenProps {}

const SubmissionsDetailsProvider = ({ children }: ISubmissionsDetailsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const { isContestParticipationOfficial } = useContests();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ currentSubmissionId, setCurrentSubmissionId ] = useState<number>();
    const [ currentSubmission, setCurrentSubmission ] = useState<ISubmissionDetailsType>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ currentProblemSubmissionResults, setCurrentProblemSubmissionResults ] =
        useState<ISubmissionResultType[]>(defaultState.currentProblemSubmissionResults);
    const getCurrentSubmissionDetailsUrl = useMemo(() => `${getSubmissionDetailsUrl}/${currentSubmissionId}`, [
        currentSubmissionId,
    ]);

    const {
        get: getSubmissionDetailsRequest,
        data: getSubmissionDetailsData,
    } = useHttp(getCurrentSubmissionDetailsUrl);

    const {
        get: getProblemResultsRequest,
        data: getProblemResultsData,
    } = useHttp(getSubmissionResultsByProblem);

    const getSubmissionDetails = useCallback(async () => {
        if (currentSubmissionId != null) {
            startLoading();
            await getSubmissionDetailsRequest();
            stopLoading();
        }
    }, [ currentSubmissionId, getSubmissionDetailsRequest, startLoading, stopLoading ]);

    const getSubmissionResults = useCallback(async (problemId: number) => {
        startLoading();
        await getProblemResultsRequest({ id: problemId.toString(), isOfficial: isContestParticipationOfficial.toString(), take: '3' });
        stopLoading();
    }, [ getProblemResultsRequest, isContestParticipationOfficial, startLoading, stopLoading ]);

    useEffect(() => {
        if (getProblemResultsData != null) {
            setCurrentProblemSubmissionResults(getProblemResultsData as ISubmissionResultType[]);
        }
    }, [ getProblemResultsData ]);

    useEffect(() => {
        if (getSubmissionDetailsData != null) {
            setCurrentSubmission(getSubmissionDetailsData as ISubmissionDetailsType);
        }
    }, [ getSubmissionDetailsData ]);

    const value = {
        setCurrentSubmissionId,
        currentSubmission,
        currentProblemSubmissionResults,
        getSubmissionDetails,
        getSubmissionResults,
    };

    return (
        <SubmissionsDetailsContext.Provider value={value}>
            {children}
        </SubmissionsDetailsContext.Provider>
    );
};

const useSubmissionsDetails = () => useContext(SubmissionsDetailsContext);

export {
    useSubmissionsDetails,
};

export type { ISubmissionType, ITestRunType };

export default SubmissionsDetailsProvider;
