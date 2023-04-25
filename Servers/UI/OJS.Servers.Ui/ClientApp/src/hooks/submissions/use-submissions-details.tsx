import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE, FileType } from '../../common/constants';
import {
    IDownloadSubmissionFileUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
} from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { IErrorDataType, useHttp } from '../use-http';
import { useLoading } from '../use-loading';
import { useUrls } from '../use-urls';

import {
    ISubmissionDetails,
    ISubmissionDetailsType,
    ISubmissionType,
    ITestRunType,
} from './types';

interface ISubmissionsDetailsContext {
    state: {
        currentSubmission: ISubmissionDetailsType | null;
        currentSubmissionDetailsResults: ISubmissionDetails[];
        validationErrors: IErrorDataType[];
        downloadErrorMessage: string | null;
    };
    actions: {
        selectSubmissionById: (submissionId: number) => void;
        getDetails: (submissionId: number) => Promise<void>;
        getSubmissionDetailsResults: (submissionId: number, isOfficial: boolean) => Promise<void>;
        downloadProblemSubmissionFile: (submissionId: number) => Promise<void>;
        setDownloadErrorMessage: (message: string | null) => void;
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
    const { startLoading, stopLoading } = useLoading();
    const [ currentSubmissionId, selectSubmissionById ] = useState<number>();
    const [ validationErrors, setValidationErrors ] = useState<IErrorDataType[]>(defaultState.state.validationErrors);
    const [
        currentSubmission,
        setCurrentSubmission,
    ] = useState<ISubmissionDetailsType | null>(null);
    const [ downloadErrorMessage, setDownloadErrorMessage ] = useState<string | null>(null);
    const [ problemSubmissionFileIdToDownload, setProblemSubmissionFileIdToDownload ] = useState<number | null>(null);
    const { getSubmissionFileDownloadUrl } = useUrls();

    const [
        currentSubmissionDetailsResults,
        setCurrentProblemSubmissionResults,
    ] = useState(defaultState.state.currentSubmissionDetailsResults);

    const {
        getSubmissionDetailsByIdUrl,
        getSubmissionDetailsResultsUrl,
    } = useUrls();

    const [
        getSubmissionDetailsByIdParams,
        setGetSubmissionDetailsByIdParams,
    ] = useState<IGetSubmissionDetailsByIdUrlParams | null>(null);

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
        get: getSubmissionDetailsResultsRequest,
        data: apiSubmissionDetailsResults,
        error: apiSubmissionDetailsResultsError,
    } = useHttp<IGetSubmissionDetailsByIdUrlParams, ISubmissionDetails[]>({
        url: getSubmissionDetailsResultsUrl,
        parameters: submissionDetailsResultsUrlParams,
    });

    const getSubmissionDetailsResults = useCallback(
        async (submissionId: number, isOfficial: boolean) => {
            if (isNil(submissionId)) {
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
            startLoading();
            await downloadSubmissionFile(FileType.Blob);
            stopLoading();
        })();

        setProblemSubmissionFileIdToDownload(null);
    }, [ problemSubmissionFileIdToDownload, downloadSubmissionFile, startLoading, stopLoading ]);

    const getSubmissionResults = useCallback(
        async (problemId: number, isOfficial: boolean) => {
            if (isNil(problemId)) {
                return;
            }

            setSubmissionDetailsResultsUrlParams({
                submissionId,
                isOfficial,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            });
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(submissionDetailsResultsUrlParams)) {
                return;
            }

            (async () => {
                startLoading();
                await getSubmissionDetailsResultsRequest();
                setSubmissionDetailsResultsUrlParams(null);
                stopLoading();
            })();
        },
        [ getSubmissionDetailsResultsRequest, startLoading, stopLoading, submissionDetailsResultsUrlParams ],
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

            setCurrentProblemSubmissionResults(apiSubmissionDetailsResults);
        },
        [ apiSubmissionDetailsResults, apiSubmissionDetailsResultsError ],
    );

    useEffect(
        () => {
            if (isNil(getSubmissionDetailsByIdParams)) {
                return;
            }

            (async () => {
                startLoading();
                await getSubmissionDetails();
                stopLoading();
            })();
        },
        [ getSubmissionDetails, getSubmissionDetailsByIdParams, startLoading, stopLoading ],
    );

    const getDetails = useCallback(
        async (submissionId: number) => {
            if (isNil(submissionId) || Number.isNaN(submissionId)) {
                return;
            }

            setGetSubmissionDetailsByIdParams({ submissionId } as IGetSubmissionDetailsByIdUrlParams);
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
                validationErrors,
                downloadErrorMessage,
            },
            actions: {
                selectSubmissionById,
                getDetails,
                getSubmissionDetailsResults,
                downloadProblemSubmissionFile,
                setDownloadErrorMessage,
            },
        }),
        [
            currentSubmissionDetailsResults,
            currentSubmission,
            getDetails,
            getSubmissionDetailsResults,
            validationErrors,
            downloadProblemSubmissionFile,
            downloadErrorMessage,
            setDownloadErrorMessage,
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
