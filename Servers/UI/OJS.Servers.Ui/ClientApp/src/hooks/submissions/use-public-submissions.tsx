import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IPagedResultType, ISubmissionResponseModel } from '../../common/types';
import { IGetSubmissionsUrlParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
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
    };
    actions : {
        loadTotalSubmissionsCount: () => Promise<void>;
        loadTotalUnprocessedSubmissionsCount: () => Promise<void>;
        initiatePublicSubmissionsQuery: () => void;
        initiateUnprocessedSubmissionsQuery: () => void;
    };
}

const defaultState = { state: { publicSubmissions: [] as ISubmissionResponseModel[] } };

const PublicSubmissionsContext = createContext<IPublicSubmissionsContext>(defaultState as IPublicSubmissionsContext);

type IPublicSubmissionsProviderProps = IHaveChildrenProps

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
    const [ getPublicSubmissionsUrlParams, setPublicSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ getUnprocessedSubmissionsUrlParams, setUnprocessedSubmissionsUrlParams ] = useState<IGetSubmissionsUrlParams | null>();
    const [ publicSubmissions, setPublicSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const [ unprocessedSubmissions, setUnprocessedSubmissions ] =
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

    useEffect(
        () => {
            if (isNil(publicSubmissionsData) || isEmpty(publicSubmissionsData)) {
                return;
            }

            const publicSubmissionsResult = publicSubmissionsData as IPagedResultType<ISubmissionResponseModel>;
            const newPublicSubmissionsData = publicSubmissionsResult.items as ISubmissionResponseModel[];
            const {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            } = publicSubmissionsResult;

            const newPagesInfo = {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            };

            setPreviousPage(pageNumber);

            setPublicSubmissions(newPublicSubmissionsData);
            populatePageInformation(newPagesInfo);
        },
        [ populatePageInformation, publicSubmissionsData ],
    );

    useEffect(
        () => {
            if (isNil(unprocessedSubmissionsData) || isEmpty(unprocessedSubmissionsData)) {
                return;
            }

            const unprocessedSubmissionsResult = unprocessedSubmissionsData as IPagedResultType<ISubmissionResponseModel>;
            const newUnprocessedSubmissionsData = unprocessedSubmissionsResult.items as ISubmissionResponseModel[];
            const {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            } = unprocessedSubmissionsResult;

            const newPagesInfo = {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            };

            setPreviousPage(pageNumber);

            setUnprocessedSubmissions(newUnprocessedSubmissionsData);
            populatePageInformation(newPagesInfo);
        },
        [ populatePageInformation, unprocessedSubmissionsData ],
    );

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

    const value = useMemo(
        () => ({
            state: {
                publicSubmissions,
                unprocessedSubmissions,
                totalSubmissionsCount,
                totalUnprocessedSubmissionsCount,
            },
            actions: {
                loadTotalSubmissionsCount,
                loadTotalUnprocessedSubmissionsCount,
                initiatePublicSubmissionsQuery,
                initiateUnprocessedSubmissionsQuery,
            },
        }),
        [ publicSubmissions, unprocessedSubmissions, totalSubmissionsCount, totalUnprocessedSubmissionsCount, loadTotalSubmissionsCount,
            loadTotalUnprocessedSubmissionsCount, initiatePublicSubmissionsQuery, initiateUnprocessedSubmissionsQuery ],
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
