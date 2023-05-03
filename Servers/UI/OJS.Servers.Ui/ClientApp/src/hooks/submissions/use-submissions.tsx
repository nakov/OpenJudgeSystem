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
        isSubmissionSuccessful: boolean | null;
        problemSubmissionErrors: IDictionary<IErrorDataType | null>;
    };
    actions: {
        submit: () => Promise<void>;
        updateSubmissionCode: (code: string | File) => void;
        selectSubmissionTypeById: (id: number) => void;
        removeProblemSubmissionCode: (id: number) => void;
        closeAlertBoxErrorMessage: (value: string) => void;
    };
}

const defaultState = {
    state: {
        problemSubmissionCode: {},
        selectedSubmissionType: null,
        problemSubmissionErrors: {},
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
    const [ problemSubmissionErrors, setProblemSubmissionErrors ] =
        useState<IDictionary<IErrorDataType | null>>(defaultState.state.problemSubmissionErrors);

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

    const resetProblemSubmissionError = useCallback(
        () => {
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return;
            }

            const problemSubmissionErrorsArrayValues = Object.values(problemSubmissionErrors).filter((x) => {
                if (isNil(x)) {
                    return false;
                }
                const { extensions: { Data: id } } = x;
                return problemId.toString() !== id;
            });

            const newProblemSubmissionErrors =
                Object.assign({}, ...problemSubmissionErrorsArrayValues.map((x) => {
                    if (isNil(x)) {
                        return null;
                    }

                    const { extensions: { Data: id } } = x;

                    return { [id]: x };
                }));
            setProblemSubmissionErrors(newProblemSubmissionErrors);
        },
        [ currentProblem, problemSubmissionErrors ],
    );

    const submit = useCallback(
        async () => {
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

            resetProblemSubmissionError();
        },
        [
            startLoading,
            selectedSubmissionType,
            submitFileCode,
            getSubmitParamsAsFormData,
            submitCode,
            submitCodeParams,
            stopLoading,
            resetProblemSubmissionError,
        ],
    );

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

    const closeAlertBoxErrorMessage = useCallback(
        (problemId: string) => {
            if (isNil(problemSubmissionErrors[problemId])) {
                return;
            }

            setProblemSubmissionErrors({
                ...problemSubmissionErrors,
                [problemId]: null,
            });
        },
        [ problemSubmissionErrors ],
    );

    const setProblemSubmissionError = useCallback(
        (error: IErrorDataType) => {
            const { extensions: { Data: problemId } } = error;
            const closedErrorMessageSubmissionProblemId = Object.keys(problemSubmissionErrors).find((x) => x === problemId);
            if (problemSubmissionErrors[problemId] !== error && isNil(closedErrorMessageSubmissionProblemId)) {
                setProblemSubmissionErrors({
                    ...problemSubmissionErrors,
                    [problemId]: error,
                });
            }
        },
        [ problemSubmissionErrors ],
    );

    useEffect(
        () => {
            if (!isNil(errorSubmitCode)) {
                setProblemSubmissionError(errorSubmitCode);
            }

            if (!isNil(errorSubmitFile)) {
                setProblemSubmissionError(errorSubmitFile);
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
            setProblemSubmissionError,
            problemSubmissionErrors,
        ],
    );

    const value = useMemo(
        () => ({
            state: {
                problemSubmissionCode,
                selectedSubmissionType,
                isSubmissionSuccessful,
                problemSubmissionErrors,
            },
            actions: {
                updateSubmissionCode,
                selectSubmissionTypeById,
                submit,
                removeProblemSubmissionCode,
                closeAlertBoxErrorMessage,
            },
        }),
        [
            selectSubmissionTypeById,
            selectedSubmissionType,
            problemSubmissionCode,
            submit,
            isSubmissionSuccessful,
            updateSubmissionCode,
            removeProblemSubmissionCode,
            closeAlertBoxErrorMessage,
            problemSubmissionErrors,
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
