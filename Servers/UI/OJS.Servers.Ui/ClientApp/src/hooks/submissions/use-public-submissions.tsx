import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IKeyValuePair } from '../../common/common-types';
import { IPage, IPagedResultType, ISubmissionResponseModel } from '../../common/types';
import { IGetSubmissionsByContestIdParams, IGetSubmissionsUrlParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
    getAllParticipationsForUserUrl,
    getPendingSubmissionsUrl,
    getPublicSubmissionsUrl,
    getSubmissionsByContestIdUrl,
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl, getUnprocessedSubmissionsUrl, getUserSubmissionsUrl,
} from '../../utils/urls';
import { useHttp } from '../use-http';
import { usePages } from '../use-pages';
import { IParticipationType } from '../use-participations';

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
        menuItems: IKeyValuePair<string>[];
    };
    actions : {
        loadTotalSubmissionsCount: () => Promise<void>;
        loadTotalUnprocessedSubmissionsCount: () => Promise<void>;
        initiatePublicSubmissionsQuery: () => void;
        initiateUnprocessedSubmissionsQuery: () => void;
        initiatePendingSubmissionsQuery: () => void;
        initiateUserSubmissionsQuery: () => void;
        initiateSubmissionsByContestQuery: (contestId: string) => void;
        clearPageValues: () => void;
    };
}

const defaultState = {
    state: {
        publicSubmissions: [] as ISubmissionResponseModel[],
        userSubmissions: [] as ISubmissionResponseModel[],
        userByContestSubmissions: [] as ISubmissionResponseModel[],
        submissionsByContestParams: { page: 1, contestId: '' },
        menuItems: [] as IKeyValuePair<string>[],
    },
};

const PublicSubmissionsContext = createContext<IPublicSubmissionsContext>(defaultState as IPublicSubmissionsContext);

type IPublicSubmissionsProviderProps = IHaveChildrenProps

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
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
    ] = useState<IGetSubmissionsUrlParams | null>(null);
    const [
        getSubmissionsByContestIdParams,
        setGetSubmissionsByContestIdParams,
    ] = useState<IGetSubmissionsByContestIdParams | null>(defaultState.state.submissionsByContestParams);
    const [ unprocessedSubmissions, setUnprocessedSubmissions ] =
        useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ pendingSubmissions, setPendingSubmissions ] =
        useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ previousPage, setPreviousPage ] = useState(0);
    const [ selectMenuItems, setSelectMenuItems ] = useState<IKeyValuePair<string>[]>(defaultState.state.menuItems);

    const {
        state: { currentPage },
        populatePageInformation,
        clearPageValue,
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
        get: getUserParticipations,
        data: userParticipationsData,
    } = useHttp<null, IParticipationType[]>({ url: getAllParticipationsForUserUrl });

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
        () => apiTotalUnprocessedSubmissionsCount as number ?? null,
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
            if (currentPage === previousPage) {
                return;
            }

            setPublicSubmissionsUrlParams({ page: currentPage });
            setPreviousPage(currentPage);
        },
        [ currentPage, previousPage ],
    );

    const initiateUserSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage) {
                return;
            }

            setUserSubmissionsUrlParams({ page: currentPage });
            setPreviousPage(currentPage);
        },
        [ currentPage, previousPage ],
    );

    const initiateSubmissionsByContestQuery = useCallback(
        (contestId: string) => {
            if (currentPage === previousPage) {
                return;
            }

            const queryParams = {
                contestId,
                page: currentPage,
            };

            setGetSubmissionsByContestIdParams(queryParams);
            setPreviousPage(currentPage);
        },
        [ currentPage, previousPage ],
    );

    const initiateUnprocessedSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage) {
                return;
            }

            setUnprocessedSubmissionsUrlParams({ page: currentPage });
            setPreviousPage(currentPage);
        },
        [ currentPage, previousPage ],
    );

    const initiatePendingSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage) {
                return;
            }

            setPendingSubmissionsUrlParams({ page: currentPage });
            setPreviousPage(currentPage);
        },
        [ currentPage, previousPage ],
    );

    const processSubmissionsQueryResult = useCallback(
        (
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

            handleSetData(newSubmissionsData);
            populatePageInformation(newPagesInfo);
        },
        [ populatePageInformation ],
    );

    useEffect(() => {
        const mappedMenuItems = (userParticipationsData ||
            []).map((item: IParticipationType) => ({
            key: item.id.toString(),
            value: item.contestName,
        }));

        setSelectMenuItems(mappedMenuItems);
    }, [ userParticipationsData ]);

    // Process results
    useEffect(
        () => {
            (async () => {
                await getUserParticipations();
            })();
        },
        [ getUserParticipations ],
    );

    useEffect(
        () => {
            if (isNil(publicSubmissionsData) || isEmpty(publicSubmissionsData)) {
                return;
            }

            processSubmissionsQueryResult(publicSubmissionsData, setPublicSubmissions);
        },
        [ populatePageInformation, processSubmissionsQueryResult, publicSubmissionsData ],
    );

    useEffect(
        () => {
            if (isNil(userSubmissionsData) || isEmpty(userSubmissionsData)) {
                return;
            }

            processSubmissionsQueryResult(userSubmissionsData, setUserSubmissions);
        },
        [ processSubmissionsQueryResult, userSubmissionsData ],
    );

    useEffect(
        () => {
            if (isNil(userByContestSubmissionsData) || isEmpty(userByContestSubmissionsData)) {
                return;
            }

            processSubmissionsQueryResult(userByContestSubmissionsData, setUserByContestSubmissions);
        },
        [ userByContestSubmissionsData, setUserByContestSubmissions, processSubmissionsQueryResult ],
    );

    useEffect(
        () => {
            if (isNil(unprocessedSubmissionsData) || isEmpty(unprocessedSubmissionsData)) {
                return;
            }

            processSubmissionsQueryResult(unprocessedSubmissionsData, setUnprocessedSubmissions);
        },
        [ populatePageInformation, processSubmissionsQueryResult, unprocessedSubmissionsData ],
    );

    useEffect(
        () => {
            if (isNil(pendingSubmissionsData) || isEmpty(pendingSubmissionsData)) {
                return;
            }

            processSubmissionsQueryResult(pendingSubmissionsData, setPendingSubmissions);
        },
        [ pendingSubmissionsData, populatePageInformation, processSubmissionsQueryResult ],
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

    useEffect(
        () => {
            if (isNil(getUserSubmissionsUrlParams)) {
                return;
            }

            (async () => {
                await getUserSubmissions();
            })();
        },
        [ getUserSubmissions, getUserSubmissionsUrlParams ],
    );

    useEffect(
        () => {
            if (isNil(getSubmissionsByContestIdParams)) {
                return;
            }

            const { contestId } = getSubmissionsByContestIdParams;

            if (isNil(contestId) || isEmpty(contestId)) {
                return;
            }

            (async () => {
                await getUserByContestSubmissions();
            })();
        },
        [ getSubmissionsByContestIdParams, getUserByContestSubmissions ],
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

    const clearPageValues = useCallback(
        () => {
            setPreviousPage(0);
            clearPageValue();
        },
        [ clearPageValue ],
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
                menuItems: selectMenuItems,
            },
            actions: {
                loadTotalSubmissionsCount,
                loadTotalUnprocessedSubmissionsCount,
                initiatePublicSubmissionsQuery,
                initiateUnprocessedSubmissionsQuery,
                initiatePendingSubmissionsQuery,
                initiateUserSubmissionsQuery,
                initiateSubmissionsByContestQuery,
                clearPageValues,
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
            clearPageValues,
            selectMenuItems,
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
