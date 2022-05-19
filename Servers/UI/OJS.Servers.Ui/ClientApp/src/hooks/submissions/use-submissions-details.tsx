import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';

import { ITestRunType, ISubmissionType, ISubmissionDetailsType, ISubmissionDetails } from './types';
import { IHaveChildrenProps } from '../../components/common/Props';

import { getSubmissionDetailsUrl, getSubmissionResultsByProblem } from '../../utils/urls';

import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';

import { useCurrentContest } from '../use-current-contest';

interface ISubmissionsDetailsContext {
    setCurrentSubmissionId: (submissionId: number) => void;
    currentSubmission: ISubmissionDetailsType | undefined,
    getSubmissionDetails: () => Promise<void>,
    currentProblemSubmissionResults: ISubmissionDetails[]
    getSubmissionResults: (problemId: number) => Promise<void>
}

const defaultState = { currentProblemSubmissionResults: [] as ISubmissionDetails[] };

const SubmissionsDetailsContext = createContext<ISubmissionsDetailsContext>(defaultState as ISubmissionsDetailsContext);

interface ISubmissionsDetailsProviderProps extends IHaveChildrenProps {}

const SubmissionsDetailsProvider = ({ children }: ISubmissionsDetailsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const { state: { isOfficial: isContestParticipationOfficial } } = useCurrentContest();
    const [ currentSubmissionId, setCurrentSubmissionId ] = useState<number>();
    const [ currentSubmission, setCurrentSubmission ] = useState<ISubmissionDetailsType>();
    const [ currentProblemSubmissionResults, setCurrentProblemSubmissionResults ] =
        useState<ISubmissionDetails[]>(defaultState.currentProblemSubmissionResults);
    const getCurrentSubmissionDetailsUrl = useMemo(
        () => `${getSubmissionDetailsUrl}/${currentSubmissionId}`,
        [ currentSubmissionId ],
    );

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
        await getProblemResultsRequest({
            id: problemId,
            isOfficial: isContestParticipationOfficial,
            take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
        });
        stopLoading();
    }, [ getProblemResultsRequest, isContestParticipationOfficial, startLoading, stopLoading ]);

    useEffect(() => {
        if (getProblemResultsData != null) {
            setCurrentProblemSubmissionResults(getProblemResultsData as ISubmissionDetails[]);
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
