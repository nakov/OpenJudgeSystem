import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useProblems } from '../use-problems';
import { ISubmissionDetails } from './types';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { useUrls } from '../use-urls';
import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { useCurrentContest } from '../use-current-contest';
import { UrlType } from '../../common/common-types';

interface IProblemSubmissionsContext {
    state: {
        submissions: ISubmissionDetails[],
    };
    actions: {
        getSubmissions: () => Promise<void>,
    };
}

interface IProblemSubmissionsProviderProps extends IHaveChildrenProps {
}

interface IProblemSubmissionResultsRequestParametersType {
    id: number;
    isOfficial: boolean;
    take: number;
}

const defaultState = { state: { submissions: [] as ISubmissionDetails[] } };

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
        data: problemSubmissionsData,
    } = useHttp(getSubmissionResultsByProblemUrl as UrlType, submissionResultsToGetParameters);

    const getSubmissions = useCallback(async () => {
        const { id } = currentProblem || {};
        if (isNil(id)) {
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
            if (isNil(problemSubmissionsData)) {
                return;
            }

            setSubmissions(problemSubmissionsData);
            setSubmissionResultsToGetParameters(null);
        },
        [ problemSubmissionsData ],
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

    const value = {
        state: { submissions },
        actions: { getSubmissions },
    };

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
