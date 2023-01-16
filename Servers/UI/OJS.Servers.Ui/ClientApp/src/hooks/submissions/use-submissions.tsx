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
        isSuccess,
    } = useHttp<null, null, ISubmitCodeTypeParametersType>({ url: getSubmitUrl });

    const {
        post: submitFileCode,
        error: errorSubmitFile,
    } = useHttp<null, null, ISubmitCodeTypeParametersType>({
        url: getSubmitFileUrl,
        bodyAsFormData: true,
    });

    const isSubmissionSuccessful = useMemo(() => isSuccess, [ isSuccess ]);

    const submit = useCallback(async () => {
        startLoading();

        const submitRequest = selectedSubmissionType?.allowBinaryFilesUpload
            ? submitFileCode
            : submitCode;

        await submitRequest(submitCodeParams);
        stopLoading();
    }, [ startLoading, selectedSubmissionType?.allowBinaryFilesUpload,
        submitFileCode, submitCode, submitCodeParams, stopLoading ]);

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

    const updateSubmissionCode = (code: string | Blob) => {
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
            if (!isNil(error) || !isNil(errorSubmitFile)) {
                setSubmitMessage(error);
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

    // useEffect(() => {
    //     console.log('submission code state');
    //     console.log(submissionCode);
    // }, [ submissionCode ]);

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
