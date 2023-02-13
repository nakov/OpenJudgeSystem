import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useCurrentContest } from '../use-current-contest';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useProblems } from '../use-problems';
import { useUrls } from '../use-urls';

import { ISubmissionResultsByProblemResponse } from './types';

interface IProblemSubmissionsContext {
    state: {
        submissions: ISubmissionResultsByProblemResponse;
    };
    actions: {
        loadSubmissions: () => Promise<void>;
    };
}

type IProblemSubmissionsProviderProps = IHaveChildrenProps

interface IProblemSubmissionResultsRequestParametersType {
    id: number;
    isOfficial: boolean;
    take: number;
}

const defaultState = { state: { submissions: {} as ISubmissionResultsByProblemResponse } };

const ProblemSubmissionsContext = createContext<IProblemSubmissionsContext>(defaultState as IProblemSubmissionsContext);

const ProblemSubmissionsProvider = ({ children }: IProblemSubmissionsProviderProps) => {
    const [ submissions, setSubmissions ] = useState(defaultState.state.submissions);
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
    } = useHttp<IProblemSubmissionResultsRequestParametersType, ISubmissionResultsByProblemResponse>({
        url: getSubmissionResultsByProblemUrl,
        parameters: submissionResultsToGetParameters,
    });

    const loadSubmissions = useCallback(async () => {
        const { id } = currentProblem || {};

        if (isNil(id) || isNil(isOfficial)) {
            return;
        }

        setSubmissionResultsToGetParameters({
            id,
            isOfficial,
            take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
        } as IProblemSubmissionResultsRequestParametersType);
    }, [ currentProblem, isOfficial ]);

    useEffect(
        () => {
            if (isNil(apiProblemSubmissions)) {
                return;
            }

            const { submissionResults, validationResult: newValidationResult } = apiProblemSubmissions;

            setSubmissions({ submissionResults, validationResult: newValidationResult } as ISubmissionResultsByProblemResponse);
            setSubmissionResultsToGetParameters(null);
        },
        [ apiProblemSubmissions ],
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
            state: { submissions },
            actions: { loadSubmissions },
        }),
        [ loadSubmissions, submissions ],
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
