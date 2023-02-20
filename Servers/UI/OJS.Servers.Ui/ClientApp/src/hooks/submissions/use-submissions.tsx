import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import first from 'lodash/first';
import isNil from 'lodash/isNil';

import { ISubmissionTypeType } from '../../common/types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useCurrentContest } from '../use-current-contest';
import { useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useProblems } from '../use-problems';
import { useUrls } from '../use-urls';

import { ISubmissionType, ITestRunType } from './types';
import { useProblemSubmissions } from './use-problem-submissions';

interface ISubmissionsContext {
    state: {
        submissionCode: string | Blob;
        selectedSubmissionType: ISubmissionTypeType | null;
        submitMessage: string | null;
        setSubmitMessage: (value: string | null) => void;
        isSubmissionSuccessful: boolean | null;
    };
    actions: {
        submit: () => Promise<void>;
        updateSubmissionCode: (code: string | Blob) => void;
        selectSubmissionTypeById: (id: number) => void;
    };
}

const defaultState = {
    state: {
        submissionCode: '',
        selectedSubmissionType: null,
    },
};

interface ISubmitCodeTypeParametersType {
    problemId: number;
    submissionTypeId: number;
    content: string | Blob;
    official: boolean;
}

const SubmissionsContext = createContext<ISubmissionsContext>(defaultState as ISubmissionsContext);

type ISubmissionsProviderProps = IHaveChildrenProps

const SubmissionsProvider = ({ children }: ISubmissionsProviderProps) => {
    const [ selectedSubmissionType, setSelectedSubmissionType ] =
        useState<ISubmissionTypeType | null>(defaultState.state.selectedSubmissionType);
    const [ submissionCode, setSubmissionCode ] = useState<string | Blob>(defaultState.state.submissionCode);
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

        return {
            problemId,
            submissionTypeId: selectedSubmissionType?.id,
            content: submissionCode,
            official: isOfficial,
        } as ISubmitCodeTypeParametersType;
    }, [ currentProblem, isOfficial, selectedSubmissionType, submissionCode ]);

    const {
        post: submitCode,
        error,
        isSuccess: isSuccessCodeSubmit,
    } = useHttp<null, null, ISubmitCodeTypeParametersType>({ url: getSubmitUrl });

    const {
        post: submitFileCode,
        error: errorSubmitFile,
        isSuccess: isSuccessFileSubmit,
    } = useHttp<null, null, FormData>({
        url: getSubmitFileUrl,
        bodyAsFormData: true,
    });

    const isSubmissionSuccessful = useMemo(
        () => isSuccessCodeSubmit || isSuccessFileSubmit,
        [ isSuccessCodeSubmit, isSuccessFileSubmit ],
    );

    useEffect(() => {
        console.log(`isSubmissionSuccessful ${isSubmissionSuccessful}`);
    }, [ isSubmissionSuccessful ]);

    useEffect(() => {
        console.log(`isSuccessFileSubmit ${isSuccessFileSubmit}`);
    }, [ isSuccessFileSubmit ]);

    const getSubmitParamsAsFormData = useCallback(async () => {
        const bodyFormData = new FormData();

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
        (code: string | Blob) => {
            setSubmissionCode(code);

            if (!isNil(currentProblem)) {
                currentProblem.codeEditorCode = code;
            }
        },
        [ currentProblem ],
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

    useEffect(
        () => {
            if (!isNil(error)) {
                setSubmitMessage(error);
                return;
            }

            if (!isNil(errorSubmitFile)) {
                setSubmitMessage(errorSubmitFile);
                return;
            }

            (async () => {
                await loadSubmissions();
            })();
        },
        [
            error,
            errorSubmitFile,
            loadSubmissions,
        ],
    );

    const value = useMemo(
        () => ({
            state: {
                submissionCode,
                selectedSubmissionType,
                submitMessage,
                setSubmitMessage,
                isSubmissionSuccessful,
            },
            actions: {
                updateSubmissionCode,
                selectSubmissionTypeById,
                submit,
            },
        }),
        [
            selectSubmissionTypeById,
            selectedSubmissionType,
            submissionCode,
            submit,
            submitMessage,
            setSubmitMessage,
            isSubmissionSuccessful,
            updateSubmissionCode,
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
