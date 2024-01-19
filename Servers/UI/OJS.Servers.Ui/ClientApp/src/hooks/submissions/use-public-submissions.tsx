import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IKeyValuePair } from '../../common/common-types';
import { IPage, IPagedResultType, ISubmissionResponseModel } from '../../common/types';
import {
    IGetSubmissionsByContestIdParams,
    IGetSubmissionsUrlParams,
    IGetUserSubmissionsUrlParams,
    IUserInfoUrlParams,
} from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';
import isNilOrEmpty from '../../utils/check-utils';
import {
    getAllParticipationsForUserUrl,
    getSubmissionsByContestIdUrl,
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl,
    getSubmissionsUrl,
    getUserSubmissionsUrl,
} from '../../utils/urls';
import { useHttp } from '../use-http';
import { usePages } from '../use-pages';
import { IParticipationType } from '../use-participations';

enum PublicSubmissionState {
    Ready = 1,
    Processing = 2,
    Queued = 3,
}

enum SubmissionStatus {
    All = 1,
    Processing = 2,
    Pending = 3,
}

interface IPublicSubmissionsContext {
    state: {
        totalSubmissionsCount: number;
        totalUnprocessedSubmissionsCount: number;
        userSubmissions: ISubmissionResponseModel[];
        userSubmissionsLoading: boolean;
        publicSubmissions: ISubmissionResponseModel[];
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
        clearPageInformation: () => void;
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
    const [ getSubmissionsUrlParams, setSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ publicSubmissions, setPublicSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ userSubmissions, setUserSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.userSubmissions);
    const [
        userByContestSubmissions,
        setUserByContestSubmissions,
    ] = useState<ISubmissionResponseModel[]>(defaultState.state.userByContestSubmissions);
    const [
        getUserSubmissionsUrlParams,
        setUserSubmissionsUrlParams,
    ] = useState<IGetUserSubmissionsUrlParams | null>(null);
    const [
        getSubmissionsByContestIdParams,
        setGetSubmissionsByContestIdParams,
    ] = useState<IGetSubmissionsByContestIdParams | null>(defaultState.state.submissionsByContestParams);
    const [ previousPage, setPreviousPage ] = useState(0);
    const [ selectMenuItems, setSelectMenuItems ] = useState<IKeyValuePair<string>[]>(defaultState.state.menuItems);
    const [ getParticipationsForProfileUrlParam, setParticipationsForProfileUrlParam ] =
        useState<IUserInfoUrlParams | null>();

    const { internalUser: user } =
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
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
            url: getSubmissionsUrl,
            parameters: getSubmissionsUrlParams,
        });

    const {
        isLoading: userSubmissionsLoading,
        get: getUserSubmissions,
        data: userSubmissionsData,
    } = useHttp<
        IGetUserSubmissionsUrlParams,
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
        get: getUserParticipations,
        data: userParticipationsData,
    } = useHttp<IUserInfoUrlParams, IParticipationType[]>({
        url: getAllParticipationsForUserUrl,
        parameters: getParticipationsForProfileUrlParam,
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
        () => (apiTotalUnprocessedSubmissionsCount || 0) as number ?? null,
        [ apiTotalUnprocessedSubmissionsCount ],
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

            setSubmissionsUrlParams({ status: SubmissionStatus.All, page: currentPage });
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

            setSubmissionsUrlParams({ status: SubmissionStatus.Processing, page: currentPage });
            setPreviousPage(currentPage);
        },
        [ currentPage, previousPage ],
    );

    const initiatePendingSubmissionsQuery = useCallback(
        () => {
            if (currentPage === previousPage) {
                return;
            }

            setSubmissionsUrlParams({ status: SubmissionStatus.Pending, page: currentPage });
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

    const clearPageInformation = useCallback(
        () => {
            setSubmissionsUrlParams(null);
            setUserSubmissionsUrlParams(null);
            setGetSubmissionsByContestIdParams(defaultState.state.submissionsByContestParams);
            setPreviousPage(0);
        },
        [],
    );

    useEffect(
        () => {
            const mappedMenuItems = (userParticipationsData ||
            []).map((item: IParticipationType) => ({
                key: item.id.toString(),
                value: item.contestName,
            }));

            setSelectMenuItems(mappedMenuItems);
        },
        [ userParticipationsData ],
    );

    // Process results
    useEffect(
        () => {
            if (isNilOrEmpty(userSubmissionsData) || !isEmpty(getParticipationsForProfileUrlParam)) {
                return;
            }

            const { userName: username } = user;
            setParticipationsForProfileUrlParam({ username });
        },
        [ getUserParticipations, user, userSubmissionsData, getParticipationsForProfileUrlParam ],
    );

    useEffect(
        () => {
            if (isNil(getParticipationsForProfileUrlParam)) {
                return;
            }

            (async () => {
                await getUserParticipations();
            })();
        },
        [ getParticipationsForProfileUrlParam, getUserParticipations ],
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

    // Make requests
    useEffect(
        () => {
            if (isNil(getSubmissionsUrlParams)) {
                return;
            }

            (async () => {
                await getSubmissions();
            })();
        },
        [ getSubmissionsUrlParams, getSubmissions ],
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
                clearPageInformation,
            },
        }),
        [
            userSubmissions,
            userByContestSubmissions,
            userSubmissionsLoading,
            publicSubmissions,
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
            clearPageInformation,
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
    SubmissionStatus,
};
