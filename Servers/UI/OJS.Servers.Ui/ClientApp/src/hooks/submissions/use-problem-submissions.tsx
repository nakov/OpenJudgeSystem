import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { IHaveChildrenProps } from '../../components/common/Props';
import { getSubmissionResultsByProblemUrl } from '../../utils/urls';
import { useCurrentContest } from '../use-current-contest';
import { IErrorDataType, useHttp } from '../use-http';

import { ISubmissionDetails } from './types';

interface IProblemSubmissionsContext {
    state: {
        submissions: ISubmissionDetails[] | null;
        problemSubmissionsError: IErrorDataType | null;
    };
    actions: {
        loadSubmissions: (problemId: number) => Promise<void>;
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
    const [ isLoading, setIsLoading ] = useState(false);
    const [ submissions, setSubmissions ] = useState<ISubmissionDetails[] | null>(null);
    const [
        submissionResultsToGetParameters,
        setSubmissionResultsToGetParameters,
    ] = useState<IProblemSubmissionResultsRequestParametersType | null>(null);

    const { state: { isOfficial } } = useCurrentContest();
    
    const {
        get: getProblemSubmissions,
        data: apiProblemSubmissions,
        error: problemSubmissionsError,
    } = useHttp<IProblemSubmissionResultsRequestParametersType, ISubmissionDetails[]>({
        url: getSubmissionResultsByProblemUrl,
        parameters: submissionResultsToGetParameters,
    });

    const loadSubmissions = useCallback(
        async (id: number) => {
            if (isNil(id) || isNil(isOfficial)) {
                return;
            }

            setSubmissionResultsToGetParameters({
                problemId: id,
                isOfficial,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            } as IProblemSubmissionResultsRequestParametersType);
        },
        [ isOfficial ],
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
                setIsLoading(true);
                await getProblemSubmissions();
                setIsLoading(false);
            })();
        },
        [ getProblemSubmissions, submissionResultsToGetParameters ],
    );

    const value = useMemo(
        () => ({
            state: { submissions, problemSubmissionsError, isLoading },
            actions: { loadSubmissions },
        }),
        [ loadSubmissions, submissions, problemSubmissionsError, isLoading ],
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
