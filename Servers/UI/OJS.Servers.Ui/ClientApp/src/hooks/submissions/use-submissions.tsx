import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import first from 'lodash/first';
import isNil from 'lodash/isNil';

import { IDictionary } from '../../common/common-types';
import { ISubmissionTypeType } from '../../common/types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
    getSubmitFileUrl,
    getSubmitUrl,
} from '../../utils/urls';
import { useCurrentContest } from '../use-current-contest';
import { IErrorDataType, useHttp } from '../use-http';
import { useProblems } from '../use-problems';

import { useProblemSubmissions } from './use-problem-submissions';

interface ISubmissionsContext {
    state: {
        problemSubmissionCode: IDictionary<string | File>;
        selectedSubmissionType: ISubmissionTypeType | null;
        problemSubmissionErrors: IDictionary<IErrorDataType | null>;
        alertBoxErrorIsClosed: boolean;
    };
    actions: {
        submit: () => Promise<void>;
        updateSubmissionCode: (code: string | File) => void;
        selectSubmissionTypeById: (id: number) => void;
        removeProblemSubmissionCode: (id: number) => void;
        closeErrorMessage: (value: string) => void;
        setProblemSubmissionError: (error: IErrorDataType) => void;
    };
}

const defaultState = {
    state: {
        problemSubmissionCode: {},
        selectedSubmissionType: null,
        problemSubmissionErrors: {},
        alertBoxErrorIsClosed: false,
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
    const [ isLoading, setIsLoading ] = useState(false);
    const [ selectedSubmissionType, setSelectedSubmissionType ] =
        useState<ISubmissionTypeType | null>(defaultState.state.selectedSubmissionType);
    const [ problemSubmissionCode, setProblemSubmissionCode ] =
        useState<IDictionary<string | File>>(defaultState.state.problemSubmissionCode);
    const [ problemSubmissionErrors, setProblemSubmissionErrors ] =
        useState<IDictionary<IErrorDataType | null>>(defaultState.state.problemSubmissionErrors);
    const [ alertBoxErrorIsClosed, setAlertBoxErrorIsClosed ] = useState<boolean>(defaultState.state.alertBoxErrorIsClosed);

    const { state: { currentProblem } } = useProblems();
    const { state: { isOfficial } } = useCurrentContest();
    const { actions: { loadSubmissions, changeProblemSubmissionsPage } } = useProblemSubmissions();
    const { actions: { loadParticipantScores } } = useCurrentContest();

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
        error: errorSubmitCode,
    } = useHttp<null, null, ISubmitCodeTypeParametersType>({ url: getSubmitUrl });

    const {
        post: submitFileCode,
        error: errorSubmitFile,
    } = useHttp<null, null, FormData>({
        url: getSubmitFileUrl,
        bodyAsFormData: true,
    });

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

    const getErrorProblemId = useCallback(
        (error: IErrorDataType) => {
            const { extensions: { Data: problemId } } = error;
            const problemIdObject = JSON.parse(problemId as unknown as string);

            return Object.values(problemIdObject)[0];
        },
        [],
    );

    const resetProblemSubmissionError = useCallback(
        () => {
            const { id: currentProblemId } = currentProblem || {};
            if (isNil(currentProblemId)) {
                return;
            }

            const problemSubmissionErrorsArrayValues = Object.values(problemSubmissionErrors).filter((x) => {
                if (isNil(x)) {
                    return false;
                }

                return currentProblemId.toString() !== getErrorProblemId(x);
            });

            const newProblemSubmissionErrors = Object.assign({}, ...problemSubmissionErrorsArrayValues.map((x) => {
                if (isNil(x)) {
                    return null;
                }

                return { [getErrorProblemId(x) as unknown as string]: x };
            }));

            setProblemSubmissionErrors(newProblemSubmissionErrors);
        },
        [ currentProblem, problemSubmissionErrors, getErrorProblemId ],
    );

    const submit = useCallback(
        async () => {
            if (isNil(submitCodeParams)) {
                return;
            }

            setIsLoading(true);

            if (selectedSubmissionType?.allowBinaryFilesUpload) {
                await submitFileCode(await getSubmitParamsAsFormData());
            } else {
                await submitCode(submitCodeParams);
            }

            setIsLoading(false);
            setAlertBoxErrorIsClosed(false);
            resetProblemSubmissionError();

            if (!isNil(currentProblem)) {
                const { id } = currentProblem;
                loadSubmissions(id, 1);
                loadParticipantScores();
                changeProblemSubmissionsPage(1);
            }
        },
        [
            selectedSubmissionType,
            submitFileCode,
            getSubmitParamsAsFormData,
            submitCode,
            submitCodeParams,
            resetProblemSubmissionError,
            currentProblem,
            loadSubmissions,
            loadParticipantScores,
            changeProblemSubmissionsPage,
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

    const closeErrorMessage = useCallback(
        (problemId: string) => {
            if (isNil(problemSubmissionErrors[problemId])) {
                return;
            }

            setProblemSubmissionErrors({
                ...problemSubmissionErrors,
                [problemId]: null,
            });
            setAlertBoxErrorIsClosed(true);
        },
        [ problemSubmissionErrors ],
    );

    const setProblemSubmissionError = useCallback(
        (error: IErrorDataType) => {
            const problemId = getErrorProblemId(error);
            const closedErrorMessageSubmissionProblemId = Object.keys(problemSubmissionErrors)
                .find((x) => x === problemId as unknown as string);

            if (problemSubmissionErrors[problemId as unknown as string] !== error && isNil(closedErrorMessageSubmissionProblemId)) {
                setProblemSubmissionErrors({
                    ...problemSubmissionErrors,
                    [problemId as unknown as string]: error,
                });
            }
        },
        [ problemSubmissionErrors, getErrorProblemId ],
    );

    useEffect(
        () => {
            if (!isNil(errorSubmitCode)) {
                setProblemSubmissionError(errorSubmitCode);
            }

            if (!isNil(errorSubmitFile)) {
                setProblemSubmissionError(errorSubmitFile);
            }
        },
        [
            errorSubmitCode,
            errorSubmitFile,
            setProblemSubmissionError,
            problemSubmissionErrors,
        ],
    );

    const value = useMemo(
        () => ({
            state: {
                problemSubmissionCode,
                selectedSubmissionType,
                problemSubmissionErrors,
                isLoading,
                alertBoxErrorIsClosed,
            },
            actions: {
                updateSubmissionCode,
                selectSubmissionTypeById,
                submit,
                removeProblemSubmissionCode,
                closeErrorMessage,
                setProblemSubmissionError,
            },
        }),
        [
            selectSubmissionTypeById,
            selectedSubmissionType,
            problemSubmissionCode,
            submit,
            updateSubmissionCode,
            removeProblemSubmissionCode,
            closeErrorMessage,
            problemSubmissionErrors,
            isLoading,
            alertBoxErrorIsClosed,
            setProblemSubmissionError,
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

export default SubmissionsProvider;
