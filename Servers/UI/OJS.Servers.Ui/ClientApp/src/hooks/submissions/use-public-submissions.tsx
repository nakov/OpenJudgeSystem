import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IPage, IPagedResultType, ISubmissionResponseModel } from '../../common/types';
import { IGetSubmissionsByContestIdParams, IGetSubmissionsUrlParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
    getPendingSubmissionsUrl,
    getPublicSubmissionsUrl,
    getSubmissionsByContestIdUrl,
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl, getUnprocessedSubmissionsUrl, getUserSubmissionsUrl,
} from '../../utils/urls';
import { useUrlParams } from '../common/use-url-params';
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
        userSubmissions: ISubmissionResponseModel[];
        userSubmissionsLoading: boolean;
        publicSubmissions: ISubmissionResponseModel[];
        unprocessedSubmissions: ISubmissionResponseModel[];
        pendingSubmissions: ISubmissionResponseModel[];
        userByContestSubmissions: ISubmissionResponseModel[];
        userSubmissionUrlParams?: IPage;
        submissionsByContestParams?: IGetSubmissionsByContestIdParams;
    };
    actions : {
        loadTotalSubmissionsCount: () => Promise<void>;
        loadTotalUnprocessedSubmissionsCount: () => Promise<void>;
        initiatePublicSubmissionsQuery: () => void;
        initiateUnprocessedSubmissionsQuery: () => void;
        initiatePendingSubmissionsQuery: () => void;
        initiateUserSubmissionsQuery: () => void;
        initiateSubmissionsByContestQuery: () => void;
    };
}

const defaultState = {
    state: {
        publicSubmissions: [] as ISubmissionResponseModel[],
        userSubmissions: [] as ISubmissionResponseModel[],
        userByContestSubmissions: [] as ISubmissionResponseModel[],
        userSubmissionUrlParams: { page: 1 },
        submissionsByContestParams: { page: 1, contestId: '' },
    },
};

const PublicSubmissionsContext = createContext<IPublicSubmissionsContext>(defaultState as IPublicSubmissionsContext);

type IPublicSubmissionsProviderProps = IHaveChildrenProps

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
    const { state: { params: urlParams } } = useUrlParams();
    const [ getPublicSubmissionsUrlParams, setPublicSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ getUnprocessedSubmissionsUrlParams, setUnprocessedSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [
        getPendingSubmissionsUrlParams,
        setPendingSubmissionsUrlParams,
    ] = useState<IGetSubmissionsUrlParams>();
    const [ publicSubmissions, setPublicSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ userSubmissions, setUserSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.userSubmissions);
    const [
        userByContestSubmissions,
        setUserByContestSubmissions,
    ] = useState<ISubmissionResponseModel[]>(defaultState.state.userByContestSubmissions);
    const [
        getUserSubmissionsUrlParams,
        setUserSubmissionsUrlParams,
    ] = useState<IGetSubmissionsUrlParams | null>(defaultState.state.userSubmissionUrlParams);
    const [
        getSubmissionsByContestIdParams,
        setGetSubmissionsByContestIdParams,
    ] = useState<IGetSubmissionsByContestIdParams | null>(defaultState.state.submissionsByContestParams);
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
        isLoading: userSubmissionsLoading,
        get: getUserSubmissions,
        data: userSubmissionsData,
    } = useHttp<
        IGetSubmissionsUrlParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getUserSubmissionsUrl,
            parameters: getUserSubmissionsUrlParams,
        });

    const {
        get: getUserByContestSubmissions,
        data: userByContestSubmissionsData,
    } = useHttp<
        IGetSubmissionsByContestIdParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getSubmissionsByContestIdUrl,
            parameters: getSubmissionsByContestIdParams,
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

    const initiateUserSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage && currentPage !== 1) {
                return;
            }

            setUserSubmissionsUrlParams({ page: currentPage });
        },
        [ currentPage, previousPage ],
    );

    const initiateSubmissionsByContestQuery = useCallback(() => {
        const contestIdParam = urlParams.find((urlParam) => urlParam.key === 'contestid')?.value;
        const queryParams = {
            contestId: contestIdParam,
            page: currentPage,
        };
        if (!contestIdParam) {
            return;
        }

        setGetSubmissionsByContestIdParams(queryParams);
    }, [ currentPage, urlParams ]);

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

    useEffect(() => {
        if (isNil(userSubmissionsData) || isEmpty(userSubmissionsData)) {
            return;
        }

        proccessSubmissionsQueryResult(userSubmissionsData, setUserSubmissions);
    }, [ proccessSubmissionsQueryResult, userSubmissionsData ]);

    useEffect(() => {
        if (isNil(userByContestSubmissionsData) || isEmpty(userByContestSubmissionsData)) {
            return;
        }

        proccessSubmissionsQueryResult(userByContestSubmissionsData, setUserByContestSubmissions);
    }, [ userByContestSubmissionsData, setUserByContestSubmissions, proccessSubmissionsQueryResult ]);

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
                await getSubmissions();
            })();
        },
        [ getPublicSubmissionsUrlParams, getSubmissions ],
    );

    useEffect(() => {
        (async () => {
            await getUserSubmissions();
        })();
    }, [ getUserSubmissions ]);

    useEffect(() => {
        (async () => {
            await getUserByContestSubmissions();
        })();
    }, [ getUserByContestSubmissions ]);

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
                userSubmissions,
                userByContestSubmissions,
                userSubmissionsLoading,
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
                initiateUserSubmissionsQuery,
                initiateSubmissionsByContestQuery,
            },
        }),
        [
            userSubmissions,
            userByContestSubmissions,
            userSubmissionsLoading,
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
            initiateUserSubmissionsQuery,
            initiateSubmissionsByContestQuery,
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
