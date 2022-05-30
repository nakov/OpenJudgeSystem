import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { useUrls } from '../use-urls';
import { useCurrentContest } from '../use-current-contest';
import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { UrlType } from '../../common/common-types';
import { IGetSubmissionDetailsByIdUrlParams, IGetSubmissionResultsByProblemUrlParams } from '../../common/url-types';
import { ITestRunType, ISubmissionType, ISubmissionDetailsType, ISubmissionDetails } from './types';
import { IHaveChildrenProps } from '../../components/common/Props';

interface ISubmissionsDetailsContext {
    currentSubmission: ISubmissionDetailsType | undefined,
    getDetails: (submissionId: number) => Promise<void>,
    currentProblemSubmissionResults: ISubmissionDetails[]
    getSubmissionResults: (problemId: number) => Promise<void>
}

const defaultState = { currentProblemSubmissionResults: [] as ISubmissionDetails[] };

const SubmissionsDetailsContext = createContext<ISubmissionsDetailsContext>(defaultState as ISubmissionsDetailsContext);

interface ISubmissionsDetailsProviderProps extends IHaveChildrenProps {}

const SubmissionsDetailsProvider = ({ children }: ISubmissionsDetailsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const { state: { isOfficial: isContestParticipationOfficial } } = useCurrentContest();
    const [ currentSubmission, setCurrentSubmission ] = useState<ISubmissionDetailsType>();
    const [ currentProblemSubmissionResults, setCurrentProblemSubmissionResults ] =
        useState<ISubmissionDetails[]>(defaultState.currentProblemSubmissionResults);

    const { getSubmissionDetailsByIdUrl, getSubmissionResultsByProblemUrl } = useUrls();

    const [
        getSubmissionDetailsByIdParams,
        setGetSubmissionDetailsByIdParams ] = useState<IGetSubmissionDetailsByIdUrlParams | null>(null);
    const {
        get: getSubmissionDetails,
        data: apiSubmissionDetails,
    } = useHttp(getSubmissionDetailsByIdUrl as UrlType, getSubmissionDetailsByIdParams);

    const [
        submissionResultsByProblemUrlParams,
        setSubmissionResultsByProblemUrlParams ] =
        useState<IGetSubmissionResultsByProblemUrlParams | null>();
    const {
        get: getProblemResultsRequest,
        data: apiProblemResults,
    } = useHttp(getSubmissionResultsByProblemUrl as UrlType, submissionResultsByProblemUrlParams);

    const getDetails = useCallback(async (submissionId: number) => {
        if (isNil(submissionId)) {
            return;
        }

        setGetSubmissionDetailsByIdParams({ submissionId } as IGetSubmissionDetailsByIdUrlParams);
    }, []);

    const getSubmissionResults = useCallback(async (problemId: number) => {
        if (isNil(problemId)) {
            return;
        }

        setSubmissionResultsByProblemUrlParams({
            id: problemId,
            isOfficial: true,
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
            setSubmissionResultsByProblemUrlParams(null);
            stopLoading();
        })();
    }, [ getProblemResultsRequest, startLoading, stopLoading, submissionResultsByProblemUrlParams ]);

    useEffect(() => {
        if (isNil(apiProblemResults)) {
            return;
        }

        setCurrentProblemSubmissionResults(apiProblemResults as ISubmissionDetails[]);
    }, [ apiProblemResults ]);

    useEffect(() => {
        if (isNil(getSubmissionDetailsByIdParams)) {
            return;
        }

        (async () => {
            startLoading();
            await getSubmissionDetails();
            stopLoading();
        })();
    }, [ getSubmissionDetails, getSubmissionDetailsByIdParams, startLoading, stopLoading ]);

    useEffect(() => {
        if (isNil(apiSubmissionDetails)) {
            return;
        }

        setCurrentSubmission(apiSubmissionDetails as ISubmissionDetailsType);
    }, [ apiSubmissionDetails ]);

    const value = {
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
