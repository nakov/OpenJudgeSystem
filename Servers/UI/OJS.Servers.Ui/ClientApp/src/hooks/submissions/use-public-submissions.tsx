import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IPagedResultType, IPublicSubmissionResponseModel } from '../../common/types';
import { IGetPublicSubmissionsUrlParams } from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import {
    getPublicSubmissionsUrl,
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl,
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
        publicSubmissions: IPublicSubmissionResponseModel[];
    };
    actions : {
        loadTotalSubmissionsCount: () => Promise<void>;
        loadTotalUnprocessedSubmissionsCount: () => Promise<void>;
        initiatePublicSubmissionsQuery: () => void;
    };
}

const defaultState = { state: { publicSubmissions: [] as IPublicSubmissionResponseModel[] } };

const PublicSubmissionsContext = createContext<IPublicSubmissionsContext>(defaultState as IPublicSubmissionsContext);

type IPublicSubmissionsProviderProps = IHaveChildrenProps

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
    const [ getPublicSubmissionsUrlParams, setPublicSubmissionsUrlParams ] = useState<IGetPublicSubmissionsUrlParams | null>();
    const [ publicSubmissions, setPublicSubmissions ] = useState<IPublicSubmissionResponseModel[]>(defaultState.state.publicSubmissions);
    const {
        state: { currentPage },
        populatePageInformation,
    } = usePages();

    const {
        get: getSubmissions,
        data: publicSubmissionsData,
    } = useHttp<
        IGetPublicSubmissionsUrlParams,
        IPagedResultType<IPublicSubmissionResponseModel>>({
            url: getPublicSubmissionsUrl,
            parameters: getPublicSubmissionsUrlParams,
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
            setPublicSubmissionsUrlParams({ page: currentPage });
        },
        [ currentPage ],
    );

    useEffect(
        () => {
            if (isNil(publicSubmissionsData) || isEmpty(publicSubmissionsData)) {
                return;
            }

            const publicSubmissionsResult = publicSubmissionsData as IPagedResultType<IPublicSubmissionResponseModel>;
            const newPublicSubmissionsData = publicSubmissionsResult.items as IPublicSubmissionResponseModel[];
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

            setPublicSubmissions(newPublicSubmissionsData);
            populatePageInformation(newPagesInfo);
        },
        [ populatePageInformation, publicSubmissionsData ],
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

    const value = useMemo(
        () => ({
            state: {
                publicSubmissions,
                totalSubmissionsCount,
                totalUnprocessedSubmissionsCount,
            },
            actions: {
                loadTotalSubmissionsCount,
                loadTotalUnprocessedSubmissionsCount,
                initiatePublicSubmissionsQuery,
            },
        }),
        [ publicSubmissions, totalSubmissionsCount, totalUnprocessedSubmissionsCount, loadTotalSubmissionsCount,
            loadTotalUnprocessedSubmissionsCount, initiatePublicSubmissionsQuery ],
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
    IPublicSubmissionResponseModel,
};
