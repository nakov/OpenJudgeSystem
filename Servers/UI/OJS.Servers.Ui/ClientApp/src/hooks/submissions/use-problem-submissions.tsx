import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useCurrentContest } from '../use-current-contest';
import { IErrorDataType, useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useProblems } from '../use-problems';
import { useUrls } from '../use-urls';

import { ISubmissionDetails } from './types';

interface IProblemSubmissionsContext {
    state: {
        submissions: ISubmissionDetails[] | null;
        problemSubmissionsError: IErrorDataType | null;
    };
    actions: {
        loadSubmissions: () => Promise<void>;
    };
}

type IProblemSubmissionsProviderProps = IHaveChildrenProps

interface IProblemSubmissionResultsRequestParametersType {
    problemId: number;
    isOfficial: boolean;
    take: number;
}

const ProblemSubmissionsContext = createContext<IProblemSubmissionsContext>({} as IProblemSubmissionsContext);

const ProblemSubmissionsProvider = ({ children }: IProblemSubmissionsProviderProps) => {
    const [ submissions, setSubmissions ] = useState<ISubmissionDetails[] | null>(null);
    const { state: { currentProblem } } = useProblems();
    const [
        submissionResultsToGetParameters,
        setSubmissionResultsToGetParameters,
    ] = useState<IProblemSubmissionResultsRequestParametersType | null>(null);

    const { state: { isOfficial } } = useCurrentContest();

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const { getSubmissionResultsByProblemUrl } = useUrls();
    const {
        get: getProblemSubmissions,
        data: apiProblemSubmissions,
        error: problemSubmissionsError,
    } = useHttp<IProblemSubmissionResultsRequestParametersType, ISubmissionDetails[]>({
        url: getSubmissionResultsByProblemUrl,
        parameters: submissionResultsToGetParameters,
    });

    const loadSubmissions = useCallback(
        async () => {
            const { id: problemId } = currentProblem || {};

            if (isNil(problemId) || isNil(isOfficial)) {
                return;
            }

            setSubmissionResultsToGetParameters({
                problemId,
                isOfficial,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            } as IProblemSubmissionResultsRequestParametersType);
        },
        [ currentProblem, isOfficial ],
    );

    useEffect(
        () => {
            if (isNil(apiProblemSubmissions)) {
                return;
            }

            if (!isNil(problemSubmissionsError)) {
                return;
            }

            setSubmissions(apiProblemSubmissions);
            setSubmissionResultsToGetParameters(null);
        },
        [ apiProblemSubmissions, problemSubmissionsError ],
    );

    useEffect(
        () => {
            if (isNil(submissionResultsToGetParameters)) {
                return;
            }

            (async () => {
                startLoading();
                await getProblemSubmissions();
                stopLoading();
            })();
        },
        [ startLoading, stopLoading, getProblemSubmissions, submissionResultsToGetParameters ],
    );

    const value = useMemo(
        () => ({
            state: { submissions, problemSubmissionsError },
            actions: { loadSubmissions },
        }),
        [ loadSubmissions, submissions, problemSubmissionsError ],
    );

    return (
        <ProblemSubmissionsContext.Provider value={value}>
            {children}
        </ProblemSubmissionsContext.Provider>
    );
};

const useProblemSubmissions = () => useContext(ProblemSubmissionsContext);

export default ProblemSubmissionsProvider;

export {
    useProblemSubmissions,
};
