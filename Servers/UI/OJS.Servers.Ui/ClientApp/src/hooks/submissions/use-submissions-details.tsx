import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { ISubmissionDetailsUrlParams } from '../../common/app-url-types';
import { FileType } from '../../common/constants';
import { IPagedResultType } from '../../common/types';
import {
    IDownloadSubmissionFileUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
} from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
    getSubmissionDetailsUrl,
    getSubmissionFileDownloadUrl,
    getSubmissionResultsUrl,
} from '../../utils/urls';
import { IErrorDataType, useHttp } from '../use-http';
import { usePages } from '../use-pages';

import {
    ISubmissionDetailsType,
    ISubmissionResults,
    ISubmissionType,
    ITestRunType,
} from './types';
import { useProblemSubmissions } from './use-problem-submissions';

interface ISubmissionsDetailsContext {
    state: {
        currentSubmission: ISubmissionDetailsType | null;
        currentSubmissionResults: ISubmissionResults[];
        validationErrors: IErrorDataType[];
        downloadErrorMessage: string | null;
        isLoading: boolean;
    };
    actions: {
        selectSubmissionById: (submissionId: number | null) => void;
        getResults: (submissionId: number, page: number) => void;
        downloadProblemSubmissionFile: (submissionId: number) => Promise<void>;
        setDownloadErrorMessage: (message: string | null) => void;
        setCurrentSubmission: (submission: ISubmissionDetailsType | null) => void;
        setSubmissionResultsUrlParams: (params: IGetSubmissionDetailsByIdUrlParams | null) => void;
    };
}

const defaultState = {
    state: {
        currentSubmissionResults: [] as ISubmissionResults[],
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

    const [ currentSubmissionResults,
        setCurrentSubmissionResults,
    ] = useState(defaultState.state.currentSubmissionResults);

    const [
        submissionDetailsUrlParams,
        setSubmissionDetailsUrlParams,
    ] = useState<ISubmissionDetailsUrlParams | null>();

    const [
        submissionResultsUrlParams,
        setSubmissionResultsUrlParams,
    ] = useState<IGetSubmissionDetailsByIdUrlParams | null>();

    const { state: { problemSubmissionsPage } } = useProblemSubmissions();
    const { populatePageInformation } = usePages();

    const {
        isLoading: submissionDetailsLoading,
        get: getSubmissionDetailsRequest,
        data: apiSubmissionDetailsData,
        error: submissionDetailsError,
    } = useHttp<ISubmissionDetailsUrlParams, ISubmissionDetailsType>({
        url: getSubmissionDetailsUrl,
        parameters: submissionDetailsUrlParams,
    });

    const {
        get: getSubmissionsResultsRequest,
        data: apiSubmissionsResultsData,
    } = useHttp<IGetSubmissionDetailsByIdUrlParams, IPagedResultType<ISubmissionResults>>({
        url: getSubmissionResultsUrl,
        parameters: submissionResultsUrlParams,
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

    useEffect(
        () => {
            if (isNil(problemSubmissionFileIdToDownload)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await downloadSubmissionFile(FileType.Blob);
                setIsLoading(false);
            })();

            setProblemSubmissionFileIdToDownload(null);
        },
        [ problemSubmissionFileIdToDownload, downloadSubmissionFile ],
    );

    useEffect(
        () => {
            if (isNil(submissionDetailsUrlParams)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getSubmissionDetailsRequest();
                setIsLoading(false);
            })();
        },
        [ getSubmissionDetailsRequest, submissionDetailsUrlParams ],
    );

    useEffect(
        () => {
            if (isNil(submissionResultsUrlParams)) {
                return;
            }

            (async () => {
                await getSubmissionsResultsRequest();
            })();
        },
        [ getSubmissionsResultsRequest, submissionResultsUrlParams ],
    );

    useEffect(
        () => {
            if (isNil(apiSubmissionDetailsData)) {
                return;
            }

            if (!isNil(submissionDetailsError)) {
                setValidationErrors((validationErrorsArray) => [ ...validationErrorsArray, submissionDetailsError ]);
                return;
            }

            setCurrentSubmission(apiSubmissionDetailsData);
        },
        [ apiSubmissionDetailsData, apiSubmissionsResultsData, submissionDetailsError ],
    );

    useEffect(
        () => {
            if (isNil(apiSubmissionsResultsData)) {
                return;
            }

            const newSubmissionsResultsData = apiSubmissionsResultsData as IPagedResultType<ISubmissionResults>;

            const submissionDetailsResult = newSubmissionsResultsData.items as ISubmissionResults[];

            const {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            } = newSubmissionsResultsData || {};

            const newPagesInfo = {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            };

            populatePageInformation(newPagesInfo);
            setCurrentSubmissionResults(submissionDetailsResult);
        },
        [ apiSubmissionsResultsData, populatePageInformation ],
    );

    const getDetails = useCallback(
        async (submissionId: number) => {
            setSubmissionDetailsUrlParams({ submissionId });
        },
        [],
    );

    const getResults = useCallback(
        (submissionId: number, page: number) => {
            setSubmissionResultsUrlParams({
                submissionId,
                page,
            });
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(currentSubmissionId) || Number.isNaN(currentSubmissionId)) {
                return;
            }
            (async () => {
                await getDetails(currentSubmissionId);
            })();
        },
        [ currentSubmissionId, getDetails ],
    );

    useEffect(
        () => {
            if (isNil(currentSubmissionId) || Number.isNaN(currentSubmissionId) || !isNil(submissionResultsUrlParams)) {
                return;
            }

            getResults(currentSubmissionId, problemSubmissionsPage);
        },
        [ currentSubmissionId, getResults, problemSubmissionsPage, submissionResultsUrlParams ],
    );

    const value = useMemo(
        () => ({
            state: {
                currentSubmission,
                currentSubmissionResults,
                submissionDetailsLoading,
                validationErrors,
                downloadErrorMessage,
                isLoading,
            },
            actions: {
                selectSubmissionById,
                getResults,
                downloadProblemSubmissionFile,
                setDownloadErrorMessage,
                setCurrentSubmission,
                setSubmissionResultsUrlParams,
            },
        }),
        [
            currentSubmissionResults,
            currentSubmission,
            getResults,
            validationErrors,
            downloadProblemSubmissionFile,
            downloadErrorMessage,
            setDownloadErrorMessage,
            setCurrentSubmission,
            isLoading,
            submissionDetailsLoading,
            setSubmissionResultsUrlParams,
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
