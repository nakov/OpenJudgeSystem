import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { IException } from '../../common/types';
import {
    IGetSubmissionDetailsByIdUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
} from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useUrls } from '../use-urls';

import {
    ISubmissionDetails,
    ISubmissionDetailsType,
    ISubmissionType,
    ITestRunType,
} from './types';

interface ISubmissionsDetailsContext {
    state: {
        currentSubmission: ISubmissionDetailsType | null;
        currentProblemSubmissionResults: ISubmissionDetails[];
        problemResultsError: IException | null;
        submissionDetailsError: IException | null;
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
    const [ problemResultsError, setProblemResultsError ] = useState<IException | null>(null);
    const [ submissionDetailsError, setSubmissionDetailsError ] = useState<IException | null>(null);
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
        error: apiSubmissionDetailsError,
    } = useHttp<IGetSubmissionDetailsByIdUrlParams, ISubmissionDetailsType>({
        url: getSubmissionDetailsByIdUrl,
        parameters: getSubmissionDetailsByIdParams,
    });

    const [
        submissionResultsByProblemUrlParams,
        setSubmissionResultsByProblemUrlParams,
    ] = useState<IGetSubmissionResultsByProblemUrlParams | null>();

    const {
        get: getProblemResultsRequest,
        data: apiProblemResults,
        error: apiProblemResultsError,
    } = useHttp<IGetSubmissionResultsByProblemUrlParams, ISubmissionDetails[]>({
        url: getSubmissionResultsByProblemUrl,
        parameters: submissionResultsByProblemUrlParams,
    });

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

        if (!isNil(apiProblemResultsError)) {
            setProblemResultsError(apiProblemResults as unknown as IException);
            return;
        }

        setCurrentProblemSubmissionResults(apiProblemResults);
    }, [ apiProblemResults, apiProblemResultsError ]);

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

    const getDetails = useCallback(
        async (submissionId: number) => {
            if (isNil(submissionId) || Number.isNaN(submissionId)) {
                return;
            }

            setGetSubmissionDetailsByIdParams({ submissionId } as IGetSubmissionDetailsByIdUrlParams);
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(apiSubmissionDetails)) {
                return;
            }

            if (!isNil(apiSubmissionDetailsError)) {
                setSubmissionDetailsError(apiSubmissionDetails as unknown as IException);
                return;
            }

            setCurrentSubmission(apiSubmissionDetails);
        },
        [ apiSubmissionDetails, apiSubmissionDetailsError ],
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

    const value = useMemo(
        () => ({
            state: {
                currentSubmission,
                currentProblemSubmissionResults,
                submissionDetailsError,
                problemResultsError,
            },
            actions: {
                selectSubmissionById,
                getDetails,
                getSubmissionResults,
            },
        }),
        [
            currentProblemSubmissionResults,
            currentSubmission,
            getDetails,
            getSubmissionResults,
            submissionDetailsError,
            problemResultsError,
        ],
    );

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
