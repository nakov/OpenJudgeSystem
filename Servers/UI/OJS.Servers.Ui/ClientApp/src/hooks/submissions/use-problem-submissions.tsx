import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useProblems } from '../use-problems';
import { ISubmissionDetails } from './types';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { getSubmissionResultsByProblem } from '../../utils/urls';
import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
import { useCurrentContest } from '../use-current-contest';

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

const defaultState = { state: { submissions: [] as ISubmissionDetails[] } };

const ProblemSubmissionsContext = createContext<IProblemSubmissionsContext>(defaultState as IProblemSubmissionsContext);

const ProblemSubmissionsProvider = ({ children }: IProblemSubmissionsProviderProps) => {
    const [ submissions, setSubmissions ] = useState(defaultState.state.submissions);
    const { state: { currentProblem } } = useProblems();

    const { state: { isOfficial } } = useCurrentContest();

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        get: getApiProblemSubmissions,
        data: apiProblemSubmissions,
    } = useHttp(getSubmissionResultsByProblem);

    const getSubmissions = useCallback(async () => {
        const { id } = currentProblem || {};
        if (id) {
            startLoading();
            await getApiProblemSubmissions({
                id,
                isOfficial,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            });
            stopLoading();
        }
    }, [ currentProblem, getApiProblemSubmissions, isOfficial, startLoading, stopLoading ]);

    useEffect(
        () => {
            if (apiProblemSubmissions != null) {
                setSubmissions(apiProblemSubmissions);
            }
        },
        [ apiProblemSubmissions ],
    );

    useEffect(
        () => {
            (async () => {
                await getSubmissions();
            })();
        },
        [ getSubmissions, currentProblem ],
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
