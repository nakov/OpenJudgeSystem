import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE, FileType } from '../../common/constants';
import {
    IDownloadSubmissionFileUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
} from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
    getSubmissionDetailsByIdUrl,
    getSubmissionDetailsResultsUrl,
    getSubmissionFileDownloadUrl,
} from '../../utils/urls';
import { IErrorDataType, useHttp } from '../use-http';

import {
    ISubmissionDetails,
    ISubmissionDetailsType,
    ISubmissionDetailsWithResults,
    ISubmissionType,
    ITestRunType,
} from './types';

interface ISubmissionsDetailsContext {
    state: {
        currentSubmission: ISubmissionDetailsType | null;
        currentSubmissionDetailsResults: ISubmissionDetails[];
        validationErrors: IErrorDataType[];
        downloadErrorMessage: string | null;
        isLoading: boolean;
    };
    actions: {
        selectSubmissionById: (submissionId: number | null) => void;
        getDetails: (submissionId: number) => Promise<void>;
        downloadProblemSubmissionFile: (submissionId: number) => Promise<void>;
        setDownloadErrorMessage: (message: string | null) => void;
        setCurrentSubmission: (submission: ISubmissionDetailsType | null) => void;
        setSubmissionDetailsResultsUrlParams: (params: IGetSubmissionDetailsByIdUrlParams) => void;
    };
}

const defaultState = {
    state: {
        currentSubmissionDetailsResults: [] as ISubmissionDetails[],
        validationErrors: [] as IErrorDataType[],
    },
};

const SubmissionsDetailsContext = createContext<ISubmissionsDetailsContext>(defaultState as ISubmissionsDetailsContext);

type ISubmissionsDetailsProviderProps = IHaveChildrenProps

const SubmissionsDetailsProvider = ({ children }: ISubmissionsDetailsProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ currentSubmissionId, selectSubmissionById ] = useState<number | null>();
    const [ validationErrors, setValidationErrors ] = useState<IErrorDataType[]>(defaultState.state.validationErrors);
    const [
        currentSubmission,
        setCurrentSubmission,
    ] = useState<ISubmissionDetailsType | null>(null);
    const [ downloadErrorMessage, setDownloadErrorMessage ] = useState<string | null>(null);
    const [ problemSubmissionFileIdToDownload, setProblemSubmissionFileIdToDownload ] = useState<number | null>(null);

    const [
        currentSubmissionDetailsResults,
        setCurrentProblemSubmissionResults,
    ] = useState(defaultState.state.currentSubmissionDetailsResults);

    const [
        getSubmissionDetailsByIdParams,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setGetSubmissionDetailsByIdParams,
    ] = useState<IGetSubmissionDetailsByIdUrlParams | null>(null);

    // REMOVE
    const {
        get: getSubmissionDetails,
        data: apiSubmissionDetails,
        error: apiSubmissionDetailsError,
    } = useHttp<IGetSubmissionDetailsByIdUrlParams, ISubmissionDetailsType>({
        url: getSubmissionDetailsByIdUrl,
        parameters: getSubmissionDetailsByIdParams,
    });

    const [
        submissionDetailsResultsUrlParams,
        setSubmissionDetailsResultsUrlParams,
    ] = useState<IGetSubmissionDetailsByIdUrlParams | null>();

    const {
        isLoading: submissionDetailsLoading,
        get: getSubmissionDetailsResultsRequest,
        data: apiSubmissionDetailsResults,
        error: apiSubmissionDetailsResultsError,
    } = useHttp<IGetSubmissionDetailsByIdUrlParams, ISubmissionDetailsWithResults>({
        url: getSubmissionDetailsResultsUrl,
        parameters: submissionDetailsResultsUrlParams,
    });

    const {
        get: downloadSubmissionFile,
        response: downloadSubmissionFileResponse,
        error: downloadSubmissionFileError,
        saveAttachment,
    } = useHttp<IDownloadSubmissionFileUrlParams, Blob>({
        url: getSubmissionFileDownloadUrl,
        parameters: { id: problemSubmissionFileIdToDownload },
    });

    const downloadProblemSubmissionFile = useCallback(
        async (submissionId: number) => {
            setProblemSubmissionFileIdToDownload(submissionId);
        },
        [],
    );

    useEffect(() => {
        if (isNil(downloadSubmissionFileResponse)) {
            return;
        }

        if (!isNil(downloadSubmissionFileError)) {
            setDownloadErrorMessage(downloadSubmissionFileError?.detail);
            return;
        }

        saveAttachment();
    }, [ downloadSubmissionFileResponse, saveAttachment, downloadSubmissionFileError ]);

    useEffect(() => {
        if (isNil(problemSubmissionFileIdToDownload)) {
            return;
        }

        (async () => {
            setIsLoading(true);
            await downloadSubmissionFile(FileType.Blob);
            setIsLoading(false);
        })();

        setProblemSubmissionFileIdToDownload(null);
    }, [ problemSubmissionFileIdToDownload, downloadSubmissionFile ]);

    useEffect(
        () => {
            if (isNil(submissionDetailsResultsUrlParams)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getSubmissionDetailsResultsRequest();
                setIsLoading(false);
            })();
        },
        [ getSubmissionDetailsResultsRequest, submissionDetailsResultsUrlParams ],
    );

    useEffect(
        () => {
            if (isNil(apiSubmissionDetailsResults)) {
                return;
            }

            if (!isNil(apiSubmissionDetailsResultsError)) {
                setValidationErrors((validationErrorsArray) => [ ...validationErrorsArray, apiSubmissionDetailsResultsError ]);
                return;
            }

            setCurrentSubmission(apiSubmissionDetailsResults.submissionDetails);
            setCurrentProblemSubmissionResults(apiSubmissionDetailsResults.submissionResults);
        },
        [ apiSubmissionDetailsResults, apiSubmissionDetailsResultsError ],
    );

    useEffect(
        () => {
            if (isNil(getSubmissionDetailsByIdParams)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getSubmissionDetails();
                setIsLoading(false);
            })();
        },
        [ getSubmissionDetails, getSubmissionDetailsByIdParams ],
    );

    const getDetails = useCallback(
        async (submissionId: number) => {
            if (isNil(submissionId) || Number.isNaN(submissionId)) {
                // Will be removed from the code with https://github.com/SoftUni-Internal/exam-systems-issues/issues/937
                // return;
            }

            setSubmissionDetailsResultsUrlParams({
                submissionId,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            });
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(apiSubmissionDetails)) {
                return;
            }

            if (!isNil(apiSubmissionDetailsError)) {
                setValidationErrors((validationErrorsArray) => [ ...validationErrorsArray, apiSubmissionDetailsError ]);
                return;
            }

            setCurrentSubmission(apiSubmissionDetails);
        },
        [ apiSubmissionDetails, apiSubmissionDetailsError ],
    );

    useEffect(
        () => {
            if (isNil(currentSubmissionId)) {
                return;
            }

            (async () => {
                await getDetails(currentSubmissionId);
            })();
        },
        [ currentSubmissionId, getDetails ],
    );

    const value = useMemo(
        () => ({
            state: {
                currentSubmission,
                currentSubmissionDetailsResults,
                submissionDetailsLoading,
                validationErrors,
                downloadErrorMessage,
                isLoading,
            },
            actions: {
                selectSubmissionById,
                getDetails,
                downloadProblemSubmissionFile,
                setDownloadErrorMessage,
                setCurrentSubmission,
                getSubmissionDetailsResultsRequest,
                setSubmissionDetailsResultsUrlParams,
            },
        }),
        [
            currentSubmissionDetailsResults,
            currentSubmission,
            getDetails,
            validationErrors,
            downloadProblemSubmissionFile,
            downloadErrorMessage,
            setDownloadErrorMessage,
            setCurrentSubmission,
            isLoading,
            submissionDetailsLoading,
            getSubmissionDetailsResultsRequest,
            setSubmissionDetailsResultsUrlParams,
        ],
    );

    return (
        <SubmissionsDetailsContext.Provider value={value}>
            {children}
        </SubmissionsDetailsContext.Provider>
    );
};

const useSubmissionsDetails = () => useContext(SubmissionsDetailsContext);

export {
    useSubmissionsDetails,
};

export type { ISubmissionType, ITestRunType };

export default SubmissionsDetailsProvider;
