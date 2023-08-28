import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IPagedResultType, ISubmissionResponseModel } from '../../common/types';
import { IGetSubmissionsUrlParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
    getPendingSubmissionsUrl,
    getPublicSubmissionsUrl,
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl, getUnprocessedSubmissionsUrl,
} from '../../utils/urls';
import { useHttp } from '../use-http';
import { usePages } from '../use-pages';

enum PublicSubmissionState {
    Ready = 1,
    Processing = 2,
    Queued = 3,
}

interface IPublicSubmissionsContext {
    state: {
        totalSubmissionsCount: number;
        totalUnprocessedSubmissionsCount: number;
        publicSubmissions: ISubmissionResponseModel[];
        unprocessedSubmissions: ISubmissionResponseModel[];
        pendingSubmissions: ISubmissionResponseModel[];
    };
    actions : {
        loadTotalSubmissionsCount: () => Promise<void>;
        loadTotalUnprocessedSubmissionsCount: () => Promise<void>;
        initiatePublicSubmissionsQuery: () => void;
        initiateUnprocessedSubmissionsQuery: () => void;
        initiatePendingSubmissionsQuery: () => void;
    };
}

const defaultState = { state: { publicSubmissions: [] as ISubmissionResponseModel[] } };

const PublicSubmissionsContext = createContext<IPublicSubmissionsContext>(defaultState as IPublicSubmissionsContext);

type IPublicSubmissionsProviderProps = IHaveChildrenProps

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
    const [ getPublicSubmissionsUrlParams, setPublicSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ getUnprocessedSubmissionsUrlParams, setUnprocessedSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ getPendingSubmissionsUrlParams, setPendingSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ publicSubmissions, setPublicSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ unprocessedSubmissions, setUnprocessedSubmissions ] =
        useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ pendingSubmissions, setPendingSubmissions ] =
        useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ previousPage, setPreviousPage ] = useState(0);

    const {
        state: { currentPage },
        populatePageInformation,
    } = usePages();

    const {
        get: getSubmissions,
        data: publicSubmissionsData,
    } = useHttp<
        IGetSubmissionsUrlParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getPublicSubmissionsUrl,
            parameters: getPublicSubmissionsUrlParams,
        });

    const {
        get: getUnprocessedSubmissions,
        data: unprocessedSubmissionsData,
    } = useHttp<
        IGetSubmissionsUrlParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getUnprocessedSubmissionsUrl,
            parameters: getUnprocessedSubmissionsUrlParams,
        });

    const {
        get: getPendingSubmissions,
        data: pendingSubmissionsData,
    } = useHttp<
        IGetSubmissionsUrlParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getPendingSubmissionsUrl,
            parameters: getPendingSubmissionsUrlParams,
        });

    const {
        get: getTotalSubmissionsCount,
        data: apiTotalSubmissionsCount,
    } = useHttp({ url: getSubmissionsTotalCountUrl });

    const totalSubmissionsCount = useMemo(
        () => (apiTotalSubmissionsCount || 0) as number,
        [ apiTotalSubmissionsCount ],
    );

    const {
        get: getTotalUnprocessedSubmissionsCount,
        data: apiTotalUnprocessedSubmissionsCount,
    } = useHttp({ url: getSubmissionsUnprocessedTotalCountUrl });

    const totalUnprocessedSubmissionsCount = useMemo(
        () => (apiTotalUnprocessedSubmissionsCount || 0) as number,
        [ apiTotalUnprocessedSubmissionsCount ],
    );

    const loadPublicSubmissions = useCallback(
        async () => {
            await getSubmissions();
        },
        [ getSubmissions ],
    );

    const loadUnprocessedSubmissions = useCallback(
        async () => {
            await getUnprocessedSubmissions();
        },
        [ getUnprocessedSubmissions ],
    );

    const loadPendingSubmissions = useCallback(
        async () => {
            await getPendingSubmissions();
        },
        [ getPendingSubmissions ],
    );

    const loadTotalSubmissionsCount = useCallback(
        async () => {
            await getTotalSubmissionsCount();
        },
        [ getTotalSubmissionsCount ],
    );

    const loadTotalUnprocessedSubmissionsCount = useCallback(
        async () => {
            await getTotalUnprocessedSubmissionsCount();
        },
        [ getTotalUnprocessedSubmissionsCount ],
    );

    const initiatePublicSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage && currentPage !== 1) {
                return;
            }

            setPublicSubmissionsUrlParams({ page: currentPage });
        },
        [ currentPage, previousPage ],
    );

    const initiateUnprocessedSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage && currentPage !== 1) {
                return;
            }

            setUnprocessedSubmissionsUrlParams({ page: currentPage });
        },
        [ currentPage, previousPage ],
    );

    const initiatePendingSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage && currentPage !== 1) {
                return;
            }

            setPendingSubmissionsUrlParams({ page: currentPage });
        },
        [ currentPage, previousPage ],
    );

    const proccessSubmissionsQueryResult = useCallback((
        queryResult: IPagedResultType<ISubmissionResponseModel>,
        handleSetData: (submissions: ISubmissionResponseModel[]) => void,
    ) => {
        const newSubmissionsData = queryResult.items as ISubmissionResponseModel[];
        const {
            pageNumber,
            itemsPerPage,
            pagesCount,
            totalItemsCount,
        } = queryResult;

        const newPagesInfo = {
            pageNumber,
            itemsPerPage,
            pagesCount,
            totalItemsCount,
        };

        setPreviousPage(pageNumber);

        handleSetData(newSubmissionsData);
        populatePageInformation(newPagesInfo);
    }, [ populatePageInformation ]);

    // Proccess results
    useEffect(
        () => {
            if (isNil(publicSubmissionsData) || isEmpty(publicSubmissionsData)) {
                return;
            }

            proccessSubmissionsQueryResult(publicSubmissionsData, setPublicSubmissions);
        },
        [ populatePageInformation, proccessSubmissionsQueryResult, publicSubmissionsData ],
    );

    useEffect(
        () => {
            if (isNil(unprocessedSubmissionsData) || isEmpty(unprocessedSubmissionsData)) {
                return;
            }

            proccessSubmissionsQueryResult(unprocessedSubmissionsData, setUnprocessedSubmissions);
        },
        [ populatePageInformation, proccessSubmissionsQueryResult, unprocessedSubmissionsData ],
    );

    useEffect(
        () => {
            if (isNil(pendingSubmissionsData) || isEmpty(pendingSubmissionsData)) {
                return;
            }

            proccessSubmissionsQueryResult(pendingSubmissionsData, setPendingSubmissions);
        },
        [ pendingSubmissionsData, populatePageInformation, proccessSubmissionsQueryResult ],
    );

    // Make requests
    useEffect(
        () => {
            if (isNil(getPublicSubmissionsUrlParams)) {
                return;
            }

            (async () => {
                await loadPublicSubmissions();
            })();
        },
        [ getPublicSubmissionsUrlParams, loadPublicSubmissions ],
    );

    useEffect(
        () => {
            if (isNil(getUnprocessedSubmissionsUrlParams)) {
                return;
            }

            (async () => {
                await loadUnprocessedSubmissions();
            })();
        },
        [ getUnprocessedSubmissionsUrlParams, loadUnprocessedSubmissions ],
    );

    useEffect(
        () => {
            if (isNil(getPendingSubmissionsUrlParams)) {
                return;
            }

            (async () => {
                await loadPendingSubmissions();
            })();
        },
        [ getPendingSubmissionsUrlParams, loadPendingSubmissions ],
    );

    const value = useMemo(
        () => ({
            state: {
                publicSubmissions,
                unprocessedSubmissions,
                pendingSubmissions,
                totalSubmissionsCount,
                totalUnprocessedSubmissionsCount,
            },
            actions: {
                loadTotalSubmissionsCount,
                loadTotalUnprocessedSubmissionsCount,
                initiatePublicSubmissionsQuery,
                initiateUnprocessedSubmissionsQuery,
                initiatePendingSubmissionsQuery,
            },
        }),
        [
            publicSubmissions,
            unprocessedSubmissions,
            pendingSubmissions,
            totalSubmissionsCount,
            totalUnprocessedSubmissionsCount,
            loadTotalSubmissionsCount,
            loadTotalUnprocessedSubmissionsCount,
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            initiatePendingSubmissionsQuery,
        ],
    );

    return (
        <PublicSubmissionsContext.Provider value={value}>
            {children}
        </PublicSubmissionsContext.Provider>
    );
};

const usePublicSubmissions = () => useContext(PublicSubmissionsContext);

export default PublicSubmissionsProvider;

export {
    usePublicSubmissions,
    PublicSubmissionState,
};

export type {
    ISubmissionResponseModel,
};
