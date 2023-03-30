import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../common/constants';
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
        currentProblemSubmissionResults: ISubmissionDetails[];
        validationErrors: IErrorDataType[];
    };
    actions: {
        selectSubmissionById: (submissionId: number) => void;
        getDetails: (submissionId: number) => Promise<void>;
        getSubmissionResults: (problemId: number, isOfficial: boolean) => Promise<void>;
        downloadProblemSubmissionFile: (submissionId: number) => Promise<void>;
    };
}

const defaultState = {
    state: {
        currentProblemSubmissionResults: [] as ISubmissionDetails[],
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
    const [ problemSubmissionFileIdToDownload, setProblemSubmissionFileIdToDownload ] = useState<number | null>(null);
    const { getSubmissionFileDownloadUrl } = useUrls();

    const [
        currentProblemSubmissionResults,
        setCurrentProblemSubmissionResults,
    ] = useState(defaultState.state.currentProblemSubmissionResults);

    const {
        getSubmissionDetailsByIdUrl,
        getSubmissionResultsByProblemUrl,
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
        submissionResultsByProblemUrlParams,
        setSubmissionResultsByProblemUrlParams,
    ] = useState<IGetSubmissionResultsByProblemUrlParams | null>();

    const {
        get: getProblemResultsRequest,
        data: apiProblemResults,
        error: apiProblemResultsError,
    } = useHttp<IGetSubmissionResultsByProblemUrlParams, ISubmissionDetails[]>({
        url: getSubmissionResultsByProblemUrl,
        parameters: submissionResultsByProblemUrlParams,
    });

    const {
        get: downloadSubmissionFile,
        response: downloadSubmissionFileResponse,
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

        saveAttachment();
    }, [ downloadSubmissionFileResponse, saveAttachment ]);

    useEffect(() => {
        if (isNil(problemSubmissionFileIdToDownload)) {
            return;
        }

        (async () => {
            startLoading();
            await downloadSubmissionFile('blob');
            stopLoading();
        })();

        setProblemSubmissionFileIdToDownload(null);
    }, [ problemSubmissionFileIdToDownload, downloadSubmissionFile, startLoading, stopLoading ]);

    const getSubmissionResults = useCallback(
        async (problemId: number, isOfficial: boolean) => {
            if (isNil(problemId)) {
                return;
            }

            setSubmissionResultsByProblemUrlParams({
                id: problemId,
                isOfficial,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            });
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(submissionResultsByProblemUrlParams)) {
                return;
            }

            (async () => {
                startLoading();
                await getProblemResultsRequest();
                setSubmissionResultsByProblemUrlParams(null);
                stopLoading();
            })();
        },
        [ getProblemResultsRequest, startLoading, stopLoading, submissionResultsByProblemUrlParams ],
    );

    useEffect(
        () => {
            if (isNil(apiProblemResults)) {
                return;
            }

            if (!isNil(apiProblemResultsError)) {
                setValidationErrors((validationErrorsArray) => [ ...validationErrorsArray, apiProblemResultsError ]);
                return;
            }

            setCurrentProblemSubmissionResults(apiProblemResults);
        },
        [ apiProblemResults, apiProblemResultsError ],
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
                currentProblemSubmissionResults,
                validationErrors,
            },
            actions: {
                selectSubmissionById,
                getDetails,
                getSubmissionResults,
                downloadProblemSubmissionFile,
            },
        }),
        [
            currentProblemSubmissionResults,
            currentSubmission,
            getDetails,
            getSubmissionResults,
            validationErrors,
            downloadProblemSubmissionFile,
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
