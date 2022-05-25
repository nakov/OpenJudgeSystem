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
    const [
        getSubmissionResultsByProblemUrlParams,
        setGetSubmissionResultsByProblemUrlParams ] =
        useState<IGetSubmissionResultsByProblemUrlParams | null>();
    const [ currentProblemSubmissionResults, setCurrentProblemSubmissionResults ] =
        useState<ISubmissionDetails[]>(defaultState.currentProblemSubmissionResults);

    const { getCurrentSubmissionDetailsUrl, getGetSubmissionResultsByProblemUrl } = useUrls();

    const {
        get: getSubmissionDetailsRequest,
        data: getSubmissionDetailsData,
    } = useHttp(getCurrentSubmissionDetailsUrl as UrlType);

    const {
        get: getProblemResultsRequest,
        data: getProblemResultsData,
    } = useHttp(getGetSubmissionResultsByProblemUrl as UrlType, null);

    const getSubmissionDetails = useCallback(async () => {
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

        setGetSubmissionResultsByProblemUrlParams({
            id: problemId,
            isOfficial: isContestParticipationOfficial,
            take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
        });
    }, [ isContestParticipationOfficial ]);

    useEffect(() => {
        if (isNil(getSubmissionResultsByProblemUrlParams)) {
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
        if (isNil(getSubmissionDetailsData)) {
            return;
        }

        setCurrentSubmission(getSubmissionDetailsData as ISubmissionDetailsType);
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
