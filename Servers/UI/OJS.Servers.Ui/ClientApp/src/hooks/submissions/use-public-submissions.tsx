import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IPagedResultType, ISubmissionResponseModel } from '../../common/types';
import { IGetSubmissionsUrlParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';
import {
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl,
    getSubmissionsUrl,
} from '../../utils/urls';
import { useHttp } from '../use-http';
import { usePages } from '../use-pages';

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
        areSubmissionsLoading : boolean;
        totalSubmissionsCount: number;
        totalUnprocessedSubmissionsCount: number;
        publicSubmissions: ISubmissionResponseModel[];
    };
    actions : {
        loadTotalSubmissionsCount: () => Promise<void>;
        loadTotalUnprocessedSubmissionsCount: () => Promise<void>;
        initiatePublicSubmissionsQuery: () => void;
        initiateUnprocessedSubmissionsQuery: () => void;
        initiatePendingSubmissionsQuery: () => void;
        clearPageValues: () => void;
        clearPageInformation: () => void;
    };
}

const defaultState = {
    state: {
        publicSubmissions: [] as ISubmissionResponseModel[],
    },
};

const PublicSubmissionsContext = createContext<IPublicSubmissionsContext>(defaultState as IPublicSubmissionsContext);

type IPublicSubmissionsProviderProps = IHaveChildrenProps

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
    const [ getSubmissionsUrlParams, setSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ publicSubmissions, setPublicSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ previousPage, setPreviousPage ] = useState(0);

    const { internalUser: user } =
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const {
        state: { currentPage },
        populatePageInformation,
        clearPageValue,
    } = usePages();

    const {
        isLoading : areSubmissionsLoading,
        get: getSubmissions,
        data: publicSubmissionsData,
    } = useHttp<
        IGetSubmissionsUrlParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getSubmissionsUrl,
            parameters: getSubmissionsUrlParams,
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
            setPreviousPage(0);
        },
        [],
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
                totalSubmissionsCount,
                totalUnprocessedSubmissionsCount,
                areSubmissionsLoading,
            },
            actions: {
                loadTotalSubmissionsCount,
                loadTotalUnprocessedSubmissionsCount,
                initiatePublicSubmissionsQuery,
                initiateUnprocessedSubmissionsQuery,
                initiatePendingSubmissionsQuery,
                clearPageValues,
                clearPageInformation,
            },
        }),
        [
            publicSubmissions,
            areSubmissionsLoading,
            totalSubmissionsCount,
            totalUnprocessedSubmissionsCount,
            loadTotalSubmissionsCount,
            loadTotalUnprocessedSubmissionsCount,
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            initiatePendingSubmissionsQuery,
            clearPageValues,
            clearPageInformation,
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
