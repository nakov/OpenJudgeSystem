import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { useUrls } from '../use-urls';
import { useCurrentContest } from '../use-current-contest';
import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { UrlType } from '../../common/common-types';
import { IGetSubmissionResultsByProblemUrlParams } from '../../common/url-types';
import { ITestRunType, ISubmissionType, ISubmissionDetailsType, ISubmissionDetails } from './types';
import { IHaveChildrenProps } from '../../components/common/Props';

interface ISubmissionsDetailsContext {
    setCurrentSubmissionId: (submissionId: number) => void;
    currentSubmission: ISubmissionDetailsType | undefined,
    getDetails: () => Promise<void>,
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
    const [
        submissionResultsByProblemUrlParams,
        setSubmissionResultsByProblemUrlParams ] =
        useState<IGetSubmissionResultsByProblemUrlParams | null>();
    const [ currentProblemSubmissionResults, setCurrentProblemSubmissionResults ] =
        useState<ISubmissionDetails[]>(defaultState.currentProblemSubmissionResults);

    const { getCurrentSubmissionDetailsUrl, getSubmissionResultsByProblemUrl } = useUrls();

    const {
        get: getSubmissionDetailsRequest,
        data: submissionDetailsData,
    } = useHttp(getCurrentSubmissionDetailsUrl as UrlType);

    const {
        get: getProblemResultsRequest,
        data: getProblemResultsData,
    } = useHttp(getSubmissionResultsByProblemUrl as UrlType, null);

    const getDetails = useCallback(async () => {
        if (isNil(currentSubmissionId)) {
            return;
        }

        startLoading();
        await getSubmissionDetailsRequest();
        stopLoading();
    }, [ currentSubmissionId, getSubmissionDetailsRequest, startLoading, stopLoading ]);

    const getSubmissionResults = useCallback(async (problemId: number) => {
        if (isNil(problemId)) {
            return;
        }

        setSubmissionResultsByProblemUrlParams({
            id: problemId,
            isOfficial: isContestParticipationOfficial,
            take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
        });
    }, [ isContestParticipationOfficial ]);

    useEffect(() => {
        if (isNil(submissionResultsByProblemUrlParams)) {
            return;
        }

        (async () => {
            startLoading();
            await getProblemResultsRequest();
            stopLoading();
        })();
    });

    useEffect(() => {
        if (isNil(getProblemResultsData)) {
            return;
        }

        setCurrentProblemSubmissionResults(getProblemResultsData as ISubmissionDetails[]);
    }, [ getProblemResultsData ]);

    useEffect(() => {
        if (isNil(submissionDetailsData)) {
            return;
        }

        setCurrentSubmission(submissionDetailsData as ISubmissionDetailsType);
    }, [ submissionDetailsData ]);

    const value = {
        setCurrentSubmissionId,
        currentSubmission,
        currentProblemSubmissionResults,
        getDetails,
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
