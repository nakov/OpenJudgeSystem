import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { UrlType } from '../../common/common-types';
import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { IGetSubmissionDetailsByIdUrlParams, IGetSubmissionResultsByProblemUrlParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useUrls } from '../use-urls';

import { ISubmissionDetails, ISubmissionDetailsType, ISubmissionType, ITestRunType } from './types';

interface ISubmissionsDetailsContext {
    state: {
        currentSubmission: ISubmissionDetailsType | null;
        currentProblemSubmissionResults: ISubmissionDetails[];
    };
    actions: {
        selectSubmissionById: (submissionId: number) => void;
        getDetails: (submissionId: number) => Promise<void>;
        getSubmissionResults: (problemId: number, isOfficial: boolean) => Promise<void>;
    };
}

const defaultState = { state: { currentProblemSubmissionResults: [] as ISubmissionDetails[] } };

const SubmissionsDetailsContext = createContext<ISubmissionsDetailsContext>(defaultState as ISubmissionsDetailsContext);

type ISubmissionsDetailsProviderProps = IHaveChildrenProps

const SubmissionsDetailsProvider = ({ children }: ISubmissionsDetailsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ currentSubmissionId, selectSubmissionById ] = useState<number>();
    const [
        currentSubmission,
        setCurrentSubmission,
    ] = useState<ISubmissionDetailsType | null>(null);

    const [
        currentProblemSubmissionResults,
        setCurrentProblemSubmissionResults,
    ] = useState(defaultState.state.currentProblemSubmissionResults);

    const {
        getSubmissionDetailsByIdUrl,
        getSubmissionResultsByProblemUrl,
    } = useUrls();

    const [
        getSubmissionDetailsByIdParams,
        setGetSubmissionDetailsByIdParams,
    ] = useState<IGetSubmissionDetailsByIdUrlParams | null>(null);

    const {
        get: getSubmissionDetails,
        data: apiSubmissionDetails,
    } = useHttp(getSubmissionDetailsByIdUrl as UrlType, getSubmissionDetailsByIdParams);

    const [
        submissionResultsByProblemUrlParams,
        setSubmissionResultsByProblemUrlParams,
    ] = useState<IGetSubmissionResultsByProblemUrlParams | null>();

    const {
        get: getProblemResultsRequest,
        data: apiProblemResults,
    } = useHttp(getSubmissionResultsByProblemUrl as UrlType, submissionResultsByProblemUrlParams);

    const getDetails = useCallback(
        async (submissionId: number) => {
            if (isNil(submissionId)) {
                return;
            }

            setGetSubmissionDetailsByIdParams({ submissionId } as IGetSubmissionDetailsByIdUrlParams);
        },
        [],
    );

    const getSubmissionResults = useCallback(
        async (problemId: number, isOfficial: boolean) => {
            if (isNil(problemId)) {
                return;
            }

            setSubmissionResultsByProblemUrlParams({
                id: problemId,
                isOfficial,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            });
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(submissionResultsByProblemUrlParams)) {
                return;
            }

            (async () => {
                startLoading();
                await getProblemResultsRequest();
                setSubmissionResultsByProblemUrlParams(null);
                stopLoading();
            })();
        },
        [ getProblemResultsRequest, startLoading, stopLoading, submissionResultsByProblemUrlParams ],
    );

    useEffect(() => {
        if (isNil(apiProblemResults)) {
            return;
        }

        setCurrentProblemSubmissionResults(apiProblemResults as ISubmissionDetails[]);
    }, [ apiProblemResults ]);

    useEffect(
        () => {
            if (isNil(getSubmissionDetailsByIdParams)) {
                return;
            }

            (async () => {
                startLoading();
                await getSubmissionDetails();
                stopLoading();
            })();
        },
        [ getSubmissionDetails, getSubmissionDetailsByIdParams, startLoading, stopLoading ],
    );

    useEffect(
        () => {
            if (isNil(apiSubmissionDetails)) {
                return;
            }

            setCurrentSubmission(apiSubmissionDetails as ISubmissionDetailsType);
        },
        [ apiSubmissionDetails ],
    );

    useEffect(
        () => {
            if (isNil(currentSubmissionId)) {
                return;
            }

            (async () => {
                await getDetails(currentSubmissionId);
            })();
        },
        [ currentSubmissionId, getDetails ],
    );

    const value = {
        state: {
            currentSubmission,
            currentProblemSubmissionResults,
        },
        actions: {
            selectSubmissionById,
            getDetails,
            getSubmissionResults,
        },
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
