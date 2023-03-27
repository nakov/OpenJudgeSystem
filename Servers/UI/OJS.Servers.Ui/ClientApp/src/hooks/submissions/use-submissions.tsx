import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import first from 'lodash/first';
import isNil from 'lodash/isNil';

import { IDictionary } from '../../common/common-types';
import { ISubmissionTypeType } from '../../common/types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useCurrentContest } from '../use-current-contest';
import { IErrorDataType, useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useProblems } from '../use-problems';
import { useUrls } from '../use-urls';

import { ISubmissionType, ITestRunType } from './types';
import { useProblemSubmissions } from './use-problem-submissions';

interface ISubmissionsContext {
    state: {
        problemSubmissionCode: IDictionary<string | File>;
        selectedSubmissionType: ISubmissionTypeType | null;
        submitMessage: string | null;
        setSubmitMessage: (value: string | null) => void;
        isSubmissionSuccessful: boolean | null;
    };
    actions: {
        submit: () => Promise<void>;
        updateSubmissionCode: (code: string | File) => void;
        selectSubmissionTypeById: (id: number) => void;
        removeProblemSubmissionCode: (id: number) => void;
    };
}

const defaultState = {
    state: {
        problemSubmissionCode: {},
        selectedSubmissionType: null,
    },
};

interface ISubmitCodeTypeParametersType {
    problemId: number;
    submissionTypeId: number;
    content: string | File;
    official: boolean;
}

const SubmissionsContext = createContext<ISubmissionsContext>(defaultState as ISubmissionsContext);

type ISubmissionsProviderProps = IHaveChildrenProps

const SubmissionsProvider = ({ children }: ISubmissionsProviderProps) => {
    const [ selectedSubmissionType, setSelectedSubmissionType ] =
        useState<ISubmissionTypeType | null>(defaultState.state.selectedSubmissionType);
    const [ problemSubmissionCode, setProblemSubmissionCode ] =
        useState<IDictionary<string | File>>(defaultState.state.problemSubmissionCode);
    const [ submitMessage, setSubmitMessage ] = useState<string | null>(null);

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const { state: { currentProblem } } = useProblems();
    const { actions: { loadSubmissions } } = useProblemSubmissions();
    const { state: { isOfficial } } = useCurrentContest();

    const { getSubmitUrl, getSubmitFileUrl } = useUrls();

    const submitCodeParams = useMemo(() => {
        const { id: problemId } = currentProblem || {};

        if (isNil(problemId)) {
            return null;
        }

        return {
            problemId,
            submissionTypeId: selectedSubmissionType?.id,
            content: problemSubmissionCode[problemId.toString()],
            official: isOfficial,
        } as ISubmitCodeTypeParametersType;
    }, [ currentProblem, isOfficial, selectedSubmissionType, problemSubmissionCode ]);

    const {
        post: submitCode,
        isSuccess,
        error: errorSubmitCode,
    } = useHttp<null, null, ISubmitCodeTypeParametersType>({ url: getSubmitUrl });

    const {
        post: submitFileCode,
        error: errorSubmitFile,
    } = useHttp<null, null, FormData>({
        url: getSubmitFileUrl,
        bodyAsFormData: true,
    });

    const isSubmissionSuccessful = useMemo(() => isSuccess, [ isSuccess ]);

    const getSubmitParamsAsFormData = useCallback(async () => {
        const bodyFormData = new FormData();

        if (isNil(submitCodeParams)) {
            return bodyFormData;
        }

        const {
            content,
            submissionTypeId,
            official,
            problemId,
        } = submitCodeParams;

        await bodyFormData.append('content', content);
        await bodyFormData.append('submissionTypeId', submissionTypeId.toString());
        await bodyFormData.append('official', official.toString());
        await bodyFormData.append('problemId', problemId.toString());

        return bodyFormData;
    }, [ submitCodeParams ]);

    const submit = useCallback(async () => {
        if (isNil(submitCodeParams)) {
            return;
        }

        startLoading();

        if (selectedSubmissionType?.allowBinaryFilesUpload) {
            await submitFileCode(await getSubmitParamsAsFormData());
        } else {
            await submitCode(submitCodeParams);
        }

        stopLoading();
    }, [ startLoading, selectedSubmissionType, submitFileCode, getSubmitParamsAsFormData, submitCode, submitCodeParams, stopLoading ]);

    const selectSubmissionTypeById = useCallback(
        (id: number | null) => {
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

    const updateSubmissionCode = useCallback(
        (code: string | File) => {
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return;
            }
            setProblemSubmissionCode({
                ...problemSubmissionCode,
                [problemId]: code,
            });
        },
        [ currentProblem, problemSubmissionCode ],
    );

    const removeProblemSubmissionCode = useCallback(
        (problemId: number) => {
            if (!isNil(problemSubmissionCode[problemId])) {
                setProblemSubmissionCode({
                    ...problemSubmissionCode,
                    [problemId]: '',
                });
            }
        },
        [ problemSubmissionCode ],
    );

    useEffect(
        () => {
            const { allowedSubmissionTypes } = currentProblem || {};
            const submissionType = allowedSubmissionTypes?.find((st) => st.id === selectedSubmissionType?.id);

            const { id } = submissionType || first(allowedSubmissionTypes) || { id: null };
            selectSubmissionTypeById(id);
        },
        [ currentProblem, selectSubmissionTypeById, selectedSubmissionType ],
    );

    const getProblemSubmissionError = useCallback(
        (error: IErrorDataType) => {
            const { detail, instance: problemId } = error;
            const problemErrorId = parseInt(problemId, 10);
            if (isNil(currentProblem)) {
                return null;
            }

            if (problemErrorId === currentProblem.id) {
                return detail;
            }
            return null;
        },
        [ currentProblem ],
    );

    useEffect(
        () => {
            if (!isNil(errorSubmitCode)) {
                const error = getProblemSubmissionError(errorSubmitCode);
                setSubmitMessage(error);
                return;
            }

            if (!isNil(errorSubmitFile)) {
                const error = getProblemSubmissionError(errorSubmitFile);
                setSubmitMessage(error);
                return;
            }
            const { id: problemId } = currentProblem || {};

            if (isNil(problemId)) {
                return;
            }

            (async () => {
                await loadSubmissions(problemId);
            })();
        },
        [
            loadSubmissions,
            errorSubmitCode,
            errorSubmitFile,
            currentProblem,
            getProblemSubmissionError,
        ],
    );

    const value = useMemo(
        () => ({
            state: {
                problemSubmissionCode,
                selectedSubmissionType,
                submitMessage,
                setSubmitMessage,
                isSubmissionSuccessful,
            },
            actions: {
                updateSubmissionCode,
                selectSubmissionTypeById,
                submit,
                removeProblemSubmissionCode,
            },
        }),
        [
            selectSubmissionTypeById,
            selectedSubmissionType,
            problemSubmissionCode,
            submit,
            submitMessage,
            setSubmitMessage,
            isSubmissionSuccessful,
            updateSubmissionCode,
            removeProblemSubmissionCode,
        ],
    );

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
