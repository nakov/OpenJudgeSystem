import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { first } from 'lodash';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { useCurrentContest } from '../use-current-contest';
import { useProblems } from '../use-problems';
import { useProblemSubmissions } from './use-problem-submissions';
import { useUrls } from '../use-urls';
import { ISubmissionTypeType } from '../../common/types';
import { ITestRunType, ISubmissionType } from './types';
import { IHaveChildrenProps } from '../../components/common/Props';

interface ISubmissionsContext {
    state: {
        submissionCode: string;
        selectedSubmissionType: ISubmissionTypeType | null;
    };
    actions: {
        submitCode: () => Promise<void>
        updateSubmissionCode: (code: string) => void;
        selectSubmissionTypeById: (id: number) => void;
    };
}

const defaultState = {
    state: {
        submissionCode: `
function hello() {
    alert('Hello world!');
}
`,
        selectedSubmissionType: null,
    },
};

const SubmissionsContext = createContext<ISubmissionsContext>(defaultState as ISubmissionsContext);

interface ISubmissionsProviderProps extends IHaveChildrenProps {
}

const SubmissionsProvider = ({ children }: ISubmissionsProviderProps) => {
    const [ selectedSubmissionType, setSelectedSubmissionType ] =
        useState<ISubmissionTypeType | null>(defaultState.state.selectedSubmissionType);
    const [ submissionCode, setSubmissionCode ] = useState<string>(defaultState.state.submissionCode);

    const { submitUrl } = useUrls();

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const { state: { currentProblem } } = useProblems();
    const { actions: { getSubmissions } } = useProblemSubmissions();
    const { state: { isOfficial } } = useCurrentContest();

    const {
        post: postApiSubmitCode,
        data: apiSubmitCodeResult,
    } = useHttp(submitUrl);

    const submitCode = useCallback(async () => {
        startLoading();
        const { id } = selectedSubmissionType || {};
        const { id: problemId } = currentProblem || {};
        await postApiSubmitCode({
            ProblemId: problemId,
            SubmissionTypeId: id,
            Content: submissionCode,
            Official: isOfficial,
        });
        stopLoading();
    }, [ startLoading, selectedSubmissionType, postApiSubmitCode, currentProblem, submissionCode, isOfficial, stopLoading ]);

    const selectSubmissionTypeById = useCallback(
        (id) => {
            const { allowedSubmissionTypes } = currentProblem || {};
            if (allowedSubmissionTypes == null) {
                return;
            }
            const newSubmissionType = allowedSubmissionTypes.find((st) => st.id === id);
            if (!newSubmissionType) {
                return;
            }
            setSelectedSubmissionType(newSubmissionType);
        },
        [ currentProblem ],
    );

    const updateSubmissionCode = (code: string) => {
        setSubmissionCode(code);
    };

    useEffect(
        () => {
            const { allowedSubmissionTypes } = currentProblem || {};
            const submissionType = first(allowedSubmissionTypes);
            if (submissionType) {
                const { id } = submissionType;
                selectSubmissionTypeById(id);
            } else {
                selectSubmissionTypeById(null);
            }
        },
        [ currentProblem, selectSubmissionTypeById ],
    );

    useEffect(
        () => {
            (async () => {
                await getSubmissions();
            })();
        },
        [ getSubmissions, apiSubmitCodeResult ],
    );

    const value = {
        state: {
            submissionCode,
            selectedSubmissionType,
        },
        actions: {
            updateSubmissionCode,
            selectSubmissionTypeById,
            submitCode,
        },
    };

    return (
        <SubmissionsContext.Provider value={value}>
            {children}
        </SubmissionsContext.Provider>
    );
};

const useSubmissions = () => useContext(SubmissionsContext);

export {
    useSubmissions,
};

export type { ISubmissionType, ITestRunType };

export default SubmissionsProvider;
